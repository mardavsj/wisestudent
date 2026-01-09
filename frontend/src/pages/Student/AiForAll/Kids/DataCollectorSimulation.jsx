import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';

const DataCollectorSimulation = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-kids-74";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      title: "Image Collector",
      description: "You are collecting photos for an AI to identify fruits. Which image should you choose?",
      choices: [
        { 
          text: "A clear photo of an apple", 
          emoji: "🍎",
          isCorrect: true
        },
        { 
          text: "A blurry image", 
          emoji: "🌫️",
          isCorrect: false
        },
        { 
          text: "A cartoon of a banana", 
          emoji: "🍌",
          isCorrect: false
        },
        { 
          text: "A black and white image", 
          emoji: "🖼️",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Sound Recorder",
      description: "AI is learning animal sounds. Which data is correct?",
      choices: [
        { 
          text: "A random background noise", 
          emoji: "📢",
          isCorrect: false
        },
        { 
          text: "A recording of a cat's meow", 
          emoji: "🐱",
          isCorrect: true
        },
        { 
          text: "A person saying 'meow'", 
          emoji: "🗣️",
          isCorrect: false
        },
        { 
          text: "A recording of a dog bark", 
          emoji: "🐕",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Text Collector",
      description: "You are training an AI chatbot. Which text should you collect?",
      choices: [
        { 
          text: "Spam messages", 
          emoji: "🚫",
          isCorrect: false
        },
        { 
          text: "Broken text with symbols", 
          emoji: "❌",
          isCorrect: false
        },
        { 
          text: "Polite and correct sentences", 
          emoji: "💬",
          isCorrect: true
        },
        { 
          text: "Angry text messages", 
          emoji: "😠",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Diversity Matters",
      description: "To make AI fair, what kind of images should be collected?",
      choices: [
        { 
          text: "Images from many people and places", 
          emoji: "🌍",
          isCorrect: true
        },
        { 
          text: "Only from one country", 
          emoji: "🌐",
          isCorrect: false
        },
        { 
          text: "Only of famous people", 
          emoji: "⭐",
          isCorrect: false
        },
        { 
          text: "Only from one age group", 
          emoji: "👤",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Data Safety",
      description: "Before uploading data, what must you do?",
      choices: [
        { 
          text: "Share full contact info", 
          emoji: "📱",
          isCorrect: false
        },
        { 
          text: "Remove personal details", 
          emoji: "🔒",
          isCorrect: true
        },
        { 
          text: "Post on social media", 
          emoji: "📢",
          isCorrect: false
        },
        { 
          text: "Share without consent", 
          emoji: "⚠️",
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
    
    const isLastQuestion = currentQuestion === scenarios.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
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
      title="Simulation: Data Collector"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${scenarios.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/kids/training-hero-badge"
      nextGameIdProp="ai-kids-75"
      gameType="ai"
      totalLevels={scenarios.length}
      currentLevel={currentQuestion + 1}
      maxScore={scenarios.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && scenarios[currentQuestion] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{scenarios.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{scenarios.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {scenarios[currentQuestion].description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scenarios[currentQuestion].choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedAnswer(idx);
                      handleChoice(choice.isCorrect);
                    }}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-left transition-all transform ${
                      answered
                        ? choice.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : selectedAnswer === idx
                          ? "bg-red-500/20 border-4 border-red-400 ring-4 ring-red-400"
                          : "bg-white/5 border-2 border-white/20 opacity-50"
                        : "bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{choice.emoji}</span>
                      <span className="text-white font-semibold">{choice.text}</span>
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
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {scenarios.length} questions correct!
                  You understand how to collect quality data for AI training!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Data should be accurate, diverse, clean, and safe before training AI!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {scenarios.length} questions correct.
                  Remember, quality data helps AI learn correctly!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Always collect accurate, diverse, clean, and safe data for AI training!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DataCollectorSimulation;


