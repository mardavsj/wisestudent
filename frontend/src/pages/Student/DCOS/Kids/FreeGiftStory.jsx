import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FreeGiftStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-kids-41";
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
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "A pop-up says: '🎁 Free iPhone! Just click this link!' What should you do?",
      options: [
        { 
          id: "a", 
          text: "Click to Claim", 
          emoji: "🖱️", 
          
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Close Pop-up", 
          emoji: "🚫", 
          
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Share Link", 
          emoji: "📤", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "A pop-up says: '🤑 You won ₹10,000! Enter your card number to get it!' What should you do?",
      options: [
        { 
          id: "a", 
          text: "Enter Card Details", 
          emoji: "💳", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Try Once", 
          emoji: "😬", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Tell Parent", 
          emoji: "👨‍👩‍👧", 
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "A pop-up says: '📦 Your parcel is waiting! Click to track it!' What should you do?",
      options: [
        { 
          id: "a", 
          text: "Ask Parents First", 
          emoji: "👨‍👩‍👧", 
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Click and Track", 
          emoji: "🔗", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Download App", 
          emoji: "📲", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "A pop-up says: '🎮 Free game coins! Just install this app!' What should you do?",
      options: [
        { 
          id: "a", 
          text: "Install Now", 
          emoji: "⬇️", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Ask Friend", 
          emoji: "🤔", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Ignore Link", 
          emoji: "🚫", 
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "A pop-up says: '💻 You are the lucky winner! Click here to claim now!' What should you do?",
      options: [
        { 
          id: "a", 
          text: "Click to Claim", 
          emoji: "🖱️", 
          isCorrect: false
        },
        { 
          id: "b", 
          text: "Close and Report", 
          emoji: "🚨", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Reply to Ask", 
          emoji: "💬", 
          isCorrect: false
        },
        
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    if (currentQuestion < 0 || currentQuestion >= questions.length) {
      return;
    }

    const currentQ = questions[currentQuestion];
    if (!currentQ || !currentQ.options) {
      return;
    }

    const newChoices = [...choices, { 
      questionId: currentQ.id, 
      choice: selectedChoice,
      isCorrect: currentQ.options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = currentQ.options.find(opt => opt.id === selectedChoice)?.isCorrect;
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

  const handleNext = () => {
    navigate("/games/digital-citizenship/kids");
  };

  const getCurrentQuestion = () => {
    if (currentQuestion >= 0 && currentQuestion < questions.length) {
      return questions[currentQuestion];
    }
    return null;
  };

  const currentQuestionData = getCurrentQuestion();

  return (
    <GameShell
      title="Free Gift Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="dcos-kids-41"
      gameType="dcos"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options && currentQuestionData.options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
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

export default FreeGiftStory;
