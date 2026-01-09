import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const KindVsMeanQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-kids-81");
  const gameId = gameData?.id || "dcos-kids-81";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for KindVsMeanQuiz, using fallback ID");
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
    text: "You see a classmate make a mistake in an online class. What message is kind to send?",
    options: [
      
      {
        id: "b",
        text: "That was so embarrassing",
        emoji: "📱",
        isCorrect: false
      },
      {
        id: "c",
        text: "You should leave the class",
        emoji: "💻",
        isCorrect: false
      },
      {
        id: "a",
        text: "Everyone messes up sometimes, keep trying",
        emoji: "💬",
        isCorrect: true
      },
    ]
  },
  {
    id: 2,
    text: "Someone shares their drawing in a group chat. What is the kind response?",
    options: [
      {
        id: "a",
        text: "I like how you used colors",
        emoji: "🖍️",
        isCorrect: true
      },
      {
        id: "b",
        text: "Mine is better than this",
        emoji: "📷",
        isCorrect: false
      },
      {
        id: "c",
        text: "Why did you even post this?",
        emoji: "🗂️",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "During an online game, a player is new and learning. What shows kindness?",
    options: [
      
      {
        id: "b",
        text: "You are slowing everyone down",
        emoji: "🕹️",
        isCorrect: false
      },
      {
        id: "a",
        text: "Let me explain the rules",
        emoji: "🎯",
        isCorrect: true
      },
      {
        id: "c",
        text: "Quit the game now",
        emoji: "📊",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "You disagree with someone’s opinion in an online discussion. What is the kind way to reply?",
    options: [
      
      {
        id: "b",
        text: "That idea makes no sense",
        emoji: "📢",
        isCorrect: false
      },
      {
        id: "c",
        text: "Only silly people think like that",
        emoji: "🧩",
        isCorrect: false
      },
      {
        id: "a",
        text: "I think differently, and here’s why",
        emoji: "🧠",
        isCorrect: true
      },
    ]
  },
  {
    id: 5,
    text: "You notice someone being teased in a group chat. What action supports kindness?",
    options: [
      
      {
        id: "b",
        text: "Share the messages with more people",
        emoji: "📨",
        isCorrect: false
      },
      {
        id: "a",
        text: "Ask others to stop and support the person",
        emoji: "🛡️",
        isCorrect: true
      },
      {
        id: "c",
        text: "Ignore it and add a laughing reply",
        emoji: "📎",
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
      title="Quiz on Kind vs Mean Words"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/dcos/kids/reflex-respect1"
      nextGameIdProp="dcos-kids-82"
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

export default KindVsMeanQuiz;

