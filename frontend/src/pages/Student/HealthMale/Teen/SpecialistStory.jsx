import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const SpecialistStory = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const questions = [
  {
    id: 1,
    text: "Your acne suddenly worsens after starting a new gym supplement and appears along the jawline. What is the most informed next step?",
    options: [
      {
        id: "a",
        text: "Continue supplements and add face washes",
        emoji: "🙂",
        isCorrect: false
      },
      {
        id: "b",
        text: "Consult a dermatologist and mention supplement use",
        emoji: "🧑‍⚕️",
        isCorrect: true
      },
      {
        id: "c",
        text: "Assume it’s hormonal and ignore it",
        emoji: "🤷",
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    text: "Why is sharing your full medical history with a dermatologist clinically important?",
    options: [
      {
        id: "a",
        text: "It helps rule out drug interactions and underlying conditions",
        emoji: "😊",
        isCorrect: true
      },
      {
        id: "b",
        text: "It speeds up the appointment",
        emoji: "⏱️",
        isCorrect: false
      },
      {
        id: "c",
        text: "Doctors prefer detailed stories",
        emoji: "📖",
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    text: "A dermatologist prescribes a retinoid that initially causes mild irritation. What does this usually indicate?",
    options: [
      {
        id: "a",
        text: "The treatment is ineffective",
        emoji: "❌",
        isCorrect: false
      },
      
      {
        id: "c",
        text: "You should stop immediately",
        emoji: "⛔",
        isCorrect: false
      },
      {
        id: "b",
        text: "Skin is adjusting to increased cell turnover",
        emoji: "🔄",
        isCorrect: true
      },
    ]
  },
  {
    id: 4,
    text: "Why are follow-up visits essential even if your skin shows improvement?",
    options: [
      {
        id: "a",
        text: "To monitor long-term effects and prevent relapse",
        emoji: "📊",
        isCorrect: true
      },
      {
        id: "b",
        text: "To change medicines frequently",
        emoji: "🔁",
        isCorrect: false
      },
      {
        id: "c",
        text: "Doctors require regular visits",
        emoji: "📅",
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    text: "You experience unusual dryness and vision discomfort during acne treatment. What is the safest action?",
    options: [
      
      {
        id: "b",
        text: "Increase moisturizer only",
        emoji: "🧴",
        isCorrect: false
      },
      {
        id: "a",
        text: "Reduce dose and inform the dermatologist immediately",
        emoji: "📞",
        isCorrect: true
      },
      {
        id: "c",
        text: "Stop treatment without consultation",
        emoji: "⏹️",
        isCorrect: false
      }
    ]
  }
];


  const handleChoice = (optionId) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: optionId,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === optionId)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === optionId)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/doctor-fear-debate");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Specialist Story"
      score={coins}
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      showGameOver={showResult}
      gameId="health-male-teen-75"
      gameType="health-male"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/health-male/teens"
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
    >
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
              </div>
              
              <h2 className="text-white text-base md:text-lg lg:text-xl mb-4 md:mb-6 text-center">
                {getCurrentQuestion().text}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl md:text-3xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-base md:text-xl mb-2">{option.text}</h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20 text-center flex-1 flex flex-col justify-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-4xl md:text-5xl mb-4">⚕️</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Specialist Success!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand when and how to seek specialist care!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  Great job! You know how to properly interact with specialists and follow their advice!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, specialists provide valuable expertise for complex health issues!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to choose the option that shows proper interaction with healthcare specialists.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SpecialistStory;
