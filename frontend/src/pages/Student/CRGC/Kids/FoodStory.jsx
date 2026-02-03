import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FoodStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 1; // 1 coin per question
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You have extra lunch. You see a hungry child nearby. What should you do?",
      options: [
        
        {
          id: "b",
          text: "Ignore them and eat your lunch",
          emoji: "😒",
          isCorrect: false
        },
        {
          id: "c",
          text: "Tease them for being hungry",
          emoji: "🤭",
          isCorrect: false
        },
        {
          id: "a",
          text: "Share your lunch with them",
          emoji: "🍎",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "How should you offer your food to the hungry child?",
      options: [
        {
          id: "a",
          text: "Give it kindly and respectfully",
          emoji: "🤗",
          isCorrect: true
        },
        {
          id: "b",
          text: "Throw it at them",
          emoji: "🥹",
          isCorrect: false
        },
        {
          id: "c",
          text: "Make them beg for it",
          emoji: "🥺",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What if the child says they're not hungry?",
      options: [
        {
          id: "a",
          text: "Insist they take it",
          emoji: "😤",
          isCorrect: false
        },
        {
          id: "b",
          text: "Respect their decision",
          emoji: "👍",
          isCorrect: true
        },
        {
          id: "c",
          text: "Tell them they're lying",
          emoji: "🤥",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Your friend tells you not to share your food. What should you do?",
      options: [
        {
          id: "a",
          text: "Listen to your friend",
          emoji: "🤐",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Argue loudly with your friend",
          emoji: "🤬",
          isCorrect: false
        },
        {
          id: "b",
          text: "Do what you think is right",
          emoji: "🦸",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "How does sharing your food make you feel?",
      options: [
        {
          id: "a",
          text: "Happy and fulfilled",
          emoji: "😊",
          isCorrect: true
        },
        {
          id: "b",
          text: "Annoyed and burdened",
          emoji: "😩",
          isCorrect: false
        },
        {
          id: "c",
          text: "Guilty about having extra",
          emoji: "😰",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: optionId,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === optionId)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === optionId)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
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
    setCurrentQuestion(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Food Story"
      score={coins}
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      showGameOver={showResult}
      gameId="civic-responsibility-kids-55"
      gameType="civic-responsibility"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/civic-responsibility/kids"
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/civic-responsibility/kids/poster-helping-hands"
      nextGameIdProp="civic-responsibility-kids-56">
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Score: {coins}</span>
              </div>
              
              <h2 className="text-white text-base md:text-lg lg:text-xl mb-4 md:mb-6 text-center">
                {getCurrentQuestion().text}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl md:text-3xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-base md:text-xl mb-2">{option.text}</h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-white text-lg mb-4">Game Complete! Showing results...</p>
            <div className="text-white text-base">Final Score: {finalScore}/{questions.length}</div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FoodStory;
