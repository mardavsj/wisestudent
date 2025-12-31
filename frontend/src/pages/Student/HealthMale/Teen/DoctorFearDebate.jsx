import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DoctorFearDebate = () => {
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
    text: "Why do many people feel fear before visiting a doctor?",
    options: [
      
      {
        id: "b",
        text: "Doctors are unsafe",
        emoji: "🚫"
      },
      {
        id: "a",
        text: "Fear of diagnosis and bad news",
        emoji: "😱"
      },
      {
        id: "c",
        text: "Hospitals always cause pain",
        emoji: "🏥"
      }
    ],
    correctAnswer: "a",
    explanation: "Doctor fear is often psychological, linked to fear of uncertainty or bad news—not because doctors are unsafe. Understanding this helps reduce anxiety and encourages timely care."
  },
  {
    id: 2,
    text: "Which situation shows unhealthy doctor avoidance?",
    options: [
      {
        id: "a",
        text: "Skipping visits despite ongoing symptoms",
        emoji: "⏳"
      },
      {
        id: "b",
        text: "Asking questions before treatment",
        emoji: "❓"
      },
      {
        id: "c",
        text: "Taking time to choose a trusted doctor",
        emoji: "🤝"
      }
    ],
    correctAnswer: "a",
    explanation: "Avoiding doctors while symptoms continue can worsen health outcomes. Asking questions and choosing trusted professionals are healthy behaviors, not fear."
  },
  {
    id: 3,
    text: "How does delaying doctor visits impact long-term health?",
    options: [
      
      {
        id: "b",
        text: "The body always heals itself",
        emoji: "✨"
      },
      {
        id: "c",
        text: "Doctors prefer late visits",
        emoji: "🙅"
      },
      {
        id: "a",
        text: "Issues may become harder to treat",
        emoji: "📉"
      },
    ],
    correctAnswer: "a",
    explanation: "Early medical care often prevents complications. Delays can allow manageable conditions to progress into serious health problems."
  },
  {
    id: 4,
    text: "What mindset helps reduce fear during medical appointments?",
    options: [
     
      {
        id: "b",
        text: "Assuming worst outcomes",
        emoji: "😰"
      },
       {
        id: "a",
        text: "Viewing doctors as collaborators",
        emoji: "🤝"
      },
      {
        id: "c",
        text: "Staying completely silent",
        emoji: "🤐"
      }
    ],
    correctAnswer: "a",
    explanation: "Seeing doctors as partners encourages open communication, builds trust, and reduces fear. Healthcare works best when patients participate actively."
  },
  {
    id: 5,
    text: "Which action best transforms fear into confidence about healthcare?",
    options: [
      {
        id: "a",
        text: "Learning how the body works",
        emoji: "🧬"
      },
      {
        id: "b",
        text: "Relying only on online advice",
        emoji: "🌐"
      },
      {
        id: "c",
        text: "Avoiding medical discussions",
        emoji: "🙈"
      }
    ],
    correctAnswer: "a",
    explanation: "Health knowledge empowers patients. Understanding the body and medical processes reduces fear, improves decision-making, and builds confidence in seeking care."
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
    navigate("/student/health-male/teens/journal-of-doctor-visits");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Debate: Doctor Fear"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-76"
      gameType="health-male"
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={gameFinished}
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
            <h3 className="text-2xl font-bold text-white mb-2">Healthcare & Fear Debate</h3>
          </div>

          <p className="text-white text-lg mb-6 font-medium">
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
                  className={`bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left border border-white/10 ${
                    showFeedback ? (isCorrect ? 'ring-4 ring-green-500' : isSelected ? 'ring-4 ring-red-500' : '') : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className="text-3xl mr-4">{option.emoji}</div>
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

export default DoctorFearDebate;
