import User from '../models/User.js';
import Organization from '../models/Organization.js';
import Company from '../models/Company.js';
import SchoolStudent from '../models/School/SchoolStudent.js';
import SchoolClass from '../models/School/SchoolClass.js';
import UserSubscription from '../models/UserSubscription.js';
import Subscription from '../models/Subscription.js';
import bcrypt from 'bcrypt';

const isStudentRole = (role) => role === 'student' || role === 'school_student';

const mapOrganizationToSchoolProfile = (organization) => {
  if (!organization) return null;
  return {
    id: organization._id,
    name: organization.name,
    tenantId: organization.tenantId,
    linkingCode: organization.linkingCode,
    linkingCodeIssuedAt: organization.linkingCodeIssuedAt,
    contactInfo: organization.settings?.contactInfo || {},
  };
};

const buildStudentSchoolDetails = async (user, organization) => {
  const baseDetails = {
    schoolName: organization?.name || null,
    teacherName: null,
    teacherId: null,
    classGrade: null,
    classNumber: null,
    section: null,
    stream: null,
    academicYear: null,
    admissionNumber: null,
    rollNumber: null,
  };

  if (
    !user ||
    !isStudentRole(user.role) ||
    !user.orgId ||
    !user.tenantId
  ) {
    return baseDetails;
  }

  try {
    const studentRecord = await SchoolStudent.findOne({
      tenantId: user.tenantId,
      userId: user._id,
      orgId: user.orgId,
    })
      .select('admissionNumber rollNumber classId section academicYear')
      .lean();

    if (!studentRecord) {
      return baseDetails;
    }

    let classDoc = null;
    if (studentRecord.classId) {
      classDoc = await SchoolClass.findById(studentRecord.classId)
        .populate({
          path: 'sections.classTeacher',
          select: 'name fullName email',
        })
        .lean();
    }

    const details = { ...baseDetails };
    details.admissionNumber = studentRecord.admissionNumber || null;
    details.rollNumber = studentRecord.rollNumber || null;
    details.section = studentRecord.section || null;
    details.academicYear = studentRecord.academicYear || null;

    if (classDoc) {
      details.classNumber = classDoc.classNumber ?? null;
      details.stream = classDoc.stream ?? null;
      if (!details.academicYear) {
        details.academicYear = classDoc.academicYear ?? null;
      }

      if (Array.isArray(classDoc.sections) && details.section) {
        const matchingSection = classDoc.sections.find(
          (section) =>
            section.name?.toString() === details.section?.toString()
        );

        if (matchingSection) {
          const teacher = matchingSection.classTeacher;
          if (teacher) {
            details.teacherName =
              teacher.fullName || teacher.name || teacher.email || null;
            details.teacherId =
              teacher._id?.toString?.() ||
              (typeof teacher === 'string' ? teacher : null);
          }
        }
      }

      const parts = [];
      if (details.classNumber !== null && details.classNumber !== undefined) {
        parts.push(`Class ${details.classNumber}`);
      }
      if (details.stream) {
        parts.push(details.stream);
      }
      if (details.section) {
        parts.push(`Section ${details.section}`);
      }

      details.classGrade = parts.length ? parts.join(' · ') : null;
    }

    return details;
  } catch (error) {
    console.error('Failed to build student school details:', error);
    return baseDetails;
  }
};

