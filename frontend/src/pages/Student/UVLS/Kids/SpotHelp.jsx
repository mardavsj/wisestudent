import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from '../../../../utils/getGameData';

const SpotHelp = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-5");
  const gameId = gameData?.id || "uvls-kids-5";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SpotHelp, using fallback ID");
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
      text: "Classroom Scene - Look carefully. Bella can't reach her book. What should you do?",
      options: [
        { 
          id: "help", 
          text: "Offer to help get the book", 
          emoji: "🤝", 
          // description: "Help Bella reach her book",
          isCorrect: true 
        },
        { 
          id: "ignore", 
          text: "Keep playing", 
          emoji: "🙈", 
          // description: "Ignore the situation",
          isCorrect: false 
        },
        { 
          id: "watch", 
          text: "Just watch", 
          emoji: "👀", 
          // description: "Observe without helping",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "Playground Scene - Felix lost their ball and looks upset. What should you do?",
      options: [
        { 
          id: "ignore", 
          text: "Continue playing", 
          emoji: "⚽", 
          // description: "Keep playing your game",
          isCorrect: false 
        },
        { 
          id: "help", 
          text: "Help find the ball", 
          emoji: "🔍", 
          // description: "Assist in finding the lost ball",
          isCorrect: true 
        },
        { 
          id: "laugh", 
          text: "Laugh about it", 
          emoji: "😂", 
          // description: "Make fun of the situation",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "Lunchroom Scene - Jack spilled juice and needs help. What should you do?",
      options: [
        { 
          id: "help", 
          text: "Get napkins to clean up", 
          emoji: "🧻", 
          // description: "Help clean the spill",
          isCorrect: true 
        },
        { 
          id: "eat", 
          text: "Eat my lunch", 
          emoji: "🍽️", 
          // description: "Focus on your own meal",
          isCorrect: false 
        },
        { 
          id: "point", 
          text: "Point and laugh", 
          emoji: "😏", 
          // description: "Make fun of the accident",
          isCorrect: false 
        }
      ]
    },
    {
      id: 4,
      text: "Library Scene - Noah can't find a book and looks confused. What should you do?",
      options: [
        { 
          id: "read", 
          text: "Continue reading", 
          emoji: "📚", 
          // description: "Keep reading your book",
          isCorrect: false 
        },
        { 
          id: "avoid", 
          text: "Avoid them", 
          emoji: "🚶", 
          // description: "Walk away",
          isCorrect: false 
        },
        { 
          id: "help", 
          text: "Help find the book", 
          emoji: "🔍", 
          // description: "Assist in finding the book",
          isCorrect: true 
        }
      ]
    },
    {
      id: 5,
      text: "Art Room Scene - Ruby can't reach supplies and needs help. What should you do?",
      options: [
        { 
          id: "help", 
          text: "Offer to get the supplies", 
          emoji: "🎨", 
          // description: "Help get the art supplies",
          isCorrect: true 
        },
        { 
          id: "work", 
          text: "Keep working on my art", 
          emoji: "🖌️", 
          // description: "Focus on your own project",
          isCorrect: false 
        },
        { 
          id: "ignore", 
          text: "Pretend not to see", 
          emoji: "🙈", 
          // description: "Ignore their need",
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
      title="Spot Help"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Game Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/uvls/kids/kind-poster"
      nextGameIdProp="uvls-kids-6"
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
                <h3 className="text-2xl font-bold text-white mb-4">Helpful Hero!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You know how to spot when others need help!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Paying attention to others helps you notice when someone needs help. Offering assistance when you see someone struggling is a kind and helpful thing to do!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember: Look for people who need help!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Watch for signs that someone needs help - like looking confused, struggling to reach something, or looking upset. Then offer to help!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SpotHelp;

