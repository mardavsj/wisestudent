import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SelfDrivingCar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentSignal, setCurrentSignal] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [choices, setChoices] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const signals = [
    {
      id: 1,
      light: "school-zone",
      emoji: "🎓",
      choices: [
        { id: 2, text: "Honk Horn", emoji: "📢", isCorrect: false },
        { id: 3, text: "Speed Up", emoji: "⚡", isCorrect: false },
        { id: 1, text: "Slow Down", emoji: "⚠️", isCorrect: true },
      ]
    },
    {
      id: 2,
      light: "construction",
      emoji: "🚧",
      choices: [
        { id: 1, text: "Stop and Wait", emoji: "✋", isCorrect: true },
        { id: 2, text: "Keep Driving", emoji: "🚗", isCorrect: false },
        { id: 3, text: "Change Lane", emoji: "🔄", isCorrect: false }
      ]
    },
    {
      id: 3,
      light: "pedestrian",
      emoji: "🚶",
      choices: [
        { id: 2, text: "Go Fast Before They Cross", emoji: "⚡", isCorrect: false },
        { id: 1, text: "Stop and Let Them Cross", emoji: "✋", isCorrect: true },
        { id: 3, text: "Honk to Warn Them", emoji: "📢", isCorrect: false }
      ]
    },
    {
      id: 4,
      light: "emergency",
      emoji: "🚑",
      choices: [
        { id: 1, text: "Pull Over and Stop", emoji: "🛑", isCorrect: true },
        { id: 2, text: "Keep Driving", emoji: "🚗", isCorrect: false },
        { id: 3, text: "Speed Up to Get Out of the Way", emoji: "⚡", isCorrect: false }
      ]
    },
    {
      id: 5,
      light: "weather",
      emoji: "🌧️",
      choices: [
        { id: 2, text: "Drive Normally", emoji: "🚗", isCorrect: false },
        { id: 3, text: "Stop and Wait for Rain to Stop", emoji: "✋", isCorrect: false },
        { id: 1, text: "Drive Slowly and Carefully", emoji: "🐢", isCorrect: true },
      ]
    }
  ];

  const currentSignalData = signals[currentSignal];

  const handleChoice = (choiceId) => {
    const choice = currentSignalData.choices.find((c) => c.id === choiceId);
    const isCorrect = choice.isCorrect;
    
    const newChoices = [...choices, { 
      questionId: currentSignalData.id, 
      choice: choiceId,
      isCorrect: isCorrect
    }];
    
    setChoices(newChoices);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentSignal < signals.length - 1) {
      setTimeout(() => {
        setCurrentSignal(prev => prev + 1);
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
    setCurrentSignal(0);
    setScore(0);
    setCoins(0);
    setChoices([]);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/pattern-finder-puzzle");
  };

  return (
    <GameShell
      title="Self-Driving Car Game"
      score={score}
      subtitle={showResult ? "Game Complete!" : `Scenario ${currentSignal + 1} of ${signals.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      maxScore={signals.length}
      gameId="ai-kids-6"
      gameType="ai"
      totalLevels={signals.length}
      currentLevel={currentSignal + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">What should the self-driving car do?</h3>
            <div className="text-6xl mb-4 text-center">🚗</div>
            
            <div className="bg-gray-800/50 rounded-xl p-12 mb-6 flex justify-center items-center">
              <div className="text-9xl animate-pulse">{currentSignalData.emoji}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentSignalData.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
                >
                  <div className="text-2xl mb-2">{choice.emoji}</div>
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
                <h3 className="text-2xl font-bold text-white mb-4">Safe Driver!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {signals.length} correctly! ({Math.round((finalScore / signals.length) * 100)}%)
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  💡 Self-driving cars use AI to make smart decisions in different situations! They recognize road signs, pedestrians, and emergencies!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {signals.length} correctly. ({Math.round((finalScore / signals.length) * 100)}%)
                  Keep practicing to learn more about self-driving cars!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  💡 Self-driving cars use AI to make smart decisions in different situations! They recognize road signs, pedestrians, and emergencies!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SelfDrivingCar;

