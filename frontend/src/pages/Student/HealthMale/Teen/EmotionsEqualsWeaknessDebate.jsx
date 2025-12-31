import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EmotionsEqualsWeaknessDebate = () => {
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
    text: "During a crisis, a leader admits fear but continues to act. How should this be judged?",
    options: [
      {
        id: "b",
        text: "Fear plus action shows strength",
        emoji: "🧠"
      },
      {
        id: "a",
        text: "Fear shows lack of control",
        emoji: "⚠️"
      },
      
      {
        id: "c",
        text: "Leaders should hide emotions",
        emoji: "🎭"
      }
    ],
    correctAnswer: "b",
    explanation: "Acknowledging fear while acting responsibly reflects emotional regulation, not weakness. Strength is not absence of emotion, but the ability to function with it."
  },
  {
    id: 2,
    text: "A man cries privately after failure but performs confidently in public. What does this suggest?",
    options: [
      {
        id: "a",
        text: "Emotions should stay hidden",
        emoji: "🤫"
      },
      
      {
        id: "c",
        text: "Crying delays success",
        emoji: "⏳"
      },
      {
        id: "b",
        text: "Emotions help process failure",
        emoji: "🔄"
      },
    ],
    correctAnswer: "b",
    explanation: "Emotional processing allows recovery and learning. Suppressing emotions often leads to burnout or misplaced aggression later."
  },
  {
    id: 3,
    text: "Why do some cultures label emotional men as weak?",
    options: [
      {
        id: "a",
        text: "Because emotions reduce productivity",
        emoji: "📉"
      },
      {
        id: "b",
        text: "Because control is confused with silence",
        emoji: "🔒"
      },
      {
        id: "c",
        text: "Because emotions are biologically harmful",
        emoji: "🧬"
      }
    ],
    correctAnswer: "b",
    explanation: "Many societies mistake emotional suppression for strength. True control involves understanding and managing emotions, not denying them."
  },
  {
    id: 4,
    text: "Which situation best demonstrates emotional strength?",
    options: [
      {
        id: "b",
        text: "Recognizing emotions and choosing responses",
        emoji: "⚖️"
      },
      {
        id: "a",
        text: "Never showing anger or sadness",
        emoji: "🧊"
      },
      
      {
        id: "c",
        text: "Expressing emotions loudly to prove honesty",
        emoji: "📢"
      }
    ],
    correctAnswer: "b",
    explanation: "Emotional strength is about regulation, not repression or explosion. Awareness + choice defines maturity."
  },
  {
    id: 5,
    text: "If emotions were truly weakness, what would logically follow?",
    options: [
      {
        id: "a",
        text: "Relationships would improve without them",
        emoji: "🤝"
      },
      {
        id: "b",
        text: "Empathy-based leadership would fail",
        emoji: "🏛️"
      },
      {
        id: "c",
        text: "Humans would function better like machines",
        emoji: "🤖"
      }
    ],
    correctAnswer: "b",
    explanation: "Empathy, trust, and motivation rely on emotions. History shows emotionally aware leaders build stronger teams and societies."
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
    navigate("/student/health-male/teens/journal-of-masculinity");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Debate: Emotions = Weakness?"
      subtitle={!gameFinished ? `Debate ${currentQuestion + 1} of ${questions.length}` : "Debate Complete!"}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-66"
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
            <h3 className="text-2xl font-bold text-white mb-2">Emotions & Strength Debate</h3>
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
              Expressing emotions is a sign of strength and maturity.
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

export default EmotionsEqualsWeaknessDebate;
