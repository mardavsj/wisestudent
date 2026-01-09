import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateDegreeOrSkill = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-teen-56";
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
      text: "Which is more important for career success - degree or skill?",
      options: [
        { id: "a", text: "Degree alone is enough", correct: false, emoji: "📜" },
        { id: "b", text: "Skills with degree are best", correct: true, emoji: "⚖️" },
        { id: "c", text: "Skills alone are enough", correct: false, emoji: "🔧" }
      ]
    },
    {
      id: 2,
      text: "Why are both degrees and skills important in today's job market?",
      options: [
        { id: "b", text: "Degrees show commitment, skills show capability", correct: true, emoji: "✅" },
        { id: "a", text: "Only degrees matter", correct: false, emoji: "❌" },
        { id: "c", text: "Only skills matter", correct: false, emoji: "⚠️" }
      ]
    },
    {
      id: 3,
      text: "How can someone develop skills while pursuing a degree?",
      options: [
        { id: "a", text: "Just attend lectures", correct: false, emoji: "👂" },
        { id: "c", text: "Avoid practical work", correct: false, emoji: "🚫" },
        { id: "b", text: "Internships, projects, and practical experience", correct: true, emoji: "💼" },
      ]
    },
    {
      id: 4,
      text: "What happens to professionals who stop developing skills?",
      options: [
        { id: "b", text: "Become less competitive over time", correct: true, emoji: "📉" },
        { id: "a", text: "Automatically succeed", correct: false, emoji: "🎉" },
        { id: "c", text: "Remain equally competitive", correct: false, emoji: "⏸️" }
      ]
    },
    {
      id: 5,
      text: "How can continuous skill development benefit career growth?",
      options: [
        { id: "a", text: "Limits career options", correct: false, emoji: "❌" },
        { id: "b", text: "Opens new opportunities and increases value", correct: true, emoji: "🚀" },
        { id: "c", text: "Makes no difference", correct: false, emoji: "⌀" }
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
      title="Debate: Degree or Skill?"
      score={coins}
      subtitle={showResult ? "Debate Complete!" : `Debate ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId="ehe-teen-56"
      gameType="ehe"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/ehe/teens"
    
      nextGamePathProp="/student/ehe/teens/journal-teen-paths"
      nextGameIdProp="ehe-teen-57">
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Debate {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🎓</div>
                <h3 className="text-2xl font-bold text-white mb-2">Degree vs Skill Debate</h3>
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
              You understand the balance between degrees and skills for career success!
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
              Remember: Both degrees and skills are important for career success - they complement each other!
            </p>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateDegreeOrSkill;