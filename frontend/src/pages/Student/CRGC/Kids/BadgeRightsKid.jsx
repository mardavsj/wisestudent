import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeRightsKid = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "civic-responsibility-kids-70";
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
      title: "Children's Rights Violation",
      question: "Which situation shows a violation of children's rights?",
      options: [
        { 
          text: "A child being denied education because of their gender", 
          isCorrect: true
        },
        { 
          text: "A child receiving good grades in school", 
          isCorrect: false
        },
        { 
          text: "A child playing with friends during recess", 
          isCorrect: false
        },
        { 
          text: "A child expressing their opinion in class", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Denying education based on gender violates the fundamental right to education for all children!",
        wrong: "Denying education based on gender violates the fundamental right to education for all children!"
      }
    },
    {
      id: 2,
      title: "Freedom of Expression",
      question: "All children have the right to express their opinions.",
      options: [
        { 
          text: "True", 
          isCorrect: true
        },
        { 
          text: "False", 
          isCorrect: false
        },
        { 
          text: "Only if adults agree", 
          isCorrect: false
        },
        { 
          text: "Only in private", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Yes! The UN Convention on the Rights of the Child recognizes children's right to freedom of expression.",
        wrong: "Yes! The UN Convention on the Rights of the Child recognizes children's right to freedom of expression."
      }
    },
    {
      id: 3,
      title: "Right to Education",
      question: "Every child has the right to education regardless of their background.",
      options: [
        { 
          text: "True", 
          isCorrect: true
        },
        { 
          text: "False", 
          isCorrect: false
        },
        { 
          text: "Only if they can afford it", 
          isCorrect: false
        },
        { 
          text: "Only in certain countries", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Education is a fundamental right that should be accessible to all children regardless of their circumstances.",
        wrong: "Education is a fundamental right that should be accessible to all children regardless of their circumstances."
      }
    },
    {
      id: 4,
      title: "Protecting Rights",
      question: "You notice a classmate is being treated unfairly because of their disability. What should you do?",
      options: [
        { 
          text: "Ignore it to avoid conflict", 
          isCorrect: false
        },
        { 
          text: "Tell a teacher or trusted adult", 
          isCorrect: true
        },
        { 
          text: "Join in with the unfair treatment", 
          isCorrect: false
        },
        { 
          text: "Tell other students to laugh", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Reporting unfair treatment helps protect your classmate's rights and creates a more inclusive environment.",
        wrong: "Reporting unfair treatment helps protect your classmate's rights and creates a more inclusive environment."
      }
    },
    {
      id: 5,
      title: "Importance of Human Rights",
      question: "Why are human rights important for children?",
      options: [
        { 
          text: "They ensure children can grow up safely and reach their potential", 
          isCorrect: true
        },
        { 
          text: "They make children more special than adults", 
          isCorrect: false
        },
        { 
          text: "They allow children to do whatever they want", 
          isCorrect: false
        },
        { 
          text: "They are only suggestions", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Human rights create the conditions necessary for children to develop physically, mentally, and socially in a safe environment.",
        wrong: "Human rights create the conditions necessary for children to develop physically, mentally, and socially in a safe environment."
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
      title="Badge: Rights Kid"
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
      backPath="/games/civic-responsibility/kids"
    
      nextGamePathProp="/student/civic-responsibility/kids/traffic-story"
      nextGameIdProp="civic-responsibility-kids-71">
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
                <h3 className="text-3xl font-bold text-white mb-4">Rights Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong knowledge of children's rights with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Rights Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Rights Awareness</h4>
                    <p className="text-white/90 text-sm">
                      You understand the fundamental rights that protect children around the world.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Advocacy Skills</h4>
                    <p className="text-white/90 text-sm">
                      You're building awareness of how to stand up for rights and help others.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    window.location.href = "/games/civic-responsibility/kids";
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Rights!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review children's rights concepts to strengthen your knowledge.
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

export default BadgeRightsKid;