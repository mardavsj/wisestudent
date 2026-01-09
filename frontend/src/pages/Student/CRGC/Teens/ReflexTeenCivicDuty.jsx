import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexTeenCivicDuty = () => {
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
      question: "How should you respond when you notice a community issue that affects many people?",
      emoji: "🌟",
      correctAnswer: "Take initiative to organize a community meeting and develop a collaborative solution",
      options: [
        { text: "Take initiative to organize a community meeting and develop a collaborative solution", isCorrect: true },
        { text: "Ignore it since someone else will handle it", isCorrect: false },
        { text: "Complain about it without taking any action", isCorrect: false },
        { text: "Blame others for not addressing the problem", isCorrect: false }
      ],
      feedback: {
        correct: "Great job! Taking initiative and organizing collaborative solutions demonstrates strong civic leadership!",
        incorrect: "Ignoring or complaining without action doesn't solve problems. Take initiative to organize community meetings and develop solutions!"
      }
    },
    {
      id: 2,
      question: "What's the best approach when working on a group project that benefits your school?",
      emoji: "🤝",
      correctAnswer: "Actively participate, listen to others' ideas, and contribute your unique skills",
      options: [
        { text: "Let others do all the work while you take credit", isCorrect: false },
        { text: "Insist your ideas are the only valid ones", isCorrect: false },
        { text: "Actively participate, listen to others' ideas, and contribute your unique skills", isCorrect: true },
        { text: "Withdraw from the project when disagreements arise", isCorrect: false }
      ],
      feedback: {
        correct: "Excellent! Active participation and valuing diverse perspectives maximizes group project success!",
        incorrect: "Taking credit without contribution or dismissing others' ideas undermines teamwork. Actively participate and listen to others!"
      }
    },
    {
      id: 3,
      question: "How should you engage with local government representatives about issues affecting your community?",
      emoji: "🗳️",
      correctAnswer: "Attend town halls, write respectful emails, and present well-researched proposals",
      options: [
        { text: "Only complain on social media without direct engagement", isCorrect: false },
        { text: "Threaten or intimidate officials to get what you want", isCorrect: false },
        { text: "Attend town halls, write respectful emails, and present well-researched proposals", isCorrect: true },
        { text: "Ignore political processes entirely", isCorrect: false }
      ],
      feedback: {
        correct: "Perfect! Constructive engagement through official channels creates meaningful civic impact!",
        incorrect: "Social media complaints or intimidation don't create positive change. Attend town halls and present well-researched proposals!"
      }
    },
    {
      id: 4,
      question: "What should you do when you see a classmate being treated unfairly?",
      emoji: "🌱",
      correctAnswer: "Stand up for them respectfully and report serious issues to appropriate authorities",
      options: [
        { text: "Join in the unfair treatment to fit in with the group", isCorrect: false },
        { text: "Ignore the situation to avoid getting involved", isCorrect: false },
        { text: "Gossip about the situation without taking action", isCorrect: false },
        { text: "Stand up for them respectfully and report serious issues to appropriate authorities", isCorrect: true },
      ],
      feedback: {
        correct: "Well done! Standing up for others and reporting serious issues protects vulnerable community members!",
        incorrect: "Joining in mistreatment or gossiping without action enables harm. Stand up for others and report serious issues!"
      }
    },
    {
      id: 5,
      question: "How can you demonstrate civic responsibility in your daily life?",
      emoji: "🎯",
      correctAnswer: "Follow laws, volunteer for causes you care about, and treat others with respect",
      options: [
        { text: "Only follow laws when you think you might get caught", isCorrect: false },
        { text: "Follow laws, volunteer for causes you care about, and treat others with respect", isCorrect: true },
        { text: "Focus exclusively on personal goals without considering community impact", isCorrect: false },
        { text: "Expect others to solve community problems while you benefit from their efforts", isCorrect: false }
      ],
      feedback: {
        correct: "Awesome! Daily civic responsibility through law-following, volunteering, and respect strengthens communities!",
        incorrect: "Selective law-following or ignoring community impact undermines society. Follow laws, volunteer, and treat others with respect!"
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
      title="Reflex Teen Civic Duty"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Quick civic choices!` : "Quick civic choices!"}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={finalScore}
      gameId="civic-responsibility-teens-99"
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
      nextGamePathProp="/student/civic-responsibility/teens/badge-civic-leader-teen"
      nextGameIdProp="civic-responsibility-teens-100">
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🌟🤝🗳️🌱🎯</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Quick civic choices!<br />
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
                {finalScore >= 4 ? "Excellent job! You're a civic duty champion!" : 
                 finalScore >= 3 ? "Good work! Keep developing your civic responsibility skills!" : 
                 "Continue learning about civic duties and you'll improve!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexTeenCivicDuty;