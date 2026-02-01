import programService from "../services/programService.js";
import programSchoolService from "../services/programSchoolService.js";
import checkpointService from "../services/checkpointService.js";
import Program from "../models/Program.js";
import ProgramMetrics from "../models/ProgramMetrics.js";
import ProgramSchool from "../models/ProgramSchool.js";
import SchoolStudent from "../models/School/SchoolStudent.js";
import Organization from "../models/Organization.js";
import reportGenerationService from "../services/reportGenerationService.js";

/**
 * Create a new program
 */
export const createProgram = async (req, res) => {
  try {
    const program = await programService.createProgram(req.user._id, req.body);
    res.status(201).json({
      message: "Program created successfully",
      data: program,
    });
  } catch (error) {
    console.error("Create program error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to create program",
    });
  }
};

/**
 * Update an existing program
 */
export const updateProgram = async (req, res) => {
  try {
    const { programId } = req.params;
    const program = await programService.updateProgram(programId, req.body);
    res.json({
      message: "Program updated successfully",
      data: program,
    });
  } catch (error) {
    console.error("Update program error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to update program",
    });
  }
};

/**
 * Get a single program by ID
 */
export const getProgram = async (req, res) => {
  try {
    const { programId } = req.params;
    const program = await programService.getProgram(programId);
    res.json({ data: program });
  } catch (error) {
    console.error("Get program error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to get program",
    });
  }
};

/**
 * List all programs with filters
 */
export const listPrograms = async (req, res) => {
  try {
    const filters = {
      csrPartnerId: req.query.csrPartnerId,
      status: req.query.status,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      search: req.query.search,
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
    };

    const result = await programService.listPrograms(filters);
    res.json({
      data: result.programs,
      pagination: {
        total: result.total,
        page: result.page,
        pages: result.pages,
        limit: result.limit,
      },
    });
  } catch (error) {
    console.error("List programs error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to list programs",
    });
  }
};

/**
 * Archive a program
 */
export const archiveProgram = async (req, res) => {
  try {
    const { programId } = req.params;
    const program = await programService.archiveProgram(programId);
    res.json({
      message: "Program archived successfully",
      data: program,
    });
  } catch (error) {
    console.error("Archive program error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to archive program",
    });
  }
};

/**
 * Permanently delete a program and all related data (schools, metrics, checkpoints).
 * Program will no longer appear for the assigned CSR.
 */
export const deleteProgramPermanent = async (req, res) => {
  try {
    const { programId } = req.params;
    await programService.deleteProgramPermanent(programId);
    res.json({
      message: "Program deleted permanently. It has been removed from the CSR partner.",
    });
  } catch (error) {
    console.error("Delete program permanent error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to delete program permanently",
    });
  }
};

/**
 * Get available schools for assignment
 */
export const getAvailableSchools = async (req, res) => {
  try {
    const { programId } = req.params;
    const schools = await programSchoolService.getAvailableSchools(programId);
    res.json({ data: schools });
  } catch (error) {
    console.error("Get available schools error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to get available schools",
    });
  }
};

/**
 * Get assigned schools for a program
 */
export const getAssignedSchools = async (req, res) => {
  try {
    const { programId } = req.params;
    const filters = {
      status: req.query.status,
      district: req.query.district,
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 20,
    };

    const result = await programSchoolService.getAssignedSchools(programId, filters);
    res.json({
      data: result.schools,
      pagination: {
        total: result.total,
        page: result.page,
        pages: result.pages,
      },
    });
  } catch (error) {
    console.error("Get assigned schools error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to get assigned schools",
    });
  }
};

/**
 * Assign schools to a program
 */
export const assignSchools = async (req, res) => {
  try {
    const { programId } = req.params;
    const { schoolIds } = req.body;

    if (!schoolIds || !Array.isArray(schoolIds) || schoolIds.length === 0) {
      return res.status(400).json({ message: "schoolIds array is required" });
    }

    const result = await programSchoolService.assignSchools(programId, schoolIds, req.user._id);
    res.status(201).json({
      message: "Schools assigned successfully",
      data: result,
    });
  } catch (error) {
    console.error("Assign schools error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to assign schools",
    });
  }
};

/**
 * Bulk assign schools by filters
 */
