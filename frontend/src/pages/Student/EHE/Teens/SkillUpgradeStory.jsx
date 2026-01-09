import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SkillUpgradeStory = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ehe-teen-91";
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
      text: "A teen wants a promotion at work. Should she learn new skills to qualify?",
      options: [
        {
          id: "b",
          text: "No, she should wait for others to notice her",
          emoji: "⏳",
          correct: false
        },
        {
          id: "a",
          text: "Yes, upgrading skills increases promotion chances",
          emoji: "📈",
          correct: true
        },
        {
          id: "c",
          text: "No, skills don't matter in the workplace",
          emoji: "❌",
          correct: false
        }
      ]
    },
    {
      id: 2,
      text: "Which approach is best for identifying skills to develop?",
      options: [
        {
          id: "a",
          text: "Analyze job requirements and industry trends",
          emoji: "🔍",
          correct: true
        },
        {
          id: "b",
          text: "Copy what friends are learning",
          emoji: "👥",
          correct: false
        },
        {
          id: "c",
          text: "Learn only what's comfortable",
          emoji: "🛋️",
          correct: false
        }
      ]
    },
    {
      id: 3,
      text: "How can a teen effectively learn new skills?",
      options: [
        {
          id: "a",
          text: "Combine online courses, practice, and mentorship",
          emoji: "📚",
          correct: true
        },
        {
          id: "b",
          text: "Only read about skills without practicing",
          emoji: "📖",
          correct: false
        },
        {
          id: "c",
          text: "Avoid all learning platforms",
          emoji: "🚫",
          correct: false
        }
      ]
    },
    {
      id: 4,
      text: "What's the benefit of regularly upgrading skills?",
      options: [
        {
          id: "b",
          text: "More stress and workload",
          emoji: "😰",
          correct: false
        },
        {
          id: "c",
          text: "Less need for work-life balance",
          emoji: "⚖️",
          correct: false
        },
        {
          id: "a",
          text: "Increased job security and career opportunities",
          emoji: "🛡️",
          correct: true
        }
      ]
    },
    {
      id: 5,
      text: "How should a teen balance current job responsibilities with skill development?",
      options: [
        
        {
          id: "b",
          text: "Neglect job duties to focus only on learning",
          emoji: "📉",
          correct: false
        },
        {
          id: "a",
          text: "Dedicate specific time for learning while maintaining job performance",
          emoji: "⏰",
          correct: true
        },
        {
          id: "c",
          text: "Avoid all skill development to focus only on current work",
          emoji: "🔄",
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
      title="Skill Upgrade Story"
      score={coins}
      subtitle={showResult ? "Story Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && finalScore >= 3}
      gameId="ehe-teen-91"
      gameType="ehe"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      onNext={handleNext}
      nextEnabled={showResult}
      backPath="/games/ehe/teens"
    
      nextGamePathProp="/student/ehe/teens/quiz-career-growth"
      nextGameIdProp="ehe-teen-92">
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
                <div className="text-4xl md:text-5xl mb-4">📚</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Skill Development Expert!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand the importance of continuous skill development!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  Great job! You know that upgrading skills increases promotion chances, analyzing job requirements helps identify relevant skills, combining multiple learning approaches is effective, regular skill upgrades increase job security, and dedicating specific time balances work and learning!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  Remember, continuous skill development is key to career success!
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
                  Try to choose the option that shows the best understanding of skill development principles.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SkillUpgradeStory;