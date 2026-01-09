import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeRespectKid = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "moral-kids-20";
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
      title: "Helping Elders",
      question: "Your grandpa needs help carrying groceries. What should you do?",
      options: [
        { 
          text: "Help him right away", 
          emoji: "👴", 
          isCorrect: true
        },
        { 
          text: "Ignore and keep playing", 
          emoji: "😏", 
          isCorrect: false
        },
        { 
          text: "Ask him to wait", 
          emoji: "⏰", 
          isCorrect: false
        },
        { 
          text: "Let someone else help", 
          emoji: "👋", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Helping elders shows respect and kindness!",
        wrong: "Remember: Always help elders when they need assistance."
      }
    },
    {
      id: 2,
      title: "Using Polite Words",
      question: "When talking to adults, what words should you use?",
      options: [
        { 
          text: "Rude words", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Please, thank you, and excuse me", 
          emoji: "🙏", 
          isCorrect: true
        },
        { 
          text: "Slang words", 
          emoji: "😎", 
          isCorrect: false
        },
        { 
          text: "Loud words", 
          emoji: "📢", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Excellent! Polite words show respect to everyone!",
        wrong: "Using polite words like 'please' and 'thank you' shows respect."
      }
    },
    {
      id: 3,
      title: "Greeting Teachers",
      question: "Your teacher enters the classroom. What should you do?",
      options: [
        { 
          text: "Keep talking", 
          emoji: "🗣️", 
          isCorrect: false
        },
        { 
          text: "Look away", 
          emoji: "👀", 
          isCorrect: false
        },
        { 
          text: "Greet them respectfully", 
          emoji: "👩‍🏫", 
          isCorrect: true
        },
        { 
          text: "Continue playing", 
          emoji: "🎮", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Wonderful! Greeting teachers shows respect and good manners!",
        wrong: "Always greet teachers and elders when they enter. It shows respect."
      }
    },
    {
      id: 4,
      title: "Including Others",
      question: "A smaller child wants to join your game. What do you do?",
      options: [
        { 
          text: "Tell them to go away", 
          emoji: "👋", 
          isCorrect: false
        },
        { 
          text: "Ignore them", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Laugh at them", 
          emoji: "😂", 
          isCorrect: false
        },
        { 
          text: "Include them in the game", 
          emoji: "🏃", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Great! Including everyone shows respect and kindness!",
        wrong: "Always include others, especially those younger or smaller than you."
      }
    },
    {
      id: 5,
      title: "Listening to Elders",
      question: "When an elder is speaking to you, what should you do?",
      options: [
        { 
          text: "Listen patiently and respectfully", 
          emoji: "👂", 
          isCorrect: true
        },
        { 
          text: "Interrupt them", 
          emoji: "🗣️", 
          isCorrect: false
        },
        { 
          text: "Walk away", 
          emoji: "🚶", 
          isCorrect: false
        },
        { 
          text: "Ignore what they say", 
          emoji: "🙄", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Listening shows respect and helps you learn!",
        wrong: "Always listen when elders speak. It shows respect and you can learn from them."
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
      title="Badge: Respect Kid"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/moral-values/kids/sharing-story"
      nextGameIdProp="moral-kids-21"
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
                <h3 className="text-3xl font-bold text-white mb-4">Respect Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You made {score} respectful choices out of {challenges.length} challenges!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Respect Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Respectful Choices</h4>
                    <p className="text-white/90 text-sm">
                      You chose to help elders, use polite words, greet teachers, 
                      include others, and listen respectfully.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Building Character</h4>
                    <p className="text-white/90 text-sm">
                      Showing respect to everyone makes you a kind and thoughtful person!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {score} respectful choices out of {challenges.length} challenges.
                </p>
                <p className="text-white/90 mb-6">
                  Remember, respect means helping elders, using polite words, greeting teachers, 
                  including everyone, and listening when others speak.
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

export default BadgeRespectKid;

