import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RainyDayStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-51");
  const gameId = gameData?.id || "brain-kids-51";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for RainyDayStory, using fallback ID");
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
    text: "Dark clouds gather and the picnic plan changes at the last minute. Everyone goes indoors. What helps the day still feel meaningful?",
    options: [
      {
        id: "adapt",
        text: "Adjust plans and create a new kind of fun",
        emoji: "🔄",
        isCorrect: true
      },
      {
        id: "wait",
        text: "Sit and wait for the rain to stop",
        emoji: "⏳",
        isCorrect: false
      },
      {
        id: "regret",
        text: "Keep thinking about what was missed",
        emoji: "💭",
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    text: "Heavy rain slows the journey, and the bus barely moves. What choice supports calm thinking during the delay?",
    options: [
      
      {
        id: "checktime",
        text: "Keep checking the clock again and again",
        emoji: "⏱️",
        isCorrect: false
      },
      {
        id: "frustration",
        text: "Build frustration by thinking of delays",
        emoji: "🌧️",
        isCorrect: false
      },
      {
        id: "notice",
        text: "Notice surroundings and pass time mindfully",
        emoji: "👀",
        isCorrect: true
      },
    ]
  },
  {
    id: 3,
    text: "Rain pours during lunch break, and a student realizes their food is missing. What response helps the body and mood?",
    options: [
      
      {
        id: "worry",
        text: "Spend the break worrying about hunger",
        emoji: "😟",
        isCorrect: false
      },
      {
        id: "solution",
        text: "Look for a safe and helpful solution nearby",
        emoji: "🧩",
        isCorrect: true
      },
      {
        id: "silent",
        text: "Stay silent even if help is possible",
        emoji: "🤐",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "Thunder cuts the power while a family is watching a movie. The room turns quiet. What keeps the moment comfortable?",
    options: [
      {
        id: "connect",
        text: "Turn the pause into shared conversation",
        emoji: "🗣️",
        isCorrect: true
      },
      {
        id: "complaint",
        text: "Focus on the inconvenience",
        emoji: "📢",
        isCorrect: false
      },
      {
        id: "withdraw",
        text: "Separate and wait alone",
        emoji: "🚪",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "After rain, the usual ride is missed and plans shift. What mindset helps the start of the day feel steady?",
    options: [
      
      {
        id: "rush",
        text: "Rush while feeling stressed",
        emoji: "🏃‍♂️",
        isCorrect: false
      },
      {
        id: "accept",
        text: "Accept the change and move at a calm pace",
        emoji: "🌱",
        isCorrect: true
      },
      {
        id: "blame",
        text: "Look for someone to blame",
        emoji: "👉",
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
      title="Rainy Day Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/brain/kids/quiz-on-positivity"
      nextGameIdProp="brain-kids-52"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="brain"
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

export default RainyDayStory;

