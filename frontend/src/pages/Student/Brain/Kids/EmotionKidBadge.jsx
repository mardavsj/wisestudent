import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EmotionKidBadge = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameData = getGameDataById("brain-kids-50");
  const gameId = gameData?.id || "brain-kids-50";
  
  // Ensure gameId is always set correctly
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for EmotionKidBadge, using fallback ID");
  }
  
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
      title: "Identifying Happiness",
      question: "Which feeling is happiness?",
      options: [
        { 
          text: "Feeling joyful and smiling", 
          emoji: "😊", 
          isCorrect: true
        },
        { 
          text: "Feeling sad and crying", 
          emoji: "😢", 
          isCorrect: false
        },
        { 
          text: "Feeling angry and frowning", 
          emoji: "😠", 
          isCorrect: false
        },
        { 
          text: "Feeling scared and hiding", 
          emoji: "😨", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      title: "Identifying Sadness",
      question: "Which feeling is sadness?",
      options: [
        { 
          text: "Feeling happy and laughing", 
          emoji: "😄", 
          isCorrect: false
        },
        { 
          text: "Feeling excited and jumping", 
          emoji: "🎉", 
          isCorrect: false
        },
        { 
          text: "Feeling down and teary", 
          emoji: "😢", 
          isCorrect: true
        },
        { 
          text: "Feeling proud and confident", 
          emoji: "😎", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      title: "Identifying Anger",
      question: "Which feeling is anger?",
      options: [
        { 
          text: "Feeling calm and peaceful", 
          emoji: "😌", 
          isCorrect: false
        },
        { 
          text: "Feeling mad and frustrated", 
          emoji: "😠", 
          isCorrect: true
        },
        { 
          text: "Feeling happy and cheerful", 
          emoji: "😊", 
          isCorrect: false
        },
        { 
          text: "Feeling surprised and shocked", 
          emoji: "😲", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      title: "Identifying Fear",
      question: "Which feeling is fear?",
      options: [
        { 
          text: "Feeling scared and worried", 
          emoji: "😨", 
          isCorrect: true
        },
        { 
          text: "Feeling brave and strong", 
          emoji: "💪", 
          isCorrect: false
        },
        { 
          text: "Feeling happy and joyful", 
          emoji: "😊", 
          isCorrect: false
        },
        { 
          text: "Feeling calm and relaxed", 
          emoji: "😌", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      title: "Identifying Excitement",
      question: "Which feeling is excitement?",
      options: [
        { 
          text: "Feeling bored and tired", 
          emoji: "😴", 
          isCorrect: false
        },
        { 
          text: "Feeling calm and quiet", 
          emoji: "😌", 
          isCorrect: false
        },
        { 
          text: "Feeling thrilled and energetic", 
          emoji: "🎉", 
          isCorrect: true
        },
        { 
          text: "Feeling sad and gloomy", 
          emoji: "😢", 
          isCorrect: false
        }
      ]
    }
  ];

  const handleAnswer = (isCorrect) => {
    if (answered) return;
    
    setAnswered(true);
    resetFeedback();
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
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

  return (
    <GameShell
      title="Badge: Emotion Kid"
      subtitle={!showResult ? `Challenge ${challenge + 1} of ${challenges.length}` : "Badge Complete!"}
      score={score}
      currentLevel={challenge + 1}
      totalLevels={challenges.length}
      coinsPerLevel={coinsPerLevel}
      showGameOver={showResult}
      maxScore={challenges.length}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePathProp="/student/brain/kids/rainy-day-story"
      nextGameIdProp="brain-kids-51"
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="brain"
    >
      <div className="space-y-4 sm:space-y-6 md:space-y-8 max-w-4xl mx-auto px-2 sm:px-4 md:px-6">
        {!showResult && challenges[challenge] ? (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/20">
              {/* Header - Stack on mobile, horizontal on larger screens */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
                <span className="text-white/80 text-xs sm:text-sm md:text-base">Challenge {challenge + 1}/{challenges.length}</span>
                <span className="text-yellow-400 font-bold text-xs sm:text-sm md:text-base">Score: {score}/{challenges.length}</span>
              </div>
              
              {/* Challenge title and question - Centered */}
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3 text-center">{challenges[challenge].title}</h3>
              <p className="text-white text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6 text-center">
                {challenges[challenge].question}
              </p>
              
              {/* Options grid - Single column on mobile, 2 columns on tablet+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {challenges[challenge].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedAnswer(idx);
                      handleAnswer(option.isCorrect);
                    }}
                    disabled={answered}
                    className={`p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl text-left transition-all transform active:scale-95 ${
                      answered
                        ? option.isCorrect
                          ? "bg-green-500/30 border-2 sm:border-4 border-green-400 ring-2 sm:ring-4 ring-green-400"
                          : selectedAnswer === idx
                          ? "bg-red-500/20 border-2 sm:border-4 border-red-400 ring-2 sm:ring-4 ring-red-400"
                          : "bg-white/5 border-2 border-white/20 opacity-50"
                        : "bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${answered ? "cursor-not-allowed" : "cursor-pointer"} w-full`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-xl sm:text-2xl md:text-3xl flex-shrink-0">{option.emoji}</span>
                      <span className="text-white font-semibold text-xs sm:text-sm md:text-base leading-tight sm:leading-normal">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🏆</div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">Emotion Kid Badge Earned!</h3>
                <p className="text-white/90 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 px-2">
                  You got {score} out of {challenges.length} challenges correct!
                  You're a true Emotion Kid expert!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-full inline-flex items-center gap-2 mb-3 sm:mb-4 text-sm sm:text-base">
                  <span>+{score} Coins</span>
                </div>
                <p className="text-white/80 text-xs sm:text-sm md:text-base px-2">
                  Lesson: You can identify different feelings like happiness, sadness, anger, fear, and excitement!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">💪</div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 px-2">
                  You got {score} out of {challenges.length} challenges correct.
                  Practice makes perfect with identifying feelings!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 active:scale-95 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-full font-bold transition-all mb-3 sm:mb-4 text-sm sm:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs sm:text-sm px-2">
                  Tip: Pay attention to facial expressions and body language to identify different feelings!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EmotionKidBadge;

