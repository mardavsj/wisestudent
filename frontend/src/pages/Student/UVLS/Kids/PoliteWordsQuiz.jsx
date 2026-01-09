import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PoliteWordsQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("uvls-kids-12");
  const gameId = gameData?.id || "uvls-kids-12";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for PoliteWordsQuiz, using fallback ID");
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
      text: "What should you say when someone gives you something?",
      options: [
        { 
          id: "a", 
          text: "Thank you!", 
          emoji: "🙏", 
          // description: "Express gratitude",
          isCorrect: true 
        },
        { 
          id: "b", 
          text: "Finally!", 
          emoji: "😤", 
          // description: "Show impatience",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Nothing", 
          emoji: "😐", 
          // description: "Don't respond",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "How do you ask for help politely?",
      options: [
        { 
          id: "a", 
          text: "Give me that!", 
          emoji: "😠", 
          // description: "Demand rudely",
          isCorrect: false 
        },
        { 
          id: "b", 
          text: "Please help me", 
          emoji: "🙏", 
          // description: "Ask politely with please",
          isCorrect: true 
        },
        { 
          id: "c", 
          text: "I need this now!", 
          emoji: "😡", 
          // description: "Be demanding",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "What do you say when you bump into someone?",
      options: [
        { 
          id: "a", 
          text: "Watch where you're going!", 
          emoji: "😠", 
          // description: "Blame them",
          isCorrect: false 
        },
        { 
          id: "b", 
          text: "It's your fault", 
          emoji: "👆", 
          // description: "Be accusatory",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Sorry! Excuse me", 
          emoji: "😔", 
          // description: "Apologize politely",
          isCorrect: true 
        }
      ]
    },
    {
      id: 4,
      text: "How do you greet your teacher in the morning?",
      options: [
        { 
          id: "a", 
          text: "Good morning!", 
          emoji: "☀️", 
          // description: "Greet respectfully",
          isCorrect: true 
        },
        { 
          id: "b", 
          text: "Hey!", 
          emoji: "👋", 
          // description: "Casual greeting",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Yo!", 
          emoji: "🤙", 
          // description: "Very casual greeting",
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "What's the polite way to interrupt someone talking?",
      options: [
        { 
          id: "a", 
          text: "Stop talking!", 
          emoji: "🛑", 
          // description: "Be rude",
          isCorrect: false 
        },
        { 
          id: "b", 
          text: "Excuse me, may I say something?", 
          emoji: "🙋", 
          // description: "Ask politely",
          isCorrect: true 
        },
        { 
          id: "c", 
          text: "Be quiet!", 
          emoji: "🤫", 
          // description: "Demand silence",
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

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Polite Words Quiz"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/uvls/kids/respect-tap"
      nextGameIdProp="uvls-kids-13"
      gameType="uvls"
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
                <h3 className="text-2xl font-bold text-white mb-4">Polite Words Star!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You know how to be polite and respectful!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Using polite words like "please", "thank you", and "excuse me" shows respect and makes others feel valued!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember: Polite words show respect and kindness!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Always say "please" when asking, "thank you" when receiving, and "excuse me" when interrupting!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PoliteWordsQuiz;

