import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const FakeNewsDetector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const questions = [
    {
      id: 1,
      text: "News: 'Aliens landed today!' How can you verify this claim?",
      options: [
        { 
          id: "check", 
          text: "Check Reliable Sources", 
          emoji: "🔍", 
          isCorrect: true
        },
        { 
          id: "share", 
          text: "Share Immediately", 
          emoji: "📤", 
          isCorrect: false
        },
        { 
          id: "believe", 
          text: "Believe Headline", 
          emoji: "💭", 
          isCorrect: false
        }
      ],
      correct: "check"
    },
    {
      id: 2,
      text: "Headline: 'Chocolate cures all diseases!' What should you do?",
      options: [
        { 
          id: "buy", 
          text: "Buy Chocolate", 
          emoji: "🛒", 
          isCorrect: false
        },
        { 
          id: "research", 
          text: "Research Scientific Studies", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          id: "ignore", 
          text: "Ignore Health Info", 
          emoji: "🙈", 
          isCorrect: false
        }
      ],
      correct: "research"
    },
    {
      id: 3,
      text: "News: 'Robot wins a singing competition' How to spot fake news?",
      options: [
        { 
          id: "facts", 
          text: "Check Facts & Evidence", 
          emoji: "✅", 
          isCorrect: true
        },
        { 
          id: "click", 
          text: "Click for Views", 
          emoji: "👀", 
          isCorrect: false
        },
        { 
          id: "trust", 
          text: "Trust All Headlines", 
          emoji: "🙏", 
          isCorrect: false
        }
      ],
      correct: "facts"
    },
    {
      id: 4,
      text: "Article: 'Drinking water from TV screen boosts health' What's your approach?",
      options: [
        { 
          id: "try", 
          text: "Try the Method", 
          emoji: "🧪", 
          isCorrect: false
        },
        { 
          id: "dismiss", 
          text: "Dismiss All Articles", 
          emoji: "🗑️", 
          isCorrect: false
        },
        { 
          id: "skeptical", 
          text: "Stay Skeptical", 
          emoji: "🧐", 
          isCorrect: true
        }
      ],
      correct: "skeptical"
    },
    {
      id: 5,
      text: "Headline: 'Cats learn coding in 2 days' How to evaluate this?",
      options: [
        { 
          id: "logic", 
          text: "Apply Critical Thinking", 
          emoji: "🧠", 
          isCorrect: true
        },
        { 
          id: "excited", 
          text: "Get Excited", 
          emoji: "🤩", 
          isCorrect: false
        },
        { 
          id: "accept", 
          text: "Accept at Face Value", 
          emoji: "👍", 
          isCorrect: false
        }
      ],
      correct: "logic"
    }
  ];

  // Function to get options without rotation - keeping actual positions fixed
  const getRotatedOptions = (options, questionIndex) => {
    // Return options without any rotation to keep their actual positions fixed
    return options;
  };

  const currentQuestionData = questions[currentQuestion];
  const displayOptions = getRotatedOptions(currentQuestionData.options, currentQuestion);

  const handleChoice = (choiceId) => {
    const isCorrect = choiceId === currentQuestionData.correct;

    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, 300);
    } else {
      setShowResult(true);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    resetFeedback();
  };

  const handleNext = () => {
    navigate("/student/ai-for-all/kids/cyberbully-story"); // Next game route
  };

  const accuracy = Math.round((score / questions.length) * 100);

  return (
    <GameShell
      title="Fake News Detector"
      score={score}
      subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextGamePathProp="/student/ai-for-all/kids/cyberbully-story"
      nextGameIdProp="ai-kids-84"
      nextEnabled={showResult && accuracy >= 70}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult && accuracy >= 70}
      
      gameId="ai-kids-83"
      gameType="ai"
      totalLevels={20}
      currentLevel={83}
      showConfetti={showResult && accuracy >= 70}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/ai-for-all/kids"
    >
      <div className="space-y-8">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Points: {score}</span>
              </div>
              
              <div className="text-6xl mb-6 text-center">{currentQuestionData.options[0].emoji}{currentQuestionData.options[1].emoji}</div>
              
              <div className="bg-blue-500/20 rounded-lg p-5 mb-6">
                <p className="text-white text-lg leading-relaxed text-center font-semibold">
                  {currentQuestionData.text}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h3 className="font-bold text-xl">{option.text}</h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            {accuracy >= 70 ? (
              <div>
                <div className="text-5xl mb-4">🕵️‍♀️</div>
                <h3 className="text-2xl font-bold text-white mb-4">Smart Detective!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You detected fake news correctly {score} out of {questions.length} times! ({accuracy}%)
                  You're becoming a media literacy expert!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>+{score} Points</span>
                </div>
                <p className="text-white/80">
                  💡 Critical thinking helps you distinguish real news from fake stories!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-lg mb-4">
                  You detected fake news correctly {score} out of {questions.length} times. ({accuracy}%)
                  Keep practicing to improve your fact-checking skills!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-6 rounded-full font-bold transition-all mb-4"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-sm">
                  Think about what reliable sources would say about these claims.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default FakeNewsDetector;