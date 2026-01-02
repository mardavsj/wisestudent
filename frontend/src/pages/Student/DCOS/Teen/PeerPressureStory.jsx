import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PeerPressureStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "dcos-teen-12";
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
      text: "Your friends create a group to troll and make fun of a classmate online. They say: \"Come on, join us! Everyone's doing it. It's just for fun!\"",
      options: [
        { 
          id: "refuse", 
          text: "Refuse and stand up against trolling", 
          emoji: "🛡️", 
          
          isCorrect: true
        },
        { 
          id: "join", 
          text: "Join them to fit in", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          id: "watch", 
          text: "Watch but don't participate", 
          emoji: "👀", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Your friends want you to spread a rumor about someone. They say: \"It's just gossip, everyone does it!\"",
      options: [
        { 
          id: "spread", 
          text: "Spread the rumor to fit in", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          id: "stop", 
          text: "Refuse and stop the rumor", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          id: "listen", 
          text: "Listen but don't share", 
          emoji: "👂", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Your group wants you to post mean comments about someone. They say: \"Come on, it's just a joke!\"",
      options: [
        { 
          id: "post-mean", 
          text: "Post mean comments to fit in", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          id: "silent", 
          text: "Stay silent", 
          emoji: "🤐", 
          isCorrect: false
        },
        { 
          id: "defend", 
          text: "Refuse and defend the person", 
          emoji: "🛡️", 
          isCorrect: true
        }
      ]
    },
    {
      id: 4,
      text: "Your friends want to exclude someone from a group chat. They say: \"They're annoying, just block them!\"",
      options: [
        { 
          id: "include", 
          text: "Refuse and include everyone", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          id: "block", 
          text: "Block them to fit in", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          id: "neutral", 
          text: "Stay out of it", 
          emoji: "😐", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Your friends are cyberbullying someone and want you to join. They say: \"Everyone's doing it, just join us!\"",
      options: [
        { 
          id: "join-bully", 
          text: "Join them to fit in", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          id: "report", 
          text: "Refuse and report the bullying", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          id: "sidelines", 
          text: "Watch from the sidelines", 
          emoji: "👀", 
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
    navigate("/student/dcos/teen/gossip-chain-simulation");
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  return (
    <GameShell
      title="Peer Pressure Story"
      score={coins}
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
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
                  You understand how to stand up against peer pressure!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80">
                  True friends don't pressure you to hurt others. Stand up for what's right!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, it's important to stand up against cyberbullying!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Try to choose the option that refuses to participate in harmful behavior.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PeerPressureStory;
