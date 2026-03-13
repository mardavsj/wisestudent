import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexBudgetSmarts = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-29");
  const gameId = gameData?.id || "finance-teens-29";
  const gameContent = t("financial-literacy.teens.reflex-budget-smarts", { returnObjects: true });
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);

  const questions = useMemo(() => {
    return Array.isArray(gameContent?.questions) ? gameContent.questions : [];
  }, [gameContent]);

  // Map correct answers
  const correctAnswers = {
    1: "plan",
    2: "save",
    3: "regularly",
    4: "needs",
    5: "regularly"
  };

  useEffect(() => {
    if (gameState === "playing" && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
    }
  }, [currentRound, gameState]);

  const handleTimeUp = useCallback(() => {
    if (currentRound < TOTAL_ROUNDS) {
      setCurrentRound(prev => prev + 1);
    } else {
      setGameState("finished");
    }
  }, [currentRound]);

  // Timer effect
  useEffect(() => {
    if (gameState === "playing" && !answered && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState, answered, timeLeft, handleTimeUp]);

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(ROUND_TIME);
    setScore(0);
    setCurrentRound(1);
    setAnswered(false);
    resetFeedback();
  };

  const handleAnswer = (option, questionId) => {
    if (answered || gameState !== "playing") return;
    
    setAnswered(true);
    resetFeedback();
    
    const isCorrect = correctAnswers[questionId] === option.id;
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    setTimeout(() => {
      if (currentRound < TOTAL_ROUNDS) {
        setCurrentRound(prev => prev + 1);
      } else {
        setGameState("finished");
      }
    }, 500);
  };

  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title={gameContent?.title || "Reflex Budget Smarts"}
      subtitle={
        gameState === "playing" 
          ? t("financial-literacy.teens.reflex-budget-smarts.subtitlePlaying", { current: currentRound, total: TOTAL_ROUNDS, defaultValue: `Round ${currentRound}/${TOTAL_ROUNDS}: Test your budget reflexes!` })
          : gameContent?.subtitleReady || "Test your budget reflexes!"
      }
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      showConfetti={gameState === "finished" && score === TOTAL_ROUNDS}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/finance/teen/badge-budget-hero"
      nextGameIdProp="finance-teens-30"
      gameType="finance"
      maxScore={TOTAL_ROUNDS}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">💰</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {gameContent?.readyHeader || "Get Ready!"}
            </h3>
            <p 
              className="text-white/90 text-lg mb-6"
              dangerouslySetInnerHTML={{ 
                __html: t("financial-literacy.teens.reflex-budget-smarts.readyDescription", { 
                  time: ROUND_TIME, 
                  defaultValue: `Answer questions about budgeting habits!<br />You have ${ROUND_TIME} seconds for each question.` 
                }) 
              }}
            />
            <p className="text-white/80 mb-6">
              {t("financial-literacy.teens.reflex-budget-smarts.readyTip", { 
                total: TOTAL_ROUNDS, 
                time: ROUND_TIME,
                defaultValue: `You have ${TOTAL_ROUNDS} questions with ${ROUND_TIME} seconds each!`
              })}
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-8 rounded-full text-xl font-bold shadow-lg transition-all transform hover:scale-105"
            >
              {gameContent?.startButton || "Start Game"}
            </button>
          </div>
        )}

        {gameState === "playing" && currentQuestion && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-white">
                <span className="font-bold">
                  {gameContent?.roundLabel || "Round:"}
                </span> {currentRound}/{TOTAL_ROUNDS}
              </div>
              <div className={`font-bold ${timeLeft <= 2 ? 'text-red-500' : timeLeft <= 3 ? 'text-yellow-500' : 'text-green-400'}`}>
                <span className="text-white">
                  {gameContent?.timeLabel || "Time:"}
                </span> {timeLeft}s
              </div>
              <div className="text-white">
                <span className="font-bold">
                  {gameContent?.scoreLabel || "Score:"}
                </span> {score}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                {currentQuestion.question}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => {
                  const isCorrect = correctAnswers[currentQuestion.id] === option.id;
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option, currentQuestion.id)}
                      disabled={answered}
                      className={`w-full min-h-[80px] px-6 py-4 rounded-xl text-white font-bold text-lg transition-transform hover:scale-105 disabled:cursor-not-allowed flex items-center justify-center ${
                        answered
                          ? isCorrect
                            ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                            : "bg-red-500/20 border-2 border-red-400 opacity-75"
                          : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                      }`}
                    >
                      <span className="text-3xl mr-2">{option.emoji}</span> {option.text}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexBudgetSmarts;