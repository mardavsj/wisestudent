import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CyberSpot = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-39");
  const gameId = gameData?.id || "uvls-kids-39";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for CyberSpot, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
  {
    id: 1,
    text: "Which online message is unsafe and needs attention?",
    emoji: "🌐",
    options: [
      { 
        id: "unsafe1", 
        text: "I will hurt you if you reply.", 
        emoji: "⚠️", 
        isCorrect: true 
      },
      { 
        id: "safe1", 
        text: "Good luck for your test!", 
        emoji: "🍀", 
        isCorrect: false 
      },
      { 
        id: "safe2", 
        text: "That game looks fun.", 
        emoji: "🎮", 
        isCorrect: false 
      }
    ]
  },
  {
    id: 2,
    text: "Which post is not okay to share online?",
    emoji: "📱",
    options: [
      { 
        id: "safe3", 
        text: "My favorite cartoon character.", 
        emoji: "📺", 
        isCorrect: false 
      },
      { 
        id: "unsafe2", 
        text: "Posting someone’s phone number.", 
        emoji: "📞", 
        isCorrect: true 
      },
      { 
        id: "safe4", 
        text: "A picture of my drawing.", 
        emoji: "🎨", 
        isCorrect: false 
      }
    ]
  },
  {
    id: 3,
    text: "Which message shows online bullying?",
    emoji: "💬",
    options: [
      { 
        id: "unsafe3", 
        text: "Everyone should stop being your friend.", 
        emoji: "🚫", 
        isCorrect: true 
      },
      { 
        id: "safe5", 
        text: "Let’s play after school.", 
        emoji: "⚽", 
        isCorrect: false 
      },
      { 
        id: "safe6", 
        text: "Nice teamwork today!", 
        emoji: "👏", 
        isCorrect: false 
      }
    ]
  },
  {
    id: 4,
    text: "Which online action is risky?",
    emoji: "🔐",
    options: [
      { 
        id: "safe7", 
        text: "Logging out after using a device.", 
        emoji: "🚪", 
        isCorrect: false 
      },
      
      { 
        id: "safe8", 
        text: "Using strong passwords.", 
        emoji: "🛡️", 
        isCorrect: false 
      },
      { 
        id: "unsafe4", 
        text: "Sharing passwords with friends.", 
        emoji: "🔑", 
        isCorrect: true 
      },
    ]
  },
  {
    id: 5,
    text: "Which message should be reported online?",
    emoji: "🚨",
    options: [
      { 
        id: "safe9", 
        text: "Thanks for helping me.", 
        emoji: "🙏", 
        isCorrect: false 
      },
      { 
        id: "unsafe5", 
        text: "Send me your address now.", 
        emoji: "📍", 
        isCorrect: true 
      },
      { 
        id: "safe10", 
        text: "See you tomorrow!", 
        emoji: "👋", 
        isCorrect: false 
      }
    ]
  }
];


  const currentQuestionData = questions[currentQuestion];

  const handleChoice = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };



  return (
    <GameShell
      title="Cyber Spot"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/uvls/kids/peer-protector-badge"
      nextGameIdProp="uvls-kids-40"
      gameType="uvls"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{option.text}</h3>
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

export default CyberSpot;

