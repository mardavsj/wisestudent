import kidCrgcGames from "./Kids";
import teenCrgcGames from "./Teens";

const crgcGames = {
  kids: kidCrgcGames,
  teen: teenCrgcGames
};

export const getCrgcGame = (ageGroup, gameId) => {
  const normalizedAgeGroup = ["teens", "young-adult"].includes(ageGroup) ? "teen" : ageGroup;
  return crgcGames[normalizedAgeGroup]?.[gameId];
};

export default crgcGames;
