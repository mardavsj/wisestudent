import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const QuizSustainableAgriculture = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const gameId = "sustainability-teens-22";
  const gameData = getGameDataById(gameId);
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

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
      console.log(`🎮 Quiz on Sustainable Agriculture game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId]);

  const questions = [
    {
      id: 1,
      text: "What is sustainable agriculture?",
      options: [
        { id: "a", text: "Using lots of chemicals", emoji: "🧪", isCorrect: false },
        { id: "b", text: "Farming that protects environment", emoji: "🌾", isCorrect: true },
        { id: "c", text: "Ignoring soil health", emoji: "🌍", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "How can farming be more sustainable?",
      options: [
        { id: "a", text: "Use only chemicals", emoji: "💊", isCorrect: false },
        { id: "b", text: "Ignore water conservation", emoji: "💧", isCorrect: false },
        { id: "c", text: "Use organic methods and crop rotation", emoji: "🔄", isCorrect: true }
      ]
    },
    {
      id: 3,
      text: "What benefits does sustainable agriculture provide?",
      options: [
        { id: "a", text: "Only short-term profits", emoji: "💰", isCorrect: false },
        { id: "b", text: "Protects soil, water, and biodiversity", emoji: "🌱", isCorrect: true },
        { id: "c", text: "Harms the environment", emoji: "🌍", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "Which practice helps maintain soil health?",
      options: [
        { id: "a", text: "Crop rotation", emoji: "🔄", isCorrect: true },
        { id: "b", text: "Overuse of pesticides", emoji: "⚠️", isCorrect: false },
        { id: "c", text: "Monoculture farming", emoji: "🌽", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "What is a key principle of sustainable agriculture?",
      options: [
        { id: "a", text: "Maximizing short-term yield", emoji: "📈", isCorrect: false },
        { id: "b", text: "Conserving natural resources", emoji: "💧", isCorrect: true },
        { id: "c", text: "Eliminating all pests", emoji: "🐜", isCorrect: false }
      ]
    }
  ];

  const handleAnswer = (option) => {
    if (answered || showFeedback) return;
    
    setSelectedOption(option.id);
    
    if (option.isCorrect) {
      setCoins(prev => prev + 1);
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setAnswered(true);
    setShowFeedback(true);
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
        setSelectedOption(null);
        setShowFeedback(false);
      }
    }, option.isCorrect ? 1000 : 800);
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Sustainable Agriculture"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 2}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    
      nextGamePathProp="/student/sustainability/teens/reflex-ocean-protector"
      nextGameIdProp="sustainability-teens-23">
      <div className="space-y-8">
        {!showResult && currentQuestionData && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
              <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
            </div>
            <p className="text-white text-lg mb-6">{currentQuestionData.text}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentQuestionData.options.map((option) => {
                const isSelected = selectedOption === option.id;
                const showCorrect = showFeedback && option.isCorrect;
                const showIncorrect = showFeedback && isSelected && !option.isCorrect;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option)}
                    disabled={showFeedback}
                    className={`p-6 rounded-2xl shadow-lg transition-all transform text-center ${
                      showCorrect
                        ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                        : showIncorrect
                        ? "bg-red-500/20 border-2 border-red-400 opacity-75"
                        : isSelected
                        ? "bg-blue-600 border-2 border-blue-300 scale-105"
                        : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${showFeedback ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h4 className="font-bold text-base mb-2">{option.text}</h4>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizSustainableAgriculture;

