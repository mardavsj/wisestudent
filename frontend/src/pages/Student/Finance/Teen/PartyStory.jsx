import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GameShell from '../GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';

const PartyStory = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-15";
  const gameData = getGameDataById(gameId);
  const gameContent = t("financial-literacy.teens.party-story", { returnObjects: true });
  
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

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title={gameContent?.title || "Party Story"}
      subtitle={!showResult 
        ? t("financial-literacy.teens.party-story.subtitleProgress", {
            current: currentQuestion + 1,
            total: questions.length,
            defaultValue: "Question {{current}} of {{total}}"
          })
        : (gameContent?.subtitleComplete || "Story Complete!")
      }
      score={score}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/finance/teen/debate-needs-vs-wants"
      nextGameIdProp="finance-teens-16"
      gameType="finance"
      totalLevels={questions.length || 5}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length || 5}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">
                  {t("financial-literacy.teens.party-story.questionLabel", {
                    current: currentQuestion + 1,
                    total: questions.length,
                    defaultValue: "Question {{current}}/{{total}}"
                  })}
                </span>
                <span className="text-yellow-400 font-bold">
                  {t("financial-literacy.teens.party-story.scoreLabel", {
                    score,
                    total: questions.length,
                    defaultValue: "Score: {{score}}/{{total}}"
                  })}
                </span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                    {option.description && (
                      <p className="text-white/90 text-sm">{option.description}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : showResult ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">{gameContent?.result?.winEmoji || "🎉"}</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {gameContent?.result?.winTitle || "Great Job!"}
                </h3>
                <p className="text-white/90 text-lg mb-4">
                  {t("financial-literacy.teens.party-story.result.winMessage", {
                    score,
                    total: questions.length,
                    defaultValue: "You got {{score}} out of {{total}} questions correct! You're learning smart party planning and financial decisions!"
                  })}
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>
                    {t("financial-literacy.teens.party-story.result.coinsEarned", {
                      score,
                      defaultValue: "+{{score}} Coins"
                    })}
                  </span>
                </div>
                <p className="text-white/80">
                  {gameContent?.result?.lesson || "You understand the importance of budgeting, saving, and making thoughtful financial decisions for parties!"}
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">{gameContent?.result?.loseEmoji || "😔"}</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {gameContent?.result?.loseTitle || "Keep Learning!"}
                </h3>
                <p className="text-white/90 text-lg mb-4">
                  {t("financial-literacy.teens.party-story.result.loseMessage", {
                    score,
                    total: questions.length,
                    defaultValue: "You got {{score}} out of {{total}} questions correct. Remember, smart party planning means budgeting and making thoughtful financial decisions!"
                  })}
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  {gameContent?.result?.tryAgain || "Try Again"}
                </button>
                <p className="text-white/80 text-sm">
                  {gameContent?.result?.tip || "Try to choose the option that shows responsible budgeting and financial planning."}
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default PartyStory;