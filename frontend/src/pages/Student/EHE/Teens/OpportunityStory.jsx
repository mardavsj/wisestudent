import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const OpportunityStory = () => {
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
      text: "A teen notices friends need healthy snacks at school. Should she start a snack stall?",
      options: [
        
        {
          id: "b",
          text: "No, someone else will do it",
          emoji: "❌",
          isCorrect: false
        },
        {
          id: "a",
          text: "Yes, identify the need and create a solution",
          emoji: "✅",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore the need completely",
          emoji: "🙈",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's the first step in starting a snack stall business?",
      options: [
       
        {
          id: "b",
          text: "Start buying snacks without any planning",
          emoji: "🛒",
          isCorrect: false
        },
        {
          id: "c",
          text: "Complain about the lack of snacks",
          emoji: "😠",
          isCorrect: false
        },
         {
          id: "a",
          text: "Research what snacks are popular and allowed",
          emoji: "🔍",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "How should the teen fund her snack stall?",
      options: [
        {
          id: "a",
          text: "Save money, ask family for support, or find investors",
          emoji: "💰",
          isCorrect: true
        },
        {
          id: "b",
          text: "Spend all her savings immediately",
          emoji: "💸",
          isCorrect: false
        },
        {
          id: "c",
          text: "Expect others to fund it without effort",
          emoji: "🤔",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What's important for running a successful snack stall?",
      options: [
        
        {
          id: "b",
          text: "Highest prices to maximize profit",
          emoji: "💸",
          isCorrect: false
        },
        {
          id: "a",
          text: "Quality products, fair prices, and good customer service",
          emoji: "🌟",
          isCorrect: true
        },
        {
          id: "c",
          text: "Selling anything without quality control",
          emoji: "🤢",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "How can this experience help the teen in the future?",
      options: [
        {
          id: "a",
          text: "Develop business skills and confidence",
          emoji: "📈",
          isCorrect: true
        },
        {
          id: "b",
          text: "Make her never try anything again",
          emoji: "😰",
          isCorrect: false
        },
        {
          id: "c",
          text: "Prove she's only good at selling snacks",
          emoji: "🥜",
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
    navigate("/student/ehe/teens/quiz-entrepreneur-traits");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Opportunity Story"
      score={coins}
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      gameId="ehe-teen-11"
      gameType="ehe"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/ehe/teens"
    
      nextGamePathProp="/student/ehe/teens/quiz-entrepreneur-traits"
      nextGameIdProp="ehe-teen-12">
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
                <div className="text-4xl md:text-5xl mb-4">📈</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Opportunity Recognizer!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand how to identify and capitalize on business opportunities!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  Great job! You know that entrepreneurs identify community needs and create solutions, research is essential before starting a business, multiple funding sources reduce risk, quality products and service build customer loyalty, and early entrepreneurial experiences develop valuable life skills!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, recognizing opportunities and taking calculated risks are key entrepreneurial skills!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to choose the option that shows the best understanding of entrepreneurial thinking.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default OpportunityStory;