import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeGratitudeHero = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("moral-teen-20");
  const gameId = gameData?.id || "moral-teen-20";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for BadgeGratitudeHero, using fallback ID");
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
      title: "Gratitude Challenge 1",
      question: "What should you do when a teacher or elder helps you?",
      options: [
        { 
          text: "Thank them sincerely for their help", 
          emoji: "🙏", 
          isCorrect: true
        },
        { 
          text: "Ignore them and move on", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Expect them to help again", 
          emoji: "🤔", 
          isCorrect: false
        },
        { 
          text: "Only thank them if you need more help", 
          emoji: "💭", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Gratitude Challenge 2",
      question: "How should you express gratitude to a friend or classmate?",
      options: [
        { 
          text: "Take their help for granted", 
          emoji: "😐", 
          isCorrect: false
        },
        { 
          text: "Express gratitude sincerely and acknowledge their kindness", 
          emoji: "🙏", 
          isCorrect: true
        },
        { 
          text: "Only thank them in private", 
          emoji: "🤫", 
          isCorrect: false
        },
        { 
          text: "Wait for them to ask for thanks", 
          emoji: "⏳", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Gratitude Challenge 3",
      question: "What is the right way to help someone?",
      options: [
        { 
          text: "Help only if they promise to return the favor", 
          emoji: "🤝", 
          isCorrect: false
        },
        { 
          text: "Help but expect something in return", 
          emoji: "💭", 
          isCorrect: false
        },
        { 
          text: "Help someone without expecting anything in return", 
          emoji: "🙏", 
          isCorrect: true
        },
        { 
          text: "Help only close friends", 
          emoji: "👥", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Gratitude Challenge 4",
      question: "How should you respond to small acts of kindness?",
      options: [
        { 
          text: "Appreciate small things others do for you", 
          emoji: "🙏", 
          isCorrect: true
        },
        { 
          text: "Ignore small gestures", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Only appreciate big gestures", 
          emoji: "💭", 
          isCorrect: false
        },
        { 
          text: "Expect more from them", 
          emoji: "🤔", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Gratitude Challenge 5",
      question: "When should you say 'thank you' or 'please'?",
      options: [
        { 
          text: "Only when asking for big favors", 
          emoji: "💭", 
          isCorrect: false
        },
        { 
          text: "Say 'thank you' or 'please' sincerely whenever appropriate", 
          emoji: "🙏", 
          isCorrect: true
        },
        { 
          text: "Only to people you like", 
          emoji: "😊", 
          isCorrect: false
        },
        { 
          text: "Only in formal situations", 
          emoji: "👔", 
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
      title="Badge: Gratitude Hero"
      score={score}
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/moral-values/teen/empathy-story"
      nextGameIdProp="moral-teen-21"
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

export default BadgeGratitudeHero;

