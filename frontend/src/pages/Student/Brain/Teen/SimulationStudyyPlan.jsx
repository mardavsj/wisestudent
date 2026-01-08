import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';

const SimulationStudyyPlan = () => {
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
      title: "Study Schedule Choice",
      description: "You have limited time to study. Should you study 30 minutes daily or cram for 3 hours once?",
      options: [
        {
          id: "a",
          text: "30 min daily - Consistent daily practice",
          emoji: "📅",
          isCorrect: true
        },
        {
          id: "b",
          text: "Cram 3 hrs once - Intensive single session",
          emoji: "🤯",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip studying - Avoid preparation",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "d",
          text: "Study randomly - No schedule",
          emoji: "🎲",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Exam Preparation",
      description: "What's the best study plan for exam preparation?",
      options: [
        {
          id: "a",
          text: "All-nighters before exam - Last-minute cramming",
          emoji: "🌙",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ignore difficult topics - Avoid challenges",
          emoji: "🤔",
          isCorrect: false
        },
        {
          id: "c",
          text: "Spaced sessions over weeks - Distributed learning",
          emoji: "🗓️",
          isCorrect: true
        },
        {
          id: "d",
          text: "Copy friend's notes - Passive learning",
          emoji: "📚",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Study Breaks",
      description: "Should you include breaks in your study plan?",
      options: [
        {
          id: "a",
          text: "No breaks needed - Study continuously",
          emoji: "💨",
          isCorrect: false
        },
        {
          id: "b",
          text: "One long break only - Minimal rest",
          emoji: "⏱️",
          isCorrect: false
        },
        {
          id: "c",
          text: "Skip studying entirely - No preparation",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "d",
          text: "Yes, regular breaks - Prevent burnout",
          emoji: "🧘",
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      title: "Subject Prioritization",
      description: "How should you prioritize subjects in your study plan?",
      options: [
        {
          id: "a",
          text: "Only easy subjects - Avoid difficulty",
          emoji: "😊",
          isCorrect: false
        },
        {
          id: "b",
          text: "Focus on weak areas - Address challenges",
          emoji: "💪",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore all subjects - No preparation",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "d",
          text: "Study randomly - No structure",
          emoji: "🎲",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Progress Tracking",
      description: "Should you track progress in your study plan?",
      options: [
        {
          id: "a",
          text: "No tracking needed - Study without goals",
          emoji: "🎯",
          isCorrect: false
        },
        {
          id: "b",
          text: "Guess your progress - No measurement",
          emoji: "🤔",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore progress - No awareness",
          emoji: "🙈",
          isCorrect: false
        },
        {
          id: "d",
          text: "Yes, with goals - Monitor progress",
          emoji: "📊",
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
    navigate("/student/brain/teen/reflex-recall-quick");
  };

  const getCurrentScenario = () => scenarios[currentScenario];

  return (
    <GameShell
      title="Simulation: Study Plan"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      gameId="brain-teens-28"
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
      nextGamePathProp="/student/brain/teen/reflex-recall-quick"
      nextGameIdProp="brain-teens-29"
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

export default SimulationStudyyPlan;
