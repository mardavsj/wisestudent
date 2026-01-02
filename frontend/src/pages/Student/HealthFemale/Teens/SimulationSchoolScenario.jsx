import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationSchoolScenario = () => {
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
      text: "You're in math class when you suddenly realize you've started your period and didn't bring supplies. What do you do?",
      options: [
        {
          id: "a",
          text: "Stay silent and try to hide the situation",
          emoji: "🤫",
          isCorrect: false
        },
        {
          id: "b",
          text: "Tell the teacher or ask a trusted friend for help",
          emoji: "👩‍🏫",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ask the school counsellor for assistance",
          emoji: "👩‍⚕️",
          isCorrect: false
        },
        {
          id: "d",
          text: "Leave class without telling anyone",
          emoji: "🚪",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend seems uncomfortable and keeps going to the counsellor. You suspect she might have period cramps. How do you help?",
      options: [
        {
          id: "a",
          text: "Tell other classmates about your suspicions",
          emoji: "🗣️",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ignore it completely and mind your own business",
          emoji: "😶",
          isCorrect: false
        },
        {
          id: "c",
          text: "Offer quiet support and suggest she talk to the counselor",
          emoji: "🤗",
          isCorrect: true
        },
        {
          id: "d",
          text: "Ask her privately if she needs help",
          emoji: "💬",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "During PE class, you're asked to run, but you're experiencing severe cramps. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Push through the pain to keep up with classmates",
          emoji: "💪",
          isCorrect: false
        },
        {
          id: "b",
          text: "Skip PE without explanation",
          emoji: "❌",
          isCorrect: false
        },
        {
          id: "c",
          text: "Talk to the PE teacher about modifying activities",
          emoji: "🏃",
          isCorrect: true
        },
        {
          id: "d",
          text: "Ask to sit out and rest for a few minutes",
          emoji: "🪑",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "A classmate makes an embarrassing comment about periods. How do you respond?",
      options: [
        {
          id: "a",
          text: "Laugh along to fit in with the group",
          emoji: "😂",
          isCorrect: false
        },
        {
          id: "b",
          text: "Get angry and confront them aggressively",
          emoji: "😠",
          isCorrect: false
        },
        {
          id: "c",
          text: "Politely educate them about period normalization",
          emoji: "📚",
          isCorrect: true
        },
        {
          id: "d",
          text: "Change the subject to defuse the situation",
          emoji: "🔀",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You need to go to the counsellor for period supplies, but you're worried about being judged. What should you do?",
      options: [
        {
          id: "a",
          text: "Avoid asking and deal with discomfort instead",
          emoji: "😣",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ask a friend to get supplies for you to avoid direct contact",
          emoji: "🤝",
          isCorrect: false
        },
        {
          id: "c",
          text: "Bring your own supplies next time to avoid this situation",
          emoji: "🎒",
          isCorrect: false
        },
        {
          id: "d",
          text: "Remember that counsellors are professionals who help with these needs regularly",
          emoji: "👩‍⚕️",
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

  const getCurrentScenario = () => scenarios[currentScenario];

  const handleNext = () => {
    navigate("/student/health-female/teens/reflex-health-choice");
  };

  return (
    <GameShell
      title="Simulation: School Scenario"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-38"
      gameType="health-female"
      totalLevels={40}
      currentLevel={38}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentScenario().text}
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

export default SimulationSchoolScenario;