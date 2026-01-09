import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexTeenLaw = () => {
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
      question: "What should you do if you witness a classmate cheating on an important exam?",
      emoji: "⚖️",
      correctAnswer: "Report the incident to the teacher confidentially after the exam",
      options: [
        { text: "Join in the cheating to ensure you don't fall behind", isCorrect: false },
        { text: "Publicly shame the cheater during the exam", isCorrect: false },
        { text: "Report the incident to the teacher confidentially after the exam", isCorrect: true },
        { text: "Ignore it completely since it's not your problem", isCorrect: false }
      ],
      feedback: {
        correct: "Great job! Reporting academic dishonesty confidentially maintains the integrity of the educational system!",
        incorrect: "Joining in cheating or publicly shaming others creates more problems. Report the incident to the teacher confidentially after the exam!"
      }
    },
    {
      id: 2,
      question: "How should you respond when you see someone breaking traffic laws by running a red light?",
      emoji: "🚸",
      correctAnswer: "Note the incident and report dangerous driving to authorities if it continues",
      options: [
        { text: "Run the red light yourself to keep up with traffic", isCorrect: false },
        { text: "Note the incident and report dangerous driving to authorities if it continues", isCorrect: true },
        { text: "Confront the driver aggressively at the next stop", isCorrect: false },
        { text: "Film the violation to post on social media for entertainment", isCorrect: false }
      ],
      feedback: {
        correct: "Excellent! Noting dangerous driving and reporting it to authorities helps keep roads safe for everyone!",
        incorrect: "Breaking laws yourself or aggressive confrontation is dangerous. Note the incident and report dangerous driving to authorities if it continues!"
      }
    },
    {
      id: 3,
      question: "What's the most responsible action when you receive a jury summons in the mail?",
      emoji: "🗳️",
      correctAnswer: "Respond promptly and serve if selected to uphold justice",
      options: [
        { text: "Ignore the summons to avoid the responsibility", isCorrect: false },
        { text: "Respond promptly and serve if selected to uphold justice", isCorrect: true },
        { text: "Forge documents to claim exemption without valid reasons", isCorrect: false },
        { text: "Complain about it but reluctantly comply", isCorrect: false }
      ],
      feedback: {
        correct: "Perfect! Responding to jury duty is a civic responsibility that helps maintain a fair legal system!",
        incorrect: "Ignoring or forging documents for jury duty is illegal. Respond promptly and serve if selected to uphold justice!"
      }
    },
    {
      id: 4,
      question: "How should you react when you discover a local business is violating environmental regulations?",
      emoji: "🏛️",
      correctAnswer: "Document the violations and report them to the appropriate regulatory agency",
      options: [
        { text: "Invest in the business since it's saving money by breaking rules", isCorrect: false },
        { text: "Publicly accuse the business without verifying the facts", isCorrect: false },
        { text: "Document the violations and report them to the appropriate regulatory agency", isCorrect: true },
        { text: "Ignore it since environmental issues don't affect you personally", isCorrect: false }
      ],
      feedback: {
        correct: "Well done! Documenting violations and reporting them to regulatory agencies protects community health and environment!",
        incorrect: "Investing in violators or making accusations without facts is problematic. Document the violations and report them to the appropriate regulatory agency!"
      }
    },
    {
      id: 5,
      question: "What should you do if you notice your school is not following safety protocols during an emergency drill?",
      emoji: "🎓",
      correctAnswer: "Discuss concerns with school administrators and suggest improvements",
      options: [
        { text: "Exploit the safety gaps for personal convenience", isCorrect: false },
        { text: "Ignore the issue since drills aren't real emergencies", isCorrect: false },
        { text: "Discuss concerns with school administrators and suggest improvements", isCorrect: true },
        { text: "Complain to classmates but take no constructive action", isCorrect: false }
      ],
      feedback: {
        correct: "Awesome! Discussing safety concerns with administrators helps create a better prepared school environment!",
        incorrect: "Exploiting safety gaps or ignoring issues endangers everyone. Discuss concerns with school administrators and suggest improvements!"
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
      title="Reflex Teen Law"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Quick law choices!` : "Quick law choices!"}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={finalScore}
      gameId="civic-responsibility-teens-73"
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
      nextGamePathProp="/student/civic-responsibility/teens/puzzle-match-civic-roles"
      nextGameIdProp="civic-responsibility-teens-74">
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">⚖️🚸🗳️🏛️🎓</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Quick law choices!<br />
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
                {finalScore >= 4 ? "Excellent job! You're a law-abiding champion!" : 
                 finalScore >= 3 ? "Good work! Keep developing your understanding of civic responsibilities!" : 
                 "Continue learning about laws and civic duties and you'll improve!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexTeenLaw;