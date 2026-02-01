import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, AlertCircle, Briefcase, Loader2, Building2, FileText, MapPin, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import programAdminService from "../../services/admin/programAdminService";
import csrPartnerService from "../../services/admin/csrPartnerService";

// Indian states list
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
];

const SCHOOL_CATEGORIES = [
  { id: "government", label: "Government" },
  { id: "aided", label: "Government Aided" },
  { id: "low_income_private", label: "Low-income Private" },
];

const AdminProgramCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [partnersLoading, setPartnersLoading] = useState(true);
  const [partnersError, setPartnersError] = useState(null);
  const [csrPartners, setCsrPartners] = useState([]);
  const [errors, setErrors] = useState({});

  // Form state
  const [form, setForm] = useState({
    csrPartnerId: "",
    name: "",
    description: "",
    states: [],
    districts: [],
    schoolCategories: [],
    targetStudentCount: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchPartners = async () => {
      setPartnersLoading(true);
      setPartnersError(null);
      try {
        const res = await csrPartnerService.listPartners({ status: "approved" });
        const list = Array.isArray(res?.data) ? res.data : res?.data?.data ?? [];
        setCsrPartners(list);
      } catch (err) {
        console.error("Failed to fetch partners:", err);
        setPartnersError(err?.response?.data?.message || "Failed to load CSR partners");
        toast.error("Failed to load CSR partners");
      } finally {
        setPartnersLoading(false);
      }
    };
    fetchPartners();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is modified
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const toggleState = (state) => {
    setForm((prev) => ({
      ...prev,
      states: prev.states.includes(state)
        ? prev.states.filter((s) => s !== state)
        : [...prev.states, state],
    }));
    if (errors.states) {
      setErrors((prev) => ({ ...prev, states: null }));
    }
  };

  const toggleCategory = (categoryId) => {
    setForm((prev) => ({
      ...prev,
      schoolCategories: prev.schoolCategories.includes(categoryId)
        ? prev.schoolCategories.filter((c) => c !== categoryId)
        : [...prev.schoolCategories, categoryId],
    }));
    if (errors.schoolCategories) {
      setErrors((prev) => ({ ...prev, schoolCategories: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.csrPartnerId) {
      newErrors.csrPartnerId = "Please select a CSR partner";
    }
    if (!form.name.trim()) {
      newErrors.name = "Program name is required";
    }
    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (form.states.length === 0) {
      newErrors.states = "Select at least one state";
    }
    if (form.schoolCategories.length === 0) {
      newErrors.schoolCategories = "Select at least one school category";
    }
    if (!form.startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!form.endDate) {
      newErrors.endDate = "End date is required";
    }
    if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);
    try {
      const programData = {
        csrPartnerId: form.csrPartnerId,
        name: form.name.trim(),
        description: form.description.trim(),
        scope: {
          geography: {
            states: form.states,
            districts: form.districts,
          },
          schoolCategory: form.schoolCategories,
          targetStudentCount: form.targetStudentCount
            ? parseInt(form.targetStudentCount, 10)
            : 0,
        },
        duration: {
          startDate: form.startDate,
          endDate: form.endDate,
        },
      };

      const res = await programAdminService.createProgram(programData);
      const createdId = res?.data?._id ?? res?._id;
      toast.success("Program created successfully");
      navigate(createdId ? `/admin/programs/${createdId}` : "/admin/programs");
    } catch (err) {
      console.error("Failed to create program:", err);
      const msg = err?.response?.data?.message || "Failed to create program";
      toast.error(msg);
      if (err?.response?.data?.errors && typeof err.response.data.errors === "object") {
        setErrors((prev) => ({ ...prev, ...err.response.data.errors }));
      }
    } finally {
      setLoading(false);
    }
  };

  if (partnersError && csrPartners.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8 max-w-md w-full text-center"
        >
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">Unable to load CSR partners</h2>
          <p className="text-sm text-slate-600 mb-6">{partnersError}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/admin/programs")}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 text-slate-700 px-4 py-2.5 text-sm font-semibold hover:bg-slate-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Programs
            </button>
          </div>
        </motion.div>
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
                onClick={() => navigate("/admin/programs")}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
                aria-label="Back to programs"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                  <Plus className="w-10 h-10" />
                  Create Program
                </h1>
                <p className="text-lg text-white/90">
                  Add a new CSR program and set scope, duration, and school categories
                </p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
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
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CSR PARTNER SELECTION */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 space-y-4"
          >
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Building2 className="w-7 h-7 text-indigo-600" />
              CSR Partner
            </h2>

            <div>
              <label className="text-xs uppercase tracking-wide text-slate-500 font-medium">
                Select CSR Partner <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.csrPartnerId}
                onChange={(e) => handleChange("csrPartnerId", e.target.value)}
                disabled={partnersLoading}
                className={`mt-2 w-full rounded-xl border-2 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.csrPartnerId ? "border-rose-300 bg-rose-50/50" : "border-gray-100 bg-white"
                } disabled:opacity-70 disabled:cursor-wait`}
              >
                <option value="">
                  {partnersLoading ? "Loading partners..." : "Choose a partner..."}
                </option>
                {csrPartners.map((partner) => (
                  <option key={partner._id} value={partner._id}>
                    {partner.companyName ?? "—"}
                  </option>
                ))}
              </select>
              {errors.csrPartnerId && (
                <p className="mt-1 text-xs text-rose-500">{errors.csrPartnerId}</p>
              )}
            </div>
          </motion.section>

          {/* PROGRAM INFORMATION */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 space-y-4"
          >
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-7 h-7 text-indigo-600" />
              Program Information
            </h2>

            <div>
              <label className="text-xs uppercase tracking-wide text-slate-500 font-medium">
                Program Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Financial Literacy for Rural Students 2026"
                className={`mt-2 w-full rounded-xl border-2 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.name ? "border-rose-300 bg-rose-50/50" : "border-gray-100 bg-white"
                }`}
              />
              {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-slate-500 font-medium">
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Brief description of the program objectives..."
                rows={3}
                maxLength={500}
                className={`mt-2 w-full rounded-xl border-2 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.description ? "border-rose-300 bg-rose-50/50" : "border-gray-100 bg-white"
                }`}
              />
              <p className="mt-1 text-xs text-slate-400">{form.description.length}/500</p>
              {errors.description && (
                <p className="mt-1 text-xs text-rose-500">{errors.description}</p>
              )}
            </div>
          </motion.section>

          {/* SCOPE */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 space-y-4"
          >
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <MapPin className="w-7 h-7 text-indigo-600" />
              Scope
            </h2>

            {/* States */}
            <div>
              <label className="text-xs uppercase tracking-wide text-slate-500 font-medium">
                States <span className="text-rose-500">*</span>
              </label>
              <div className="mt-3 flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border-2 border-gray-100 rounded-xl bg-slate-50/50">
                {INDIAN_STATES.map((state) => (
                  <button
                    key={state}
                    type="button"
                    onClick={() => toggleState(state)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      form.states.includes(state)
                        ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                        : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
              {errors.states && <p className="mt-1 text-xs text-rose-500">{errors.states}</p>}
              {form.states.length > 0 && (
                <p className="mt-2 text-xs text-slate-500">
                  Selected: {form.states.join(", ")}
                </p>
              )}
            </div>

            {/* Districts (optional text input) */}
            <div>
              <label className="text-xs uppercase tracking-wide text-slate-500 font-medium">
                Districts (optional)
              </label>
              <input
                type="text"
                value={form.districts.join(", ")}
                onChange={(e) =>
                  handleChange(
                    "districts",
                    e.target.value.split(",").map((d) => d.trim()).filter(Boolean)
                  )
                }
                placeholder="Enter districts separated by commas..."
                className="mt-2 w-full rounded-xl border-2 border-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
              <p className="mt-1 text-xs text-slate-400">
                Leave empty to include all districts in selected states
              </p>
            </div>

            {/* School Categories */}
            <div>
              <label className="text-xs uppercase tracking-wide text-slate-500 font-medium">
                School Categories <span className="text-rose-500">*</span>
              </label>
              <div className="mt-3 flex flex-wrap gap-3">
                {SCHOOL_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      form.schoolCategories.includes(cat.id)
                        ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-300"
                        : "bg-slate-50 text-slate-600 border-2 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              {errors.schoolCategories && (
                <p className="mt-1 text-xs text-rose-500">{errors.schoolCategories}</p>
              )}
            </div>

            {/* Target Student Count */}
            <div>
              <label className="text-xs uppercase tracking-wide text-slate-500 font-medium">
                Target Student Count (optional)
              </label>
              <input
                type="number"
                value={form.targetStudentCount}
                onChange={(e) => handleChange("targetStudentCount", e.target.value)}
                placeholder="e.g., 10000"
                min="0"
                className="mt-2 w-full rounded-xl border-2 border-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
            </div>
          </motion.section>

          {/* DURATION */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 space-y-4"
          >
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Calendar className="w-7 h-7 text-indigo-600" />
              Duration
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-wide text-slate-500 font-medium">
                  Start Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  className={`mt-2 w-full rounded-xl border-2 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.startDate ? "border-rose-300 bg-rose-50/50" : "border-gray-100 bg-white"
                  }`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-xs text-rose-500">{errors.startDate}</p>
                )}
              </div>

              <div>
                <label className="text-xs uppercase tracking-wide text-slate-500 font-medium">
                  End Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  className={`mt-2 w-full rounded-xl border-2 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.endDate ? "border-rose-300 bg-rose-50/50" : "border-gray-100 bg-white"
                  }`}
                />
                {errors.endDate && <p className="mt-1 text-xs text-rose-500">{errors.endDate}</p>}
              </div>
            </div>
          </motion.section>

          {/* ACTIONS */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              type="button"
              onClick={() => navigate("/admin/programs")}
              className="flex-1 px-6 py-3.5 rounded-xl border-2 border-gray-100 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-indigo-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || partnersLoading}
              className="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create Program
                </>
              )}
            </button>
          </motion.section>
        </form>
      </div>
    </div>
  );
};

export default AdminProgramCreate;
