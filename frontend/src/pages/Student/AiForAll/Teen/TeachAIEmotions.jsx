import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getAiTeenGames } from "../../../../pages/Games/GameCategories/AiForAll/teenGamesData";

const TeachAIEmotions = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-71";
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
      text: "What emotion does this emoji represent?",
      emoji: "😀",
      options: [
        { 
          id: 1, 
          text: "Happy", 
          emoji: "😊", 
          isCorrect: true
        },
        { 
          id: 2, 
          text: "Sad", 
          emoji: "😢", 
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Angry", 
          emoji: "😠", 
          isCorrect: false
        }
      ],
      explanation: "Happy! This emoji shows a big grin, which represents joy and happiness. Teaching AI to recognize facial expressions helps create more empathetic virtual assistants and improves human-computer interaction."
    },
    {
      id: 2,
      text: "What emotion does this emoji represent?",
      emoji: "😢",
      options: [
        { 
          id: 1, 
          text: "Happy", 
          emoji: "😄", 
          isCorrect: false
        },
        { 
          id: 2, 
          text: "Sad", 
          emoji: "😔", 
          isCorrect: true
        },
        { 
          id: 3, 
          text: "Surprised", 
          emoji: "😲", 
          isCorrect: false
        }
      ],
      explanation: "Sad. This emoji shows tears, which represent sadness or crying. AI emotion recognition can help mental health applications detect when someone might need support or intervention."
    },
    {
      id: 3,
      text: "What emotion does this emoji represent?",
      emoji: "😠",
      options: [
        { 
          id: 1, 
          text: "Happy", 
          emoji: "😃", 
          isCorrect: false
        },
        { 
          id: 2, 
          text: "Sad", 
          emoji: "😞",
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Angry", 
          emoji: "😡", 
          isCorrect: true
        }
      ],
      explanation: "Angry. This emoji shows a scowl with furrowed brows, representing anger or frustration. AI systems that can detect anger can help de-escalate situations in customer service or provide appropriate responses."
    },
    {
      id: 4,
      text: "What emotion does this emoji represent?",
      emoji: "😲",
      options: [
        { 
          id: 1, 
          text: "Bored", 
          emoji: "😑", 
          isCorrect: false
        },
        { 
          id: 2, 
          text: "Surprised", 
          emoji: "😮", 
          isCorrect: true
        },
        { 
          id: 3, 
          text: "Disgusted", 
          emoji: "🤢", 
          isCorrect: false
        }
      ],
      explanation: "Surprised. This emoji shows wide eyes and an open mouth, representing shock or amazement. AI that recognizes surprise can adjust its responses to provide more information when users seem confused."
    },
    {
      id: 5,
      text: "Why is teaching emotions to AI important?",
      emoji: "🤖",
      options: [
        { 
          id: 1, 
          text: "Makes AI more human-like", 
          emoji: "🤝", 
          isCorrect: false
        },
        { 
          id: 2, 
          text: "Helps AI respond appropriately", 
          emoji: "💬", 
          isCorrect: true
        },
        { 
          id: 3, 
          text: "Makes AI faster", 
          emoji: "⚡", 
          isCorrect: false
        }
      ],
      explanation: "Helps AI respond appropriately! Emotional intelligence allows AI to tailor its responses based on the user's emotional state. This creates more natural, helpful interactions in virtual assistants, therapy bots, and educational tools."
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
      title="Teach AI Emotions"
      subtitle={levelCompleted ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/teen/training-feedback-story"
      nextGameIdProp="ai-teen-72"
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

export default TeachAIEmotions;