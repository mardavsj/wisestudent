import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateBudgetFreedom = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-26");
  const gameId = gameData?.id || "finance-teens-26";
  const gameContent = t("financial-literacy.teens.debate-budget-freedom", { returnObjects: true });
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const debateTopics = Array.isArray(gameContent?.debateTopics) ? gameContent.debateTopics : [];

  const handlePositionSelect = (positionId) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    const topic = debateTopics[currentRound];
    const isCorrect = topic.positions.find(pos => pos.id === positionId)?.isCorrect;

    setSelectedPosition(positionId);
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    const isLastRound = currentRound === debateTopics.length - 1;
    
    if (isLastRound) {
      setGameComplete(true);
      setTimeout(() => setShowResult(true), 500);
    } else {
      setTimeout(() => {
        setCurrentRound(prev => prev + 1);
        setSelectedPosition(null);
        setAnswered(false);
      }, 500);
    }
  };

  return (
    <GameShell
      title={gameContent?.title || "Debate: Budget Freedom"}
      subtitle={!showResult 
        ? t("financial-literacy.teens.debate-budget-freedom.subtitleProgress", {
            current: currentRound + 1,
            total: debateTopics.length,
            defaultValue: "Round {{current}} of {{total}}",
          })
        : (gameContent?.subtitleComplete || "Debate Complete!")
      }
      score={score}
      currentLevel={currentRound + 1}
      totalLevels={debateTopics.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={debateTopics.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/journal-planning"
      nextGameIdProp="finance-teens-27"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="finance"
    >
      <div className="space-y-8">
        {!showResult && debateTopics[currentRound] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">
                  {t("financial-literacy.teens.debate-budget-freedom.roundLabel", {
                    current: currentRound + 1,
                    total: debateTopics.length,
                    defaultValue: "Round {{current}}/{{total}}",
                  })}
                </span>
                <span className="text-yellow-400 font-bold">
                  {t("financial-literacy.teens.debate-budget-freedom.scoreLabel", {
                    score,
                    total: debateTopics.length,
                    defaultValue: "Score: {{score}}/{{total}}",
                  })}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4">{debateTopics[currentRound].scenario}</h3>
              <h4 className="text-lg font-semibold text-white/90 mb-4">{gameContent?.takePosition || "Take a Position:"}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {debateTopics[currentRound].positions.map((position) => (
                  <button
                    key={position.id}
                    onClick={() => handlePositionSelect(position.id)}
                    disabled={answered}
                    className={`w-full text-left p-6 rounded-2xl transition-all transform hover:scale-105 border ${
                      answered && selectedPosition === position.id
                        ? position.isCorrect
                          ? "bg-green-500/20 border-green-400 ring-4 ring-green-400"
                          : "bg-red-500/20 border-red-400 ring-4 ring-red-400"
                        : selectedPosition === position.id
                        ? "bg-blue-500/30 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border-white/20"
                    } ${answered ? "opacity-75 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">{position.emoji}</span>
                      <div className="font-bold text-lg text-white">{position.text}</div>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-white/80">
                      {position.points.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">{gameContent?.result?.winEmoji || "🎉"}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{gameContent?.result?.winTitle || "Debate Master!"}</h3>
                <p className="text-white/90 text-lg mb-4">
                  {t("financial-literacy.teens.debate-budget-freedom.result.winMessage", {
                    score,
                    total: debateTopics.length,
                    defaultValue: "You scored {{score}} out of {{total}}! You understand how budgeting empowers financial freedom!",
                  })}
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>
                    {t("financial-literacy.teens.debate-budget-freedom.result.coinsEarned", {
                      score,
                      defaultValue: "+{{score}} Coins",
                    })}
                  </span>
                </div>
                <p className="text-white/80">
                  {gameContent?.result?.lesson || "Lesson: Budgeting gives you control, enables smart choices, and allows guilt-free spending!"}
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">{gameContent?.result?.loseEmoji || "💪"}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{gameContent?.result?.loseTitle || "Keep Learning!"}</h3>
                <p className="text-white/90 text-lg mb-4">
                  {t("financial-literacy.teens.debate-budget-freedom.result.loseMessage", {
                    score,
                    total: debateTopics.length,
                    defaultValue: "You scored {{score}} out of {{total}}. Remember, budgeting helps you take control of your finances!",
                  })}
                </p>
                <button
                  onClick={() => {
                    setShowResult(false);
                    setCurrentRound(0);
                    setScore(0);
                    setSelectedPosition(null);
                    setAnswered(false);
                    setGameComplete(false);
                    resetFeedback();
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  {gameContent?.result?.tryAgain || "Try Again"}
                </button>
                <p className="text-white/80 text-sm">
                  {gameContent?.result?.tip || "Tip: Budgeting gives you freedom by helping you plan, save, and make informed financial decisions."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateBudgetFreedom;