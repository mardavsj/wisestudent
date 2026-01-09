import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const SimulationGreenStartupPlan = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  const gameId = "sustainability-teens-93";
  const games = getSustainabilityTeenGames({});
  const currentGameIndex = games.findIndex(game => game.id === gameId);
  const nextGame = games[currentGameIndex + 1];
  const nextGamePath = nextGame ? nextGame.path : "/games/sustainability/teens";
  const nextGameId = nextGame ? nextGame.id : null;

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [currentScenario, setCurrentScenario] = useState(0);
  const [coins, setCoins] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  const questions = [
    {
      id: 1,
      text: "You're starting a green tech startup. What's your first priority?",
      options: [
        { id: 'b', text: "Start building a product immediately", emoji: "🔨", isCorrect: false },
        { id: 'a', text: "Identify market needs and sustainability gaps", emoji: "🔍", isCorrect: true },
        { id: 'c', text: "Focus only on getting investors", emoji: "💼", isCorrect: false },
        { id: 'd', text: "Copy existing solutions", emoji: "📋", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "Which business model would be most sustainable for your startup?",
      options: [
        { id: 'a', text: "Circular economy model with product lifecycle focus", emoji: "🔄", isCorrect: true },
        { id: 'b', text: "Traditional linear model", emoji: "➡️", isCorrect: false },
        { id: 'c', text: "Purely profit-driven model", emoji: "💰", isCorrect: false },
        { id: 'd', text: "Fast-growth model", emoji: "🚀", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "How do you ensure your startup remains environmentally responsible?",
      options: [
        { id: 'b', text: "Focus only on the final product", emoji: "📦", isCorrect: false },
        { id: 'c', text: "Delegate environmental responsibility", emoji: "🏃", isCorrect: false },
        { id: 'd', text: "Ignore environmental impact", emoji: "❌", isCorrect: false },
        { id: 'a', text: "Implement sustainable practices across entire supply chain", emoji: "🌱", isCorrect: true },
      ]
    },
    {
      id: 4,
      text: "What's the best approach for scaling your sustainable startup?",
      options: [
        { id: 'b', text: "Compromise on sustainability for rapid growth", emoji: "❌", isCorrect: false },
        { id: 'c', text: "Focus only on market share", emoji: "📊", isCorrect: false },
        { id: 'a', text: "Maintain sustainability principles while growing", emoji: "🌱", isCorrect: true },
        { id: 'd', text: "Ignore environmental impact", emoji: "🌍", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "How do you measure your startup's success?",
      options: [
        { id: 'a', text: "Triple bottom line: People, Planet, Profit", emoji: "⚖️", isCorrect: true },
        { id: 'b', text: "Only financial profit", emoji: "💰", isCorrect: false },
        { id: 'c', text: "Market share only", emoji: "📈", isCorrect: false },
        { id: 'd', text: "Growth speed only", emoji: "⚡", isCorrect: false }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = questions[currentScenario].options.find(opt => opt.id === optionId);
    
    if (selectedOption.isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    const isLastScenario = currentScenario === questions.length - 1;
    
    setTimeout(() => {
      if (isLastScenario) {
        setGameFinished(true);
      } else {
        setCurrentScenario(prev => prev + 1);
      }
    }, 1000);
  };

  const currentQuestionData = questions[currentScenario];

  return (
    <GameShell
      title="Simulation: Green Startup Plan"
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
    
      nextGamePathProp="/student/sustainability/teens/reflex-innovation-solutions"
      nextGameIdProp="sustainability-teens-94">
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
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 flex items-center space-x-3"
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span>{option.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {gameFinished && (
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Simulation Complete!</h2>
              <p className="text-white/90 mb-2">You earned {coins} coins</p>
              <p className="text-white/70 mb-6">Great job developing your green startup plan!</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => navigate(nextGamePath)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  Next Challenge
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationGreenStartupPlan;