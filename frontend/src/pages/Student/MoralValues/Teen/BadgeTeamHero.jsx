import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeTeamHero = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("moral-teen-70");
  const gameId = gameData?.id || "moral-teen-70";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for BadgeTeamHero, using fallback ID");
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
      title: "Team Hero Challenge 1",
      question: "What should you do when a teammate needs help?",
      options: [
        { 
          text: "Help a teammate complete their task", 
          emoji: "🤝", 
          isCorrect: true
        },
        { 
          text: "Focus only on your own work", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Let them struggle alone", 
          emoji: "😐", 
          isCorrect: false
        },
        { 
          text: "Only help if they ask multiple times", 
          emoji: "💭", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Team Hero Challenge 2",
      question: "How should you share resources with classmates?",
      options: [
        { 
          text: "Keep all materials to yourself", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Share materials generously with classmates", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          text: "Only share with close friends", 
          emoji: "👥", 
          isCorrect: false
        },
        { 
          text: "Share only if you have extra", 
          emoji: "💭", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Team Hero Challenge 3",
      question: "What should you do to encourage team participation?",
      options: [
        { 
          text: "Dominate all discussions", 
          emoji: "🗣️", 
          isCorrect: false
        },
        { 
          text: "Discourage others from sharing", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Encourage others to share their ideas", 
          emoji: "💬", 
          isCorrect: true
        },
        { 
          text: "Only listen to your own ideas", 
          emoji: "👂", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Team Hero Challenge 4",
      question: "How should you celebrate team achievements?",
      options: [
        { 
          text: "Celebrate group success together as a team", 
          emoji: "🎉", 
          isCorrect: true
        },
        { 
          text: "Take all the credit yourself", 
          emoji: "😏", 
          isCorrect: false
        },
        { 
          text: "Ignore team achievements", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Only celebrate if you contributed most", 
          emoji: "💭", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Team Hero Challenge 5",
      question: "What should you do when there's a disagreement in the team?",
      options: [
        { 
          text: "Avoid the conflict", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Resolve the disagreement calmly and fairly", 
          emoji: "🕊️", 
          isCorrect: true
        },
        { 
          text: "Take sides and create more conflict", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Only resolve if it affects you", 
          emoji: "💭", 
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
      title="Badge: Team Hero"
      score={score}
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/moral-values/teen/leader-story"
      nextGameIdProp="moral-teen-71"
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

export default BadgeTeamHero;

