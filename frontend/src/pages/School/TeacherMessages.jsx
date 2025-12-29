import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Search,
  Filter,
  Send,
  MoreVertical,
  Trash2,
  Archive,
  Star,
  Reply,
  Forward,
  Check,
  X,
  Inbox,
  SendHorizonal,
  AlertCircle,
  User,
  Users,
  Paperclip,
  Zap,
  RefreshCw,
} from "lucide-react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import { useSocket } from "../../context/SocketContext";

const TeacherMessages = () => {
  const socket = useSocket()?.socket;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showCompose, setShowCompose] = useState(false);
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [composeData, setComposeData] = useState({
    to: "",
    subject: "",
    message: ""
  });

  const fetchMessages = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      
      const response = await api.get("/api/school/teacher/messages");
      setMessages(response.data.messages || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
      setMessages([]);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  // Real-time socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (data) => {
      console.log("Real-time new notification:", data);
      if (data.type === 'message' || data.type === 'announcement' || data.type === 'alert') {
        toast.success(`New message: ${data.title || 'Message'}`, { icon: '📬' });
        fetchMessages(false);
      }
    };

    const handleNewAnnouncement = (data) => {
      console.log("Real-time new announcement:", data);
      toast.info(`New announcement: ${data.announcement?.title || 'Announcement'}`, { icon: '📢' });
      fetchMessages(false);
    };

    const handleMessageRead = (data) => {
      console.log("Real-time message read update:", data);
      setMessages(prev => prev.map(m => 
        m._id === data.messageId ? { ...m, read: true } : m
      ));
    };

    socket.on('notification', handleNewNotification);
    socket.on('announcement:new', handleNewAnnouncement);
    socket.on('message:read', handleMessageRead);

    return () => {
      socket.off('notification', handleNewNotification);
      socket.off('announcement:new', handleNewAnnouncement);
      socket.off('message:read', handleMessageRead);
    };
  }, [socket, fetchMessages]);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await api.get("/api/user/profile");
      setTeacherProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchMessages(false);
      toast.success("Messages refreshed!", { icon: '✅' });
    } catch (error) {
      console.error("Error refreshing messages:", error);
      toast.error("Failed to refresh messages");
    } finally {
      setRefreshing(false);
    }
  }, [fetchMessages]);

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

  useEffect(() => {
    fetchMessages();
    fetchProfile();
  }, [fetchMessages, fetchProfile]);

  const handleMarkAsRead = async (messageId, type) => {
    try {
      await api.put(`/api/school/teacher/messages/${messageId}/read`, { type });
      setMessages(prev => prev.map(m => m._id === messageId ? { ...m, read: true } : m));
      // Don't show toast for auto-read when opening message
    } catch (error) {
      console.error("Error marking as read:", error);
      // Silent fail for auto-read
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!composeData.to || !composeData.message) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // Try to find student by name or email
      const searchResponse = await api.get("/api/school/teacher/search-students", {
        params: { query: composeData.to }
      });
      
      const students = searchResponse.data.students || [];
      
      if (students.length === 0) {
        toast.error("Student not found. Please enter a valid student name or email.");
        return;
      }

      // Send message to first matching student
      const studentId = students[0]._id;
      await api.post(`/api/school/teacher/student/${studentId}/message`, {
        message: composeData.subject ? `${composeData.subject}\n\n${composeData.message}` : composeData.message
      });

      toast.success("Message sent successfully!");
      setShowCompose(false);
      setComposeData({ to: "", subject: "", message: "" });
      fetchMessages(false);
    } catch (error) {
      console.error("Error sending message:", error);
      if (error.response?.status === 404) {
        toast.error("Student not found. Please check the recipient name or email.");
      } else {
        toast.error("Failed to send message");
      }
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          msg.sender.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" ||
                          (filterType === "unread" && !msg.read) ||
                          (filterType === "important" && msg.isPinned) ||
                          (filterType === msg.type);
    return matchesSearch && matchesFilter;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm mb-6"
        >
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-6 rounded-t-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-1">
                  Messages
                </h1>
                <p className="text-sm text-white/80">
                  Stay connected with students, parents, and staff
                  {lastUpdated && (
                    <span className="ml-2 text-white/70">
                      • Last updated: {formatTimeAgo(lastUpdated)}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRefresh}
                  disabled={refreshing || loading}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2 border border-white/20 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCompose(true)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium transition-all flex items-center gap-2 border border-white/20 hover:border-white/30"
                >
                  <Send className="w-4 h-4" />
                  Compose
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Messages</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{messages.length}</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Mail className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Unread</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{unreadCount}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <AlertCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Important</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {messages.filter(m => m.isPinned).length}
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Toolbar */}
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex-1 relative min-w-[250px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none bg-white"
                    />
                  </div>

                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none bg-white font-medium"
                  >
                    <option value="all">All Messages</option>
                    <option value="unread">Unread ({unreadCount})</option>
                    <option value="important">Important</option>
                    <option value="notification">Notifications</option>
                    <option value="announcement">Announcements</option>
                  </select>
                </div>
              </div>

              {/* Messages */}
              <div className="divide-y divide-slate-200 max-h-[calc(100vh-400px)] overflow-y-auto">
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-16">
                    <Inbox className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No messages found</h3>
                    <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  filteredMessages.map((msg, idx) => (
                    <motion.div
                      key={msg._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => {
                        setSelectedMessage(msg);
                        if (!msg.read) handleMarkAsRead(msg._id, msg.type);
                      }}
                      className={`p-4 cursor-pointer transition-all hover:bg-slate-50 ${
                        selectedMessage?._id === msg._id
                          ? "bg-indigo-50 border-l-4 border-indigo-600"
                          : !msg.read
                          ? "bg-indigo-50/50 border-l-4 border-indigo-400"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg ${
                          msg.isPinned ? "bg-amber-500" : "bg-indigo-600"
                        }`}>
                          {msg.sender.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className={`font-semibold text-sm ${msg.read ? "text-slate-700" : "text-slate-900"}`}>
                                  {msg.sender}
                                </p>
                                {!msg.read && (
                                  <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                                )}
                                {msg.isPinned && (
                                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                )}
                              </div>
                              <p className={`text-sm font-semibold mb-1 ${msg.read ? "text-slate-600" : "text-slate-900"}`}>
                                {msg.subject}
                              </p>
                            </div>
                            <span className="text-xs text-slate-500 whitespace-nowrap">{msg.time}</span>
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-2 mb-2">{msg.message}</p>
                          {msg.type && (
                            <span className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium capitalize">
                              {msg.type}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Message Detail / Compose Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {showCompose ? (
                /* Compose Form */
                <div>
                  <div className="p-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white flex items-center justify-between">
                    <h3 className="font-bold text-lg">Compose Message</h3>
                    <button
                      onClick={() => setShowCompose(false)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSendMessage} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">To *</label>
                      <input
                        type="text"
                        required
                        value={composeData.to}
                        onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                        placeholder="student@example.com or Student Name"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                      <input
                        type="text"
                        value={composeData.subject}
                        onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                        placeholder="Message subject"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Message *</label>
                      <textarea
                        required
                        value={composeData.message}
                        onChange={(e) => setComposeData({ ...composeData, message: e.target.value })}
                        placeholder="Type your message..."
                        rows={8}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none resize-none bg-white"
                      />
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="flex-1 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Send Message
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setShowCompose(false)}
                        className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-all"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </form>
                </div>
              ) : selectedMessage ? (
                /* Message Detail */
                <div>
                  <div className="p-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg">{selectedMessage.subject}</h3>
                      <button
                        onClick={() => setSelectedMessage(null)}
                        className="p-2 hover:bg-white/20 rounded-lg transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/90">
                      <User className="w-4 h-4" />
                      <span>{selectedMessage.sender}</span>
                      <span className="mx-2">•</span>
                      <span>{selectedMessage.time}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="prose max-w-none mb-6">
                      <p className="text-slate-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-slate-200">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setShowCompose(true);
                          setComposeData({
                            ...composeData,
                            to: selectedMessage.sender,
                            subject: `Re: ${selectedMessage.subject}`
                          });
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center gap-2"
                      >
                        <Reply className="w-4 h-4" />
                        Reply
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-all flex items-center gap-2"
                      >
                        <Archive className="w-4 h-4" />
                        Archive
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition-all flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </div>
              ) : (
                /* No Selection */
                <div className="p-12 text-center">
                  <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No Message Selected</h3>
                  <p className="text-slate-500 text-sm mb-6">Select a message from the list to read</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCompose(true)}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center gap-2 mx-auto"
                  >
                    <Send className="w-4 h-4" />
                    Compose New Message
                  </motion.button>
                </div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-sm p-6 text-white"
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setShowCompose(true);
                    setComposeData({ ...composeData, subject: "Class Announcement" });
                  }}
                  className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-medium transition-all flex items-center justify-between border border-white/20 hover:border-white/30"
                >
                  <span>Class Announcement</span>
                  <Users className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setShowCompose(true);
                    setComposeData({ ...composeData, subject: "Individual Message" });
                  }}
                  className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-medium transition-all flex items-center justify-between border border-white/20 hover:border-white/30"
                >
                  <span>Message Student</span>
                  <User className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherMessages;
