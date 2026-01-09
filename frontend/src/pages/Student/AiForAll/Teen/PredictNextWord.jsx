import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getAiTeenGames } from "../../../../pages/Games/GameCategories/AiForAll/teenGamesData";

const PredictNextWord = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-5";
  const gameData = getGameDataById(gameId);
  
  // Get coinsPerLevel, totalCoins, and totalXp from game category data, fallback to location.state, then defaults
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  // Find next game path and ID if not provided in location.state
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getAiTeenGames({});
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
  
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [answered, setAnswered] = useState(false);

  const questions = [
    {
      id: 1,
      text: "Complete the sentence: The sun rises in the ___",
      emoji: "🌅",
      options: [
        { 
          id: 1, 
          text: "North", 
          emoji: "⬆️",
          isCorrect: false
        },
        
        { 
          id: 2, 
          text: "West", 
          emoji: "⬅️",
          isCorrect: false
        },
        { 
          id: 3, 
          text: "East", 
          emoji: "➡️",
          isCorrect: true
        },
      ],
      explanation: "East! The sun always rises in the east due to Earth's rotation. AI language models learn these factual patterns from vast amounts of text data, allowing them to predict common phrases and factual information."
    },
    {
      id: 2,
      text: "Complete the sentence: Water boils at 100 degrees ___",
      emoji: "💧",
      options: [
        { 
          id: 1, 
          text: "Celsius", 
          emoji: "🌡️", 
          isCorrect: true
        },
        { 
          id: 2, 
          text: "Fahrenheit", 
          emoji: "🔥", 
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Kelvin", 
          emoji: "❄️",
          isCorrect: false
        }
      ],
      explanation: "Celsius! At sea level, water boils at 100°C. AI models trained on scientific texts learn these specific facts and can predict them accurately. This demonstrates how AI can understand and reproduce factual knowledge."
    },
    {
      id: 3,
      text: "Complete the sentence: The capital of France is ___",
      emoji: "🌆",
      options: [
        { 
          id: 1, 
          text: "Paris", 
          emoji: "🗼", 
          isCorrect: true
        },
        { 
          id: 2, 
          text: "London", 
          emoji: "🕰️", 
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Berlin", 
          emoji: "🧱", 
          isCorrect: false
        }
      ],
      explanation: "Paris! AI language models learn geographical facts from training data, allowing them to correctly predict country-capital relationships. This shows how AI can store and recall factual information like a vast encyclopedia."
    },
    {
      id: 4,
      text: "Complete the sentence: There are 7 days in a ___",
      emoji: "📅",
      options: [
        { 
          id: 1, 
          text: "Month", 
          emoji: "🗓️", 
          isCorrect: false
        },
        { 
          id: 2, 
          text: "Week", 
          emoji: "📆", 
          isCorrect: true
        },
        { 
          id: 3, 
          text: "Year", 
          emoji: "🗓",
          isCorrect: false
        }
      ],
      explanation: "Week! This is a fundamental time concept that AI learns from common text patterns. Language models recognize these standard measurements and can predict them because they appear frequently in training data."
    },
    {
      id: 5,
      text: "How do AI language models predict the next word?",
      emoji: "🤖",
      options: [
        { 
          id: 1, 
          text: "Human input", 
          emoji: "🧑", 
          isCorrect: false
        },
        { 
          id: 2, 
          text: "Random guessing", 
          emoji: "🎲",
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Pattern recognition", 
          emoji: "🧩",
          isCorrect: true
        },
      ],
      explanation: "Pattern recognition! AI language models analyze billions of text examples to learn common word sequences and relationships. When you type, the AI predicts what word might come next based on these learned patterns, making suggestions feel intuitive and helpful."
    }
  ];

  const handleAnswer = (optionId) => {
    if (answered || levelCompleted) return;
    
    setAnswered(true);
    setSelectedOption(optionId);
    resetFeedback();
    
    const currentQuestionData = questions[currentQuestion];
    const selectedOptionData = currentQuestionData.options.find(opt => opt.id === optionId);
    const isCorrect = selectedOptionData?.isCorrect || false;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setAnswered(false);
        resetFeedback();
      } else {
        setLevelCompleted(true);
      }
    }, isCorrect ? 1000 : 800);
  };

  const currentQuestionData = questions[currentQuestion];
  const finalScore = score;

  return (
    <GameShell
      title="Predict the Next Word"
      subtitle={levelCompleted ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/teen/self-driving-car-reflex"
      nextGameIdProp="ai-teen-6"
      gameType="ai"
      showGameOver={levelCompleted}
      maxScore={questions.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      showConfetti={levelCompleted && finalScore >= 3}
    >
      <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
        {!levelCompleted && currentQuestionData ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Question {currentQuestion + 1}/{questions.length}</span>
                <span className="text-yellow-400 font-bold">Score: {finalScore}/{questions.length}</span>
              </div>
              
              <div className="text-6xl mb-4 text-center">{currentQuestionData.emoji}</div>
              
              <div className="bg-blue-500/20 rounded-lg p-6 mb-6">
                <p className="text-white text-xl font-semibold text-center">
                  {currentQuestionData.text}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentQuestionData.options.map(option => {
                  const isSelected = selectedOption === option.id;
                  const showCorrect = answered && option.isCorrect;
                  const showIncorrect = answered && isSelected && !option.isCorrect;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      disabled={answered}
                      className={`p-6 rounded-2xl shadow-lg transition-all transform text-center ${
                        showCorrect
                          ? "bg-green-500/30 border-4 border-green-400 ring-4 ring-green-400"
                          : showIncorrect
                          ? "bg-red-500/20 border-2 border-red-400 opacity-75"
                          : isSelected
                          ? "bg-blue-600 border-2 border-blue-300 scale-105"
                          : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-2 border-white/20 hover:border-white/40 hover:scale-105"
                      } ${answered ? "cursor-not-allowed" : ""}`}
                    >
                      <div className="text-2xl mb-2">{option.emoji}</div>
                      <h4 className="font-bold text-base mb-2">{option.text}</h4>
                      <p className="text-white/90 text-sm">{option.description}</p>
                    </button>
                  );
                })}
              </div>
              
              {answered && (
                <div className={`rounded-lg p-4 mt-6 ${
                  currentQuestionData.options.find(opt => opt.id === selectedOption)?.isCorrect
                    ? "bg-green-500/20"
                    : "bg-red-500/20"
                }`}>
                  <p className="text-white text-center">
                    {currentQuestionData.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </GameShell>
  );
};

export default PredictNextWord;