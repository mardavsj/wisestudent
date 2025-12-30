
import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const AlcoholStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-85";
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
    text: "You are at a New Year's celebration and adults are having alcohol. What is the best choice for you?",
    options: [
      {
        id: "a",
        text: "Sip their drink quietly",
        emoji: "🍷",
        isCorrect: false
      },
      {
        id: "b",
        text: "Hold the glass to look grown-up",
        emoji: "🫗",
        isCorrect: false
      },
      {
        id: "c",
        text: "Choose water or juice instead",
        emoji: "🧃",
        isCorrect: true
      }
    ]
  },
  {
    id: 2,
    text: "Why should children stay away from alcohol?",
    options: [
      {
        id: "a",
        text: "Because it smells bad",
        emoji: "👃",
        isCorrect: false
      },
      {
        id: "b",
        text: "Because it can harm a growing brain",
        emoji: "🧠",
        isCorrect: true
      },
      {
        id: "c",
        text: "Because it is only sold at night",
        emoji: "🌙",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "What could happen if a child drinks alcohol?",
    options: [
      {
        id: "a",
        text: "They may feel sick, dizzy, or confused",
        emoji: "🤢",
        isCorrect: true
      },
      {
        id: "b",
        text: "They instantly become stronger",
        emoji: "💪",
        isCorrect: false
      },
      {
        id: "c",
        text: "They can think faster",
        emoji: "⚡",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "Your friends tease you for saying no to alcohol. What is the smartest action?",
    options: [
      {
        id: "a",
        text: "Give in so they stop teasing",
        emoji: "😔",
        isCorrect: false
      },
      {
        id: "b",
        text: "Stay firm and choose what’s right",
        emoji: "🛡️",
        isCorrect: true
      },
      {
        id: "c",
        text: "Laugh and change the topic",
        emoji: "😄",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "If someone pressures you to drink alcohol, who should you talk to?",
    options: [
      {
        id: "a",
        text: "Keep it a secret",
        emoji: "🤐",
        isCorrect: false
      },
      {
        id: "b",
        text: "Post about it online",
        emoji: "📱",
        isCorrect: false
      },
      {
        id: "c",
        text: "A trusted adult like a parent or teacher",
        emoji: "👨‍👩‍👧",
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
    navigate("/student/health-male/kids/say-no-poster");
  };

  return (
    <GameShell
      title="Alcohol Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
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

export default AlcoholStory;
