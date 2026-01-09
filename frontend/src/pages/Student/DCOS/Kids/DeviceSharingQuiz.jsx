import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DeviceSharingQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-kids-8");
  const gameId = gameData?.id || "dcos-kids-8";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for DeviceSharingQuiz, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
  {
    id: 1,
    text: "Your cousin wants to use your tablet to watch videos while you are away. The tablet has your photos and apps open. What is the safest choice?",
    options: [
      {
        id: "a",
        text: "Hand it over without checking settings",
        emoji: "📱",
        isCorrect: false
      },
      {
        id: "b",
        text: "Switch to a limited profile before sharing",
        emoji: "🧭",
        isCorrect: true
      },
      {
        id: "c",
        text: "Let them use it only for a short time",
        emoji: "⏳",
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    text: "At school, a friend asks to borrow your device to finish an activity. There is no teacher nearby. What should you do?",
    options: [
      {
        id: "b",
        text: "Wait and ask an adult for permission",
        emoji: "📘",
        isCorrect: true
      },
      {
        id: "a",
        text: "Say yes so the friend is not upset",
        emoji: "🎈",
        isCorrect: false
      },
      
      {
        id: "c",
        text: "Share it but keep watching closely",
        emoji: "👀",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "You lend your device to someone, and they start opening apps you did not agree to. What follows good device-sharing rules?",
    options: [
      
      {
        id: "b",
        text: "Let them explore freely",
        emoji: "🌀",
        isCorrect: false
      },
      {
        id: "c",
        text: "Ignore it to avoid a problem",
        emoji: "🌫️",
        isCorrect: false
      },
      {
        id: "a",
        text: "Take the device back calmly",
        emoji: "🧩",
        isCorrect: true
      },
    ]
  },
  {
    id: 4,
    text: "Your sibling asks to use your device, but your screen time is almost over. What is the responsible action?",
    options: [
      {
        id: "a",
        text: "Hand it over even if rules break",
        emoji: "🎭",
        isCorrect: false
      },
      {
        id: "b",
        text: "Explain and wait until rules allow",
        emoji: "📏",
        isCorrect: true
      },
      {
        id: "c",
        text: "Extend time secretly",
        emoji: "🕳️",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "You shared your device earlier and later notice settings have changed. What should you do next?",
    options: [
      {
        id: "a",
        text: "Change settings back and inform an adult",
        emoji: "🔧",
        isCorrect: true
      },
      {
        id: "b",
        text: "Leave it as it is",
        emoji: "📂",
        isCorrect: false
      },
      {
        id: "c",
        text: "Stop sharing forever without telling anyone",
        emoji: "🚪",
        isCorrect: false
      }
    ]
  }
];


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

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Device Sharing"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/dcos/kids/online-friend-reflex"
      nextGameIdProp="dcos-kids-9"
      gameType="dcos"
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

export default DeviceSharingQuiz;

