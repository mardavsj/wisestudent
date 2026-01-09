import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from '../../../../utils/getGameData';

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ShareReflex = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-9");
  const gameId = gameData?.id || "uvls-kids-9";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ShareReflex, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);
  const currentRoundRef = useRef(0);

 const questions = [
  {
    id: 1,
    question: "You have extra cookies at lunch. What do you do?",
    correctAnswer: "Share cookies",
    options: [
      { text: "Eat all yourself", isCorrect: false, emoji: "😋" },
      { text: "Hide them in your bag", isCorrect: false, emoji: "🎒" },
      { text: "Share cookies", isCorrect: true, emoji: "🍪" },
      { text: "Throw them away", isCorrect: false, emoji: "🗑️" }
    ]
  },
  {
    id: 2,
    question: "Your friend forgets a crayon. How do you help?",
    correctAnswer: "Give a crayon",
    options: [
      { text: "Give a crayon", isCorrect: true, emoji: "🖍️" },
      { text: "Keep all crayons", isCorrect: false, emoji: "😠" },
      { text: "Take their crayon", isCorrect: false, emoji: "😤" },
      { text: "Ignore them", isCorrect: false, emoji: "🙈" }
    ]
  },
  {
    id: 3,
    question: "You have a new storybook. What is the kind thing to do?",
    correctAnswer: "Read together",
    options: [
      { text: "Read alone quietly", isCorrect: false, emoji: "😶" },
      { text: "Hide the book", isCorrect: false, emoji: "🙈" },
      { text: "Tear pages", isCorrect: false, emoji: "💔" },
      { text: "Read together", isCorrect: true, emoji: "📖" },
    ]
  },
  {
    id: 4,
    question: "Your friend wants to play with your toy train. What do you do?",
    correctAnswer: "Share toy",
    options: [
      { text: "Keep it to yourself", isCorrect: false, emoji: "🙅" },
      { text: "Share toy", isCorrect: true, emoji: "🚂" },
      { text: "Take it away", isCorrect: false, emoji: "✋" },
      { text: "Say no and walk away", isCorrect: false, emoji: "🚶" }
    ]
  },
  {
    id: 5,
    question: "You have a ball and see kids playing outside. What do you do?",
    correctAnswer: "Invite them to play",
    options: [
      { text: "Invite them to play", isCorrect: true, emoji: "⚽" },
      { text: "Play alone", isCorrect: false, emoji: "😐" },
      { text: "Hide the ball", isCorrect: false, emoji: "🎒" },
      { text: "Kick the ball away", isCorrect: false, emoji: "🛑" }
    ]
  }
];

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

  const finalScore = score;

  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title="Share Reflex"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Reinforce sharing cue recognition!` : "Reinforce sharing cue recognition!"}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      showConfetti={gameState === "finished" && finalScore === TOTAL_ROUNDS}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/uvls/kids/little-empath-badge"
      nextGameIdProp="uvls-kids-10"
      gameType="uvls"
      maxScore={TOTAL_ROUNDS}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🤝</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Answer questions about sharing!<br />
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
                    className={`w-full min-h-[80px] px-6 py-4 rounded-xl text-white font-bold text-lg transition-all transform flex items-center justify-center ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : "bg-red-500/20 border-2 border-red-400 opacity-75"
                        : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <span className="text-3xl mr-2">{option.emoji}</span> {option.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {gameState === "finished" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Sharing Star!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {TOTAL_ROUNDS} correct!
                  You know how to share!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{finalScore} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Sharing snacks, pencils, books, crayons, and inviting others to play makes everyone happy! Sharing shows kindness and helps build friendships!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {TOTAL_ROUNDS} correct.
                  Remember: Sharing is caring!
                </p>
                <button
                  onClick={() => {
                    setGameState("ready");
                    setScore(0);
                    setCurrentRound(0);
                    setAnswered(false);
                    resetFeedback();
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Share your snacks, pencils, books, and crayons with others. Invite others to play. Sharing makes everyone happy!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ShareReflex;

