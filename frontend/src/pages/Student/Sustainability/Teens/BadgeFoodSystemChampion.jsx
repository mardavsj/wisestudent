import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";
import { Globe, Sun, Leaf, Trophy, TreePine } from "lucide-react";

const BadgeFoodSystemChampion = () => {
  const location = useLocation();
  const gameData = getGameDataById("sustainability-teens-85");
  const gameId = gameData?.id || "sustainability-teens-85";
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { showCorrectAnswerFeedback, flashPoints, showAnswerConfetti, resetFeedback } = useGameFeedback();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    try {
      const games = getSustainabilityTeenGames({});
      const currentGame = games.find(g => g.id === gameId);
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : null,
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    return { nextGamePath: null, nextGameId: null };
  }, [location.state, gameId]);

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Badge: Food System Champion game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId]);

  const levels = [
    {
      id: 1,
      title: "Food System Knowledge",
      question: "What is the main benefit of sustainable food systems?",
      icon: Globe,
      item: "Food System Knowledge",
      options: [
        { id: "b", text: "Higher costs", correct: false, emoji: "💸", coins: 0 },
        { id: "a", text: "Reduced environmental impact", correct: true, emoji: "🌍", coins: 1 },
        { id: "c", text: "Less variety", correct: false, emoji: "🥬", coins: 0 },
        { id: "d", text: "More waste", correct: false, emoji: "🗑️", coins: 0 }
      ],
      feedback: { 
        correct: "Correct! Sustainable systems reduce environmental harm.", 
        wrong: "Sustainable food systems focus on reducing environmental impact while providing nutritious food." 
      }
    },
    {
      id: 2,
      title: "Local Agriculture",
      question: "Why is supporting local agriculture important?",
      icon: TreePine,
      item: "Local Agriculture",
      options: [
        { id: "a", text: "Reduces transportation emissions", correct: true, emoji: "🌱", coins: 1 },
        { id: "b", text: "Always cheaper", correct: false, emoji: "💰", coins: 0 },
        { id: "c", text: "Less nutritious", correct: false, emoji: "🥬", coins: 0 },
        { id: "d", text: "More packaging", correct: false, emoji: "📦", coins: 0 }
      ],
      feedback: { 
        correct: "Excellent! Local food reduces transport emissions!", 
        wrong: "Local agriculture reduces the distance food travels, cutting emissions and supporting the local economy." 
      }
    },
    {
      id: 3,
      title: "Food Waste",
      question: "How can food waste be reduced?",
      icon: Leaf,
      item: "Food Waste",
      options: [
        { id: "b", text: "Buy more than needed", correct: false, emoji: "🛒", coins: 0 },
        { id: "c", text: "Ignore expiration dates", correct: false, emoji: "📅", coins: 0 },
        { id: "a", text: "Plan meals in advance", correct: true, emoji: "📝", coins: 1 },
        { id: "d", text: "Cook large portions", correct: false, emoji: "🍽️", coins: 0 }
      ],
      feedback: { 
        correct: "Great! Planning meals reduces waste!", 
        wrong: "Planning meals helps buy only what's needed and reduces food waste." 
      }
    },
    {
      id: 4,
      title: "Sustainable Farming",
      question: "What is a principle of sustainable farming?",
      icon: Sun,
      item: "Sustainable Farming",
      options: [
        { id: "b", text: "Monoculture farming", correct: false, emoji: "🌾", coins: 0 },
        { id: "c", text: "Heavy pesticide use", correct: false, emoji: "🧪", coins: 0 },
        { id: "d", text: "Over-irrigation", correct: false, emoji: "💧", coins: 0 },
        { id: "a", text: "Crop rotation and biodiversity", correct: true, emoji: "🔄", coins: 1 },
      ],
      feedback: { 
        correct: "Perfect! Crop rotation maintains soil health!", 
        wrong: "Sustainable farming uses practices like crop rotation and biodiversity to maintain soil health." 
      }
    },
    {
      id: 5,
      title: "Food Ethics",
      question: "What makes you a Food System Champion?",
      icon: Trophy,
      item: "Food Ethics",
      options: [
        { id: "a", text: "Making sustainable choices", correct: true, emoji: "🌱", coins: 1 },
        { id: "b", text: "Choosing convenience only", correct: false, emoji: "⏱️", coins: 0 },
        { id: "c", text: "Ignoring food sources", correct: false, emoji: "❓", coins: 0 },
        { id: "d", text: "Wasting food regularly", correct: false, emoji: "🗑️", coins: 0 }
      ],
      feedback: { 
        correct: "Wonderful! You're a true Food System Champion!", 
        wrong: "Food System Champions make conscious choices considering environmental, social, and health impacts." 
      }
    }
  ];

  const handleAnswer = (optionIndex) => {
    if (answered) return;

    setAnswered(true);
    setSelectedOptionIndex(optionIndex);
    resetFeedback();

    const currentLevelData = levels[currentLevel - 1];
    const selectedOption = currentLevelData.options[optionIndex];
    const isCorrect = selectedOption.correct;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    const isLastQuestion = currentLevel === 5;

    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
        if (score + (isCorrect ? 1 : 0) >= 4) {
          showAnswerConfetti();
        }
      } else {
        setCurrentLevel(prev => prev + 1);
        setAnswered(false);
        setSelectedOptionIndex(null);
      }
    }, 2000);
  };

  const currentLevelData = levels[currentLevel - 1];
  const Icon = currentLevelData?.icon;

  return (
    <GameShell
      title="Badge: Food System Champion"
      subtitle={!showResult ? `Question ${currentLevel} of 5: Test your food system knowledge!` : "Badge Earned!"}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      coins={score}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={score}
      gameId={gameId}
      gameType="sustainability"
      maxScore={5}
      showConfetti={showResult && score >= 4}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    
      nextGamePathProp="/student/sustainability/teens/eco-innovation-story"
      nextGameIdProp="sustainability-teens-86">
      <div className="text-center text-white space-y-6">
        {!showResult && currentLevelData && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <div className="flex justify-center mb-4">
              <Icon className="w-16 h-16 text-green-400" />
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Question {currentLevel} of 5</span>
              <span className="text-yellow-400 font-bold">Score: {score}/5</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">{currentLevelData.title}</h3>
            <p className="text-white text-lg mb-6 text-center">
              {currentLevelData.question}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentLevelData.options.map((option, idx) => {
                const isSelected = selectedOptionIndex === idx;
                const showFeedback = answered;

                let buttonClass = "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3";

                if (showFeedback) {
                  if (isSelected) {
                    buttonClass = option.correct
                      ? "bg-green-500 ring-4 ring-green-300 text-white p-6 rounded-2xl shadow-lg min-h-[60px] flex items-center justify-center gap-3"
                      : "bg-red-500 ring-4 ring-red-300 text-white p-6 rounded-2xl shadow-lg min-h-[60px] flex items-center justify-center gap-3";
                  } else {
                    buttonClass = "bg-white/10 opacity-50 text-white p-6 rounded-2xl shadow-lg min-h-[60px] flex items-center justify-center gap-3";
                  }
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(idx)}
                    disabled={showFeedback}
                    className={buttonClass}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="font-bold text-lg">{option.text}</span>
                  </button>
                );
              })}
            </div>
            {answered && selectedOptionIndex !== null && (
              <div className={`mt-4 p-4 rounded-xl ${
                currentLevelData.options[selectedOptionIndex].correct
                  ? 'bg-green-500/20 border border-green-500/30'
                  : 'bg-red-500/20 border border-red-500/30'
              }`}>
                <p className="text-white font-semibold">
                  {currentLevelData.options[selectedOptionIndex].correct
                    ? currentLevelData.feedback.correct
                    : currentLevelData.feedback.wrong}
                </p>
              </div>
            )}
          </div>
        )}
        {showResult && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 4 ? (
              <div>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-4">Food System Champion Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about sustainable food systems with {score} correct answers out of 5!
                </p>
                
                <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Food System Champion</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Sustainable Expert</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to support sustainable food systems.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Ethical Consumer</h4>
                    <p className="text-white/90 text-sm">
                      You know how to make responsible food choices.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    // Let GameShell handle navigation via GameOverModal
                    if (window.history && window.history.replaceState) {
                      const currentState = window.history.state || {};
                      window.history.replaceState({
                        ...currentState,
                        nextGamePath: nextGamePath,
                        nextGameId: nextGameId
                      }, '');
                    }
                  }}
                  className="bg-gradient-to-br from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Food Systems!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of 5.
                </p>
                <p className="text-white/90 mb-6">
                  Review sustainable food topics to strengthen your knowledge and earn your badge.
                </p>
                <button
                  onClick={() => {
                    setCurrentLevel(1);
                    setScore(0);
                    setAnswered(false);
                    setSelectedOptionIndex(null);
                    setShowResult(false);
                    resetFeedback();
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeFoodSystemChampion;