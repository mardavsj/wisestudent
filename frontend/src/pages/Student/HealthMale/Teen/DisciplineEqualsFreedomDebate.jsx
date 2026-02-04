import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const DisciplineEqualsFreedomDebate = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0); // Track number of correct answers for score
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Hardcode rewards: 4 coins per question, 20 total coins, 40 total XP
  const coinsPerLevel = 4;
  const totalCoins = 20;
  const totalXp = 40;

  const questions = [
  {
    id: 1,
    text: "Does practicing discipline give you freedom or restrict your life?",
    options: [
      { id: "a", text: "It restricts life", emoji: "🔒" },
      { id: "b", text: "It limits choices", emoji: "🚫" },
      { id: "c", text: "It enables freedom", emoji: "🕊️" }
    ],
    correctAnswer: "c",
    explanation: "Self-discipline creates structure, allowing you to make better choices and pursue goals freely, rather than feeling constrained by impulsive decisions."
  },
  {
    id: 2,
    text: "How does self-discipline help teens achieve long-term success?",
    options: [
      { id: "a", text: "Builds self-control", emoji: "💪" },
      { id: "b", text: "Adds more work", emoji: "📚" },
      { id: "c", text: "Removes all fun", emoji: "😔" }
    ],
    correctAnswer: "a",
    explanation: "Discipline fosters self-control, which is essential for achieving personal and academic goals, leading to greater independence and fulfillment."
  },
  {
    id: 3,
    text: "What is the subtle link between rules and freedom?",
    options: [
      { id: "a", text: "Rules prevent freedom", emoji: "🚫" },
      { id: "b", text: "No connection", emoji: "🤷" },
      { id: "c", text: "Rules enable responsible freedom", emoji: "⚖️" }
    ],
    correctAnswer: "c",
    explanation: "Rules provide a framework that guides responsible behavior, which paradoxically increases freedom by reducing chaos and consequences of poor choices."
  },
  {
    id: 4,
    text: "In what way does self-discipline affect future opportunities?",
    options: [
      { id: "b", text: "Limits chances", emoji: "🚪" },
      { id: "a", text: "Creates more opportunities", emoji: "🚀" },
      { id: "c", text: "Has no effect", emoji: "😐" }
    ],
    correctAnswer: "a",
    explanation: "Consistent discipline helps teens build skills, reputation, and habits that open doors to academic, career, and personal opportunities."
  },
  {
    id: 5,
    text: "What is the ultimate outcome of consistent self-discipline?",
    options: [
      { id: "c", text: "Personal mastery and freedom", emoji: "👑" },
      { id: "a", text: "Boredom and restriction", emoji: "😴" },
      { id: "b", text: "Constant struggle", emoji: "😩" },
    ],
    correctAnswer: "c",
    explanation: "Mastering discipline gives teens control over their actions, leading to true freedom, confidence, and the ability to achieve meaningful goals."
  }
];
  
  // Set global window variables for useGameFeedback
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__flashTotalCoins = totalCoins;
      window.__flashQuestionCount = questions.length;
      window.__flashPointsMultiplier = coinsPerLevel;
      
      return () => {
        // Clean up on unmount
        window.__flashTotalCoins = null;
        window.__flashQuestionCount = null;
        window.__flashPointsMultiplier = 1;
      };
    }
  }, [totalCoins, coinsPerLevel, questions.length]);

  // Debug logging
  useEffect(() => {
    console.log('🎮 DisciplineEqualsFreedomDebate debug:', {
      correctAnswers,
      coins,
      coinsPerLevel,
      totalCoins,
      questionsLength: questions.length,
      gameFinished
    });
  }, [correctAnswers, coins, coinsPerLevel, totalCoins, gameFinished, questions.length]);

  // Debug: Log GameShell props
  useEffect(() => {
    if (gameFinished) {
      console.log('🎮 GameShell props:', {
        score: correctAnswers,
        maxScore: questions.length,
        coinsPerLevel,
        totalCoins,
        totalXp,
        totalLevels: questions.length
      });
    }
  }, [gameFinished, correctAnswers, coinsPerLevel, totalCoins, totalXp, questions.length]);


  const handleOptionSelect = (optionId) => {
    if (selectedOption || showFeedback) return;
    
    resetFeedback(); // Reset any existing feedback
    
    setSelectedOption(optionId);
    const isCorrect = optionId === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setCoins(prev => prev + 4); // Increment coins when correct (4 coins per question)
      setCorrectAnswers(prev => prev + 1); // Increment correct answers count
      // Show feedback after state updates
      setTimeout(() => {
        showCorrectAnswerFeedback(1, true);
      }, 50);
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
    }, 5000);
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/student/health-male/teens/journal-of-teen-habits");
  };

  return (
    <GameShell
      title="Debate: Discipline = Freedom?"
      subtitle={`Debate ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={correctAnswers}
      gameId="health-male-teen-96"
      nextGamePathProp="/student/health-male/teens/journal-of-teen-habits"
      nextGameIdProp="health-male-teen-97"
      gameType="health-male"
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      totalLevels={questions.length}
      showConfetti={gameFinished}
      flashPoints={flashPoints}
      backPath="/games/health-male/teens"
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/80">Debate {currentQuestion + 1}/{questions.length}</span>
            <span className="text-yellow-400 font-bold">Score: {correctAnswers}</span>
          </div>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">🎭</div>
            <h3 className="text-2xl font-bold text-white mb-2">Discipline & Freedom Debate</h3>
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
      </div>
      {gameFinished && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Debate Complete!</h3>
          <p className="text-xl text-white/90 mb-6">
            You finished the game with {correctAnswers} out of {questions.length} correct
          </p>
          <p className="text-xl text-white/90 mb-6">
            You earned {coins} coins!
          </p>
          <p className="text-white/80 mb-8">
            Great job understanding the connection between discipline and freedom!
          </p>
          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all transform hover:scale-105"
          >
            Next Challenge
          </button>
        </div>
      )}
    </GameShell>
  );
};

export default DisciplineEqualsFreedomDebate;

