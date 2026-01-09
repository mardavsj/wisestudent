import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const OnlineSafetyBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-teen-10");
  const gameId = gameData?.id || "dcos-teen-10";
  
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
      title: "Password Safety",
      question: "What should you do with your passwords?",
      options: [
        { 
          text: "Never share passwords with anyone", 
          emoji: "🔐", 
          isCorrect: true
        },
        { 
          text: "Share passwords with close friends", 
          emoji: "👥", 
          isCorrect: false
        },
        { 
          text: "Use the same password everywhere", 
          emoji: "🔑", 
          isCorrect: false
        },
        { 
          text: "Write passwords on paper", 
          emoji: "📝", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Profile Privacy",
      question: "How should you set up your social media profile?",
      options: [
        { 
          text: "Make everything public", 
          emoji: "🌐", 
          isCorrect: false
        },
        { 
          text: "Keep social media profiles private", 
          emoji: "🔒", 
          isCorrect: true
        },
        { 
          text: "Share personal information publicly", 
          emoji: "📤", 
          isCorrect: false
        },
        { 
          text: "Accept all friend requests", 
          emoji: "👥", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "OTP Security",
      question: "What should you do with OTP codes?",
      options: [
        { 
          text: "Share OTP with friends if they ask", 
          emoji: "👥", 
          isCorrect: false
        },
        { 
          text: "Post OTP on social media", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          text: "Never share OTP codes with anyone", 
          emoji: "🚫", 
          isCorrect: true
        },
        { 
          text: "Share OTP if someone claims to be from bank", 
          emoji: "🏦", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Profile Pictures",
      question: "What type of profile picture is safest?",
      options: [
        { 
          text: "Use safe profile pictures (cartoons/avatars)", 
          emoji: "🎨", 
          isCorrect: true
        },
        { 
          text: "Use your real photo showing face", 
          emoji: "📸", 
          isCorrect: false
        },
        { 
          text: "Use photos with location visible", 
          emoji: "📍", 
          isCorrect: false
        },
        { 
          text: "Use photos with family members", 
          emoji: "👨‍👩‍👧", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "App Permissions",
      question: "What should you do with app permissions?",
      options: [
        { 
          text: "Grant all permissions to all apps", 
          emoji: "✅", 
          isCorrect: false
        },
        { 
          text: "Only grant necessary app permissions", 
          emoji: "📱", 
          isCorrect: true
        },
        { 
          text: "Don't check permissions at all", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Share permissions with friends", 
          emoji: "👥", 
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
      title="Badge: Online Safety"
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      score={score}
      currentLevel={challenge + 1}
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/dcos/teens/cyberbully-reflex"
      nextGameIdProp="dcos-teen-11"
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
                <h3 className="text-2xl font-bold text-white mb-4">Online Safety Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} challenges correct!
                  You're a true Online Safety Hero!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Protecting your passwords, privacy, and personal information keeps you safe online!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} challenges correct.
                  Practice makes perfect with online safety!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Never share passwords or OTPs, keep profiles private, use safe profile pictures, and only grant necessary permissions!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default OnlineSafetyBadge;