export const assignSchoolsBulk = async (req, res) => {
  try {
    const { programId } = req.params;
    const { district, state, category } = req.body;

    const result = await programSchoolService.assignSchoolsBulk(
      programId,
      { district, state, category },
      req.user._id
    );
    res.status(201).json({
      message: "Schools assigned in bulk successfully",
      data: result,
    });
  } catch (error) {
    console.error("Bulk assign schools error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to bulk assign schools",
    });
  }
};

/**
 * Remove a school from program
 */
export const removeSchool = async (req, res) => {
  try {
    const { programId, schoolId } = req.params;
    const result = await programSchoolService.removeSchool(programId, schoolId);
    res.json({
      message: "School removed from program",
      data: result,
    });
  } catch (error) {
    console.error("Remove school error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to remove school",
    });
  }
};

/**
 * Update school implementation status
 */
export const updateSchoolStatus = async (req, res) => {
  try {
    const { programSchoolId } = req.params;
    const { status, metrics } = req.body;

    const result = await programSchoolService.updateSchoolStatus(programSchoolId, status, metrics);
    res.json({
      message: "School status updated",
      data: result,
    });
  } catch (error) {
    console.error("Update school status error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to update school status",
    });
  }
};

/**
 * Get schools summary for a program
 */
export const getSchoolsSummary = async (req, res) => {
  try {
    const { programId } = req.params;
    const summary = await programSchoolService.getSchoolsSummary(programId);
    res.json({ data: summary });
  } catch (error) {
    console.error("Get schools summary error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to get schools summary",
    });
  }
};

/**
 * Get checkpoints for a program
 */
export const getCheckpoints = async (req, res) => {
  try {
    const { programId } = req.params;
    const checkpoints = await checkpointService.getCheckpoints(programId);
    res.json({ data: checkpoints });
  } catch (error) {
    console.error("Get checkpoints error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to get checkpoints",
    });
  }
};

/**
 * Trigger a checkpoint for CSR review
 */
export const triggerCheckpoint = async (req, res) => {
  try {
    const { programId, checkpointNumber } = req.params;
    const checkpoint = await checkpointService.triggerCheckpoint(
      programId,
      parseInt(checkpointNumber, 10),
      req.user._id
    );
    res.json({
      message: "Checkpoint triggered successfully",
      data: checkpoint,
    });
  } catch (error) {
    console.error("Trigger checkpoint error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to trigger checkpoint",
    });
  }
};

/**
 * Check if a checkpoint can be triggered
 */
export const canTriggerCheckpoint = async (req, res) => {
  try {
    const { programId, checkpointNumber } = req.params;
    const result = await checkpointService.canTriggerCheckpoint(
      programId,
      parseInt(checkpointNumber, 10)
    );
    res.json({ data: result });
  } catch (error) {
    console.error("Can trigger checkpoint error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to check checkpoint status",
    });
  }
};

/**
 * Get checkpoint status summary
 */
export const getCheckpointStatus = async (req, res) => {
  try {
    const { programId } = req.params;
    const status = await checkpointService.getCheckpointStatus(programId);
    res.json({ data: status });
  } catch (error) {
    console.error("Get checkpoint status error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to get checkpoint status",
    });
  }
};

/**
 * Update program status
 */
export const updateProgramStatus = async (req, res) => {
  try {
    const { programId } = req.params;
    const { status } = req.body;
    const program = await programService.updateProgramStatus(programId, status, req.user._id);
    res.json({
      message: "Program status updated",
      data: program,
    });
  } catch (error) {
    console.error("Update program status error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to update program status",
    });
  }
};

/**
 * Get program metrics (admin view).
 * Enriches schoolStats and studentReach with actual student count from SchoolStudent when stored values are 0.
 */
