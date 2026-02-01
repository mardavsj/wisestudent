import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireAdmin } from "../middlewares/authMiddleware.js";
import {
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
} from "../controllers/adminProgramController.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(requireAuth);
router.use(requireAdmin);

// ============================================
// Program CRUD
// ============================================

// List all programs
router.get("/", listPrograms);

// Create new program
router.post("/", createProgram);

// ============================================
// Metrics (must be before /:programId)
// ============================================
router.get("/:programId/metrics", getProgramMetrics);
router.post("/:programId/metrics/refresh", refreshProgramMetrics);
router.patch("/:programId/metrics/recognition", updateRecognitionMetrics);

// ============================================
// Reports (must be before /:programId)
// ============================================
router.get("/:programId/reports", listProgramReports);
router.post("/:programId/reports/generate", generateProgramReports);
router.post("/:programId/reports/publish", publishReport);
router.get("/:programId/reports/impact-summary", downloadImpactSummary);
router.get("/:programId/reports/school-coverage", downloadSchoolCoverage);
router.get("/:programId/reports/compliance", downloadComplianceSummary);

// Get single program
router.get("/:programId", getProgram);

// Update program
router.put("/:programId", updateProgram);

// Permanent delete (must be before /:programId so "permanent" is not used as programId)
router.delete("/:programId/permanent", deleteProgramPermanent);

// Archive program (marks as completed; program still visible to CSR as completed)
router.delete("/:programId", archiveProgram);

// Update program status
router.put("/:programId/status", updateProgramStatus);

// ============================================
// School Management
// ============================================

// Get available schools for assignment
router.get("/:programId/available-schools", getAvailableSchools);

// Get assigned schools
router.get("/:programId/schools", getAssignedSchools);

// Get schools summary
router.get("/:programId/schools/summary", getSchoolsSummary);

// Assign schools
router.post("/:programId/schools", assignSchools);

// Bulk assign schools
router.post("/:programId/schools/bulk", assignSchoolsBulk);

// Remove school from program
router.delete("/:programId/schools/:schoolId", removeSchool);

// Update school implementation status
router.put("/:programId/schools/:programSchoolId/status", updateSchoolStatus);

// ============================================
// Program Students (certificate delivered)
// ============================================
router.get("/:programId/students", getProgramStudents);
router.post("/:programId/students/certificates-in-progress", markCertificatesInProgressBulk);
router.patch("/:programId/students/:userId/certificate-in-progress", markCertificateInProgress);
router.post("/:programId/students/certificates-delivered", markCertificatesDeliveredBulk);
router.patch("/:programId/students/:userId/certificate-delivered", markCertificateDelivered);

// ============================================
// Checkpoint Management
// ============================================

// Get all checkpoints for program
router.get("/:programId/checkpoints", getCheckpoints);

// Get checkpoint status summary
router.get("/:programId/checkpoints/status", getCheckpointStatus);

// Check if checkpoint can be triggered
router.get("/:programId/checkpoints/:checkpointNumber/can-trigger", canTriggerCheckpoint);

// Trigger checkpoint
router.post("/:programId/checkpoints/:checkpointNumber/trigger", triggerCheckpoint);

// Update checkpoint notes (admin notes / notes)
router.put("/:programId/checkpoints/:checkpointNumber", updateCheckpoint);

export default router;
