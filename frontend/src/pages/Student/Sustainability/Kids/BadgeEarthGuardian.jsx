import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Earth, Leaf, Recycle, TreePine, Heart, Globe } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const BadgeEarthGuardian = () => {
  const location = useLocation();
  const gameId = "sustainability-kids-25";
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

  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Badge: Earth Guardian game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
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
      title: "Ocean Protection",
      question: "How can you protect the ocean?",
      icon: Globe,
      item: "Ocean Protection",
      options: [
        { id: "c", text: "Reduce plastic use and clean beaches", emoji: "🌊", correct: true, coins: 1 },
        { id: "a", text: "Throw trash in ocean", emoji: "🗑️", correct: false, coins: 0 },
        { id: "b", text: "Ignore ocean pollution", emoji: "🙈", correct: false, coins: 0 },
        { id: "d", text: "Dump chemicals in water", emoji: "🧪", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Excellent! Protecting oceans helps marine life!",
        wrong: "We should reduce plastic and clean beaches to protect oceans!"
      }
    },
    {
      id: 2,
      title: "Wildlife Care",
      question: "How can you help protect wildlife?",
      icon: Heart,
      item: "Wildlife Care",
      options: [
        { id: "a", text: "Harm animal homes", emoji: "🏚️", correct: false, coins: 0 },
        { id: "b", text: "Ignore wildlife", emoji: "🙉", correct: false, coins: 0 },
        { id: "c", text: "Feed wild animals", emoji: "🍖", correct: false, coins: 0 },
        { id: "d", text: "Protect habitats and plant trees", emoji: "🌳", correct: true, coins: 1 }
      ],
      feedback: {
        correct: "Perfect! Protecting habitats helps animals thrive!",
        wrong: "We should protect habitats and plant trees for wildlife!"
      }
    },
    {
      id: 3,
      title: "Clean Air",
      question: "What helps keep air clean?",
      icon: Leaf,
      item: "Clean Air",
      options: [
        { id: "a", text: "Use cars everywhere", emoji: "🚗", correct: false, coins: 0 },
        { id: "c", text: "Walk, bike, and plant trees", emoji: "🍃", correct: true, coins: 1 },
        { id: "b", text: "Pollute the air", emoji: "🏭", correct: false, coins: 0 },
        { id: "d", text: "Burn fossil fuels", emoji: "⛽", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Great! Walking, biking, and trees keep air clean!",
        wrong: "We should walk, bike, and plant trees to keep air clean!"
      }
    },
    {
      id: 4,
      title: "Green Transportation",
      question: "What's the best way to travel?",
      icon: TreePine,
      item: "Green Transportation",
      options: [
        { id: "a", text: "Always use cars", emoji: "🚙", correct: false, coins: 0 },
        { id: "b", text: "Waste fuel", emoji: "🛢️", correct: false, coins: 0 },
        { id: "c", text: "Fly everywhere", emoji: "✈️", correct: false, coins: 0 },
        { id: "d", text: "Walk, bike, or use public transport", emoji: "🚲", correct: true, coins: 1 }
      ],
      feedback: {
        correct: "Amazing! Green transportation helps our planet!",
        wrong: "Walking, biking, and public transport are better for Earth!"
      }
    },
    {
      id: 5,
      title: "Earth Guardian",
      question: "What makes you an Earth Guardian?",
      icon: Earth,
      item: "Earth Guardian",
      options: [
        { id: "a", text: "Harm the environment", emoji: "🧨", correct: false, coins: 0 },
        { id: "b", text: "Ignore Earth's problems", emoji: "😑", correct: false, coins: 0 },
        { id: "c", text: "Protect oceans, wildlife, air, and use green transport", emoji: "🌍", correct: true, coins: 1 },
        { id: "d", text: "Litter everywhere", emoji: "🗑️", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Wonderful! You're a true Earth Guardian!",
        wrong: "Earth Guardians protect oceans, wildlife, air, and use green transport!"
      }
    }
  ];

  const currentLevelData = levels[currentLevel - 1];
  const Icon = currentLevelData.icon;

  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);

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
      title="Badge: Earth Guardian"
      subtitle={!showResult ? `Question ${currentLevel} of 5: Master all eco-challenges!` : "Badge Earned!"}
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
    
      nextGamePathProp="/student/sustainability/kids/water-bottle-story"
      nextGameIdProp="sustainability-kids-26">
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
                <h3 className="text-3xl font-bold text-white mb-4">Earth Guardian Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about environmental protection with {score} correct answers out of 5!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Earth Guardian</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Ocean Protector</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to protect our oceans and marine life.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Planet Hero</h4>
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
                  You answered {score} questions correctly out of 5.
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

export default BadgeEarthGuardian;

