import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const WinWinQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "uvls-kids-72";
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
      text: "Two friends want the same swing. What's the best solution?",
      options: [
        { 
          id: "a", 
          text: "Take turns", 
          emoji: "🔄", 
          // description: "Everyone gets to play",
          isCorrect: true 
        },
        { 
          id: "b", 
          text: "One swings all day", 
          emoji: "🏞️", 
          // description: "The other friend loses",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "No one swings", 
          emoji: "🚫", 
          // description: "Everyone loses",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "You have one cookie to share. What's the best way?",
      options: [
        { 
          id: "b", 
          text: "Eat it alone", 
          emoji: "😋", 
          // description: "The other person loses",
          isCorrect: false 
        },
        { 
          id: "a", 
          text: "Split it in half", 
          emoji: "🍪", 
          // description: "Both get to enjoy",
          isCorrect: true 
        },
        { 
          id: "c", 
          text: "Throw it away", 
          emoji: "🗑️", 
          // description: "Everyone loses",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "You and a friend want to play different games. What's best?",
      options: [
        { 
          id: "b", 
          text: "Play only one", 
          emoji: "1️⃣", 
          // description: "One person loses",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Don't play any", 
          emoji: "😔", 
          // description: "Everyone loses",
          isCorrect: false 
        },
        { 
          id: "a", 
          text: "Play both games", 
          emoji: "🎲", 
          // description: "Everyone gets what they want",
          isCorrect: true 
        }
      ]
    },
    {
      id: 4,
      text: "You and your sibling want to watch different TV shows. What's best?",
      options: [
        { 
          id: "b", 
          text: "Watch nothing", 
          emoji: "🚫", 
          // description: "Everyone loses",
          isCorrect: false 
        },
        { 
          id: "a", 
          text: "Watch one then the other", 
          emoji: "📺", 
          // description: "Both get to watch their show",
          isCorrect: true 
        },
        { 
          id: "c", 
          text: "Argue about it", 
          emoji: "🗣️", 
          // description: "This doesn't solve anything",
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "You both need crayons for coloring. What's the best solution?",
      options: [
        { 
          id: "b", 
          text: "Keep all for yourself", 
          emoji: "🤲", 
          // description: "The other person loses",
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Break them", 
          emoji: "💥", 
          // description: "Everyone loses",
          isCorrect: false 
        },
        { 
          id: "a", 
          text: "Share and trade colors", 
          emoji: "🖍️", 
          // description: "Everyone gets what they need",
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
      title="Win-Win Quiz"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/uvls/kids/calm-reflexx"
      nextGameIdProp="uvls-kids-73"
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
                <h3 className="text-2xl font-bold text-white mb-4">Win-Win Quiz Star!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You know how to find solutions where everyone wins!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Win-win solutions make everyone happy! Taking turns, sharing, and finding ways for everyone to get what they want is better than having winners and losers!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember: Win-win means everyone gets something good!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Look for solutions where everyone can be happy! Taking turns, sharing, and compromising are great ways to create win-win situations!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default WinWinQuiz;

