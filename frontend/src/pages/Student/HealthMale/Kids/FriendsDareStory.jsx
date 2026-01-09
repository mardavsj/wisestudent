import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FriendsDareStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-61";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Your friend dares you to skip homework and play outside instead. What do you do?",
      options: [
        {
          id: "b",
          text: "Skip homework and play",
          emoji: "🏃",
          
          isCorrect: false
        },
        {
          id: "a",
          text: "Finish homework first, then play",
          emoji: "📚",
         
          isCorrect: true
        },
        {
          id: "c",
          text: "Hide homework and pretend it's done",
          emoji: "🙈",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Friends dare you to eat a whole cake before dinner. What's the smart choice?",
      options: [
        {
          id: "a",
          text: "Say no and wait for proper dessert",
          emoji: "⏰",
          isCorrect: true
        },
        {
          id: "c",
          text: "Eat it all and feel sick",
          emoji: "🤢",
          isCorrect: false
        },
        {
          id: "b",
          text: "Take just a little bite",
          emoji: "🍰",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your friend dares you to run across a busy street. What should you do?",
      options: [
        {
          id: "b",
          text: "Run across quickly",
          emoji: "🏃",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ask an adult to help",
          emoji: "👨‍👩‍👧",
          isCorrect: false
        },
        {
          id: "a",
          text: "Say no and find a safe way to cross",
          emoji: "🚦",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "Friends dare you to stay up all night playing games. What's best?",
      options: [
        {
          id: "c",
          text: "Stay up all night",
          emoji: "🕚",
          isCorrect: false
        },
        {
          id: "a",
          text: "Say no and get good sleep",
          emoji: "😴",
          isCorrect: true
        },
        {
          id: "b",
          text: "Play just a little longer",
          emoji: "🎮",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Someone dares you to throw trash on the ground. What do you do?",
      options: [
        {
          id: "b",
          text: "Throw it on the ground",
          emoji: "🗑️",
          isCorrect: false
        },
        {
          id: "c",
          text: "Find a trash can instead",
          emoji: "♻️",
          isCorrect: false
        },
        {
          id: "a",
          text: "Say no and explain why it's wrong",
          emoji: "🗣️",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (answered) return;
    
    const selectedOption = questions[currentQuestion].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;
    
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

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Friend's Dare Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/quiz-peer-pressure"
      nextGameIdProp="health-male-kids-62"
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 3}
    >
      <div className="space-y-8">
        {!showResult && questions[currentQuestion] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {questions[currentQuestion].text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
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

export default FriendsDareStory;

