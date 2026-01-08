import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexNeverQuit = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-teens-99";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Get nextGamePath and nextGameId from location.state
  const nextGamePath = location.state?.nextGamePath || null;
  const nextGameId = location.state?.nextGameId || null;
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);
  const currentRoundRef = useRef(0);

  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  // Reset timeLeft and answered when round changes
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

  const questions = [
  {
    id: 1,
    question: "You fail an important mock test even after preparing seriously. What response best reflects a never-quit mindset?",
    correctAnswer: "Analyze mistakes and adjust the study strategy",
    options: [
      { text: "Blame the test for being unfair", isCorrect: false, emoji: "😤" },
      { text: "Decide the subject is not for you", isCorrect: false, emoji: "🚪" },
      { text: "Avoid discussing the result", isCorrect: false, emoji: "🙈" },
      { text: "Analyze mistakes and adjust the study strategy", isCorrect: true, emoji: "🧠" },
    ]
  },
  {
    id: 2,
    question: "Your team project receives strong criticism during review. What is the strongest persistence-based reaction?",
    correctAnswer: "Use the feedback to improve the next version",
    options: [
      { text: "Argue that the reviewers are wrong", isCorrect: false, emoji: "🗯️" },
      { text: "Lose motivation to continue", isCorrect: false, emoji: "😞" },
      { text: "Use the feedback to improve the next version", isCorrect: true, emoji: "🔁" },
      { text: "Withdraw from the team", isCorrect: false, emoji: "🏃" }
    ]
  },
  {
    id: 3,
    question: "You are learning a new skill and progress feels extremely slow. What choice shows mental endurance?",
    correctAnswer: "Commit to consistent practice despite slow results",
    options: [
      { text: "Switch to something easier immediately", isCorrect: false, emoji: "🔀" },
      { text: "Commit to consistent practice despite slow results", isCorrect: true, emoji: "⏳" },
      { text: "Compare yourself constantly with others", isCorrect: false, emoji: "📊" },
      { text: "Stop until motivation magically returns", isCorrect: false, emoji: "🛑" }
    ]
  },
  {
    id: 4,
    question: "You face repeated rejection while applying for opportunities. What reflects the ‘never quit’ reflex?",
    correctAnswer: "Refine your approach and continue applying",
    options: [
      { text: "Refine your approach and continue applying", isCorrect: true, emoji: "📈" },
      { text: "Assume rejection defines your ability", isCorrect: false, emoji: "❌" },
      { text: "Give up after multiple attempts", isCorrect: false, emoji: "🏳️" },
      { text: "Wait for luck to change everything", isCorrect: false, emoji: "🍀" }
    ]
  },
  {
    id: 5,
    question: "A long-term goal feels overwhelming and exhausting. What action best supports sustained perseverance?",
    correctAnswer: "Break the goal into manageable steps and continue",
    options: [
      { text: "Ignore the goal until pressure forces action", isCorrect: false, emoji: "⌛" },
      { text: "Lower standards to finish quickly", isCorrect: false, emoji: "📉" },
      { text: "Break the goal into manageable steps and continue", isCorrect: true, emoji: "🧩" },
      { text: "Abandon the goal for short-term comfort", isCorrect: false, emoji: "🛋️" }
    ]
  }
];

  const finalScore = score;

  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title="Reflex Never Quit"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Test your persistence skills!` : "Test your persistence skills!"}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      showConfetti={gameState === "finished" && finalScore === TOTAL_ROUNDS}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="brain"
      maxScore={TOTAL_ROUNDS}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/brain/teen/badge-growth-champion"
      nextGameIdProp="brain-teens-100"
    >
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">💪</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Answer questions about persistence!<br />
              You have {ROUND_TIME} seconds for each question.
            </p>
            <p className="text-white/80 mb-6">
              You have {TOTAL_ROUNDS} questions with {ROUND_TIME} seconds each!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-8 rounded-full text-xl font-bold shadow-lg transition-all transform hover:scale-105"
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

export default ReflexNeverQuit;