export const getProgramMetrics = async (req, res) => {
  try {
    const { programId } = req.params;
    const program = await Program.findOne({
      $or: [{ _id: programId }, { programId }],
    });
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    const metrics = await ProgramMetrics.findOne({ programId: program._id }).lean();
    const schoolStatsAgg = await ProgramSchool.aggregate([
      { $match: { programId: program._id } },
      {
        $group: {
          _id: null,
          totalSchools: { $sum: 1 },
          totalStudentsFromCovered: { $sum: "$studentsCovered" },
          schoolIds: { $push: "$schoolId" },
        },
      },
    ]);
    const statsFromProgramSchool = schoolStatsAgg[0] || {
      totalSchools: 0,
      totalStudentsFromCovered: 0,
      schoolIds: [],
    };
    const schoolIds = statsFromProgramSchool.schoolIds || [];

    // Actual student count from SchoolStudent (orgId = program's assigned schools)
    let actualTotalStudents = 0;
    if (schoolIds.length > 0) {
      const studentCountAgg = await SchoolStudent.aggregate([
        { $match: { orgId: { $in: schoolIds } } },
        { $group: { _id: null, count: { $sum: 1 } } },
      ]);
      actualTotalStudents = studentCountAgg[0]?.count ?? 0;
    }

    const totalStudents = actualTotalStudents > 0
      ? actualTotalStudents
      : (statsFromProgramSchool.totalStudentsFromCovered ?? 0);

    const schoolStats = {
      totalSchools: statsFromProgramSchool.totalSchools ?? 0,
      totalStudents,
    };

    const existingReach = metrics?.studentReach || {};
    const studentReach = {
      ...existingReach,
      totalOnboarded: totalStudents > 0 ? totalStudents : (existingReach.totalOnboarded ?? 0),
      activeStudents: totalStudents > 0 ? totalStudents : (existingReach.activeStudents ?? 0),
      activePercentage:
        existingReach.activePercentage ??
        (totalStudents > 0 ? 100 : 0),
    };

    // Certificates issued = sum certificatesDelivered; in progress = sum certificatesInProgress (program's students)
    let certificatesIssued = metrics?.recognition?.certificatesIssued ?? 0;
    let certificatesInProgress = 0;
    if (schoolIds.length > 0) {
      const orgs = await Organization.find({ _id: { $in: schoolIds } })
        .select("tenantId")
        .lean();
      const tenantIds = orgs.map((o) => o.tenantId).filter(Boolean);
      const baseMatch =
        tenantIds.length > 0
          ? { $or: [{ orgId: { $in: schoolIds } }, { tenantId: { $in: tenantIds } }] }
          : { orgId: { $in: schoolIds } };
      const certAgg = await SchoolStudent.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: null,
            deliveredSum: { $sum: { $ifNull: ["$certificatesDelivered", 0] } },
            inProgressSum: { $sum: { $ifNull: ["$certificatesInProgress", 0] } },
          },
        },
      ]);
      if (certAgg[0]) {
        certificatesIssued = certAgg[0].deliveredSum ?? 0;
        certificatesInProgress = certAgg[0].inProgressSum ?? 0;
      }
    }

    const recognition = {
      ...(metrics?.recognition || {}),
      certificatesIssued,
      certificatesInProgress,
      recognitionKitsInProgress: certificatesInProgress,
    };

    res.json({
      data: {
        ...(metrics || {}),
        recognition,
        studentReach,
        programId: program._id,
        programName: program.name,
        lastComputedAt: metrics?.lastComputedAt || null,
        computedBy: metrics?.computedBy || "system",
        schoolStats,
      },
    });
  } catch (error) {
    console.error("Get program metrics error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to get program metrics",
    });
  }
};

/**
 * Refresh program metrics (recompute from ProgramSchool and update ProgramMetrics)
 */
export const refreshProgramMetrics = async (req, res) => {
  try {
    const { programId } = req.params;
    const program = await Program.findOne({
      $or: [{ _id: programId }, { programId }],
    });
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    const schoolStats = await ProgramSchool.aggregate([
      { $match: { programId: program._id } },
      {
        $group: {
          _id: null,
          totalSchools: { $sum: 1 },
          totalStudents: { $sum: "$studentsCovered" },
        },
      },
    ]);
    const stats = schoolStats[0] || { totalSchools: 0, totalStudents: 0 };
    let metrics = await ProgramMetrics.findOne({ programId: program._id });
    if (!metrics) {
      metrics = new ProgramMetrics({ programId: program._id });
    }
    metrics.studentReach = metrics.studentReach || {};
    metrics.studentReach.totalOnboarded = stats.totalStudents;
    metrics.studentReach.activeStudents = stats.totalStudents;
    metrics.lastComputedAt = new Date();
    metrics.computedBy = "manual";
    await metrics.save();
    program.metrics = program.metrics || {};
    program.metrics.schoolsImplemented = stats.totalSchools;
    program.metrics.studentsOnboarded = stats.totalStudents;
    await program.save();
    const updated = await ProgramMetrics.findOne({ programId: program._id }).lean();
    res.json({
      message: "Metrics refreshed successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Refresh program metrics error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to refresh program metrics",
    });
  }
};

/**
 * Update recognition metrics (Super Admin only).
 * Kits: in progress (add when dispatched) → mark as delivered when confirmed.
 * Body: recognitionKitsDispatched, addKitsDispatched, addKitsInProgress, markKitsDelivered.
 */
export const updateRecognitionMetrics = async (req, res) => {
  try {
    const { programId } = req.params;
    const {
      recognitionKitsDispatched,
      addKitsDispatched,
      addKitsInProgress,
      markKitsDelivered,
    } = req.body || {};

    const program = await Program.findOne({
      $or: [{ _id: programId }, { programId }],
    });
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    let metrics = await ProgramMetrics.findOne({ programId: program._id });
    if (!metrics) {
      metrics = new ProgramMetrics({ programId: program._id });
    }
    if (!metrics.recognition) metrics.recognition = {};
    if (metrics.recognition.recognitionKitsInProgress == null) {
      metrics.recognition.recognitionKitsInProgress = 0;
    }

    if (typeof recognitionKitsDispatched === "number" && recognitionKitsDispatched >= 0) {
      metrics.recognition.recognitionKitsDispatched = recognitionKitsDispatched;
    }
    if (typeof addKitsDispatched === "number" && addKitsDispatched > 0) {
      const current = metrics.recognition.recognitionKitsDispatched ?? 0;
      metrics.recognition.recognitionKitsDispatched = current + addKitsDispatched;
    }
    if (typeof addKitsInProgress === "number" && addKitsInProgress > 0) {
      const current = metrics.recognition.recognitionKitsInProgress ?? 0;
      metrics.recognition.recognitionKitsInProgress = current + addKitsInProgress;
    }
    if (typeof markKitsDelivered === "number" && markKitsDelivered > 0) {
      const inProgress = metrics.recognition.recognitionKitsInProgress ?? 0;
      const move = Math.min(markKitsDelivered, inProgress);
      metrics.recognition.recognitionKitsInProgress = Math.max(0, inProgress - move);
      metrics.recognition.recognitionKitsDispatched =
        (metrics.recognition.recognitionKitsDispatched ?? 0) + move;
    }

    await metrics.save();
    const updated = await ProgramMetrics.findOne({ programId: program._id }).lean();
    res.json({
      message: "Recognition metrics updated",
      data: updated,
    });
  } catch (error) {
    console.error("Update recognition metrics error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to update recognition metrics",
    });
  }
};

const getPublishedAt = (program, reportType) => {
  const entry = (program.publishedReports || []).find((r) => r.reportType === reportType);
  return entry?.publishedAt || null;
};

/** Get program school IDs and tenant IDs for student queries (certificate delivered) */
const getProgramSchoolAndTenantIds = async (programId) => {
  const program = await Program.findOne({
    $or: [{ _id: programId }, { programId }],
  });
  if (!program) return { schoolIds: [], tenantIds: [] };
  const assignedSchools = await ProgramSchool.find({ programId: program._id })
    .select("schoolId")
    .lean();
  const schoolIds = assignedSchools.map((ps) => ps.schoolId).filter(Boolean);
  if (schoolIds.length === 0) return { schoolIds: [], tenantIds: [] };
  const orgs = await Organization.find({ _id: { $in: schoolIds } })
    .select("tenantId")
    .lean();
  const tenantIds = orgs.map((o) => o.tenantId).filter(Boolean);
  return { schoolIds, tenantIds };
};

/**
 * List students in program schools (for Super Admin certificate-delivered UI).
 * Returns userId, name, school name, certificatesDelivered.
 */
