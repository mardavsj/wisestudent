import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TrainTheRobot = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const gameId = "ai-kids-16";
  const gameData = getGameDataById(gameId);
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 1;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentItem, setCurrentItem] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [choices, setChoices] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Reduced to 5 items to comply with the 5-question rule
  const items = [
    {
      id: 1,
      emoji: "🍎",
      name: "Apple",
      choices: [
        { id: 1, text: "Food", isCorrect: true },
        { id: 2, text: "Toy", isCorrect: false },
        { id: 3, text: "Vehicle", isCorrect: false }
      ]
    },
    {
      id: 2,
      emoji: "⚽",
      name: "Ball",
      choices: [
        { id: 1, text: "Food", isCorrect: false },
        { id: 2, text: "Toy", isCorrect: true },
        { id: 3, text: "Clothing", isCorrect: false }
      ]
    },
    {
      id: 3,
      emoji: "🍌",
      name: "Banana",
      choices: [
        { id: 1, text: "Toy", isCorrect: false },
        { id: 2, text: "Vehicle", isCorrect: false },
        { id: 3, text: "Food", isCorrect: true }
      ]
    },
    {
      id: 4,
      emoji: "🚗",
      name: "Car",
      choices: [
        { id: 1, text: "Vehicle", isCorrect: true },
        { id: 2, text: "Food", isCorrect: false },
        { id: 3, text: "Toy", isCorrect: false }
      ]
    },
    {
      id: 5,
      emoji: "🍕",
      name: "Pizza",
      choices: [
        { id: 1, text: "Toy", isCorrect: false },
        { id: 2, text: "Food", isCorrect: true },
        { id: 3, text: "Vehicle", isCorrect: false }
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
    navigate("/games/ai-for-all/kids"); // Updated to standard navigation path
  };

  return (
    <GameShell
      title="Train the Robot"
      score={score}
      subtitle={showResult ? "Game Complete!" : `Item ${currentItem + 1} of ${items.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/kids/prediction-puzzle"
      nextGameIdProp="ai-kids-17"
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
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-5xl mb-4 text-center">🤖</div>
            <h3 className="text-white text-xl font-bold mb-6 text-center">Teach the robot what food is!</h3>
            
            <div className="bg-gradient-to-br from-orange-500/30 to-yellow-500/30 rounded-2xl p-12 mb-6 border border-white/20">
              <div className="text-9xl mb-3 text-center">{currentItemData.emoji}</div>
              <p className="text-white text-2xl font-bold text-center">{currentItemData.name}</p>
            </div>

            <h3 className="text-white font-bold mb-4 text-center">What category does this belong to?</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentItemData.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
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
                <h3 className="text-2xl font-bold text-white mb-4">AI Trainer!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You taught the robot {finalScore} out of {items.length} correctly! ({Math.round((finalScore / items.length) * 100)}%)
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  💡 You just trained AI! This is how AI learns - from examples we give it!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Training!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You taught the robot {finalScore} out of {items.length} correctly. ({Math.round((finalScore / items.length) * 100)}%)
                  Keep practicing to learn more about machine learning!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  💡 You just trained AI! This is how AI learns - from examples we give it!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TrainTheRobot;