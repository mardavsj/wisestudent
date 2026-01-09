import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateApology = () => {
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
        { id: "a", text: "Weakness - It shows you were wrong", emoji: "💪" },
        { id: "b", text: "Strength - It shows emotional maturity and accountability", emoji: "🧠" },
        { id: "c", text: "Neither - It's just a social convention", emoji: "🤝" }
      ],
      correctAnswer: "b",
      explanation: "Saying sorry requires courage and emotional maturity. It shows you can take responsibility for your actions and prioritize relationships over ego."
    },
    {
      id: 2,
      text: "What is the primary benefit of a sincere apology?",
      options: [
        { id: "b", text: "Repairing relationships and promoting healing", emoji: "❤️" },
        { id: "a", text: "Avoiding consequences for your actions", emoji: "🏃" },
        { id: "c", text: "Making others feel guilty for their part in the conflict", emoji: "⚖️" }
      ],
      correctAnswer: "b",
      explanation: "A sincere apology focuses on repairing relationships and promoting healing for all parties involved. It's about taking responsibility and making amends."
    },
    {
      id: 3,
      text: "When is the best time to apologize?",
      options: [
        { id: "a", text: "Only when you're completely wrong", emoji: "⏰" },
        { id: "c", text: "Never - Apologies show weakness", emoji: "🚫" },
        { id: "b", text: "As soon as you recognize your contribution to a conflict", emoji: "⚡" },
      ],
      correctAnswer: "b",
      explanation: "Apologizing as soon as you recognize your role in a conflict shows emotional intelligence and helps prevent escalation. It doesn't require admitting complete fault."
    },
    {
      id: 4,
      text: "What should a good apology include?",
      options: [
        { id: "b", text: "Acknowledgment of impact, responsibility, and commitment to change", emoji: "🙂" },
        { id: "a", text: "Just saying 'I'm sorry' without explanation", emoji: "🤐" },
        { id: "c", text: "An explanation of why you did it to justify your actions", emoji: "🎭" }
      ],
      correctAnswer: "b",
      explanation: "Effective apologies acknowledge the impact of our actions, take responsibility, and show commitment to change. This approach promotes healing and trust."
    },
    {
      id: 5,
      text: "How does apologizing affect personal growth?",
      options: [
        { id: "a", text: "It prevents learning from mistakes", emoji: "🛑" },
        { id: "c", text: "It makes you more likely to repeat mistakes", emoji: "🔄" },
        { id: "b", text: "It promotes self-awareness and emotional development", emoji: "🌱" },
      ],
      correctAnswer: "b",
      explanation: "Apologizing requires self-reflection and acknowledgment of our impact on others. This process promotes self-awareness and emotional development, leading to personal growth."
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
      showAnswerConfetti={showAnswerConfetti}
      nextGamePathProp="/student/civic-responsibility/teens/journal-of-conflict"
      nextGameIdProp="civic-responsibility-teens-47">
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🙏</div>
            <h3 className="text-2xl font-bold text-white mb-2">Apology Debate</h3>
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

export default DebateApology;