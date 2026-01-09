import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeGenderRightsTeen = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "civic-responsibility-teens-30";
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
      title: "Challenging Gender Stereotypes",
      question: "Which action best challenges harmful gender stereotypes?",
      options: [
        { 
          text: "Assuming boys are naturally better at math", 
          isCorrect: false
        },
        { 
          text: "Encouraging anyone to pursue interests regardless of gender", 
          isCorrect: true
        },
        { 
          text: "Limiting career choices based on gender", 
          isCorrect: false
        },
        { 
          text: "Making jokes about gender roles", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Encouraging people to pursue their interests regardless of gender helps break down harmful stereotypes.",
        wrong: "Encouraging people to pursue their interests regardless of gender helps break down harmful stereotypes."
      }
    },
    {
      id: 2,
      title: "Equal Opportunities",
      question: "Why is it important to support equal opportunities for all genders?",
      options: [
        { 
          text: "To make everyone the same", 
          isCorrect: false
        },
        
        { 
          text: "To eliminate competition", 
          isCorrect: false
        },
        { 
          text: "To ensure everyone can reach their full potential", 
          isCorrect: true
        },
        { 
          text: "To reduce choices", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Equal opportunities allow everyone to develop their talents and contribute to society.",
        wrong: "Equal opportunities allow everyone to develop their talents and contribute to society."
      }
    },
    {
      id: 3,
      title: "Inclusive Language",
      question: "What is an example of using inclusive language regarding gender?",
      options: [
        { 
          text: "Using 'everyone' or 'folks' instead of gendered terms", 
          isCorrect: true
        },
        { 
          text: "Using 'guys' to address a mixed-gender group", 
          isCorrect: false
        },
        
        { 
          text: "Referring to professionals by assumed gender", 
          isCorrect: false
        },
        { 
          text: "Asking for someone's gender immediately", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Using gender-neutral terms helps create inclusive environments where everyone feels respected.",
        wrong: "Using gender-neutral terms helps create inclusive environments where everyone feels respected."
      }
    },
    {
      id: 4,
      title: "Gender Equality Movements",
      question: "What is a key goal of gender equality movements?",
      options: [
        { 
          text: "To give one gender more power", 
          isCorrect: false
        },
        
        { 
          text: "To eliminate gender differences", 
          isCorrect: false
        },
        { 
          text: "To reverse traditional roles", 
          isCorrect: false
        },
        { 
          text: "To ensure equal rights and opportunities for all genders", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Gender equality movements work to ensure that all people have the same rights and opportunities regardless of gender.",
        wrong: "Gender equality movements work to ensure that all people have the same rights and opportunities regardless of gender."
      }
    },
    {
      id: 5,
      title: "Respectful Behavior",
      question: "How should you treat someone whose gender identity differs from your expectations?",
      options: [
        { 
          text: "Ignore or exclude them", 
          isCorrect: false
        },
        { 
          text: "Treat them with dignity and respect their identity", 
          isCorrect: true
        },
        { 
          text: "Make jokes about their identity", 
          isCorrect: false
        },
        { 
          text: "Try to convince them to change", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Treating everyone with dignity and respecting their identity creates inclusive and supportive environments.",
        wrong: "Treating everyone with dignity and respecting their identity creates inclusive and supportive environments."
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
      title="Badge: Gender Rights Teen"
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
    
      nextGamePathProp="/student/civic-responsibility/teens/cyberbully-story"
      nextGameIdProp="civic-responsibility-teens-31">
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
                <h3 className="text-3xl font-bold text-white mb-4">Gender Rights Teen Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong advocacy for gender equality with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Gender Rights Teen</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Equality Advocate</h4>
                    <p className="text-white/90 text-sm">
                      You understand the importance of challenging stereotypes and promoting equal opportunities.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Inclusive Mindset</h4>
                    <p className="text-white/90 text-sm">
                      You recognize how to create respectful environments for people of all gender identities.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Advocating for Gender Rights!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review gender equality concepts to strengthen your advocacy skills.
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

export default BadgeGenderRightsTeen;