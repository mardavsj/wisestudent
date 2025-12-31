import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HygieneConfidenceDebate46 = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-46";

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
    text: "Someone mocks hygiene openly but avoids close conversations. What does this show?",
    options: [
    
      {
        id: "b",
        text: "They are confident leaders",
        emoji: "👑"
      },
      {
        id: "c",
        text: "They dislike talking",
        emoji: "🚫"
      },
        {
        id: "a",
        text: "They feel insecure inside",
        emoji: "🧠"
      },
    ],
    correctAnswer: "a",
    explanation: "Mocking hygiene can be a defense mechanism. Avoidance often signals inner insecurity, not confidence."
  },
  {
    id: 2,
    text: "Why do people judge hygiene silently instead of speaking?",
    options: [
      
      {
        id: "b",
        text: "They forget instantly",
        emoji: "🧠"
      },
      {
        id: "a",
        text: "Fear of awkwardness",
        emoji: "😬"
      },
      {
        id: "c",
        text: "They enjoy judging",
        emoji: "👀"
      }
    ],
    correctAnswer: "a",
    explanation: "Hygiene is personal. People avoid conflict, but judgments still affect trust and social distance."
  },
  {
    id: 3,
    text: "A confident speaker loses attention mid-talk. Hygiene-related reason?",
    options: [
      {
        id: "a",
        text: "Distracting discomfort for listeners",
        emoji: "⚠️"
      },
      {
        id: "b",
        text: "Audience jealousy",
        emoji: "😒"
      },
      {
        id: "c",
        text: "Poor microphone quality",
        emoji: "🎤"
      }
    ],
    correctAnswer: "a",
    explanation: "Confidence includes awareness. Discomfort breaks connection even if words are strong."
  },
  {
    id: 4,
    text: "Which hygiene habit impacts confidence the MOST subconsciously?",
    options: [
     
      {
        id: "b",
        text: "Mirror selfies",
        emoji: "📸"
      },
      {
        id: "c",
        text: "Wearing brands",
        emoji: "🏷️"
      },
       {
        id: "a",
        text: "Personal scent awareness",
        emoji: "👃"
      },
    ],
    correctAnswer: "a",
    explanation: "Smell triggers emotional reactions faster than visuals. It strongly affects presence and confidence."
  },
  {
    id: 5,
    text: "True confidence linked to hygiene means:",
    options: [
      
      {
        id: "b",
        text: "Looking perfect always",
        emoji: "🎭"
      },
      {
        id: "a",
        text: "Being comfortable around others",
        emoji: "🤝"
      },
      {
        id: "c",
        text: "Never caring about feedback",
        emoji: "🧱"
      }
    ],
    correctAnswer: "a",
    explanation: "Confidence grows when you remove barriers—hygiene helps people feel relaxed around you."
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
    navigate("/student/health-male/teens/journal-of-care");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Hygiene Confidence Debate"
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
            <div className="text-5xl mb-4">🧼</div>
            <h3 className="text-2xl font-bold text-white mb-2">Hygiene & Confidence Debate</h3>
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
              Good hygiene habits boost confidence and social connections.
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

export default HygieneConfidenceDebate46;
