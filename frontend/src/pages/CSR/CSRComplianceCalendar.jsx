import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Plus, AlertTriangle, CheckCircle, Clock, X,
  FileText, DollarSign, Shield, Target, ChevronLeft, ChevronRight,
  Filter, Eye, Edit, Trash2, Download, ArrowRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import csrComplianceService from '../../services/csrComplianceService';
import { exportToCSV } from '../../utils/exportUtils';

const CSRComplianceCalendar = () => {
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [overdueEvents, setOverdueEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('calendar'); // calendar, list

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'report_submission',
    category: 'regulatory',
    dueDate: '',
    reminderDate: '',
    priority: 'medium',
    isRecurring: false,
    recurrencePattern: ''
  });

  useEffect(() => {
    loadAllEvents();
  }, [currentDate]);

  const loadAllEvents = async () => {
    setLoading(true);
    try {
      const [eventsRes, upcomingRes, overdueRes] = await Promise.all([
        csrComplianceService.getEvents({
          startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString(),
          endDate: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString()
        }),
        csrComplianceService.getUpcomingEvents(),
        csrComplianceService.getOverdueEvents()
      ]);

      setEvents(eventsRes.data || []);
      setUpcomingEvents(upcomingRes.data || []);
      setOverdueEvents(overdueRes.data || []);
    } catch (error) {
      console.error('Error loading events:', error);
      toast.error('Failed to load compliance events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    try {
      if (!formData.title || !formData.dueDate) {
        toast.error('Please fill in all required fields');
        return;
      }

      await csrComplianceService.createEvent(formData);
      toast.success('Compliance event created successfully');
      setShowCreateModal(false);
      resetForm();
      loadAllEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(error.response?.data?.message || 'Failed to create event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await csrComplianceService.deleteEvent(eventId);
      toast.success('Event deleted successfully');
      loadAllEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const handleMarkComplete = async (eventId) => {
    try {
      await csrComplianceService.updateEvent(eventId, {
        status: 'completed',
        completionNotes: 'Marked as completed'
      });
      toast.success('Event marked as completed');
      loadAllEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      eventType: 'report_submission',
      category: 'regulatory',
      dueDate: '',
      reminderDate: '',
      priority: 'medium',
      isRecurring: false,
      recurrencePattern: ''
    });
  };

  const handleExportEvents = () => {
    try {
      if (events.length === 0) {
        toast.error('No events to export');
        return;
      }

      const exportData = events.map(event => {
        const daysUntilDue = Math.ceil((new Date(event.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
        return {
          'Event ID': event.eventId || '',
          'Title': event.title || '',
          'Type': event.eventType || '',
          'Category': event.category || '',
          'Status': event.status || '',
          'Priority': event.priority || '',
          'Due Date': new Date(event.dueDate).toLocaleDateString(),
          'Days Until Due': daysUntilDue,
          'Is Overdue': daysUntilDue < 0 && event.status !== 'completed' ? 'Yes' : 'No',
          'Description': event.description || ''
        };
      });

      exportToCSV(exportData, 'compliance-events');
      toast.success('Events exported successfully');
    } catch (error) {
      console.error('Error exporting events:', error);
      toast.error('Failed to export events');
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'report_submission': return FileText;
      case 'payment_due': return DollarSign;
      case 'audit': return Shield;
      case 'compliance_check': return CheckCircle;
      default: return Calendar;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', badge: 'bg-green-100 text-green-800' };
      case 'overdue': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-100 text-red-800' };
      case 'in_progress': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-800' };
      case 'pending': return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-800' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', badge: 'bg-gray-100 text-gray-800' };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'border-l-4 border-red-500 bg-red-50';
      case 'high': return 'border-l-4 border-orange-500 bg-orange-50';
      case 'medium': return 'border-l-4 border-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-4 border-gray-400 bg-gray-50';
      default: return 'border-l-4 border-gray-400 bg-gray-50';
    }
  };

  const eventTypes = [
    { value: 'report_submission', label: 'Report Submission' },
    { value: 'payment_due', label: 'Payment Due' },
    { value: 'audit', label: 'Audit' },
    { value: 'compliance_check', label: 'Compliance Check' },
    { value: 'deadline', label: 'Deadline' },
    { value: 'renewal', label: 'Renewal' },
    { value: 'custom', label: 'Custom' }
  ];

  const categories = [
    { value: 'regulatory', label: 'Regulatory' },
    { value: 'financial', label: 'Financial' },
    { value: 'operational', label: 'Operational' },
    { value: 'legal', label: 'Legal' },
    { value: 'reporting', label: 'Reporting' }
  ];

  // Group events by date
  const eventsByDate = {};
  events.forEach(event => {
    const dateKey = new Date(event.dueDate).toISOString().split('T')[0];
    if (!eventsByDate[dateKey]) {
      eventsByDate[dateKey] = [];
    }
    eventsByDate[dateKey].push(event);
  });

  // Get days in current month
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"
          />
          <h2 className="text-sm font-bold text-gray-900 mb-1">Loading Calendar</h2>
          <p className="text-xs text-gray-600">Fetching compliance events...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50/95 via-purple-50/95 to-pink-50/95 backdrop-blur-xl border-b border-indigo-200/60 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-md shadow-indigo-500/30 flex-shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                    Compliance Calendar
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm mt-0.5 hidden sm:block">
                    Track regulatory deadlines, report submissions, and compliance requirements
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-1.5 text-sm rounded-md font-semibold transition-all ${
                    viewMode === 'calendar' 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Calendar
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 text-sm rounded-md font-semibold transition-all ${
                    viewMode === 'list' 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  List
                </button>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportEvents}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                title="Export Events"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Event
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Alerts */}
        {(overdueEvents.length > 0 || upcomingEvents.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          >
            {overdueEvents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 shadow-md"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="font-bold text-red-900 text-sm">Overdue Events</h3>
                </div>
                <p className="text-red-700 font-semibold text-xs">{overdueEvents.length} event(s) past due date</p>
              </motion.div>
            )}

            {upcomingEvents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-4 shadow-md"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-bold text-yellow-900 text-sm">Upcoming (30 days)</h3>
                </div>
                <p className="text-yellow-700 font-semibold text-xs">{upcomingEvents.length} event(s) due soon</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-5 shadow-md border border-gray-100 mb-6"
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </motion.button>
              <h2 className="text-lg font-bold text-gray-900">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </motion.button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-semibold text-gray-600 py-2 text-xs">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-20 bg-gray-50 rounded-lg border border-gray-100" />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const dateKey = date.toISOString().split('T')[0];
                const dayEvents = eventsByDate[dateKey] || [];
                const isToday = dateKey === new Date().toISOString().split('T')[0];

                return (
                  <motion.div
                    key={day}
                    whileHover={{ scale: 1.01 }}
                    className={`h-20 p-1.5 rounded-lg border ${
                      isToday ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-gray-200 bg-white'
                    } hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer`}
                    onClick={() => {
                      if (dayEvents.length > 0) {
                        setSelectedEvent(dayEvents[0]);
                      }
                    }}
                  >
                    <div className={`text-xs font-bold mb-0.5 ${isToday ? 'text-indigo-600' : 'text-gray-900'}`}>
                      {day}
                    </div>
                    <div className="space-y-0.5 overflow-hidden">
                      {dayEvents.slice(0, 2).map((event, idx) => {
                        const Icon = getEventTypeIcon(event.eventType);
                        const statusColors = getStatusColor(event.status);
                        return (
                          <div
                            key={idx}
                            className={`text-xs p-0.5 rounded truncate border-l-2 ${statusColors.border} ${statusColors.bg} flex items-center gap-0.5`}
                            title={event.title}
                          >
                            <Icon className="w-2.5 h-2.5 flex-shrink-0" />
                            <span className="truncate">{event.title}</span>
                          </div>
                        );
                      })}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500 font-semibold px-0.5">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-5 shadow-md border border-gray-100 mb-6"
          >
            <h2 className="text-sm font-bold text-gray-900 mb-4">All Events</h2>
            {events.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-xs text-gray-600 font-semibold">No events scheduled for this month</p>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((event, index) => {
                  const Icon = getEventTypeIcon(event.eventType);
                  const statusColors = getStatusColor(event.status);
                  const daysUntilDue = Math.ceil((new Date(event.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
                  const isOverdue = daysUntilDue < 0 && event.status !== 'completed';

                  return (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 2, scale: 1.01 }}
                      className={`p-3 rounded-lg border ${getPriorityColor(event.priority)} ${
                        isOverdue ? 'border-red-500' : statusColors.border
                      } hover:shadow-md transition-all`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${statusColors.bg} ${statusColors.border} border`}>
                            <Icon className={`w-4 h-4 ${statusColors.text}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              <h3 className="font-bold text-xs text-gray-900">{event.title}</h3>
                              <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${statusColors.badge}`}>
                                {event.status.replace('_', ' ')}
                              </span>
                              <span className={`px-2 py-0.5 rounded-md text-xs font-semibold capitalize ${
                                event.priority === 'critical' ? 'bg-red-100 text-red-700' :
                                event.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                event.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {event.priority}
                              </span>
                            </div>
                            {event.description && (
                              <p className="text-xs text-gray-600 mb-1.5">{event.description}</p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{new Date(event.dueDate).toLocaleDateString()}</span>
                              </div>
                              {!isOverdue && event.status !== 'completed' && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{daysUntilDue} days left</span>
                                </div>
                              )}
                              {isOverdue && (
                                <div className="flex items-center gap-1 text-red-600 font-semibold">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  <span>Overdue by {Math.abs(daysUntilDue)} days</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 ml-3">
                          {event.status !== 'completed' && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleMarkComplete(event._id)}
                              className="p-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                              title="Mark as completed"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </motion.button>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedEvent(event)}
                            className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteEvent(event._id)}
                            className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Create Event Modal */}
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
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-5 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Add Compliance Event</h2>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                      placeholder="e.g., Quarterly Report Submission"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                      rows={3}
                      placeholder="Event description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Event Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.eventType}
                        onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                      >
                        {eventTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Due Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Reminder Date</label>
                      <input
                        type="date"
                        value={formData.reminderDate}
                        onChange={(e) => setFormData({ ...formData, reminderDate: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isRecurring"
                      checked={formData.isRecurring}
                      onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="isRecurring" className="text-xs font-semibold text-gray-700">Recurring Event</label>
                  </div>

                  {formData.isRecurring && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Recurrence Pattern</label>
                      <select
                        value={formData.recurrencePattern}
                        onChange={(e) => setFormData({ ...formData, recurrencePattern: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300/50 focus:border-purple-400 transition-all"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateEvent}
                    className="flex-1 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all"
                  >
                    Create Event
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Event Detail Modal */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedEvent(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-5 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">{selectedEvent.title}</h2>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(selectedEvent.status).badge}`}>
                      {selectedEvent.status.replace('_', ' ')}
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize ${
                      selectedEvent.priority === 'critical' ? 'bg-red-100 text-red-700' :
                      selectedEvent.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      selectedEvent.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedEvent.priority} Priority
                    </span>
                  </div>

                  {selectedEvent.description && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-1.5">Description</h3>
                      <p className="text-xs text-gray-700">{selectedEvent.description}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Due Date</div>
                      <div className="font-semibold text-xs text-gray-900">
                        {new Date(selectedEvent.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Event Type</div>
                      <div className="font-semibold text-xs text-gray-900 capitalize">{selectedEvent.eventType.replace('_', ' ')}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Category</div>
                      <div className="font-semibold text-xs text-gray-900 capitalize">{selectedEvent.category}</div>
                    </div>
                    {selectedEvent.completionNotes && (
                      <div>
                        <div className="text-xs text-gray-500 mb-0.5">Completion Notes</div>
                        <div className="font-semibold text-xs text-gray-900">{selectedEvent.completionNotes}</div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CSRComplianceCalendar;
