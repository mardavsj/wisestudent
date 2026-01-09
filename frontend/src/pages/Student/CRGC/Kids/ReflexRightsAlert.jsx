import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexRightsAlert = () => {
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
      question: "What should you do if a classmate is being denied lunch at school?",
      emoji: "🍽️",
      correctAnswer: "Report it to a teacher or school administrator",
      options: [
        { text: "Ignore it since it's not your problem", isCorrect: false },
        { text: "Join in excluding that student", isCorrect: false },
        { text: "Report it to a teacher or school administrator", isCorrect: true },
        { text: "Tell other students to laugh at them", isCorrect: false }
      ],
      feedback: {
        correct: "Great job! Reporting violations ensures everyone's rights are protected!",
        incorrect: "Remember, ignoring or participating in rights violations makes you complicit. Report it to a teacher or school administrator!"
      }
    },
    {
      id: 2,
      question: "How should you respond if someone is bullying another student?",
      emoji: "✋",
      correctAnswer: "Intervene safely and report to adults",
      options: [
        { text: "Watch and record it for social media", isCorrect: false },
        { text: "Intervene safely and report to adults", isCorrect: true },
        { text: "Join in the bullying", isCorrect: false },
        { text: "Laugh along to fit in", isCorrect: false }
      ],
      feedback: {
        correct: "Excellent! Intervening safely and reporting helps protect victims' rights!",
        incorrect: "Watching, joining, or laughing at bullying violates others' rights. Intervene safely and report to adults!"
      }
    },
    {
      id: 3,
      question: "What's the appropriate action if a student is forced to do chores during class time?",
      emoji: "🧹",
      correctAnswer: "Speak to the principal about educational rights",
      options: [
        { text: "Stay quiet to avoid trouble", isCorrect: false },
        { text: "Encourage others to do the same", isCorrect: false },
        { text: "Mock the student for being punished", isCorrect: false },
        { text: "Speak to the principal about educational rights", isCorrect: true },
      ],
      feedback: {
        correct: "Perfect! Speaking up protects educational rights for all students!",
        incorrect: "Staying quiet or mocking others violates their right to education. Speak to the principal about educational rights!"
      }
    },
    {
      id: 4,
      question: "How should you react if someone is spreading rumors about a classmate?",
      emoji: "🗣️",
      correctAnswer: "Confront them respectfully and support the victim",
      options: [
        { text: "Confront them respectfully and support the victim", isCorrect: true },
        { text: "Spread the rumors further", isCorrect: false },
        { text: "Ignore it completely", isCorrect: false },
        { text: "Join in the gossip", isCorrect: false }
      ],
      feedback: {
        correct: "Well done! Confronting respectfully and supporting victims protects dignity rights!",
        incorrect: "Spreading rumors or ignoring them violates others' dignity. Confront them respectfully and support the victim!"
      }
    },
    {
      id: 5,
      question: "What should you do if students are segregated based on academic performance?",
      emoji: "📊",
      correctAnswer: "Advocate for equal treatment and inclusive policies",
      options: [
        { text: "Accept it as normal", isCorrect: false },
        { text: "Tease lower-performing students", isCorrect: false },
        { text: "Advocate for equal treatment and inclusive policies", isCorrect: true },
        { text: "Avoid students who perform differently", isCorrect: false }
      ],
      feedback: {
        correct: "Awesome! Advocating for equality ensures fair treatment for everyone!",
        incorrect: "Accepting segregation or teasing others violates equality rights. Advocate for equal treatment and inclusive policies!"
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
      title="Reflex Rights Alert"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Quick rights choices!` : "Quick rights choices!"}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={finalScore}
      gameId="civic-responsibility-kids-63"
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
      nextGamePathProp="/student/civic-responsibility/kids/puzzle-match-rights"
      nextGameIdProp="civic-responsibility-kids-64">
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🍽️✋🧹🗣️📊</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Quick rights choices!<br />
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
                {finalScore >= 4 ? "Excellent job! You're a rights defender champion!" : 
                 finalScore >= 3 ? "Good work! Keep standing up for rights!" : 
                 "Keep learning about rights and you'll improve!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexRightsAlert;