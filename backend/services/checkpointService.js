import Program from "../models/Program.js";
import ProgramCheckpoint from "../models/ProgramCheckpoint.js";
import ProgramMetrics from "../models/ProgramMetrics.js";
import ProgramSchool from "../models/ProgramSchool.js";
import SchoolStudent from "../models/School/SchoolStudent.js";
import CSRSponsor from "../models/CSRSponsor.js";

/**
 * Get all checkpoints for a program.
 * Enriches metricsSnapshot with current program stats when stored snapshot has 0 students (so existing checkpoints show real data).
 * @param {String} programId - Program ID or ObjectId
 * @returns {Array} Checkpoints sorted by number
 */
export const getCheckpoints = async (programId) => {
  const program = await Program.findOne({
    $or: [{ _id: programId }, { programId }],
  });

  if (!program) {
    const error = new Error("Program not found");
    error.status = 404;
    throw error;
  }

  const [checkpoints, currentSnapshot] = await Promise.all([
    ProgramCheckpoint.find({ programId: program._id })
      .sort({ checkpointNumber: 1 })
      .populate("triggeredBy", "name email")
      .populate("acknowledgedBy", "name email")
      .lean(),
    getMetricsSnapshot(program._id),
  ]);

  return checkpoints.map((cp) => {
    const snapshot = cp.metricsSnapshot || {};
    const needsEnrich =
      snapshot.studentsOnboarded == null || snapshot.studentsOnboarded === 0;
    const metricsSnapshot = needsEnrich
      ? {
          ...snapshot,
          studentsOnboarded: currentSnapshot.studentsOnboarded ?? snapshot.studentsOnboarded ?? 0,
          activeStudents: currentSnapshot.activeStudents ?? snapshot.activeStudents ?? 0,
          schoolsImplemented: currentSnapshot.schoolsImplemented ?? snapshot.schoolsImplemented ?? 0,
          regionsCovered: currentSnapshot.regionsCovered ?? snapshot.regionsCovered ?? 0,
        }
      : { ...snapshot, regionsCovered: snapshot.regionsCovered ?? currentSnapshot.regionsCovered ?? 0 };

    return {
      ...cp,
      metricsSnapshot,
      label: ProgramCheckpoint.getCheckpointLabel(cp.checkpointNumber),
      canAcknowledge: cp.status === "ready",
      isComplete: cp.status === "completed",
    };
  });
};

/**
 * Get current metrics snapshot for a program (real student count from SchoolStudent, regions from assigned schools).
 * @param {ObjectId} programId - Program ObjectId
 * @returns {Object} Metrics snapshot
 */
