import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateEquality = () => {
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
      text: "Should all students be treated equally regardless of their background?",
      options: [
        { id: "b", text: "No, some students deserve more privileges", emoji: "🚫" },
        { id: "a", text: "Yes, equality is a fundamental right", emoji: "⚖️" },
        { id: "c", text: "Only students from certain backgrounds should be treated equally", emoji: "👥" }
      ],
      correctAnswer: "a",
      explanation: "All students deserve equal treatment regardless of their background, race, religion, or socioeconomic status. Equality is a fundamental human right."
    },
    {
      id: 2,
      text: "Which approach best promotes equality in schools?",
      options: [
        { id: "a", text: "Providing the same resources to all students", emoji: "📚" },
        { id: "b", text: "Ignoring students' different needs", emoji: "🙈" },
        { id: "c", text: "Treating all students exactly the same without considering individual circumstances", emoji: "🎯" }
      ],
      correctAnswer: "a",
      explanation: "True equality in education means providing all students with the resources they need to succeed, which may sometimes require different approaches for different students."
    },
    {
      id: 3,
      text: "Why is equality important in society?",
      options: [
        { id: "a", text: "It creates division and conflict", emoji: "⚔️" },
        { id: "b", text: "It ensures fairness and justice for all", emoji: "🤝" },
        { id: "c", text: "It only benefits certain groups", emoji: "👑" }
      ],
      correctAnswer: "b",
      explanation: "Equality ensures that everyone has the same opportunities and rights, which creates a fair and just society where all people can thrive."
    },
    {
      id: 4,
      text: "What is the difference between equality and equity?",
      options: [
        { id: "a", text: "Equality means giving everyone the same resources, while equity means giving everyone what they need to succeed", emoji: "⚖️" },
        { id: "b", text: "Equality and equity mean the same thing", emoji: "🔄" },
        { id: "c", text: "Equality means giving more to some people, while equity means treating everyone the same", emoji: "🤝" }
      ],
      correctAnswer: "a",
      explanation: "Equality means providing the same resources to everyone, while equity means providing each person with what they need to succeed, which may differ based on individual circumstances."
    },
    {
      id: 5,
      text: "How can we promote equality in our daily lives?",
      options: [
        { id: "b", text: "By ignoring inequality when we see it", emoji: "😑" },
        { id: "c", text: "By only helping people who are similar to us", emoji: "🤝" },
        { id: "a", text: "By standing up against discrimination and treating everyone with respect", emoji: "💪" },
      ],
      correctAnswer: "a",
      explanation: "We can promote equality by treating everyone with respect, standing up against discrimination, and advocating for fair treatment for all people regardless of their differences."
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
      title="Debate: Equality for All?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-16"
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
      nextGamePathProp="/student/civic-responsibility/teens/journal-of-inclusion"
      nextGameIdProp="civic-responsibility-teens-17">
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">⚖️</div>
            <h3 className="text-2xl font-bold text-white mb-2">Equality Debate</h3>
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

export default DebateEquality;