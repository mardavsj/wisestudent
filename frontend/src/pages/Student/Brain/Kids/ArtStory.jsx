import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ArtStory = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-88");
  const gameId = gameData?.id || "brain-kids-88";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ArtStory, using fallback ID");
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
    text: "Riya finds old newspapers and bottle caps at home. She plans to use them to create something for her school display. What choice best shows creative thinking?",
    options: [
      { id: "a1", text: "Throw them away and buy new craft items", emoji: "🗑️", isCorrect: false },
      { id: "b1", text: "Use the waste items to design a new art piece", emoji: "♻️", isCorrect: true },
      { id: "c1", text: "Wait for someone else to tell her what to make", emoji: "⏳", isCorrect: false }
    ]
  },
  {
    id: 2,
    text: "Ayaan wants to draw a picture for his art story. He has seen many similar drawings before. What would make his artwork truly creative?",
    options: [
      { id: "a2", text: "Copying a picture exactly from a book", emoji: "📘", isCorrect: false },
      { id: "c2", text: "Leaving the page blank to avoid mistakes", emoji: "📄", isCorrect: false },
      { id: "b2", text: "Adding his own ideas and colors to the drawing", emoji: "🎨", isCorrect: true },
    ]
  },
  {
    id: 3,
    text: "Two friends are building a play fort using boxes. One follows instructions, the other changes the design to solve problems. Which action shows creativity in the story?",
    options: [
      { id: "a3", text: "Stopping when the boxes don’t fit", emoji: "🚫", isCorrect: false },
      { id: "b3", text: "Changing the design to make the fort stronger", emoji: "🏰", isCorrect: true },
      { id: "c3", text: "Waiting for an adult to build it instead", emoji: "🙋", isCorrect: false }
    ]
  },
  {
    id: 4,
    text: "Meera writes an art story about a talking tree. How can she make the story more creative?",
    options: [
      { id: "a4", text: "Using only one sentence again and again", emoji: "🔁", isCorrect: false },
      { id: "b4", text: "Giving the tree feelings and a unique problem", emoji: "🌳", isCorrect: true },
      { id: "c4", text: "Ending the story without any ideas", emoji: "❌", isCorrect: false }
    ]
  },
  {
    id: 5,
    text: "During art time, a child taps different objects to make sounds for a story scene. What makes this activity creative?",
    options: [
      { id: "b5", text: "Exploring new sounds to match the story mood", emoji: "🎶", isCorrect: true },
      { id: "a5", text: "Using objects only for their normal purpose", emoji: "📦", isCorrect: false },
      { id: "c5", text: "Stopping because instruments are not available", emoji: "🛑", isCorrect: false }
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
      title="Art Story"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Story Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/brain/kids/reflex-creative-thinking"
      nextGameIdProp="brain-kids-89"
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

export default ArtStory;

