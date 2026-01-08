import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from '../../Finance/GameShell';
import useGameFeedback from '../../../../hooks/useGameFeedback';

const SimulationExamPrep = () => {
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
    title: "Time Allocation Crisis",
    description: "Two days before the exam, you realize one subject is weak while others are fine. What is the smartest move?",
    options: [
      {
        id: "a",
        text: "Ignore the weak subject and revise only strong ones",
        emoji: "🙈",
        isCorrect: false
      },
      {
        id: "b",
        text: "Divide time strategically, prioritizing weak areas first",
        emoji: "🧩",
        isCorrect: true
      },
      {
        id: "c",
        text: "Study everything randomly without a plan",
        emoji: "🎲",
        isCorrect: false
      },
      {
        id: "d",
        text: "Panic and keep switching subjects every hour",
        emoji: "😵",
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    title: "Digital Distraction Test",
    description: "While studying, your phone keeps buzzing with messages and reels. What choice best protects your preparation?",
    options: [
      
      {
        id: "b",
        text: "Reply instantly to stay socially active",
        emoji: "📱",
        isCorrect: false
      },
      {
        id: "c",
        text: "Mute notifications but keep scrolling anyway",
        emoji: "👀",
        isCorrect: false
      },
      {
        id: "d",
        text: "Study with phone beside you for motivation",
        emoji: "🤳",
        isCorrect: false
      },
      {
        id: "a",
        text: "Check messages during short, planned breaks only",
        emoji: "⏳",
        isCorrect: true
      },
    ]
  },
  {
    id: 3,
    title: "Mock Test Reality Check",
    description: "Your mock test score is much lower than expected. The real exam is close. What should you do?",
    options: [
      {
        id: "a",
        text: "Avoid mock tests to protect confidence",
        emoji: "🙃",
        isCorrect: false
      },
      {
        id: "b",
        text: "Analyze mistakes and adjust revision strategy",
        emoji: "📊",
        isCorrect: true
      },
      {
        id: "c",
        text: "Assume the real exam will be easier",
        emoji: "😌",
        isCorrect: false
      },
      {
        id: "d",
        text: "Memorize answers without understanding concepts",
        emoji: "🧠",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    title: "Peer Pressure Scenario",
    description: "Friends suggest skipping revision to relax before the exam. How should you respond?",
    options: [
      {
        id: "a",
        text: "Skip studying to avoid feeling left out",
        emoji: "👥",
        isCorrect: false
      },
      
      {
        id: "c",
        text: "Cancel all breaks and isolate completely",
        emoji: "🚪",
        isCorrect: false
      },
      {
        id: "b",
        text: "Study first, then relax briefly if time allows",
        emoji: "⚖️",
        isCorrect: true
      },
      {
        id: "d",
        text: "Relax the whole day and hope for luck",
        emoji: "🍀",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    title: "Exam Morning Simulation",
    description: "On exam day, you feel nervous and forget a formula you revised yesterday. What action helps most?",
    options: [
      {
        id: "b",
        text: "Take deep breaths and recall concepts calmly",
        emoji: "🧘",
        isCorrect: true
      },
      {
        id: "a",
        text: "Panic and assume the exam is ruined",
        emoji: "😨",
        isCorrect: false
      },
      
      {
        id: "c",
        text: "Rush to learn new topics minutes before exam",
        emoji: "🏃",
        isCorrect: false
      },
      {
        id: "d",
        text: "Compare preparation with others",
        emoji: "👀",
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
    navigate("/student/brain/teen/reflex-smart-rest");
  };

  const getCurrentScenario = () => scenarios[currentScenario];

  return (
    <GameShell
      title="Simulation: Exam Prep"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      gameId="brain-teens-68"
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
      nextGamePathProp="/student/brain/teen/reflex-smart-rest"
      nextGameIdProp="brain-teens-69"
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

export default SimulationExamPrep;
