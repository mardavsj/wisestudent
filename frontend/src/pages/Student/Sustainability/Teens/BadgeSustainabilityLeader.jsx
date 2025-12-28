import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Earth, Globe, Leaf, TreePine, Heart, Trophy } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const BadgeSustainabilityLeader = () => {
  const location = useLocation();
  const gameId = "sustainability-teens-25";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { showCorrectAnswerFeedback, flashPoints, showAnswerConfetti, resetFeedback } = useGameFeedback();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [showResult, setShowResult] = useState(false);

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

  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Badge: Sustainability Leader game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
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
      title: "Biodiversity Conservation",
      question: "How can you help conserve biodiversity?",
      icon: Globe,
      item: "Biodiversity Conservation",
      options: [
        { id: "a", text: "Destroy habitats for development", emoji: "🏗️", correct: false, coins: 0 },
        { id: "b", text: "Protect natural habitats and ecosystems", emoji: "🌳", correct: true, coins: 1 },
        { id: "c", text: "Ignore conservation efforts", emoji: "🙈", correct: false, coins: 0 },
        { id: "d", text: "Introduce invasive species", emoji: "🦝", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Excellent! Protecting habitats preserves species!",
        wrong: "We should protect natural habitats to conserve biodiversity!"
      }
    },
    {
      id: 2,
      title: "Sustainable Agriculture",
      question: "What makes agriculture sustainable?",
      icon: Leaf,
      item: "Sustainable Agriculture",
      options: [
        { id: "a", text: "Excessive chemical use", emoji: "🧪", correct: false, coins: 0 },
        { id: "b", text: "Ignoring environmental impact", emoji: "😕", correct: false, coins: 0 },
        { id: "c", text: "Monoculture farming only", emoji: "🌽", correct: false, coins: 0 },
        { id: "d", text: "Organic methods and soil health", emoji: "🌱", correct: true, coins: 1 }
      ],
      feedback: {
        correct: "Perfect! Sustainable agriculture protects the environment!",
        wrong: "Sustainable agriculture uses organic methods and maintains soil health!"
      }
    },
    {
      id: 3,
      title: "Ocean Protection",
      question: "How can you protect marine ecosystems?",
      icon: TreePine,
      item: "Ocean Protection",
      options: [
        { id: "a", text: "Pollute oceans", emoji: "🗑️", correct: false, coins: 0 },
        { id: "b", text: "Ignore marine life", emoji: "🙉", correct: false, coins: 0 },
        { id: "c", text: "Support marine protected areas", emoji: "🐠", correct: true, coins: 1 },
        { id: "d", text: "Overfish endangered species", emoji: "🎣", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Great! Protecting oceans helps marine life thrive!",
        wrong: "We should reduce plastic and support marine conservation!"
      }
    },
    {
      id: 4,
      title: "Community Leadership",
      question: "What makes a sustainability leader?",
      icon: Heart,
      item: "Community Leadership",
      options: [
        { id: "a", text: "Work alone", emoji: "👤", correct: false, coins: 0 },
        { id: "b", text: "Ignore community needs", emoji: "🔇", correct: false, coins: 0 },
        { id: "c", text: "Inspire others and lead by example", emoji: "🌟", correct: true, coins: 1 },
        { id: "d", text: "Make decisions without consultation", emoji: "🚫", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Amazing! Leaders inspire and guide others!",
        wrong: "Sustainability leaders inspire others and lead by example!"
      }
    },
    {
      id: 5,
      title: "Sustainability Leader",
      question: "What makes you a Sustainability Leader?",
      icon: Earth,
      item: "Sustainability Leader",
      options: [
        { id: "a", text: "Ignore sustainability", emoji: "😕", correct: false, coins: 0 },
        { id: "b", text: "Work against environmental goals", emoji: "🔥", correct: false, coins: 0 },
        { id: "c", text: "Focus only on profits", emoji: "💰", correct: false, coins: 0 },
        { id: "d", text: "Master all sustainability challenges and lead change", emoji: "🌍", correct: true, coins: 1 }
      ],
      feedback: {
        correct: "Wonderful! You're a true Sustainability Leader!",
        wrong: "Sustainability Leaders master challenges and lead positive change!"
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

  const finalScore = score;
  const coins = finalScore;

  return (
    <GameShell
      title="Badge: Sustainability Leader"
      subtitle={!showResult ? `Question ${currentLevel} of 5: Master all sustainability challenges!` : "Badge Earned!"}
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
    >
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
                levels[currentLevel - 1].options[selectedOptionIndex].correct
                  ? 'bg-green-500/20 border border-green-500/30'
                  : 'bg-red-500/20 border border-red-500/30'
              }`}>
                <p className="text-white font-semibold">
                  {levels[currentLevel - 1].options[selectedOptionIndex].correct
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
                <h3 className="text-3xl font-bold text-white mb-4">Sustainability Leader Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about sustainability leadership with {score} correct answers out of 5!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Sustainability Leader</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Nature Protector</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to protect biodiversity and ecosystems.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Community Leader</h4>
                    <p className="text-white/90 text-sm">
                      You know how to inspire others toward sustainability.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Sustainability Leadership!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of 5.
                </p>
                <p className="text-white/90 mb-6">
                  Review sustainability topics to strengthen your knowledge and earn your badge.
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

export default BadgeSustainabilityLeader;

