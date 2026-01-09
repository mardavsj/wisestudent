import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const StreamChoiceStory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-teen-61";
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
      text: "Teen loves biology. Which higher education path suits her?",
      options: [
        { id: "a", text: "Engineering", correct: false, emoji: "⚙️" },
        { id: "b", text: "Medicine", correct: true, emoji: "⚕️" },
        { id: "c", text: "Arts", correct: false, emoji: "🎨" }
      ]
    },
    {
      id: 2,
      text: "Why is aligning stream choice with interests important?",
      options: [
        { id: "b", text: "Enhances motivation and performance", correct: true, emoji: "📈" },
        { id: "a", text: "Reduces options", correct: false, emoji: "📉" },
        { id: "c", text: "Limits career growth", correct: false, emoji: "🚫" }
      ]
    },
    {
      id: 3,
      text: "What should students consider when choosing streams?",
      options: [
        { id: "a", text: "Peer pressure only", correct: false, emoji: "👥" },
        { id: "b", text: "Interests, strengths, and future goals", correct: true, emoji: "🎯" },
        { id: "c", text: "Parental expectations only", correct: false, emoji: "👨‍👩‍👧" }
      ]
    },
    {
      id: 4,
      text: "What is a benefit of choosing the right stream?",
      options: [
        { id: "a", text: "No benefits", correct: false, emoji: "❌" },
        { id: "c", text: "Reduced opportunities", correct: false, emoji: "📉" },
        { id: "b", text: "Better academic performance", correct: true, emoji: "📚" },
      ]
    },
    {
      id: 5,
      text: "How can students explore different streams?",
      options: [
        { id: "a", text: "Avoid all exploration", correct: false, emoji: "🚫" },
        { id: "b", text: "Subject counseling and trial courses", correct: true, emoji: "🎓" },
        { id: "c", text: "Stick to one option", correct: false, emoji: "🔒" }
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
      title="Stream Choice Story"
      score={coins}
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      gameId="ehe-teen-61"
      gameType="ehe"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/ehe/teens"
    
      nextGamePathProp="/student/ehe/teens/quiz-higher-studies"
      nextGameIdProp="ehe-teen-62">
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
                <div className="text-4xl md:text-5xl mb-4">📘</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Stream Selection Expert!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand how to make informed stream choices!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  Great job! You know that biology-loving teens should pursue medicine, aligning streams with interests enhances motivation, students should consider interests strengths and goals when choosing streams, the right stream leads to better academic performance, and subject counseling helps explore different options!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, choosing the right academic stream is crucial for long-term success!
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
                  Try to choose the option that shows the best understanding of stream selection principles.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default StreamChoiceStory;