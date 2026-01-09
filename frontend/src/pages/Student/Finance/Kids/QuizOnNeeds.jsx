import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const QuizOnNeeds = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "finance-kids-32";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
  {
    id: 1,
    text: "Which item helps your body work every day?",
    options: [
      {
        id: "snack",
        text: "Chips",
        emoji: "🍟",
        isCorrect: false
      },
      {
        id: "water",
        text: "Clean drinking water",
        emoji: "🚰",
        isCorrect: true
      },
      {
        id: "toy",
        text: "Remote control car",
        emoji: "🚗",
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    text: "What do you need to learn properly in school?",
    options: [
      {
        id: "bag",
        text: "School bag and books",
        emoji: "🎒",
        isCorrect: true
      },
      {
        id: "game",
        text: "Mobile games",
        emoji: "📱",
        isCorrect: false
      },
      {
        id: "cartoon",
        text: "Cartoon videos",
        emoji: "📺",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "Which choice helps you stay safe from heat and cold?",
    options: [
      
      {
        id: "cap",
        text: "Fashion cap",
        emoji: "🧢",
        isCorrect: false
      },
      {
        id: "shoes",
        text: "Party shoes",
        emoji: "👟",
        isCorrect: false
      },
      {
        id: "clothes",
        text: "Proper clothes",
        emoji: "🧥",
        isCorrect: true
      },
    ]
  },
  {
    id: 4,
    text: "Which place is a basic need for resting and living?",
    options: [
      {
        id: "house",
        text: "A safe home",
        emoji: "🏠",
        isCorrect: true
      },
      {
        id: "mall",
        text: "Shopping mall",
        emoji: "🏬",
        isCorrect: false
      },
      {
        id: "park",
        text: "Playground",
        emoji: "🌳",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "Why do people choose needs before wants?",
    options: [
      
      {
        id: "fun",
        text: "Wants are more fun",
        emoji: "🎉",
        isCorrect: false
      },
      {
        id: "important",
        text: "Needs are necessary for daily life",
        emoji: "⭐",
        isCorrect: true
      },
      {
        id: "friends",
        text: "Friends like wants",
        emoji: "👫",
        isCorrect: false
      }
    ]
  }
];


  const handleChoice = (option) => {
    if (answered) return; // Prevent multiple clicks
    
    if (currentQuestion < 0 || currentQuestion >= questions.length) {
      return;
    }

    const currentQ = questions[currentQuestion];
    if (!currentQ || !currentQ.options) {
      return;
    }

    setAnswered(true);
    resetFeedback();
    
    const isCorrect = option.isCorrect;
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    const newChoices = [...choices, { 
      questionId: currentQ.id, 
      choice: option.id,
      isCorrect: isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add score and show flash/confetti
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next question or show results after a short delay
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const getCurrentQuestion = () => {
    if (currentQuestion >= 0 && currentQuestion < questions.length) {
      return questions[currentQuestion];
    }
    return null;
  };

  const currentQuestionData = getCurrentQuestion();
  const finalScore = score;

  return (
    <GameShell
      title="Quiz on Needs"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}: Test your knowledge about needs!` : "Quiz Complete!"}
      currentLevel={currentQuestion + 1}
      totalLevels={5}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      score={finalScore}
      gameId={gameId}
      nextGamePathProp="/student/finance/kids/reflex-need-vs-want"
      nextGameIdProp="finance-kids-33"
      gameType="finance"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === 5}>
      <div className="text-center text-white space-y-6">
        {!showResult && currentQuestionData && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
              {currentQuestionData.text}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentQuestionData.options && currentQuestionData.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option)}
                  disabled={answered}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-4xl mb-3">{option.emoji}</div>
                  <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                  <p className="text-white/90 text-sm">{option.description}</p>
                </button>
              ))}
            </div>

            <div className="mt-6 text-lg font-semibold text-white/80">
              Score: {score}/{questions.length}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizOnNeeds;