import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SmokingStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-81";
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
    text: "How does smoking affect your lungs over time?",
    options: [
      {
        id: "a",
        text: "They become weak and damaged",
        emoji: "😣",
        
        isCorrect: true
      },
      {
        id: "b",
        text: "They grow bigger and stronger",
        emoji: "💪",
        
        isCorrect: false
      },
      {
        id: "c",
        text: "They stay the same forever",
        emoji: "⏳",
        
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    text: "Someone asks you to try smoking. What is the smartest response?",
    options: [
      
      {
        id: "b",
        text: "Just one time is okay",
        emoji: "🚬",
        
        isCorrect: false
      },
      {
        id: "c",
        text: "I’ll decide later",
        emoji: "🤔",
        
        isCorrect: false
      },
      {
        id: "a",
        text: "No, I care about my health",
        emoji: "✋",
        
        isCorrect: true
      },
    ]
  },
  {
    id: 3,
    text: "Why can smoking make playing sports harder?",
    options: [
      {
        id: "a",
        text: "You get tired very quickly",
        emoji: "😮‍💨",
        
        isCorrect: true
      },
      {
        id: "b",
        text: "Your shoes stop working",
        emoji: "👟",
        
        isCorrect: false
      },
      {
        id: "c",
        text: "The game rules change",
        emoji: "📋",
        
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "What kind of substances are found in cigarettes?",
    options: [
     
      {
        id: "b",
        text: "Energy boosters",
        emoji: "⚡",
        
        isCorrect: false
      },
       {
        id: "a",
        text: "Harmful chemicals",
        emoji: "☠️",
        
        isCorrect: true
      },
      {
        id: "c",
        text: "Healthy nutrients",
        emoji: "🥗",
        
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "What helps you stay smoke-free as you grow up?",
    options: [
     
      {
        id: "b",
        text: "Trying risky things for fun",
        emoji: "🎲",
        
        isCorrect: false
      },
      {
        id: "c",
        text: "Copying everything others do",
        emoji: "👥",
        
        isCorrect: false
      },
       {
        id: "a",
        text: "Making healthy choices and friends",
        emoji: "🌟",
        
        isCorrect: true
      },
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
    navigate("/student/health-male/kids/quiz-substances");
  };

  return (
    <GameShell
      title="Smoking Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/quiz-substances"
      nextGameIdProp="health-male-kids-82"
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

export default SmokingStory;

