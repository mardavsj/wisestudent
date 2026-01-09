import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const UpstanderSimulation = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("dcos-teen-19");
  const gameId = gameData?.id || "dcos-teen-19";
  
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
      text: "You see a group of classmates ganging up to troll and bully someone online. What do you do?",
      options: [
        { 
          text: "Defend the victim and report the bullying", 
          emoji: "😶", 
          isCorrect: true
        },
        { 
          text: "Join them to fit in", 
          emoji: "😞", 
          isCorrect: false
        },
        { 
          text: "Ignore it and walk away", 
          emoji: "🚶", 
          isCorrect: false
        },
        { 
          text: "Tell the victim to handle it themselves", 
          emoji: "🤐", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "You witness someone being cyberbullied in a group chat. What's your response?",
      options: [
        { 
          text: "Stay silent", 
          emoji: "😐", 
          isCorrect: false
        },
        { 
          text: "Stand up and report the bullying", 
          emoji: "🙂", 
          isCorrect: true
        },
        { 
          text: "Watch from the sidelines", 
          emoji: "👀", 
          isCorrect: false
        },
        { 
          text: "Share the bullying with others", 
          emoji: "📤", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "You see hateful comments being posted about someone. What should you do?",
      options: [
        { 
          text: "Ignore it", 
          emoji: "😑", 
          isCorrect: false
        },
        { 
          text: "Just watch", 
          emoji: "👁️", 
          isCorrect: false
        },
        { 
          text: "Defend them and report the hate", 
          emoji: "🤓", 
          isCorrect: true
        },
        { 
          text: "Add your own comments", 
          emoji: "💬", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "You see someone being excluded and bullied in an online group. What do you do?",
      options: [
        { 
          text: "Include them and report the bullying", 
          emoji: "😄", 
          isCorrect: true
        },
        { 
          text: "Don't get involved", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Stay out of it", 
          emoji: "😐", 
          isCorrect: false
        },
        { 
          text: "Join the exclusion", 
          emoji: "🚫", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "You see false rumors being spread about someone online. What's the right action?",
      options: [
        { 
          text: "Let it happen", 
          emoji: "😐", 
          isCorrect: false
        },
        
        { 
          text: "Stay neutral", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Verify and share the truth", 
          emoji: "🙂", 
          isCorrect: false
        },
        { 
          text: "Defend them and stop the rumor", 
          emoji: "🤔", 
          isCorrect: true
        },
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
      title="Upstander Simulation"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      nextGamePathProp="/student/dcos/teens/courage-badge"
      nextGameIdProp="dcos-teen-20"
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
                  You understand how to be an upstander!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80">
                  Lesson: Always stand up for victims of bullying, defend them, and report the bullying. Be an upstander, not a bystander!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You got {score} out of {questions.length} questions correct.
                  Remember to stand up for others and report bullying!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Tip: The right choice is to defend victims, report bullying, and be an upstander!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default UpstanderSimulation;

