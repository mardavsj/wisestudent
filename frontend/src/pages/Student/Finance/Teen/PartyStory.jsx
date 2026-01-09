import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';

const PartyStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-teens-15";
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
      text: "You're planning a birthday party with a ₹2000 budget. Which approach shows responsible financial planning?",
      options: [
        { 
          id: "a", 
          text: "Allocate ₹1000 for venue, ₹500 for food, ₹300 for decorations, ₹200 for contingencies", 
          emoji: "📋", 
          
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Spend all ₹2000 on decorations", 
          emoji: "🎨", 
          
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ask parents to cover extra costs", 
          emoji: "💸", 
          
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You receive ₹1500 in gifts for your party. How should you handle the monetary gifts?",
      options: [
        { 
          id: "a", 
          text: "Spend it all immediately", 
          emoji: "🛍️", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Split it: save 60% (₹900) and spend 40% (₹600)", 
          emoji: "💰", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Give it all to friends", 
          emoji: "👥", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "After the party, you realize you spent ₹500 more than planned. What's the best way to handle this?",
      options: [
        { 
          id: "a", 
          text: "Ignore it since it was special", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Review what caused overspending and adjust future budgets", 
          emoji: "📊", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Cancel your next social event", 
          emoji: "🚫", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "A friend asks you to host another party. Your monthly entertainment budget is ₹750. What should you do?",
      options: [
        { 
          id: "a", 
          text: "Host a small gathering within your budget (₹750)", 
          emoji: "🎉", 
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Host a big party anyway", 
          emoji: "💸", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ask parents to sponsor it", 
          emoji: "👨‍👩‍👧‍👦", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You saved ₹1000 from your part-time job for a party. How should you evaluate if hosting is worth it?",
      options: [
        
        { 
          id: "b", 
          text: "Focus only on having fun", 
          emoji: "🎉", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Host the biggest party to impress", 
          emoji: "💎", 
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Compare the joy of hosting with alternative uses of ₹1000", 
          emoji: "⚖️", 
          isCorrect: true
        },
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
      title="Party Story"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/finance/teen/debate-needs-vs-wants"
      nextGameIdProp="finance-teens-16"
      gameType="finance"
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
                {currentQuestionData.options.map((option, idx) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
                    disabled={answered}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                    <p className="text-white/90 text-sm">{option.description}</p>
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
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct!
                  You're learning smart party planning and financial decisions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  You understand the importance of budgeting, saving, and making thoughtful financial decisions for parties!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct.
                  Remember, smart party planning means budgeting and making thoughtful financial decisions!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to choose the option that shows responsible budgeting and financial planning.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PartyStory;