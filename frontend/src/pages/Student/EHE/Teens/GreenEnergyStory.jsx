import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GreenEnergyStory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-teen-71";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 1; // 1 coin per correct answer
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5; // Total coins for completing all questions
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A teen sees solar panels. What career works in this field?",
      options: [
        { id: "b", text: "Traditional Energy Worker", correct: false, emoji: "🏭" },
        { id: "a", text: "Renewable Energy Engineer", correct: true, emoji: "🔧" },
        { id: "c", text: "Oil Industry Specialist", correct: false, emoji: "🛢️" }
      ]
    },
    {
      id: 2,
      text: "Why is green energy important for our future?",
      options: [
        { id: "b", text: "Creates more pollution", correct: false, emoji: "☁️" },
        { id: "a", text: "Reduces pollution and climate change", correct: true, emoji: "🌍" },
        { id: "c", text: "Is not important", correct: false, emoji: "❌" }
      ]
    },
    {
      id: 3,
      text: "What skills are needed for careers in renewable energy?",
      options: [
        { id: "b", text: "Just physical strength", correct: false, emoji: "💪" },
        { id: "c", text: "No special skills", correct: false, emoji: "🤷" },
        { id: "a", text: "Science, technology, and environmental knowledge", correct: true, emoji: "🎓" },
      ]
    },
    {
      id: 4,
      text: "How can young people contribute to green energy solutions?",
      options: [
        { id: "b", text: "Ignore environmental issues", correct: false, emoji: "🙈" },
        { id: "a", text: "Study relevant fields and innovate", correct: true, emoji: "💡" },
        { id: "c", text: "Stick to old technologies", correct: false, emoji: "🔄" }
      ]
    },
    {
      id: 5,
      text: "What opportunities exist in the green energy sector?",
      options: [
        { id: "b", text: "Declining industry", correct: false, emoji: "📉" },
        { id: "a", text: "Growing job market and innovation potential", correct: true, emoji: "📈" },
        { id: "c", text: "No opportunities", correct: false, emoji: "❌" }
      ]
    }
  ];

  const handleAnswerSelect = (option) => {
    resetFeedback();
    
    if (option.correct) {
      const newCoins = coins + 1; // Give 1 coin per correct answer instead of coinsPerLevel
      setCoins(newCoins);
      setFinalScore(finalScore + 1);
      showCorrectAnswerFeedback(1, true);
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
      title="Green Energy Story"
      score={coins}
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      gameId="ehe-teen-71"
      gameType="ehe"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/ehe/teens"
    
      nextGamePathProp="/student/ehe/teens/quiz-emerging-careers"
      nextGameIdProp="ehe-teen-72">
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                {questions[currentQuestion].text}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-6">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option)}
                    className="bg-white/5 hover:bg-white/15 backdrop-blur-sm border border-white/10 hover:border-white/30 rounded-xl md:rounded-2xl p-4 text-left transition-all duration-200 text-white hover:text-white"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3 flex-shrink-0">
                        {option.emoji}
                      </span>
                      <span className="font-medium">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20 text-center flex-1 flex flex-col justify-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-4xl md:text-5xl mb-4">🌞</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Green Energy Expert!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand the importance of renewable energy careers!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  Great job! You know that renewable energy engineers work with solar panels, green energy reduces pollution and climate change, careers in this field require science technology and environmental knowledge, young people can contribute by studying relevant fields, and the green energy sector offers growing job opportunities!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, renewable energy is crucial for our planet's future!
                </p>
                <button
                  onClick={() => {
                    setShowResult(false);
                    setCurrentQuestion(0);
                    setCoins(0);
                    setFinalScore(0);
                    resetFeedback();
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to choose the option that shows the best understanding of green energy careers.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GreenEnergyStory;