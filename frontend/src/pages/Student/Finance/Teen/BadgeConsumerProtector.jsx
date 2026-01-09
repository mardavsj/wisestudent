import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeConsumerProtector = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-90");
  const gameId = gameData?.id || "finance-teens-90";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for BadgeConsumerProtector, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      title: "Fraud Case 1",
      question: "You receive a fake call asking for bank details. What do you do?",
      options: [
        { 
          text: "Refuse and report", 
          emoji: "🚫", 
          isCorrect: true
        },
        { 
          text: "Share details", 
          emoji: "💳", 
          isCorrect: false
        },
        { 
          text: "Ignore the call", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "Ask for more info", 
          emoji: "🤔", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Fraud Case 2",
      question: "You get a suspicious message with a link. What's your action?",
      options: [
        { 
          text: "Click the link", 
          emoji: "🔗", 
          isCorrect: false
        },
        { 
          text: "Delete and report", 
          emoji: "🗑️", 
          isCorrect: true
        },
        { 
          text: "Forward to friends", 
          emoji: "📤", 
          isCorrect: false
        },
        { 
          text: "Save for later", 
          emoji: "💾", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Fraud Case 3",
      question: "Someone asks for your OTP. How do you respond?",
      options: [
        { 
          text: "Never share OTP", 
          emoji: "🔒", 
          isCorrect: true
        },
        { 
          text: "Share if they ask nicely", 
          emoji: "😊", 
          isCorrect: false
        },
        { 
          text: "Give partial OTP", 
          emoji: "🔢", 
          isCorrect: false
        },
        { 
          text: "Share with everyone", 
          emoji: "📢", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Fraud Case 4",
      question: "You get a defective product. What should you do?",
      options: [
        { 
          text: "Accept it", 
          emoji: "😔", 
          isCorrect: false
        },
        { 
          text: "Complain to Consumer Court", 
          emoji: "⚖️", 
          isCorrect: true
        },
        { 
          text: "Ignore it", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "Throw it away", 
          emoji: "🗑️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Fraud Case 5",
      question: "You see an unrealistic investment offer. What's your response?",
      options: [
        { 
          text: "Invest immediately", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          text: "Refuse and report scam", 
          emoji: "🚨", 
          isCorrect: true
        },
        { 
          text: "Think about it", 
          emoji: "🤔", 
          isCorrect: false
        },
        { 
          text: "Share with others", 
          emoji: "📢", 
          isCorrect: false
        }
      ]
    }
  ];

  const handleAnswer = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    const isLastChallenge = challenge === challenges.length - 1;
    
    setTimeout(() => {
      if (isLastChallenge) {
        setShowResult(true);
      } else {
        setChallenge(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 2000);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setChallenge(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    resetFeedback();
  };

  return (
    <GameShell
      title="Badge: Consumer Protector"
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      score={score}
      currentLevel={challenge + 1}
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/scholarship-story"
      nextGameIdProp="finance-teens-91"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="finance"
    >
      <div className="space-y-8">
        {!showResult && challenges[challenge] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Challenge {challenge + 1}/{challenges.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{challenges.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{challenges[challenge].title}</h3>
              <p className="text-white text-lg mb-6">
                {challenges[challenge].question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges[challenge].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedAnswer(idx);
                      handleAnswer(option.isCorrect);
                    }}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-left transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : selectedAnswer === idx
                          ? "bg-red-500/20 border-4 border-red-400 ring-4 ring-red-400"
                          : "bg-white/5 border-2 border-white/20 opacity-50"
                        : "bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="text-white font-semibold">{option.text}</span>
                    </div>
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

export default BadgeConsumerProtector;

