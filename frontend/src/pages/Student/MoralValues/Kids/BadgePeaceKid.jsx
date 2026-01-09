import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgePeaceKid = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "moral-kids-90";
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
      title: "Forgiving Friends",
      question: "Your friend did something that upset you. What should you do?",
      options: [
        { 
          text: "Forgive them and move on", 
          emoji: "🤝", 
          isCorrect: true
        },
        { 
          text: "Stay angry forever", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Get revenge", 
          emoji: "👊", 
          isCorrect: false
        },
        { 
          text: "Ignore them forever", 
          emoji: "😶", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Forgiving others brings peace and keeps friendships strong!",
        wrong: "Remember: Forgiving others when they make mistakes brings peace."
      }
    },
    {
      id: 2,
      title: "Sharing Without Fighting",
      question: "You and a friend both want the same toy. What should you do?",
      options: [
        { 
          text: "Fight for it", 
          emoji: "👊", 
          isCorrect: false
        },
        { 
          text: "Share it without arguing", 
          emoji: "🧸", 
          isCorrect: true
        },
        { 
          text: "Take it forcefully", 
          emoji: "💪", 
          isCorrect: false
        },
        { 
          text: "Cry about it", 
          emoji: "😭", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Excellent! Sharing peacefully solves problems without conflict!",
        wrong: "Sharing toys without arguing brings peace and keeps everyone happy."
      }
    },
    {
      id: 3,
      title: "Resolving Conflicts",
      question: "Two friends are fighting. What can you do to help?",
      options: [
        { 
          text: "Join the fight", 
          emoji: "⚔️", 
          isCorrect: false
        },
        { 
          text: "Watch and do nothing", 
          emoji: "👀", 
          isCorrect: false
        },
        { 
          text: "Help them talk and resolve it", 
          emoji: "✌️", 
          isCorrect: true
        },
        { 
          text: "Choose a side", 
          emoji: "👈", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Wonderful! Helping resolve conflicts peacefully brings harmony!",
        wrong: "Helping friends talk and resolve conflicts peacefully is the right thing to do."
      }
    },
    {
      id: 4,
      title: "Using Kind Words",
      question: "Someone is upset or angry. What should you do?",
      options: [
        { 
          text: "Shout back", 
          emoji: "📢", 
          isCorrect: false
        },
        { 
          text: "Make fun of them", 
          emoji: "😆", 
          isCorrect: false
        },
        { 
          text: "Use kind words to calm them", 
          emoji: "🙏", 
          isCorrect: true
        },
        { 
          text: "Ignore them", 
          emoji: "😶", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great! Kind words can calm situations and bring peace!",
        wrong: "Using kind and calm words when others are upset helps bring peace."
      }
    },
    {
      id: 5,
      title: "Including Everyone",
      question: "Someone is being left out of a game. What should you do?",
      options: [
        { 
          text: "Include them in the game", 
          emoji: "🏃‍♂️", 
          isCorrect: true
        },
        { 
          text: "Leave them out", 
          emoji: "👋", 
          isCorrect: false
        },
        { 
          text: "Laugh at them", 
          emoji: "😂", 
          isCorrect: false
        },
        { 
          text: "Pretend not to see", 
          emoji: "🙈", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Including everyone brings peace and makes everyone feel valued!",
        wrong: "Including everyone in games and activities brings peace and happiness to all."
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
      title="Badge: Peace Kid"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/moral-values/kids/candy-dilemma-story"
      nextGameIdProp="moral-kids-91"
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
                    className={`bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3 ${
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
                <h3 className="text-3xl font-bold text-white mb-4">Peace Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You made {score} peaceful choices out of {challenges.length} challenges!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Peace Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Peaceful Choices</h4>
                    <p className="text-white/90 text-sm">
                      You chose to forgive, share peacefully, resolve conflicts, 
                      use kind words, and include everyone.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Spreading Peace</h4>
                    <p className="text-white/90 text-sm">
                      Your peaceful choices help create harmony and happiness around you!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {score} peaceful choices out of {challenges.length} challenges.
                </p>
                <p className="text-white/90 mb-6">
                  Remember, peace means forgiving others, sharing without fighting, resolving conflicts, 
                  using kind words, and including everyone.
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

export default BadgePeaceKid;

