import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CookingStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const questions = [
    {
      id: 1,
      text: "A boy learns cooking from his grandmother. Is this learning?",
      options: [
        {
          id: "a",
          text: "No, only school teaches real learning",
          emoji: "📚",
          isCorrect: false
        },
        {
          id: "b",
          text: "Yes, learning happens everywhere",
          emoji: "👨‍🍳",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only if it's written in a textbook",
          emoji: "📖",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What skills does the boy develop by learning to cook?",
      options: [
        {
          id: "a",
          text: "Measurement, planning, and creativity",
          emoji: "🧠",
          isCorrect: true
        },
        {
          id: "b",
          text: "Nothing useful",
          emoji: "❌",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only physical strength",
          emoji: "💪",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Learning from his grandmother helps the boy:",
      options: [
        {
          id: "a",
          text: "Connect with family and preserve traditions",
          emoji: "👨‍👩‍👦",
          isCorrect: true
        },
        {
          id: "b",
          text: "Waste time that could be spent on homework",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid all responsibilities",
          emoji: "🏃",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "This type of learning is important because:",
      options: [
        
        {
          id: "b",
          text: "It's only for entertainment",
          emoji: "🎮",
          isCorrect: false
        },
        {
          id: "c",
          text: "It replaces all formal education",
          emoji: "🏫",
          isCorrect: false
        },
        {
          id: "a",
          text: "It teaches practical life skills and cultural knowledge",
          emoji: "🌍",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "Why should the boy continue learning cooking skills?",
      options: [
        {
          id: "a",
          text: "For independence, health, and cultural connection",
          emoji: "🌟",
          isCorrect: true
        },
        {
          id: "b",
          text: "He should stop once he can buy food",
          emoji: "🛒",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only to impress his friends",
          emoji: "😎",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: optionId,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === optionId)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === optionId)?.isCorrect;
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
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/ehe/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Cooking Story"
      score={coins}
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      gameId="ehe-kids-98"
      gameType="ehe"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/ehe/kids"
    
      nextGamePathProp="/student/ehe/kids/reflex-growth-check"
      nextGameIdProp="ehe-kids-99">
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
              </div>
              
              <h2 className="text-white text-base md:text-lg lg:text-xl mb-4 md:mb-6 text-center">
                {getCurrentQuestion().text}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl md:text-3xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-base md:text-xl mb-2">{option.text}</h3>

                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20 text-center flex-1 flex flex-col justify-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-4xl md:text-5xl mb-4">👨‍🍳</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Kitchen Master!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand the value of learning life skills from family!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  Great job! You know that learning happens everywhere, cooking develops measurement and planning skills, intergenerational learning strengthens family bonds, informal learning teaches practical life skills, and cooking provides independence and cultural connection!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, learning from family members provides valuable life skills!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to choose the option that shows the best understanding of intergenerational learning.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default CookingStory;