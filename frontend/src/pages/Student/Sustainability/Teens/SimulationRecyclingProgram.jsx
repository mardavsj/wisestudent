import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const SimulationRecyclingProgram = () => {
  const location = useLocation();
  const gameData = getGameDataById("sustainability-teens-18");
  const gameId = gameData?.id || "sustainability-teens-18";
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
      console.log(`🎮 Simulation: Recycling Program game completed! Score: ${coins}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
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
      text: "What's the first step in starting a recycling program?",
      options: [
        { id: "a", text: "Buy bins immediately", emoji: "🗑️", isCorrect: false },
        { id: "b", text: "Create a plan", emoji: "📋", isCorrect: true },
        { id: "c", text: "Wait for funding", emoji: "⏳", isCorrect: false },
        { id: "d", text: "Start collecting waste", emoji: "♻️", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "How do you get people to participate?",
      options: [
        { id: "a", text: "Force participation", emoji: "😠", isCorrect: false },
        { id: "b", text: "Ignore participation", emoji: "😐", isCorrect: false },
        { id: "c", text: "Educate and engage", emoji: "📚", isCorrect: true },
        { id: "d", text: "Offer money for trash", emoji: "💰", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "What materials should you prioritize?",
      options: [
        { id: "a", text: "Rare materials", emoji: "💎", isCorrect: false },
        { id: "b", text: "Everything at once", emoji: "🌍", isCorrect: false },
        { id: "c", text: "Most common waste", emoji: "📊", isCorrect: true },
        { id: "d", text: "Most expensive items", emoji: "💸", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "Where should recycling bins be placed?",
      options: [
        { id: "a", text: "Hidden locations", emoji: "🙈", isCorrect: false },
        { id: "b", text: "Convenient spots", emoji: "📍", isCorrect: true },
        { id: "c", text: "Far from buildings", emoji: "🚶", isCorrect: false },
        { id: "d", text: "In parking lots only", emoji: "🚗", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "How often should bins be emptied?",
      options: [
        { id: "a", text: "Never", emoji: "🚫", isCorrect: false },
        { id: "b", text: "Only when full", emoji: "♻️", isCorrect: false },
        { id: "c", text: "On a regular schedule", emoji: "📅", isCorrect: true },
        { id: "d", text: "Once a year", emoji: "🗓️", isCorrect: false }
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
      title="Simulation: Recycling Program"
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
    
      nextGamePathProp="/student/sustainability/teens/reflex-compost-master"
      nextGameIdProp="sustainability-teens-19">
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

export default SimulationRecyclingProgram;

