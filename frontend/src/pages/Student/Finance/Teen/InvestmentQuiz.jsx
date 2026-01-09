import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const InvestmentQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-62");
  const gameId = gameData?.id || "finance-teens-62";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for InvestmentQuiz, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Which is riskier but higher return?",
      options: [
        { 
          id: "fd", 
          text: "Fixed Deposit", 
          emoji: "🏦", 
           
          isCorrect: false 
        },
        { 
          id: "stocks", 
          text: "Stock Market", 
          emoji: "📈", 
           
          isCorrect: true 
        },
        { 
          id: "savings", 
          text: "Savings Account", 
          emoji: "💰", 
           
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "Which investment is safest?",
      options: [
        { 
          id: "fd2", 
          text: "Fixed Deposit", 
          emoji: "🛡️", 
          isCorrect: true 
        },
        { 
          id: "stocks2", 
          text: "Stocks", 
          emoji: "📊", 
          isCorrect: false 
        },
        
        { 
          id: "crypto", 
          text: "Cryptocurrency", 
          emoji: "₿", 
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "What is diversification?",
      options: [
        { 
          id: "one", 
          text: "Put all in one investment", 
          emoji: "🎯", 
          isCorrect: false 
        },
        
        { 
          id: "avoid", 
          text: "Avoid all investments", 
          emoji: "🚫", 
          isCorrect: false 
        },
        { 
          id: "spread", 
          text: "Spread across different investments", 
          emoji: "📊", 
          isCorrect: true 
        },
      ]
    },
    {
      id: 4,
      text: "What's a mutual fund?",
      options: [
        { 
          id: "mix", 
          text: "Mix of stocks and bonds", 
          emoji: "📦", 
          isCorrect: true 
        },
        { 
          id: "single", 
          text: "Single company stock", 
          emoji: "📄", 
          isCorrect: false 
        },
        { 
          id: "bank", 
          text: "Bank account", 
          emoji: "🏦", 
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "Why invest instead of just saving?",
      options: [
       
        { 
          id: "same", 
          text: "Same as saving", 
          emoji: "➡️", 
          isCorrect: false 
        },
        { 
          id: "lose", 
          text: "Guaranteed to lose", 
          emoji: "📉", 
          isCorrect: false 
        },
         { 
          id: "grow", 
          text: "Potential to grow faster", 
          emoji: "📈", 
          isCorrect: true 
        },
      ]
    }
  ];

  const handleAnswer = (optionId) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    const question = questions[currentQuestion];
    const selectedOption = question.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption?.isCorrect;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const currentQ = questions[currentQuestion];

  return (
    <GameShell
      title="Investment Quiz"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/reflex-investor-smartness"
      nextGameIdProp="finance-teens-63"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="finance"
    >
      <div className="space-y-8">
        {!showResult && currentQ ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {currentQ.text}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQ.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-center transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : "bg-red-500/20 border-2 border-red-400 opacity-75"
                        : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="text-4xl">{option.emoji}</span>
                      <span className="font-semibold text-lg">{option.text}</span>
                      <p className="text-sm opacity-90">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Quiz Complete!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You understand investments!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Stocks are riskier but offer higher returns. Fixed deposits are safer but lower returns. Diversification reduces risk!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember, stocks are riskier but higher return, while FDs are safer but lower return!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Stock market is riskier but offers higher returns. Fixed deposits are safer but have lower returns. Diversify to reduce risk!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default InvestmentQuiz;

