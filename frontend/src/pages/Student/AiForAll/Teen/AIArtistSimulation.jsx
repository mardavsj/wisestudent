import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";

const AIArtistSimulation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get coinsPerLevel, totalCoins, and totalXp from navigation state (from game card) or use default
  const coinsPerLevel = location.state?.coinsPerLevel || 5; // Default 5 coins per question (for backward compatibility)
  const totalCoins = location.state?.totalCoins || 5; // Total coins from game card
  const totalXp = location.state?.totalXp || 10; // Total XP from game card
  
  const { showCorrectAnswerFeedback, flashPoints, showAnswerConfetti } = useGameFeedback();
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const questions = [
    {
      id: 1,
      text: "What is the primary function of generative AI in art creation?",
      options: [
        { 
          id: "copy", 
          text: "Copy existing artworks", 
          emoji: "🖼️", 
          
          isCorrect: false
        },
        { 
          id: "create", 
          text: "Create new artistic content", 
          emoji: "✨", 
          
          isCorrect: true
        },
        { 
          id: "analyze", 
          text: "Analyze art styles", 
          emoji: "🔍", 
          
          isCorrect: false
        },
        { 
          id: "sell", 
          text: "Sell digital art", 
          emoji: "💰", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which technology enables AI to understand text prompts for image generation?",
      options: [
        { 
          id: "nlp", 
          text: "Natural Language Processing", 
          emoji: "🔤", 
          isCorrect: true
        },
        { 
          id: "cv", 
          text: "Computer Vision", 
          emoji: "👁️", 
          isCorrect: false
        },
        { 
          id: "ml", 
          text: "Machine Learning", 
          emoji: "🤖", 
          isCorrect: false
        },
        { 
          id: "dl", 
          text: "Deep Learning", 
          emoji: "🧠", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What is a key ethical consideration when using AI-generated art?",
      options: [
        { 
          id: "quality", 
          text: "Image quality", 
          emoji: "📷", 
          isCorrect: false
        },
        { 
          id: "attribution", 
          text: "Proper attribution and ownership", 
          emoji: "📝", 
          isCorrect: true
        },
        { 
          id: "speed", 
          text: "Generation speed", 
          emoji: "⏱️", 
          isCorrect: false
        },
        { 
          id: "cost", 
          text: "Computational cost", 
          emoji: "💸", 
          isCorrect: false
        }
      ]
    },
    {
      id: 4,
      text: "How do AI art generators typically learn to create images?",
      options: [
        { 
          id: "examples", 
          text: "Training on vast image datasets", 
          emoji: "📚", 
          isCorrect: true
        },
        { 
          id: "programming", 
          text: "Explicit programming rules", 
          emoji: "⌨️", 
          isCorrect: false
        },
        { 
          id: "internet", 
          text: "Browsing the internet", 
          emoji: "🌐", 
          isCorrect: false
        },
        { 
          id: "humans", 
          text: "Direct human instruction", 
          emoji: "👩‍🏫", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "What is a limitation of current AI art generation systems?",
      options: [
        { 
          id: "creativity", 
          text: "Lack of true creativity", 
          emoji: "🤔", 
          isCorrect: true
        },
        { 
          id: "interface", 
          text: "Complex user interfaces", 
          emoji: "🖥️", 
          isCorrect: false
        },
        { 
          id: "hardware", 
          text: "Hardware requirements", 
          emoji: "💻", 
          isCorrect: false
        },
        { 
          id: "cost", 
          text: "High subscription fees", 
          emoji: "💳", 
          isCorrect: false
        }
      ]
    }
  ];

  const handleChoice = (selectedChoice) => {
    const newChoices = [...choices, { 
      questionId: questions[currentQuestion].id, 
      choice: selectedChoice,
      isCorrect: questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect
    }];
    
    setChoices(newChoices);
    
    // If the choice is correct, add coins and show flash/confetti
    const isCorrect = questions[currentQuestion].options.find(opt => opt.id === selectedChoice)?.isCorrect;
    if (isCorrect) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, isCorrect ? 1000 : 800);
    } else {
      // Calculate final score
      const correctAnswers = newChoices.filter(choice => choice.isCorrect).length;
      setFinalScore(correctAnswers);
      setTimeout(() => {
        setShowResult(true);
      }, isCorrect ? 1000 : 800);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setChoices([]);
    setCoins(0);
    setFinalScore(0);
  };

  const getCurrentQuestion = () => questions[currentQuestion];

  const handleNext = () => {
    navigate("/student/ai-for-all/teen/online-safety-quiz");
  };

  return (
    <GameShell
      title="AI Artist Simulation"
      subtitle={showResult ? "Simulation Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      onNext={handleNext}
      nextEnabled={showResult}
      nextGamePathProp="/student/ai-for-all/teen/online-safety-quiz"
      nextGameIdProp="ai-teen-42"
      showGameOver={showResult && finalScore >= 3}
      score={coins}
      gameId="ai-teen-41"
      gameType="ai"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      showConfetti={showResult && finalScore >= 3}
      backPath="/games/ai-for-all/teens"
      maxScore={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}>
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
                <span className="text-white/80 text-sm md:text-base">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold text-sm md:text-base">Coins: {coins}</span>
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-4 md:mb-6 text-center">Understanding AI Art Generation</h3>
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-6">
                <p className="text-base md:text-lg lg:text-xl font-semibold text-white text-center">"{getCurrentQuestion().text}"</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {getCurrentQuestion().options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleChoice(option.id)}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg transition-all transform hover:scale-105 text-left"
                  >
                    <div className="flex items-start">
                      <div className="text-2xl md:text-3xl mr-3">{option.emoji}</div>
                      <div>
                        <h5 className="font-bold text-white text-sm md:text-base mb-1">{option.text}</h5>
                        <p className="text-white/80 text-xs md:text-sm">{option.description}</p>
                      </div>
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
                <div className="text-4xl md:text-5xl mb-4">🎉</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Excellent!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct!
                  You understand how AI generates art!
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-full inline-flex items-center gap-2 mb-4 text-sm md:text-base">
                  <span>+{coins} Coins</span>
                </div>
                <p className="text-white/80 text-sm md:text-base">
                  💡 Generative AI can create images, art, and content from text prompts. 
                  These systems learn from vast datasets to bring creative ideas to life!
                </p>
              </div>
            ) : (
              <div>
                <div className="text-4xl md:text-5xl mb-4">😔</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Keep Learning!</h3>
                <p className="text-white/90 text-base md:text-lg mb-4">
                  You got {finalScore} out of {questions.length} questions correct.
                  AI art generators use machine learning to create images from text descriptions!
                </p>
                <button
                  onClick={handleTryAgain}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-full font-bold transition-all mb-4 text-sm md:text-base"
                >
                  Try Again
                </button>
                <p className="text-white/80 text-xs md:text-sm">
                  Try to focus on how AI uses natural language processing to understand prompts and generate art.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default AIArtistSimulation;