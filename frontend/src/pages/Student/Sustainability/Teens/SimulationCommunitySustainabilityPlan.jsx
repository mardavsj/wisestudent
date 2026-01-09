import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const SimulationCommunitySustainabilityPlan = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  const gameId = "sustainability-teens-99";
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
      text: "You're developing a community sustainability plan. What's your first step?",
      options: [
        { id: 'b', text: "Create a plan in isolation", emoji: "👤", isCorrect: false },
        { id: 'a', text: "Engage community members to understand their needs", emoji: "👥", isCorrect: true },
        { id: 'c', text: "Focus only on environmental issues", emoji: "🌍", isCorrect: false },
        { id: 'd', text: "Start with implementation", emoji: "🔨", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "Which approach is most effective for community engagement?",
      options: [
        { id: 'a', text: "Host diverse forums for input from all stakeholders", emoji: "🗣️", isCorrect: true },
        { id: 'b', text: "Make decisions without input", emoji: "🤐", isCorrect: false },
        { id: 'c', text: "Focus on a single group", emoji: "👥", isCorrect: false },
        { id: 'd', text: "Avoid community feedback", emoji: "🔇", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "How should you prioritize sustainability initiatives?",
      options: [
        { id: 'b', text: "Based on personal preferences", emoji: "👤", isCorrect: false },
        { id: 'c', text: "Based on cost alone", emoji: "💰", isCorrect: false },
        { id: 'a', text: "Based on community needs and environmental impact", emoji: "🌱", isCorrect: true },
        { id: 'd', text: "Based on trends", emoji: "📈", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "What's important for successful implementation?",
      options: [
        { id: 'b', text: "Work alone without partnerships", emoji: "👤", isCorrect: false },
        { id: 'c', text: "Keep information secret", emoji: "🔒", isCorrect: false },
        { id: 'd', text: "Avoid communication", emoji: "🤐", isCorrect: false },
        { id: 'a', text: "Build partnerships and maintain transparent communication", emoji: "🤝", isCorrect: true },
      ]
    },
    {
      id: 5,
      text: "How should you measure the plan's success?",
      options: [
        { id: 'b', text: "Focus only on environmental metrics", emoji: "🌍", isCorrect: false },
        { id: 'c', text: "Measure only financial returns", emoji: "💰", isCorrect: false },
        { id: 'a', text: "Track environmental, social, and economic impact", emoji: "📊", isCorrect: true },
        { id: 'd', text: "Assess only personal recognition", emoji: "🏆", isCorrect: false }
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
      title="Simulation: Community Sustainability Plan"
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
    
      nextGamePathProp="/student/sustainability/teens/badge-master-sustainability-leader"
      nextGameIdProp="sustainability-teens-100">
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
              <p className="text-white/70 mb-6">Great job developing your community sustainability plan!</p>
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

export default SimulationCommunitySustainabilityPlan;