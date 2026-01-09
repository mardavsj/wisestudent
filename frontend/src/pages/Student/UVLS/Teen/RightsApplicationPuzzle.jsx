import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RightsApplicationPuzzle = () => {
  const navigate = useNavigate();

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedRight, setSelectedRight] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Human rights (left side) - 5 items with hints
  const rights = [
    { id: 1, name: "Equal Education", emoji: "📚",  },
    { id: 2, name: "Personal Safety", emoji: "🛡️",  },
    { id: 3, name: "Fair Pay", emoji: "💰",  },
    { id: 4, name: "Non-Discrimination", emoji: "⚖️",  },
    { id: 5, name: "Healthcare Access", emoji: "🏥",  }
  ];

  // Protective actions (right side) - 5 items with descriptions
  const actions = [
    { id: 6, name: "Advocacy & Reporting", emoji: "📢",  },
    { id: 7, name: "Legal Protection", emoji: "👮",  },
    { id: 8, name: "Formal Complaint", emoji: "📝",  },
    { id: 9, name: "HR Intervention", emoji: "👔",  },
    { id: 10, name: "Medical Advocacy", emoji: "💉",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedActions = [
    actions[2], // Formal Complaint (id: 8)
    actions[4], // Medical Advocacy (id: 10)
    actions[1], // Legal Protection (id: 7)
    actions[0], // Advocacy & Reporting (id: 6)
    actions[3]  // HR Intervention (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each right has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { rightId: 1, actionId: 6 }, // Equal Education → Advocacy & Reporting
    { rightId: 2, actionId: 7 }, // Personal Safety → Legal Protection
    { rightId: 3, actionId: 8 }, // Fair Pay → Formal Complaint
    { rightId: 4, actionId: 9 }, // Non-Discrimination → HR Intervention
    { rightId: 5, actionId: 10 } // Healthcare Access → Medical Advocacy
  ];

  const handleRightSelect = (right) => {
    if (gameFinished) return;
    setSelectedRight(right);
  };

  const handleActionSelect = (action) => {
    if (gameFinished) return;
    setSelectedAction(action);
  };

  const handleMatch = () => {
    if (!selectedRight || !selectedAction || gameFinished) return;

    resetFeedback();

    const newMatch = {
      rightId: selectedRight.id,
      actionId: selectedAction.id,
      isCorrect: correctMatches.some(
        match => match.rightId === selectedRight.id && match.actionId === selectedAction.id
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
    if (newMatches.length === rights.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedRight(null);
    setSelectedAction(null);
  };

  // Check if a right is already matched
  const isRightMatched = (rightId) => {
    return matches.some(match => match.rightId === rightId);
  };

  // Check if an action is already matched
  const isActionMatched = (actionId) => {
    return matches.some(match => match.actionId === actionId);
  };

  // Get match result for a right
  const getMatchResult = (rightId) => {
    const match = matches.find(m => m.rightId === rightId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/uvls/teen");
  };

  return (
    <GameShell
      title="Rights Application Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Rights with Actions (${matches.length}/${rights.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="uvls-teen-29"
      nextGamePathProp="/student/uvls/teen/gender-justice-leader-badge"
      nextGameIdProp="uvls-teen-30"
      gameType="uvls"
      totalLevels={rights.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === rights.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/teen"
      maxScore={rights.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Human Rights */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Human Rights</h3>
              <div className="space-y-4">
                {rights.map(right => (
                  <button
                    key={right.id}
                    onClick={() => handleRightSelect(right)}
                    disabled={isRightMatched(right.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isRightMatched(right.id)
                        ? getMatchResult(right.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedRight?.id === right.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{right.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{right.name}</h4>
                        
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
                  {selectedRight 
                    ? `Selected: ${selectedRight.name}` 
                    : "Select a Human Right"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedRight || !selectedAction}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedRight && selectedAction
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{rights.length}</p>
                  <p>Matched: {matches.length}/{rights.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Protective Actions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Protective Actions</h3>
              <div className="space-y-4">
                {rearrangedActions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleActionSelect(action)}
                    disabled={isActionMatched(action.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isActionMatched(action.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedAction?.id === action.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{action.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{action.name}</h4>
                        <p className="text-white/80 text-sm">{action.description}</p>
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
                  You correctly matched {score} out of {rights.length} human rights with protective actions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Knowing your rights and taking appropriate action is essential for protection!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {rights.length} human rights correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about which action best protects each specific right!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RightsApplicationPuzzle;