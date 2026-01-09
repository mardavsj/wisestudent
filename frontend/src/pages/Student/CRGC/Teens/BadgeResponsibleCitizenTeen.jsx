import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeResponsibleCitizenTeen = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "civic-responsibility-teens-80";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      title: "Community Service Participation",
      question: "Why is participating in community service projects important for responsible citizenship?",
      options: [
        { 
          text: "To get recognition from others", 
          isCorrect: false
        },
        
        { 
          text: "To avoid paying taxes", 
          isCorrect: false
        },
        { 
          text: "To contribute to the betterment of your community", 
          isCorrect: true
        },
        { 
          text: "To gain advantages over others", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Community service contributes to the betterment of your community and helps address local needs.",
        wrong: "Community service contributes to the betterment of your community and helps address local needs."
      }
    },
    {
      id: 2,
      title: "Understanding Local Government",
      question: "Why is it important to learn about how your local government works?",
      options: [
        { 
          text: "To find reasons to complain", 
          isCorrect: false
        },
        { 
          text: "To understand how to engage with and influence local decisions", 
          isCorrect: true
        },
        { 
          text: "To avoid all civic responsibilities", 
          isCorrect: false
        },
        { 
          text: "To criticize without understanding", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Understanding local government helps you engage effectively and influence decisions that affect your community.",
        wrong: "Understanding local government helps you engage effectively and influence decisions that affect your community."
      }
    },
    {
      id: 3,
      title: "Responsible Voting Practices",
      question: "What is the most important aspect of responsible voting?",
      options: [
        { 
          text: "Voting the same way as your friends", 
          isCorrect: false
        },
        
        { 
          text: "Voting randomly without consideration", 
          isCorrect: false
        },
        { 
          text: "Skipping elections to save time", 
          isCorrect: false
        },
        { 
          text: "Researching candidates and issues before making informed decisions", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Researching candidates and issues leads to informed voting decisions that reflect your values and interests.",
        wrong: "Researching candidates and issues leads to informed voting decisions that reflect your values and interests."
      }
    },
    {
      id: 4,
      title: "Following Laws and Regulations",
      question: "Why is it important to follow laws and regulations consistently?",
      options: [
        { 
          text: "To maintain order and protect the rights and safety of all citizens", 
          isCorrect: true
        },
        { 
          text: "To avoid all personal responsibility", 
          isCorrect: false
        },
        
        { 
          text: "To blindly obey authority", 
          isCorrect: false
        },
        { 
          text: "To gain special privileges", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Following laws maintains order and protects the rights and safety of all citizens in society.",
        wrong: "Following laws maintains order and protects the rights and safety of all citizens in society."
      }
    },
    {
      id: 5,
      title: "Civic Engagement",
      question: "How should you engage in discussions about civic issues?",
      options: [
        { 
          text: "By shouting down opposing viewpoints", 
          isCorrect: false
        },
        
        { 
          text: "By avoiding all civic conversations", 
          isCorrect: false
        },
        { 
          text: "By spreading misinformation", 
          isCorrect: false
        },
        { 
          text: "Through respectful dialogue and evidence-based reasoning", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Respectful dialogue and evidence-based reasoning promote understanding and constructive civic engagement.",
        wrong: "Respectful dialogue and evidence-based reasoning promote understanding and constructive civic engagement."
      }
    }
  ];

  const handleAnswer = (isCorrect, optionIndex) => {
    if (answered) return;
    
    setAnswered(true);
    setSelectedAnswer(optionIndex);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    const isLastChallenge = challenge === challenges.length - 1;
    
    setTimeout(() => {
      if (isLastChallenge) {
        setShowResult(true);
      } else {
        setChallenge(prev => prev + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      }
    }, 2000);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setChallenge(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    resetFeedback();
  };

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: Responsible Citizen Teen"
      subtitle={showResult ? "Game Complete!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      gameType="civic-responsibility"
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/civic-responsibility/teens"
    
      nextGamePathProp="/student/civic-responsibility/teens/climate-story"
      nextGameIdProp="civic-responsibility-teens-81">
      <div className="space-y-8">
        {!showResult && currentChallenge ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-2">{currentChallenge.title}</h3>
              <p className="text-white text-lg mb-6">
                {currentChallenge.question}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentChallenge.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option.isCorrect, idx)}
                    disabled={answered}
                    className={`bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3 ${
                      answered && selectedAnswer === idx
                        ? option.isCorrect
                          ? "ring-4 ring-green-400"
                          : "ring-4 ring-red-400"
                        : ""
                    }`}
                  >
                    <span className="font-bold text-lg">{option.text}</span>
                  </button>
                ))}
              </div>
              
              {answered && (
                <div className={`mt-4 p-4 rounded-xl ${
                  currentChallenge.options[selectedAnswer]?.isCorrect
                    ? "bg-green-500/20 border border-green-500/30"
                    : "bg-red-500/20 border border-red-500/30"
                }`}>
                  <p className="text-white font-semibold">
                    {currentChallenge.options[selectedAnswer]?.isCorrect
                      ? currentChallenge.feedback.correct
                      : currentChallenge.feedback.wrong}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 4 ? (
              <div>
                <div className="text-6xl mb-4">🏅</div>
                <h3 className="text-3xl font-bold text-white mb-4">Responsible Citizen Teen Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong civic responsibility with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Responsible Citizen Teen</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Civic Engagement</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to participate effectively in your community and democratic processes.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Informed Citizenship</h4>
                    <p className="text-white/90 text-sm">
                      You know how to research issues and make responsible decisions that benefit society.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    window.location.href = "/games/civic-responsibility/teens";
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Being a Responsible Citizen!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review civic responsibility concepts to strengthen your knowledge.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default BadgeResponsibleCitizenTeen;