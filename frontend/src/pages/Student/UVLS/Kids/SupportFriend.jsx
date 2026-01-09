import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SupportFriend = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "uvls-kids-35";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Your friend is being bullied and looks sad. What do you do?",
      options: [
        { 
          id: "a", 
          text: "Listen and give a hug", 
          emoji: "🤗", 
        
          isCorrect: true 
        },
        { 
          id: "b", 
          text: "Ignore them", 
          emoji: "🙈", 
          
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Tell them to fight back", 
          emoji: "👊", 
          
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "A classmate is being excluded from games. What do you do?",
      options: [
        { 
          id: "b", 
          text: "Laugh at them", 
          emoji: "😂", 
          isCorrect: false 
        },
        { 
          id: "a", 
          text: "Invite them to join", 
          emoji: "👋", 
          isCorrect: true 
        },
        { 
          id: "c", 
          text: "Walk away", 
          emoji: "🚶", 
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "Someone is being called mean names. What do you do?",
      options: [
        { 
          id: "b", 
          text: "Join in the name-calling", 
          emoji: "😈", 
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Do nothing", 
          emoji: "🫥", 
          isCorrect: false 
        },
        { 
          id: "a", 
          text: "Report to teacher", 
          emoji: "🧑‍🏫", 
          isCorrect: true 
        }
      ]
    },
    {
      id: 4,
      text: "Your friend's things are being hidden by others. What do you do?",
      options: [
        { 
          id: "b", 
          text: "Blame your friend", 
          emoji: "🤬", 
          isCorrect: false 
        },
        { 
          id: "a", 
          text: "Help find and support them", 
          emoji: "🔍", 
          isCorrect: true 
        },
        { 
          id: "c", 
          text: "Pretend not to know", 
          emoji: "🤷", 
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "A peer is receiving mean messages online. What do you do?",
      options: [
        { 
          id: "b", 
          text: "Reply with mean messages", 
          emoji: "💻", 
          isCorrect: false 
        },
        { 
          id: "c", 
          text: "Ignore the messages", 
          emoji: "🙄", 
          isCorrect: false 
        },
        { 
          id: "a", 
          text: "Advise to block and report", 
          emoji: "🚫", 
          isCorrect: true 
        }
      ]
    }
  ];

  const handleAnswer = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
      }
    }, 500);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/games/uvls/kids");
  };

  return (
    <GameShell
      title="Support Friend"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Game Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/uvls/kids/anti-bullying-poster"
      nextGameIdProp="uvls-kids-36"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="uvls"
      onNext={handleNext}
      nextEnabled={showResult && score >= 3}
    >
      <div className="space-y-8">
        {!showResult && questions[currentQuestion] ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {questions[currentQuestion].text}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.isCorrect)}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-center transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : "bg-red-500/20 border-2 border-red-400 opacity-75"
                        : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="text-4xl">{option.emoji}</span>
                      <span className="font-semibold text-lg">{option.text}</span>
                      <span className="text-sm opacity-90">{option.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Friend Supporter!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You know how to support friends who are being bullied!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: When friends are being bullied, support them by listening, including them, reporting to adults, and helping them stay safe. Never join in or ignore bullying - always stand up for others!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember: Friends need support when they're being bullied!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: When someone is being bullied, listen to them, include them, tell a trusted adult, and help them stay safe. Never join in or ignore it!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SupportFriend;

