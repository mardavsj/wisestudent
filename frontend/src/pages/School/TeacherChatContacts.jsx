import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  MessageSquare,
  Search,
  ArrowLeft,
  Circle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

const TeacherChatContacts = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'students', 'parents'

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/school/teacher/all-students');
      const studentsData = response.data?.students || [];
      
      // Format contacts with students
      const formattedContacts = studentsData.map((student) => ({
        id: student._id,
        name: student.name || 'Unknown Student',
        role: 'student',
        avatar: undefined, // Will be handled by default avatar in UI
        grade: student.class || 'N/A',
        age: `Level ${student.level || 1}`,
        email: student.email,
        xp: student.xp || 0,
        healCoins: student.healCoins || 0,
        level: student.level || 1,
        streak: student.streak || 0
      }));
      
      setContacts(formattedContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleContactClick = (contact, type = 'student') => {
    if (type === 'student') {
      // Navigate to teacher-student chat
      navigate(`/school-teacher/student-chat/${contact.id}`);
    } else {
      // For parent, navigate to parent chat
      navigate(`/school-teacher/student/${contact.id}/parent-chat`);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || contact.role === filter;
    return matchesSearch && matchesFilter;
  });

  const studentsCount = contacts.filter(c => c.role === 'student').length;

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
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => navigate('/school-teacher/overview')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </motion.button>
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">Chat Contacts</h1>
                  <p className="text-sm text-white/80">Connect with students and parents</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-white/80 uppercase tracking-wide">Total Contacts</p>
                  <p className="text-2xl font-bold text-white">{contacts.length}</p>
                </div>
                <div className="p-3 bg-white/10 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search students and parents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none bg-white"
              />
            </div>
            <button
              onClick={() => setFilter('students')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'students'
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Students ({studentsCount})
            </button>
          </div>
        </motion.div>

        {/* Contacts List */}
        {filteredContacts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center"
          >
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No contacts found</h3>
            <p className="text-sm text-slate-600">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredContacts.map((contact, idx) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -2 }}
                onClick={() => handleContactClick(contact)}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                        contact.role === 'student'
                          ? 'bg-indigo-600'
                          : 'bg-purple-600'
                      }`}>
                        {contact.name?.charAt(0).toUpperCase()}
                      </div>
                      <Circle className={`absolute -bottom-1 -right-1 w-4 h-4 ${
                        contact.role === 'student' ? 'fill-green-500 text-green-500' : 'fill-blue-500 text-blue-500'
                      }`} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-base font-semibold text-slate-900 truncate">{contact.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          contact.role === 'student' ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {contact.role === 'student' ? 'Student' : 'Parent'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap">
                        <span>{contact.grade}</span>
                        <span>•</span>
                        <span>{contact.age}</span>
                        {contact.xp > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-indigo-600 font-medium">{contact.xp} XP</span>
                          </>
                        )}
                        {contact.streak > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-orange-600 font-medium">{contact.streak} day streak</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContactClick(contact, 'student');
                      }}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat to Student
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContactClick(contact, 'parent');
                      }}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat to Parent
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherChatContacts;
