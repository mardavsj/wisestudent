import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const NutritionProGirlBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "health-female-teen-20";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      title: "Bone Health",
      question: "Which nutrient is most important for teenage girls' bone development?",
      options: [
        { 
          text: "Iron", 
          emoji: "🩸", 
          isCorrect: false
        },
        { 
          text: "Calcium", 
          emoji: "🥛", 
          isCorrect: true
        },
        { 
          text: "Vitamin C", 
          emoji: "🍊", 
          isCorrect: false
        },
        { 
          text: "Protein", 
          emoji: "🍗", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Calcium is essential for building strong bones during the teenage years!",
        wrong: "Calcium is the key nutrient for bone development, especially important during adolescence."
      }
    },
    {
      id: 2,
      title: "Hydration",
      question: "What is the recommended daily water intake for active teenage girls?",
      options: [
        { 
          text: "2-3 liters", 
          emoji: "🚰", 
          isCorrect: true
        },
        { 
          text: "1 liter", 
          emoji: "💧", 
          isCorrect: false
        },
        { 
          text: "5 liters", 
          emoji: "🌊", 
          isCorrect: false
        },
        { 
          text: "Half a liter", 
          emoji: "🥛", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Right! Active teenage girls should aim for 2-3 liters of water daily to stay hydrated!",
        wrong: "The recommendation for active teenage girls is 2-3 liters of water per day."
      }
    },
    {
      id: 3,
      title: "Balanced Diet",
      question: "Which food group should make up the largest portion of a balanced meal?",
      options: [
        { 
          text: "Proteins", 
          emoji: "🥩", 
          isCorrect: false
        },
        { 
          text: "Grains", 
          emoji: "🌾", 
          isCorrect: false
        },
        { 
          text: "Vegetables", 
          emoji: "🥦", 
          isCorrect: true
        },
        { 
          text: "Sweets", 
          emoji: "🍰", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Vegetables should make up the largest portion of your plate for optimal nutrition!",
        wrong: "According to nutritional guidelines, vegetables should comprise the largest portion of a balanced meal."
      }
    },
    {
      id: 4,
      title: "Iron Importance",
      question: "Why is iron particularly important for teenage girls?",
      options: [
        { 
          text: "To replace iron lost during menstruation", 
          emoji: "🩸", 
          isCorrect: false
        },
        { 
          text: "To increase muscle mass", 
          emoji: "💪", 
          isCorrect: false
        },
        { 
          text: "To reduce appetite", 
          emoji: "🍽️", 
          isCorrect: false
        },
        { 
          text: "To support oxygen transport", 
          emoji: "🫁", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Exactly! Iron helps transport oxygen throughout the body, which is especially important for teenage girls!",
        wrong: "Iron is crucial for hemoglobin production, which transports oxygen in the blood."
      }
    },
    {
      id: 5,
      title: "Energy Boost",
      question: "What is the healthiest breakfast option for sustained energy?",
      options: [
        { 
          text: "High-sugar cereal with milk", 
          emoji: "🍬", 
          isCorrect: false
        },
        { 
          text: "Whole grain toast with avocado", 
          emoji: "🥑", 
          isCorrect: false
        },
        { 
          text: "Pastry with coffee", 
          emoji: "☕", 
          isCorrect: false
        },
        { 
          text: "Oatmeal with fruits and nuts", 
          emoji: "🥣", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Great choice! Oatmeal with fruits and nuts provides sustained energy without blood sugar spikes!",
        wrong: "Oatmeal with fruits and nuts offers complex carbohydrates, fiber, and protein for lasting energy."
      }
    }
  ];

  const handleAnswer = (isCorrect, optionIndex) => {
    if (answered) return;
    
    setAnswered(true);
    setSelectedAnswer(optionIndex);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastChallenge = challenge === challenges.length - 1;
    
    setTimeout(() => {
      if (isLastChallenge) {
        setShowResult(true);
      } else {
        setChallenge(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 2000);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setChallenge(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    resetFeedback();
  };

  const handleNext = () => {
    window.location.href = "/games/health-female/teens";
  };

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: Nutrition Pro Girl"
      subtitle={showResult ? "Game Complete!" : `Question ${challenge + 1} of ${challenges.length}`}
      onNext={handleNext}
      nextEnabled={true}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      gameType="health-female"
      totalLevels={challenges.length}
      currentLevel={challenge + 1}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={challenges.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/health-female/teens/puberty-story"
      nextGameIdProp="health-female-teen-21">
      <div className="space-y-8">
        {!showResult && currentChallenge ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-2">{currentChallenge.title}</h3>
              <p className="text-white text-lg mb-6">
                {currentChallenge.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentChallenge.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option.isCorrect, idx)}
                    disabled={answered}
                    className={`bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3 ${
                      answered && selectedAnswer === idx
                        ? option.isCorrect
                          ? "ring-4 ring-green-400"
                          : "ring-4 ring-red-400"
                        : ""
                    }`}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="font-bold text-lg">{option.text}</span>
                  </button>
                ))}
              </div>
              
              {answered && (
                <div className={`mt-4 p-4 rounded-xl ${
                  currentChallenge.options[selectedAnswer]?.isCorrect
                    ? "bg-green-500/20 border border-green-500/30"
                    : "bg-red-500/20 border border-red-500/30"
                }`}>
                  <p className="text-white font-semibold">
                    {currentChallenge.options[selectedAnswer]?.isCorrect
                      ? currentChallenge.feedback.correct
                      : currentChallenge.feedback.wrong}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 4 ? (
              <div>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-4">Nutrition Pro Girl Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent nutrition knowledge with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Nutrition Pro Girl</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Nutritional Awareness</h4>
                    <p className="text-white/90 text-sm">
                      You understand the importance of key nutrients for teenage health.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Healthy Eating</h4>
                    <p className="text-white/90 text-sm">
                      You know how to make balanced food choices for sustained energy.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Nutrition!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review nutrition concepts to strengthen your knowledge and earn your badge.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default NutritionProGirlBadge;