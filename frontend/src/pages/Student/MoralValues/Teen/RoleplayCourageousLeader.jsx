import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RoleplayCourageousLeader = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("moral-teen-59");
  const gameId = gameData?.id || "moral-teen-59";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for RoleplayCourageousLeader, using fallback ID");
  }
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const questions = [
    {
      id: 1,
      text: "You see a team member being blamed unfairly for a group mistake. What do you do?",
      emoji: "🛡️",
      options: [
        { 
          id: "speak", 
          text: "Speak up and clarify everyone's role", 
          emoji: "🗣️", 
          
          isCorrect: true 
        },
        { 
          id: "silent", 
          text: "Stay silent to avoid conflict", 
          emoji: "😶", 
          isCorrect: false 
        },
        { 
          id: "join", 
          text: "Join others in blaming to stay popular", 
          emoji: "😏", 
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "A classmate is being teased for asking questions. How would you lead?",
      emoji: "💬",
      options: [
        { 
          id: "ignore", 
          text: "Ignore the teasing", 
          emoji: "😶", 
          isCorrect: false 
        },
        { 
          id: "stop", 
          text: "Tell others to stop and encourage curiosity", 
          emoji: "🛡️", 
          isCorrect: true 
        },
        { 
          id: "laugh", 
          text: "Laugh along to fit in", 
          emoji: "😄", 
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "Your team excludes a quiet member from discussions. What's your action?",
      emoji: "👥",
      options: [
        { 
          id: "let", 
          text: "Let it continue, it's their choice", 
          emoji: "😶", 
          isCorrect: false 
        },
        { 
          id: "focus", 
          text: "Only focus on your work", 
          emoji: "📝", 
          isCorrect: false 
        },
        { 
          id: "include", 
          text: "Include everyone and ensure fairness", 
          emoji: "🤝", 
          isCorrect: true 
        }
      ]
    },
    {
      id: 4,
      text: "During a sports match, your team cheats to win. What do you do?",
      emoji: "⚽",
      options: [
        { 
          id: "admit", 
          text: "Admit the mistake and accept fair results", 
          emoji: "💎", 
          isCorrect: true 
        },
        { 
          id: "nothing", 
          text: "Say nothing since you won", 
          emoji: "😶", 
          isCorrect: false 
        },
        { 
          id: "defend", 
          text: "Defend the cheating as teamwork", 
          emoji: "😏", 
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "You notice favoritism in assigning team roles. What's the right stand?",
      emoji: "⚖️",
      options: [
        { 
          id: "accept", 
          text: "Accept it quietly", 
          emoji: "😶", 
          isCorrect: false 
        },
        { 
          id: "speak", 
          text: "Speak to the teacher about equal opportunities", 
          emoji: "🗣️", 
          isCorrect: true 
        },
        { 
          id: "complain", 
          text: "Complain secretly to friends", 
          emoji: "🤫", 
          isCorrect: false 
        }
      ]
    }
  ];

  const handleAnswer = (optionId) => {
    if (showFeedback || showResult) return;
    
    setSelectedOption(optionId);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const selectedOptionData = currentQuestionData.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOptionData?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setShowFeedback(true);
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
        resetFeedback();
      }
    }, isCorrect ? 1000 : 800);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    setSelectedOption(null);
    setShowFeedback(false);
    resetFeedback();
  };

  return (
    <GameShell
      title="Roleplay: Courageous Leader"
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      score={score}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={questions.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="moral"
    >
      <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {!showResult && questions[currentQuestion] ? (
          <div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <div className="text-6xl mb-4 text-center">{questions[currentQuestion].emoji}</div>
              
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {questions[currentQuestion].text}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questions[currentQuestion].options.map((option) => {
                  const isSelected = selectedOption === option.id;
                  const showCorrect = showFeedback && option.isCorrect;
                  const showIncorrect = showFeedback && isSelected && !option.isCorrect;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      disabled={showFeedback}
                      className={`p-6 rounded-2xl shadow-lg transition-all transform text-center ${
                        showCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : showIncorrect
                          ? "bg-red-500/20 border-2 border-red-400 opacity-75"
                          : isSelected
                          ? "bg-blue-600 border-2 border-blue-300 scale-105"
                          : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                      } ${showFeedback ? "cursor-not-allowed" : ""}`}
                    >
                      <div className="text-2xl mb-2">{option.emoji}</div>
                      <h4 className="font-bold text-base mb-2">{option.text}</h4>
                    </button>
                  );
                })}
              </div>
              
              {showFeedback && (
                <div className={`rounded-lg p-5 mt-6 ${
                  questions[currentQuestion].options.find(opt => opt.id === selectedOption)?.isCorrect
                    ? "bg-green-500/20"
                    : "bg-red-500/20"
                }`}>
                  <p className="text-white whitespace-pre-line">
                    {questions[currentQuestion].options.find(opt => opt.id === selectedOption)?.isCorrect
                      ? "Great job! That's exactly right! 🎉"
                      : "Not quite right. Try again next time!"}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">You're a Courageous Leader!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You know how to stand up for what's right!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Courageous leaders stand up for fairness, speak against wrong, and protect others!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember: Choose actions that stand up for what's right!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Courageous leaders stand up for fairness, speak against wrong, and protect others. Practice being brave!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RoleplayCourageousLeader;
