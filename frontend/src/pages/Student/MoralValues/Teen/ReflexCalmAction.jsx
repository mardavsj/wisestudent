import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexCalmAction = () => {
  const location = useLocation();
  
  const gameId = "moral-teen-89";
  const gameData = getGameDataById(gameId);
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameState, setGameState] = useState("ready");
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const currentRoundRef = useRef(null);

  const questions = [
    {
      id: 1,
      question: "Someone cuts in line in front of you 🚶",
      correctAnswer: "Take Deep Breath",
      options: [
        { text: "Confront Aggressively", isCorrect: false, emoji: "😠" },
        { text: "Take Deep Breath", isCorrect: true, emoji: "🌬️" },
        { text: "Start a Fight", isCorrect: false, emoji: "⚔️" },
        { text: "Scream Loudly", isCorrect: false, emoji: "😱" }
      ]
    },
    {
      id: 2,
      question: "Your friend says something hurtful to you 💔",
      correctAnswer: "Take Deep Breath",
      options: [
        { text: "Walk Away Calmly", isCorrect: true, emoji: "🚶‍♀️" },
        { text: "Yell Back Immediately", isCorrect: false, emoji: "🗣️" },
        { text: "Cry Loudly", isCorrect: false, emoji: "😭" },
        { text: "Ignore Completely", isCorrect: false, emoji: "🔇" }
      ]
    },
    {
      id: 3,
      question: "You feel overwhelmed with school pressure 📚",
      correctAnswer: "Take Deep Breath",
      options: [
        { text: "Throw Books Away", isCorrect: false, emoji: "🧹" },
        { text: "Scream in Class", isCorrect: false, emoji: "🔊" },
        { text: "Take Deep Breath", isCorrect: true, emoji: "🌬️" },
        { text: "Run Away from School", isCorrect: false, emoji: "🏃‍♂️" }
      ]
    },
    {
      id: 4,
      question: "A group is bullying another student 👥",
      correctAnswer: "Help Calmly",
      options: [
        { text: "Tell a Teacher", isCorrect: true, emoji: "👩‍🏫" },
        { text: "Join the Bullies", isCorrect: false, emoji: "😈" },
        { text: "Fight the Bullies", isCorrect: false, emoji: "👊" },
        { text: "Pretend Not to See", isCorrect: false, emoji: "🙈" }
      ]
    },
    {
      id: 5,
      question: "Your parents are arguing loudly at home 🏠",
      correctAnswer: "Stay Calm",
      options: [
        { text: "Yell at Them", isCorrect: false, emoji: "🗣️" },
        { text: "Leave the House", isCorrect: false, emoji: "🚪" },
        { text: "Cry Loudly", isCorrect: false, emoji: "😭" },
        { text: "Stay Calm & Distract", isCorrect: true, emoji: "🧘" },
      ]
    }
  ];

  useEffect(() => {
    currentRoundRef.current = currentQuestion + 1;
  }, [currentQuestion]);

  useEffect(() => {
    if (gameState === "playing" && currentQuestion >= 0 && currentQuestion < questions.length) {
      setTimeLeft(ROUND_TIME);
      setAnswered(false);
    }
  }, [currentQuestion, gameState]);

  // Timer logic
  useEffect(() => {
    let timer = null;
    
    if (gameState === "playing" && !answered && timeLeft > 0 && currentQuestion < questions.length) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState, answered, timeLeft, currentQuestion]);

  const handleTimeUp = () => {
    setAnswered(true);
    resetFeedback();
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 500);
  };



  const handleChoice = (option) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (option.isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 500);
  };

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setCurrentQuestion(0);
    setShowResult(false);
    setAnswered(false);
    setSelectedAnswer(null);
    resetFeedback();
  };

  return (
    <GameShell
      title="Reflex: Calm Action"
      score={score}
      subtitle={gameState === "ready" ? "Get Ready to Stay Calm!" : !showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/moral-values/teen/badge-peace-hero"
      nextGameIdProp="moral-teen-90"
      gameType="moral"
      totalLevels={questions.length}
      currentLevel={gameState === "ready" ? 0 : currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {gameState === "ready" ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-6xl mb-6">🧘‍♀️</div>
            <h3 className="text-2xl font-bold text-white mb-4">Calm Action Reflex</h3>
            <p className="text-white/90 text-lg mb-6">
              You'll be shown challenging scenarios. Choose the calmest, most thoughtful response in {ROUND_TIME} seconds!
            </p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-8 rounded-full text-xl font-bold shadow-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        ) : !showResult && questions[currentQuestion] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <div className="flex gap-4">
                  <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
                  <span className={`font-mono font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>
                    {timeLeft}s
                  </span>
                </div>
              </div>
              
              <p className="text-white text-lg mb-6">
                {questions[currentQuestion].question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedAnswer(idx);
                      handleChoice(option);
                    }}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-left transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : selectedAnswer === idx
                          ? "bg-red-500/20 border-4 border-red-400 ring-4 ring-red-400"
                          : "bg-white/5 border-2 border-white/20 opacity-50"
                        : "bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="text-white font-semibold">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 4 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} scenarios right!
                  You know how to respond thoughtfully in difficult situations!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Staying calm and thoughtful helps in challenging situations!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} scenarios right.
                  Remember to stay calm and think before reacting!
                </p>
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Take a moment to think and stay calm before responding to challenging situations!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexCalmAction;

