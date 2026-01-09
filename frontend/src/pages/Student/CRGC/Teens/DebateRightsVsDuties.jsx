import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateRightsVsDuties = () => {
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
      text: "Are rights more important than duties?",
      options: [
        { id: "a", text: "Both must balance" },
        { id: "b", text: "Rights are more important" },
        { id: "c", text: "Duties are more important" }
      ],
      correctAnswer: "a",
      explanation: "Rights and duties must balance each other - we enjoy rights but also have responsibilities to respect others' rights and contribute to society."
    },
    {
      id: 2,
      text: "What happens when citizens focus only on rights without duties?",
      options: [
        { id: "a", text: "Society becomes chaotic and unsustainable" },
        { id: "b", text: "Society becomes more efficient" },
        { id: "c", text: "Nothing changes" }
      ],
      correctAnswer: "a",
      explanation: "When citizens only focus on rights without fulfilling duties, society becomes chaotic as everyone demands benefits without contributing."
    },
    {
      id: 3,
      text: "What happens when citizens focus only on duties without rights?",
      options: [
        { id: "b", text: "People become more creative" },
        { id: "a", text: "People become oppressed and unmotivated" },
        { id: "c", text: "Society becomes stronger" }
      ],
      correctAnswer: "a",
      explanation: "When citizens only focus on duties without rights, they become oppressed and unmotivated, leading to an unhealthy society."
    },
    {
      id: 4,
      text: "How do rights and duties work together in a democracy?",
      options: [
        { id: "b", text: "Only rights matter for democracy" },
        { id: "a", text: "Rights enable participation, duties maintain order" },
        { id: "c", text: "Only duties matter for democracy" }
      ],
      correctAnswer: "a",
      explanation: "In a democracy, rights enable citizens to participate freely while duties help maintain the order necessary for democracy to function."
    },
    {
      id: 5,
      text: "Why is it important to teach both rights and duties?",
      options: [
        { id: "a", text: "To create responsible and empowered citizens" },
        { id: "b", text: "To make people fear the government" },
        { id: "c", text: "To reduce education costs" }
      ],
      correctAnswer: "a",
      explanation: "Teaching both rights and duties creates responsible and empowered citizens who can contribute positively to society while protecting their freedoms."
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (selectedOption || showFeedback) return;
    
    resetFeedback(); // Reset any existing feedback
    
    const currentQ = questions[currentQuestion];
    const isCorrect = optionId === currentQ.correctAnswer;
    
    setSelectedOption(optionId);
    
    if (isCorrect) {
      setCoins(prev => prev + 1); // 1 coin per correct answer
      showCorrectAnswerFeedback(1, true);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOption(null);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 2000);
  };

  const handleNext = () => {
    navigate("/games/civic-responsibility/teens");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  if (gameFinished) {
    return (
      <GameShell
        title="Debate: Rights vs Duties"
        subtitle="Debate Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-76"
        gameType="civic-responsibility"
        totalLevels={5}
        currentLevel={currentQuestion + 1}
        showConfetti={true}
        backPath="/games/civic-responsibility/teens"
        maxScore={questions.length} // Max score is total number of questions (all correct)
        coinsPerLevel={coinsPerLevel}
        totalCoins={totalCoins}
        totalXp={totalXp}
        flashPoints={flashPoints}
        showAnswerConfetti={showAnswerConfetti}
        nextGamePathProp="/student/civic-responsibility/teens/journal-of-law-awareness"
        nextGameIdProp="civic-responsibility-teens-77">
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🏆</div>
          <h2 className="text-2xl font-bold mb-4">Excellent Debate!</h2>
          <p className="text-white mb-6">
            You scored {coins} out of {questions.length} points!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You understand the balance between rights and duties!
          </div>
          <p className="text-white/80">
            Remember: Both rights and duties are essential for a healthy democracy and society - they must balance each other!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Debate: Rights vs Duties"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-76"
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
      showAnswerConfetti={showAnswerConfetti}>
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">⚖️</div>
            <h3 className="text-2xl font-bold text-white mb-2">Rights vs Duties Debate</h3>
          </div>

          <p className="text-white text-lg mb-6">
            {getCurrentQuestion().text}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getCurrentQuestion().options.map((option) => {
              const isSelected = selectedOption === option.id;
              const isCorrect = option.id === getCurrentQuestion().correctAnswer;
              const showCorrect = showFeedback && isCorrect;
              const showIncorrect = showFeedback && isSelected && !isCorrect;
              
              // Add emojis for each option like in the reference game
              const optionEmojis = {
                a: "✅",
                b: "❌",
                c: "⚠️"
              };
              
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
                    <div className="text-2xl mr-4">{optionEmojis[option.id] || '❓'}</div>
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

export default DebateRightsVsDuties;