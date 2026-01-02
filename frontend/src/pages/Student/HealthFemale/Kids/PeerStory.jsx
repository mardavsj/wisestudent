import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PeerStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 1; // Default 1 coin per question
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const maxScore = 5;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const questions = [
  {
    id: 1,
    text: "A classmate says, \"Cool girls drink energy drinks.\" Should you follow?",
    options: [
      {
        id: "a",
        text: "No, real coolness comes from making healthy choices",
        emoji: "🙅‍♀️",
        isCorrect: true
      },
      {
        id: "b",
        text: "Yes, I want to fit in with the cool crowd",
        emoji: "⚡",
        isCorrect: false
      },
      {
        id: "c",
        text: "Ask what the drink does to the body",
        emoji: "❓",
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    text: "Friends pressure you to try an energy drink at a party. What do you do?",
    options: [
      {
        id: "a",
        text: "Drink it so you are not left out",
        emoji: "👥",
        isCorrect: false
      },
      {
        id: "c",
        text: "Leave the party quietly",
        emoji: "🚪",
        isCorrect: false
      },
      {
        id: "b",
        text: "Politely refuse and choose water or juice instead",
        emoji: "💬",
        isCorrect: true
      }
    ]
  },
  {
    id: 3,
    text: "An older student says you are not mature if you do not drink energy drinks. How do you respond?",
    options: [
      {
        id: "b",
        text: "Feel unsure and think about trying it",
        emoji: "😰",
        isCorrect: false
      },
      {
        id: "a",
        text: "Maturity means making responsible choices that protect my health",
        emoji: "🧠",
        isCorrect: true
      },
      {
        id: "c",
        text: "Change the topic and walk away",
        emoji: "🚶‍♀️",
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    text: "You see friends feeling sick after drinking too many energy drinks. What do you learn?",
    options: [
      {
        id: "a",
        text: "Think it will not happen to you",
        emoji: "🤷",
        isCorrect: false
      },
      {
        id: "c",
        text: "Laugh and ignore the situation",
        emoji: "😂",
        isCorrect: false
      },
      {
        id: "b",
        text: "I am glad I choose drinks that are healthy for my body",
        emoji: "😊",
        isCorrect: true
      }
    ]
  },
  {
    id: 5,
    text: "A friend stops talking to you because you say no to energy drinks. What do you do?",
    options: [
      {
        id: "a",
        text: "Start drinking energy drinks to keep the friendship",
        emoji: "😔",
        isCorrect: false
      },
      {
        id: "c",
        text: "Feel bad and stop caring about health",
        emoji: "💔",
        isCorrect: false
      },
      {
        id: "b",
        text: "Choose friends who respect my healthy choices",
        emoji: "🤝",
        isCorrect: true
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
    navigate("/games/health-female/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Peer Story"
      score={coins}
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      showGameOver={showResult}
      gameId="health-female-kids-88"
      gameType="health-female"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/health-female/kids"
      maxScore={maxScore}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
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
                <div className="text-4xl md:text-5xl mb-4">👥</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Peer Pressure Pro!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You know how to handle peer pressure!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  Great job! You understand that making healthy choices is more important than fitting in, and true friends respect your decisions!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Handling peer pressure takes practice!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to choose the option that shows healthy ways to deal with peer pressure.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PeerStory;