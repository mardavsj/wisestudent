import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizPreventiveHealth = () => {
  const navigate = useNavigate();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { showCorrectAnswerFeedback, resetFeedback, flashPoints, showAnswerConfetti } = useGameFeedback();

 const questions = [
  {
    id: 1,
    text: "Why is preventive health more cost-effective than curative care over a lifetime?",
    options: [
     
      {
        id: "b",
        text: "Doctors prefer prevention",
        emoji: "👨‍⚕️",
        isCorrect: false
      },
       {
        id: "a",
        text: "It avoids expensive late-stage treatments",
        emoji: "💰",
        isCorrect: true
      },
      {
        id: "c",
        text: "Illness rarely becomes serious",
        emoji: "🤷",
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    text: "Which habit most strongly supports preventive health across ALL body systems?",
    options: [
      {
        id: "a",
        text: "Consistent sleep routine",
        emoji: "🌙",
        isCorrect: true
      },
      {
        id: "b",
        text: "Occasional intense workouts",
        emoji: "🏋️",
        isCorrect: false
      },
      {
        id: "c",
        text: "Vitamin supplements alone",
        emoji: "💊",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "Why are early screenings important even when no symptoms are present?",
    options: [
      {
        id: "a",
        text: "Many conditions develop silently",
        emoji: "🔍",
        isCorrect: true
      },
      {
        id: "b",
        text: "Doctors require routine tests",
        emoji: "📄",
        isCorrect: false
      },
      {
        id: "c",
        text: "Symptoms always appear late",
        emoji: "⏳",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "Which mental habit supports preventive health the MOST?",
    options: [
      {
        id: "a",
        text: "Ignoring stress until exams end",
        emoji: "📚",
        isCorrect: false
      },
      
      {
        id: "c",
        text: "Distracting yourself constantly",
        emoji: "📱",
        isCorrect: false
      },
      {
        id: "b",
        text: "Self-monitoring mood and energy levels",
        emoji: "📊",
        isCorrect: true
      },
    ]
  },
  {
    id: 5,
    text: "Which statement best defines preventive health responsibility?",
    options: [
      {
        id: "a",
        text: "Relying on doctors to fix problems",
        emoji: "🏥",
        isCorrect: false
      },
      {
        id: "b",
        text: "Actively managing habits before illness starts",
        emoji: "🧠",
        isCorrect: true
      },
      {
        id: "c",
        text: "Waiting for visible symptoms",
        emoji: "👀",
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

  const handleNext = () => {
    navigate("/student/health-male/teens/reflex-preventive-health");
  };

  return (
    <GameShell
      title="Quiz on Preventive Health"
      subtitle={gameFinished ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-teen-72"
      gameType="health-male"
      totalLevels={5}
      currentLevel={72}
      showConfetti={gameFinished}
      backPath="/games/health-male/teens"
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {questions[currentQuestion].text}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {questions[currentQuestion].options.map(option => (
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
                    : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
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
          
          {showFeedback && (
            <div className={`rounded-lg p-5 mt-6 ${
              questions[currentQuestion].options.find(opt => opt.id === selectedOption)?.isCorrect
                ? "bg-green-500/20"
                : "bg-red-500/20"
            }`}>
              <p className="text-white whitespace-pre-line">
                {questions[currentQuestion].options.find(opt => opt.id === selectedOption)?.isCorrect
                  ? "Great job! That's exactly right! 🎉"
                  : "Not quite right. Try again next time!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
};

export default QuizPreventiveHealth;