export const getProgramStudents = async (req, res) => {
  try {
    const { programId } = req.params;
    const { schoolIds, tenantIds } = await getProgramSchoolAndTenantIds(programId);
    if (schoolIds.length === 0) {
      return res.json({ data: [], pagination: { total: 0 } });
    }
    const baseMatch =
      tenantIds.length > 0
        ? { $or: [{ orgId: { $in: schoolIds } }, { tenantId: { $in: tenantIds } }] }
        : { orgId: { $in: schoolIds } };
    const students = await SchoolStudent.aggregate([
      { $match: baseMatch },
      { $project: { userId: 1, orgId: 1, certificatesInProgress: 1, certificatesDelivered: 1, certificatesDeliveredUpdatedAt: 1 } },
      { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "organizations", localField: "orgId", foreignField: "_id", as: "org" } },
      { $unwind: { path: "$org", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          userId: 1,
          name: { $ifNull: ["$user.name", "$user.email"] },
          email: { $ifNull: ["$user.email", ""] },
          schoolName: { $ifNull: ["$org.name", ""] },
          certificatesInProgress: { $ifNull: ["$certificatesInProgress", 0] },
          certificatesDelivered: { $ifNull: ["$certificatesDelivered", 0] },
          certificatesDeliveredUpdatedAt: 1,
        },
      },
    ]);
    res.json({ data: students, pagination: { total: students.length } });
  } catch (error) {
    console.error("Get program students error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to get program students",
    });
  }
};

/**
 * Mark one certificate in progress for a single student (Super Admin only).
 * PATCH /admin/programs/:programId/students/:userId/certificate-in-progress
 */
export const markCertificateInProgress = async (req, res) => {
  try {
    const { programId, userId: studentUserId } = req.params;
    const { schoolIds, tenantIds } = await getProgramSchoolAndTenantIds(programId);
    if (schoolIds.length === 0) {
      return res.status(400).json({ message: "Program has no assigned schools" });
    }
    const baseMatch =
      tenantIds.length > 0
        ? { $or: [{ orgId: { $in: schoolIds } }, { tenantId: { $in: tenantIds } }] }
        : { orgId: { $in: schoolIds } };
    const filter = { ...baseMatch, userId: studentUserId, allowLegacy: true };
    const doc = await SchoolStudent.findOne(filter);
    if (!doc) {
      return res.status(404).json({ message: "Student not found in this program" });
    }
    doc.certificatesInProgress = (doc.certificatesInProgress || 0) + 1;
    await doc.save();
    res.json({
      message: "Certificate marked as in progress",
      data: { certificatesInProgress: doc.certificatesInProgress },
    });
  } catch (error) {
    console.error("Mark certificate in progress error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to mark certificate in progress",
    });
  }
};

/**
 * Mark certificates in progress for multiple students (Super Admin only).
 * POST /admin/programs/:programId/students/certificates-in-progress
 * Body: { studentIds: [userId, ...] }
 */
export const markCertificatesInProgressBulk = async (req, res) => {
  try {
    const { programId } = req.params;
    const { studentIds } = req.body || {};
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ message: "studentIds array is required and must not be empty" });
    }
    const { schoolIds, tenantIds } = await getProgramSchoolAndTenantIds(programId);
    if (schoolIds.length === 0) {
      return res.status(400).json({ message: "Program has no assigned schools" });
    }
    const baseMatch =
      tenantIds.length > 0
        ? { $or: [{ orgId: { $in: schoolIds } }, { tenantId: { $in: tenantIds } }] }
        : { orgId: { $in: schoolIds } };
    let updated = 0;
    for (const uid of studentIds) {
      if (!uid) continue;
      const filter = { ...baseMatch, userId: uid, allowLegacy: true };
      const result = await SchoolStudent.findOneAndUpdate(
        filter,
        { $inc: { certificatesInProgress: 1 } },
        { new: true }
      );
      if (result) updated += 1;
    }
    res.json({
      message: `Certificates marked as in progress for ${updated} student(s)`,
      data: { updated },
    });
  } catch (error) {
    console.error("Mark certificates in progress bulk error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to mark certificates in progress",
    });
  }
};

/**
 * Mark one certificate delivered for a single student (Super Admin only).
 * PATCH /admin/programs/:programId/students/:userId/certificate-delivered
 */
