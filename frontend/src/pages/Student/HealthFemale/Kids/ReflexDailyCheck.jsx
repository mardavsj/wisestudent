import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReflexDailyCheck = () => {
  const navigate = useNavigate();

  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-female-kids-39"; // Correct ID for progression

  const [gameState, setGameState] = useState('ready'); // ready, playing, finished
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);  // Changed from 5 to 10
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({ correct: false, message: "" });

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      scenario: "Did you brush your teeth this morning?",
      options: [
        { id: "yes", text: "Yes!", emoji: "🪥", isCorrect: true },
        { id: "no", text: "Forgot...", emoji: "😬", isCorrect: false },
        { id: "maybe", text: "Maybe?", emoji: "🤷", isCorrect: false },
        { id: "later", text: "I will later", emoji: "⏰", isCorrect: false }
      ]
    },
    {
      id: 2,
      scenario: "It's sunny outside! You need...",
      options: [
        { id: "coat", text: "Heavy Coat", emoji: "🧥", isCorrect: false },
        { id: "sunscreen", text: "Sunscreen ", emoji: "🧴", isCorrect: true },
        { id: "umbrella", text: "Umbrella", emoji: "☔", isCorrect: false },
        { id: "hat", text: "Hat", emoji: "🧢", isCorrect: false }
      ]
    },
    {
      id: 3,
      scenario: "You just used the bathroom. Now what?",
      options: [
        { id: "run", text: "Run away", emoji: "🏃‍♀️", isCorrect: false },
        { id: "wash", text: "Wash Hands", emoji: "🧼", isCorrect: true },
        { id: "dry", text: "Dry only", emoji: "🌬️", isCorrect: false },
        { id: "nothing", text: "Nothing", emoji: "😶", isCorrect: false }
      ]
    },
    {
      id: 4,
      scenario: "You are thirsty!",
      options: [
        { id: "soda", text: "Soda", emoji: "🥤", isCorrect: false },
        { id: "juice", text: "Fresh Juice", emoji: "🧃", isCorrect: false },
        { id: "water", text: "Water", emoji: "💧", isCorrect: true },
        { id: "salt", text: "Eat salt", emoji: "🧂", isCorrect: false }
      ]
    },
    {
      id: 5,
      scenario: "It's getting late. Time to...",
      options: [
        { id: "sleep", text: "Go to sleep", emoji: "🛌", isCorrect: true },
        { id: "play", text: "Play loud games", emoji: "🎮", isCorrect: false },
        { id: "scream", text: "Scream", emoji: "😱", isCorrect: false },
        { id: "eat", text: "Eat cake", emoji: "🍰", isCorrect: false }
      ]
    }
  ];

  // Timer Logic
  useEffect(() => {
    let interval;
    if (gameState === 'playing' && timer > 0 && !showFeedback) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && !showFeedback && gameState === 'playing') {
      handleAnswer(null); // Time's up!
    }
    return () => clearInterval(interval);
  }, [timer, gameState, showFeedback]);

  // Start Game Handler
  const handleStartGame = () => {
    setGameState('playing');
    setTimer(10);
    setCurrentRound(0);
    setScore(0);
  };

  const handleAnswer = (selectedOption) => {
    const isCorrect = selectedOption?.isCorrect;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
      setFeedback({ correct: true, message: "Great Choice!" });
    } else {
      setFeedback({ correct: false, message: selectedOption ? "Not quite!" : "Time's Up!" });
    }

    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      if (currentRound < questions.length - 1) {
        setCurrentRound((prev) => prev + 1);
        setTimer(10); // Reset timer for next round
      } else {
        setGameState('finished');
        showAnswerConfetti();
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  if (gameState === 'finished') {
    return (
      <GameShell
        title="Reflex: Daily Check"
        subtitle="Game Complete!"
        onNext={handleNext}
        nextEnabled={true}
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="health-female"
        totalLevels={100}
        currentLevel={39}
        showConfetti={true}
        backPath="/games/health-female/kids"
        coinsPerLevel={coinsPerLevel}
        totalCoins={totalCoins}
        totalXp={totalXp}
      >
        <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
          <div className="text-6xl mb-6">🏆</div>
          <h2 className="text-3xl font-bold mb-4">Daily Check Complete!</h2>
          <p className="text-xl mb-6">You checked your habits fast!</p>
          <div className="text-2xl font-bold text-yellow-400 mb-8">Score: {score}/{questions.length}</div>
          <button
            onClick={handleStartGame}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-all hover:scale-105"
          >
            Play Again
          </button>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Reflex: Daily Check"
      subtitle={gameState === 'ready' ? "Get Ready!" : `Round ${currentRound + 1}/${questions.length}`}
      currentLevel={99}
      totalLevels={5} // Just for the bar
      score={score}
      backPath="/games/health-female/kids"
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* HUD */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold">
              {timer}
            </div>
            <span className="text-white font-bold">Seconds Left</span>
          </div>
          <div className="text-yellow-400 font-bold text-xl">
            Score: {score}
          </div>
        </div>

        {gameState === 'ready' ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20 text-center">
            <div className="text-6xl mb-6">⏱️</div>
            <h2 className="text-3xl font-bold text-white mb-4">Ready for a Quick Check?</h2>
            <p className="text-white/80 mb-8 text-lg">Answer as fast as you can before the time runs out!</p>
            <button
              onClick={handleStartGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg hover:scale-105 transition-all"
            >
              Start Game
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 min-h-[400px] flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-center text-white mb-8">
              {questions[currentRound].scenario}
            </h2>

            {showFeedback ? (
              <div className={`text-center p-8 rounded-xl ${feedback.correct ? "bg-green-500/20" : "bg-red-500/20"}`}>
                <h3 className="text-2xl font-bold text-white mb-2">{feedback.message}</h3>
                <p className="text-white/80">{feedback.correct ? "Keep it up!" : "Try to be faster next time!"}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {questions[currentRound].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option)}
                    className="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white p-6 rounded-xl shadow-lg transform transition-all hover:scale-105 flex flex-col items-center justify-center space-y-2 group"
                  >
                    <span className="text-4xl group-hover:scale-110 transition-transform">{option.emoji}</span>
                    <span className="font-bold text-lg text-center">{option.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexDailyCheck;