import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeEmotionSmartTeenGirl = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "health-female-teen-60";
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
      title: "Managing Stress",
      question: "What's the best way to handle exam stress?",
      options: [
        { 
          text: "Panic and worry constantly", 
          emoji: "😰", 
          isCorrect: false
        },
        { 
          text: "Plan study schedule and take breaks", 
          emoji: "📅", 
          isCorrect: true
        },
        { 
          text: "Avoid studying altogether", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "Compare yourself to others", 
          emoji: "😔", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Excellent! Planning and taking breaks helps reduce stress and improves focus!",
        wrong: "Effective stress management involves planning your study time and including regular breaks."
      }
    },
    {
      id: 2,
      title: "Dealing with Sadness",
      question: "How should you handle feelings of sadness?",
      options: [
        { 
          text: "Suppress your emotions completely", 
          emoji: "🤐", 
          isCorrect: false
        },
        { 
          text: "Talk to someone you trust", 
          emoji: "💬", 
          isCorrect: true
        },
        { 
          text: "Stay isolated from everyone", 
          emoji: "😔", 
          isCorrect: false
        },
        { 
          text: "Ignore your feelings entirely", 
          emoji: "🙈", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "That's right! Sharing your feelings with trusted friends or family helps you process emotions!",
        wrong: "Talking to someone you trust is a healthy way to handle sadness rather than suppressing or ignoring it."
      }
    },
    {
      id: 3,
      title: "Handling Anger",
      question: "What should you do when you feel angry?",
      options: [
        { 
          text: "Take deep breaths and count to ten", 
          emoji: "🧘", 
          isCorrect: true
        },
        { 
          text: "Yell and scream at others", 
          emoji: "🤬", 
          isCorrect: false
        },
        { 
          text: "Break things to release frustration", 
          emoji: "💥", 
          isCorrect: false
        },
        { 
          text: "Hold it in forever", 
          emoji: "🤐", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Good choice! Deep breathing exercises help calm your mind and control anger!",
        wrong: "Healthy anger management includes techniques like deep breathing rather than aggressive behaviors."
      }
    },
    {
      id: 4,
      title: "Building Empathy",
      question: "How can you better understand your friend's feelings?",
      options: [
        { 
          text: "Listen actively without judging", 
          emoji: "👂", 
          isCorrect: true
        },
        { 
          text: "Tell them what to do immediately", 
          emoji: "📢", 
          isCorrect: false
        },
        { 
          text: "Share your own problems instead", 
          emoji: "🤷‍♀️", 
          isCorrect: false
        },
        { 
          text: "Ignore their concerns", 
          emoji: "😴", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Active listening shows you care and helps you understand others better!",
        wrong: "Empathy involves truly listening to others without immediately offering advice or sharing your own experiences."
      }
    },
    {
      id: 5,
      title: "Boosting Happiness",
      question: "What activity can improve your mood?",
      options: [
        { 
          text: "Helping others in your community", 
          emoji: "🤝", 
          isCorrect: true
        },
        { 
          text: "Spending all day on social media", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          text: "Complaining about everything", 
          emoji: "😤", 
          isCorrect: false
        },
        { 
          text: "Avoiding all social interactions", 
          emoji: "🚪", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Wonderful! Helping others creates a sense of purpose and increases happiness!",
        wrong: "Activities that connect us with others and contribute to our community tend to boost happiness."
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
      title="Badge: Emotion Smart Teen Girl"
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
      nextGamePathProp="/student/health-female/teens/self-image-story"
      nextGameIdProp="health-female-teen-61">
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
                <h3 className="text-3xl font-bold text-white mb-4">Emotion Smart Teen Girl Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent emotional intelligence with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Emotion Smart Teen Girl</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Emotional Awareness</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to recognize and manage your emotions effectively.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Social Skills</h4>
                    <p className="text-white/90 text-sm">
                      You know how to empathize with others and build healthy relationships.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Developing Emotional Skills!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review emotional health concepts to strengthen your knowledge and earn your badge.
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

export default BadgeEmotionSmartTeenGirl;