import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeTeamKid = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "moral-kids-70";
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
      title: "Helping Teammates",
      question: "Your teammate needs help scoring a goal. What should you do?",
      options: [
        { 
          text: "Help them score the goal", 
          emoji: "⚽", 
          isCorrect: true
        },
        { 
          text: "Score yourself", 
          emoji: "🎯", 
          isCorrect: false
        },
        { 
          text: "Let them struggle", 
          emoji: "😏", 
          isCorrect: false
        },
        { 
          text: "Take the ball", 
          emoji: "🏃", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Helping teammates succeed shows great teamwork!",
        wrong: "Remember: In a team, helping others succeed helps everyone win together."
      }
    },
    {
      id: 2,
      title: "Sharing Materials",
      question: "During a class activity, your friend needs materials. What do you do?",
      options: [
        { 
          text: "Keep all materials", 
          emoji: "📦", 
          isCorrect: false
        },
        { 
          text: "Share your materials", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          text: "Say you don't have any", 
          emoji: "🤷", 
          isCorrect: false
        },
        { 
          text: "Give them broken ones", 
          emoji: "💔", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Excellent! Sharing materials helps everyone complete the task together!",
        wrong: "Sharing materials with teammates is part of good teamwork."
      }
    },
    {
      id: 3,
      title: "Encouraging Others",
      question: "Your friend is struggling with a task. How do you help?",
      options: [
        { 
          text: "Laugh at them", 
          emoji: "😆", 
          isCorrect: false
        },
        { 
          text: "Do it for them", 
          emoji: "🤝", 
          isCorrect: false
        },
        { 
          text: "Encourage them to keep trying", 
          emoji: "💪", 
          isCorrect: true
        },
        { 
          text: "Ignore them", 
          emoji: "😶", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Wonderful! Encouraging teammates helps them improve and keeps the team strong!",
        wrong: "Encouraging teammates when they struggle shows good teamwork spirit."
      }
    },
    {
      id: 4,
      title: "Taking Turns",
      question: "During a group game, what should you do?",
      options: [
        { 
          text: "Always go first", 
          emoji: "🏃", 
          isCorrect: false
        },
        { 
          text: "Skip others' turns", 
          emoji: "⏭️", 
          isCorrect: false
        },
        { 
          text: "Never take a turn", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "Take turns fairly", 
          emoji: "🎲", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Great! Taking turns makes games fair and fun for everyone!",
        wrong: "In team games, everyone should take turns fairly. That's good teamwork."
      }
    },
    {
      id: 5,
      title: "Working Together",
      question: "Your team has a task to complete. What should you do?",
      options: [
        { 
          text: "Work together on the task", 
          emoji: "🏀", 
          isCorrect: true
        },
        { 
          text: "Let others do it all", 
          emoji: "👀", 
          isCorrect: false
        },
        { 
          text: "Do it alone", 
          emoji: "👤", 
          isCorrect: false
        },
        { 
          text: "Ignore the task", 
          emoji: "😶", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Working together makes tasks easier and more fun!",
        wrong: "Teamwork means everyone works together to complete tasks. Everyone contributes!"
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
      title="Badge: Team Kid"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/moral-values/kids/old-lady-story"
      nextGameIdProp="moral-kids-71"
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
                    className={`bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3 ${
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
                <h3 className="text-3xl font-bold text-white mb-4">Team Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You made {score} teamwork choices out of {challenges.length} challenges!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Team Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Teamwork Choices</h4>
                    <p className="text-white/90 text-sm">
                      You chose to help teammates, share materials, encourage others, 
                      take turns, and work together.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Together We Win</h4>
                    <p className="text-white/90 text-sm">
                      Great teamwork makes everything easier and more fun for everyone!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {score} teamwork choices out of {challenges.length} challenges.
                </p>
                <p className="text-white/90 mb-6">
                  Remember, teamwork means helping teammates, sharing resources, encouraging others, 
                  taking turns, and working together on tasks.
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

export default BadgeTeamKid;

