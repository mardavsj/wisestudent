import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DrugFreeTeenGirlBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      title: "Peer Pressure",
      question: "Your friends are pressuring you to try drugs. What's the best response?",
      options: [
        { 
          text: "Give in to fit in", 
          emoji: "😢", 
          isCorrect: false
        },
        { 
          text: "Politely decline and suggest a different activity", 
          emoji: "👍", 
          isCorrect: true
        },
        { 
          text: "Try it just once", 
          emoji: "🤔", 
          isCorrect: false
        },
        { 
          text: "Get angry at your friends", 
          emoji: "😠", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Standing firm in your values while suggesting alternatives shows maturity and leadership!",
        wrong: "Healthy friendships respect your boundaries. True friends won't pressure you to do things you're uncomfortable with."
      }
    },
    {
      id: 2,
      title: "Stress Management",
      question: "Which is a healthy way to cope with stress instead of using substances?",
      options: [
        { 
          text: "Exercise or physical activity", 
          emoji: "🏃", 
          isCorrect: true
        },
        { 
          text: "Drinking alcohol", 
          emoji: "🍺", 
          isCorrect: false
        },
        { 
          text: "Smoking cigarettes", 
          emoji: "🚬", 
          isCorrect: false
        },
        { 
          text: "Taking prescription pills not prescribed to you", 
          emoji: "💊", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Right! Exercise releases endorphins which naturally reduce stress and boost mood!",
        wrong: "Physical activity is one of the healthiest ways to manage stress. It improves both physical and mental well-being."
      }
    },
    {
      id: 3,
      title: "Recognizing Warning Signs",
      question: "Which of these is a warning sign that someone might be struggling with substance use?",
      options: [
        { 
          text: "Maintaining good grades", 
          emoji: "📚", 
          isCorrect: false
        },
        { 
          text: "Changes in behavior, mood, or appearance", 
          emoji: "⚠️", 
          isCorrect: true
        },
        { 
          text: "Spending time with family", 
          emoji: "👨‍👩‍👧‍👦", 
          isCorrect: false
        },
        { 
          text: "Participating in hobbies", 
          emoji: "🎨", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Being aware of behavioral changes can help you support friends who might be struggling!",
        wrong: "Significant changes in behavior, mood, or personal appearance can indicate someone is dealing with substance use issues."
      }
    },
    {
      id: 4,
      title: "Myth vs Fact",
      question: "Which statement about drug use is a fact rather than a myth?",
      options: [
        { 
          text: "Trying drugs once won't hurt", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Marijuana is not addictive", 
          emoji: "⚠️", 
          isCorrect: false
        },
        { 
          text: "Substance use can negatively impact brain development in teens", 
          emoji: "🧠", 
          isCorrect: true
        },
        { 
          text: "Prescription drugs are safe to use recreationally", 
          emoji: "💊", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! The teenage brain is still developing and is particularly vulnerable to the effects of substances!",
        wrong: "Scientific research shows that substance use during adolescence can have lasting effects on brain development, affecting memory, learning, and decision-making."
      }
    },
    {
      id: 5,
      title: "Getting Help",
      question: "If you or someone you know is struggling with substance use, what should you do?",
      options: [
        { 
          text: "Ignore the problem", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Reach out to a trusted adult, counselor, or helpline", 
          emoji: "🆘", 
          isCorrect: true
        },
        { 
          text: "Try to handle it alone", 
          emoji: "😣", 
          isCorrect: false
        },
        { 
          text: "Join the person in their substance use", 
          emoji: "😵", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great choice! Seeking help from professionals or trusted adults is the best approach to getting proper support!",
        wrong: "Professional help and support from trusted adults are essential for addressing substance use issues effectively and safely."
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
      title="Badge: Drug-Free Teen Girl"
      subtitle={showResult ? "Game Complete!" : `Question ${challenge + 1} of ${challenges.length}`}
      onNext={handleNext}
      nextEnabled={true}
      showGameOver={showResult}
      score={score}
      gameId="health-female-teen-90"
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
      nextGamePathProp="/student/health-female/teens/routine-story"
      nextGameIdProp="health-female-teen-91">
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
                <h3 className="text-3xl font-bold text-white mb-4">Drug-Free Teen Girl Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about drug prevention with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Drug-Free Teen Girl</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Decision Making</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to make healthy choices under peer pressure.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Awareness</h4>
                    <p className="text-white/90 text-sm">
                      You recognize warning signs and know where to seek help.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Drug Prevention!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review drug prevention concepts to strengthen your knowledge and earn your badge.
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

export default DrugFreeTeenGirlBadge;