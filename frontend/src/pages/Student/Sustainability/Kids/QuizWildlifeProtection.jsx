import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const QuizWildlifeProtection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const gameId = "sustainability-kids-22";
  const gameData = getGameDataById(gameId);
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
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

  useEffect(() => {
    if (showResult) {
      console.log(`🎮 Quiz on Wildlife Protection game completed! Score: ${finalScore}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
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
      text: "What helps protect animals?",
      options: [
        { id: "a", text: "Protecting habitats", emoji: "🌳", isCorrect: true },
        { id: "b", text: "Littering", emoji: "🗑️", isCorrect: false },
        { id: "c", text: "Cutting trees", emoji: "🪓", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "How can you help wildlife?",
      options: [
        { id: "b", text: "Chase animals", emoji: "🏃", isCorrect: false },
        { id: "a", text: "Feed animals properly", emoji: "🍎", isCorrect: true },
        { id: "c", text: "Leave trash in nature", emoji: "🗑️", isCorrect: false }
      ]
    },
    {
      id: 3,
      text: "What protects animal homes?",
      options: [
        { id: "a", text: "Planting trees", emoji: "🌲", isCorrect: true },
        { id: "b", text: "Cutting forests", emoji: "🪓", isCorrect: false },
        { id: "c", text: "Polluting water", emoji: "💧", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "Which animal needs protection?",
      options: [
        { id: "a", text: "Endangered pandas", emoji: "🐼", isCorrect: false },
        { id: "b", text: "Threatened elephants", emoji: "🐘", isCorrect: true },
        { id: "c", text: "Common pigeons", emoji: "🐦", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "What's a wildlife-friendly action?",
      options: [
        { id: "a", text: "Use harmful pesticides", emoji: "🧪", isCorrect: false },
        { id: "b", text: "Create bird feeders", emoji: "🦆", isCorrect: false },
        { id: "c", text: "Build animal shelters", emoji: "🏠", isCorrect: true }
      ]
    }
  ];

  const handleAnswer = (option) => {
    if (showResult || showFeedback) return;
    
    setSelectedOption(option.id);
    resetFeedback();
    
    const newChoices = [...choices, option];
    setChoices(newChoices);
    
    if (option.isCorrect) {
      setCoins(prev => prev + 1);
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
        setFinalScore(newChoices.filter(c => c.isCorrect).length);
        setShowResult(true);
        if (newChoices.filter(c => c.isCorrect).length === questions.length) {
          showAnswerConfetti();
        }
      }
    }, option.isCorrect ? 1000 : 800);
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <GameShell
      title="Quiz on Wildlife Protection"
      score={coins}
      subtitle={showResult ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={questions.length}
      currentLevel={currentQuestion + 1}
      maxScore={questions.length}
      showConfetti={showResult && finalScore >= 2}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    
      nextGamePathProp="/student/sustainability/kids/reflex-clean-air"
      nextGameIdProp="sustainability-kids-23">
      <div className="space-y-8">
        {!showResult && currentQuestionData && (
          <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                  <span className="text-yellow-400 font-bold">Score: {coins}/{questions.length}</span>
                </div>
                
                <div className="text-6xl mb-4 text-center">🐾</div>
                
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
        )}
      </div>
    </GameShell>
  );
};

export default QuizWildlifeProtection;

