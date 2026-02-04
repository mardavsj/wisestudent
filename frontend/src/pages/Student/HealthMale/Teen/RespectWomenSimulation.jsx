import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RespectWomenSimulation = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [choices, setChoices] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [coins, setCoins] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0); // Track number of correct answers for score
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Hardcode rewards: 3 coins per question, 15 total coins, 30 total XP
  const coinsPerLevel = 3;
  const totalCoins = 15;
  const totalXp = 30;

  const scenarios = [
    {
      id: 1,
      text: "Teen hears friends make rude jokes about girls. Should he join or stop?",
      options: [
        {
          id: "a",
          text: "Join in to fit in",
          emoji: "😏",
          isCorrect: false
        },
        {
          id: "b",
          text: "Stop them politely",
          emoji: "✋",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore and stay silent",
          emoji: "😶",
          isCorrect: false
        },
        {
          id: "d",
          text: "Change the subject respectfully",
          emoji: "💬",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "How should you respond to disrespectful comments about women?",
      options: [
                {
          id: "b",
          text: "Change the subject respectfully",
          emoji: "💬",
          isCorrect: true
        },
        {
          id: "a",
          text: "Call them out directly",
          emoji: "🗣️",
          isCorrect: false
        },
        {
          id: "c",
          text: "Laugh along",
          emoji: "😂",
          isCorrect: false
        },
        {
          id: "d",
          text: "Listen and redirect",
          emoji: "👂",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What shows respect towards women in daily interactions?",
      options: [
        {
          id: "a",
          text: "Opening doors for them",
          emoji: "🚪",
          isCorrect: false
        },
        {
          id: "b",
          text: "Complimenting their appearance",
          emoji: "😊",
          isCorrect: false
        },
        {
          id: "c",
          text: "Listening to their opinions",
          emoji: "👂",
          isCorrect: true
        },
        {
          id: "d",
          text: "Ignoring their ideas",
          emoji: "🤐",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "A girl says 'no' to a date. How should you react?",
      options: [
        {
          id: "a",
          text: "Keep asking until she says yes",
          emoji: "🔁",
          isCorrect: false
        },
        {
          id: "b",
          text: "Accept her answer gracefully",
          emoji: "👍",
          isCorrect: true
        },
        {
          id: "c",
          text: "Get angry",
          emoji: "😠",
          isCorrect: false
        },
        {
          id: "d",
          text: "Try to change her mind",
          emoji: "🤔",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You see a girl struggling with heavy bags. What do you do?",
      options: [
        {
          id: "a",
          text: "Offer to help",
          emoji: "🤝",
          isCorrect: false
        },
        {
          id: "b",
          text: "Laugh at her",
          emoji: "😆",
          isCorrect: false
        },
        {
          id: "c",
          text: "Walk past",
          emoji: "🚶",
          isCorrect: false
        },
        {
          id: "d",
          text: "Ask if assistance is needed",
          emoji: "🙋",
          isCorrect: true
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
    console.log('🎮 RespectWomenSimulation debug:', {
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
      setCoins(prev => prev + 3); // Increment coins when correct (3 coins per question)
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
    navigate("/student/health-male/teens/reflex-respect-check");
  };

  return (
    <GameShell
      title="Simulation: Respect Women"
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={correctAnswers}
      gameId="health-male-teen-68"
      nextGamePathProp="/student/health-male/teens/reflex-respect-check"
      nextGameIdProp="health-male-teen-69"
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
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
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
            Respecting women is fundamental to healthy relationships!
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

export default RespectWomenSimulation;

