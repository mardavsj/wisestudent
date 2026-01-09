import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const DebateQualityVsQuantity = () => {
  const location = useLocation();
  
  const gameData = getGameDataById("sustainability-teens-31");
  const gameId = gameData?.id || "sustainability-teens-31";
  
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for DebateQualityVsQuantity, using fallback ID");
  }
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

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
      console.log(`🎮 Debate: Quality vs Quantity game completed! Coins: ${coins}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, coins, gameId, nextGamePath, nextGameId]);

  const questions = [
    {
      id: 1,
      text: "Which approach is more sustainable?",
      options: [
        { id: "a", text: "Buying fewer high-quality items", emoji: "✨", isCorrect: true },
        { id: "b", text: "Buying many low-quality items", emoji: "🛍️", isCorrect: false },
        { id: "c", text: "Always buying the latest products", emoji: "🆕", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "How does quality over quantity affect the environment?",
      options: [
        { id: "b", text: "Increases waste production", emoji: "🗑️", isCorrect: false },
        { id: "c", text: "Requires more resources", emoji: "⚡", isCorrect: false },
        { id: "a", text: "Reduces waste and resource consumption", emoji: "🌍", isCorrect: true },
      ]
    },
    {
      id: 3,
      text: "What's an example of quality over quantity?",
      options: [
        { id: "b", text: "Buying disposable items frequently", emoji: "❌", isCorrect: false },
        { id: "a", text: "Investing in durable, long-lasting products", emoji: "🛠️", isCorrect: true },
        { id: "c", text: "Purchasing single-use products", emoji: "🛒", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "Why do high-quality items often cost more initially?",
      options: [
        { id: "b", text: "Companies want to make more profit", emoji: "🤑", isCorrect: false },
        { id: "c", text: "They are less useful", emoji: "🤷", isCorrect: false },
        { id: "a", text: "Better materials and construction", emoji: "🔨", isCorrect: true },
      ]
    },
    {
      id: 5,
      text: "How does the quality vs quantity mindset benefit society?",
      options: [
        { id: "a", text: "Reduces overconsumption and waste", emoji: "♻️", isCorrect: true },
        { id: "b", text: "Increases production needs", emoji: "🏭", isCorrect: false },
        { id: "c", text: "Encourages more shopping", emoji: "🛍️", isCorrect: false }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (answered) return;
    
    setSelectedOption(optionId);
    setAnswered(true);
    resetFeedback();
    
    const selectedOptionData = questions[currentQuestion].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOptionData.isCorrect;
    
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
        setSelectedOption(null);
      } else {
        setShowResult(true);
      }
    }, isCorrect ? 1000 : 800);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setCoins(0);
    setAnswered(false);
    resetFeedback();
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Debate: Quality vs Quantity"
      score={coins}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Debate Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    
      nextGamePathProp="/student/sustainability/teens/journal-of-consumption"
      nextGameIdProp="sustainability-teens-32">
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
              </div>
              
              <div className="text-6xl mb-4 text-center">⚖️</div>
              
              <p className="text-white text-lg md:text-xl mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    disabled={answered}
                    className={`bg-gradient-to-r ${
                      answered && option.id === selectedOption
                        ? option.isCorrect
                          ? 'bg-green-500'
                          : 'bg-red-500'
                        : 'from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 text-left flex items-center space-x-3`}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span>{option.text}</span>
                  </button>
                ))}
              </div>
              

            </div>
          </div>
        </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default DebateQualityVsQuantity;