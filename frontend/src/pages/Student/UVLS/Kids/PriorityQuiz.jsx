import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PriorityQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "uvls-kids-92";
  const gameData = getGameDataById(gameId);
  
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
      text: "What should you do before playing?",
      options: [
        { 
          id: "a", 
          text: "Do homework first", 
          emoji: "📚", 
          // description: "Important tasks come first",
          isCorrect: true 
        },
        { 
          id: "b", 
          text: "Play all day", 
          emoji: "🎮", 
          // description: "Work before play",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Sleep", 
          emoji: "😴", 
          // description: "Do work when awake",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "What should you do after school?",
      options: [
        { 
          id: "b", 
          text: "Watch TV first", 
          emoji: "📺", 
          // description: "Work should come first",
          isCorrect: false 
        },
        { 
          id: "a", 
          text: "Study then have fun", 
          emoji: "🧠", 
          // description: "Balance work and play",
          isCorrect: true 
        },
        { 
          id: "c", 
          text: "Eat candy only", 
          emoji: "🍬", 
          // description: "Need balanced activities",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "What's the best weekend plan?",
      options: [
        { 
          id: "b", 
          text: "Play only", 
          emoji: "🏃", 
          // description: "Chores are important too",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Do nothing", 
          emoji: "🤷", 
          // description: "Stay productive",
          isCorrect: false 
        },
        { 
          id: "a", 
          text: "Do chores then play", 
          emoji: "🧹", 
          // description: "Responsibilities first",
          isCorrect: true 
        }
      ]
    },
    {
      id: 4,
      text: "What should you do before bed?",
      options: [
        { 
          id: "b", 
          text: "Watch videos", 
          emoji: "📱", 
          // description: "Health is more important",
          isCorrect: false 
        },
        { 
          id: "a", 
          text: "Brush your teeth", 
          emoji: "🦷", 
          // description: "Health comes first",
          isCorrect: true 
        },
        { 
          id: "c", 
          text: "Eat snacks", 
          emoji: "🍪", 
          // description: "Not good before bed",
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "What should you do first in the morning?",
      options: [
        { 
          id: "b", 
          text: "Play games", 
          emoji: "🎲", 
          // description: "Breakfast is important",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Watch TV", 
          emoji: "📺", 
          // description: "Eat first, then play",
          isCorrect: false 
        },
        { 
          id: "a", 
          text: "Eat breakfast", 
          emoji: "🍳", 
          // description: "Start the day right",
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
      title="Priority Quiz"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/uvls/kids/task-done-reflex"
      nextGameIdProp="uvls-kids-93"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="uvls"
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
                <h3 className="text-2xl font-bold text-white mb-4">Priority Quiz Star!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You know how to prioritize tasks!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Important things like homework, chores, and health should come before fun activities. Doing important tasks first helps you have more time to enjoy later!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember: Important tasks should come first!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Do important things like homework and chores first, then you can enjoy playing and having fun!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PriorityQuiz;

