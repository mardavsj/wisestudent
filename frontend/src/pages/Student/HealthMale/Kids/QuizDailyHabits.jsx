import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const QuizDailyHabits = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-92";
  const gameData = getGameDataById(gameId);

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
    text: "Ayaan feels sleepy in class and can’t focus. Last night, he slept very late. What habit should he change to feel fresh tomorrow?",
    options: [
      {
        id: "a",
        text: "Going to bed earlier each night",
        emoji: "🛌",
        isCorrect: true
      },
      {
        id: "b",
        text: "Skipping breakfast",
        emoji: "🚫",
        isCorrect: false
      },
      {
        id: "c",
        text: "Watching more videos at night",
        emoji: "📱",
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    text: "Meera plays outside every day. Her teacher says this helps her body in many ways. What is the biggest benefit of this habit?",
    options: [
      {
        id: "a",
        text: "It wastes time",
        emoji: "⏳",
        isCorrect: false
      },
      {
        id: "b",
        text: "It makes her feel bored",
        emoji: "😐",
        isCorrect: false
      },
      {
        id: "c",
        text: "It keeps her body strong and active",
        emoji: "🏃‍♀️",
        isCorrect: true
      }
    ]
  },
  {
    id: 3,
    text: "Before eating lunch, Rohan notices his hands are dirty after playing. What is the safest choice he can make?",
    options: [
      {
        id: "a",
        text: "Wipe hands on clothes",
        emoji: "👕",
        isCorrect: false
      },
      {
        id: "b",
        text: "Wash hands with soap and water",
        emoji: "🧼",
        isCorrect: true
      },
      {
        id: "c",
        text: "Ignore it and eat fast",
        emoji: "🍽️",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "During break time, Sara feels hungry. She wants energy that lasts till evening. Which snack helps her the most?",
    options: [
      {
        id: "a",
        text: "Sugary candy",
        emoji: "🍬",
        isCorrect: false
      },
      {
        id: "b",
        text: "Fried chips",
        emoji: "🍟",
        isCorrect: false
      },
      {
        id: "c",
        text: "Fruit with nuts",
        emoji: "🥜",
        isCorrect: true
      }
    ]
  },
  {
    id: 5,
    text: "After playing in the sun, Kabir feels tired and thirsty. What habit will help his body recover quickly?",
    options: [
      {
        id: "a",
        text: "Drinking water regularly",
        emoji: "💧",
        isCorrect: true
      },
      {
        id: "b",
        text: "Eating only sweets",
        emoji: "🍭",
        isCorrect: false
      },
      {
        id: "c",
        text: "Going straight to sleep without water",
        emoji: "😴",
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
    navigate("/student/health-male/kids/reflex-habit-check");
  };

  return (
    <GameShell
      title="Quiz on Daily Habits"
      subtitle={gameFinished ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/reflex-habit-check"
      nextGameIdProp="health-male-kids-93"
      gameType="health-male"
      totalLevels={5}
      currentLevel={92}
      showConfetti={gameFinished}
      backPath="/games/health-male/kids"
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}>
      <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {!gameFinished && questions[currentQuestion] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <div className="text-6xl mb-4 text-center">🌟</div>
              
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
                          : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
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

export default QuizDailyHabits;

