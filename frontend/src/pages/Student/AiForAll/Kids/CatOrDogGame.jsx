import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CatOrDogGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentImage, setCurrentImage] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [choices, setChoices] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const images = [
    {
      id: 1,
      emoji: "🐱",
      type: "cat",
      choices: [
        { id: 1, text: "Cat",  isCorrect: true },
        { id: 2, text: "Dog",  isCorrect: false },
        { id: 3, text: "Bird",  isCorrect: false }
      ]
    },
    {
      id: 2,
      emoji: "🐶",
      type: "dog",
      choices: [
        { id: 1, text: "Fish",  isCorrect: false },
        { id: 2, text: "Dog",  isCorrect: true },
        { id: 3, text: "Cat",  isCorrect: false }
      ]
    },
    {
      id: 3,
      emoji: "🦮",
      type: "dog",
      choices: [
        { id: 1, text: "Horse", isCorrect: false },
        { id: 2, text: "Bird",  isCorrect: false },
        { id: 3, text: "Dog",  isCorrect: true }
      ]
    },
    {
      id: 4,
      emoji: "😺",
      type: "cat",
      choices: [
        { id: 1, text: "Rabbit",  isCorrect: false },
        { id: 2, text: "Cat",  isCorrect: true },
        { id: 3, text: "Fish", isCorrect: false }
      ]
    },
    {
      id: 5,
      emoji: "😻",
      type: "cat",
      choices: [
        { id: 1, text: "Dog",  isCorrect: false },
        { id: 2, text: "Bird",  isCorrect: false },
        { id: 3, text: "Cat",  isCorrect: true }
      ]
    }
  ];

  const currentImageData = images[currentImage];

  const handleChoice = (choiceId) => {
    const choice = currentImageData.choices.find((c) => c.id === choiceId);
    const isCorrect = choice.isCorrect;
    
    const newChoices = [...choices, { 
      questionId: currentImageData.id, 
      choice: choiceId,
      isCorrect: isCorrect
    }];
    
    setChoices(newChoices);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentImage < images.length - 1) {
      setTimeout(() => {
        setCurrentImage(prev => prev + 1);
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
    setCurrentImage(0);
    setScore(0);
    setCoins(0);
    setChoices([]);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/sorting-colors");
  };

  return (
    <GameShell
      title="Cat or Dog Game"
      score={score}
      subtitle={showResult ? "Game Complete!" : `Image ${currentImage + 1} of ${images.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/kids/sorting-colors"
      nextGameIdProp="ai-kids-3"
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      gameId="ai-kids-2"
      gameType="ai"
      totalLevels={images.length}
      maxScore={images.length}
      currentLevel={currentImage + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Is this a Cat or Dog?</h3>
            
            <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl p-12 mb-6 flex justify-center items-center">
              <div className="text-9xl animate-bounce">{currentImageData.emoji}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentImageData.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
                >
                  <div className="text-2xl mb-2">{choice.emoji}</div>
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
                <h3 className="text-2xl font-bold text-white mb-4">Classification Expert!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {images.length} correctly! ({Math.round((finalScore / images.length) * 100)}%)
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  💡 You just learned classification - how AI sorts things into groups! This is how AI recognizes cats, dogs, and many other things!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} out of {images.length} correctly. ({Math.round((finalScore / images.length) * 100)}%)
                  Keep practicing to learn more about image classification!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  💡 You just learned classification - how AI sorts things into groups! This is how AI recognizes cats, dogs, and many other things!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CatOrDogGame;



