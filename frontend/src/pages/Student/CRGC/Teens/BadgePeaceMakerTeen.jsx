import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgePeaceMakerTeen = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "civic-responsibility-teens-50";
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
      title: "Conflict Mediation",
      question: "What is the best approach to mediate a disagreement between two friends?",
      options: [
        { 
          text: "Take sides based on your own opinion", 
          isCorrect: false
        },
        
        { 
          text: "Tell them to stop arguing and figure it out themselves", 
          isCorrect: false
        },
        { 
          text: "Listen to both sides and help them find a compromise", 
          isCorrect: true
        },
        { 
          text: "Avoid the situation entirely", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Listening to both sides and helping find a compromise promotes understanding and resolution.",
        wrong: "Listening to both sides and helping find a compromise promotes understanding and resolution."
      }
    },
    {
      id: 2,
      title: "Active Listening",
      question: "What is an important aspect of active listening during conflict resolution?",
      options: [
        { 
          text: "Interrupting to offer immediate solutions", 
          isCorrect: false
        },
        { 
          text: "Giving full attention and reflecting back what you heard", 
          isCorrect: true
        },
        { 
          text: "Judging the speaker's emotions", 
          isCorrect: false
        },
        { 
          text: "Planning your response while they're speaking", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Giving full attention and reflecting back what you heard shows respect and helps ensure understanding.",
        wrong: "Giving full attention and reflecting back what you heard shows respect and helps ensure understanding."
      }
    },
    {
      id: 3,
      title: "Showing Empathy",
      question: "How can you demonstrate empathy when someone is dealing with a difficult situation?",
      options: [
        { 
          text: "Minimize their feelings by saying 'it could be worse'", 
          isCorrect: false
        },
        
        { 
          text: "Tell them to get over it", 
          isCorrect: false
        },
        { 
          text: "Share a story about your own problems", 
          isCorrect: false
        },
        { 
          text: "Acknowledge their emotions and show you understand their perspective", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Acknowledging emotions and showing understanding helps people feel heard and supported.",
        wrong: "Acknowledging emotions and showing understanding helps people feel heard and supported."
      }
    },
    {
      id: 4,
      title: "Finding Common Ground",
      question: "What is the best way to help a group with different opinions find common ground?",
      options: [
        { 
          text: "Force everyone to agree with the majority", 
          isCorrect: false
        },
        { 
          text: "Identify shared goals and values that everyone can support", 
          isCorrect: true
        },
        { 
          text: "Let the loudest voices dominate", 
          isCorrect: false
        },
        { 
          text: "Abandon the project if consensus isn't reached", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Identifying shared goals and values helps groups work together despite different viewpoints.",
        wrong: "Identifying shared goals and values helps groups work together despite different viewpoints."
      }
    },
    {
      id: 5,
      title: "Promoting Inclusivity",
      question: "Why is it important to ensure everyone's voice is heard in group discussions?",
      options: [
        { 
          text: "To speed up decision-making", 
          isCorrect: false
        },
        
        { 
          text: "To satisfy a requirement", 
          isCorrect: false
        },
        { 
          text: "To create an environment where all perspectives are valued", 
          isCorrect: true
        },
        { 
          text: "To avoid conflict", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Ensuring all voices are heard creates inclusive environments where everyone feels valued.",
        wrong: "Ensuring all voices are heard creates inclusive environments where everyone feels valued."
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
      title="Badge: Peace Maker Teen"
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
    
      nextGamePathProp="/student/civic-responsibility/teens/blood-donation-camp-story"
      nextGameIdProp="civic-responsibility-teens-51">
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
                <h3 className="text-3xl font-bold text-white mb-4">Peace Maker Teen Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong conflict resolution skills with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Peace Maker Teen</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Conflict Resolution</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to mediate disagreements and find peaceful solutions.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Empathetic Communication</h4>
                    <p className="text-white/90 text-sm">
                      You know how to listen actively and show understanding for others' perspectives.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Making Peace!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review conflict resolution techniques to strengthen your peace-making skills.
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

export default BadgePeaceMakerTeen;