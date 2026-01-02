import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SuccessStorySimulation = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-teen-29");
  const gameId = gameData?.id || "dcos-teen-29";
  
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
      text: "You need to balance sports practice, studies, and tech. What's your morning plan?",
      options: [
        { 
          id: "balance", 
          text: "Exercise, study, then limited tech", 
          emoji: "🏋️‍♂️", 
          
          isCorrect: true
        },
        { 
          id: "phone", 
          text: "Spend all morning on phone", 
          emoji: "📱", 
          
          isCorrect: false
        },
        { 
          id: "relax", 
          text: "Skip everything, just relax", 
          emoji: "😴", 
          
          isCorrect: false
        },
        { 
          id: "plan-morning", 
          text: "Make a morning schedule with priorities", 
          emoji: "📅", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You have exams and also want to use tech. How do you balance?",
      options: [
        { 
          id: "phone-study", 
          text: "Study with phone nearby", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          id: "study-first", 
          text: "Study first, tech as reward", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          id: "tech-first", 
          text: "Just use tech, study later", 
          emoji: "😑", 
          isCorrect: false
        },
        { 
          id: "study-focused", 
          text: "Focus only on studying, no distractions", 
          emoji: "🎯", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You have sports practice but also want screen time. What's the priority?",
      options: [
        { 
          id: "skip-practice", 
          text: "Skip practice, use tech", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          id: "both-simultaneously", 
          text: "Do both at the same time", 
          emoji: "🤔", 
          isCorrect: false
        },
        { 
          id: "practice-first", 
          text: "Go to practice, tech after", 
          emoji: "⚽", 
          isCorrect: true
        },
        { 
          id: "both-together", 
          text: "Do both together", 
          emoji: "🤷", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "Evening time - how do you balance activities?",
      options: [
        { 
          id: "only-tech", 
          text: "Only use tech all evening", 
          emoji: "📱", 
          isCorrect: false
        },
       
        { 
          id: "ignore", 
          text: "Ignore everything else", 
          emoji: "😑", 
          isCorrect: false
        },
        { 
          id: "family-first", 
          text: "Spend time with family first, then tech", 
          emoji: "👨‍👩‍👧‍👦", 
          isCorrect: false
        },
         { 
          id: "mix-activities", 
          text: "Mix tech with family time and hobbies", 
          emoji: "🤗", 
          isCorrect: true
        },
      ]
    },
    {
      id: 5,
      text: "What's the key to balancing sports, studies, and tech successfully?",
      options: [
        { 
          id: "only-tech", 
          text: "Focus only on tech", 
          emoji: "📱", 
          isCorrect: false
        },
        { 
          id: "prioritize", 
          text: "Prioritize important tasks, limit tech", 
          emoji: "🧠", 
          isCorrect: true
        },
        { 
          id: "random", 
          text: "Do everything randomly", 
          emoji: "😐", 
          isCorrect: false
        },
        { 
          id: "balanced-approach", 
          text: "Take a balanced approach to all activities", 
          emoji: "⚖️", 
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
      title="Success Story Simulation"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
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
                  You understand how to balance activities successfully!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Success comes from balancing priorities - prioritize important tasks like studies and sports, then use tech wisely as a reward!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct.
                  Remember to balance activities and prioritize important tasks!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: Prioritize studies and sports first, then use tech as a reward. Balance is key to success!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SuccessStorySimulation;
