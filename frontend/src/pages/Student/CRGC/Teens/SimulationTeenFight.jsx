import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationTeenFight = () => {
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
      title: "Classroom Dispute",
      description: "Two classmates are arguing loudly over a group project grade. What do you do?",
      options: [
        {
          id: "a",
          text: "Join in the argument to take sides",
          emoji: "⚔️",
          isCorrect: false
        },
        {
          id: "b",
          text: "Approach them calmly and suggest they discuss it with the teacher",
          emoji: "🕊️",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore them and focus on your own work",
          emoji: "📖",
          isCorrect: false
        },
        {
          id: "d",
          text: "Ask a classmate to get the teacher immediately",
          emoji: "👩‍🏫",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Friendship Conflict",
      description: "Two friends are having a heated argument in the hallway. How do you respond?",
      options: [
        {
          id: "b",
          text: "Ask each person to share their perspective and help them find common ground",
          emoji: "🤝",
          isCorrect: true
        },
        {
          id: "a",
          text: "Tell them to take their argument somewhere else",
          emoji: "📍",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Get other friends involved to pick sides",
          emoji: "👥",
          isCorrect: false
        },
        {
          id: "d",
          text: "Suggest they cool off before continuing the discussion",
          emoji: "❄️",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Online Dispute",
      description: "Two students are arguing in a group chat with increasingly hostile messages. What's your response?",
      options: [
        {
          id: "a",
          text: "Screenshot and share the argument with others for entertainment",
          emoji: "📸",
          isCorrect: false
        },
        {
          id: "b",
          text: "Privately message each person to understand their perspective and suggest a calm discussion",
          emoji: "💬",
          isCorrect: true
        },
        {
          id: "c",
          text: "Post in the group chat telling them to stop being childish",
          emoji: "🤐",
          isCorrect: false
        },
        {
          id: "d",
          text: "Leave the group chat to avoid getting involved",
          emoji: "🚪",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Sports Team Conflict",
      description: "Two teammates are arguing after a loss, blaming each other for the result. How do you help?",
      options: [
        {
          id: "a",
          text: "Tell them they're both wrong and that the coach should handle it",
          emoji: "🏃",
          isCorrect: false
        },
        {
          id: "b",
          text: "Suggest they focus on what they can learn from the game to improve",
          emoji: "📈",
          isCorrect: true
        },
        {
          id: "c",
          text: "Take sides based on your opinion of who was right",
          emoji: "🎯",
          isCorrect: false
        },
        {
          id: "d",
          text: "Remind them that teamwork is more important than winning",
          emoji: "👥",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Group Project Conflict",
      description: "Team members are arguing about workload distribution, with accusations flying. What do you do?",
      options: [
        {
          id: "a",
          text: "Quit the group project to avoid the conflict",
          emoji: "🚪",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Side with whoever you're closer to in the group",
          emoji: "👥",
          isCorrect: false
        },
        {
          id: "b",
          text: "Suggest everyone list their contributions and concerns, then work together on a fair plan",
          emoji: "📋",
          isCorrect: true
        },
        {
          id: "d",
          text: "Ask the teacher to assign new groups",
          emoji: "🔁",
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
      title="Simulation: Teen Fight"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      gameId="civic-responsibility-teens-48"
      gameType="civic-responsibility"
      totalLevels={50}
      currentLevel={48}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={scenarios.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/civic-responsibility/teens/reflex-teen-peace"
      nextGameIdProp="civic-responsibility-teens-49">
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

export default SimulationTeenFight;