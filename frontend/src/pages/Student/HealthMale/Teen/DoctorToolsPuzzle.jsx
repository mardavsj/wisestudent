import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DoctorToolsPuzzle = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  // Medical Tools (left side) - 5 items
  const tools = [
    { id: 1, name: "Stethoscope", emoji: "🩺",  },
    { id: 2, name: "Thermometer", emoji: "🌡️",  },
    { id: 3, name: "Vaccine", emoji: "💉",  },
    { id: 4, name: "Blood Pressure Cuff", emoji: "🩹",  },
    { id: 5, name: "Otoscope", emoji: "👂",  }
  ];

  // Body Parts/Functions (right side) - 5 items
  const functions = [
    { id: 3, name: "Protection", emoji: "🛡️",  },
    { id: 5, name: "Ears", emoji: "👂",  },
    { id: 1, name: "Heart", emoji: "❤️",  },
    { id: 4, name: "Blood Pressure", emoji: "🩸",  },
    { id: 2, name: "Fever", emoji: "🤒",  }
  ];

  // Correct matches
  const correctMatches = [
    { toolId: 1, functionId: 1 }, // Stethoscope → Heart
    { toolId: 2, functionId: 2 }, // Thermometer → Fever
    { toolId: 3, functionId: 3 }, // Vaccine → Protection
    { toolId: 4, functionId: 4 }, // Blood Pressure Cuff → Blood Pressure
    { toolId: 5, functionId: 5 }  // Otoscope → Ears
  ];

  const handleToolSelect = (tool) => {
    if (gameFinished) return;
    setSelectedTool(tool);
  };

  const handleFunctionSelect = (func) => {
    if (gameFinished) return;
    setSelectedFunction(func);
  };

  const handleMatch = () => {
    if (!selectedTool || !selectedFunction || gameFinished) return;

    resetFeedback();

    const newMatch = {
      toolId: selectedTool.id,
      functionId: selectedFunction.id,
      isCorrect: correctMatches.some(
        match => match.toolId === selectedTool.id && match.functionId === selectedFunction.id
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
    if (newMatches.length === tools.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedTool(null);
    setSelectedFunction(null);
  };

  // Check if a tool is already matched
  const isToolMatched = (toolId) => {
    return matches.some(match => match.toolId === toolId);
  };

  // Check if a function is already matched
  const isFunctionMatched = (functionId) => {
    return matches.some(match => match.functionId === functionId);
  };

  // Get match result for a tool
  const getMatchResult = (toolId) => {
    const match = matches.find(m => m.toolId === toolId);
    return match ? match.isCorrect : null;
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/specialist-story");
  };

  return (
    <GameShell
      title="Doctor Tools Puzzle"
      subtitle={gameFinished ? "Puzzle Complete!" : `Match Tools with Their Functions (${matches.length}/${tools.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-74"
      gameType="health-male"
      totalLevels={tools.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === tools.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/health-male/teens"
      maxScore={tools.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Medical Tools */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Medical Tools</h3>
              <div className="space-y-4">
                {tools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => handleToolSelect(tool)}
                    disabled={isToolMatched(tool.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isToolMatched(tool.id)
                        ? getMatchResult(tool.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedTool?.id === tool.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{tool.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{tool.name}</h4>
                        <p className="text-white/80 text-sm">{tool.description}</p>
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
                  {selectedTool 
                    ? `Selected: ${selectedTool.name}` 
                    : "Select a Tool"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedTool || !selectedFunction}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedTool && selectedFunction
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{tools.length}</p>
                  <p>Matched: {matches.length}/{tools.length}</p>
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
                  You correctly matched {score} out of {tools.length} medical tools with their functions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Doctors use specialized tools to diagnose and treat patients effectively!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {tools.length} tools correctly.
                </p>
                <p className="text-white/80 text-sm">
                  Tip: Think about what each tool is designed to examine or measure!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DoctorToolsPuzzle;
