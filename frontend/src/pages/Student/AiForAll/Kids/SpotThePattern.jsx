import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SpotThePattern = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentPattern, setCurrentPattern] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const patterns = [
    { id: 1, sequence: ["🔴", "🟦", "🔴", "🟦", "?"], correct: "🔴", options: ["🔴", "🟦", "🟢"] },
    { id: 2, sequence: ["⭐", "⭐", "🌙", "⭐", "⭐", "?"], correct: "🌙", options: ["⭐", "🌙", "☀️"] },
    { id: 3, sequence: ["🍎", "🍌", "🍎", "🍌", "?"], correct: "🍎", options: ["🍎", "🍌", "🍊"] },
    { id: 4, sequence: ["🐶", "🐱", "🐶", "🐱", "?"], correct: "🐶", options: ["🐶", "🐱", "🐭"] },
    { id: 5, sequence: ["1️⃣", "2️⃣", "1️⃣", "2️⃣", "?"], correct: "1️⃣", options: ["1️⃣", "2️⃣", "3️⃣"] }
  ];

  const currentPatternData = patterns[currentPattern];

  const handleChoice = (choice) => {
    const isCorrect = choice === currentPatternData.correct;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 2); // Award 2 coins per correct answer like EmojiClassifier
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next pattern immediately
    if (currentPattern < patterns.length - 1) {
      setTimeout(() => {
        setCurrentPattern(prev => prev + 1);
      }, 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentPattern(0);
    setScore(0);
    setCoins(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/cat-or-dog-game");
  };

  const accuracy = Math.round((score / patterns.length) * 100);

  return (
    <GameShell
      title="Spot the Pattern"
      score={score}
      subtitle={`Pattern ${currentPattern + 1} of ${patterns.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/kids/cat-or-dog-game"
      nextGameIdProp="ai-kids-2"
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      maxScore={patterns.length}
      gameId="ai-kids-1"
      gameType="ai"
      totalLevels={patterns.length}
      currentLevel={currentPattern + 1}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">What comes next?</h3>
            
            <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl p-12 mb-6 flex justify-center items-center">
              <div className="flex justify-center items-center gap-3 sm:gap-4">
                {currentPatternData.sequence.map((item, idx) => (
                  <div key={idx} className="text-5xl sm:text-6xl">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {currentPatternData.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(option)}
                  className="bg-white/20 hover:bg-white/30 border-2 border-white/40 rounded-xl p-4 sm:p-6 transition-all transform hover:scale-105"
                >
                  <div className="text-4xl sm:text-5xl">{option}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              {accuracy >= 70 ? "🎉 Pattern Master!" : "💪 Keep Practicing!"}
            </h2>
            <p className="text-white/90 text-xl mb-4 text-center">
              You found {score} out of {patterns.length} patterns correctly! ({accuracy}%)
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white/90 text-sm">
                💡 AI uses pattern recognition to understand the world! You just learned how AI thinks!
              </p>
            </div>
            <p className="text-yellow-400 text-2xl font-bold text-center">
              You earned {coins} Coins! 🪙
            </p>
            {accuracy < 70 && (
              <button
                onClick={handleTryAgain}
                className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SpotThePattern;



