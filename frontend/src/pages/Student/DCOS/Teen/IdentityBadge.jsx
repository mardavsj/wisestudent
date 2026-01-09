import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const IdentityBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-teen-70");
  const gameId = gameData?.id || "dcos-teen-70";
  
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
    title: "Positive Achievements",
    question: "What should you share on social media?",
    options: [
      { 
        text: "Share only negative things", 
        isCorrect: false
      },
      { 
        text: "Post a positive achievement", 
        isCorrect: true
      },
      { 
        text: "Share everything", 
        isCorrect: false
      },
      { 
        text: "Do not share anything", 
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    title: "Encouraging Messages",
    question: "What kind of messages should you share?",
    options: [
      { 
        text: "Share discouraging messages", 
        isCorrect: false
      },
      { 
        text: "Share mean comments", 
        isCorrect: false
      },
      { 
        text: "Share an encouraging message", 
        isCorrect: true
      },
      { 
        text: "Share negative thoughts", 
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    title: "Negative Content",
    question: "What should you do with negative content?",
    options: [
      { 
        text: "Post negative content regularly", 
        isCorrect: false
      },
      { 
        text: "Avoid posting negative content", 
        isCorrect: true
      },
      { 
        text: "Share complaints publicly", 
        isCorrect: false
      },
      { 
        text: "Post mean comments", 
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    title: "Online Presence",
    question: "How should you build your online presence?",
    options: [
      { 
        text: "Build a respectful online presence", 
        isCorrect: true
      },
      { 
        text: "Build a negative presence", 
        isCorrect: false
      },
      { 
        text: "Post disrespectful content", 
        isCorrect: false
      },
      { 
        text: "Ignore your online presence", 
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    title: "Helping Others",
    question: "How can you help others build a positive identity?",
    options: [
      { 
        text: "Discourage others", 
        isCorrect: false
      },
      { 
        text: "Share negative comments about others", 
        isCorrect: false
      },
      { 
        text: "Help others build a positive identity", 
        isCorrect: true
      },
      { 
        text: "Ignore others' identity", 
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
      title="Badge: Positive Identity"
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      score={score}
      currentLevel={challenge + 1}
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/dcos/teens/bias-story"
      nextGameIdProp="dcos-teen-71"
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
                <h3 className="text-2xl font-bold text-white mb-4">Positive Identity Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} challenges correct!
                  You're building a positive identity!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Share positive achievements, encouraging messages, avoid negative content, build a respectful online presence, and help others build positive identity!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} challenges correct.
                  Practice makes perfect with building positive identity!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Share positive achievements, encouraging messages, avoid negative content, build a respectful presence, and help others!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default IdentityBadge;

