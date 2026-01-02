import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PubertySmartGirlBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "health-female-teen-30";
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
      title: "Hormones",
      question: "What causes puberty in girls?",
      options: [
        { 
          text: "Food", 
          emoji: "🍎", 
          isCorrect: false
        },
        { 
          text: "Hormones", 
          emoji: "🔬", 
          isCorrect: true
        },
        { 
          text: "Weather", 
          emoji: "☀️", 
          isCorrect: false
        },
        { 
          text: "Exercise", 
          emoji: "🏃‍♀️", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Correct! Hormones like estrogen trigger puberty changes in girls.",
        wrong: "It's hormones like estrogen that cause puberty changes."
      }
    },
    {
      id: 2,
      title: "Hygiene",
      question: "What's the best way to manage body odor during puberty?",
      options: [
        { 
          text: "Perfume only", 
          emoji: "🌸", 
          isCorrect: false
        },
        { 
          text: "Nothing", 
          emoji: "🙅‍♀️", 
          isCorrect: false
        },
        { 
          text: "Daily shower & deodorant", 
          emoji: "🚿", 
          isCorrect: true
        },
        { 
          text: "Change clothes once a week", 
          emoji: "👕", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Yes! Cleanliness and deodorant help control body odor.",
        wrong: "You need to wash regularly and use deodorant to manage body odor."
      }
    },
    {
      id: 3,
      title: "Breast Development",
      question: "What causes breast development during puberty?",
      options: [
        { 
          text: "Exercise", 
          emoji: "💪", 
          isCorrect: false
        },
        { 
          text: "Clothing", 
          emoji: "👗", 
          isCorrect: false
        },
        { 
          text: "Hormonal changes", 
          emoji: "🦋", 
          isCorrect: true
        },
        { 
          text: "Sun exposure", 
          emoji: "☀️", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Estrogen causes breast development during puberty.",
        wrong: "It's hormonal changes, specifically estrogen, that cause breast development."
      }
    },
    {
      id: 4,
      title: "Menstruation",
      question: "What is a normal part of female puberty?",
      options: [
        { 
          text: "Hair loss", 
          emoji: "💇‍♀️", 
          isCorrect: false
        },
        { 
          text: "Weight gain", 
          emoji: "⚖️", 
          isCorrect: false
        },
       
        { 
          text: "Monthly cycle changes", 
          emoji: "📅", 
          isCorrect: false
        },
         { 
          text: "Getting periods", 
          emoji: "🩸", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Right! Menstruation is a normal part of female puberty.",
        wrong: "Getting periods (menstruation) is a normal and healthy part of female puberty."
      }
    },
    {
      id: 5,
      title: "Growth",
      question: "What helps support healthy growth during puberty?",
      options: [
        { 
          text: "Skipping meals", 
          emoji: "🍽️", 
          isCorrect: false
        },
        { 
          text: "Staying up late", 
          emoji: "🌙", 
          isCorrect: false
        },
        { 
          text: "Good nutrition & sleep", 
          emoji: "🥗", 
          isCorrect: true
        },
        { 
          text: "Drinking soda", 
          emoji: "🥤", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Smart! Proper nutrition and sleep support healthy growth.",
        wrong: "You need good nutrition and adequate sleep to grow properly."
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
    navigate("/student/health-female/teens/reproductive-story");
  };

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: Puberty Smart Teen Girl"
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
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={challenges.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
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
                    className={`bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3 ${
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
                <div className="text-6xl mb-4">🏅</div>
                <h3 className="text-3xl font-bold text-white mb-4">Puberty Smart Girl Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about puberty with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Puberty Smart Girl</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-pink-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-pink-300 mb-2">Hormones</h4>
                    <p className="text-white/90 text-sm">
                      You understand how hormones drive body changes during puberty.
                    </p>
                  </div>
                  <div className="bg-purple-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-purple-300 mb-2">Health</h4>
                    <p className="text-white/90 text-sm">
                      You know how to maintain good hygiene and healthy habits.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Puberty!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review puberty concepts to strengthen your knowledge and earn your badge.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
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

export default PubertySmartGirlBadge;