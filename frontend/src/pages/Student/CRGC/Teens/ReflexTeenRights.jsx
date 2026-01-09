import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexTeenRights = () => {
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
      question: "What should you do if you witness someone being treated unfairly because of their gender?",
      emoji: "⚖️",
      correctAnswer: "Stand up for them and report the incident to a trusted adult",
      options: [
        { text: "Ignore it since it's not your problem", isCorrect: false },
        { text: "Join in to fit in with the group", isCorrect: false },
        { text: "Stand up for them and report the incident to a trusted adult", isCorrect: true },
        { text: "Record it for social media without helping", isCorrect: false }
      ],
      feedback: {
        correct: "Great job! Standing up for others and reporting unfair treatment helps create a safer environment for everyone!",
        incorrect: "Ignoring unfair treatment or joining in makes the situation worse. Stand up for others and report incidents to trusted adults!"
      }
    },
    {
      id: 2,
      question: "How should you respond when someone tells you that boys/girls can't do certain activities?",
      emoji: "🏃‍♀️",
      correctAnswer: "Explain that abilities depend on individuals, not gender",
      options: [
        { text: "Accept it without question", isCorrect: false },
        { text: "Make fun of them for having outdated views", isCorrect: false },
        { text: "Challenge them to a fight", isCorrect: false },
        { text: "Explain that abilities depend on individuals, not gender", isCorrect: true },
      ],
      feedback: {
        correct: "Excellent! Abilities depend on practice and dedication, not gender. Promoting this understanding helps break stereotypes!",
        incorrect: "Accepting stereotypes or responding aggressively doesn't help. Explain that abilities depend on individuals, not gender!"
      }
    },
    {
      id: 3,
      question: "What's the appropriate response if you're excluded from an activity because of your gender?",
      emoji: "🚫",
      correctAnswer: "Speak to a teacher or counselor about the discrimination",
      options: [
        { text: "Start a fight with those excluding you", isCorrect: false },
        { text: "Speak to a teacher or counselor about the discrimination", isCorrect: true },
        { text: "Complain to friends but take no action", isCorrect: false },
        { text: "Exclude others in return", isCorrect: false }
      ],
      feedback: {
        correct: "Perfect! Reporting discrimination to authorities helps address systemic issues and protects others from similar treatment!",
        incorrect: "Fighting or excluding others in return escalates conflict. Speak to teachers or counselors about discrimination!"
      }
    },
    {
      id: 4,
      question: "How should you handle unequal treatment in group projects based on gender?",
      emoji: "👥",
      correctAnswer: "Address the issue directly and ensure fair distribution of tasks",
      options: [
        { text: "Address the issue directly and ensure fair distribution of tasks", isCorrect: true },
        { text: "Accept unequal treatment to avoid conflict", isCorrect: false },
        { text: "Complain behind others' backs", isCorrect: false },
        { text: "Quit the project entirely", isCorrect: false }
      ],
      feedback: {
        correct: "Well done! Addressing issues directly and ensuring fairness helps create equitable environments for everyone!",
        incorrect: "Accepting unequal treatment or complaining without action perpetuates unfairness. Address issues directly and ensure fair task distribution!"
      }
    },
    {
      id: 5,
      question: "What should you do if you notice gender-based restrictions in school policies?",
      emoji: "📜",
      correctAnswer: "Research the issue and discuss it constructively with school administration",
      options: [
        { text: "Ignore the policies since they're official", isCorrect: false },
        { text: "Protest loudly without understanding the context", isCorrect: false },
        { text: "Research the issue and discuss it constructively with school administration", isCorrect: true },
        { text: "Encourage others to break the rules", isCorrect: false }
      ],
      feedback: {
        correct: "Awesome! Researching issues and engaging constructively with administration leads to meaningful policy improvements!",
        incorrect: "Ignoring problematic policies or protesting without research doesn't create change. Research issues and discuss them constructively with administration!"
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
      title="Reflex Teen Rights"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Quick rights choices!` : "Quick rights choices!"}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={finalScore}
      gameId="civic-responsibility-teens-23"
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
      nextGamePathProp="/student/civic-responsibility/teens/puzzle-gender-barriers"
      nextGameIdProp="civic-responsibility-teens-24">
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">⚖️🏃‍♀️🚫👥📜</div>
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
                {finalScore >= 4 ? "Excellent job! You're a rights champion!" : 
                 finalScore >= 3 ? "Good work! Keep practicing rights awareness!" : 
                 "Keep developing your rights awareness and you'll improve!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexTeenRights;