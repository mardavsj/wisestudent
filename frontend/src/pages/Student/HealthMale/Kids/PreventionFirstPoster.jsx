import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PreventionFirstPoster = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-76";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards: 4 coins per question, 20 total coins, 40 total XP
  const coinsPerLevel = 4;
  const totalCoins = 20;
  const totalXp = 40;

  const [coins, setCoins] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0); // Track number of correct answers for score
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stages = [
    {
      id: 1,
      title: "Hand Washing",
      question: "Which poster shows the best way to stop germs?",
      options: [
        {
          id: "a",
          text: "Wash Hands Often",
          emoji: "🤲",
          
          isCorrect: true
        },
        {
          id: "b",
          text: "Wipe on Pants",
          emoji: "👖",
       
          isCorrect: false
        },
        {
          id: "c",
          text: "Just Use Water",
          emoji: "💧",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Covering Coughs",
      question: "Which poster shows how to cough safely?",
      options: [
        {
          id: "b",
          text: "Cough in Air",
          emoji: "🌬️",
          isCorrect: false
        },
        {
          id: "c",
          text: "Cough in Hands",
          emoji: "🤲",
          isCorrect: false
        },
        {
          id: "a",
          text: "Vampire Cough",
          emoji: "🧛",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      title: "Healthy Eating",
      question: "Which poster shows food that fights sickness?",
      options: [
        {
          id: "b",
          text: "Soda Pop",
          emoji: "🥤",
          isCorrect: false
        },
        {
          id: "a",
          text: "Fruits & Veggies",
          emoji: "🍎",
          isCorrect: true
        },
        {
          id: "c",
          text: "Only Candy",
          emoji: "🍭",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Active Play",
      question: "Which poster shows how to keep your body strong?",
      options: [
        {
          id: "c",
          text: "Sleep All Day",
          emoji: "🛌",
          isCorrect: false
        },
        {
          id: "b",
          text: "Watch TV All Day",
          emoji: "📺",
          isCorrect: false
        },
        {
          id: "a",
          text: "Play Outside",
          emoji: "⚽",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      title: "Sleep Well",
      question: "Which poster shows good sleep habits?",
      options: [
        {
          id: "b",
          text: "Sleep with Lights On",
          emoji: "💡",
          isCorrect: false
        },
        {
          id: "a",
          text: "Early Bedtime",
          emoji: "🌙",
          isCorrect: true
        },
        {
          id: "c",
          text: "Stay Up Late",
          emoji: "🦉",
          isCorrect: false
        }
      ]
    }
  ];
  
  // Set global window variables for useGameFeedback
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__flashTotalCoins = totalCoins;
      window.__flashQuestionCount = stages.length;
      window.__flashPointsMultiplier = coinsPerLevel;
      
      return () => {
        // Clean up on unmount
        window.__flashTotalCoins = null;
        window.__flashQuestionCount = null;
        window.__flashPointsMultiplier = 1;
      };
    }
  }, [totalCoins, coinsPerLevel, stages.length]);

  // Debug logging
  useEffect(() => {
    console.log('🎮 PreventionFirstPoster debug:', {
      correctAnswers,
      coins,
      coinsPerLevel,
      totalCoins,
      questionsLength: stages.length,
      gameFinished
    });
  }, [correctAnswers, coins, coinsPerLevel, totalCoins, gameFinished, stages.length]);

  // Debug: Log GameShell props
  useEffect(() => {
    if (gameFinished) {
      console.log('🎮 GameShell props:', {
        score: correctAnswers,
        maxScore: stages.length,
        coinsPerLevel,
        totalCoins,
        totalXp,
        totalLevels: stages.length
      });
    }
  }, [gameFinished, correctAnswers, coinsPerLevel, totalCoins, totalXp, stages.length]);

  const handleOptionSelect = (option) => {
    if (option.isCorrect) {
      setCoins(prev => prev + 4); // Increment coins when correct (4 coins per question)
      setCorrectAnswers(prev => prev + 1); // Increment correct answers count
      // Show feedback after state updates
      setTimeout(() => {
        showCorrectAnswerFeedback(1, true);
      }, 50);

      setTimeout(() => {
        if (currentStage < stages.length - 1) {
          setCurrentStage(prev => prev + 1);
        } else {
          setGameFinished(true);
        }
      }, 1500);
    } else {
      // Show feedback for incorrect answer and move to next question
      showCorrectAnswerFeedback(0, false);
      
      setTimeout(() => {
        if (currentStage < stages.length - 1) {
          setCurrentStage(prev => prev + 1);
        } else {
          setGameFinished(true);
        }
      }, 1500);
    }
  };

  const handleNext = () => {
    navigate("/student/health-male/kids/safety-journal");
  };

  const currentS = stages[currentStage];

  return (
    <GameShell
      title="Prevention First Poster"
      subtitle={`Poster ${currentStage + 1} of ${stages.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={correctAnswers}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/safety-journal"
      nextGameIdProp="health-male-kids-77"
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={stages.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      totalLevels={stages.length}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">{currentS.title}</h3>
            <p className="text-white/90 text-lg">{currentS.question}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentS.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option)}
                className="bg-white/10 hover:bg-white/20 p-6 rounded-xl border border-white/20 transition-all transform hover:scale-105 flex flex-col items-center gap-4 group"
                disabled={gameFinished}
              >
                <div className="text-6xl group-hover:scale-110 transition-transform">
                  {option.emoji}
                </div>
                <div className="text-white font-bold text-xl text-center">
                  {option.text}
                </div>
                <p className="text-white/70 text-sm text-center">{option.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
      {gameFinished && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Poster Complete!</h3>
          <p className="text-xl text-white/90 mb-6">
            You finished the game with {correctAnswers} out of {stages.length} correct
          </p>
          <p className="text-xl text-white/90 mb-6">
            You earned {coins} coins!
          </p>
          <p className="text-white/80 mb-8">
            Great job learning about prevention and staying healthy!
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

export default PreventionFirstPoster;

