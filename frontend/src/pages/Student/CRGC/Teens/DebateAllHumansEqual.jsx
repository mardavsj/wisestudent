import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateAllHumansEqual = () => {
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
      text: "Should all humans have equal rights?",
      options: [
        { id: "b", text: "No, some people deserve more rights" },
        { id: "a", text: "Yes, equality is fundamental to justice" },
        { id: "c", text: "It depends on circumstances" }
      ],
      correctAnswer: "a",
      explanation: "All humans have inherent dignity and should have equal rights regardless of their background, beliefs, or circumstances."
    },
    {
      id: 2,
      text: "What is the basis for human equality?",
      options: [
        { id: "b", text: "Economic status" },
        { id: "c", text: "Cultural background" },
        { id: "a", text: "Inherent human dignity" },
      ],
      correctAnswer: "a",
      explanation: "Human equality is based on inherent dignity that all people possess simply by being human, not on external factors."
    },
    {
      id: 3,
      text: "How does equality benefit society?",
      options: [
        { id: "b", text: "Eliminates all differences between people" },
        { id: "a", text: "Creates stability and reduces conflict" },
        { id: "c", text: "Only benefits certain groups" }
      ],
      correctAnswer: "a",
      explanation: "Equality creates a more stable society where everyone has opportunities to contribute, reducing conflict and promoting prosperity."
    },
    {
      id: 4,
      text: "What happens when equality is denied?",
      options: [
        { id: "a", text: "Social tension and injustice increase" },
        { id: "b", text: "Society becomes more efficient" },
        { id: "c", text: "Nothing significant changes" }
      ],
      correctAnswer: "a",
      explanation: "When equality is denied, it creates social tension, injustice, and can lead to conflict as people fight for their rights."
    },
    {
      id: 5,
      text: "How can we promote human equality?",
      options: [
        { id: "a", text: "Through education and advocacy" },
        { id: "b", text: "By maintaining existing hierarchies" },
        { id: "c", text: "By ignoring differences" }
      ],
      correctAnswer: "a",
      explanation: "Education and advocacy help people understand the importance of equality and work together to create a more just society."
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
        title="Debate: All Humans Equal?"
        subtitle="Debate Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-66"
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
        nextGamePathProp="/student/civic-responsibility/teens/journal-of-justice"
        nextGameIdProp="civic-responsibility-teens-67">
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🏆</div>
          <h2 className="text-2xl font-bold mb-4">Excellent Debate!</h2>
          <p className="text-white mb-6">
            You scored {coins} out of {questions.length} points!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You understand human equality!
          </div>
          <p className="text-white/80">
            Remember: All humans have inherent dignity and deserve equal rights regardless of their background or circumstances!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Debate: All Humans Equal?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-66"
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
            <h3 className="text-2xl font-bold text-white mb-2">Human Equality Debate</h3>
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

export default DebateAllHumansEqual;