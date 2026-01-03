import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getBrainKidsGames } from "../../../../pages/Games/GameCategories/Brain/kidGamesData";

const ExamStori = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-65");
  const gameId = gameData?.id || "brain-kids-65";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ExamStori, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
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
      const games = getBrainKidsGames({});
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
  
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
  {
    id: 1,
    text: "Two days before the exam, Aditya plans his study time. By midnight, he feels his focus fading but the chapter isn’t finished. What choice best supports his exam performance?",
    options: [
      
      {
        id: "push",
        text: "Push through while rereading without focus",
        emoji: "📖",
        isCorrect: false
      },
      {
        id: "memorize",
        text: "Memorize quickly without understanding",
        emoji: "🧩",
        isCorrect: false
      },
      {
        id: "prioritize",
        text: "Stop, rest well, and continue with a fresh mind",
        emoji: "🌙",
        isCorrect: true
      },
    ]
  },
  {
    id: 2,
    text: "The night before a test, Kabir finishes revision early and opens a game to relax. Time passes faster than expected. What decision would help him the next morning?",
    options: [
      {
        id: "limit",
        text: "Set a clear stop time and protect sleep",
        emoji: "⏱️",
        isCorrect: true
      },
      {
        id: "continue",
        text: "Keep playing until feeling sleepy",
        emoji: "🎮",
        isCorrect: false
      },
      {
        id: "balance",
        text: "Play more and wake up earlier to revise",
        emoji: "⏰",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "While studying late, Nisha notices she keeps reading the same line again and again. What does this signal about her learning state?",
    options: [
      
      {
        id: "difficulty",
        text: "The topic is impossible to understand",
        emoji: "🚫",
        isCorrect: false
      },
      {
        id: "fatigue",
        text: "Her brain needs rest to work effectively",
        emoji: "🧠",
        isCorrect: true
      },
      {
        id: "failure",
        text: "She is not capable of doing well",
        emoji: "❌",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "Late at night, messages keep arriving on Aarav’s phone while he prepares for an exam. What choice supports steady focus?",
    options: [
      {
        id: "silence",
        text: "Silence notifications until study is complete",
        emoji: "🔕",
        isCorrect: true
      },
      {
        id: "reply",
        text: "Reply quickly to avoid missing out",
        emoji: "💬",
        isCorrect: false
      },
      {
        id: "multitask",
        text: "Switch between messages and notes",
        emoji: "🔀",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "The project deadline and exam date fall close together. Riya feels pressure to finish everything in one night. What strategy helps her most?",
    options: [
      
      {
        id: "overnight",
        text: "Complete everything in one long stretch",
        emoji: "🌌",
        isCorrect: false
      },
      {
        id: "ignore",
        text: "Focus only on one task and forget the other",
        emoji: "🚫",
        isCorrect: false
      },
      {
        id: "plan",
        text: "Break work across days with rest in between",
        emoji: "🗓️",
        isCorrect: true
      },
    ]
  }
];


  const handleChoice = (option) => {
    if (answered) return;
    
    setAnswered(true);
    setSelectedOptionId(option.id);
    resetFeedback();
    
    if (option.isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
        setSelectedOptionId(null);
      }
    }, 1500);
  };

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Exam Story game completed! Score: ${score}/${questions.length}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId, questions.length]);

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Exam Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="brain"
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto px-4">
        {!showResult && currentQuestionData ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-base md:text-lg lg:text-xl mb-4 md:mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {currentQuestionData.options.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  const showCorrect = answered && option.isCorrect;
                  const showIncorrect = answered && isSelected && !option.isCorrect;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={answered}
                      className={`text-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg transition-all transform ${
                        showCorrect
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 border-2 border-green-300 scale-105"
                          : showIncorrect
                          ? "bg-gradient-to-r from-red-500 to-red-600 border-2 border-red-300"
                          : isSelected
                          ? "bg-gradient-to-r from-blue-600 to-cyan-700 border-2 border-blue-300 scale-105"
                          : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 border-2 border-transparent hover:scale-105"
                      } disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none`}
                    >
                      <div className="text-2xl md:text-3xl mb-2 md:mb-3">{option.emoji}</div>
                      <h3 className="font-bold text-sm md:text-base lg:text-lg mb-1 md:mb-2">{option.text}</h3>
                      <p className="text-white/90 text-xs md:text-sm">{option.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default ExamStori;
