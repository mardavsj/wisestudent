import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SmartwatchGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentAlert, setCurrentAlert] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const alerts = [
    {
      id: 1,
      message: "Your heart rate is high after running. What should you do?",
      options: [
        { 
          id: "rest", 
          text: "Slow down and rest", 
          emoji: "😌", 
          
          isCorrect: true
        },
        { 
          id: "faster", 
          text: "Keep running faster", 
          emoji: "🏃‍♂️", 
          
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Ignore it", 
          emoji: "🙈", 
          isCorrect: false
        }
      ],
      correct: "rest"
    },
    {
      id: 2,
      message: "The watch says 'You’ve been sitting too long.' What’s the best action?",
      options: [
        { 
          id: "stretch", 
          text: "Get up and stretch", 
          emoji: "🙆‍♀️", 
          isCorrect: true
        },
        { 
          id: "sit", 
          text: "Keep sitting", 
          emoji: "🪑", 
          isCorrect: false
        },
        { 
          id: "nap", 
          text: "Take a nap", 
          emoji: "😴", 
          isCorrect: false
        }
      ],
      correct: "stretch"
    },
    {
      id: 3,
      message: "It says ‘Low battery!’. What should you do?",
      options: [
        
        { 
          id: "ignore", 
          text: "Ignore it", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          id: "shake", 
          text: "Shake it", 
          emoji: "🤨", 
          isCorrect: false
        },
        { 
          id: "charge", 
          text: "Charge it", 
          emoji: "🔋", 
          isCorrect: true
        }
      ],
      correct: "charge"
    },
    {
      id: 4,
      message: "You got a sleep alert: ‘You slept only 4 hours.’ What’s the right response?",
      options: [
        { 
          id: "sleep", 
          text: "Sleep earlier tonight", 
          emoji: "🌙", 
          isCorrect: true
        },
        { 
          id: "coffee", 
          text: "Drink coffee", 
          emoji: "☕", 
          isCorrect: false
        },
        { 
          id: "awake", 
          text: "Stay awake all night", 
          emoji: "😵", 
          isCorrect: false
        }
      ],
      correct: "sleep"
    },
    {
      id: 5,
      message: "Your smartwatch says ‘Take deep breaths to relax.’ What should you do?",
      options: [
        { 
          id: "breath", 
          text: "Take deep breaths", 
          emoji: "🌬️", 
          isCorrect: true
        },
        { 
          id: "run", 
          text: "Run quickly", 
          emoji: "🏃", 
          isCorrect: false
        },
        { 
          id: "phone", 
          text: "Ignore and scroll phone", 
          emoji: "📱", 
          isCorrect: false
        }
        
      ],
      correct: "breath"
    },
  ];

  // Function to get options without rotation - keeping actual positions fixed
  const getRotatedOptions = (options, alertIndex) => {
    // Return options without any rotation to keep their actual positions fixed
    return options;
  };

  const currentAlertData = alerts[currentAlert];
  const displayOptions = getRotatedOptions(currentAlertData.options, currentAlert);

  const handleChoice = (choiceId) => {
    const isCorrect = choiceId === currentAlertData.correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentAlert < alerts.length - 1) {
      setTimeout(() => {
        setCurrentAlert((prev) => prev + 1);
      }, 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentAlert(0);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/online-shopping-ai");
  };

  const accuracy = Math.round((score / alerts.length) * 100);

  return (
    <GameShell
      title="Smartwatch Game"
      score={score}
      subtitle={`Alert ${currentAlert + 1} of ${alerts.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/kids/online-shopping-ai"
      nextGameIdProp="ai-kids-40"
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="ai-kids-39"
      gameType="ai"
      totalLevels={20}
      currentLevel={39}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Alert {currentAlert + 1}/{alerts.length}</span>
                <span className="text-yellow-400 font-bold">Points: {score}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentAlertData.message}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {accuracy >= 70 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Healthy Response!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} out of {alerts.length} alerts correctly! ({accuracy}%)
                  You're learning to make smart choices with your AI smartwatch!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Points</span>
                </div>
                <p className="text-white/80">
                  💡 Smartwatches with AI help track health, suggest rest, and keep you active and balanced!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} out of {alerts.length} alerts correctly. ({accuracy}%)
                  Keep practicing to learn more about making healthy choices!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to think about what the smartest health choice would be in each situation.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SmartwatchGame;