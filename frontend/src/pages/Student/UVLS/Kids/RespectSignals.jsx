import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RespectSignals = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-19");
  const gameId = gameData?.id || "uvls-kids-19";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for RespectSignals, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "What is a respectful signal when someone is talking to you?",
      emoji: "👁️",
      options: [
        { 
          id: "eye", 
          text: "Making eye contact and listening", 
          emoji: "👁️", 
          // description: "Shows you're paying attention",
          isCorrect: true 
        },
        { 
          id: "phone", 
          text: "Looking at your phone", 
          emoji: "📱", 
          // description: "Shows you're not interested",
          isCorrect: false 
        },
        { 
          id: "walk", 
          text: "Walking away mid-conversation", 
          emoji: "🚶", 
          // description: "Very disrespectful behavior",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "Which action shows respect during a conversation?",
      emoji: "👂",
      options: [
        { 
          id: "roll", 
          text: "Rolling your eyes", 
          emoji: "🙄", 
          // description: "Shows disrespect and annoyance",
          isCorrect: false 
        },
        { 
          id: "face", 
          text: "Turning to face the speaker", 
          emoji: "👂", 
          // description: "Shows you're engaged and listening",
          isCorrect: true 
        },
        { 
          id: "yawn", 
          text: "Yawning without covering mouth", 
          emoji: "😴", 
          // description: "Shows boredom and disrespect",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "What is a disrespectful signal?",
      emoji: "😒",
      options: [
        { 
          id: "nod", 
          text: "Nodding to show understanding", 
          emoji: "🙌", 
          // description: "Shows you're listening",
          isCorrect: false 
        },
        { 
          id: "interrupt", 
          text: "Interrupting constantly", 
          emoji: "🗣️", 
          // description: "Doesn't let others speak",
          isCorrect: true 
        },
        { 
          id: "smile", 
          text: "Smiling when someone talks", 
          emoji: "😊", 
          // description: "Shows friendliness and respect",
          isCorrect: false 
        }
      ]
    },
    {
      id: 4,
      text: "Which body language shows respect?",
      emoji: "🤝",
      options: [
        { 
          id: "open", 
          text: "Open body language and facing the person", 
          emoji: "🤲", 
          // description: "Shows you're welcoming and attentive",
          isCorrect: true 
        },
        { 
          id: "crossed", 
          text: "Arms crossed defensively", 
          emoji: "🙅", 
          // description: "Shows you're closed off",
          isCorrect: false 
        },
        { 
          id: "frown", 
          text: "Frowning and looking bored", 
          emoji: "😒", 
          // description: "Shows disinterest",
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "What is a respectful way to greet someone?",
      emoji: "🤝",
      options: [
        { 
          id: "ignore", 
          text: "Ignoring them completely", 
          emoji: "🙈", 
          // description: "Very disrespectful",
          isCorrect: false 
        },
        { 
          id: "turn", 
          text: "Turning your back to them", 
          emoji: "🚶", 
          // description: "Shows disrespect",
          isCorrect: false 
        },
        { 
          id: "handshake", 
          text: "Proper handshake or friendly greeting", 
          emoji: "🤝", 
          // description: "Shows respect and friendliness",
          isCorrect: true 
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
      title="Respect Signals"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/uvls/kids/inclusive-kid-badge"
      nextGameIdProp="uvls-kids-20"
      gameType="uvls"
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

export default RespectSignals;

