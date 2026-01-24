import kidHealthFemaleGames from "./Kids";
import teenHealthFemaleGames from "./Teens";

const healthFemaleGames = {
  kids: kidHealthFemaleGames,
  teen: teenHealthFemaleGames,
};

export const getHealthFemaleGame = (ageGroup, gameId) => {
  const normalizedAgeGroup = ["teens", "young-adult"].includes(ageGroup) ? "teen" : ageGroup;
  return healthFemaleGames[normalizedAgeGroup]?.[gameId];
};

export default healthFemaleGames;
