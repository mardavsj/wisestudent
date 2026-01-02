import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateStageOnlineFriends = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-9";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Is it safe to meet online friends in real life?",
      options: [
        { 
          id: "no-dangerous", 
          text: "No - it's dangerous and should be avoided", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          id: "yes-safe", 
          text: "Yes - it's safe if you're careful", 
          emoji: "🙂", 
          isCorrect: false
        },
        { 
          id: "maybe", 
          text: "Maybe - depends on the situation", 
          emoji: "🤔", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Should you share personal information with online friends?",
      options: [
        { 
          id: "yes-trust", 
          text: "Yes - if you trust them", 
          emoji: "🤝", 
          isCorrect: false
        },
        { 
          id: "no-never", 
          text: "No - never share personal info", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          id: "sometimes", 
          text: "Sometimes - if they seem nice", 
          emoji: "😊", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Is it okay to video call with online friends?",
      options: [
        { 
          id: "yes-safe", 
          text: "Yes - video calls are safe", 
          emoji: "🙂", 
          isCorrect: false
        },
        { 
          id: "always", 
          text: "Always - it's fun", 
          emoji: "📹", 
          isCorrect: false
        },
        { 
          id: "only-verified", 
          text: "Only with verified identity", 
          emoji: "🛡️", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Should you accept friend requests from strangers?",
      options: [
        { 
          id: "no-only-known", 
          text: "No - only accept known people", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          id: "yes-nice", 
          text: "Yes - if they seem nice", 
          emoji: "😊", 
          isCorrect: false
        },
        { 
          id: "maybe", 
          text: "Maybe - check their profile first", 
          emoji: "👀", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Can online friendships be as real as offline ones?",
      options: [
        { 
          id: "yes-real", 
          text: "Yes - online friends are real friends", 
          emoji: "❤️", 
          isCorrect: false
        },
        { 
          id: "be-cautious", 
          text: "Be cautious - verify identity first", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          id: "always-trust", 
          text: "Always trust online friends", 
          emoji: "🤝", 
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: selectedChoice,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Debate: Online Friends"
      score={coins}
      subtitle={showResult ? "Debate Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="dcos"
      totalLevels={5}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore === 5}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {getCurrentQuestion().text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default DebateStageOnlineFriends;
