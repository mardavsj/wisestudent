import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const HygieneConfidenceDebate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-6";
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
    text: "During a group presentation, one teammate is very skilled but ignores basic hygiene. How does this most realistically affect the team’s confidence as a whole?",
    options: [
      {
        id: "c",
        text: "It has no effect if work is good",
        emoji: "📄"
      },
      {
        id: "a",
        text: "It can quietly lower the group’s confidence",
        emoji: "📉"
      },
      {
        id: "b",
        text: "It improves focus on skills only",
        emoji: "🎯"
      }
    ],
    correctAnswer: "a",
    explanation: "Even strong skills can be overshadowed by discomfort. Confidence in teams depends on both performance and presence."
  },
  {
    id: 2,
    text: "In debates and discussions, why is personal hygiene often linked to how seriously others take your opinion?",
    options: [
      {
        id: "b",
        text: "It signals discipline and self-awareness",
        emoji: "🧠"
      },
      
      {
        id: "c",
        text: "It makes you louder",
        emoji: "🔊"
      },
      {
        id: "a",
        text: "It shows social class",
        emoji: "🏷️"
      },
    ],
    correctAnswer: "b",
    explanation: "People subconsciously link hygiene with responsibility and clarity—important traits in communication and debate."
  },
  {
    id: 3,
    text: "A student argues that confidence is purely internal and hygiene is irrelevant. What is the strongest counter-argument?",
    options: [
      {
        id: "a",
        text: "Confidence changes depending on environment",
        emoji: "🌍"
      },
      {
        id: "c",
        text: "External comfort affects internal mindset",
        emoji: "🔁"
      },
      {
        id: "b",
        text: "Everyone feels confident sometimes",
        emoji: "🙂"
      }
    ],
    correctAnswer: "c",
    explanation: "Mental state is influenced by physical comfort. Hygiene reduces distraction and boosts self-assurance."
  },
  {
    id: 4,
    text: "In competitive spaces (sports trials, interviews, debates), hygiene mostly affects which layer of confidence?",
    options: [
      {
        id: "a",
        text: "Deep performance confidence",
        emoji: "🏗️"
      },
      {
        id: "b",
        text: "Surface confidence only",
        emoji: "🎭"
      },
      
      {
        id: "c",
        text: "It has no measurable impact",
        emoji: "❌"
      }
    ],
    correctAnswer: "a",
    explanation: "When you’re not distracted by discomfort or self-doubt, performance confidence becomes stronger."
  },
  {
    id: 5,
    text: "Which statement best balances confidence and hygiene without exaggeration?",
    options: [
      {
        id: "c",
        text: "Hygiene replaces skill",
        emoji: "🔄"
      },
      {
        id: "a",
        text: "Hygiene supports confidence, not defines worth",
        emoji: "⚖️"
      },
      {
        id: "b",
        text: "Hygiene is only for public settings",
        emoji: "🏫"
      }
    ],
    correctAnswer: "a",
    explanation: "Hygiene is a confidence amplifier—not a measure of intelligence or value, but a powerful support system."
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
    navigate("/student/health-male/teens/self-care-journal");
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

export default HygieneConfidenceDebate;
