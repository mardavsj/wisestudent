import Program from "../models/Program.js";
import ProgramSchool from "../models/ProgramSchool.js";
import ProgramCheckpoint from "../models/ProgramCheckpoint.js";
import ProgramMetrics from "../models/ProgramMetrics.js";
import SchoolStudent from "../models/School/SchoolStudent.js";
import CSRSponsor from "../models/CSRSponsor.js";
import Organization from "../models/Organization.js";

/**
 * Create a new program for a CSR partner
 * @param {ObjectId} adminId - Admin user creating the program
 * @param {Object} data - Program data
 * @returns {Object} Created program with checkpoints
 */
export const createProgram = async (adminId, data) => {
  // Validate CSR partner exists and is approved
  const csrPartner = await CSRSponsor.findById(data.csrPartnerId);
  if (!csrPartner) {
    const error = new Error("CSR Partner not found");
    error.status = 404;
    throw error;
  }

  // Check User.approvalStatus instead of CSRSponsor.status
  const User = (await import("../models/User.js")).default;
  const user = await User.findById(csrPartner.userId).select("approvalStatus");
  
  if (!user || user.approvalStatus !== "approved") {
    const error = new Error("CSR Partner must be approved before creating programs");
    error.status = 400;
    throw error;
  }
  
  // Also check business status
  if (csrPartner.status !== "active") {
    const error = new Error("CSR Partner account must be active to create programs");
    error.status = 400;
    throw error;
  }

  // Create Program document
  const program = new Program({
    name: data.name,
    description: data.description,
    csrPartnerId: data.csrPartnerId,
    createdBy: adminId,
    scope: data.scope || {},
    duration: {
      startDate: data.startDate || data.duration?.startDate,
      endDate: data.endDate || data.duration?.endDate,
    },
    status: "draft",
  });

  await program.save();

  // Create 5 ProgramCheckpoint documents (all pending)
  const checkpointTypes = [
    "program_approval",
    "onboarding_confirmation",
    "mid_program_review",
    "completion_review",
    "extension_renewal",
  ];

  const checkpoints = checkpointTypes.map((type, index) => ({
    programId: program._id,
    checkpointNumber: index + 1,
    type,
    status: "pending",
  }));

  await ProgramCheckpoint.insertMany(checkpoints);

  // Create empty ProgramMetrics document
  const metrics = new ProgramMetrics({
    programId: program._id,
  });
  await metrics.save();

  // Return program with populated data
  const populatedProgram = await Program.findById(program._id)
    .populate("csrPartnerId", "companyName contactName email")
    .populate("createdBy", "name email")
    .lean();

  // Notify CSR partner about program creation
  try {
    const { notifyCSRProgramCreated } = await import('../cronJobs/csrNotificationUtils.js');
    await notifyCSRProgramCreated(populatedProgram, csrPartner);
  } catch (error) {
    console.error('Failed to notify CSR about program creation:', error);
    // Don't fail program creation if notification fails
  }

  return {
    ...populatedProgram,
    checkpoints: await ProgramCheckpoint.find({ programId: program._id }).lean(),
  };
};

/**
 * Update an existing program
 * @param {String} programId - Program ID or ObjectId
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated program
 */
export const updateProgram = async (programId, updates) => {
  const program = await Program.findOne({
    $or: [{ _id: programId }, { programId }],
  });

  if (!program) {
    const error = new Error("Program not found");
    error.status = 404;
    throw error;
  }

  // Only allow updates if status is 'draft' or 'approved'
  if (!["draft", "approved"].includes(program.status)) {
    const error = new Error("Cannot update program after implementation has started");
    error.status = 400;
    throw error;
  }

  // Cannot update csrPartnerId
  const { csrPartnerId, ...allowedUpdates } = updates;

  // Update allowed fields
  if (allowedUpdates.name) program.name = allowedUpdates.name;
  if (allowedUpdates.description) program.description = allowedUpdates.description;
  if (allowedUpdates.scope) {
    program.scope = { ...program.scope.toObject?.() || program.scope, ...allowedUpdates.scope };
  }
  if (allowedUpdates.duration) {
    program.duration = { ...program.duration.toObject?.() || program.duration, ...allowedUpdates.duration };
  }
  if (allowedUpdates.status && ["draft", "approved"].includes(allowedUpdates.status)) {
    program.status = allowedUpdates.status;
  }

  await program.save();

  return Program.findById(program._id)
    .populate("csrPartnerId", "companyName contactName email")
    .populate("createdBy", "name email")
    .lean();
};

/**
 * Get a single program by ID
 * @param {String} programId - Program ID or ObjectId
 * @returns {Object} Program with metrics and checkpoints
 */
export const getProgram = async (programId) => {
  const program = await Program.findOne({
    $or: [{ _id: programId }, { programId }],
  })
    .populate("csrPartnerId", "companyName contactName email phone")
    .populate("createdBy", "name email")
    .lean();

  if (!program) {
    const error = new Error("Program not found");
    error.status = 404;
    throw error;
  }

  // Get metrics and checkpoints
  const [metrics, checkpoints, schoolCount] = await Promise.all([
    ProgramMetrics.findOne({ programId: program._id }).lean(),
    ProgramCheckpoint.find({ programId: program._id }).sort({ checkpointNumber: 1 }).lean(),
    ProgramSchool.countDocuments({ programId: program._id }),
  ]);

  return {
    ...program,
    metrics: metrics || {},
    checkpoints: checkpoints || [],
    schoolsAssigned: schoolCount,
  };
};

/**
 * List programs with filters and pagination
 * @param {Object} filters - Filter options
 * @returns {Object} { programs, total, page, pages }
 */
export const listPrograms = async (filters = {}) => {
  const {
    csrPartnerId,
    status,
    startDate,
    endDate,
    page = 1,
    limit = 10,
    search,
  } = filters;

  const query = {};

  // Filter by CSR Partner
  if (csrPartnerId) {
    query.csrPartnerId = csrPartnerId;
  }

  // Filter by status
  if (status) {
    if (Array.isArray(status)) {
      query.status = { $in: status };
    } else {
      query.status = status;
    }
  }

  // Filter by date range
  if (startDate || endDate) {
    query["duration.startDate"] = {};
    if (startDate) {
      query["duration.startDate"].$gte = new Date(startDate);
    }
    if (endDate) {
      query["duration.endDate"] = { $lte: new Date(endDate) };
    }
  }

  // Search by name
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const skip = (page - 1) * limit;

  const [programs, total] = await Promise.all([
    Program.find(query)
      .populate("csrPartnerId", "companyName contactName")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Program.countDocuments(query),
  ]);

  const programIds = programs.map((p) => p._id);

  const programSchoolsList = await ProgramSchool.find({ programId: { $in: programIds } })
    .select("programId schoolId")
    .lean();

  const schoolIds = [...new Set(programSchoolsList.map((ps) => ps.schoolId).filter(Boolean))];
  let studentCountsByOrg = {};
  if (schoolIds.length > 0) {
    const agg = await SchoolStudent.aggregate([
      { $match: { orgId: { $in: schoolIds } } },
      { $group: { _id: "$orgId", count: { $sum: 1 } } },
    ]);
    agg.forEach((row) => {
      studentCountsByOrg[row._id?.toString()] = row.count ?? 0;
    });
  }

  const programIdToSchoolIds = {};
  const programIdToSchoolCount = {};
  programSchoolsList.forEach((ps) => {
    const pid = ps.programId?.toString();
    if (!pid) return;
    if (!programIdToSchoolIds[pid]) programIdToSchoolIds[pid] = [];
    programIdToSchoolIds[pid].push(ps.schoolId);
    programIdToSchoolCount[pid] = (programIdToSchoolCount[pid] || 0) + 1;
  });

  const programsWithCounts = programs.map((program) => {
    const pid = program._id.toString();
    const schoolIds = programIdToSchoolIds[pid] || [];
    const schoolCount = programIdToSchoolCount[pid] ?? 0;
    let totalStudents = 0;
    schoolIds.forEach((sid) => {
      totalStudents += studentCountsByOrg[sid?.toString()] ?? 0;
    });
    const metrics = {
      ...(program.metrics || {}),
      totalStudents,
      studentsOnboarded: totalStudents > 0 ? totalStudents : (program.metrics?.studentsOnboarded ?? 0),
    };
    return { ...program, schoolsAssigned: schoolCount, metrics };
  });

  return {
    programs: programsWithCounts,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    limit: Number(limit),
  };
};

