import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const TeachNumbersGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("ai-kids-61");
  const gameId = gameData?.id || "ai-kids-61";
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [coins, setCoins] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Questions about teaching numbers to AI (exactly 5 questions)
  const questions = [
    {
      id: 1,
      text: "How should we teach a robot to count to 3?",
      options: [
        { 
          id: "examples", 
          text: "Show many examples of 1, 2, and 3 ", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          id: "once", 
          text: "Show each number only once ", 
          emoji: "📷", 
          isCorrect: false
        },
        { 
          id: "mixed", 
          text: "Mix up the numbers randomly ", 
          emoji: "🎲", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What's the best way to help AI recognize the number 2?",
      options: [
        { 
          id: "same", 
          text: "Always show 2 as the same picture ", 
          emoji: "🖼️", 
          isCorrect: false
        },
        { 
          id: "different", 
          text: "Show 2 in different styles (dots, fingers, blocks) ", 
          emoji: "🔄", 
          isCorrect: true
        },
        { 
          id: "fast", 
          text: "Flash images of 2 very quickly ", 
          emoji: "⚡", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Why is it important to label numbers correctly when teaching AI?",
      options: [
        { 
          id: "learn", 
          text: "So AI learns the right associations ", 
          emoji: "😏", 
          isCorrect: true
        },
        { 
          id: "any", 
          text: "Any label works the same ", 
          emoji: "🤷", 
          isCorrect: false
        },
        { 
          id: "skip", 
          text: "We can skip labeling to save time ⏭", 
          emoji: "⏭️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "What helps robots understand that 3 is more than 2?",
      options: [
        { 
          id: "separate", 
          text: "Teach numbers completely separately ", 
          emoji: "🚫", 
          isCorrect: false
        },
        { 
          id: "words", 
          text: "Just tell it verbally without visuals ", 
          emoji: "🗣️", 
          isCorrect: false
        },
        { 
          id: "compare", 
          text: "Show groups of items to compare ", 
          emoji: "📊", 
          isCorrect: true
        }
      ]
    },
    {
      id: 5,
      text: "How often should we practice teaching numbers to AI?",
      options: [
        { 
          id: "regular", 
          text: "Practice regularly with new examples ", 
          emoji: "📅", 
          isCorrect: true
        },
        { 
          id: "once", 
          text: "Teach once and never repeat ", 
          emoji: "🛑", 
          isCorrect: false
        },
        { 
          id: "random", 
          text: "Practice randomly with no pattern ", 
          emoji: "🔀", 
          isCorrect: false
        }
      ]
    }
  ];

  // Function to get options without rotation - keeping actual positions fixed
  const getRotatedOptions = (options, questionIndex) => {
    // Return options without any rotation to keep their actual positions fixed
    return options;
  };

  const getCurrentQuestion = () => questions[currentQuestion];
  const displayOptions = getRotatedOptions(getCurrentQuestion().options, currentQuestion);

  const handleChoice = (selectedChoice) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: selectedChoice,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 0);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setShowResult(true);
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
    navigate("/student/ai-for-all/kids/robot-confusion-story");
  };

  return (
    <GameShell
      title="Teach Numbers Game 🔢"
      score={coins}
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/kids/robot-confusion-story"
      nextGameIdProp="ai-kids-62"
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      
      gameId={gameId}
      gameType="ai"
      totalLevels={20}
      currentLevel={61}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Coins: {coins}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {getCurrentQuestion().text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl">{option.text}</h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🔢</div>
                <h3 className="text-2xl font-bold text-white mb-4">Number Teaching Expert!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand how to teach numbers to AI!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <div className="bg-green-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white/90 text-sm">
                    🌟 Excellent! You know that teaching AI requires consistent examples, correct labels, visual comparisons, and regular practice!
                  </p>
                </div>
                <p className="text-white/80">
                  Your teaching skills help robots understand numbers and quantities!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Keep practicing to learn more about teaching numbers to AI!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
                  <p className="text-white/90 text-sm">
                    💡 Remember: Teaching AI works best with consistent examples, correct labels, visual aids, and regular practice!
                  </p>
                </div>
                <p className="text-white/80 text-sm">
                  Think about what helps robots understand abstract concepts like numbers and quantities.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default TeachNumbersGame;