export const markCertificateDelivered = async (req, res) => {
  try {
    const { programId, userId: studentUserId } = req.params;
    const { schoolIds, tenantIds } = await getProgramSchoolAndTenantIds(programId);
    if (schoolIds.length === 0) {
      return res.status(400).json({ message: "Program has no assigned schools" });
    }
    const baseMatch =
      tenantIds.length > 0
        ? { $or: [{ orgId: { $in: schoolIds } }, { tenantId: { $in: tenantIds } }] }
        : { orgId: { $in: schoolIds } };
    const filter = { ...baseMatch, userId: studentUserId, allowLegacy: true };
    const doc = await SchoolStudent.findOne(filter);
    if (!doc) {
      return res.status(404).json({ message: "Student not found in this program" });
    }
    doc.certificatesDelivered = (doc.certificatesDelivered || 0) + 1;
    doc.certificatesInProgress = Math.max(0, (doc.certificatesInProgress || 0) - 1);
    doc.certificatesDeliveredUpdatedAt = new Date();
    await doc.save();
    res.json({
      message: "Certificate marked as delivered",
      data: { certificatesDelivered: doc.certificatesDelivered },
    });
  } catch (error) {
    console.error("Mark certificate delivered error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to mark certificate delivered",
    });
  }
};

/**
 * Mark certificates delivered for multiple students (Super Admin only).
 * POST /admin/programs/:programId/students/certificates-delivered
 * Body: { studentIds: [userId, ...] }
 */
export const markCertificatesDeliveredBulk = async (req, res) => {
  try {
    const { programId } = req.params;
    const { studentIds } = req.body || {};
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ message: "studentIds array is required and must not be empty" });
    }
    const { schoolIds, tenantIds } = await getProgramSchoolAndTenantIds(programId);
    if (schoolIds.length === 0) {
      return res.status(400).json({ message: "Program has no assigned schools" });
    }
    const baseMatch =
      tenantIds.length > 0
        ? { $or: [{ orgId: { $in: schoolIds } }, { tenantId: { $in: tenantIds } }] }
        : { orgId: { $in: schoolIds } };
    let updated = 0;
    for (const uid of studentIds) {
      if (!uid) continue;
      const filter = { ...baseMatch, userId: uid, allowLegacy: true };
      const doc = await SchoolStudent.findOne(filter);
      if (!doc) continue;
      doc.certificatesDelivered = (doc.certificatesDelivered || 0) + 1;
      doc.certificatesInProgress = Math.max(0, (doc.certificatesInProgress || 0) - 1);
      doc.certificatesDeliveredUpdatedAt = new Date();
      await doc.save();
      updated += 1;
    }
    res.json({
      message: `Certificates marked as delivered for ${updated} student(s)`,
      data: { updated },
    });
  } catch (error) {
    console.error("Mark certificates delivered bulk error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to mark certificates delivered",
    });
  }
};

/**
 * List available reports for a program (admin)
 */
export const listProgramReports = async (req, res) => {
  try {
    const { programId } = req.params;
    const program = await Program.findOne({
      $or: [{ _id: programId }, { programId }],
    });
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    const metrics = await ProgramMetrics.findOne({ programId: program._id });
    const schoolCount = await ProgramSchool.countDocuments({ programId: program._id });
    res.json({
      data: {
        reports: [
          {
            type: "impact_summary",
            name: "Impact Summary",
            description: "2-4 page summary for CSR/ESG reports",
            format: "pdf",
            available: true,
            generatedAt: metrics?.lastComputedAt || new Date(),
            publishedAt: getPublishedAt(program, "impact_summary"),
          },
          {
            type: "school_coverage",
            name: "School Coverage Report",
            description: "Detailed school-level coverage for audits",
            formats: ["excel", "pdf"],
            available: schoolCount > 0,
            generatedAt: new Date(),
            publishedAt: getPublishedAt(program, "school_coverage"),
          },
          {
            type: "compliance",
            name: "Compliance Summary",
            description: "Compliance and governance documentation",
            format: "pdf",
            available: true,
            generatedAt: new Date(),
            publishedAt: getPublishedAt(program, "compliance"),
          },
        ],
        note: "Reports are generated on demand. Use Preview/Download, then Publish to make available to CSR.",
      },
    });
  } catch (error) {
    console.error("List program reports error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to list reports",
    });
  }
};

/**
 * Publish a report (make available to CSR)
 */
export const publishReport = async (req, res) => {
  try {
    const { programId } = req.params;
    const { reportType } = req.body;
    const validTypes = ["impact_summary", "school_coverage", "compliance"];
    if (!reportType || !validTypes.includes(reportType)) {
      return res.status(400).json({ message: "Invalid reportType. Use: impact_summary, school_coverage, compliance" });
    }
    const program = await Program.findOne({
      $or: [{ _id: programId }, { programId }],
    });
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    program.publishedReports = program.publishedReports || [];
    const existing = program.publishedReports.findIndex((r) => r.reportType === reportType);
    const entry = { reportType, publishedAt: new Date(), publishedBy: req.user._id };
    if (existing >= 0) {
      program.publishedReports[existing] = entry;
    } else {
      program.publishedReports.push(entry);
    }
    await program.save();
    res.json({
      message: "Report published. CSR can now see it in their report list.",
      data: { reportType, publishedAt: entry.publishedAt },
    });
  } catch (error) {
    console.error("Publish report error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to publish report",
    });
  }
};

