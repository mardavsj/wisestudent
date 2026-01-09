import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Recycle, Leaf, Trash2, TreePine, Heart } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const BadgeWildlifeFriendKid = () => {
  const location = useLocation();
  const gameId = "sustainability-kids-65";
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
      console.log(`🎮 Badge: Wildlife Friend Kid game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
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
      title: "Wildlife Protection",
      question: "What should you do if you see an injured animal?",
      icon: Heart,
      item: "Wildlife Care",
      options: [
        { id: "b", text: "Leave it alone", emoji: "🚶", correct: false, coins: 0 },
        { id: "c", text: "Ignore it", emoji: "😶", correct: false, coins: 0 },
        { id: "a", text: "Help it safely", emoji: "🛡️", correct: true, coins: 1 },
        { id: "d", text: "Touch it", emoji: "✋", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Excellent! Helping injured animals shows kindness!",
        wrong: "When you see injured animals, it's important to help them safely!"
      }
    },
    {
      id: 2,
      title: "Habitat Conservation",
      question: "How can you help protect animal homes?",
      icon: TreePine,
      item: "Habitat Care",
      options: [
        { id: "b", text: "Litter", emoji: "🗑️", correct: false, coins: 0 },
        { id: "c", text: "Destroy nests", emoji: "❌", correct: false, coins: 0 },
        { id: "d", text: "Make noise", emoji: "🔊", correct: false, coins: 0 },
        { id: "a", text: "Keep nature clean", emoji: "🧹", correct: true, coins: 1 },
      ],
      feedback: {
        correct: "Perfect! Keeping nature clean helps protect animal homes!",
        wrong: "Protecting animal homes means keeping their environment clean and safe!"
      }
    },
    {
      id: 3,
      title: "Wildlife Respect",
      question: "What's the best way to observe wild animals?",
      icon: Leaf,
      item: "Wildlife Respect",
      options: [
        { id: "a", text: "Approach closely", emoji: "🚶", correct: false, coins: 0 },
        { id: "b", text: "Feed them", emoji: "🍎", correct: false, coins: 0 },
        { id: "c", text: "Watch from a distance", emoji: "👀", correct: true, coins: 1 },
        { id: "d", text: "Touch them", emoji: "✋", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Great! Watching from a distance respects animals' space!",
        wrong: "The best way to observe animals is from a distance to not disturb them!"
      }
    },
    {
      id: 4,
      title: "Bee Safety",
      question: "What should you do if a bee lands near you?",
      icon: Recycle, // Using Recycle as placeholder for bee icon
      item: "Bee Safety",
      options: [
        { id: "d", text: "Swat at it", emoji: "✋", correct: false, coins: 0 },
        { id: "a", text: "Stay calm and still", emoji: "🧘", correct: true, coins: 1 },
        { id: "b", text: "Run away", emoji: "🏃", correct: false, coins: 0 },
        { id: "c", text: "Try to catch it", emoji: "✋", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Amazing! Staying calm keeps both you and the bee safe!",
        wrong: "When bees are near, staying calm and still is the safest approach!"
      }
    },
    {
      id: 5,
      title: "Wildlife Conservation",
      question: "Why is it important to protect wildlife?",
      icon: Heart,
      item: "Wildlife Conservation",
      options: [
        { id: "a", text: "They keep nature balanced", emoji: "⚖️", correct: true, coins: 1 },
        { id: "b", text: "They are fun to watch", emoji: "😊", correct: false, coins: 0 },
        { id: "c", text: "They can be pets", emoji: "🐕", correct: false, coins: 0 },
        { id: "d", text: "They make noise", emoji: "🔊", correct: false, coins: 0 }
      ],
      feedback: {
        correct: "Wonderful! Wildlife keeps our ecosystems healthy and balanced!",
        wrong: "Protecting wildlife is important because they help keep nature in balance!"
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
      title="Badge: Wildlife Friend Kid"
      subtitle={!showResult ? `Question ${currentLevel} of 5: Test your wildlife knowledge!` : "Badge Earned!"}
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
    
      nextGamePathProp="/student/sustainability/kids/paper-story"
      nextGameIdProp="sustainability-kids-66">
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
                <h3 className="text-3xl font-bold text-white mb-4">Wildlife Friend Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about wildlife protection with {finalScore} correct answers out of 5!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Wildlife Friend Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Wildlife Expert</h4>
                    <p className="text-white/90 text-sm">
                      You understand the importance of protecting animals.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Nature Protector</h4>
                    <p className="text-white/90 text-sm">
                      You know how to care for our environment and its creatures.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Wildlife Protection!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {finalScore} questions correctly out of 5.
                </p>
                <p className="text-white/90 mb-6">
                  Review wildlife protection topics to strengthen your knowledge and earn your badge.
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

export default BadgeWildlifeFriendKid;