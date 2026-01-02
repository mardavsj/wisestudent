import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeHygieneProGirl = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "health-female-teen-50";
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
      title: "Daily Hygiene",
      question: "What's the best frequency for bathing during teenage years?",
      options: [
        { 
          text: "Once a week", 
          emoji: "📆", 
          isCorrect: false
        },
        { 
          text: "Daily or every other day", 
          emoji: "🚿", 
          isCorrect: true
        },
        { 
          text: "Only when visibly dirty", 
          emoji: "🧼", 
          isCorrect: false
        },
        { 
          text: "Twice a day always", 
          emoji: "⏰", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Daily bathing or every other day helps maintain good hygiene during teenage years!",
        wrong: "During adolescence, increased hormone activity makes daily or every other day bathing ideal for good hygiene."
      }
    },
    {
      id: 2,
      title: "Oral Health",
      question: "How often should you change your toothbrush?",
      options: [
        { 
          text: "When bristles look worn", 
          emoji: "🔍", 
          isCorrect: true
        },
        { 
          text: "Every 3-4 months", 
          emoji: "⏱️", 
          isCorrect: false
        },
        { 
          text: "Once a year", 
          emoji: "📅", 
          isCorrect: false
        },
        
        { 
          text: "Every month", 
          emoji: "🔁", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Right! Dentists recommend changing your toothbrush every 3-4 months for optimal cleaning!",
        wrong: "For effective cleaning, dental professionals suggest replacing your toothbrush every 3-4 months."
      }
    },
    {
      id: 3,
      title: "Hair Care",
      question: "What's the best way to care for oily hair during puberty?",
      options: [
        { 
          text: "Wash with gentle shampoo daily", 
          emoji: "🧴", 
          isCorrect: true
        },
        { 
          text: "Wash with harsh soap twice a day", 
          emoji: "🔥", 
          isCorrect: false
        },
        { 
          text: "Never wash to preserve natural oils", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Wash only with conditioner", 
          emoji: "💧", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Washing oily hair daily with gentle shampoo helps control excess oil without over-drying!",
        wrong: "Gentle daily washing with appropriate shampoo is the best approach for managing oily hair during puberty."
      }
    },
    {
      id: 4,
      title: "Menstrual Hygiene",
      question: "How often should sanitary pads be changed during periods?",
      options: [
        { 
          text: "Every 8-12 hours", 
          emoji: "⏰", 
          isCorrect: false
        },
        { 
          text: "Only when leaking occurs", 
          emoji: "⚠️", 
          isCorrect: false
        },
        { 
          text: "Every 4-6 hours or sooner if needed", 
          emoji: "🔄", 
          isCorrect: true
        },
        { 
          text: "Once a day", 
          emoji: "📅", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Changing pads every 4-6 hours prevents infections and maintains comfort!",
        wrong: "For health and comfort, sanitary pads should be changed every 4-6 hours or sooner if needed."
      }
    },
    {
      id: 5,
      title: "Skin Care",
      question: "What's the best approach to prevent acne during teenage years?",
      options: [
        { 
          text: "Wash face twice daily with gentle cleanser", 
          emoji: "🧽", 
          isCorrect: true
        },
        { 
          text: "Scrub vigorously multiple times a day", 
          emoji: "🌪️", 
          isCorrect: false
        },
        { 
          text: "Never wash to avoid irritation", 
          emoji: "✋", 
          isCorrect: false
        },
        { 
          text: "Use lots of oily products", 
          emoji: "🛢️", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great choice! Gentle cleansing twice daily helps prevent acne without irritating the skin!",
        wrong: "Washing your face twice daily with a gentle cleanser is the most effective way to prevent acne."
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
    // Navigate to the next category or main menu
    navigate("/games/health-female/teens");
  };

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: Hygiene Pro Girl"
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
                <h3 className="text-3xl font-bold text-white mb-4">Hygiene Pro Girl Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent hygiene knowledge with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Hygiene Pro Girl</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Daily Care</h4>
                    <p className="text-white/90 text-sm">
                      You understand the importance of consistent hygiene routines.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Health Awareness</h4>
                    <p className="text-white/90 text-sm">
                      You know how proper hygiene prevents health issues.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Improving Your Hygiene Knowledge!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review hygiene best practices to strengthen your knowledge and earn your badge.
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

export default BadgeHygieneProGirl;