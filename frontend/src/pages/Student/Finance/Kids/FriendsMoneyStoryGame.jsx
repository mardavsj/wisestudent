import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FriendsMoneyStoryGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-95";
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
    text: "Your friend is saving money for a toy. They ask for advice. What do you suggest?",
    options: [
      
      {
        id: "spend",
        text: "Spend all your money together",
        emoji: "💸",
        isCorrect: false
      },
      {
        id: "ignore",
        text: "Ignore their request",
        emoji: "🙈",
        isCorrect: false
      },
      {
        id: "save",
        text: "Help them plan their savings",
        emoji: "📋",
        isCorrect: true
      },
    ]
  },
  {
    id: 2,
    text: "Your friend wants to buy a snack but has no money. How can you help responsibly?",
    options: [
      {
        id: "share",
        text: "Share small change and teach saving",
        emoji: "🪙",
        isCorrect: true
      },
      {
        id: "lend",
        text: "Give all your money",
        emoji: "💰",
        isCorrect: false
      },
      {
        id: "buy",
        text: "Buy snack for them every day",
        emoji: "🍿",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "You and a friend found coins on the playground. What is fair?",
    options: [
      
      {
        id: "take",
        text: "Keep all for yourself",
        emoji: "🤑",
        isCorrect: false
      },
      {
        id: "split",
        text: "Split the money equally",
        emoji: "⚖️",
        isCorrect: true
      },
      {
        id: "ignore",
        text: "Leave the coins there",
        emoji: "🍂",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "Your friend asks to borrow money for a project. You only have a little. What is wise?",
    options: [
      {
        id: "share_part",
        text: "Lend a small part and explain your limit",
        emoji: "🤲",
        isCorrect: true
      },
      {
        id: "refuse",
        text: "Say no rudely",
        emoji: "😠",
        isCorrect: false
      },
      {
        id: "give_all",
        text: "Give all your money",
        emoji: "💸",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "Why is handling money honestly with friends important?",
    options: [
      
      {
        id: "fun",
        text: "It makes games more fun",
        emoji: "🎲",
        isCorrect: false
      },
      {
        id: "snacks",
        text: "It helps get more snacks",
        emoji: "🍬",
        isCorrect: false
      },
      {
        id: "trust",
        text: "It builds trust and respect",
        emoji: "🤝",
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
    navigate("/student/finance/kids/honesty-poster-game");
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
      title="Friend's Money Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="finance-kids-95"
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}
      nextGamePathProp="/student/finance/kids/honesty-poster-game"
      nextGameIdProp="finance-kids-96">
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <div className="text-4xl mb-4 text-center">🤝</div>
              <p className="text-white text-lg mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options && currentQuestionData.options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
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

export default FriendsMoneyStoryGame;
