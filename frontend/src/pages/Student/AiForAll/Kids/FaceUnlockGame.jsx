import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FaceUnlockGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentFace, setCurrentFace] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [choices, setChoices] = useState([]);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Array of faces: exactly 5 as per project specification
  const faces = [
    {
      id: 1,
      emoji: "😊",
      question: "Can the phone recognize this clear, front-facing smile?",
      choices: [
        { id: 2, text: "No, face is too dark", isCorrect: false },
        { id: 3, text: "No, face is turned away", isCorrect: false },
        { id: 1, text: "Yes, face is clear and visible", isCorrect: true },
      ]
    },
    {
      id: 2,
      emoji: "😎",
      question: "Can the phone recognize this face with sunglasses?",
      choices: [
        { id: 1, text: "Yes, sunglasses don't affect recognition", isCorrect: false },
        { id: 2, text: "No, sunglasses block key features", isCorrect: true },
        { id: 3, text: "Yes, sunglasses make it easier", isCorrect: false }
      ]
    },
    {
      id: 3,
      emoji: "😇",
      question: "Can the phone recognize this face that is well-lit and centered?",
      choices: [
        { id: 1, text: "No, face is too bright", isCorrect: false },
        { id: 2, text: "No, face is not visible", isCorrect: false },
        { id: 3, text: "Yes, face is perfect for recognition", isCorrect: true }
      ]
    },
    {
      id: 4,
      emoji: "😡",
      question: "Can the phone recognize this face showing strong emotions?",
      choices: [
        { id: 2, text: "No, strong expressions change face shape", isCorrect: true },
        { id: 1, text: "Yes, emotions help recognition", isCorrect: false },
        { id: 3, text: "Yes, anger makes face clearer", isCorrect: false }
      ]
    },
    {
      id: 5,
      emoji: "🙂",
      question: "Can the phone recognize this partially turned face?",
      choices: [
        { id: 1, text: "Yes, phone can see all features", isCorrect: false },
        { id: 2, text: "Yes, side face is best", isCorrect: false },
        { id: 3, text: "No, phone needs front view", isCorrect: true }
      ]
    }
  ];

  const currentFaceData = faces[currentFace];

  const handleChoice = (choiceId) => {
    const choice = currentFaceData.choices.find((c) => c.id === choiceId);
    const isCorrect = choice.isCorrect;
    
    const newChoices = [...choices, { 
      questionId: currentFaceData.id, 
      choice: choiceId,
      isCorrect: isCorrect
    }];
    
    setChoices(newChoices);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentFace < faces.length - 1) {
      setTimeout(() => {
        setCurrentFace(prev => prev + 1);
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
    setCurrentFace(0);
    setScore(0);
    setCoins(0);
    setChoices([]);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/ai-or-human-quiz"); // update next route as needed
  };

  return (
    <GameShell
      title="Face Unlock Game"
      score={score}
      subtitle={showResult ? "Game Complete!" : `Face ${currentFace + 1} of ${faces.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      maxScore={faces.length}
      gameId="ai-kids-32"
      gameType="ai"
      totalLevels={faces.length}
      currentLevel={currentFace + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="text-9xl mb-6 text-center animate-pulse">{currentFaceData.emoji}</div>
            <h3 className="text-white text-xl font-bold mb-6 text-center">{currentFaceData.question}</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentFaceData.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice.id)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
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
                <h3 className="text-2xl font-bold text-white mb-4">Phone Unlocked!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You recognized {finalScore} out of {faces.length} faces correctly! ({Math.round((finalScore / faces.length) * 100)}%)
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  💡 Facial recognition AI helps devices unlock securely. Good job noticing the right faces!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You recognized {finalScore} out of {faces.length} faces correctly. ({Math.round((finalScore / faces.length) * 100)}%)
                  Keep practicing to learn more about facial recognition!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  💡 Facial recognition AI helps devices unlock securely. Good job noticing the right faces!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FaceUnlockGame;