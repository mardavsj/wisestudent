import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SpotStereotype = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-23");
  const gameId = gameData?.id || "uvls-kids-23";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SpotStereotype, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
  {
    id: 1,
    text: "Which sentence shows a stereotype?",
    emoji: "🔍",
    options: [
     
      {
        id: "f1",
        text: "Practice helps us learn.",
        emoji: "📘",
        isCorrect: false
      },
       {
        id: "s1",
        text: "Only boys are good at math.",
        emoji: "➗",
        isCorrect: true
      },
      {
        id: "f2",
        text: "Everyone learns at a different speed.",
        emoji: "⏱️",
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    text: "Which sentence is an unfair stereotype?",
    emoji: "🔍",
    options: [
      {
        id: "f3",
        text: "People enjoy different hobbies.",
        emoji: "🎨",
        isCorrect: false
      },
     
      {
        id: "f4",
        text: "Curiosity helps learning.",
        emoji: "💡",
        isCorrect: false
      },
       {
        id: "s2",
        text: "Girls are bad at science.",
        emoji: "🔬",
        isCorrect: true
      },
    ]
  },
  {
    id: 3,
    text: "Which statement puts people into one box?",
    emoji: "🔍",
    options: [
      {
        id: "s3",
        text: "Quiet kids are not good leaders.",
        emoji: "📢",
        isCorrect: true
      },
      {
        id: "f5",
        text: "Leaders listen to others.",
        emoji: "👂",
        isCorrect: false
      },
      {
        id: "f6",
        text: "Teamwork helps everyone.",
        emoji: "🤝",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "Which sentence is a stereotype about jobs?",
    emoji: "🔍",
    options: [
      {
        id: "f7",
        text: "People choose jobs they enjoy.",
        emoji: "😊",
        isCorrect: false
      },
      {
        id: "s4",
        text: "Only men can be engineers.",
        emoji: "🛠️",
        isCorrect: true
      },
      {
        id: "f8",
        text: "Skills grow with practice.",
        emoji: "📈",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "Which sentence is a stereotype about emotions?",
    emoji: "🔍",
    options: [
      
      {
        id: "f9",
        text: "Feelings help us understand ourselves.",
        emoji: "❤️",
        isCorrect: false
      },
      {
        id: "f10",
        text: "Talking helps solve problems.",
        emoji: "💬",
        isCorrect: false
      },
      {
        id: "s5",
        text: "Boys do not cry.",
        emoji: "😢",
        isCorrect: true
      },
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
      title="Spot Stereotype"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/uvls/kids/rights-match"
      nextGameIdProp="uvls-kids-24"
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

export default SpotStereotype;