/**
 * Generate reports (pre-warm / mark generated; reports are generated on download)
 */
export const generateProgramReports = async (req, res) => {
  try {
    const { programId } = req.params;
    const program = await Program.findOne({
      $or: [{ _id: programId }, { programId }],
    });
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    res.json({
      message: "Reports are generated on download. Use the download links to get reports.",
      data: { programId: program._id, programName: program.name },
    });
  } catch (error) {
    console.error("Generate program reports error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to generate reports",
    });
  }
};

/**
 * Download Impact Summary PDF (admin)
 */
export const downloadImpactSummary = async (req, res) => {
  try {
    const { programId } = req.params;
    const program = await Program.findOne({
      $or: [{ _id: programId }, { programId }],
    });
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    const pdfBuffer = await reportGenerationService.generateImpactSummaryPDF(program._id);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="impact-summary-${program.programId || program._id}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Download impact summary error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to download impact summary",
    });
  }
};

/**
 * Download School Coverage Report (admin) - Excel or PDF
 */
export const downloadSchoolCoverage = async (req, res) => {
  try {
    const { programId } = req.params;
    const { format = "pdf" } = req.query;
    const program = await Program.findOne({
      $or: [{ _id: programId }, { programId }],
    });
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    let buffer, contentType, extension;
    if (format === "excel") {
      buffer = await reportGenerationService.generateSchoolCoverageExcel(program._id);
      contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      extension = "xlsx";
    } else {
      buffer = await reportGenerationService.generateSchoolCoveragePDF(program._id);
      contentType = "application/pdf";
      extension = "pdf";
    }
    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="school-coverage-${program.programId || program._id}.${extension}"`
    );
    res.send(buffer);
  } catch (error) {
    console.error("Download school coverage error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to download school coverage report",
    });
  }
};

/**
 * Download Compliance Summary PDF (admin)
 */
export const downloadComplianceSummary = async (req, res) => {
  try {
    const { programId } = req.params;
    const program = await Program.findOne({
      $or: [{ _id: programId }, { programId }],
    });
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }
    const pdfBuffer = await reportGenerationService.generateCompliancePDF(program._id);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="compliance-summary-${program.programId || program._id}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Download compliance summary error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to download compliance summary",
    });
  }
};

/**
 * Update checkpoint notes (admin notes / notes)
 */
export const updateCheckpoint = async (req, res) => {
  try {
    const { programId, checkpointNumber } = req.params;
    const { adminNotes, notes } = req.body;
    const checkpoint = await checkpointService.updateCheckpointNotes(
      programId,
      parseInt(checkpointNumber, 10),
      { adminNotes, notes }
    );
    res.json({
      message: "Checkpoint notes updated",
      data: checkpoint,
    });
  } catch (error) {
    console.error("Update checkpoint error:", error);
    res.status(error.status || 500).json({
      message: error.message || "Failed to update checkpoint notes",
    });
  }
};

export default {
  createProgram,
  updateProgram,
  getProgram,
  listPrograms,
  archiveProgram,
  deleteProgramPermanent,
  getAvailableSchools,
  getAssignedSchools,
  assignSchools,
  assignSchoolsBulk,
  removeSchool,
  updateSchoolStatus,
  getSchoolsSummary,
  getCheckpoints,
  triggerCheckpoint,
  canTriggerCheckpoint,
  getCheckpointStatus,
  updateProgramStatus,
  getProgramMetrics,
  refreshProgramMetrics,
  updateRecognitionMetrics,
  getProgramStudents,
  markCertificateInProgress,
  markCertificatesInProgressBulk,
  markCertificateDelivered,
  markCertificatesDeliveredBulk,
  listProgramReports,
  generateProgramReports,
  publishReport,
  downloadImpactSummary,
  downloadSchoolCoverage,
  downloadComplianceSummary,
  updateCheckpoint,
};
