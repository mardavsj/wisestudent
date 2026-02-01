/**
 * Canonical region names and aliases to avoid duplicate regions (e.g. "Delhi" vs "New Delhi").
 * Add more entries as needed for future regions.
 */
const REGION_CANONICAL = {
  Delhi: ['Delhi', 'New Delhi'],
  'Tamil Nadu': ['Tamil Nadu', 'TN', 'Tamilnadu'],
  Maharashtra: ['Maharashtra', 'Bombay', 'Mumbai'],
  Karnataka: ['Karnataka', 'Bangalore', 'Bengaluru'],
  'West Bengal': ['West Bengal', 'WB', 'Calcutta', 'Kolkata'],
  'Uttar Pradesh': ['Uttar Pradesh', 'UP'],
  'Andhra Pradesh': ['Andhra Pradesh', 'AP'],
  Kerala: ['Kerala'],
  Rajasthan: ['Rajasthan', 'RJ'],
  Gujarat: ['Gujarat', 'Gujrat'],
  Haryana: ['Haryana', 'HR'],
  Punjab: ['Punjab', 'PB'],
  'Madhya Pradesh': ['Madhya Pradesh', 'MP'],
  'Telangana': ['Telangana', 'TG'],
  Bihar: ['Bihar', 'BR'],
  Odisha: ['Odisha', 'Orissa'],
  Assam: ['Assam'],
  Jharkhand: ['Jharkhand', 'JH'],
  Chhattisgarh: ['Chhattisgarh', 'CG'],
  Uttarakhand: ['Uttarakhand', 'Uttaranchal', 'UK'],
  Goa: ['Goa'],
  'Himachal Pradesh': ['Himachal Pradesh', 'HP'],
  'Jammu and Kashmir': ['Jammu and Kashmir', 'Jammu & Kashmir', 'J&K', 'Ladakh'],
};

const _canonicalByAlias = (() => {
  const map = {};
  Object.entries(REGION_CANONICAL).forEach(([canonical, aliases]) => {
    aliases.forEach((a) => {
      map[a.toLowerCase().trim()] = canonical;
    });
  });
  return map;
})();

/**
 * Get the canonical region name for grouping/display.
 * @param {string} state - Raw state/region from contactInfo.state
 * @returns {string} Canonical name (e.g. "Delhi" for both "Delhi" and "New Delhi")
 */
function getCanonicalRegion(state) {
  if (state == null || typeof state !== 'string') return 'Unknown';
  const s = state.trim();
  if (!s) return 'Unknown';
  return _canonicalByAlias[s.toLowerCase()] || s;
}

/**
 * Get all state values that belong to a canonical region (for filtering).
 * @param {string} canonicalRegion - Canonical name (e.g. "Delhi")
 * @returns {string[]} List of state values to match (e.g. ["Delhi", "New Delhi"])
 */
function getRegionAliases(canonicalRegion) {
  if (canonicalRegion == null || typeof canonicalRegion !== 'string') return [];
  const c = canonicalRegion.trim();
  if (!c) return [];
  return REGION_CANONICAL[c] || [c];
}

export { REGION_CANONICAL, getCanonicalRegion, getRegionAliases };
