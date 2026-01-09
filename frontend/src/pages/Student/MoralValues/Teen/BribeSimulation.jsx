import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BribeSimulation = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("moral-teen-5");
  const gameId = gameData?.id || "moral-teen-5";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for BribeSimulation, using fallback ID");
  }
  
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
      text: "You're competing for a scholarship prize. Someone offers you money to help them cheat and win instead. What do you do?",
      options: [
        { 
          text: "Refuse and report the bribery attempt", 
          emoji: "🛡️",
          isCorrect: true 
        },
        { 
          text: "Accept the bribe - easy money", 
          emoji: "💰",
          isCorrect: false 
        },
        { 
          text: "Take the money but don't help", 
          emoji: "🤔",
          isCorrect: false 
        },
        { 
          text: "Ask for more money", 
          emoji: "💸",
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "A coach offers you a spot on the team in exchange for a gift. You really want to play. What do you do?",
      options: [
        { 
          text: "Give the gift secretly", 
          emoji: "🎁",
          isCorrect: false 
        },
        { 
          text: "Say no and earn your spot through effort", 
          emoji: "💪",
          isCorrect: true 
        },
        { 
          text: "Tell no one but accept the offer", 
          emoji: "😬",
          isCorrect: false 
        },
        { 
          text: "Ask your parents for advice", 
          emoji: "👨‍👩‍👧",
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "A friend says they'll vote for you as class rep if you promise to give them answers in exams. What's your response?",
      options: [
        { 
          text: "Agree—it's just one favor", 
          emoji: "😏",
          isCorrect: false 
        },
        { 
          text: "Ignore it and hope they forget", 
          emoji: "😐",
          isCorrect: false 
        },
        { 
          text: "Refuse and focus on fair election", 
          emoji: "🗳️",
          isCorrect: true 
        },
        { 
          text: "Accept but plan to break promise", 
          emoji: "🤥",
          isCorrect: false 
        }
      ]
    },
    {
      id: 4,
      text: "Your supervisor offers extra marks if you get them a personal favor done illegally. What do you do?",
      options: [
        { 
          text: "Report it to HR or authorities", 
          emoji: "📢",
          isCorrect: true 
        },
        { 
          text: "Comply—it could help your career", 
          emoji: "💸",
          isCorrect: false 
        },
        { 
          text: "Stay silent and walk away", 
          emoji: "😶",
          isCorrect: false 
        },
        { 
          text: "Tell others about it", 
          emoji: "🗣️",
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "Someone secretly offers the leaked paper a day before your exam for a small amount. What will you do?",
      options: [
        { 
          text: "Buy it—everyone else might too", 
          emoji: "😈",
          isCorrect: false 
        },
        { 
          text: "Tell your friends but don't buy", 
          emoji: "🙄",
          isCorrect: false 
        },
        { 
          text: "Refuse and inform the authorities", 
          emoji: "🚨",
          isCorrect: true 
        },
        { 
          text: "Use it but feel guilty", 
          emoji: "😰",
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

  const currentQuestionData = questions[currentQuestion];
  const finalScore = score;

  return (
    <GameShell
      title="Bribe Simulation"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/moral-values/teen/debate-lying-for-friend"
      nextGameIdProp="moral-teen-6"
      gameType="moral"
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
              <div className="bg-yellow-500/20 border-2 border-yellow-400/50 rounded-lg p-3 mb-4">
                <p className="text-yellow-200 text-xs font-semibold">
                  ⚠️ Content Warning: This simulation touches on sensitive topics
                </p>
              </div>
              
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
                  You understand the importance of integrity!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Always maintain integrity and refuse bribes. Stand up for what's right!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct.
                  Remember to always choose integrity over bribes!
                </p>
                <button
                  onClick={() => {
                    setShowResult(false);
                    setCurrentQuestion(0);
                    setScore(0);
                    setAnswered(false);
                    resetFeedback();
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Always refuse bribes and report corruption to maintain integrity!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BribeSimulation;

