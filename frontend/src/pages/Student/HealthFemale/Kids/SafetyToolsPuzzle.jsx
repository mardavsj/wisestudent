import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SafetyToolsPuzzle = () => {
  const navigate = useNavigate();
  
  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-74";
  
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedUse, setSelectedUse] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  // Safety Tools (left side) - 5 items
  const tools = [
    { id: 1, name: "Sunscreen", emoji: "🧴",  },
    { id: 2, name: "Seatbelt", emoji: "💺",  },
    { id: 3, name: "Flashlight", emoji: "💡",  },
    { id: 4, name: "Knee Pads", emoji: "🛡️",  },
    { id: 5, name: "Bandage", emoji: "🩹",  }
  ];
  
  // Uses (right side) - 5 items (shuffled order)
  const uses = [
    { id: 4, text: "Cushions falls during skating",  },
    { id: 1, text: "Blocks harmful ultraviolet rays",  },
    { id: 5, text: "Covers minor cuts and scrapes",  },
    { id: 2, text: "Secures passengers in vehicles",  },
    { id: 3, text: "Illuminates dark environments",  }
  ];
  
  // Correct matches
  const correctMatches = [
    { toolId: 1, useId: 1 }, // Sunscreen → Blocks harmful ultraviolet rays
    { toolId: 2, useId: 2 }, // Seatbelt → Secures passengers in vehicles
    { toolId: 3, useId: 3 }, // Flashlight → Illuminates dark environments
    { toolId: 4, useId: 4 }, // Knee Pads → Cushions falls during skating
    { toolId: 5, useId: 5 }  // Bandage → Covers minor cuts and scrapes
  ];
  
  const handleToolSelect = (tool) => {
    if (gameFinished) return;
    setSelectedTool(tool);
  };
  
  const handleUseSelect = (use) => {
    if (gameFinished) return;
    setSelectedUse(use);
  };
  
  const handleMatch = () => {
    if (!selectedTool || !selectedUse || gameFinished) return;
    
    resetFeedback();
    
    const newMatch = {
      toolId: selectedTool.id,
      useId: selectedUse.id,
      isCorrect: correctMatches.some(
        match => match.toolId === selectedTool.id && match.useId === selectedUse.id
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
    setSelectedUse(null);
  };
  
  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedTool(null);
    setSelectedUse(null);
    setScore(0);
    resetFeedback();
  };
  
  const handleNext = () => {
    navigate("/games/health-female/kids");
  };
  
  // Check if a tool is already matched
  const isToolMatched = (toolId) => {
    return matches.some(match => match.toolId === toolId);
  };
  
  // Check if a use is already matched
  const isUseMatched = (useId) => {
    return matches.some(match => match.useId === useId);
  };
  
  // Get match result for a tool
  const getMatchResult = (toolId) => {
    const match = matches.find(m => m.toolId === toolId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Safety Tools Puzzle"
      subtitle={gameFinished ? "Game Complete!" : `Match Tools with Uses (${matches.length}/${tools.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-female"
      totalLevels={tools.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/health-female/kids/sick-day-story"
      nextGameIdProp="health-female-kids-75">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Tools */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Safety Tools</h3>
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
                        <p className="text-white/80 text-sm">{tool.hint}</p>
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
                  disabled={!selectedTool || !selectedUse}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedTool && selectedUse
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
            
            {/* Right column - Uses */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Uses</h3>
              <div className="space-y-4">
                {uses.map(use => (
                  <button
                    key={use.id}
                    onClick={() => handleUseSelect(use)}
                    disabled={isUseMatched(use.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isUseMatched(use.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedUse?.id === use.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div>
                        <h4 className="font-bold text-white">{use.text}</h4>
                        <p className="text-white/80 text-sm">{use.hint}</p>
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
                  You correctly matched {score} out of {tools.length} safety tools with their uses!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding safety tools and their proper uses helps keep you protected in various situations!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {tools.length} tools correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about what each safety tool is designed to protect you from!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SafetyToolsPuzzle;