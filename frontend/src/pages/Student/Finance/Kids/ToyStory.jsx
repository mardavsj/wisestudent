import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ToyStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-58";
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
      text: "Friend lends toy. What do you do?",
      options: [
        { 
          id: "safe", 
          text: "Keep Safe", 
          emoji: "🛡️", 
          
          isCorrect: true
        },
        { 
          id: "break", 
          text: "Break", 
          emoji: "💔", 
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Ignore It", 
          emoji: "😴", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You borrowed a toy. What now?",
      options: [
        { 
          id: "keep", 
          text: "Keep It", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          id: "lose", 
          text: "Lose It", 
          emoji: "😞", 
          isCorrect: false
        },
        {
          id: "return",
          text: "Return Toy",
          emoji: "🔄",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "You have a friend's toy. What's best?",
      options: [
        { 
          id: "care", 
          text: "Care for It", 
          emoji: "💝", 
          isCorrect: true
        },
        { 
          id: "lose", 
          text: "Lose It", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          id: "break", 
          text: "Break It", 
          emoji: "💔", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Toy's owner asks for it. What do you do?",
      options: [
        { 
          id: "hide", 
          text: "Hide", 
          emoji: "🫥", 
          isCorrect: false
        },
        {
          id: "give",
          text: "Give Back",
          emoji: "🤝",
          isCorrect: true
        },
        { 
          id: "delay", 
          text: "Delay Return", 
          emoji: "⏰", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You borrow a toy. What's your duty?",
      options: [
        { 
          id: "careless", 
          text: "Be Careless", 
          emoji: "😓", 
          isCorrect: false
        },
        { 
          id: "forget", 
          text: "Forget About It", 
          emoji: "🤷", 
          isCorrect: false
        },
        {
          id: "responsible",
          text: "Be Responsible",
          emoji: "🔒",
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


  const getCurrentQuestion = () => {
    if (currentQuestion >= 0 && currentQuestion < questions.length) {
      return questions[currentQuestion];
    }
    return null;
  };

  const currentQuestionData = getCurrentQuestion();

  return (
    <GameShell
      title="Toy Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={currentQuestion + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      score={coins}
      gameId={gameId}
      nextGamePathProp="/student/finance/kids/reflex-borrow-right"
      nextGameIdProp="finance-kids-59"
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

export default ToyStory;