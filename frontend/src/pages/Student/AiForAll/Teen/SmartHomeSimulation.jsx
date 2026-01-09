import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SmartHomeSimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  
  const { showCorrectAnswerFeedback, flashPoints, showAnswerConfetti } = useGameFeedback();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const questions = [
    {
      id: 1,
      text: "What is the primary benefit of AI-controlled smart home devices?",
      options: [
        { 
          id: "convenience", 
          text: "Enhanced convenience", 
          emoji: "🏠", 
          
          isCorrect: true
        },
        { 
          id: "cost", 
          text: "Reduced device costs", 
          emoji: "💰", 
          // description: "Cheaper smart home equipment",
          isCorrect: false
        },
        { 
          id: "complexity", 
          text: "Increased complexity", 
          emoji: "🧩", 
          // description: "More complicated systems",
          isCorrect: false
        },
        { 
          id: "manual", 
          text: "Manual operation", 
          emoji: "✋", 
          // description: "Human-controlled systems",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which sensor is commonly used to detect human presence in smart homes?",
      options: [
       
        { 
          id: "microphone", 
          text: "Audio sensors", 
          emoji: "🎤", 
          // description: "Capture sound waves",
          isCorrect: false
        },
        { 
          id: "thermometer", 
          text: "Temperature sensors", 
          emoji: "🌡️", 
          // description: "Measure ambient heat",
          isCorrect: false
        },
         { 
          id: "camera", 
          text: "Motion sensors", 
          emoji: "📹", 
          // description: "Detect movement in rooms",
          isCorrect: true
        },
        { 
          id: "barometer", 
          text: "Pressure sensors", 
          emoji: "🔽", 
          // description: "Detect atmospheric pressure",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What is a key privacy concern with smart home AI systems?",
      options: [
        { 
          id: "power", 
          text: "Power consumption", 
          emoji: "🔋", 
          // description: "Energy usage of devices",
          isCorrect: false
        },
        { 
          id: "data", 
          text: "Data collection and storage", 
          emoji: "🗄️", 
          // description: "Personal information handling",
          isCorrect: true
        },
        { 
          id: "connectivity", 
          text: "Internet connectivity", 
          emoji: "🌐", 
          // description: "Network reliability",
          isCorrect: false
        },
        { 
          id: "compatibility", 
          text: "Device compatibility", 
          emoji: "🔌", 
          // description: "Inter-device communication",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How do smart home devices typically communicate with each other?",
      options: [
        { 
          id: "wifi", 
          text: "Wireless networks (WiFi/Bluetooth)", 
          emoji: "📶", 
          // description: "Radio frequency connections",
          isCorrect: true
        },
        { 
          id: "wires", 
          text: "Physical wiring", 
          emoji: "🔌", 
          // description: "Cabled connections",
          isCorrect: false
        },
        { 
          id: "signals", 
          text: "Cellular signals", 
          emoji: "📱", 
          // description: "Mobile network transmission",
          isCorrect: false
        },
        { 
          id: "satellite", 
          text: "Satellite communication", 
          emoji: "🛰️", 
          // description: "Orbital signal relay",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What is an example of proactive automation in smart homes?",
      options: [
        { 
          id: "schedule", 
          text: "Scheduled device activation", 
          emoji: "⏰", 
          // description: "Timed turning on/off of devices",
          isCorrect: true
        },
        { 
          id: "manual", 
          text: "Manual device control", 
          emoji: "👆", 
          // description: "Human-operated switching",
          isCorrect: false
        },
        { 
          id: "random", 
          text: "Random device activation", 
          emoji: "🎲", 
          // description: "Unpredictable triggering",
          isCorrect: false
        },
        { 
          id: "constant", 
          text: "Constant device operation", 
          emoji: "🔁", 
          // description: "Always-on systems",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: selectedChoice,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleFinish = () => {
    navigate("/student/ai-for-all/teen/ai-explorer-badge");
  };

  return (
    <GameShell
      title="Smart Home Simulation 🏠"
      subtitle={showResult ? "Simulation Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleFinish}
      nextEnabled={showResult}
      nextGamePathProp="/student/ai-for-all/teen/ai-explorer-badge"
      nextGameIdProp="ai-teen-50"
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="ai-teen-49"
      gameType="ai"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore >= 3}
      backPath="/games/ai-for-all/teens"
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}>
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-4 md:mb-6 text-center">Understanding Smart Home AI</h3>
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
                <p className="text-base md:text-lg lg:text-xl font-semibold text-white text-center">"{getCurrentQuestion().text}"</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {getCurrentQuestion().options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
                  >
                    <div className="flex items-start">
                      <div className="text-2xl md:text-3xl mr-3">{option.emoji}</div>
                      <div>
                        <h5 className="font-bold text-white text-sm md:text-base mb-1">{option.text}</h5>
                        <p className="text-white/80 text-xs md:text-sm">{option.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20 text-center flex-1 flex flex-col justify-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-4xl md:text-5xl mb-4">🎉</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Excellent!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand how smart home AI works!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  💡 AI controls your smart home devices, turning lights, fans, coffee machines, heaters, and music on automatically as you enter the room. 
                  This makes homes smarter, safer, and energy-efficient!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Smart home AI uses sensors and automation to make our lives more convenient!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to focus on how AI uses sensors and automation to control smart home devices.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SmartHomeSimulation;