import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationSchoolEvent = () => {
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
      title: "School Project Team",
      description: "Your group project team is excluding a new classmate who seems eager to help. What do you do?",
      options: [
        {
          id: "a",
          text: "Add her to your team and give her a meaningful task",
          emoji: "👥",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore the situation and let your teammates decide",
          emoji: "🤐",
          isCorrect: false
        },
        {
          id: "c",
          text: "Laugh at the new classmate for wanting to join",
          emoji: "😂",
          isCorrect: false
        },
        {
          id: "d",
          text: "Talk to your teammates about including everyone",
          emoji: "🤝",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Lunch Table",
      description: "You notice a student sitting alone at lunch while your friends make fun of them. How do you respond?",
      options: [
       
        {
          id: "b",
          text: "Join in the teasing to fit in with your friends",
          emoji: "😈",
          isCorrect: false
        },
        {
          id: "c",
          text: "Stay silent to avoid conflict with your friends",
          emoji: "😶",
          isCorrect: false
        },
        {
          id: "d",
          text: "Sit with the student to show your support",
          emoji: "🍽️",
          isCorrect: false
        },
         {
          id: "a",
          text: "Tell your friends to stop and invite the student to join you",
          emoji: "✋",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      title: "Class Discussion",
      description: "During a class discussion, a student with a speech impediment wants to share their opinion but is being talked over. What do you do?",
      options: [
        
        {
          id: "b",
          text: "Laugh at the student's speech impediment",
          emoji: "😆",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore the situation and focus on your own work",
          emoji: "📖",
          isCorrect: false
        },
        {
          id: "a",
          text: "Signal for quiet and encourage the student to finish speaking",
          emoji: "🤫",
          isCorrect: true
        },
        {
          id: "d",
          text: "Raise your hand to support the student's right to speak",
          emoji: "🙌",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "School Event Planning",
      description: "Your class is planning a school event, but students with disabilities weren't consulted about accessibility. What should you do?",
      options: [
        
        {
          id: "b",
          text: "Ignore the accessibility issue to save time",
          emoji: "⏰",
          isCorrect: false
        },
        {
          id: "a",
          text: "Suggest including students with disabilities in the planning process",
          emoji: "♿",
          isCorrect: true
        },
        {
          id: "c",
          text: "Complain that including everyone will make planning more complicated",
          emoji: "😤",
          isCorrect: false
        },
        {
          id: "d",
          text: "Research accessibility requirements on your own",
          emoji: "🔍",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Cultural Celebration",
      description: "Your school is planning a cultural celebration but only includes traditions from the majority culture. How should you respond?",
      options: [
        {
          id: "a",
          text: "Suggest including traditions from all cultures represented in the school",
          emoji: "🌍",
          isCorrect: true
        },
        {
          id: "b",
          text: "Accept that only majority cultures matter",
          emoji: "👑",
          isCorrect: false
        },
        {
          id: "c",
          text: "Stay silent to avoid rocking the boat",
          emoji: "🤐",
          isCorrect: false
        },
        {
          id: "d",
          text: "Create a separate event for other cultures",
          emoji: "🎭",
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
      title="Simulation: School Event"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      gameId="civic-responsibility-teens-18"
      gameType="civic-responsibility"
      totalLevels={20}
      currentLevel={18}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={scenarios.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/civic-responsibility/teens/reflex-teen-inclusion"
      nextGameIdProp="civic-responsibility-teens-19">
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

export default SimulationSchoolEvent;