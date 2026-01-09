import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BathTimeStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-5";

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Mom says 'Take bath daily.' What do you do?",
      options: [
        {
          id: "b",
          text: "Skip bath sometimes",
          emoji: "😅",
         
          isCorrect: false
        },
        {
          id: "a",
          text: "Take bath daily",
          emoji: "🛁",
         
          isCorrect: true
        },
        {
          id: "c",
          text: "Only bath once a week",
          emoji: "📅",
          
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You played outside all day. What happens next?",
      options: [
        {
          id: "b",
          text: "Go straight to dinner",
          emoji: "🍽️",
        
          isCorrect: false
        },
        {
          id: "c",
          text: "Just change clothes",
          emoji: "👕",
          
          isCorrect: false
        },
        {
          id: "a",
          text: "Take a refreshing bath",
          emoji: "🧼",
         
          isCorrect: true
        }
      ]
    },
    {
      id: 3,
      text: "Your friend says 'Bathing is boring!' What do you say?",
      options: [
        {
          id: "b",
          text: "Clean body stays healthy",
          emoji: "💪",
         
          isCorrect: true
        },
        {
          id: "a",
          text: "You're right, I'll skip",
          emoji: "😒",
          
          isCorrect: false
        },
        {
          id: "c",
          text: "Make it fun with toys",
          emoji: "🦆",
        
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "After swimming in pool, what should you do?",
      options: [
        {
          id: "b",
          text: "Wait until tomorrow",
          emoji: "⏰",
          
          isCorrect: false
        },
        {
          id: "a",
          text: "Take shower immediately",
          emoji: "🚿",
          
          isCorrect: true
        },
        {
          id: "c",
          text: "Just dry off",
          emoji: "💨",
         
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Mom notices you smell after playing. What happens?",
      options: [
        {
          id: "b",
          text: "Everyone stays away",
          emoji: "😷",
          isCorrect: false
        },
        {
          id: "c",
          text: "You feel sick",
          emoji: "🤒",
            isCorrect: false
        },
        {
          id: "a",
          text: "Mom reminds you to bath",
          emoji: "🛁",
          isCorrect: true
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

    // If the choice is correct, add score and show flash/confetti
    const isCorrect = currentQ.options.find(opt => opt.id === selectedChoice)?.isCorrect;
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    // Move to next question or show results
    const isLastQuestion = currentQuestion === questions.length - 1;
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
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
      title="Bath Time Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      currentLevel={5}
      totalLevels={10}
      coinsPerLevel={coinsPerLevel}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={score}
      gameId="health-male-kids-5"
      nextGamePathProp="/student/health-male/kids/stay-fresh-poster"
      nextGameIdProp="health-male-kids-6"
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 3}>
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options && currentQuestionData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-3xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-lg mb-2">{option.text}</h3>
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

export default BathTimeStory;

