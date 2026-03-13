import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeWiseChooser = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-40");
  const gameId = gameData?.id || "finance-teens-40";
  const gameContent = t("financial-literacy.teens.badge-wise-chooser", { returnObjects: true });
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for BadgeWiseChooser, using fallback ID");
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

  const challenges = Array.isArray(gameContent?.challenges) ? gameContent.challenges : [];

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
      title={gameContent?.title || "Badge: Wise Chooser"}
      subtitle={!showResult 
        ? t("financial-literacy.teens.badge-wise-chooser.subtitleProgress", {
            current: challenge + 1,
            total: challenges.length,
            defaultValue: "Challenge {{current}} of {{total}}",
          })
        : (gameContent?.subtitleComplete || "Badge Complete!")
      }
      score={score}
      currentLevel={challenge + 1}
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/online-payment-story"
      nextGameIdProp="finance-teens-41"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="finance"
    >
      <div className="space-y-8">
        {!showResult && challenges[challenge] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">
                  {t("financial-literacy.teens.badge-wise-chooser.challengeLabel", {
                    current: challenge + 1,
                    total: challenges.length,
                    defaultValue: "Challenge {{current}}/{{total}}",
                  })}
                </span>
                <span className="text-yellow-400 font-bold">
                  {t("financial-literacy.teens.badge-wise-chooser.scoreLabel", {
                    score,
                    total: challenges.length,
                    defaultValue: "Score: {{score}}/{{total}}",
                  })}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{challenges[challenge].title}</h3>
              <p className="text-white text-lg mb-6">
                {challenges[challenge].question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges[challenge].options.map((option, idx) => (
                  <button
                    key={option.id || idx}
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
                <div className="text-5xl mb-4">{gameContent?.result?.winEmoji || "🏆"}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{gameContent?.result?.winTitle || "Wise Chooser Badge Earned!"}</h3>
                <p className="text-white/90 text-lg mb-4">
                  {t("financial-literacy.teens.badge-wise-chooser.result.winMessage", {
                    score,
                    total: challenges.length,
                    defaultValue: "You got {{score}} out of {{total}} challenges correct! You're a true Wise Chooser!",
                  })}
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>
                    {t("financial-literacy.teens.badge-wise-chooser.result.coinsEarned", {
                      score,
                      defaultValue: "+{{score}} Coins",
                    })}
                  </span>
                </div>
                <p className="text-white/80">
                  {gameContent?.result?.lesson || "Lesson: Wise choices prioritize needs over wants, helping you achieve financial wellness and build a secure future!"}
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">{gameContent?.result?.loseEmoji || "💪"}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{gameContent?.result?.loseTitle || "Keep Learning!"}</h3>
                <p className="text-white/90 text-lg mb-4">
                  {t("financial-literacy.teens.badge-wise-chooser.result.loseMessage", {
                    score,
                    total: challenges.length,
                    defaultValue: "You got {{score}} out of {{total}} challenges correct. Practice makes perfect with wise choosing!",
                  })}
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  {gameContent?.result?.tryAgain || "Try Again"}
                </button>
                <p className="text-white/80 text-sm">
                  {gameContent?.result?.tip || "Tip: Remember to prioritize needs (essential items) over wants (luxury items) to make wise financial choices!"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeWiseChooser;
