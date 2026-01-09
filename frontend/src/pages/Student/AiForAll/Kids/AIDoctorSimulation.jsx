import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';
import { getGameDataById } from '../../../../utils/getGameData';

const AIDoctorSimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-kids-35";
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
      title: "AI Medical Imaging",
      description: "An AI doctor looks at X-ray images to find problems. What is this AI most likely helping doctors find?",
      choices: [
        
        { 
          text: "Weather patterns", 
          emoji: "☀️",
          isCorrect: false
        },
        { 
          text: "Car problems", 
          emoji: "🚗",
          isCorrect: false
        },
        { 
          text: "Traffic signs", 
          emoji: "🚦",
          isCorrect: false
        },
        { 
          text: "Broken bones", 
          emoji: "🦴",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      title: "AI Health Assistant",
      description: "Sarah talks to an AI health assistant on her phone. She describes her symptoms and gets health tips. What is this AI helping with?",
      choices: [
        { 
          text: "Finding nearby restaurants", 
          emoji: "🍔",
          isCorrect: false
        },
        { 
          text: "Checking symptoms and giving health advice", 
          emoji: "🩺",
          isCorrect: true
        },
        { 
          text: "Playing video games", 
          emoji: "🎮",
          isCorrect: false
        },
        { 
          text: "Planning vacation trips", 
          emoji: "✈️",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "AI Disease Detection",
      description: "A hospital uses AI to look at blood test results. What can the AI help doctors do better?",
      choices: [
        { 
          text: "Cook meals for patients", 
          emoji: "🍲",
          isCorrect: false
        },
        { 
          text: "Clean hospital rooms", 
          emoji: "🧹",
          isCorrect: false
        },
        { 
          text: "Predict diseases early", 
          emoji: "🔬",
          isCorrect: true
        },
        { 
          text: "Organize patient appointments", 
          emoji: "📅",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "AI for Medicine Discovery",
      description: "Scientists use AI to discover new medicines. How does the AI help?",
      choices: [
        { 
          text: "Design new medicine molecules", 
          emoji: "💊",
          isCorrect: true
        },
        { 
          text: "Drive ambulances", 
          emoji: "🚑",
          isCorrect: false
        },
        { 
          text: "Write music for hospitals", 
          emoji: "🎵",
          isCorrect: false
        },
        { 
          text: "Schedule doctor meetings", 
          emoji: "📋",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "AI Health Monitoring",
      description: "Smart watches can track your heart rate, sleep, and steps. How can AI help with this health data?",
      choices: [
        { 
          text: "Make phone calls for you", 
          emoji: "📞",
          isCorrect: false
        },
        { 
          text: "Take photos of your food", 
          emoji: "📸",
          isCorrect: false
        },
        { 
          text: "Find patterns that might show health problems", 
          emoji: "📊",
          isCorrect: true
        },
        { 
          text: "Send messages to friends", 
          emoji: "💬",
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

  const handleNext = () => {
    // Navigate to the next game in the sequence
    navigate("/student/ai-for-all/kids/robot-vacuum-game");
  };

  return (
    <GameShell
      title="Simulation: AI Doctor"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${scenarios.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/kids/robot-vacuum-game"
      nextGameIdProp="ai-kids-36"
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
                  You understand medical diagnosis!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: AI doctors can help diagnose diseases based on symptoms!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {scenarios.length} questions correct.
                  Keep learning about medical diagnosis!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: AI can help doctors diagnose diseases by analyzing symptoms!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIDoctorSimulation;