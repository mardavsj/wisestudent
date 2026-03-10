import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeYoungEarner = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-80";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const gameContent = t("financial-literacy.kids.badge-young-earner", { returnObjects: true });
  const challenges = Array.isArray(gameContent?.challenges) ? gameContent.challenges : [];
  
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const handleAnswer = (isCorrect, optionIndex) => {
    if (answered) return;
    
    setAnswered(true);
    setSelectedAnswer(optionIndex);
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
    }, 15000);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setChallenge(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    resetFeedback();
  };

  const currentChallenge = challenges[challenge];
  const finalScore = score;

  return (
    <GameShell
      title={gameContent?.title || "Badge: Young Earner"}
      subtitle={!showResult ? t("financial-literacy.kids.badge-young-earner.subtitleProgress", { current: challenge + 1, total: challenges.length }) : gameContent?.subtitleComplete}
      currentLevel={challenge + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="finance"
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="text-center text-white space-y-8">
        {!showResult && challenges[challenge] && (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
            <h3 className="text-2xl font-bold mb-4">{challenges[challenge].question}</h3>
            <p className="text-white/70 mb-6">{gameContent?.scoreLabel} {score}/{challenges.length}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenges[challenge].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option.isCorrect, idx)}
                  disabled={answered}
                  className={`bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3 ${
                    answered && selectedAnswer === idx
                      ? option.isCorrect
                        ? "ring-4 ring-green-400"
                        : "ring-4 ring-red-400"
                      : ""
                  }`}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="font-bold text-lg">{option.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {showResult && (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">{gameContent?.resultGreatEmoji}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{gameContent?.resultGreatTitle}</h3>
                <p className="text-white/90 text-lg mb-4">{t("financial-literacy.kids.badge-young-earner.resultGreatDescription", { score: finalScore, total: challenges.length })}</p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{finalScore} Coins</span>
                </div>
                <p className="text-white/80">{gameContent?.wisdomDescription}</p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">{gameContent?.resultKeepEmoji}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{gameContent?.resultKeepTitle}</h3>
                <p className="text-white/90 text-lg mb-4">{t("financial-literacy.kids.badge-young-earner.resultKeepDescription", { score: finalScore, total: challenges.length })}</p>
                <p className="text-white/80 text-sm">{gameContent?.resultKeepTip}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeYoungEarner;

