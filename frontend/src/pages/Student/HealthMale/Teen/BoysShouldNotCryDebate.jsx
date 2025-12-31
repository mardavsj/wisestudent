import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const BoysShouldNotCryDebate = () => {
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
    text: "Is crying a sign of weakness or emotional strength?",
    options: [
      { id: "b", text: "Sign of weakness", emoji: "😟" },
      { id: "c", text: "Depends on situation", emoji: "🤔" },
      { id: "a", text: "Sign of strength", emoji: "💪" },
    ],
    correctAnswer: "a",
    explanation: "Crying demonstrates self-awareness and emotional intelligence. Expressing emotions is a sign of strength, not weakness."
  },
  {
    id: 2,
    text: "What are the risks of always hiding emotions?",
    options: [
      { id: "b", text: "Increases stress & mental health issues", emoji: "😞" },
      { id: "a", text: "Improves toughness", emoji: "🛡️" },
      { id: "c", text: "Nothing significant", emoji: "😐" }
    ],
    correctAnswer: "b",
    explanation: "Constant suppression of feelings can lead to stress, anxiety, depression, and difficulties in relationships."
  },
  {
    id: 3,
    text: "How can expressing sadness benefit boys?",
    options: [
      { id: "a", text: "Develop empathy and emotional bonds", emoji: "🤝" },
      { id: "b", text: "Makes them weak", emoji: "💔" },
      { id: "c", text: "Reduces respect from peers", emoji: "🙅" }
    ],
    correctAnswer: "a",
    explanation: "Expressing emotions helps build deeper connections, empathy, and resilience."
  },
  {
    id: 4,
    text: "If a boy cries in front of peers, what is the healthy perspective?",
    options: [
      { id: "b", text: "He should be teased", emoji: "😆" },
      { id: "c", text: "He should hide immediately", emoji: "🏃‍♂️" },
      { id: "a", text: "It’s natural and brave", emoji: "😢" },
    ],
    correctAnswer: "a",
    explanation: "Acknowledging emotions in front of others shows courage and normalizes vulnerability, encouraging a supportive culture."
  },
  {
    id: 5,
    text: "Can teaching boys to hide emotions impact society?",
    options: [
      { id: "a", text: "Yes, may perpetuate toxic masculinity", emoji: "⚠️" },
      { id: "b", text: "No, society is unaffected", emoji: "😐" },
      { id: "c", text: "Only affects individuals", emoji: "👤" }
    ],
    correctAnswer: "a",
    explanation: "Encouraging boys to suppress emotions can reinforce harmful stereotypes and limit emotional growth, affecting interpersonal relationships and societal mental health."
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
    navigate("/student/health-male/teens/journal-of-stress");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Debate: Boys Should Not Cry?"
      subtitle={!gameFinished ? `Debate ${currentQuestion + 1} of ${questions.length}` : "Debate Complete!"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-56"
      gameType="health-male"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={gameFinished && score >= 3}
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
            <h3 className="text-2xl font-bold text-white mb-2">Emotional Expression Debate</h3>
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
              You scored {score} out of {questions.length}!
            </p>
            <p className="text-white/80 mb-8">
              Real strength is being honest about your feelings.
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

export default BoysShouldNotCryDebate;
