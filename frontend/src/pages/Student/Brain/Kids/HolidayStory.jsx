import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HolidayStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-68");
  const gameId = gameData?.id || "brain-kids-68";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for HolidayStory, using fallback ID");
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
    text: "On the first night of holidays, Rohan wants to play until very late because there is no school tomorrow. What choice helps him enjoy the next day too?",
    options: [
      
      {
        id: "allnight",
        text: "Play until he feels completely exhausted",
        emoji: "🌌",
        isCorrect: false
      },
      {
        id: "random",
        text: "Decide based on how tired he feels later",
        emoji: "🎲",
        isCorrect: false
      },
      {
        id: "balanced",
        text: "Set a play limit and save energy for tomorrow",
        emoji: "⚖️",
        isCorrect: true
      },
    ]
  },
  {
    id: 2,
    text: "During holidays, Meera shifts her sleep time every night and feels confused in the mornings. What helps her days feel smoother?",
    options: [
     
      {
        id: "catchup",
        text: "Sleep very late and wake suddenly",
        emoji: "⚡",
        isCorrect: false
      },
       {
        id: "anchor",
        text: "Keep a loose but regular sleep rhythm",
        emoji: "⏰",
        isCorrect: true
      },
      {
        id: "ignoreclock",
        text: "Stop caring about time completely",
        emoji: "🕰️",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "Arjun plans gaming, movies, and outings all in one day. By evening, he feels drained. What would help him enjoy activities longer?",
    options: [
      {
        id: "pace",
        text: "Space activities with rest in between",
        emoji: "🌿",
        isCorrect: true
      },
      {
        id: "stack",
        text: "Do everything back-to-back",
        emoji: "📚",
        isCorrect: false
      },
      {
        id: "skiprest",
        text: "Ignore tiredness and continue",
        emoji: "🔥",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "Late-night movies feel exciting, but the next morning feels slow. What explains this change?",
    options: [
      
      {
        id: "boredom",
        text: "Movies suddenly became less fun",
        emoji: "🎬",
        isCorrect: false
      },
      {
        id: "weather",
        text: "The weather affected energy",
        emoji: "🌤️",
        isCorrect: false
      },
      {
        id: "bodyclock",
        text: "The body clock needs consistency to recharge",
        emoji: "🧠",
        isCorrect: true
      },
    ]
  },
  {
    id: 5,
    text: "At night, messages keep coming while Aman is on holiday. He enjoys chatting but feels tired the whole day after. What helps him keep energy?",
    options: [
      
      {
        id: "replyall",
        text: "Reply to every message immediately",
        emoji: "💬",
        isCorrect: false
      },
      {
        id: "boundary",
        text: "Create a clear stop time for chatting",
        emoji: "🚦",
        isCorrect: true
      },
      {
        id: "latewake",
        text: "Stay up and wake later to adjust",
        emoji: "🌙",
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
      title="Holiday Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/brain/kids/reflex-rest-alert"
      nextGameIdProp="brain-kids-69"
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

export default HolidayStory;

