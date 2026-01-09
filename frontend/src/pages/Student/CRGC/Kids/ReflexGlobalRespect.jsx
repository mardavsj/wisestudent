import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexGlobalRespect = () => {
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
      question: "What should you do when encountering a cultural practice you don't understand?",
      emoji: "🤔",
      correctAnswer: "Approach with curiosity and ask respectful questions",
      options: [
        { text: "Make fun of it immediately", isCorrect: false },
        { text: "Avoid anyone who practices it", isCorrect: false },
        { text: "Approach with curiosity and ask respectful questions", isCorrect: true },
        { text: "Pretend it doesn't exist", isCorrect: false }
      ],
      feedback: {
        correct: "Great job! Approaching with curiosity and asking respectful questions helps build understanding!",
        incorrect: "Remember, making fun or avoiding people shows disrespect. Approach with curiosity and ask respectful questions!"
      }
    },
    {
      id: 2,
      question: "How should you respond when someone shares their cultural traditions with you?",
      emoji: "🤝",
      correctAnswer: "Listen actively and show genuine interest",
      options: [
        { text: "Nod politely but stay disinterested", isCorrect: false },
        { text: "Interrupt with your own experiences", isCorrect: false },
        { text: "Listen actively and show genuine interest", isCorrect: true },
        { text: "Compare everything to your culture", isCorrect: false }
      ],
      feedback: {
        correct: "Excellent! Listening actively and showing genuine interest makes others feel valued!",
        incorrect: "Nodding politely but staying disinterested is dismissive. Listen actively and show genuine interest!"
      }
    },
    {
      id: 3,
      question: "What's the best way to handle a misunderstanding with someone from another culture?",
      emoji: "💬",
      correctAnswer: "Communicate openly and seek to understand perspectives",
      options: [
        { text: "Blame them for the misunderstanding", isCorrect: false },
        { text: "Communicate openly and seek to understand perspectives", isCorrect: true },
        { text: "Avoid them completely from then on", isCorrect: false },
        { text: "Insist you're right without listening", isCorrect: false }
      ],
      feedback: {
        correct: "Perfect! Communicating openly and seeking to understand perspectives resolves conflicts constructively!",
        incorrect: "Blaming or avoiding others prevents resolution. Communicate openly and seek to understand perspectives!"
      }
    },
    {
      id: 4,
      question: "How should you react when invited to participate in a religious ceremony?",
      emoji: "⛪",
      correctAnswer: "Participate respectfully or observe quietly if not comfortable joining",
      options: [
        { text: "Mock the ceremony behind their back", isCorrect: false },
        { text: "Refuse rudely and criticize their beliefs", isCorrect: false },
        { text: "Force others to attend with you", isCorrect: false },
        { text: "Participate respectfully or observe quietly if not comfortable joining", isCorrect: true },
      ],
      feedback: {
        correct: "Well done! Participating respectfully or observing quietly shows consideration for others' beliefs!",
        incorrect: "Mocking or criticizing religious ceremonies is disrespectful. Participate respectfully or observe quietly if not comfortable joining!"
      }
    },
    {
      id: 5,
      question: "What should you do if you witness discrimination against someone from another culture?",
      emoji: "✊",
      correctAnswer: "Stand up against discrimination and support the person being targeted",
      options: [
        { text: "Stay silent to avoid getting involved", isCorrect: false },
        { text: "Stand up against discrimination and support the person being targeted", isCorrect: true },
        { text: "Join in the discriminatory behavior", isCorrect: false },
        { text: "Tell others to mind their own business", isCorrect: false }
      ],
      feedback: {
        correct: "Awesome! Standing up against discrimination and supporting targeted individuals promotes justice!",
        incorrect: "Staying silent or joining discriminatory behavior enables harm. Stand up against discrimination and support the person being targeted!"
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
      title="Reflex Global Respect"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Quick global choices!` : "Quick global choices!"}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={finalScore}
      gameId="civic-responsibility-kids-89"
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
      nextGamePathProp="/student/civic-responsibility/kids/badge-culture-friend-kid"
      nextGameIdProp="civic-responsibility-kids-90">
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🤔🤝💬⛪✊</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Quick global choices!<br />
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
                {finalScore >= 4 ? "Excellent job! You're a global respect champion!" : 
                 finalScore >= 3 ? "Good work! Keep practicing global respect!" : 
                 "Keep learning about global respect and you'll improve!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexGlobalRespect;