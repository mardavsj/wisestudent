import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SplitFairlyRoleplay = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "uvls-kids-75";
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
      text: "You have 5 stickers to share with a friend. How should you split them?",
      options: [
        { 
          id: "b", 
          text: "Split 2.5 each (or take turns)", 
          emoji: "🤝", 
          isCorrect: true 
        },
        { 
          id: "a", 
          text: "Split 2 and 3", 
          emoji: "🖼️", 
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "One person gets all", 
          emoji: "👤", 
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "You have 4 cakes to share with a friend. How should you split them?",
      options: [
        { 
          id: "b", 
          text: "3 and 1", 
          emoji: "😔", 
          isCorrect: false 
        },
        { 
          id: "a", 
          text: "2 each", 
          emoji: "🍰", 
          isCorrect: true 
        },
        { 
          id: "c", 
          text: "Eat all alone", 
          emoji: "😋", 
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "You have 6 candies to share with a friend. How should you split them?",
      options: [
        { 
          id: "b", 
          text: "4 and 2", 
          emoji: "🤔", 
          isCorrect: false 
        },
       
        { 
          id: "c", 
          text: "Throw half away", 
          emoji: "🗑️", 
          isCorrect: false 
        },
         { 
          id: "a", 
          text: "3 each", 
          emoji: "🍬", 
          isCorrect: true 
        },
      ]
    },
    {
      id: 4,
      text: "You have 2 toys to share with a friend. How should you split them?",
      options: [
        { 
          id: "b", 
          text: "Both to one person", 
          emoji: "👥", 
          isCorrect: false 
        },
        { 
          id: "a", 
          text: "One each", 
          emoji: "🧸", 
          isCorrect: true 
        },
        { 
          id: "c", 
          text: "Break one in half", 
          emoji: "💥", 
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "You have 10 minutes of playtime to share with a friend. How should you split it?",
      options: [
        { 
          id: "a", 
          text: "5 minutes each", 
          emoji: "⏰", 
          isCorrect: true 
        },
        { 
          id: "b", 
          text: "7 and 3 minutes", 
          emoji: "😠", 
          isCorrect: false 
        },
        
        { 
          id: "c", 
          text: "No playtime for anyone", 
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
      title="Split Fairly Roleplay"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Game Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/uvls/kids/mediation-poster"
      nextGameIdProp="uvls-kids-76"
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
                <h3 className="text-2xl font-bold text-white mb-4">Fair Splitter!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You know how to split things fairly!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Splitting things fairly means dividing equally so everyone gets the same amount. When you can't split equally (like 5 stickers), take turns or find another fair way. Fair sharing makes everyone happy and shows you care about others!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember: Split things equally and fairly!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: When sharing, split things equally so everyone gets the same amount. If you can't split equally, take turns or find another fair way!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SplitFairlyRoleplay;

