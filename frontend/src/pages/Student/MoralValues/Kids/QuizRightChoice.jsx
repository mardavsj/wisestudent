import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const QuizRightChoice = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "moral-kids-92";
  const gameData = getGameDataById(gameId);
  
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
      text: "You want to borrow a friend's toy. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Ask permission first", 
          emoji: "🙋", 
          
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Take it without asking", 
          emoji: "😏", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Take it secretly", 
          emoji: "🤫", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You need a book from the library. What's right?",
      options: [
        { 
          id: "a", 
          text: "Take it without checking", 
          emoji: "🤫", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Ask librarian for permission", 
          emoji: "🫱", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Take it when no one is looking", 
          emoji: "😏", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You want to eat a cookie from the jar. What is right?",
      options: [
        { 
          id: "a", 
          text: "Take it secretly", 
          emoji: "😋", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Take it when parents aren't looking", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ask your parents first", 
          emoji: "🫵", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "You want to use your friend's coloring set. Correct choice?",
      options: [
        { 
          id: "a", 
          text: "Ask permission first", 
          emoji: "🙌", 
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Use it without asking", 
          emoji: "😎", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Take it when they're not around", 
          emoji: "😏", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You found a pencil on the floor. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Keep it without asking", 
          emoji: "🤭", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Hide it for later", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Return it or ask if someone lost it", 
          emoji: "🫂", 
          isCorrect: true
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

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Right Choice"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="moral"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map((option) => (
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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Excellent!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct!
                  You know how to make the right choices!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Making the right choice means asking permission, being honest, and respecting others!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct.
                  Remember, the right choice is always to ask permission and be honest!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to choose the option that shows asking permission and respecting others.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizRightChoice;
