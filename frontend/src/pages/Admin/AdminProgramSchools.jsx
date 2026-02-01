import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  School,
  Search,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import programAdminService from "../../services/admin/programAdminService";

const formatNumber = (num) => {
  if (num === undefined || num === null) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
};

const AdminProgramSchools = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState(null);

  // Schools
  const [availableSchools, setAvailableSchools] = useState([]);
  const [assignedSchools, setAssignedSchools] = useState([]);

  // Selection
  const [selectedAvailable, setSelectedAvailable] = useState([]);
  const [selectedAssigned, setSelectedAssigned] = useState([]);

  // Filters
  const [availableSearch, setAvailableSearch] = useState("");
  const [assignedSearch, setAssignedSearch] = useState("");

  // Processing
  const [assigning, setAssigning] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const IMPLEMENTATION_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In progress" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
  ];

  const handleStatusChange = async (school, newStatus) => {
    const psId = school.programSchoolId || school._id;
    if (!psId || school.implementationStatus === newStatus) return;
    setUpdatingStatusId(psId);
    try {
      await programAdminService.updateSchoolStatus(programId, psId, newStatus);
      toast.success("Status updated");
      setAssignedSchools((prev) =>
        prev.map((s) =>
          (s.programSchoolId || s._id) === psId
            ? { ...s, implementationStatus: newStatus }
            : s
        )
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [programRes, availableRes, assignedRes] = await Promise.all([
        programAdminService.getProgram(programId),
        programAdminService.getAvailableSchools(programId),
        programAdminService.getAssignedSchools(programId),
      ]);

      setProgram(programRes?.data);
      setAvailableSchools(availableRes?.data || []);
      // API returns { data: schoolsArray, pagination }; data is the array, not data.schools
      setAssignedSchools(
        Array.isArray(assignedRes?.data) ? assignedRes.data : (assignedRes?.data?.schools || [])
      );
    } catch (err) {
      console.error("Failed to fetch data:", err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (programId) {
      fetchData();
    }
  }, [programId]);

  const filteredAvailable = availableSchools.filter(
    (school) =>
      school.name?.toLowerCase().includes(availableSearch.toLowerCase()) ||
      school.district?.toLowerCase().includes(availableSearch.toLowerCase())
  );

  const filteredAssigned = assignedSchools.filter(
    (school) =>
      (school.schoolName || school.school?.name || "")
        .toLowerCase()
        .includes(assignedSearch.toLowerCase()) ||
      (school.district || school.school?.district || "")
        .toLowerCase()
        .includes(assignedSearch.toLowerCase())
  );

  // Unique districts from available schools (for bulk assign by district)
  const availableDistricts = [...new Set(availableSchools.map((s) => s.district).filter(Boolean))].sort();
  const [assigningByDistrict, setAssigningByDistrict] = useState(false);
  const [selectedDistrictBulk, setSelectedDistrictBulk] = useState("");

  const handleBulkAssignByDistrict = async () => {
    if (!selectedDistrictBulk) return;
    const schoolIds = availableSchools
      .filter((s) => s.district === selectedDistrictBulk)
      .map((s) => s._id);
    if (schoolIds.length === 0) {
      toast.error("No schools found in this district");
      return;
    }
    setAssigningByDistrict(true);
    try {
      await programAdminService.assignSchools(programId, schoolIds);
      toast.success(`${schoolIds.length} school(s) assigned from ${selectedDistrictBulk}`);
      setSelectedDistrictBulk("");
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to assign schools");
    } finally {
      setAssigningByDistrict(false);
    }
  };

  const toggleAvailableSelection = (schoolId) => {
    setSelectedAvailable((prev) =>
      prev.includes(schoolId) ? prev.filter((id) => id !== schoolId) : [...prev, schoolId]
    );
  };

  const toggleAssignedSelection = (schoolId) => {
    setSelectedAssigned((prev) =>
      prev.includes(schoolId) ? prev.filter((id) => id !== schoolId) : [...prev, schoolId]
    );
  };

  const selectAllAvailable = () => {
    if (selectedAvailable.length === filteredAvailable.length) {
      setSelectedAvailable([]);
    } else {
      setSelectedAvailable(filteredAvailable.map((s) => s._id));
    }
  };

  const selectAllAssigned = () => {
    if (selectedAssigned.length === filteredAssigned.length) {
      setSelectedAssigned([]);
    } else {
      setSelectedAssigned(filteredAssigned.map((s) => s.schoolId || s._id));
    }
  };

  const handleAssign = async () => {
    if (selectedAvailable.length === 0) return;

    setAssigning(true);
    try {
      await programAdminService.assignSchools(programId, selectedAvailable);
      toast.success(`${selectedAvailable.length} school(s) assigned`);
      setSelectedAvailable([]);
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to assign schools");
    } finally {
      setAssigning(false);
    }
  };

  const handleRemove = async () => {
    if (selectedAssigned.length === 0) return;

    setRemoving(true);
    try {
      // Remove one by one
      for (const schoolId of selectedAssigned) {
        await programAdminService.removeSchool(programId, schoolId);
      }
      toast.success(`${selectedAssigned.length} school(s) removed`);
      setSelectedAssigned([]);
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove schools");
    } finally {
      setRemoving(false);
    }
  };

  // Calculate totals
  const totalAssignedStudents = assignedSchools.reduce(
    (sum, s) => sum + (s.studentsCovered || 0),
    0
  );
  const targetStudents = program?.scope?.targetStudentCount || 0;
  const progress = targetStudents > 0 ? (totalAssignedStudents / targetStudents) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Hero Section — match Super Admin Dashboard */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between flex-wrap gap-4"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/admin/programs/${programId}`)}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
                aria-label="Back to program"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                  <School className="w-10 h-10" />
                  School Assignment
                </h1>
                <p className="text-lg text-white/90">
                  {program?.name || "Program"} — assign or remove schools
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/admin/programs/${programId}`)}
                className="inline-flex items-center gap-2 rounded-xl bg-white text-indigo-600 px-5 py-2.5 text-sm font-bold shadow-lg hover:bg-gray-50 transition-colors"
              >
                Done
              </button>
              <div className="text-right hidden lg:block ml-2 pl-4 border-l border-white/30">
                <p className="text-sm text-white/80">Today&apos;s Date</p>
                <p className="text-xl font-bold">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 space-y-6">
        {/* PROGRESS BAR */}
        {targetStudents > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Student Coverage Progress</span>
              <span className="text-sm text-slate-500">
                {formatNumber(totalAssignedStudents)} / {formatNumber(targetStudents)} students
              </span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">{Math.round(progress)}% of target reached</p>
          </motion.section>
        )}

        {/* DUAL LIST */}
        <div className="grid gap-6 lg:grid-cols-[1fr,auto,1fr]">
          {/* AVAILABLE SCHOOLS */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <School className="w-7 h-7 text-indigo-600" />
                  Available Schools
                </h2>
                <span className="text-xs text-slate-500">
                  {filteredAvailable.length} school(s)
                </span>
              </div>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={availableSearch}
                  onChange={(e) => setAvailableSearch(e.target.value)}
                placeholder="Search schools..."
                className="pl-10 pr-4 py-2.5 w-full rounded-xl border-2 border-gray-100 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              </div>
              {availableDistricts.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Bulk assign by district:</span>
                  <select
                    value={selectedDistrictBulk}
                    onChange={(e) => setSelectedDistrictBulk(e.target.value)}
                    className="text-sm border-2 border-gray-100 rounded-xl px-3 py-2 bg-white min-w-[140px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select district</option>
                    {availableDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d} (
                        {availableSchools.filter((s) => s.district === d).length} schools)
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleBulkAssignByDistrict}
                    disabled={!selectedDistrictBulk || assigningByDistrict}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {assigningByDistrict ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : null}
                    Assign all
                  </button>
                </div>
              )}
            </div>

            <div className="p-2 border-b border-slate-100">
              <button
                onClick={selectAllAvailable}
                className="text-xs text-indigo-600 font-semibold hover:underline"
              >
                {selectedAvailable.length === filteredAvailable.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {filteredAvailable.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <School className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">No available schools</p>
                </div>
              ) : (
                filteredAvailable.map((school) => (
                  <label
                    key={school._id}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 border-b border-slate-50 ${
                      selectedAvailable.includes(school._id) ? "bg-indigo-50" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAvailable.includes(school._id)}
                      onChange={() => toggleAvailableSelection(school._id)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{school.name}</p>
                      <p className="text-xs text-slate-500">
                        {school.district} • {formatNumber(school.studentCount || 0)} students
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </motion.section>

          {/* ACTION BUTTONS */}
          <div className="flex lg:flex-col items-center justify-center gap-3 py-4">
            <button
              onClick={handleAssign}
              disabled={selectedAvailable.length === 0 || assigning}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold disabled:opacity-50 hover:bg-indigo-700"
            >
              {assigning ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Add
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              onClick={handleRemove}
              disabled={selectedAssigned.length === 0 || removing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-300 text-rose-600 text-sm font-semibold disabled:opacity-50 hover:bg-rose-50"
            >
              {removing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  Remove
                </>
              )}
            </button>
          </div>

          {/* ASSIGNED SCHOOLS */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Users className="w-7 h-7 text-indigo-600" />
                  Assigned Schools
                </h2>
                <span className="text-xs text-slate-500">
                  {filteredAssigned.length} school(s)
                </span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={assignedSearch}
                  onChange={(e) => setAssignedSearch(e.target.value)}
                  placeholder="Search assigned..."
                  className="pl-10 pr-4 py-2.5 w-full rounded-xl border-2 border-gray-100 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="p-2 border-b border-slate-100">
              <button
                onClick={selectAllAssigned}
                className="text-xs text-indigo-600 font-semibold hover:underline"
              >
                {selectedAssigned.length === filteredAssigned.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {filteredAssigned.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <School className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">No schools assigned</p>
                </div>
              ) : (
                filteredAssigned.map((school) => {
                  const schoolId = school.schoolId || school._id;
                  const schoolName = school.schoolName || school.school?.name || "N/A";
                  const district = school.district || school.school?.district || "";

                  return (
                    <label
                      key={schoolId}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 border-b border-slate-50 ${
                        selectedAssigned.includes(schoolId) ? "bg-rose-50" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAssigned.includes(schoolId)}
                        onChange={() => toggleAssignedSelection(schoolId)}
                        className="h-4 w-4 rounded border-slate-300 text-rose-600"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{schoolName}</p>
                        <p className="text-xs text-slate-500">
                          {district} • {formatNumber(school.studentsCovered || 0)} students
                        </p>
                      </div>
                      <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                        <select
                          value={school.implementationStatus || "pending"}
                          onChange={(e) => handleStatusChange(school, e.target.value)}
                          disabled={updatingStatusId === (school.programSchoolId || school._id)}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
                        >
                          {IMPLEMENTATION_STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {updatingStatusId === (school.programSchoolId || school._id) && (
                          <RefreshCw className="ml-1 inline-block h-3 w-3 animate-spin text-slate-400" />
                        )}
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </motion.section>
        </div>

        {/* SUMMARY */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 border-2 border-indigo-100">
                <School className="w-6 h-6 text-indigo-600" />
                <span className="text-sm font-bold text-slate-800">
                  {assignedSchools.length} Schools Assigned
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 border-2 border-purple-100">
                <Users className="w-6 h-6 text-purple-600" />
                <span className="text-sm font-bold text-slate-800">
                  {formatNumber(totalAssignedStudents)} Students Covered
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate(`/admin/programs/${programId}`)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Back to Program
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AdminProgramSchools;
