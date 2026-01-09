import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const OverfittingStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("ai-kids-55");
  const gameId = gameData?.id || "ai-kids-55";
  
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
      text: "The robot was trained only on red apples. Now it sees a green apple and says 'Not an apple'. What should you do?",
      options: [
        { 
          id: "explain", 
          text: "Explain the robot its mistake", 
          emoji: "🧠", 
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore it", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          id: "agree", 
          text: "Tell the robot it's right", 
          emoji: "👍", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "The AI saw only pictures of dogs and now thinks every animal is a dog. What should you do?",
      options: [
        { 
          id: "good", 
          text: "Say 'good job' to AI", 
          emoji: "👏", 
          isCorrect: false
        },
        { 
          id: "show", 
          text: "Show it pictures of cats too", 
          emoji: "📸", 
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore the error", 
          emoji: "🙈", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "AI only trained on one school's students. It struggles to predict grades for another school. What do you do?",
      options: [
        { 
          id: "same", 
          text: "Keep using the same data", 
          emoji: "🔁", 
          isCorrect: false
        },
        { 
          id: "add", 
          text: "Add data from more schools", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          id: "stop", 
          text: "Stop training AI", 
          emoji: "✋", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "AI was trained only in sunny weather, so it fails when it rains. What's the fix?",
      options: [
        { 
          id: "ai", 
          text: "Add rainy and cloudy weather data", 
          emoji: "🌧️", 
          isCorrect: true
        },
        { 
          id: "delete", 
          text: "Delete sunny data", 
          emoji: "☀️", 
          isCorrect: false
        },
        { 
          id: "nothing", 
          text: "Do nothing", 
          emoji: "🙅‍♂️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "AI only learned adult voices. It fails to recognize children. What should you do?",
      options: [
        { 
          id: "ignore", 
          text: "Ignore the issue", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          id: "train", 
          text: "Train it with diverse voices", 
          emoji: "🗣️", 
          isCorrect: true
        },
        { 
          id: "off", 
          text: "Turn off voice input", 
          emoji: "🔇", 
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
    navigate("/student/ai-for-all/kids/data-labeling-game");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Overfitting Story"
      score={coins}
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/kids/data-labeling-game"
      nextGameIdProp="ai-kids-56"
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId={gameId}
      gameType="ai"
      totalLevels={20}
      currentLevel={55}
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
                  You're learning about overfitting in AI!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  You understand how diverse training data helps AI work better!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Keep practicing to learn more about overfitting!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to think about how diverse training data helps AI work in different situations.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default OverfittingStory;


