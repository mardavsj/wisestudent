import Announcement from '../models/Announcement.js';
import User from '../models/User.js';
import SchoolClass from '../models/School/SchoolClass.js';
import { ErrorResponse } from '../utils/ErrorResponse.js';

// Create Announcement (School Admin only)
export const createAnnouncement = async (req, res) => {
  try {
    const { tenantId, user } = req;
    const { 
      title, 
      message, 
      type = 'general', 
      priority = 'normal', 
      targetAudience, 
      targetClassNames = [], 
      publishDate, 
      expiryDate, 
      isPinned = false 
    } = req.body;

    // Validate required fields
    if (!title || !message || !targetAudience) {
      return res.status(400).json({ 
        message: 'Title, message, and target audience are required' 
      });
    }

    // Only school_admin and school_teacher can create announcements
    if (user.role !== 'school_admin' && user.role !== 'school_teacher') {
      return res.status(403).json({ 
        message: 'Only school administrators and teachers can create announcements' 
      });
    }

    // Get target classes if specific classes are selected
    let targetClasses = [];
    if (targetAudience === 'specific_class' && targetClassNames.length > 0) {
      targetClasses = await SchoolClass.find({
        tenantId,
        $or: [
          { classNumber: { $in: targetClassNames } },
          { stream: { $in: targetClassNames } }
        ]
      }).select('_id');
      targetClasses = targetClasses.map(cls => cls._id);
    }

    // Create announcement
    const announcement = await Announcement.create({
      tenantId,
      orgId: user.orgId,
      title,
      message,
      type,
      priority,
      targetAudience,
      targetClasses,
      targetClassNames,
      createdBy: user._id,
      createdByName: user.name,
      createdByRole: user.role,
      publishDate: publishDate ? new Date(publishDate) : new Date(),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      isPinned
    });

    // Populate announcement for socket emission
    const populatedAnnouncement = await Announcement.findById(announcement._id)
      .populate('createdBy', 'name email avatar')
      .populate('targetClasses', 'classNumber stream')
      .lean();

    // Emit real-time notification via Socket.IO
    const io = req.app?.get('io');
    if (io) {
      // Emit to all users in the tenant
      io.to(tenantId).emit('announcement:new', {
        announcement: populatedAnnouncement,
        tenantId,
        targetAudience,
        createdAt: new Date()
      });

      // Also emit to specific rooms based on target audience
      if (targetAudience === 'teachers') {
        io.to(`${tenantId}:teachers`).emit('announcement:new', {
          announcement: populatedAnnouncement,
          tenantId,
          targetAudience,
          createdAt: new Date()
        });
      } else if (targetAudience === 'students') {
        io.to(`${tenantId}:students`).emit('announcement:new', {
          announcement: populatedAnnouncement,
          tenantId,
          targetAudience,
          createdAt: new Date()
        });
      } else if (targetAudience === 'parents') {
        io.to(`${tenantId}:parents`).emit('announcement:new', {
          announcement: populatedAnnouncement,
          tenantId,
          targetAudience,
          createdAt: new Date()
        });
      }
    }

    res.status(201).json({
      message: 'Announcement created successfully',
      announcement: populatedAnnouncement
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Announcements (School Admin)
export const getAllAnnouncements = async (req, res) => {
  try {
    const { tenantId } = req;
    const { page = 1, limit = 10, type, priority, targetAudience, isActive } = req.query;

    // Build filter object
    const filter = { tenantId };
    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    if (targetAudience) filter.targetAudience = targetAudience;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const announcements = await Announcement.find(filter)
      .populate('createdBy', 'name email avatar')
      .populate('targetClasses', 'classNumber stream')
      .sort({ isPinned: -1, publishDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Announcement.countDocuments(filter);

    res.json({
      announcements,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Announcement by ID
export const getAnnouncementById = async (req, res) => {
  try {
    const { tenantId } = req;
    const { id } = req.params;

    const announcement = await Announcement.findOne({ _id: id, tenantId })
      .populate('createdBy', 'name email avatar')
      .populate('targetClasses', 'classNumber stream')
      .populate('readBy.userId', 'name email');

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json(announcement);
  } catch (error) {
    console.error('Error fetching announcement:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Announcement (School Admin only)
export const updateAnnouncement = async (req, res) => {
  try {
    const { tenantId, user } = req;
    const { id } = req.params;
    const updateData = req.body;

    // Only school_admin can update announcements
    if (user.role !== 'school_admin') {
      return res.status(403).json({ 
        message: 'Only school administrators can update announcements' 
      });
    }

    // Remove fields that shouldn't be updated
    delete updateData.createdBy;
    delete updateData.createdByName;
    delete updateData.createdByRole;
    delete updateData.tenantId;
    delete updateData.orgId;

    const announcement = await Announcement.findOneAndUpdate(
      { _id: id, tenantId },
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email avatar')
     .populate('targetClasses', 'classNumber stream');

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Emit real-time update via Socket.IO
    const io = req.app?.get('io');
    if (io) {
      // Emit to all users in the tenant
      io.to(tenantId).emit('announcement:updated', {
        announcement,
        tenantId,
        targetAudience: announcement.targetAudience,
        updatedAt: new Date()
      });

      // Also emit to specific rooms based on target audience
      if (announcement.targetAudience === 'teachers') {
        io.to(`${tenantId}:teachers`).emit('announcement:updated', {
          announcement,
          tenantId,
          targetAudience: announcement.targetAudience,
          updatedAt: new Date()
        });
      } else if (announcement.targetAudience === 'students') {
        io.to(`${tenantId}:students`).emit('announcement:updated', {
          announcement,
          tenantId,
          targetAudience: announcement.targetAudience,
          updatedAt: new Date()
        });
      } else if (announcement.targetAudience === 'parents') {
        io.to(`${tenantId}:parents`).emit('announcement:updated', {
          announcement,
          tenantId,
          targetAudience: announcement.targetAudience,
          updatedAt: new Date()
        });
      }
    }

    res.json({
      message: 'Announcement updated successfully',
      announcement
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Announcement (School Admin only)
export const deleteAnnouncement = async (req, res) => {
  try {
    const { tenantId, user } = req;
    const { id } = req.params;

    // Only school_admin can delete announcements
    if (user.role !== 'school_admin') {
      return res.status(403).json({ 
        message: 'Only school administrators can delete announcements' 
      });
    }

    const announcement = await Announcement.findOneAndDelete({ _id: id, tenantId });

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Announcements for Students
export const getStudentAnnouncements = async (req, res) => {
  try {
    const { tenantId, user } = req;
    const { page = 1, limit = 10 } = req.query;

    // Get student's class information
    const student = await User.findById(user._id).populate('academic.classId');
    const studentClassId = student.academic?.classId?._id;

    // Build filter for announcements visible to students
    const filter = {
      tenantId,
      isActive: true,
      $or: [
        { targetAudience: 'all' },
        { targetAudience: 'students' },
        ...(studentClassId ? [{ targetClasses: studentClassId }] : [])
      ],
      $and: [
        { publishDate: { $lte: new Date() } },
        {
          $or: [
            { expiryDate: { $exists: false } },
            { expiryDate: null },
            { expiryDate: { $gte: new Date() } }
          ]
        }
      ]
    };

    const announcements = await Announcement.find(filter)
      .populate('createdBy', 'name email avatar')
      .populate('targetClasses', 'classNumber stream')
      .sort({ isPinned: -1, publishDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Announcement.countDocuments(filter);

    res.json({
      announcements,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching student announcements:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Announcements for Teachers
export const getTeacherAnnouncements = async (req, res) => {
  try {
    const { tenantId } = req;
    const { page = 1, limit = 10 } = req.query;

    // Build filter for announcements visible to teachers
    const filter = {
      tenantId,
      isActive: true,
      $or: [
        { targetAudience: 'all' },
        { targetAudience: 'teachers' }
      ],
      $and: [
        { publishDate: { $lte: new Date() } },
        {
          $or: [
            { expiryDate: { $exists: false } },
            { expiryDate: null },
            { expiryDate: { $gte: new Date() } }
          ]
        }
      ]
    };

    const announcements = await Announcement.find(filter)
      .populate('createdBy', 'name email avatar')
      .populate('targetClasses', 'classNumber stream')
      .sort({ isPinned: -1, publishDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Announcement.countDocuments(filter);

    res.json({
      announcements,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching teacher announcements:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Announcements for Parents
export const getParentAnnouncements = async (req, res) => {
  try {
    const { tenantId } = req;
    const { page = 1, limit = 10 } = req.query;

    // Build filter for announcements visible to parents
    const filter = {
      tenantId,
      isActive: true,
      $or: [
        { targetAudience: 'all' },
        { targetAudience: 'parents' }
      ],
      $and: [
        { publishDate: { $lte: new Date() } },
        {
          $or: [
            { expiryDate: { $exists: false } },
            { expiryDate: null },
            { expiryDate: { $gte: new Date() } }
          ]
        }
      ]
    };

    const announcements = await Announcement.find(filter)
      .populate('createdBy', 'name email avatar')
      .populate('targetClasses', 'classNumber stream')
      .sort({ isPinned: -1, publishDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Announcement.countDocuments(filter);

    res.json({
      announcements,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching parent announcements:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark Announcement as Read
export const markAnnouncementAsRead = async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;

    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    // Check if already read
    const alreadyRead = announcement.readBy.find(
      read => read.userId.toString() === user._id.toString()
    );

    if (!alreadyRead) {
      announcement.readBy.push({
        userId: user._id,
        readAt: new Date()
      });
      await announcement.save();
    }

    res.json({ message: 'Announcement marked as read' });
  } catch (error) {
    console.error('Error marking announcement as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Announcement Statistics (School Admin)
export const getAnnouncementStats = async (req, res) => {
  try {
    const { tenantId } = req;

    const [
      totalAnnouncements,
      activeAnnouncements,
      pinnedAnnouncements,
      announcementsByType,
      announcementsByPriority,
      recentAnnouncements
    ] = await Promise.all([
      Announcement.countDocuments({ tenantId }),
      Announcement.countDocuments({ tenantId, isActive: true }),
      Announcement.countDocuments({ tenantId, isPinned: true }),
      Announcement.aggregate([
        { $match: { tenantId } },
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]),
      Announcement.aggregate([
        { $match: { tenantId } },
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),
      Announcement.find({ tenantId })
        .populate('createdBy', 'name')
        .sort({ publishDate: -1 })
        .limit(5)
        .select('title publishDate createdByName')
    ]);

    res.json({
      totalAnnouncements,
      activeAnnouncements,
      pinnedAnnouncements,
      announcementsByType,
      announcementsByPriority,
      recentAnnouncements
    });
  } catch (error) {
    console.error('Error fetching announcement stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle Announcement Pin Status (School Admin)
export const toggleAnnouncementPin = async (req, res) => {
  try {
    const { tenantId, user } = req;
    const { id } = req.params;

    // Only school_admin can pin/unpin announcements
    if (user.role !== 'school_admin') {
      return res.status(403).json({ 
        message: 'Only school administrators can pin announcements' 
      });
    }

    const announcement = await Announcement.findOne({ _id: id, tenantId });
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    announcement.isPinned = !announcement.isPinned;
    await announcement.save();

    res.json({
      message: `Announcement ${announcement.isPinned ? 'pinned' : 'unpinned'} successfully`,
      isPinned: announcement.isPinned
    });
  } catch (error) {
    console.error('Error toggling announcement pin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
