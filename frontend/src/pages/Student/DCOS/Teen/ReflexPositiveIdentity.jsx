import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexPositiveIdentity = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-teen-63");
  const gameId = gameData?.id || "dcos-teen-63";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ReflexPositiveIdentity, using fallback ID");
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
    question: "Your friend posts about finishing a tough project online. How can you support their achievement?",
    correctAnswer: "Congratulate or Comment Positively",
    options: [
      { text: "Share It Without Commenting", isCorrect: false, emoji: "📤" },
      { text: "React With a Joke", isCorrect: false, emoji: "😂" },
      { text: "Congratulate or Comment Positively", isCorrect: true, emoji: "😄" },
      { text: "Ignore Post Entirely", isCorrect: false, emoji: "🛑" }
    ]
  },
  {
    id: 2,
    question: "Someone posts feeling sad about a mistake. What is a thoughtful response?",
    correctAnswer: "Offer Encouragement",
    options: [
      { text: "Offer Encouragement", isCorrect: true, emoji: "🤓" },
      { text: "Point Out Their Mistake Publicly", isCorrect: false, emoji: "🔍" },
      { text: "Share Memes to Distract Them", isCorrect: false, emoji: "🎭" },
      { text: "React with a Laughing Emoji", isCorrect: false, emoji: "😂" }
    ]
  },
  {
    id: 3,
    question: "A peer posts about helping in a community event. How can you respond to promote positive identity?",
    correctAnswer: "Acknowledge Effort and Share Support",
    options: [
      { text: "Critique Their Choice of Event", isCorrect: false, emoji: "🧐" },
      { text: "Acknowledge Effort and Share Support", isCorrect: true, emoji: "🌟" },
      { text: "Copy Their Post as Your Own", isCorrect: false, emoji: "📋" },
      { text: "React with a Neutral Emoji Only", isCorrect: false, emoji: "😐" }
    ]
  },
  {
    id: 4,
    question: "Someone writes about a failure they faced online. What promotes positive digital identity?",
    correctAnswer: "Comment on Resilience and Learning",
    options: [
      { text: "Ignore Them to Avoid Drama", isCorrect: false, emoji: "🙈" },
      { text: "Mock the Failure Lightly", isCorrect: false, emoji: "😏" },
      { text: "Comment on Resilience and Learning", isCorrect: true, emoji: "🙂" },
      { text: "Share the Post as a Funny Example", isCorrect: false, emoji: "🎭" }
    ]
  },
  {
    id: 5,
    question: "A friend shares that they are proud of a creative project. How can you help them build a positive online image?",
    correctAnswer: "Celebrate Their Creativity Publicly or Privately",
    options: [
      { text: "Ignore Their Post and Scroll Past", isCorrect: false, emoji: "🛑" },
      { text: "Comment Critically on Minor Flaws", isCorrect: false, emoji: "🔍" },
      { text: "Copy Their Idea for Yourself", isCorrect: false, emoji: "📋" },
      { text: "Celebrate Their Creativity Publicly or Privately", isCorrect: true, emoji: "🥳" },
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
      title="Reflex Positive Identity"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Test your positive identity building reflexes!` : "Test your positive identity building reflexes!"}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      showConfetti={gameState === "finished" && finalScore === TOTAL_ROUNDS}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/dcos/teens/college-application-simulation"
      nextGameIdProp="dcos-teen-64"
      gameType="dcos"
      maxScore={TOTAL_ROUNDS}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">👍</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Answer questions about positive identity building!<br />
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

export default ReflexPositiveIdentity;