const buildTeacherSchoolDetails = async (user, organization) => {
  const baseDetails = {
    schoolName: organization?.name || null,
    totalClasses: 0,
    totalSections: 0,
    totalStudents: 0,
    totalSubjects: 0,
    subjects: [],
    classes: [],
    lastUpdated: new Date(),
  };

  if (
    !user ||
    user.role !== 'school_teacher' ||
    !user.orgId ||
    !user.tenantId
  ) {
    return baseDetails;
  }

  try {
    const classQuery = {
      tenantId: user.tenantId,
      orgId: user.orgId,
      isActive: true,
      $or: [
        { 'sections.classTeacher': user._id },
        { 'subjects.teachers': user._id },
      ],
    };

    const classDocs = await SchoolClass.find(classQuery)
      .select(
        'classNumber stream sections subjects academicYear orgId tenantId isActive'
      )
      .lean();

    if (!classDocs?.length) {
      return baseDetails;
    }

    const subjectsSet = new Set();
    const classesEnriched = await Promise.all(
      classDocs.map(async (classDoc) => {
        const classLabelParts = [];
        if (classDoc.classNumber !== undefined && classDoc.classNumber !== null) {
          classLabelParts.push(`Class ${classDoc.classNumber}`);
        }
        if (classDoc.stream) {
          classLabelParts.push(classDoc.stream);
        }

        const sections = Array.isArray(classDoc.sections)
          ? classDoc.sections
          : [];

        const relevantSections = sections.filter((section) =>
          section?.classTeacher?.toString?.() === user._id.toString()
        );

        const subjects = Array.isArray(classDoc.subjects)
          ? classDoc.subjects.filter((subject) =>
              Array.isArray(subject?.teachers)
                ? subject.teachers.some(
                    (teacherId) => teacherId?.toString?.() === user._id.toString()
                  )
                : false
            )
          : [];

        subjects.forEach((subject) => {
          if (subject?.name) {
            subjectsSet.add(subject.name);
          }
        });

        let sectionSummaries = await Promise.all(
          relevantSections.map(async (section) => {
            const studentCount = await SchoolStudent.countDocuments({
              tenantId: user.tenantId,
              orgId: user.orgId,
              classId: classDoc._id,
              section: section.name,
            }).catch(() => 0);

            return {
              name: section.name,
              studentCount,
              capacity: section.capacity ?? null,
              role: 'Class Teacher',
              currentStrength: section.currentStrength ?? null,
            };
          })
        );

        if (!sectionSummaries.length) {
          const totalStudents = await SchoolStudent.countDocuments({
            tenantId: user.tenantId,
            orgId: user.orgId,
            classId: classDoc._id,
          }).catch(() => 0);

          sectionSummaries = [
            {
              name: 'All Sections',
              studentCount: totalStudents,
              capacity: null,
              role: 'Subject Teacher',
              currentStrength: null,
            },
          ];
        }

        const subjectSummaries = subjects.map((subject) => ({
          name: subject.name,
          code: subject.code || null,
          isOptional: Boolean(subject.isOptional),
        }));

        return {
          id: classDoc._id,
          label: classLabelParts.join(' · ') || 'Class Assignment',
          academicYear: classDoc.academicYear || null,
          sections: sectionSummaries,
          subjects: subjectSummaries,
        };
      })
    );

    const totals = classesEnriched.reduce(
      (acc, classInfo) => {
        acc.totalClasses += 1;
        acc.totalSections += classInfo.sections.length;
        acc.totalStudents += classInfo.sections.reduce(
          (sectionTotal, section) => sectionTotal + (section.studentCount || 0),
          0
        );
        return acc;
      },
      { totalClasses: 0, totalSections: 0, totalStudents: 0 }
    );

    return {
      ...baseDetails,
      schoolName: baseDetails.schoolName,
      totalClasses: totals.totalClasses,
      totalSections: totals.totalSections,
      totalStudents: totals.totalStudents,
      totalSubjects: subjectsSet.size,
      subjects: Array.from(subjectsSet),
      classes: classesEnriched,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error('Failed to build teacher school details:', error);
    return baseDetails;
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp -otpExpiresAt -otpType');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Generate linking code for school_students if missing (similar to organization linking codes)
    if (user.role === 'school_student' && !user.linkingCode) {
      try {
        const prefix = 'SST';
        user.linkingCode = await User.generateUniqueLinkingCode(prefix);
        user.linkingCodeIssuedAt = new Date();
        await user.save();
      } catch (err) {
        console.error('Failed to generate linking code for school_student:', err);
      }
    }
    
    const baseProfile = {
      fullName: user.fullName || user.name,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      location: user.location || user.city || '',
      website: user.website || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
      position: user.professional?.position || user.metadata?.position || user.position || '',
      joiningDate: user.professional?.joiningDate || user.metadata?.joiningDate || user.joiningDate || user.createdAt || null,
      dateOfBirth: user.dateOfBirth || user.dob || null,
      dob: user.dob || null,
      gender: user.gender || null,
      role: user.role || '',
      createdAt: user.createdAt || null,
      subject: user.subject || '', // Include subject for school teachers
      academic: user.academic || {},
      linkingCode: user.linkingCode || null, // Include linking code for all users
      linkingCodeIssuedAt: user.linkingCodeIssuedAt || null,
      fromGoogle: user.fromGoogle || false, // Include fromGoogle flag
      preferences: user.preferences || {
        language: 'en',
        notifications: { email: true, push: true, sms: false },
        privacy: { profileVisibility: 'friends', contactInfo: 'friends', academicInfo: 'private' },
        sound: { effects: true, music: true, volume: 75 }
      },
    };

    const profileData = {
      ...baseProfile,
      ...(!isStudentRole(user.role)
        ? { professional: user.professional || {} }
        : {}),
      metadata: user.metadata || {},
    };

    // Include admin-specific fields
    if (user.role === 'admin') {
      profileData.adminLevel = user.adminLevel || 'standard';
      profileData.permissions = user.permissions || [];
    }

    let organization = null;
    if (user.orgId) {
      try {
        organization = await Organization.findById(user.orgId);
        if (organization) {
          if (!organization.linkingCode) {
            organization.linkingCode = await Organization.generateUniqueLinkingCode("SC");
            organization.linkingCodeIssuedAt = new Date();
            await organization.save();
          }

          const schoolProfile = mapOrganizationToSchoolProfile(organization);
          if (schoolProfile) {
            profileData.school = schoolProfile;
            profileData.schoolLinkingCode = schoolProfile.linkingCode;
            profileData.schoolLinkingCodeIssuedAt = schoolProfile.linkingCodeIssuedAt;
          }
        }
      } catch (orgError) {
        console.error('Failed to load organization for profile:', orgError);
      }
    }

    if (!profileData.phone && organization?.settings?.contactInfo?.phone) {
      profileData.phone = organization.settings.contactInfo.phone;
    }

    if (!profileData.phone && organization?.companyId) {
      try {
        const company = await Company.findById(organization.companyId).select('contactInfo').lean();
        if (company?.contactInfo?.phone) {
          profileData.phone = company.contactInfo.phone;
        }
      } catch (companyError) {
        console.error('Failed to load company contact info:', companyError);
      }
    }

    if (isStudentRole(user.role)) {
      const schoolDetails = await buildStudentSchoolDetails(
        user,
        organization || profileData.school
      );
      profileData.schoolDetails = schoolDetails;

      // Include linked parent information for students
      if (user.linkedIds?.parentIds && user.linkedIds.parentIds.length > 0) {
        try {
          const parents = await User.find({
            _id: { $in: user.linkedIds.parentIds },
            role: { $in: ['parent', 'school_parent'] }
          }).select('_id name fullName email linkingCode').lean();

          profileData.linkedParents = parents.map(parent => ({
            id: parent._id,
            name: parent.fullName || parent.name || parent.email,
            email: parent.email,
            linkingCode: parent.linkingCode,
          }));
        } catch (err) {
          console.error('Failed to load linked parents:', err);
          profileData.linkedParents = [];
        }
      } else {
        profileData.linkedParents = [];
      }
    } else if (user.role === 'school_teacher') {
      const teacherDetails = await buildTeacherSchoolDetails(
        user,
        organization || profileData.school
      );
      profileData.teacherDetails = teacherDetails;
    }

    res.status(200).json({
      data: profileData,
      ...profileData,
    });
  } catch (err) {
    console.error('❌ Get profile error:', err);
    res.status(500).json({ message: 'Failed to load profile' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const body = req.body || {};

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Basic fields (gender and dateOfBirth are excluded - they cannot be updated through profile)
    ['name', 'dob', 'institution', 'username', 'city', 'language', 'guardianEmail', 'phone', 'location', 'website', 'bio', 'avatar']
      .forEach((field) => {
        if (body[field] !== undefined) user[field] = body[field];
      });

    // Note: dateOfBirth and gender are set during account creation and cannot be updated through profile

    // Nested objects from tabs - exclude gender and dateOfBirth from personal updates
    if (body.personal) {
      const { gender, dateOfBirth, dob, ...personalFields } = body.personal;
      Object.assign(user, personalFields);
    }
    if (body.academic) user.academic = { ...(user.academic || {}), ...body.academic };

    if (user.role !== 'student' && user.role !== 'school_student') {
      if (body.professional) {
        user.professional = { ...(user.professional || {}), ...body.professional };
      }
    } else if (user.professional !== undefined && Object.keys(user.professional || {}).length > 0) {
      user.professional = undefined;
      user.markModified?.('professional');
    }
    if (body.preferences) user.preferences = { ...(user.preferences || {}), ...body.preferences };

    await user.save();

    let organization = null;
    try {
      if (user.orgId) {
        organization = await Organization.findById(user.orgId);
        if (organization && !organization.linkingCode) {
          organization.linkingCode = await Organization.generateUniqueLinkingCode("SC");
          organization.linkingCodeIssuedAt = new Date();
          await organization.save();
        }
      }
    } catch (orgError) {
      console.error('Failed to refresh organization for profile update:', orgError);
    }

    const schoolProfile = mapOrganizationToSchoolProfile(organization);
    let schoolDetails = null;
    let teacherDetails = null;

    if (isStudentRole(user.role)) {
      schoolDetails = await buildStudentSchoolDetails(
        user,
        organization || schoolProfile
      );
    } else if (user.role === 'school_teacher') {
      teacherDetails = await buildTeacherSchoolDetails(
        user,
        organization || schoolProfile
      );
    }

    const payload = {
      userId: user._id,
      fullName: user.fullName || user.name,
      name: user.name,
      email: user.email,
      role: user.role,
      institution: user.institution,
      city: user.city,
      location: user.location || user.city,
      avatar: user.avatar,
      dob: user.dob,
      dateOfBirth: user.dateOfBirth || user.dob,
      gender: user.gender || null,
      username: user.username,
      language: user.language,
      guardianEmail: user.guardianEmail,
      phone: user.phone,
      website: user.website,
      bio: user.bio,
      academic: user.academic,
      ...(user.role !== 'student' && user.role !== 'school_student'
        ? { professional: user.professional }
        : {}),
      preferences: user.preferences,
      updatedAt: user.updatedAt,
      ...(schoolProfile ? { school: schoolProfile } : {}),
      ...(schoolDetails ? { schoolDetails } : {}),
      ...(teacherDetails ? { teacherDetails } : {}),
    };

    // Emit real-time updates via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('admin:profile:update', payload);
      io.to(user._id.toString()).emit('user:profile:updated', payload);
    }

    res.status(200).json({ 
      message: 'Profile updated successfully',
      user: {
        fullName: user.fullName || user.name,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        phone: user.phone,
        location: user.location,
        website: user.website,
        bio: user.bio,
        academic: user.academic,
        preferences: user.preferences,
        ...(schoolProfile ? { school: schoolProfile } : {}),
        ...(schoolDetails ? { schoolDetails } : {}),
        ...(teacherDetails ? { teacherDetails } : {}),
      },
    });
  } catch (err) {
    console.error('❌ Profile update error:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

export const updateUserAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // If file uploaded via multer
    if (req.file) {
      // Expose via /uploads/avatars/<filename>
      const publicPath = `/uploads/avatars/${req.file.filename}`;
      user.avatar = publicPath;
      await user.save();
      
      // Emit real-time update
      const io = req.app.get('io');
      if (io) {
        io.to('admin').emit('admin:profile:update', {
          userId: user._id,
          avatar: user.avatar
        });
        io.to(user._id.toString()).emit('user:profile:updated', {
          userId: user._id,
          avatar: user.avatar
        });
      }
      
      return res.status(200).json({ message: 'Avatar updated', avatar: user.avatar });
    }

    // Support URL avatar update via body.avatar
    const { avatar } = req.body || {};
    if (!avatar) return res.status(400).json({ message: 'avatar is required' });

    user.avatar = avatar;
    await user.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to('admin').emit('admin:profile:update', {
        userId: user._id,
        avatar: user.avatar
      });
      io.to(user._id.toString()).emit('user:profile:updated', {
        userId: user._id,
        avatar: user.avatar
      });
    }

    res.status(200).json({ message: 'Avatar updated', avatar: user.avatar });
  } catch (err) {
    console.error('❌ Avatar update error:', err);
    res.status(500).json({ message: 'Failed to update avatar' });
  }
};

export const completeGoogleUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { dateOfBirth, gender, registrationType, schoolLinkingCode } = req.body;

    if (!dateOfBirth || !gender) {
      return res.status(400).json({ 
        message: 'Date of birth and gender are required' 
      });
    }

    // Validate registration type
    if (!registrationType || !['individual', 'school'].includes(registrationType)) {
      return res.status(400).json({ 
        message: 'Registration type must be either "individual" or "school"' 
      });
    }

    // If school registration, validate linking code
    if (registrationType === 'school' && (!schoolLinkingCode || !schoolLinkingCode.trim())) {
      return res.status(400).json({ 
        message: 'School linking code is required for school registration' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only allow Google users to complete their profile
    if (!user.fromGoogle) {
      return res.status(403).json({ 
        message: 'This endpoint is only for Google sign-in users' 
      });
    }

    // Check if profile is already completed
    if (user.dateOfBirth && user.gender) {
      return res.status(400).json({ 
        message: 'Profile already completed' 
      });
    }

    // Validate date of birth
    const parsedDob = new Date(dateOfBirth);
    if (isNaN(parsedDob.getTime())) {
      return res.status(400).json({ message: 'Invalid date of birth format' });
    }
    const currentDate = new Date();
    if (parsedDob > currentDate) {
      return res.status(400).json({ message: 'Date of birth cannot be in the future' });
    }

    // Validate gender
    const validGenders = ['male', 'female', 'non_binary', 'prefer_not_to_say', 'other'];
    if (!validGenders.includes(gender.toLowerCase())) {
      return res.status(400).json({ 
        message: `Gender must be one of: ${validGenders.join(', ')}` 
      });
    }

    // Update user profile
    user.dateOfBirth = parsedDob;
    user.dob = dateOfBirth; // Also update legacy field
    user.gender = gender.toLowerCase();

    // Handle registration type
    if (registrationType === 'individual') {
      // Enroll in freemium plan
      const existingSubscription = await UserSubscription.findOne({
        userId: user._id,
        status: 'active'
      });

      if (!existingSubscription) {
        await UserSubscription.create({
          userId: user._id,
          planType: 'free',
          planName: 'Free Plan',
          amount: 0,
          status: 'active',
          startDate: new Date(),
          features: {
            fullAccess: false,
            parentDashboard: false,
            advancedAnalytics: false,
            certificates: false,
            wiseClubAccess: false,
            inavoraAccess: false,
            gamesPerPillar: 5,
            totalGames: 50,
          },
          metadata: {
            registrationType: 'individual',
            completedAt: new Date(),
          },
        });
        console.log(`✅ Created freemium subscription for user: ${user._id}`);
      }
    } else if (registrationType === 'school') {
      // Link with school using registration code
      const normalizedSchoolCode = schoolLinkingCode.trim().toUpperCase();

      // Try to find teacher with registration code
      let teacher = await User.findOne({ 'metadata.registrationCodes.code': normalizedSchoolCode });
      if (!teacher) {
        teacher = await User.findOne({
          'metadata.registrationCodes.code': schoolLinkingCode.trim(),
        });
      }

      let registrationRecord = null;
      let schoolClass = null;
      let organization = null;

      if (teacher) {
        const registrationEntries = Array.isArray(teacher.metadata?.registrationCodes)
          ? teacher.metadata.registrationCodes
          : [];
        registrationRecord = registrationEntries.find(
          (entry) => String(entry?.code || '').toUpperCase() === normalizedSchoolCode,
        );
      }

      if (registrationRecord) {
        if (registrationRecord.expiresAt && new Date(registrationRecord.expiresAt) < new Date()) {
          return res.status(400).json({ message: 'This school code has expired.' });
        }

        if (!registrationRecord.classId) {
          return res.status(400).json({ message: 'This school code is missing class information.' });
        }

        schoolClass = await SchoolClass.findById(registrationRecord.classId);
        if (!schoolClass) {
          return res.status(404).json({ message: 'Class not found for provided school code.' });
        }
      } else {
        // Try organization linking code
        organization = await Organization.findOne({
          linkingCode: normalizedSchoolCode,
        });

        if (!organization) {
          organization = await Organization.findOne({ linkingCode: schoolLinkingCode.trim() });
        }

        if (!organization) {
          return res.status(404).json({ message: 'No school found for the provided code.' });
        }
      }

      const targetOrgId = schoolClass?.orgId || organization?._id;
      const targetTenantId = schoolClass?.tenantId || organization?.tenantId;

      // Check school subscription
      const subscription = await Subscription.findOne({
        tenantId: targetTenantId,
        orgId: targetOrgId,
      });

      const now = new Date();
      let isPlanActive = false;
      let planStatus = 'inactive';
      let planEndDate = null;
      let subscriptionPlanName = null;

      if (subscription) {
        subscriptionPlanName = subscription.plan?.name || subscription.plan?.planType || null;
        const endDate = subscription.endDate ? new Date(subscription.endDate) : null;
        if (subscription.status === 'active' && (!endDate || endDate > now)) {
          isPlanActive = true;
          planStatus = 'active';
          planEndDate = endDate;
        } else {
          planStatus = subscription.status || 'inactive';
          planEndDate = endDate && endDate > now ? endDate : null;
        }
      }

      // Determine plan type based on school subscription
      let planType = 'free';
      if (isPlanActive) {
        if (subscriptionPlanName === 'student_parent_premium_pro') {
          planType = 'student_parent_premium_pro';
        } else if (subscriptionPlanName === 'educational_institutions_premium') {
          planType = 'educational_institutions_premium';
        } else {
          planType = 'student_premium';
        }
      }

      // Update user role to school_student
      user.role = 'school_student';
      user.orgId = targetOrgId;
      user.tenantId = targetTenantId;

      // Link with teacher if exists
      if (teacher?._id) {
        if (!user.linkedIds) {
          user.linkedIds = { parentIds: [], childIds: [], teacherIds: [], studentIds: [] };
        }
        if (!user.linkedIds.teacherIds) {
          user.linkedIds.teacherIds = [];
        }
        if (!user.linkedIds.teacherIds.includes(teacher._id)) {
          user.linkedIds.teacherIds.push(teacher._id);
        }
      }

      // Don't save here - will save at the end

      // Create or update SchoolStudent record
      // Note: SchoolStudent model requires tenantId in all queries
      let schoolStudent = await SchoolStudent.findOne({ userId: user._id, tenantId: targetTenantId });
      if (!schoolStudent) {
        const admissionNumber = `ADM${new Date().getFullYear()}${Date.now().toString().slice(-6)}`;
        const rollNumber = `ROLL${Date.now().toString().slice(-6)}`;

        schoolStudent = await SchoolStudent.create({
          userId: user._id,
          orgId: targetOrgId,
          tenantId: targetTenantId,
          classId: schoolClass?._id || null,
          admissionNumber,
          rollNumber,
          academicYear: schoolClass?.academicYear || organization?.settings?.academicYear?.current || new Date().getFullYear().toString(),
        });
      } else {
        // Update existing school student record
        schoolStudent.orgId = targetOrgId;
        schoolStudent.tenantId = targetTenantId;
        if (schoolClass?._id) {
          schoolStudent.classId = schoolClass._id;
        }
        await schoolStudent.save();
      }

      // Create or update user subscription based on school plan
      const existingUserSubscription = await UserSubscription.findOne({
        userId: user._id,
        status: 'active'
      });

      const planFeatures = {
        free: {
          fullAccess: false,
          parentDashboard: false,
          advancedAnalytics: false,
          certificates: false,
          wiseClubAccess: false,
          inavoraAccess: false,
          gamesPerPillar: 5,
          totalGames: 50,
        },
        student_premium: {
          fullAccess: true,
          parentDashboard: false,
          advancedAnalytics: true,
          certificates: true,
          wiseClubAccess: true,
          inavoraAccess: true,
          gamesPerPillar: -1,
          totalGames: 2200,
        },
        student_parent_premium_pro: {
          fullAccess: true,
          parentDashboard: true,
          advancedAnalytics: true,
          certificates: true,
          wiseClubAccess: true,
          inavoraAccess: true,
          gamesPerPillar: -1,
          totalGames: 2200,
        },
        educational_institutions_premium: {
          fullAccess: true,
          parentDashboard: true,
          advancedAnalytics: true,
          certificates: true,
          wiseClubAccess: true,
          inavoraAccess: true,
          gamesPerPillar: -1,
          totalGames: 2200,
        },
      };

      if (existingUserSubscription) {
        // Update existing subscription
        existingUserSubscription.planType = planType;
        existingUserSubscription.planName = planType === 'free' ? 'Free Plan' : 
          planType === 'student_premium' ? 'Students Premium Plan' :
          planType === 'student_parent_premium_pro' ? 'Student + Parent Premium Pro Plan' :
          'Educational Institutions Premium Plan';
        existingUserSubscription.features = planFeatures[planType];
        existingUserSubscription.metadata = {
          ...(existingUserSubscription.metadata || {}),
          registrationType: 'school',
          orgId: targetOrgId,
          tenantId: targetTenantId,
          registrationCode: normalizedSchoolCode,
          linkedTeacherId: teacher?._id || null,
          completedAt: new Date(),
        };
        await existingUserSubscription.save();
      } else {
        // Create new subscription
        await UserSubscription.create({
          userId: user._id,
          planType: planType,
          planName: planType === 'free' ? 'Free Plan' : 
            planType === 'student_premium' ? 'Students Premium Plan' :
            planType === 'student_parent_premium_pro' ? 'Student + Parent Premium Pro Plan' :
            'Educational Institutions Premium Plan',
          amount: 0,
          status: 'active',
          startDate: new Date(),
          endDate: planEndDate || undefined,
          features: planFeatures[planType],
          metadata: {
            registrationType: 'school',
            orgId: targetOrgId,
            tenantId: targetTenantId,
            registrationCode: normalizedSchoolCode,
            linkedTeacherId: teacher?._id || null,
            completedAt: new Date(),
          },
        });
      }

      console.log(`✅ Linked user ${user._id} with school ${targetOrgId} using code ${normalizedSchoolCode}`);
    }

    // Save user changes (only once at the end)
    await user.save();

    // Save user changes (only once at the end)
    await user.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      try {
        // Get updated subscription for real-time update
        const updatedSubscription = await UserSubscription.getActiveSubscription(user._id);
        
        io.to(user._id.toString()).emit('user:profile:updated', {
          userId: user._id,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          registrationType,
          role: user.role,
        });

        // Emit subscription update if subscription was created/updated
        if (updatedSubscription) {
          io.to(user._id.toString()).emit('subscription:activated', {
            subscription: updatedSubscription.toObject ? updatedSubscription.toObject() : updatedSubscription,
          });
        }
      } catch (socketError) {
        console.error('Error emitting socket events:', socketError);
        // Don't fail the request if socket emission fails
      }
    }

    res.status(200).json({ 
      message: 'Profile completed successfully',
      user: {
        id: user._id,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        registrationType,
        role: user.role,
      }
    });
  } catch (err) {
    console.error('❌ Complete Google profile error:', err);
    res.status(500).json({ message: 'Failed to complete profile', error: err.message });
  }
};

export const updateUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if user has a password (not Google login)
    if (!user.password) {
      return res.status(400).json({ message: 'Cannot change password for Google login accounts' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Check if new password is different from current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: 'New password must be different from current password' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('❌ Password update error:', err);
    res.status(500).json({ message: 'Failed to update password' });
  }
};

// Get user settings
export const getUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('settings preferences');
    
    const defaultSettings = {
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        notifyOnApproval: true,
        notifyOnAssignment: true,
        notifyOnWellbeing: true,
        notifyOnSystemUpdates: true,
        notifyOnNewStudent: false,
        notifyOnAttendanceAlert: true,
        digestFrequency: 'daily'
      },
      privacy: {
        showEmailToTeachers: true,
        showPhoneToTeachers: false,
        allowDataExport: true,
        twoFactorAuth: false,
        sessionTimeout: 30
      },
      display: {
        theme: 'light',
        language: 'en',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '12h',
        timezone: 'Asia/Kolkata',
        compactMode: false,
        animationsEnabled: true,
        soundEnabled: false
      }
    };

    res.json({
      settings: {
        notifications: { ...defaultSettings.notifications, ...(user.settings?.notifications || user.preferences?.notifications || {}) },
        privacy: { ...defaultSettings.privacy, ...(user.settings?.privacy || {}) },
        display: { ...defaultSettings.display, ...(user.settings?.display || user.preferences || {}) }
      }
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
};

// Update user settings
export const updateUserSettings = async (req, res) => {
  try {
    const { section, settings } = req.body;
    console.log('🔧 Backend: Updating settings', { section, settings, userId: req.user._id });
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      console.error('❌ Backend: User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.settings) user.settings = {};
    
    if (section === 'notifications') {
      user.settings.notifications = { ...(user.settings.notifications || {}), ...settings };
    } else if (section === 'privacy') {
      user.settings.privacy = { ...(user.settings.privacy || {}), ...settings };
    } else if (section === 'display') {
      user.settings.display = { ...(user.settings.display || {}), ...settings };
      // Also update user.preferences for backward compatibility
      user.preferences = { ...(user.preferences || {}), ...settings };
    } else {
      console.warn('⚠️ Backend: Unknown section:', section);
      return res.status(400).json({ message: `Unknown section: ${section}` });
    }

    user.markModified('settings');
    user.markModified('preferences');
    await user.save();
    
    console.log('✅ Backend: Settings saved successfully', user.settings);

    // Emit real-time updates via Socket.IO
    const io = req.app.get('io');
    if (io) {
      // Broadcast to all user sessions
      Object.keys(settings).forEach(key => {
        io.to(user._id.toString()).emit('settings:updated', {
          userId: user._id.toString(),
          section: section,
          key: key,
          value: settings[key]
        });
      });
    }

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: user.settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Failed to update settings' });
  }
};

// Export user data
export const exportUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -otp -otpExpiresAt');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const exportData = {
      profile: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        dateOfBirth: user.dateOfBirth,
        joiningDate: user.createdAt
      },
      settings: user.settings || {},
      preferences: user.preferences || {},
      academic: user.academic || {},
      professional: user.professional || {},
      metadata: {
        accountCreated: user.createdAt,
        lastUpdated: user.updatedAt,
        lastActive: user.lastActive,
        exportedAt: new Date()
      }
    };

    res.json(exportData);
  } catch (error) {
    console.error('Error exporting user data:', error);
    res.status(500).json({ message: 'Failed to export data' });
  }
};

// Check if user profile needs completion (for age-restricted content)
export const checkProfileCompletion = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('dateOfBirth dob gender name email').lean();
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const hasDateOfBirth = !!(user.dateOfBirth || user.dob);
    const hasGender = !!user.gender;
    
    // Calculate age if dateOfBirth exists
    let userAge = null;
    if (hasDateOfBirth) {
      const dob = user.dateOfBirth || new Date(user.dob);
      const today = new Date();
      userAge = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        userAge--;
      }
    }
    
    // Determine accessible modules based on age
    let accessibleModules = {
      kids: false,
      teens: false,
      adults: false
    };
    
    if (userAge !== null) {
      accessibleModules.kids = userAge < 18;
      accessibleModules.teens = userAge < 18;
      accessibleModules.adults = userAge >= 18;
    }
    
    res.json({
      profileComplete: hasDateOfBirth && hasGender,
      hasDateOfBirth,
      hasGender,
      userAge,
      accessibleModules,
      requiresProfileCompletion: !hasDateOfBirth,
      message: !hasDateOfBirth 
        ? 'Please complete your profile with your date of birth to access age-restricted content.'
        : 'Profile is complete.'
    });
  } catch (error) {
    console.error('Error checking profile completion:', error);
    res.status(500).json({ message: 'Failed to check profile completion' });
  }
};

