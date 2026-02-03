import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const PubertyAwkwardDebateTeen = () => {
  const navigate = useNavigate();

  // Get game data from game category folder (source of truth)
  const gameId = "health-male-teen-26";

  // Hardcode rewards to align with rule: 2 coins per question, 10 total coins, 20 total XP
  const coinsPerLevel = 2;
  const totalCoins = 10;
  const totalXp = 20;

  const [score, setScore] = useState(0); // Track correct answers like PubertySmartTeenBadge
  const [coins, setCoins] = useState(0); // Track total coins earned
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
  {
    id: 1,
    text: "Your voice cracks during a presentation. How should you react?",
    options: [
      { id: "b", text: "Stop talking and hide", emoji: "🙈" },
      { id: "a", text: "Laugh it off confidently", emoji: "😂" },
      { id: "c", text: "Apologize repeatedly", emoji: "😅" }
    ],
    correctAnswer: "a",
    explanation: "Voice cracks are normal during puberty. Laughing it off shows confidence and everyone experiences it."
  },
  {
    id: 2,
    text: "You notice hair growth in new places. How should you feel?",
    options: [
      { id: "a", text: "It's a natural part of growing up", emoji: "🧔" },
      { id: "b", text: "Shave everything immediately", emoji: "🪒" },
      { id: "c", text: "Cover it with clothes all the time", emoji: "👕" }
    ],
    correctAnswer: "a",
    explanation: "Body hair is normal and healthy. Everyone experiences it at their own pace."
  },
  {
    id: 3,
    text: "You trip often because you're growing quickly. What’s best?",
    options: [
      { id: "b", text: "Avoid sports entirely", emoji: "🏳️" },
      { id: "c", text: "Blame yourself for being clumsy", emoji: "😓" },
      { id: "a", text: "Be patient, coordination improves", emoji: "⏳" },
    ],
    correctAnswer: "a",
    explanation: "Rapid growth can make you clumsy temporarily. With practice, your body and brain adapt."
  },
  {
    id: 4,
    text: "Your emotions are all over the place lately. What’s true?",
    options: [
      { id: "b", text: "You must control them perfectly", emoji: "🛑" },
      { id: "a", text: "Hormones are causing the shifts", emoji: "🧪" },
      { id: "c", text: "You're unusual if you feel sad sometimes", emoji: "😢" }
    ],
    correctAnswer: "a",
    explanation: "Mood swings are a normal part of puberty. Everyone experiences them."
  },
  {
    id: 5,
    text: "You want to learn about your changing body. What should you do?",
    options: [
      { id: "a", text: "Ask trusted adults or health professionals", emoji: "👨‍👩‍👦" },
      { id: "b", text: "Only search online", emoji: "💻" },
      { id: "c", text: "Never ask anyone", emoji: "🤫" }
    ],
    correctAnswer: "a",
    explanation: "Trusted adults provide accurate guidance. The internet can have misleading information."
  }
];


  // Set global window variables for useGameFeedback to ensure correct +2 popup
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Force cleanup first to prevent interference from other games
      window.__flashTotalCoins = null;
      window.__flashQuestionCount = null;
      window.__flashPointsMultiplier = 1; // Set to 1 to avoid multiplication
      
      // Set the correct values for this game
      window.__flashTotalCoins = totalCoins;        // 10
      window.__flashQuestionCount = questions.length; // 5
      // window.__flashPointsMultiplier is already set to 1 above
      
      return () => {
        // Clean up on unmount
        window.__flashTotalCoins = null;
        window.__flashQuestionCount = null;
        window.__flashPointsMultiplier = null;
      };
    }
  }, [totalCoins, coinsPerLevel, questions.length]);

  const handleOptionSelect = (optionId) => {
    if (selectedOption || showFeedback) return;
    
    resetFeedback(); // Reset any existing feedback
    
    setSelectedOption(optionId);
    const isCorrect = optionId === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1); // Increment correct answers like PubertySmartTeenBadge
      setCoins(prev => prev + coinsPerLevel); // 2 coins per correct answer
      showCorrectAnswerFeedback(coinsPerLevel, true); // Show +2 popup
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        // Calculate final score - add 1 if current answer was correct
        const correctAnswers = Math.floor(coins / coinsPerLevel) + (isCorrect ? 1 : 0);
        setFinalScore(correctAnswers);
        setShowResult(true);
      }
    }, isCorrect ? 5000 : 5000);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0); // Reset score like in PubertySmartTeenBadge
    setCoins(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setFinalScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/health-male/teens/teen-growth-journal");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Puberty Awkward Debate"
      score={score}
      subtitle={showResult ? "Debate Complete!" : `Debate ${currentQuestion + 1} of ${questions.length}`}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/health-male/teens/teen-growth-journal"
      nextGameIdProp="health-male-teen-27"
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
                <span className="text-white/80 text-sm md:text-base">Debate {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Score: {score}/{questions.length}</span>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-4xl md:text-5xl mb-4">🧑</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Puberty Awkward Debate</h3>
              </div>
              
              <p className="text-white text-base md:text-lg mb-6 text-center">
                {getCurrentQuestion().text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
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
                      className={`bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left ${
                        showFeedback ? (isCorrect ? 'ring-4 ring-green-500' : isSelected ? 'ring-4 ring-red-500' : '') : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="text-2xl md:text-3xl mr-3 md:mr-4">{option.emoji}</div>
                        <div>
                          <h3 className="font-bold text-base md:text-xl mb-1">{option.text}</h3>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {showFeedback && (
                <div className={`mt-4 md:mt-6 p-4 rounded-xl ${
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
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20 text-center flex-1 flex flex-col justify-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-4xl md:text-5xl mb-4">🧑</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Puberty Debate Champion!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} debates correct!
                  You understand how to handle awkward puberty moments with confidence!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  Great job! You know how to respond to awkward puberty situations with healthy confidence!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} debates correct.
                  Remember, everyone goes through awkward puberty moments - learning helps you handle them better!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to choose responses that show healthy ways to handle awkward puberty situations.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PubertyAwkwardDebateTeen;

