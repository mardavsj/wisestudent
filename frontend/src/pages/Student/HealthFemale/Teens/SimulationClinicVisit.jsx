import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationClinicVisit = () => {
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
      title: "Booking Appointment",
      description: "Teen needs to book a doctor's appointment. What's the best approach?",
      options: [
        {
          id: "a",
          text: "Avoid booking and hope symptoms disappear",
          emoji: "🙈",
          isCorrect: false
        },
        {
          id: "b",
          text: "Call the clinic and explain symptoms clearly",
          emoji: "📞",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ask a parent or guardian for help with booking",
          emoji: "👨‍👩‍👧",
          isCorrect: false
        },
        {
          id: "d",
          text: "Book the latest possible appointment",
          emoji: "⏳",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Waiting Room",
      description: "Teen arrives early but has to wait. How should she handle the wait?",
      options: [
        {
          id: "a",
          text: "Complain loudly about the wait time",
          emoji: "😠",
          isCorrect: false
        },
        {
          id: "b",
          text: "Use the time to prepare questions for the doctor",
          emoji: "📝",
          isCorrect: false
        },
        {
          id: "c",
          text: "Bring a book or quiet activity to pass time",
          emoji: "📚",
          isCorrect: true
        },
        {
          id: "d",
          text: "Leave and come back later without notice",
          emoji: "🏃",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Meeting the Doctor",
      description: "Doctor asks about symptoms. How should the teen respond?",
      options: [
        {
          id: "a",
          text: "Minimize symptoms to avoid worry",
          emoji: "🤫",
          isCorrect: false
        },
        {
          id: "b",
          text: "Exaggerate symptoms to get more attention",
          emoji: "🎭",
          isCorrect: false
        },
       
        {
          id: "d",
          text: "Write down symptoms to ensure nothing is forgotten",
          emoji: "📋",
          isCorrect: false
        },
         {
          id: "c",
          text: "Be honest and specific about symptoms and concerns",
          emoji: "🏆",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      title: "Following Advice",
      description: "Doctor gives health advice and prescribes medication. What should the teen do?",
      options: [
         {
          id: "d",
          text: "Ask questions to understand the treatment plan",
          emoji: "❓",
          isCorrect: true
        },
        {
          id: "a",
          text: "Ignore advice and take medication irregularly",
          emoji: "❌",
          isCorrect: false
        },
        {
          id: "b",
          text: "Set phone reminders to take medication as prescribed",
          emoji: "📱",
          isCorrect: false
        },
        {
          id: "c",
          text: "Follow advice only when convenient",
          emoji: "⏰",
          isCorrect: false
        },
       
      ]
    },
    {
      id: 5,
      title: "Follow-up Care",
      description: "Doctor recommends a follow-up visit. How should the teen respond?",
      options: [
        {
          id: "a",
          text: "Skip the follow-up if feeling better",
          emoji: "🏃",
          isCorrect: false
        },
        {
          id: "b",
          text: "Only attend if symptoms return",
          emoji: "🤒",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ask about the purpose and importance of the follow-up",
          emoji: "🔍",
          isCorrect: false
        },
        {
          id: "d",
          text: "Schedule and attend the follow-up appointment",
          emoji: "📅",
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
    navigate("/student/health-female/teens/reflex-teen-alert");
  };

  return (
    <GameShell
      title="Simulation: Clinic Visit"
      subtitle={`${getCurrentScenario().title}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-78"
      gameType="health-female"
      totalLevels={10}
      currentLevel={8}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    
      nextGamePathProp="/student/health-female/teens/reflex-teen-alert"
      nextGameIdProp="health-female-teen-79">
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

export default SimulationClinicVisit;