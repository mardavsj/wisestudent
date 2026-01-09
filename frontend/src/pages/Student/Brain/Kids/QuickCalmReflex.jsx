import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const QuickCalmReflex = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "brain-kids-69";
  const gameData = getGameDataById(gameId);
  
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
      question: "Which action helps you stay calm when stressed?",
      correctAnswer: "Take deep breaths and count to ten",
      options: [
        { text: "Yell and scream loudly", isCorrect: false, emoji: "🤬" },
        { text: "Take deep breaths and count to ten", isCorrect: true, emoji: "🧘" },
        { text: "Pace back and forth quickly", isCorrect: false, emoji: "🏃" },
        { text: "Clench your fists tightly", isCorrect: false, emoji: "✊" }
      ]
    },
    {
      id: 2,
      question: "What should you do when feeling overwhelmed?",
      correctAnswer: "Step away and take a break",
      options: [
        { text: "Step away and take a break", isCorrect: true, emoji: "🚪" },
        { text: "Push through without stopping", isCorrect: false, emoji: "🏋️" },
        { text: "Complain to everyone nearby", isCorrect: false, emoji: "🗣️" },
        { text: "Ignore your feelings completely", isCorrect: false, emoji: "🙉" }
      ]
    },
    {
      id: 3,
      question: "Which approach helps manage anger effectively?",
      correctAnswer: "Use calming self-talk",
      options: [
        { text: "Throw things around you", isCorrect: false, emoji: "🗑️" },
        { text: "Use calming self-talk", isCorrect: true, emoji: "💬" },
        { text: "Shout at others angrily", isCorrect: false, emoji: "😡" },
        { text: "Slam doors forcefully", isCorrect: false, emoji: "🚪" }
      ]
    },
    {
      id: 4,
      question: "What helps you regain emotional balance?",
      correctAnswer: "Practice mindfulness exercises",
      options: [
        { text: "Dwell on negative thoughts", isCorrect: false, emoji: "😞" },
        { text: "Avoid dealing with emotions", isCorrect: false, emoji: "🙈" },
        { text: "Practice mindfulness exercises", isCorrect: true, emoji: "🧠" },
        { text: "React impulsively to situations", isCorrect: false, emoji: "⚡" }
      ]
    },
    {
      id: 5,
      question: "Which technique reduces anxiety effectively?",
      correctAnswer: "Focus on the present moment",
      options: [
        { text: "Worry about future events", isCorrect: false, emoji: "🔮" },
        { text: "Catastrophize worst-case scenarios", isCorrect: false, emoji: "🌪️" },
        { text: "Avoid all social interactions", isCorrect: false, emoji: "🔒" },
        { text: "Focus on the present moment", isCorrect: true, emoji: "⏰" },
      ]
    }
  ];

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
    setAnswered(true);
    resetFeedback();

    const isLastQuestion = currentRoundRef.current >= TOTAL_ROUNDS;

    setTimeout(() => {
      if (isLastQuestion) {
        setGameState("finished");
      } else {
        setCurrentRound((prev) => prev + 1);
        setAnswered(false);
      }
    }, 1000);
  }, [resetFeedback]);

  // Timer effect - countdown from 10 seconds for each question
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
  }, [gameState, handleTimeUp]);

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

    // Clear the timer immediately when user answers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setAnswered(true);
    resetFeedback();

    const isCorrect = option.isCorrect;
    const isLastQuestion = currentRound === questions.length;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    // Move to next round or show results after a short delay
    setTimeout(() => {
      if (isLastQuestion) {
        setGameState("finished");
      } else {
        setCurrentRound((prev) => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title="Reflex Quick Calm"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Test your calm reflexes!` : "Test your calm reflexes!"}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      showConfetti={gameState === "finished" && score === TOTAL_ROUNDS}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/brain/kids/badge-sleep-champ"
      nextGameIdProp="brain-kids-70"
      gameType="brain"
      maxScore={TOTAL_ROUNDS}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🧘</div>
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Test Your Calm Skills?</h3>
            <p className="text-white/90 text-lg mb-6">
              Answer questions about staying calm and managing emotions.
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

        {gameState === "finished" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🧘</div>
            <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
            <p className="text-white/90 text-lg mb-6">
              You scored {score} out of {TOTAL_ROUNDS}!
            </p>
            <p className="text-white/80 mb-6">
              You're developing strong emotional regulation skills!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuickCalmReflex;