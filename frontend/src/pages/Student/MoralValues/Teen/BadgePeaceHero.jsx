import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgePeaceHero = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("moral-teen-90");
  const gameId = gameData?.id || "moral-teen-90";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for BadgePeaceHero, using fallback ID");
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
      title: "Peace Hero Challenge 1",
      question: "What should you do during an argument?",
      options: [
        { 
          text: "Listen calmly and try to understand", 
          emoji: "🕊️", 
          isCorrect: true
        },
        { 
          text: "Interrupt and raise your voice", 
          emoji: "🗣️", 
          isCorrect: false
        },
        { 
          text: "Walk away without listening", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Get defensive immediately", 
          emoji: "😠", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Peace Hero Challenge 2",
      question: "How should you end a fight or conflict?",
      options: [
        { 
          text: "Wait for the other person to apologize first", 
          emoji: "⏳", 
          isCorrect: false
        },
        { 
          text: "Apologize first to end the fight and restore peace", 
          emoji: "🤝", 
          isCorrect: true
        },
        { 
          text: "Continue arguing until you win", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Hold a grudge", 
          emoji: "😤", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Peace Hero Challenge 3",
      question: "What should you do when friends have a misunderstanding?",
      options: [
        { 
          text: "Take sides and create more conflict", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Stay out of it completely", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Help them talk through the misunderstanding calmly", 
          emoji: "💬", 
          isCorrect: true
        },
        { 
          text: "Spread rumors about the situation", 
          emoji: "🗣️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Peace Hero Challenge 4",
      question: "How should you handle a heated debate?",
      options: [
        { 
          text: "Stop the debate with kindness and calmness", 
          emoji: "🌿", 
          isCorrect: true
        },
        { 
          text: "Continue arguing to prove your point", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Insult the other person", 
          emoji: "👆", 
          isCorrect: false
        },
        { 
          text: "Walk away angrily", 
          emoji: "😤", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Peace Hero Challenge 5",
      question: "What should you do when you want to prove a point?",
      options: [
        { 
          text: "Argue until you win", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Choose peace over proving your point", 
          emoji: "☮️", 
          isCorrect: true
        },
        { 
          text: "Force your opinion on others", 
          emoji: "👆", 
          isCorrect: false
        },
        { 
          text: "Hold a grudge if you don't win", 
          emoji: "😤", 
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
      title="Badge: Peace Hero"
      score={score}
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/moral-values/teen/money-found-story"
      nextGameIdProp="moral-teen-91"
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

export default BadgePeaceHero;

