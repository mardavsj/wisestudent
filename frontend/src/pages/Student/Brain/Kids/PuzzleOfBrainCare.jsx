import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PuzzleOfBrainCare = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-4");
  const gameId = gameData?.id || "brain-kids-4";
  
  const gameContent = t("brain-health.kids.puzzle-of-brain-care", { returnObjects: true });
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for PuzzleOfBrainCare, using fallback ID");
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
    // The original code had a fixed shuffle: [2, 0, 4, 1, 3]
    const shuffleIndices = [2, 0, 4, 1, 3];
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
      title={gameContent?.title || "Puzzle of Brain Care"}
      score={score}
      subtitle={
        showResult 
          ? gameContent?.subtitleComplete || "Puzzle Complete!" 
          : t("brain-health.kids.puzzle-of-brain-care.subtitleProgress", {
              current: matches.length,
              total: leftItems.length,
              defaultValue: `Match brain care activities with their benefits (${matches.length}/${leftItems.length} matched)`,
            })
      }
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/brain/kids/breakfast-story"
      nextGameIdProp="brain-kids-5"
      gameType="brain"
      totalLevels={leftItems.length}
      currentLevel={matches.length + 1}
      maxScore={leftItems.length}
      showConfetti={showResult && score === leftItems.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8 max-w-5xl mx-auto">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">
                  {t("brain-health.kids.puzzle-of-brain-care.matchesLabel", {
                    current: matches.length,
                    total: leftItems.length,
                    defaultValue: `Matches: ${matches.length}/${leftItems.length}`,
                  })}
                </span>
                <span className="text-yellow-400 font-bold">
                  {t("brain-health.kids.puzzle-of-brain-care.scoreLabel", {
                    score,
                    total: leftItems.length,
                    defaultValue: `Score: ${score}/${leftItems.length}`,
                  })}
                </span>
              </div>
              
              <p className="text-white/90 text-center mb-6">
                {gameContent?.instructions || "Select an activity from the left and its benefit from the right, then click \"Match\""}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Left column - Activities */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-white text-center">
                    {gameContent?.leftTitle || "Brain Care Activities"}
                  </h4>
                  <div className="space-y-3">
                    {leftItems.map((item) => {
                      const isMatched = isLeftItemMatched(item.id);
                      const matchResult = getMatchResult(item.id);
                      const isSelected = selectedLeft?.id === item.id;
                      
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleLeftSelect(item)}
                          disabled={isMatched || showResult}
                          className={`w-full p-4 rounded-xl transition-all border-2 ${
                            isSelected
                              ? 'bg-blue-500/30 border-blue-400 ring-2 ring-blue-400'
                              : isMatched
                              ? matchResult
                                ? 'bg-green-500/20 border-green-400 opacity-70'
                                : 'bg-red-500/20 border-red-400 opacity-70'
                              : 'bg-white/10 hover:bg-white/20 border-white/30'
                          } ${isMatched ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{item.emoji}</span>
                            <div className="text-left flex-1">
                              <div className="font-semibold text-white">{item.name}</div>
                              {item.description && <div className="text-sm text-white/70">{item.description}</div>}
                            </div>
                            {isMatched && (
                              <span className={`text-xl ${matchResult ? 'text-green-400' : 'text-red-400'}`}>
                                {matchResult ? '✓' : '✗'}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right column - Benefits */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-white text-center">
                    {gameContent?.rightTitle || "Benefits"}
                  </h4>
                  <div className="space-y-3">
                    {shuffledRightItems.map((item) => {
                      const isMatched = isRightItemMatched(item.id);
                      const isSelected = selectedRight?.id === item.id;
                      
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleRightSelect(item)}
                          disabled={isMatched || showResult}
                          className={`w-full p-4 rounded-xl transition-all border-2 text-left ${
                            isSelected
                              ? 'bg-blue-500/30 border-blue-400 ring-2 ring-blue-400'
                              : isMatched
                              ? 'bg-green-500/20 border-green-400 opacity-70'
                              : 'bg-white/10 hover:bg-white/20 border-white/30'
                          } ${isMatched ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{item.emoji}</span>
                            <div className="flex-1">
                              <div className="font-semibold text-white">{item.name}</div>
                              {item.description && <div className="text-sm text-white/70">{item.description}</div>}
                            </div>
                            {isMatched && (
                              <span className="text-xl text-green-400">✓</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Match button */}
              <div className="text-center">
                <button
                  onClick={handleMatch}
                  disabled={!selectedLeft || !selectedRight || showResult}
                  className={`px-8 py-3 rounded-full font-bold transition-all ${
                    selectedLeft && selectedRight && !showResult
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white transform hover:scale-105'
                      : 'bg-gray-500/30 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {gameContent?.matchButton || "Match Selected"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default PuzzleOfBrainCare;

