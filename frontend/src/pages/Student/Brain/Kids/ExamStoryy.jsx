import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ExamStoryy = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-35");
  const gameId = gameData?.id || "brain-kids-35";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ExamStoryy, using fallback ID");
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
    text: "Riya studies well but her hands feel cold when she opens the exam paper. What would help her most at that moment?",
    options: [
      
      {
        id: "rush",
        text: "Read all questions quickly at once",
        emoji: "📄",
        isCorrect: false
      },
      {
        id: "compare",
        text: "Look around to see how others are doing",
        emoji: "👀",
        isCorrect: false
      },
      {
        id: "pause",
        text: "Take a short pause and focus on one question",
        emoji: "⏸️",
        isCorrect: true
      },
    ]
  },
  {
    id: 2,
    text: "Before entering the exam hall, Aarav hears older students talking about how hard the test is. What is the smartest choice for him?",
    options: [
      {
        id: "selftalk",
        text: "Remind himself of his own preparation",
        emoji: "💭",
        isCorrect: true
      },
      {
        id: "listen",
        text: "Keep listening to their worries",
        emoji: "👂",
        isCorrect: false
      },
      {
        id: "escape",
        text: "Leave the area and avoid the exam",
        emoji: "🚪",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "Meena forgets an answer she studied many times. What helps her brain recall better?",
    options: [
      
      {
        id: "panic",
        text: "Assume everything is forgotten",
        emoji: "⚠️",
        isCorrect: false
      },
      {
        id: "skipall",
        text: "Stop trying and move on forever",
        emoji: "⏭️",
        isCorrect: false
      },
      {
        id: "calm",
        text: "Stay calm and think step by step",
        emoji: "🧠",
        isCorrect: true
      },
    ]
  },
  {
    id: 4,
    text: "During the test, Kabir notices his heart beating fast. What action supports his focus?",
    options: [
     
      {
        id: "shake",
        text: "Keep tapping the desk repeatedly",
        emoji: "🫨",
        isCorrect: false
      },
       {
        id: "breath",
        text: "Slow breathing while reading the question",
        emoji: "🌬️",
        isCorrect: true
      },
      {
        id: "fear",
        text: "Think only about the result",
        emoji: "📊",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "After finishing early, Sana feels unsure about her answers. What is the most helpful next step?",
    options: [
      {
        id: "review",
        text: "Review answers calmly and check mistakes",
        emoji: "🔍",
        isCorrect: true
      },
      {
        id: "stress",
        text: "Worry about what she might have done wrong",
        emoji: "😟",
        isCorrect: false
      },
      {
        id: "copy",
        text: "Change answers by guessing again",
        emoji: "🎯",
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
      title="Exam Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/brain/kids/poster-stay-cool"
      nextGameIdProp="brain-kids-36"
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

export default ExamStoryy;

