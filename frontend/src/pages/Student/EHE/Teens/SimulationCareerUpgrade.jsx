import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationCareerUpgrade = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0); // Add coins state
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      text: "A teen has been working at a company for a year. She notices new technologies being used in her field. What should she do?",
      options: [
       
        {
          id: "b",
          text: "Ignore the new technologies and continue as before",
          emoji: "😴",
          isCorrect: false
        },
         {
          id: "a",
          text: "Take a course to learn the new technologies",
          emoji: "📖",
          isCorrect: true
        },
        {
          id: "c",
          text: "Complain about changes to coworkers",
          emoji: "😠",
          isCorrect: false
        },
        {
          id: "d",
          text: "Research how these technologies apply to her current role",
          emoji: "🔍",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Her manager offers her a chance to lead a small project. How should she respond?",
      options: [
        {
          id: "a",
          text: "Accept the challenge to develop leadership skills",
          emoji: "💪",
          isCorrect: true
        },
        {
          id: "b",
          text: "Decline because it might be too difficult",
          emoji: "😨",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ask someone else to do it for her",
          emoji: "🤷",
          isCorrect: false
        },
        {
          id: "d",
          text: "Ask for guidance on project management best practices",
          emoji: "📘",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "She receives feedback that her presentation skills need improvement. What's the best approach?",
      options: [
        
        {
          id: "b",
          text: "Ignore the feedback to protect her ego",
          emoji: "🛡️",
          isCorrect: false
        },
        {
          id: "c",
          text: "Blame others for not understanding her presentations",
          emoji: "😠",
          isCorrect: false
        },
        {
          id: "d",
          text: "Record herself presenting to identify specific areas for improvement",
          emoji: "📹",
          isCorrect: false
        },
        {
          id: "a",
          text: "Take a public speaking course and practice regularly",
          emoji: "🎤",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "A networking event is happening in her industry. Should she attend?",
      options: [
        {
          id: "a",
          text: "Yes, networking can open new opportunities",
          emoji: "🤝",
          isCorrect: true
        },
        {
          id: "b",
          text: "No, it's a waste of time",
          emoji: "⏰",
          isCorrect: false
        },
        {
          id: "c",
          text: "Only if her boss forces her to go",
          emoji: "👤",
          isCorrect: false
        },
        {
          id: "d",
          text: "Prepare questions in advance to have meaningful conversations",
          emoji: "📝",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "She's considering a certification that could advance her career. What should influence her decision?",
      options: [
        
        {
          id: "b",
          text: "The cheapest option regardless of quality",
          emoji: "💰",
          isCorrect: false
        },
        {
          id: "c",
          text: "What her friends are doing",
          emoji: "👥",
          isCorrect: false
        },
        {
          id: "a",
          text: "Relevance to career goals and industry demand",
          emoji: "🎯",
          isCorrect: true
        },
        {
          id: "d",
          text: "Certifications held by colleagues in senior positions",
          emoji: "📊",
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
      setCoins(prev => prev + 1); // Increment coins when correct
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
    navigate("/student/ehe/teens/reflex-career-alert");
  };

  return (
    <GameShell
      title="Simulation: Career Upgrade"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-98"
      gameType="ehe"
      totalLevels={scenarios.length}
      currentLevel={currentStep + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    
      nextGamePathProp="/student/ehe/teens/reflex-career-alert"
      nextGameIdProp="ehe-teen-99">
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Step {currentStep + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🏢</div>
            <h3 className="text-2xl font-bold text-white mb-2">Career Upgrade Simulator</h3>
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

export default SimulationCareerUpgrade;