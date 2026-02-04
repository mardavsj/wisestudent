import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexSmartHygiene43 = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-43";

  // Hardcode rewards: 2 coins per question, 10 total coins, 20 total XP
  const coinsPerLevel = 2;
  const totalCoins = 10;
  const totalXp = 20;

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0); // Track number of correct answers for score
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);
  const currentRoundRef = useRef(0);

  const questions = [
  {
    id: 1,
    question: "You used your phone on public transport and now want to eat.",
    correctAnswer: "Clean Phone First",
    options: [
      { text: "Clean Phone First", isCorrect: true, emoji: "📱" },
      { text: "Eat Immediately", isCorrect: false, emoji: "🍔" },
      { text: "Blow on Phone", isCorrect: false, emoji: "💨" },
      { text: "Ignore It", isCorrect: false, emoji: "🙈" }
    ]
  },
  {
    id: 2,
    question: "Your reusable water bottle smells strange.",
    correctAnswer: "Deep Clean Bottle",
    options: [
      { text: "Add Juice", isCorrect: false, emoji: "🧃" },
      { text: "Deep Clean Bottle", isCorrect: true, emoji: "🧴" },
      { text: "Close Lid Tight", isCorrect: false, emoji: "🔒" },
      { text: "Drink Anyway", isCorrect: false, emoji: "🤢" }
    ]
  },
  {
    id: 3,
    question: "You wore the same hoodie all week. It looks fine.",
    correctAnswer: "Wash It",
    options: [
      { text: "Spray Perfume", isCorrect: false, emoji: "🌸" },
      { text: "Air It Out", isCorrect: false, emoji: "🌬️" },
      { text: "Wash It", isCorrect: true, emoji: "🧺" },
      { text: "Wear Again", isCorrect: false, emoji: "😎" }
    ]
  },
  {
    id: 4,
    question: "You have a small cut after sports practice.",
    correctAnswer: "Clean and Cover",
    options: [
      { text: "Ignore It", isCorrect: false, emoji: "🙄" },
      { text: "Lick It", isCorrect: false, emoji: "👅" },
      { text: "Scratch It", isCorrect: false, emoji: "😖" },
      { text: "Clean and Cover", isCorrect: true, emoji: "🩹" },
    ]
  },
  {
    id: 5,
    question: "Your earphones are shared with friends daily.",
    correctAnswer: "Disinfect Earphones",
    options: [
      { text: "Share More", isCorrect: false, emoji: "🎧" },
      { text: "Ignore Germs", isCorrect: false, emoji: "🦠" },
      { text: "Disinfect Earphones", isCorrect: true, emoji: "🎧" },
      { text: "Put in Pocket", isCorrect: false, emoji: "👖" }
    ]
  }
];

  // Set global window variables for useGameFeedback
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__flashTotalCoins = totalCoins;
      window.__flashQuestionCount = questions.length;
      window.__flashPointsMultiplier = coinsPerLevel;
      
      return () => {
        // Clean up on unmount
        window.__flashTotalCoins = null;
        window.__flashQuestionCount = null;
        window.__flashPointsMultiplier = 1;
      };
    }
  }, [totalCoins, coinsPerLevel, questions.length]);

  // Update ref when currentRound changes
  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  // Reset timer when round changes
  useEffect(() => {
    if (gameState === "playing" && currentRound > 0 && currentRound <= TOTAL_ROUNDS) {
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
    }
  }, [currentRound, gameState]);

  // Handle time up - move to next question or show results
  const handleTimeUp = useCallback(() => {
    console.log('⏰ Time up handler called - Current state:', { currentRound: currentRoundRef.current, coins, correctAnswers });
    setAnswered(true);
    resetFeedback();

    const isLastQuestion = currentRoundRef.current >= TOTAL_ROUNDS;

    setTimeout(() => {
      console.log('⏰ Timeout in handleTimeUp executed - Current round:', currentRoundRef.current);
      if (isLastQuestion) {
        console.log('🏁 Time up - Setting game state to finished - Final state:', { coins, correctAnswers, round: currentRoundRef.current });
        setGameState("finished");
      } else {
        setCurrentRound((prev) => {
          console.log('➡️ Time up - Moving to next round:', prev + 1);
          return prev + 1;
        });
      }
    }, 1000);
  }, [coins, correctAnswers]);

  // Timer effect - countdown from 5 seconds for each question
  useEffect(() => {
    if (gameState !== "playing") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Check if game should be finished
    if (currentRoundRef.current > TOTAL_ROUNDS) {
      setGameState("finished");
      return;
    }

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Start countdown timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          // Time's up for this round
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          handleTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState, handleTimeUp, currentRound]);

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(ROUND_TIME);
    setScore(0);
    setCoins(0);
    setCorrectAnswers(0);
    setCurrentRound(1);
    resetFeedback();
  };

  const handleAnswer = (option) => {
    console.log('🎯 handleAnswer called - Current state:', { currentRound, answered, gameState, coins, correctAnswers });
    if (gameState !== "playing" || answered || currentRound > TOTAL_ROUNDS) return;

    // Clear the timer immediately when user answers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setAnswered(true);
    resetFeedback();

    if (option.isCorrect) {
      console.log('🎯 Correct answer detected for round', currentRound);
      setCoins(prev => {
        const newCoins = prev + 2;
        console.log('🏆 Coin increment: ', prev, '->', newCoins);
        return newCoins;
      }); // 2 coins per correct answer
      setCorrectAnswers(prev => {
        const newCorrect = prev + 1;
        console.log('✅ Correct answers increment: ', prev, '->', newCorrect);
        return newCorrect;
      }); // Increment correct answers count
      showCorrectAnswerFeedback(1, true);
    } else {
      console.log('❌ Wrong answer for round', currentRound);
    }

    // Move to next round or show results after a short delay
    setTimeout(() => {
      console.log('⏱️ Timeout executed - Moving from round', currentRound, 'to next');
      if (currentRound >= TOTAL_ROUNDS) {
        console.log('🏁 Setting game state to finished - Final state:', { coins, correctAnswers, currentRound });
        setGameState("finished");
      } else {
        setCurrentRound((prev) => {
          console.log('➡️ Moving to next round:', prev + 1);
          return prev + 1;
        });
      }
    }, 500);
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/hygiene-tools-puzzle-44");
  };

  const currentQuestion = questions[currentRound - 1];

  // Debug logging for state changes
  useEffect(() => {
    console.log('🔄 State update - Round:', currentRound, 'Coins:', coins, 'Correct:', correctAnswers, 'Time left:', timeLeft);
  }, [currentRound, coins, correctAnswers, timeLeft]);

  // Debug logging for GameShell props
  useEffect(() => {
    if (gameState === "finished") {
      console.log('🎮 GameShell props for ReflexSmartHygiene43:', {
        score: coins,
        correctAnswers,
        maxScore: TOTAL_ROUNDS,
        coinsPerLevel,
        totalCoins,
        totalXp,
        totalLevels: TOTAL_ROUNDS
      });
    }
  }, [gameState, coins, correctAnswers, coinsPerLevel, totalCoins, totalXp, TOTAL_ROUNDS]);

  return (
    <GameShell
      title="Reflex Smart Hygiene"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Act fast!` : "Act fast!"}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={correctAnswers}
      gameId={gameId}
      nextGamePathProp="/student/health-male/teens/hygiene-tools-puzzle-44"
      nextGameIdProp="health-male-teen-44"
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
       maxScore={totalCoins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      totalLevels={TOTAL_ROUNDS}
    >
      <div className="space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🧼</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              React to hygiene challenges quickly!<br />
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
            {/* Status Bar with Timer */}
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-white">
                <span className="font-bold">Round:</span> {currentRound}/{TOTAL_ROUNDS}
              </div>
              <div className={`font-bold ${timeLeft <= 2 ? 'text-red-500' : timeLeft <= 3 ? 'text-yellow-500' : 'text-green-400'}`}>
                <span className="text-white">Time:</span> {timeLeft}s
              </div>
              <div className="text-white">
         {coins} coins
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                {currentQuestion.question}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-4xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-xl">{option.text}</h3>
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

export default ReflexSmartHygiene43;

