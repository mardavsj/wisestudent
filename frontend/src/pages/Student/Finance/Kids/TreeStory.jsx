import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TreeStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-61";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
  {
    id: 1,
    text: "You plant a small tree today. What helps it grow strong over time?",
    options: [
      {
        id: "care",
        text: "Water and take care regularly",
        emoji: "💧",
        isCorrect: true
      },
      {
        id: "rush",
        text: "Pull it to grow faster",
        emoji: "⚡",
        isCorrect: false
      },
      {
        id: "ignore",
        text: "Leave it and forget",
        emoji: "😴",
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    text: "Money is like a tree. What makes it grow slowly and safely?",
    options: [
      
      {
        id: "spend",
        text: "Spending everything quickly",
        emoji: "💸",
        isCorrect: false
      },
      {
        id: "hide",
        text: "Hiding it and never using it",
        emoji: "🙈",
        isCorrect: false
      },
      {
        id: "plan",
        text: "Using it wisely over time",
        emoji: "📊",
        isCorrect: true
      },
    ]
  },
  {
    id: 3,
    text: "You get extra pocket money. What is the smart tree-style choice?",
    options: [
      
      {
        id: "waste",
        text: "Spend it without thinking",
        emoji: "🔥",
        isCorrect: false
      },
      {
        id: "grow",
        text: "Save part so it grows later",
        emoji: "🌱",
        isCorrect: true
      },
      {
        id: "lose",
        text: "Keep it carelessly",
        emoji: "📉",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "A fruit tree gives fruits every year. What does this teach about money?",
    options: [
      
      {
        id: "fast",
        text: "Money should be used only once",
        emoji: "⚡",
        isCorrect: false
      },
      {
        id: "luck",
        text: "Only luck matters",
        emoji: "🍀",
        isCorrect: false
      },
      {
        id: "return",
        text: "Good choices give rewards again and again",
        emoji: "🍎",
        isCorrect: true
      },
    ]
  },
  {
    id: 5,
    text: "If you cut a tree too early, what happens?",
    options: [
      {
        id: "loss",
        text: "You lose future benefits",
        emoji: "📉",
        isCorrect: true
      },
      {
        id: "gain",
        text: "You always gain more",
        emoji: "💰",
        isCorrect: false
      },
      {
        id: "nothing",
        text: "Nothing changes",
        emoji: "😐",
        isCorrect: false
      }
    ]
  }
];

  const handleChoice = (selectedChoice) => {
    if (currentQuestion < 0 || currentQuestion >= questions.length) {
      return;
    }

    const currentQ = questions[currentQuestion];
    if (!currentQ || !currentQ.options) {
      return;
    }

    const newChoices = [...choices, { 
      questionId: currentQ.id, 
      choice: selectedChoice,
      isCorrect: currentQ.options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = currentQ.options.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
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


  const getCurrentQuestion = () => {
    if (currentQuestion >= 0 && currentQuestion < questions.length) {
      return questions[currentQuestion];
    }
    return null;
  };

  const currentQuestionData = getCurrentQuestion();

  return (
    <GameShell
      title="Tree Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={currentQuestion + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      score={coins}
      gameId={gameId}
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options && currentQuestionData.options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                    <p className="text-white/90 text-sm">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default TreeStory;