import React, { useState } from "react";
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
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
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


  const handleOptionSelect = (optionId) => {
    if (selectedOption || showFeedback) return;
    
    resetFeedback(); // Reset any existing feedback
    
    setSelectedOption(optionId);
    const isCorrect = optionId === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setCoins(prev => prev + 1); // 1 coin per correct answer
      showCorrectAnswerFeedback(1, true);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        setGameFinished(true);
      }
    }, 2000);
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/diet-change-journal");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Junk Food Debate"
subtitle={!gameFinished ? `Debate ${currentQuestion + 1} of ${questions.length}` : "Debate Complete!"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Score: {coins}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🍔</div>
            <h3 className="text-2xl font-bold text-white mb-2">Junk Food Debate</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getCurrentQuestion().options.map(option => {
              const isSelected = selectedOption === option.id;
              const isCorrect = option.id === getCurrentQuestion().correctAnswer;
              const showCorrect = showFeedback && isCorrect;
              const showIncorrect = showFeedback && isSelected && !isCorrect;
              

              
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={showFeedback}
                  className={`bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left ${
                    showFeedback ? (isCorrect ? 'ring-4 ring-green-500' : isSelected ? 'ring-4 ring-red-500' : '') : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-4">{option.emoji}</div>
                    <div>
                      <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div className={`mt-6 p-4 rounded-xl ${
              selectedOption === getCurrentQuestion().correctAnswer
                ? 'bg-green-500/20 border border-green-500/30'
                : 'bg-red-500/20 border border-red-500/30'
            }`}>
              <p className={`font-semibold ${
                selectedOption === getCurrentQuestion().correctAnswer
                  ? 'text-green-300'
                  : 'text-red-300'
              }`}>
                {selectedOption === getCurrentQuestion().correctAnswer
                  ? 'Correct! 🎉'
                  : 'Not quite right!'}
              </p>
              <p className="text-white/90 mt-2">
                {getCurrentQuestion().explanation}
              </p>
            </div>
          )}
        </div>
        
        {gameFinished && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Debate Complete!</h3>
            <p className="text-xl text-white/90 mb-6">
              You scored {coins} out of {questions.length}!
            </p>
            <p className="text-white/80 mb-8">
              Balanced nutrition is key to long-term health and energy.
            </p>
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all transform hover:scale-105"
            >
              Next Challenge
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JunkFoodDebate;