/**
 * Archive a program
 * @param {String} programId - Program ID or ObjectId
 * @returns {Object} Updated program
 */
export const archiveProgram = async (programId) => {
  const program = await Program.findOne({
    $or: [{ _id: programId }, { programId }],
  });

  if (!program) {
    const error = new Error("Program not found");
    error.status = 404;
    throw error;
  }

  // Update status to completed (archived)
  program.status = "completed";
  await program.save();

  return Program.findById(program._id)
    .populate("csrPartnerId", "companyName contactName email")
    .populate("createdBy", "name email")
    .lean();
};

/**
 * Permanently delete a program and all related data (schools, metrics, checkpoints).
 * The program will no longer appear for the assigned CSR.
 * @param {String} programId - Program ID or ObjectId
 * @returns {Object} { deleted: true, programId }
 */
export const deleteProgramPermanent = async (programId) => {
  const program = await Program.findOne({
    $or: [{ _id: programId }, { programId }],
  });

  if (!program) {
    const error = new Error("Program not found");
    error.status = 404;
    throw error;
  }

  const id = program._id;

  await Promise.all([
    ProgramSchool.deleteMany({ programId: id }),
    ProgramMetrics.deleteOne({ programId: id }),
    ProgramCheckpoint.deleteMany({ programId: id }),
  ]);
  await Program.findByIdAndDelete(id);

  return { deleted: true, programId: id };
};

/**
 * Get all programs for a specific CSR partner
 * @param {ObjectId} csrPartnerId - CSR Partner ID
 * @returns {Array} Programs array
 */
export const getProgramsByCSR = async (csrPartnerId) => {
  const programs = await Program.find({ csrPartnerId })
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .lean();

  // Get metrics for each program
  const programsWithMetrics = await Promise.all(
    programs.map(async (program) => {
      const [metrics, schoolCount, currentCheckpoint] = await Promise.all([
        ProgramMetrics.findOne({ programId: program._id }).lean(),
        ProgramSchool.countDocuments({ programId: program._id }),
        ProgramCheckpoint.findOne({
          programId: program._id,
          status: { $in: ["ready", "pending"] },
        })
          .sort({ checkpointNumber: 1 })
          .lean(),
      ]);

      return {
        ...program,
        metrics: metrics || {},
        schoolsAssigned: schoolCount,
        currentCheckpoint: currentCheckpoint || null,
      };
    })
  );

  return programsWithMetrics;
};

/**
 * Assign schools to a program
 * @param {String} programId - Program ID
 * @param {Array} schoolIds - Array of school (Organization) IDs
 * @param {ObjectId} adminId - Admin performing the action
 * @returns {Object} Result with assigned count
 */
