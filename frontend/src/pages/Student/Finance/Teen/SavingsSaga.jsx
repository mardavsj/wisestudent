import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SavingsSaga = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-11");
  const gameId = gameData?.id || "finance-teens-11";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SavingsSaga, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "You receive ₹1000 as monthly allowance. How should you allocate it for optimal financial health?",
      options: [
       
        { 
          id: "70-20-10", 
          text: "70% needs, 20% wants, 10% savings", 
          emoji: "📈", 
          
          isCorrect: false
        },
        { 
          id: "equal", 
          text: "Equal parts: 33% each", 
          emoji: "⚖️", 
          
          isCorrect: false
        },
         { 
          id: "50-30-20", 
          text: "50% needs, 30% wants, 20% savings", 
          emoji: "💰", 
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "You save ₹500 monthly for 2 years at 6% annual interest, compounded monthly. How much will you have?",
      options: [
        
        { 
          id: "12000", 
          text: "Exactly ₹12,000", 
          emoji: "💵", 
          isCorrect: false
        },
        { 
          id: "12600", 
          text: "Approx. ₹12,600", 
          emoji: "🏦", 
          isCorrect: true
        },
        { 
          id: "13000", 
          text: "Around ₹13,000", 
          emoji: "📈", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You have ₹2000 saved. Which option preserves your purchasing power against 8% inflation?",
      options: [
        
        { 
          id: "fd", 
          text: "Put in fixed deposit earning 7% annually", 
          emoji: "🏦", 
          isCorrect: false
        },
        { 
          id: "cash", 
          text: "Keep as cash at home", 
          emoji: "💵", 
          isCorrect: false
        },
        { 
          id: "invest", 
          text: "Invest in instrument earning 9% annually", 
          emoji: "💹", 
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "You need ₹50,000 for college in 3 years. How much should you save monthly at 5% interest?",
      options: [
        { 
          id: "1300", 
          text: "Approx. ₹1,300 per month", 
          emoji: "🎯", 
          isCorrect: true
        },
        { 
          id: "1100", 
          text: "About ₹1,100 per month", 
          emoji: "📉", 
          isCorrect: false
        },
        { 
          id: "1500", 
          text: "Around ₹1,500 per month", 
          emoji: "📈", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You have ₹10,000. Which is the wisest allocation for a teen's financial future?",
      options: [
       
        { 
          id: "allstocks", 
          text: "Invest all in high-risk stocks", 
          emoji: "🚀", 
          isCorrect: false
        },
         { 
          id: "emergency", 
          text: "30% emergency fund, 50% FD, 20% stocks", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          id: "allfd", 
          text: "Put all in fixed deposits", 
          emoji: "🏦", 
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (isCorrect) => {
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
      title="Savings Saga"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/finance/teen/spending-quiz"
      nextGameIdProp="finance-teens-12"
      gameType="finance"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && questions[currentQuestion] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {questions[currentQuestion].text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="text-3xl mb-3">{option.emoji}</div>
                      <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                      <p className="text-white/90 text-sm">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 4 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Financial Wizard!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct!
                  You've mastered advanced saving concepts!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Smart financial decisions today shape your secure tomorrow!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-white mb-4">Study Up!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct.
                  Review advanced saving concepts and try again!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Master compound interest, inflation effects, and strategic allocation for financial success!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SavingsSaga;


