import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SmartHomeLightsGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("ai-kids-49");
  const gameId = gameData?.id || "ai-kids-49";
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } =
    useGameFeedback();

  // 💡 Smart Home AI Questions with 3 options each
  const questions = [
    {
      id: 1,
      text: "You walk into your room and the lights turn ON automatically. What caused it?",
      options: [
        { 
          id: "ai", 
          text: "AI sensors detected movement ", 
          emoji: "📡", 
          
          isCorrect: true
        },
        { 
          id: "magic", 
          text: "Magic spell ", 
          emoji: "🪄", 
          
          isCorrect: false
        },
        { 
          id: "person", 
          text: "Someone hiding and switching lights ", 
          emoji: "🧍", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your AC adjusts the temperature before you enter the room. How does it know?",
      options: [
        { 
          id: "ghost", 
          text: "Ghost in the room ", 
          emoji: "👻", 
          isCorrect: false
        },
        { 
          id: "ai", 
          text: "AI learns your comfort pattern ", 
          emoji: "🌡️", 
          isCorrect: true
        },
        { 
          id: "random", 
          text: "It guesses randomly ", 
          emoji: "🎲", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Smart speakers play music when you say 'Play my playlist'. What technology helps this?",
      options: [
        { 
          id: "voice", 
          text: "AI Voice Recognition ", 
          emoji: "🎤", 
          isCorrect: true
        },
        { 
          id: "telepathy", 
          text: "Telepathy ", 
          emoji: "🧠", 
          isCorrect: false
        },
        { 
          id: "luck", 
          text: "Pure luck ", 
          emoji: "🍀", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "The fridge sends a message when milk is low. What's behind it?",
      options: [
        { 
          id: "person", 
          text: "A person inside checking ", 
          emoji: "🧍", 
          isCorrect: false
        },
        { 
          id: "guess", 
          text: "It makes wild guesses ", 
          emoji: "🔮", 
          isCorrect: false
        },
        { 
          id: "sensors", 
          text: "AI + Smart Sensors ", 
          emoji: "🧠", 
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "The door camera notifies you of visitors. How does it recognize faces?",
      options: [
        { 
          id: "facial", 
          text: "AI Facial Recognition ", 
          emoji: "📸", 
          isCorrect: true
        },
        { 
          id: "luck", 
          text: "By luck ", 
          emoji: "🍀", 
          isCorrect: false
        },
        { 
          id: "magic", 
          text: "Magic mirror ", 
          emoji: "🪞", 
          isCorrect: false
        }
      ]
    }
  ];

  // Function to get options without rotation - keeping actual positions fixed
  const getRotatedOptions = (options, questionIndex) => {
    // Return options without any rotation to keep their actual positions fixed
    return options;
  };

  const getCurrentQuestion = () => questions[currentQuestion];
  const displayOptions = getRotatedOptions(getCurrentQuestion().options, currentQuestion);

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
    }
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 0);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/ai-daily-life-badge");
  };

  return (
    <GameShell
      title="Smart Home Lights Game"
      score={coins}
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/kids/ai-daily-life-badge"
      nextGameIdProp="ai-kids-50"
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId={gameId}
      gameType="ai"
      totalLevels={20}
      currentLevel={49}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Coins: {coins}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {getCurrentQuestion().text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">💡</div>
                <h3 className="text-2xl font-bold text-white mb-4">Smart Home Expert!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You're learning about smart home technology!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  You understand how AI makes homes smarter, safer, and more energy-efficient!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Keep practicing to learn more about smart home technology!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to think about how AI sensors and algorithms make our homes smarter.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SmartHomeLightsGame;