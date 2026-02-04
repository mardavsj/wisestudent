import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PeerPressureSimulation = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0); // Track number of correct answers for score
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // Hardcode rewards: 4 coins per question, 20 total coins, 40 total XP
  const coinsPerLevel = 4;
  const totalCoins = 20;
  const totalXp = 40;

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
  
  // Set global window variables for useGameFeedback
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__flashTotalCoins = totalCoins;
      window.__flashQuestionCount = scenarios.length;
      window.__flashPointsMultiplier = coinsPerLevel;
      
      return () => {
        // Clean up on unmount
        window.__flashTotalCoins = null;
        window.__flashQuestionCount = null;
        window.__flashPointsMultiplier = 1;
      };
    }
  }, [totalCoins, coinsPerLevel, scenarios.length]);

  // Debug logging
  useEffect(() => {
    console.log('🎮 PeerPressureSimulation debug:', {
      correctAnswers,
      coins,
      coinsPerLevel,
      totalCoins,
      questionsLength: scenarios.length,
      gameFinished
    });
  }, [correctAnswers, coins, coinsPerLevel, totalCoins, gameFinished, scenarios.length]);

  // Debug: Log GameShell props
  useEffect(() => {
    if (gameFinished) {
      console.log('🎮 GameShell props:', {
        score: correctAnswers,
        maxScore: scenarios.length,
        coinsPerLevel,
        totalCoins,
        totalXp,
        totalLevels: scenarios.length
      });
    }
  }, [gameFinished, correctAnswers, coinsPerLevel, totalCoins, totalXp, scenarios.length]);


  const handleChoice = (optionId) => {
    const selectedOption = scenarios[currentScenario].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setCoins(prev => prev + 4); // Increment coins when correct (4 coins per question)
      setCorrectAnswers(prev => prev + 1); // Increment correct answers count
      // Show feedback after state updates
      setTimeout(() => {
        showCorrectAnswerFeedback(1, true);
      }, 50);
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
      score={correctAnswers}
      gameId="health-male-teen-88"
      nextGamePathProp="/student/health-male/teens/reflex-safe-teen"
      nextGameIdProp="health-male-teen-89"
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={scenarios.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      totalLevels={scenarios.length}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
            <span className="text-yellow-400 font-bold">Score: {correctAnswers}</span>
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
      {gameFinished && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Simulation Complete!</h3>
          <p className="text-xl text-white/90 mb-6">
            You finished the game with {correctAnswers} out of {scenarios.length} correct
          </p>
          <p className="text-xl text-white/90 mb-6">
            You earned {coins} coins!
          </p>
          <p className="text-white/80 mb-8">
            Great job learning how to handle peer pressure situations!
          </p>
          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all transform hover:scale-105"
          >
            Next Challenge
          </button>
        </div>
      )}
    </GameShell>
  );
};

export default PeerPressureSimulation;

