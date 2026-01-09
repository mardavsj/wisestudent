import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const BiasDetectionReflex = () => {
  const location = useLocation();
  
  const gameId = "uvls-teen-56";
  const gameData = getGameDataById(gameId);
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const nextGamePath = location.state?.nextGamePath || null;
  const nextGameId = location.state?.nextGameId || null;
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  const [gameState, setGameState] = useState("ready");
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);
  const currentRoundRef = useRef(0);

  const questions = [
    {
      id: 1,
      question: "Statement: 'All teenagers are lazy.' Is this biased or unbiased?",
      correctAnswer: "Biased - Makes a generalization",
      options: [
        { text: "Unbiased - Just an opinion", isCorrect: false, emoji: "💭" },
        { text: "Biased - Makes a generalization", isCorrect: true, emoji: "⚠️" },
        { text: "Unbiased - It's true", isCorrect: false, emoji: "👎" },
        { text: "Biased - But it's okay", isCorrect: false, emoji: "🤷" }
      ]
    },
    {
      id: 2,
      question: "Statement: 'Water is wet.' Is this biased or unbiased?",
      correctAnswer: "Unbiased - Factual statement",
      options: [
        { text: "Biased - Against dry things", isCorrect: false, emoji: "💧" },
        { text: "Biased - Wet preference", isCorrect: false, emoji: "🎯" },
        { text: "Unbiased - Factual statement", isCorrect: true, emoji: "🙂" },
        { text: "Unbiased - But it's wrong", isCorrect: false, emoji: "🙃" }
      ]
    },
    {
      id: 3,
      question: "Statement: 'Rich people are greedy.' Is this biased or unbiased?",
      correctAnswer: "Biased - Generalizes about wealth",
      options: [
        { text: "Biased - Generalizes about wealth", isCorrect: true, emoji: "💰" },
        { text: "Unbiased - Just describing", isCorrect: false, emoji: "📝" },
        { text: "Unbiased - It's accurate", isCorrect: false, emoji: "👍" },
        { text: "Biased - But acceptable", isCorrect: false, emoji: "🤷" }
      ]
    },
    {
      id: 4,
      question: "Statement: 'The sky is blue.' Is this biased or unbiased?",
      correctAnswer: "Unbiased - Objective observation",
      options: [
        { text: "Biased - Favoring blue", isCorrect: false, emoji: "🎨" },
        { text: "Biased - Color preference", isCorrect: false, emoji: "🌈" },
        { text: "Unbiased - But it's subjective", isCorrect: false, emoji: "👁️" },
        { text: "Unbiased - Objective observation", isCorrect: true, emoji: "☁️" },
      ]
    },
    {
      id: 5,
      question: "Statement: 'Old people can't use technology.' Is this biased or unbiased?",
      correctAnswer: "Biased - Age-based stereotype",
      options: [
        { text: "Biased - Age-based stereotype", isCorrect: true, emoji: "👴" },
        { text: "Unbiased - Just observation", isCorrect: false, emoji: "👀" },
        { text: "Unbiased - Generally true", isCorrect: false, emoji: "📊" },
        { text: "Biased - But harmless", isCorrect: false, emoji: "🤐" }
      ]
    }
  ];

  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  useEffect(() => {
    if (gameState === "playing" && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
    }
  }, [currentRound, gameState]);

  const handleTimeUp = useCallback(() => {
    if (currentRoundRef.current < TOTAL_ROUNDS) {
      setCurrentRound(prev => prev + 1);
    } else {
      setGameState("finished");
    }
  }, []);

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

  const handleAnswer = (option) => {
    if (answered || gameState !== "playing") return;
    
    setAnswered(true);
    resetFeedback();
    
    const isCorrect = option.isCorrect;
    
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

  const finalScore = score;
  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title="Bias Detection Reflex"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Test your bias detection skills!` : "Test your bias detection skills!"}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      showConfetti={gameState === "finished" && finalScore === TOTAL_ROUNDS}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/uvls/teen/evidence-journal"
      nextGameIdProp="uvls-teen-57"
      gameType="uvls"
      maxScore={TOTAL_ROUNDS}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">⚡</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Detect biased statements quickly!<br />
              You have {ROUND_TIME} seconds for each question.
            </p>
            <p className="text-white/80 mb-6">
              You have {TOTAL_ROUNDS} questions with {ROUND_TIME} seconds each!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 px-8 rounded-full text-xl font-bold shadow-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === "playing" && currentQuestion && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-white">
                <span className="font-bold">Round:</span> {currentRound}/{TOTAL_ROUNDS}
              </div>
              <div className={`font-bold ${timeLeft <= 2 ? 'text-red-500' : timeLeft <= 3 ? 'text-yellow-500' : 'text-green-400'}`}>
                <span className="text-white">Time:</span> {timeLeft}s
              </div>
              <div className="text-white">
                <span className="font-bold">Score:</span> {score}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                {currentQuestion.question}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className="w-full min-h-[80px] bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 px-6 py-4 rounded-xl text-white font-bold text-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <span className="text-3xl mr-2">{option.emoji}</span> {option.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BiasDetectionReflex;

