import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexTeenCompassion = () => {
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
      question: "How should you respond when you see a classmate being bullied online?",
      emoji: "💻",
      correctAnswer: "Report the behavior and offer support to the victim",
      options: [
        { text: "Join in the cyberbullying for entertainment", isCorrect: false },
        { text: "Report the behavior and offer support to the victim", isCorrect: true },
        { text: "Ignore it completely to avoid getting involved", isCorrect: false },
        { text: "Share the posts to gain social media attention", isCorrect: false }
      ],
      feedback: {
        correct: "Great job! Reporting cyberbullying and supporting victims helps create a safer online environment!",
        incorrect: "Remember, ignoring or participating in cyberbullying harms others. Report the behavior and offer support to the victim!"
      }
    },
    {
      id: 2,
      question: "What's the best way to help a friend going through a difficult time?",
      emoji: "🤗",
      correctAnswer: "Listen actively and offer practical assistance when possible",
      options: [
        { text: "Give unsolicited advice without listening", isCorrect: false },
        { text: "Avoid them until they cheer up", isCorrect: false },
        { text: "Listen actively and offer practical assistance when possible", isCorrect: true },
        { text: "Talk about your own problems instead", isCorrect: false }
      ],
      feedback: {
        correct: "Excellent! Active listening and practical support show genuine care for friends in need!",
        incorrect: "Giving advice without listening or avoiding friends doesn't help. Listen actively and offer practical assistance when possible!"
      }
    },
    {
      id: 3,
      question: "How should you react when witnessing someone being discriminated against?",
      emoji: "✊",
      correctAnswer: "Stand up against discrimination and support the targeted person",
      options: [
        { text: "Stay silent to avoid conflict", isCorrect: false },
        { text: "Join in the discriminatory behavior", isCorrect: false },
        { text: "Record it for social media without intervening", isCorrect: false },
        { text: "Stand up against discrimination and support the targeted person", isCorrect: true },
      ],
      feedback: {
        correct: "Perfect! Standing up against discrimination promotes justice and inclusion!",
        incorrect: "Staying silent or joining discrimination enables harm. Stand up against discrimination and support the targeted person!"
      }
    },
    {
      id: 4,
      question: "What should you do if you notice an elderly neighbor struggling with groceries?",
      emoji: "👵",
      correctAnswer: "Offer to help carry their groceries to their door",
      options: [
        { text: "Pretend you didn't see them", isCorrect: false },
        { text: "Comment on their situation without offering help", isCorrect: false },
        { text: "Offer to help carry their groceries to their door", isCorrect: true },
        { text: "Take a photo to post about them online", isCorrect: false }
      ],
      feedback: {
        correct: "Well done! Offering practical help to elderly neighbors shows compassion and community spirit!",
        incorrect: "Pretending not to see or taking photos without helping isn't compassionate. Offer to help carry their groceries to their door!"
      }
    },
    {
      id: 5,
      question: "How should you respond to a homeless person asking for help?",
      emoji: "🏠",
      correctAnswer: "Treat them with dignity and offer appropriate assistance",
      options: [
        { text: "Ignore them or make negative comments", isCorrect: false },
        { text: "Give money without considering their actual needs", isCorrect: false },
        { text: "Treat them with dignity and offer appropriate assistance", isCorrect: true },
        { text: "Call attention to them for others to see", isCorrect: false }
      ],
      feedback: {
        correct: "Awesome! Treating everyone with dignity and offering thoughtful assistance demonstrates true compassion!",
        incorrect: "Ignoring or exploiting vulnerable people lacks compassion. Treat them with dignity and offer appropriate assistance!"
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
    navigate("/games/civic-responsibility/teens");
  };

  const finalScore = score;
  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title="Reflex Teen Compassion"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Quick compassion choices!` : "Quick compassion choices!"}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={finalScore}
      gameId="civic-responsibility-teens-3"
      gameType="civic-responsibility"
      totalLevels={TOTAL_ROUNDS}
      currentLevel={currentRound}
      showConfetti={gameState === "finished" && finalScore === TOTAL_ROUNDS}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={TOTAL_ROUNDS} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/civic-responsibility/teens/puzzle-kind-acts"
      nextGameIdProp="civic-responsibility-teens-4">
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">💻🤗✊👵🏠</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Quick compassion choices!<br />
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
                {finalScore >= 4 ? "Excellent job! You're a compassion champion!" : 
                 finalScore >= 3 ? "Good work! Keep practicing compassion!" : 
                 "Keep developing your compassion skills and you'll improve!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexTeenCompassion;