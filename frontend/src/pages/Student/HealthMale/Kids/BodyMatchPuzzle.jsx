import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BodyMatchPuzzle = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-34";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedOrgan, setSelectedOrgan] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Body Organs (left side) - 5 items
  const organs = [
    { id: 1, name: "Heart", emoji: "❤️",  },
    { id: 2, name: "Lungs", emoji: "🫁",  },
    { id: 3, name: "Stomach", emoji: "🌀",  },
    { id: 4, name: "Brain", emoji: "🧠",  },
    { id: 5, name: "Liver", emoji: "☯️",  }
  ];

  // Functions (right side) - 5 items
  const functions = [
    { id: 3, name: "Digest Food", emoji: "🍽️" },
    { id: 5, name: "Filter Toxins", emoji: "💧" },
    { id: 1, name: "Pump Blood", emoji: "🩸" },
    { id: 4, name: "Process Thoughts", emoji: "💭" },
    { id: 2, name: "Absorb Oxygen", emoji: "💨" }
  ];

  // Correct matches
  const correctMatches = [
    { organId: 1, functionId: 1 }, // Heart → Pump Blood
    { organId: 2, functionId: 2 }, // Lungs → Absorb Oxygen
    { organId: 3, functionId: 3 }, // Stomach → Digest Food
    { organId: 4, functionId: 4 }, // Brain → Process Thoughts
    { organId: 5, functionId: 5 }  // Liver → Filter Toxins
  ];

  const handleOrganSelect = (organ) => {
    if (gameFinished) return;
    setSelectedOrgan(organ);
  };

  const handleFunctionSelect = (func) => {
    if (gameFinished) return;
    setSelectedFunction(func);
  };

  const handleMatch = () => {
    if (!selectedOrgan || !selectedFunction || gameFinished) return;

    resetFeedback();

    const newMatch = {
      organId: selectedOrgan.id,
      functionId: selectedFunction.id,
      isCorrect: correctMatches.some(
        match => match.organId === selectedOrgan.id && match.functionId === selectedFunction.id
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
    if (newMatches.length === organs.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedOrgan(null);
    setSelectedFunction(null);
  };

  // Check if an organ is already matched
  const isOrganMatched = (organId) => {
    return matches.some(match => match.organId === organId);
  };

  // Check if a function is already matched
  const isFunctionMatched = (functionId) => {
    return matches.some(match => match.functionId === functionId);
  };

  // Get match result for an organ
  const getMatchResult = (organId) => {
    const match = matches.find(m => m.organId === organId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Body Match Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Organs with Their Functions (${matches.length}/${organs.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/respect-story"
      nextGameIdProp="health-male-kids-35"
      gameType="health-male"
      totalLevels={organs.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === organs.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/health-male/kids"
      maxScore={organs.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Body Organs */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Body Organs</h3>
              <div className="space-y-4">
                {organs.map(organ => (
                  <button
                    key={organ.id}
                    onClick={() => handleOrganSelect(organ)}
                    disabled={isOrganMatched(organ.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isOrganMatched(organ.id)
                        ? getMatchResult(organ.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedOrgan?.id === organ.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{organ.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{organ.name}</h4>
                        <p className="text-white/80 text-sm">{organ.description}</p>
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
                  {selectedOrgan 
                    ? `Selected: ${selectedOrgan.name}` 
                    : "Select an Organ"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedOrgan || !selectedFunction}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedOrgan && selectedFunction
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{organs.length}</p>
                  <p>Matched: {matches.length}/{organs.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Functions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Functions</h3>
              <div className="space-y-4">
                {functions.map(func => (
                  <button
                    key={func.id}
                    onClick={() => handleFunctionSelect(func)}
                    disabled={isFunctionMatched(func.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isFunctionMatched(func.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedFunction?.id === func.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{func.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{func.name}</h4>
                        <p className="text-white/80 text-sm">{func.description}</p>
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
                  You correctly matched {score} out of {organs.length} body organs with their functions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Your body has amazing organs that work together to keep you healthy!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {organs.length} organs correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about what each organ does to stay healthy!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BodyMatchPuzzle;

