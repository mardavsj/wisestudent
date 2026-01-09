import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationPeerTestSubstance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0); // Add coins state
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      title: "Party Pressure",
      description: "Friends offer you alcohol at a party. What do you do?",
      options: [
        {
          id: "a",
          text: "Take it to avoid standing out",
          emoji: "🍺",
          isCorrect: false
        },
        {
          id: "b",
          text: "Get angry and accuse friends of being bad influences",
          emoji: "😠",
          isCorrect: false
        },
        {
          id: "c",
          text: "Politely decline and suggest a non-alcoholic drink",
          emoji: "🙅",
          isCorrect: true
        },
        {
          id: "d",
          text: "Explain your personal reasons for not drinking",
          emoji: "💬",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Left Alone",
      description: "You're alone with someone offering drugs. What's your response?",
      options: [
        {
          id: "a",
          text: "Try it just this once",
          emoji: "🧪",
          isCorrect: false
        },
        {
          id: "b",
          text: "Firmly say no and leave the situation",
          emoji: "🏃",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ask for just a small amount",
          emoji: "📏",
          isCorrect: false
        },
        {
          id: "d",
          text: "Suggest doing something else together",
          emoji: "🎉",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Group Situation",
      description: "Everyone at a gathering is smoking. How do you handle it?",
      options: [
        {
          id: "a",
          text: "Join in to fit in with the group",
          emoji: "👥",
          isCorrect: false
        },
        {
          id: "b",
          text: "Complain about others smoking",
          emoji: "😤",
          isCorrect: false
        },
        {
          id: "c",
          text: "Move to a different area and breathe fresh air",
          emoji: "🌬️",
          isCorrect: true
        },
        {
          id: "d",
          text: "Ask if there's a designated smoking area",
          emoji: "📍",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Ride Request",
      description: "Friends who've been drinking ask you for a ride home. What do you do?",
      options: [
        {
          id: "a",
          text: "Drive them despite your concerns",
          emoji: "🚗",
          isCorrect: false
        },
        {
          id: "b",
          text: "Leave them stranded",
          emoji: "🚶",
          isCorrect: false
        },
        {
          id: "c",
          text: "Refuse and call them a taxi or rideshare",
          emoji: "🚕",
          isCorrect: true
        },
        {
          id: "d",
          text: "Ask a sober friend to help with transportation",
          emoji: "🤝",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Social Media",
      description: "Friends post photos of substance use online. How do you respond?",
      options: [
        {
          id: "a",
          text: "Like the posts to stay popular",
          emoji: "👍",
          isCorrect: false
        },
        {
          id: "b",
          text: "Publicly shame them online",
          emoji: "📢",
          isCorrect: false
        },
        {
          id: "c",
          text: "Privately message them about your concerns",
          emoji: "💌",
          isCorrect: false
        },
        {
          id: "d",
          text: "Don't engage and change your social circle",
          emoji: "📵",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = scenarios[currentScenario].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCoins(prev => prev + 1); // Increment coins when correct
    }

    setChoices([...choices, { scenario: currentScenario, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const getCurrentScenario = () => scenarios[currentScenario];

  const handleNext = () => {
    navigate("/student/health-female/teens/reflex-teen-safety");
  };

  return (
    <GameShell
      title="Simulation: Peer Test"
      subtitle={`${getCurrentScenario().title}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-88"
      gameType="health-female"
      totalLevels={10}
      currentLevel={8}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    
      nextGamePathProp="/student/health-female/teens/reflex-teen-safety"
      nextGameIdProp="health-female-teen-89">
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentScenario().description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {getCurrentScenario().options.map(option => (
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
      </div>
    </GameShell>
  );
};

export default SimulationPeerTestSubstance;