import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleSystemMatch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 1; // 1 coin per correct match
  const totalCoins = location.state?.totalCoins || 5; // Total coins for 5 matches
  const totalXp = location.state?.totalXp || 10; // Total XP
  
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  // Reproductive System Parts (left side) - 5 items
  const parts = [
    { id: 1, name: "Ovaries", emoji: "🥚",  },
    { id: 2, name: "Uterus", emoji: "🤰",  },
    { id: 3, name: "Hormones", emoji: "⚗️",  },
    { id: 4, name: "Fallopian Tubes", emoji: "🧪",  },
    { id: 5, name: "Vagina", emoji: "🚺",  }
  ];
  
  // Functions (right side) - 5 items (shuffled order)
  const functions = [
    { id: 3, text: "Regulate menstrual cycle and mood",  },
    { id: 5, text: "Passageway for menstrual flow",  },
    { id: 1, text: "Produce eggs and female hormones",  },
    { id: 4, text: "Transport eggs from ovaries to uterus",  },
    { id: 2, text: "House and nourish developing fetus",  }
  ];
  
  // Correct matches
  const correctMatches = [
    { partId: 1, functionId: 1 }, // Ovaries → Produce eggs and female hormones
    { partId: 2, functionId: 2 }, // Uterus → House and nourish developing fetus
    { partId: 3, functionId: 3 }, // Hormones → Regulate menstrual cycle and mood
    { partId: 4, functionId: 4 }, // Fallopian Tubes → Transport eggs from ovaries to uterus
    { partId: 5, functionId: 5 }  // Vagina → Passageway for menstrual flow
  ];
  
  const handlePartSelect = (part) => {
    if (gameFinished) return;
    setSelectedPart(part);
  };
  
  const handleFunctionSelect = (func) => {
    if (gameFinished) return;
    setSelectedFunction(func);
  };
  
  const handleMatch = () => {
    if (!selectedPart || !selectedFunction || gameFinished) return;
    
    resetFeedback();
    
    const newMatch = {
      partId: selectedPart.id,
      functionId: selectedFunction.id,
      isCorrect: correctMatches.some(
        match => match.partId === selectedPart.id && match.functionId === selectedFunction.id
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
    if (newMatches.length === parts.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }
    
    // Reset selections
    setSelectedPart(null);
    setSelectedFunction(null);
  };
  
  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedPart(null);
    setSelectedFunction(null);
    setScore(0);
    resetFeedback();
  };
  
  const handleNext = () => {
    navigate("/games/health-female/teens");
  };
  
  // Check if a part is already matched
  const isPartMatched = (partId) => {
    return matches.some(match => match.partId === partId);
  };
  
  // Check if a function is already matched
  const isFunctionMatched = (functionId) => {
    return matches.some(match => match.functionId === functionId);
  };
  
  // Get match result for a part
  const getMatchResult = (partId) => {
    const match = matches.find(m => m.partId === partId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: System Match"
      subtitle={gameFinished ? "Game Complete!" : `Match Parts with Functions (${matches.length}/${parts.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-female-teen-34"
      gameType="health-female"
      totalLevels={parts.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={parts.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/health-female/teens/period-pain-story"
      nextGameIdProp="health-female-teen-35">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Parts */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">System Parts</h3>
              <div className="space-y-4">
                {parts.map(part => (
                  <button
                    key={part.id}
                    onClick={() => handlePartSelect(part)}
                    disabled={isPartMatched(part.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isPartMatched(part.id)
                        ? getMatchResult(part.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedPart?.id === part.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{part.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{part.name}</h4>
                        <p className="text-white/80 text-sm">{part.hint}</p>
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
                  {selectedPart 
                    ? `Selected: ${selectedPart.name}` 
                    : "Select a Part"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedPart || !selectedFunction}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedPart && selectedFunction
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{parts.length}</p>
                  <p>Matched: {matches.length}/{parts.length}</p>
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
                      <div>
                        <h4 className="font-bold text-white">{func.text}</h4>
                        <p className="text-white/80 text-sm">{func.hint}</p>
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
                  You correctly matched {score} out of {parts.length} reproductive system parts with their functions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding reproductive system parts and their functions promotes body literacy and health awareness!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {parts.length} parts correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about the specific role each reproductive system part plays when matching it with its function!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleSystemMatch;