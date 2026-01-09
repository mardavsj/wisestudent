import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexTeenBullyAlert = () => {
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
      question: "What should you do if you receive a threatening message from someone you don't know online?",
      emoji: "📱",
      correctAnswer: "Block the sender, report the message, and tell a trusted adult",
      options: [
        { text: "Respond with insults to defend yourself", isCorrect: false },
        { text: "Share the message with friends for laughs", isCorrect: false },
        { text: "Block the sender, report the message, and tell a trusted adult", isCorrect: true },
        { text: "Ignore it and hope it goes away", isCorrect: false }
      ],
      feedback: {
        correct: "Great job! Blocking, reporting, and telling a trusted adult is the safest way to handle online threats!",
        incorrect: "Responding or ignoring threats can make the situation worse. Block the sender, report the message, and tell a trusted adult!"
      }
    },
    {
      id: 2,
      question: "How should you respond if you witness someone being cyberbullied in a group chat?",
      emoji: "💬",
      correctAnswer: "Defend the victim, report the bullying, and encourage others to do the same",
      options: [
        { text: "Join in to fit in with the group", isCorrect: false },
        { text: "Defend the victim, report the bullying, and encourage others to do the same", isCorrect: true },
        { text: "Stay silent to avoid becoming a target", isCorrect: false },
        { text: "Leave the group chat and ignore it", isCorrect: false }
      ],
      feedback: {
        correct: "Excellent! Defending victims and reporting bullying helps create a safer online environment for everyone!",
        incorrect: "Staying silent or leaving the situation allows bullying to continue. Defend the victim, report the bullying, and encourage others to do the same!"
      }
    },
    {
      id: 3,
      question: "What's the best approach if you accidentally share something embarrassing about yourself online?",
      emoji: "😬",
      correctAnswer: "Apologize if needed, learn from the mistake, and adjust privacy settings",
      options: [
        { text: "Apologize if needed, learn from the mistake, and adjust privacy settings", isCorrect: true },
        { text: "Delete the post and pretend it never happened", isCorrect: false },
        { text: "Blame others for pressuring you to share it", isCorrect: false },
        { text: "Post an angry rant about your embarrassment", isCorrect: false }
      ],
      feedback: {
        correct: "Perfect! Taking responsibility, learning from mistakes, and adjusting privacy settings prevents future issues!",
        incorrect: "Deleting posts or blaming others doesn't address the underlying issue. Apologize if needed, learn from the mistake, and adjust privacy settings!"
      }
    },
    {
      id: 4,
      question: "How should you handle a friend who is being mean to others online?",
      emoji: "👥",
      correctAnswer: "Talk to them privately about their behavior and encourage positive actions",
      options: [
        { text: "Publicly call them out to shame them", isCorrect: false },
        { text: "Cut off all communication immediately", isCorrect: false },
        { text: "Talk to them privately about their behavior and encourage positive actions", isCorrect: true },
        { text: "Join in to show you're loyal", isCorrect: false }
      ],
      feedback: {
        correct: "Well done! Addressing behavior privately preserves friendships while encouraging positive change!",
        incorrect: "Public shaming or cutting off communication damages relationships. Talk to them privately about their behavior and encourage positive actions!"
      }
    },
    {
      id: 5,
      question: "What should you do if you notice a classmate posting concerning messages about self-harm?",
      emoji: "🆘",
      correctAnswer: "Take it seriously, tell a trusted adult immediately, and offer support to the person",
      options: [
        { text: "Dismiss it as attention-seeking behavior", isCorrect: false },
        { text: "Share screenshots with friends to discuss", isCorrect: false },
        { text: "Confront the person directly about their posts", isCorrect: false },
        { text: "Take it seriously, tell a trusted adult immediately, and offer support to the person", isCorrect: true },
      ],
      feedback: {
        correct: "Awesome! Taking concerning messages seriously and involving adults can save lives!",
        incorrect: "Dismissing or sharing concerning messages can have serious consequences. Take it seriously, tell a trusted adult immediately, and offer support!"
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
      title="Reflex Teen Bully Alert"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Quick anti-bullying choices!` : "Quick anti-bullying choices!"}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={finalScore}
      gameId="civic-responsibility-teens-33"
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
      nextGamePathProp="/student/civic-responsibility/teens/puzzle-peer-support"
      nextGameIdProp="civic-responsibility-teens-34">
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">📱💬😬👥🆘</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Quick anti-bullying choices!<br />
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
                {finalScore >= 4 ? "Excellent job! You're an anti-bullying champion!" : 
                 finalScore >= 3 ? "Good work! Keep practicing anti-bullying awareness!" : 
                 "Keep developing your anti-bullying awareness and you'll improve!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexTeenBullyAlert;