import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const OnlineShoppingAI = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  const items = [
    {
      id: 1,
      name: "You buy running shoes 👟. What will AI recommend next?",
      options: [
        { 
          id: "socks", 
          text: "Sports socks", 
          emoji: "🧦", 
          isCorrect: true
        },
        { 
          id: "pan", 
          text: "Cooking pan", 
          emoji: "🍳", 
          isCorrect: false
        },
        { 
          id: "charger", 
          text: "Phone charger", 
          emoji: "🔌", 
          isCorrect: false
        }
      ],
      correct: "socks"
    },
    {
      id: 2,
      name: "You search for school bags 🎒. What item is AI likely to show?",
      options: [
        { 
          id: "hose", 
          text: "Garden hose", 
          emoji: "🌿", 
          isCorrect: false
        },
        { 
          id: "pencil", 
          text: "Pencil case", 
          emoji: "✏️", 
          isCorrect: true
        },
        { 
          id: "tires", 
          text: "Car tires", 
          emoji: "🚗", 
          isCorrect: false
        }
      ],
      correct: "pencil"
    },
    {
      id: 3,
      name: "You order a mobile phone 📱. What suggestion makes the most sense?",
      options: [
        { 
          id: "case", 
          text: "Phone case", 
          emoji: "📔", 
          isCorrect: true
        },
        { 
          id: "flower", 
          text: "Flower pot", 
          emoji: "🌸", 
          isCorrect: false
        },
        { 
          id: "book", 
          text: "Book", 
          emoji: "📖", 
          isCorrect: false
        }
      ],
      correct: "case"
    },
    {
      id: 4,
      name: "You add a yoga mat 🧘‍♀️ to your cart. What will AI recommend?",
      options: [
        { 
          id: "laptop", 
          text: "Laptop", 
          emoji: "💻", 
          isCorrect: false
        },
        { 
          id: "oil", 
          text: "Cooking oil", 
          emoji: "🧴", 
          isCorrect: false
        },
        { 
          id: "water", 
          text: "Water bottle", 
          emoji: "💧", 
          isCorrect: true
        }
      ],
      correct: "water"
    },
    {
      id: 5,
      name: "You browse winter jackets 🧥. What’s the best AI suggestion?",
      options: [
        { 
          id: "gloves", 
          text: "Woolen gloves", 
          emoji: "🧤", 
          isCorrect: true
        },
        { 
          id: "slippers", 
          text: "Beach slippers", 
          emoji: "🩴", 
          isCorrect: false
        },
        { 
          id: "sunglasses", 
          text: "Sunglasses", 
          emoji: "🕶️", 
          isCorrect: false
        }
      ],
      correct: "gloves"
    },
  ];

  // Function to get options without rotation - keeping actual positions fixed
  const getRotatedOptions = (options, itemIndex) => {
    // Return options without any rotation to keep their actual positions fixed
    return options;
  };

  const currentItemData = items[currentItem];
  const displayOptions = getRotatedOptions(currentItemData.options, currentItem);

  const handleChoice = (choiceId) => {
    const isCorrect = choiceId === currentItemData.correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentItem < items.length - 1) {
      setTimeout(() => {
        setCurrentItem((prev) => prev + 1);
      }, 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentItem(0);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/airport-scanner-story");
  };

  const accuracy = Math.round((score / items.length) * 100);

  return (
    <GameShell
      title="Online Shopping AI"
      score={score}
      subtitle={`Question ${currentItem + 1} of ${items.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/kids/airport-scanner-story"
      nextGameIdProp="ai-kids-41"
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="ai-kids-40"
      gameType="ai"
      totalLevels={20}
      currentLevel={40}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentItem + 1}/{items.length}</span>
                <span className="text-yellow-400 font-bold">Points: {score}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentItemData.name}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl">{option.text}</h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {accuracy >= 70 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Smart Shopper!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You chose correctly {score} out of {items.length} times! ({accuracy}%)
                  You're learning how AI makes smart shopping suggestions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Points</span>
                </div>
                <p className="text-white/80">
                  💡 E-commerce AIs recommend related products based on your searches and preferences — making your shopping smarter!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You chose correctly {score} out of {items.length} times. ({accuracy}%)
                  Keep practicing to learn more about AI shopping recommendations!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to think about which items logically go together when shopping online.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default OnlineShoppingAI;