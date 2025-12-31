import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const CoolOrFoolDebate = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const questions = [
  {
    id: 1,
    text: "Some teens think smoking or drinking makes them look mature. What is the reality?",
    options: [
      { id: "a", text: "Cool and mature", emoji: "😎" },
      { id: "b", text: "Popular instantly", emoji: "⭐" },
      { id: "c", text: "Harms body and mind", emoji: "⚠️" }
    ],
    correctAnswer: "c",
    explanation: "Perceived 'coolness' is short-lived. Smoking and drinking damage health, impair decision-making, and can affect long-term opportunities."
  },
  {
    id: 2,
    text: "Using substances to seem cool may lead to what hidden risks?",
    options: [
      { id: "a", text: "Everyone admires you", emoji: "👏" },
      { id: "c", text: "Addiction, poor health, and social problems", emoji: "🩺" },
      { id: "b", text: "Gain respect and trust", emoji: "🏆" },
    ],
    correctAnswer: "c",
    explanation: "Temporary peer approval can lead to addiction, mental health issues, and strained relationships. True respect comes from responsible behavior."
  },
  {
    id: 3,
    text: "Your friends use substances at a party. How should you respond wisely?",
    options: [
      { id: "c", text: "Suggest fun, healthy alternatives", emoji: "💡" },
      { id: "a", text: "Join to fit in", emoji: "👥" },
      { id: "b", text: "Criticize them harshly", emoji: "👎" },
    ],
    correctAnswer: "c",
    explanation: "Promoting positive alternatives maintains friendships while protecting your health. Leading by example influences peers more effectively than criticism."
  },
  {
    id: 4,
    text: "Which choice best demonstrates 'cool' in a long-term sense?",
    options: [
      { id: "b", text: "Being different for attention", emoji: "🦄" },
      { id: "a", text: "Protecting your health and future", emoji: "🚀" },
      { id: "c", text: "Following all rules blindly", emoji: "📋" }
    ],
    correctAnswer: "a",
    explanation: "True coolness is about confidence, health, and planning for success. It’s about making smart choices, not just standing out temporarily."
  },
  {
    id: 5,
    text: "Society increasingly views teen substance use as:",
    options: [
      { id: "a", text: "A fun experiment", emoji: "🎉" },
      { id: "b", text: "Typical teen behavior", emoji: "😊" },
      { id: "c", text: "A serious public health concern", emoji: "⚠️" }
    ],
    correctAnswer: "c",
    explanation: "Public health data shows teen substance use is risky. Awareness campaigns highlight the dangers to prevent addiction and long-term health consequences."
  }
];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || showFeedback) return;
    
    resetFeedback(); // Reset any existing feedback
    
    setSelectedOption(optionId);
    const isCorrect = optionId === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1); // 1 point per correct answer
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
    navigate("/student/health-male/teens/journal-of-awareness");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Debate: Cool or Fool?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-86"
      gameType="health-male"
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Score: {score}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🎭</div>
            <h3 className="text-2xl font-bold text-white mb-2">Substance Use Debate</h3>
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
      </div>
    </GameShell>
  );
};

export default CoolOrFoolDebate;
