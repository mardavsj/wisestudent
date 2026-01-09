import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateLearningEndsCollege = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-teen-96";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = 1; // Set to 1 for +1 coin per correct answer
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Does learning stop after getting a degree?",
      options: [
        { id: "a", text: "No, it continues throughout life", correct: true, emoji: "✅" },
        { id: "b", text: "Yes, completely stops", correct: false, emoji: "❌" },
        { id: "c", text: "Only in certain fields", correct: false, emoji: "⚠️" }
      ]
    },
    {
      id: 2,
      text: "Why is lifelong learning important in today's world?",
      options: [
        { id: "b", text: "Things never change", correct: false, emoji: "⏸️" },
        { id: "a", text: "Rapid changes require constant adaptation", correct: true, emoji: "⚡" },
        { id: "c", text: "Knowledge becomes obsolete slowly", correct: false, emoji: "🐌" }
      ]
    },
    {
      id: 3,
      text: "What is a growth mindset in learning?",
      options: [
        { id: "a", text: "Belief that abilities can be developed", correct: true, emoji: "🌱" },
        { id: "b", text: "Belief that talents are fixed", correct: false, emoji: "🗿" },
        { id: "c", text: "Avoiding challenges", correct: false, emoji: "🛡️" }
      ]
    },
    {
      id: 4,
      text: "How can professionals stay relevant in their careers?",
      options: [
        { id: "b", text: "Rely only on past education", correct: false, emoji: "📚" },
        { id: "a", text: "Continuously update skills and knowledge", correct: true, emoji: "📈" },
        { id: "c", text: "Avoid new technologies", correct: false, emoji: "📵" }
      ]
    },
    {
      id: 5,
      text: "What are benefits of being a lifelong learner?",
      options: [
        { id: "b", text: "Increased stress and pressure", correct: false, emoji: "😫" },
        { id: "c", text: "Less job security", correct: false, emoji: "📉" },
        { id: "a", text: "Better opportunities and personal fulfillment", correct: true, emoji: "🌟" },
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
    navigate("/games/ehe/teens");
  };

  return (
    <GameShell
      title="Debate: Learning Ends After College?"
      score={coins}
      subtitle={showResult ? "Debate Complete!" : `Debate ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId="ehe-teen-96"
      gameType="ehe"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/ehe/teens"
    
      nextGamePathProp="/student/ehe/teens/journal-growth-plans"
      nextGameIdProp="ehe-teen-97">
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Debate {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-white mb-2">Lifelong Learning Debate</h3>
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
                <div className="text-4xl">
                  🏆
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Excellent Debate!
            </h2>
            
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              You understand the importance of lifelong learning and growth mindset!
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
              Remember: Learning is a lifelong journey that continues well beyond college!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateLearningEndsCollege;