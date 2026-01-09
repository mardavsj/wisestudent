import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ToyBrokenStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-41");
  const gameId = gameData?.id || "brain-kids-41";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ToyBrokenStory, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
  {
    id: 1,
    text: "Arjun’s favorite toy stops working during playtime. He feels a heavy feeling in his chest. What choice helps him handle the moment best?",
    options: [
      {
        id: "repair",
        text: "Take a break and see if the toy can be fixed later",
        emoji: "🛠️",
        isCorrect: true
      },
      {
        id: "throw",
        text: "Throw the toy away immediately",
        emoji: "🗑️",
        isCorrect: false
      },
      {
        id: "blame",
        text: "Get angry and blame himself",
        emoji: "😠",
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    text: "Maya cannot find the storybook she reads every night. Her mind keeps thinking about it. What would help her settle her thoughts?",
    options: [
      
      {
        id: "panicsearch",
        text: "Search everywhere in a hurry",
        emoji: "🏃",
        isCorrect: false
      },
      {
        id: "giveup",
        text: "Decide she will never read again",
        emoji: "📕",
        isCorrect: false
      },
      {
        id: "searchplan",
        text: "Make a calm plan to look for it step by step",
        emoji: "📋",
        isCorrect: true
      },
    ]
  },
  {
    id: 3,
    text: "When Rohan hears that his pet is unwell, he keeps thinking about many ‘what ifs’. What supports his thinking best?",
    options: [
      
      {
        id: "imagineworst",
        text: "Imagine only the worst outcomes",
        emoji: "🌪️",
        isCorrect: false
      },
      {
        id: "talkadult",
        text: "Talk to a trusted adult and learn what can be done",
        emoji: "🗣️",
        isCorrect: true
      },
      {
        id: "ignore",
        text: "Pretend nothing is happening",
        emoji: "🙈",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "Anaya’s close friend moves to another city. After school, she feels the house is too quiet. What helps her feel supported?",
    options: [
      {
        id: "connect",
        text: "Stay connected while building new routines",
        emoji: "📞",
        isCorrect: true
      },
      {
        id: "isolate",
        text: "Stay alone and avoid others",
        emoji: "🚪",
        isCorrect: false
      },
      {
        id: "pretend",
        text: "Pretend she does not care",
        emoji: "🎭",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "Dev misses a birthday party he was excited about. The feeling stays for some time. What choice helps him move forward?",
    options: [
      
      {
        id: "compare",
        text: "Compare himself with others who went",
        emoji: "📱",
        isCorrect: false
      },
      {
        id: "selfblame",
        text: "Keep blaming himself all day",
        emoji: "🔄",
        isCorrect: false
      },
      {
        id: "express",
        text: "Share his feelings and plan something fun later",
        emoji: "🎨",
        isCorrect: true
      },
    ]
  }
];


  const handleChoice = (isCorrect) => {
    if (answered) return;
    
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

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Toy Broken Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/brain/kids/quiz-on-feelings"
      nextGameIdProp="brain-kids-42"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="brain"
    >
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
                {currentQuestionData.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.isCorrect)}
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

export default ToyBrokenStory;

