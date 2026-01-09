import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BedtimeStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-61");
  const gameId = gameData?.id || "brain-kids-61";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for BedtimeStory, using fallback ID");
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
    text: "After a long day, Neel feels tired but his mind keeps jumping from one thought to another. What helps his body slow down naturally?",
    options: [
      {
        id: "winddown",
        text: "Follow a quiet wind-down routine before sleeping",
        emoji: "🌙",
        isCorrect: true
      },
      {
        id: "lateplay",
        text: "Start a new exciting game to feel sleepy",
        emoji: "🎮",
        isCorrect: false
      },
      {
        id: "overthink",
        text: "Lie in bed and think about tomorrow",
        emoji: "💭",
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    text: "Meera goes to bed at different times each night. Some mornings feel easy, others feel heavy. What could help her mornings feel steadier?",
    options: [
      
      {
        id: "catchup",
        text: "Sleeping very late and waking suddenly",
        emoji: "⚡",
        isCorrect: false
      },
      {
        id: "schedule",
        text: "Keeping a regular sleep and wake time",
        emoji: "⏰",
        isCorrect: true
      },
      {
        id: "random",
        text: "Sleeping whenever she feels bored",
        emoji: "🔀",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "Just before bed, Aarav watches bright videos and then struggles to fall asleep. What supports his brain’s night mode?",
    options: [
      {
        id: "dim",
        text: "Choose calmer activities with softer lights",
        emoji: "🕯️",
        isCorrect: true
      },
      {
        id: "scroll",
        text: "Keep scrolling until sleep comes",
        emoji: "📱",
        isCorrect: false
      },
      {
        id: "snack",
        text: "Eat sugary snacks to feel relaxed",
        emoji: "🍬",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "Before sleeping, Riya reads a few pages of her favorite book. Her eyes feel heavy soon after. What is happening?",
    options: [
      
      {
        id: "bored",
        text: "She is forcing herself to feel bored",
        emoji: "😑",
        isCorrect: false
      },
      {
        id: "avoid",
        text: "She is avoiding sleep without knowing",
        emoji: "🚫",
        isCorrect: false
      },
      {
        id: "signal",
        text: "Her body is getting a clear signal to rest",
        emoji: "📖",
        isCorrect: true
      },
    ]
  },
  {
    id: 5,
    text: "Kunal stops using screens some time before bed and wakes up feeling calm. What supports this change?",
    options: [
      
      {
        id: "luck",
        text: "Feeling lucky that night",
        emoji: "🍀",
        isCorrect: false
      },
      {
        id: "brainrest",
        text: "Giving the brain time to relax before sleep",
        emoji: "🧠",
        isCorrect: true
      },
      {
        id: "tired",
        text: "Being extra tired from the day",
        emoji: "🥱",
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
      title="Bedtime Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/brain/kids/quiz-sleep"
      nextGameIdProp="brain-kids-62"
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

export default BedtimeStory;

