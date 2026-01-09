import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexPeaceSymbols = () => {
  const location = useLocation();
  
  const gameId = "moral-teen-83";
  const gameData = getGameDataById(gameId);
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
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
    question: "A group raises white flags during a conflict. What does this action represent?",
    correctAnswer: "A request to stop fighting and communicate",
    options: [
      { text: "A sign of weakness that invites attack", isCorrect: false, emoji: "⚔️" },
      { text: "A symbol of surrender without discussion", isCorrect: false, emoji: "🚩" },
      { text: "A request to stop fighting and communicate", isCorrect: true, emoji: "🕊️" },
      { text: "An unclear action with no meaning", isCorrect: false, emoji: "❓" }
    ]
  },
  {
    id: 2,
    question: "A protest remains silent but blocks a road to demand justice. What kind of peace message does this send?",
    correctAnswer: "Non-violent resistance to highlight injustice",
    options: [
      { text: "Aggressive behavior that promotes chaos", isCorrect: false, emoji: "🔥" },
      { text: "Non-violent resistance to highlight injustice", isCorrect: true, emoji: "✊" },
      { text: "Neutral action without moral impact", isCorrect: false, emoji: "😐" },
      { text: "Violence without physical harm", isCorrect: false, emoji: "⚠️" }
    ]
  },
  {
    id: 3,
    question: "Two rival groups agree to a handshake after a heated argument. What does this most strongly symbolize?",
    correctAnswer: "A willingness to resolve conflict peacefully",
    options: [
      { text: "A willingness to resolve conflict peacefully", isCorrect: true, emoji: "🤝" },
      { text: "Pretending to agree while planning revenge", isCorrect: false, emoji: "🗡️" },
      { text: "A neutral social gesture without meaning", isCorrect: false, emoji: "😶" },
      { text: "An act that avoids responsibility", isCorrect: false, emoji: "🚪" }
    ]
  },
  {
    id: 4,
    question: "A mural shows broken chains instead of weapons. What peace-related idea does this most likely express?",
    correctAnswer: "Freedom from oppression through non-violence",
    options: [
      { text: "Encouragement to destroy authority", isCorrect: false, emoji: "💣" },
      { text: "Celebration of past violence", isCorrect: false, emoji: "⚔️" },
      { text: "Unclear artistic decoration", isCorrect: false, emoji: "🎨" },
      { text: "Freedom from oppression through non-violence", isCorrect: true, emoji: "🔗" },
    ]
  },
  {
    id: 5,
    question: "A leader chooses dialogue instead of retaliation after an attack. What does this decision reflect?",
    correctAnswer: "Peace as a strategic and moral choice",
    options: [
      { text: "Peace as a strategic and moral choice", isCorrect: true, emoji: "☮️" },
      { text: "Fear of confrontation", isCorrect: false, emoji: "😨" },
      { text: "Avoidance of responsibility", isCorrect: false, emoji: "🙈" },
      { text: "Lack of leadership strength", isCorrect: false, emoji: "❌" }
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
      title="Reflex: Peace Symbols"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Tap peaceful or violent!` : "Tap peaceful or violent!"}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      showConfetti={gameState === "finished" && finalScore === TOTAL_ROUNDS}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/moral-values/teen/puzzle-of-resolution"
      nextGameIdProp="moral-teen-84"
      gameType="moral"
      maxScore={TOTAL_ROUNDS}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🕊️</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Identify peaceful vs violent symbols quickly!<br />
              You have {ROUND_TIME} seconds for each question.
            </p>
            <p className="text-white/80 mb-6">
              You have {TOTAL_ROUNDS} questions with {ROUND_TIME} seconds each!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-4 px-8 rounded-full text-xl font-bold shadow-lg transition-all transform hover:scale-105"
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
                    className="w-full min-h-[80px] bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-6 py-4 rounded-xl text-white font-bold text-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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

export default ReflexPeaceSymbols;

