import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { Moon, Clock, Bed, Battery, BookOpenCheck } from 'lucide-react';

const SleepChampBadge = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-70");
  const gameId = gameData?.id || "brain-kids-70";
  
  const gameContent = t("brain-health.kids.sleep-champ-badge", { returnObjects: true });
  
  // Define icons and colors for each challenge index
  const challengeAssets = useMemo(() => [
    { icon: <Moon className="w-8 h-8" />, color: "bg-indigo-500" },
    { icon: <BookOpenCheck className="w-8 h-8" />, color: "bg-purple-500" },
    { icon: <Clock className="w-8 h-8" />, color: "bg-blue-500" },
    { icon: <Battery className="w-8 h-8" />, color: "bg-green-500" },
    { icon: <Bed className="w-8 h-8" />, color: "bg-teal-500" }
  ], []);

  const challenges = useMemo(() => {
    const rawChallenges = Array.isArray(gameContent?.challenges) ? gameContent.challenges : [];
    return rawChallenges.map((challenge, index) => ({
      ...challenge,
      icon: challengeAssets[index]?.icon || <Moon className="w-8 h-8" />,
      color: challengeAssets[index]?.color || "bg-indigo-500"
    }));
  }, [gameContent, challengeAssets]);

  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SleepChampBadge, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const handleChoice = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    const isLastChallenge = challengeIndex === challenges.length - 1;
    
    setTimeout(() => {
      if (isLastChallenge) {
        setShowResult(true);
      } else {
        setChallengeIndex(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 500);
  };

  const currentChallenge = challenges[challengeIndex];

  return (
    <GameShell
      title={gameContent?.title || "Badge: Sleep Champ"}
      score={score}
      subtitle={
        showResult 
          ? gameContent?.subtitleDefault || "Badge Complete!" 
          : t("brain-health.kids.sleep-champ-badge.subtitlePlaying", {
              current: challengeIndex + 1,
              total: challenges.length,
              defaultValue: `Challenge ${challengeIndex + 1} of ${challenges.length}`
            })
      }
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGameIdProp="brain-kids-71"
      gameType="brain"
      totalLevels={challenges.length}
      currentLevel={challengeIndex + 1}
      maxScore={challenges.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/brain-health/kids"
    >
      <div className="space-y-8">
        {!showResult && currentChallenge ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">
                  {t("brain-health.kids.sleep-champ-badge.challengeLabel", {
                    current: challengeIndex + 1,
                    total: challenges.length,
                    defaultValue: `Challenge ${challengeIndex + 1}/${challenges.length}`
                  })}
                </span>
                <span className="text-yellow-400 font-bold">
                  {t("brain-health.kids.sleep-champ-badge.scoreLabel", {
                    current: score,
                    total: challenges.length,
                    defaultValue: `Score: ${score}/${challenges.length}`
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
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentChallenge.question}
              </p>
              
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
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default SleepChampBadge;

