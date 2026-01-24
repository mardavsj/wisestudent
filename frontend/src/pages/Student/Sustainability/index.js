// Unified Sustainability Games Export
// Combines all sustainability games into a single object

// Import all sustainability games (organized by theme, not age)
import TestSolarGame from './SolarAndCity/TestSolarGame';
import TestWasteRecycleGame from './WasteAndRecycle/TestWasteRecycleGame';
import TestCarbonGame from './CarbonAndClimate/TestCarbonGame';
import TestWaterEnergyGame from './WaterAndEnergy/TestWaterEnergyGame';

// Import Sustainability Kids games
import sustainabilityKidsGames, { getSustainabilityKidsGame } from './Kids';
// Import Sustainability Teens games
import sustainabilityTeenGames, { getSustainabilityTeenGame } from './Teens';

// Create unified games registry
const sustainabilityGames = {
  // All games available for both kids and teens (legacy games)
  all: {
    'test-solar-game': TestSolarGame,
    'test-waste-recycle-game': TestWasteRecycleGame,
    'test-carbon-game': TestCarbonGame,
    'test-water-energy-game': TestWaterEnergyGame
  },

  // Kids module games
  kids: {
    // Legacy games
    'test-solar-game': TestSolarGame,
    'test-waste-recycle-game': TestWasteRecycleGame,
    'test-carbon-game': TestCarbonGame,
    'test-water-energy-game': TestWaterEnergyGame,
    // New Kids module games
    ...sustainabilityKidsGames
  },

  teen: {
    // Legacy games
    'test-solar-game': TestSolarGame,
    'test-waste-recycle-game': TestWasteRecycleGame,
    'test-carbon-game': TestCarbonGame,
    'test-water-energy-game': TestWaterEnergyGame,
    // New Teens module games
    ...sustainabilityTeenGames
  },
  teens: {
    // Legacy games
    'test-solar-game': TestSolarGame,
    'test-waste-recycle-game': TestWasteRecycleGame,
    'test-carbon-game': TestCarbonGame,
    'test-water-energy-game': TestWaterEnergyGame,
    // New Teens module games
    ...sustainabilityTeenGames
  }
};

// Export functions to get games
export const getSustainabilityGame = (age, gameId) => {
  // Normalize gameId to lowercase for matching
  const normalizedGameId = gameId?.toLowerCase();
  
  // For kids age group, try to get from kids games first
  if (age === 'kids' || age === 'kid') {
    const kidsGame = getSustainabilityKidsGame(normalizedGameId);
    if (kidsGame) {
      return kidsGame;
    }
  }
  
  // For teens age group, try to get from teens games first
  if (['teens', 'teen', 'young-adult'].includes(age)) {
    const teenGame = getSustainabilityTeenGame(normalizedGameId);
    if (teenGame) {
      return teenGame;
    }
  }
  
  return sustainabilityGames[age]?.[normalizedGameId] || sustainabilityGames.all[normalizedGameId];
};

export const getAllSustainabilityGames = (age = null) => {
  const normalizedAge = age === "young-adult" ? "teen" : age;
  if (normalizedAge && normalizedAge !== "all") {
    return sustainabilityGames[normalizedAge] || {};
  }
  return sustainabilityGames.all;
};

export const getSustainabilityGameIds = (age = null) => {
  const normalizedAge = age === "young-adult" ? "teen" : age;
  if (normalizedAge && normalizedAge !== "all") {
    return Object.keys(sustainabilityGames[normalizedAge] || {});
  }
  return Object.keys(sustainabilityGames.all);
};

export default sustainabilityGames;
