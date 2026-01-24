import { isModuleAccessible } from "./ageUtils";

// Map URL categories to gameId prefix categories
const CATEGORY_PREFIX = {
  "financial-literacy": "finance",
  "brain-health": "brain",
  "uvls": "uvls",
  "digital-citizenship": "dcos",
  "moral-values": "moral",
  "ai-for-all": "ai",
  "ehe": "ehe",
  "civic-responsibility": "civic-responsibility",
  "health-male": "health-male",
  "health-female": "health-female",
  "sustainability": "sustainability",
};

const normalizeAgeGroup = (ageGroup) => (ageGroup === "teen" ? "teens" : ageGroup);

export const getCategoryPrefix = (category, ageGroup) => {
  const normalizedAge = normalizeAgeGroup(ageGroup);
  const prefixCategory = CATEGORY_PREFIX[category] || category;

  if (category === "sustainability") {
    if (ageGroup === "solar-and-city") return "sustainability-solar";
    if (ageGroup === "waste-and-recycle") return "sustainability-waste";
    if (ageGroup === "carbon-and-climate") return "sustainability-carbon";
    if (ageGroup === "water-and-energy") return "sustainability-water-energy";
  }

  return `${prefixCategory}-${normalizedAge}`;
};

export const isPreviouslyUnlocked = (progressMap = {}) =>
  Object.values(progressMap).some(
    (progress) =>
      (progress?.levelsCompleted ?? 0) > 0 || progress?.fullyCompleted === true
  );

export const getAgeRestrictionMessage = (tier, userAge) => {
  if (userAge === null) {
    return "We couldn't verify your age. Update your profile with your date of birth to unlock this section.";
  }

  if (tier === "kids" && userAge >= 18) {
    return `Available for learners under 18. You are ${userAge} years old.`;
  }

  if (tier === "teens" && userAge >= 18) {
    return `Available for learners under 18. You are ${userAge} years old.`;
  }

  if (tier === "young-adult" && userAge >= 24) {
    return `Available for ages 18-23. You are ${userAge} years old.`;
  }

  if (tier === "adults" && userAge < 18) {
    return `Available at age 18. You are ${userAge} years old.`;
  }

  return "";
};
