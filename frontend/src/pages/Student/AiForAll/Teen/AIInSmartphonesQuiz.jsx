import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getAiTeenGames } from "../../../../pages/Games/GameCategories/AiForAll/teenGamesData";

const AIInSmartphonesQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-13";
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
      text: "Does facial recognition unlock use AI?",
      emoji: "📱",
      options: [
        { 
          id: 1, 
          text: "Yes", 
          emoji: "👍", 
          isCorrect: true
        },
        { 
          id: 2, 
          text: "No", 
          emoji: "👎", 
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Only on iPhones", 
          emoji: "🍎", 
          isCorrect: false
        }
      ],
      explanation: "Yes! Face unlock uses AI and biometric technology to recognize your unique facial features. It's computer vision AI working in real-time!"
    },
    {
      id: 2,
      text: "Does predictive text use AI?",
      emoji: "💬",
      options: [
         { 
          id: 1, 
          text: "Only with internet", 
          emoji: "🌐",
          isCorrect: false
        },
        { 
          id: 2, 
          text: "No", 
          emoji: "👎", 
          isCorrect: false
        },
       
        { 
          id: 3, 
          text: "Yes", 
          emoji: "👍", 
          isCorrect: true
        },
      ],
      explanation: "Predictive text uses AI to analyze your typing patterns, vocabulary, and context to suggest the next word. It learns from your usage to provide more accurate suggestions over time."
    },
    {
      id: 3,
      text: "Does voice assistant use AI?",
      emoji: "🗣️",
      options: [
        { 
          id: 1, 
          text: "Yes", 
          emoji: "🔊",
          isCorrect: true
        },
        { 
          id: 2, 
          text: "No", 
          emoji: "🔇",
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Only when connected", 
          emoji: "📶",
          isCorrect: false
        }
      ],
      explanation: "Voice assistants like Siri, Google Assistant, and Alexa use AI technologies including natural language processing (NLP) and machine learning to understand voice commands and provide relevant responses."
    },
    {
      id: 4,
      text: "Does photo tagging use AI?",
      emoji: "📸",
      options: [
        { 
          id: 1, 
          text: "Yes", 
          emoji: "🏷️", 
          isCorrect: true
        },
        { 
          id: 2, 
          text: "No", 
          emoji: "👎", 
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Only on social media", 
          emoji: "📱", 
          isCorrect: false
        }
      ],
      explanation: "Photo tagging uses computer vision AI to recognize faces, objects, and scenes in images. This technology can identify people you know, pets, landmarks, and even categorize photos automatically."
    },
    {
      id: 5,
      text: "Does adaptive brightness use AI?",
      emoji: "🔆",
      options: [
        { 
          id: 1, 
          text: "No", 
          emoji: "👎",
          isCorrect: false
        },
        { 
          id: 2, 
          text: "Yes", 
          emoji: "🧠", 
          isCorrect: true
        },
        { 
          id: 3, 
          text: "Only on Android", 
          emoji: "🤖", 
          isCorrect: false
        }
      ],
      explanation: "Adaptive brightness uses AI to learn your preferences and environmental lighting conditions. It adjusts screen brightness based on sensor data and your past behavior to optimize battery life and viewing comfort."
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
      title="AI in Smartphones Quiz"
      subtitle={levelCompleted ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/teen/prediction-story"
      nextGameIdProp="ai-teen-14"
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
              
              <p className="text-white text-lg md:text-xl mb-6 text-center">
                {currentQuestionData.text}
              </p>
              
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

export default AIInSmartphonesQuiz;