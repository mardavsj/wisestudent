import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const AiGetsSmarter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("ai-kids-57");
  const gameId = gameData?.id || "ai-kids-57";
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // 5 Questions about AI training methods
  const questions = [
    {
      id: 1,
      text: "Which is the BEST way to help AI recognize cats in photos?",
      options: [
        { 
          id: "clear", 
          text: "Use clear, high-quality photos of cats ", 
          emoji: "📷", 
          
          isCorrect: true
        },
        { 
          id: "blurry", 
          text: "Use blurry, low-quality photos ", 
          emoji: "🌫️", 
          
          isCorrect: false
        },
        { 
          id: "mixed", 
          text: "Mix cat photos with random objects ", 
          emoji: "🎲", 
          
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How should we label data for training AI?",
      options: [
        { 
          id: "random", 
          text: "Label randomly without checking ", 
          emoji: "🎲", 
          isCorrect: false
        },
        { 
          id: "correct", 
          text: "Label everything accurately ", 
          emoji: "🎯", 
          isCorrect: true
        },
        { 
          id: "skip", 
          text: "Skip labeling to save time ⏭", 
          emoji: "⏭️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What helps AI recognize objects in different situations?",
      options: [
        { 
          id: "varied", 
          text: "Show many variations of the same object ", 
          emoji: "🔄", 
          isCorrect: true
        },
        { 
          id: "same", 
          text: "Show the exact same photo repeatedly ", 
          emoji: "📷", 
          isCorrect: false
        },
        { 
          id: "few", 
          text: "Use only a few examples ", 
          emoji: "📉", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How often should we train AI models?",
      options: [
        { 
          id: "never", 
          text: "Never retrain after initial setup ", 
          emoji: "🛑", 
          isCorrect: false
        },
        { 
          id: "random", 
          text: "Train randomly without schedule ", 
          emoji: "🎲", 
          isCorrect: false
        },
        { 
          id: "consistent", 
          text: "Train regularly with new data ", 
          emoji: "📅", 
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "What happens when AI is trained with wrong data?",
      options: [
        { 
          id: "worse", 
          text: "Performance gets worse ", 
          emoji: "😡", 
          isCorrect: true
        },
        { 
          id: "better", 
          text: "Performance improves magically ", 
          emoji: "✨", 
          isCorrect: false
        },
        { 
          id: "same", 
          text: "Nothing changes ", 
          emoji: "🟰", 
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
    navigate("/student/ai-for-all/kids/wrong-prediction-quiz");
  };


  return (
    <GameShell
      title="AI Gets Smarter"
      score={coins}
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/kids/wrong-prediction-quiz"
      nextGameIdProp="ai-kids-58"
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId={gameId}
      gameType="ai"
      totalLevels={20}
      currentLevel={57}
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
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-2xl font-bold text-white mb-4">AI Training Master!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand how to make AI smarter!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white/90 text-sm">
                    🌟 Perfect! You know that AI gets smarter with quality data, correct labels, varied examples, and consistent training!
                  </p>
                </div>
                <p className="text-white/80">
                  Each correct choice helped the robot learn better patterns!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Keep practicing to learn more about AI training!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white/90 text-sm">
                    💡 Remember: AI gets smarter with quality data, correct labels, varied examples, and consistent training!
                  </p>
                </div>
                <p className="text-white/80 text-sm">
                  Think about what helps AI learn better patterns and perform well in real situations.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AiGetsSmarter;