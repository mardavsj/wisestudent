import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const QuizLeadership = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("moral-teen-72");
  const gameId = gameData?.id || "moral-teen-72";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for QuizLeadership, using fallback ID");
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
      text: "What makes a great leader?",
      options: [
        { 
          id: "a", 
          text: "Serving and helping others", 
          emoji: "🤝", 
          
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Commanding others", 
          emoji: "📣", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ignoring the team", 
          emoji: "🙈", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "A true leader inspires others by…",
      options: [
        { 
          id: "a", 
          text: "Yelling for obedience", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Setting a good example", 
          emoji: "🌟", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Doing everything alone", 
          emoji: "🚶‍♂️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "When your team is struggling, a leader should…",
      options: [
        { 
          id: "a", 
          text: "Blame them for failure", 
          emoji: "👎", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Stay silent", 
          emoji: "🤐", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Support and guide them", 
          emoji: "🫶", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "What quality best defines good leadership?",
      options: [
        { 
          id: "a", 
          text: "Kindness and fairness", 
          emoji: "💖", 
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Bossiness", 
          emoji: "😤", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Popularity", 
          emoji: "🎭", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "A good leader makes decisions that…",
      options: [
        { 
          id: "a", 
          text: "Only help themselves", 
          emoji: "🙄", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Benefit everyone in the team", 
          emoji: "🌍", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Avoid responsibility", 
          emoji: "🚫", 
          isCorrect: false
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

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Leadership"
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
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{option.text}</h3>
                    <p className="text-white/90 text-sm">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default QuizLeadership;
