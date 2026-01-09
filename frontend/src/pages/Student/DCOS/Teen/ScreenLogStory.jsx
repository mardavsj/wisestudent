import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ScreenLogStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-21";
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
      text: "You've been gaming for 6 hours straight. Your eyes are tired and you have homework. What should you do?",
      options: [
        { 
          id: "take-break", 
          text: "Take a break and limit screen time", 
          emoji: "⏰", 
          isCorrect: true
        },
        { 
          id: "keep-playing", 
          text: "Keep playing - just one more game", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          id: "play-more", 
          text: "Play for 2 more hours then stop", 
          emoji: "😐", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You've been scrolling social media for 4 hours. You feel drained and haven't done anything productive. What's the best choice?",
      options: [
        { 
          id: "keep-scrolling", 
          text: "Keep scrolling - it's relaxing", 
          emoji: "😑", 
          isCorrect: false
        },
        { 
          id: "set-limit", 
          text: "Set a time limit and do something offline", 
          emoji: "🙂", 
          isCorrect: true
        },
        { 
          id: "scroll-more", 
          text: "Scroll for 1 more hour", 
          emoji: "😐", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You've been watching videos for 5 hours. It's late and you're exhausted. What should you do?",
      options: [
        { 
          id: "watch-more", 
          text: "Watch a few more videos", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          id: "watch-30", 
          text: "Watch for 30 more minutes", 
          emoji: "😐", 
          isCorrect: false
        },
        { 
          id: "stop-rest", 
          text: "Stop and get proper rest", 
          emoji: "😴", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "You've been on your phone for 3 hours instead of studying. Exams are tomorrow. What's the right action?",
      options: [
        { 
          id: "put-away", 
          text: "Put phone away and focus on studying", 
          emoji: "🤨", 
          isCorrect: true
        },
        { 
          id: "keep-phone", 
          text: "Keep using phone - study later", 
          emoji: "😑", 
          isCorrect: false
        },
        { 
          id: "multitask", 
          text: "Use phone while studying", 
          emoji: "😐", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You've spent 8 hours on screens today. You feel tired and haven't exercised. What should you do?",
      options: [
        { 
          id: "continue", 
          text: "Continue using screens", 
          emoji: "😴", 
          isCorrect: false
        },
       
        { 
          id: "use-more", 
          text: "Use screens for 2 more hours", 
          emoji: "😐", 
          isCorrect: false
        },
         { 
          id: "limit-activity", 
          text: "Limit screen time and do physical activity", 
          emoji: "🤔", 
          isCorrect: true
        },
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
      }, isCorrect ? 1000 : 0); // Delay if correct to show animation
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
    navigate("/student/dcos/teen/digital-detox-simulation");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Screen Log Story"
      score={coins}
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/dcos/teens/sleep-health-quiz"
      nextGameIdProp="dcos-teen-22"
      nextEnabled={showResult && finalScore >= 3}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      gameId={gameId}
      gameType="dcos"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore >= 3}
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
                  You understand the importance of managing screen time!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  Remember to take breaks from screens and balance your digital life with offline activities!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, it's important to limit screen time and take breaks!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to choose the option that limits screen time and promotes healthy habits.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ScreenLogStory;

