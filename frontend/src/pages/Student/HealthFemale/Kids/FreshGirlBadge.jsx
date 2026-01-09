import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FreshGirlBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "health-female-kids-50";
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
      title: "Fresh & Clean",
      question: "How do you earn the 'Fresh & Clean' badge?",
      options: [
        { 
          text: "By skipping showers", 
          emoji: "🚿", 
          isCorrect: false
        },
        { 
          text: "By bathing regularly", 
          emoji: "🛁", 
          isCorrect: true
        },
        { 
          text: "By rolling in mud", 
          emoji: "🐷", 
          isCorrect: false
        },
        { 
          text: "By using perfume only", 
          emoji: "🌸", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Regular bathing keeps you fresh and clean!",
        wrong: "Bathing regularly is the best way to stay fresh and clean."
      }
    },
    {
      id: 2,
      title: "Sparkling Smile",
      question: "What gives you the 'Sparkling Smile' badge?",
      options: [
        { 
          text: "Chewing gum only", 
          emoji: "🍬", 
          isCorrect: false
        },
        { 
          text: "Brushing twice a day", 
          emoji: "🦷", 
          isCorrect: false
        },
        { 
          text: "Visiting the dentist", 
          emoji: "👩‍⚕️", 
          isCorrect: false
        },
        { 
          text: "Both brushing and dental visits", 
          emoji: "😁", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Perfect! Both daily brushing and regular dental visits keep your smile sparkling!",
        wrong: "A sparkling smile needs both daily brushing and regular dental checkups."
      }
    },
    {
      id: 3,
      title: "Hand Hygiene",
      question: "What earns you the 'Hand Hygiene' badge?",
      options: [
        { 
          text: "Washing hands with soap", 
          emoji: "🧼", 
          isCorrect: false
        },
        { 
          text: "Using hand sanitizer only", 
          emoji: "🧴", 
          isCorrect: false
        },
        { 
          text: "Washing with soap AND sanitizer", 
          emoji: "👐", 
          isCorrect: true
        },
        { 
          text: "Wiping hands on pants", 
          emoji: "👖", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great! Soap removes germs, and sanitizer provides extra protection!",
        wrong: "Effective hand hygiene combines soap washing with sanitizer when needed."
      }
    },
    {
      id: 4,
      title: "Fresh Clothes",
      question: "How do you get the 'Fresh Clothes' badge?",
      options: [
        { 
          text: "Wearing the same socks for a week", 
          emoji: "🧦", 
          isCorrect: false
        },
        { 
          text: "Changing underwear daily", 
          emoji: "🩲", 
          isCorrect: false
        },
        { 
          text: "Only changing when visibly dirty", 
          emoji: "👕", 
          isCorrect: false
        },
        { 
          text: "Changing all clothes regularly", 
          emoji: "👚", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Exactly! Changing all clothes regularly keeps you fresh!",
        wrong: "Regular clothing changes prevent odors and maintain freshness."
      }
    },
    {
      id: 5,
      title: "Hygiene Hero",
      question: "What makes you a 'Hygiene Hero'?",
      options: [
        { 
          text: "Ignoring bad smells", 
          emoji: "👃", 
          isCorrect: false
        },
        { 
          text: "Using spray instead of washing", 
          emoji: "🌸", 
          isCorrect: false
        },
        { 
          text: "Taking care of your whole body", 
          emoji: "🦸‍♀️", 
          isCorrect: true
        },
        { 
          text: "Only focusing on hair", 
          emoji: "💇‍♀️", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! True hygiene heroes take care of their entire body!",
        wrong: "Being a hygiene hero means taking care of your whole body, not just one part."
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
      title="Badge: Fresh Girl"
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
      nextGamePathProp="/student/health-female/kids/feelings-story"
      nextGameIdProp="health-female-kids-51">
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
                <h3 className="text-3xl font-bold text-white mb-4">Fresh Girl Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about personal hygiene with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Fresh Girl</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Personal Care</h4>
                    <p className="text-white/90 text-sm">
                      You understand the importance of regular hygiene routines for staying fresh.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Confidence Building</h4>
                    <p className="text-white/90 text-sm">
                      You know that good hygiene habits build lasting confidence.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Hygiene!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review hygiene concepts to strengthen your knowledge and earn your badge.
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

export default FreshGirlBadge;