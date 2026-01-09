import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const NewClassmateStory = () => {
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
      text: "A new student joins your class. They speak with an accent and seem nervous. What should you do?",
      options: [
        {
          id: "a",
          text: "Welcome them and offer to show them around",
          emoji: "🤗",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore them and sit with your usual friends",
          emoji: "😒",
          isCorrect: false
        },
        {
          id: "c",
          text: "Ask loudly where they're from in front of everyone",
          emoji: "📢",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "The new student seems to be struggling with the language. How can you help?",
      options: [
        
        {
          id: "b",
          text: "Avoid talking to them to prevent embarrassment",
          emoji: "🤫",
          isCorrect: false
        },
        {
          id: "a",
          text: "Speak slowly and use simple words when talking to them",
          emoji: "🗣️",
          isCorrect: true
        },
        {
          id: "c",
          text: "Make jokes about how they speak",
          emoji: "😂",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "During lunch, the new student sits alone. What's the kind thing to do?",
      options: [
        
        {
          id: "b",
          text: "Tell your friends to stay away from the 'new kid'",
          emoji: "🙅",
          isCorrect: false
        },
        {
          id: "c",
          text: "Stare at them and whisper to your friends",
          emoji: "👀",
          isCorrect: false
        },
        {
          id: "a",
          text: "Invite them to sit with you and your friends",
          emoji: "🍱",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "The new student wears traditional clothing from their home country. How should you react?",
      options: [
        {
          id: "a",
          text: "Ask respectfully about their clothing and culture",
          emoji: "👗",
          isCorrect: true
        },
        {
          id: "b",
          text: "Tell them to change into 'normal' clothes",
          emoji: "😒",
          isCorrect: false
        },
        {
          id: "c",
          text: "Laugh and point at their clothing",
          emoji: "😆",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "The new student seems to be good at a sport that's popular in their country. What should you do?",
      options: [
        {
          id: "a",
          text: "Ask them to teach you about the sport and its rules",
          emoji: "⚽",
          isCorrect: true
        },
        {
          id: "b",
          text: "Ignore their skills because it's not a sport you know",
          emoji: "😒",
          isCorrect: false
        },
        {
          id: "c",
          text: "Try to prove you're better than them at their own sport",
          emoji: "😤",
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
    navigate("/games/civic-responsibility/kids");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="New Classmate Story"
      score={coins}
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      showGameOver={showResult}
      gameId="civic-responsibility-kids-88"
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
      nextGamePathProp="/student/civic-responsibility/kids/reflex-global-respect"
      nextGameIdProp="civic-responsibility-kids-89">
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
                <div className="text-4xl md:text-5xl mb-4">🌟</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Friendship Builder!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand how to welcome and include new classmates!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  Great job! You know how to make new classmates feel welcome and included!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, welcoming new classmates helps create a friendly and inclusive school environment!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to choose the option that shows how to be welcoming and inclusive to new classmates.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default NewClassmateStory;