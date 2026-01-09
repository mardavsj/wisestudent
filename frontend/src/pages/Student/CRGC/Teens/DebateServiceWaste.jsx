import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateServiceWaste = () => {
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
      text: "Is community service a waste of time?",
      options: [
        { id: "a", text: "Yes, it takes away from personal activities", emoji: "⏰" },
        { id: "b", text: "No, it builds society and develops skills", emoji: "🏗️" },
        { id: "c", text: "Only if you don't enjoy it", emoji: "😊" }
      ],
      correctAnswer: "b",
      explanation: "Community service contributes to building stronger communities and helps individuals develop valuable life skills like leadership, empathy, and teamwork."
    },
    {
      id: 2,
      text: "What is a key benefit of volunteering for teens?",
      options: [
        { id: "b", text: "It builds character and social awareness", emoji: "👤" },
        { id: "a", text: "It guarantees college admission", emoji: "🎓" },
        { id: "c", text: "It provides free meals", emoji: "🍔" }
      ],
      correctAnswer: "b",
      explanation: "Volunteering helps teens develop character, gain real-world experience, and become more socially aware and responsible citizens."
    },
    {
      id: 3,
      text: "How does community service impact the volunteer?",
      options: [
        { id: "a", text: "It creates a sense of purpose and fulfillment", emoji: "🎯" },
        { id: "b", text: "It reduces time for studying", emoji: "📚" },
        { id: "c", text: "It guarantees financial rewards", emoji: "💰" }
      ],
      correctAnswer: "a",
      explanation: "Community service often creates a sense of purpose and fulfillment by allowing individuals to make a positive impact and connect with their community."
    },
    {
      id: 4,
      text: "What is the broader impact of widespread community service?",
      options: [
        { id: "a", text: "It creates dependency on volunteers", emoji: "🤝" },
        { id: "c", text: "It replaces government responsibilities", emoji: "🏛️" },
        { id: "b", text: "It strengthens communities and addresses needs", emoji: "💪" },
      ],
      correctAnswer: "b",
      explanation: "Widespread community service strengthens communities by addressing local needs, fostering connections, and creating positive social change."
    },
    {
      id: 5,
      text: "Why should schools encourage community service?",
      options: [
        { id: "a", text: "To reduce school operational costs", emoji: "💸" },
        { id: "b", text: "To develop well-rounded, socially responsible students", emoji: "🎓" },
        { id: "c", text: "To replace academic subjects", emoji: "✏️" }
      ],
      correctAnswer: "b",
      explanation: "Schools should encourage community service to help develop well-rounded students who are socially responsible and understand their role in society."
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
        title="Debate: Service = Waste?"
        subtitle="Debate Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-56"
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
        nextGamePathProp="/student/civic-responsibility/teens/journal-of-teen-service"
        nextGameIdProp="civic-responsibility-teens-57">
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🏆</div>
          <h2 className="text-2xl font-bold mb-4">Excellent Debate!</h2>
          <p className="text-white mb-6">
            You scored {coins} out of {questions.length} points!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You understand the value of community service!
          </div>
          <p className="text-white/80">
            Remember: Community service builds character, strengthens communities, and develops essential life skills!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Debate: Service = Waste?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-56"
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
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="text-2xl font-bold text-white mb-2">Community Service Debate</h3>
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

export default DebateServiceWaste;