import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const QuizStressRelief = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { showCorrectAnswerFeedback, resetFeedback, flashPoints, showAnswerConfetti } = useGameFeedback();

  // Hardcode rewards
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const questions = [
  {
    id: 1,
    text: "Which activity is most effective to reduce stress?",
    options: [
      { id: "a", text: "Skip meals", emoji: "🍽️", isCorrect: false },
      { id: "b", text: "Sleep and exercise regularly", emoji: "😴", isCorrect: true },
      { id: "c", text: "Worry constantly", emoji: "😟", isCorrect: false }
    ]
  },
  {
    id: 2,
    text: "Best approach to handle exam stress?",
    options: [
      { id: "a", text: "Pull all-nighters", emoji: "🌙", isCorrect: false },
      { id: "b", text: "Ignore exams", emoji: "🤷", isCorrect: false },
      { id: "c", text: "Take regular study breaks", emoji: "⏸️", isCorrect: true }
    ]
  },
  {
    id: 3,
    text: "What is a healthy pre-bed stress relief habit?",
    options: [
      { id: "a", text: "Late-night studying", emoji: "📚", isCorrect: false },
      { id: "b", text: "Endless screen scrolling", emoji: "📱", isCorrect: false },
      { id: "c", text: "Deep breathing or meditation", emoji: "🧘", isCorrect: true }
    ]
  },
  {
    id: 4,
    text: "How does regular physical activity help reduce stress?",
    options: [
      { id: "a", text: "Releases feel-good chemicals like endorphins", emoji: "😊", isCorrect: true },
      { id: "b", text: "Makes you more tired and cranky", emoji: "😴", isCorrect: false },
      { id: "c", text: "Increases anxiety", emoji: "😰", isCorrect: false }
    ]
  },
  {
    id: 5,
    text: "If you feel overwhelmed, what’s the best action?",
    options: [
      { id: "a", text: "Ignore your feelings", emoji: "🙈", isCorrect: false },
      { id: "b", text: "Talk to a trusted adult or friend", emoji: "🤝", isCorrect: true },
      { id: "c", text: "Keep it all inside", emoji: "🤐", isCorrect: false }
    ]
  }
];


  const handleAnswer = (optionId) => {
    if (showFeedback || gameFinished) return;
    
    setSelectedOption(optionId);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const selectedOptionData = currentQuestionData.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOptionData?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
        resetFeedback();
      } else {
        setGameFinished(true);
      }
    }, isCorrect ? 1000 : 800);
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/reflex-stress-check");
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Stress Relief"
      subtitle={gameFinished ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId="health-male-teen-52"
      gameType="health-male"
      totalLevels={5}
      currentLevel={52}
      showConfetti={gameFinished}
      backPath="/games/health-male/teens"
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {!gameFinished ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
              <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
            </div>

            <p className="text-white text-lg mb-6">
              {currentQuestionData.text}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentQuestionData.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  disabled={showFeedback}
                  className={`p-6 rounded-2xl shadow-lg transition-all transform text-left ${
                    showFeedback && option.isCorrect
                      ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                      : showFeedback && selectedOption === option.id && !option.isCorrect
                      ? "bg-red-500/20 border-2 border-red-400 opacity-75"
                      : selectedOption === option.id
                      ? "bg-blue-600 border-2 border-blue-300 scale-105"
                      : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                  } ${showFeedback ? "cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center">
                    <div className="text-2xl mr-4">{option.emoji}</div>
                    <div>
                      <h3 className="font-bold text-xl mb-1">{option.text}</h3>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {showFeedback && (
              <div className={`rounded-lg p-5 mt-6 ${
                questions[currentQuestion].options.find(opt => opt.id === selectedOption)?.isCorrect
                  ? "bg-green-500/20"
                  : "bg-red-500/20"
              }`}>
                <p className="text-white whitespace-pre-line">
                  {questions[currentQuestion].options.find(opt => opt.id === selectedOption)?.isCorrect
                    ? "Great job! That's exactly right! 🎉"
                    : "Not quite right. Try again next time!"}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h3>
            <p className="text-xl text-white/90 mb-6">
              You scored {score} out of {questions.length}!
            </p>
            <p className="text-white/80 mb-8">
              Great job! Knowing how to manage stress is a superpower.
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

export default QuizStressRelief;
