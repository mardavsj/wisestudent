import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GiftMoneyStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-38";
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
    text: "You receive gift money on your birthday. What is a smart first step?",
    options: [
      
      {
        id: "spend",
        text: "Spend it immediately",
        emoji: "💸",
        isCorrect: false
      },
      {
        id: "show",
        text: "Show it to friends",
        emoji: "👀",
        isCorrect: false
      },
      {
        id: "think",
        text: "Think about needs and goals",
        emoji: "🤔",
        isCorrect: true
      },
    ]
  },
  {
    id: 2,
    text: "You want a backpack that costs more than your gift money. What is a wise choice?",
    options: [
      
      {
        id: "borrow",
        text: "Borrow money from friends",
        emoji: "💳",
        isCorrect: false
      },
      {
        id: "wait",
        text: "Wait and save more money",
        emoji: "⏳",
        isCorrect: true
      },
      {
        id: "change",
        text: "Buy something random instead",
        emoji: "🎲",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "You see a small toy and a useful item. What helps you decide?",
    options: [
      {
        id: "use",
        text: "Choose the item you need more",
        emoji: "⭐",
        isCorrect: true
      },
      {
        id: "fun",
        text: "Choose what looks fun",
        emoji: "🎉",
        isCorrect: false
      },
      {
        id: "cheap",
        text: "Choose the cheapest thing",
        emoji: "💲",
        isCorrect: false
      },
      
    ]
  },
  {
    id: 4,
    text: "Your parents suggest saving part of your gift money. What do you do?",
    options: [
      
      {
        id: "refuse",
        text: "Refuse and spend all",
        emoji: "🙅",
        isCorrect: false
      },
      {
        id: "agree",
        text: "Save a part and plan the rest",
        emoji: "📊",
        isCorrect: true
      },
      {
        id: "forget",
        text: "Forget about the money",
        emoji: "😴",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "What does gift money teach you?",
    options: [
      
      {
        id: "showoff",
        text: "How to show off purchases",
        emoji: "😎",
        isCorrect: false
      },
      {
        id: "spend",
        text: "How to spend without thinking",
        emoji: "🔥",
        isCorrect: false
      },
      {
        id: "manage",
        text: "How to manage money responsibly",
        emoji: "🎯",
        isCorrect: true
      },
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

  const handleNext = () => {
    navigate("/games/financial-literacy/kids");
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
      title="Gift Money Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="finance-kids-38"
      nextGamePathProp="/student/finance/kids/reflex-smart-pick"
      nextGameIdProp="finance-kids-39"
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
              
              <div className="text-4xl mb-4 text-center">🎁</div>
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

export default GiftMoneyStory;