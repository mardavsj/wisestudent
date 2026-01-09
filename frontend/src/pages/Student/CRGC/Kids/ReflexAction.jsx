import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexAction = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
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
      question: "What should you do if you see trash in a public park?",
      emoji: "🌳",
      correctAnswer: "Pick it up and dispose of it properly",
      options: [
        { text: "Leave it for someone else to clean", isCorrect: false },
        { text: "Add to it by throwing your own trash", isCorrect: false },
        { text: "Pick it up and dispose of it properly", isCorrect: true },
        { text: "Post about it on social media only", isCorrect: false }
      ],
      feedback: {
        correct: "Great job! Picking up trash helps keep our environment clean!",
        incorrect: "Leaving trash or adding to it worsens the problem. Pick it up and dispose of it properly!"
      }
    },
    {
      id: 2,
      question: "How should you respond when you notice a classmate being bullied?",
      emoji: "👥",
      correctAnswer: "Support the victim and report to a trusted adult",
      options: [
        { text: "Join in to fit in with the crowd", isCorrect: false },
        { text: "Ignore it completely", isCorrect: false },
        { text: "Laugh along to avoid becoming a target", isCorrect: false },
        { text: "Support the victim and report to a trusted adult", isCorrect: true },
      ],
      feedback: {
        correct: "Excellent! Supporting victims and reporting bullying helps create a safer environment!",
        incorrect: "Ignoring or joining bullying perpetuates harm. Support the victim and report to a trusted adult!"
      }
    },
    {
      id: 3,
      question: "What's the best way to handle a broken playground equipment?",
      emoji: "🔧",
      correctAnswer: "Report it immediately to school authorities",
      options: [
        { text: "Try to fix it yourself without experience", isCorrect: false },
        { text: "Report it immediately to school authorities", isCorrect: true },
        { text: "Hide it so others won't get hurt", isCorrect: false },
        { text: "Use it carefully despite knowing it's broken", isCorrect: false }
      ],
      feedback: {
        correct: "Perfect! Reporting broken equipment prevents accidents and gets it fixed quickly!",
        incorrect: "Trying to fix it yourself or hiding it can lead to injuries. Report it immediately to school authorities!"
      }
    },
    {
      id: 4,
      question: "How should you act during an emergency drill at school?",
      emoji: "🚨",
      correctAnswer: "Follow instructions seriously and evacuate calmly",
      options: [
        { text: "Treat it as a joke and laugh", isCorrect: false },
        { text: "Run around chaotically", isCorrect: false },
        { text: "Follow instructions seriously and evacuate calmly", isCorrect: true },
        { text: "Hide instead of evacuating", isCorrect: false }
      ],
      feedback: {
        correct: "Well done! Following instructions seriously prepares you for real emergencies!",
        incorrect: "Treating drills as jokes or running chaotically defeats their purpose. Follow instructions seriously and evacuate calmly!"
      }
    },
    {
      id: 5,
      question: "What should you do if you find money on the ground?",
      emoji: "💵",
      correctAnswer: "Turn it in to lost and found or local authorities",
      options: [
        { text: "Turn it in to lost and found or local authorities", isCorrect: true },
        { text: "Keep it since nobody saw you pick it up", isCorrect: false },
        { text: "Throw it away since you don't know the owner", isCorrect: false },
        { text: "Use it to buy something for yourself", isCorrect: false }
      ],
      feedback: {
        correct: "Awesome! Turning in found money shows honesty and integrity!",
        incorrect: "Keeping or throwing away found money isn't honest. Turn it in to lost and found or local authorities!"
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

  const handleNext = () => {
    navigate("/games/civic-responsibility/kids");
  };

  const finalScore = score;
  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title="Reflex Action"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Quick action choices!` : "Quick action choices!"}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={finalScore}
      gameId="civic-responsibility-kids-93"
      gameType="civic-responsibility"
      totalLevels={TOTAL_ROUNDS}
      currentLevel={currentRound}
      showConfetti={gameState === "finished" && finalScore === TOTAL_ROUNDS}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={TOTAL_ROUNDS} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/civic-responsibility/kids/puzzle-match-leaders"
      nextGameIdProp="civic-responsibility-kids-94">
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🌳👥🔧🚨💵</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Quick action choices!<br />
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
                {finalScore >= 4 ? "Excellent job! You're an action hero!" : 
                 finalScore >= 3 ? "Good work! Keep taking positive action!" : 
                 "Keep practicing quick positive actions and you'll improve!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexAction;