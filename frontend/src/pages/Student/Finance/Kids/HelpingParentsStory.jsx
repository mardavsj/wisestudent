import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HelpingParentsStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-75";
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
      text: "Your parents need ₹50 for groceries. You have ₹20. What do you do?",
      options: [
        { 
          id: "give", 
          text: "Give your ₹20 to help", 
          emoji: "🥕", 
          
          isCorrect: true
        },
        { 
          id: "candy", 
          text: "Keep it for candy", 
          emoji: "🍬", 
          
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Ignore their request", 
          emoji: "😐", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You earn ₹10 helping at home. Should you save it?",
      options: [
        { 
          id: "toys", 
          text: "Spend it on toys", 
          emoji: "🧸", 
          isCorrect: false
        },
        {
          id: "save",
          text: "Yes, add to savings",
          emoji: "💰",
          isCorrect: true
        },
        { 
          id: "give", 
          text: "Give it away", 
          emoji: "🎁", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your parents ask you to buy milk for ₹15. You have ₹20. What's next?",
      options: [
        { 
          id: "change", 
          text: "Buy milk and return change", 
          emoji: "🧀", 
          isCorrect: true
        },
        { 
          id: "candy", 
          text: "Buy candy with change", 
          emoji: "🍭", 
          isCorrect: false
        },
        { 
          id: "keep", 
          text: "Keep all ₹20", 
          emoji: "🤫", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You find ₹10. Parents say to be honest. What do you do?",
      options: [
        { 
          id: "snacks", 
          text: "Spend it on snacks", 
          emoji: "🍟", 
          isCorrect: false
        },
        { 
          id: "hide", 
          text: "Hide it in your pocket", 
          emoji: "🧥", 
          isCorrect: false
        },
        {
          id: "find",
          text: "Try to find the owner",
          emoji: "🕵️",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "Helping parents with money makes you feel…",
      options: [
        { 
          id: "proud", 
          text: "Proud and responsible", 
          emoji: "😊", 
          isCorrect: true
        },
        { 
          id: "sad", 
          text: "Sad for less money", 
          emoji: "😔", 
          isCorrect: false
        },
        { 
          id: "nothing", 
          text: "Nothing special", 
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
      title="Helping Parents Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="finance-kids-75"
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}
      nextGamePathProp="/student/finance/kids/poster-work-to-earn"
      nextGameIdProp="finance-kids-76">
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
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
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

export default HelpingParentsStory;