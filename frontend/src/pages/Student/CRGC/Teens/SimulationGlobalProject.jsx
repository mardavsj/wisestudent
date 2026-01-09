import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationGlobalProject = () => {
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
      title: "Online Collaboration",
      description: "Teens from different countries join an online project to create educational videos. How should they work together?",
      options: [
        {
          id: "a",
          text: "Collaborate respectfully and share ideas",
          emoji: "🤝",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore teammates from other cultures",
          emoji: "🚫",
          isCorrect: false
        },
        {
          id: "c",
          text: "Mock others' ideas and accents",
          emoji: "😤",
          isCorrect: false
        },
        {
          id: "d",
          text: "Establish clear communication protocols and roles",
          emoji: "📋",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Cultural Misunderstanding",
      description: "A team member from another culture seems distant during video calls. What should you do?",
      options: [
        
        {
          id: "b",
          text: "Assume they're not interested",
          emoji: "😒",
          isCorrect: false
        },
        {
          id: "a",
          text: "Ask respectfully about their communication style",
          emoji: "💬",
          isCorrect: true
        },
        {
          id: "c",
          text: "Speak louder to make them participate",
          emoji: "📢",
          isCorrect: false
        },
        {
          id: "d",
          text: "Research their cultural communication norms",
          emoji: "🌐",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Time Zone Challenges",
      description: "The project requires meetings at times that are inconvenient for some team members. How should the group respond?",
      options: [
        
        {
          id: "b",
          text: "Always meet at the most convenient time",
          emoji: "⏰",
          isCorrect: false
        },
        {
          id: "c",
          text: "Exclude team members who can't attend",
          emoji: "❌",
          isCorrect: false
        },
        {
          id: "a",
          text: "Rotate meeting times to share the burden",
          emoji: "🔄",
          isCorrect: true
        },
        {
          id: "d",
          text: "Use asynchronous communication methods",
          emoji: "📨",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Different Work Styles",
      description: "Some team members prefer detailed planning while others prefer flexible approaches. How should the team handle this?",
      options: [
        {
          id: "a",
          text: "Find a balanced approach that respects all styles",
          emoji: "⚖️",
          isCorrect: true
        },
        {
          id: "b",
          text: "Insist everyone follow one approach",
          emoji: "🔨",
          isCorrect: false
        },
        {
          id: "c",
          text: "Let each person work separately",
          emoji: "🙍",
          isCorrect: false
        },
        {
          id: "d",
          text: "Assign tasks based on individual strengths",
          emoji: "🎯",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Project Success",
      description: "The project is successful and receives recognition. How should the team celebrate?",
      options: [
        
        {
          id: "b",
          text: "Credit only the most vocal members",
          emoji: "🗣️",
          isCorrect: false
        },
        {
          id: "c",
          text: "Don't celebrate at all",
          emoji: "😐",
          isCorrect: false
        },
        {
          id: "a",
          text: "Celebrate everyone's contributions equally",
          emoji: "🎉",
          isCorrect: true
        },
        {
          id: "d",
          text: "Share success stories on social media",
          emoji: "📱",
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
      title="Simulation: Global Project"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      gameId="civic-responsibility-teens-88"
      gameType="civic-responsibility"
      totalLevels={90}
      currentLevel={88}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={scenarios.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/civic-responsibility/teens/reflex-teen-awareness"
      nextGameIdProp="civic-responsibility-teens-89">
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

export default SimulationGlobalProject;