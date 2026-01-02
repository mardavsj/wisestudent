import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ScamAwareBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-kids-50");
  const gameId = gameData?.id || "dcos-kids-50";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ScamAwareBadge, using fallback ID");
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
      title: "Scam Aware Challenge 1",
      question: "What should you do if someone offers you a free gift online?",
      options: [
        
        { 
          text: "Accept it immediately", 
          emoji: "👍", 
          isCorrect: false
        },
        { 
          text: "Share your personal info", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          text: "Click on any link", 
          emoji: "🔗", 
          isCorrect: false
        },
        { 
          text: "Refuse the suspicious free gift offer", 
          emoji: "🎁", 
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      title: "Scam Aware Challenge 2",
      question: "What should you do with a suspicious link?",
      options: [
        { 
          text: "Click it immediately", 
          emoji: "🔗", 
          isCorrect: false
        },
        { 
          text: "Don't click on the fake link", 
          emoji: "🔗", 
          isCorrect: true
        },
        { 
          text: "Share it with friends", 
          emoji: "📤", 
          isCorrect: false
        },
        { 
          text: "Open it in private mode", 
          emoji: "🔒", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Scam Aware Challenge 3",
      question: "What should you do with your OTP (One-Time Password)?",
      options: [
        { 
          text: "Share it with strangers", 
          emoji: "📱", 
          isCorrect: false
        },
       
        { 
          text: "Post it online", 
          emoji: "📢", 
          isCorrect: false
        },
         { 
          text: "Don't share your OTP with anyone", 
          emoji: "🔢", 
          isCorrect: true
        },
        { 
          text: "Tell it to everyone", 
          emoji: "💬", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Scam Aware Challenge 4",
      question: "What should you do with spam calls?",
      options: [
        { 
          text: "Block the spam call", 
          emoji: "📞", 
          isCorrect: true
        },
        { 
          text: "Answer and give personal info", 
          emoji: "📞", 
          isCorrect: false
        },
        
        { 
          text: "Call them back", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          text: "Share your number", 
          emoji: "🔢", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Scam Aware Challenge 5",
      question: "What should you do if you see a scam?",
      options: [
        { 
          text: "Ignore it completely", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Report the scam to an adult", 
          emoji: "🚨", 
          isCorrect: true
        },
        { 
          text: "Try the scam yourself", 
          emoji: "😈", 
          isCorrect: false
        },
        { 
          text: "Share it with friends", 
          emoji: "📤", 
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
      title="Badge: Scam Aware"
      score={score}
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
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

export default ScamAwareBadge;
