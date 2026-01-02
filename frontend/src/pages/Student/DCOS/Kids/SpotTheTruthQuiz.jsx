import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SpotTheTruthQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-kids-31");
  const gameId = gameData?.id || "dcos-kids-31";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for SpotTheTruthQuiz, using fallback ID");
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
      text: "Headline: 'Dogs can fly!' Real or Fake?",
      options: [
        { 
          id: "a", 
          text: "Real", 
          emoji: "🙂", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Fake", 
          emoji: "🙃", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Maybe", 
          emoji: "🤔", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Headline: 'Water is wet.' Real or Fake?",
      options: [
        { 
          id: "a", 
          text: "Real", 
          emoji: "🙂", 
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Fake", 
          emoji: "🙃", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Not Sure", 
          emoji: "🤷", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Headline: 'A robot became the school principal.' Real or Fake?",
      options: [
        
        { 
          id: "b", 
          text: "Real", 
          emoji: "🙂", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Could Be", 
          emoji: "🤔", 
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Fake", 
          emoji: "🙃", 
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "Headline: 'The sun rises in the east.' Real or Fake?",
      options: [
        { 
          id: "a", 
          text: "Real", 
          emoji: "🙂", 
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Fake", 
          emoji: "🙃", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Sometimes", 
          emoji: "🌅", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Headline: 'Chocolate grows on trees.' Real or Fake?",
      options: [
        
        { 
          id: "b", 
          text: "Real", 
          emoji: "🙂", 
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Fake", 
          emoji: " 🙃", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Maybe", 
          emoji: "🤔", 
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
      title="Quiz on Truth"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
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

export default SpotTheTruthQuiz;
