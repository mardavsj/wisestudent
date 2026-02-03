import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const JunkFoodDebate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-16";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
  {
    id: 1,
    text: "Is junk food designed more for taste than nutrition?",
    options: [
      
      {
        id: "b",
        text: "No, nutrition comes first",
        emoji: "🥦"
      },
      {
        id: "c",
        text: "Both are equally important",
        emoji: "⚖️"
      },
      {
        id: "a",
        text: "Yes, taste is the main goal",
        emoji: "👅"
      },
    ],
    correctAnswer: "a",
    explanation: "Most junk foods are engineered for flavor, texture, and craving—not nutritional balance."
  },
  {
    id: 2,
    text: "Should food ads targeting teens be regulated?",
    options: [
      {
        id: "a",
        text: "Yes, they influence choices",
        emoji: "📺"
      },
      {
        id: "b",
        text: "No, ads don’t affect decisions",
        emoji: "🙄"
      },
      {
        id: "c",
        text: "Only ads for kids, not teens",
        emoji: "🧒"
      }
    ],
    correctAnswer: "a",
    explanation: "Teen brains are still developing, and marketing strongly affects cravings and habits."
  },
  {
    id: 3,
    text: "Does junk food affect mental performance?",
    options: [
      {
        id: "b",
        text: "No effect on brain",
        emoji: "🧠"
      },
      {
        id: "a",
        text: "Yes, it can reduce focus",
        emoji: "😵‍💫"
      },
      {
        id: "c",
        text: "Only affects mood, not focus",
        emoji: "🙂"
      }
    ],
    correctAnswer: "a",
    explanation: "Highly processed foods can affect concentration, memory, and learning ability."
  },
  {
    id: 4,
    text: "Is homemade junk (like fries or burgers at home) different?",
    options: [
      {
        id: "a",
        text: "Yes, ingredients are controlled",
        emoji: "🏠"
      },
      {
        id: "b",
        text: "No, junk is junk",
        emoji: "🍔"
      },
      {
        id: "c",
        text: "Only taste matters",
        emoji: "😋"
      }
    ],
    correctAnswer: "a",
    explanation: "Homemade versions usually contain less oil, salt, and additives than fast food."
  },
  {
    id: 5,
    text: "What’s the biggest hidden risk of frequent junk food?",
    options: [
      {
        id: "b",
        text: "Instant weight gain",
        emoji: "⚖️"
      },
      {
        id: "a",
        text: "Habit formation & cravings",
        emoji: "🧠"
      },
      {
        id: "c",
        text: "Food boredom",
        emoji: "😐"
      }
    ],
    correctAnswer: "a",
    explanation: "Junk food trains the brain to crave high salt, sugar, and fat—making healthy food less appealing."
  }
];

  // Set global window variables for useGameFeedback to ensure correct +1 popup
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Force cleanup first to prevent interference from other games
      window.__flashTotalCoins = null;
      window.__flashQuestionCount = null;
      window.__flashPointsMultiplier = 1;
      
      // Small delay to ensure cleanup
      setTimeout(() => {
        // Then set the correct values for this game
        window.__flashTotalCoins = totalCoins;        // 5
        window.__flashQuestionCount = questions.length; // 5
        window.__flashPointsMultiplier = coinsPerLevel; // 1
      }, 50);
      
      return () => {
        // Clean up on unmount
        window.__flashTotalCoins = null;
        window.__flashQuestionCount = null;
        window.__flashPointsMultiplier = 1;
      };
    }
  }, [totalCoins, coinsPerLevel]);

  const handleChoice = (optionId) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: optionId,
      isCorrect: optionId === questions[currentQuestion].correctAnswer
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = optionId === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
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

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/diet-change-journal");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Junk Food Debate"
      score={coins}
      subtitle={showResult ? "Debate Complete!" : `Debate ${currentQuestion + 1} of ${questions.length}`}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/health-male/teens/diet-change-journal"
      nextGameIdProp="health-male-teen-17"
      gameType="health-male"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/health-male/teens"
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Debate {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
              </div>
              
              <h2 className="text-white text-base md:text-lg lg:text-xl mb-4 md:mb-6 text-center">
                {getCurrentQuestion().text}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl md:text-3xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-base md:text-xl mb-2">{option.text}</h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20 text-center flex-1 flex flex-col justify-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-4xl md:text-5xl mb-4">🍔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Junk Food Debate Champion!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} debates correct!
                  You understand the impact of junk food on health!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  Great job! You know how to make informed decisions about food choices!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} debates correct.
                  Remember, understanding nutrition helps make better food choices!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to choose the option that shows understanding of junk food's impact.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JunkFoodDebate;

