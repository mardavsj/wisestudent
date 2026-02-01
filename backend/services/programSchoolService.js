import Program from "../models/Program.js";
import ProgramSchool from "../models/ProgramSchool.js";
import Organization from "../models/Organization.js";
import SchoolStudent from "../models/School/SchoolStudent.js";

/**
 * Get available schools that match program scope and aren't already assigned
 * @param {String} programId - Program ID or ObjectId
 * @returns {Array} Available schools
 */
export const getAvailableSchools = async (programId) => {
  const program = await Program.findOne({
    $or: [{ _id: programId }, { programId }],
  });

  if (!program) {
    const error = new Error("Program not found");
    error.status = 404;
    throw error;
  }

  // Get already assigned school IDs
  const assignedSchools = await ProgramSchool.find({ programId: program._id }).select("schoolId");
  const assignedIds = assignedSchools.map((ps) => ps.schoolId);

  // Build query based on program scope
  const query = {
    type: "school",
    isActive: true,
    _id: { $nin: assignedIds },
  };

  // Filter by geography if specified
  if (program.scope?.geography?.states?.length > 0) {
    query["settings.address.state"] = {
      $in: program.scope.geography.states.map((s) => new RegExp(s, "i")),
    };
  }

  if (program.scope?.geography?.districts?.length > 0) {
    query["settings.address.city"] = {
      $in: program.scope.geography.districts.map((d) => new RegExp(d, "i")),
    };
  }

  const schools = await Organization.find(query)
    .select("name settings.address userCount")
    .lean();

  if (schools.length === 0) {
    return [];
  }

  const schoolIds = schools.map((s) => s._id);
  const studentCounts = await SchoolStudent.aggregate([
    { $match: { orgId: { $in: schoolIds } } },
    { $group: { _id: "$orgId", count: { $sum: 1 } } },
  ]);
  const studentMap = studentCounts.reduce((acc, entry) => {
    acc[entry._id.toString()] = entry.count;
    return acc;
  }, {});

  return schools.map((school) => ({
    _id: school._id,
    name: school.name,
    district: school.settings?.address?.city || "",
    state: school.settings?.address?.state || "",
    pincode: school.settings?.address?.pincode || "",
    studentCount: studentMap[school._id.toString()] ?? school.userCount ?? 0,
  }));
};

/**
 * Assign specific schools to a program
 * @param {String} programId - Program ID
 * @param {Array} schoolIds - Array of school IDs
 * @param {ObjectId} adminId - Admin performing the action
 * @returns {Object} Result with assigned schools
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

  // Validate all schools exist
  const schools = await Organization.find({
    _id: { $in: schoolIds },
    type: "school",
    isActive: true,
  }).select("_id name userCount");

  if (schools.length === 0) {
    const error = new Error("No valid schools found");
    error.status = 400;
    throw error;
  }

  // Create ProgramSchool documents
  const programSchools = schools.map((school) => ({
    programId: program._id,
    schoolId: school._id,
    studentsCovered: school.userCount || 0,
    createdBy: adminId,
    implementationStatus: "pending",
  }));

  // Insert with ordered: false to continue on duplicate errors
  const result = await ProgramSchool.insertMany(programSchools, { ordered: false }).catch((err) => {
    if (err.code === 11000) {
      return { insertedCount: err.result?.nInserted || 0, insertedDocs: [] };
    }
    throw err;
  });

  // Update program metrics
  const totalSchools = await ProgramSchool.countDocuments({ programId: program._id });
  const totalStudents = await ProgramSchool.aggregate([
    { $match: { programId: program._id } },
    { $group: { _id: null, total: { $sum: "$studentsCovered" } } },
  ]);

  program.metrics.schoolsImplemented = totalSchools;
  program.metrics.studentsOnboarded = totalStudents[0]?.total || 0;
  await program.save();

  return {
    assigned: result.insertedCount || result.length || 0,
    totalSchools,
    totalStudents: totalStudents[0]?.total || 0,
  };
};

/**
 * Bulk assign schools based on filters
 * @param {String} programId - Program ID
 * @param {Object} filters - { district, state, category }
 * @param {ObjectId} adminId - Admin performing the action
 * @returns {Object} Result with count
 */
