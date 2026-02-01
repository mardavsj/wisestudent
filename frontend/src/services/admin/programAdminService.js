import api from "../../utils/api";

const API_URL = "/api/admin/programs";

/**
 * List all programs with filters
 * @param {Object} filters - { csrPartnerId, status, page, limit, search }
 */
export const listPrograms = async (filters = {}) => {
  const response = await api.get(API_URL, { params: filters });
  return response.data;
};

/**
 * Create a new program
 * @param {Object} data - Program data
 */
export const createProgram = async (data) => {
  const response = await api.post(API_URL, data);
  return response.data;
};

/**
 * Get a single program by ID
 * @param {String} programId - Program ID
 */
export const getProgram = async (programId) => {
  const response = await api.get(`${API_URL}/${programId}`);
  return response.data;
};

/**
 * Update a program
 * @param {String} programId - Program ID
 * @param {Object} updates - Updates to apply
 */
export const updateProgram = async (programId, updates) => {
  const response = await api.put(`${API_URL}/${programId}`, updates);
  return response.data;
};

/**
 * Archive/complete a program (status → completed; program still visible to CSR)
 * @param {String} programId - Program ID
 */
export const archiveProgram = async (programId) => {
  const response = await api.delete(`${API_URL}/${programId}`);
  return response.data;
};

/**
 * Permanently delete a program and all related data. Program is removed from the CSR partner.
 * @param {String} programId - Program ID
 */
export const deleteProgramPermanent = async (programId) => {
  const response = await api.delete(`${API_URL}/${programId}/permanent`);
  return response.data;
};

/**
 * Get available schools for a program (based on scope)
 * @param {String} programId - Program ID
 */
export const getAvailableSchools = async (programId) => {
  const response = await api.get(`${API_URL}/${programId}/available-schools`);
  return response.data;
};

/**
 * Get assigned schools for a program
 * @param {String} programId - Program ID
 * @param {Object} filters - Optional filters
 */
export const getAssignedSchools = async (programId, filters = {}) => {
  const response = await api.get(`${API_URL}/${programId}/schools`, { params: filters });
  return response.data;
};

/**
 * Assign schools to a program
 * @param {String} programId - Program ID
 * @param {Array} schoolIds - Array of school IDs
 */
export const assignSchools = async (programId, schoolIds) => {
  const response = await api.post(`${API_URL}/${programId}/schools`, { schoolIds });
  return response.data;
};

/**
 * Remove a school from a program
 * @param {String} programId - Program ID
 * @param {String} schoolId - School ID
 */
export const removeSchool = async (programId, schoolId) => {
  const response = await api.delete(`${API_URL}/${programId}/schools/${schoolId}`);
  return response.data;
};

/**
 * Assign schools in bulk
 * @param {String} programId - Program ID
 * @param {Array} schoolIds - Array of school IDs
 */
export const assignSchoolsBulk = async (programId, schoolIds) => {
  const response = await api.post(`${API_URL}/${programId}/schools/bulk`, { schoolIds });
  return response.data;
};

/**
 * Update a school's implementation status in a program
 * @param {String} programId - Program ID
 * @param {String} programSchoolId - ProgramSchool document ID (_id of the assignment)
 * @param {String} status - New status: pending | in_progress | active | completed
 */
export const updateSchoolStatus = async (programId, programSchoolId, status) => {
  const response = await api.put(
    `${API_URL}/${programId}/schools/${programSchoolId}/status`,
    { status }
  );
  return response.data;
};

/**
 * Get schools summary for a program
 * @param {String} programId - Program ID
 */
export const getSchoolsSummary = async (programId) => {
  const response = await api.get(`${API_URL}/${programId}/schools/summary`);
  return response.data;
};

/**
 * Get checkpoints for a program
 * @param {String} programId - Program ID
 */
export const getCheckpoints = async (programId) => {
  const response = await api.get(`${API_URL}/${programId}/checkpoints`);
  return response.data;
};

/**
 * Check if a checkpoint can be triggered
 * @param {String} programId - Program ID
 * @param {Number} checkpointNumber - Checkpoint number
 */
export const canTriggerCheckpoint = async (programId, checkpointNumber) => {
  const response = await api.get(
    `${API_URL}/${programId}/checkpoints/${checkpointNumber}/can-trigger`
  );
  return response.data;
};

/**
 * Update program status
 * @param {String} programId - Program ID
 * @param {String} status - New status
 */
export const updateProgramStatus = async (programId, status) => {
  const response = await api.put(`${API_URL}/${programId}/status`, { status });
  return response.data;
};

/**
 * Trigger a checkpoint
 * @param {String} programId - Program ID
 * @param {Number} checkpointNumber - Checkpoint number (1-5)
 */
export const triggerCheckpoint = async (programId, checkpointNumber) => {
  const response = await api.post(
    `${API_URL}/${programId}/checkpoints/${checkpointNumber}/trigger`
  );
  return response.data;
};

/**
 * Get program metrics (admin view)
 * @param {String} programId - Program ID
 */
export const getMetrics = async (programId) => {
  const response = await api.get(`${API_URL}/${programId}/metrics`);
  return response.data;
};

/**
 * Refresh program metrics (recompute from schools)
 * @param {String} programId - Program ID
 */
export const refreshMetrics = async (programId) => {
  const response = await api.post(`${API_URL}/${programId}/metrics/refresh`);
  return response.data;
};

/**
 * Update recognition metrics (Super Admin only).
 * Kits Dispatched: only increases when Super Admin confirms physical kits have been sent.
 * @param {String} programId - Program ID
 * @param {Object} payload - { recognitionKitsDispatched?: number } to set, or { addKitsDispatched?: number } to add
 */
