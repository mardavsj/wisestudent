import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getBrainKidsGames } from "../../../../pages/Games/GameCategories/Brain/kidGamesData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const PositiveNegativeReflex = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-59");
  const gameId = gameData?.id || "brain-kids-59";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for PositiveNegativeReflex, using fallback ID");
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
    text: "You didn’t score well in a test, but you want to motivate yourself for the next one. Which thought helps most?",
    options: [
      
      {
        id: "b",
        text: "I will always be bad at this subject",
        emoji: "😔",
        isCorrect: false
      },
      {
        id: "c",
        text: "There is no point in trying again",
        emoji: "😞",
        isCorrect: false
      },
      {
        id: "d",
        text: "Others are better, so I should stop",
        emoji: "�",
        isCorrect: false
      },
      {
        id: "a",
        text: "I can improve if I practice differently next time",
        emoji: "😊",
        isCorrect: true
      },
    ]
  },
  {
    id: 2,
    text: "A friend posts their success online. What kind of reaction reflects a healthy mindset?",
    options: [
      
      {
        id: "b",
        text: "Feeling upset because they are ahead of you",
        emoji: "😔",
        isCorrect: false
      },
      {
        id: "c",
        text: "Thinking they don’t deserve the success",
        emoji: "😕",
        isCorrect: false
      },
      {
        id: "a",
        text: "Feeling inspired to work toward your own goals",
        emoji: "🤔",
        isCorrect: true
      },
      {
        id: "d",
        text: "Avoiding their posts completely",
        emoji: "🔒",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "You make a small mistake while presenting in class. Which inner response is most constructive?",
    options: [
      
      {
        id: "b",
        text: "Everyone must think I’m embarrassing",
        emoji: "😔",
        isCorrect: false
      },
      {
        id: "a",
        text: "Mistakes help me learn how to do better",
        emoji: "😊",
        isCorrect: true
      },
      {
        id: "c",
        text: "I should never speak in front of others again",
        emoji: "😐",
        isCorrect: false
      },
      {
        id: "d",
        text: "I always ruin things",
        emoji: "🤨",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "Someone gives you helpful feedback on your online project. Which response shows a positive attitude?",
    options: [
      {
        id: "a",
        text: "Using the feedback to improve your work",
        emoji: "🙂",
        isCorrect: true
      },
      {
        id: "b",
        text: "Feeling offended and rejecting all advice",
        emoji: "😕",
        isCorrect: false
      },
      {
        id: "c",
        text: "Assuming they want to criticize you",
        emoji: "🤔",
        isCorrect: false
      },
      {
        id: "d",
        text: "Stopping the project completely",
        emoji: "⛔",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "You are learning a new skill online and progress feels slow. Which thought supports emotional growth?",
    options: [
      
      {
        id: "b",
        text: "If I’m not fast, I must be bad at it",
        emoji: "😔",
        isCorrect: false
      },
      {
        id: "c",
        text: "Others learn faster, so I should quit",
        emoji: "🤨",
        isCorrect: false
      },
      {
        id: "a",
        text: "Growth takes time and consistent effort",
        emoji: "🤔",
        isCorrect: true
      },
      {
        id: "d",
        text: "There’s no value in slow progress",
        emoji: "😐",
        isCorrect: false
      }
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
      title="Reflex Positive/Negative"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Test your positive/negative reflexes!` : "Test your positive/negative reflexes!"}
      currentLevel={currentRound}
      totalLevels={TOTAL_ROUNDS}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      showConfetti={gameState === "finished" && finalScore === TOTAL_ROUNDS}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/brain/kids/badge-positive-kid"
      nextGameIdProp="brain-kids-60"
      gameType="brain"
      maxScore={TOTAL_ROUNDS}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">😊</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Identify positive and negative words!<br />
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
                {currentQuestion.text}
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

export default PositiveNegativeReflex;

