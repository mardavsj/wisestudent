import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeIntegrityHero = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("moral-teen-10");
  const gameId = gameData?.id || "moral-teen-10";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for BadgeIntegrityHero, using fallback ID");
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
      title: "Integrity Challenge 1",
      question: "What should you do when a friend asks you to lie for them?",
      options: [
        { 
          text: "Refuse to lie and tell the truth", 
          emoji: "💎", 
          isCorrect: true
        },
        { 
          text: "Lie to help your friend", 
          emoji: "🤥", 
          isCorrect: false
        },
        { 
          text: "Avoid the situation completely", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Tell a small white lie", 
          emoji: "😶", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Integrity Challenge 2",
      question: "How should you handle a situation where telling a white lie seems easier?",
      options: [
        { 
          text: "Tell the white lie to avoid conflict", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Choose truth over white lies, even when it's difficult", 
          emoji: "💎", 
          isCorrect: true
        },
        { 
          text: "Avoid the situation", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Let someone else handle it", 
          emoji: "👥", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Integrity Challenge 3",
      question: "What is the right response when someone offers you a bribe?",
      options: [
        { 
          text: "Accept it if it's a small amount", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          text: "Consider it but don't accept", 
          emoji: "🤔", 
          isCorrect: false
        },
        { 
          text: "Refuse the bribe offer immediately", 
          emoji: "💎", 
          isCorrect: true
        },
        { 
          text: "Accept it but feel guilty", 
          emoji: "😔", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Integrity Challenge 4",
      question: "What should you do during an important exam when you don't know the answer?",
      options: [
        { 
          text: "Do not cheat and answer honestly", 
          emoji: "💎", 
          isCorrect: true
        },
        { 
          text: "Look at your neighbor's paper", 
          emoji: "👀", 
          isCorrect: false
        },
        { 
          text: "Use hidden notes", 
          emoji: "📝", 
          isCorrect: false
        },
        { 
          text: "Ask a friend for help secretly", 
          emoji: "🤫", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Integrity Challenge 5",
      question: "How should you lead a group when making decisions?",
      options: [
        { 
          text: "Make decisions alone", 
          emoji: "👤", 
          isCorrect: false
        },
        { 
          text: "Lead with honesty and fairness", 
          emoji: "💎", 
          isCorrect: true
        },
        { 
          text: "Favor your friends", 
          emoji: "👥", 
          isCorrect: false
        },
        { 
          text: "Avoid making decisions", 
          emoji: "🚫", 
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
    
    const isLastChallenge = challenge === challenges.length - 1;
    
    setTimeout(() => {
      if (isLastChallenge) {
        setShowResult(true);
      } else {
        setChallenge(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 500);
  };

  const currentChallengeData = challenges[challenge];

  return (
    <GameShell
      title="Badge: Integrity Hero"
      score={score}
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/moral-values/teen/debate-obey-or-question"
      nextGameIdProp="moral-teen-11"
      gameType="moral"
      totalLevels={challenges.length}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && currentChallengeData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Challenge {challenge + 1}/{challenges.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{challenges.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{currentChallengeData.title}</h3>
              <p className="text-white text-lg mb-6">
                {currentChallengeData.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentChallengeData.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedAnswer(idx);
                      handleChoice(option.isCorrect);
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

export default BadgeIntegrityHero;

