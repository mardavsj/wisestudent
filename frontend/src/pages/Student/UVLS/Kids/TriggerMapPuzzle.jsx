import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TriggerMapPuzzle = () => {
  const navigate = useNavigate();

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const [selectedCalm, setSelectedCalm] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Emotional triggers (left side) - 5 items with hints
  const triggers = [
    { id: 1, name: "Angry", emoji: "😠",  },
    { id: 2, name: "Sad", emoji: "😢",  },
    { id: 3, name: "Scared", emoji: "😨",  },
    { id: 4, name: "Frustrated", emoji: "😤",  },
    { id: 5, name: "Lonely", emoji: "😔",  }
  ];

  // Calming strategies (right side) - 5 items with descriptions
  const calms = [
    { id: 6, name: "Deep Breathing", emoji: "💨",  },
    { id: 7, name: "Talking", emoji: "🗣️",  },
    { id: 8, name: "Walking", emoji: "🚶",  },
    { id: 9, name: "Listening Music", emoji: "🎵",  },
    { id: 10, name: "Calling Friend", emoji: "📞",  }
  ];

  // Manually rearrange positions to prevent positional matching
  // Original order was [6,7,8,9,10], rearranged to [8,10,7,6,9]
  const rearrangedCalms = [
    calms[2], // Walking (id: 8)
    calms[4], // Calling Friend (id: 10)
    calms[1], // Talking (id: 7)
    calms[0], // Deep Breathing (id: 6)
    calms[3]  // Listening Music (id: 9)
  ];

  // Correct matches using proper IDs, not positional order
  // Each trigger has a unique correct match for true one-to-one mapping
  const correctMatches = [
    { triggerId: 1, calmId: 6 }, // Angry → Deep Breathing
    { triggerId: 2, calmId: 7 }, // Sad → Talking
    { triggerId: 3, calmId: 8 }, // Scared → Walking
    { triggerId: 4, calmId: 9 }, // Frustrated → Listening Music
    { triggerId: 5, calmId: 10 } // Lonely → Calling Friend
  ];

  const handleTriggerSelect = (trigger) => {
    if (gameFinished) return;
    setSelectedTrigger(trigger);
  };

  const handleCalmSelect = (calm) => {
    if (gameFinished) return;
    setSelectedCalm(calm);
  };

  const handleMatch = () => {
    if (!selectedTrigger || !selectedCalm || gameFinished) return;

    resetFeedback();

    const newMatch = {
      triggerId: selectedTrigger.id,
      calmId: selectedCalm.id,
      isCorrect: correctMatches.some(
        match => match.triggerId === selectedTrigger.id && match.calmId === selectedCalm.id
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
    if (newMatches.length === triggers.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedTrigger(null);
    setSelectedCalm(null);
  };

  // Check if a trigger is already matched
  const isTriggerMatched = (triggerId) => {
    return matches.some(match => match.triggerId === triggerId);
  };

  // Check if a calm is already matched
  const isCalmMatched = (calmId) => {
    return matches.some(match => match.calmId === calmId);
  };

  // Get match result for a trigger
  const getMatchResult = (triggerId) => {
    const match = matches.find(m => m.triggerId === triggerId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  return (
    <GameShell
      title="Trigger Map Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Triggers with Calms (${matches.length}/${triggers.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="uvls-kids-49"
      nextGamePathProp="/student/uvls/kids/self-aware-badge"
      nextGameIdProp="uvls-kids-50"
      gameType="uvls"
      totalLevels={triggers.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === triggers.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/uvls/kids"
      maxScore={triggers.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Emotional Triggers */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Emotional Triggers</h3>
              <div className="space-y-4">
                {triggers.map(trigger => (
                  <button
                    key={trigger.id}
                    onClick={() => handleTriggerSelect(trigger)}
                    disabled={isTriggerMatched(trigger.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isTriggerMatched(trigger.id)
                        ? getMatchResult(trigger.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedTrigger?.id === trigger.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{trigger.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{trigger.name}</h4>
                       
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
                  {selectedTrigger 
                    ? `Selected: ${selectedTrigger.name}` 
                    : "Select an Emotional Trigger"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedTrigger || !selectedCalm}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedTrigger && selectedCalm
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{triggers.length}</p>
                  <p>Matched: {matches.length}/{triggers.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Calming Strategies */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Calming Strategies</h3>
              <div className="space-y-4">
                {rearrangedCalms.map(calm => (
                  <button
                    key={calm.id}
                    onClick={() => handleCalmSelect(calm)}
                    disabled={isCalmMatched(calm.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isCalmMatched(calm.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedCalm?.id === calm.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{calm.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{calm.name}</h4>
                        <p className="text-white/80 text-sm">{calm.description}</p>
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
                  You correctly matched {score} out of {triggers.length} emotional triggers with calming strategies!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Recognizing your emotions and knowing how to calm down helps you manage your feelings better!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {triggers.length} emotional triggers correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about what makes you feel better when you're experiencing different emotions!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TriggerMapPuzzle;