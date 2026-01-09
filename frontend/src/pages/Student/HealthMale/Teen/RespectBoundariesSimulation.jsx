import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RespectBoundariesSimulation = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      day: "Monday",
      icon: "📅",
      situation: "A friend asks to see your private messages. What do you do?",
      options: [
        {
          id: "a",
          text: "Show them the messages",
          emoji: "📱",
          isHealthy: false
        },
        {
          id: "b",
          text: "Politely decline",
          emoji: "✋",
          isHealthy: true
        },
        {
          id: "c",
          text: "Get angry and yell",
          emoji: "😡",
          isHealthy: false
        },
        {
          id: "d",
          text: "Change the subject",
          emoji: "💬",
          isHealthy: false
        }
      ]
    },
    {
      id: 2,
      day: "Tuesday",
      icon: "📆",
      situation: "Someone tries to hug you, but you're not comfortable. How do you respond?",
      options: [
        {
          id: "a",
          text: "Push them away forcefully",
          emoji: "💪",
          isHealthy: false
        },
        {
          id: "b",
          text: "Stand still and tolerate it",
          emoji: "😐",
          isHealthy: false
        },
        {
          id: "c",
          text: "Step back and say 'stop'",
          emoji: "🛑",
          isHealthy: true
        },
        {
          id: "d",
          text: "Ignore the situation",
          emoji: "🙈",
          isHealthy: false
        }
      ]
    },
    {
      id: 3,
      day: "Wednesday",
      icon: "🗓️",
      situation: "A classmate wants to borrow your homework to copy. What's your response?",
      options: [
        {
          id: "a",
          text: "Let them copy without question",
          emoji: "📋",
          isHealthy: false
        },
        {
          id: "b",
          text: "Say no and explain why",
          emoji: "🙅",
          isHealthy: true
        },
        {
          id: "c",
          text: "Lie and say you didn't do it",
          emoji: "🤥",
          isHealthy: false
        },
        {
          id: "d",
          text: "Give them a fake copy",
          emoji: "👻",
          isHealthy: false
        }
      ]
    },
    {
      id: 4,
      day: "Thursday",
      icon: "📅",
      situation: "A friend wants to post a photo of you online without asking. How do you react?",
      options: [
        {
          id: "a",
          text: "Let them post it",
          emoji: "📸",
          isHealthy: false
        },
        {
          id: "b",
          text: "Ask to see it first",
          emoji: "👁️",
          isHealthy: true
        },
        {
          id: "c",
          text: "Get jealous and argue",
          emoji: "😠",
          isHealthy: false
        },
        {
          id: "d",
          text: "Post it yourself first",
          emoji: "📲",
          isHealthy: false
        }
      ]
    },
    {
      id: 5,
      day: "Friday",
      icon: "📆",
      situation: "Someone keeps entering your personal space despite you stepping back. What do you do?",
      options: [
        {
          id: "a",
          text: "Tell a trusted adult",
          emoji: "👨‍🏫",
          isHealthy: true
        },
        {
          id: "b",
          text: "Keep moving away silently",
          emoji: "🚶",
          isHealthy: false
        },
        {
          id: "c",
          text: "Yell at them publicly",
          emoji: "📢",
          isHealthy: false
        },
        {
          id: "d",
          text: "Ignore it completely",
          emoji: "😴",
          isHealthy: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    const selectedOption = scenarios[currentScenario].options.find(opt => opt.id === optionId);
    const isHealthy = selectedOption.isHealthy;

    if (isHealthy) {
      showCorrectAnswerFeedback(1, true);
      setCoins(prev => prev + 1); // Increment coins when correct
    }

    setChoices([...choices, { scenario: currentScenario, optionId, isHealthy }]);

    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };



  const handleNext = () => {
    navigate("/student/health-male/teens/reflex-health-choice-teen");
  };

  return (
    <GameShell
      title="Simulation: Respect Boundaries (Teen)"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-teen-38"
      nextGamePathProp="/student/health-male/teens/reflex-shaving-teen"
      nextGameIdProp="health-male-teen-39"
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={scenarios.length}
      coinsPerLevel={1}
      totalCoins={5}
      totalXp={10}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>

          <h2 className="text-xl font-semibold text-white mb-4">
            {scenarios[currentScenario].day} Social Situation
          </h2>
          
          <p className="text-white/90 mb-6">
            {scenarios[currentScenario].situation}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {scenarios[currentScenario].options.map(option => (
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

export default RespectBoundariesSimulation;

