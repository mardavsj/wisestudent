import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const NutritionSmartBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "health-female-kids-20";
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
      title: "Growing Tall",
      question: "Which food group is best for growing taller?",
      options: [
        { 
          text: "Candy", 
          emoji: "🍬", 
          isCorrect: false
        },
        { 
          text: "Protein (Milk, Eggs)", 
          emoji: "🥛", 
          isCorrect: true
        },
        { 
          text: "Chips", 
          emoji: "🍟", 
          isCorrect: false
        },
        { 
          text: "Soda", 
          emoji: "🥤", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Protein builds your body and helps you grow tall!",
        wrong: "Protein from milk, eggs, and other sources helps build strong bones and muscles for growth."
      }
    },
    {
      id: 2,
      title: "Strong Teeth",
      question: "What nutrient helps you have strong teeth?",
      options: [
        { 
          text: "Sugar", 
          emoji: "🍭", 
          isCorrect: false
        },
        { 
          text: "Calcium", 
          emoji: "🦷", 
          isCorrect: false
        },
        { 
          text: "Vitamin C", 
          emoji: "🍊", 
          isCorrect: false
        },
        { 
          text: "Both Calcium and Vitamin D", 
          emoji: "🥛", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Perfect! Calcium builds teeth and Vitamin D helps your body absorb it!",
        wrong: "Strong teeth need both calcium (from dairy) and vitamin D (from sunlight and fortified foods)."
      }
    },
    {
      id: 3,
      title: "Brain Food",
      question: "Which of these is a 'smart' snack for your brain?",
      options: [
        { 
          text: "Chips", 
          emoji: "🍟", 
          isCorrect: false
        },
        { 
          text: "Walnuts", 
          emoji: "🧠", 
          isCorrect: false
        },
        { 
          text: "Chocolate", 
          emoji: "🍫", 
          isCorrect: false
        },
        { 
          text: "Fish and Nuts", 
          emoji: "🐟", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Great! Omega-3s in fish and nuts feed your brain!",
        wrong: "Foods rich in omega-3 fatty acids like fish and nuts support brain health and learning."
      }
    },
    {
      id: 4,
      title: "Hydration Hero",
      question: "Why is water better than soda?",
      options: [
        { 
          text: "Soda is too bubbly", 
          emoji: "🥤", 
          isCorrect: false
        },
        { 
          text: "No added sugar", 
          emoji: "💧", 
          isCorrect: false
        },
        { 
          text: "Less calories", 
          emoji: "📉", 
          isCorrect: false
        },
        { 
          text: "All of the above", 
          emoji: "👍", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Exactly! Water hydrates without sugar crashes!",
        wrong: "Water is the best choice because it has no added sugar, fewer calories, and truly hydrates your body."
      }
    },
    {
      id: 5,
      title: "Rainbow Plate",
      question: "What makes your plate a 'Nutrition Smart' plate?",
      options: [
        { 
          text: "Only Brown Food", 
          emoji: "🥔", 
          isCorrect: false
        },
        { 
          text: "Lots of Colors", 
          emoji: "🌈", 
          isCorrect: false
        },
        { 
          text: "Only Meat", 
          emoji: "🥩", 
          isCorrect: false
        },
        { 
          text: "Variety of Foods", 
          emoji: "🍽️", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Exactly! Different colored foods provide different nutrients!",
        wrong: "A nutrition smart plate includes a variety of foods from different food groups to provide all essential nutrients."
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
    navigate("/games/health-female/kids");
  };

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: Nutrition Smart"
      subtitle={showResult ? "Game Complete!" : `Challenge ${challenge + 1} of ${challenges.length}`}
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
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={challenges.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/health-female/kids/growing-taller-story"
      nextGameIdProp="health-female-kids-21">
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
                <h3 className="text-3xl font-bold text-white mb-4">Nutrition Smart Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about healthy eating with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Nutrition Smart</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Healthy Eating</h4>
                    <p className="text-white/90 text-sm">
                      You understand the importance of balanced nutrition for growth and development.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Smart Choices</h4>
                    <p className="text-white/90 text-sm">
                      You know how to make nutritious food choices for optimal health.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
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

export default NutritionSmartBadge;