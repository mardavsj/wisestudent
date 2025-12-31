import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizHygiene = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-42";

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
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
        text: "Why is over-washing your skin with harsh soap harmful?",
        options: [
            
            {
                id: "b",
                text: "It makes skin waterproof",
                emoji: "🚫",
                isCorrect: false
            },
            {
                id: "c",
                text: "It stops sweat glands permanently",
                emoji: "❌",
                isCorrect: false
            },
            {
                id: "a",
                text: "It removes protective skin bacteria and oils",
                emoji: "🧬",
                isCorrect: true
            },
        ]
    },
    {
        id: 2,
        text: "Why should towels be dried completely after use?",
        options: [
           
            {
                id: "b",
                text: "Wet towels smell nicer",
                emoji: "🌸",
                isCorrect: false
            },
             {
                id: "a",
                text: "Moist towels grow bacteria and fungi",
                emoji: "🦠",
                isCorrect: true
            },
            {
                id: "c",
                text: "Dry towels absorb less water",
                emoji: "🧻",
                isCorrect: false
            }
        ]
    },
    {
        id: 3,
        text: "Why is showering immediately after intense sweating recommended?",
        options: [
            {
                id: "a",
                text: "Sweat feeds odor-causing bacteria if left on skin",
                emoji: "🧫",
                isCorrect: true
            },
            {
                id: "b",
                text: "Sweat damages muscles",
                emoji: "💪",
                isCorrect: false
            },
            {
                id: "c",
                text: "Water blocks sweat glands",
                emoji: "🚿",
                isCorrect: false
            }
        ]
    },
    {
        id: 4,
        text: "Why is sharing personal hygiene items risky?",
        options: [
            
            {
                id: "b",
                text: "They stop working after sharing",
                emoji: "🔧",
                isCorrect: false
            },
            {
                id: "c",
                text: "They lose their smell",
                emoji: "👃",
                isCorrect: false
            },
            {
                id: "a",
                text: "They can transfer bacteria, fungi, or viruses",
                emoji: "⚠️",
                isCorrect: true
            },
        ]
    },
    {
        id: 5,
        text: "Which habit supports long-term hygiene, not just cleanliness?",
        options: [
            {
                id: "a",
                text: "Consistent routines + clean environment",
                emoji: "🏠",
                isCorrect: true
            },
            {
                id: "b",
                text: "Using perfume daily",
                emoji: "🌸",
                isCorrect: false
            },
            {
                id: "c",
                text: "Only washing when dirty",
                emoji: "🕒",
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
    navigate("/student/health-male/teens/reflex-smart-hygiene-43");
  };

  return (
    <GameShell
      title="Quiz on Hygiene"
      subtitle={gameFinished ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      totalLevels={5}
      currentLevel={42}
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
        {!gameFinished && questions[currentQuestion] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <div className="text-6xl mb-4 text-center">🧼</div>
              
              <p className="text-white text-lg md:text-xl mb-6 text-center">
                {questions[currentQuestion].text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questions[currentQuestion].options.map(option => {
                  const isSelected = selectedOption === option.id;
                  const showCorrect = showFeedback && option.isCorrect;
                  const showIncorrect = showFeedback && isSelected && !option.isCorrect;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      disabled={showFeedback}
                      className={`p-6 rounded-2xl shadow-lg transition-all transform text-center ${
                        showCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : showIncorrect
                          ? "bg-red-500/20 border-2 border-red-400 opacity-75"
                          : isSelected
                          ? "bg-blue-600 border-2 border-blue-300 scale-105"
                          : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                      } ${showFeedback ? "cursor-not-allowed" : ""}`}
                    >
                      <div className="text-2xl mb-2">{option.emoji}</div>
                      <h4 className="font-bold text-base mb-2">{option.text}</h4>
                    </button>
                  );
                })}
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
        ) : null}
      </div>
    </GameShell>
  );
};

export default QuizHygiene;
