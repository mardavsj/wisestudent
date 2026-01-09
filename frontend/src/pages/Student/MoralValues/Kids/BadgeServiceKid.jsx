import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeServiceKid = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "moral-kids-80";
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
      title: "Helping Neighbors",
      question: "Your neighbor is struggling with heavy groceries. What should you do?",
      options: [
        { 
          text: "Help them carry groceries", 
          emoji: "🛒", 
          isCorrect: true
        },
        { 
          text: "Ignore them", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Laugh at them", 
          emoji: "😆", 
          isCorrect: false
        },
        { 
          text: "Walk past quickly", 
          emoji: "🏃", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Helping neighbors shows kindness and service to others!",
        wrong: "Remember: Helping others, especially neighbors, is a service to your community."
      }
    },
    {
      id: 2,
      title: "Caring for Animals",
      question: "You see a hungry stray animal. What should you do?",
      options: [
        { 
          text: "Scare it away", 
          emoji: "👻", 
          isCorrect: false
        },
        { 
          text: "Feed it safely", 
          emoji: "🐶", 
          isCorrect: true
        },
        { 
          text: "Ignore it", 
          emoji: "👀", 
          isCorrect: false
        },
        { 
          text: "Run away", 
          emoji: "🏃", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Excellent! Caring for animals shows compassion and service!",
        wrong: "Feeding hungry animals is a kind service. Ask an adult for help if needed."
      }
    },
    {
      id: 3,
      title: "Cleaning Public Spaces",
      question: "You notice trash in a park. What should you do?",
      options: [
        { 
          text: "Add more trash", 
          emoji: "🗑️", 
          isCorrect: false
        },
        { 
          text: "Ignore it", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Clean it up", 
          emoji: "🌳", 
          isCorrect: true
        },
        { 
          text: "Point at it", 
          emoji: "👈", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Wonderful! Cleaning public spaces helps everyone and shows service!",
        wrong: "Cleaning up parks and public spaces is a service to your community."
      }
    },
    {
      id: 4,
      title: "School Events",
      question: "Your school is organizing an event. What should you do?",
      options: [
        { 
          text: "Avoid it", 
          emoji: "🚶", 
          isCorrect: false
        },
        { 
          text: "Complain about it", 
          emoji: "😤", 
          isCorrect: false
        },
        { 
          text: "Stay home", 
          emoji: "🏠", 
          isCorrect: false
        },
        { 
          text: "Help organize it", 
          emoji: "🏫", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Great! Helping with school events shows service and school spirit!",
        wrong: "Helping organize school events is a great way to serve your school community."
      }
    },
    {
      id: 5,
      title: "Donating to Others",
      question: "You have old clothes and toys you don't use. What should you do?",
      options: [
        { 
          text: "Donate them to those in need", 
          emoji: "🎁", 
          isCorrect: true
        },
        { 
          text: "Throw them away", 
          emoji: "🗑️", 
          isCorrect: false
        },
        { 
          text: "Keep them forever", 
          emoji: "📦", 
          isCorrect: false
        },
        { 
          text: "Sell them", 
          emoji: "💰", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Donating to those in need is a wonderful service!",
        wrong: "Donating items you don't need to others is a great act of service."
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
      title="Badge: Service Kid"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/moral-values/kids/playground-fight-story"
      nextGameIdProp="moral-kids-81"
      gameType="moral"
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
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
                    className={`bg-gradient-to-r from-yellow-400 to-orange-600 hover:from-yellow-500 hover:to-orange-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3 ${
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
                <h3 className="text-3xl font-bold text-white mb-4">Service Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You made {score} service choices out of {challenges.length} challenges!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Service Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Service Choices</h4>
                    <p className="text-white/90 text-sm">
                      You chose to help neighbors, care for animals, clean public spaces, 
                      help with school events, and donate to those in need.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Making a Difference</h4>
                    <p className="text-white/90 text-sm">
                      Your service helps others and makes your community a better place!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {score} service choices out of {challenges.length} challenges.
                </p>
                <p className="text-white/90 mb-6">
                  Remember, service means helping others, caring for animals, cleaning communities, 
                  helping with events, and donating to those in need.
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

export default BadgeServiceKid;

