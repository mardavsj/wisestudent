import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const PlaygroundReflex = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-kids-89");
  const gameId = gameData?.id || "dcos-kids-89";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for PlaygroundReflex, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 1; // 1 coin per question
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5; // Total coins for all questions
  const totalXp = gameData?.xp || location.state?.totalXp || 10; // Total XP for all questions
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
      question: "You see a classmate being pushed around on the playground. What should you do?",
      emoji: "🏃‍♀️",
      correctAnswer: "Tell a teacher or trusted adult",
      options: [
        { text: "Tell a teacher or trusted adult", isCorrect: true },
        { text: "Join in the pushing", isCorrect: false },
        { text: "Record it on my phone", isCorrect: false },
        { text: "Ignore and walk away", isCorrect: false }
      ],
      feedback: {
        correct: "Excellent! Telling a trusted adult is the best way to help stop bullying!",
        incorrect: "Remember: Bullying is never okay. Always tell a trusted adult when you see it happening."
      }
    },
    {
      id: 2,
      question: "Two students are arguing over equipment during recess. What's the best way to help?",
      emoji: "⚽",
      correctAnswer: "Suggest they take turns or find another solution",
      options: [
        { text: "Take the equipment for myself", isCorrect: false },
        { text: "Start cheering for one side", isCorrect: false },
        { text: "Suggest they take turns or find another solution", isCorrect: true },
        { text: "Tell everyone about the argument", isCorrect: false }
      ],
      feedback: {
        correct: "Great choice! Helping people find fair solutions prevents arguments from getting worse!",
        incorrect: "The best way to help is to suggest fair solutions that work for everyone involved."
      }
    },
    {
      id: 3,
      question: "A new student is sitting alone at lunch looking sad. What should you do?",
      emoji: "🍽️",
      correctAnswer: "Invite them to sit with me or my friends",
      options: [
        { text: "Ignore them completely", isCorrect: false },
        { text: "Invite them to sit with me or my friends", isCorrect: true },
        { text: "Make fun of their clothes", isCorrect: false },
        { text: "Tell others not to sit near them", isCorrect: false }
      ],
      feedback: {
        correct: "Perfect! Including others and showing kindness helps everyone feel welcome!",
        incorrect: "Making friends and including others helps create a positive environment for everyone."
      }
    },
    {
      id: 4,
      question: "You notice someone being excluded from a game on purpose. What's the right response?",
      emoji: "🎯",
      correctAnswer: "Invite the excluded person to join my group",
      options: [
        { text: "Join the group excluding them", isCorrect: false },
        { text: "Laugh at the person being excluded", isCorrect: false },
        { text: "Stay quiet and watch", isCorrect: false },
        { text: "Invite the excluded person to join my group", isCorrect: true },
      ],
      feedback: {
        correct: "Well done! Inclusion means making sure everyone feels welcome and valued!",
        incorrect: "Excluding others hurts feelings. Always look for ways to include everyone in activities."
      }
    },
    {
      id: 5,
      question: "During group activities, a classmate has an idea that's different from others. What should you do?",
      emoji: "💡",
      correctAnswer: "Listen respectfully and consider their idea",
      options: [
        { text: "Listen respectfully and consider their idea", isCorrect: true },
        { text: "Laugh at their idea", isCorrect: false },
        { text: "Tell them their idea is stupid", isCorrect: false },
        { text: "Ignore what they say", isCorrect: false }
      ],
      feedback: {
        correct: "Excellent! Respecting different ideas helps everyone learn and grow!",
        incorrect: "Everyone deserves respect for their ideas. Listening to different perspectives makes groups stronger."
      }
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
    
    const currentQuestion = questions[currentRound - 1];
    const isCorrect = option.isCorrect;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
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
  
  const handleNext = () => {
    navigate("/student/dcos/kids/respect-hero-badge");
  };

  return (
    <GameShell
      title="Playground Reflex"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Test your playground safety reflexes!` : "Test your playground safety reflexes!"}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/dcos/kids/respect-hero-badge"
      nextGameIdProp="dcos-kids-90"
      gameType="dcos"
      totalLevels={TOTAL_ROUNDS}
      currentLevel={currentRound}
      showConfetti={gameState === "finished" && finalScore === TOTAL_ROUNDS}
      flashPoints={flashPoints}
      backPath="/games/digital-citizenship/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={TOTAL_ROUNDS} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🏃‍♀️ Playground</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Answer questions about playground safety!<br />
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
              
              <div className="bg-gray-800/50 rounded-xl p-12 mb-6 flex justify-center items-center">
                <div className="text-9xl animate-pulse">{currentQuestion.emoji}</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className="w-full min-h-[80px] bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-6 py-4 rounded-xl text-white font-bold text-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {gameState === "finished" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Game Over!</h2>
            <p className="text-xl text-white/80 mb-2">Your final score: <span className="text-yellow-400 font-bold">{finalScore}</span>/{TOTAL_ROUNDS}</p>
            <p className="text-white/80 mb-6">You earned {finalScore} coins!</p>
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">How did you do?</h3>
              <p className="text-white/80">
                {finalScore >= 4 ? "Excellent job! You're a playground safety expert!" : 
                 finalScore >= 3 ? "Good work! Keep learning about playground safety!" : 
                 "Keep practicing playground safety habits and you'll improve!"}
              </p>
            </div>
            
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={startGame}
                className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-full transition-all"
              >
                Play Again
              </button>
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-full transition-all shadow-lg"
              >
                Next Game
              </button>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PlaygroundReflex;

