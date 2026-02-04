// Unified Sustainability Games Export (kids + teens modules)

// Import Sustainability Kids games
import sustainabilityKidsGames, { getSustainabilityKidsGame } from './Kids';
// Import Sustainability Teens games
import sustainabilityTeenGames, { getSustainabilityTeenGame } from './Teens';

// Create unified games registry
const sustainabilityGames = {
  all: {
    ...sustainabilityKidsGames,
    ...sustainabilityTeenGames
  },
  kids: sustainabilityKidsGames,
  teen: sustainabilityTeenGames,
  teens: sustainabilityTeenGames
};

// Export functions to get games
export const getAllSustainabilityGames = (age = null) => {
  const normalizedAge = normalizeAgeKey(age);
  if (normalizedAge && normalizedAge !== "all") {
    return sustainabilityGames[normalizedAge] || {};
  }
  return sustainabilityGames.all;
};

export const getSustainabilityGameIds = (age = null) => {
  const normalizedAge = normalizeAgeKey(age);
  if (normalizedAge && normalizedAge !== "all") {
    return Object.keys(sustainabilityGames[normalizedAge] || {});
  }
  return Object.keys(sustainabilityGames.all);
};

export default sustainabilityGames;

const normalizeAgeKey = (age) => {
  if (typeof age !== "string") return null;
  const normalized = age.toLowerCase();
  if (normalized === "young-adult") return "teens";
  if (normalized === "kid") return "kids";
  return normalized;
};

export const getSustainabilityGame = (age, gameId) => {
  const normalizedGameId = gameId?.toLowerCase();
  if (!normalizedGameId) return null;

  const lowerAge = age?.toLowerCase();
  if (lowerAge && ['kids', 'kid'].includes(lowerAge)) {
    const kidsGame = getSustainabilityKidsGame(normalizedGameId);
    if (kidsGame) {
      return kidsGame;
    }
  }

  if (lowerAge && ['teens', 'teen', 'young-adult'].includes(lowerAge)) {
    const teenGame = getSustainabilityTeenGame(normalizedGameId);
    if (teenGame) {
      return teenGame;
    }
  }

  const normalizedAge = normalizeAgeKey(age);
  return (
    (normalizedAge && sustainabilityGames[normalizedAge]?.[normalizedGameId]) ||
    sustainabilityGames.all[normalizedGameId] ||
    null
  );
};