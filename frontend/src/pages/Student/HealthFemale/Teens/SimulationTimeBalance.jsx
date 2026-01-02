import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationTimeBalance = () => {
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
      title: "Exam Week + Sports Practice",
      description: "Teen has exams this week and sports practice every day. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Skip sports practice to focus only on studying",
          emoji: "📚",
          isCorrect: false
        },
        {
          id: "b",
          text: "Focus only on sports and hope for the best on exams",
          emoji: "🏃",
          isCorrect: false
        },
        {
          id: "c",
          text: "Discuss with coach about adjusting practice schedule temporarily",
          emoji: "💬",
          isCorrect: false
        },
        {
          id: "d",
          text: "Create a schedule that balances study and practice time",
          emoji: "📅",
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      title: "Friend's Party vs. Study Time",
      description: "A friend invites you to a party during your regular study time. How do you respond?",
      options: [
        {
          id: "a",
          text: "Cancel all study plans to attend the party",
          emoji: "🥳",
          isCorrect: false
        },
         {
          id: "c",
          text: "Invite friend to study together before the party",
          emoji: "👥",
          isCorrect: true
        },
         {
          id: "d",
          text: "Attend the party but reschedule study time for later",
          emoji: "🎉",
          isCorrect: false
        },
        {
          id: "b",
          text: "Decline the party to stick to study schedule",
          emoji: "📚",
          isCorrect: false
        },
       
       
      ]
    },
    {
      id: 3,
      title: "Weekend Plans",
      description: "You have a full weekend with family time, study group, and personal projects. How do you organize?",
      options: [
        {
          id: "d",
          text: "Prioritize tasks and allocate time blocks for each activity",
          emoji: "⏰",
          isCorrect: true
        },
        {
          id: "a",
          text: "Do whatever feels most appealing at the moment",
          emoji: "😊",
          isCorrect: false
        },
        {
          id: "b",
          text: "Try to do everything at once, multitasking constantly",
          emoji: "🔄",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ask family members to help with some tasks",
          emoji: "👨‍👩‍👧",
          isCorrect: false
        },
        
      ]
    },
    {
      id: 4,
      title: "Late Night Dilemma",
      description: "It's 10 PM and you're enjoying a movie, but you planned to sleep by 9:30. What do you do?",
      options: [
        {
          id: "a",
          text: "Stay up until the end of the movie, even if it's very late",
          emoji: "🎬",
          isCorrect: false
        },
        {
          id: "d",
          text: "Finish the current episode and go to sleep 30 minutes late",
          emoji: "📺",
          isCorrect: false
        },
        {
          id: "b",
          text: "Stop the movie immediately and go to sleep",
          emoji: "😴",
          isCorrect: true
        },
        {
          id: "c",
          text: "Set an alarm to remind you to stop in 30 minutes",
          emoji: "⏰",
          isCorrect: false
        },
        
      ]
    },
    {
      id: 5,
      title: "Unexpected Opportunity",
      description: "A mentor offers you a valuable internship opportunity that conflicts with some planned activities. How do you respond?",
      options: [
        {
          id: "a",
          text: "Accept without considering impact on other commitments",
          emoji: "🙂",
          isCorrect: false
        },
        {
          id: "b",
          text: "Decline to avoid disrupting your current schedule",
          emoji: "🙃",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ask for a delayed start date to honor existing commitments",
          emoji: "🗓️",
          isCorrect: false
        },
        {
          id: "d",
          text: "Evaluate the opportunity and adjust your schedule accordingly",
          emoji: "💼",
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
    navigate("/student/health-female/teens/reflex-teen-alert-habits");
  };

  return (
    <GameShell
      title="Simulation: Time Balance"
      subtitle={`${getCurrentScenario().title}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-98"
      gameType="health-female"
      totalLevels={10}
      currentLevel={8}
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

export default SimulationTimeBalance;