import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const StartupIdeaStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-71");
  const gameId = gameData?.id || "finance-teens-71";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for StartupIdeaStory, using fallback ID");
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
      text: "Teen sells handmade crafts online. Is this entrepreneurship?",
      options: [
        { 
          id: "yes", 
          text: "Yes, it's entrepreneurship", 
          emoji: "🙂", 
          
          isCorrect: true
        },
        { 
          id: "no", 
          text: "No, it's just selling", 
          emoji: "👎", 
          
          isCorrect: false
        },
        { 
          id: "maybe", 
          text: "Maybe, depends", 
          emoji: "🤔", 
          
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What makes someone an entrepreneur?",
      options: [
        { 
          id: "spends", 
          text: "Only spends money", 
          emoji: "💸", 
          isCorrect: false
        },
        { 
          id: "creates", 
          text: "Creates new business", 
          emoji: "💡", 
          isCorrect: true
        },
        { 
          id: "nothing", 
          text: "Does nothing", 
          emoji: "😴", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Can teens be entrepreneurs?",
      options: [
        { 
          id: "no2", 
          text: "No, only adults", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          id: "maybe2", 
          text: "Maybe, with permission", 
          emoji: "🤷", 
          isCorrect: false
        },
        { 
          id: "yes2", 
          text: "Yes, age doesn't matter", 
          emoji: "👍", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "What's needed to start a business?",
      options: [
        { 
          id: "money", 
          text: "Lots of money only", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          id: "idea", 
          text: "Good idea and effort", 
          emoji: "💡", 
          isCorrect: true
        },
        { 
          id: "luck", 
          text: "Just luck", 
          emoji: "🍀", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Is selling online a form of entrepreneurship?",
      options: [
        { 
          id: "no3", 
          text: "No, not real business", 
          emoji: "👎", 
          isCorrect: false
        },
        { 
          id: "yes3", 
          text: "Yes, it's a business", 
          emoji: "👍", 
          isCorrect: true
        },
        { 
          id: "maybe3", 
          text: "Maybe, if profitable", 
          emoji: "🤔", 
          isCorrect: false
        }
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
      title="Startup Idea Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/quiz-on-entrepreneurship"
      nextGameIdProp="finance-teens-72"
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
                <h3 className="text-2xl font-bold text-white mb-4">Story Complete!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You understand entrepreneurship!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Entrepreneurship is creating and running a business. Anyone, including teens, can be entrepreneurs with good ideas and effort!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember, entrepreneurship is creating a new business, and anyone can do it!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: An entrepreneur is someone who creates and runs a new business. Selling handmade crafts online is entrepreneurship!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default StartupIdeaStory;

