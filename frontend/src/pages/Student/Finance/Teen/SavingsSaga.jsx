import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SavingsSaga = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-11");
  const gameId = gameData?.id || "finance-teens-11";
  const gameContent = t("financial-literacy.teens.savings-saga", { returnObjects: true });
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = Array.isArray(gameContent?.questions) ? gameContent.questions : [];

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
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const currentQ = questions[currentQuestion];

  return (
    <GameShell
      title={gameContent?.title || "Savings Saga"}
      score={score}
      subtitle={
        !showResult 
          ? t("financial-literacy.teens.savings-saga.subtitleProgress", {
              current: currentQuestion + 1,
              total: questions.length,
              defaultValue: "Question {{current}} of {{total}}"
            })
          : gameContent?.subtitleComplete || "Story Complete!"
      }
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/finance/teen/spending-quiz"
      nextGameIdProp="finance-teens-12"
      gameType="finance"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && currentQ ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">
                  {t("financial-literacy.teens.savings-saga.subtitleProgress", {
                    current: currentQuestion + 1,
                    total: questions.length,
                    defaultValue: "Question {{current}} of {{total}}"
                  })}
                </span>
                <span className="text-yellow-400 font-bold">
                  {t("financial-literacy.teens.savings-saga.scoreLabel", {
                    score,
                    total: questions.length,
                    defaultValue: "Score: {{score}}/{{total}}"
                  })}
                </span>
              </div>
              
              <p className="text-white text-lg mb-6 text-center">
                {currentQ.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQ.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    disabled={answered}
                    className={`bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400 hover:scale-100"
                          : "bg-red-500/20 border-2 border-red-400 opacity-75 hover:scale-100"
                        : "hover:scale-105"
                    } disabled:cursor-not-allowed`}
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="text-3xl mb-3">{option.emoji}</div>
                      <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                      {option.description ? (
                        <p className="text-white/90 text-sm">{option.description}</p>
                      ) : null}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 4 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {gameContent?.wizardTitle || "Financial Wizard!"}
                </h3>
                <p className="text-white/90 text-lg mb-4">
                  {t("financial-literacy.teens.savings-saga.perfectScoreMsg", {
                    score,
                    total: questions.length,
                    defaultValue: `You got {{score}} out of {{total}} questions correct! You've mastered advanced saving concepts!`
                  })}
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>{t("financial-literacy.teens.savings-saga.coinsLabel", { count: score })}</span>
                </div>
                <p className="text-white/80">
                  {gameContent?.lessonLabel || "Lesson: Smart financial decisions today shape your secure tomorrow!"}
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {gameContent?.studyTitle || "Study Up!"}
                </h3>
                <p className="text-white/90 text-lg mb-4">
                  {t("financial-literacy.teens.savings-saga.lowScoreMsg", {
                    score,
                    total: questions.length,
                    defaultValue: `You got {{score}} out of {{total}} questions correct. Review advanced saving concepts and try again!`
                  })}
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  {gameContent?.tryAgain || "Try Again"}
                </button>
                <p className="text-white/80 text-sm">
                  {gameContent?.tipLabel || "Tip: Master compound interest, inflation effects, and strategic allocation for financial success!"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SavingsSaga;


