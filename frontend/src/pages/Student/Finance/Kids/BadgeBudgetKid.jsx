import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeBudgetKid = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-30";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const challenges = [
  {
    id: 1,
    title: "Smart Choice Badge",
    question: "You get ₹100 as pocket money for a week. What is the smartest first step?",
    options: [
      { text: "Decide how much to save and spend", emoji: "🧠", isCorrect: true },
      { text: "Spend it on the first day", emoji: "⚡", isCorrect: false },
      { text: "Buy snacks every day", emoji: "🍭", isCorrect: false },
      { text: "Forget how much you have", emoji: "😵", isCorrect: false }
    ],
    feedback: {
      correct: "Excellent! Thinking before spending earns you a smart badge!",
      wrong: "Planning how to save and spend helps you use money wisely!"
    }
  },
  {
    id: 2,
    title: "Needs vs Wants",
    question: "You see a notebook you need and a toy you want. You can buy only one. What do you choose?",
    options: [
      { text: "Buy the toy", emoji: "🧸", isCorrect: false },
      { text: "Buy nothing and leave", emoji: "🚪", isCorrect: false },
      { text: "Buy the notebook first", emoji: "📘", isCorrect: true },
      { text: "Ask someone else to pay", emoji: "🤷", isCorrect: false }
    ],
    feedback: {
      correct: "Great choice! Needs always come before wants!",
      wrong: "Buying what you need first is a smart money habit!"
    }
  },
  {
    id: 3,
    title: "Saving Power",
    question: "You save ₹10 every day. How much do you save in 5 days?",
    options: [
      { text: "₹50", emoji: "💰", isCorrect: true },
      { text: "₹10", emoji: "1️⃣", isCorrect: false },
      { text: "₹100", emoji: "💯", isCorrect: false },
      { text: "₹5", emoji: "5️⃣", isCorrect: false }
    ],
    feedback: {
      correct: "Awesome math! Small savings grow fast!",
      wrong: "₹10 saved for 5 days becomes ₹50!"
    }
  },
  {
    id: 4,
    title: "Spending Control",
    question: "You plan to buy snacks for ₹20 but see a bigger pack for ₹40. What is the best move?",
    options: [
      { text: "Buy the bigger pack", emoji: "📦", isCorrect: false },
      { text: "Spend without thinking", emoji: "😋", isCorrect: false },
      { text: "Borrow extra money", emoji: "💳", isCorrect: false },
      { text: "Stick to your plan", emoji: "🧭", isCorrect: true },
    ],
    feedback: {
      correct: "Well done! Following your plan shows great control!",
      wrong: "Sticking to your plan keeps your budget safe!"
    }
  },
  {
    id: 5,
    title: "Goal Achiever",
    question: "You want to buy a book next month. What helps you reach this goal?",
    options: [
      { text: "Spending daily on treats", emoji: "🍬", isCorrect: false },
      { text: "Saving a little every week", emoji: "🎯", isCorrect: true },
      { text: "Waiting for someone else to buy it", emoji: "⏳", isCorrect: false },
      { text: "Forgetting about the goal", emoji: "🙃", isCorrect: false }
    ],
    feedback: {
      correct: "Fantastic! Saving regularly helps you reach goals!",
      wrong: "Small weekly savings help you buy things you plan for!"
    }
  }
];


  const handleAnswer = (isCorrect, optionIndex) => {
    if (answered) return;
    
    setAnswered(true);
    setSelectedAnswer(optionIndex);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastChallenge = challenge === challenges.length - 1;
    
    setTimeout(() => {
      if (isLastChallenge) {
        setShowResult(true);
      } else {
        setChallenge(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 2000);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setChallenge(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    resetFeedback();
  };

  const currentChallenge = challenges[challenge];
  const finalScore = score;

  return (
    <GameShell
      title="Badge: Budget Kid"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/finance/kids/ice-cream-vs-book-story"
      nextGameIdProp="finance-kids-31"
      gameType="finance"
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === challenges.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}>
      <div className="space-y-8">
        {!showResult && currentChallenge ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-2">{currentChallenge.title}</h3>
              <p className="text-white text-lg mb-6">
                {currentChallenge.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentChallenge.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option.isCorrect, idx)}
                    disabled={answered}
                    className={`bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3 ${
                      answered && selectedAnswer === idx
                        ? option.isCorrect
                          ? "ring-4 ring-green-400"
                          : "ring-4 ring-red-400"
                        : ""
                    }`}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="font-bold text-lg">{option.text}</span>
                  </button>
                ))}
              </div>
              
              {answered && (
                <div className={`mt-4 p-4 rounded-xl ${
                  currentChallenge.options[selectedAnswer]?.isCorrect
                    ? "bg-green-500/20 border border-green-500/30"
                    : "bg-red-500/20 border border-red-500/30"
                }`}>
                  <p className="text-white font-semibold">
                    {currentChallenge.options[selectedAnswer]?.isCorrect
                      ? currentChallenge.feedback.correct
                      : currentChallenge.feedback.wrong}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {finalScore >= 4 ? (
              <div>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-4">Budget Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You made {finalScore} smart budgeting decisions out of {challenges.length} challenges!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Budget Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Budget Skills</h4>
                    <p className="text-white/90 text-sm">
                      You learned to plan your spending, track your money, do budget math, 
                      and stick to your budget!
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Financial Wisdom</h4>
                    <p className="text-white/90 text-sm">
                      These habits will help you manage your money wisely and reach your goals!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {finalScore} smart budgeting decisions out of {challenges.length} challenges.
                </p>
                <p className="text-white/90 mb-6">
                  Remember, budgeting means planning your spending, tracking your money, 
                  and making thoughtful financial decisions.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeBudgetKid;

