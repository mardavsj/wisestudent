import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ChallengeStereotypes = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-29");
  const gameId = gameData?.id || "uvls-kids-29";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ChallengeStereotypes, using fallback ID");
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
    text: "Which sentence shows that abilities are not decided by gender?",
    emoji: "🛡️",
    options: [
      
      {
        id: "s1",
        text: "Only boys enjoy building things.",
        emoji: "🚫",
        isCorrect: false
      },
      {
        id: "s2",
        text: "Girls should not use tools.",
        emoji: "❌",
        isCorrect: false
      },
      {
        id: "c1",
        text: "Anyone can learn to fix machines.",
        emoji: "🛠️",
        isCorrect: true
      },
    ]
  },
  {
    id: 2,
    text: "Which statement supports fairness and equal chances?",
    emoji: "🛡️",
    options: [
      {
        id: "s3",
        text: "Leaders must always be loud.",
        emoji: "📢",
        isCorrect: false
      },
      {
        id: "c2",
        text: "Good leaders listen and care.",
        emoji: "👂",
        isCorrect: true
      },
      {
        id: "s4",
        text: "Quiet kids cannot lead.",
        emoji: "🚫",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "Which sentence challenges ideas about emotions?",
    emoji: "🛡️",
    options: [
      {
        id: "c3",
        text: "Everyone feels sad or happy sometimes.",
        emoji: "❤️",
        isCorrect: true
      },
      {
        id: "s5",
        text: "Crying is only for girls.",
        emoji: "🚫",
        isCorrect: false
      },
      {
        id: "s6",
        text: "Boys should hide feelings.",
        emoji: "🙈",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "Which sentence breaks stereotypes about learning?",
    emoji: "🛡️",
    options: [
      {
        id: "s7",
        text: "Math is only for smart kids.",
        emoji: "❌",
        isCorrect: false
      },
      {
        id: "c4",
        text: "Practice helps everyone improve.",
        emoji: "📈",
        isCorrect: true
      },
      {
        id: "s8",
        text: "Some kids can never learn math.",
        emoji: "🚫",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "Which statement supports freedom of choice?",
    emoji: "🛡️",
    options: [
      {
        id: "s9",
        text: "Sports are only for boys.",
        emoji: "🚫",
        isCorrect: false
      },
      {
        id: "s10",
        text: "Art is only for girls.",
        emoji: "🎨",
        isCorrect: false
      },
      {
        id: "c5",
        text: "Kids choose activities they enjoy.",
        emoji: "🌟",
        isCorrect: true
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
      title="Challenge Stereotypes"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/uvls/kids/equality-ally-badge"
      nextGameIdProp="uvls-kids-30"
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

export default ChallengeStereotypes;