export const updateRecognitionMetrics = async (programId, payload) => {
  const response = await api.patch(`${API_URL}/${programId}/metrics/recognition`, payload);
  return response.data;
};

/**
 * Get students in program schools (for certificate delivered UI)
 * @param {String} programId - Program ID
 */
export const getProgramStudents = async (programId) => {
  const response = await api.get(`${API_URL}/${programId}/students`);
  return response.data;
};

/**
 * Mark one certificate in progress for a single student
 * @param {String} programId - Program ID
 * @param {String} userId - Student user ID
 */
export const markCertificateInProgress = async (programId, userId) => {
  const response = await api.patch(
    `${API_URL}/${programId}/students/${userId}/certificate-in-progress`
  );
  return response.data;
};

/**
 * Mark certificates in progress for multiple students (bulk)
 * @param {String} programId - Program ID
 * @param {String[]} studentIds - Array of student user IDs
 */
export const markCertificatesInProgressBulk = async (programId, studentIds) => {
  const response = await api.post(
    `${API_URL}/${programId}/students/certificates-in-progress`,
    { studentIds }
  );
  return response.data;
};

/**
 * Mark one certificate delivered for a single student
 * @param {String} programId - Program ID
 * @param {String} userId - Student user ID
 */
export const markCertificateDelivered = async (programId, userId) => {
  const response = await api.patch(
    `${API_URL}/${programId}/students/${userId}/certificate-delivered`
  );
  return response.data;
};

/**
 * Mark certificates delivered for multiple students (bulk)
 * @param {String} programId - Program ID
 * @param {String[]} studentIds - Array of student user IDs
 */
export const markCertificatesDeliveredBulk = async (programId, studentIds) => {
  const response = await api.post(
    `${API_URL}/${programId}/students/certificates-delivered`,
    { studentIds }
  );
  return response.data;
};

/**
 * List available reports for a program (admin)
 * @param {String} programId - Program ID
 */
export const listReports = async (programId) => {
  const response = await api.get(`${API_URL}/${programId}/reports`);
  return response.data;
};

/**
 * Generate reports (on-demand; use download endpoints to get files)
 * @param {String} programId - Program ID
 */
export const generateReports = async (programId) => {
  const response = await api.post(`${API_URL}/${programId}/reports/generate`);
  return response.data;
};

/**
 * Preview report in new tab (fetch blob, open URL)
 * @param {String} programId - Program ID
 * @param {String} type - "impact_summary" | "school_coverage" | "compliance"
 * @param {String} format - For school_coverage: "pdf" | "excel"
 */
export const previewReport = async (programId, type, format = "pdf") => {
  let path = `${API_URL}/${programId}/reports/`;
  if (type === "impact_summary") path += "impact-summary";
  else if (type === "school_coverage") path += `school-coverage?format=${format}`;
  else if (type === "compliance") path += "compliance";
  else path += "impact-summary";
  const response = await api.get(path, { responseType: "blob" });
  const blob = new Blob([response.data], { type: response.headers["content-type"] || "application/pdf" });
  const objectUrl = window.URL.createObjectURL(blob);
  window.open(objectUrl, "_blank", "noopener");
  setTimeout(() => window.URL.revokeObjectURL(objectUrl), 60000);
};

/**
 * Publish report (make available to CSR)
 * @param {String} programId - Program ID
 * @param {String} reportType - "impact_summary" | "school_coverage" | "compliance"
 */
export const publishReport = async (programId, reportType) => {
  const response = await api.post(`${API_URL}/${programId}/reports/publish`, { reportType });
  return response.data;
};

/**
 * Download impact summary PDF (admin)
 * @param {String} programId - Program ID
 * @param {String} filename - Optional filename
 */
export const downloadImpactSummary = async (programId, filename) => {
  const response = await api.get(`${API_URL}/${programId}/reports/impact-summary`, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename || `impact-summary-${programId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * Download school coverage report (admin) - PDF or Excel
 * @param {String} programId - Program ID
 * @param {String} format - "pdf" | "excel"
 * @param {String} filename - Optional filename
 */
export const downloadSchoolCoverage = async (programId, format = "pdf", filename) => {
  const response = await api.get(
    `${API_URL}/${programId}/reports/school-coverage?format=${format}`,
    { responseType: "blob" }
  );
  const ext = format === "excel" ? "xlsx" : "pdf";
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename || `school-coverage-${programId}.${ext}`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * Download compliance summary PDF (admin)
 * @param {String} programId - Program ID
 * @param {String} filename - Optional filename
 */
export const downloadComplianceSummary = async (programId, filename) => {
  const response = await api.get(`${API_URL}/${programId}/reports/compliance`, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename || `compliance-summary-${programId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * Update checkpoint notes (admin notes / notes)
 * @param {String} programId - Program ID
 * @param {Number} checkpointNumber - Checkpoint number (1-5)
 * @param {Object} body - { adminNotes?, notes? }
 */
export const updateCheckpointNotes = async (programId, checkpointNumber, body) => {
  const response = await api.put(
    `${API_URL}/${programId}/checkpoints/${checkpointNumber}`,
    body
  );
  return response.data;
};

const programAdminService = {
  listPrograms,
  createProgram,
  getProgram,
  updateProgram,
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
  updateProgramStatus,
  getMetrics,
  refreshMetrics,
  updateRecognitionMetrics,
  getProgramStudents,
  markCertificateInProgress,
  markCertificatesInProgressBulk,
  markCertificateDelivered,
  markCertificatesDeliveredBulk,
  listReports,
  generateReports,
  previewReport,
  publishReport,
  downloadImpactSummary,
  downloadSchoolCoverage,
  downloadComplianceSummary,
  updateCheckpointNotes,
};

export default programAdminService;
