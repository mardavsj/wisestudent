import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeBraveKid = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "moral-kids-60";
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
      title: "Standing Up for Friends",
      question: "You see a friend being bullied. What should you do?",
      options: [
        { 
          text: "Speak up and help your friend", 
          emoji: "🗣️", 
          isCorrect: true
        },
        { 
          text: "Watch and do nothing", 
          emoji: "👀", 
          isCorrect: false
        },
        { 
          text: "Walk away", 
          emoji: "🚶", 
          isCorrect: false
        },
        { 
          text: "Join the bullies", 
          emoji: "😈", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Standing up for friends shows courage and kindness!",
        wrong: "Remember: Always speak up when someone is being bullied. It takes courage but it's the right thing."
      }
    },
    {
      id: 2,
      title: "Trying New Things",
      question: "You're scared to try something new. What should you do?",
      options: [
        { 
          text: "Avoid it completely", 
          emoji: "😰", 
          isCorrect: false
        },
        { 
          text: "Try it even if you're scared", 
          emoji: "🚴", 
          isCorrect: true
        },
        { 
          text: "Wait for others to try first", 
          emoji: "⏰", 
          isCorrect: false
        },
        { 
          text: "Give up before trying", 
          emoji: "😞", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Excellent! Facing your fears and trying new things shows bravery!",
        wrong: "Bravery means trying new things even when you're scared. You might discover you're good at it!"
      }
    },
    {
      id: 3,
      title: "Admitting Mistakes",
      question: "You made a mistake. What is the brave thing to do?",
      options: [
        { 
          text: "Blame someone else", 
          emoji: "👈", 
          isCorrect: false
        },
        { 
          text: "Hide the mistake", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          text: "Admit it confidently", 
          emoji: "🙋", 
          isCorrect: true
        },
        { 
          text: "Pretend it didn't happen", 
          emoji: "😶", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Wonderful! Admitting mistakes takes courage and shows honesty!",
        wrong: "It takes bravery to admit mistakes. Being honest about errors shows character."
      }
    },
    {
      id: 4,
      title: "Doing What's Right",
      question: "Everyone is doing something wrong, but you know it's wrong. What do you do?",
      options: [
        { 
          text: "Do it too", 
          emoji: "👥", 
          isCorrect: false
        },
        { 
          text: "Stay quiet", 
          emoji: "🤐", 
          isCorrect: false
        },
        { 
          text: "Stand up for what's right", 
          emoji: "🛡️", 
          isCorrect: true
        },
        { 
          text: "Pretend you don't see it", 
          emoji: "👀", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Great! Standing up for what's right, even alone, shows true bravery!",
        wrong: "It takes courage to stand up for what's right, even when others don't."
      }
    },
    {
      id: 5,
      title: "Helping in Danger",
      question: "Someone is in trouble and needs help. What should you do?",
      options: [
        { 
          text: "Help them safely", 
          emoji: "🤝", 
          isCorrect: true
        },
        { 
          text: "Run away", 
          emoji: "🏃", 
          isCorrect: false
        },
        { 
          text: "Ignore them", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Wait for adults", 
          emoji: "👨‍👩‍👧", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Helping others in need shows bravery and kindness!",
        wrong: "Brave kids help others in need. You can help safely or get an adult if needed."
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
      title="Badge: Brave Kid"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/moral-values/kids/football-story"
      nextGameIdProp="moral-kids-61"
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
                    className={`bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3 ${
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
                <h3 className="text-3xl font-bold text-white mb-4">Brave Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You made {score} brave choices out of {challenges.length} challenges!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Brave Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Brave Choices</h4>
                    <p className="text-white/90 text-sm">
                      You chose to stand up for friends, try new things, admit mistakes, 
                      do what's right, and help others in need.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Courage and Character</h4>
                    <p className="text-white/90 text-sm">
                      Your bravery makes you a hero and inspires others to be brave too!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {score} brave choices out of {challenges.length} challenges.
                </p>
                <p className="text-white/90 mb-6">
                  Remember, bravery means standing up for others, trying new things, 
                  admitting mistakes, doing what's right, and helping those in need.
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

export default BadgeBraveKid;

