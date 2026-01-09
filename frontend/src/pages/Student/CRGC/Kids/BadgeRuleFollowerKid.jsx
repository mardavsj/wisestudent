import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeRuleFollowerKid = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "civic-responsibility-kids-80";
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
      title: "Civic Responsibility",
      question: "Which of these is an example of following civic responsibility?",
      options: [
        { 
          text: "Littering in public spaces", 
          isCorrect: false
        },
        { 
          text: "Voting in elections when old enough", 
          isCorrect: true
        },
        { 
          text: "Ignoring traffic signals", 
          isCorrect: false
        },
        { 
          text: "Breaking community rules", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Voting is a key civic responsibility that allows citizens to participate in democracy and have a say in how their community is governed.",
        wrong: "Voting is a key civic responsibility that allows citizens to participate in democracy and have a say in how their community is governed."
      }
    },
    {
      id: 2,
      title: "School Rules Importance",
      question: "Following school rules is only important when teachers are watching.",
      options: [
        { 
          text: "True", 
          isCorrect: false
        },
        { 
          text: "False", 
          isCorrect: true
        },
        { 
          text: "Only sometimes", 
          isCorrect: false
        },
        { 
          text: "Only during tests", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "School rules should be followed at all times because they help create a safe and orderly learning environment for everyone.",
        wrong: "School rules should be followed at all times because they help create a safe and orderly learning environment for everyone."
      }
    },
    {
      id: 3,
      title: "Public Spaces Care",
      question: "One important civic duty is to keep public spaces clean.",
      options: [
        { 
          text: "True", 
          isCorrect: true
        },
        { 
          text: "False", 
          isCorrect: false
        },
        { 
          text: "Only when it's convenient", 
          isCorrect: false
        },
        { 
          text: "Only if others do it", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Keeping public spaces clean shows respect for our shared environment and community.",
        wrong: "Keeping public spaces clean shows respect for our shared environment and community."
      }
    },
    {
      id: 4,
      title: "Safety Rules",
      question: "You see someone breaking an important safety rule. What should you do?",
      options: [
        { 
          text: "Ignore it to avoid conflict", 
          isCorrect: false
        },
        { 
          text: "Politely remind them or tell an adult", 
          isCorrect: true
        },
        { 
          text: "Join them to fit in", 
          isCorrect: false
        },
        { 
          text: "Laugh at them", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "If someone is breaking an important safety rule, it's our civic duty to help prevent potential harm by politely reminding them or informing an adult who can help.",
        wrong: "If someone is breaking an important safety rule, it's our civic duty to help prevent potential harm by politely reminding them or informing an adult who can help."
      }
    },
    {
      id: 5,
      title: "Traffic Rules Importance",
      question: "Why is it important to follow traffic rules?",
      options: [
        { 
          text: "Only to avoid getting tickets", 
          isCorrect: false
        },
        { 
          text: "To ensure safety for all road users", 
          isCorrect: true
        },
        { 
          text: "Because rules are boring", 
          isCorrect: false
        },
        { 
          text: "Only when police are watching", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Traffic rules exist to protect everyone - pedestrians, cyclists, and drivers - by creating predictable and safe interactions on the road.",
        wrong: "Traffic rules exist to protect everyone - pedestrians, cyclists, and drivers - by creating predictable and safe interactions on the road."
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
      title="Badge: Rule Follower Kid"
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
      backPath="/games/civic-responsibility/kids"
    
      nextGamePathProp="/student/civic-responsibility/kids/food-story-2"
      nextGameIdProp="civic-responsibility-kids-81">
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
                <h3 className="text-3xl font-bold text-white mb-4">Rule Follower Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong knowledge of civic responsibility with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Rule Follower Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Civic Awareness</h4>
                    <p className="text-white/90 text-sm">
                      You understand the importance of following rules and taking responsibility in your community.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Social Responsibility</h4>
                    <p className="text-white/90 text-sm">
                      You're building awareness of how to contribute positively to society.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    window.location.href = "/games/civic-responsibility/kids";
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Following Rules!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review civic responsibility concepts to strengthen your knowledge.
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

export default BadgeRuleFollowerKid;