import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PeerStory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-kids-88";
  const gameData = getGameDataById(gameId);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Your friend says 'Everyone is doing it'. What do you think?",
      options: [
        {
          id: "b",
          text: "I should do it too",
          emoji: "🐑",
         
          isCorrect: false
        },
        {
          id: "a",
          text: "I make my own choices",
          emoji: "🦁",
         
          isCorrect: true
        },
        {
          id: "c",
          text: "I don't know",
          emoji: "🤷",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "A friend calls you 'chicken' for not smoking. How do you feel?",
      options: [
        {
          id: "c",
          text: "Sad and give in",
          emoji: "😢",
          isCorrect: false
        },
        {
          id: "a",
          text: "Proud to be healthy",
          emoji: "😎",
          isCorrect: true
        },
        {
          id: "b",
          text: "Angry and fight",
          emoji: "😠",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What makes a good friend?",
      options: [
        {
          id: "a",
          text: "Someone who respects you",
          emoji: "🤝",
          isCorrect: true
        },
        {
          id: "b",
          text: "Someone who dares you",
          emoji: "😈",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Someone who gives you candy",
          emoji: "🍬",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How do you say NO to a bad idea?",
      options: [
        {
          id: "c",
          text: "Mumble it",
          emoji: "😶",
          isCorrect: false
        },
        
        {
          id: "b",
          text: "Laugh",
          emoji: "😂",
          isCorrect: false
        },
        {
          id: "a",
          text: "Say it loud and clear",
          emoji: "📢",
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "What if your friend keeps pressuring you?",
      options: [
        {
          id: "b",
          text: "Stay and listen",
          emoji: "👂",
          isCorrect: false
        },
        {
          id: "c",
          text: "Yell at them",
          emoji: "🤬",
          isCorrect: false
        },
        {
          id: "a",
          text: "Leave and find new friends",
          emoji: "👋",
          isCorrect: true
        }
      ]
    }
  ];

  const handleChoice = (optionId) => {
    if (answered) return;
    
    const selectedOption = questions[currentQuestion].options.find(opt => opt.id === optionId);
    const isCorrect = selectedOption.isCorrect;
    
    setAnswered(true);
    resetFeedback();

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

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
    navigate("/student/health-male/kids/reflex-danger-alert");
  };

  return (
    <GameShell
      title="Peer Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      onNext={handleNext}
      nextEnabled={false}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/health-male/kids/reflex-danger-alert"
      nextGameIdProp="health-male-kids-89"
      gameType="health-male"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 3}
    >
      <div className="space-y-8">
        {!showResult && questions[currentQuestion] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {questions[currentQuestion].text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questions[currentQuestion].options.map((option) => (
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

export default PeerStory;

