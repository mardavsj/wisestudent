import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationPeerTest = () => {
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
      title: "Dress Teasing",
      description: "Friends tease a girl for her simple dress. What do you do?",
      options: [
        {
          id: "a",
          text: "Stay silent to avoid conflict",
          emoji: "🤐",
          isCorrect: false
        },
        {
          id: "b",
          text: "Defend her and tell friends to stop",
          emoji: "🛡️",
          isCorrect: true
        },
        {
          id: "c",
          text: "Talk to the girl privately to offer support",
          emoji: "💬",
          isCorrect: false
        },
        {
          id: "d",
          text: "Join them to fit in",
          emoji: "👥",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Academic Help",
      description: "A classmate struggles with homework. What's your response?",
      options: [
        {
          id: "a",
          text: "Ignore them and focus only on yourself",
          emoji: "📱",
          isCorrect: false
        },
        {
          id: "b",
          text: "Make fun of their struggles",
          emoji: "😂",
          isCorrect: false
        },
        {
          id: "c",
          text: "Offer to help or study together",
          emoji: "🤝",
          isCorrect: true
        },
        {
          id: "d",
          text: "Suggest they ask the teacher for help",
          emoji: "👩‍🏫",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Social Exclusion",
      description: "Friends plan to exclude someone from a group activity. What do you do?",
      options: [
        {
          id: "a",
          text: "Go along with the plan to keep friends happy",
          emoji: "😊",
          isCorrect: false
        },
        {
          id: "b",
          text: "Avoid the situation entirely",
          emoji: "🏃",
          isCorrect: false
        },
        {
          id: "c",
          text: "Speak up for inclusion and invite everyone",
          emoji: "🤗",
          isCorrect: true
        },
        {
          id: "d",
          text: "Suggest an alternative activity that includes everyone",
          emoji: "🎉",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Cheating Temptation",
      description: "Friends ask you to share answers during a test. What's your choice?",
      options: [
        {
          id: "a",
          text: "Share answers to be a good friend",
          emoji: "📋",
          isCorrect: false
        },
        {
          id: "b",
          text: "Report them to the teacher",
          emoji: "👩‍🏫",
          isCorrect: false
        },
        {
          id: "c",
          text: "Explain why cheating is harmful to everyone",
          emoji: "📖",
          isCorrect: false
        },
        {
          id: "d",
          text: "Refuse and encourage honest effort",
          emoji: "✅",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      title: "Cyberbullying",
      description: "You see friends posting mean comments online. What do you do?",
      options: [
        {
          id: "a",
          text: "Like or share the comments for popularity",
          emoji: "👍",
          isCorrect: false
        },
        {
          id: "b",
          text: "Ignore it completely",
          emoji: "🙈",
          isCorrect: false
        },
        {
          id: "c",
          text: "Privately message the person being bullied to offer support",
          emoji: "💌",
          isCorrect: false
        },
        {
          id: "d",
          text: "Tell them to stop and report serious threats",
          emoji: "✋",
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
    navigate("/student/health-female/teens/reflex-teen-esteem");
  };

  return (
    <GameShell
      title="Simulation: Peer Test"
      subtitle={`${getCurrentScenario().title}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId="health-female-teen-68"
      gameType="health-female"
      totalLevels={10}
      currentLevel={8}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
    
      nextGamePathProp="/student/health-female/teens/reflex-teen-esteem"
      nextGameIdProp="health-female-teen-69">
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

export default SimulationPeerTest;