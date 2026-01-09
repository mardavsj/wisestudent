import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateTalkingAboutPeriods = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Set to 1 for +1 coin per correct answer
  const coinsPerLevel = 1;
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Should periods be openly discussed in schools?",
      options: [
        {
          id: "b",
          text: "No, it's too private a topic",
          emoji: "🤫",
          correct: false
        },
        {
          id: "a",
          text: "Yes, with respect and education",
          emoji: "🎓",
          correct: true
        },
        {
          id: "c",
          text: "Only in all-girls settings",
          emoji: "👭",
          correct: false
        }
      ]
    },
    {
      id: 2,
      text: "How should period discussions be approached in mixed-gender settings?",
      options: [
        {
          id: "b",
          text: "Avoided completely to prevent embarrassment",
          emoji: "🙈",
          correct: false
        },
        {
          id: "c",
          text: "Only with jokes and casual references",
          emoji: "😂",
          correct: false
        },
        {
          id: "a",
          text: "With scientific accuracy and respect for all",
          emoji: "🔬",
          correct: true
        }
      ]
    },
    {
      id: 3,
      text: "What is the benefit of normalizing period conversations?",
      options: [
        {
          id: "b",
          text: "Makes periods less special and important",
          emoji: "⬇️",
          correct: false
        },
        {
          id: "a",
          text: "Reduces stigma and improves health outcomes",
          emoji: "🌟",
          correct: true
        },
        {
          id: "c",
          text: "Encourages excessive focus on the topic",
          emoji: "📢",
          correct: false
        },
        
      ]
    },
    {
      id: 4,
      text: "How can parents contribute to healthy period discussions?",
      options: [
        {
          id: "a",
          text: "Start age-appropriate conversations early",
          emoji: "👨‍👩‍👧",
          correct: true
        },
        {
          id: "b",
          text: "Wait until puberty begins to mention anything",
          emoji: "⏰",
          correct: false
        },
        {
          id: "c",
          text: "Leave all education to schools entirely",
          emoji: "🏫",
          correct: false
        },
        
      ]
    },
    {
      id: 5,
      text: "What role should media play in period representation?",
      options: [
        {
          id: "b",
          text: "Avoid the topic completely in entertainment",
          emoji: "🔇",
          correct: false
        },
        {
          id: "c",
          text: "Only show periods as comedic or embarrassing",
          emoji: "😂",
          correct: false
        },
        {
          id: "a",
          text: "Accurate, inclusive, and destigmatizing portrayal",
          emoji: "📺",
          correct: true
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
    navigate("/student/health-female/teens/journal-of-awareness");
  };

  return (
    <GameShell
      title="Debate: Talking About Periods"
      score={coins}
      subtitle={showResult ? "Debate Complete!" : `Debate ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId="health-female-teen-36"
      gameType="health-female"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/health-female/teens"
    
      nextGamePathProp="/student/health-female/teens/journal-of-awareness"
      nextGameIdProp="health-female-teen-37">
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Debate {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🌸</div>
                <h3 className="text-2xl font-bold text-white mb-2">Period Discussion Debate</h3>
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
              You understand the importance of open, respectful discussions about periods!
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
              Remember: Normalizing conversations about periods helps reduce stigma and improves health outcomes!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateTalkingAboutPeriods;