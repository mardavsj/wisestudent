import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GamingPressureStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-68";
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
      text: "Your friends want to skip class to play video games at the arcade. What should you do?",
      options: [
        {
          id: "b",
          text: "Skip class and go gaming",
          emoji: "🎮",
          
          isCorrect: false
        },
        {
          id: "a",
          text: "Say no and go to class",
          emoji: "🏫",
          isCorrect: true
        },
        {
          id: "c",
          text: "Go but come back quickly",
          emoji: "⚡",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Friends pressure you to play games all night instead of sleeping. What's the healthy choice?",
      options: [
        {
          id: "c",
          text: "Play all night and sleep in class",
          emoji: "😴",
          isCorrect: false
        },
       
        {
          id: "b",
          text: "Play just a little longer",
          emoji: "🎯",
          isCorrect: false
        },
         {
          id: "a",
          text: "Set a time limit and get good sleep",
          emoji: "⏰",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "Someone wants you to spend all your allowance on in-game purchases. What do you say?",
      options: [
         {
          id: "a",
          text: "Save money and play free games",
          emoji: "💰",
          isCorrect: true
        },
        {
          id: "b",
          text: "Spend all the money",
          emoji: "💸",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Ask parents for more money",
          emoji: "🙏",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Friends say you're not cool if you don't play the latest expensive game. What's your response?",
      options: [
        {
          id: "c",
          text: "Beg parents to buy it for you",
          emoji: "😢",
          isCorrect: false
        },
        {
          id: "a",
          text: "Play what you have and enjoy it",
          emoji: "😊",
          isCorrect: true
        },
        {
          id: "b",
          text: "Feel bad about not having it",
          emoji: "😞",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Your friends want you to lie about where you're going so you can game together. What do you do?",
      options: [
        {
          id: "b",
          text: "Lie to go gaming",
          emoji: "🤥",
          isCorrect: false
        },
        {
          id: "c",
          text: "Tell them you can't lie",
          emoji: "🗣️",
          isCorrect: false
        },
        {
          id: "a",
          text: "Say no and suggest honest alternatives",
          emoji: "🤝",
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
    navigate("/student/health-male/kids/reflex-respect");
  };

  return (
    <GameShell
      title="Gaming Pressure Story"
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

export default GamingPressureStory;
