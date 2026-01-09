import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationTeenChoices = () => {
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
      title: "Coding Stereotypes",
      description: "Teen is told, 'Girls can't code.' Options: Believe it / Prove them wrong.",
      options: [
        {
          id: "a",
          text: "Believe the stereotype and give up on coding",
          emoji: "😔",
          isCorrect: false
        },
        {
          id: "b",
          text: "Prove them wrong by pursuing coding with determination",
          emoji: "💻",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore the comment and continue learning",
          emoji: "👂",
          isCorrect: false
        },
        {
          id: "d",
          text: "Seek support from mentors and coding communities",
          emoji: "👥",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Career Aspirations",
      description: "A girl wants to become a CEO. Some say, 'Leadership is a man's job.' How should she respond?",
      options: [
        {
          id: "a",
          text: "Change her career goals to fit traditional expectations",
          emoji: "🔄",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Confront those making the comments directly",
          emoji: "😠",
          isCorrect: false
        },
        {
          id: "b",
          text: "Pursue her goals while learning leadership skills",
          emoji: "👑",
          isCorrect: true
        },
        {
          id: "d",
          text: "Focus on developing her expertise in her field",
          emoji: "📈",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Sports Participation",
      description: "A boy wants to join the cheerleading team. Others mock him. What should he do?",
      options: [
        {
         
          id: "a",
          text: "Quit to avoid further teasing",
          emoji: "🏃",
          isCorrect: false
        },
        {
          id: "b",
          text: "Continue participating and ignore the negativity",
          emoji: "🎉",
          isCorrect: true
        },
        {
          id: "c",
          text: "Challenge the stereotypes by educating others",
          emoji: "📢",
          isCorrect: false
        },
        {
          id: "d",
          text: "Join a different team to avoid conflict",
          emoji: "🔄",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Academic Interests",
      description: "A girl excels in physics but is told, 'Science is for boys.' How should she respond?",
      options: [
        {
          id: "a",
          text: "Switch to a 'more appropriate' subject for girls",
          emoji: "📚",
          isCorrect: false
        },
        {
          id: "b",
          text: "Continue studying physics and seek supportive mentors",
          emoji: "🔬",
          isCorrect: true
        },
        {
          id: "c",
          text: "Prove her abilities by competing in science fairs",
          emoji: "🏆",
          isCorrect: false
        },
        {
          id: "d",
          text: "Work twice as hard to silence her critics",
          emoji: "💪",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Leadership Opportunities",
      description: "A boy is nominated for student council president, but some say, 'Boys are too aggressive for leadership.' What should he do?",
      options: [
        {
          id: "a",
          text: "Withdraw from the race to avoid conflict",
          emoji: "🙅",
          isCorrect: false
        },
        {
          id: "b",
          text: "Run for office and demonstrate compassionate leadership",
          emoji: "🏛️",
          isCorrect: true
        },
        {
          id: "c",
          text: "Focus on proving his qualifications instead",
          emoji: "📊",
          isCorrect: false
        },
        {
          id: "d",
          text: "Run with a platform focused on breaking stereotypes",
          emoji: "✊",
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
      title="Simulation: Teen Choices"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      gameId="civic-responsibility-teens-28"
      gameType="civic-responsibility"
      totalLevels={30}
      currentLevel={28}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={scenarios.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/civic-responsibility/teens/reflex-gender-alert"
      nextGameIdProp="civic-responsibility-teens-29">
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

export default SimulationTeenChoices;