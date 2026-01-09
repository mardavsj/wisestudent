import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeTruthfulKid = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "moral-kids-10";
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
      title: "Finding Lost Items",
      question: "You find a lost pencil on the floor. What should you do?",
      options: [
        { 
          text: "Return it to the teacher", 
          emoji: "✏️", 
          isCorrect: true
        },
        { 
          text: "Keep it for yourself", 
          emoji: "😏", 
          isCorrect: false
        },
        { 
          text: "Throw it away", 
          emoji: "🗑️", 
          isCorrect: false
        },
        { 
          text: "Give it to a friend", 
          emoji: "👥", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Returning lost items shows honesty and kindness!",
        wrong: "Remember: Always return found items to their owner or teacher."
      }
    },
    {
      id: 2,
      title: "Homework Situation",
      question: "You didn't finish your homework. What is the honest thing to do?",
      options: [
        { 
          text: "Blame someone else", 
          emoji: "👈", 
          isCorrect: false
        },
        { 
          text: "Tell the truth to your teacher", 
          emoji: "✅", 
          isCorrect: true
        },
        { 
          text: "Say you lost it", 
          emoji: "🤥", 
          isCorrect: false
        },
        { 
          text: "Copy from a friend", 
          emoji: "📋", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Excellent! Telling the truth is always the right choice!",
        wrong: "Being honest about mistakes shows character and trustworthiness."
      }
    },
    {
      id: 3,
      title: "During Exam",
      question: "During a test, your friend asks to see your answers. What do you do?",
      options: [
        { 
          text: "Share your answers", 
          emoji: "👀", 
          isCorrect: false
        },
        { 
          text: "Ignore your friend", 
          emoji: "😶", 
          isCorrect: false
        },
        { 
          text: "Refuse and encourage them to try", 
          emoji: "💪", 
          isCorrect: true
        },
        { 
          text: "Let them copy", 
          emoji: "📝", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Wonderful! Cheating helps no one. Encouraging honest effort is best!",
        wrong: "Cheating is dishonest. Help friends learn instead of letting them copy."
      }
    },
    {
      id: 4,
      title: "Extra Candy",
      question: "The shopkeeper gives you extra candy by mistake. What is the right choice?",
      options: [
        { 
          text: "Eat it quickly", 
          emoji: "🍬", 
          isCorrect: false
        },
        { 
          text: "Keep it secret", 
          emoji: "🤫", 
          isCorrect: false
        },
        { 
          text: "Share with friends", 
          emoji: "👫", 
          isCorrect: false
        },
        { 
          text: "Return it to the shopkeeper", 
          emoji: "🏪", 
          isCorrect: true
        }
      ],
      feedback: {
        correct: "Great! Returning what isn't yours shows honesty and respect!",
        wrong: "Always return items given by mistake. It's the honest thing to do."
      }
    },
    {
      id: 5,
      title: "Always Choose Truth",
      question: "When faced with a choice between truth and a lie, what should you always choose?",
      options: [
        { 
          text: "Always choose truth", 
          emoji: "💎", 
          isCorrect: true
        },
        { 
          text: "Choose whichever is easier", 
          emoji: "😅", 
          isCorrect: false
        },
        { 
          text: "Lie to avoid trouble", 
          emoji: "😰", 
          isCorrect: false
        },
        { 
          text: "Ask someone else to decide", 
          emoji: "🤷", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Perfect! Truth is always the best policy, even when it's hard!",
        wrong: "Remember: Honesty builds trust and makes you a truthful person."
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
      title="Badge: Truthful Kid"
      subtitle={showResult ? "Badge Earned!" : `Challenge ${challenge + 1} of ${challenges.length}`}
      showGameOver={showResult}
      score={score}
      gameId={gameId}
      nextGamePathProp="/student/moral-values/kids/respect-elders-story"
      nextGameIdProp="moral-kids-11"
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
                    className={`bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[60px] flex items-center justify-center gap-3 ${
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
                <h3 className="text-3xl font-bold text-white mb-4">Truthful Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You made {score} honest choices out of {challenges.length} challenges!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Truthful Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Honest Choices</h4>
                    <p className="text-white/90 text-sm">
                      You chose to return lost items, tell the truth, avoid cheating, 
                      and always choose honesty over lies.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Building Trust</h4>
                    <p className="text-white/90 text-sm">
                      Honesty builds trust and makes you a person others can rely on!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You made {score} honest choices out of {challenges.length} challenges.
                </p>
                <p className="text-white/90 mb-6">
                  Remember, honesty means always telling the truth, returning what isn't yours, 
                  and choosing the right path even when it's difficult.
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

export default BadgeTruthfulKid;

