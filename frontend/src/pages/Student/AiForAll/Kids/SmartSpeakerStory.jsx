import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SmartSpeakerStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("ai-kids-34");
  const gameId = gameData?.id || "ai-kids-34";
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: 'You say "Play music." The smart speaker plays music. How did it do this?',
      options: [
        { 
          id: "ai", 
          text: "AI", 
          emoji: "🤖", 
          isCorrect: true
        },
        { 
          id: "magic", 
          text: "Magic", 
          emoji: "🪄", 
          isCorrect: false
        },
        { 
          id: "luck", 
          text: "Random luck", 
          emoji: "🍀", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: 'You say "Turn off the lights," and your room lights switch off automatically. How did that happen?',
      options: [
        { 
          id: "magic", 
          text: "Magic", 
          emoji: "🪄", 
          isCorrect: false
        },
        { 
          id: "ai", 
          text: "AI", 
          emoji: "🤖", 
          isCorrect: true
        },
        { 
          id: "remote", 
          text: "Remote control", 
          emoji: "🎮", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: 'You ask your smart assistant, "What\'s the weather today?" It answers instantly. How does it know?',
      options: [
        { 
          id: "magic", 
          text: "Magic", 
          emoji: "🪄", 
          isCorrect: false
        },
        { 
          id: "internet", 
          text: "Internet connection", 
          emoji: "🌐", 
          isCorrect: false
        },
        { 
          id: "ai", 
          text: "AI", 
          emoji: "🤖", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: 'You say "I need new shoes," and your phone shows shoe ads. How did it guess that?',
      options: [
        { 
          id: "ai", 
          text: "AI", 
          emoji: "🤖", 
          isCorrect: true
        },
        { 
          id: "magic", 
          text: "Magic", 
          emoji: "🪄", 
          isCorrect: false
        },
        { 
          id: "coincidence", 
          text: "Coincidence", 
          emoji: "🎲", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: 'Your car says, "Low fuel detected. Nearest station ahead." How did it know?',
      options: [
        { 
          id: "magic", 
          text: "Magic", 
          emoji: "🪄", 
          isCorrect: false
        },
        { 
          id: "sensor", 
          text: "Fuel sensor only", 
          emoji: "⛽", 
          isCorrect: false
        },
        { 
          id: "ai", 
          text: "AI", 
          emoji: "🤖", 
          isCorrect: true
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
    navigate("/student/ai-for-all/kids/ai-doctor-simulation");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Smart Speaker Story"
      score={coins}
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/kids/ai-doctor-simulation"
      nextGameIdProp="ai-kids-35"
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId={gameId}
      gameType="ai"
      totalLevels={20}
      currentLevel={34}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
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
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl">{option.text}</h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You're learning about AI in everyday life!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  You understand how AI powers smart speakers, lights, assistants, and cars!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Keep practicing to learn more about AI!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to think about how AI helps with voice commands, smart devices, and recommendations.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SmartSpeakerStory;


