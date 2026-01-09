import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexTeenLeader = () => {
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
      question: "How should a leader respond when team members express concerns about a project direction?",
      emoji: "👂",
      correctAnswer: "Listen actively, acknowledge concerns, and work collaboratively to find solutions",
      options: [
        { text: "Dismiss concerns as negativity that undermines progress", isCorrect: false },
        { text: "Listen actively, acknowledge concerns, and work collaboratively to find solutions", isCorrect: true },
        { text: "Ignore the feedback and continue with the original plan", isCorrect: false },
        { text: "Tell team members they don't understand the bigger picture", isCorrect: false }
      ],
      feedback: {
        correct: "Great job! Active listening and collaborative problem-solving build trust and lead to better outcomes!",
        incorrect: "Dismissing or ignoring team concerns creates disconnection. Listen actively and work collaboratively to find solutions!"
      }
    },
    {
      id: 2,
      question: "What's the best way to handle a team member who consistently misses deadlines?",
      emoji: "🤝",
      correctAnswer: "Have a private conversation to understand challenges and offer support",
      options: [
        { text: "Publicly criticize them to motivate improvement", isCorrect: false },
        { text: "Ignore the issue hoping it will resolve itself", isCorrect: false },
        { text: "Remove them from the team without discussion", isCorrect: false },
        { text: "Have a private conversation to understand challenges and offer support", isCorrect: true },
      ],
      feedback: {
        correct: "Excellent! Private, supportive conversations help team members overcome obstacles and improve performance!",
        incorrect: "Public criticism or ignoring issues damages relationships. Have a private conversation to understand challenges and offer support!"
      }
    },
    {
      id: 3,
      question: "How should you approach setting goals for a new team project?",
      emoji: "🎯",
      correctAnswer: "Collaborate with team members to set SMART goals everyone understands and agrees upon",
      options: [
        { text: "Collaborate with team members to set SMART goals everyone understands and agrees upon", isCorrect: true },
        { text: "Set ambitious goals without team input to push everyone to excel", isCorrect: false },
        { text: "Let team members set their own unrelated goals", isCorrect: false },
        { text: "Copy goals from a previous project without customization", isCorrect: false }
      ],
      feedback: {
        correct: "Perfect! Collaborative SMART goal-setting ensures clarity, buy-in, and shared commitment from all team members!",
        incorrect: "Imposing goals or copying without customization reduces ownership. Collaborate to set SMART goals everyone agrees upon!"
      }
    },
    {
      id: 4,
      question: "What should you do when a team member proposes an unconventional solution?",
      emoji: "💡",
      correctAnswer: "Evaluate the idea objectively and encourage creative thinking while assessing feasibility",
      options: [
        { text: "Immediately dismiss it because it's different from standard approaches", isCorrect: false },
        { text: "Evaluate the idea objectively and encourage creative thinking while assessing feasibility", isCorrect: true },
        { text: "Automatically implement it to show you value innovation", isCorrect: false },
        { text: "Ask them to stick to proven methods instead of experimenting", isCorrect: false }
      ],
      feedback: {
        correct: "Well done! Balancing innovation with practical assessment encourages creativity while maintaining effectiveness!",
        incorrect: "Immediate dismissal or blind implementation isn't effective. Evaluate ideas objectively and encourage creative thinking!"
      }
    },
    {
      id: 5,
      question: "How should you recognize team achievements during a project?",
      emoji: "🏆",
      correctAnswer: "Acknowledge both individual contributions and collective success regularly",
      options: [
        { text: "Save all recognition for the final project completion", isCorrect: false },
        { text: "Focus only on individual achievements to encourage competition", isCorrect: false },
        { text: "Acknowledge both individual contributions and collective success regularly", isCorrect: true },
        { text: "Take credit for the team's work in your personal communications", isCorrect: false }
      ],
      feedback: {
        correct: "Awesome! Regular recognition of both individual and team efforts maintains motivation and strengthens collaboration!",
        incorrect: "Delaying recognition or focusing only on competition reduces morale. Acknowledge both individual and collective success regularly!"
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
      title="Reflex Teen Leader"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Quick leadership choices!` : "Quick leadership choices!"}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={finalScore}
      gameId="civic-responsibility-teens-93"
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
      nextGamePathProp="/student/civic-responsibility/teens/puzzle-leader-traits"
      nextGameIdProp="civic-responsibility-teens-94">
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">👂🤝🎯💡🏆</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Quick leadership choices!<br />
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
                {finalScore >= 4 ? "Excellent job! You're a leadership champion!" : 
                 finalScore >= 3 ? "Good work! Keep developing your leadership skills!" : 
                 "Continue learning about effective leadership and you'll improve!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexTeenLeader;