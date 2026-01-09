import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgekindKidd = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "moral-kids-30";
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
      title: "Sharing with Friends",
      question: "You have 2 chocolates and your friend has none. What should you do?",
      options: [
        { 
          text: "Share one chocolate", 
          emoji: "🍫", 
          isCorrect: true
        },
        { 
          text: "Eat both yourself", 
          emoji: "😋", 
          isCorrect: false
        },
        { 
          text: "Hide them", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Throw them away", 
          emoji: "🗑️", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Sharing shows kindness and makes friendships stronger!",
        wrong: "Remember: Sharing with friends is a kind act that shows you care."
      }
    },
    {
      id: 2,
      title: "Helping Others",
      question: "A classmate is struggling with their work. What is the kind thing to do?",
      options: [
        { 
          text: "Laugh at them", 
          emoji: "😆", 
          isCorrect: false
        },
        { 
          text: "Offer to help them", 
          emoji: "🤝", 
          isCorrect: true
        },
        { 
          text: "Ignore them", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Tell the teacher", 
          emoji: "👩‍🏫", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Excellent! Helping others when they struggle shows true kindness!",
        wrong: "Always offer help to those who need it. It's a kind and caring act."
      }
    },
    {
      id: 3,
      title: "Being Kind to Animals",
      question: "You see a thirsty puppy. What should you do?",
      options: [
        { 
          text: "Run away", 
          emoji: "🏃", 
          isCorrect: false
        },
        { 
          text: "Ignore it", 
          emoji: "👀", 
          isCorrect: false
        },
        { 
          text: "Give it water", 
          emoji: "🐕", 
          isCorrect: true
        },
        { 
          text: "Scare it away", 
          emoji: "👻", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Wonderful! Helping animals shows kindness and compassion!",
        wrong: "Always help animals in need. Giving water to a thirsty animal is kind."
      }
    },
    {
      id: 4,
      title: "Including Everyone",
      question: "Someone is being left out of a game. What do you do?",
      options: [
        { 
          text: "Keep playing without them", 
          emoji: "🎮", 
          isCorrect: false
        },
        { 
          text: "Laugh at them", 
          emoji: "😂", 
          isCorrect: false
        },
        { 
          text: "Tell them to go away", 
          emoji: "👋", 
          isCorrect: false
        },
        { 
          text: "Invite them to join", 
          emoji: "👥", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Great! Including everyone makes everyone feel valued and happy!",
        wrong: "Always invite others to join. Excluding people is unkind."
      }
    },
    {
      id: 5,
      title: "Kind Words",
      question: "What should you use when talking to others?",
      options: [
        { 
          text: "Kind and encouraging words", 
          emoji: "💬", 
          isCorrect: true
        },
        { 
          text: "Mean words", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Rude words", 
          emoji: "🤬", 
          isCorrect: false
        },
        { 
          text: "Ignore them", 
          emoji: "😶", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Kind words make others feel good and spread happiness!",
        wrong: "Always use kind words. They can brighten someone's day and make them feel valued."
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
      title="Badge: Kind Kid"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/moral-values/kids/homework-storyy"
      nextGameIdProp="moral-kids-31"
      gameType="moral"
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      currentLevel={challenge + 1}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
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
                    className={`bg-gradient-to-r from-green-500 to-lime-600 hover:from-green-600 hover:to-lime-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3 ${
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
                <h3 className="text-3xl font-bold text-white mb-4">Kind Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You made {score} kind choices out of {challenges.length} challenges!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Kind Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Kind Choices</h4>
                    <p className="text-white/90 text-sm">
                      You chose to share, help others, care for animals, include everyone, 
                      and use kind words.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Spreading Kindness</h4>
                    <p className="text-white/90 text-sm">
                      Your kindness makes the world a better place for everyone around you!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {score} kind choices out of {challenges.length} challenges.
                </p>
                <p className="text-white/90 mb-6">
                  Remember, kindness means sharing, helping others, caring for animals, 
                  including everyone, and using kind words.
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

export default BadgekindKidd;

