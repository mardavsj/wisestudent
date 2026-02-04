import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ClinicVisitSimulation = () => {
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
    text: "You arrive at the clinic and learn appointments are delayed. What is the smartest response?",
    options: [
      
      {
        id: "b",
        text: "Complain loudly about the delay",
        emoji: "📣",
        isCorrect: false
      },
      {
        id: "a",
        text: "Ask staff for the expected waiting time",
        emoji: "🕒",
        isCorrect: true
      },
      {
        id: "c",
        text: "Leave without informing anyone",
        emoji: "🚪",
        isCorrect: false
      },
      {
        id: "d",
        text: "Assume the appointment is canceled",
        emoji: "❓",
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    text: "During check-in, the nurse asks about your health history. What helps the visit most?",
    options: [
     
      {
        id: "b",
        text: "Only mention today’s problem",
        emoji: "📍",
        isCorrect: false
      },
      {
        id: "c",
        text: "Say you don’t remember anything",
        emoji: "🤷",
        isCorrect: false
      },
      {
        id: "d",
        text: "Let parents answer everything",
        emoji: "👨‍👩‍👧",
        isCorrect: false
      },
       {
        id: "a",
        text: "Share past illnesses and medicines taken",
        emoji: "📋",
        isCorrect: true
      },
    ]
  },
  {
    id: 3,
    text: "The doctor suggests two treatment choices. What is the best next step?",
    options: [
      {
        id: "a",
        text: "Ask about benefits and risks of each option",
        emoji: "⚖️",
        isCorrect: true
      },
      {
        id: "b",
        text: "Choose the cheapest option immediately",
        emoji: "💰",
        isCorrect: false
      },
      {
        id: "c",
        text: "Let the doctor decide without discussion",
        emoji: "🤐",
        isCorrect: false
      },
      {
        id: "d",
        text: "Refuse treatment altogether",
        emoji: "🚫",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "You receive medicine instructions that seem confusing. What should you do?",
    options: [
      
      {
        id: "b",
        text: "Figure it out later at home",
        emoji: "🏠",
        isCorrect: false
      },
      {
        id: "c",
        text: "Take medicine only when symptoms feel strong",
        emoji: "📉",
        isCorrect: false
      },
      {
        id: "a",
        text: "Ask for clarification before leaving",
        emoji: "🗣️",
        isCorrect: true
      },
      {
        id: "d",
        text: "Follow advice from friends instead",
        emoji: "👥",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "Before your next clinic visit, what habit helps doctors help you better?",
    options: [
      {
        id: "a",
        text: "Keep a simple record of symptoms and changes",
        emoji: "📒",
        isCorrect: true
      },
      {
        id: "b",
        text: "Rely only on memory",
        emoji: "🧠",
        isCorrect: false
      },
      {
        id: "c",
        text: "Search random health videos online",
        emoji: "📱",
        isCorrect: false
      },
      {
        id: "d",
        text: "Skip follow-up if pain reduces",
        emoji: "⏭️",
        isCorrect: false
      }
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
    console.log('🎮 ClinicVisitSimulation debug:', {
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
    navigate("/student/health-male/teens/reflex-teen-safety");
  };



  return (
    <GameShell
      title="Simulation: Clinic Visit"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={correctAnswers}
      gameId="health-male-teen-78"
      nextGamePathProp="/student/health-male/teens/reflex-teen-safety"
      nextGameIdProp="health-male-teen-79"
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
            <span className="text-yellow-400 font-bold">Score: {choices.filter(c => c.isCorrect).length}</span>
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
            Great job learning about clinic visits!
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

export default ClinicVisitSimulation;

