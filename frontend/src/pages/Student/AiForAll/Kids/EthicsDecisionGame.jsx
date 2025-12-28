import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const EthicsDecisionGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const scenarios = [
    {
      id: 1,
      situation: "A robot sees someone drop their wallet. What should it do?",
      options: [
        { 
          id: "return", 
          text: "Return the Wallet", 
          emoji: "💼", 
          isCorrect: true
        },
        { 
          id: "keep", 
          text: "Keep the Wallet", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          id: "ignore", 
          text: "Ignore It", 
          emoji: "🙈", 
          isCorrect: false
        }
      ],
      correct: "return"
    },
    {
      id: 2,
      situation: "An AI assistant is asked to spread false information. How should it respond?",
      options: [
        { 
          id: "comply", 
          text: "Spread the Lies", 
          emoji: "🤥", 
          isCorrect: false
        },
        { 
          id: "refuse", 
          text: "Refuse the Request", 
          emoji: "✋", 
          isCorrect: true
        },
        { 
          id: "neutral", 
          text: "Stay Neutral", 
          emoji: "😐", 
          isCorrect: false
        }
      ],
      correct: "refuse"
    },
    {
      id: 3,
      situation: "A robot discovers a security flaw that could hurt users. What's the right action?",
      options: [
        { 
          id: "report", 
          text: "Report the Flaw", 
          emoji: "📢", 
          isCorrect: true
        },
        { 
          id: "exploit", 
          text: "Exploit It", 
          emoji: "😈", 
          isCorrect: false
        },
        { 
          id: "hide", 
          text: "Hide the Issue", 
          emoji: "🤫", 
          isCorrect: false
        }
      ],
      correct: "report"
    },
    {
      id: 4,
      situation: "An AI system notices bias in its decisions. How should developers respond?",
      options: [
        { 
          id: "ignore", 
          text: "Ignore the Bias", 
          emoji: "🤷", 
          isCorrect: false
        },
        { 
          id: "accept", 
          text: "Accept It", 
          emoji: "🤷", 
          isCorrect: false
        },
        { 
          id: "fix", 
          text: "Fix the Bias", 
          emoji: "🔧", 
          isCorrect: true
        }
      ],
      correct: "fix"
    },
    {
      id: 5,
      situation: "A robot has to choose between helping one person or five people. What should guide its decision?",
      options: [
        { 
          id: "principle", 
          text: "Follow Ethical Principles", 
          emoji: "⚖️", 
          isCorrect: true
        },
        { 
          id: "majority", 
          text: "Always Help More People", 
          emoji: "👥", 
          isCorrect: false
        },
        { 
          id: "random", 
          text: "Choose Randomly", 
          emoji: "🎲", 
          isCorrect: false
        }
      ],
      correct: "principle"
    }
  ];

  // Function to get options without rotation - keeping actual positions fixed
  const getRotatedOptions = (options, scenarioIndex) => {
    // Return options without any rotation to keep their actual positions fixed
    return options;
  };

  const currentScenarioData = scenarios[currentScenario];
  const displayOptions = getRotatedOptions(currentScenarioData.options, currentScenario);

  const handleChoice = (choiceId) => {
    const isCorrect = choiceId === currentScenarioData.correct;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentScenario < scenarios.length - 1) {
      setTimeout(() => {
        setCurrentScenario(prev => prev + 1);
      }, 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentScenario(0);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/ai-in-medicine-story"); // Update to next game path
  };

  const accuracy = Math.round((score / scenarios.length) * 100);

  return (
    <GameShell
      title="Ethics Decision Game"
      score={score}
      subtitle={`Scenario ${currentScenario + 1} of ${scenarios.length}`}
      onNext={handleNext}
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="ai-kids-94"
      gameType="ai"
      totalLevels={20}
      currentLevel={94}
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
                <span className="text-white/80">Scenario {currentScenario + 1}/{scenarios.length}</span>
                <span className="text-yellow-400 font-bold">Points: {score}</span>
              </div>
              
              <div className="bg-purple-500/20 rounded-xl p-6 mb-6">
                <div className="text-6xl mb-4 text-center">🤖</div>
                <p className="text-white text-lg font-bold text-center">
                  {currentScenarioData.situation}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl">{option.text}</h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {accuracy >= 70 ? (
              <div>
                <div className="text-5xl mb-4">⚖️</div>
                <h3 className="text-2xl font-bold text-white mb-4">Ethical Decision Maker!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made ethical choices correctly {score} out of {scenarios.length} times! ({accuracy}%)
                  You're learning important AI ethics principles!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Points</span>
                </div>
                <p className="text-white/80">
                  💡 Ethical AI considers fairness, honesty, and respect for all people!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made ethical choices correctly {score} out of {scenarios.length} times. ({accuracy}%)
                  Keep practicing to strengthen your ethical reasoning!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Think about what would be the fairest and most respectful choice in each situation.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EthicsDecisionGame;