const getMetricsSnapshot = async (programId) => {
  const [metrics, schoolStatsAgg, regionsAgg] = await Promise.all([
    ProgramMetrics.findOne({ programId }).lean(),
    ProgramSchool.aggregate([
      { $match: { programId } },
      {
        $group: {
          _id: null,
          totalSchools: { $sum: 1 },
          totalStudentsFromCovered: { $sum: "$studentsCovered" },
          schoolIds: { $push: "$schoolId" },
        },
      },
    ]),
    ProgramSchool.aggregate([
      { $match: { programId } },
      {
        $lookup: {
          from: "organizations",
          localField: "schoolId",
          foreignField: "_id",
          as: "org",
          pipeline: [{ $project: { city: "$settings.address.city" } }],
        },
      },
      { $unwind: { path: "$org", preserveNullAndEmptyArrays: true } },
      { $group: { _id: "$org.city" } },
      { $count: "regionsCovered" },
    ]),
  ]);

  const schoolStats = schoolStatsAgg[0] || {
    totalSchools: 0,
    totalStudentsFromCovered: 0,
    schoolIds: [],
  };
  const schoolIds = schoolStats.schoolIds || [];
  const totalSchools = schoolStats.totalSchools ?? 0;

  let actualStudents = 0;
  if (schoolIds.length > 0) {
    const studentAgg = await SchoolStudent.aggregate([
      { $match: { orgId: { $in: schoolIds } } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);
    actualStudents = studentAgg[0]?.count ?? 0;
  }

  const studentsOnboarded =
    actualStudents > 0
      ? actualStudents
      : (metrics?.studentReach?.totalOnboarded ?? schoolStats.totalStudentsFromCovered ?? 0);
  const regionsCovered = regionsAgg[0]?.regionsCovered ?? 0;

  return {
    studentsOnboarded,
    activeStudents: actualStudents > 0 ? actualStudents : (metrics?.studentReach?.activeStudents ?? 0),
    participationRate: metrics?.engagement?.participationRate ?? 0,
    completionRate: metrics?.studentReach?.completionRate ?? 0,
    schoolsImplemented: totalSchools,
    regionsCovered,
  };
};

/**
 * Check if a checkpoint can be triggered
 * @param {String} programId - Program ID
 * @param {Number} checkpointNumber - Checkpoint number (1-5)
 * @returns {Object} { canTrigger, reason }
 */
export const canTriggerCheckpoint = async (programId, checkpointNumber) => {
  const program = await Program.findOne({
    $or: [{ _id: programId }, { programId }],
  });

  if (!program) {
    return { canTrigger: false, reason: "Program not found" };
  }

  const checkpoint = await ProgramCheckpoint.findOne({
    programId: program._id,
    checkpointNumber,
  });

  if (!checkpoint) {
    return { canTrigger: false, reason: "Checkpoint not found" };
  }

  // Check if checkpoint is already triggered or completed
  if (checkpoint.status !== "pending") {
    return { canTrigger: false, reason: `Checkpoint is already ${checkpoint.status}` };
  }

  // Check if previous checkpoint is completed (except for checkpoint 1)
  if (checkpointNumber > 1) {
    const previousCheckpoint = await ProgramCheckpoint.findOne({
      programId: program._id,
      checkpointNumber: checkpointNumber - 1,
    });

    if (!previousCheckpoint || previousCheckpoint.status !== "completed") {
      return {
        canTrigger: false,
        reason: `Checkpoint ${checkpointNumber - 1} must be completed first`,
      };
    }
  }

  return { canTrigger: true, reason: null };
};

/**
 * Trigger a checkpoint for CSR review
 * @param {String} programId - Program ID
 * @param {Number} checkpointNumber - Checkpoint number (1-5)
 * @param {ObjectId} adminId - Admin triggering the checkpoint
 * @returns {Object} Updated checkpoint
 */
export const triggerCheckpoint = async (programId, checkpointNumber, adminId) => {
  const program = await Program.findOne({
    $or: [{ _id: programId }, { programId }],
  });

  if (!program) {
    const error = new Error("Program not found");
    error.status = 404;
    throw error;
  }

  // Check if can trigger
  const { canTrigger, reason } = await canTriggerCheckpoint(programId, checkpointNumber);
  if (!canTrigger) {
    const error = new Error(reason);
    error.status = 400;
    throw error;
  }

  // Get metrics snapshot
  const metricsSnapshot = await getMetricsSnapshot(program._id);

  // Update checkpoint
  const checkpoint = await ProgramCheckpoint.findOneAndUpdate(
    { programId: program._id, checkpointNumber },
    {
      status: "ready",
      triggeredAt: new Date(),
      triggeredBy: adminId,
      metricsSnapshot,
    },
    { new: true }
  )
    .populate("triggeredBy", "name email")
    .lean();

  // Send notification to CSR
  try {
    const csrPartner = await CSRSponsor.findById(program.csrPartnerId);
    if (csrPartner) {
      const { notifyCSRCheckpointReady } = await import('../cronJobs/csrNotificationUtils.js');
      await notifyCSRCheckpointReady(program, checkpoint, csrPartner);
    }
  } catch (error) {
    console.error('Failed to notify CSR about checkpoint:', error);
    // Don't fail checkpoint trigger if notification fails
  }

  return {
    ...checkpoint,
    label: ProgramCheckpoint.getCheckpointLabel(checkpointNumber),
  };
};

/**
 * CSR acknowledges a checkpoint
 * @param {String} programId - Program ID
 * @param {Number} checkpointNumber - Checkpoint number
 * @param {ObjectId} userId - CSR user acknowledging
 * @returns {Object} Updated checkpoint and program
 */
export const acknowledgeCheckpoint = async (programId, checkpointNumber, userId) => {
  const program = await Program.findOne({
    $or: [{ _id: programId }, { programId }],
  }).populate("csrPartnerId");

  if (!program) {
    const error = new Error("Program not found");
    error.status = 404;
    throw error;
  }

  // Validate user is CSR owner
  const csrPartner = await CSRSponsor.findById(program.csrPartnerId);
  if (!csrPartner || csrPartner.userId.toString() !== userId.toString()) {
    const error = new Error("Not authorized to acknowledge this checkpoint");
    error.status = 403;
    throw error;
  }

  // Get checkpoint
  const checkpoint = await ProgramCheckpoint.findOne({
    programId: program._id,
    checkpointNumber,
  });

  if (!checkpoint) {
    const error = new Error("Checkpoint not found");
    error.status = 404;
    throw error;
  }

  if (checkpoint.status !== "ready") {
    const error = new Error(`Checkpoint is not ready for acknowledgment (current status: ${checkpoint.status})`);
    error.status = 400;
    throw error;
  }

  // Update checkpoint
  const now = new Date();
  checkpoint.status = "completed";
  checkpoint.acknowledgedAt = now;
  checkpoint.acknowledgedBy = userId;
  checkpoint.completedAt = now;
  await checkpoint.save();

  // Update program status based on checkpoint
  const statusMapping = {
    1: "approved",
    2: "implementation_in_progress",
    3: "mid_program_review_completed",
    4: "completed",
  };

  if (statusMapping[checkpointNumber]) {
    program.status = statusMapping[checkpointNumber];
    await program.save();
  }

  // Send notification to Admin
  try {
    const csrPartner = await CSRSponsor.findById(program.csrPartnerId);
    if (csrPartner) {
      const { notifyAdminCheckpointAcknowledged } = await import('../cronJobs/csrNotificationUtils.js');
      await notifyAdminCheckpointAcknowledged(program, checkpoint, csrPartner);
    }
  } catch (error) {
    console.error('Failed to notify admin about checkpoint acknowledgment:', error);
    // Don't fail acknowledgment if notification fails
  }

  return {
    checkpoint: {
      ...checkpoint.toObject(),
      label: ProgramCheckpoint.getCheckpointLabel(checkpointNumber),
    },
    program: {
      _id: program._id,
      programId: program.programId,
      name: program.name,
      status: program.status,
    },
  };
};

/**
 * Get checkpoint status summary for a program
 * @param {String} programId - Program ID
 * @returns {Object} Status summary
 */
export const getCheckpointStatus = async (programId) => {
  const program = await Program.findOne({
    $or: [{ _id: programId }, { programId }],
  });

  if (!program) {
    const error = new Error("Program not found");
    error.status = 404;
    throw error;
  }

  const checkpoints = await ProgramCheckpoint.find({ programId: program._id })
    .sort({ checkpointNumber: 1 })
    .lean();

  // Find current and next checkpoint
  let currentCheckpoint = null;
  let nextCheckpoint = null;

  for (const cp of checkpoints) {
    if (cp.status === "ready") {
      currentCheckpoint = {
        ...cp,
        label: ProgramCheckpoint.getCheckpointLabel(cp.checkpointNumber),
      };
    } else if (cp.status === "pending" && !nextCheckpoint) {
      nextCheckpoint = {
        checkpointNumber: cp.checkpointNumber,
        type: cp.type,
        label: ProgramCheckpoint.getCheckpointLabel(cp.checkpointNumber),
      };
    }
  }

  // If no current, use first pending as next
  if (!currentCheckpoint && !nextCheckpoint) {
    const pending = checkpoints.find((cp) => cp.status === "pending");
    if (pending) {
      nextCheckpoint = {
        checkpointNumber: pending.checkpointNumber,
        type: pending.type,
        label: ProgramCheckpoint.getCheckpointLabel(pending.checkpointNumber),
      };
    }
  }

  const completedCount = checkpoints.filter((cp) => cp.status === "completed").length;

  return {
    programId: program._id,
    programStatus: program.status,
    totalCheckpoints: checkpoints.length,
    completedCheckpoints: completedCount,
    currentCheckpoint,
    nextCheckpoint,
    checkpoints: checkpoints.map((cp) => ({
      number: cp.checkpointNumber,
      type: cp.type,
      label: ProgramCheckpoint.getCheckpointLabel(cp.checkpointNumber),
      status: cp.status,
      triggeredAt: cp.triggeredAt,
      acknowledgedAt: cp.acknowledgedAt,
      completedAt: cp.completedAt,
    })),
  };
};

/**
 * Update checkpoint notes (admin only)
 * @param {String} programId - Program ID or ObjectId
 * @param {Number} checkpointNumber - Checkpoint number (1-5)
 * @param {Object} updates - { adminNotes?, notes? }
 * @returns {Object} Updated checkpoint
 */
export const updateCheckpointNotes = async (programId, checkpointNumber, updates) => {
  const program = await Program.findOne({
    $or: [{ _id: programId }, { programId }],
  });

  if (!program) {
    const error = new Error("Program not found");
    error.status = 404;
    throw error;
  }

  const checkpoint = await ProgramCheckpoint.findOne({
    programId: program._id,
    checkpointNumber,
  });

  if (!checkpoint) {
    const error = new Error("Checkpoint not found");
    error.status = 404;
    throw error;
  }

  if (updates.adminNotes !== undefined) checkpoint.adminNotes = updates.adminNotes;
  if (updates.notes !== undefined) checkpoint.notes = updates.notes;
  await checkpoint.save();

  return getCheckpoints(programId).then((list) =>
    list.find((c) => c.checkpointNumber === checkpointNumber)
  );
};

/**
 * Get pending checkpoints requiring CSR acknowledgment
 * @param {ObjectId} csrPartnerId - CSR Partner ID
 * @returns {Array} Pending checkpoints
 */
export const getPendingCheckpointsForCSR = async (csrPartnerId) => {
  const programs = await Program.find({ csrPartnerId }).select("_id programId name");
  const programIds = programs.map((p) => p._id);

  const pendingCheckpoints = await ProgramCheckpoint.find({
    programId: { $in: programIds },
    status: "ready",
  })
    .populate("programId", "name programId")
    .sort({ triggeredAt: -1 })
    .lean();

  return pendingCheckpoints.map((cp) => ({
    ...cp,
    programName: cp.programId?.name,
    label: ProgramCheckpoint.getCheckpointLabel(cp.checkpointNumber),
  }));
};

// Export all functions
const checkpointService = {
  getCheckpoints,
  canTriggerCheckpoint,
  triggerCheckpoint,
  acknowledgeCheckpoint,
  getCheckpointStatus,
  getPendingCheckpointsForCSR,
  updateCheckpointNotes,
};

export default checkpointService;
