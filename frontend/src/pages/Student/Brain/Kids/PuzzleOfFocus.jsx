import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PuzzleOfFocus = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-14");
  const gameId = gameData?.id || "brain-kids-14";
  
  const gameContent = t("brain-health.kids.puzzle-of-focus", { returnObjects: true });
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for PuzzleOfFocus, using fallback ID");
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

  const leftItems = Array.isArray(gameContent?.leftItems) ? gameContent.leftItems : [];
  const rightItems = Array.isArray(gameContent?.rightItems) ? gameContent.rightItems : [];
  const correctMatches = Array.isArray(gameContent?.correctMatches) ? gameContent.correctMatches : [];

  // Shuffled right items for display
  const shuffledRightItems = useMemo(() => {
    if (rightItems.length === 0) return [];
    // The original code had a fixed shuffle: [2, 4, 0, 3, 1]
    const shuffleIndices = [2, 4, 0, 3, 1];
    return shuffleIndices.map(idx => rightItems[idx]).filter(Boolean);
  }, [rightItems]);

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
      }, 800);
    }

    // Reset selections
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  // Check if a left item is already matched
  const isLeftItemMatched = (itemId) => {
    return matches.some(match => match.leftId === itemId);
  };

  // Check if a right item is already matched
  const isRightItemMatched = (itemId) => {
    return matches.some(match => match.rightId === itemId);
  };

  // Get match result for a left item
  const getMatchResult = (itemId) => {
    const match = matches.find(m => m.leftId === itemId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title={gameContent?.title || "Puzzle of Focus"}
      score={score}
      subtitle={
        showResult 
          ? gameContent?.subtitleComplete || "Game Complete!" 
          : t("brain-health.kids.puzzle-of-focus.subtitleProgress", {
              current: matches.length,
              total: leftItems.length,
              defaultValue: `Match focus concepts to their effects (${matches.length}/${leftItems.length} matched)`,
            })
      }
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/brain/kids/homework-story"
      nextGameIdProp="brain-kids-15"
      gameType="brain"
      totalLevels={leftItems.length}
      currentLevel={matches.length + 1}
      maxScore={leftItems.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Focus Concepts */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                {gameContent?.conceptTitle || "Focus Concepts"}
              </h3>
              <div className="space-y-4">
                {leftItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleLeftSelect(item)}
                    disabled={isLeftItemMatched(item.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isLeftItemMatched(item.id)
                        ? getMatchResult(item.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedLeft?.id === item.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{item.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{item.name}</h4>
                        {item.description && <p className="text-white/80 text-sm">{item.description}</p>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Middle column - Match button */}
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center w-full">
                <p className="text-white/80 mb-4 h-12 flex items-center justify-center">
                  {selectedLeft 
                    ? t("brain-health.kids.puzzle-of-focus.selectedConcept", {
                        name: selectedLeft.name,
                        defaultValue: `Selected: ${selectedLeft.name}`,
                      })
                    : gameContent?.selectConcept || "Select a concept"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedLeft || !selectedRight}
                  className={`w-full py-3 px-6 rounded-full font-bold transition-all ${
                    selectedLeft && selectedRight
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {gameContent?.matchButton || "Match Selected"}
                </button>
                <div className="mt-4 text-white/80">
                  <p>
                    {t("brain-health.kids.puzzle-of-focus.scoreLabel", {
                      score,
                      total: leftItems.length,
                      defaultValue: `Score: ${score}/${leftItems.length}`,
                    })}
                  </p>
                  <p>
                    {t("brain-health.kids.puzzle-of-focus.matchedLabel", {
                      current: matches.length,
                      total: leftItems.length,
                      defaultValue: `Matched: ${matches.length}/${leftItems.length}`,
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Right column - Effects */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                {gameContent?.effectTitle || "Effects"}
              </h3>
              <div className="space-y-4">
                {shuffledRightItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleRightSelect(item)}
                    disabled={isRightItemMatched(item.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isRightItemMatched(item.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedRight?.id === item.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{item.emoji || "❓"}</div>
                      <div>
                        <h4 className="font-bold text-white">{item.name}</h4>
                        {item.description && <p className="text-white/80 text-sm">{item.description}</p>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {gameContent?.greatMatchingTitle || "Great Matching!"}
                </h3>
                <p className="text-white/90 text-lg mb-4">
                  {t("brain-health.kids.puzzle-of-focus.greatMatchingDescription", {
                    score,
                    total: leftItems.length,
                    defaultValue: `You correctly matched ${score} out of ${leftItems.length} focus concepts! You understand how focus works!`,
                  })}
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>
                    {t("brain-health.kids.puzzle-of-focus.coinsAwarded", {
                      score,
                      defaultValue: `+${score} Coins`,
                    })}
                  </span>
                </div>
                <p className="text-white/80">
                  {gameContent?.matchingSummary || "You know that meditation creates calm, quiet rooms help focus, and listening improves learning!"}
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {gameContent?.keepLearningTitle || "Keep Learning!"}
                </h3>
                <p className="text-white/90 text-lg mb-4">
                  {t("brain-health.kids.puzzle-of-focus.keepLearningDescription", {
                    score,
                    total: leftItems.length,
                    defaultValue: `You matched ${score} out of ${leftItems.length} focus concepts correctly. Remember, understanding these concepts helps you focus better!`,
                  })}
                </p>
                <p className="text-white/80 text-sm">
                  {gameContent?.learningHint || "Try to match each focus concept with its appropriate effect. Meditation → Calm Mind, Quiet Room → Better Focus!"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleOfFocus;

