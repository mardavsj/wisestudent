import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexTeenRespect = () => {
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
      question: "How should you respond when someone expresses an opinion that differs from yours?",
      emoji: "💭",
      correctAnswer: "Listen respectfully and engage in constructive dialogue",
      options: [
        { text: "Immediately dismiss their viewpoint as wrong", isCorrect: false },
        { text: "Mock their opinion to show how foolish it is", isCorrect: false },
        { text: "Listen respectfully and engage in constructive dialogue", isCorrect: true },
        { text: "Ignore them completely and avoid further interaction", isCorrect: false }
      ],
      feedback: {
        correct: "Great job! Listening respectfully and engaging in constructive dialogue shows maturity and respect for others!",
        incorrect: "Remember, dismissing or mocking others' viewpoints prevents meaningful exchange. Listen respectfully and engage in constructive dialogue!"
      }
    },
    {
      id: 2,
      question: "What's the appropriate response when a classmate from a different cultural background shares their traditions?",
      emoji: "🌏",
      correctAnswer: "Show genuine interest and ask respectful questions",
      options: [
        { text: "Make fun of their traditions behind their back", isCorrect: false },
        { text: "Show genuine interest and ask respectful questions", isCorrect: true },
        { text: "Pretend you're not interested to avoid awkwardness", isCorrect: false },
        { text: "Try to convert them to your own cultural practices", isCorrect: false }
      ],
      feedback: {
        correct: "Excellent! Showing genuine interest in others' traditions promotes understanding and inclusion!",
        incorrect: "Pretending disinterest or making fun of traditions is disrespectful. Show genuine interest and ask respectful questions!"
      }
    },
    {
      id: 3,
      question: "How should you handle a disagreement with a teacher or authority figure?",
      emoji: "👩‍🏫",
      correctAnswer: "Express your concerns respectfully through appropriate channels",
      options: [
        { text: "Publicly argue and challenge their authority", isCorrect: false },
        { text: "Complain to friends but never address the issue directly", isCorrect: false },
        { text: "Express your concerns respectfully through appropriate channels", isCorrect: true },
        { text: "Ignore the issue but sabotage their efforts secretly", isCorrect: false }
      ],
      feedback: {
        correct: "Perfect! Addressing disagreements respectfully through proper channels demonstrates maturity and responsibility!",
        incorrect: "Public arguing or secret sabotage undermines respect. Express your concerns respectfully through appropriate channels!"
      }
    },
    {
      id: 4,
      question: "What should you do if you witness someone being disrespected by peers?",
      emoji: "👥",
      correctAnswer: "Support the person being disrespected and address the behavior",
      options: [
        { text: "Join in to fit in with the group", isCorrect: false },
        { text: "Stay silent to avoid becoming a target yourself", isCorrect: false },
        { text: "Record it for social media without intervening", isCorrect: false },
        { text: "Support the person being disrespected and address the behavior", isCorrect: true },
      ],
      feedback: {
        correct: "Well done! Supporting those being disrespected and addressing inappropriate behavior promotes a respectful environment!",
        incorrect: "Joining in or staying silent enables disrespect. Support the person being disrespected and address the behavior!"
      }
    },
    {
      id: 5,
      question: "How should you treat someone who has made mistakes or poor choices in the past?",
      emoji: "🔄",
      correctAnswer: "Judge them based on their current actions and give them a chance to grow",
      options: [
        { text: "Hold their past mistakes against them permanently", isCorrect: false },
        { text: "Completely ignore their past and pretend it never happened", isCorrect: false },
        { text: "Judge them based on their current actions and give them a chance to grow", isCorrect: true },
        { text: "Spread stories about their past to warn others", isCorrect: false }
      ],
      feedback: {
        correct: "Awesome! Judging people based on their current actions and allowing growth shows true respect and maturity!",
        incorrect: "Holding permanent grudges or spreading past mistakes lacks respect. Judge them based on their current actions and give them a chance to grow!"
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
      title="Reflex Teen Respect"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Quick respect choices!` : "Quick respect choices!"}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={finalScore}
      gameId="civic-responsibility-teens-13"
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
      nextGamePathProp="/student/civic-responsibility/teens/puzzle-inclusion-acts"
      nextGameIdProp="civic-responsibility-teens-14">
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">💭🌏👩‍🏫👥🔄</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Quick respect choices!<br />
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
                {finalScore >= 4 ? "Excellent job! You're a respect champion!" : 
                 finalScore >= 3 ? "Good work! Keep practicing respect!" : 
                 "Keep developing your respect skills and you'll improve!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexTeenRespect;