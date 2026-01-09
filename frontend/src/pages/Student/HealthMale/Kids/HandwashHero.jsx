import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HandwashHero = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-1";

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "What should you do after playing outside?",
      options: [
        {
          id: "b",
          text: "Just wipe on clothes",
          emoji: "👕",
          
          isCorrect: false
        },
        {
          id: "a",
          text: "Wash hands with soap",
          emoji: "🧼",
        
          isCorrect: true
        },
        {
          id: "c",
          text: "Nothing, hands are fine",
          emoji: "👍",
         
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "When should you wash your hands?",
      options: [
        {
          id: "c",
          text: "Once a week is enough",
          emoji: "📅",
          isCorrect: false
        },
        {
          id: "a",
          text: "Only when they look dirty",
          emoji: "👀",
          isCorrect: false
        },
        {
          id: "b",
          text: "After using bathroom and before eating",
          emoji: "✋",
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "How long should you wash your hands?",
      options: [
        {
          id: "b",
          text: "20 seconds, sing happy birthday",
          emoji: "🎵",
          isCorrect: true
        },
        {
          id: "a",
          text: "5 seconds quickly",
          emoji: "⚡",
          isCorrect: false
        },
        {
          id: "c",
          text: "1 minute or more",
          emoji: "⏰",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What happens if you don't wash hands?",
      options: [
        {
          id: "c",
          text: "Hands become stronger",
          emoji: "💪",
          isCorrect: false
        },
        {
          id: "b",
          text: "Nothing bad happens",
          emoji: "😊",
          isCorrect: false
        },
        {
          id: "a",
          text: "You might get sick",
          emoji: "🤒",
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "What's the best way to dry hands?",
      options: [
        {
          id: "b",
          text: "Shake water off",
          emoji: "💧",
          isCorrect: false
        },
        {
          id: "a",
          text: "Use a clean towel",
          emoji: "🧺",
          isCorrect: true
        },
        {
          id: "c",
          text: "Wipe on clothes",
          emoji: "👕",
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
    navigate("/games/health-male/kids");
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
      title="Handwash Hero"
      subtitle={showResult ? "Hero Training Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={1}
      totalLevels={10}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={coins}
      gameId="health-male-kids-1"
      nextGamePathProp="/student/health-male/kids/quiz-cleanliness"
      nextGameIdProp="health-male-kids-2"
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && finalScore === questions.length}>
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
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 flex flex-col items-center justify-center text-center h-full"
                  >
                    <div className="text-4xl mb-3">{option.emoji}</div>
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

export default HandwashHero;

