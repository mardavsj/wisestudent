import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const MoneyBorrowStory = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-51");
  const gameId = gameData?.id || "finance-teens-51";
  const gameContent = t("financial-literacy.teens.money-borrow-story", { returnObjects: true });
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for MoneyBorrowStory, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = Array.isArray(gameContent?.questions) ? gameContent.questions : [];

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

  return (
    <GameShell
      title={gameContent?.title || "Money Borrow Story"}
      subtitle={!showResult 
        ? t("financial-literacy.teens.money-borrow-story.subtitleProgress", {
            current: currentQuestion + 1,
            total: questions.length,
            defaultValue: "Question {{current}} of {{total}}"
          })
        : (gameContent?.subtitleComplete || "Story Complete!")
      }
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length || 5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length || 5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/debt-quiz"
      nextGameIdProp="finance-teens-52"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="finance"
    >
      <div className="space-y-8">
        {!showResult && questions[currentQuestion] ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">
                  {t("financial-literacy.teens.money-borrow-story.questionLabel", {
                    current: currentQuestion + 1,
                    total: questions.length,
                    defaultValue: "Question {{current}}/{{total}}"
                  })}
                </span>
                <span className="text-yellow-400 font-bold">
                  {t("financial-literacy.teens.money-borrow-story.scoreLabel", {
                    score,
                    total: questions.length,
                    defaultValue: "Score: {{score}}/{{total}}"
                  })}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {questions[currentQuestion].text}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.isCorrect)}
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
                      {option.description && (
                         <span className="text-sm opacity-90">{option.description}</span>
                      )}
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
                <div className="text-5xl mb-4">{gameContent?.result?.winEmoji || "🎉"}</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {gameContent?.result?.winTitle || "Borrowing Star!"}
                </h3>
                <p className="text-white/90 text-lg mb-4">
                  {t("financial-literacy.teens.money-borrow-story.result.winMessage", {
                    score,
                    total: questions.length,
                    defaultValue: "You got {{score}} out of {{total}} correct! Great job learning about responsible borrowing!"
                  })}
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>
                    {t("financial-literacy.teens.money-borrow-story.result.coinsEarned", {
                      score,
                      defaultValue: "+{{score}} Coins"
                    })}
                  </span>
                </div>
                <p className="text-white/80">
                  {gameContent?.result?.lesson || "Lesson: Always repay borrowed money on time, communicate if you can't, and borrow only when necessary. This builds trust and maintains relationships!"}
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">{gameContent?.result?.loseEmoji || "💪"}</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {gameContent?.result?.loseTitle || "Keep Learning!"}
                </h3>
                <p className="text-white/90 text-lg mb-4">
                  {t("financial-literacy.teens.money-borrow-story.result.loseMessage", {
                    score,
                    total: questions.length,
                    defaultValue: "You got {{score}} out of {{total}} correct. Remember to always repay borrowed money on time!"
                  })}
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  {gameContent?.result?.tryAgain || "Try Again"}
                </button>
                <p className="text-white/80 text-sm">
                  {gameContent?.result?.tip || "Tip: Always repay borrowed money on time, communicate honestly if you can't repay, and borrow only when necessary and affordable!"}
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default MoneyBorrowStory;
