import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationTeenCitizen = () => {
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
      title: "Witnessing Corruption",
      description: "A teen sees a government official accepting a bribe. What should they do?",
      options: [
        {
          id: "a",
          text: "Report it to the proper authorities",
          emoji: "📢",
          isCorrect: true
        },
        {
          id: "b",
          text: "Join in to get benefits",
          emoji: "💸",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore it completely",
          emoji: "🤐",
          isCorrect: false
        },
        {
          id: "d",
          text: "Document the incident and seek legal advice",
          emoji: "📝",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Community Problem",
      description: "The teen notices garbage piling up in their neighborhood. How should they respond?",
      options: [
        
        {
          id: "b",
          text: "Complain but do nothing else",
          emoji: "😤",
          isCorrect: false
        },
        {
          id: "a",
          text: "Organize a community clean-up and report to local authorities",
          emoji: "🧹",
          isCorrect: true
        },
        {
          id: "c",
          text: "Move to a different area",
          emoji: "🚶",
          isCorrect: false
        },
        {
          id: "d",
          text: "Start a petition to address the issue with officials",
          emoji: "✍️",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Public Facility Misuse",
      description: "The teen sees people vandalizing public property. What's the best approach?",
      options: [
        
        {
          id: "b",
          text: "Join in for fun",
          emoji: "🤪",
          isCorrect: false
        },
        {
          id: "c",
          text: "Record it for social media",
          emoji: "📱",
          isCorrect: false
        },
        {
          id: "d",
          text: "Inform security personnel or police anonymously",
          emoji: "👮",
          isCorrect: false
        },
        {
          id: "a",
          text: "Intervene peacefully or report the incident",
          emoji: "✋",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      title: "Inequality in School",
      description: "The teen notices some students being treated unfairly by teachers. How should they respond?",
      options: [
        {
          id: "a",
          text: "Address it with school authorities or counselors",
          emoji: "🏫",
          isCorrect: true
        },
        {
          id: "b",
          text: "Encourage the unfair treatment",
          emoji: "😈",
          isCorrect: false
        },
        {
          id: "c",
          text: "Stay silent to avoid getting involved",
          emoji: "😶",
          isCorrect: false
        },
        {
          id: "d",
          text: "Support the affected students and help them report it",
          emoji: "🤝",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Environmental Violation",
      description: "The teen discovers a factory illegally dumping waste into a river. What should they do?",
      options: [
        
        {
          id: "b",
          text: "Ignore it since it's not their problem",
          emoji: "🤷",
          isCorrect: false
        },
        {
          id: "c",
          text: "Post angry messages online without evidence",
          emoji: "💻",
          isCorrect: false
        },
        {
          id: "a",
          text: "Report to environmental protection agencies",
          emoji: "🌍",
          isCorrect: true
        },
        {
          id: "d",
          text: "Collect water samples and contact environmental groups",
          emoji: "🧪",
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
      title="Simulation: Teen Citizen"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      gameId="civic-responsibility-teens-78"
      gameType="civic-responsibility"
      totalLevels={80}
      currentLevel={78}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={scenarios.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/civic-responsibility/teens/reflex-teen-duty"
      nextGameIdProp="civic-responsibility-teens-79">
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

export default SimulationTeenCitizen;