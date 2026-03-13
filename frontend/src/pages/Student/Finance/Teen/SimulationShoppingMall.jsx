import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SimulationShoppingMall = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-18";
  const gameData = getGameDataById(gameId);
  const gameContent = t("financial-literacy.teens.simulation-shopping-mall", { returnObjects: true });
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const scenarios = Array.isArray(gameContent?.scenarios) ? gameContent.scenarios : [];

  const handleAnswer = (optionId) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    const scenario = scenarios[currentScenario];
    const selectedOption = scenario.options.find(opt => opt.id === optionId);
    const isCorrect = !!selectedOption?.isCorrect;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    const isLastScenario = currentScenario === scenarios.length - 1;
    
    setTimeout(() => {
      if (isLastScenario) {
        setShowResult(true);
      } else {
        setCurrentScenario(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentScenario(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const current = scenarios[currentScenario];

  return (
    <GameShell
      title={gameContent?.title || "Simulation: Shopping Mall"}
      subtitle={
        !showResult 
          ? t("financial-literacy.teens.simulation-shopping-mall.subtitleProgress", {
              current: currentScenario + 1,
              total: scenarios.length,
              defaultValue: "Scenario {{current}} of {{total}}"
            })
          : gameContent?.subtitleComplete || "Simulation Complete!"
      }
      score={score}
      currentLevel={currentScenario + 1}
      totalLevels={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={scenarios.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/reflex-control"
      nextGameIdProp="finance-teens-19"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="finance"
    >
      <div className="space-y-8">
        {!showResult && current ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">
                  {t("financial-literacy.teens.simulation-shopping-mall.subtitleProgress", {
                    current: currentScenario + 1,
                    total: scenarios.length,
                    defaultValue: "Scenario {{current}} of {{total}}"
                  })}
                </span>
                <span className="text-yellow-400 font-bold">
                  {t("financial-literacy.teens.simulation-shopping-mall.scoreLabel", {
                    score,
                    total: scenarios.length,
                    defaultValue: "Score: {{score}}/{{total}}"
                  })}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{current.title}</h3>
              <p className="text-white text-lg mb-6">
                {current.description}
              </p>
              
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <span className="text-white font-semibold text-lg">{gameContent?.budgetLabel || "Budget: "}</span>
                  <span className="text-green-400 font-bold text-2xl">₹{current.budget}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {current.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-center transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : "bg-red-500/20 border-2 border-red-400 opacity-75"
                        : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="text-4xl">{option.emoji}</span>
                      <span className="font-semibold text-lg">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {gameContent?.perfectScoreTitle || "Great Financial Decisions!"}
                </h3>
                <p className="text-white/90 text-lg mb-4">
                  {t("financial-literacy.teens.simulation-shopping-mall.perfectScoreMsg", {
                    score,
                    total: scenarios.length,
                    defaultValue: "You got {{score}} out of {{total}} scenarios correct! You understand smart shopping decisions!"
                  })}
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>{t("financial-literacy.teens.simulation-shopping-mall.coinsLabel", { count: score })}</span>
                </div>
                <p className="text-white/80">
                  {gameContent?.lessonLabel || "Lesson: Balancing needs, wants, and savings leads to smart financial choices!"}
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                   {gameContent?.keepLearningTitle || "Keep Learning!"}
                </h3>
                <p className="text-white/90 text-lg mb-4">
                  {t("financial-literacy.teens.simulation-shopping-mall.lowScoreMsg", {
                    score,
                    total: scenarios.length,
                    defaultValue: "You got {{score}} out of {{total}} scenarios correct. Remember to balance needs, wants, and savings!"
                  })}
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  {gameContent?.tryAgain || "Try Again"}
                </button>
                <p className="text-white/80 text-sm">
                  {gameContent?.tipLabel || "Tip: Always prioritize needs first, then some wants, and save the rest!"}
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default SimulationShoppingMall;