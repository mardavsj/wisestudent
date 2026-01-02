import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateStage3 = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-93";
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
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Is tech only for entertainment or also for growth?",
      options: [
        { 
          id: "only-entertainment", 
          text: "Only for entertainment", 
          emoji: "📺", 
          
          isCorrect: false
        },
       
        { 
          id: "only-growth", 
          text: "Only for growth and learning", 
          emoji: "📚", 
          
          isCorrect: false
        },
         { 
          id: "growth-too", 
          text: "Growth too - balance both", 
          emoji: "💹", 
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "Should we use technology only for fun?",
      options: [
        { 
          id: "yes-fun", 
          text: "Yes - only for fun", 
          emoji: "🎮", 
          isCorrect: false
        },
        { 
          id: "no-balance", 
          text: "No - balance fun and learning", 
          emoji: "⛔", 
          isCorrect: true
        },
        { 
          id: "maybe", 
          text: "Maybe - depends on the device", 
          emoji: "🤔", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Can technology help you grow and learn?",
      options: [
         { 
          id: "yes-learning", 
          text: "Yes - tech enables learning and growth", 
          emoji: "🚀", 
          isCorrect: true
        },
        { 
          id: "no-only-fun", 
          text: "No - tech is only for fun", 
          emoji: "🎮", 
          isCorrect: false
        },
       
        { 
          id: "maybe", 
          text: "Maybe - only educational apps", 
          emoji: "📱", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What's the best way to use technology?",
      options: [
        { 
          id: "only-entertain", 
          text: "Only for entertainment", 
          emoji: "📺", 
          isCorrect: false
        },
        { 
          id: "balance-both", 
          text: "Balance entertainment and productivity", 
          emoji: "⚖️", 
          isCorrect: true
        },
        { 
          id: "only-work", 
          text: "Only for work and learning", 
          emoji: "💼", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Should teens use tech for both fun and learning?",
      options: [
        { 
          id: "no-only-fun", 
          text: "No - only for fun", 
          emoji: "🎮", 
          isCorrect: false
        },
        
        { 
          id: "maybe", 
          text: "Maybe - only on weekends", 
          emoji: "📅", 
          isCorrect: false
        },
        { 
          id: "yes-both", 
          text: "Yes - use for both fun and growth", 
          emoji: "🙂", 
          isCorrect: true
        },
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: selectedChoice,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect;
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

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Debate: Tech for Growth"
      score={coins}
      subtitle={showResult ? "Debate Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={5}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore === 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {getCurrentQuestion().text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getCurrentQuestion().options.map(option => (
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

export default DebateStage3;
