import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ExamCheatingStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "moral-teen-8";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "During an important exam, you can easily see your friend's answers. No one is watching. What do you do?",
      options: [
        { 
          id: "honest", 
          text: "Do your own work honestly", 
          emoji: "💎", 
          
          isCorrect: true
        },
        { 
          id: "cheat", 
          text: "Cheat - no one will know", 
          emoji: "😈", 
          isCorrect: false
        },
        { 
          id: "one", 
          text: "Copy just one answer", 
          emoji: "🤔", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friend forgot to do their homework and asks you to show yours. What do you do?",
      options: [
        { 
          id: "copy", 
          text: "Let them copy yours", 
          emoji: "🤝", 
          isCorrect: false
        },
        { 
          id: "explain", 
          text: "Explain answers instead of copying", 
          emoji: "💡", 
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore them completely", 
          emoji: "🙄", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You have an online test and answers are available on Google. What will you do?",
      options: [
        { 
          id: "search", 
          text: "Search answers online", 
          emoji: "🔍", 
          isCorrect: false
        },
        { 
          id: "ai", 
          text: "Ask AI for direct answers", 
          emoji: "🤖", 
          isCorrect: false
        },
        { 
          id: "solve", 
          text: "Try solving yourself honestly", 
          emoji: "🧠", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Your team finishes a project, but your teacher praises only you. What do you do?",
      options: [
        { 
          id: "acknowledge", 
          text: "Acknowledge everyone's effort", 
          emoji: "🌟", 
          isCorrect: true
        },
        { 
          id: "quiet", 
          text: "Stay quiet and take all credit", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          id: "private", 
          text: "Tell teacher later privately", 
          emoji: "🗣️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Your parents didn't see your low grades yet. You can change marks before showing. What do you do?",
      options: [
        { 
          id: "honest2", 
          text: "Show honestly and discuss", 
          emoji: "💬", 
          isCorrect: true
        },
        { 
          id: "change", 
          text: "Change marks and show", 
          emoji: "✏️", 
          isCorrect: false
        },
        { 
          id: "hide", 
          text: "Hide report card", 
          emoji: "🙈", 
          isCorrect: false
        }
      ]
    }
  ];

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
    navigate("/student/moral-values/teen/roleplay-truthful-leader");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Exam Cheating Story"
      score={coins}
      subtitle={showResult ? "Activity Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      gameId={gameId}
      gameType="moral"
      totalLevels={5}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore === questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
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
                {getCurrentQuestion().options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl mb-2">{option.text}</h3>
                    <p className="text-white/90">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You're learning about academic integrity!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  You understand the importance of honesty in academics!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, honesty and integrity matter in all situations!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to choose the option that shows honesty and integrity.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ExamCheatingStory;
