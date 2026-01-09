import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexTeenPeace = () => {
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
      question: "What should you do if you witness two classmates arguing intensely in the hallway?",
      emoji: "🚶",
      correctAnswer: "Stay calm and suggest they talk it out or find a teacher",
      options: [
        { text: "Join in to take sides and escalate the situation", isCorrect: false },
        { text: "Record the argument to share on social media", isCorrect: false },
        { text: "Stay calm and suggest they talk it out or find a teacher", isCorrect: true },
        { text: "Ignore it completely and walk away", isCorrect: false }
      ],
      feedback: {
        correct: "Great job! Staying calm and suggesting peaceful solutions helps de-escalate conflicts!",
        incorrect: "Joining sides or recording conflicts escalates situations. Stay calm and suggest they talk it out or find a teacher!"
      }
    },
    {
      id: 2,
      question: "How should you respond when someone spreads rumors about you online?",
      emoji: "📱",
      correctAnswer: "Address it calmly by talking to the person and reporting serious cases",
      options: [
        { text: "Start spreading rumors about them in return", isCorrect: false },
        { text: "Address it calmly by talking to the person and reporting serious cases", isCorrect: true },
        { text: "Completely ignore it and hope it goes away", isCorrect: false },
        { text: "Publicly shame them on social media", isCorrect: false }
      ],
      feedback: {
        correct: "Excellent! Addressing issues calmly and reporting serious cases promotes peaceful resolution!",
        incorrect: "Spreading rumors or public shaming escalates conflicts. Address it calmly by talking to the person and reporting serious cases!"
      }
    },
    {
      id: 3,
      question: "What's the best approach when you disagree with a group decision?",
      emoji: "👥",
      correctAnswer: "Express your concerns respectfully and suggest alternatives",
      options: [
        { text: "Storm out and refuse to participate", isCorrect: false },
        { text: "Express your concerns respectfully and suggest alternatives", isCorrect: true },
        { text: "Agree publicly but sabotage the decision", isCorrect: false },
        { text: "Force others to accept your viewpoint", isCorrect: false }
      ],
      feedback: {
        correct: "Perfect! Expressing concerns respectfully and suggesting alternatives leads to better group decisions!",
        incorrect: "Storming out or sabotaging decisions harms group dynamics. Express your concerns respectfully and suggest alternatives!"
      }
    },
    {
      id: 4,
      question: "How should you handle a situation where you're feeling overwhelmed by stress and anger?",
      emoji: "😤",
      correctAnswer: "Take deep breaths, step away, and use calming techniques",
      options: [
        { text: "Take it out on others who are nearby", isCorrect: false },
        { text: "Suppress all emotions until you explode later", isCorrect: false },
        { text: "Engage in risky behaviors to distract yourself", isCorrect: false },
        { text: "Take deep breaths, step away, and use calming techniques", isCorrect: true },
      ],
      feedback: {
        correct: "Well done! Taking deep breaths and using calming techniques helps manage stress peacefully!",
        incorrect: "Taking emotions out on others or suppressing them leads to bigger problems. Take deep breaths, step away, and use calming techniques!"
      }
    },
    {
      id: 5,
      question: "What should you do if you notice tension building between two friend groups?",
      emoji: "👥",
      correctAnswer: "Act as a bridge to encourage understanding and communication",
      options: [
        { text: "Choose a side and encourage others to do the same", isCorrect: false },
        { text: "Stay neutral but gossip about both groups", isCorrect: false },
        { text: "Act as a bridge to encourage understanding and communication", isCorrect: true },
        { text: "Avoid all contact with members of both groups", isCorrect: false }
      ],
      feedback: {
        correct: "Awesome! Acting as a bridge helps reduce tension and promotes peaceful coexistence!",
        incorrect: "Choosing sides or gossiping increases division. Act as a bridge to encourage understanding and communication!"
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
      title="Reflex Teen Peace"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Quick peace choices!` : "Quick peace choices!"}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={finalScore}
      gameId="civic-responsibility-teens-49"
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
      nextGamePathProp="/student/civic-responsibility/teens/badge-peace-maker-teen"
      nextGameIdProp="civic-responsibility-teens-50">
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🚶📱😤👥</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Quick peace choices!<br />
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
                {finalScore >= 4 ? "Excellent job! You're a peace champion!" : 
                 finalScore >= 3 ? "Good work! Keep practicing peaceful decision-making!" : 
                 "Keep developing your peace-building skills and you'll improve!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexTeenPeace;