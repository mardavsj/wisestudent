import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationTeenCivicProject = () => {
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
      title: "Project Planning",
      description: "Your teen team wants to run a campaign for safer school routes. How should you start?",
      options: [
        {
          id: "a",
          text: "Research the issue and create a plan",
          emoji: "📋",
          isCorrect: true
        },
        {
          id: "b",
          text: "Start posting on social media immediately",
          emoji: "📱",
          isCorrect: false
        },
        {
          id: "c",
          text: "Let someone else handle it",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "d",
          text: "Partner with local organizations for support",
          emoji: "🤝",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Team Coordination",
      description: "Team members have different ideas about campaign focus. How should you respond?",
      options: [
        
        {
          id: "b",
          text: "Impose your own preferred approach",
          emoji: "👑",
          isCorrect: false
        },
        {
          id: "c",
          text: "Avoid making any decisions",
          emoji: "⏳",
          isCorrect: false
        },
        {
          id: "a",
          text: "Facilitate discussion to find common ground",
          emoji: "🤝",
          isCorrect: true
        },
        {
          id: "d",
          text: "Vote to determine the team's direction",
          emoji: "🗳️",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Resource Management",
      description: "The campaign has limited funds and volunteers. How should you allocate resources?",
      options: [
        {
          id: "a",
          text: "Prioritize high-impact activities",
          emoji: "🎯",
          isCorrect: true
        },
        {
          id: "b",
          text: "Spend evenly on all activities",
          emoji: "💸",
          isCorrect: false
        },
        {
          id: "c",
          text: "Use funds for personal expenses",
          emoji: "🛍️",
          isCorrect: false
        },
        {
          id: "d",
          text: "Apply for grants to increase funding",
          emoji: "📝",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Community Engagement",
      description: "Local officials seem unresponsive to your campaign. What should you do?",
      options: [
        
        {
          id: "b",
          text: "Give up on the campaign",
          emoji: "😔",
          isCorrect: false
        },
        {
          id: "c",
          text: "Complain publicly about officials",
          emoji: "😠",
          isCorrect: false
        },
        {
          id: "d",
          text: "Organize a peaceful demonstration",
          emoji: "✊",
          isCorrect: false
        },
        {
          id: "a",
          text: "Persist with respectful follow-up and broader outreach",
          emoji: "📞",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      title: "Campaign Success",
      description: "Your campaign successfully influences policy change. How should you celebrate?",
      options: [
        
        {
          id: "b",
          text: "Take personal credit for the success",
          emoji: "🏆",
          isCorrect: false
        },
        {
          id: "a",
          text: "Acknowledge everyone's contributions",
          emoji: "🎉",
          isCorrect: true
        },
        {
          id: "c",
          text: "Immediately start planning the next campaign",
          emoji: "🏃",
          isCorrect: false
        },
        {
          id: "d",
          text: "Document the impact for future reference",
          emoji: "📊",
          isCorrect: false
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

  const handleNext = () => {
    navigate("/games/civic-responsibility/teens");
  };

  const getCurrentScenario = () => scenarios[currentScenario];

  return (
    <GameShell
      title="Simulation: Teen Civic Project"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      gameId="civic-responsibility-teens-98"
      gameType="civic-responsibility"
      totalLevels={100}
      currentLevel={98}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={scenarios.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/civic-responsibility/teens/reflex-teen-civic-duty"
      nextGameIdProp="civic-responsibility-teens-99">
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-4">
            {getCurrentScenario().title}
          </h2>
          
          <p className="text-white/90 mb-6">
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

export default SimulationTeenCivicProject;