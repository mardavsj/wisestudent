/**
 * Utility function to get game data (coins, xp) from game category folders
 * This ensures games always fetch coins and XP from the source of truth (game category data)
 */

// Import all game category data functions
import { getFinanceKidsGames } from "../pages/Games/GameCategories/Finance/kidGamesData";
import { getFinanceTeenGames } from "../pages/Games/GameCategories/Finance/teenGamesData";
import { getFinanceYoungAdultGames } from "../pages/Games/GameCategories/Finance/youngAdultGamesData";
import { getFinanceAdultGames } from "../pages/Games/GameCategories/Finance/adultGamesData";
import { getBrainKidsGames } from "../pages/Games/GameCategories/Brain/kidGamesData";
import { getBrainTeenGames } from "../pages/Games/GameCategories/Brain/teenGamesData";
import { getBrainYoungAdultGames } from "../pages/Games/GameCategories/Brain/youngAdultGamesData";
import { getBrainAdultGames } from "../pages/Games/GameCategories/Brain/adultGamesData";
import { getUvlsKidsGames } from "../pages/Games/GameCategories/UVLS/kidGamesData";
import { getUvlsTeenGames } from "../pages/Games/GameCategories/UVLS/teenGamesData";
import { getDcosKidsGames } from "../pages/Games/GameCategories/DCOS/kidGamesData";
import { getDcosTeenGames } from "../pages/Games/GameCategories/DCOS/teenGamesData";
import { getMoralKidsGames } from "../pages/Games/GameCategories/MoralValues/kidGamesData";
import { getMoralTeenGames } from "../pages/Games/GameCategories/MoralValues/teenGamesData";
import { getAiKidsGames } from "../pages/Games/GameCategories/AiForAll/kidGamesData";
import { getAiTeenGames } from "../pages/Games/GameCategories/AiForAll/teenGamesData";
import { getEheKidsGames } from "../pages/Games/GameCategories/EHE/kidGamesData";
import { getEheTeenGames } from "../pages/Games/GameCategories/EHE/teenGamesData";
import { getCrgcKidsGames } from "../pages/Games/GameCategories/CRGC/kidGamesData";
import { getCrgcTeensGames } from "../pages/Games/GameCategories/CRGC/teenGamesData";
import { getHealthMaleKidsGames } from "../pages/Games/GameCategories/HealthMale/kidGamesData";
import { getHealthMaleTeenGames } from "../pages/Games/GameCategories/HealthMale/teenGamesData";
import { getHealthFemaleKidsGames } from "../pages/Games/GameCategories/HealthFemale/kidGamesData";
import getHealthFemaleTeenGames from "../pages/Games/GameCategories/HealthFemale/teenGamesData";
import { getSustainabilityKidsGames } from "../pages/Games/GameCategories/Sustainability/kidGamesData";
import { getSustainabilityTeenGames } from "../pages/Games/GameCategories/Sustainability/teenGamesData";

/**
 * Get game data by gameId from the appropriate game category folder
 * @param {string} gameId - The game ID (e.g., "finance-kids-6", "ai-kids-1")
 * @returns {Object|null} - Game data object with coins, xp, and other properties, or null if not found
 */
export const getGameDataById = (gameId) => {
  if (!gameId || typeof gameId !== 'string') {
    console.warn('Invalid gameId provided to getGameDataById:', gameId);
    return null;
  }

  const match = gameId.match(/^(.*)-(kids|teens|teen|young-adult|adult|adults)-(\d+)$/);
  if (!match) {
    console.warn('Invalid gameId format:', gameId);
    return null;
  }

  const [, category, ageGroup] = match;
  const normalizedAge = ageGroup === "teen" ? "teens" : ageGroup.replace("adults", "adult");

  // Map category names to their data functions
  const categoryMap = {
    finance: {
      kids: getFinanceKidsGames,
      teens: getFinanceTeenGames,
      "young-adult": getFinanceYoungAdultGames,
      adults: getFinanceAdultGames,
    },
    brain: {
      kids: getBrainKidsGames,
      teens: getBrainTeenGames,
      "young-adult": getBrainYoungAdultGames,
      adults: getBrainAdultGames,
    },
    uvls: {
      kids: getUvlsKidsGames,
      teens: getUvlsTeenGames,
    },
    dcos: {
      kids: getDcosKidsGames,
      teens: getDcosTeenGames,
    },
    moral: {
      kids: getMoralKidsGames,
      teens: getMoralTeenGames,
    },
    'moral-values': {
      kids: getMoralKidsGames,
      teens: getMoralTeenGames,
    },
    ai: {
      kids: getAiKidsGames,
      teens: getAiTeenGames,
    },
    ehe: {
      kids: getEheKidsGames,
      teens: getEheTeenGames,
    },
    'civic-responsibility': {
      kids: getCrgcKidsGames,
      teens: getCrgcTeensGames,
    },
    crgc: { // backward compatibility
      kids: getCrgcKidsGames,
      teens: getCrgcTeensGames,
    },
    'health-male': {
      kids: getHealthMaleKidsGames,
      teens: getHealthMaleTeenGames,
    },
    healthMale: { // backward compatibility
      kids: getHealthMaleKidsGames,
      teens: getHealthMaleTeenGames,
    },
    'health-female': {
      kids: getHealthFemaleKidsGames,
      teens: getHealthFemaleTeenGames,
    },
    healthFemale: { // backward compatibility
      kids: getHealthFemaleKidsGames,
      teens: getHealthFemaleTeenGames,
    },
    sustainability: {
      kids: getSustainabilityKidsGames,
      teens: getSustainabilityTeenGames,
    },
  };

  // Get the appropriate data function
  const getGamesFunction = categoryMap[category]?.[normalizedAge];

  if (!getGamesFunction) {
    console.warn(`No game data function found for category: ${category}, age: ${normalizedAge}`);
    return null;
  }

  try {
    // Call the function with empty completion status (we just need the game data)
    const games = getGamesFunction({});

    // Find the game by id
    const game = games.find(g => g.id === gameId);

    if (!game) {
      console.warn(`Game not found with id: ${gameId}`);
      return null;
    }

    // Return the game data with coins and xp
    return {
      coins: game.coins || 5, // Default to 5 if not specified
      xp: game.xp || 10, // Default to 10 if not specified
      badgeName: game.badgeName || null,
      badgeImage: game.badgeImage || null,
      isBadgeGame: game.isBadgeGame || false,
      title: game.title,
      description: game.description,
      difficulty: game.difficulty,
      duration: game.duration,
      ...game // Include all other game properties
    };
  } catch (error) {
    console.error(`Error fetching game data for ${gameId}:`, error);
    return null;
  }
};

