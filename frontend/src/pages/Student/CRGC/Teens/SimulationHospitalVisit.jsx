import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationHospitalVisit = () => {
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
      title: "Hospital Visit",
      description: "You visit your sick classmate in the hospital. When you enter the room, you see them lying in bed looking pale and tired.",
      options: [
        
        {
          id: "b",
          text: "Stay silent because you don't know what to say",
          emoji: "🤐",
          isCorrect: false
        },
        {
          id: "a",
          text: "Cheer them up with encouraging words and a smile",
          emoji: "😊",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore them and check your phone",
          emoji: "📱",
          isCorrect: false
        },
        {
          id: "d",
          text: "Bring them flowers and ask how they're feeling",
          emoji: "🌸",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Gift Decision",
      description: "You want to bring something to make your sick classmate feel better. What do you choose?",
      options: [
       
        {
          id: "b",
          text: "An expensive gadget they asked for",
          emoji: "📱",
          isCorrect: false
        },
        {
          id: "c",
          text: "Nothing - they probably don't want visitors",
          emoji: "❌",
          isCorrect: false
        },
        {
          id: "d",
          text: "Their favorite snack and a small toy",
          emoji: "🍪",
          isCorrect: false
        },
         {
          id: "a",
          text: "A get-well-soon card with a heartfelt message",
          emoji: "💌",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      title: "Conversation Topic",
      description: "During your visit, what's the best thing to talk about?",
      options: [
        
        {
          id: "b",
          text: "Ask detailed questions about their illness and treatment",
          emoji: "🤒",
          isCorrect: false
        },
        {
          id: "a",
          text: "Share positive updates about school and friends",
          emoji: "🏫",
          isCorrect: true
        },
        {
          id: "c",
          text: "Complain about your own problems",
          emoji: "😤",
          isCorrect: false
        },
        {
          id: "d",
          text: "Discuss fun activities you did recently",
          emoji: "🎉",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Visit Duration",
      description: "How long should you stay during your hospital visit?",
      options: [
        {
          id: "a",
          text: "A short but meaningful visit (15-20 minutes)",
          emoji: "⏱️",
          isCorrect: true
        },
        {
          id: "b",
          text: "As long as you want, since you came all this way",
          emoji: "⏳",
          isCorrect: false
        },
        {
          id: "c",
          text: "Just a quick hello and then leave immediately",
          emoji: "🏃",
          isCorrect: false
        },
        {
          id: "d",
          text: "Until they ask you to leave",
          emoji: "⏰",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Follow-up",
      description: "After your hospital visit, what should you do?",
      options: [
        
        {
          id: "b",
          text: "Forget about them until you see them at school",
          emoji: "😶",
          isCorrect: false
        },
        {
          id: "c",
          text: "Tell all your friends about their illness",
          emoji: "🗣️",
          isCorrect: false
        },
        {
          id: "a",
          text: "Check in with them or their family periodically",
          emoji: "📞",
          isCorrect: true
        },
        {
          id: "d",
          text: "Send them a text message the next day",
          emoji: "💬",
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
      title="Simulation: Hospital Visit"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      gameId="civic-responsibility-teens-8"
      gameType="civic-responsibility"
      totalLevels={scenarios.length}
      currentLevel={currentScenario + 1}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={scenarios.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/civic-responsibility/teens/reflex-global-empathy"
      nextGameIdProp="civic-responsibility-teens-9">
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

export default SimulationHospitalVisit;