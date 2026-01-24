import kidMoralGames from "./Kids";
import teenMoralGames from "./Teen";


const moralValuesGames = {
  kids: kidMoralGames,
  teen: teenMoralGames,
};

export const getMoralValuesGame = (ageGroup, gameId) => {
  const normalizedAgeGroup = ["teens", "young-adult"].includes(ageGroup) ? "teen" : ageGroup;
  return moralValuesGames[normalizedAgeGroup]?.[gameId];
};

export default moralValuesGames;
