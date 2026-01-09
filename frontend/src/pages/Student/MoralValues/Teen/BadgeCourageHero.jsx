import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeCourageHero = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("moral-teen-60");
  const gameId = gameData?.id || "moral-teen-60";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for BadgeCourageHero, using fallback ID");
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
      title: "Courage Challenge 1",
      question: "What should you do when a classmate is treated unfairly?",
      options: [
        { 
          text: "Stand up for them and defend their rights", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          text: "Stay quiet and avoid conflict", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Join in the unfair treatment", 
          emoji: "😏", 
          isCorrect: false
        },
        { 
          text: "Wait for someone else to act", 
          emoji: "⏳", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Courage Challenge 2",
      question: "How should you handle admitting a mistake?",
      options: [
        { 
          text: "Hide the mistake and hope no one notices", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Admit the mistake honestly and take responsibility", 
          emoji: "💬", 
          isCorrect: true
        },
        { 
          text: "Blame someone else", 
          emoji: "👆", 
          isCorrect: false
        },
        { 
          text: "Only admit if caught", 
          emoji: "😔", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Courage Challenge 3",
      question: "What should you do when telling the truth is hard?",
      options: [
        { 
          text: "Lie to avoid consequences", 
          emoji: "🤥", 
          isCorrect: false
        },
        { 
          text: "Avoid the situation", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Tell the truth even when it's difficult", 
          emoji: "🔥", 
          isCorrect: true
        },
        { 
          text: "Tell a partial truth", 
          emoji: "💭", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Courage Challenge 4",
      question: "How should you respond to group teasing?",
      options: [
        { 
          text: "Speak against group teasing and defend the victim", 
          emoji: "🗣️", 
          isCorrect: true
        },
        { 
          text: "Join in the teasing", 
          emoji: "😄", 
          isCorrect: false
        },
        { 
          text: "Stay quiet and laugh along", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Only speak up if it's your friend", 
          emoji: "💭", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Courage Challenge 5",
      question: "What should you do when a friend faces injustice?",
      options: [
        { 
          text: "Stay out of it", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Support your friend and stand against injustice", 
          emoji: "🤝", 
          isCorrect: true
        },
        { 
          text: "Only help if others are watching", 
          emoji: "👀", 
          isCorrect: false
        },
        { 
          text: "Wait for someone else to help", 
          emoji: "⏳", 
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
      title="Badge: Courage Hero"
      score={score}
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/moral-values/teen/group-project-story"
      nextGameIdProp="moral-teen-61"
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

export default BadgeCourageHero;

