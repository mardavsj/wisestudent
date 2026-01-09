import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeRespectKid = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "civic-responsibility-kids-20";
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
      title: "Language Differences",
      question: "Which action shows respect to someone who speaks a different language?",
      options: [
        { 
          text: "Make fun of their accent", 
          isCorrect: false
        },
        { 
          text: "Be patient and try to communicate", 
          isCorrect: true
        },
        { 
          text: "Ignore them completely", 
          isCorrect: false
        },
        { 
          text: "Talk about them behind their back", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Being patient and trying to communicate shows respect for others, regardless of language differences!",
        wrong: "Being patient and trying to communicate shows respect for others, regardless of language differences!"
      }
    },
    {
      id: 2,
      title: "Inclusion",
      question: "It's important to include everyone in games and activities, regardless of their differences.",
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
          text: "Only include friends", 
          isCorrect: false
        },
        { 
          text: "Only include people who look like you", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Yes! Including everyone helps create a welcoming environment for all.",
        wrong: "Yes! Including everyone helps create a welcoming environment for all."
      }
    },
    {
      id: 3,
      title: "Unfair Treatment",
      question: "When someone is being treated unfairly, you should tell an adult.",
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
          text: "Join in the unfair treatment", 
          isCorrect: false
        },
        { 
          text: "Stay quiet", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Telling an adult is the right way to get help when someone is being treated unfairly.",
        wrong: "Telling an adult is the right way to get help when someone is being treated unfairly."
      }
    },
    {
      id: 4,
      title: "Standing Up for Others",
      question: "You see someone being excluded from a group activity because of how they look. What should you do?",
      options: [
        { 
          text: "Join the group that's excluding them", 
          isCorrect: false
        },
        { 
          text: "Walk past without helping", 
          isCorrect: false
        },
        { 
          text: "Invite them to join your group", 
          isCorrect: true
        },
        { 
          text: "Make fun of them too", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Inviting someone who is being excluded shows respect and inclusion.",
        wrong: "Inviting someone who is being excluded shows respect and inclusion."
      }
    },
    {
      id: 5,
      title: "Disability Respect",
      question: "How can you show respect to someone with a disability?",
      options: [
        { 
          text: "Make fun of their differences", 
          isCorrect: false
        },
        { 
          text: "Ignore them completely", 
          isCorrect: false
        },
        { 
          text: "Treat them with the same respect as anyone else", 
          isCorrect: true
        },
        { 
          text: "Avoid them", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Treating everyone with the same respect, regardless of differences, is the foundation of inclusion.",
        wrong: "Treating everyone with the same respect, regardless of differences, is the foundation of inclusion."
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
    
      nextGamePathProp="/student/civic-responsibility/kids/sports-story"
      nextGameIdProp="civic-responsibility-kids-21">
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
                <h3 className="text-3xl font-bold text-white mb-4">Respect Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong knowledge of respect with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Respect Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Inclusion Skills</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to treat everyone with respect regardless of their differences.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Social Responsibility</h4>
                    <p className="text-white/90 text-sm">
                      You're building awareness of how to contribute positively to your community.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Practicing Respect!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review the importance of respect and inclusion to strengthen your knowledge.
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