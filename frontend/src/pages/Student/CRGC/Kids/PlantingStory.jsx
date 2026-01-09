import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PlantingStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 1; // 1 coin per question
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "The kids at school want to create a green schoolyard with more trees and plants. Some students say it's too much work. What should you do?",
      options: [
        
        {
          id: "b",
          text: "Tell everyone it's impossible and give up",
          emoji: "😒",
          isCorrect: false
        },
        {
          id: "c",
          text: "Do all the work yourself without telling anyone",
          emoji: "😤",
          isCorrect: false
        },
        {
          id: "a",
          text: "Start a petition to get the principal's support",
          emoji: "📝",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "Your group is planning to plant flowers in the school garden. Some students want to plant only their favorite flowers. How should you decide?",
      options: [
        
        {
          id: "b",
          text: "Let the loudest person decide",
          emoji: "📢",
          isCorrect: false
        },
        {
          id: "a",
          text: "Let everyone vote on which flowers to plant",
          emoji: "🗳️",
          isCorrect: true
        },
        {
          id: "c",
          text: "Plant only what the teacher suggests",
          emoji: "📚",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "During the planting activity, you notice some plants aren't getting enough water. What should you do?",
      options: [
        {
          id: "a",
          text: "Create a watering schedule and assign responsibilities",
          emoji: "⏰",
          isCorrect: true
        },
        {
          id: "b",
          text: "Complain that someone else should take care of it",
          emoji: "😠",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ignore it and hope someone else notices",
          emoji: "🙈",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Some students are not participating in the planting activity, saying it's boring. How should you respond?",
      options: [
        
        {
          id: "b",
          text: "Tell them they have to participate or face consequences",
          emoji: "😡",
          isCorrect: false
        },
        {
          id: "a",
          text: "Explain how the garden will benefit the school and involve them in planning",
          emoji: "🤝",
          isCorrect: true
        },
        {
          id: "c",
          text: "Let them skip the activity without consequences",
          emoji: "😒",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "After a month, the school garden is thriving and attracting positive attention. What should you do next?",
      options: [
        
        {
          id: "b",
          text: "Keep it a secret so only your group knows about it",
          emoji: "🤫",
          isCorrect: false
        },
        {
          id: "c",
          text: "Start criticizing what could have been done better",
          emoji: "😒",
          isCorrect: false
        },
        {
          id: "a",
          text: "Organize a celebration and share the success with the school",
          emoji: "🎉",
          isCorrect: true
        },
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
    navigate("/games/civic-responsibility/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Planting Story"
      score={coins}
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      showGameOver={showResult}
      gameId="civic-responsibility-kids-95"
      gameType="civic-responsibility"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/civic-responsibility/kids"
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/civic-responsibility/kids/poster-we-can-lead"
      nextGameIdProp="civic-responsibility-kids-96">
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
                <div className="text-4xl md:text-5xl mb-4">🌱</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Green Thumb Leader!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand how to lead environmental initiatives at school!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  Great job! You know how to organize and lead successful environmental projects!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, teamwork and planning are key to successful environmental projects!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to choose the option that shows how to effectively lead environmental initiatives.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PlantingStory;