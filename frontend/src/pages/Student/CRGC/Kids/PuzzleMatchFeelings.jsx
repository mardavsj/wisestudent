import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PuzzleMatchFeelings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedFeeling, setSelectedFeeling] = useState(null);
  const [selectedExpression, setSelectedExpression] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Feelings (left side) - 5 items
  const feelings = [
    { id: 1, name: "Happy", emoji: "😊",  },
    { id: 2, name: "Sad", emoji: "😢",  },
    { id: 3, name: "Angry", emoji: "😠",  },
    { id: 4, name: "Surprised", emoji: "😲",  },
    { id: 5, name: "Scared", emoji: "😨",  }
  ];

  // Expressions (right side) - 5 items
  const expressions = [
    { id: 2, name: "Cry", emoji: "💧" },
    { id: 1, name: "Smile", emoji: "😄" },
    { id: 3, name: "Frown", emoji: "😡" },
    { id: 5, name: "Tremble", emoji: "😰" },
    { id: 4, name: "Wide Eyes", emoji: "😱" },
  ];

  // Correct matches
  const correctMatches = [
    { feelingId: 1, expressionId: 1 }, // Happy → Smile
    { feelingId: 2, expressionId: 2 }, // Sad → Cry
    { feelingId: 3, expressionId: 3 }, // Angry → Frown
    { feelingId: 4, expressionId: 4 }, // Surprised → Wide Eyes
    { feelingId: 5, expressionId: 5 }  // Scared → Tremble
  ];

  const handleFeelingSelect = (feeling) => {
    if (gameFinished) return;
    setSelectedFeeling(feeling);
  };

  const handleExpressionSelect = (expression) => {
    if (gameFinished) return;
    setSelectedExpression(expression);
  };

  const handleMatch = () => {
    if (!selectedFeeling || !selectedExpression || gameFinished) return;

    resetFeedback();

    const newMatch = {
      feelingId: selectedFeeling.id,
      expressionId: selectedExpression.id,
      isCorrect: correctMatches.some(
        match => match.feelingId === selectedFeeling.id && match.expressionId === selectedExpression.id
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
    if (newMatches.length === feelings.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedFeeling(null);
    setSelectedExpression(null);
  };

  const handleTryAgain = () => {
    setGameFinished(false);
    setMatches([]);
    setSelectedFeeling(null);
    setSelectedExpression(null);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/kids");
  };

  // Check if a feeling is already matched
  const isFeelingMatched = (feelingId) => {
    return matches.some(match => match.feelingId === feelingId);
  };

  // Check if an expression is already matched
  const isExpressionMatched = (expressionId) => {
    return matches.some(match => match.expressionId === expressionId);
  };

  // Get match result for a feeling
  const getMatchResult = (feelingId) => {
    const match = matches.find(m => m.feelingId === feelingId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title="Puzzle: Match Feelings"
      subtitle={gameFinished ? "Game Complete!" : `Match Feelings with Expressions (${matches.length}/${feelings.length} matched)`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="civic-responsibility-kids-4"
      gameType="civic-responsibility"
      totalLevels={feelings.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/kids"
      maxScore={feelings.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Feelings */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Feelings</h3>
              <div className="space-y-4">
                {feelings.map(feeling => (
                  <button
                    key={feeling.id}
                    onClick={() => handleFeelingSelect(feeling)}
                    disabled={isFeelingMatched(feeling.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isFeelingMatched(feeling.id)
                        ? getMatchResult(feeling.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedFeeling?.id === feeling.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{feeling.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{feeling.name}</h4>
                        <p className="text-white/80 text-sm">{feeling.description}</p>
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
                  {selectedFeeling 
                    ? `Selected: ${selectedFeeling.name}` 
                    : "Select a Feeling"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedFeeling || !selectedExpression}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedFeeling && selectedExpression
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Match
                </button>
                <div className="mt-4 text-white/80">
                  <p>Score: {score}/{feelings.length}</p>
                  <p>Matched: {matches.length}/{feelings.length}</p>
                </div>
              </div>
            </div>

            {/* Right column - Expressions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Expressions</h3>
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
                      <div className="text-2xl mr-3">{expression.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{expression.name}</h4>
                        <p className="text-white/80 text-sm">{expression.description}</p>
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
                  You correctly matched {score} out of {feelings.length} feelings with their expressions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Different feelings have different expressions that help us understand emotions!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You matched {score} out of {feelings.length} feelings correctly.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Think about what facial expressions show each emotion!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleMatchFeelings;