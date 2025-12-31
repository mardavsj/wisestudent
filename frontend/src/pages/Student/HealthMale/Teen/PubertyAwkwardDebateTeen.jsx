import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PubertyAwkwardDebateTeen = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-26";

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
    text: "Your voice cracks during a presentation. How should you react?",
    options: [
      { id: "b", text: "Stop talking and hide", emoji: "🙈" },
      { id: "a", text: "Laugh it off confidently", emoji: "😂" },
      { id: "c", text: "Apologize repeatedly", emoji: "😅" }
    ],
    correctAnswer: "a",
    explanation: "Voice cracks are normal during puberty. Laughing it off shows confidence and everyone experiences it."
  },
  {
    id: 2,
    text: "You notice hair growth in new places. How should you feel?",
    options: [
      { id: "a", text: "It's a natural part of growing up", emoji: "🧔" },
      { id: "b", text: "Shave everything immediately", emoji: "🪒" },
      { id: "c", text: "Cover it with clothes all the time", emoji: "👕" }
    ],
    correctAnswer: "a",
    explanation: "Body hair is normal and healthy. Everyone experiences it at their own pace."
  },
  {
    id: 3,
    text: "You trip often because you're growing quickly. What’s best?",
    options: [
      { id: "b", text: "Avoid sports entirely", emoji: "🏳️" },
      { id: "c", text: "Blame yourself for being clumsy", emoji: "😓" },
      { id: "a", text: "Be patient, coordination improves", emoji: "⏳" },
    ],
    correctAnswer: "a",
    explanation: "Rapid growth can make you clumsy temporarily. With practice, your body and brain adapt."
  },
  {
    id: 4,
    text: "Your emotions are all over the place lately. What’s true?",
    options: [
      { id: "b", text: "You must control them perfectly", emoji: "🛑" },
      { id: "a", text: "Hormones are causing the shifts", emoji: "🧪" },
      { id: "c", text: "You're unusual if you feel sad sometimes", emoji: "😢" }
    ],
    correctAnswer: "a",
    explanation: "Mood swings are a normal part of puberty. Everyone experiences them."
  },
  {
    id: 5,
    text: "You want to learn about your changing body. What should you do?",
    options: [
      { id: "a", text: "Ask trusted adults or health professionals", emoji: "👨‍👩‍👦" },
      { id: "b", text: "Only search online", emoji: "💻" },
      { id: "c", text: "Never ask anyone", emoji: "🤫" }
    ],
    correctAnswer: "a",
    explanation: "Trusted adults provide accurate guidance. The internet can have misleading information."
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
    navigate("/student/health-male/teens/teen-growth-journal");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Puberty Awkward Debate"
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
            <div className="text-5xl mb-4">🧑</div>
            <h3 className="text-2xl font-bold text-white mb-2">Puberty Awkward Debate</h3>
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
              Understanding puberty helps you navigate these changes with confidence.
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

export default PubertyAwkwardDebateTeen;
