import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const WellbeingBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-teen-30");
  const gameId = gameData?.id || "dcos-teen-30";
  
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
      title: "Screen Time Management",
      question: "What should you do to maintain digital wellbeing?",
      options: [
        { 
          text: "Spend all day on screens", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          text: "Limit screen time today", 
          emoji: "⏰", 
          isCorrect: true
        },
        { 
          text: "Never take breaks", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Ignore screen time limits", 
          emoji: "🙈", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Sleep Hygiene",
      question: "How should you manage your phone before sleep?",
      options: [
        { 
          text: "Use phone until late night", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          text: "Keep phone on all night", 
          emoji: "🌃", 
          isCorrect: false
        },
        { 
          text: "Got good sleep (turned off phone at 10 PM)", 
          emoji: "🌙", 
          isCorrect: true
        },
        { 
          text: "Check phone during sleep", 
          emoji: "😴", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Offline Activities",
      question: "What helps maintain digital wellbeing?",
      options: [
        { 
          text: "Only use screens all day", 
          emoji: "📺", 
          isCorrect: false
        },
        { 
          text: "Did offline activities", 
          emoji: "🏃", 
          isCorrect: true
        },
        { 
          text: "Never go outside", 
          emoji: "🏠", 
          isCorrect: false
        },
        { 
          text: "Ignore physical activities", 
          emoji: "😴", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Balance",
      question: "What's the key to digital wellbeing?",
      options: [
        { 
          text: "Only use technology", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          text: "Never use technology", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          text: "Balanced tech with other activities", 
          emoji: "⚖️", 
          isCorrect: true
        },
        { 
          text: "Use tech without breaks", 
          emoji: "⏰", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Health Priority",
      question: "What should be your priority?",
      options: [
        { 
          text: "Prioritize only technology", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          text: "Ignore health completely", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "Prioritized health and wellbeing", 
          emoji: "💚", 
          isCorrect: true
        },
        { 
          text: "Health doesn't matter", 
          emoji: "❌", 
          isCorrect: false
        }
      ]
    }
  ];

  const handleAnswer = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
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
    }, 2000);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setChallenge(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    resetFeedback();
  };

  return (
    <GameShell
      title="Badge: Digital Wellbeing"
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      score={score}
      currentLevel={challenge + 1}
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/dcos/teens/viral-post-story"
      nextGameIdProp="dcos-teen-31"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="dcos"
    >
      <div className="space-y-8">
        {!showResult && challenges[challenge] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Challenge {challenge + 1}/{challenges.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{challenges.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{challenges[challenge].title}</h3>
              <p className="text-white text-lg mb-6">
                {challenges[challenge].question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges[challenge].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedAnswer(idx);
                      handleAnswer(option.isCorrect);
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
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-white mb-4">Digital Wellbeing Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} challenges correct!
                  You're a true Digital Wellbeing Hero!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Balancing screen time, getting good sleep, doing offline activities, and prioritizing health leads to digital wellbeing!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} challenges correct.
                  Practice makes perfect with digital wellbeing!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Limit screen time, turn off phone before sleep, do offline activities, balance tech use, and prioritize health!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default WellbeingBadge;

