import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DebateIgnoreOrReport = () => {
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
      text: "Should bullying be ignored or reported?",
      options: [
        { id: "a", text: "Ignored to avoid conflict", emoji: "🙈" },
        { id: "b", text: "Reported to appropriate authorities", emoji: "📢" },
        { id: "c", text: "Handled by the victims alone", emoji: "👤" }
      ],
      correctAnswer: "b",
      explanation: "Bullying should always be reported to appropriate authorities such as teachers, counselors, or parents. Ignoring bullying allows it to continue and can escalate, causing more harm to victims."
    },
    {
      id: 2,
      text: "What is the most effective way to address cyberbullying?",
      options: [
        { id: "b", text: "Document evidence and report to adults", emoji: "📝" },
        { id: "a", text: "Retaliate against the bully online", emoji: "⚔️" },
        { id: "c", text: "Hope it will stop on its own", emoji: "🤞" }
      ],
      correctAnswer: "b",
      explanation: "Documenting evidence and reporting cyberbullying to trusted adults is the most effective approach. This ensures proper action is taken while protecting the victim and preventing further harm."
    },
    {
      id: 3,
      text: "Why is it important for bystanders to report bullying?",
      options: [
        { id: "a", text: "To gain popularity among peers", emoji: "😊 " },
        { id: "c", text: "To avoid getting in trouble themselves", emoji: "🛡️" },
        { id: "b", text: "To help stop the bullying and support victims", emoji: "🤝" },
      ],
      correctAnswer: "b",
      explanation: "Bystanders play a crucial role in stopping bullying by reporting it. This helps protect victims, holds bullies accountable, and creates a safer environment for everyone."
    },
    {
      id: 4,
      text: "What should you do if you witness bullying but fear retaliation?",
      options: [
        { id: "a", text: "Stay silent to protect yourself", emoji: "🤐" },
        { id: "b", text: "Report anonymously or seek help from trusted adults", emoji: "🔐" },
        { id: "c", text: "Join in to show you're not a target", emoji: "😈" }
      ],
      correctAnswer: "b",
      explanation: "If you fear retaliation, reporting anonymously or seeking help from trusted adults is the best approach. This allows action to be taken while protecting you from potential retaliation."
    },
    {
      id: 5,
      text: "How does reporting bullying benefit the school community?",
      options: [
        { id: "b", text: "It helps create a safer, more inclusive environment", emoji: "🌳" },
        { id: "a", text: "It creates more conflict and drama", emoji: "🎭" },
        { id: "c", text: "It makes the school look bad to outsiders", emoji: " 🏫" }
      ],
      correctAnswer: "b",
      explanation: "Reporting bullying helps schools identify patterns, implement preventive measures, and create a safer, more inclusive environment for all students. This benefits the entire school community."
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
      title="Debate: Ignore or Report?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={coins}
      gameId="civic-responsibility-teens-36"
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
      nextGamePathProp="/student/civic-responsibility/teens/journal-of-peer-support"
      nextGameIdProp="civic-responsibility-teens-37">
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Coins: {coins}</span>
          </div>
          
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">📢</div>
            <h3 className="text-2xl font-bold text-white mb-2">Bullying Debate</h3>
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

export default DebateIgnoreOrReport;