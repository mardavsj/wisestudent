import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const SimulationSustainableShopping = () => {
  const location = useLocation();
  const gameData = getGameDataById("sustainability-teens-33");
  const gameId = gameData?.id || "sustainability-teens-33";
  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0);
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
    if (gameFinished) {
      console.log(`🎮 Simulation: Sustainable Shopping game completed! Score: ${coins}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [gameFinished, coins, gameId, nextGamePath, nextGameId]);

  const questions = [
    {
      id: 1,
      text: "When shopping for clothes, which option is most sustainable?",
      options: [
        { id: "a", text: "Buy fast fashion items on sale", emoji: "👕", isCorrect: false },
        { id: "b", text: "Choose organic cotton from local brands", emoji: "🌿", isCorrect: true },
        { id: "c", text: "Purchase synthetic materials", emoji: "🧪", isCorrect: false },
        { id: "d", text: "Buy from the most expensive brand", emoji: "💰", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "What is the best way to reduce packaging waste while shopping?",
      options: [
        { id: "a", text: "Use single-use plastic bags", emoji: "🛍️", isCorrect: false },
        { id: "c", text: "Choose items with extra packaging", emoji: "📦", isCorrect: false },
        { id: "b", text: "Bring reusable bags and containers", emoji: "♻️", isCorrect: true },
        { id: "d", text: "Avoid all packaged products", emoji: "❌", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "How can you make sustainable choices when buying food?",
      options: [
        { id: "a", text: "Always choose imported exotic foods", emoji: "✈️", isCorrect: false },
        { id: "c", text: "Purchase the cheapest options only", emoji: "💸", isCorrect: false },
        { id: "d", text: "Ignore expiration dates", emoji: "📅", isCorrect: false },
        { id: "b", text: "Buy local, seasonal produce", emoji: "🍓", isCorrect: true },
      ]
    },
    {
      id: 4,
      text: "What is the most sustainable way to shop for electronics?",
      options: [
        { id: "a", text: "Buy the latest model every year", emoji: "📱", isCorrect: false },
        { id: "b", text: "Purchase used or refurbished items", emoji: "🔄", isCorrect: true },
        { id: "c", text: "Choose the most expensive brands", emoji: "💎", isCorrect: false },
        { id: "d", text: "Buy from online marketplaces only", emoji: "💻", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "How should you approach making sustainable shopping decisions?",
      options: [
        { id: "b", text: "Consider the environmental impact of products", emoji: "🌱", isCorrect: true },
        { id: "a", text: "Focus only on the lowest price", emoji: "📉", isCorrect: false },
        { id: "c", text: "Buy in bulk regardless of need", emoji: "🤔", isCorrect: false },
        { id: "d", text: "Follow all trends without research", emoji: "🔎", isCorrect: false }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = questions[currentScenario].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCoins(prev => prev + 1); // Increment coins when correct
    }

    setChoices([...choices, { scenario: currentScenario, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentScenario < questions.length - 1) {
        setCurrentScenario(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const currentQuestionData = questions[currentScenario];

  return (
    <GameShell
      title="Simulation: Sustainable Shopping"
      subtitle={`Scenario ${currentScenario + 1} of ${questions.length}`}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="sustainability"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    
      nextGamePathProp="/student/sustainability/teens/reflex-ethical-buyer"
      nextGameIdProp="sustainability-teens-34">
      <div className="space-y-8">
        {!gameFinished && currentQuestionData && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Scenario {currentScenario + 1}/{questions.length}</span>
              <span className="text-yellow-400 font-bold">Coins: {coins}</span>
            </div>
            <p className="text-white text-lg mb-6">{currentQuestionData.text}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQuestionData.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option.id)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-4">{option.emoji}</div>
                    <div>
                      <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationSustainableShopping;