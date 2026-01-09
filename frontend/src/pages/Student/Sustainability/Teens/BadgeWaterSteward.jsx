import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";
import { Droplets, Waves, Shield, Trophy } from "lucide-react";

const BadgeWaterSteward = () => {
  const location = useLocation();
  const gameData = getGameDataById("sustainability-teens-55");
  const gameId = gameData?.id || "sustainability-teens-55";
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
      console.log(`🎮 Badge: Water Steward game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
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
      title: "Water Knowledge",
      question: "What percentage of Earth's water is fresh water?",
      icon: Droplets,
      item: "Water Knowledge",
      options: [
        { id: "b", text: "15%", correct: false, emoji: "🌊", coins: 0 },
        { id: "a", text: "3%", correct: true, emoji: "💧", coins: 1 },
        { id: "c", text: "50%", correct: false, emoji: "💧", coins: 0 },
        { id: "d", text: "75%", correct: false, emoji: "💧", coins: 0 }
      ],
      feedback: { 
        correct: "Correct! Only 3% of Earth's water is fresh water.", 
        wrong: "Only 3% of Earth's water is fresh water, and much of that is frozen in ice caps." 
      }
    },
    {
      id: 2,
      title: "Conservation Methods",
      question: "Which is the most effective daily water conservation method?",
      icon: Droplets,
      item: "Conservation Methods",
      options: [
        { id: "b", text: "Taking longer showers", correct: false, emoji: "🚿", coins: 0 },
        { id: "c", text: "Watering plants at noon", correct: false, emoji: "☀️", coins: 0 },
        { id: "a", text: "Fixing leaky faucets", correct: true, emoji: "🔧", coins: 1 },
        { id: "d", text: "Running half-full washing machine", correct: false, emoji: "👕", coins: 0 }
      ],
      feedback: { 
        correct: "Excellent! Fixing leaks can save hundreds of gallons per year!", 
        wrong: "Fixing leaky faucets is one of the most effective conservation methods." 
      }
    },
    {
      id: 3,
      title: "Water Cycle",
      question: "What are the main stages of the water cycle?",
      icon: Waves,
      item: "Water Cycle",
      options: [
        { id: "a", text: "Evaporation, condensation, precipitation", correct: true, emoji: "☁️", coins: 1 },
        { id: "b", text: "Only evaporation", correct: false, emoji: "💨", coins: 0 },
        { id: "c", text: "Only precipitation", correct: false, emoji: "🌧️", coins: 0 },
        { id: "d", text: "Water storage only", correct: false, emoji: "💧", coins: 0 }
      ],
      feedback: { 
        correct: "Great! The water cycle includes evaporation, condensation, and precipitation!", 
        wrong: "The water cycle consists of evaporation, condensation, and precipitation." 
      }
    },
    {
      id: 4,
      title: "Sustainable Practices",
      question: "What makes someone a Water Steward?",
      icon: Shield,
      item: "Sustainable Practices",
      options: [
        { id: "b", text: "Uses lots of water", correct: false, emoji: "🌊", coins: 0 },
        { id: "c", text: "Ignores water issues", correct: false, emoji: "🤷", coins: 0 },
        { id: "d", text: "Drinks only bottled water", correct: false, emoji: "🥤", coins: 0 },
        { id: "a", text: "Conserves water and educates others", correct: true, emoji: "💧", coins: 1 },
      ],
      feedback: { 
        correct: "Perfect! Water Stewards conserve water and educate others!", 
        wrong: "Water Stewards practice conservation and spread awareness about water issues." 
      }
    },
    {
      id: 5,
      title: "Water Stewardship",
      question: "What is the most important aspect of water stewardship?",
      icon: Trophy,
      item: "Water Stewardship",
      options: [
        { id: "b", text: "Using as much water as possible", correct: false, emoji: "🚰", coins: 0 },
        { id: "a", text: "Conserving, protecting, and managing water", correct: true, emoji: "💧", coins: 1 },
        { id: "c", text: "Avoiding water education", correct: false, emoji: "📚", coins: 0 },
        { id: "d", text: "Ignoring local water issues", correct: false, emoji: "👀", coins: 0 }
      ],
      feedback: { 
        correct: "Wonderful! Water stewardship involves conserving, protecting, and managing water resources!", 
        wrong: "Water stewardship involves conserving, protecting, and managing water resources." 
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
      title="Badge: Water Steward"
      subtitle={!showResult ? `Question ${currentLevel} of 5: Test your water stewardship knowledge!` : "Badge Earned!"}
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
    
      nextGamePathProp="/student/sustainability/teens/forest-conservation-story"
      nextGameIdProp="sustainability-teens-56">
      <div className="text-center text-white space-y-6">
        {!showResult && currentLevelData && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <div className="flex justify-center mb-4">
              <Icon className="w-16 h-16 text-blue-400" />
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

                let buttonClass = "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3";

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
                <div className="text-6xl mb-4">💧</div>
                <h3 className="text-3xl font-bold text-white mb-4">Water Steward Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about water stewardship with {score} correct answers out of 5!
                </p>
                
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🏆 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Water Steward</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Water Conservation Champion</h4>
                    <p className="text-white/90 text-sm">
                      You understand the importance of conserving our water resources.
                    </p>
                  </div>
                  <div className="bg-cyan-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-cyan-300 mb-2">Environmental Leader</h4>
                    <p className="text-white/90 text-sm">
                      You know how to protect and manage water resources sustainably.
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
                  className="bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💧</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Water Stewardship!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of 5.
                </p>
                <p className="text-white/90 mb-6">
                  Review water stewardship topics to strengthen your knowledge and earn your badge.
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

export default BadgeWaterSteward;