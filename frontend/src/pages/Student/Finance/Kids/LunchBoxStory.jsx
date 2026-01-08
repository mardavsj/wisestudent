import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LunchBoxStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-55";
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
      text: "You borrow a friend's lunch. Do you return/share next day?",
      options: [
        { 
          id: "yes", 
          text: "Yes, share or return", 
          emoji: "🍽️", 
          
          isCorrect: true
        },
        { 
          id: "no", 
          text: "No, keep it to myself", 
          emoji: "😐", 
          isCorrect: false
        },
        { 
          id: "forget", 
          text: "Forget about it", 
          emoji: "🙈", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend shares lunch. How do you thank them?",
      options: [
        { 
          id: "nothing", 
          text: "Say nothing", 
          emoji: "😶", 
          isCorrect: false
        },
        {
          id: "share",
          text: "Share something back",
          emoji: "🤝",
          isCorrect: true
        },
        { 
          id: "more", 
          text: "Take more lunch", 
          emoji: "🍴", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You have ₹10 for lunch. Friend needs ₹5. What do you do?",
      options: [
        { 
          id: "share", 
          text: "Share ₹5 with friend", 
          emoji: "💸", 
          isCorrect: true
        },
        { 
          id: "all", 
          text: "Spend all on yourself", 
          emoji: "🍔", 
          isCorrect: false
        },
        { 
          id: "hide", 
          text: "Hide your money", 
          emoji: "💰", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You borrow lunch money. When do you repay?",
      options: [
        { 
          id: "never", 
          text: "Never repay", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          id: "snacks", 
          text: "Spend it on snacks", 
          emoji: "🍟", 
          isCorrect: false
        },
        {
          id: "next",
          text: "Next day as promised",
          emoji: "✅",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "Why is sharing lunch with friends important?",
      options: [
        { 
          id: "trust", 
          text: "Builds trust and kindness", 
          emoji: "😊", 
          isCorrect: true
        },
        { 
          id: "food", 
          text: "Gets you more food", 
          emoji: "🍽️", 
            isCorrect: false
        },
        { 
          id: "popular", 
          text: "Makes you popular", 
          emoji: "👥", 
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
      title="Lunch Box Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="finance-kids-55"
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}
      nextGamePathProp="/student/finance/kids/poster-return-borrow"
      nextGameIdProp="finance-kids-56">
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <div className="text-4xl mb-4 text-center">🍽️</div>
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

export default LunchBoxStory;