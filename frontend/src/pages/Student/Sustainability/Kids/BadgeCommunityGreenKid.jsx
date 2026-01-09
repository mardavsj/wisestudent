import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Trophy, Leaf, Wind, Sun, TreePine } from "lucide-react";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const BadgeCommunityGreenKid = () => {
  const location = useLocation();
  const gameId = "sustainability-kids-95";
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
    // First, try to get from location.state (passed from GameCategoryPage)
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    // Fallback: find next game from game data
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
      console.log(`🎮 Badge Community Green Kid game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId]);

  // Questions for the badge challenge
  const questions = [
    {
      id: 1,
      text: "How can you help your community become more sustainable?",
      options: [
          { id: "b", text: "Use more plastic bags", emoji: "🛍️", isCorrect: false },
          { id: "c", text: "Ignore community events", emoji: "🙈", isCorrect: false },
          { id: "a", text: "Start a neighborhood recycling program", emoji: "♻️", isCorrect: true },
        { id: "d", text: "Drive everywhere", emoji: "🚗", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "What's a good way to encourage neighbors to save energy?",
      options: [
        { id: "a", text: "Share information about energy-saving tips", emoji: "💡", isCorrect: true },
        { id: "b", text: "Leave lights on for safety", emoji: "💡", isCorrect: false },
        { id: "c", text: "Use more electricity", emoji: "⚡", isCorrect: false },
        { id: "d", text: "Don't talk to neighbors", emoji: "🤐", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "How can you help reduce waste in your community?",
      options: [
          { id: "b", text: "Throw away items quickly", emoji: "🗑️", isCorrect: false },
        { id: "c", text: "Buy more things", emoji: "🛒", isCorrect: false },
        { id: "d", text: "Ignore recycling", emoji: "🙈", isCorrect: false },
          { id: "a", text: "Organize a community swap event", emoji: "🔄", isCorrect: true },
      ]
    },
    {
      id: 4,
      text: "What's a good way to build community connections?",
      options: [
          { id: "b", text: "Stay inside all day", emoji: "🏠", isCorrect: false },
          { id: "a", text: "Volunteer for local environmental projects", emoji: "🤝", isCorrect: true },
        { id: "c", text: "Avoid talking to others", emoji: "🤐", isCorrect: false },
        { id: "d", text: "Complain about others", emoji: "🗣️", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "How can you help create a greener neighborhood?",
      options: [
          { id: "b", text: "Litter in public spaces", emoji: "🗑️", isCorrect: false },
          { id: "c", text: "Use more resources", emoji: "⚡", isCorrect: false },
          { id: "a", text: "Start a community garden", emoji: "🌱", isCorrect: true },
        { id: "d", text: "Ignore environmental issues", emoji: "🙈", isCorrect: false }
      ]
    }
  ];

  const currentQuestion = questions[currentLevel - 1];

  const handleAnswer = (option, index) => {
    if (answered) return;
    
    setSelectedAnswer(option.id);
    setSelectedOptionIndex(index);
    setAnswered(true);
    
    if (option.isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setScore(prev => prev + 1);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentLevel < questions.length) {
        setCurrentLevel(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
        setSelectedOptionIndex(null);
        resetFeedback();
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  return (
    <GameShell
      title="Badge: Community Green Kid"
      subtitle={showResult ? "Badge Earned!" : `Question ${currentLevel} of ${questions.length}`}
      currentLevel={currentLevel}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      score={score}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      maxScore={questions.length}
      showConfetti={showResult && score === questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    
      nextGamePathProp="/student/sustainability/kids/future-story"
      nextGameIdProp="sustainability-kids-96">
      {flashPoints}
      {!showResult ? (
        <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentLevel}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <div className="text-6xl mb-4 text-center">🌱</div>
              
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                {currentQuestion.text}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === option.id;
                  const isCorrectOption = option.isCorrect;
                  let buttonClass = "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed";
                  
                  if (answered) {
                    if (isSelected) {
                      buttonClass = isCorrectOption 
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg" 
                        : "bg-gradient-to-r from-red-500 to-rose-600 text-white p-6 rounded-2xl shadow-lg";
                    } else if (isCorrectOption) {
                      buttonClass = "bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg";
                    }
                  }
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => !answered && handleAnswer(option, index)}
                      disabled={answered}
                      className={buttonClass}
                    >
                      <div className="text-4xl mb-3">{option.emoji}</div>
                      <h4 className="font-bold text-base">{option.text}</h4>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          {score === questions.length ? (
            <div className="space-y-6">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-3xl font-bold text-white">Congratulations!</h3>
              <p className="text-xl text-green-400">You earned the Community Green Kid Badge!</p>
              <p className="text-gray-300">
                You answered all {questions.length} questions correctly about helping your community!
              </p>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2">
                <span>+{score} Coins</span>
              </div>
              <p className="text-white/80">
                You're now a certified Community Green Kid! Keep helping your community and protecting the environment!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-2xl font-bold text-white">Keep Going!</h3>
              <p className="text-gray-300">
                You answered {score} out of {questions.length} questions correctly.
              </p>
              <p className="text-yellow-400">
                You earned {score} coins! Keep learning about community sustainability!
              </p>
              <p className="text-white/80">
                You're on your way to becoming a Community Green Kid! Keep helping your community!
              </p>
            </div>
          )}
        </div>
      )}
    </GameShell>
  );
};

export default BadgeCommunityGreenKid;