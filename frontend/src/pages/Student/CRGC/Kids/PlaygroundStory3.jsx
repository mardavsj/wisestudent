import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PlaygroundStory3 = () => {
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
      text: "The teacher only lets boys play football during recess. Is this fair?",
      options: [
        {
          id: "a",
          text: "Yes, boys are stronger",
          emoji: "💪",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "It doesn't matter",
          emoji: "🤷",
          isCorrect: false
        },
        {
          id: "b",
          text: "No, everyone should have a chance to play",
          emoji: "⚽",
          isCorrect: true
        },
      ]
    },
    {
      id: 2,
      text: "Some girls want to play football too. How should the teacher respond?",
      options: [
        {
          id: "a",
          text: "Create separate teams for boys and girls",
          emoji: "👥",
          isCorrect: false
        },
        
        {
          id: "c",
          text: "Ignore their request",
          emoji: "🤐",
          isCorrect: false
        },
        {
          id: "b",
          text: "Let everyone play together",
          emoji: "🤝",
          isCorrect: true
        },
      ]
    },
    {
      id: 3,
      text: "What if some boys don't want girls on their team?",
      options: [
        {
          id: "a",
          text: "Let the boys decide who can play",
          emoji: "👦",
          isCorrect: false
        },
        {
          id: "b",
          text: "Explain that everyone has the right to play",
          emoji: "🤝",
          isCorrect: true
        },
        {
          id: "c",
          text: "Force the boys to accept it",
          emoji: "😤",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How can you support equal opportunities in your school?",
      options: [
        {
          id: "a",
          text: "Speak up when you see unfair treatment",
          emoji: "📢",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore it to avoid conflict",
          emoji: "🤐",
          isCorrect: false
        },
        {
          id: "c",
          text: "Join in the unfair behavior",
          emoji: "😒",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What should the school do to ensure all students have fun during recess?",
      options: [
        
        {
          id: "b",
          text: "Stick to traditional gender-based activities",
          emoji: "🧱",
          isCorrect: false
        },
        {
          id: "c",
          text: "Let only popular students choose activities",
          emoji: "👑",
          isCorrect: false
        },
        {
          id: "a",
          text: "Offer a variety of activities for everyone",
          emoji: "🎪",
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
      title="Playground Story"
      score={coins}
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      showGameOver={showResult}
      gameId="civic-responsibility-kids-61"
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
      nextGamePathProp="/student/civic-responsibility/kids/quiz-on-rights"
      nextGameIdProp="civic-responsibility-kids-62">
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
                <div className="text-4xl md:text-5xl mb-4">⚽</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Equality Champion!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand how to promote equality and inclusion!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  Great job! You know how to stand up for fairness and inclusion!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, everyone deserves equal opportunities regardless of gender!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to choose the option that promotes equality and inclusion for all.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PlaygroundStory3;