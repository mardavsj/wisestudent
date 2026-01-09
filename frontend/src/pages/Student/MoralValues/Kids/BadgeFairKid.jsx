import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeFairKid = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "moral-kids-50";
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
      title: "Sharing Toys",
      question: "You have a toy and your friend wants to play. What should you do?",
      options: [
        { 
          text: "Share your toy with friend", 
          emoji: "🧸", 
          isCorrect: true
        },
        { 
          text: "Keep it all to yourself", 
          emoji: "😏", 
          isCorrect: false
        },
        { 
          text: "Hide the toy", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Say it's broken", 
          emoji: "🚫", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Sharing toys fairly shows kindness and fairness!",
        wrong: "Remember: Sharing your toys with friends is the fair thing to do."
      }
    },
    {
      id: 2,
      title: "Waiting Your Turn",
      question: "Everyone is waiting in line. What should you do?",
      options: [
        { 
          text: "Push to the front", 
          emoji: "👊", 
          isCorrect: false
        },
        { 
          text: "Wait patiently for your turn", 
          emoji: "⏳", 
          isCorrect: true
        },
        { 
          text: "Cut in line", 
          emoji: "✂️", 
          isCorrect: false
        },
        { 
          text: "Skip the line", 
          emoji: "⏭️", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Excellent! Waiting your turn shows respect and fairness!",
        wrong: "Always wait your turn in line. Everyone deserves their fair chance."
      }
    },
    {
      id: 3,
      title: "Including Everyone",
      question: "You're playing a game with friends. What is the fair thing to do?",
      options: [
        { 
          text: "Leave someone out", 
          emoji: "👋", 
          isCorrect: false
        },
        { 
          text: "Only pick best players", 
          emoji: "⭐", 
          isCorrect: false
        },
        { 
          text: "Include everyone in the game", 
          emoji: "🏀", 
          isCorrect: true
        },
        { 
          text: "Play with only friends", 
          emoji: "👥", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Wonderful! Including everyone makes the game fair and fun for all!",
        wrong: "Always include everyone who wants to play. Fairness means everyone gets a chance."
      }
    },
    {
      id: 4,
      title: "Returning Borrowed Items",
      question: "You borrowed a book from a friend. What should you do?",
      options: [
        { 
          text: "Keep it forever", 
          emoji: "📚", 
          isCorrect: false
        },
        { 
          text: "Lose it", 
          emoji: "😰", 
          isCorrect: false
        },
        { 
          text: "Forget about it", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "Return it when done", 
          emoji: "📖", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Great! Returning borrowed items shows fairness and respect!",
        wrong: "Always return what you borrow. It's fair and shows you can be trusted."
      }
    },
    {
      id: 5,
      title: "Giving Others a Chance",
      question: "Your friend hasn't had a turn yet. What should you do?",
      options: [
        { 
          text: "Give them the first chance", 
          emoji: "🎯", 
          isCorrect: true
        },
        { 
          text: "Take another turn", 
          emoji: "🔄", 
          isCorrect: false
        },
        { 
          text: "Ignore them", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Let someone else give them a turn", 
          emoji: "👋", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Giving others a chance shows fairness and kindness!",
        wrong: "When others haven't had a turn, give them a chance. That's being fair."
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
      title="Badge: Fair Kid"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/moral-values/kids/dark-room-story"
      nextGameIdProp="moral-kids-51"
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
                    className={`bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3 ${
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
                <h3 className="text-3xl font-bold text-white mb-4">Fair Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You made {score} fair choices out of {challenges.length} challenges!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Fair Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Fair Choices</h4>
                    <p className="text-white/90 text-sm">
                      You chose to share, wait your turn, include everyone, 
                      return borrowed items, and give others chances.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Fair Play</h4>
                    <p className="text-white/90 text-sm">
                      Being fair makes games fun for everyone and builds trust with friends!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {score} fair choices out of {challenges.length} challenges.
                </p>
                <p className="text-white/90 mb-6">
                  Remember, fairness means sharing, waiting your turn, including everyone, 
                  returning what you borrow, and giving others chances.
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

export default BadgeFairKid;

