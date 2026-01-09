import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RobotLearningBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentTask, setCurrentTask] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Tasks for progression game with 3 options each
  const tasks = [
    {
      id: 1,
      description: "Robot is learning to identify animals. Which approach is best?",
      options: [
        { 
          id: "supervised", 
          text: "Supervised Learning", 
          emoji: "📚", 
          
          isCorrect: true
        },
        { 
          id: "random", 
          text: "Random Guessing", 
          emoji: "❓", 
          
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Ignore Examples", 
          emoji: "🚫", 
          isCorrect: false
        }
      ],
      correct: "supervised"
    },
    {
      id: 2,
      description: "Robot sees a new animal. How should it classify it?",
      options: [
        { 
          id: "same", 
          text: "Call it a Dog", 
          emoji: "🐕", 
          isCorrect: false
        },
        { 
          id: "patterns", 
          text: "Recognize Patterns", 
          emoji: "🔍", 
          isCorrect: true
        },
        { 
          id: "skip", 
          text: "Skip Classification", 
          emoji: "⏭️", 
          isCorrect: false
        }
      ],
      correct: "patterns"
    },
    {
      id: 3,
      description: "Robot makes a wrong identification. What should happen?",
      options: [
        { 
          id: "learn", 
          text: "Learn from Mistake", 
          emoji: "🧠", 
          isCorrect: true
        },
        { 
          id: "repeat", 
          text: "Repeat Same Error", 
          emoji: "🔄", 
          isCorrect: false
        },
        { 
          id: "stop", 
          text: "Stop Learning", 
          emoji: "⏹️", 
          isCorrect: false
        }
      ],
      correct: "learn"
    },
    {
      id: 4,
      description: "How should the robot handle rare animals it hasn't seen?",
      options: [
        { 
          id: "guess", 
          text: "Force a Guess", 
          emoji: "🎯", 
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Ignore Completely", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          id: "ask", 
          text: "Ask for Help", 
          emoji: "🙋", 
          isCorrect: true
        }
      ],
      correct: "ask"
    },
    {
      id: 5,
      description: "What's the best way to improve the robot's accuracy?",
      options: [
        { 
          id: "practice", 
          text: "More Practice Examples", 
          emoji: "📈", 
          isCorrect: true
        },
        { 
          id: "same", 
          text: "Repeat Same Images", 
          emoji: "🔂", 
          isCorrect: false
        },
        { 
          id: "reduce", 
          text: "Reduce Training", 
          emoji: "📉", 
          isCorrect: false
        }
      ],
      correct: "practice"
    }
  ];

  // Function to get options without rotation - keeping actual positions fixed
  const getRotatedOptions = (options, taskIndex) => {
    // Return options without any rotation to keep their actual positions fixed
    return options;
  };

  const currentTaskData = tasks[currentTask];
  const displayOptions = getRotatedOptions(currentTaskData.options, currentTask);

  const handleChoice = (choiceId) => {
    const isCorrect = choiceId === currentTaskData.correct;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentTask < tasks.length - 1) {
      setTimeout(() => setCurrentTask(prev => prev + 1), 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentTask(0);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/ai-mistake-quiz"); // Update to your next game path
  };

  const accuracy = Math.round((score / tasks.length) * 100);

  return (
    <GameShell
      title="Robot Learning Bar"
      score={score}
      subtitle={`Training Task ${currentTask + 1} of ${tasks.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/kids/ai-mistake-quiz"
      nextGameIdProp="ai-kids-69"
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="ai-kids-68"
      gameType="ai"
      totalLevels={20}
      currentLevel={68}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Task {currentTask + 1}/{tasks.length}</span>
                <span className="text-yellow-400 font-bold">Points: {score}</span>
              </div>
              
              {/* Task Description */}
              <p className="text-white text-lg mb-6">
                {currentTaskData.description}
              </p>
              
              {/* Choice Buttons - 3 column grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayOptions.map(option => (
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
            {accuracy >= 70 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">Robot Learned Well!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You completed {score} out of {tasks.length} tasks correctly! ({accuracy}%)
                  You're learning how robots improve through machine learning!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Points</span>
                </div>
                <p className="text-white/80">
                  💡 Robots learn by recognizing patterns and improving from their mistakes!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Training!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You completed {score} out of {tasks.length} tasks correctly. ({accuracy}%)
                  Keep practicing to learn more about how robots learn!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Think about how robots learn from examples and improve over time.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RobotLearningBar;