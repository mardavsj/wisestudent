import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const QuizOnCircularEconomy2 = () => {
  const location = useLocation();
  
  const gameData = getGameDataById("sustainability-teens-27");
  const gameId = gameData?.id || "sustainability-teens-27";
  
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for QuizOnCircularEconomy2, using fallback ID");
  }
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    try {
      const games = getSustainabilityTeenGames({});
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
      console.log(`🎮 Quiz on Circular Economy game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [showResult, score, gameId, nextGamePath, nextGameId]);

  const questions = [
    {
      id: 1,
      text: "What is the circular economy?",
      options: [
        { id: "b", text: "A system that focuses on single-use products", emoji: "❌", isCorrect: false },
        { id: "a", text: "A system that keeps resources in use for as long as possible", emoji: "🔄", isCorrect: true },
        { id: "c", text: "A system that increases waste production", emoji: "🗑️", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "Which of the following is NOT part of the circular economy principles?",
      options: [
        { id: "a", text: "Reduce, Reuse, Recycle", emoji: "♻️", isCorrect: false },
        { id: "b", text: "Make products last longer", emoji: "⏱️", isCorrect: false },
        { id: "c", text: "Maximize single-use items", emoji: "🛍️", isCorrect: true }
      ]
    },
    {
      id: 3,
      text: "What is the main goal of the circular economy?",
      options: [
        { id: "a", text: "Minimize waste and maximize resource efficiency", emoji: "🎯", isCorrect: true },
        { id: "b", text: "Increase consumption", emoji: "🛒", isCorrect: false },
        { id: "c", text: "Produce more waste", emoji: "🗑️", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "Which of these is an example of circular economy in action?",
      options: [
        { id: "b", text: "Throwing away electronics after use", emoji: "❌", isCorrect: false },
        { id: "a", text: "Buying a product and returning it for repair", emoji: "🔄", isCorrect: true },
        { id: "c", text: "Buying single-use items frequently", emoji: "🛍️", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "How does the circular economy benefit the environment?",
      options: [
        { id: "a", text: "Reduces resource extraction and waste", emoji: "🌍", isCorrect: true },
        { id: "b", text: "Increases pollution", emoji: "🏭", isCorrect: false },
        { id: "c", text: "Consumes more natural resources", emoji: "🌳", isCorrect: false }
      ]
    }
  ];

  const handleChoice = (option) => {
    if (answered || showFeedback) return;
    
    setSelectedOption(option.id);
    resetFeedback();
    
    if (option.isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setAnswered(true);
    setShowFeedback(true);
    
    const isLastQuestion = currentQuestion === questions.length - 1;
    
    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setAnswered(false);
        setSelectedOption(null);
        setShowFeedback(false);
      }
    }, option.isCorrect ? 1000 : 800);
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    resetFeedback();
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Circular Economy"
      score={score}
      subtitle={!showResult ? `Question ${currentQuestion + 1} of ${questions.length}` : "Quiz Complete!"}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    
      nextGamePathProp="/student/sustainability/teens/reflex-conscious-consumer"
      nextGameIdProp="sustainability-teens-28">
      <div className="space-y-8">
        {!showResult && currentQuestionData ? (
          <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {score}/{questions.length}</span>
              </div>
              
              <div className="text-6xl mb-4 text-center">♻️</div>
              
              <p className="text-white text-lg md:text-xl mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map(option => {
                  const isSelected = selectedOption === option.id;
                  const showCorrect = showFeedback && option.isCorrect;
                  const showIncorrect = showFeedback && isSelected && !option.isCorrect;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
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
        ) : null}
      </div>
    </GameShell>
  );
};

export default QuizOnCircularEconomy2;