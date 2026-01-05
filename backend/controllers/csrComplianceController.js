import CSRComplianceEvent from '../models/CSRComplianceEvent.js';
import mongoose from 'mongoose';

// Create a new compliance event
export const createComplianceEvent = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const {
      title,
      description,
      eventType,
      category,
      dueDate,
      reminderDate,
      priority,
      relatedReportId,
      relatedPaymentId,
      relatedCampaignId,
      isRecurring,
      recurrencePattern
    } = req.body;

    // Validate required fields
    if (!title || !eventType || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, eventType, dueDate'
      });
    }

    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    // Calculate next occurrence if recurring
    let nextOccurrence = null;
    if (isRecurring && recurrencePattern) {
      const due = new Date(dueDate);
      switch (recurrencePattern) {
        case 'monthly':
          nextOccurrence = new Date(due.setMonth(due.getMonth() + 1));
          break;
        case 'quarterly':
          nextOccurrence = new Date(due.setMonth(due.getMonth() + 3));
          break;
        case 'yearly':
          nextOccurrence = new Date(due.setFullYear(due.getFullYear() + 1));
          break;
        default:
          nextOccurrence = null;
      }
    }

    const event = new CSRComplianceEvent({
      title,
      description,
      eventType,
      category: category || 'regulatory',
      dueDate: new Date(dueDate),
      reminderDate: reminderDate ? new Date(reminderDate) : null,
      priority: priority || 'medium',
      organizationId: orgObjectId,
      createdBy: req.user._id,
      relatedReportId: relatedReportId || null,
      relatedPaymentId: relatedPaymentId || null,
      relatedCampaignId: relatedCampaignId || null,
      isRecurring: isRecurring || false,
      recurrencePattern: recurrencePattern || null,
      nextOccurrence
    });

    // Add audit trail
    event.auditTrail.push({
      action: 'event_created',
      performedBy: req.user._id,
      details: `Compliance event "${title}" created`,
      changes: event.toObject()
    });

    await event.save();

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io && organizationId) {
      io.to(organizationId.toString()).emit('csr:compliance:update');
    }

    res.status(201).json({
      success: true,
      message: 'Compliance event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Error creating compliance event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create compliance event',
      error: error.message
    });
  }
};

// Get all compliance events
export const getComplianceEvents = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { status, eventType, category, startDate, endDate } = req.query;
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    const query = { organizationId: orgObjectId };
    
    if (status) query.status = status;
    if (eventType) query.eventType = eventType;
    if (category) query.category = category;
    
    if (startDate || endDate) {
      query.dueDate = {};
      if (startDate) query.dueDate.$gte = new Date(startDate);
      if (endDate) query.dueDate.$lte = new Date(endDate);
    }

    const events = await CSRComplianceEvent.find(query)
      .populate('createdBy', 'name email')
      .populate('relatedReportId', 'reportName')
      .populate('relatedPaymentId', 'paymentId amount')
      .populate('relatedCampaignId', 'title')
      .sort({ dueDate: 1 });

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Error fetching compliance events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch compliance events',
      error: error.message
    });
  }
};

// Get upcoming events (next 30 days)
export const getUpcomingEvents = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);
    const now = new Date();
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const events = await CSRComplianceEvent.find({
      organizationId: orgObjectId,
      dueDate: { $gte: now, $lte: thirtyDaysLater },
      status: { $in: ['pending', 'in_progress'] }
    })
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1 })
      .limit(20);

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upcoming events',
      error: error.message
    });
  }
};

// Get overdue events
export const getOverdueEvents = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);
    const now = new Date();

    const events = await CSRComplianceEvent.find({
      organizationId: orgObjectId,
      dueDate: { $lt: now },
      status: { $in: ['pending', 'in_progress'] }
    })
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1 });

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Error fetching overdue events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch overdue events',
      error: error.message
    });
  }
};

