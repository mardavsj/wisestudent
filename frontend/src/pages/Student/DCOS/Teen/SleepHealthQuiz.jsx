import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';

const SleepHealthQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-teen-22");
  const gameId = gameData?.id || "dcos-teen-22";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SleepHealthQuiz, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
  {
    id: 1,
    text: "You stay up late watching videos and feel tired in school the next day. What's the healthy choice?",
    options: [
     
      { 
        id: "watch-more", 
        text: "Keep watching videos anyway", 
        emoji: "🎬", 
        isCorrect: false
      },
      { 
        id: "drink-coffee", 
        text: "Drink coffee to stay awake", 
        emoji: "☕", 
        isCorrect: false
      },
       { 
        id: "sleep-early", 
        text: "Go to bed earlier to get enough rest", 
        emoji: "🌙", 
        isCorrect: true
      },
    ]
  },
  {
    id: 2,
    text: "You feel sleepy while doing homework at 9 PM. What helps you stay productive and healthy?",
    options: [
      { 
        id: "rest-first", 
        text: "Take a short rest and finish homework after proper sleep", 
        emoji: "😑", 
        isCorrect: true
      },
      { 
        id: "push-through", 
        text: "Stay awake and push through without rest", 
        emoji: "💪", 
        isCorrect: false
      },
      { 
        id: "snack-time", 
        text: "Eat snacks to stay awake", 
        emoji: "🍪", 
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "You play games late at night and feel stressed the next morning. What is the healthier habit?",
    options: [
     
      { 
        id: "late-play", 
        text: "Play games whenever you want", 
        emoji: "🕹️", 
        isCorrect: false
      },
       { 
        id: "schedule-games", 
        text: "Play games earlier and keep bedtime consistent", 
        emoji: "🙂", 
        isCorrect: true
      },
      { 
        id: "skip-sleep", 
        text: "Skip sleep to continue playing", 
        emoji: "⏰", 
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "Your phone buzzes with messages at 11 PM. What should you do for good sleep health?",
    options: [
      
      { 
        id: "check-messages", 
        text: "Check all messages immediately", 
        emoji: "📲", 
        isCorrect: false
      },
      { 
        id: "reply-fast", 
        text: "Reply quickly to stay connected", 
        emoji: "💬", 
        isCorrect: false
      },
      { 
        id: "ignore-phone", 
        text: "Ignore notifications and sleep", 
        emoji: "🔕", 
        isCorrect: true
      },
    ]
  },
  {
    id: 5,
    text: "You feel restless in bed. What routine can help improve your sleep quality?",
    options: [
      { 
        id: "relax-routine", 
        text: "Do a calming bedtime routine before sleeping", 
        emoji: "🕯️", 
        isCorrect: true
      },
      { 
        id: "scroll-phone", 
        text: "Scroll social media until you fall asleep", 
        emoji: "📱", 
        isCorrect: false
      },
      { 
        id: "eat-late", 
        text: "Eat heavy snacks right before bed", 
        emoji: "🍫", 
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

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Sleep Health Quiz"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/dcos/teens/dopamine-reflex"
      nextGameIdProp="dcos-teen-23"
      gameType="dcos"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
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

export default SleepHealthQuiz;

