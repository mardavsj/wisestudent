import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LostCoinStoryGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-91";
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
    text: "You find a shiny coin near the playground. What is the right thing to do?",
    options: [
      { 
        id: "keep", 
        text: "Keep it for yourself", 
        emoji: "🤫", 
        isCorrect: false
      },
      {
        id: "ask_teacher",
        text: "Give it to the teacher",
        emoji: "🧑‍🏫",
        isCorrect: true
      },
      { 
        id: "ignore", 
        text: "Leave it on the ground", 
        emoji: "🍂", 
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    text: "You find ₹15 in the library. No one is around. What should you do?",
    options: [
      {
        id: "return",
        text: "Give it to the librarian",
        emoji: "📚",
        isCorrect: true
      },
      { 
        id: "hide", 
        text: "Hide it in your bag", 
        emoji: "🎒", 
        isCorrect: false
      },
      
      { 
        id: "spend", 
        text: "Buy snacks immediately", 
        emoji: "🍿", 
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "A friend finds ₹20 and wants to keep it. What do you suggest?",
    options: [
      { 
        id: "keep", 
        text: "Keep it quietly", 
        emoji: "😶", 
        isCorrect: false
      },
     
      { 
        id: "spend", 
        text: "Spend it on games", 
        emoji: "🎮", 
        isCorrect: false
      },
       { 
        id: "return", 
        text: "Try to find the owner together", 
        emoji: "🕵️‍♂️", 
        isCorrect: true
      },
    ]
  },
  {
    id: 4,
    text: "You receive extra change by mistake at a shop. What is the honest choice?",
    options: [
      { 
        id: "keep", 
        text: "Keep the extra money", 
        emoji: "🤑", 
        isCorrect: false
      },
      { 
        id: "return", 
        text: "Return it to the shopkeeper", 
        emoji: "💵", 
        isCorrect: true
      },
      { 
        id: "gift", 
        text: "Give it to a friend", 
        emoji: "🎁", 
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "Why should you act honestly with found money?",
    options: [
      {
        id: "respect",
        text: "It builds trust and shows responsibility",
        emoji: "🤝",
        isCorrect: true
      },
      { 
        id: "buy_more", 
        text: "You can buy more things", 
        emoji: "🛍️", 
        isCorrect: false
      },
      
      { 
        id: "luck", 
        text: "It brings instant luck", 
        emoji: "🍀", 
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
    navigate("/student/finance/kids/money-honesty-quiz-game");
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
      title="Lost Coin Story"
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={5}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="finance-kids-91"
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}
      nextGamePathProp="/student/finance/kids/money-honesty-quiz-game"
      nextGameIdProp="finance-kids-92">
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
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
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

export default LostCoinStoryGame;
