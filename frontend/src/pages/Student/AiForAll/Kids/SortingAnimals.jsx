import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SortingAnimals = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [choices, setChoices] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const items = [
  {
    id: 1,
    name: "Cow",
    emoji: "🐄",
    scenario: "You see this animal eating grass near a barn and giving milk to farmers.",
    category: "Farm",
    choices: [
      { id: 1, text: "Farm", isCorrect: true },
      { id: 2, text: "Pet", isCorrect: false },
      { id: 3, text: "Wild", isCorrect: false }
    ]
  },
  {
    id: 2,
    name: "Dog",
    emoji: "🐕",
    scenario: "This animal lives with families, guards homes, and loves playing with kids.",
    category: "Pet",
    choices: [
      { id: 1, text: "Wild", isCorrect: false },
      { id: 3, text: "Pet", isCorrect: true },
      { id: 2, text: "Farm", isCorrect: false },
    ]
  },
  {
    id: 3,
    name: "Cat",
    emoji: "🐈",
    scenario: "This animal sleeps on sofas, drinks milk, and likes to stay indoors.",
    category: "Pet",
    choices: [
      { id: 1, text: "Pet", isCorrect: true },
      { id: 2, text: "Wild", isCorrect: false },
      { id: 3, text: "Farm", isCorrect: false }
    ]
  },
  {
    id: 4,
    name: "Chicken",
    emoji: "🐓",
    scenario: "You find this animal in a coop on a farm, laying eggs every day.",
    category: "Farm",
    choices: [
      { id: 1, text: "Pet", isCorrect: false },
      { id: 2, text: "Farm", isCorrect: true },
      { id: 3, text: "Wild", isCorrect: false }
    ]
  },
  {
    id: 5,
    name: "Rabbit",
    emoji: "🐇",
    scenario: "This animal is kept at home, loves carrots, and is cared for by people.",
    category: "Pet",
    choices: [
      { id: 1, text: "Farm", isCorrect: false },
      { id: 2, text: "Wild", isCorrect: false },
      { id: 3, text: "Pet", isCorrect: true }
    ]
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
      setCoins(prev => prev + 1);
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
    navigate("/student/ai-for-all/kids/ai-basics-badge"); // Next game path
  };

  const accuracy = Math.round((finalScore / items.length) * 100);
  
  return (
    <GameShell
      title="Sorting Animals"
      score={score}
      subtitle={showResult ? "Game Complete!" : `Item ${currentItem + 1} of ${items.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/kids/ai-basics-badge"
      nextGameIdProp="ai-kids-25"
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId="ai-kids-24"
      gameType="ai"
      totalLevels={items.length}
      maxScore={items.length}
      currentLevel={currentItem + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Click the correct category for this animal!</h3>
            
            <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl p-6 mb-6 flex justify-center items-center">
              <p className="text-white text-lg text-center">{currentItemData.scenario}</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl p-12 mb-6 flex justify-center items-center">
              <div className="text-9xl animate-pulse">{currentItemData.emoji}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentItemData.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
                >
                  <h3 className="font-bold text-xl mb-2">{choice.text}</h3>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Sorting Champion!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {items.length} correctly! ({Math.round((finalScore / items.length) * 100)}%)
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  💡 You learned data grouping! AI groups similar things together, just like you did!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {items.length} correctly. ({Math.round((finalScore / items.length) * 100)}%)
                  Keep practicing to learn more about data grouping!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  💡 You learned data grouping! AI groups similar things together, just like you did!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SortingAnimals;