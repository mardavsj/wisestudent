import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';

const SimulationNegativeDay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0); // Add coins state

  const scenarios = [
    {
      id: 1,
      title: "Bad Day at School",
      description: "You had a bad day at school. What's the best approach to handle your feelings?",
      options: [
        {
          id: "a",
          text: "Stay upset - Dwell on negative feelings",
          emoji: "😔",
          isCorrect: false
        },
       
        {
          id: "c",
          text: "Quit tasks - Give up on responsibilities",
          emoji: "🏃",
          isCorrect: false
        },
         {
          id: "b",
          text: "Think of positives - Reframe the situation",
          emoji: "😊",
          isCorrect: true
        },
        {
          id: "d",
          text: "Ignore the day - Avoid dealing with it",
          emoji: "😒",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Bad Grade Response",
      description: "You got a bad grade. How should you respond?",
      options: [
        {
          id: "a",
          text: "Blame the teacher - Avoids responsibility",
          emoji: "😠",
          isCorrect: false
        },
        {
          id: "b",
          text: "Learn from mistakes and improve - Growth mindset approach",
          emoji: "📚",
          isCorrect: true
        },
        {
          id: "c",
          text: "Give up on the subject - No growth",
          emoji: "❌",
          isCorrect: false
        },
        {
          id: "d",
          text: "Ignore the grade - Doesn't address problem",
          emoji: "🙄",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Friends Excluded You",
      description: "Friends excluded you. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Seek revenge - Escalates conflict",
          emoji: "⚔️",
          isCorrect: false
        },
        {
          id: "b",
          text: "Isolate completely - Limits social connections",
          emoji: "🏠",
          isCorrect: false
        },
        {
          id: "c",
          text: "Blame yourself harshly - Damages self-esteem",
          emoji: "💔",
          isCorrect: false
        },
        {
          id: "d",
          text: "Reflect, then find supportive friends - Healthy response",
          emoji: "🤝",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      title: "Everything Going Wrong",
      description: "Everything seems to go wrong. What should you do?",
      options: [
        {
          id: "a",
          text: "Find things to be grateful for - Shifts perspective",
          emoji: "🙏",
          isCorrect: true
        },
        {
          id: "b",
          text: "Dwell on everything wrong - Maintains negative state",
          emoji: "😔",
          isCorrect: false
        },
        {
          id: "c",
          text: "Blame everything external - No personal control",
          emoji: "🤷‍♂️",
          isCorrect: false
        },
        {
          id: "d",
          text: "Quit everything - Gives up control",
          emoji: "🏳️",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Ending a Negative Day",
      description: "After a negative day, how should you end it?",
      options: [
        {
          id: "a",
          text: "Dwell on all the negatives - Maintains negative state",
          emoji: "😔",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ignore the day completely - Misses learning",
          emoji: "🤔",
          isCorrect: false
        },
        {
          id: "c",
          text: "Blame others for everything - No personal growth",
          emoji: "😠",
          isCorrect: false
        },
        {
          id: "d",
          text: "Reflect on lessons and plan better tomorrow - Constructive approach",
          emoji: "📝",
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

  const handleNext = () => {
    navigate("/student/brain/teen/reflex-mindset-check");
  };

  const getCurrentScenario = () => scenarios[currentScenario];

  return (
    <GameShell
      title="Simulation: Negative Day"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      gameId="brain-teens-58"
      gameType="brain"
      totalLevels={scenarios.length}
      currentLevel={currentScenario + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/brain-health/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={scenarios.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/brain/teen/reflex-mindset-check"
      nextGameIdProp="brain-teens-59"
    >
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

export default SimulationNegativeDay;
