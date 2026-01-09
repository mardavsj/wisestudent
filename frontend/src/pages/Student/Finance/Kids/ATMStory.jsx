import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ATMStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-48";
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
      text: "Your parent shows you their ATM card. What should you do?",
      options: [
        { 
          id: "ignore", 
          text: "Ignore it", 
          emoji: "😐", 
          
          isCorrect: false
        },
        {
          id: "learn",
          text: "Learn how it works",
          emoji: "💳",
          
          isCorrect: true
        },
        { 
          id: "play", 
          text: "Play with it", 
          emoji: "🎮", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your parent is entering their PIN at the ATM. What should you do?",
      options: [
        { 
          id: "memorize", 
          text: "Try to memorize the PIN", 
          emoji: "🧠", 
          isCorrect: false
        },
        { 
          id: "tell", 
          text: "Tell friends about it", 
          emoji: "💬", 
          isCorrect: false
        },
        {
          id: "away",
          text: "Look away to give privacy",
          emoji: "👀",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "You have 100 rupees. What's the smartest choice?",
      options: [
        { 
          id: "split", 
          text: "Save 50 rupees, spend 50", 
          emoji: "💰", 
          isCorrect: true
        },
        { 
          id: "toys", 
          text: "Spend all on toys", 
          emoji: "🧸", 
          isCorrect: false
        },
        { 
          id: "friends", 
          text: "Give all to friends", 
          emoji: "🎁", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You want to buy a toy that costs 200 rupees but you have 150. What should you do?",
      options: [
        { 
          id: "save", 
          text: "Save more money first", 
          emoji: "💾", 
          isCorrect: true
        },
        { 
          id: "borrow", 
          text: "Borrow from friends", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          id: "demand", 
          text: "Demand it from parents", 
          emoji: "😤", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Your friend lost their lunch money. What should you do?",
      options: [
        { 
          id: "ignore", 
          text: "Ignore them", 
          emoji: "😐", 
          isCorrect: false
        },
        { 
          id: "laugh", 
          text: "Laugh at them", 
          emoji: "😆", 
          isCorrect: false
        },
        {
          id: "share",
          text: "Share your lunch with them",
          emoji: "🍱",
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
      title="ATM Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="finance-kids-48"
      nextGamePathProp="/student/finance/kids/reflex-bank-symbols"
      nextGameIdProp="finance-kids-49"
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
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
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

export default ATMStory;

