import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PeerPressureSimulation = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const scenarios = [
  {
    id: 1,
    text: "At a party, some friends insist you try alcohol to 'fit in'. How do you respond?",
    options: [
      { id: "a", text: "Drink to avoid being left out", emoji: "🍺", isCorrect: false },
      { id: "b", text: "Politely refuse and explain your choice", emoji: "✋", isCorrect: true },
      { id: "c", text: "Leave quietly without explanation", emoji: "🚶", isCorrect: false },
      { id: "d", text: "Suggest a fun, alcohol-free activity", emoji: "🥤", isCorrect: false }
    ]
  },
  {
    id: 2,
    text: "Friends say, 'Everyone smokes, why don't you?' What's the most effective response?",
    options: [
      { id: "a", text: "Explain the health risks calmly", emoji: "💬", isCorrect: true },
      { id: "b", text: "Say 'Maybe later' to avoid conflict", emoji: "😅", isCorrect: false },
      { id: "c", text: "Firmly say 'I choose not to'", emoji: "✋", isCorrect: false },
      { id: "d", text: "Question their reasoning and choices", emoji: "🤔", isCorrect: false }
    ]
  },
  {
    id: 3,
    text: "A classmate pressures you to try vaping to seem 'cool'. What is your best action?",
    options: [
      { id: "b", text: "Deflect with humor or change the topic", emoji: "💬", isCorrect: false },
      { id: "c", text: "Try it once to stop the pressure", emoji: "💨", isCorrect: false },
      { id: "d", text: "Leave the area and avoid the peer", emoji: "🚪", isCorrect: false },
      { id: "a", text: "Report the pressure to a teacher or counselor", emoji: "📞", isCorrect: true },
    ]
  },
  {
    id: 4,
    text: "Online friends dare you to use substances. What is a safe, proactive approach?",
    options: [
      { id: "a", text: "Accept the dare to prove bravery", emoji: "😊", isCorrect: false },
      { id: "b", text: "Ignore the messages and avoid engagement", emoji: "🙈", isCorrect: false },
      { id: "c", text: "Block the senders and report to platform moderators", emoji: "🚫", isCorrect: true },
      { id: "d", text: "Talk to a trusted adult about the messages", emoji: "👨‍🏫", isCorrect: false }
    ]
  },
  {
    id: 5,
    text: "Which strategy most effectively strengthens resistance to substance peer pressure?",
    options: [
      { id: "b", text: "Developing and sticking to clear personal values", emoji: "💪", isCorrect: true },
      { id: "a", text: "Following the crowd for social approval", emoji: "👥", isCorrect: false },
      { id: "c", text: "Seeking constant peer approval", emoji: "👍", isCorrect: false },
      { id: "d", text: "Practicing refusal skills through role-play", emoji: "🏋️", isCorrect: false }
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
    navigate("/student/health-male/teens/reflex-safe-teen");
  };

  return (
    <GameShell
      title="Simulation: Peer Pressure"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="health-male-teen-88"
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {choices.filter(c => c.isCorrect).length}</span>
          </div>

          <p className="text-white/90 mb-6">
            {scenarios[currentScenario].text}
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

export default PeerPressureSimulation;
