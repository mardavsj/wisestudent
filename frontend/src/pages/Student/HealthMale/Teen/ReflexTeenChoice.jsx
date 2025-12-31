import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexTeenChoice = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const TOTAL_ROUNDS = 5;
  const ROUND_TIME = 10; // 10 seconds per question

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [answered, setAnswered] = useState(false);

  const timerRef = useRef(null);

  const questions = [
  {
    id: 1,
    question: "You're overwhelmed with exam stress and sleep-deprived. Which coping strategy best supports brain function and emotional resilience?",
    correctAnswer: "Exercise and Sleep Regulation",
    options: [
      { text: "Consume Caffeine All Night", isCorrect: false, emoji: "☕" },
      { text: "Exercise and Sleep Regulation", isCorrect: true, emoji: "🛌" },
      { text: "Ignore Sleep and Stress", isCorrect: false, emoji: "😵" },
      { text: "Avoid People Completely", isCorrect: false, emoji: "🚪" }
    ]
  },
  {
    id: 2,
    question: "Peers insist on trying vaping. What scientifically safest response reduces addiction risk and peer conflict?",
    correctAnswer: "Assertive Refusal and Explain Risks",
    options: [
      { text: "Assertive Refusal and Explain Risks", isCorrect: true, emoji: "🛑" },
      { text: "Try Once to Fit In", isCorrect: false, emoji: "💨" },
      { text: "Use Humor to Avoid", isCorrect: false, emoji: "😂" },
      { text: "Join Them Secretly", isCorrect: false, emoji: "🤫" }
    ]
  },
  {
    id: 3,
    question: "You want sustained energy and improved cognitive function. Which choice aligns with neuroscience research?",
    correctAnswer: "Whole Foods and Balanced Nutrition",
    options: [
      { text: "Energy Drinks and Sugary Snacks", isCorrect: false, emoji: "🥤" },
      { text: "Skipping Meals Frequently", isCorrect: false, emoji: "⛔" },
      { text: "High-Fat Fast Food Only", isCorrect: false, emoji: "🍔" },
      { text: "Whole Foods and Balanced Nutrition", isCorrect: true, emoji: "🥗" },
    ]
  },
  {
    id: 4,
    question: "At a social gathering, boredom arises. Which approach promotes mental well-being and social skill development?",
    correctAnswer: "Engage in Meaningful Social Interaction",
    options: [
      { text: "Experiment with Drugs or Alcohol", isCorrect: false, emoji: "💊" },
      { text: "Engage in Meaningful Social Interaction", isCorrect: true, emoji: "🗣️" },
      { text: "Withdraw Completely", isCorrect: false, emoji: "🏠" },
      { text: "React with Anger or Impulsivity", isCorrect: false, emoji: "😡" }
    ]
  },
  {
    id: 5,
    question: "Which activity scientifically supports long-term self-esteem, resilience, and neural growth in teens?",
    correctAnswer: "Regular Physical Activity and Hobbies",
    options: [
      { text: "Engaging in Bullying or Negative Behavior", isCorrect: false, emoji: "👎" },
      { text: "Avoiding Challenges or School", isCorrect: false, emoji: "🏫" },
      { text: "Regular Physical Activity and Hobbies", isCorrect: true, emoji: "🎨" },
      { text: "Ignoring Problems or Responsibilities", isCorrect: false, emoji: "🙈" }
    ]
  }
];


  // Handle time up - move to next question or show results
  const handleTimeUp = useCallback(() => {
    setAnswered(true);
    resetFeedback();

    setTimeout(() => {
      if (currentRound >= TOTAL_ROUNDS) {
        setGameState("finished");
      } else {
        setCurrentRound((prev) => prev + 1);
        setTimeLeft(ROUND_TIME);
        setAnswered(false);
      }
    }, 1000);
  }, [currentRound, TOTAL_ROUNDS, resetFeedback]);

  // Timer effect
  useEffect(() => {
    if (gameState !== "playing" || answered) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Start timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, answered, handleTimeUp]);

  // Reset timer when round changes manually (just in case)
  useEffect(() => {
    if (gameState === "playing") {
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
    }
  }, [currentRound, gameState]);


  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setCurrentRound(1);
    setTimeLeft(ROUND_TIME);
    setAnswered(false);
    resetFeedback();
  };

  const handleAnswer = (option) => {
    if (gameState !== "playing" || answered) return;

    setAnswered(true);
    resetFeedback();

    if (option.isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setTimeout(() => {
      if (currentRound >= TOTAL_ROUNDS) {
        setGameState("finished");
      } else {
        setCurrentRound((prev) => prev + 1);
      }
    }, 1000);
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/effects-puzzle");
  };

  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title="Reflex Teen Choice"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}` : "Test your Choice IQ!"}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={score}
      gameId="health-male-teen-83"
      gameType="health-male"
      totalLevels={TOTAL_ROUNDS}
      maxScore={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={gameState === "finished" && score > 3}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">⚡</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready for Choice Check!</h3>
            <p className="text-white/90 text-lg mb-6">
              You have {ROUND_TIME} seconds to choose the HEALTHY option for each situation.<br />
              Think fast and choose wisely!
            </p>
            <div className="flex justify-center">
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-10 rounded-full text-xl font-bold shadow-lg transition-all transform hover:scale-105"
              >
                Start Game
              </button>
            </div>
          </div>
        )}

        {gameState === "playing" && currentQuestion && (
          <div className="space-y-6">
            {/* Status Bar */}
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-white">
                <span className="font-bold">Round:</span> {currentRound}/{TOTAL_ROUNDS}
              </div>
              <div className={`font-bold text-xl ${timeLeft <= 2 ? 'text-red-500 animate-pulse' : timeLeft <= 3 ? 'text-yellow-500' : 'text-green-400'}`}>
                ⏱️ {timeLeft}s
              </div>
              <div className="text-white">
                <span className="font-bold text-yellow-400">Coins:</span> {score}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 text-center">
              <h3 className="text-xl md:text-2xl font-bold mb-8 text-white min-h-[60px] flex items-center justify-center">
                {currentQuestion.question}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className={`p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed ${answered && option.isCorrect
                        ? 'bg-green-500/80 border-2 border-green-400 text-white'
                        : answered && !option.isCorrect
                          ? 'bg-gray-500/50 border-2 border-transparent text-white/50'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg'
                      }`}
                  >
                    <div className="text-4xl mb-2">{option.emoji}</div>
                    <div>{option.text}</div>
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

export default ReflexTeenChoice;
