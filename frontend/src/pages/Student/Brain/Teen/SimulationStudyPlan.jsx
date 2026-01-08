import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';

const SimulationStudyPlan = () => {
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
      title: "Study Environment",
      description: "You have 2 hours available for studying. Which environment will help you focus best?",
      options: [
        {
          id: "a",
          text: "Quiet study area - Dedicated study space with no distractions",
          emoji: "🤫",
          isCorrect: true
        },
        {
          id: "b",
          text: "Phone + book - Study with phone nearby for breaks",
          emoji: "📱",
          isCorrect: false
        },
        {
          id: "c",
          text: "Study with TV on - Background entertainment while studying",
          emoji: "📺",
          isCorrect: false
        },
        {
          id: "d",
          text: "Study in bed - Comfortable but not ideal for focus",
          emoji: "🛏️",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Overwhelmed with Assignments",
      description: "You're feeling overwhelmed with assignments. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Procrastinate and do last minute - Delay work until deadline",
          emoji: "⏰",
          isCorrect: false
        },
        {
          id: "b",
          text: "Break tasks into smaller parts - Create manageable chunks",
          emoji: "🧩",
          isCorrect: true
        },
        {
          id: "c",
          text: "Panic and stress out - Feel anxious about workload",
          emoji: "😰",
          isCorrect: false
        },
        {
          id: "d",
          text: "Ignore some assignments - Skip difficult tasks",
          emoji: "😒",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Exam Week Time Management",
      description: "During exam week, how should you manage your time?",
      options: [
        {
          id: "a",
          text: "Cram all night before - Study intensively at last minute",
          emoji: "🌙",
          isCorrect: false
        },
        {
          id: "b",
          text: "Study randomly when you feel like it - No structured approach",
          emoji: "🎲",
          isCorrect: false
        },
        {
          id: "c",
          text: "Create study schedule - Plan study sessions in advance",
          emoji: "📅",
          isCorrect: true
        },
        {
          id: "d",
          text: "Skip studying and hope for best - Minimal preparation",
          emoji: "🤞",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Study Break",
      description: "You've been studying for 90 minutes straight. What should you do?",
      options: [
        {
          id: "a",
          text: "Keep studying without break - Push through fatigue",
          emoji: "💨",
          isCorrect: false
        },
        {
          id: "b",
          text: "Stop studying for the day - End session early",
          emoji: "🛑",
          isCorrect: false
        },
        {
          id: "c",
          text: "Eat sugary snacks for energy - Quick energy boost",
          emoji: "🍭",
          isCorrect: false
        },
        {
          id: "d",
          text: "Take a 10-minute break - Rest to refresh your mind",
          emoji: "🧘",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      title: "Difficult Subject Preparation",
      description: "How should you prepare for a difficult subject?",
      options: [
        {
          id: "a",
          text: "Start early and review regularly - Consistent preparation approach",
          emoji: "⏰",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoid and focus on easy subjects - Skip challenging material",
          emoji: "😲",
          isCorrect: false
        },
        {
          id: "c",
          text: "Intense single session - One long study period",
          emoji: "🔥",
          isCorrect: false
        },
        {
          id: "d",
          text: "Copy friend's notes last minute - Passive learning approach",
          emoji: "📚",
          isCorrect: false
        }
      ]
    }
  ];

  const getCurrentScenario = () => scenarios[currentScenario];

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
    navigate("/student/brain/teen/reflex-distraction-alert");
  };

  return (
    <GameShell
      title="Simulation: Study Plan"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      gameId="brain-teens-18"
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
      nextGamePathProp="/student/brain/teen/reflex-distraction-alert"
      nextGameIdProp="brain-teens-19"
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

export default SimulationStudyPlan;