import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SafeGirlBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "health-female-kids-90";
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
      title: "Safe Choice",
      question: "How do you earn the 'Safe Choice' badge?",
      options: [
        { 
          text: "Try Energy drinks once", 
          emoji: "⚡", 
          isCorrect: false
        },
        { 
          text: "Say NO to all harmful things", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          text: "Hide in your room", 
          emoji: "🚪", 
          isCorrect: false
        },
        { 
          text: "Follow strangers", 
          emoji: "🚶", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Correct! That is a safe choice.",
        wrong: "Always say NO to harmful things to stay safe."
      }
    },
    {
      id: 2,
      title: "Strong Voice",
      question: "To get the 'Strong Voice' badge...",
      options: [
        { 
          text: "Whisper your secrets", 
          emoji: "🤫", 
          isCorrect: false
        },
        { 
          text: "Never talk to adults", 
          emoji: "🤐", 
          isCorrect: false
        },
        { 
          text: "Speak up if something feels wrong", 
          emoji: "🗣️", 
          isCorrect: true
        },
        { 
          text: "Stay quiet always", 
          emoji: "🔇", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Yes! Use your strong voice.",
        wrong: "Speak up when something feels wrong to stay safe."
      }
    },
    {
      id: 3,
      title: "Healthy Body",
      question: "The 'Healthy Body' badge requires...",
      options: [
        { 
          text: "Eating only candy", 
          emoji: "🍭", 
          isCorrect: false
        },
        { 
          text: "Never bathing", 
          emoji: "🚿", 
          isCorrect: false
        },
        { 
          text: "Protecting your body from smoke and Energy drinks", 
          emoji: "🫁", 
          isCorrect: false
        },
        { 
          text: "Keeping your body clean and safe", 
          emoji: "🧼", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Correct! Keep your body clean and safe.",
        wrong: "Protect your body by keeping it clean and avoiding harmful substances."
      }
    },
    {
      id: 4,
      title: "Smart Friend",
      question: "What unlocks the 'Smart Friend' badge?",
      options: [
        { 
          text: "Daring friends to be bad", 
          emoji: "😈", 
          isCorrect: false
        },
        { 
          text: "Ignoring your friends", 
          emoji: "🤷‍♀️", 
          isCorrect: false
        },
        { 
          text: "Influencing friends to be safe", 
          emoji: "🤝", 
          isCorrect: false
        },
        { 
          text: "Helping friends make good choices", 
          emoji: "👥", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Yes! Help friends be safe too.",
        wrong: "Being a smart friend means helping others make good choices."
      }
    },
    {
      id: 5,
      title: "Permission Pro",
      question: "You are a 'Permission Pro' if you...",
      options: [
        { 
          text: "Take things without asking", 
          emoji: "👐", 
          isCorrect: false
        },
        { 
          text: "Guess if it's okay", 
          emoji: "🤔", 
          isCorrect: false
        },
        { 
          text: "Ask a parent before taking medicine or going somewhere", 
          emoji: "🙋‍♀️", 
          isCorrect: false
        },
        { 
          text: "Always ask for permission first", 
          emoji: "✋", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Correct! Always ask for permission.",
        wrong: "Always ask a trusted adult for permission before doing something important."
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
      title="Badge: Safe Girl"
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
                <h3 className="text-3xl font-bold text-white mb-4">Safe Girl Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent safety awareness with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Safe Girl</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-pink-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-pink-300 mb-2">Voice</h4>
                    <p className="text-white/90 text-sm">
                      You know when and how to speak up for your safety.
                    </p>
                  </div>
                  <div className="bg-purple-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-purple-300 mb-2">Choices</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to make safe and healthy choices.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Safety!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review safety concepts to strengthen your knowledge and earn your badge.
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

export default SafeGirlBadge;