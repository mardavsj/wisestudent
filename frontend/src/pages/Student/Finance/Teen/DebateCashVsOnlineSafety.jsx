import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateCashVsOnlineSafety = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-86");
  const gameId = gameData?.id || "finance-teens-86";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for DebateCashVsOnlineSafety, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const rounds = [
    {
      id: 1,
      statement: "Is online money more risky than cash?",
      options: [
        { 
          id: "online-riskier", 
          text: "Online is riskier", 
          emoji: "💻", 
          
          isCorrect: false
        },
        { 
          id: "both-safe", 
          text: "Both need safety", 
          emoji: "🛡️", 
          
          isCorrect: true
        },
        { 
          id: "cash-riskier", 
          text: "Cash is riskier", 
          emoji: "💵", 
          
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      statement: "Which is safer for large amounts?",
      options: [
        { 
          id: "both-safe2", 
          text: "Both with precautions", 
          emoji: "🔒", 
          isCorrect: true
        },
        { 
          id: "only-cash", 
          text: "Only cash", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          id: "only-online", 
          text: "Only online", 
          emoji: "📱", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      statement: "What's the main risk with online money?",
      options: [
       
        { 
          id: "no-risk", 
          text: "No risks", 
          emoji: "😓", 
          isCorrect: false
        },
        { 
          id: "too-easy", 
          text: "Too easy to use", 
          emoji: "😊", 
          isCorrect: false
        },
         { 
          id: "hacking", 
          text: "Hacking and fraud", 
          emoji: "👾", 
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      statement: "How can you protect online money?",
      options: [
        { 
          id: "strong-password", 
          text: "Strong passwords and OTP", 
          emoji: "🔐", 
          isCorrect: true
        },
        { 
          id: "no-protection", 
          text: "No protection needed", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          id: "share-details", 
          text: "Share details freely", 
          emoji: "📢", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      statement: "What's the best approach?",
      options: [
       
        { 
          id: "only-one", 
          text: "Use only one method", 
          emoji: "🎯", 
          isCorrect: false
        },
         { 
          id: "balance", 
          text: "Balance both safely", 
          emoji: "⚖️", 
          isCorrect: true
        },
        { 
          id: "avoid-all", 
          text: "Avoid all money", 
          emoji: "🚫", 
          isCorrect: false
        }
      ]
    }
  ];

  const handleAnswer = (optionId) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    const round = rounds[currentRound];
    const selectedOption = round.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption?.isCorrect;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    const isLastRound = currentRound === rounds.length - 1;
    
    setTimeout(() => {
      if (isLastRound) {
        setShowResult(true);
      } else {
        setCurrentRound(prev => prev + 1);
        setAnswered(false);
      }
    }, 2000);
  };

  const current = rounds[currentRound];

  return (
    <GameShell
      title="Debate: Cash vs Online Safety"
      subtitle={!showResult ? `Round ${currentRound + 1} of ${rounds.length}` : "Debate Complete!"}
      score={score}
      currentLevel={currentRound + 1}
      totalLevels={rounds.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={rounds.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/journal-consumer-rights"
      nextGameIdProp="finance-teens-87"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="finance"
    >
      <div className="space-y-8">
        {!showResult && current ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Round {currentRound + 1}/{rounds.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{rounds.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {current.statement}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {current.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-center transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : "bg-red-500/20 border-2 border-red-400 opacity-75"
                        : "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="text-4xl">{option.emoji}</span>
                      <span className="font-semibold text-lg">{option.text}</span>
                      <p className="text-sm opacity-90">{option.description}</p>
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

export default DebateCashVsOnlineSafety;

