import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeScamSpotterKid = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-90";
  const gameData = getGameDataById(gameId);
  
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

  const gameContent = t("financial-literacy.kids.badge-scam-spotter-kid", { returnObjects: true });
  const challenges = Array.isArray(gameContent?.challenges) ? gameContent.challenges : [];

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
      title={gameContent?.title || "Badge: Scam Spotter Kid"}
      subtitle={showResult ? gameContent?.subtitleComplete : t("financial-literacy.kids.badge-scam-spotter-kid.challengeLabel", { current: challenge + 1, total: challenges.length })}
      showGameOver={showResult}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/finance/kids/lost-coin-story-game"
      nextGameIdProp="finance-kids-91"
      gameType="finance"
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === challenges.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && currentChallenge ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-2">{currentChallenge.title}</h3>
              <p className="text-white text-lg mb-6">
                {currentChallenge.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentChallenge.options.map((option, idx) => (
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
              
              {answered && (
                <div className={`mt-4 p-4 rounded-xl ${
                  currentChallenge.options[selectedAnswer]?.isCorrect
                    ? "bg-green-500/20 border border-green-500/30"
                    : "bg-red-500/20 border border-red-500/30"
                }`}>
                  <p className="text-white font-semibold">
                    {currentChallenge.options[selectedAnswer]?.isCorrect
                      ? currentChallenge.feedback.correct
                      : currentChallenge.feedback.wrong}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {finalScore >= 4 ? (
              <div>
                <div className="text-6xl mb-4">{gameContent?.badgeEmoji || "🏆"}</div>
                <h3 className="text-3xl font-bold text-white mb-4">{gameContent?.badgeTitle || "Scam Spotter Badge Earned!"}</h3>
                <p className="text-white/90 text-lg mb-6">
                  {t("financial-literacy.kids.badge-scam-spotter-kid.resultGreatDescription", { finalScore, total: challenges.length })}
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">{gameContent?.achievementTitle || "🎉 Achievement Unlocked!"}</h4>
                  <p className="text-xl">{gameContent?.badgeName || "Badge: Scam Spotter Kid"}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">{gameContent?.scamAwarenessTitle || "Scam Awareness"}</h4>
                    <p className="text-white/90 text-sm">
                      {gameContent?.scamAwarenessDescription || "You learned to recognize phone scams, fake websites, suspicious messages, and online strangers!"}
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">{gameContent?.safetySkillsTitle || "Safety Skills"}</h4>
                    <p className="text-white/90 text-sm">
                      {gameContent?.safetySkillsDescription || "These skills will help keep you and your family safe from online and offline scams!"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">{gameContent?.practiceEmoji || "💪"}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{gameContent?.practiceTitle || "Keep Learning!"}</h3>
                <p className="text-white/90 text-lg mb-4">
                  {t("financial-literacy.kids.badge-scam-spotter-kid.resultPracticeDescription", { finalScore, total: challenges.length })}
                </p>
                <p className="text-white/90 mb-6">
                  {gameContent?.practiceTip || "Remember, scammers often pretend to offer free gifts, fake prizes, or emergency help to trick you. Always check with your parents!"}
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  {gameContent?.tryAgainButton || "Try Again"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeScamSpotterKid;

