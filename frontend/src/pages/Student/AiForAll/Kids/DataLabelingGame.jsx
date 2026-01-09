import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DataLabelingGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("ai-kids-56");
  const gameId = gameData?.id || "ai-kids-56";
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [choices, setChoices] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Items to label with educational context
  const items = [
    { 
      id: 1, 
      image: "🍎", 
      choices: [
        { id: 1, text: "Apple", isCorrect: true },
        { id: 2, text: "Cherry", isCorrect: false },
        { id: 3, text: "Tomato", isCorrect: false }
      ],
      explanation: "Red apples are a healthy snack rich in fiber and vitamins."
    },
    { 
      id: 2, 
      image: "🍌", 
      choices: [
        { id: 1, text: "Lemon", isCorrect: false },
        { id: 2, text: "Banana", isCorrect: true },
        { id: 3, text: "Corn", isCorrect: false }
      ],
      explanation: "Bananas are a great source of potassium and natural energy."
    },
    { 
      id: 3, 
      image: "🚗", 
      choices: [
        { id: 1, text: "Boat", isCorrect: false },
        { id: 2, text: "Truck", isCorrect: false },
        { id: 3, text: "Car", isCorrect: true }
      ],
      explanation: "Cars are vehicles that help people travel from place to place."
    },
    { 
      id: 4, 
      image: "🚲", 
      choices: [
        { id: 1, text: "Skateboard", isCorrect: false },
        { id: 2, text: "Bicycle", isCorrect: true },
        { id: 3, text: "Motorcycle", isCorrect: false }
      ],
      explanation: "Bicycles are eco-friendly transportation with two wheels."
    },
    { 
      id: 5, 
      image: "🐱", 
      choices: [
        { id: 1, text: "Dog", isCorrect: false },
        { id: 2, text: "Rabbit", isCorrect: false },
        { id: 3, text: "Cat", isCorrect: true }
      ],
      explanation: "Cats are furry pets that love to purr and play."
    }
  ];

  const currentItemData = items[currentItem];

  const handleChoice = (choiceId) => {
    const choice = currentItemData.choices.find((c) => c.id === choiceId);
    const isCorrect = choice.isCorrect;
    
    const newChoices = [...choices, { 
      questionId: currentItemData.id, 
      choice: choiceId,
      isCorrect: isCorrect
    }];
    
    setChoices(newChoices);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1); // 1 coin per correct answer
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentItem < items.length - 1) {
      setTimeout(() => {
        setCurrentItem(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentItem(0);
    setScore(0);
    setCoins(0);
    setChoices([]);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/ai-gets-smarter");
  };

  return (
    <GameShell
      title="Data Labeling Game"
      score={score}
      subtitle={showResult ? "Game Complete!" : `Item ${currentItem + 1} of ${items.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/kids/ai-gets-smarter"
      nextGameIdProp="ai-kids-57"
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      maxScore={items.length}
      gameId={gameId}
      gameType="ai"
      totalLevels={items.length}
      currentLevel={currentItem + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">
              What is this? Help the AI learn!
            </h3>
            
            <div className="bg-white/10 rounded-lg p-12 mb-6 flex justify-center items-center text-8xl">
              {currentItemData.image}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentItemData.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
                >
                  <h3 className="font-bold text-xl mb-2">{choice.text}</h3>
                </button>
              ))}
            </div>
            
            <div className="mt-6 bg-blue-500/20 rounded-lg p-4">
              <p className="text-white/90 text-sm text-center">
                💡 By labeling items correctly, you're teaching AI to recognize objects in the real world!
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Data Labeling Pro!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You labeled {finalScore} out of {items.length} correctly! ({Math.round((finalScore / items.length) * 100)}%)
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  🌟 Teaching AI requires lots of correctly labeled examples. You're helping robots learn about the world!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You labeled {finalScore} out of {items.length} correctly. ({Math.round((finalScore / items.length) * 100)}%)
                  Keep practicing to learn more about data labeling!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  💡 AI needs thousands of correctly labeled examples to learn properly. Every correct label counts!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DataLabelingGame;