export const assignSchoolsBulk = async (programId, filters, adminId) => {
  const program = await Program.findOne({
    $or: [{ _id: programId }, { programId }],
  });

  if (!program) {
    const error = new Error("Program not found");
    error.status = 404;
    throw error;
  }

  // Get already assigned school IDs
  const assignedSchools = await ProgramSchool.find({ programId: program._id }).select("schoolId");
  const assignedIds = assignedSchools.map((ps) => ps.schoolId);

  // Build query
  const query = {
    type: "school",
    isActive: true,
    _id: { $nin: assignedIds },
  };

  if (filters.district) {
    query["settings.address.city"] = new RegExp(filters.district, "i");
  }
  if (filters.state) {
    query["settings.address.state"] = new RegExp(filters.state, "i");
  }

  const schools = await Organization.find(query).select("_id userCount");

  if (schools.length === 0) {
    return { assigned: 0, totalSchools: assignedSchools.length };
  }

  // Create ProgramSchool documents
  const programSchools = schools.map((school) => ({
    programId: program._id,
    schoolId: school._id,
    studentsCovered: school.userCount || 0,
    createdBy: adminId,
    implementationStatus: "pending",
  }));

  await ProgramSchool.insertMany(programSchools, { ordered: false }).catch(() => {});

  // Update program metrics
  const totalSchools = await ProgramSchool.countDocuments({ programId: program._id });
  const totalStudents = await ProgramSchool.aggregate([
    { $match: { programId: program._id } },
    { $group: { _id: null, total: { $sum: "$studentsCovered" } } },
  ]);

  program.metrics.schoolsImplemented = totalSchools;
  program.metrics.studentsOnboarded = totalStudents[0]?.total || 0;
  await program.save();

  return {
    assigned: schools.length,
    totalSchools,
    totalStudents: totalStudents[0]?.total || 0,
  };
};

/**
 * Remove a school from program
 * @param {String} programId - Program ID
 * @param {ObjectId} schoolId - School ID to remove
 * @returns {Object} Success result
 */
export const removeSchool = async (programId, schoolId) => {
  const program = await Program.findOne({
    $or: [{ _id: programId }, { programId }],
  });

  if (!program) {
    const error = new Error("Program not found");
    error.status = 404;
    throw error;
  }

  const result = await ProgramSchool.deleteOne({
    programId: program._id,
    schoolId,
  });

  if (result.deletedCount === 0) {
    const error = new Error("School not found in program");
    error.status = 404;
    throw error;
  }

  // Update program metrics
  const totalSchools = await ProgramSchool.countDocuments({ programId: program._id });
  const totalStudents = await ProgramSchool.aggregate([
    { $match: { programId: program._id } },
    { $group: { _id: null, total: { $sum: "$studentsCovered" } } },
  ]);

  program.metrics.schoolsImplemented = totalSchools;
  program.metrics.studentsOnboarded = totalStudents[0]?.total || 0;
  await program.save();

  return {
    success: true,
    totalSchools,
    totalStudents: totalStudents[0]?.total || 0,
  };
};

/**
 * Get assigned schools for a program
 * @param {String} programId - Program ID
 * @param {Object} filters - { status, district, page, limit }
 * @returns {Object} { schools, total, page, pages }
 */
export const getAssignedSchools = async (programId, filters = {}) => {
  const program = await Program.findOne({
    $or: [{ _id: programId }, { programId }],
  });

  if (!program) {
    const error = new Error("Program not found");
    error.status = 404;
    throw error;
  }

  const { status, district, page = 1, limit = 20 } = filters;
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

  // Filter by district if provided (post-query)
  let filteredSchools = programSchools;
  if (district) {
    filteredSchools = programSchools.filter(
      (ps) =>
        ps.schoolId?.settings?.address?.city?.toLowerCase().includes(district.toLowerCase()) ||
        ps.schoolId?.settings?.address?.state?.toLowerCase().includes(district.toLowerCase())
    );
  }

  // Enrich with actual student count from SchoolStudent (orgId = school)
  const schoolIds = filteredSchools.map((ps) => ps.schoolId?._id).filter(Boolean);
  let studentMap = {};
  if (schoolIds.length > 0) {
    const studentCounts = await SchoolStudent.aggregate([
      { $match: { orgId: { $in: schoolIds } } },
      { $group: { _id: "$orgId", count: { $sum: 1 } } },
    ]);
    studentMap = studentCounts.reduce((acc, entry) => {
      acc[entry._id.toString()] = entry.count;
      return acc;
    }, {});
  }

  const schools = filteredSchools.map((ps) => {
    const orgId = ps.schoolId?._id;
    const actualStudents = orgId ? studentMap[orgId.toString()] : undefined;
    return {
      _id: ps._id,
      programSchoolId: ps._id,
      schoolId: orgId,
      schoolName: ps.schoolId?.name || "Unknown School",
      district: ps.schoolId?.settings?.address?.city || "",
      state: ps.schoolId?.settings?.address?.state || "",
      studentsCovered: actualStudents ?? ps.studentsCovered ?? 0,
      implementationStatus: ps.implementationStatus,
      assignedAt: ps.assignedAt,
      onboardingStartedAt: ps.onboardingStartedAt,
      onboardingCompletedAt: ps.onboardingCompletedAt,
      metrics: ps.metrics,
    };
  });

  return {
    schools,
    total: district ? filteredSchools.length : total,
    page: Number(page),
    pages: Math.ceil((district ? filteredSchools.length : total) / limit),
  };
};

