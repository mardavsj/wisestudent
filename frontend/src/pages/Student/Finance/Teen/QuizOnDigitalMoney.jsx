import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const QuizOnDigitalMoney = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-42");
  const gameId = gameData?.id || "finance-teens-42";
  const gameContent = t("financial-literacy.teens.quiz-on-digital-money", { returnObjects: true });
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for QuizOnDigitalMoney, using fallback ID");
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

  const questions = useMemo(() => {
    return Array.isArray(gameContent?.questions) ? gameContent.questions : [];
  }, [gameContent]);

  // Map correct values back to questions
  const correctAnswers = {
    1: "secret",
    2: "otp",
    3: "cvv",
    4: "strong",
    5: "https"
  };

  const handleAnswer = (optionId, questionId) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    const isCorrect = correctAnswers[questionId] === optionId;
    
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
      title={gameContent?.title || "Quiz on Digital Money"}
      subtitle={
        !showResult 
          ? t("financial-literacy.teens.quiz-on-digital-money.subtitleProgress", { 
              current: currentQuestion + 1, 
              total: questions.length,
              defaultValue: `Question ${currentQuestion + 1} of ${questions.length}`
            }) 
          : gameContent?.subtitleComplete || "Quiz Complete!"
      }
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/reflex-secure-use"
      nextGameIdProp="finance-teens-43"
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
              <div className="flex justify-between items-center mb-4 text-white/80">
                <span>
                  {t("financial-literacy.teens.quiz-on-digital-money.questionCount", { 
                    current: currentQuestion + 1, 
                    total: questions.length,
                    defaultValue: `Question ${currentQuestion + 1}/${questions.length}`
                  })}
                </span>
                <span className="text-yellow-400 font-bold">
                  {t("financial-literacy.teens.quiz-on-digital-money.scoreLabel", { 
                    score, 
                    total: questions.length,
                    defaultValue: `Score: ${score}/${questions.length}`
                  })}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {questions[currentQuestion].text}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questions[currentQuestion].options.map((option) => {
                  const isCorrect = correctAnswers[questions[currentQuestion].id] === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id, questions[currentQuestion].id)}
                      disabled={answered}
                      className={`p-6 rounded-2xl text-center transition-all transform ${
                        answered
                          ? isCorrect
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
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {gameContent?.resultSuccessHeader || "Digital Money Quiz Star!"}
                </h3>
                <p className="text-white/90 text-lg mb-4">
                  {t("financial-literacy.teens.quiz-on-digital-money.resultSuccessSubheader", { 
                    score, 
                    total: questions.length,
                    defaultValue: `You got ${score} out of ${questions.length} correct! You're mastering digital payment security!`
                  })}
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>
                    {t("financial-literacy.teens.quiz-on-digital-money.coinsEarned", { 
                      coins: score,
                      defaultValue: `+${score} Coins`
                    })}
                  </span>
                </div>
                <p className="text-white/80">
                  {gameContent?.resultSuccessLesson || "Lesson: Keep your PIN secret, use OTP, hide CVV, use strong passwords, and check HTTPS for secure digital payments!"}
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {gameContent?.resultTryAgainHeader || "Keep Learning!"}
                </h3>
                <p className="text-white/90 text-lg mb-4">
                  {t("financial-literacy.teens.quiz-on-digital-money.resultTryAgainSubheader", { 
                    score, 
                    total: questions.length,
                    defaultValue: `You got ${score} out of ${questions.length} correct. Practice makes perfect with digital payment security!`
                  })}
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  {gameContent?.tryAgainButton || "Try Again"}
                </button>
                <p className="text-white/80 text-sm">
                  {gameContent?.resultTryAgainTip || "Tip: Never share your PIN or CVV, always use OTP verification, create strong passwords, and check for HTTPS on websites!"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizOnDigitalMoney;

