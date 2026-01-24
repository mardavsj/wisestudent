import kidAiGames from "./Kids";
import teenAiGames from "./Teen";


const aiForAllGames = {
  kids: kidAiGames,
  teen: teenAiGames,
};

export const getAiForAllGame = (ageGroup, gameId) => {
  const normalizedAgeGroup = ["teens", "young-adult"].includes(ageGroup) ? "teen" : ageGroup;
  return aiForAllGames[normalizedAgeGroup]?.[gameId];
};

export default aiForAllGames;
