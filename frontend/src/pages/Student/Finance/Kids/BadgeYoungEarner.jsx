import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeYoungEarner = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-80";
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
      title: "Chores",
      question: "What's a good way to earn pocket money at home?",
      options: [
        
        { 
          text: "Demand money for nothing", 
          emoji: "😤", 
          isCorrect: false
        },
        { 
          text: "Take from parents' wallet", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          text: "Ask for money without working", 
          emoji: "😢", 
          isCorrect: false
        },
        { 
          text: "Do chores like cleaning room", 
          emoji: "🧹", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Excellent! Doing chores teaches responsibility and earns money fairly!",
        wrong: "Earning money through work like chores is the right way - not demanding or taking!"
      }
    },
    {
      id: 2,
      title: "Selling",
      question: "You have toys you don't use. What's smart?",
      options: [
        { 
          text: "Sell them to earn money", 
          emoji: "🛒", 
          isCorrect: true
        },
        { 
          text: "Throw them in trash", 
          emoji: "🗑️", 
          isCorrect: false
        },
        { 
          text: "Hoard them forever", 
          emoji: "🔒", 
          isCorrect: false
        },
        { 
          text: "Give them away for free", 
          emoji: "🎁", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Selling unused items is a smart way to earn money and declutter!",
        wrong: "Selling unused toys is better than throwing them away or hoarding them!"
      }
    },
    {
      id: 3,
      title: "Teaching",
      question: "You're good at drawing. How can you earn?",
      options: [
        
        { 
          text: "Keep skills to myself", 
          emoji: "🤫", 
          isCorrect: false
        },
        { 
          text: "Copy others' work", 
          emoji: "📚", 
          isCorrect: false
        },
        { 
          text: "Teach friends for small fee", 
          emoji: "🎨", 
          isCorrect: true
        },
        { 
          text: "Sell my drawings", 
          emoji: "🖼️", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Amazing! Using your skills to teach others is a great way to earn money!",
        wrong: "Sharing your skills by teaching others is a smart way to earn money!"
      }
    },
    {
      id: 4,
      title: "Crafts",
      question: "School fair is coming. What's a good earning idea?",
      options: [
       
        { 
          text: "Do nothing and watch", 
          emoji: "👀", 
          isCorrect: false
        },
         { 
          text: "Make crafts and sell them", 
          emoji: "✂️", 
          isCorrect: true
        },
        { 
          text: "Steal others' ideas", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Buy crafts to resell", 
          emoji: "🛍️", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great! Making and selling crafts at school fairs is a fun way to earn money!",
        wrong: "Creating and selling your own crafts is a creative way to earn money!"
      }
    },
    {
      id: 5,
      title: "Studying",
      question: "Parents offer money for good grades. What do you do?",
      options: [
       
        { 
          text: "Cheat on tests", 
          emoji: "📝", 
          isCorrect: false
        },
        { 
          text: "Make excuses for bad grades", 
          emoji: "🤐", 
          isCorrect: false
        },
         { 
          text: "Study hard and earn fairly", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          text: "Copy from friends", 
          emoji: "👀", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Wonderful! Earning money through honest hard work and good grades is the right way!",
        wrong: "Always earn money honestly through hard work, not by cheating or making excuses!"
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
  const finalScore = score;

  return (
    <GameShell
      title="Badge: Young Earner"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/finance/kids/candy-shop-storyy"
      nextGameIdProp="finance-kids-81"
      gameType="finance"
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === challenges.length}
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
                    className={`bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3 ${
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
            {finalScore >= 4 ? (
              <div>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-4">Young Earner Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You made {finalScore} smart earning decisions out of {challenges.length} challenges!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Young Earner</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Earning Skills</h4>
                    <p className="text-white/90 text-sm">
                      You learned to earn money through chores, selling items, 
                      teaching skills, and honest work!
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Financial Wisdom</h4>
                    <p className="text-white/90 text-sm">
                      These habits will help you build a strong foundation for financial success!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {finalScore} smart earning decisions out of {challenges.length} challenges.
                </p>
                <p className="text-white/90 mb-6">
                  Remember, earning money through honest work, chores, and using your skills 
                  is the best way to build financial success!
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

export default BadgeYoungEarner;

