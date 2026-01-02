import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RoleplayGroupLeader = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("moral-teen-38");
  const gameId = gameData?.id || "moral-teen-38";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for RoleplayGroupLeader, using fallback ID");
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
      text: "Your team is behind schedule. How do you motivate them to finish tasks on time?",
      emoji: "⏰",
      options: [
        { 
          id: "priorities", 
          text: "Set clear priorities and encourage collaboration", 
          emoji: "📋", 
          
          isCorrect: true 
        },
        { 
          id: "yell", 
          text: "Yell at everyone to hurry", 
          emoji: "😠", 
          
          isCorrect: false 
        },
        { 
          id: "alone", 
          text: "Do all tasks yourself", 
          emoji: "😶", 
          
          isCorrect: false 
        }
      ]
    },
    {
      id: 2,
      text: "A team member is not contributing. How do you handle it?",
      emoji: "👤",
      options: [
        { 
          id: "ignore", 
          text: "Ignore them and hope they improve", 
          emoji: "😶", 
          isCorrect: false 
        },
        { 
          id: "assign", 
          text: "Assign tasks suited to their strengths and guide them", 
          emoji: "💪", 
          isCorrect: true 
        },
        { 
          id: "criticize", 
          text: "Criticize publicly", 
          emoji: "👆", 
          isCorrect: false 
        }
      ]
    },
    {
      id: 3,
      text: "Two team members are arguing and delaying work. What do you do?",
      emoji: "😠",
      options: [
        { 
          id: "fight", 
          text: "Let them fight it out", 
          emoji: "😠", 
          isCorrect: false 
        },
        { 
          id: "focus", 
          text: "Ignore conflict and focus on yourself", 
          emoji: "😶", 
          isCorrect: false 
        },
        { 
          id: "mediate", 
          text: "Mediate and help them reach agreement", 
          emoji: "🕊️", 
          isCorrect: true 
        }
      ]
    },
    {
      id: 4,
      text: "Deadline is tight and team is stressed. How do you act?",
      emoji: "😰",
      options: [
        { 
          id: "support", 
          text: "Offer support, break tasks into manageable steps", 
          emoji: "💪", 
          isCorrect: true 
        },
        { 
          id: "pressure", 
          text: "Add more pressure to force results", 
          emoji: "😠", 
          isCorrect: false 
        },
        { 
          id: "panic", 
          text: "Let them panic and figure it out", 
          emoji: "😰", 
          isCorrect: false 
        }
      ]
    },
    {
      id: 5,
      text: "Some tasks are boring, some fun. How do you ensure everyone participates?",
      emoji: "🎯",
      options: [
        { 
          id: "favorites", 
          text: "Assign fun tasks to favorites", 
          emoji: "😏", 
          isCorrect: false 
        },
        { 
          id: "rotate", 
          text: "Rotate tasks fairly and motivate the team", 
          emoji: "🔄", 
          isCorrect: true 
        },
        { 
          id: "boring", 
          text: "Do boring tasks yourself", 
          emoji: "😶", 
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
      title="Roleplay: Group Leader"
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
                <h3 className="text-2xl font-bold text-white mb-4">You're an Effective Group Leader!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct!
                  You know how to lead teams effectively!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Effective leaders organize, support, and motivate their teams to work together!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} correct.
                  Remember: Choose actions that help your team work together!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Effective leaders organize, support, and motivate their teams. Practice leading with fairness and encouragement!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RoleplayGroupLeader;
