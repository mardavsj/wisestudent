import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const QuizOnSavingsRate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-2");
  const gameId = gameData?.id || "finance-teens-2";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for QuizOnSavingsRate, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "If you earn ₹1000 and save ₹200, what percentage are you saving?",
      options: [
        { 
          id: "a", 
          text: "10%", 
          emoji: "🔢", 
          
          isCorrect: false
        },
        { 
          id: "b", 
          text: "20%", 
          emoji: "📈", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "25%", 
          emoji: "📊", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "If you want to save 15% of ₹2000, how much should you save?",
      options: [
        { 
          id: "a", 
          text: "₹300", 
          emoji: "🏦", 
          isCorrect: true
        },
        { 
          id: "b", 
          text: "₹200", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "₹400", 
          emoji: "💵", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What percentage is saved if you earn ₹5000 and spend ₹4000?",
      options: [
        { 
          id: "a", 
          text: "10%", 
          emoji: "📉", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "25%", 
          emoji: "🎯", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "20%", 
          emoji: "😓", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "If your savings rate is 25% and you save ₹500, how much do you earn?",
      options: [
        { 
          id: "a", 
          text: "₹2000", 
          emoji: "🧮", 
          isCorrect: true
        },
        { 
          id: "b", 
          text: "₹1000", 
          emoji: "🧮", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "₹2500", 
          emoji: "🧮", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Which savings rate is the most sustainable for long-term financial health?",
      options: [
        { 
          id: "a", 
          text: "5%", 
          emoji: "🐌", 
          
          isCorrect: false
        },
        { 
          id: "b", 
          text: "50%", 
          emoji: "⚠️", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "20%", 
          emoji: "⚖️", 
          isCorrect: true
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
      title="Quiz on Savings Rate"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/reflex-smart-saver"
      nextGameIdProp="finance-teens-3"
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
                <h3 className="text-2xl font-bold text-white mb-4">Savings Rate Quiz Star!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You're mastering savings rate calculations!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Understanding savings rates helps you plan for your financial future!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Practice makes perfect with savings rate calculations!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Remember to calculate percentages and understand the importance of consistent saving rates!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizOnSavingsRate;