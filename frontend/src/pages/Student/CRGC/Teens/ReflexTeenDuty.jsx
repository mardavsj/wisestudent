import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 10;

const ReflexTeenDuty = () => {
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
      question: "What should you do if you notice your neighbor's property is being vandalized?",
      emoji: "⚖️",
      correctAnswer: "Report the incident to local authorities and offer to be a witness if needed",
      options: [
        { text: "Join in the vandalism to fit in with the group", isCorrect: false },
        { text: "Report the incident to local authorities and offer to be a witness if needed", isCorrect: true },
        { text: "Ignore it since it's not your property", isCorrect: false },
        { text: "Film it for social media without intervening", isCorrect: false }
      ],
      feedback: {
        correct: "Great job! Reporting vandalism helps protect community property and ensures justice!",
        incorrect: "Joining in or ignoring vandalism harms your community. Report the incident to local authorities and offer to be a witness if needed!"
      }
    },
    {
      id: 2,
      question: "How should you respond when you're eligible to vote in a local election that affects your community?",
      emoji: "🗳️",
      correctAnswer: "Research the candidates and issues thoroughly, then cast your informed vote",
      options: [
        { text: "Skip voting since local elections don't matter much", isCorrect: false },
        { text: "Vote based solely on party affiliation without researching issues", isCorrect: false },
        { text: "Research the candidates and issues thoroughly, then cast your informed vote", isCorrect: true },
        { text: "Sell your vote to the highest bidder", isCorrect: false }
      ],
      feedback: {
        correct: "Excellent! Thorough research and informed voting strengthens democracy and represents your community's interests!",
        incorrect: "Skipping votes or selling them undermines democracy. Research the candidates and issues thoroughly, then cast your informed vote!"
      }
    },
    {
      id: 3,
      question: "What's the most responsible approach when you're called for jury duty?",
      emoji: "🏫",
      correctAnswer: "Serve diligently and thoughtfully evaluate evidence to deliver justice",
      options: [
        { text: "Try to get excused by any means necessary", isCorrect: false },
        { text: "Serve diligently and thoughtfully evaluate evidence to deliver justice", isCorrect: true },
        { text: "Serve but rush through deliberations to get it over with", isCorrect: false },
        { text: "Discuss the case details with outsiders during the process", isCorrect: false }
      ],
      feedback: {
        correct: "Perfect! Diligent jury service is a cornerstone of justice and protects the rights of all citizens!",
        incorrect: "Avoiding or rushing through jury duty compromises justice. Serve diligently and thoughtfully evaluate evidence to deliver justice!"
      }
    },
    {
      id: 4,
      question: "How should you handle discovering that a family member is evading taxes?",
      emoji: "💰",
      correctAnswer: "Encourage them to correct their tax filings and seek professional help if needed",
      options: [
        { text: "Encourage them to correct their tax filings and seek professional help if needed", isCorrect: true },
        { text: "Help them hide assets to avoid detection", isCorrect: false },
        { text: "Ignore the situation since it's a family matter", isCorrect: false },
        { text: "Report them anonymously to authorities immediately", isCorrect: false }
      ],
      feedback: {
        correct: "Well done! Encouraging correction of tax issues helps family members fulfill their civic obligations responsibly!",
        incorrect: "Helping evade taxes or immediate reporting without discussion is extreme. Encourage them to correct their tax filings and seek professional help if needed!"
      }
    },
    {
      id: 5,
      question: "What should you do when you see litter in a local park during a community event?",
      emoji: "🌱",
      correctAnswer: "Pick up the litter yourself and encourage others to dispose of waste properly",
      options: [
        { text: "Add to the litter since everyone else is doing it", isCorrect: false },
        { text: "Complain about others' mess but leave your own trash", isCorrect: false },
        { text: "Pick up the litter yourself and encourage others to dispose of waste properly", isCorrect: true },
        { text: "Ignore it since park maintenance will clean it up", isCorrect: false }
      ],
      feedback: {
        correct: "Awesome! Taking personal responsibility for environmental protection sets a positive example for others!",
        incorrect: "Adding to litter or ignoring it harms your community. Pick up the litter yourself and encourage others to dispose of waste properly!"
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
      title="Reflex Teen Duty"
      subtitle={gameState === "playing" ? `Round ${currentRound}/${TOTAL_ROUNDS}: Quick duty choices!` : "Quick duty choices!"}
      onNext={handleNext}
      nextEnabled={gameState === "finished"}
      showGameOver={gameState === "finished"}
      score={finalScore}
      gameId="civic-responsibility-teens-79"
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
      nextGamePathProp="/student/civic-responsibility/teens/badge-responsible-citizen-teen"
      nextGameIdProp="civic-responsibility-teens-80">
      <div className="text-center text-white space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="text-5xl mb-6">🇮🇳🗳️🏫💰🌱</div>
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/90 text-lg mb-6">
              Quick duty choices!<br />
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
                {finalScore >= 4 ? "Excellent job! You're a duty-conscious citizen!" : 
                 finalScore >= 3 ? "Good work! Keep developing your sense of civic responsibility!" : 
                 "Continue learning about civic duties and you'll improve!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexTeenDuty;