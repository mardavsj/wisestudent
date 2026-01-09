import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const RobotPracticeGame = () => {
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

  const tasks = [
    {
      id: 1,
      description: "Robot needs to pick up a ball. What's the best approach?",
      options: [
        { 
          id: "gripper", 
          text: "Use Gripper Arm", 
          emoji: "💪", 
          
          isCorrect: true
        },
        { 
          id: "vacuum", 
          text: "Use Vacuum Suction", 
          emoji: "🧹", 
          isCorrect: false
        },
        { 
          id: "push", 
          text: "Push with Wheel", 
          emoji: "🦾", 
          isCorrect: false
        }
      ],
      correct: "gripper"
    },
    {
      id: 2,
      description: "Robot needs to place a block in a box. What should it do?",
      options: [
        { 
          id: "fast", 
          text: "Move Quickly", 
          emoji: "⚡", 
          isCorrect: false
        },
        { 
          id: "careful", 
          text: "Move Carefully", 
          emoji: "🦿", 
          isCorrect: true
        },
        { 
          id: "drop", 
          text: "Drop from Height", 
          emoji: "💥", 
          isCorrect: false
        }
      ],
      correct: "careful"
    },
    {
      id: 3,
      description: "Robot meets a human. How should it respond?",
      options: [
        { 
          id: "wave", 
          text: "Friendly Wave", 
          emoji: "👋", 
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore Human", 
          emoji: "🤐", 
          isCorrect: false
        },
        { 
          id: "back", 
          text: "Back Away", 
          emoji: "🚶", 
          isCorrect: false
        }
      ],
      correct: "wave"
    },
    {
      id: 4,
      description: "Robot needs to sort shapes. What's the smart approach?",
      options: [
        { 
          id: "random", 
          text: "Sort Randomly", 
          emoji: "🔀", 
          isCorrect: false
        },
        { 
          id: "skip", 
          text: "Skip Sorting", 
          emoji: "⏭️", 
          isCorrect: false
        },
        { 
          id: "vision", 
          text: "Use Shape Recognition", 
          emoji: "👁️", 
          
          isCorrect: true
        }
      ],
      correct: "vision"
    },
    {
      id: 5,
      description: "Robot needs to push a toy car. How should it do it?",
      options: [
        { 
          id: "steady", 
          text: "Push Steadily", 
          emoji: "✊", 
          isCorrect: true
        },
        { 
          id: "hard", 
          text: "Push Very Hard", 
          emoji: "💪", 
          isCorrect: false
        },
        { 
          id: "gentle", 
          text: "Push Too Gently", 
          emoji: "🫣", 
          isCorrect: false
        }
      ],
      correct: "steady"
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
      setTimeout(() => {
        setCurrentTask(prev => prev + 1);
      }, 300);
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
    navigate("/student/ai-for-all/kids/data-collector-simulation"); // Update with actual next game path
  };

  const accuracy = Math.round((score / tasks.length) * 100);

  return (
    <GameShell
      title="Robot Practice Game"
      score={score}
      subtitle={`Task ${currentTask + 1} of ${tasks.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/kids/data-collector-simulation"
      nextGameIdProp="ai-kids-74"
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="ai-kids-73"
      gameType="ai"
      totalLevels={20}
      currentLevel={73} // Update the current level appropriately
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
              
              <div className="bg-gray-800/50 rounded-xl p-8 mb-6 flex justify-center items-center">
                <div className="text-6xl animate-pulse">🤖</div>
              </div>
              
              <p className="text-white text-lg mb-6">
                {currentTaskData.description}
              </p>
              
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
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-2xl font-bold text-white mb-4">Robot Improved!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You completed {score} out of {tasks.length} tasks correctly! ({accuracy}%)
                  You're learning how robots make smart decisions!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Points</span>
                </div>
                <p className="text-white/80">
                  💡 Practicing repeatedly helps AI learn better. Each correct task improves the robot's accuracy!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Training!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You completed {score} out of {tasks.length} tasks correctly. ({accuracy}%)
                  Keep practicing to learn more about robotics!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Think about what would be the smartest approach for a robot in each situation.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default RobotPracticeGame;