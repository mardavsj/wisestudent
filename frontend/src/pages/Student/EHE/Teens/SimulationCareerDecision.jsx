import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationCareerDecision = () => {
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
      text: "Teen has choices: Medicine / Engineering / Arts. What should she decide based on?",
      options: [
       
        {
          id: "b",
          text: "Parents only",
          emoji: "👨‍👩‍👧‍👦",
          isCorrect: false
        },
         {
          id: "a",
          text: "Interests + research",
          emoji: "🔍",
          isCorrect: true
        },
        {
          id: "c",
          text: "Friends only",
          emoji: "👥",
          isCorrect: false
        },
        {
          id: "d",
          text: "Random choice",
          emoji: "🎲",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How should she research career options?",
      options: [
        {
          id: "a",
          text: "Talk to professionals and explore online",
          emoji: "🌐",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoid all research",
          emoji: "🙈",
          isCorrect: false
        },
        {
          id: "c",
          text: "Copy someone else's choice",
          emoji: "📎",
          isCorrect: false
        },
        {
          id: "d",
          text: "Guess based on popularity",
          emoji: "📈",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What factors should influence her decision?",
      options: [
       
        {
          id: "b",
          text: "Only salary expectations",
          emoji: "💰",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ease of study only",
          emoji: "📚",
          isCorrect: false
        },
        {
          id: "d",
          text: "Shortest study duration",
          emoji: "⏱️",
          isCorrect: false
        },
         {
          id: "a",
          text: "Passion, market demand, and skills",
          emoji: "🎯",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "How can she test her career interest?",
      options: [
        {
          id: "a",
          text: "Internships and volunteer work",
          emoji: "💼",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoid all exposure",
          emoji: "🚫",
          isCorrect: false
        },
        {
          id: "c",
          text: "Stick to assumptions",
          emoji: "💭",
          isCorrect: false
        },
        {
          id: "d",
          text: "Rely on movies",
          emoji: "🎬",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What should she do after making a decision?",
      options: [
        
        {
          id: "b",
          text: "Never review the decision",
          emoji: "🛑",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore all advice",
          emoji: "🙉",
          isCorrect: false
        },
        {
          id: "a",
          text: "Create an action plan and seek guidance",
          emoji: "📝",
          isCorrect: true
        },
        {
          id: "d",
          text: "Procrastinate indefinitely",
          emoji: "⏰",
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
    navigate("/games/ehe/teens");
  };

  return (
    <GameShell
      title="Simulation: Career Decision"
      subtitle={`Step ${currentStep + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="ehe-teen-58"
      gameType="ehe"
      totalLevels={scenarios.length}
      currentLevel={currentStep + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/ehe/teens"
      showAnswerConfetti={showAnswerConfetti}
    
      nextGamePathProp="/student/ehe/teens/reflex-teen-direction"
      nextGameIdProp="ehe-teen-59">
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Step {currentStep + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🤔</div>
            <h3 className="text-2xl font-bold text-white mb-2">Career Decision Simulator</h3>
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

export default SimulationCareerDecision;