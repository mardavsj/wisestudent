import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleSelfValueMatch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 1; // 1 coin per correct match
  const totalCoins = location.state?.totalCoins || 5; // Total coins for 5 matches
  const totalXp = location.state?.totalXp || 10; // Total XP
  
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedExpression, setSelectedExpression] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  // Personal Values (left side) - 5 items
  const values = [
    { id: 1, name: "Courage", emoji: "🦁",  },
    { id: 2, name: "Self-Respect", emoji: "👸",  },
    { id: 3, name: "Kindness", emoji: "😇",  },
    { id: 4, name: "Perseverance", emoji: "🧗",  },
    { id: 5, name: "Empathy", emoji: "🤗",  }
  ];
  
  // Positive Expressions (right side) - 5 items (shuffled order)
  const expressions = [
    { id: 3, text: "Treat others with compassion",  },
    { id: 5, text: "Recognize and share others' emotions",  },
    { id: 1, text: "Face fears and stand up for beliefs",  },
    { id: 4, text: "Continue efforts despite setbacks",  },
    { id: 2, text: "Maintain personal boundaries",  }
  ];
  
  // Correct matches
  const correctMatches = [
    { valueId: 1, expressionId: 1 }, // Courage → Face fears and stand up for beliefs
    { valueId: 2, expressionId: 2 }, // Self-Respect → Maintain personal boundaries
    { valueId: 3, expressionId: 3 }, // Kindness → Treat others with compassion
    { valueId: 4, expressionId: 4 }, // Perseverance → Continue efforts despite setbacks
    { valueId: 5, expressionId: 5 }  // Empathy → Recognize and share others' emotions
  ];
  
  const handleValueSelect = (value) => {
    if (gameFinished) return;
    setSelectedValue(value);
  };
  
  const handleExpressionSelect = (expression) => {
    if (gameFinished) return;
    setSelectedExpression(expression);
  };
  
  const handleMatch = () => {
    if (!selectedValue || !selectedExpression || gameFinished) return;
    
    resetFeedback();
    
    const newMatch = {
      valueId: selectedValue.id,
      expressionId: selectedExpression.id,
      isCorrect: correctMatches.some(
        match => match.valueId === selectedValue.id && match.expressionId === selectedExpression.id
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
    if (newMatches.length === values.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }
    
    // Reset selections
    setSelectedValue(null);
    setSelectedExpression(null);
  };
  
  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedValue(null);
    setSelectedExpression(null);
    setScore(0);
    resetFeedback();
  };
  
  const handleNext = () => {
    navigate("/games/health-female/teens");
  };
  
  // Check if a value is already matched
  const isValueMatched = (valueId) => {
    return matches.some(match => match.valueId === valueId);
  };
  
  // Check if an expression is already matched
  const isExpressionMatched = (expressionId) => {
    return matches.some(match => match.expressionId === expressionId);
  };
  
  // Get match result for a value
  const getMatchResult = (valueId) => {
    const match = matches.find(m => m.valueId === valueId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Self-Value Match"
      subtitle={gameFinished ? "Game Complete!" : `Match Values with Expressions (${matches.length}/${values.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-female-teen-64"
      gameType="health-female"
      totalLevels={values.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={values.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/health-female/teens/social-media-story"
      nextGameIdProp="health-female-teen-65">
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Values */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Personal Values</h3>
              <div className="space-y-4">
                {values.map(value => (
                  <button
                    key={value.id}
                    onClick={() => handleValueSelect(value)}
                    disabled={isValueMatched(value.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isValueMatched(value.id)
                        ? getMatchResult(value.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedValue?.id === value.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{value.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{value.name}</h4>
                        <p className="text-white/80 text-sm">{value.hint}</p>
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
                  {selectedValue 
                    ? `Selected: ${selectedValue.name}` 
                    : "Select a Value"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedValue || !selectedExpression}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedValue && selectedExpression
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{values.length}</p>
                  <p>Matched: {matches.length}/{values.length}</p>
                </div>
              </div>
            </div>
            
            {/* Right column - Expressions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Positive Expressions</h3>
              <div className="space-y-4">
                {expressions.map(expression => (
                  <button
                    key={expression.id}
                    onClick={() => handleExpressionSelect(expression)}
                    disabled={isExpressionMatched(expression.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isExpressionMatched(expression.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedExpression?.id === expression.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div>
                        <h4 className="font-bold text-white">{expression.text}</h4>
                        <p className="text-white/80 text-sm">{expression.hint}</p>
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
                  You correctly matched {score} out of {values.length} personal values with their positive expressions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Recognizing how personal values manifest in positive behaviors builds character and self-awareness!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {values.length} values correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about how each personal value would naturally express itself in positive actions!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleSelfValueMatch;