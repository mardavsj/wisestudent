import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateDoctorFear = () => {
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
      text: "Are doctor visits primarily scary or safe for teens?",
      options: [
        { id: "b", text: "Scary - doctors might deliver bad news", correct: false, emoji: "😨" },
        { id: "a", text: "Safe - doctors help maintain health", correct: true, emoji: "🛡️" },
        { id: "c", text: "Both equally - it depends on the situation", correct: false, emoji: "⚖️" }
      ]
    },
    {
      id: 2,
      text: "What is the main purpose of a doctor's visit?",
      options: [
        { id: "b", text: "To make you anxious about your health", correct: false, emoji: "😰" },
        { id: "c", text: "To spend money on unnecessary tests", correct: false, emoji: "💸" },
        { id: "a", text: "To find problems and keep you healthy", correct: true, emoji: "🔍" }
      ]
    },
    {
      id: 3,
      text: "How can you reduce anxiety about doctor visits?",
      options: [
        { id: "a", text: "Bring a trusted adult for support", correct: true, emoji: "👨‍👩‍👧" },
        { id: "b", text: "Avoid doctors completely", correct: false, emoji: "🏃" },
        { id: "c", text: "Don't tell the doctor about symptoms", correct: false, emoji: "🤐" },
      ]
    },
    {
      id: 4,
      text: "What should you expect during a routine checkup?",
      options: [
        { id: "b", text: "Judgment about your lifestyle choices", correct: false, emoji: "🤨" },
        { id: "a", text: "Professional, respectful care focused on your health", correct: true, emoji: "👩‍⚕️" },
        { id: "c", text: "Painful or uncomfortable procedures", correct: false, emoji: "😣" },
      ]
    },
    {
      id: 5,
      text: "Why is it important to overcome fear of doctors?",
      options: [
        { id: "b", text: "To prove you're brave to friends", correct: false, emoji: "💪" },
        { id: "c", text: "Because doctors insist on it", correct: false, emoji: "😤" },
        { id: "a", text: "To maintain good health throughout life", correct: true, emoji: "🌟" }
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
    navigate("/student/health-female/teens/journal-doctor-visits");
  };

  return (
    <GameShell
      title="Debate: Doctor Fear"
      score={coins}
      subtitle={showResult ? "Debate Complete!" : `Debate ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId="health-female-teen-76"
      gameType="health-female"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/health-female/teens"
    
      nextGamePathProp="/student/health-female/teens/journal-doctor-visits"
      nextGameIdProp="health-female-teen-77">
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Debate {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🏥</div>
                <h3 className="text-2xl font-bold text-white mb-2">Doctor Visits Debate</h3>
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
              You understand the importance of regular doctor visits for maintaining good health!
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
              Remember: Regular doctor visits are essential for maintaining good health throughout your life!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateDoctorFear;