import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PublicBudgetPuzzle = () => {
  const navigate = useNavigate();

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedNeed, setSelectedNeed] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Community needs (left side) - 5 items with hints
  const needs = [
    { id: 1, name: "Education Resources", emoji: "📚",  },
    { id: 2, name: "Healthcare Services", emoji: "🏥",  },
    { id: 3, name: "Infrastructure", emoji: "🏗️",  },
    { id: 4, name: "Public Safety", emoji: "👮",  },
    { id: 5, name: "Environmental Care", emoji: "🌳",  }
  ];

  // Budget priorities (right side) - 5 items with descriptions
  const priorities = [
    { id: 6, name: "High Impact", emoji: "🎯",  },
    { id: 7, name: "Urgent Care", emoji: "🚑",  },
    { id: 8, name: "Long-term Value", emoji: "📈",  },
    { id: 9, name: "Risk Prevention", emoji: "🛡️",  },
    { id: 10, name: "Quality of Life", emoji: "😊",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedPriorities = [
    priorities[2], // Long-term Value (id: 8)
    priorities[4], // Quality of Life (id: 10)
    priorities[1], // Urgent Care (id: 7)
    priorities[0], // High Impact (id: 6)
    priorities[3]  // Risk Prevention (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each need has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { needId: 1, priorityId: 6 }, // Education Resources → High Impact
    { needId: 2, priorityId: 7 }, // Healthcare Services → Urgent Care
    { needId: 3, priorityId: 8 }, // Infrastructure → Long-term Value
    { needId: 4, priorityId: 9 }, // Public Safety → Risk Prevention
    { needId: 5, priorityId: 10 } // Environmental Care → Quality of Life
  ];

  const handleNeedSelect = (need) => {
    if (gameFinished) return;
    setSelectedNeed(need);
  };

  const handlePrioritySelect = (priority) => {
    if (gameFinished) return;
    setSelectedPriority(priority);
  };

  const handleMatch = () => {
    if (!selectedNeed || !selectedPriority || gameFinished) return;

    resetFeedback();

    const newMatch = {
      needId: selectedNeed.id,
      priorityId: selectedPriority.id,
      isCorrect: correctMatches.some(
        match => match.needId === selectedNeed.id && match.priorityId === selectedPriority.id
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
    if (newMatches.length === needs.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedNeed(null);
    setSelectedPriority(null);
  };

  // Check if a need is already matched
  const isNeedMatched = (needId) => {
    return matches.some(match => match.needId === needId);
  };

  // Check if a priority is already matched
  const isPriorityMatched = (priorityId) => {
    return matches.some(match => match.priorityId === priorityId);
  };

  // Get match result for a need
  const getMatchResult = (needId) => {
    const match = matches.find(m => m.needId === needId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/uvls/teen");
  };

  return (
    <GameShell
      title="Public Budget Puzzle"
      subtitle={gameFinished ? "Budget Puzzle Complete!" : `Match Needs with Priorities (${matches.length}/${needs.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="uvls-teen-84"
      nextGamePathProp="/student/uvls/teen/advocacy-roleplay"
      nextGameIdProp="uvls-teen-85"
      gameType="uvls"
      totalLevels={needs.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === needs.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teen"
      maxScore={needs.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Community Needs */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Community Needs</h3>
              <div className="space-y-4">
                {needs.map(need => (
                  <button
                    key={need.id}
                    onClick={() => handleNeedSelect(need)}
                    disabled={isNeedMatched(need.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isNeedMatched(need.id)
                        ? getMatchResult(need.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedNeed?.id === need.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{need.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{need.name}</h4>
                        
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Middle column - Match button */}
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
                <p className="text-white/80 mb-4">
                  {selectedNeed 
                    ? `Selected: ${selectedNeed.name}` 
                    : "Select a Community Need"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedNeed || !selectedPriority}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedNeed && selectedPriority
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{needs.length}</p>
                  <p>Matched: {matches.length}/{needs.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Budget Priorities */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Budget Priorities</h3>
              <div className="space-y-4">
                {rearrangedPriorities.map(priority => (
                  <button
                    key={priority.id}
                    onClick={() => handlePrioritySelect(priority)}
                    disabled={isPriorityMatched(priority.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isPriorityMatched(priority.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedPriority?.id === priority.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{priority.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{priority.name}</h4>
                        <p className="text-white/80 text-sm">{priority.description}</p>
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
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You correctly matched {score} out of {needs.length} community needs with budget priorities!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Effective budget allocation requires matching community needs with appropriate priorities!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {needs.length} community needs correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about which priority level each community need should receive!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PublicBudgetPuzzle;