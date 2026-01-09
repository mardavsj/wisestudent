import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BorrowingStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-55");
  const gameId = gameData?.id || "finance-teens-55";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for BorrowingStory, using fallback ID");
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
      text: "Teen borrows for a new phone. Can't repay? Result →",
      options: [
        
        { 
          id: "free", 
          text: "Free money", 
          emoji: "🎁", 
          
          isCorrect: false 
        },
        { 
          id: "debt", 
          text: "Debt", 
          emoji: "⚠️", 
           
          isCorrect: true 
        },
        { 
          id: "nothing", 
          text: "Nothing happens", 
          emoji: "😊", 
           
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "You borrow ₹500 but can't repay. What's the consequence?",
      options: [
        
        { 
          id: "forgiven", 
          text: "Debt is forgiven", 
          emoji: "✨", 
          isCorrect: false 
        },
        { 
          id: "ignored", 
          text: "Can be ignored", 
          emoji: "😴", 
          isCorrect: false 
        },
        { 
          id: "interest", 
          text: "Interest and penalties increase", 
          emoji: "📈", 
          isCorrect: true 
        },
      ]
    },
    {
      id: 3,
      text: "What should you do before borrowing for a want?",
      options: [
        { 
          id: "plan", 
          text: "Plan how to repay first", 
          emoji: "📋", 
          isCorrect: true 
        },
        { 
          id: "borrow-first", 
          text: "Borrow first, think later", 
          emoji: "💸", 
          isCorrect: false 
        },
        
        { 
          id: "ignore", 
          text: "Ignore repayment plan", 
          emoji: "🚫", 
          isCorrect: false 
        }
      ]
    },
    {
      id: 4,
      text: "Borrowing without a repayment plan leads to?",
      options: [
        { 
          id: "success", 
          text: "Financial success", 
          emoji: "🎉", 
          isCorrect: false 
        },
        
        { 
          id: "freedom", 
          text: "Financial freedom", 
          emoji: "🕊️", 
          isCorrect: false 
        },
        { 
          id: "debt", 
          text: "Debt problems", 
          emoji: "⚠️", 
          isCorrect: true 
        },
      ]
    },
    {
      id: 5,
      text: "What's the best approach to borrowing?",
      options: [
        { 
          id: "borrow-often", 
          text: "Borrow often for wants", 
          emoji: "🔄", 
          isCorrect: false 
        },
        { 
          id: "borrow-wisely", 
          text: "Borrow only when necessary and plan repayment", 
          emoji: "🤔", 
          isCorrect: true 
        },
        { 
          id: "never-repay", 
          text: "Borrow but never repay", 
          emoji: "🚫", 
          isCorrect: false 
        }
      ]
    }
  ];

  const handleAnswer = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
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

  return (
    <GameShell
      title="Borrowing Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/debate-borrow-good-or-bad"
      nextGameIdProp="finance-teens-56"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="finance"
    >
      <div className="space-y-8">
        {!showResult && questions[currentQuestion] ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {questions[currentQuestion].text}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.isCorrect)}
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
                      <span className="text-sm opacity-90">{option.description}</span>
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
                <h3 className="text-2xl font-bold text-white mb-4">Borrowing Story Complete!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  Great job learning about responsible borrowing!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Borrowing without a repayment plan leads to debt. Always plan how to repay before borrowing, especially for wants!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember, borrowing without a plan leads to debt problems!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Always plan how to repay before borrowing. Borrowing without a repayment plan leads to debt and financial trouble!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BorrowingStory;

