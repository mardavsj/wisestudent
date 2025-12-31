import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HygieneProBadge50 = () => {
  const navigate = useNavigate();
  
  // Hardcoded Game Rewards & Configuration
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const maxScore = 5;
  const gameId = "health-male-teen-50";

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
  {
    id: 1,
    title: "Sweat Control",
    text: "Which helps prevent sweat odor during sports?",
    options: [
      { text: "Perfume", emoji: "🌸", isCorrect: false },
      { text: "Loose breathable clothes", emoji: "👕", isCorrect: true },
      { text: "Water splash only", emoji: "💧", isCorrect: false },
      { text: "Layering sweatshirts", emoji: "🧥", isCorrect: false }
    ],
    feedback: {
      correct: "Exactly! Breathable clothing helps prevent odor by letting sweat evaporate.",
      wrong: "Perfume masks smell but doesn't prevent it. Breathable fabrics are key."
    }
  },
  {
    id: 2,
    title: "Teeth Care",
    text: "Best habit to keep teeth healthy?",
    options: [
      
      { text: "Rinse with water only", emoji: "💧", isCorrect: false },
      { text: "Chew gum constantly", emoji: "🍬", isCorrect: false },
      { text: "Brush once a week", emoji: "🗓️", isCorrect: false },
      { text: "Brush 2x/day", emoji: "🪥", isCorrect: true },
    ],
    feedback: {
      correct: "Yes! Brushing twice a day keeps teeth strong and prevents cavities.",
      wrong: "Water rinse alone is not enough; brushing twice daily is essential."
    }
  },
  {
    id: 3,
    title: "Hand Hygiene",
    text: "After which situation is hand hygiene most critical?",
    options: [
      
      { text: "After sitting in class", emoji: "🏫", isCorrect: false },
      { text: "After reading a book", emoji: "📖", isCorrect: false },
      { text: "After petting animals", emoji: "🐶", isCorrect: true },
      { text: "After texting", emoji: "📱", isCorrect: false }
    ],
    feedback: {
      correct: "Exactly! Hands can carry germs from animals, so washing after is important.",
      wrong: "You must wash hands after contact with animals or potentially dirty surfaces."
    }
  },
  {
    id: 4,
    title: "Clothing Hygiene",
    text: "Which habit prevents body odor the most?",
    options: [
      
      { text: "Use perfume only", emoji: "🌸", isCorrect: false },
      { text: "Change underwear daily", emoji: "🫥", isCorrect: true },
      { text: "Wear same socks 2 days", emoji: "🧦", isCorrect: false },
      { text: "Layer clothes without washing", emoji: "🧥", isCorrect: false }
    ],
    feedback: {
      correct: "Right! Daily changes of underwear and socks prevent odor and infections.",
      wrong: "Perfume masks smell but does not prevent bacteria buildup."
    }
  },
  {
    id: 5,
    title: "Confidence Boost",
    text: "Why does good hygiene improve social confidence?",
    options: [
       { text: "You feel fresh and respected", emoji: "😎", isCorrect: true },
      { text: "You look taller", emoji: "📏", isCorrect: false },
     
      { text: "You earn money", emoji: "💰", isCorrect: false },
      { text: "You skip chores", emoji: "🧹", isCorrect: false }
    ],
    feedback: {
      correct: "Exactly! Feeling clean boosts self-esteem and social confidence.",
      wrong: "Good hygiene makes you feel fresh and confident, positively affecting social interactions."
    }
  }
];


  const handleChoice = (optionIndex) => {
    if (answered) return;

    setAnswered(true);
    setSelectedOptionIndex(optionIndex);
    resetFeedback();

    const selectedOption = questions[currentQuestion].options[optionIndex];
    const isCorrect = selectedOption.isCorrect;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    const isLastQuestion = currentQuestion === questions.length - 1;

    setTimeout(() => {
      if (isLastQuestion) {
        setGameFinished(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
        setSelectedOptionIndex(null);
      }
    }, 2000);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setGameFinished(false);
    setSelectedOptionIndex(null);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/stress-story");
  };

  const currentQ = questions[currentQuestion];

  return (
    <GameShell
      title="Hygiene Pro Badge"
      subtitle={gameFinished ? "Game Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="health-male"
      totalLevels={5}
      currentLevel={10}
      showConfetti={gameFinished && score >= 4}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
      <div className="space-y-8">
        {!gameFinished ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{maxScore}</span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2 text-center">
                {currentQ.title}
              </h2>
              
              <p className="text-xl text-white mb-8 text-center">
                {currentQ.text}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOptionIndex === idx;
                  const showFeedback = answered;

                  let buttonClass = "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3";

                  if (showFeedback) {
                    if (isSelected) {
                      buttonClass = option.isCorrect
                        ? "bg-green-500 ring-4 ring-green-300 text-white p-6 rounded-2xl shadow-lg min-h-[60px] flex items-center justify-center gap-3"
                        : "bg-red-500 ring-4 ring-red-300 text-white p-6 rounded-2xl shadow-lg min-h-[60px] flex items-center justify-center gap-3";
                    } else {
                      buttonClass = "bg-white/10 opacity-50 text-white p-6 rounded-2xl shadow-lg min-h-[60px] flex items-center justify-center gap-3";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleChoice(idx)}
                      disabled={showFeedback}
                      className={buttonClass}
                    >
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="font-bold text-lg">{option.text}</span>
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className={`mt-4 p-4 rounded-xl ${
                  currentQ.options[selectedOptionIndex]?.isCorrect
                    ? "bg-green-500/20 border border-green-500/30"
                    : "bg-red-500/20 border border-red-500/30"
                }`}>
                  <p className="text-white font-semibold">
                    {currentQ.options[selectedOptionIndex]?.isCorrect
                      ? currentQ.feedback.correct
                      : currentQ.feedback.wrong}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 4 ? (
              <div>
                <div className="text-6xl mb-4">🏅</div>
                <h3 className="text-3xl font-bold text-white mb-4">Hygiene Pro Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about teen hygiene with {score} correct answers out of {questions.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Hygiene Pro</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Personal Care</h4>
                    <p className="text-white/90 text-sm">
                      You understand the importance of daily hygiene routines for health and confidence.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Skin Health</h4>
                    <p className="text-white/90 text-sm">
                      You know how to properly care for your skin during puberty to prevent issues.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Hygiene!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {questions.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review hygiene practices to strengthen your knowledge and earn your badge.
                </p>
                <button
                  onClick={handleRetry}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default HygieneProBadge50;
