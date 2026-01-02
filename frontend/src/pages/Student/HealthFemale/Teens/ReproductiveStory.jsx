import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const ReproductiveStory = () => {
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
      text: "In health class, the teacher begins explaining reproductive health. This is a normal part of growing up. What should the girls do?",
      options: [
        {
          id: "a",
          text: "Listen calmly and respectfully",
          emoji: "👂",
          isCorrect: true
        },
        {
          id: "b",
          text: "Giggle and make jokes about it",
          emoji: "😂",
          isCorrect: false
        },
        {
          id: "c",
          text: "Put their hands over their ears",
          emoji: "🙉",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "A friend asks you about changes happening to her body. What is the best response?",
      options: [
        {
          id: "a",
          text: "Tell her it's normal and she can talk to a trusted adult",
          emoji: "💬",
          isCorrect: false
        },
        {
          id: "b",
          text: "Be supportive and encourage her to talk to an adult",
          emoji: "🤗",
          isCorrect: true
        },
        {
          id: "c",
          text: "Ignore her question",
          emoji: "🤐",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You notice changes in your body that worry you. What should you do?",
      options: [
        {
          id: "a",
          text: "Talk to a parent, teacher, or healthcare provider",
          emoji: "👩‍⚕️",
          isCorrect: true
        },
        {
          id: "b",
          text: "Research online without any guidance",
          emoji: "💻",
          isCorrect: false
        },
        {
          id: "c",
          text: "Keep your worries to yourself",
          emoji: "🤐",
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Your friend is embarrassed about body changes. How can you help?",
      options: [
        {
          id: "a",
          text: "Reassure her that changes are normal and everyone goes through them",
          emoji: "🤗",
          isCorrect: true
        },
        {
          id: "b",
          text: "Tell her she's weird",
          emoji: "😤",
          isCorrect: false
        },
        {
          id: "c",
          text: "Share her concerns with others without permission",
          emoji: "📢",
          isCorrect: false
        }
      ]
    },
   {
  id: 5,
  text: "Learning about reproductive health helps you:",
  options: [
    {
      id: "a",
      text: "Feel scared about body changes",
      emoji: "😟",
      isCorrect: false
    },
    {
      id: "b",
      text: "Feel embarrassed and confused",
      emoji: "😳",
      isCorrect: false
    },
    {
      id: "c",
      text: "Make better health decisions",
      emoji: "🙂",
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
    navigate("/student/health-female/teens/quiz-reproductive-basics");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Reproductive Story"
      score={coins}
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      showGameOver={showResult}
      gameId="health-female-teen-31"
      gameType="health-female"
      totalLevels={40}
      currentLevel={31}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/health-female/teens"
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
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg transition-all transform hover:scale-105"
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
                <div className="text-4xl md:text-5xl mb-4">🧠</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Reproductive Health Expert!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand the importance of reproductive health education!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  Great job! You know that listening respectfully in health class, supporting friends, talking to trusted adults about concerns, and learning about reproductive health are all important for your wellbeing!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Learning about reproductive health is an important part of growing up!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to choose the option that shows the most respectful and informed approach to reproductive health topics.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReproductiveStory;