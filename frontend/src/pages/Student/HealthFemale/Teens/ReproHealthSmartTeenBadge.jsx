import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ReproHealthSmartTeenBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "health-female-teen-40";
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
      title: "Reproductive System",
      question: "Which organ releases eggs during the menstrual cycle?",
      options: [
        { 
          text: "Uterus", 
          emoji: "🏠", 
          isCorrect: false
        },
        { 
          text: "Ovaries", 
          emoji: "🥚", 
          isCorrect: true
        },
        { 
          text: "Fallopian Tubes", 
          emoji: "🧪", 
          isCorrect: false
        },
        { 
          text: "Cervix", 
          emoji: "🚪", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! The ovaries release eggs during ovulation in the menstrual cycle!",
        wrong: "The ovaries are responsible for releasing eggs during the menstrual cycle."
      }
    },
    {
      id: 2,
      title: "Menstrual Health",
      question: "What is a normal duration for a menstrual cycle?",
      options: [
        { 
          text: "10-15 days", 
          emoji: "📅", 
          isCorrect: false
        },
        { 
          text: "21-35 days", 
          emoji: "🗓️", 
          isCorrect: true
        },
        { 
          text: "40-50 days", 
          emoji: "📆", 
          isCorrect: false
        },
        { 
          text: "Every month exactly 28 days", 
          emoji: "⏰", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Right! A normal menstrual cycle ranges from 21 to 35 days, with 28 days being average!",
        wrong: "A normal menstrual cycle typically ranges from 21 to 35 days, with variations being common and normal."
      }
    },
    {
      id: 3,
      title: "Reproductive Health",
      question: "At what age should girls typically begin seeing a gynecologist?",
      options: [
        { 
          text: "varies upon individual experiences ", 
          emoji: "🧑", 
          isCorrect: true
        },
        { 
          text: "Only after marriage", 
          emoji: "💒", 
          isCorrect: false
        },
        { 
          text: "At 18 years old", 
          emoji: "🎓", 
          isCorrect: false
        },
        { 
          text: "Only when experiencing pain", 
          emoji: "🏥", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Girls should typically have their first gynecological visit between 13-15 years old!",
        wrong: "The American College of Obstetricians and Gynecologists recommends first visits between 13-15 years old."
      }
    },
    {
      id: 4,
      title: "Hormonal Changes",
      question: "Which hormone is primarily responsible for the development of female secondary sexual characteristics?",
      options: [
        { 
          text: "Insulin", 
          emoji: "💉", 
          isCorrect: false
        },
        { 
          text: "Testosterone", 
          emoji: "♂️", 
          isCorrect: false
        },
        { 
          text: "Estrogen", 
          emoji: "♀️", 
          isCorrect: true
        },
        { 
          text: "Thyroid Hormone", 
          emoji: "🦋", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Estrogen is the primary hormone responsible for female secondary sexual characteristics!",
        wrong: "Estrogen is the key hormone that drives the development of female secondary sexual characteristics during puberty."
      }
    },
    {
      id: 5,
      title: "Reproductive Wellness",
      question: "What is the most effective way to track fertility awareness?",
      options: [
        { 
          text: "Tracking basal body temperature and cervical mucus", 
          emoji: "🌡️", 
          isCorrect: true
        },
        { 
          text: "Relying only on calendar calculations", 
          emoji: "📅", 
          isCorrect: false
        },
        { 
          text: "Ignoring physical signs completely", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Using withdrawal method exclusively", 
          emoji: "🛑", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great choice! Tracking basal body temperature and cervical mucus changes provides the most accurate fertility awareness!",
        wrong: "Effective fertility awareness involves monitoring multiple indicators including basal body temperature and cervical mucus changes."
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
    // This would typically navigate to the next category or game
    navigate("/games/health-female/teens");
  };

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: Repro Health Smart Teen"
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
                <h3 className="text-3xl font-bold text-white mb-4">Repro Health Smart Teen Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent reproductive health knowledge with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Repro Health Smart Teen</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Reproductive Knowledge</h4>
                    <p className="text-white/90 text-sm">
                      You understand the basics of the female reproductive system and menstrual health.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Health Awareness</h4>
                    <p className="text-white/90 text-sm">
                      You know when and how to seek appropriate reproductive healthcare.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Reproductive Health!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review reproductive health concepts to strengthen your knowledge and earn your badge.
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

export default ReproHealthSmartTeenBadge;