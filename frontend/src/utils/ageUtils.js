export const calculateUserAge = (dob) => {
  if (!dob) return null;

  const dobDate = typeof dob === "string" ? new Date(dob) : new Date(dob);
  if (Number.isNaN(dobDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }

  return age;
};

export const getAgeTier = (age) => {
  if (age === null || age === undefined) return null;
  if (age <= 12) return "kids";
  if (age <= 17) return "teens";
  if (age <= 23) return "young-adult";
  return "adults";
};

const ACCESS_RULES = {
  kids: new Set(["kids", "teens"]),
  teens: new Set(["teens", "young-adult"]),
  "young-adult": new Set(["young-adult", "adults"]),
  adults: new Set(["adults"]),
};

export const isModuleAccessible = (gameAgeGroup, age) => {
  const tier = getAgeTier(age);
  if (!tier) return false;
  const allowed = ACCESS_RULES[tier];
  return allowed ? allowed.has(gameAgeGroup) : false;
};

export const getAllowedAgeGroupsForAge = (age) => {
  const tier = getAgeTier(age);
  if (!tier) return [];
  return Array.from(ACCESS_RULES[tier] || []);
};