export const assignSchools = async (programId, schoolIds, adminId) => {
  const program = await Program.findOne({
    $or: [{ _id: programId }, { programId }],
  });

  if (!program) {
    const error = new Error("Program not found");
    error.status = 404;
    throw error;
  }

  // Validate schools exist
  const schools = await Organization.find({
    _id: { $in: schoolIds },
    type: "school",
    isActive: true,
  });

  if (schools.length === 0) {
    const error = new Error("No valid schools found");
    error.status = 400;
    throw error;
  }

  // Create ProgramSchool documents (skip duplicates)
  const programSchools = schools.map((school) => ({
    programId: program._id,
    schoolId: school._id,
    createdBy: adminId,
    implementationStatus: "pending",
  }));

  const result = await ProgramSchool.insertMany(programSchools, { ordered: false }).catch((err) => {
    // Handle duplicate key errors gracefully
    if (err.code === 11000) {
      return { insertedCount: err.result?.nInserted || 0 };
    }
    throw err;
  });

  // Update program metrics
  const totalSchools = await ProgramSchool.countDocuments({ programId: program._id });
  program.metrics.schoolsImplemented = totalSchools;
  await program.save();

  return {
    assigned: result.insertedCount || result.length || 0,
    totalSchools,
    schoolIds: schools.map((s) => s._id),
  };
};

/**
 * Get schools assigned to a program
 * @param {String} programId - Program ID
 * @param {Object} filters - Filter options
 * @returns {Object} Schools with pagination
 */
export const getProgramSchools = async (programId, filters = {}) => {
  const program = await Program.findOne({
    $or: [{ _id: programId }, { programId }],
  });

  if (!program) {
    const error = new Error("Program not found");
    error.status = 404;
    throw error;
  }

  const { status, page = 1, limit = 20, district } = filters;
  const query = { programId: program._id };

  if (status) {
    query.implementationStatus = status;
  }

  const skip = (page - 1) * limit;

  const [programSchools, total] = await Promise.all([
    ProgramSchool.find(query)
      .populate({
        path: "schoolId",
        select: "name settings.address userCount",
      })
      .sort({ assignedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ProgramSchool.countDocuments(query),
  ]);

  // Filter by district if provided (post-query filter)
  let filteredSchools = programSchools;
  if (district) {
    filteredSchools = programSchools.filter(
      (ps) =>
        ps.schoolId?.settings?.address?.city?.toLowerCase().includes(district.toLowerCase()) ||
        ps.schoolId?.settings?.address?.state?.toLowerCase().includes(district.toLowerCase())
    );
  }

  return {
    schools: filteredSchools.map((ps) => ({
      ...ps,
      schoolName: ps.schoolId?.name,
      district: ps.schoolId?.settings?.address?.city || ps.schoolId?.settings?.address?.state,
      address: ps.schoolId?.settings?.address,
    })),
    total: district ? filteredSchools.length : total,
    page: Number(page),
    pages: Math.ceil((district ? filteredSchools.length : total) / limit),
  };
};

/**
 * Update program status
 * @param {String} programId - Program ID
 * @param {String} newStatus - New status value
 * @param {ObjectId} adminId - Admin performing the action
 * @returns {Object} Updated program
 */
export const updateProgramStatus = async (programId, newStatus, adminId) => {
  const validStatuses = [
    "draft",
    "approved",
    "implementation_in_progress",
    "mid_program_review_completed",
    "completed",
  ];

  if (!validStatuses.includes(newStatus)) {
    const error = new Error("Invalid status value");
    error.status = 400;
    throw error;
  }

  const program = await Program.findOne({
    $or: [{ _id: programId }, { programId }],
  });

  if (!program) {
    const error = new Error("Program not found");
    error.status = 404;
    throw error;
  }

  program.status = newStatus;
  await program.save();

  return Program.findById(program._id)
    .populate("csrPartnerId", "companyName contactName email")
    .lean();
};

// Export all functions as named exports
export {
  createProgram as create,
  updateProgram as update,
  getProgram as get,
  listPrograms as list,
  archiveProgram as archive,
  deleteProgramPermanent as deletePermanent,
  getProgramsByCSR as getByCSR,
  assignSchools as assign,
  getProgramSchools as getSchools,
  updateProgramStatus as updateStatus,
};

// Default export
const programService = {
  createProgram,
  updateProgram,
  getProgram,
  listPrograms,
  archiveProgram,
  deleteProgramPermanent,
  getProgramsByCSR,
  assignSchools,
  getProgramSchools,
  updateProgramStatus,
};

export default programService;
