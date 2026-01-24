import kidHealthMaleGames from "./Kids";
import teenHealthMaleGames from "./Teen";


const healthMaleGames = {
  kids: kidHealthMaleGames,
  teen: teenHealthMaleGames,
};

export const getHealthMaleGame = (ageGroup, gameId) => {
  const normalizedAgeGroup = ["teens", "young-adult"].includes(ageGroup) ? "teen" : ageGroup;
  return healthMaleGames[normalizedAgeGroup]?.[gameId];
};

export default healthMaleGames;
