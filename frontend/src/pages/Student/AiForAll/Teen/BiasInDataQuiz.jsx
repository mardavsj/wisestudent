import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getAiTeenGames } from "../../../../pages/Games/GameCategories/AiForAll/teenGamesData";

const BiasInDataQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-62";
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
      text: "If AI is only trained on city photos, will it work well in villages?",
      emoji: "🏙️",
      options: [
        { 
          id: 1, 
          text: "Yes", 
          emoji: "👍", 
          isCorrect: false
        },
        { 
          id: 2, 
          text: "No", 
          emoji: "👎", 
          isCorrect: true
        },
        { 
          id: 3, 
          text: "Only for object detection", 
          emoji: "🔍", 
          isCorrect: false
        }
      ],
      explanation: "No! AI needs diverse data from both cities and villages to work fairly everywhere. Without rural training data, the AI might misclassify village scenes, crops, or rural infrastructure."
    },
    {
      id: 2,
      text: "If a voice AI is trained only on male voices, can it understand female voices well?",
      emoji: "🎙️👩",
      options: [
        { 
          id: 1, 
          text: "Yes", 
          emoji: "✔️", 
          isCorrect: false
        },
        { 
          id: 2, 
          text: "No", 
          emoji: "❌", 
          isCorrect: true
        },
        { 
          id: 3, 
          text: "Only with high pitch settings", 
          emoji: "📈",
          isCorrect: false
        }
      ],
      explanation: "No! Voice AI becomes biased if it's not trained on diverse voices including different genders, ages, accents, and speaking styles. This can lead to higher error rates for underrepresented groups."
    },
    {
      id: 3,
      text: "An AI trained mostly on English text may struggle with Hindi. True or False?",
      emoji: "🎃",
      options: [
        { 
          id: 1, 
          text: "True", 
          emoji: "❓",
          isCorrect: true
        },
        { 
          id: 2, 
          text: "False", 
          emoji: "❓",
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Only for complex sentences", 
          emoji: "📝", 
          isCorrect: false
        }
      ],
      explanation: "True! AI trained predominantly on one language often struggles with others due to different grammatical structures, vocabularies, and cultural contexts. Multilingual training is essential for global AI applications."
    },
    {
      id: 4,
      text: "If an AI sees more light-skinned faces, will it perform equally on dark-skinned faces?",
      emoji: "👩🏽‍🦱👨🏻‍🦰",
      options: [
        { 
          id: 1, 
          text: "Yes", 
          emoji: "👍",
          isCorrect: false
        },
        { 
          id: 2, 
          text: "No", 
          emoji: "👎", 
          isCorrect: true
        },
        { 
          id: 3, 
          text: "Only in poor lighting", 
          emoji: "💡", 
          isCorrect: false
        }
      ],
      explanation: "No! Facial recognition AI trained primarily on lighter skin tones often performs poorly on darker skin due to insufficient representation in training data. This has led to significant real-world discrimination issues."
    },
    {
      id: 5,
      text: "How can we make AI fairer?",
      emoji: "⚖️🤖",
      options: [
        { 
          id: 1, 
          text: "Use diverse data", 
          emoji: "🌍", 
          isCorrect: true
        },
        { 
          id: 2, 
          text: "Use only rich-country data", 
          emoji: "💰", 
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Increase processing speed", 
          emoji: "⚡", 
          isCorrect: false
        }
      ],
      explanation: "Use diverse data! Including varied demographics, cultures, languages, and contexts in training datasets helps reduce bias and improves AI fairness and accuracy across different populations."
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
      title="Bias in Data Quiz"
      subtitle={levelCompleted ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/teen/robot-confusion-storyy"
      nextGameIdProp="ai-teen-63"
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

export default BiasInDataQuiz;