import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const MentorStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-teen-95";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 1; // 1 coin per correct answer
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5; // Total coins for completing all questions
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const questions = [
    {
      id: 1,
      text: "A teen meets an experienced professional in her field. Should she ask questions and learn from them?",
      options: [
        {
          id: "b",
          text: "No, she should figure everything out alone",
          emoji: "🧍",
          correct: false
        },
        {
          id: "a",
          text: "Yes, mentors provide valuable guidance and insights",
          emoji: "👨‍🏫",
          correct: true
        },
        {
          id: "c",
          text: "No, mentors are only for adults",
          emoji: "👶",
          correct: false
        }
      ]
    },
    {
      id: 2,
      text: "What's the best way to approach a potential mentor?",
      options: [
        {
          id: "a",
          text: "Be respectful, show genuine interest, and be specific about what you want to learn",
          emoji: "🤝",
          correct: true
        },
        {
          id: "b",
          text: "Demand their time without explanation",
          emoji: "⏰",
          correct: false
        },
        {
          id: "c",
          text: "Expect them to do your work for you",
          emoji: "💼",
          correct: false
        }
      ]
    },
    {
      id: 3,
      text: "How should a mentee prepare for mentorship meetings?",
      options: [
        {
          id: "b",
          text: "Show up without any preparation",
          emoji: "😴",
          correct: false
        },
        {
          id: "c",
          text: "Only ask for job opportunities",
          emoji: "💼",
          correct: false
        },
        {
          id: "a",
          text: "Come with specific questions and goals",
          emoji: "🎯",
          correct: true
        },
      ]
    },
    {
      id: 4,
      text: "What's an important aspect of a successful mentor-mentee relationship?",
      options: [
        {
          id: "a",
          text: "Mutual respect and clear communication",
          emoji: "💬",
          correct: true
        },
        {
          id: "b",
          text: "The mentor doing all the talking",
          emoji: "🗣️",
          correct: false
        },
        {
          id: "c",
          text: "Never asking for feedback",
          emoji: "🔇",
          correct: false
        }
      ]
    },
    {
      id: 5,
      text: "How can a mentee show appreciation for their mentor's time?",
      options: [
        {
          id: "b",
          text: "Never contact them again after getting advice",
          emoji: "👋",
          correct: false
        },
        {
          id: "a",
          text: "Follow through on advice and update them on progress",
          emoji: "📈",
          correct: true
        },
        {
          id: "c",
          text: "Only reach out when in crisis",
          emoji: "🚨",
          correct: false
        }
      ]
    }
  ];

  const handleAnswerSelect = (option) => {
    resetFeedback();
    
    if (option.correct) {
      const newCoins = coins + 1; // Give 1 coin per correct answer instead of coinsPerLevel
      setCoins(newCoins);
      setFinalScore(finalScore + 1);
      showCorrectAnswerFeedback(1, true);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const handleNext = () => {
    navigate("/games/ehe/teens");
  };

  return (
    <GameShell
      title="Mentor Story"
      score={coins}
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      gameId="ehe-teen-95"
      gameType="ehe"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/ehe/teens"
    
      nextGamePathProp="/student/ehe/teens/debate-learning-ends-college"
      nextGameIdProp="ehe-teen-96">
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                {questions[currentQuestion].text}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-6">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option)}
                    className="bg-white/5 hover:bg-white/15 backdrop-blur-sm border border-white/10 hover:border-white/30 rounded-xl md:rounded-2xl p-4 text-left transition-all duration-200 text-white hover:text-white"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3 flex-shrink-0">
                        {option.emoji}
                      </span>
                      <span className="font-medium">{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20 text-center flex-1 flex flex-col justify-center">
            {finalScore >= 3 ? (
              <div>
                <div className="text-4xl md:text-5xl mb-4">👨‍🏫</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Mentorship Expert!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand the value of mentorship in career development!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  Great job! You know that mentors accelerate learning through experience, respectful communication builds strong relationships, preparation maximizes mentorship value, mutual respect forms the foundation of mentorship, and following through on advice shows appreciation!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, mentorship is a valuable relationship that requires effort from both parties!
                </p>
                <button
                  onClick={() => {
                    setShowResult(false);
                    setCurrentQuestion(0);
                    setCoins(0);
                    setFinalScore(0);
                    resetFeedback();
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to choose the option that shows the best understanding of mentorship principles.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default MentorStory;