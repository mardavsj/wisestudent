import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const HygieneProGirlBadge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  
  const [challenge, setChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const challenges = [
    {
      id: 1,
      title: "Puberty Hygiene",
      question: "During puberty, how often should you shower or bathe?",
      options: [
        { 
          text: "Once a week", 
          emoji: "🛁", 
          isCorrect: false
        },
        { 
          text: "Daily ", 
          emoji: "🚿", 
          isCorrect: true
        },
        { 
          text: "Only when you smell bad", 
          emoji: "👃", 
          isCorrect: false
        },
        { 
          text: "Twice a day", 
          emoji: "⏰", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! During puberty, increased hormones make daily bathing important for staying fresh and clean!",
        wrong: "During puberty, increased oil and sweat production means you should shower or bathe daily or every other day to stay clean and confident."
      }
    },
    {
      id: 2,
      title: "Period Care",
      question: "How often should you change your pad or tampon during your period?",
      options: [
        
        { 
          text: "Once a day", 
          emoji: "📅", 
          isCorrect: false
        },
        { 
          text: "Only when it's soaked", 
          emoji: "💦", 
          isCorrect: false
        },
        { 
          text: "Every 4-6 hours or when soiled", 
          emoji: "⏰", 
          isCorrect: true
        },
        { 
          text: "Whenever you remember", 
          emoji: "🤔", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Right! Changing every 4-6 hours prevents odor, leaks, and infections!",
        wrong: "For health and comfort, pads and tampons should be changed every 4-6 hours or sooner if soiled to prevent bacterial growth and odor."
      }
    },
    {
      id: 3,
      title: "Daily Routine",
      question: "Which is NOT a recommended part of a daily hygiene routine?",
      options: [
        { 
          text: "Brushing teeth twice a day", 
          emoji: "🦷", 
          isCorrect: false
        },
        
        { 
          text: "Washing face gently", 
          emoji: "😊", 
          isCorrect: false
        },
        { 
          text: "Using deodorant", 
          emoji: "🌸", 
          isCorrect: false
        },
        { 
          text: "Using harsh scrubbing soap", 
          emoji: "🧽", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Perfect! Harsh soaps can damage your skin's natural barrier and cause irritation!",
        wrong: "Gentle cleansing is key. Harsh soaps can strip your skin of natural oils, leading to dryness and irritation."
      }
    },
    {
      id: 4,
      title: "Skincare",
      question: "What's the best way to care for acne-prone skin?",
      options: [
        { 
          text: "Use gentle cleanser and avoid picking", 
          emoji: "🫧", 
          isCorrect: true
        },
        { 
          text: "Wash with hot water and scrub vigorously", 
          emoji: "🔥", 
          isCorrect: false
        },
       
        { 
          text: "Never wash your face", 
          emoji: "🚫", 
          isCorrect: false
        },
         
        { 
          text: "Apply lots of makeup to cover it", 
          emoji: "💄", 
          isCorrect: false
        }
      ],
      feedback: {
        correct: "Exactly! Gentle cleansing and avoiding picking prevents scarring and further irritation!",
        wrong: "Acne-prone skin benefits from gentle, consistent care. Washing with lukewarm water and a mild cleanser twice daily is recommended."
      }
    },
    {
      id: 5,
      title: "Confidence Building",
      question: "What's the most important aspect of good hygiene for confidence?",
      options: [
        { 
          text: "Using expensive products", 
          emoji: "💰", 
          isCorrect: false
        },
         { 
          text: "Use gentle cleanser and avoid picking", 
          emoji: "🫧", 
          isCorrect: true
        },
        { 
          text: "Matching trends exactly", 
          emoji: "👗", 
          isCorrect: false
        },
        { 
          text: "Getting perfect skin", 
          emoji: "✨", 
          isCorrect: false
        },
         { 
          text: "Use gentle cleanser and avoid picking", 
          emoji: "🫧", 
          isCorrect: true
        },
      ],
      feedback: {
        correct: "Great choice! Consistent healthy habits build lasting confidence more than temporary fixes!",
        wrong: "True confidence comes from establishing and maintaining healthy hygiene routines that work for your body and lifestyle."
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
    navigate("/games/health-female/teens");
  };

  const currentChallenge = challenges[challenge];

  return (
    <GameShell
      title="Badge: Hygiene Pro Girl"
      subtitle={showResult ? "Game Complete!" : `Question ${challenge + 1} of ${challenges.length}`}
      onNext={handleNext}
      nextEnabled={true}
      showGameOver={showResult}
      score={score}
      gameId="health-female-teen-10"
      gameType="health-female"
      totalLevels={challenges.length}
      currentLevel={challenge + 1}
      showConfetti={showResult && score >= 4}
      flashPoints={flashPoints}
      backPath="/games/health-female/teens"
      showAnswerConfetti={showAnswerConfetti}
      maxScore={challenges.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}>
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
                <h3 className="text-3xl font-bold text-white mb-4">Hygiene Pro Girl Badge Earned!</h3>
                <p className="text-white/90 text-lg mb-6">
                  You demonstrated excellent knowledge about teen hygiene with {score} correct answers out of {challenges.length}!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl mb-6">
                  <h4 className="text-2xl font-bold mb-2">🎉 Achievement Unlocked!</h4>
                  <p className="text-xl">Badge: Hygiene Pro Girl</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-green-300 mb-2">Puberty Care</h4>
                    <p className="text-white/90 text-sm">
                      You understand the importance of adapting hygiene routines during puberty.
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-300 mb-2">Confidence Building</h4>
                    <p className="text-white/90 text-sm">
                      You know that consistent healthy habits build lasting confidence.
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
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning About Hygiene!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You answered {score} questions correctly out of {challenges.length}.
                </p>
                <p className="text-white/90 mb-6">
                  Review hygiene concepts to strengthen your knowledge and earn your badge.
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

export default HygieneProGirlBadge;