/**
 * Update school implementation status
 * @param {ObjectId} programSchoolId - ProgramSchool document ID
 * @param {String} status - New implementation status
 * @param {Object} metrics - Optional metrics to update
 * @returns {Object} Updated ProgramSchool
 */
export const updateSchoolStatus = async (programSchoolId, status, metrics = {}) => {
  const programSchool = await ProgramSchool.findById(programSchoolId);

  if (!programSchool) {
    const error = new Error("Program school assignment not found");
    error.status = 404;
    throw error;
  }

  const validStatuses = ["pending", "in_progress", "active", "completed"];
  if (!validStatuses.includes(status)) {
    const error = new Error("Invalid status value");
    error.status = 400;
    throw error;
  }

  // Update status
  programSchool.implementationStatus = status;

  // Set appropriate date fields
  const now = new Date();
  if (status === "in_progress" && !programSchool.onboardingStartedAt) {
    programSchool.onboardingStartedAt = now;
  }
  if (status === "active" && !programSchool.onboardingCompletedAt) {
    programSchool.onboardingCompletedAt = now;
  }
  if (status === "completed" && !programSchool.programCompletedAt) {
    programSchool.programCompletedAt = now;
  }

  // Update metrics if provided
  if (Object.keys(metrics).length > 0) {
    programSchool.metrics = {
      ...programSchool.metrics?.toObject?.() || programSchool.metrics || {},
      ...metrics,
    };
  }

  await programSchool.save();

  return ProgramSchool.findById(programSchoolId)
    .populate("schoolId", "name settings.address")
    .lean();
};

/**
 * Get summary stats for program schools
 * @param {String} programId - Program ID
 * @returns {Object} Summary statistics
 */
export const getSchoolsSummary = async (programId) => {
  const program = await Program.findOne({
    $or: [{ _id: programId }, { programId }],
  });

  if (!program) {
    const error = new Error("Program not found");
    error.status = 404;
    throw error;
  }

  const [statusCounts, totalStudents, districtCounts] = await Promise.all([
    ProgramSchool.aggregate([
      { $match: { programId: program._id } },
      { $group: { _id: "$implementationStatus", count: { $sum: 1 } } },
    ]),
    ProgramSchool.aggregate([
      { $match: { programId: program._id } },
      { $group: { _id: null, total: { $sum: "$studentsCovered" } } },
    ]),
    ProgramSchool.aggregate([
      { $match: { programId: program._id } },
      {
        $lookup: {
          from: "organizations",
          localField: "schoolId",
          foreignField: "_id",
          as: "school",
        },
      },
      { $unwind: "$school" },
      {
        $group: {
          _id: "$school.settings.address.city",
          count: { $sum: 1 },
          students: { $sum: "$studentsCovered" },
        },
      },
    ]),
  ]);

  return {
    totalSchools: statusCounts.reduce((sum, s) => sum + s.count, 0),
    totalStudents: totalStudents[0]?.total || 0,
    byStatus: statusCounts.reduce((acc, s) => {
      acc[s._id] = s.count;
      return acc;
    }, {}),
    byDistrict: districtCounts.map((d) => ({
      district: d._id || "Unknown",
      schools: d.count,
      students: d.students,
    })),
  };
};

// Export all functions
const programSchoolService = {
  getAvailableSchools,
  assignSchools,
  assignSchoolsBulk,
  removeSchool,
  getAssignedSchools,
  updateSchoolStatus,
  getSchoolsSummary,
};

export default programSchoolService;
