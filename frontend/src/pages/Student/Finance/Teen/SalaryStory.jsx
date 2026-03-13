import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SalaryStory = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-5";
  const gameData = getGameDataById(gameId);
  const gameContent = t("financial-literacy.teens.salary-story", { returnObjects: true });
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = Array.isArray(gameContent?.questions) ? gameContent.questions : [];

  const handleChoice = (selectedChoice) => {
    const currentQ = questions[currentQuestion];
    if (!currentQ?.options) return;

    const selectedOption = currentQ.options.find((opt) => opt.id === selectedChoice);
    const isCorrect = !!selectedOption?.isCorrect;
    const nextScore = isCorrect ? score + 1 : score;
    
    if (isCorrect) {
      setScore(nextScore);
      showCorrectAnswerFeedback(1, true);
    }
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      setFinalScore(nextScore);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title={gameContent?.title || "Salary Story"}
      score={score}
      subtitle={
        showResult 
          ? gameContent?.subtitleComplete || "Story Complete!" 
          : t("financial-literacy.teens.salary-story.subtitleProgress", {
              current: currentQuestion + 1,
              total: questions.length,
              defaultValue: "Question {{current}} of {{total}}"
            })
      }
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/finance/teen/debate-save-vs-spend"
      nextGameIdProp="finance-teens-6"
      gameType="finance"
      totalLevels={5}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore === 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
    >
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">
                  {t("financial-literacy.teens.salary-story.subtitleProgress", {
                    current: currentQuestion + 1,
                    total: questions.length,
                    defaultValue: "Question {{current}} of {{total}}"
                  })}
                </span>
                <span className="text-yellow-400 font-bold">
                  {t("financial-literacy.teens.salary-story.scoreLabel", {
                    score,
                    total: questions.length,
                    defaultValue: "Score: {{score}}/{{total}}"
                  })}
                </span>
              </div>
              
              <p className="text-white text-lg mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                    {option.description ? (
                      <p className="text-white/90 text-sm">{option.description}</p>
                    ) : null}
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

export default SalaryStory;