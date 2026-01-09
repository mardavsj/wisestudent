import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RespectChampionBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-teen-90");
  const gameId = gameData?.id || "dcos-teen-90";
  
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
    title: "Respecting Differences",
    question: "What should you do when you see different opinions?",
    options: [
      { 
        text: "Respect different opinions and beliefs", 
        emoji: "🤝", 
        isCorrect: true
      },
      { 
        text: "Insult different opinions", 
        emoji: "😡", 
        isCorrect: false
      },
      { 
        text: "Mock different beliefs", 
        emoji: "😞", 
        isCorrect: false
      },
      { 
        text: "Ignore different opinions", 
        emoji: "😐", 
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    title: "Standing Against Hate",
    question: "What should you do when you see hateful comments?",
    options: [
      { 
        text: "Join in the hate", 
        emoji: "😡", 
        isCorrect: false
      },
      { 
        text: "Ignore hateful comments", 
        emoji: "😐", 
        isCorrect: false
      },
      { 
        text: "Stand up against hateful comments", 
        emoji: "🛡️", 
        isCorrect: true
      },
      { 
        text: "Share hateful comments", 
        emoji: "📤", 
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    title: "Inclusive Behavior",
    question: "How should you treat others online?",
    options: [
      { 
        text: "Exclude certain people", 
        emoji: "🚫", 
        isCorrect: false
      },
      { 
        text: "Include everyone respectfully", 
        emoji: "👥", 
        isCorrect: true
      },
      { 
        text: "Be disrespectful to others", 
        emoji: "😡", 
        isCorrect: false
      },
      { 
        text: "Ignore others' feelings", 
        emoji: "😐", 
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    title: "Promoting Respect",
    question: "What should you do to promote respect?",
    options: [
      { 
        text: "Promote disrespect", 
        emoji: "😡", 
        isCorrect: false
      },
      { 
        text: "Ignore respect", 
        emoji: "😐", 
        isCorrect: false
      },
      { 
        text: "Promote respect in online spaces", 
        emoji: "🌟", 
        isCorrect: true
      },
      { 
        text: "Share disrespectful content", 
        emoji: "📤", 
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    title: "Building Community",
    question: "How can you help build a respectful community?",
    options: [
     
      { 
        text: "Create division in the community", 
        emoji: "😡", 
        isCorrect: false
      },
      { 
        text: "Ignore community building", 
        emoji: "😐", 
        isCorrect: false
      },
      { 
        text: "Promote conflict", 
        emoji: "⚔️", 
        isCorrect: false
      },
       { 
        text: "Help build a respectful online community", 
        emoji: "🤝", 
        isCorrect: true
      },
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
      title="Badge: Respect Champion"
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      score={score}
      currentLevel={challenge + 1}
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/dcos/teens/entrepreneur-story"
      nextGameIdProp="dcos-teen-91"
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
                <h3 className="text-2xl font-bold text-white mb-4">Respect Champion Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} challenges correct!
                  You're a true Respect Champion!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Respect different opinions, stand up against hate, include everyone, promote respect, and help build a respectful online community!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {challenges.length} challenges correct.
                  Practice makes perfect with respect!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Respect different opinions, stand against hate, include everyone, promote respect, and build a respectful community!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RespectChampionBadge;

