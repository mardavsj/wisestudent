import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getAiTeenGames } from "../../../../pages/Games/GameCategories/AiForAll/teenGamesData";

const AIBiasRoleplayy = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-78";
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
      text: "AI is giving jobs only to boys. What should you do?",
      emoji: "⚖️",
      options: [
        { 
          id: 1, 
          text: "Let it continue", 
          emoji: "🙈",
          isCorrect: false
        },
        { 
          id: 2, 
          text: "Correct it to include everyone", 
          emoji: "🤦‍♂️",
          isCorrect: true
        },
        { 
          id: 3, 
          text: "Report only to friends", 
          emoji: "👥", 
          isCorrect: false
        }
      ],
      explanation: "Correct it to include everyone! AI systems can perpetuate biases present in their training data. When we notice unfair treatment, we have a responsibility to correct these biases to ensure equal opportunities for all. This might involve retraining the AI with diverse data or adjusting its algorithms to eliminate discriminatory patterns."
    },
    {
      id: 2,
      text: "AI only selects students from one neighborhood. How do you fix it?",
      emoji: "🏫",
      options: [
        { 
          id: 1, 
          text: "Leave it as is", 
          emoji: "🙈",
          isCorrect: false
        },
        
        { 
          id: 3, 
          text: "Only select top students", 
          emoji: "🏆", 
          isCorrect: false
        },
        { 
          id: 2, 
          text: "Ensure all neighborhoods are considered", 
          emoji: "👯‍♀️", 
          isCorrect: true
        },
      ],
      explanation: "Ensure all neighborhoods are considered! Educational opportunities should be accessible to all students regardless of their geographic location. Addressing this bias requires examining the AI's selection criteria and ensuring diverse representation from different communities to create a fair admissions process."
    },
    {
      id: 3,
      text: "AI recommends treatments mostly for men. What's the fair approach?",
      emoji: "🏥",
      options: [
        
        { 
          id: 1, 
          text: "Include all genders equally", 
          emoji: "👩‍🏫", 
          isCorrect: true
        },
        { 
          id: 2, 
          text: "Accept the bias", 
          emoji: "🙈", 
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Focus only on common conditions", 
          emoji: "📊", 
          isCorrect: false
        }
      ],
      explanation: "Include all genders equally! Healthcare AI must consider the biological and physiological differences across genders to provide appropriate treatments. Biased medical AI can lead to misdiagnoses and inadequate care for underrepresented groups, highlighting the critical importance of inclusive medical data and algorithms."
    },
    {
      id: 4,
      text: "AI denies loans to certain groups unfairly. How should you respond?",
      emoji: "💰",
      options: [
        { 
          id: 1, 
          text: "Do nothing", 
          emoji: "🙈", 
          isCorrect: false
        },
        
        { 
          id: 3, 
          text: "Replace human loan officers", 
          emoji: "🤖", 
          isCorrect: false
        },
        { 
          id: 2, 
          text: "Adjust AI to be fair to everyone", 
          emoji: "👽", 
          isCorrect: true
        },
      ],
      explanation: "Adjust AI to be fair to everyone! Financial AI systems must evaluate creditworthiness based on relevant financial factors rather than demographic characteristics. Addressing lending bias requires auditing algorithms, using fair data sources, and implementing oversight to ensure equal access to financial services regardless of background."
    },
    {
      id: 5,
      text: "Why is detecting AI bias important?",
      emoji: "🧐",
      options: [
        
        { 
          id: 1, 
          text: "Makes AI faster", 
          emoji: "⚡", 
          isCorrect: false
        },
        { 
          id: 2, 
          text: "Prevents unfair treatment", 
          emoji: "⚖️", 
          isCorrect: true
        },
        { 
          id: 3, 
          text: "Reduces electricity usage", 
          emoji: "🔌", 
          isCorrect: false
        }
      ],
      explanation: "Prevents unfair treatment! Detecting and correcting AI bias is essential for creating equitable technology that serves all members of society fairly. When AI systems treat certain groups differently based on irrelevant factors like gender, race, or location, it can perpetuate discrimination and limit opportunities for affected individuals."
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
      title="AI Bias Roleplay"
      subtitle={levelCompleted ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/teen/fake-news-detector-game"
      nextGameIdProp="ai-teen-79"
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

export default AIBiasRoleplayy;