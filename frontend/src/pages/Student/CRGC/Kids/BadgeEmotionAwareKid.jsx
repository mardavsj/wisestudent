import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BadgeEmotionAwareKid = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "civic-responsibility-kids-50";
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
      title: "Empathy",
      question: "Which action shows emotional intelligence when a friend is upset?",
      options: [
        { 
          text: "Ignore their feelings", 
          isCorrect: false
        },
        { 
          text: "Listen and offer support", 
          isCorrect: true
        },
        { 
          text: "Tell them to stop being sad", 
          isCorrect: false
        },
        { 
          text: "Make fun of them", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Listening and offering support shows empathy and emotional intelligence!",
        wrong: "Listening and offering support shows empathy and emotional intelligence!"
      }
    },
    {
      id: 2,
      title: "Healthy Expression",
      question: "It's healthy to express your emotions appropriately.",
      options: [
       
        { 
          text: "False", 
          isCorrect: false
        },
        { 
          text: "Only happy emotions", 
          isCorrect: false
        },
        { 
          text: "Never express emotions", 
          isCorrect: false
        },
         { 
          text: "True", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Yes! Expressing emotions appropriately is a key part of emotional intelligence.",
        wrong: "Yes! Expressing emotions appropriately is a key part of emotional intelligence."
      }
    },
    {
      id: 3,
      title: "Anger Management",
      question: "When you feel angry, it's helpful to take deep breaths.",
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
          text: "Yell loudly", 
          isCorrect: false
        },
        { 
          text: "Hit something", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Taking deep breaths activates your body's relaxation response and helps manage anger.",
        wrong: "Taking deep breaths activates your body's relaxation response and helps manage anger."
      }
    },
    {
      id: 4,
      title: "Supporting Others",
      question: "You notice a classmate seems anxious before a test. What should you do?",
      options: [
        { 
          text: "Ignore them", 
          isCorrect: false
        },
        { 
          text: "Offer encouraging words", 
          isCorrect: true
        },
        { 
          text: "Make fun of their nervousness", 
          isCorrect: false
        },
        { 
          text: "Tell others about their anxiety", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Offering encouragement shows empathy and can help reduce someone's anxiety.",
        wrong: "Offering encouragement shows empathy and can help reduce someone's anxiety."
      }
    },
    {
      id: 5,
      title: "Frustration Management",
      question: "How can you manage frustration when things don't go as planned?",
      options: [
        { 
          text: "Break something", 
          isCorrect: false
        },
        
        { 
          text: "Blame others for your problems", 
          isCorrect: false
        },
        { 
          text: "Take a break and reassess", 
          isCorrect: true
        },
        { 
          text: "Give up completely", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Taking a break allows you to cool down and approach challenges with a fresh perspective.",
        wrong: "Taking a break allows you to cool down and approach challenges with a fresh perspective."
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
      title="Badge: Emotion Aware Kid"
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
    
      nextGamePathProp="/student/civic-responsibility/kids/clean-park-story"
      nextGameIdProp="civic-responsibility-kids-51">
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
                <h3 className="text-3xl font-bold text-white mb-4">Emotion Aware Kid Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated strong emotional intelligence with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Emotion Aware Kid</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Emotional Intelligence</h4>
                    <p className="text-white/90 text-sm">
                      You understand how to recognize and manage emotions in yourself and others.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Social Skills</h4>
                    <p className="text-white/90 text-sm">
                      You're building awareness of how to interact positively with others.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Developing Emotional Intelligence!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review emotional intelligence concepts to strengthen your knowledge.
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

export default BadgeEmotionAwareKid;