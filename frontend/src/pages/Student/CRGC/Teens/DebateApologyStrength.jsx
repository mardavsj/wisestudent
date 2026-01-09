import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateApologyStrength = () => {
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
      text: "Is saying sorry a weakness or strength?",
      options: [
        { id: "a", text: "Weakness - It shows you lost the argument", emoji: "😞" },
        
        { id: "c", text: "Neither - It's just a social convention", emoji: "🤷" },
        { id: "b", text: "Strength - It shows emotional maturity and courage", emoji: "💪" },
      ],
      correctAnswer: "b",
      explanation: "Apologizing takes courage and shows emotional maturity. It's a strength that helps maintain healthy relationships."
    },
    {
      id: 2,
      text: "What is the main benefit of apologizing when you've hurt someone?",
      options: [
        { id: "a", text: "It prevents the other person from getting revenge", emoji: "⚔️" },
        { id: "b", text: "It helps repair relationships and shows accountability", emoji: "🤝" },
        { id: "c", text: "It makes you look better to others", emoji: "🎭" }
      ],
      correctAnswer: "b",
      explanation: "Apologizing helps repair damaged relationships and shows that you take responsibility for your actions."
    },
    {
      id: 3,
      text: "When is the best time to apologize after a conflict?",
      options: [
        { id: "b", text: "After cooling down and reflecting on what happened", emoji: "🧘" },
        { id: "a", text: "Immediately, even if emotions are still high", emoji: "🔥" },
        { id: "c", text: "Only if the other person apologizes first", emoji: "⏸️" }
      ],
      correctAnswer: "b",
      explanation: "Taking time to cool down and reflect ensures that your apology is sincere and thoughtful rather than reactive."
    },
    {
      id: 4,
      text: "What should a good apology include?",
      options: [
        { id: "a", text: "An explanation of why you were right", emoji: "🗣️" },
        { id: "c", text: "A promise that it will never happen again", emoji: "📜" },
        { id: "b", text: "Acknowledgment of hurt caused and commitment to change", emoji: "💔" },
      ],
      correctAnswer: "b",
      explanation: "A meaningful apology acknowledges the harm caused and shows commitment to improving, which builds trust."
    },
    {
      id: 5,
      text: "How does apologizing affect your self-respect?",
      options: [
        { id: "a", text: "It decreases because you admit fault", emoji: "📉" },
        { id: "b", text: "It increases because you act with integrity", emoji: "📈" },
        { id: "c", text: "It has no effect either way", emoji: "➡️" }
      ],
      correctAnswer: "b",
      explanation: "Acting with integrity by apologizing when appropriate actually increases self-respect because you're being honest and responsible."
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
        title="Debate: Apology = Weakness?"
        subtitle="Debate Complete!"
        onNext={handleNext}
        nextEnabled={true}
        nextButtonText="Back to Games"
        showGameOver={true}
        score={coins}
        gameId="civic-responsibility-teens-46"
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
        nextGamePathProp="/student/civic-responsibility/teens/journal-of-conflict"
        nextGameIdProp="civic-responsibility-teens-47">
        <div className="text-center p-8">
          <div className="text-6xl mb-6">🏆</div>
          <h2 className="text-2xl font-bold mb-4">Excellent Debate!</h2>
          <p className="text-white mb-6">
            You scored {coins} out of {questions.length} points!
          </p>
          <div className="text-yellow-400 font-bold text-lg mb-4">
            You understand the strength in taking responsibility!
          </div>
          <p className="text-white/80">
            Remember: Apologizing with sincerity shows emotional intelligence and builds stronger relationships!
          </p>
        </div>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Debate: Apology = Weakness?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-46"
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
            <div className="text-5xl mb-4">🙏</div>
            <h3 className="text-2xl font-bold text-white mb-2">Apology Strength Debate</h3>
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

export default DebateApologyStrength;