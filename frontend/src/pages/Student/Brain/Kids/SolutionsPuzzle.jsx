import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SolutionsPuzzle = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-84");
  const gameId = gameData?.id || "brain-kids-84";
  
  const gameContent = t("brain-health.kids.solutions-puzzle", { returnObjects: true });
  const leftItems = Array.isArray(gameContent?.problems) ? gameContent.problems : [];
  const rightItems = Array.isArray(gameContent?.solutions) ? gameContent.solutions : [];

  // Correct matches
  const correctMatches = [
    { leftId: 1, rightId: 1 }, // Broken Pencil → Borrow
    { leftId: 2, rightId: 2 }, // Spilled Water → Clean
    { leftId: 3, rightId: 3 }, // Lost Eraser → Search
    { leftId: 4, rightId: 4 }, // Torn Paper → Tape
    { leftId: 5, rightId: 5 }  // Missing Book → Ask
  ];

  // Shuffled right items for display
  const shuffledRightItems = useMemo(() => {
    if (!rightItems.length) return [];
    return [
      rightItems.find(i => i.id === 3),
      rightItems.find(i => i.id === 5),
      rightItems.find(i => i.id === 1),
      rightItems.find(i => i.id === 4),
      rightItems.find(i => i.id === 2)
    ].filter(Boolean);
  }, [rightItems]);
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SolutionsPuzzle, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const handleLeftSelect = (item) => {
    if (showResult) return;
    setSelectedLeft(item);
  };

  const handleRightSelect = (item) => {
    if (showResult) return;
    setSelectedRight(item);
  };

  const handleMatch = () => {
    if (!selectedLeft || !selectedRight || showResult) return;

    resetFeedback();

    const newMatch = {
      leftId: selectedLeft.id,
      rightId: selectedRight.id,
      isCorrect: correctMatches.some(
        match => match.leftId === selectedLeft.id && match.rightId === selectedRight.id
      )
    };

    const newMatches = [...matches, newMatch];
    setMatches(newMatches);

    // If the match is correct, add score and show flash/confetti
    if (newMatch.isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    // Check if all items are matched
    if (newMatches.length === leftItems.length) {
      setTimeout(() => {
        setShowResult(true);
      }, 1000);
    }

    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const isLeftMatched = (leftId) => {
    return matches.some(m => m.leftId === leftId && m.isCorrect);
  };

  const isRightMatched = (rightId) => {
    return matches.some(m => m.rightId === rightId && m.isCorrect);
  };

  return (
    <GameShell
      title={gameContent?.title || "Puzzle of Solutions"}
      subtitle={
        showResult 
          ? gameContent?.subtitleDefault || "Puzzle Complete!" 
          : t("brain-health.kids.solutions-puzzle.subtitlePlaying", {
              current: matches.length,
              total: leftItems.length,
              defaultValue: `Match ${matches.length}/${leftItems.length}`
            })
      }
      score={score}
      currentLevel={matches.length + 1}
      totalLevels={leftItems.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={leftItems.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGameIdProp="brain-kids-85"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="brain"
      backPath="/games/brain-health/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">
                  {t("brain-health.kids.solutions-puzzle.matchLabel", {
                    current: matches.length,
                    total: leftItems.length,
                    defaultValue: `Matches: ${matches.length}/${leftItems.length}`
                  })}
                </span>
                <span className="text-yellow-400 font-bold">
                  {t("brain-health.kids.solutions-puzzle.scoreLabel", {
                    current: score,
                    total: leftItems.length,
                    defaultValue: `Score: ${score}/${leftItems.length}`
                  })}
                </span>
              </div>
              
              <p className="text-white text-lg mb-6 text-center">
                {gameContent?.instructions || "Match the problems with the correct solutions!"}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left side */}
                <div className="space-y-3">
                  <h3 className="text-white font-bold text-center mb-4">
                    {gameContent?.problemsTitle || "Problems"}
                  </h3>
                  {leftItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleLeftSelect(item)}
                      disabled={isLeftMatched(item.id)}
                      className={`w-full p-4 rounded-xl transition-all ${
                        selectedLeft?.id === item.id
                          ? "bg-blue-500 border-4 border-blue-300"
                          : isLeftMatched(item.id)
                          ? "bg-green-500/30 border-2 border-green-400 opacity-60"
                          : "bg-white/10 border-2 border-white/20 hover:bg-white/20"
                      } ${isLeftMatched(item.id) ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{item.emoji}</span>
                        <div className="text-left">
                          <div className="text-white font-semibold">{item.name}</div>
                          <div className="text-white/70 text-sm">{item.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Right side */}
                <div className="space-y-3">
                  <h3 className="text-white font-bold text-center mb-4">
                    {gameContent?.solutionsTitle || "Solutions"}
                  </h3>
                  {shuffledRightItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleRightSelect(item)}
                      disabled={isRightMatched(item.id)}
                      className={`w-full p-4 rounded-xl transition-all ${
                        selectedRight?.id === item.id
                          ? "bg-blue-500 border-4 border-blue-300"
                          : isRightMatched(item.id)
                          ? "bg-green-500/30 border-2 border-green-400 opacity-60"
                          : "bg-white/10 border-2 border-white/20 hover:bg-white/20"
                      } ${isRightMatched(item.id) ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{item.emoji}</span>
                        <div className="text-left">
                          <div className="text-white font-semibold">{item.name}</div>
                          <div className="text-white/70 text-sm">{item.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Match button */}
              <div className="mt-6 text-center">
                <button
                  onClick={handleMatch}
                  disabled={!selectedLeft || !selectedRight}
                  className={`px-8 py-3 rounded-full font-bold transition-all ${
                    selectedLeft && selectedRight
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                      : "bg-white/20 text-white/50 cursor-not-allowed"
                  }`}
                >
                  {gameContent?.matchButton || "Match"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default SolutionsPuzzle;

