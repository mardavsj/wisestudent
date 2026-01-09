import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const WeeklyMealsSimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentDay, setCurrentDay] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0); // Add coins state
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const days = [
    {
      id: 1,
      name: "Monday",
      scenario: "It's the start of the school week. You're busy with morning prep. What breakfast do you choose?",
      options: [
        {
          id: "a",
          text: "Instant noodles with no vegetables",
          emoji: "🍜",
          isCorrect: false
        },
        {
          id: "b",
          text: "Skip breakfast to save time",
          emoji: "⏰",
          isCorrect: false
        },
        {
          id: "c",
          text: "Overnight oats with fruits and nuts",
          emoji: "🥣",
          isCorrect: false
        },
        {
          id: "d",
          text: "Balanced breakfast with idli, sambar, and fruit",
          emoji: "🍛",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      name: "Tuesday",
      scenario: "You have sports practice after school. What do you pack for a post-practice snack?",
      options: [
        {
          id: "d",
          text: "Banana and a handful of nuts",
          emoji: "🍌",
          isCorrect: true
        },
        {
          id: "a",
          text: "Chips and cola",
          emoji: "🍟",
          isCorrect: false
        },
        {
          id: "b",
          text: "Nothing, just rest",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "c",
          text: "Protein bar and electrolyte drink",
          emoji: "🏋️",
          isCorrect: false
        },
        
      ]
    },
    {
      id: 3,
      name: "Wednesday",
      scenario: "It's a busy day with back-to-back classes. What lunch do you choose?",
      options: [
        {
          id: "a",
          text: "Fast food burger and fries",
          emoji: "🍔",
          isCorrect: false
        },
        {
          id: "b",
          text: "Instant noodles again",
          emoji: "🍜",
          isCorrect: false
        },
        {
          id: "d",
          text: "Home-cooked meal with dal, roti, vegetables, and curd",
          emoji: "🍛",
          isCorrect: true
        },
        {
          id: "c",
          text: "Salad with grilled chicken and whole grain bread",
          emoji: "🥗",
          isCorrect: false
        },
        
      ]
    },
    {
      id: 4,
      name: "Thursday",
      scenario: "You're studying for exams late. What do you eat for energy?",
      options: [
        {
          id: "a",
          text: "Chocolate and energy drinks",
          emoji: "🍫",
          isCorrect: false
        },
        {
          id: "d",
          text: "Light healthy snack like sprouts or fruit",
          emoji: "🥗",
          isCorrect: true
        },
        {
          id: "b",
          text: "Heavy meal that makes you sleepy",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "c",
          text: "Whole grain toast with peanut butter",
          emoji: "🍞",
          isCorrect: false
        },
        
      ]
    },
    {
      id: 5,
      name: "Friday",
      scenario: "It's the end of the week. How do you plan your weekend meals?",
      options: [
        {
          id: "a",
          text: "All fast food because it's convenient",
          emoji: "🍔",
          isCorrect: false
        },
        {
          id: "b",
          text: "Skip meals to maintain weight",
          emoji: "📉",
          isCorrect: false
        },
        {
          id: "c",
          text: "Meal prep healthy options for the weekend",
          emoji: "📅",
          isCorrect: false
        },
        {
          id: "d",
          text: "Balanced meals with family, including traditional foods",
          emoji: "👨‍👩‍👧‍👦",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = days[currentDay].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      showCorrectAnswerFeedback(1, true);
      setCoins(prev => prev + 1); // Increment coins when correct
    }

    setChoices([...choices, { day: currentDay, optionId, isCorrect }]);

    setTimeout(() => {
      if (currentDay < days.length - 1) {
        setCurrentDay(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const getCurrentDay = () => days[currentDay];

  const handleNext = () => {
    navigate("/student/health-female/teens/reflex-drink-choice");
  };

  return (
    <GameShell
      title="Simulation: Weekly Meals"
      subtitle={`Day ${currentDay + 1} of ${days.length}: ${days[currentDay].name}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-18"
      gameType="health-female"
      totalLevels={20}
      currentLevel={18}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    
      nextGamePathProp="/student/health-female/teens/reflex-drink-choice"
      nextGameIdProp="health-female-teen-19">
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Day {currentDay + 1}/{days.length}: {days[currentDay].name}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-2xl font-bold text-white mb-2">Weekly Meal Planner</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentDay().scenario}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {getCurrentDay().options.map(option => (
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

export default WeeklyMealsSimulation;