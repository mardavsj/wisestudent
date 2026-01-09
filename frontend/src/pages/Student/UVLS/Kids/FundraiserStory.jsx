import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FundraiserStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "uvls-kids-85";
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
      text: "You want to raise money for books. What would you like to do?",
      options: [
        { 
          id: "a", 
          text: "Sell Cookies", 
          emoji: "🍪", 
          // description: "Organize a cookie sale",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Do Nothing", 
          emoji: "😴", 
          // description: "Wait and hope for money",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Make Poster", 
          emoji: "🖼️", 
          // description: "Create a fundraising poster",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You want to fund a park toy. What's the best approach?",
      options: [
        { 
          id: "b", 
          text: "Wait for Magic", 
          emoji: "🪄", 
          // description: "Hope money appears magically",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Lemonade Stand", 
          emoji: "🍋", 
          // description: "Set up a lemonade stand",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Car Wash", 
          emoji: "🚗", 
          // description: "Organize a car wash event",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You want to help animals. How would you raise funds?",
      options: [
       
        { 
          id: "b", 
          text: "Sleep All Day", 
          emoji: "🛌", 
          // description: "Do nothing to help",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Yard Sale", 
          emoji: "🏡", 
          // description: "Organize a yard sale",
          isCorrect: false
        },
         { 
          id: "a", 
          text: "Bake Sale", 
          emoji: "🥧", 
          // description: "Host a bake sale",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "You need to fund a school trip. What would you do?",
      options: [
        { 
          id: "b", 
          text: "Ignore Goal", 
          emoji: "🤷", 
          // description: "Give up on the goal",
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Craft Sale", 
          emoji: "🎨", 
          // description: "Sell handmade crafts",
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Dance Show", 
          emoji: "💃", 
          // description: "Organize a dance performance",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You want to organize a charity run. What's your plan?",
      options: [
        { 
          id: "a", 
          text: "Seek Sponsors", 
          emoji: "🏃", 
          // description: "Find sponsors for runners",
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Stay Home", 
          emoji: "🏠", 
          // description: "Don't organize anything",
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Sell Raffle Tickets", 
          emoji: "🎟️", 
          // description: "Sell raffle tickets for prizes",
          isCorrect: false
        }
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
    navigate("/games/uvls/kids");
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
      title="Fundraiser Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId={gameId}
      nextGamePathProp="/student/uvls/kids/civic-poster"
      nextGameIdProp="uvls-kids-86"
      gameType="uvls"
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

export default FundraiserStory;

