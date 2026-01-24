import kidBrainGames from "./Kids";
import teenBrainGames from "./Teen";
import youngAdultBrainGames from "./YoungAdult";
import adultBrainGames from "./Adult";

const brainGames = {
  kids: kidBrainGames,
  teen: teenBrainGames,
  "young-adult": youngAdultBrainGames,
  adults: adultBrainGames,
};

export const getBrainGame = (ageGroup, gameId) => {
  let normalizedAgeGroup;

  if (ageGroup === "young-adult") {
    normalizedAgeGroup = "young-adult";
  } else if (["teens", "teen"].includes(ageGroup)) {
    normalizedAgeGroup = "teen";
  } else if (["adult", "adults"].includes(ageGroup)) {
    normalizedAgeGroup = "adults";
  } else {
    normalizedAgeGroup = ageGroup;
  }

  return brainGames[normalizedAgeGroup]?.[gameId];
};

export default brainGames;
