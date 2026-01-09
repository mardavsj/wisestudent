import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SimulationTeenBullyScene = () => {
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
      title: "Classroom Bullying",
      description: "A classmate is being teased for their glasses. What do you do?",
      options: [
        {
          id: "a",
          text: "Join in the teasing to fit in with the group",
          emoji: "😆",
          isCorrect: false
        },
        {
          id: "b",
          text: "Tell the students to stop and include the classmate",
          emoji: "✋",
          isCorrect: true
        },
        {
          id: "c",
          text: "Stay silent to avoid being targeted yourself",
          emoji: "🤐",
          isCorrect: false
        },
        {
          id: "d",
          text: "Talk to the teacher about the situation",
          emoji: "👩‍🏫",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Cyberbullying Witness",
      description: "You see someone posting mean comments about another student online. How do you respond?",
      options: [
        {
          id: "a",
          text: "Like or share the comments for entertainment",
          emoji: "😂",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Ignore it completely as it's not your business",
          emoji: "📱",
          isCorrect: false
        },
        {
          id: "b",
          text: "Report the post and privately check on the victim",
          emoji: "🛡️",
          isCorrect: true
        },
        {
          id: "d",
          text: "Comment to defend the person being bullied",
          emoji: "💬",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Physical Bullying",
      description: "You witness a student being pushed and threatened in the hallway. What's your response?",
      options: [
        {
          id: "b",
          text: "Immediately get help from a teacher or adult",
          emoji: "🚨",
          isCorrect: true
        },
        {
          id: "a",
          text: "Record it to show friends later",
          emoji: "📹",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Try to handle it yourself without adult intervention",
          emoji: "💪",
          isCorrect: false
        },
        {
          id: "d",
          text: "Tell other students about what happened",
          emoji: "👥",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Social Exclusion",
      description: "A group is deliberately excluding a new student from activities. How do you act?",
      options: [
        {
          id: "a",
          text: "Go along with the group to maintain your social status",
          emoji: "👑",
          isCorrect: false
        },
        {
          id: "b",
          text: "Invite the new student to join and challenge the exclusion",
          emoji: "🤗",
          isCorrect: true
        },
        {
          id: "c",
          text: "Stay neutral and not get involved either way",
          emoji: "😐",
          isCorrect: false
        },
        {
          id: "d",
          text: "Talk to the excluded student privately",
          emoji: "👂",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Verbal Bullying",
      description: "Someone is being called hurtful names by a group of students. What do you do?",
      options: [
        {
          id: "a",
          text: "Laugh along to avoid becoming a target yourself",
          emoji: "😅",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Walk away and deal with it privately later",
          emoji: "🚶",
          isCorrect: false
        },
        {
          id: "b",
          text: "Tell the group to stop and support the victim",
          emoji: "🗣️",
          isCorrect: true
        },
        {
          id: "d",
          text: "Join a different group to avoid the situation",
          emoji: "🔄",
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
      title="Simulation: Teen Bully Scene"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins} // Use coins for score
      gameId="civic-responsibility-teens-38"
      gameType="civic-responsibility"
      totalLevels={40}
      currentLevel={38}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/civic-responsibility/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={scenarios.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/civic-responsibility/teens/reflex-teen-courage"
      nextGameIdProp="civic-responsibility-teens-39">
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

export default SimulationTeenBullyScene;