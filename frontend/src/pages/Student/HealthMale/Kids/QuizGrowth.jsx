import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const QuizGrowth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-22";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [coins, setCoins] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { showCorrectAnswerFeedback, resetFeedback, flashPoints, showAnswerConfetti } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "What helps boys grow stronger?",
      options: [
        {
          id: "a",
          text: "Only junk food",
          emoji: "🍟",
          isCorrect: false
        },
        {
          id: "b",
          text: "Exercise + nutrition",
          emoji: "🏋️",
          isCorrect: true
        },
        {
          id: "c",
          text: "Watching TV",
          emoji: "📺",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How many hours of sleep do growing kids need?",
      options: [
        {
          id: "a",
          text: "8-10 hours",
          emoji: "⏰",
          isCorrect: true
        },
        {
          id: "b",
          text: "4 hours",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "c",
          text: "12 hours",
          emoji: "😪",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What food helps build strong bones?",
      options: [
        {
          id: "a",
          text: "Milk and dairy",
          emoji: "🥛",
          isCorrect: true
        },
        {
          id: "b",
          text: "Candy",
          emoji: "🍬",
          isCorrect: false
        },
        {
          id: "c",
          text: "Chips",
          emoji: "🥔",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What activity helps you grow taller?",
      options: [
        {
          id: "a",
          text: "Playing video games",
          emoji: "🎮",
          isCorrect: false
        },
        {
          id: "b",
          text: "Running and jumping",
          emoji: "🏃",
          isCorrect: true
        },
        {
          id: "c",
          text: "Reading books",
          emoji: "📚",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why is drinking water important for growth?",
      options: [
        {
          id: "a",
          text: "Keeps body working properly",
          emoji: "💧",
          isCorrect: true
        },
        {
          id: "b",
          text: "It makes you taller instantly",
          emoji: "📏",
          isCorrect: false
        },
        {
          id: "c",
          text: "It's not important",
          emoji: "🤷",
          isCorrect: false
        }
      ]
    }
  ];

  const handleAnswer = (optionId) => {
    if (showFeedback || gameFinished) return;
    
    setSelectedOption(optionId);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const selectedOptionData = currentQuestionData.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOptionData?.isCorrect || false;
    
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
        resetFeedback();
      } else {
        setGameFinished(true);
      }
    }, isCorrect ? 1000 : 800);
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/student/health-male/kids");
  };

  return (
    <GameShell
      title="Quiz on Growth"
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/reflex-growth-basics"
      nextGameIdProp="health-male-kids-23"
      gameType="health-male"
      totalLevels={5}
      currentLevel={currentQuestion + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🧠</div>
            <h3 className="text-2xl font-bold text-white mb-2">Growth Quiz</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getCurrentQuestion().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                disabled={showFeedback}
                className={`p-6 rounded-2xl shadow-lg transition-all transform text-left ${
                  showFeedback && option.isCorrect
                    ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                    : showFeedback && selectedOption === option.id && !option.isCorrect
                    ? "bg-red-500/20 border-2 border-red-400 opacity-75"
                    : selectedOption === option.id
                    ? "bg-blue-600 border-2 border-blue-300 scale-105"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                } ${showFeedback ? "cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{option.emoji}</div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameShell>
  );
};

export default QuizGrowth;

