import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebatePeriodHygieneSchools = () => {
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
      text: "Should schools teach period hygiene openly?",
      options: [
        { id: "b", text: "No, it's a private family matter", correct: false, emoji: "🔒" },
        { id: "a", text: "Yes, with respect and scientific accuracy", correct: true, emoji: "✅" },
        { id: "c", text: "Only to female students", correct: false, emoji: "🚺" }
      ]
    },
    {
      id: 2,
      text: "How should schools handle period hygiene education?",
      options: [
        { id: "b", text: "Only through female teachers", correct: false, emoji: "👩‍🏫" },
        { id: "c", text: "Avoid the topic completely", correct: false, emoji: "🤫" },
        { id: "a", text: "Include all genders with scientific facts", correct: true, emoji: "📚" }
      ]
    },
    {
      id: 3,
      text: "Should schools provide period products?",
      options: [
        { id: "a", text: "Yes, ensure all students have access", correct: true, emoji: "🩹" },
        { id: "b", text: "No, families should provide them", correct: false, emoji: "🏠" },
        { id: "c", text: "Only for wealthy students", correct: false, emoji: "💰" },
      ]
    },
    {
      id: 4,
      text: "How can schools create a supportive environment?",
      options: [
        { id: "b", text: "Public announcements about periods", correct: false, emoji: "📢" },
        { id: "c", text: "Ignore period-related absences", correct: false, emoji: "❌" },
        { id: "a", text: "Private spaces and understanding policies", correct: true, emoji: "🚪" }
      ]
    },
    {
      id: 5,
      text: "What's the benefit of inclusive period education?",
      options: [
        { id: "b", text: "Creates unnecessary attention to the topic", correct: false, emoji: "📢" },
        { id: "a", text: "Reduces stigma and improves health outcomes", correct: true, emoji: "🌟" },
        { id: "c", text: "Only benefits female students", correct: false, emoji: "🚺" },
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
    navigate("/student/health-female/teens/journal-teen-hygiene");
  };

  return (
    <GameShell
      title="Debate: Period Hygiene in Schools"
      score={coins}
      subtitle={showResult ? "Debate Complete!" : `Debate ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId="health-female-teen-46"
      gameType="health-female"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/health-female/teens"
    
      nextGamePathProp="/student/health-female/teens/journal-teen-hygiene"
      nextGameIdProp="health-female-teen-47">
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
                <h3 className="text-2xl font-bold text-white mb-2">Period Hygiene Debate</h3>
              </div>

              <p className="text-white text-lg mb-6">
                {questions[currentQuestion].text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-6">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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
              You understand the importance of period hygiene education in schools!
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
              Remember: Proper period hygiene education helps create inclusive and supportive school environments!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebatePeriodHygieneSchools;