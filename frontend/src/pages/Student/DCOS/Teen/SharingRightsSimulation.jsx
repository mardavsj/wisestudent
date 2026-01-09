import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SharingRightsSimulation = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-teen-54");
  const gameId = gameData?.id || "dcos-teen-54";
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "Should you share your homework online?",
      options: [
        { 
          text: "Keep it private", 
          emoji: "🔒",
          isCorrect: true
        },
        { 
          text: "Share it online", 
          emoji: "📤",
          isCorrect: false
        },
        { 
          text: "Share with friends only", 
          emoji: "👥",
          isCorrect: false
        },
        { 
          text: "Post on all platforms", 
          emoji: "🌐",
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "What should you do with personal documents?",
      options: [
        { 
          text: "Post them publicly", 
          emoji: "🌐",
          isCorrect: false
        },
        { 
          text: "Share on social media", 
          emoji: "📱",
          isCorrect: false
        },
        { 
          text: "Keep them private", 
          emoji: "🔒",
          isCorrect: true
        },
        { 
          text: "Upload to cloud for everyone", 
          emoji: "☁️",
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "Should you share your test answers online?",
      options: [
        { 
          text: "Yes, share them", 
          emoji: "📤",
          isCorrect: false
        },
        { 
          text: "Share with classmates", 
          emoji: "👥",
          isCorrect: false
        },
       
        { 
          text: "Post solutions for all", 
          emoji: "🌐",
          isCorrect: false
        },
         { 
          text: "No, keep them private", 
          emoji: "🔒",
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "What about your personal photos?",
      options: [
        { 
          text: "Be selective and keep private ones safe", 
          emoji: "🔒",
          isCorrect: true
        },
        { 
          text: "Share everything publicly", 
          emoji: "🌐",
          isCorrect: false
        },
        { 
          text: "Post all photos", 
          emoji: "📤",
          isCorrect: false
        },
        { 
          text: "Upload to public album", 
          emoji: "📸",
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Should you share your private thoughts online?",
      options: [
        { 
          text: "Share everything", 
          emoji: "📤",
          isCorrect: false
        },
        { 
          text: "Keep private thoughts private", 
          emoji: "🔒",
          isCorrect: true
        },
        { 
          text: "Share with everyone", 
          emoji: "🌐",
          isCorrect: false
        },
        
        { 
          text: "Post all on social media", 
          emoji: "📱",
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
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

  return (
    <GameShell
      title="Sharing Rights Simulation"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/dcos/teens/privacy-laws-puzzle"
      nextGameIdProp="dcos-teen-55"
      gameType="dcos"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-8">
        {!showResult && questions[currentQuestion] ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <p className="text-white text-lg mb-6">
                {questions[currentQuestion].text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedAnswer(idx);
                      handleChoice(option.isCorrect);
                    }}
                    disabled={answered}
                    className={`p-6 rounded-2xl text-left transition-all transform ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : selectedAnswer === idx
                          ? "bg-red-500/20 border-4 border-red-400 ring-4 ring-red-400"
                          : "bg-white/5 border-2 border-white/20 opacity-50"
                        : "bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="text-white font-semibold">{option.text}</span>
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
                <h3 className="text-2xl font-bold text-white mb-4">Great Job!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct!
                  You understand how to protect your privacy and rights!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Keep personal information, homework, documents, and private thoughts private. Be selective about what you share online!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct.
                  Remember to keep personal information and private content private!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Keep homework, documents, personal photos, and private thoughts private. Protect your privacy!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SharingRightsSimulation;

