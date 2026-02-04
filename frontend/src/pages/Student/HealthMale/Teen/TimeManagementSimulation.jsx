import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const TimeManagementSimulation = () => {
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
    text: "A teen has exams, sports practice, and a part-time hobby. What’s the best approach?",
    options: [
      { id: "a", text: "Ignore some tasks", emoji: "🙈", isCorrect: false },
      { id: "b", text: "Balance time carefully", emoji: "⚖️", isCorrect: true },
      { id: "c", text: "Do only fun activities", emoji: "🎉", isCorrect: false },
      { id: "d", text: "Multitask everything at once", emoji: "🤹", isCorrect: false }
    ]
  },
  {
    id: 2,
    text: "Overwhelmed with multiple assignments and extracurriculars, what should you do first?",
    options: [
      { id: "a", text: "Work randomly on any task", emoji: "🎲", isCorrect: false },
      { id: "b", text: "Procrastinate and hope for the best", emoji: "😴", isCorrect: false },
      { id: "c", text: "Make a detailed schedule", emoji: "📅", isCorrect: true },
      { id: "d", text: "Ask friends to do it for you", emoji: "👥", isCorrect: false }
    ]
  },
  {
    id: 3,
    text: "Which habit helps maximize schoolwork efficiency?",
    options: [
      { id: "a", text: "Study intensively only before exams", emoji: "📚", isCorrect: false },
      { id: "b", text: "Copy classmates’ notes", emoji: "📝", isCorrect: false },
      { id: "d", text: "Spend time on unrelated hobbies during study hours", emoji: "🎨", isCorrect: false },
      { id: "c", text: "Daily study routine with breaks", emoji: "📖", isCorrect: true },
    ]
  },
  {
    id: 4,
    text: "Two important events clash: a school debate and a sports match. How should a teen respond?",
    options: [
      { id: "a", text: "Try to attend both without preparation", emoji: "🤹", isCorrect: false },
      { id: "b", text: "Cancel both events", emoji: "❌", isCorrect: false },
      { id: "c", text: "Seek advice and prioritize based on goals", emoji: "⭐", isCorrect: true },
      { id: "d", text: "Let friends decide for you", emoji: "👥", isCorrect: false }
    ]
  },
  {
    id: 5,
    text: "What’s the ultimate key to mastering time management for teens?",
    options: [
      { id: "c", text: "Consistency with flexible planning", emoji: "📋", isCorrect: true },
      { id: "a", text: "Avoid planning to stay flexible", emoji: "🎲", isCorrect: false },
      { id: "b", text: "Rigidly stick to a plan without adjustments", emoji: "📏", isCorrect: false },
      { id: "d", text: "Working nonstop without breaks", emoji: "💼", isCorrect: false }
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
    console.log('🎮 TimeManagementSimulation debug:', {
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
    navigate("/student/health-male/teens/reflex-teen-alert");
  };

  return (
    <GameShell
      title="Simulation: Time Management"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={correctAnswers}
      gameId="health-male-teen-98"
      nextGamePathProp="/student/health-male/teens/reflex-teen-alert"
      nextGameIdProp="health-male-teen-99"
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

          <h2 className="text-xl font-semibold text-white mb-4">
            Time Management Simulation
          </h2>
          
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
            Good time management skills will help you succeed in life!
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

export default TimeManagementSimulation;

