import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationCleanUpDrive = () => {
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
      title: "Park Clean-Up",
      description: "Teen group sees garbage scattered throughout a local park. What should they do?",
      options: [
        {
          id: "a",
          text: "Organize a community clean-up event",
          emoji: "🧹",
          isCorrect: true
        },
        {
          id: "b",
          text: "Walk away and let someone else handle it",
          emoji: "🚶",
          isCorrect: false
        },
        {
          id: "c",
          text: "Blame the city for not maintaining the park properly",
          emoji: "😠",
          isCorrect: false
        },
        {
          id: "d",
          text: "Post about the issue on social media to raise awareness",
          emoji: "📱",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Beach Pollution",
      description: "The group discovers plastic waste polluting a nearby beach. How should they respond?",
      options: [
        
        {
          id: "b",
          text: "Post angry messages on social media about the pollution",
          emoji: "💻",
          isCorrect: false
        },
        {
          id: "c",
          text: "Decide it's not their problem and go home",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "a",
          text: "Document the issue and contact environmental organizations",
          emoji: "📱",
          isCorrect: true
        },
        {
          id: "d",
          text: "Create signs to educate beach visitors about pollution",
          emoji: "📢",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "School Grounds",
      description: "They notice litter accumulating around their school. What's the best approach?",
      options: [
        
        {
          id: "b",
          text: "Complain to teachers without offering solutions",
          emoji: "😤",
          isCorrect: false
        },
        {
          id: "a",
          text: "Start a regular clean-up schedule and educate classmates",
          emoji: "📅",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore it since it's the school's responsibility",
          emoji: "🤷",
          isCorrect: false
        },
        {
          id: "d",
          text: "Ask the principal for permission to organize a school-wide campaign",
          emoji: "🏫",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Neighborhood Cleanup",
      description: "During their clean-up, they find hazardous materials like broken glass and chemicals. What should they do?",
      options: [
        {
          id: "a",
          text: "Contact local authorities for proper disposal",
          emoji: "📞",
          isCorrect: true
        },
        {
          id: "b",
          text: "Try to dispose of hazardous items themselves",
          emoji: "⚠️",
          isCorrect: false
        },
        {
          id: "c",
          text: "Leave hazardous items and only collect regular trash",
          emoji: "🗑️",
          isCorrect: false
        },
        {
          id: "d",
          text: "Warn neighbors about the hazardous materials",
          emoji: "⚠️",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Community Engagement",
      description: "Their clean-up efforts attract media attention. How should they handle the publicity?",
      options: [
        
        {
          id: "b",
          text: "Avoid media and keep their efforts private",
          emoji: "🤫",
          isCorrect: false
        },
        {
          id: "a",
          text: "Use the attention to encourage others to volunteer",
          emoji: "📢",
          isCorrect: true
        },
        {
          id: "c",
          text: "Focus attention on themselves rather than the cause",
          emoji: "👑",
          isCorrect: false
        },
        {
          id: "d",
          text: "Thank the media and direct attention to environmental issues",
          emoji: "📺",
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
      title="Simulation: Clean-Up Drive"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      gameId="civic-responsibility-teens-58"
      gameType="civic-responsibility"
      totalLevels={60}
      currentLevel={58}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={scenarios.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/civic-responsibility/teens/reflex-service-mindset"
      nextGameIdProp="civic-responsibility-teens-59">
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

export default SimulationCleanUpDrive;