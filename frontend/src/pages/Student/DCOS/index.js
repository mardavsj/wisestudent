import kidDcosGames from "./Kids";
import teenDcosGames from "./Teen";


const dcosGames = {
  kids: kidDcosGames,
  teen: teenDcosGames,
};

export const getDcosGame = (ageGroup, gameId) => {
  const normalizedAgeGroup = ["teens", "young-adult"].includes(ageGroup) ? "teen" : ageGroup;
  return dcosGames[normalizedAgeGroup]?.[gameId];
};

export default dcosGames;
