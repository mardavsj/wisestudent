import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const GroupPressureStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "moral-teen-55";
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
      text: "Your friends start teasing a new student who looks shy and nervous. What do you do?",
      options: [
        { 
          id: "join", 
          text: "Join in the teasing", 
          emoji: "😈", 
          
          isCorrect: false
        },
        { 
          id: "stay", 
          text: "Stay silent and watch", 
          emoji: "😶", 
         
          isCorrect: false
        },
        { 
          id: "stop", 
          text: "Tell your friends to stop", 
          emoji: "🛑", 
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "A friend whispers during the test asking for your answers. What should you do?",
      options: [
        { 
          id: "help", 
          text: "Help your friend cheat", 
          emoji: "🤫", 
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Ignore and focus on your paper", 
          emoji: "🧠", 
          isCorrect: true
        },
        { 
          id: "complain", 
          text: "Complain loudly in the class", 
          emoji: "📢", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your group wants to skip cleaning duty, but you think it's wrong. What will you do?",
      options: [
        { 
          id: "agree", 
          text: "Agree with them", 
          emoji: "😬", 
          isCorrect: false
        },
        { 
          id: "remind", 
          text: "Remind them it's everyone's duty", 
          emoji: "🧹", 
          isCorrect: true
        },
        { 
          id: "quiet", 
          text: "Stay quiet", 
          emoji: "😐", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "A classmate makes a silly mistake while reading aloud, and your group laughs. What do you do?",
      options: [
        { 
          id: "encourage", 
          text: "Stop others and encourage your classmate", 
          emoji: "💪", 
          isCorrect: true
        },
        { 
          id: "laugh", 
          text: "Laugh along with your friends", 
          emoji: "😅", 
          isCorrect: false
        },
        { 
          id: "silent", 
          text: "Stay quiet and ignore", 
          emoji: "😶", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Your friends want to skip team practice to hang out, but the coach trusts you to show up. What do you do?",
      options: [
        { 
          id: "go", 
          text: "Go with them and skip practice", 
          emoji: "😎", 
          isCorrect: false
        },
        { 
          id: "excuse", 
          text: "Make an excuse to the coach", 
          emoji: "🙄", 
          isCorrect: false
        },
        { 
          id: "show", 
          text: "Show up and practice alone", 
          emoji: "🏃‍♀️", 
          isCorrect: true
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
    navigate("/student/moral-values/teen/debate-fear-vs-courage");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Group Pressure Story"
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
                  You're learning to resist peer pressure and do what's right!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  You understand the importance of standing up for what's right!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, standing up to peer pressure shows real strength!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to choose the option that resists peer pressure and does what's right.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default GroupPressureStory;
