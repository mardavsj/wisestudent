import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PeerPressureFighterBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "health-female-kids-70";
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
      title: "Brave Voice",
      question: "To earn the 'Brave Voice' badge, you must...",
      options: [
        { 
          text: "Never speak", 
          emoji: "🙊", 
          isCorrect: false
        },
        { 
          text: "Say 'NO' to unsafe things", 
          emoji: "🛑", 
          isCorrect: true
        },
        { 
          text: "Yell at everyone", 
          emoji: "📣", 
          isCorrect: false
        },
        { 
          text: "Agree with everyone", 
          emoji: "👍", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Be brave and say no to unsafe things!",
        wrong: "A brave voice means saying 'NO' to unsafe things, even when it's difficult."
      }
    },
    {
      id: 2,
      title: "Friendship Hero",
      question: "The 'Friendship Hero' badge is for...",
      options: [
        { 
          text: "Being the boss of everyone", 
          emoji: "👑", 
          isCorrect: false
        },
        { 
          text: "Helping friends make good choices", 
          emoji: "🦸‍♀️", 
          isCorrect: false
        },
        { 
          text: "Ignoring friends", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Standing up for friends", 
          emoji: "💪", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Perfect! Heroes stand up for their friends!",
        wrong: "A Friendship Hero stands up for friends and helps them make good choices."
      }
    },
    {
      id: 3,
      title: "Smart Choice",
      question: "How do you get the 'Smart Choice' badge?",
      options: [
        { 
          text: "Do what everyone else does", 
          emoji: "🐑", 
          isCorrect: false
        },
        { 
          text: "Think about safety first", 
          emoji: "🧠", 
          isCorrect: false
        },
        { 
          text: "Ask a trusted adult", 
          emoji: "👩‍🏫", 
          isCorrect: true
        },
        { 
          text: "Flip a coin", 
          emoji: "🪙", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great! Smart choices involve asking trusted adults for help!",
        wrong: "Making smart choices means thinking about safety and asking trusted adults for guidance."
      }
    },
    {
      id: 4,
      title: "Kindness Captain",
      question: "The 'Kindness Captain' badge requires...",
      options: [
        { 
          text: "Only playing alone", 
          emoji: "🧍", 
          isCorrect: false
        },
        { 
          text: "Including others in games", 
          emoji: "🤝", 
          isCorrect: false
        },
        { 
          text: "Taking all the toys", 
          emoji: "🧸", 
          isCorrect: false
        },
        { 
          text: "Being respectful to everyone", 
          emoji: "😊", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Exactly! Kindness Captains treat everyone with respect!",
        wrong: "Kindness Captains include others, share, and treat everyone with respect."
      }
    },
    {
      id: 5,
      title: "Respect Ranger",
      question: "Who is a 'Respect Ranger'?",
      options: [
        { 
          text: "Someone who teases", 
          emoji: "😜", 
          isCorrect: false
        },
        { 
          text: "Someone who interrupts", 
          emoji: "✋", 
          isCorrect: false
        },
        { 
          text: "Someone who listens and cares", 
          emoji: "👂", 
          isCorrect: false
        },
        { 
          text: "Someone who treats all with dignity", 
          emoji: "🌟", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Exactly! Respect Rangers treat everyone with dignity!",
        wrong: "Respect Rangers listen, care, and treat everyone with dignity and respect."
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
      title="Badge: Peer Pressure Fighter"
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
      nextGamePathProp="/student/health-female/kids/clean-girl-badge"
      nextGameIdProp="health-female-kids-71">
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
                <h3 className="text-3xl font-bold text-white mb-4">Peer Pressure Fighter Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent skills in standing up to peer pressure with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Peer Pressure Fighter</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Bravery</h4>
                    <p className="text-white/90 text-sm">
                      You know how to say 'NO' to unsafe things and stand up for what's right.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Leadership</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to be a positive influence on your friends.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleNext}
                  className="bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-3 px-8 rounded-full font-bold text-lg transition-all mb-4"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Fighting Peer Pressure!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review peer pressure concepts to strengthen your knowledge and earn your badge.
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

export default PeerPressureFighterBadge;