import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateGirlsLeaders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Should girls lead nations?",
      options: [
        { id: "b", text: "No, men are natural leaders", emoji: "♂️" },
        { id: "a", text: "Yes, leadership has no gender", emoji: "👑" },
        { id: "c", text: "Only in certain areas", emoji: "🎯" }
      ],
      correctAnswer: "a",
      explanation: "Leadership is a skill that can be developed by anyone regardless of gender. Many successful female leaders have demonstrated exceptional leadership abilities."
    },
    {
      id: 2,
      text: "What qualities make a good leader?",
      options: [
        { id: "a", text: "Communication skills, empathy, and decision-making abilities", emoji: "🤝" },
        { id: "b", text: "Being male and authoritative", emoji: "♂️" },
        { id: "c", text: "Following traditional gender roles", emoji: "🎭" }
      ],
      correctAnswer: "a",
      explanation: "Good leaders possess qualities like communication skills, empathy, decision-making abilities, and integrity - traits that are not determined by gender."
    },
    {
      id: 3,
      text: "How does gender diversity in leadership benefit organizations?",
      options: [
        { id: "b", text: "It creates confusion and conflict", emoji: "😵" },
        { id: "c", text: "It doesn't make a difference", emoji: "🤷" },
        { id: "a", text: "It brings diverse perspectives and improves decision-making", emoji: "🧠" },
      ],
      correctAnswer: "a",
      explanation: "Gender diversity in leadership brings different perspectives, experiences, and problem-solving approaches, which leads to better decision-making and innovation."
    },
    {
      id: 4,
      text: "Why is it important to encourage girls to pursue leadership roles?",
      options: [
        { id: "b", text: "To replace male leaders", emoji: "⚔️" },
        { id: "a", text: "To ensure equal representation and opportunities for all", emoji: "⚖️" },
        { id: "c", text: "To fulfill a quota requirement", emoji: "📋" }
      ],
      correctAnswer: "a",
      explanation: "Encouraging girls to pursue leadership roles ensures equal representation and opportunities, creating a more inclusive and equitable society."
    },
    {
      id: 5,
      text: "What is a barrier to girls becoming leaders?",
      options: [
        { id: "a", text: "Gender stereotypes and lack of role models", emoji: "🚫" },
        { id: "b", text: "Girls lack leadership abilities", emoji: "❌" },
        { id: "c", text: "Leadership is not important for girls", emoji: "❓" }
      ],
      correctAnswer: "a",
      explanation: "Gender stereotypes and lack of female role models can discourage girls from pursuing leadership roles, but these are societal barriers rather than inherent limitations."
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
    navigate("/games/civic-responsibility/teens");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Debate: Girls as Leaders?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-26"
      gameType="civic-responsibility"
      totalLevels={5}
      currentLevel={currentQuestion + 1}
      showConfetti={gameFinished}
      backPath="/games/civic-responsibility/teens"
    
      maxScore={questions.length} // Max score is total number of questions (all correct)
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePathProp="/student/civic-responsibility/teens/journal-of-teen-equality"
      nextGameIdProp="civic-responsibility-teens-27">
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">👑</div>
            <h3 className="text-2xl font-bold text-white mb-2">Leadership Debate</h3>
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
                    <div className="text-2xl mr-4">{option.emoji || '❓'}</div>
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

export default DebateGirlsLeaders;