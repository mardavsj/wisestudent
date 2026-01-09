import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PassionStory = () => {
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
      text: "A teen loves helping people and making a positive difference. What career might be a good fit?",
      options: [
        
        {
          id: "b",
          text: "Stock Trader",
          emoji: "📈",
          isCorrect: false
        },
        {
          id: "a",
          text: "Social Worker or Doctor",
          emoji: "👩‍⚕️",
          isCorrect: true
        },
        {
          id: "c",
          text: "Professional Gamer",
          emoji: "🎮",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Why is it important to consider your passions when choosing a career?",
      options: [
        
        {
          id: "b",
          text: "Passion is irrelevant to career success",
          emoji: "😐",
          isCorrect: false
        },
        {
          id: "c",
          text: "Passion guarantees high income",
          emoji: "💰",
          isCorrect: false
        },
        {
          id: "a",
          text: "Passion leads to greater job satisfaction and motivation",
          emoji: "😊",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "How can you discover your true passions?",
      options: [
       
        {
          id: "b",
          text: "Copy what your friends are passionate about",
          emoji: "👥",
          isCorrect: false
        },
         {
          id: "a",
          text: "Try different activities and reflect on what energizes you",
          emoji: "🔍",
          isCorrect: true
        },
        {
          id: "c",
          text: "Choose based on what seems easiest",
          emoji: "😴",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What should you do if your passion doesn't directly translate to a career?",
      options: [
        {
          id: "a",
          text: "Find ways to incorporate it as a hobby or side interest",
          emoji: "🎨",
          isCorrect: true
        },
        {
          id: "b",
          text: "Completely abandon the passion",
          emoji: "❌",
          isCorrect: false
        },
        {
          id: "c",
          text: "Force it into an unrelated career",
          emoji: "🔨",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can you develop a passion into a career?",
      options: [
        {
          id: "a",
          text: "Gain relevant education, skills, and experience in that field",
          emoji: "📚",
          isCorrect: true
        },
        {
          id: "b",
          text: "Rely only on natural talent without development",
          emoji: "🏆",
          isCorrect: false
        },
        {
          id: "c",
          text: "Expect immediate success without effort",
          emoji: "🚀",
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
    navigate("/student/ehe/teens/debate-one-career-or-many");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Passion Story"
      score={coins}
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      gameId="ehe-teen-5"
      gameType="ehe"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/ehe/teens"
    
      nextGamePathProp="/student/ehe/teens/debate-one-career-or-many"
      nextGameIdProp="ehe-teen-6">
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
                <div className="text-4xl md:text-5xl mb-4">😊</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Passion Pursuer!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand how to align your passions with career choices!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  Great job! You know that careers like social work and medicine suit those who love helping people, passion leads to job satisfaction, discovering passions requires exploration, untranslatable passions can still enrich life, and developing passions into careers requires education and experience!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, aligning your passions with career choices leads to greater fulfillment!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to choose the option that shows the best understanding of passion-based career planning.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PassionStory;