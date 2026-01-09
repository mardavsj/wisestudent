import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RobotVacuumGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentObstacle, setCurrentObstacle] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [choices, setChoices] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const obstacles = [
    {
      id: 1,
      emoji: "🪑",
      choices: [
        { id: 1, text: "Turn Around", isCorrect: true },
        { id: 2, text: "Stay Still", isCorrect: false },
        { id: 3, text: "Speed Up", isCorrect: false }
      ]
    },
    {
      id: 2,
      emoji: "🛋️",
      choices: [
        { id: 1, text: "Stay Still", isCorrect: false },
        { id: 2, text: "Turn Around", isCorrect: true },
        { id: 3, text: "Back Up", isCorrect: false }
      ]
    },
    {
      id: 3,
      emoji: "🪞",
      choices: [
        { id: 1, text: "Speed Up", isCorrect: false },
        { id: 2, text: "Stay Still", isCorrect: true },
        { id: 3, text: "Turn Around", isCorrect: false }
      ]
    },
    {
      id: 4,
      emoji: "🛏️",
      choices: [
        { id: 1, text: "Turn Around", isCorrect: true },
        { id: 2, text: "Speed Up", isCorrect: false },
        { id: 3, text: "Stay Still", isCorrect: false }
      ]
    },
    {
      id: 5,
      emoji: "🖼️",
      choices: [
        { id: 1, text: "Back Up", isCorrect: false },
        { id: 2, text: "Stay Still", isCorrect: true },
        { id: 3, text: "Turn Around", isCorrect: false }
      ]
    }
  ];

  const currentObstacleData = obstacles[currentObstacle];

  const handleChoice = (choiceId) => {
    const choice = currentObstacleData.choices.find((c) => c.id === choiceId);
    const isCorrect = choice.isCorrect;
    
    const newChoices = [...choices, { 
      questionId: currentObstacleData.id, 
      choice: choiceId,
      isCorrect: isCorrect
    }];
    
    setChoices(newChoices);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentObstacle < obstacles.length - 1) {
      setTimeout(() => {
        setCurrentObstacle(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentObstacle(0);
    setScore(0);
    setCoins(0);
    setChoices([]);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/ai-translator-quiz"); // replace with actual next route
  };

  return (
    <GameShell
      title="Robot Vacuum Game"
      score={score}
      subtitle={showResult ? "Game Complete!" : `Obstacle ${currentObstacle + 1} of ${obstacles.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/kids/ai-translator-quiz"
      nextGameIdProp="ai-kids-37"
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      maxScore={obstacles.length}
      gameId="ai-kids-36"
      gameType="ai"
      totalLevels={obstacles.length}
      currentLevel={currentObstacle + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-4 text-center">🤖</div>
            <h3 className="text-white text-xl font-bold mb-6 text-center">Help the robot vacuum avoid obstacles!</h3>

            <div className="bg-gray-800/50 rounded-xl p-12 mb-6 flex justify-center items-center">
              <div className="text-9xl animate-pulse">{currentObstacleData.emoji}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentObstacleData.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
                >
                  <h3 className="font-bold text-xl mb-2">{choice.text}</h3>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Obstacle Master!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You avoided {finalScore} out of {obstacles.length} obstacles correctly! ({Math.round((finalScore / obstacles.length) * 100)}%)
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  💡 The robot vacuum uses AI to detect obstacles. You helped it navigate safely!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You avoided {finalScore} out of {obstacles.length} obstacles correctly. ({Math.round((finalScore / obstacles.length) * 100)}%)
                  Keep practicing to learn more about obstacle detection!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  💡 The robot vacuum uses AI to detect obstacles. You helped it navigate safely!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RobotVacuumGame;