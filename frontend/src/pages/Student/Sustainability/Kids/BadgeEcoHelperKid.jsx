import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Recycle, Leaf, Trash2, TreePine, Earth } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const BadgeEcoHelperKid = () => {
  const location = useLocation();
  const gameId = "sustainability-kids-10";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { showCorrectAnswerFeedback, flashPoints, showAnswerConfetti, resetFeedback } = useGameFeedback();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);

  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    try {
      const games = getSustainabilityKidsGames({});
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
      console.log(`🎮 Badge: Eco Helper Kid game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
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
      title: "Recycling",
      question: "What should you do with a plastic bottle?",
      icon: Recycle,
      item: "Recycling",
      options: [
        { id: "a", text: "Put it in recycling bin", emoji: "♻️", correct: true, coins: 1 },
        { id: "b", text: "Throw it on the ground", emoji: "🗑️", correct: false, coins: 0 },
        { id: "c", text: "Leave it anywhere", emoji: "🌎", correct: false, coins: 0 },
        { id: "d", text: "Burn it", emoji: "🔥", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Excellent! Recycling helps protect our planet!",
        wrong: "Plastic bottles should go in the recycling bin to help our environment!"
      }
    },
    {
      id: 2,
      title: "Composting",
      question: "What should you do with food scraps like banana peels?",
      icon: Leaf,
      item: "Composting",
      options: [
        { id: "a", text: "Throw in trash", emoji: "🗑️", correct: false, coins: 0 },
        { id: "c", text: "Leave on ground", emoji: "🌎", correct: false, coins: 0 },
        { id: "d", text: "Bury it deep", emoji: "🕳️", correct: false, coins: 0 },
        { id: "b", text: "Put in compost bin", emoji: "🍂", correct: true, coins: 1 },
      ],
      feedback: {
        correct: "Perfect! Composting helps create healthy soil!",
        wrong: "Food scraps should go in compost bins to help the earth!"
      }
    },
    {
      id: 3,
      title: "Trash",
      question: "What should you do with broken toys?",
      icon: Trash2,
      item: "Trash",
      options: [
        { id: "c", text: "Put in trash bin", emoji: "🗑️", correct: true, coins: 1 },
        { id: "a", text: "Throw in recycling", emoji: "♻️", correct: false, coins: 0 },
        { id: "b", text: "Leave outside", emoji: "🌎", correct: false, coins: 0 },
        { id: "d", text: "Bury in garden", emoji: "🌱", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Great! Broken items that can't be recycled go in trash!",
        wrong: "Broken toys should go in the trash bin, not recycling!"
      }
    },
    {
      id: 4,
      title: "Nature Care",
      question: "How can you help protect trees?",
      icon: TreePine,
      item: "Nature Care",
      options: [
        { id: "a", text: "Break branches", emoji: "✂️", correct: false, coins: 0 },
        { id: "d", text: "Water them and care for them", emoji: "💧", correct: true, coins: 1 },
        { id: "b", text: "Ignore them", emoji: "😴", correct: false, coins: 0 },
        { id: "c", text: "Pick all flowers", emoji: "🌸", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Amazing! Taking care of trees helps our planet!",
        wrong: "We should water and care for trees to help them grow!"
      }
    },
    {
      id: 5,
      title: "Planet Protection",
      question: "What's the best way to help our planet?",
      icon: Earth,
      item: "Planet Protection",
      options: [
        { id: "b", text: "Throw trash everywhere", emoji: "🗑️", correct: false, coins: 0 },
        { id: "c", text: "Ignore the environment", emoji: "😴", correct: false, coins: 0 },
        { id: "a", text: "Recycle, reduce waste, and care for nature", emoji: "🌍", correct: true, coins: 1 },
        { id: "d", text: "Use more plastic", emoji: "🥤", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Wonderful! You're a true Eco Helper Kid!",
        wrong: "The best way to help is to recycle, reduce waste, and care for nature!"
      }
    }
  ];

  const currentLevelData = levels[currentLevel - 1];
  const Icon = currentLevelData.icon;

  const handleAnswer = (optionIndex) => {
    if (answered) return;
    
    setAnswered(true);
    setSelectedOptionIndex(optionIndex);
    resetFeedback();
    
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

  const finalScore = score;
  const coins = finalScore;

  return (
    <GameShell
      title="Badge: Eco Helper Kid"
      subtitle={!showResult ? `Question ${currentLevel} of 5: Test your eco knowledge!` : "Badge Earned!"}
      currentLevel={currentLevel}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      coins={coins}
      showGameOver={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      score={finalScore}
      gameId={gameId}
      gameType="sustainability"
      maxScore={5}
      showConfetti={showResult && finalScore >= 4}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    
      nextGamePathProp="/student/sustainability/kids/lights-off-story"
      nextGameIdProp="sustainability-kids-11">
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
            {finalScore >= 4 ? (
              <div>
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-4">Eco Helper Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about environmental protection with {finalScore} correct answers out of 5!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Eco Helper Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Recycling Expert</h4>
                    <p className="text-white/90 text-sm">
                      You understand the importance of proper waste sorting.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Planet Protector</h4>
                    <p className="text-white/90 text-sm">
                      You know how to care for our environment.
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
                  className="bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Environmental Protection!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} questions correctly out of 5.
                </p>
                <p className="text-white/90 mb-6">
                  Review environmental topics to strengthen your knowledge and earn your badge.
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

export default BadgeEcoHelperKid;

