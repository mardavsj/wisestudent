import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Users, Search, Grid, List, Eye, BookOpen, Plus, X, 
  GraduationCap, CheckCircle, Trash2, UserPlus,
  School, Calendar
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import AddClassModal from '../../components/AddClassModal';
import ClassDetailModal from '../../components/ClassDetailModal';
import AddStudentToClassModal from '../../components/AddStudentToClassModal';
import AddTeacherModal from '../../components/AddTeacherModal';

const SchoolAdminClasses = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterStream, setFilterStream] = useState('all');
  const [stats, setStats] = useState({});
  
  // Modals
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showClassDetailModal, setShowClassDetailModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const gradeOptions = useMemo(() => {
    const set = new Set();
    classes.forEach((cls) => {
      if (cls.classNumber !== undefined && cls.classNumber !== null) {
        set.add(Number(cls.classNumber));
      }
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [classes]);

  // Form states
  const [newClass, setNewClass] = useState({
    classNumber: '',
    stream: '',
    sections: [{ name: 'A', capacity: 40 }],
    academicYear: new Date().getFullYear().toString()
  });


  const streams = ['Science', 'Commerce', 'Arts'];

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterGrade !== 'all') params.append('grade', filterGrade);
      if (filterStream !== 'all') params.append('stream', filterStream);

      const [classesRes, teachersRes, studentsRes, statsRes] = await Promise.allSettled([
        api.get(`/api/school/admin/classes?${params}`),
        api.get('/api/school/admin/teachers'),
        api.get('/api/school/admin/students'),
        api.get('/api/school/admin/classes/stats')
      ]);

      if (classesRes.status === 'fulfilled') {
        setClasses(classesRes.value.data.classes || classesRes.value.data || []);
      } else {
        console.error('Error fetching classes:', classesRes.reason);
        setClasses([]);
        toast.error('Failed to load classes');
      }

      if (teachersRes.status === 'fulfilled') {
        setTeachers(teachersRes.value.data.teachers || []);
      } else {
        console.error('Error fetching teachers:', teachersRes.reason);
        setTeachers([]);
      }

      if (studentsRes.status === 'fulfilled') {
        setStudents(studentsRes.value.data.students || []);
      } else {
        console.error('Error fetching students:', studentsRes.reason);
        setStudents([]);
      }

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data || {});
      } else {
        console.error('Error fetching class stats:', statsRes.reason);
        setStats({});
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [filterGrade, filterStream]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle URL parameter to open specific class
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const openClassId = urlParams.get('openClass');
    
    if (openClassId && classes.length > 0) {
      const classToOpen = classes.find(cls => cls._id === openClassId);
      if (classToOpen) {
        handleViewClass(classToOpen);
        // Clean up URL parameter
        window.history.replaceState({}, '', '/school/admin/classes');
      }
    }
  }, [classes, location.search]);

  const handleAddClass = async (e, classData = null) => {
    e.preventDefault();
    try {
      const dataToSend = classData || newClass;
      await api.post('/api/school/admin/classes/create', dataToSend);
      toast.success('Class created successfully!');
      setShowAddClassModal(false);
      setNewClass({
        classNumber: '',
        stream: '',
        sections: [{ name: 'A', capacity: 40 }],
        academicYear: new Date().getFullYear().toString()
      });
      fetchData();
    } catch (error) {
      console.error('Error adding class:', error);
      toast.error(error.response?.data?.message || 'Failed to create class');
    }
  };

  const handleViewClass = async (classItem) => {
    try {
      const response = await api.get(`/api/school/admin/classes/${classItem._id}`);
      setSelectedClass(response.data.class);
      setShowClassDetailModal(true);
    } catch (error) {
      console.error('Error fetching class details:', error);
      toast.error('Failed to load class details');
    }
  };

  const formatAcademicYear = (value) => {
    if (!value) return 'N/A';
    const year = Number(value);
    if (Number.isFinite(year) && String(value).length === 4) {
      const nextYear = String((year + 1) % 100).padStart(2, '0');
      return `${year}-${nextYear}`;
    }
    return value;
  };

  const handleAddSection = () => {
    const nextSection = String.fromCharCode(65 + newClass.sections.length); // A, B, C...
    setNewClass(prev => ({
      ...prev,
      sections: [...prev.sections, { name: nextSection, capacity: 40 }]
    }));
  };

  const handleRemoveSection = (index) => {
    setNewClass(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };




  const handleDeleteClass = async (classId) => {
    const classItem = classes.find(cls => cls._id === classId);
    const studentCount = classItem?.totalStudents || 0;
    
    const confirmMessage = studentCount > 0 
      ? `Are you sure you want to delete this class? This will unassign ${studentCount} student(s) from the class. The students will remain in the system but will need to be reassigned to other classes.`
      : 'Are you sure you want to delete this class?';
    
    if (!window.confirm(confirmMessage)) return;
    
    try {
      const response = await api.delete(`/api/school/admin/classes/${classId}`);
      toast.success(response.data.message || 'Class deleted successfully!');
      fetchData();
    } catch (err) {
      console.error('Error deleting class:', err);
      toast.error(err.response?.data?.message || 'Failed to delete class');
    }
  };

  const handleRemoveTeacher = async (teacherId, sectionName) => {
    if (!selectedClass) return;
    
    const confirmMessage = `Are you sure you want to remove this teacher from Section ${sectionName}?`;
    if (!window.confirm(confirmMessage)) return;
    
    try {
      await api.delete(`/api/school/admin/classes/${selectedClass._id}/teachers/${teacherId}`);
      toast.success('Teacher removed from class successfully!');
      fetchData(); // Refresh data to update the class details
    } catch (error) {
      console.error('Error removing teacher:', error);
      toast.error(error.response?.data?.message || 'Failed to remove teacher');
    }
  };

  const handleRemoveStudent = async (student) => {
    if (!selectedClass) return;
    
    const studentName = typeof student === 'object' ? student.name : student;
    const confirmMessage = `Are you sure you want to remove ${studentName} from this class?`;
    if (!window.confirm(confirmMessage)) return;
    
    try {
      const studentId = typeof student === 'object' ? student._id : student;
      await api.delete(`/api/school/admin/classes/${selectedClass._id}/students/${studentId}`);
      toast.success('Student removed from class successfully!');
      fetchData(); // Refresh data to update the class details
    } catch (error) {
      console.error('Error removing student:', error);
      toast.error(error.response?.data?.message || 'Failed to remove student');
    }
  };

  const filteredClasses = classes.filter(cls => {
    const searchLower = searchTerm.toLowerCase();
    return (
      cls.classNumber?.toString().includes(searchLower) ||
      cls.stream?.toLowerCase().includes(searchLower) ||
      cls.academicYear?.includes(searchLower)
    );
  });


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <School className="w-10 h-10" />
              Class Management
            </h1>
            <p className="text-lg text-white/90">
              {filteredClasses.length} classes • {stats.totalSections || 0} sections
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <School className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Classes</p>
                <p className="text-2xl font-black text-gray-900">{stats.total || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Sections</p>
                <p className="text-2xl font-black text-gray-900">{stats.totalSections || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Students</p>
                <p className="text-2xl font-black text-gray-900">{stats.totalStudents || 0}</p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-4 mb-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-semibold"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none bg-white font-semibold"
              >
                <option value="all">All Grades</option>
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>Class {grade}</option>
                ))}
              </select>

              <select
                value={filterStream}
                onChange={(e) => setFilterStream(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none bg-white font-semibold"
              >
                <option value="all">All Streams</option>
                {streams.map(stream => (
                  <option key={stream} value={stream}>{stream}</option>
                ))}
              </select>

              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                >
                  <Grid className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                >
                  <List className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              <button
                onClick={() => setShowAddClassModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                Create Class
              </button>
            </div>
          </div>
        </motion.div>

        {/* Classes Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((classItem, idx) => (
              <motion.div
                key={classItem._id || idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl hover:border-indigo-300 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg">
                      {classItem.classNumber}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Class {classItem.classNumber}</h3>
                      {classItem.stream && (
                        <p className="text-xs text-gray-600">{classItem.stream}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteClass(classItem._id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 rounded-lg bg-blue-50">
                    <p className="text-xs text-gray-600">Sections</p>
                    <p className="text-lg font-black text-blue-600">{classItem.sections?.length || 0}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-green-50">
                    <p className="text-xs text-gray-600">Students</p>
                    <p className="text-lg font-black text-green-600">{classItem.totalStudents || 0}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-purple-50">
                    <p className="text-xs text-gray-600">Teachers</p>
                    <p className="text-lg font-black text-purple-600">
                      {classItem.sections?.filter((section) => section.classTeacher).length || 0}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Academic Year: {formatAcademicYear(classItem.academicYear)}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewClass(classItem)}
                  className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  View Details
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Class</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Stream</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Sections</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Students</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Teachers</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Academic Year</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.map((classItem, idx) => (
                  <motion.tr
                    key={classItem._id || idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="border-b border-gray-100 hover:bg-indigo-50 transition-colors"
                  >
                    <td className="py-4 px-6 font-bold text-gray-900">Class {classItem.classNumber}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900">{classItem.stream || '-'}</td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-900">{classItem.sections?.length || 0}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900">{classItem.totalStudents || 0}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-900">
                      {classItem.sections?.filter((section) => section.classTeacher).length || 0}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {formatAcademicYear(classItem.academicYear)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewClass(classItem)}
                          className="p-2 hover:bg-indigo-100 rounded-lg transition-all"
                        >
                          <Eye className="w-5 h-5 text-indigo-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteClass(classItem._id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-all"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredClasses.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-12 text-center"
          >
            <School className="w-20 h-20 mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Classes Found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first class</p>
            <button
              onClick={() => setShowAddClassModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Create Class
            </button>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AddClassModal
        showAddClassModal={showAddClassModal}
        setShowAddClassModal={setShowAddClassModal}
        newClass={newClass}
        setNewClass={setNewClass}
        handleAddClass={handleAddClass}
        handleAddSection={handleAddSection}
        handleRemoveSection={handleRemoveSection}
        streams={streams}
      />
      <ClassDetailModal
        showClassDetailModal={showClassDetailModal}
        setShowClassDetailModal={setShowClassDetailModal}
        selectedClass={selectedClass}
        teachers={teachers}
        setShowAddStudentModal={setShowAddStudentModal}
        setShowAddTeacherModal={setShowAddTeacherModal}
        onRemoveTeacher={handleRemoveTeacher}
        onRemoveStudent={handleRemoveStudent}
      />
      <AddStudentToClassModal
        showAddStudentModal={showAddStudentModal}
        setShowAddStudentModal={setShowAddStudentModal}
        selectedClass={selectedClass}
        onSuccess={fetchData}
      />
      <AddTeacherModal
        showAddTeacherModal={showAddTeacherModal}
        setShowAddTeacherModal={setShowAddTeacherModal}
        selectedClass={selectedClass}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default SchoolAdminClasses;

