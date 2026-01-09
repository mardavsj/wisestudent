import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SafetySmartGirlBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "health-female-kids-80";
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
      title: "Germ Buster",
      question: "To earn the 'Germ Buster' badge you must...",
      options: [
        { 
          text: "Never wash hands", 
          emoji: "🦠", 
          isCorrect: false
        },
        { 
          text: "Wash hands with soap often", 
          emoji: "🧼", 
          isCorrect: true
        },
        { 
          text: "Share tissues", 
          emoji: "🤧", 
          isCorrect: false
        },
        { 
          text: "Play in dirt", 
          emoji: "💩", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Correct! That busts germs.",
        wrong: "Washing hands with soap often helps bust germs and keeps you healthy."
      }
    },
    {
      id: 2,
      title: "Safe Rider",
      question: "The 'Safe Rider' badge is given for...",
      options: [
        { 
          text: "Standing up in the bus", 
          emoji: "🚌", 
          isCorrect: false
        },
        { 
          text: "Riding with no hands", 
          emoji: "🚲", 
          isCorrect: false
        },
        { 
          text: "Wearing a helmet and seatbelt", 
          emoji: "⛑️", 
          isCorrect: true
        },
        { 
          text: "Speeding", 
          emoji: "🚨", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Yes! Safety gear is key.",
        wrong: "Always wear a helmet and seatbelt to stay safe while riding."
      }
    },
    {
      id: 3,
      title: "Doctor's Helper",
      question: "How do you get the 'Doctor's Helper' badge?",
      options: [
        { 
          text: "Running away from shots", 
          emoji: "🏃‍♀️", 
          isCorrect: false
        },
        { 
          text: "Yelling loudly", 
          emoji: "📢", 
          isCorrect: false
        },
        { 
          text: "Being brave and following advice", 
          emoji: "🦸‍♀️", 
          isCorrect: false
        },
        { 
          text: "Listening to doctors and staying calm", 
          emoji: "👩‍⚕️", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Correct! Help the doctor help you.",
        wrong: "Being a Doctor's Helper means listening to medical advice and staying calm."
      }
    },
    {
      id: 4,
      title: "Prevention Pro",
      question: "What makes you a 'Prevention Pro'?",
      options: [
        { 
          text: "Sleeping only 1 hour", 
          emoji: "🕐", 
          isCorrect: false
        },
        { 
          text: "Eating only chips", 
          emoji: "🥔", 
          isCorrect: false
        },
        { 
          text: "Eating well, sleeping, and playing safely", 
          emoji: "🌟", 
          isCorrect: false
        },
        { 
          text: "Maintaining healthy habits daily", 
          emoji: "🥗", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Yes! Healthy habits prevent sickness.",
        wrong: "Prevention Pros maintain healthy habits like good nutrition, sleep, and exercise daily."
      }
    },
    {
      id: 5,
      title: "Safety Team",
      question: "Who keeps you safe?",
      options: [
        { 
          text: "Only chance/luck", 
          emoji: "🎲", 
          isCorrect: false
        },
        { 
          text: "Magic", 
          emoji: "✨", 
          isCorrect: false
        },
        { 
          text: "You, parents, and doctors", 
          emoji: "👪", 
          isCorrect: false
        },
        { 
          text: "A team of caring people", 
          emoji: "🤝", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Exactly! It's a team effort.",
        wrong: "Staying safe is a team effort with family, doctors, teachers, and community helpers."
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

  const handleNext = () => {
    navigate("/games/health-female/kids");
  };

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: Safety Smart Girl"
      subtitle={showResult ? "Game Complete!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      onNext={handleNext}
      nextEnabled={true}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      gameType="health-female"
      totalLevels={challenges.length}
      currentLevel={challenge + 1}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      backPath="/games/health-female/kids"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={challenges.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/health-female/kids/cigarette-story"
      nextGameIdProp="health-female-kids-81">
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
                    className={`bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3 ${
                      answered && selectedAnswer === idx
                        ? option.isCorrect
                          ? "ring-4 ring-green-400"
                          : "ring-4 ring-red-400"
                        : ""
                    }`}
                  >
                    <span className="text-2xl">{option.emoji}</span>
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
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-3xl font-bold text-white mb-4">Safety Smart Girl Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent safety knowledge with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Safety Smart Girl</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-pink-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-pink-300 mb-2">Health</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to stay healthy and germ-free.
                    </p>
                  </div>
                  <div className="bg-purple-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-purple-300 mb-2">Safety</h4>
                    <p className="text-white/90 text-sm">
                      You know how to stay safe in different situations.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Safety!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review safety concepts to strengthen your knowledge and earn your badge.
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
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

export default SafetySmartGirlBadge;