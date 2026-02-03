import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const BadgeMasterSustainabilityLeader = () => {
  const location = useLocation();
  
  const gameData = getGameDataById("sustainability-teens-100");
  const gameId = gameData?.id || "sustainability-teens-100";
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 1;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const { nextGamePath, nextGameId } = (() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    try {
      const games = getSustainabilityTeenGames({});
      const currentGame = games.find(g => g.id === gameId);
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : null,
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    return { nextGamePath: null, nextGameId: null };
  })();

  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const challenges = [
    {
      id: 1,
      question: "What defines a master sustainability leader?",
      options: [
        { id: 'b', text: "Personal gain focus", emoji: "💰", isCorrect: false },
        { id: 'a', text: "Systemic change inspiration", emoji: "🌱", isCorrect: true },
        { id: 'c', text: "Avoids responsibility", emoji: "🏃", isCorrect: false },
        { id: 'd', text: "Works in isolation", emoji: "👤", isCorrect: false }
      ]
    },
    {
      id: 2,
      question: "How should a master leader approach complex sustainability challenges?",
      options: [
        { id: 'a', text: "Systems thinking & collaboration", emoji: "🤝", isCorrect: true },
        { id: 'b', text: "Individual decision-making", emoji: "👤", isCorrect: false },
        { id: 'c', text: "Short-term thinking", emoji: "⚡", isCorrect: false },
        { id: 'd', text: "Avoid complexity", emoji: "😥", isCorrect: false }
      ]
    },
    {
      id: 3,
      question: "What is the primary goal of a sustainability leader?",
      options: [
        { id: 'b', text: "Personal recognition", emoji: "🏆", isCorrect: false },
        { id: 'c', text: "Maximizing profits", emoji: "💰", isCorrect: false },
        { id: 'a', text: "Positive environmental impact", emoji: "🌍", isCorrect: true },
        { id: 'd', text: "Gaining authority", emoji: "👑", isCorrect: false }
      ]
    },
    {
      id: 4,
      question: "How should a master leader handle resistance to sustainability initiatives?",
      options: [
        { id: 'b', text: "With force & authority", emoji: "💪", isCorrect: false },
        { id: 'c', text: "Ignore resistance", emoji: "🙉", isCorrect: false },
        { id: 'd', text: "Avoid difficult conversations", emoji: "🤐", isCorrect: false },
        { id: 'a', text: "Empathy & collaborative problem-solving", emoji: "💬", isCorrect: true },
      ]
    },
    {
      id: 5,
      question: "What marks the completion of a master sustainability leader's journey?",
      options: [
        { id: 'a', text: "Lasting positive change", emoji: "🌱", isCorrect: true },
        { id: 'b', text: "Personal awards", emoji: "🏆", isCorrect: false },
        { id: 'c', text: "Accumulating authority", emoji: "👑", isCorrect: false },
        { id: 'd', text: "Completing a single project", emoji: "✅", isCorrect: false }
      ]
    }
  ];

  const handleAnswer = (option) => {
    if (answered) return;

    setAnswered(true);
    resetFeedback();

    if (option.isCorrect) {
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

  const handleNext = () => {
    if (nextGamePath) {
      window.location.href = nextGamePath;
    } else {
      window.location.href = "/games/sustainability/teens";
    }
  };

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: Master Sustainability Leader"
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      score={score}
      currentLevel={challenge + 1}
      totalLevels={challenges.length}
      maxScore={challenges.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Challenge {challenge + 1}/{challenges.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}</span>
              </div>
              
              {/* <h3 className="text-xl font-bold text-white mb-4">Master Sustainability Leader Challenge</h3> */}
              
              <p className="text-white text-lg mb-6">{currentChallenge.question}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentChallenge.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-2 rounded-lg transition-all duration-200 flex flex-col items-center justify-center space-y-1 text-sm"
                  >
                    <span className="text-xl">{option.emoji}</span>
                    <span>{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="text-center text-white/70 text-sm">
              Demonstrate your mastery as a sustainability leader
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Badge Earned!</h2>
              <div className="text-6xl mb-4">🏆</div>
              <p className="text-white/90 mb-2">Master Sustainability Leader Badge</p>
              <p className="text-white/90 mb-2">Score: {score}/{challenges.length}</p>
              <p className="text-white/70 mb-6">
                {score === challenges.length 
                  ? "Perfect score! You're a true master sustainability leader!" 
                  : score >= challenges.length / 2 
                  ? "Great job! You understand sustainability leadership principles." 
                  : "Keep learning about sustainable leadership."}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  Try Again
                </button>
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  Back to Games
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeMasterSustainabilityLeader;