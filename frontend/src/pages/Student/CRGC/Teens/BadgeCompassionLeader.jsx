import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeCompassionLeader = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "civic-responsibility-teens-10";
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
      title: "Understanding Compassion",
      question: "Which action best demonstrates compassion toward others?",
      options: [
        { 
          text: "Ignoring someone who is upset", 
          isCorrect: false
        },
        { 
          text: "Actively listening to someone who is struggling", 
          isCorrect: true
        },
        { 
          text: "Judging someone based on their appearance", 
          isCorrect: false
        },
        { 
          text: "Spreading rumors about someone", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Actively listening shows empathy and understanding, which are key aspects of compassion.",
        wrong: "Actively listening shows empathy and understanding, which are key aspects of compassion."
      }
    },
    {
      id: 2,
      title: "Helping Others",
      question: "What is the best way to help someone who is facing difficulties?",
      options: [
        { 
          text: "Tell them their problems aren't important", 
          isCorrect: false
        },
        
        { 
          text: "Avoid them to prevent getting involved", 
          isCorrect: false
        },
        { 
          text: "Share their struggles with others", 
          isCorrect: false
        },
        { 
          text: "Offer practical support and emotional encouragement", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Offering both practical help and emotional support shows genuine care and compassion.",
        wrong: "Offering both practical help and emotional support shows genuine care and compassion."
      }
    },
    {
      id: 3,
      title: "Standing Against Injustice",
      question: "How should you respond when you witness someone being treated unfairly?",
      options: [
        { 
          text: "Speak up or seek help from an authority figure", 
          isCorrect: true
        },
        { 
          text: "Stay silent to avoid conflict", 
          isCorrect: false
        },
        
        { 
          text: "Join in with the unfair treatment", 
          isCorrect: false
        },
        { 
          text: "Record it for social media", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Standing up against injustice or seeking help protects those who are vulnerable.",
        wrong: "Standing up against injustice or seeking help protects those who are vulnerable."
      }
    },
    {
      id: 4,
      title: "Community Service",
      question: "Why is volunteering time to help others valuable?",
      options: [
        { 
          text: "It looks good on college applications", 
          isCorrect: false
        },
       
        { 
          text: "It's a requirement for graduation", 
          isCorrect: false
        },
         { 
          text: "It creates positive change and builds stronger communities", 
          isCorrect: true
        },
        { 
          text: "It's easier than finding a job", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Volunteering contributes to community wellbeing and develops empathy in volunteers.",
        wrong: "Volunteering contributes to community wellbeing and develops empathy in volunteers."
      }
    },
    {
      id: 5,
      title: "Inclusive Behavior",
      question: "What should you do to make others feel included in social situations?",
      options: [
        { 
          text: "Only talk to your close friends", 
          isCorrect: false
        },
        { 
          text: "Invite others to join conversations and activities", 
          isCorrect: true
        },
        { 
          text: "Ignore people who seem different", 
          isCorrect: false
        },
        { 
          text: "Form exclusive cliques", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Inviting others to participate creates welcoming environments where everyone feels valued.",
        wrong: "Inviting others to participate creates welcoming environments where everyone feels valued."
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
      title="Badge: Compassion Leader"
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
    
      nextGamePathProp="/student/civic-responsibility/teens/cultural-story"
      nextGameIdProp="civic-responsibility-teens-11">
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
                <h3 className="text-3xl font-bold text-white mb-4">Compassion Leader Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong compassion and leadership with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Compassion Leader</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Empathetic Leadership</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to show compassion and lead with empathy.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Community Impact</h4>
                    <p className="text-white/90 text-sm">
                      You recognize how compassionate actions create positive change.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Leading with Compassion!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review compassion concepts to strengthen your leadership skills.
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

export default BadgeCompassionLeader;