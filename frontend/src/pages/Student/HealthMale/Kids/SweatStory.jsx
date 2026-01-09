import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SweatStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-41";
  const gameData = getGameDataById(gameId);

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
      text: "During football practice, your face turns red and you start sweating. What's happening to your body?",
      options: [
        
        {
          id: "a",
          text: "Your body is getting sick",
          emoji: "🤒",
          isCorrect: false
        },
        {
          id: "c",
          text: "Your clothes are too warm",
          emoji: "👕",
          isCorrect: false
        },
        {
          id: "b",
          text: "Your body is cooling itself down",
          emoji: "🌡️",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "After running in the hot sun, you notice wet patches on your shirt. What should you do when you get home?",
      options: [
        {
          id: "a",
          text: "Take a bath and change into clean clothes",
          emoji: "🚿",
          isCorrect: true
        },
        {
          id: "b",
          text: "Keep the sweaty shirt until tomorrow",
          emoji: "😴",
          isCorrect: false
        },
        {
          id: "c",
          text: "Just wipe with a towel and continue playing",
          emoji: "🧻",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your friend Tom says sweating makes him smell bad and he feels embarrassed. What would you tell him?",
      options: [
        
        {
          id: "a",
          text: "Use deodorant to stop smelling",
          emoji: "💨",
          isCorrect: false
        },
        {
          id: "c",
          text: "Sweating is normal and helps keep your body healthy",
          emoji: "💪",
          isCorrect: true
        },
        {
          id: "b",
          text: "Avoid playing sports to prevent sweating",
          emoji: "🚫",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You notice your friend's shirt is wet with sweat during a game. What's the right way to respond?",
      options: [
        
        {
          id: "b",
          text: "Make fun of him for sweating",
          emoji: "😂",
          isCorrect: false
        },
        {
          id: "c",
          text: "Stop the game because he looks gross",
          emoji: "🤢",
          isCorrect: false
        },
        {
          id: "a",
          text: "Keep playing and respect that sweating is normal",
          emoji: "👍",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "After a long bike ride, your body feels sticky. Why is it important to clean up?",
      options: [
        {
          id: "b",
          text: "To remove bacteria and prevent skin irritation",
          emoji: "🦠",
          isCorrect: true
        },
        {
          id: "a",
          text: "To look better for photos",
          emoji: "📸",
          isCorrect: false
        },
        {
          id: "c",
          text: "To make your clothes last longer",
          emoji: "👕",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (answered) return;
    
    const selectedOption = getCurrentQuestion().options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;
    
    setAnswered(true);
    resetFeedback();

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    setChoices([...choices, { question: currentQuestion, optionId, isCorrect }]);

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

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/games/health-male/kids");
  };

  return (
    <GameShell
      title="Sweat Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={score}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/quiz-hygiene-advanced"
      nextGameIdProp="health-male-kids-42"
      gameType="health-male"
      totalLevels={5}
      currentLevel={41}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      backPath="/games/health-male/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={5}
    >
      <div className="space-y-8">
        {!showResult && getCurrentQuestion() ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {getCurrentQuestion().text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getCurrentQuestion().options.map((option) => (
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

export default SweatStory;

