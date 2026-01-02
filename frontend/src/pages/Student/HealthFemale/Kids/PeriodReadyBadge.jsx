import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PeriodReadyBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "health-female-kids-100";
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
      title: "Cycle Length",
      question: "What is the average length of a menstrual cycle?",
      options: [
        { 
          text: "14 days", 
          emoji: "📅", 
          isCorrect: false
        },
        { 
          text: "28 days", 
          emoji: "🗓️", 
          isCorrect: true
        },
        { 
          text: "42 days", 
          emoji: "📆", 
          isCorrect: false
        },
        { 
          text: "7 days", 
          emoji: "⏱️", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Most cycles are around 28 days.",
        wrong: "The average menstrual cycle lasts about 28 days."
      }
    },
    {
      id: 2,
      title: "Hygiene",
      question: "How often should you change your pad?",
      options: [
        { 
          text: "Every 24 hours", 
          emoji: "⏰", 
          isCorrect: false
        },
        { 
          text: "Only when it hurts", 
          emoji: "😣", 
          isCorrect: false
        },
        { 
          text: "Every 4-8 hours", 
          emoji: "🕓", 
          isCorrect: true
        },
        { 
          text: "Once a day", 
          emoji: "🌞", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Excellent! Changing regularly keeps you fresh and healthy.",
        wrong: "You should change pads every 4-8 hours for good hygiene."
      }
    },
    {
      id: 3,
      title: "Symptoms",
      question: "What might you feel during your period?",
      options: [
        { 
          text: "Your hair turns purple", 
          emoji: "🟣", 
          isCorrect: false
        },
        { 
          text: "Cramps or mood changes", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          text: "You become invisible", 
          emoji: "👻", 
          isCorrect: false
        },
        { 
          text: "Cramps and mood swings", 
          emoji: "😫", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Right! Cramps and mood swings are normal symptoms.",
        wrong: "Common symptoms include cramps and mood swings."
      }
    },
    {
      id: 4,
      title: "Support",
      question: "What should you do if a friend is embarrassed?",
      options: [
        { 
          text: "Laugh at her", 
          emoji: "😂", 
          isCorrect: false
        },
        { 
          text: "Tell everyone", 
          emoji: "🗣️", 
          isCorrect: false
        },
        { 
          text: "Ignore her", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Comfort her", 
          emoji: "🤗", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "That is kind! Supporting friends is very important.",
        wrong: "You should always comfort and support your friends."
      }
    },
    {
      id: 5,
      title: "Readiness",
      question: "What makes you Period Ready?",
      options: [
        { 
          text: "Ignoring it", 
          emoji: "🙉", 
          isCorrect: false
        },
        { 
          text: "Staying home forever", 
          emoji: "🏠", 
          isCorrect: false
        },
        { 
          text: "Having supplies and knowledge", 
          emoji: "🎒", 
          isCorrect: true
        },
        { 
          text: "Wearing fancy clothes", 
          emoji: "👗", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "You got it! Being prepared makes you confident!",
        wrong: "Being ready means having supplies and knowing what to expect."
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
      title="Badge: Period Ready Kid"
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
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-4">Period Ready Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about periods with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Period Ready Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-pink-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-pink-300 mb-2">Knowledge</h4>
                    <p className="text-white/90 text-sm">
                      You understand menstrual cycle basics and hygiene practices.
                    </p>
                  </div>
                  <div className="bg-purple-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-purple-300 mb-2">Support</h4>
                    <p className="text-white/90 text-sm">
                      You know how to support friends during their periods.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Periods!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review period basics to strengthen your knowledge and earn your badge.
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

export default PeriodReadyBadge;