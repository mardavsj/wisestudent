/**
 * Single source of truth for Readiness Exposure pillars.
 * Used by: CSR Readiness Exposure page/API, Impact Summary PDF, and any Admin/Super Admin pillar logic.
 * Change pillars here only; CSR page and PDF stay in sync.
 */

/**
 * Map score/percentage (0–100) to exposure level (low/medium/high).
 * @param {number|null} avg - Average score or percentage
 * @returns {string|null} 'low' | 'medium' | 'high' | null
 */
export const scoreToLevel = (avg) => {
  if (avg == null || Number.isNaN(avg)) return null;
  const n = Number(avg);
  if (n <= 33) return "low";
  if (n <= 66) return "medium";
  return "high";
};

/**
 * 11 Readiness Exposure pillars — id, display name, and data source (schoolstudent vs game).
 * source: 'schoolstudent' → level from SchoolStudent.pillars aggregate (pillarKey: uvls, dcos, moral, ehe, crgc).
 * source: 'game' → level from % of students with UnifiedGameProgress for gameTypes.
 */
export const READINESS_PILLAR_DEFS = [
  { id: "financialLiteracy", name: "Financial Literacy", source: "game", gameTypes: ["finance", "financial"] },
  { id: "brainHealth", name: "Brain Health", source: "game", gameTypes: ["brain", "mental"] },
  { id: "uvls", name: "UVLS (Life Skills & Values)", source: "schoolstudent", pillarKey: "uvls" },
  { id: "dcos", name: "Digital Citizenship & Online Safety", source: "schoolstudent", pillarKey: "dcos" },
  { id: "moralValues", name: "Moral Values", source: "schoolstudent", pillarKey: "moral" },
  { id: "aiForAll", name: "AI for All", source: "game", gameTypes: ["ai"] },
  { id: "healthMale", name: "Health - Male", source: "game", gameTypes: ["health-male"] },
  { id: "healthFemale", name: "Health - Female", source: "game", gameTypes: ["health-female"] },
  { id: "entrepreneurshipHigherEd", name: "Entrepreneurship & Higher Education", source: "schoolstudent", pillarKey: "ehe" },
  { id: "civicResponsibility", name: "Civic Responsibility & Global Citizenship", source: "schoolstudent", pillarKey: "crgc" },
  { id: "sustainability", name: "Sustainability", source: "game", gameTypes: ["sustainability"] },
];

/** Default disclaimer for Readiness Exposure (CSR page and Impact Summary PDF). */
export const READINESS_EXPOSURE_DISCLAIMER =
  "Indicators reflect exposure trends only. They do not represent assessment, diagnosis, or scoring. These metrics show what topics students were exposed to, not their abilities or performance.";
