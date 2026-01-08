import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BankVisitStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-41";
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
      text: "Parents take you to bank. What do you do?",
      options: [
        { 
          id: "watch", 
          text: "Watch and learn quietly", 
          emoji: "👀", 
          
          isCorrect: true
        },
        { 
          id: "play", 
          text: "Run around and play", 
          emoji: "🏃", 
          isCorrect: false
        },
        { 
          id: "touch", 
          text: "Touch everything", 
          emoji: "👆", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Bank staff greets you. How to respond?",
      options: [
        { 
          id: "ignore", 
          text: "Ignore them completely", 
          emoji: "😐", 
          isCorrect: false
        },
        {
          id: "polite",
          text: "Be polite and respectful",
          emoji: "🙏",
          isCorrect: true
        },
        { 
          id: "rude", 
          text: "Be rude to them", 
          emoji: "😠", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Parent uses ATM. What should you do?",
      options: [
        { 
          id: "privacy", 
          text: "Stand back and give privacy", 
          emoji: "🔒", 
          isCorrect: true
        },
        { 
          id: "watch", 
          text: "Watch the PIN closely", 
          emoji: "👁️", 
          isCorrect: false
        },
        { 
          id: "buttons", 
          text: "Press random buttons", 
          emoji: "🔘", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Security guard checks bags. Your reaction?",
      options: [
        { 
          id: "angry", 
          text: "Get angry at guard", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          id: "refuse", 
          text: "Refuse the check", 
          emoji: "❌", 
          isCorrect: false
        },
        {
          id: "understand",
          text: "Understand it's for safety",
          emoji: "🛡️",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "Long queue at bank. What's best?",
      options: [
        { 
          id: "push", 
          text: "Push to go first", 
          emoji: "👊", 
          isCorrect: false
        },
        {
          id: "wait",
          text: "Wait patiently in line",
          emoji: "⏳",
          isCorrect: true
        },
        { 
          id: "complain", 
          text: "Complain loudly", 
          emoji: "😤", 
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
      title="Bank Visit Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="finance-kids-41"
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}
      nextGamePathProp="/student/finance/kids/quiz-banks"
      nextGameIdProp="finance-kids-42">
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
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
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

export default BankVisitStory;
