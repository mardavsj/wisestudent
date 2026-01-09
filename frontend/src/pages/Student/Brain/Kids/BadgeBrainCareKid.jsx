import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeBrainCareKid = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-10");
  const gameId = gameData?.id || "brain-kids-10";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for BadgeBrainCareKid, using fallback ID");
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
      title: "Brain Health Challenge 1",
      question: "What is the best way to keep your brain healthy?",
      options: [
        { 
          text: "Eat healthy, exercise, and sleep well", 
          emoji: "🙂‍↔️", 
          isCorrect: true
        },
        { 
          text: "Only play video games", 
          emoji: "🎮", 
          isCorrect: false
        },
        { 
          text: "Skip meals and stay up late", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "Avoid all physical activity", 
          emoji: "🚫", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Brain Health Challenge 2",
      question: "Which activity helps your brain the most?",
      options: [
        { 
          text: "Watching TV all day", 
          emoji: "📺", 
          isCorrect: false
        },
        { 
          text: "Reading, learning, and staying active", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          text: "Eating only junk food", 
          emoji: "🍟", 
          isCorrect: false
        },
        { 
          text: "Never drinking water", 
          emoji: "🚫", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Brain Health Challenge 3",
      question: "What should you do for better brain function?",
      options: [
        { 
          text: "Drink lots of soda", 
          emoji: "🥤", 
          isCorrect: false
        },
        { 
          text: "Skip breakfast daily", 
          emoji: "🍳", 
          isCorrect: false
        },
        { 
          text: "Drink water, eat healthy, and exercise", 
          emoji: "💧", 
          isCorrect: true
        },
        { 
          text: "Stay up very late", 
          emoji: "🌙", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Brain Health Challenge 4",
      question: "How can you improve your focus?",
      options: [
        { 
          text: "Practice focusing, take breaks, and stay organized", 
          emoji: "🎯", 
          isCorrect: true
        },
        { 
          text: "Never take breaks", 
          emoji: "⏰", 
          isCorrect: false
        },
        { 
          text: "Always multitask", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          text: "Avoid learning new things", 
          emoji: "🚫", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Brain Health Challenge 5",
      question: "What makes a brain-healthy daily routine?",
      options: [
        { 
          text: "Regular sleep, healthy meals, and mental activities", 
          emoji: "🧠", 
          isCorrect: true
        },
        { 
          text: "Irregular sleep schedule", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "Only eat snacks", 
          emoji: "🍪", 
          isCorrect: false
        },
        { 
          text: "Avoid all exercise", 
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
      title="Badge: Brain Care Kid"
      score={score}
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/brain/kids/classroom-story"
      nextGameIdProp="brain-kids-11"
      gameType="brain"
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

export default BadgeBrainCareKid;

