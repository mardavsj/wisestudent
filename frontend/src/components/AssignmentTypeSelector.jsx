import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  FileText,
  ClipboardList, 
  GraduationCap, 
  Briefcase,
  Clock,
  Users,
  CheckCircle,
  TrendingUp,
  Info,
  Sparkles
} from 'lucide-react';
import api from '../utils/api';
import { useSocket } from '../context/SocketContext';

const AssignmentTypeSelector = ({ onTypeSelect, onTemplateSelect, selectedType }) => {
  const socket = useSocket()?.socket;
  const [typeStats, setTypeStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [hoveredType, setHoveredType] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch assignment type statistics
  useEffect(() => {
    fetchTypeStats();
  }, []);

  // Real-time updates when assignments are created/updated/deleted
  useEffect(() => {
    if (!socket) return;

    const handleAssignmentCreated = (data) => {
      console.log("Real-time assignment created:", data);
      // Refresh for all assignment types
      if (!data.assignment?.type || 
          data.assignment.type === 'homework' || 
          data.assignment.type === 'quiz' || 
          data.assignment.type === 'test' ||
          data.assignment.type === 'classwork' ||
          data.assignment.type === 'project') {
        fetchTypeStats(true); // Show updating indicator
      }
    };

    const handleAssignmentUpdated = (data) => {
      console.log("Real-time assignment updated:", data);
      if (!data.assignment?.type || 
          data.assignment.type === 'homework' || 
          data.assignment.type === 'quiz' || 
          data.assignment.type === 'test' ||
          data.assignment.type === 'classwork' ||
          data.assignment.type === 'project') {
        fetchTypeStats(true);
      }
    };

    const handleAssignmentDeleted = (data) => {
      console.log("Real-time assignment deleted:", data);
      fetchTypeStats(true);
    };

    // Listen for assignment submissions (for completion stats)
    const handleAssignmentSubmitted = (data) => {
      console.log("Real-time assignment submitted:", data);
      fetchTypeStats(true);
    };

    socket.on('assignment:created', handleAssignmentCreated);
    socket.on('assignment:updated', handleAssignmentUpdated);
    socket.on('assignment:deleted', handleAssignmentDeleted);
    socket.on('assignment:submitted', handleAssignmentSubmitted);

    return () => {
      socket.off('assignment:created', handleAssignmentCreated);
      socket.off('assignment:updated', handleAssignmentUpdated);
      socket.off('assignment:deleted', handleAssignmentDeleted);
      socket.off('assignment:submitted', handleAssignmentSubmitted);
    };
  }, [socket]);

  const fetchTypeStats = async (showUpdating = false) => {
    try {
      if (showUpdating) setIsUpdating(true);
      const response = await api.get('/api/school/teacher/assignment-type-stats');
      if (response.data.success) {
        setTypeStats(response.data.stats || {});
        setLastUpdated(response.data.lastUpdated ? new Date(response.data.lastUpdated) : new Date());
      }
    } catch (error) {
      console.error('Error fetching assignment type stats:', error);
      setTypeStats({});
    } finally {
      setLoading(false);
      if (showUpdating) {
        setTimeout(() => setIsUpdating(false), 1000);
      }
    }
  };

  const assignmentTypes = [
    {
      id: 'homework',
      name: 'Homework',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      hoverColor: 'from-blue-600 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-500',
      description: 'Practice exercises and problem-solving',
      duration: '30-60 min',
      features: ['Auto-grading', 'Practice mode', 'Flexible deadlines'],
      bestFor: 'Reinforcing concepts and building skills'
    },
    {
      id: 'quiz',
      name: 'Quiz',
      icon: ClipboardList,
      color: 'from-green-500 to-emerald-500',
      hoverColor: 'from-green-600 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-500',
      description: 'Quick assessment with multiple choice questions',
      duration: '15-30 min',
      features: ['Auto-grading', 'Instant feedback', 'Quick assessment'],
      bestFor: 'Quick knowledge checks and formative assessments'
    },
    {
      id: 'test',
      name: 'Test',
      icon: FileText,
      color: 'from-red-500 to-rose-500',
      hoverColor: 'from-red-600 to-rose-600',
      bgGradient: 'from-red-50 to-rose-50',
      borderColor: 'border-red-500',
      description: 'Comprehensive evaluation with various question types',
      duration: '60-120 min',
      features: ['Auto-grading', 'Time limits', 'Comprehensive assessment'],
      bestFor: 'Formal evaluations and summative assessments'
    },
    {
      id: 'classwork',
      name: 'Classwork',
      icon: Users,
      color: 'from-purple-500 to-indigo-500',
      hoverColor: 'from-purple-600 to-indigo-600',
      bgGradient: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-500',
      description: 'Interactive activities for in-class participation',
      duration: '30-45 min',
      features: ['Real-time collaboration', 'In-class participation', 'Interactive learning'],
      bestFor: 'Engaging students during class time'
    },
    {
      id: 'project',
      name: 'Project',
      icon: Briefcase,
      color: 'from-orange-500 to-amber-500',
      hoverColor: 'from-orange-600 to-amber-600',
      bgGradient: 'from-orange-50 to-amber-50',
      borderColor: 'border-orange-500',
      description: 'Long-term research and creative assignments',
      duration: 'Multiple days',
      features: ['Research-based', 'Multi-phase delivery', 'Creative expression'],
      bestFor: 'Long-term learning and comprehensive skill development'
    }
  ];

  const handleTypeSelect = (type) => {
    onTypeSelect(type);
    // Skip template selection and go directly to blank assignment
    onTemplateSelect(null);
  };

  // Get stats for a specific type
  const getTypeStats = (typeId) => {
    return typeStats[typeId] || {
      total: 0,
      published: 0,
      pending: 0,
      completed: 0,
      recent: 0,
      totalSubmissions: 0,
      averageScore: 0,
      completionRate: 0,
      pendingGrading: 0
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Assignment Type</h3>
        <p className="text-gray-600">Select the type of assignment you want to create</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {assignmentTypes.map((type, index) => {
          const IconComponent = type.icon;
          const isSelected = selectedType === type.id;
          const stats = getTypeStats(type.id);
          const isHovered = hoveredType === type.id;
          
          // Start with Homework card - make it fully professional
          if (type.id === 'homework') {
            return (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredType(type.id)}
                onHoverEnd={() => setHoveredType(null)}
                className="relative"
              >
                <motion.button
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleTypeSelect(type.id)}
                  className={`relative w-full p-6 rounded-2xl border-2 transition-all text-left overflow-hidden group ${
                    isSelected
                      ? `bg-gradient-to-br ${type.bgGradient} ${type.borderColor} shadow-lg`
                      : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-xl'
                  }`}
                >
                  {/* Animated background gradient on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                    animate={{ opacity: isHovered ? 0.1 : 0 }}
                  />

                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3"
                    >
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>
                  )}

                  {/* Icon with animated background */}
                  <div className="relative mb-4">
                    <motion.div
                      className={`p-4 rounded-xl bg-gradient-to-r ${type.color} shadow-lg mb-3 inline-block`}
                      whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <IconComponent className="w-7 h-7 text-white" />
                    </motion.div>
                    {stats.recent > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md"
                      >
                        {stats.recent}
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h4 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
                    {type.name}
                    {isSelected && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xs font-normal text-blue-600"
                      >
                        Selected
                      </motion.span>
                    )}
                  </h4>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed min-h-[2.5rem]">
                    {type.description}
                  </p>
                  
                  {/* Duration */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{type.duration}</span>
                  </div>

                  {/* Statistics Section - Professional Design with Real-time Updates */}
                  <AnimatePresence>
                    {!loading && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200 relative"
                      >
                        {/* Real-time Update Indicator */}
                        {isUpdating && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute -top-2 right-0"
                          >
                            <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
                              />
                              <span>Updating...</span>
                            </div>
                          </motion.div>
                        )}
                        {stats.total > 0 ? (
                          <>
                            {/* Primary Stats */}
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <div className="bg-blue-50 rounded-lg p-2.5 border border-blue-100">
                                <div className="text-xs text-gray-600 mb-1 font-medium">Total</div>
                                <div className="text-xl font-bold text-blue-700">{stats.total}</div>
                              </div>
                              <div className="bg-green-50 rounded-lg p-2.5 border border-green-100">
                                <div className="text-xs text-gray-600 mb-1 font-medium">Active</div>
                                <div className="text-xl font-bold text-green-700">{stats.published}</div>
                              </div>
                            </div>

                            {/* Secondary Stats - Real-time */}
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              {stats.totalSubmissions > 0 && (
                                <div className="bg-purple-50 rounded-lg p-2 border border-purple-100">
                                  <div className="text-xs text-gray-600 mb-1 font-medium">Submissions</div>
                                  <div className="text-lg font-bold text-purple-700">{stats.totalSubmissions}</div>
                                </div>
                              )}
                              {stats.averageScore > 0 && (
                                <div className="bg-amber-50 rounded-lg p-2 border border-amber-100">
                                  <div className="text-xs text-gray-600 mb-1 font-medium">Avg Score</div>
                                  <div className="text-lg font-bold text-amber-700">{stats.averageScore}%</div>
                                </div>
                              )}
                            </div>

                            {/* Completion Rate & Pending Grading */}
                            {(stats.completionRate > 0 || stats.pendingGrading > 0) && (
                              <div className="grid grid-cols-2 gap-2 mb-2">
                                {stats.completionRate > 0 && (
                                  <div className="bg-indigo-50 rounded-lg p-2 border border-indigo-100">
                                    <div className="text-xs text-gray-600 mb-1 font-medium">Completion</div>
                                    <div className="text-lg font-bold text-indigo-700">{stats.completionRate}%</div>
                                  </div>
                                )}
                                {stats.pendingGrading > 0 && (
                                  <motion.div
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="bg-red-50 rounded-lg p-2 border border-red-200"
                                  >
                                    <div className="text-xs text-gray-600 mb-1 font-medium">Pending</div>
                                    <div className="text-lg font-bold text-red-700">{stats.pendingGrading}</div>
                                  </motion.div>
                                )}
                              </div>
                            )}

                            {/* Recent Activity Indicator */}
                            {stats.recent > 0 && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-lg"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>{stats.recent} created this week</span>
                              </motion.div>
                            )}
                          </>
                        ) : (
                          <div className="text-center py-3 text-gray-500 text-sm">
                            <p className="font-medium">No homework assignments yet</p>
                            <p className="text-xs mt-1">Create your first one to see stats</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Features tooltip on hover */}
                  <AnimatePresence>
                    {isHovered && type.features && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-10 left-0 right-0 -bottom-2 bg-white rounded-lg shadow-2xl border border-gray-200 p-3 mt-2"
                      >
                        <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          Key Features
                        </div>
                        <ul className="space-y-1">
                          {type.features.map((feature, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500 italic">
                          {type.bestFor}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Shine effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                    animate={{
                      x: isHovered ? ['-100%', '200%'] : '-100%',
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: isHovered ? Infinity : 0,
                      repeatDelay: 1
                    }}
                  />
                </motion.button>
              </motion.div>
            );
          }
          
          // Quiz card - fully professional
          if (type.id === 'quiz') {
            return (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredType(type.id)}
                onHoverEnd={() => setHoveredType(null)}
                className="relative"
              >
                <motion.button
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleTypeSelect(type.id)}
                  className={`relative w-full p-6 rounded-2xl border-2 transition-all text-left overflow-hidden group ${
                    isSelected
                      ? `bg-gradient-to-br ${type.bgGradient} ${type.borderColor} shadow-lg`
                      : 'bg-white border-gray-200 hover:border-green-400 hover:shadow-xl'
                  }`}
                >
                  {/* Animated background gradient on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                    animate={{ opacity: isHovered ? 0.1 : 0 }}
                  />

                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3"
                    >
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>
                  )}

                  {/* Icon with animated background */}
                  <div className="relative mb-4">
                    <motion.div
                      className={`p-4 rounded-xl bg-gradient-to-r ${type.color} shadow-lg mb-3 inline-block`}
                      whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <IconComponent className="w-7 h-7 text-white" />
                    </motion.div>
                    {stats.recent > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md"
                      >
                        {stats.recent}
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h4 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
                    {type.name}
                    {isSelected && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xs font-normal text-green-600"
                      >
                        Selected
                      </motion.span>
                    )}
                  </h4>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed min-h-[2.5rem]">
                    {type.description}
                  </p>
                  
                  {/* Duration */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{type.duration}</span>
                  </div>

                  {/* Statistics Section - Professional Design with Real-time Updates */}
                  <AnimatePresence>
                    {!loading && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200 relative"
                      >
                        {/* Real-time Update Indicator */}
                        {isUpdating && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute -top-2 right-0"
                          >
                            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
                              />
                              <span>Updating...</span>
                            </div>
                          </motion.div>
                        )}

                        {stats.total > 0 ? (
                          <>
                            {/* Primary Stats */}
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <div className="bg-green-50 rounded-lg p-2.5 border border-green-100">
                                <div className="text-xs text-gray-600 mb-1 font-medium">Total</div>
                                <div className="text-xl font-bold text-green-700">{stats.total}</div>
                              </div>
                              <div className="bg-emerald-50 rounded-lg p-2.5 border border-emerald-100">
                                <div className="text-xs text-gray-600 mb-1 font-medium">Active</div>
                                <div className="text-xl font-bold text-emerald-700">{stats.published}</div>
                              </div>
                            </div>

                            {/* Secondary Stats - Real-time */}
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              {stats.totalSubmissions > 0 && (
                                <div className="bg-purple-50 rounded-lg p-2 border border-purple-100">
                                  <div className="text-xs text-gray-600 mb-1 font-medium">Submissions</div>
                                  <div className="text-lg font-bold text-purple-700">{stats.totalSubmissions}</div>
                                </div>
                              )}
                              {stats.averageScore > 0 && (
                                <div className="bg-amber-50 rounded-lg p-2 border border-amber-100">
                                  <div className="text-xs text-gray-600 mb-1 font-medium">Avg Score</div>
                                  <div className="text-lg font-bold text-amber-700">{stats.averageScore}%</div>
                                </div>
                              )}
                            </div>

                            {/* Completion Rate & Pending Grading */}
                            {(stats.completionRate > 0 || stats.pendingGrading > 0) && (
                              <div className="grid grid-cols-2 gap-2 mb-2">
                                {stats.completionRate > 0 && (
                                  <div className="bg-indigo-50 rounded-lg p-2 border border-indigo-100">
                                    <div className="text-xs text-gray-600 mb-1 font-medium">Completion</div>
                                    <div className="text-lg font-bold text-indigo-700">{stats.completionRate}%</div>
                                  </div>
                                )}
                                {stats.pendingGrading > 0 && (
                                  <motion.div
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="bg-red-50 rounded-lg p-2 border border-red-200"
                                  >
                                    <div className="text-xs text-gray-600 mb-1 font-medium">Pending</div>
                                    <div className="text-lg font-bold text-red-700">{stats.pendingGrading}</div>
                                  </motion.div>
                                )}
                              </div>
                            )}

                            {/* Recent Activity Indicator */}
                            {stats.recent > 0 && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-2 flex items-center gap-1.5 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-lg"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>{stats.recent} created this week</span>
                              </motion.div>
                            )}
                          </>
                        ) : (
                          <div className="text-center py-3 text-gray-500 text-sm">
                            <p className="font-medium">No quiz assignments yet</p>
                            <p className="text-xs mt-1">Create your first one to see stats</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Features tooltip on hover */}
                  <AnimatePresence>
                    {isHovered && type.features && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-10 left-0 right-0 -bottom-2 bg-white rounded-lg shadow-2xl border border-gray-200 p-3 mt-2"
                      >
                        <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          Key Features
                        </div>
                        <ul className="space-y-1">
                          {type.features.map((feature, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500 italic">
                          {type.bestFor}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Shine effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                    animate={{
                      x: isHovered ? ['-100%', '200%'] : '-100%',
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: isHovered ? Infinity : 0,
                      repeatDelay: 1
                    }}
                  />
                </motion.button>
              </motion.div>
            );
          }
          
          // Test card - fully professional
          if (type.id === 'test') {
            return (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredType(type.id)}
                onHoverEnd={() => setHoveredType(null)}
                className="relative"
              >
                <motion.button
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleTypeSelect(type.id)}
                  className={`relative w-full p-6 rounded-2xl border-2 transition-all text-left overflow-hidden group ${
                    isSelected
                      ? `bg-gradient-to-br ${type.bgGradient} ${type.borderColor} shadow-lg`
                      : 'bg-white border-gray-200 hover:border-red-400 hover:shadow-xl'
                  }`}
                >
                  {/* Animated background gradient on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                    animate={{ opacity: isHovered ? 0.1 : 0 }}
                  />

                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3"
                    >
                      <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>
                  )}

                  {/* Icon with animated background */}
                  <div className="relative mb-4">
                    <motion.div
                      className={`p-4 rounded-xl bg-gradient-to-r ${type.color} shadow-lg mb-3 inline-block`}
                      whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <IconComponent className="w-7 h-7 text-white" />
                    </motion.div>
                    {stats.recent > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md"
                      >
                        {stats.recent}
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h4 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
                    {type.name}
                    {isSelected && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xs font-normal text-red-600"
                      >
                        Selected
                      </motion.span>
                    )}
                  </h4>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed min-h-[2.5rem]">
                    {type.description}
                  </p>
                  
                  {/* Duration */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{type.duration}</span>
                  </div>

                  {/* Statistics Section - Professional Design with Real-time Updates */}
                  <AnimatePresence>
                    {!loading && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200 relative"
                      >
                        {/* Real-time Update Indicator */}
                        {isUpdating && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute -top-2 right-0"
                          >
                            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
                              />
                              <span>Updating...</span>
                            </div>
                          </motion.div>
                        )}

                        {stats.total > 0 ? (
                          <>
                            {/* Primary Stats */}
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <div className="bg-red-50 rounded-lg p-2.5 border border-red-100">
                                <div className="text-xs text-gray-600 mb-1 font-medium">Total</div>
                                <div className="text-xl font-bold text-red-700">{stats.total}</div>
                              </div>
                              <div className="bg-rose-50 rounded-lg p-2.5 border border-rose-100">
                                <div className="text-xs text-gray-600 mb-1 font-medium">Active</div>
                                <div className="text-xl font-bold text-rose-700">{stats.published}</div>
                              </div>
                            </div>

                            {/* Secondary Stats - Real-time */}
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              {stats.totalSubmissions > 0 && (
                                <div className="bg-purple-50 rounded-lg p-2 border border-purple-100">
                                  <div className="text-xs text-gray-600 mb-1 font-medium">Submissions</div>
                                  <div className="text-lg font-bold text-purple-700">{stats.totalSubmissions}</div>
                                </div>
                              )}
                              {stats.averageScore > 0 && (
                                <div className="bg-amber-50 rounded-lg p-2 border border-amber-100">
                                  <div className="text-xs text-gray-600 mb-1 font-medium">Avg Score</div>
                                  <div className="text-lg font-bold text-amber-700">{stats.averageScore}%</div>
                                </div>
                              )}
                            </div>

                            {/* Completion Rate & Pending Grading */}
                            {(stats.completionRate > 0 || stats.pendingGrading > 0) && (
                              <div className="grid grid-cols-2 gap-2 mb-2">
                                {stats.completionRate > 0 && (
                                  <div className="bg-indigo-50 rounded-lg p-2 border border-indigo-100">
                                    <div className="text-xs text-gray-600 mb-1 font-medium">Completion</div>
                                    <div className="text-lg font-bold text-indigo-700">{stats.completionRate}%</div>
                                  </div>
                                )}
                                {stats.pendingGrading > 0 && (
                                  <motion.div
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="bg-red-50 rounded-lg p-2 border border-red-200"
                                  >
                                    <div className="text-xs text-gray-600 mb-1 font-medium">Pending</div>
                                    <div className="text-lg font-bold text-red-700">{stats.pendingGrading}</div>
                                  </motion.div>
                                )}
                              </div>
                            )}

                            {/* Recent Activity Indicator */}
                            {stats.recent > 0 && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-2 flex items-center gap-1.5 text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-lg"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>{stats.recent} created this week</span>
                              </motion.div>
                            )}
                          </>
                        ) : (
                          <div className="text-center py-3 text-gray-500 text-sm">
                            <p className="font-medium">No test assignments yet</p>
                            <p className="text-xs mt-1">Create your first one to see stats</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Features tooltip on hover */}
                  <AnimatePresence>
                    {isHovered && type.features && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-10 left-0 right-0 -bottom-2 bg-white rounded-lg shadow-2xl border border-gray-200 p-3 mt-2"
                      >
                        <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          Key Features
                        </div>
                        <ul className="space-y-1">
                          {type.features.map((feature, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500 italic">
                          {type.bestFor}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Shine effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                    animate={{
                      x: isHovered ? ['-100%', '200%'] : '-100%',
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: isHovered ? Infinity : 0,
                      repeatDelay: 1
                    }}
                  />
                </motion.button>
              </motion.div>
            );
          }
          
          // Classwork card - fully professional
          if (type.id === 'classwork') {
            return (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredType(type.id)}
                onHoverEnd={() => setHoveredType(null)}
                className="relative"
              >
                <motion.button
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleTypeSelect(type.id)}
                  className={`relative w-full p-6 rounded-2xl border-2 transition-all text-left overflow-hidden group ${
                    isSelected
                      ? `bg-gradient-to-br ${type.bgGradient} ${type.borderColor} shadow-lg`
                      : 'bg-white border-gray-200 hover:border-purple-400 hover:shadow-xl'
                  }`}
                >
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                    animate={{ opacity: isHovered ? 0.1 : 0 }}
                  />
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3"
                    >
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>
                  )}
                  <div className="relative mb-4">
                    <motion.div
                      className={`p-4 rounded-xl bg-gradient-to-r ${type.color} shadow-lg mb-3 inline-block`}
                      whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <IconComponent className="w-7 h-7 text-white" />
                    </motion.div>
                    {stats.recent > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md"
                      >
                        {stats.recent}
                      </motion.div>
                    )}
                  </div>
                  <h4 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
                    {type.name}
                    {isSelected && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xs font-normal text-purple-600"
                      >
                        Selected
                      </motion.span>
                    )}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed min-h-[2.5rem]">
                    {type.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{type.duration}</span>
                  </div>
                  <AnimatePresence>
                    {!loading && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200 relative"
                      >
                        {isUpdating && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute -top-2 right-0"
                          >
                            <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
                              />
                              <span>Updating...</span>
                            </div>
                          </motion.div>
                        )}
                        {stats.total > 0 ? (
                          <>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <div className="bg-purple-50 rounded-lg p-2.5 border border-purple-100">
                                <div className="text-xs text-gray-600 mb-1 font-medium">Total</div>
                                <div className="text-xl font-bold text-purple-700">{stats.total}</div>
                              </div>
                              <div className="bg-indigo-50 rounded-lg p-2.5 border border-indigo-100">
                                <div className="text-xs text-gray-600 mb-1 font-medium">Active</div>
                                <div className="text-xl font-bold text-indigo-700">{stats.published}</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              {stats.totalSubmissions > 0 && (
                                <div className="bg-purple-50 rounded-lg p-2 border border-purple-100">
                                  <div className="text-xs text-gray-600 mb-1 font-medium">Submissions</div>
                                  <div className="text-lg font-bold text-purple-700">{stats.totalSubmissions}</div>
                                </div>
                              )}
                              {stats.averageScore > 0 && (
                                <div className="bg-amber-50 rounded-lg p-2 border border-amber-100">
                                  <div className="text-xs text-gray-600 mb-1 font-medium">Avg Score</div>
                                  <div className="text-lg font-bold text-amber-700">{stats.averageScore}%</div>
                                </div>
                              )}
                            </div>
                            {(stats.completionRate > 0 || stats.pendingGrading > 0) && (
                              <div className="grid grid-cols-2 gap-2 mb-2">
                                {stats.completionRate > 0 && (
                                  <div className="bg-indigo-50 rounded-lg p-2 border border-indigo-100">
                                    <div className="text-xs text-gray-600 mb-1 font-medium">Completion</div>
                                    <div className="text-lg font-bold text-indigo-700">{stats.completionRate}%</div>
                                  </div>
                                )}
                                {stats.pendingGrading > 0 && (
                                  <motion.div
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="bg-red-50 rounded-lg p-2 border border-red-200"
                                  >
                                    <div className="text-xs text-gray-600 mb-1 font-medium">Pending</div>
                                    <div className="text-lg font-bold text-red-700">{stats.pendingGrading}</div>
                                  </motion.div>
                                )}
                              </div>
                            )}
                            {stats.recent > 0 && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-2 flex items-center gap-1.5 text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-lg"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>{stats.recent} created this week</span>
                              </motion.div>
                            )}
                          </>
                        ) : (
                          <div className="text-center py-3 text-gray-500 text-sm">
                            <p className="font-medium">No classwork assignments yet</p>
                            <p className="text-xs mt-1">Create your first one to see stats</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {isHovered && type.features && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-10 left-0 right-0 -bottom-2 bg-white rounded-lg shadow-2xl border border-gray-200 p-3 mt-2"
                      >
                        <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          Key Features
                        </div>
                        <ul className="space-y-1">
                          {type.features.map((feature, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500 italic">
                          {type.bestFor}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                    animate={{
                      x: isHovered ? ['-100%', '200%'] : '-100%',
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: isHovered ? Infinity : 0,
                      repeatDelay: 1
                    }}
                  />
                </motion.button>
              </motion.div>
            );
          }
          
          // Project card - fully professional
          if (type.id === 'project') {
            return (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredType(type.id)}
                onHoverEnd={() => setHoveredType(null)}
                className="relative"
              >
                <motion.button
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleTypeSelect(type.id)}
                  className={`relative w-full p-6 rounded-2xl border-2 transition-all text-left overflow-hidden group ${
                    isSelected
                      ? `bg-gradient-to-br ${type.bgGradient} ${type.borderColor} shadow-lg`
                      : 'bg-white border-gray-200 hover:border-orange-400 hover:shadow-xl'
                  }`}
                >
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                    animate={{ opacity: isHovered ? 0.1 : 0 }}
                  />
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3"
                    >
                      <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>
                  )}
                  <div className="relative mb-4">
                    <motion.div
                      className={`p-4 rounded-xl bg-gradient-to-r ${type.color} shadow-lg mb-3 inline-block`}
                      whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <IconComponent className="w-7 h-7 text-white" />
                    </motion.div>
                    {stats.recent > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md"
                      >
                        {stats.recent}
                      </motion.div>
                    )}
                  </div>
                  <h4 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
                    {type.name}
                    {isSelected && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xs font-normal text-orange-600"
                      >
                        Selected
                      </motion.span>
                    )}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed min-h-[2.5rem]">
                    {type.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{type.duration}</span>
                  </div>
                  <AnimatePresence>
                    {!loading && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200 relative"
                      >
                        {isUpdating && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute -top-2 right-0"
                          >
                            <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
                              />
                              <span>Updating...</span>
                            </div>
                          </motion.div>
                        )}
                        {stats.total > 0 ? (
                          <>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <div className="bg-orange-50 rounded-lg p-2.5 border border-orange-100">
                                <div className="text-xs text-gray-600 mb-1 font-medium">Total</div>
                                <div className="text-xl font-bold text-orange-700">{stats.total}</div>
                              </div>
                              <div className="bg-amber-50 rounded-lg p-2.5 border border-amber-100">
                                <div className="text-xs text-gray-600 mb-1 font-medium">Active</div>
                                <div className="text-xl font-bold text-amber-700">{stats.published}</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              {stats.totalSubmissions > 0 && (
                                <div className="bg-purple-50 rounded-lg p-2 border border-purple-100">
                                  <div className="text-xs text-gray-600 mb-1 font-medium">Submissions</div>
                                  <div className="text-lg font-bold text-purple-700">{stats.totalSubmissions}</div>
                                </div>
                              )}
                              {stats.averageScore > 0 && (
                                <div className="bg-amber-50 rounded-lg p-2 border border-amber-100">
                                  <div className="text-xs text-gray-600 mb-1 font-medium">Avg Score</div>
                                  <div className="text-lg font-bold text-amber-700">{stats.averageScore}%</div>
                                </div>
                              )}
                            </div>
                            {(stats.completionRate > 0 || stats.pendingGrading > 0) && (
                              <div className="grid grid-cols-2 gap-2 mb-2">
                                {stats.completionRate > 0 && (
                                  <div className="bg-indigo-50 rounded-lg p-2 border border-indigo-100">
                                    <div className="text-xs text-gray-600 mb-1 font-medium">Completion</div>
                                    <div className="text-lg font-bold text-indigo-700">{stats.completionRate}%</div>
                                  </div>
                                )}
                                {stats.pendingGrading > 0 && (
                                  <motion.div
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="bg-red-50 rounded-lg p-2 border border-red-200"
                                  >
                                    <div className="text-xs text-gray-600 mb-1 font-medium">Pending</div>
                                    <div className="text-lg font-bold text-red-700">{stats.pendingGrading}</div>
                                  </motion.div>
                                )}
                              </div>
                            )}
                            {stats.recent > 0 && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-2 flex items-center gap-1.5 text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded-lg"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>{stats.recent} created this week</span>
                              </motion.div>
                            )}
                          </>
                        ) : (
                          <div className="text-center py-3 text-gray-500 text-sm">
                            <p className="font-medium">No project assignments yet</p>
                            <p className="text-xs mt-1">Create your first one to see stats</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {isHovered && type.features && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-10 left-0 right-0 -bottom-2 bg-white rounded-lg shadow-2xl border border-gray-200 p-3 mt-2"
                      >
                        <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          Key Features
                        </div>
                        <ul className="space-y-1">
                          {type.features.map((feature, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500 italic">
                          {type.bestFor}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                    animate={{
                      x: isHovered ? ['-100%', '200%'] : '-100%',
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: isHovered ? Infinity : 0,
                      repeatDelay: 1
                    }}
                  />
                </motion.button>
              </motion.div>
            );
          }
          
          // Other cards remain as before for now
          return (
            <motion.button
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTypeSelect(type.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? `bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-500`
                  : 'bg-white border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${type.color} mb-3`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                
                <h4 className="font-bold text-gray-900 mb-2 text-sm">{type.name}</h4>
                <p className="text-xs text-gray-600 mb-2 leading-tight">{type.description}</p>
                
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{type.duration}</span>
                </div>
                
                {isSelected && (
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-2" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default AssignmentTypeSelector;
