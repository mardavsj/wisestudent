import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateOneCareerOrMany = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Set to 1 for +1 coin per correct answer
  const coinsPerLevel = 1;
  const totalCoins = location.state?.totalCoins || 5;
  const totalXp = location.state?.totalXp || 10;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Should teens pick one career early or explore many options?",
      options: [
        
        {
          id: "b",
          text: "Pick one career early and stick to it",
          emoji: "📌",
          correct: false
        },
        {
          id: "a",
          text: "Explore many options first",
          emoji: "🔍",
          correct: true
        },
        {
          id: "c",
          text: "Let parents decide without input",
          emoji: "👨‍👩‍👧‍👦",
          correct: false
        }
      ]
    },
    {
      id: 2,
      text: "What are the benefits of exploring multiple career options?",
      options: [
        {
          id: "a",
          text: "Discover diverse interests and find the best fit",
          emoji: "🌟",
          correct: true
        },
        {
          id: "b",
          text: "Confuse yourself with too many choices",
          emoji: "😵",
          correct: false
        },
        {
          id: "c",
          text: "Delay inevitable specialization",
          emoji: "⏰",
          correct: false
        }
      ]
    },
    {
      id: 3,
      text: "How does early career exploration benefit long-term success?",
      options: [
        
        {
          id: "b",
          text: "Wastes time that could be spent specializing",
          emoji: "⏳",
          correct: false
        },
        {
          id: "a",
          text: "Builds broader skills and informed decision-making",
          emoji: "🧠",
          correct: true
        },
        {
          id: "c",
          text: "Creates unnecessary pressure to succeed",
          emoji: "😰",
          correct: false
        }
      ]
    },
    {
      id: 4,
      text: "What's a balanced approach to career exploration?",
      options: [
        
        {
          id: "b",
          text: "Randomly switch jobs without reflection",
          emoji: "🔄",
          correct: false
        },
        {
          id: "c",
          text: "Avoid all career-related activities until college",
          emoji: "🚫",
          correct: false
        },
        {
          id: "a",
          text: "Try different internships, courses, and volunteer work",
          emoji: "📚",
          correct: true
        },
      ]
    },
    {
      id: 5,
      text: "How can teens effectively explore career options?",
      options: [
        {
          id: "a",
          text: "Talk to professionals, job shadow, and take relevant courses",
          emoji: "👥",
          correct: true
        },
        {
          id: "b",
          text: "Only read about careers online",
          emoji: "💻",
          correct: false
        },
        {
          id: "c",
          text: "Copy whatever their best friend chooses",
          emoji: "👯",
          correct: false
        }
      ]
    }
  ];

  const handleAnswerSelect = (option) => {
    resetFeedback();
    
    if (option.correct) {
      const newCoins = coins + 1; // Award 1 coin per correct answer
      setCoins(newCoins);
      setFinalScore(finalScore + 1);
      showCorrectAnswerFeedback(1, true); // Show feedback for 1 point
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/student/ehe/teens/journal-of-career-choice");
  };

  return (
    <GameShell
      title="Debate: One Career or Many?"
      score={coins}
      subtitle={showResult ? "Debate Complete!" : `Debate ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId="ehe-teen-6"
      gameType="ehe"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/ehe/teens"
    
      nextGamePathProp="/student/ehe/teens/journal-of-career-choice"
      nextGameIdProp="ehe-teen-7">
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Debate {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🎭</div>
                <h3 className="text-2xl font-bold text-white mb-2">Career Exploration Debate</h3>
              </div>

              <p className="text-white text-lg mb-6">
                {questions[currentQuestion].text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-6">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option)}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-4">{option.emoji}</div>
                      <div>
                        <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="inline-block p-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 mb-6">
              <div className="bg-white p-2 rounded-full">
                <div className="text-4xl">🏆</div>
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Excellent Debate!
            </h2>
            
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              You understand the importance of exploring career options!
            </p>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 border border-white/20 max-w-md mx-auto mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Your Score</span>
                <span className="text-xl font-bold text-yellow-400">{finalScore}/{questions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/80">Coins Earned</span>
                <span className="text-xl font-bold text-yellow-400">{coins}</span>
              </div>
            </div>
            
            <p className="text-white/80 max-w-2xl mx-auto">
              Remember: Career exploration helps you discover your passions and find the right path!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateOneCareerOrMany;