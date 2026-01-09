import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const QuizOnRecycling = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "sustainability-kids-2";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || questions.length;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    // First, try to get from location.state (passed from GameCategoryPage)
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    // Fallback: find next game from game data
    try {
      const games = getSustainabilityKidsGames({});
      const currentGame = games.find(g => g.id === gameId);
      if (currentGame && currentGame.index !== undefined) {
        const nextGame = games.find(g => g.index === currentGame.index + 1 && g.isSpecial && g.path);
        return {
          nextGamePath: nextGame ? nextGame.path : null,
          nextGameId: nextGame ? nextGame.id : null
        };
      }
    } catch (error) {
      console.warn("Error finding next game:", error);
    }
    
    return { nextGamePath: null, nextGameId: null };
  }, [location.state, gameId]);

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Quiz on Recycling game completed! Score: ${finalScore}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      
      // Update location state with nextGameId for GameOverModal
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, finalScore, gameId, nextGamePath, nextGameId]);

  const questions = [
    {
      id: 1,
      text: "What goes in recycling?",
      options: [
        
        { 
          id: "b", 
          text: "Banana peel", 
          emoji: "🍌", 
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Plastic bottle", 
          emoji: "🥤", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "Broken toy", 
          emoji: "🧸", 
          isCorrect: false
        }
      ]
    },
    {
      id: 2,
      text: "Which item can be recycled?",
      options: [
        { 
          id: "a", 
          text: "Glass bottle", 
          emoji: "🍾", 
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Food scraps", 
          emoji: "🍎", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Used tissue", 
          emoji: "🧻", 
          isCorrect: false
        }
      ]
    },
    {
      id: 3,
      text: "What does recycling help?",
      options: [
        
        { 
          id: "b", 
          text: "Makes more trash", 
          emoji: "�️", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Does nothing", 
          emoji: "😐", 
          isCorrect: false
        },
        { 
          id: "a", 
          text: "Saves our planet", 
          emoji: "🌍", 
          isCorrect: true
        },
      ]
    },
    {
      id: 4,
      text: "Which can be recycled?",
      options: [
        { 
          id: "a", 
          text: "Aluminum can", 
          emoji: "🥫", 
          isCorrect: true
        },
        { 
          id: "b", 
          text: "Dirty pizza box", 
          emoji: "🍕", 
          isCorrect: false
        },
        { 
          id: "c", 
          text: "Plastic bag", 
          emoji: "🛍️", 
          isCorrect: false
        }
      ]
    },
    {
      id: 5,
      text: "Why should we recycle?",
      options: [
       
        { 
          id: "b", 
          text: "To make more trash", 
          emoji: "�️", 
          isCorrect: false
        },
         { 
          id: "a", 
          text: "To protect animals", 
          emoji: "�", 
          isCorrect: true
        },
        { 
          id: "c", 
          text: "It doesn't matter", 
          emoji: "�", 
          isCorrect: false
        }
      ]
    }
  ];

  const handleAnswer = (option) => {
    if (showResult || showFeedback) return;
    
    setSelectedOption(option.id);
    resetFeedback();
    
    const newChoices = [...choices, option];
    setChoices(newChoices);
    
    let newCoins = coins;
    if (option.isCorrect) {
      newCoins += 1;
      setCoins(newCoins);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
        resetFeedback();
      } else {
        const correctCount = newChoices.filter(c => c.isCorrect).length;
        setFinalScore(correctCount);
        setCoins(newCoins); // Ensure coins state is updated
        setShowResult(true);
        if (correctCount === questions.length) {
          showAnswerConfetti();
        }
      }
    }, option.isCorrect ? 1000 : 800);
  };

  return (
    <GameShell
      title="Quiz on Recycling"
      subtitle={showResult ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      score={coins}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      maxScore={questions.length}
      showConfetti={showResult && finalScore === questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    
      nextGamePathProp="/student/sustainability/kids/reflex-recycle"
      nextGameIdProp="sustainability-kids-3">
      {flashPoints}
      {!showResult ? (
        <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
              <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
            </div>
            
            <div className="text-6xl mb-4 text-center">♻️</div>
            
            <p className="text-white text-lg md:text-xl mb-6 text-center">
              {questions[currentQuestion].text}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {questions[currentQuestion].options.map(option => {
                const isSelected = selectedOption === option.id;
                const showCorrect = showFeedback && option.isCorrect;
                const showIncorrect = showFeedback && isSelected && !option.isCorrect;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option)}
                    disabled={showFeedback}
                    className={`p-6 rounded-2xl shadow-lg transition-all transform text-center ${
                      showCorrect
                        ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                        : showIncorrect
                        ? "bg-red-500/20 border-2 border-red-400 opacity-75"
                        : isSelected
                        ? "bg-blue-600 border-2 border-blue-300 scale-105"
                        : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                    } ${showFeedback ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="text-2xl mb-2">{option.emoji}</div>
                    <h4 className="font-bold text-base mb-2">{option.text}</h4>
                  </button>
                );
              })}
            </div>
            
            {showFeedback && (
              <div className={`rounded-lg p-5 mt-6 ${
                questions[currentQuestion].options.find(opt => opt.id === selectedOption)?.isCorrect
                  ? "bg-green-500/20"
                  : "bg-red-500/20"
              }`}>
                <p className="text-white whitespace-pre-line">
                  {questions[currentQuestion].options.find(opt => opt.id === selectedOption)?.isCorrect
                    ? "Great job! That's exactly right! 🎉"
                    : "Not quite right. Try again next time!"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      ) : (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">♻️</div>
          <h3 className="text-2xl font-bold text-white">Great job!</h3>
          <p className="text-gray-300">
            You got {finalScore} out of {questions.length} questions correct!
          </p>
          <p className="text-green-400 font-semibold">
            You earned {coins} coins! Keep learning about recycling! 🌍
          </p>
        </div>
      )}
    </GameShell>
  );
};

export default QuizOnRecycling;

