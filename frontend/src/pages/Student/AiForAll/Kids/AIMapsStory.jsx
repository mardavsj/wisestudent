import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const AIMapsStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("ai-kids-27");
  const gameId = gameData?.id || "ai-kids-27";
  
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
      text: "Mom wants to find the shortest road to Grandma's house. Who should she rely on?",
      options: [
        { 
          id: "maps", 
          text: "Google Maps AI", 
          emoji: "🧭", 
          isCorrect: true
        },
        { 
          id: "guess", 
          text: "Guessing the route", 
          emoji: "🤷‍♂️", 
          isCorrect: false
        },
        { 
          id: "paper", 
          text: "Using a paper map", 
          emoji: "🗺️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Riya wants to set an alarm without touching her phone. What should she do?",
      options: [
        { 
          id: "wait", 
          text: "Wait until someone reminds her", 
          emoji: "⏰", 
          isCorrect: false
        },
        { 
          id: "voice", 
          text: "Say 'Hey Google' or 'Alexa'", 
          emoji: "🗣️", 
          isCorrect: true
        },
        { 
          id: "paper", 
          text: "Write it on paper", 
          emoji: "📝", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Rohit buys shoes online, and the app suggests matching socks. How does it know?",
      options: [
        { 
          id: "owner", 
          text: "Shop owner personally guessed", 
          emoji: "🧑‍💼", 
          isCorrect: false
        },
        { 
          id: "luck", 
          text: "Random luck", 
          emoji: "🍀", 
          isCorrect: false
        },
        { 
          id: "ai", 
          text: "AI recommendation system", 
          emoji: "💡", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "A doctor uses a computer to detect early signs of disease from scans. What's helping?",
      options: [
        { 
          id: "ai", 
          text: "AI medical imaging tool", 
          emoji: "🩺", 
          isCorrect: true
        },
        { 
          id: "luck", 
          text: "Guessing based on luck", 
          emoji: "🎲", 
          isCorrect: false
        },
        { 
          id: "handwriting", 
          text: "Doctor's handwriting", 
          emoji: "🖋️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "In Riya's favorite racing game, the opponent cars adjust speed automatically. Why?",
      options: [
        { 
          id: "developer", 
          text: "Game developer drives them", 
          emoji: "👨‍💻", 
          isCorrect: false
        },
        { 
          id: "ai", 
          text: "AI controls difficulty dynamically", 
          emoji: "🤖", 
          isCorrect: true
        },
        { 
          id: "random", 
          text: "They are random bots", 
          emoji: "🎲", 
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
    navigate("/student/ai-for-all/kids/voice-assistant-quiz");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="AI in Maps Story"
      score={coins}
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/kids/voice-assistant-quiz"
      nextGameIdProp="ai-kids-28"
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId={gameId}
      gameType="ai"
      totalLevels={20}
      currentLevel={27}
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
                  You're learning about AI in daily life!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  You understand how AI helps us in maps, voice assistants, shopping, healthcare, and games!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Keep practicing to learn more about AI in daily life!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to think about how AI helps with navigation, voice commands, recommendations, and more.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIMapsStory;


