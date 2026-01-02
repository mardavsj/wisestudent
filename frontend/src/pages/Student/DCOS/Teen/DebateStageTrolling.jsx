import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DebateStageTrolling = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-14";
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
      text: "Is trolling funny?",
      options: [
        { 
          id: "no-hurts", 
          text: "No - it hurts people and causes harm", 
          emoji: "💔", 
          
          isCorrect: true
        },
        { 
          id: "yes-harmless", 
          text: "Yes - it's just harmless fun", 
          emoji: "😂", 
          isCorrect: false
        },
        { 
          id: "sometimes", 
          text: "Sometimes - depends on the joke", 
          emoji: "🤔", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Should cyberbullying be taken seriously?",
      options: [
        { 
          id: "no-just-online", 
          text: "No - it's just online", 
          emoji: "😐", 
          isCorrect: false
        },
        { 
          id: "yes-real-harm", 
          text: "Yes - it causes real harm", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          id: "maybe", 
          text: "Maybe - depends on the situation", 
          emoji: "🤷", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Is spreading rumors okay?",
      options: [
        { 
          id: "yes-gossip", 
          text: "Yes - it's just gossip", 
          emoji: "😏", 
          isCorrect: false
        },
        { 
          id: "sometimes", 
          text: "Sometimes - if it's true", 
          emoji: "🤔", 
          isCorrect: false
        },
        { 
          id: "no-destroys", 
          text: "No - it destroys reputations", 
          emoji: "🚫", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Should we ignore online hate?",
      options: [
        { 
          id: "yes-ignore", 
          text: "Yes - just ignore it", 
          emoji: "😑", 
          isCorrect: false
        },
        { 
          id: "no-report", 
          text: "No - report and stand up", 
          emoji: "💪", 
          isCorrect: true
        },
        { 
          id: "maybe", 
          text: "Maybe - depends on the comment", 
          emoji: "🤷", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Is peer pressure to bully okay?",
      options: [
        { 
          id: "yes-fit-in", 
          text: "Yes - to fit in", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          id: "no-stand-up", 
          text: "No - stand up for what's right", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          id: "sometimes", 
          text: "Sometimes - if everyone is doing it", 
          emoji: "👥", 
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
      title="Debate: Trolling"
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
                    <p className="text-white/90 text-sm">{option.description}</p>
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

export default DebateStageTrolling;
