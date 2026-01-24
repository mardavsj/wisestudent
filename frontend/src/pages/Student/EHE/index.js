import kidEheGames from "./Kids";
import teenEheGames from "./Teens";

const eheGames = {
  kids: kidEheGames,
  teen: teenEheGames
};

export const getEheGame = (ageGroup, gameId) => {
  const normalizedAgeGroup = ["teens", "young-adult"].includes(ageGroup) ? "teen" : ageGroup;
  return eheGames[normalizedAgeGroup]?.[gameId];
};

export default eheGames;
