import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateMoneyAndMorals = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-96");
  const gameId = gameData?.id || "finance-teens-96";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for DebateMoneyAndMorals, using fallback ID");
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
      statement: "Does money test character?",
      options: [
        { 
          id: "yes", 
          text: "Yes, ethics matter more", 
          emoji: "🙂", 
          
          isCorrect: true
        },
        { 
          id: "no", 
          text: "No, money doesn't matter", 
          emoji: "🤷", 
          
          isCorrect: false
        },
        { 
          id: "maybe", 
          text: "Maybe, depends", 
          emoji: "🤔", 
         
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      statement: "Should you compromise ethics for money?",
      options: [
        { 
          id: "sometimes", 
          text: "Sometimes okay", 
          emoji: "🤷", 
          
          isCorrect: false
        },
        { 
          id: "never", 
          text: "Never compromise", 
          emoji: "🛡️", 
          
          isCorrect: true
        },
        { 
          id: "always", 
          text: "Money is priority", 
          emoji: "💰", 
          
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      statement: "What's more important: wealth or integrity?",
      options: [
        { 
          id: "wealth", 
          text: "Wealth", 
          emoji: "💵", 
          
          isCorrect: false
        },
        { 
          id: "both", 
          text: "Both equally", 
          emoji: "⚖️", 
          
          isCorrect: false
        },
        { 
          id: "integrity", 
          text: "Integrity", 
          emoji: "💎", 
          
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      statement: "Can you be rich and ethical?",
      options: [
        { 
          id: "yes2", 
          text: "Yes, absolutely", 
          emoji: "✨", 
          
          isCorrect: true
        },
        { 
          id: "no2", 
          text: "No, impossible", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          id: "rarely", 
          text: "Rarely possible", 
          emoji: "😕", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      statement: "What builds lasting success?",
      options: [
        { 
          id: "shortcuts", 
          text: "Shortcuts and tricks", 
          emoji: "⚡", 
          isCorrect: false
        },
        { 
          id: "ethics", 
          text: "Ethics and honesty", 
          emoji: "🏆", 
          isCorrect: true
        },
        { 
          id: "luck", 
          text: "Luck only", 
          emoji: "🍀", 
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
      title="Debate: Money & Morals"
      subtitle={!showResult ? `Round ${currentRound + 1} of ${rounds.length}` : "Debate Complete!"}
      score={score}
      currentLevel={currentRound + 1}
      totalLevels={rounds.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={rounds.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/journal-responsibility"
      nextGameIdProp="finance-teens-97"
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

export default DebateMoneyAndMorals;