// Get event by ID
export const getEventById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { eventId } = req.params;
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    const event = await CSRComplianceEvent.findOne({
      _id: eventId,
      organizationId: orgObjectId
    })
      .populate('createdBy', 'name email')
      .populate('relatedReportId', 'reportName')
      .populate('relatedPaymentId', 'paymentId amount')
      .populate('relatedCampaignId', 'title')
      .populate('notes.addedBy', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event',
      error: error.message
    });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { eventId } = req.params;
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    const event = await CSRComplianceEvent.findOne({
      _id: eventId,
      organizationId: orgObjectId
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const oldValue = event.toObject();
    const updates = req.body;

    // Update allowed fields
    if (updates.title) event.title = updates.title;
    if (updates.description !== undefined) event.description = updates.description;
    if (updates.dueDate) event.dueDate = new Date(updates.dueDate);
    if (updates.reminderDate !== undefined) event.reminderDate = updates.reminderDate ? new Date(updates.reminderDate) : null;
    if (updates.status) event.status = updates.status;
    if (updates.priority) event.priority = updates.priority;
    if (updates.completionNotes !== undefined) event.completionNotes = updates.completionNotes;

    // If marking as completed
    if (updates.status === 'completed' && event.status !== 'completed') {
      event.completedDate = new Date();
      event.completedBy = req.user._id;
    }

    // Add audit trail
    event.auditTrail.push({
      action: 'event_updated',
      performedBy: req.user._id,
      details: 'Event updated',
      changes: { old: oldValue, new: event.toObject() }
    });

    await event.save();

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io && organizationId) {
      io.to(organizationId.toString()).emit('csr:compliance:update');
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: error.message
    });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { eventId } = req.params;
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    const event = await CSRComplianceEvent.findOneAndDelete({
      _id: eventId,
      organizationId: orgObjectId
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    if (io && organizationId) {
      io.to(organizationId.toString()).emit('csr:compliance:update');
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message
    });
  }
};

// Get calendar view (events by month)
export const getCalendarView = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { year, month } = req.query;
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    // Handle month: query params are typically 1-indexed (1-12), but Date uses 0-indexed (0-11)
    // If month is provided, treat it as 1-indexed and convert to 0-indexed for Date calculations
    // If not provided, use current month (calculate once to avoid potential midnight boundary issues)
    const now = new Date();
    const currentMonth0Indexed = now.getMonth(); // 0-indexed (0-11)
    const currentYear = now.getFullYear();
    
    const monthForDate = month !== undefined 
      ? parseInt(month) - 1  // Convert 1-indexed query param to 0-indexed
      : currentMonth0Indexed; // Use pre-calculated current month
    
    const yearValue = year ? parseInt(year) : currentYear;
    
    // Start of month (day 1)
    const startDate = new Date(yearValue, monthForDate, 1);
    // End of month (day 0 of next month = last day of current month)
    const endDate = new Date(yearValue, monthForDate + 1, 0);

    const events = await CSRComplianceEvent.find({
      organizationId: orgObjectId,
      dueDate: { $gte: startDate, $lte: endDate }
    })
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1 });

    // Group events by date
    const eventsByDate = {};
    events.forEach(event => {
      const dateKey = event.dueDate.toISOString().split('T')[0];
      if (!eventsByDate[dateKey]) {
        eventsByDate[dateKey] = [];
      }
      eventsByDate[dateKey].push(event);
    });

    // Return consistent month format (1-indexed, 1-12) to match query parameter format
    // Use the same currentMonth0Indexed to ensure consistency with monthForDate
    const monthForResponse = month !== undefined 
      ? parseInt(month)  // Already 1-indexed from query param
      : currentMonth0Indexed + 1; // Convert 0-indexed to 1-indexed using pre-calculated value
    
    res.json({
      success: true,
      data: {
        events,
        eventsByDate,
        month: monthForResponse,
        year: yearValue
      }
    });
  } catch (error) {
    console.error('Error fetching calendar view:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch calendar view',
      error: error.message
    });
  }
};

// Add note to event
export const addEventNote = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const { eventId } = req.params;
    const { note } = req.body;
    const organizationId = req.user.orgId ? req.user.orgId.toString() : req.user._id.toString();
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    const event = await CSRComplianceEvent.findOne({
      _id: eventId,
      organizationId: orgObjectId
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    event.notes.push({
      note,
      addedBy: req.user._id
    });

    await event.save();

    res.json({
      success: true,
      message: 'Note added successfully',
      data: event
    });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add note',
      error: error.message
    });
  }
};

export default {
  createComplianceEvent,
  getComplianceEvents,
  getUpcomingEvents,
  getOverdueEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getCalendarView,
  addEventNote
};

