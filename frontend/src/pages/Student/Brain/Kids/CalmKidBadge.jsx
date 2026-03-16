import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getBrainKidsGames } from "../../../../pages/Games/GameCategories/Brain/kidGamesData";
import { Award, Wind, Flower2, Sun, Waves, BookOpenCheck } from 'lucide-react';

const CalmKidBadge = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-40");
  const gameId = gameData?.id || "brain-kids-40";
  
  const gameContent = t("brain-health.kids.calm-kid-badge", { returnObjects: true });
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for CalmKidBadge, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    // First, try to get from location.state (passed from GameCategoryPage)
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    // Fallback: find next game from game data
    try {
      const games = getBrainKidsGames({});
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
  }, [location.state, gameId]);
  
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const challenges = useMemo(() => {
    const rawChallenges = Array.isArray(gameContent?.challenges) ? gameContent.challenges : [];
    const icons = [
      <Wind className="w-8 h-8" />,
      <BookOpenCheck className="w-8 h-8" />,
      <Flower2 className="w-8 h-8" />,
      <Sun className="w-8 h-8" />,
      <Waves className="w-8 h-8" />
    ];
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-cyan-500"
    ];

    return rawChallenges.map((c, idx) => ({
      ...c,
      icon: icons[idx] || icons[0],
      color: colors[idx] || colors[0]
    }));
  }, [gameContent]);

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

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Calm Kid Badge game completed! Score: ${score}/${challenges.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId, challenges.length]);

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title={gameContent?.title || "Badge: Calm Kid"}
      score={score}
      subtitle={
        showResult
          ? gameContent?.subtitleComplete || "Badge Complete!"
          : t("brain-health.kids.calm-kid-badge.subtitleProgress", {
              current: challenge + 1,
              total: challenges.length,
              defaultValue: `Challenge ${challenge + 1} of ${challenges.length}`,
            })
      }
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="brain"
      totalLevels={challenges.length}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/brain-health/kids"
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult && currentChallenge ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">
                {t("brain-health.kids.calm-kid-badge.challengeLabel", {
                    current: challenge + 1,
                    total: challenges.length,
                    defaultValue: `Challenge ${challenge + 1}/${challenges.length}`,
                  })}
              </span>
              <span className="text-yellow-400 font-bold">
                {t("brain-health.kids.calm-kid-badge.scoreLabel", {
                    score,
                    total: challenges.length,
                    defaultValue: `Score: ${score}/${challenges.length}`,
                  })}
              </span>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className={`${currentChallenge.color} p-3 rounded-lg mr-3`}>
                  {currentChallenge.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{currentChallenge.title}</h3>
                  <p className="text-white/70 text-sm">{currentChallenge.description}</p>
                </div>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentChallenge.question}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentChallenge.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedAnswer(index);
                    handleChoice(option.isCorrect);
                  }}
                  disabled={answered}
                  className={`p-6 rounded-2xl text-left transition-all transform ${
                    answered
                      ? option.isCorrect
                        ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                        : selectedAnswer === index
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
        ) : null}
      </div>
    </GameShell>
  );
};

export default CalmKidBadge;
