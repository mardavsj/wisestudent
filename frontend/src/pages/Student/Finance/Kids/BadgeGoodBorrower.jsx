import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeGoodBorrower = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-60";
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
      title: "Book Responsibility",
      question: "Your friend lent you a storybook last week. What should you do?",
      options: [
       
        { 
          text: "Keep it forever", 
          emoji: "🔒", 
          isCorrect: false
        },
        { 
          text: "Give it to someone else", 
          emoji: "🤝", 
          isCorrect: false
        },
         { 
          text: "Return it clean and on time", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          text: "Lend it to another friend", 
          emoji: "👥", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Excellent! Returning borrowed items on time builds trust!",
        wrong: "Always return what you borrow - it shows respect and responsibility!"
      }
    },
    {
      id: 2,
      title: "Pencil Care",
      question: "You borrowed a pencil from your classmate. It broke while using. What now?",
      options: [
        { 
          text: "Replace it with a new pencil", 
          emoji: "✏️", 
          isCorrect: true
        },
        { 
          text: "Return the broken pencil only", 
          emoji: "❌", 
          isCorrect: false
        },
        { 
          text: "Don't return anything", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Blame someone else", 
          emoji: "🙅", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Good borrowers replace damaged items. That's being responsible!",
        wrong: "If you damage something borrowed, always replace it!"
      }
    },
    {
      id: 3,
      title: "Phone Return",
      question: "Your cousin let you use their phone to play games. How should you return it?",
      options: [
        
        { 
          text: "Return with low battery", 
          emoji: "🔋", 
          isCorrect: false
        },
        { 
          text: "Delete all their apps first", 
          emoji: "🗑️", 
          isCorrect: false
        },
        { 
          text: "Add your own apps", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          text: "Clean it and return with thanks", 
          emoji: "✨", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Amazing! Returning items in good condition shows you're trustworthy!",
        wrong: "Always return borrowed items in the same or better condition!"
      }
    },
    {
      id: 4,
      title: "Umbrella Etiquette",
      question: "Your neighbor lent you an umbrella when it was raining. When should you return it?",
      options: [
       
        { 
          text: "Wait until next rain", 
          emoji: "🌧️", 
          isCorrect: false
        },
         { 
          text: "As soon as possible, dried and clean", 
          emoji: "✅", 
          isCorrect: true
        },
        { 
          text: "Keep it for emergencies", 
          emoji: "🔒", 
          isCorrect: false
        },
        { 
          text: "Return it when you remember", 
          emoji: "🧠", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great! Prompt returns show appreciation and build good relationships!",
        wrong: "Don't wait - return borrowed items quickly so others can use them!"
      }
    },
    {
      id: 5,
      title: "Toy Handling",
      question: "Your sibling lent you their favorite toy. How do you handle it?",
      options: [
        { 
          text: "Take extra care and return it safely", 
          emoji: "🧸", 
          isCorrect: true
        },
        { 
          text: "Play rough - it's just a toy", 
          emoji: "💥", 
          isCorrect: false
        },
        { 
          text: "Trade it with friends", 
          emoji: "🤝", 
          isCorrect: false
        },
        { 
          text: "Keep it longer than agreed", 
          emoji: "⏰", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Wonderful! Treating borrowed items with care makes you a trusted borrower!",
        wrong: "Treat borrowed items even better than your own - especially favorites!"
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
      title="Badge: Good Borrower"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/finance/kids/tree-story"
      nextGameIdProp="finance-kids-61"
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
                <h3 className="text-3xl font-bold text-white mb-4">Good Borrower Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You made {finalScore} responsible borrowing decisions out of {challenges.length} challenges!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Good Borrower</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Borrowing Skills</h4>
                    <p className="text-white/90 text-sm">
                      You learned to return items on time, replace damaged items, 
                      and handle borrowed items with care!
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Trust Building</h4>
                    <p className="text-white/90 text-sm">
                      These habits will help you build trust and maintain good relationships!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {finalScore} responsible borrowing decisions out of {challenges.length} challenges.
                </p>
                <p className="text-white/90 mb-6">
                  Remember, being a good borrower means returning items on time, 
                  keeping them in good condition, and treating them with care!
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

export default BadgeGoodBorrower;