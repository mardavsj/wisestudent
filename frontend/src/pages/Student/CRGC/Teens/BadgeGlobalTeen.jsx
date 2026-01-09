import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeGlobalTeen = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "civic-responsibility-teens-90";
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
      title: "Cultural Learning",
      question: "Why is it valuable to learn about cultures different from your own?",
      options: [
        { 
          text: "To prove your superiority over other cultures", 
          isCorrect: false
        },
        
        { 
          text: "To copy other cultures without understanding", 
          isCorrect: false
        },
        { 
          text: "To find reasons to criticize other cultures", 
          isCorrect: false
        },
        { 
          text: "To develop understanding and appreciation for diversity", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Learning about different cultures develops understanding and appreciation for diversity, fostering global citizenship.",
        wrong: "Learning about different cultures develops understanding and appreciation for diversity, fostering global citizenship."
      }
    },
    {
      id: 2,
      title: "Global Issue Engagement",
      question: "What is the best approach to discussing global challenges like climate change or poverty?",
      options: [
        { 
          text: "Dismiss them as not your problem", 
          isCorrect: false
        },
        { 
          text: "Engage thoughtfully and consider your role in solutions", 
          isCorrect: true
        },
        { 
          text: "Blame others without offering solutions", 
          isCorrect: false
        },
        { 
          text: "Avoid all discussions about serious issues", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Thoughtful engagement with global challenges helps develop informed perspectives and potential solutions.",
        wrong: "Thoughtful engagement with global challenges helps develop informed perspectives and potential solutions."
      }
    },
    {
      id: 3,
      title: "International Support",
      question: "How can supporting international causes contribute to global citizenship?",
      options: [
        { 
          text: "By focusing only on local issues", 
          isCorrect: false
        },
        
        { 
          text: "By expecting something in return for support", 
          isCorrect: false
        },
        { 
          text: "By recognizing interconnected global challenges and contributing to solutions", 
          isCorrect: true
        },
        { 
          text: "By supporting only causes in your own country", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Recognizing interconnected global challenges and contributing to solutions demonstrates global citizenship.",
        wrong: "Recognizing interconnected global challenges and contributing to solutions demonstrates global citizenship."
      }
    },
    {
      id: 4,
      title: "Cultural Respect",
      question: "How should you practice cultural respect in daily interactions?",
      options: [
        { 
          text: "By ignoring cultural differences entirely", 
          isCorrect: false
        },
        { 
          text: "By acknowledging and valuing different perspectives and practices", 
          isCorrect: true
        },
        { 
          text: "By imposing your cultural values on others", 
          isCorrect: false
        },
        { 
          text: "By avoiding interactions with people from different cultures", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Acknowledging and valuing different perspectives and practices shows genuine cultural respect.",
        wrong: "Acknowledging and valuing different perspectives and practices shows genuine cultural respect."
      }
    },
    {
      id: 5,
      title: "Global Learning",
      question: "Why is staying informed about international events important for global citizenship?",
      options: [
        { 
          text: "To understand global connections and your role in the world", 
          isCorrect: true
        },
        { 
          text: "To gossip about other countries", 
          isCorrect: false
        },
        
        { 
          text: "To feel superior to other nations", 
          isCorrect: false
        },
        { 
          text: "To avoid local news and issues", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Understanding global connections and your role in the world is fundamental to global citizenship.",
        wrong: "Understanding global connections and your role in the world is fundamental to global citizenship."
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

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: Global Teen"
      subtitle={showResult ? "Game Complete!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      gameType="civic-responsibility"
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/teens"
    
      nextGamePathProp="/student/civic-responsibility/teens/student-council-story"
      nextGameIdProp="civic-responsibility-teens-91">
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
                <h3 className="text-3xl font-bold text-white mb-4">Global Teen Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong global citizenship with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Global Teen</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Cultural Awareness</h4>
                    <p className="text-white/90 text-sm">
                      You understand the value of learning about and respecting different cultures.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Global Engagement</h4>
                    <p className="text-white/90 text-sm">
                      You recognize your role in addressing global challenges and staying informed.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    window.location.href = "/games/civic-responsibility/teens";
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Expanding Your Global Perspective!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review global citizenship concepts to strengthen your understanding.
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

export default BadgeGlobalTeen;