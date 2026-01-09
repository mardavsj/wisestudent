import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HygieneConfidenceDebate = () => {
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
      text: "Should teens practice daily hygiene for confidence?",
      options: [
        {
          id: "b",
          text: "No, hygiene doesn't matter",
          emoji: "👎",
          correct: false
        },
        {
          id: "a",
          text: "Yes, daily hygiene builds confidence",
          emoji: "👍",
          correct: true
        },
        {
          id: "c",
          text: "Only for special occasions",
          emoji: "🎭",
          correct: false
        }
      ]
    },
    {
      id: 2,
      text: "What happens when teens have poor hygiene?",
      options: [
        {
          id: "a",
          text: "Nothing changes",
          emoji: "😊",
          correct: false
        },
        {
          id: "c",
          text: "More friends",
          emoji: "👥",
          correct: false
        },
        {
          id: "b",
          text: "Lower self-confidence",
          emoji: "😔",
          correct: true
        }
      ]
    },
    {
      id: 3,
      text: "How does daily hygiene help teen confidence?",
      options: [
        {
          id: "c",
          text: "Feel fresh and ready for anything",
          emoji: "✨",
          correct: true
        },
        {
          id: "a",
          text: "Makes no difference",
          emoji: "😐",
          correct: false
        },
        {
          id: "b",
          text: "Only helps appearance",
          emoji: "💅",
          correct: false
        },
        
      ]
    },
    {
      id: 4,
      text: "How does good hygiene affect social interactions?",
      options: [
        {
          id: "a",
          text: "Doesn't affect how people treat you",
          emoji: "😕",
          correct: false
        },
        {
          id: "b",
          text: "Makes others comfortable around you",
          emoji: "🤝",
          correct: true
        },
        {
          id: "c",
          text: "Only matters for dating",
          emoji: "💕",
          correct: false
        },
        
      ]
    },
    {
      id: 5,
      text: "What's the long-term benefit of teen hygiene habits?",
      options: [
        {
          id: "a",
          text: "Only temporary benefit",
          emoji: "⏰",
          correct: false
        },
        {
          id: "b",
          text: "No lasting impact",
          emoji: "🤷",
          correct: false
        },
        {
          id: "c",
          text: "Builds lifelong confidence and health",
          emoji: "🌟",
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
    navigate("/student/health-female/teens/self-care-journal");
  };

  return (
    <GameShell
      title="Debate: Hygiene = Confidence?"
      score={coins}
      subtitle={showResult ? "Debate Complete!" : `Debate ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId="health-female-teen-6"
      gameType="health-female"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/health-female/teens"
    
      nextGamePathProp="/student/health-female/teens/self-care-journal"
      nextGameIdProp="health-female-teen-7">
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
                <h3 className="text-2xl font-bold text-white mb-2">Hygiene Confidence Debate</h3>
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
              You understand how good hygiene builds confidence and positive social interactions!
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
              Remember: Good hygiene habits boost confidence and contribute to lifelong health!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HygieneConfidenceDebate;