import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Search, Filter, Calendar, Users, AlertCircle, Clock,
  CheckCircle, X, Star, Pin, MessageSquare, FileText, Target,
  Zap, Eye, ChevronDown, ChevronUp, Plus, Send, Save, RefreshCw
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthUtils";
import { useSocket } from "../../context/SocketContext";

const Announcements = () => {
  const { user } = useAuth();
  const socket = useSocket()?.socket;
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasSchoolChildren, setHasSchoolChildren] = useState(null); // null = checking, true/false = result
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedAnnouncements, setExpandedAnnouncements] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Modals
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  
  // Form data for creating announcements
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "general",
    priority: "normal",
    targetAudience: "all",
    targetClassNames: [],
    publishDate: "",
    expiryDate: "",
    isPinned: false
  });

  const announcementTypes = [
    { value: "general", label: "General", icon: MessageSquare, color: "blue" },
    { value: "urgent", label: "Urgent", icon: AlertCircle, color: "red" },
    { value: "event", label: "Event", icon: Calendar, color: "green" },
    { value: "holiday", label: "Holiday", icon: Star, color: "yellow" },
    { value: "exam", label: "Exam", icon: FileText, color: "purple" },
    { value: "fee", label: "Fee", icon: Target, color: "orange" },
    { value: "meeting", label: "Meeting", icon: Users, color: "indigo" }
  ];

  const priorityLevels = [
    { value: "low", label: "Low", color: "gray" },
    { value: "normal", label: "Normal", color: "blue" },
    { value: "high", label: "High", color: "orange" },
    { value: "urgent", label: "Urgent", color: "red" }
  ];

  const targetAudiences = [
    { value: "all", label: "Everyone" },
    { value: "students", label: "Students Only" },
    { value: "teachers", label: "Teachers Only" },
    { value: "parents", label: "Parents Only" },
    { value: "specific_class", label: "Specific Classes" }
  ];

  // Real-time socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewAnnouncement = (data) => {
      console.log("Real-time new announcement:", data);
      toast.success(`New announcement: ${data.title || 'Announcement'}`, { icon: '🔔' });
      fetchAnnouncements(false);
    };

    const handleAnnouncementUpdate = (data) => {
      console.log("Real-time announcement update:", data);
      toast.info("Announcement updated", { icon: '📢' });
      fetchAnnouncements(false);
    };

    socket.on('announcement:new', handleNewAnnouncement);
    socket.on('announcement:updated', handleAnnouncementUpdate);

    return () => {
      socket.off('announcement:new', handleNewAnnouncement);
      socket.off('announcement:updated', handleAnnouncementUpdate);
    };
  }, [socket]);

  // Check if parent has school children (only for regular parent role, not school_parent)
  useEffect(() => {
    const checkSchoolChildren = async () => {
      if (user?.role === "parent" && user?.role !== "school_parent") {
        try {
          const response = await api.get("/api/parent/children");
          const children = response.data?.children || [];
          const hasSchoolStudent = children.some(child => child.role === "school_student");
          setHasSchoolChildren(hasSchoolStudent);
          
          // Only fetch announcements if they have school children
          if (hasSchoolStudent) {
            fetchAnnouncements();
          } else {
            setLoading(false);
          }
        } catch (error) {
          console.error("Error checking school children:", error);
          setHasSchoolChildren(false);
          setLoading(false);
        }
      } else {
        // For school_parent, school_teacher, school_student, etc., always show
        setHasSchoolChildren(true);
        fetchAnnouncements();
      }
    };

    checkSchoolChildren();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filterType, filterPriority, user?.role]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const isModalOpen = showCreateModal || showViewModal;
    
    if (isModalOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup function
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [showCreateModal, showViewModal]);

  const fetchAnnouncements = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(filterType !== "all" && { type: filterType }),
        ...(filterPriority !== "all" && { priority: filterPriority })
      });

      let endpoint = "";
      if (user?.role === "school_student" || user?.role === "student") {
        endpoint = `/api/announcements/student?${params}`;
      } else if (user?.role === "school_teacher") {
        endpoint = `/api/announcements/teacher?${params}`;
      } else if (user?.role === "school_parent" || user?.role === "parent") {
        endpoint = `/api/announcements/parent?${params}`;
      }

      if (endpoint) {
        const response = await api.get(endpoint);
        setAnnouncements(response.data.announcements || []);
        setTotalPages(response.data.totalPages || 1);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast.error("Failed to load announcements");
      setAnnouncements([]);
      setTotalPages(1);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [currentPage, filterType, filterPriority, user?.role]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchAnnouncements(false);
      toast.success("Announcements refreshed!", { icon: '✅' });
    } catch (error) {
      console.error("Error refreshing announcements:", error);
      toast.error("Failed to refresh announcements");
    } finally {
      setRefreshing(false);
    }
  }, [fetchAnnouncements]);

  const formatTimeAgo = (date) => {
    if (!date) return "Never";
    const now = new Date();
    const then = new Date(date);
    const diff = now - then;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    return "Just now";
  };

  const markAsRead = async (announcementId) => {
    try {
      await api.patch(`/api/announcements/${user?.role === "school_student" || user?.role === "student" ? "student" : user?.role === "school_teacher" ? "teacher" : "parent"}/${announcementId}/read`);
      // Update local state to reflect read status
      setAnnouncements(prev => 
        prev.map(announcement => 
          announcement._id === announcementId 
            ? { ...announcement, isRead: true }
            : announcement
        )
      );
    } catch (error) {
      console.error("Error marking announcement as read:", error);
    }
  };

  const toggleExpanded = (announcementId) => {
    setExpandedAnnouncements(prev => {
      const newSet = new Set(prev);
      if (newSet.has(announcementId)) {
        newSet.delete(announcementId);
      } else {
        newSet.add(announcementId);
      }
      return newSet;
    });
  };

  const openViewModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowViewModal(true);
    markAsRead(announcement._id);
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/announcements", formData);
      toast.success("Announcement created successfully!");
      setShowCreateModal(false);
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      console.error("Error creating announcement:", error);
      toast.error(error.response?.data?.message || "Failed to create announcement");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      type: "general",
      priority: "normal",
      targetAudience: "all",
      targetClassNames: [],
      publishDate: "",
      expiryDate: "",
      isPinned: false
    });
  };

  const getTypeIcon = (type) => {
    const typeConfig = announcementTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.icon : MessageSquare;
  };

  const getTypeColor = (type) => {
    const typeConfig = announcementTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.color : "blue";
  };

  const getPriorityColor = (priority) => {
    const priorityConfig = priorityLevels.find(p => p.value === priority);
    return priorityConfig ? priorityConfig.color : "blue";
  };

  const filteredAnnouncements = announcements.filter(announcement =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    announcement.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleLabel = () => {
    switch (user?.role) {
      case "school_student":
      case "student":
        return "Student";
      case "school_teacher":
        return "Teacher";
      case "school_parent":
      case "parent":
        return "Parent";
      default:
        return "User";
    }
  };

  // Show loading state while checking for school children
  if (loading && hasSchoolChildren === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Show message if parent doesn't have school children
  if (user?.role === "parent" && hasSchoolChildren === false) {
    return (
      <div className="min-h-screen bg-slate-50 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm"
          >
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-6 rounded-t-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur rounded-lg">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Announcements</h1>
                  <p className="text-sm text-white/80">Stay updated with school announcements</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm mt-6 p-12 text-center"
          >
            <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">No School Children Linked</h2>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Announcements are only available when you have a child linked with a school. 
              Please link your school student's account to view school announcements.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = "/parent/children"}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Link School Child
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6"
        >
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur rounded-lg">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Announcements</h1>
                  <p className="text-sm text-white/80">
                    Stay updated with school announcements
                    {lastUpdated && (
                      <span className="ml-2 text-white/70">
                        • Last updated: {formatTimeAgo(lastUpdated)}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={refreshing || loading}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6 p-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition text-sm font-medium text-slate-700"
              >
                <Filter className="w-4 h-4" />
                Filters
                {showFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              
              {(user?.role === "school_teacher" || user?.role === "school_admin") && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Create
                </button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-slate-200"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Type
                    </label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                    >
                      <option value="all">All Types</option>
                      {announcementTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Priority
                    </label>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                    >
                      <option value="all">All Priorities</option>
                      {priorityLevels.map(priority => (
                        <option key={priority.value} value={priority.value}>{priority.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Announcements List */}
        <div className="space-y-3">
          {loading ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent mx-auto"></div>
              <p className="mt-3 text-sm text-slate-600">Loading announcements...</p>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
              <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-base font-medium text-slate-600">No announcements found</p>
              <p className="text-sm text-slate-500 mt-1">
                {searchTerm ? "Try adjusting your search" : "Check back later for updates"}
              </p>
            </div>
          ) : (
            filteredAnnouncements.map((announcement, index) => {
              const TypeIcon = getTypeIcon(announcement.type);
              const typeColor = getTypeColor(announcement.type);
              const priorityColor = getPriorityColor(announcement.priority);
              const isExpanded = expandedAnnouncements.has(announcement._id);
              
              const priorityColors = {
                low: "bg-slate-100 text-slate-700",
                normal: "bg-blue-100 text-blue-700",
                high: "bg-amber-100 text-amber-700",
                urgent: "bg-red-100 text-red-700"
              };
              
              const typeColors = {
                blue: "text-blue-600",
                red: "text-red-600",
                green: "text-emerald-600",
                yellow: "text-amber-600",
                purple: "text-indigo-600",
                orange: "text-orange-600",
                indigo: "text-indigo-600"
              };
              
              return (
                <motion.div
                  key={announcement._id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all ${
                    announcement.isPinned ? 'border-l-4 border-l-amber-400 bg-amber-50/50' : ''
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {announcement.isPinned && (
                            <Pin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          )}
                          <TypeIcon className={`w-4 h-4 ${typeColors[typeColor] || typeColors.blue} shrink-0`} />
                          <h3 className="text-base font-semibold text-slate-900 truncate">
                            {announcement.title}
                          </h3>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${priorityColors[announcement.priority] || priorityColors.normal} shrink-0`}>
                            {announcement.priority}
                          </span>
                        </div>
                        
                        <p className={`text-sm text-slate-600 ${isExpanded ? '' : 'line-clamp-2'}`}>
                          {announcement.message}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1.5 ml-3 shrink-0">
                        <button
                          onClick={() => openViewModal(announcement)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 transition rounded-md hover:bg-slate-100"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleExpanded(announcement._id)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 transition rounded-md hover:bg-slate-100"
                          title={isExpanded ? "Show Less" : "Show More"}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span className="capitalize">{announcement.targetAudience}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(announcement.publishDate).toLocaleDateString()}</span>
                        </div>
                        {announcement.createdBy && (
                          <div className="flex items-center gap-1">
                            <span>By {announcement.createdBy.name}</span>
                          </div>
                        )}
                      </div>
                      
                      {announcement.expiryDate && (
                        <div className="flex items-center gap-1 text-amber-600">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Expires {new Date(announcement.expiryDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    page === currentPage
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* View Announcement Modal */}
      <AnimatePresence>
        {showViewModal && selectedAnnouncement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900">Announcement Details</h2>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    {selectedAnnouncement.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-indigo-100 text-indigo-700 capitalize">
                      {selectedAnnouncement.type}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${priorityColors[selectedAnnouncement.priority] || priorityColors.normal}`}>
                      {selectedAnnouncement.priority}
                    </span>
                    {selectedAnnouncement.isPinned && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-amber-100 text-amber-700 flex items-center gap-1">
                        <Pin className="w-3 h-3" />
                        Pinned
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-slate-700 mb-1.5">Message</h4>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">{selectedAnnouncement.message}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                  <div>
                    <h4 className="text-xs font-medium text-slate-700 mb-1">Target Audience</h4>
                    <p className="text-sm text-slate-600 capitalize">{selectedAnnouncement.targetAudience}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-slate-700 mb-1">Publish Date</h4>
                    <p className="text-sm text-slate-600">{new Date(selectedAnnouncement.publishDate).toLocaleDateString()}</p>
                  </div>
                  {selectedAnnouncement.expiryDate && (
                    <div>
                      <h4 className="text-xs font-medium text-slate-700 mb-1">Expiry Date</h4>
                      <p className="text-sm text-slate-600">{new Date(selectedAnnouncement.expiryDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedAnnouncement.createdBy && (
                    <div>
                      <h4 className="text-xs font-medium text-slate-700 mb-1">Created By</h4>
                      <p className="text-sm text-slate-600">{selectedAnnouncement.createdBy.name}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 border-t border-slate-200">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Announcement Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900">Create Announcement</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateAnnouncement} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                    >
                      {announcementTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                    >
                      {priorityLevels.map(priority => (
                        <option key={priority.value} value={priority.value}>{priority.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Target Audience *
                  </label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                    required
                  >
                    {targetAudiences.map(audience => (
                      <option key={audience.value} value={audience.value}>{audience.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Publish Date
                    </label>
                    <input
                      type="date"
                      value={formData.publishDate}
                      onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Expiry Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPinned"
                    checked={formData.isPinned}
                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                  />
                  <label htmlFor="isPinned" className="ml-2 block text-xs text-slate-700">
                    Pin this announcement to the top
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 text-sm font-medium"
                  >
                    <Send className="w-4 h-4" />
                    Create Announcement
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Announcements;
