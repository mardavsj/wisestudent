import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const AIEthicsBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-kids-80");
  const gameId = gameData?.id || "dcos-kids-80";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for AIEthicsBadge, using fallback ID");
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
      title: "AI Ethics Challenge 1",
      question: "How should you use AI tools?",
      options: [
        { 
          text: "Used AI tools responsibly", 
          emoji: "🤖", 
          isCorrect: true
        },
        { 
          text: "Use AI to cheat", 
          emoji: "📚", 
          isCorrect: false
        },
        { 
          text: "Use AI for everything", 
          emoji: "🔄", 
          isCorrect: false
        },
        { 
          text: "Never use AI", 
          emoji: "🚫", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "AI Ethics Challenge 2",
      question: "What should you do before sharing AI-generated content?",
      options: [
        { 
          text: "Share immediately", 
          emoji: "📤", 
          isCorrect: false
        },
        { 
          text: "Checked AI facts before sharing", 
          emoji: "🔍", 
          isCorrect: true
        },
        { 
          text: "Believe everything AI says", 
          emoji: "🤖", 
          isCorrect: false
        },
        { 
          text: "Don't verify anything", 
          emoji: "❓", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "AI Ethics Challenge 3",
      question: "What should you do with personal data when using AI?",
      options: [
        { 
          text: "Share all personal data with AI", 
          emoji: "📱", 
          isCorrect: false
        },
        
        { 
          text: "Give AI your passwords", 
          emoji: "🔑", 
          isCorrect: false
        },
        { 
          text: "Share your address with AI", 
          emoji: "🏠", 
          isCorrect: false
        },
        { 
          text: "Did not share personal data with AI", 
          emoji: "🔒", 
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      title: "AI Ethics Challenge 4",
      question: "What should you do when using AI help?",
      options: [
        { 
          text: "Claim AI work as your own", 
          emoji: "📝", 
          isCorrect: false
        },
       
        { 
          text: "Never mention AI", 
          emoji: "🤫", 
          isCorrect: false
        },
         { 
          text: "Gave credit when using AI help", 
          emoji: "✍️", 
          isCorrect: true
        },
        { 
          text: "Hide that you used AI", 
          emoji: "🙈", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "AI Ethics Challenge 5",
      question: "How can you help others use AI safely?",
      options: [
        { 
          text: "Tell them to use AI for everything", 
          emoji: "🤖", 
          isCorrect: false
        },
        { 
          text: "Encouraged friends to use AI safely", 
          emoji: "💬", 
          isCorrect: true
        },
        { 
          text: "Don't help anyone", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Share unsafe AI practices", 
          emoji: "📢", 
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
      title="Badge: AI Ethics"
      score={score}
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/dcos/kids/kind-vs-mean-quiz"
      nextGameIdProp="dcos-kids-81"
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

export default AIEthicsBadge;

