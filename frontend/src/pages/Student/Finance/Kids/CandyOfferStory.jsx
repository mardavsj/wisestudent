import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CandyOfferStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-18";
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
    text: "You see a big candy discount at a shop, but you already feel full. What is the best choice?",
    options: [
      
      {
        id: "b",
        text: "Buy candy because it is cheap",
        emoji: "🍬",
        isCorrect: false
      },
      {
        id: "a",
        text: "Think about your health and skip buying candy",
        emoji: "🧠",
        isCorrect: true
      },
      {
        id: "c",
        text: "Buy candy just because others are buying it",
        emoji: "👥",
        isCorrect: false
      }
    ]
  },

  {
    id: 2,
    text: "A store offers extra candy if you buy more. What should you check before deciding?",
    options: [
      {
        id: "a",
        text: "Whether you really need it or not",
        emoji: "🤔",
        isCorrect: true
      },
      {
        id: "b",
        text: "How colorful the packet looks",
        emoji: "🎨",
        isCorrect: false
      },
      {
        id: "c",
        text: "How many ads promote it",
        emoji: "📢",
        isCorrect: false
      }
    ]
  },

  {
    id: 3,
    text: "You want candy, but you also want to save money for a school trip. What is a smart decision?",
    options: [
      
      {
        id: "b",
        text: "Spend money now and worry later",
        emoji: "💸",
        isCorrect: false
      },
      {
        id: "c",
        text: "Ask someone else to pay for candy",
        emoji: "🙋",
        isCorrect: false
      },
      {
        id: "a",
        text: "Save money for something important",
        emoji: "🎒",
        isCorrect: true
      },
    ]
  },

  {
    id: 4,
    text: "You notice a candy offer near the checkout counter. Why do shops place it there?",
    options: [
      
      {
        id: "b",
        text: "To help customers save money",
        emoji: "💰",
        isCorrect: false
      },
      {
        id: "a",
        text: "To encourage quick and unplanned buying",
        emoji: "⚡",
        isCorrect: true
      },
      {
        id: "c",
        text: "To replace healthy food options",
        emoji: "🥦",
        isCorrect: false
      }
    ]
  },

  {
    id: 5,
    text: "You decide not to buy candy during an offer. What skill are you practicing?",
    options: [
      {
        id: "a",
        text: "Self-control and smart decision-making",
        emoji: "🎯",
        isCorrect: true
      },
      {
        id: "b",
        text: "Missing out on fun",
        emoji: "😞",
        isCorrect: false
      },
      {
        id: "c",
        text: "Ignoring all treats forever",
        emoji: "🚫",
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
      title="Candy Offer Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="finance-kids-18"
      nextGamePathProp="/student/finance/kids/reflex-needs-first"
      nextGameIdProp="finance-kids-19"
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
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
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

export default CandyOfferStory;