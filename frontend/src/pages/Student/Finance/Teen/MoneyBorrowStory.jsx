import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const MoneyBorrowStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-51");
  const gameId = gameData?.id || "finance-teens-51";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for MoneyBorrowStory, using fallback ID");
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
      text: "Teen borrows ₹100 from a friend. Forgetting to repay?",
      options: [
        { 
          id: "wrong", 
          text: "Wrong - Always repay", 
          emoji: "❌", 
          
          isCorrect: true 
        },
        { 
          id: "okay", 
          text: "Okay to forget", 
          emoji: "😴", 
          isCorrect: false 
        },
        { 
          id: "maybe", 
          text: "Maybe later", 
          emoji: "🤔", 
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "You borrowed ₹200. When should you repay?",
      options: [
        { 
          id: "never", 
          text: "Never repay", 
          emoji: "🚫", 
          isCorrect: false 
        },
        { 
          id: "on-time", 
          text: "On time as promised", 
          emoji: "🙂‍↔️", 
          isCorrect: true 
        },
        { 
          id: "whenever", 
          text: "Whenever you feel like", 
          emoji: "😊", 
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "Friend asks to borrow ₹50. What should you consider?",
      options: [
        { 
          id: "lend", 
          text: "Lend if you can afford", 
          emoji: "💰", 
          isCorrect: true 
        },
        { 
          id: "always", 
          text: "Always lend everything", 
          emoji: "💸", 
          isCorrect: false 
        },
        { 
          id: "never", 
          text: "Never lend to anyone", 
          emoji: "🔒", 
          isCorrect: false 
        }
      ]
    },
    {
      id: 4,
      text: "You can't repay on time. What should you do?",
      options: [
        { 
          id: "hide", 
          text: "Hide and avoid friend", 
          emoji: "🙈", 
          isCorrect: false 
        },
        { 
          id: "communicate", 
          text: "Communicate and explain", 
          emoji: "💬", 
          isCorrect: true 
        },
        { 
          id: "ignore", 
          text: "Ignore the debt", 
          emoji: "😴", 
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "What's the best practice for borrowing money?",
      options: [
        { 
          id: "borrow-often", 
          text: "Borrow often from friends", 
          emoji: "🔄", 
          isCorrect: false 
        },
        { 
          id: "borrow-wisely", 
          text: "Borrow only when necessary and repay promptly", 
          emoji: "🙂", 
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
      title="Money Borrow Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/debt-quiz"
      nextGameIdProp="finance-teens-52"
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
                <h3 className="text-2xl font-bold text-white mb-4">Borrowing Star!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  Great job learning about responsible borrowing!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Always repay borrowed money on time, communicate if you can't, and borrow only when necessary. This builds trust and maintains relationships!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember to always repay borrowed money on time!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Always repay borrowed money on time, communicate honestly if you can't repay, and borrow only when necessary and affordable!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default MoneyBorrowStory;

