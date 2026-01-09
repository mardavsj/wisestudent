import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateBeautyConfidence = () => {
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
      text: "Is physical beauty or character more important for confidence?",
      options: [
        { id: "b", text: "Physical beauty is the key to confidence", correct: false, emoji: "💄" },
        { id: "a", text: "Character builds lasting self-worth", correct: true, emoji: "💎" },
        { id: "c", text: "Both are equally important", correct: false, emoji: "⚖️" }
      ]
    },
    {
      id: 2,
      text: "How does focusing on appearance affect self-esteem?",
      options: [
        { id: "a", text: "Builds strong, lasting confidence", correct: false, emoji: "🏔️" },
        { id: "c", text: "Has no effect on self-perception", correct: false, emoji: "😐" },
        { id: "b", text: "Creates instability and constant comparison", correct: true, emoji: "🌊" }
      ]
    },
    {
      id: 3,
      text: "What role do talents and skills play in confidence?",
      options: [
        { id: "b", text: "They create genuine, earned self-assurance", correct: true, emoji: "🎯" },
        { id: "a", text: "They are less important than looks", correct: false, emoji: "🖼️" },
        { id: "c", text: "They don't contribute to confidence", correct: false, emoji: "❌" },
      ]
    },
    {
      id: 4,
      text: "Why is character more valuable than appearance?",
      options: [
        { id: "a", text: "It changes as frequently as appearance", correct: false, emoji: "🔄" },
        { id: "c", text: "It's less important for relationships", correct: false, emoji: "👥" },
        { id: "b", text: "It's enduring and defines who you are", correct: true, emoji: "⏳" }
      ]
    },
    {
      id: 5,
      text: "How should society value individuals?",
      options: [
        { id: "a", text: "Primarily for their physical appearance", correct: false, emoji: "✨" },
        { id: "c", text: "For their contributions, kindness, and character", correct: true, emoji: "🌟" },
        { id: "b", text: "Equally for appearance and character", correct: false, emoji: "⚖️" },
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
    navigate("/student/health-female/teens/journal-self-respect");
  };

  return (
    <GameShell
      title="Debate: Beauty = Confidence?"
      score={coins}
      subtitle={showResult ? "Debate Complete!" : `Debate ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId="health-female-teen-66"
      gameType="health-female"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/health-female/teens"
    
      nextGamePathProp="/student/health-female/teens/journal-self-respect"
      nextGameIdProp="health-female-teen-67">
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Debate {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">💅</div>
                <h3 className="text-2xl font-bold text-white mb-2">Beauty vs Character Debate</h3>
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
              You understand the true sources of confidence and self-worth!
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
              Remember: True confidence comes from character, talents, and personal growth, not just appearance!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateBeautyConfidence;