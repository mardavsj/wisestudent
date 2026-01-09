import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TeenDaySimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentHour, setCurrentHour] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0); // Add coins state
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const hours = [
    {
      id: 1,
      time: "7:00 AM",
      scenario: "You wake up for school. What's your morning routine?",
      options: [
        {
          id: "a",
          text: "Quick brush and skip shower",
          emoji: "⏰",
          isCorrect: false
        },
        {
          id: "b",
          text: "Skip hygiene completely",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "c",
          text: "Wake up early but scroll phone instead",
          emoji: "📱",
          isCorrect: false
        },
        {
          id: "d",
          text: "Brush teeth, shower, eat breakfast",
          emoji: "🦷",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      time: "10:00 AM",
      scenario: "You feel a bit hungry between classes. What do you choose?",
      options: [
         {
          id: "d",
          text: "Healthy snack like fruit or nuts",
          emoji: "🍎",
          isCorrect: true
        },
        {
          id: "a",
          text: "Chips from vending machine",
          emoji: "🍟",
          isCorrect: false
        },
        {
          id: "b",
          text: "Nothing, just wait for lunch",
          emoji: "🍽️",
          isCorrect: false
        },
        {
          id: "c",
          text: "Energy drink only",
          emoji: "🥤",
          isCorrect: false
        },
       
      ]
    },
    {
      id: 3,
      time: "1:00 PM",
      scenario: "It's lunch time. How do you approach your meal?",
      options: [
        {
          id: "a",
          text: "Fast food from outside",
          emoji: "🍔",
          isCorrect: false
        },
        {
          id: "b",
          text: "Skip lunch to save time",
          emoji: "⏳",
          isCorrect: false
        },
         {
          id: "d",
          text: "Balanced meal with dal, roti, vegetables",
          emoji: "🍛",
          isCorrect: true
        },
        {
          id: "c",
          text: "Eat only snacks instead of a meal",
          emoji: "🍱",
          isCorrect: false
        },
       
      ]
    },
    {
      id: 4,
      time: "4:00 PM",
      scenario: "You're feeling stressed after school. How do you manage?",
      options: [
        {
          id: "a",
          text: "Eat comfort food to feel better",
          emoji: "🍦",
          isCorrect: false
        },
         {
          id: "d",
          text: "Take a walk or do light exercise",
          emoji: "🚶",
          isCorrect: true
        },
        {
          id: "b",
          text: "Just sit and worry about assignments",
          emoji: "😰",
          isCorrect: false
        },
        {
          id: "c",
          text: "Scroll social media for hours",
          emoji: "📱",
          isCorrect: false
        },
       
      ]
    },
    {
      id: 5,
      time: "8:00 PM",
      scenario: "Before bed, what's your evening routine?",
      options: [
        {
          id: "a",
          text: "Just change clothes quickly",
          emoji: "🏃",
          isCorrect: false
        },
        {
          id: "b",
          text: "Stay up late on phone/social media",
          emoji: "📱",
          isCorrect: false
        },
        {
          id: "c",
          text: "Snack late at night and sleep immediately",
          emoji: "📵",
          isCorrect: false
        },
        {
          id: "d",
          text: "Clean face, change into clean clothes, relax",
          emoji: "😴",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = hours[currentHour].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCoins(prev => prev + 1); // Increment coins when correct
    }

    setChoices([...choices, { hour: currentHour, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentHour < hours.length - 1) {
        setCurrentHour(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const getCurrentHour = () => hours[currentHour];

  const handleNext = () => {
    navigate("/student/health-female/teens/reflex-teen-health");
  };

  return (
    <GameShell
      title="Simulation: Teen Day"
      subtitle={`Time ${currentHour + 1} of ${hours.length}: ${hours[currentHour].time}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-28"
      gameType="health-female"
      totalLevels={30}
      currentLevel={28}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    
      nextGamePathProp="/student/health-female/teens/reflex-teen-health"
      nextGameIdProp="health-female-teen-29">
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Time {currentHour + 1}/{hours.length}: {hours[currentHour].time}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-2xl font-bold text-white mb-2">Teen Day Simulator</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentHour().scenario}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {getCurrentHour().options.map(option => (
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

export default TeenDaySimulation;