import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FriendGroupStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "moral-teen-85";
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
      text: "Two friends argue over who did more in a group project. You know both worked equally. What do you do?",
      options: [
        { 
          id: "side", 
          text: "Take one friend's side", 
          emoji: "🙅", 
          
          isCorrect: false
        },
        { 
          id: "silent", 
          text: "Stay silent to avoid tension", 
          emoji: "😶", 
          
          isCorrect: false
        },
        { 
          id: "credit", 
          text: "Give credit to both fairly", 
          emoji: "⚖️", 
          isCorrect: true
        }
      ]
    },
    {
      id: 2,
      text: "There's one juice left and two friends want it. What's the fair action?",
      options: [
        { 
          id: "louder", 
          text: "Let the louder friend take it", 
          emoji: "😅", 
          isCorrect: false
        },
        { 
          id: "split", 
          text: "Split it equally or share turns", 
          emoji: "🫶", 
          isCorrect: true
        },
        { 
          id: "secret", 
          text: "Take it secretly", 
          emoji: "🥴", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your friends can't agree who plays first. How do you handle it?",
      options: [
        { 
          id: "best", 
          text: "Let your best friend start", 
          emoji: "🎮", 
          isCorrect: false
        },
        { 
          id: "quiet2", 
          text: "Start yourself quietly", 
          emoji: "🤫", 
          isCorrect: false
        },
        { 
          id: "turns", 
          text: "Use turns or a quick coin toss", 
          emoji: "🪙", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "One member forgets their part. Others are upset. What's the right step?",
      options: [
        { 
          id: "help", 
          text: "Help them and remind teamwork", 
          emoji: "🤗", 
          isCorrect: true
        },
        { 
          id: "complain", 
          text: "Complain loudly to teacher", 
          emoji: "📢", 
          isCorrect: false
        },
        { 
          id: "do", 
          text: "Do their part silently", 
          emoji: "😓", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "A friend spreads a rumor about another. What's your reaction?",
      options: [
        { 
          id: "join", 
          text: "Join in jokingly", 
          emoji: "😬", 
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Ignore and walk away", 
          emoji: "🚶", 
          isCorrect: false
        },
        { 
          id: "peace", 
          text: "Ask them to apologize and make peace", 
          emoji: "🌈", 
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
    navigate("/student/moral-values/teen/debate-peace-vs-revenge");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Friend Group Story"
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
                  You're learning about fairness in friendship!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  You understand the importance of being fair to all friends!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, fairness keeps friendships strong!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to choose the option that shows fairness to all friends.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FriendGroupStory;
