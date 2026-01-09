import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationTeenCareerFair = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      text: "At a career fair, a teen explores AI, green jobs, and gaming careers. What should guide her choice?",
      options: [
        {
          id: "a",
          text: "What excites her and matches her skills",
          emoji: "🎯",
          isCorrect: true
        },
        {
          id: "b",
          text: "Only highest salary potential",
          emoji: "💰",
          isCorrect: false
        },
        {
          id: "c",
          text: "What her friends are choosing",
          emoji: "👥",
          isCorrect: false
        },
        {
          id: "d",
          text: "Job security and growth prospects",
          emoji: "📈",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "A representative from a green energy company explains their work. How should the teen engage?",
      options: [
        
        {
          id: "a",
          text: "Pretend to be busy and avoid interaction",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "b",
          text: "Only talk about unrelated topics",
          emoji: "🔀",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ask specific questions about the role and growth opportunities",
          emoji: "❓",
          isCorrect: true
        },
        {
          id: "d",
          text: "Exchange contact information for future follow-up",
          emoji: "📇",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "An AI company representative mentions the field is rapidly evolving. How should the teen respond?",
      options: [
        
        {
          id: "a",
          text: "Decide it's too complicated",
          emoji: "🤯",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ask about required skills and how to stay current",
          emoji: "📚",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore the information",
          emoji: "🙉",
          isCorrect: false
        },
        {
          id: "d",
          text: "Ask about internship opportunities",
          emoji: "💼",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "A gaming company representative discusses both creative and technical roles. What's the best approach?",
      options: [
        
        {
          id: "a",
          text: "Focus only on one area without learning about others",
          emoji: "🎯",
          isCorrect: false
        },
        {
          id: "b",
          text: "Dismiss the entire field immediately",
          emoji: "❌",
          isCorrect: false
        },
        {
          id: "c",
          text: "Explore both areas to understand different opportunities",
          emoji: "🔍",
          isCorrect: true
        },
        {
          id: "d",
          text: "Ask about the company culture and work environment",
          emoji: "🏢",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "After the career fair, what should the teen do next?",
      options: [
        {
          id: "a",
          text: "Review materials and follow up with interesting contacts",
          emoji: "✅",
          isCorrect: true
        },
        {
          id: "b",
          text: "Forget about it and do nothing",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "c",
          text: "Immediately choose a career based on one conversation",
          emoji: "🎲",
          isCorrect: false
        },
        {
          id: "d",
          text: "Organize notes and research companies further",
          emoji: "📝",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = getCurrentScenario().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
    }

    setChoices([...choices, { step: currentStep, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentStep < scenarios.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const getCurrentScenario = () => scenarios[currentStep];

  const handleNext = () => {
    navigate("/student/ehe/teens/reflex-teen-alert");
  };

  return (
    <GameShell
      title="Simulation: Teen Career Fair"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={choices.filter(c => c.isCorrect).length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-78"
      gameType="ehe"
      totalLevels={80}
      currentLevel={78}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    
      nextGamePathProp="/student/ehe/teens/reflex-teen-alert"
      nextGameIdProp="ehe-teen-79">
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Step {currentStep + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🏢</div>
            <h3 className="text-2xl font-bold text-white mb-2">Future Career Fair Simulator</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentScenario().text}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {getCurrentScenario().options.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoice(option.id)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
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

export default SimulationTeenCareerFair;