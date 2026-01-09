import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ScholarshipStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("finance-teens-91");
  const gameId = gameData?.id || "finance-teens-91";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ScholarshipStory, using fallback ID");
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
      text: "Student lies to get extra scholarship. What's the correct action?",
      options: [
        { 
          id: "lie", 
          text: "Lie to get money", 
          emoji: "😈", 
          
          isCorrect: false
        },
        { 
          id: "truthful", 
          text: "Be truthful", 
          emoji: "📝", 
          
          isCorrect: true
        },
        { 
          id: "maybe", 
          text: "Maybe, if needed", 
          emoji: "🤔", 
          
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What happens if you lie on scholarship application?",
      options: [
        { 
          id: "get-money", 
          text: "Get more money", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          id: "lose-opportunity", 
          text: "Lose opportunity and trust", 
          emoji: "🚫", 
          isCorrect: true
        },
        { 
          id: "nothing", 
          text: "Nothing happens", 
          emoji: "😊", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Why is honesty important in applications?",
      options: [
        { 
          id: "builds-trust", 
          text: "Builds trust and integrity", 
          emoji: "🤝", 
          isCorrect: true
        },
        { 
          id: "not-important", 
          text: "Not important", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          id: "waste-time", 
          text: "Wastes time", 
          emoji: "⏳", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What should you do if you make a mistake in application?",
      options: [
        { 
          id: "hide-mistake", 
          text: "Hide the mistake", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          id: "correct-it", 
          text: "Correct it honestly", 
          emoji: "✏️", 
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore it", 
          emoji: "😴", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What's the best approach for scholarship?",
      options: [
        { 
          id: "honest-application", 
          text: "Honest and complete application", 
          emoji: "📝", 
          isCorrect: true
        },
        { 
          id: "exaggerate", 
          text: "Exaggerate achievements", 
          emoji: "📈", 
          isCorrect: false
        },
        { 
          id: "copy-others", 
          text: "Copy from others", 
          emoji: "📋", 
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

  const currentQ = questions[currentQuestion];

  return (
    <GameShell
      title="Scholarship Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/finance/teen/ethics-quiz"
      nextGameIdProp="finance-teens-92"
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
        ) : null}
      </div>
    </GameShell>
  );
};

export default ScholarshipStory;

