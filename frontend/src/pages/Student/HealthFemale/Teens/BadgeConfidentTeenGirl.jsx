import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeConfidentTeenGirl = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "health-female-teen-70";
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
      title: "Self-Belief",
      question: "What should you do when facing a difficult challenge?",
      options: [
        { 
          text: "Give up immediately", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Believe in your abilities", 
          emoji: "💪", 
          isCorrect: true
        },
        { 
          text: "Blame others for your problems", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Avoid trying new things", 
          emoji: "😨", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Believing in yourself is the first step to overcoming challenges!",
        wrong: "When facing difficulties, believing in your abilities gives you the strength to persevere."
      }
    },
    {
      id: 2,
      title: "Handling Criticism",
      question: "How should you respond to constructive feedback?",
      options: [
        { 
          text: "Ignore all feedback", 
          emoji: "🙉", 
          isCorrect: false
        },
        { 
          text: "Get angry at the person", 
          emoji: "😡", 
          isCorrect: false
        },
        { 
          text: "Learn and improve from it", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          text: "Criticize others in return", 
          emoji: "⚔️", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great! Constructive feedback helps us grow and become better versions of ourselves!",
        wrong: "Constructive feedback is meant to help us improve, so we should listen and learn from it."
      }
    },
    {
      id: 3,
      title: "Setting Goals",
      question: "What's the best approach to achieve your dreams?",
      options: [
        { 
          text: "Make a realistic plan", 
          emoji: "📝", 
          isCorrect: true
        },
        { 
          text: "Expect instant success", 
          emoji: "✨", 
          isCorrect: false
        },
        
        { 
          text: "Rely only on luck", 
          emoji: "🍀", 
          isCorrect: false
        },
        { 
          text: "Copy someone else completely", 
          emoji: "🎭", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Right! Setting realistic goals and making plans helps you achieve your dreams step by step!",
        wrong: "Achieving dreams requires planning and consistent effort, not just luck or copying others."
      }
    },
    {
      id: 4,
      title: "Building Resilience",
      question: "What helps you bounce back from failures?",
      options: [
        { 
          text: "Stop trying anything new", 
          emoji: "🛑", 
          isCorrect: false
        },
        
        { 
          text: "Blame circumstances", 
          emoji: "🤷", 
          isCorrect: false
        },
        { 
          text: "Learn from mistakes", 
          emoji: "🧠", 
          isCorrect: true
        },
        { 
          text: "Compare yourself to others", 
          emoji: "👥", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Learning from failures makes you stronger and wiser for future attempts!",
        wrong: "Resilient people learn from their mistakes rather than giving up or blaming others."
      }
    },
    {
      id: 5,
      title: "Positive Self-Talk",
      question: "What should you say to yourself when feeling nervous?",
      options: [
        { 
          text: "I can handle this", 
          emoji: "🌟", 
          isCorrect: true
        },
        { 
          text: "I'm not good enough", 
          emoji: "😞", 
          isCorrect: false
        },
        
        { 
          text: "Everyone will judge me", 
          emoji: "👀", 
          isCorrect: false
        },
        { 
          text: "I'll definitely fail", 
          emoji: "💥", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Positive self-talk boosts your confidence and helps you perform better!",
        wrong: "Encouraging yourself with positive thoughts helps reduce anxiety and improves performance."
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
      title="Badge: Confident Teen Girl"
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
      nextGamePathProp="/student/health-female/teens/health-check-story"
      nextGameIdProp="health-female-teen-71">
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
                <h3 className="text-3xl font-bold text-white mb-4">Confident Teen Girl Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent confidence-building skills with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Confident Teen Girl</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Self-Belief</h4>
                    <p className="text-white/90 text-sm">
                      You understand the importance of believing in your abilities.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Resilience</h4>
                    <p className="text-white/90 text-sm">
                      You know how to bounce back from setbacks and learn from failures.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Building Confidence!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review confidence-building techniques to strengthen your knowledge and earn your badge.
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

export default BadgeConfidentTeenGirl;