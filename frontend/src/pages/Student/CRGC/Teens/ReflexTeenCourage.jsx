import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexTeenCourage = () => {
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
      question: "What should you do if you witness a classmate being bullied but you're afraid of becoming a target?",
      emoji: "😱",
      correctAnswer: "Find a trusted adult to help and support the victim discretely",
      options: [
        { text: "Join in to avoid being targeted yourself", isCorrect: false },
        { text: "Find a trusted adult to help and support the victim discretely", isCorrect: true },
        { text: "Laugh along to fit in with the group", isCorrect: false },
        { text: "Stay silent and avoid the situation entirely", isCorrect: false }
      ],
      feedback: {
        correct: "Great job! Finding a trusted adult to help shows courage and ensures the victim gets proper support!",
        incorrect: "Joining in or staying silent allows bullying to continue. Find a trusted adult to help and support the victim discretely!"
      }
    },
    {
      id: 2,
      question: "How should you respond when you see someone being excluded from a group activity?",
      emoji: "👥",
      correctAnswer: "Invite the person to join and ensure everyone feels included",
      options: [
        { text: "Ignore it since it's not your problem", isCorrect: false },
        { text: "Join the exclusion to avoid being left out yourself", isCorrect: false },
        { text: "Make fun of the person being excluded", isCorrect: false },
        { text: "Invite the person to join and ensure everyone feels included", isCorrect: true },
      ],
      feedback: {
        correct: "Excellent! Inviting others to join creates a welcoming environment and shows true courage!",
        incorrect: "Ignoring or participating in exclusion hurts others. Invite the person to join and ensure everyone feels included!"
      }
    },
    {
      id: 3,
      question: "What's the best approach when you disagree with a popular opinion that you know is harmful?",
      emoji: "🤔",
      correctAnswer: "Express your concerns respectfully and provide factual information",
      options: [
        { text: "Express your concerns respectfully and provide factual information", isCorrect: true },
        { text: "Stay silent to avoid social backlash", isCorrect: false },
        { text: "Agree publicly but complain privately", isCorrect: false },
        { text: "Start an argument to prove your point", isCorrect: false }
      ],
      feedback: {
        correct: "Perfect! Expressing concerns respectfully with facts promotes understanding and positive change!",
        incorrect: "Staying silent or starting arguments doesn't help. Express your concerns respectfully and provide factual information!"
      }
    },
    {
      id: 4,
      question: "How should you handle a situation where you see someone cheating and getting away with it?",
      emoji: "📝",
      correctAnswer: "Consider the impact on others and decide whether to report it appropriately",
      options: [
        { text: "Ignore it since it doesn't affect you personally", isCorrect: false },
        { text: "Start spreading rumors about the person", isCorrect: false },
        { text: "Consider the impact on others and decide whether to report it appropriately", isCorrect: true },
        { text: "Copy their behavior to get ahead yourself", isCorrect: false }
      ],
      feedback: {
        correct: "Well done! Considering the impact on others and reporting appropriately shows moral courage!",
        incorrect: "Ignoring unethical behavior or copying it is harmful. Consider the impact on others and decide whether to report it appropriately!"
      }
    },
    {
      id: 5,
      question: "What should you do if you notice a friend engaging in risky behavior that could harm them?",
      emoji: "⚠️",
      correctAnswer: "Express concern honestly and encourage them to seek help if needed",
      options: [
        { text: "Ignore it to avoid conflict in the friendship", isCorrect: false },
        { text: "Express concern honestly and encourage them to seek help if needed", isCorrect: true },
        { text: "Tell everyone else about their behavior", isCorrect: false },
        { text: "Join in to show you're a loyal friend", isCorrect: false }
      ],
      feedback: {
        correct: "Awesome! Expressing honest concern for a friend's wellbeing shows true courage and care!",
        incorrect: "Ignoring harmful behavior or gossiping about it doesn't help. Express concern honestly and encourage them to seek help if needed!"
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
      title="Reflex Teen Courage"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Quick courage choices!` : "Quick courage choices!"}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={finalScore}
      gameId="civic-responsibility-teens-39"
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
      nextGamePathProp="/student/civic-responsibility/teens/badge-peer-protector-teen"
      nextGameIdProp="civic-responsibility-teens-40">
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">😱👥🤔📝⚠️</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Quick courage choices!<br />
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
                {finalScore >= 4 ? "Excellent job! You're a courage champion!" : 
                 finalScore >= 3 ? "Good work! Keep practicing courageous decision-making!" : 
                 "Keep developing your courage and you'll improve!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexTeenCourage;