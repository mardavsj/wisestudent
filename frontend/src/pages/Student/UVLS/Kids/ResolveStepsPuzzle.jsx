import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ResolveStepsPuzzle = () => {
  const navigate = useNavigate();

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedStep, setSelectedStep] = useState(null);
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Conflict resolution steps (left side) - 5 items
  const steps = [
    { id: 1, name: "Listen", emoji: "👂",  },
    { id: 2, name: "Understand", emoji: "🧠",  },
    { id: 3, name: "Propose", emoji: "💡",  },
    { id: 4, name: "Agree", emoji: "🤝",  },
    { id: 5, name: "Follow-up", emoji: "📅",  }
  ];

  // Resolution outcomes (right side) - 5 items
  const outcomes = [
    { id: 6, name: "Clear Communication", emoji: "📢",  },
    { id: 7, name: "Problem Clarity", emoji: "🔍",  },
    { id: 8, name: "Solution Ideas", emoji: "✨",  },
    { id: 9, name: "Mutual Agreement", emoji: "😶",  },
    { id: 10, name: "Implementation Check", emoji: "🔁",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedOutcomes = [
    outcomes[2], // Solution Ideas (id: 8)
    outcomes[4], // Implementation Check (id: 10)
    outcomes[1], // Problem Clarity (id: 7)
    outcomes[0], // Clear Communication (id: 6)
    outcomes[3]  // Mutual Agreement (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each step has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { stepId: 1, outcomeId: 6 }, // Listen → Clear Communication
    { stepId: 2, outcomeId: 7 }, // Understand → Problem Clarity
    { stepId: 3, outcomeId: 8 }, // Propose → Solution Ideas
    { stepId: 4, outcomeId: 9 }, // Agree → Mutual Agreement
    { stepId: 5, outcomeId: 10 } // Follow-up → Implementation Check
  ];

  const handleStepSelect = (step) => {
    if (gameFinished) return;
    setSelectedStep(step);
  };

  const handleOutcomeSelect = (outcome) => {
    if (gameFinished) return;
    setSelectedOutcome(outcome);
  };

  const handleMatch = () => {
    if (!selectedStep || !selectedOutcome || gameFinished) return;

    resetFeedback();

    const newMatch = {
      stepId: selectedStep.id,
      outcomeId: selectedOutcome.id,
      isCorrect: correctMatches.some(
        match => match.stepId === selectedStep.id && match.outcomeId === selectedOutcome.id
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
    if (newMatches.length === steps.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedStep(null);
    setSelectedOutcome(null);
  };

  // Check if a step is already matched
  const isStepMatched = (stepId) => {
    return matches.some(match => match.stepId === stepId);
  };

  // Check if an outcome is already matched
  const isOutcomeMatched = (outcomeId) => {
    return matches.some(match => match.outcomeId === outcomeId);
  };

  // Get match result for a step
  const getMatchResult = (stepId) => {
    const match = matches.find(m => m.stepId === stepId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  return (
    <GameShell
      title="Resolve Steps Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Steps with Outcomes (${matches.length}/${steps.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="uvls-kids-74"
      nextGamePathProp="/student/uvls/kids/split-fairly-roleplay"
      nextGameIdProp="uvls-kids-75"
      gameType="uvls"
      totalLevels={steps.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === steps.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
      maxScore={steps.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Conflict Resolution Steps */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Resolution Steps</h3>
              <div className="space-y-4">
                {steps.map(step => (
                  <button
                    key={step.id}
                    onClick={() => handleStepSelect(step)}
                    disabled={isStepMatched(step.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isStepMatched(step.id)
                        ? getMatchResult(step.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedStep?.id === step.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{step.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{step.name}</h4>
                        
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
                  {selectedStep 
                    ? `Selected: ${selectedStep.name}` 
                    : "Select a Resolution Step"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedStep || !selectedOutcome}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedStep && selectedOutcome
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{steps.length}</p>
                  <p>Matched: {matches.length}/{steps.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Resolution Outcomes */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Resolution Outcomes</h3>
              <div className="space-y-4">
                {rearrangedOutcomes.map(outcome => (
                  <button
                    key={outcome.id}
                    onClick={() => handleOutcomeSelect(outcome)}
                    disabled={isOutcomeMatched(outcome.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isOutcomeMatched(outcome.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedOutcome?.id === outcome.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{outcome.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{outcome.name}</h4>
                        <p className="text-white/80 text-sm">{outcome.description}</p>
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
                  You correctly matched {score} out of {steps.length} conflict resolution steps with their outcomes!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Following proper conflict resolution steps leads to successful outcomes!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {steps.length} conflict resolution steps correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about what each resolution step accomplishes!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ResolveStepsPuzzle;