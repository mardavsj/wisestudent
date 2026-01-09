import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HygieneToolsPuzzle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 1; // 1 coin per correct match
  const totalCoins = location.state?.totalCoins || 5; // Total coins for 5 matches
  const totalXp = location.state?.totalXp || 10; // Total XP
  
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedPurpose, setSelectedPurpose] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  // Hygiene Tools (left side) - 5 items
  const tools = [
    { id: 1, name: "Sanitary Pad", emoji: "🩸", hint: "Absorbent product for menstrual flow" },
    { id: 2, name: "Soap", emoji: "🧼", hint: "Cleansing agent for body hygiene" },
    { id: 3, name: "Face Wash", emoji: "🧴", hint: "Cleanser for facial skin" },
    { id: 4, name: "Deodorant", emoji: "🌸", hint: "Product for reducing body odor" },
    { id: 5, name: "Comb", emoji: "🪮", hint: "Tool for grooming hair" }
  ];
  
  // Purposes (right side) - 5 items (shuffled order)
  const purposes = [
    { id: 3, text: "Cleans facial skin and prevents acne", hint: "Specifically for face care" },
    { id: 5, text: "Organizes and styles hair", hint: "For grooming hair strands" },
    { id: 1, text: "Manages menstrual blood flow", hint: "Used during periods" },
    { id: 4, text: "Reduces underarm body odor", hint: "Applied to prevent smells" },
    { id: 2, text: "Cleanses body and removes germs", hint: "For general hygiene" }
  ];
  
  // Correct matches
  const correctMatches = [
    { toolId: 1, purposeId: 1 }, // Sanitary Pad → Manages menstrual blood flow
    { toolId: 2, purposeId: 2 }, // Soap → Cleanses body and removes germs
    { toolId: 3, purposeId: 3 }, // Face Wash → Cleans facial skin and prevents acne
    { toolId: 4, purposeId: 4 }, // Deodorant → Reduces underarm body odor
    { toolId: 5, purposeId: 5 }  // Comb → Organizes and styles hair
  ];
  
  const handleToolSelect = (tool) => {
    if (gameFinished) return;
    setSelectedTool(tool);
  };
  
  const handlePurposeSelect = (purpose) => {
    if (gameFinished) return;
    setSelectedPurpose(purpose);
  };
  
  const handleMatch = () => {
    if (!selectedTool || !selectedPurpose || gameFinished) return;
    
    resetFeedback();
    
    const newMatch = {
      toolId: selectedTool.id,
      purposeId: selectedPurpose.id,
      isCorrect: correctMatches.some(
        match => match.toolId === selectedTool.id && match.purposeId === selectedPurpose.id
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
    setSelectedPurpose(null);
  };
  
  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedTool(null);
    setSelectedPurpose(null);
    setScore(0);
    resetFeedback();
  };
  
  const handleNext = () => {
    navigate("/games/health-female/teens");
  };
  
  // Check if a tool is already matched
  const isToolMatched = (toolId) => {
    return matches.some(match => match.toolId === toolId);
  };
  
  // Check if a purpose is already matched
  const isPurposeMatched = (purposeId) => {
    return matches.some(match => match.purposeId === purposeId);
  };
  
  // Get match result for a tool
  const getMatchResult = (toolId) => {
    const match = matches.find(m => m.toolId === toolId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Hygiene Tools Puzzle"
      subtitle={gameFinished ? "Game Complete!" : `Match Tools with Purposes (${matches.length}/${tools.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-female-teen-4"
      gameType="health-female"
      totalLevels={tools.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={tools.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/health-female/teens/oily-skin-story"
      nextGameIdProp="health-female-teen-5">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Tools */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Hygiene Tools</h3>
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
                  disabled={!selectedTool || !selectedPurpose}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedTool && selectedPurpose
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
            
            {/* Right column - Purposes */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Purposes</h3>
              <div className="space-y-4">
                {purposes.map(purpose => (
                  <button
                    key={purpose.id}
                    onClick={() => handlePurposeSelect(purpose)}
                    disabled={isPurposeMatched(purpose.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isPurposeMatched(purpose.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedPurpose?.id === purpose.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div>
                        <h4 className="font-bold text-white">{purpose.text}</h4>
                        <p className="text-white/80 text-sm">{purpose.hint}</p>
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
                  You correctly matched {score} out of {tools.length} hygiene tools with their purposes!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding hygiene tools and their specific purposes helps maintain better personal health!
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
                  Tip: Think about what each hygiene tool is specifically designed to accomplish!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HygieneToolsPuzzle;