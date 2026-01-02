import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ScamDebate = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-46";
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
      text: "Are all online offers safe?",
      options: [
        { 
          id: "no-scams", 
          text: "No - many online offers are scams", 
          
          isCorrect: true
        },
        { 
          id: "yes-online", 
          text: "Yes - if it's online, it's safe", 
          
          isCorrect: false
        },
        { 
          id: "maybe", 
          text: "Maybe - depends on the website", 
          
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Should we trust all online deals?",
      options: [
        { 
          id: "yes-deals", 
          text: "Yes - online deals are always good", 
          
          isCorrect: false
        },
        { 
          id: "sometimes", 
          text: "Sometimes - if the price is good", 
          isCorrect: false
        },
        { 
          id: "no-verify", 
          text: "No - verify before trusting", 
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "Is it safe to click all online links?",
      options: [
        { 
          id: "yes-links", 
          text: "Yes - links are usually safe", 
          isCorrect: false
        },
        { 
          id: "maybe", 
          text: "Maybe - if they look legitimate", 
          isCorrect: false
        },
        { 
          id: "no-scam-links", 
          text: "No - many links are scams", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Should we share personal info for online offers?",
      options: [
        { 
          id: "no-careful", 
          text: "No - be very careful with personal info", 
          isCorrect: true
        },
        { 
          id: "yes-ask", 
          text: "Yes - if they ask, it's okay", 
          isCorrect: false
        },
        { 
          id: "sometimes", 
          text: "Sometimes - if it's a trusted site", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Are all online job offers legitimate?",
      options: [
        { 
          id: "yes-jobs", 
          text: "Yes - online jobs are real", 
         
          isCorrect: false
        },
        { 
          id: "maybe", 
          text: "Maybe - if they pay well", 
          isCorrect: false
        },
        { 
          id: "no-verify-jobs", 
          text: "No - many are scams, verify first", 
          isCorrect: true
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
      title="Debate: Online Scams"
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

export default ScamDebate;
