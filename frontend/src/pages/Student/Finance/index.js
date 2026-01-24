import kidFinanceGames from "./Kids";
import teenFinanceGames from "./Teen";
import youngAdultFinanceGames from "./YoungAdult";
import adultFinanceGames from "./Adult";


const financeGames = {
  kids: kidFinanceGames,
  teen: teenFinanceGames,
  "young-adult": youngAdultFinanceGames,
  adults: adultFinanceGames,
};

export const getFinanceGame = (ageGroup, gameId) => {
  let normalizedAgeGroup;
  if (["teens", "teen"].includes(ageGroup)) {
    normalizedAgeGroup = "teen";
  } else if (ageGroup === "young-adult") {
    normalizedAgeGroup = "young-adult";
  } else {
    normalizedAgeGroup = ageGroup;
  }

  const normalizedGameId = gameId?.toLowerCase();
  return (
    financeGames[normalizedAgeGroup]?.[normalizedGameId] ||
    financeGames[normalizedAgeGroup]?.[gameId]
  );
};

export default financeGames;
