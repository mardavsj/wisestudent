import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SimulationMonthlyMoney = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-8";
  const gameData = getGameDataById(gameId);
  const gameContent = t("financial-literacy.teens.simulation-monthly-money", { returnObjects: true });
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenarios = Array.isArray(gameContent?.scenarios) ? gameContent.scenarios : [];

  const handleChoice = (selectedChoice) => {
    const scenario = scenarios[currentScenario];
    const isCorrect = scenario.choices.find(opt => opt.id === selectedChoice)?.isCorrect;

    const newChoices = [...choices, { 
      scenarioId: scenario.id, 
      choice: selectedChoice,
      isCorrect: !!isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    // Move to next scenario or show results
    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentScenario(prev => prev + 1);
      }, isCorrect ? 1000 : 500); // Delay if correct to show animation
    } else {
      setTimeout(() => {
        // Calculate final score
        const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
        setFinalScore(correctAnswers);
        setShowResult(true);
      }, 500);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentScenario(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/finance/teen/reflex-wise-use");
  };

  const current = scenarios[currentScenario];

  return (
    <GameShell
      title={gameContent?.title || "Simulation: Monthly Money"}
      score={coins}
      subtitle={
        !showResult 
          ? t("financial-literacy.teens.simulation-monthly-money.subtitleProgress", {
              current: currentScenario + 1,
              total: scenarios.length,
              defaultValue: "Scenario {{current}} of {{total}}"
            })
          : gameContent?.subtitleComplete || "Great Simulation!"
      }
      onNext={handleNext}
      nextGamePathProp="/student/finance/teen/reflex-wise-use"
      nextGameIdProp="finance-teens-9"
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      gameId="finance-teens-8"
      gameType="finance"
      totalLevels={scenarios.length}
      currentLevel={currentScenario + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && current ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">
                  {t("financial-literacy.teens.simulation-monthly-money.subtitleProgress", {
                    current: currentScenario + 1,
                    total: scenarios.length,
                    defaultValue: "Scenario {{current}} of {{total}}"
                  })}
                </span>
                <span className="text-yellow-400 font-bold">
                  {t("financial-literacy.teens.simulation-monthly-money.scoreLabel", {
                    score: coins,
                    defaultValue: "Score: {{score}}"
                  })}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{current.title}</h3>
              <p className="text-white text-lg mb-6">
                {current.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {current.choices.map(choice => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice.id)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-3xl mb-3">{choice.emoji}</div>
                      <h4 className="font-bold text-lg mb-2">{choice.text}</h4>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {gameContent?.perfectScoreTitle || "Great Simulation!"}
                </h3>
                <p className="text-white/90 text-lg mb-4">
                  {t("financial-literacy.teens.simulation-monthly-money.perfectScoreMsg", {
                    score: finalScore,
                    total: scenarios.length,
                    defaultValue: "You made {{score}} smart money decisions out of {{total}} scenarios! You're learning to manage money wisely!"
                  })}
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>{t("financial-literacy.teens.simulation-monthly-money.coinsLabel", { count: coins })}</span>
                </div>
                <p className="text-white/80">
                  {gameContent?.lessonLabel || "You understand the importance of saving, prioritizing needs over wants, and avoiding risky financial decisions!"}
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {gameContent?.keepLearningTitle || "Keep Learning!"}
                </h3>
                <p className="text-white/90 text-lg mb-4">
                  {t("financial-literacy.teens.simulation-monthly-money.lowScoreMsg", {
                    score: finalScore,
                    total: scenarios.length,
                    defaultValue: "You made {{score}} smart money decisions out of {{total}} scenarios. Remember, saving money and making thoughtful financial decisions are important!"
                  })}
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  {gameContent?.tryAgain || "Try Again"}
                </button>
                <p className="text-white/80 text-sm">
                  {gameContent?.tipLabel || "Try to choose the option that saves money and makes thoughtful financial decisions."}
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default SimulationMonthlyMoney;