// Get admin profile stats
export const getAdminProfileStats = async (req, res) => {
  try {
    const { tenantId } = req;
    
    // Import models
    const SchoolStudent = (await import('../models/School/SchoolStudent.js')).default;
    const Assignment = (await import('../models/Assignment.js')).default;
    
    const [totalStudents, totalTeachers, assignmentsApproved] = await Promise.all([
      SchoolStudent.countDocuments({ tenantId }),
      User.countDocuments({ tenantId, role: 'school_teacher' }),
      Assignment.countDocuments({ 
        tenantId,
        status: 'approved',
        approvedBy: req.user._id
      })
    ]);

    // Calculate days active
    const joinDate = req.user.createdAt || new Date();
    const daysActive = Math.floor((new Date() - new Date(joinDate)) / (1000 * 60 * 60 * 24));

    res.json({
      stats: {
        totalStudents,
        totalTeachers,
        assignmentsApproved,
        daysActive
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ 
      stats: {
        totalStudents: 0,
        totalTeachers: 0,
        assignmentsApproved: 0,
        daysActive: 0
      }
    });
  }
};

// Upload avatar
export const uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // If file uploaded via multer
    if (req.file) {
      const publicPath = `/uploads/avatars/${req.file.filename}`;
      user.avatar = publicPath;
      await user.save();
      return res.status(200).json({ 
        message: 'Avatar uploaded successfully',
        avatarUrl: user.avatar 
      });
    }

    res.status(400).json({ message: 'No file uploaded' });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ message: 'Failed to upload avatar' });
  }
};

// 👥 GET /api/user/students — Get all students (for admin)
export const getAllStudents = async (req, res) => {
  try {
    // Check if user is admin or school_admin
    if (!['admin', 'school_admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to access student data' });
    }
    
    // Get all students
    const students = await User.find({ role: 'student' })
      .select('name email avatar institution city dob lastActive createdAt');
    
    res.status(200).json(students);
  } catch (err) {
    console.error('❌ Get students error:', err);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
};
