import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PreventiveCareTeenBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "health-female-teen-80";
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
      title: "Health Checkups",
      question: "How often should teenagers have a general health checkup?",
      options: [
        { 
          text: "Only when feeling sick", 
          emoji: "🤒", 
          isCorrect: false
        },
        { 
          text: "Varies by individual", 
          emoji: "🙂", 
          isCorrect: true
        },
        { 
          text: "Monthly visits to doctor", 
          emoji: "🔁", 
          isCorrect: false
        },
        { 
          text: "Never unless emergency", 
          emoji: "❌", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Regular checkups every 1-2 years help catch potential health issues early!",
        wrong: "Teenagers should have general health checkups every 1-2 years for preventive care."
      }
    },
    {
      id: 2,
      title: "Vaccinations",
      question: "Which vaccination is especially important for teenage girls?",
      options: [
        { 
          text: "HPV vaccine", 
          emoji: "💉", 
          isCorrect: true
        },
        { 
          text: "Flu shot only", 
          emoji: "🤧", 
          isCorrect: false
        },
        { 
          text: "Chickenpox vaccine", 
          emoji: "💉", 
          isCorrect: false
        },
        { 
          text: "No vaccines needed", 
          emoji: "🚫", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Right! The HPV vaccine is specifically recommended for teenage girls to prevent cervical cancer!",
        wrong: "The HPV vaccine is particularly important for teenage girls as it helps prevent cervical cancer."
      }
    },
    {
      id: 3,
      title: "Self-Examination",
      question: "What is the recommended age to start breast self-examination education?",
      options: [
        { 
          text: "Around 18-20 years", 
          emoji: "🧑", 
          isCorrect: false
        },
        { 
          text: "During early teens (13-15)", 
          emoji: "🫀", 
          isCorrect: false
        },
        { 
          text: "Not needed until 30s", 
          emoji: "💤", 
          isCorrect: false
        },
        { 
          text: "As soon as breasts develop", 
          emoji: "👶", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Perfect! Breast self-examination education should begin when breast development starts!",
        wrong: "Breast self-examination education should begin as soon as breast development starts during puberty."
      }
    },
    {
      id: 4,
      title: "Mental Health",
      question: "Why is mental health screening important for teenagers?",
      options: [
        { 
          text: "To identify issues early and provide support", 
          emoji: "❤️", 
          isCorrect: true
        },
        { 
          text: "Only for students with poor grades", 
          emoji: "📉", 
          isCorrect: false
        },
        { 
          text: "To reduce school workload", 
          emoji: "📚", 
          isCorrect: false
        },
        { 
          text: "It's not important for teens", 
          emoji: "🤔", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Early identification of mental health issues allows for timely intervention and support!",
        wrong: "Mental health screening is important for all teenagers to identify issues early and provide appropriate support."
      }
    },
    {
      id: 5,
      title: "Reproductive Health",
      question: "What preventive care practice helps maintain good reproductive health?",
      options: [
        { 
          text: "Regular gynecological checkups", 
          emoji: "🏥", 
          isCorrect: false
        },
        { 
          text: "Ignoring menstrual cycle changes", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Annual reproductive health exams", 
          emoji: "📋", 
          isCorrect: true
        },
        { 
          text: "Avoiding all health discussions", 
          emoji: "🤐", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great choice! Annual reproductive health exams are key to maintaining good reproductive health!",
        wrong: "Annual reproductive health exams help maintain good reproductive health by detecting issues early."
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
      title="Badge: Preventive Care Teen"
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
                <h3 className="text-3xl font-bold text-white mb-4">Preventive Care Teen Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent preventive care knowledge with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-blue-400 to-purple-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Preventive Care Teen</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Health Awareness</h4>
                    <p className="text-white/90 text-sm">
                      You understand the importance of regular checkups and preventive care.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Reproductive Health</h4>
                    <p className="text-white/90 text-sm">
                      You know how to maintain good reproductive health through regular exams.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Preventive Care!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review preventive care concepts to strengthen your knowledge and earn your badge.
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

export default PreventiveCareTeenBadge;