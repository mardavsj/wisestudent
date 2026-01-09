import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexInclusion = () => {
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
      question: "What should you do if a new student joins your class?",
      emoji: "👋",
      correctAnswer: "Welcome them and introduce them to others",
      options: [
        { text: "Ignore them completely", isCorrect: false },
        { text: "Welcome them and introduce them to others", isCorrect: true },
        { text: "Make fun of their accent", isCorrect: false },
        { text: "Tell others not to talk to them", isCorrect: false }
      ],
      feedback: {
        correct: "Great job! Welcoming new students and introducing them shows inclusion!",
        incorrect: "Remember, ignoring or making fun of new students isn't inclusive. Welcome them and introduce them to others!"
      }
    },
    {
      id: 2,
      question: "How can you include someone who seems left out?",
      emoji: "🤝",
      correctAnswer: "Invite them to join your group activity",
      options: [
        { text: "Point out that they're alone", isCorrect: false },
        { text: "Avoid them so they don't feel awkward", isCorrect: false },
        { text: "Invite them to join your group activity", isCorrect: true },
        { text: "Talk about them behind their back", isCorrect: false }
      ],
      feedback: {
        correct: "Excellent! Inviting someone to join your group activity shows kindness and inclusion!",
        incorrect: "Don't forget that avoiding or talking about someone behind their back isn't kind. Invite them to join!"
      }
    },
    {
      id: 3,
      question: "What's the best way to handle different opinions in a group?",
      emoji: "💭",
      correctAnswer: "Listen to all perspectives respectfully",
      options: [
        { text: "Listen to all perspectives respectfully", isCorrect: true },
        { text: "Shout down opposing views", isCorrect: false },
        { text: "Only listen to people like you", isCorrect: false },
        { text: "Dismiss ideas that are different", isCorrect: false }
      ],
      feedback: {
        correct: "Perfect! Listening to all perspectives respectfully shows true inclusion!",
        incorrect: "Shouting down or dismissing different opinions isn't inclusive. Listen respectfully to all perspectives!"
      }
    },
    {
      id: 4,
      question: "How should you respond to someone with different abilities?",
      emoji: "♿",
      correctAnswer: "Treat them with respect and offer help if needed",
      options: [
        { text: "Avoid interacting with them", isCorrect: false },
        { text: "Make assumptions about what they can't do", isCorrect: false },
        { text: "Treat them with respect and offer help if needed", isCorrect: true },
        { text: "Speak for them instead of letting them speak", isCorrect: false }
      ],
      feedback: {
        correct: "Well done! Treating everyone with respect and offering help when appropriate shows inclusion!",
        incorrect: "Avoiding or speaking for someone with different abilities isn't respectful. Treat them with respect and offer help if needed!"
      }
    },
    {
      id: 5,
      question: "What should you do if you notice someone being excluded?",
      emoji: "👀",
      correctAnswer: "Include them in the activity",
      options: [
        { text: "Join in the exclusion", isCorrect: false },
        { text: "Include them in the activity", isCorrect: true },
        { text: "Ignore the situation", isCorrect: false },
        { text: "Tell others to exclude them more", isCorrect: false }
      ],
      feedback: {
        correct: "Awesome! Including someone who is being left out shows leadership and inclusion!",
        incorrect: "Joining in or ignoring exclusion isn't helpful. Including them in the activity is the right choice!"
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
      title="Reflex Inclusion"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Quick inclusion choices!` : "Quick inclusion choices!"}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={finalScore}
      gameId="civic-responsibility-kids-19"
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
      nextGamePathProp="/student/civic-responsibility/kids/badge-respect-kid"
      nextGameIdProp="civic-responsibility-kids-20">
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">👋🤝💭♿👀</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Quick inclusion choices!<br />
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
                {finalScore >= 4 ? "Excellent job! You're an inclusion expert!" : 
                 finalScore >= 3 ? "Good work! Keep promoting inclusion!" : 
                 "Keep practicing inclusive behaviors and you'll improve!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexInclusion;