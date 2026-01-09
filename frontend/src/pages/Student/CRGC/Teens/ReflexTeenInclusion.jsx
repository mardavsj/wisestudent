import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexTeenInclusion = () => {
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
      question: "How should you respond when a new student joins your school from a different cultural background?",
      emoji: "🌍",
      correctAnswer: "Welcome them warmly and make an effort to learn about their culture",
      options: [
        { text: "Avoid them because they seem different", isCorrect: false },
        { text: "Make fun of their accent or customs", isCorrect: false },
        { text: "Welcome them warmly and make an effort to learn about their culture", isCorrect: true },
        { text: "Tell your friends to stay away from them", isCorrect: false }
      ],
      feedback: {
        correct: "Great job! Welcoming new students and learning about their culture promotes inclusion and friendship!",
        incorrect: "Avoiding or making fun of someone for their differences creates exclusion. Welcome them warmly and learn about their culture!"
      }
    },
    {
      id: 2,
      question: "What should you do if you notice someone being left out of group activities?",
      emoji: "👥",
      correctAnswer: "Invite them to join and ensure everyone feels included",
      options: [
        { text: "Ignore it since it's not your problem", isCorrect: false },
        { text: "Invite them to join and ensure everyone feels included", isCorrect: true },
        { text: "Join in excluding them to fit in with the group", isCorrect: false },
        { text: "Point out loudly that they're not wanted", isCorrect: false }
      ],
      feedback: {
        correct: "Excellent! Actively including others creates a welcoming environment for everyone!",
        incorrect: "Ignoring exclusion or participating in it harms others. Invite them to join and ensure everyone feels included!"
      }
    },
    {
      id: 3,
      question: "How should you react when someone uses language that excludes or stereotypes certain groups?",
      emoji: "💬",
      correctAnswer: "Speak up respectfully to educate them about inclusive language",
      options: [
        { text: "Laugh along to avoid confrontation", isCorrect: false },
        { text: "Stay silent to avoid being seen as overly sensitive", isCorrect: false },
        { text: "Speak up respectfully to educate them about inclusive language", isCorrect: true },
        { text: "Start using even more offensive language", isCorrect: false }
      ],
      feedback: {
        correct: "Perfect! Speaking up respectfully helps educate others about inclusion and creates positive change!",
        incorrect: "Staying silent or participating in harmful language perpetuates exclusion. Speak up respectfully to educate about inclusive language!"
      }
    },
    {
      id: 4,
      question: "What's the best approach when forming teams for a school project?",
      emoji: "📚",
      correctAnswer: "Ensure all team members have a role that matches their strengths",
      options: [
        { text: "Let the popular students choose first and exclude others", isCorrect: false },
        { text: "Ensure all team members have a role that matches their strengths", isCorrect: true },
        { text: "Assign roles based on assumptions about people's abilities", isCorrect: false },
        { text: "Form teams exclusively with your close friends", isCorrect: false }
      ],
      feedback: {
        correct: "Well done! Creating inclusive teams where everyone contributes based on their strengths benefits everyone!",
        incorrect: "Excluding team members or making assumptions limits potential. Ensure all team members have a role matching their strengths!"
      }
    },
    {
      id: 5,
      question: "How should you handle disagreements about topics related to diversity and inclusion?",
      emoji: "🤝",
      correctAnswer: "Listen actively and seek to understand different perspectives",
      options: [
        { text: "Shut down anyone who disagrees with your viewpoint", isCorrect: false },
        { text: "Avoid all discussions about diversity to prevent conflict", isCorrect: false },
        { text: "Insist that your opinion is the only correct one", isCorrect: false },
        { text: "Listen actively and seek to understand different perspectives", isCorrect: true },
      ],
      feedback: {
        correct: "Awesome! Active listening and seeking to understand different perspectives fosters inclusion and growth!",
        incorrect: "Shutting down others or avoiding discussions prevents learning. Listen actively and seek to understand different perspectives!"
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
      title="Reflex Teen Inclusion"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Quick inclusion choices!` : "Quick inclusion choices!"}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={finalScore}
      gameId="civic-responsibility-teens-19"
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
      nextGamePathProp="/student/civic-responsibility/teens/badge-inclusion-leader"
      nextGameIdProp="civic-responsibility-teens-20">
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🌍👥💬📚🤝</div>
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
                {finalScore >= 4 ? "Excellent job! You're an inclusion champion!" : 
                 finalScore >= 3 ? "Good work! Keep practicing inclusion!" : 
                 "Keep developing your inclusion skills and you'll improve!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexTeenInclusion;