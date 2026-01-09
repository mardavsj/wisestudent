import React, { useState, useMemo } from "react";
import { useLocation } from 'react-router-dom';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getAiTeenGames } from "../../../../pages/Games/GameCategories/AiForAll/teenGamesData";

const EthicsInAIQuiz = () => {
  const location = useLocation();
  
  // Get game data from game category folder (source of truth)
  const gameId = "ai-teen-82";
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
      text: "An AI system used by a school district shows bias against students from certain neighborhoods when recommending advanced classes. What ethical principle is being violated?",
      emoji: "🏫",
      options: [
       
        { 
          id: 2, 
          text: "Data efficiency", 
          emoji: "📊", 
          isCorrect: false
        },
         { 
          id: 1, 
          text: "Algorithmic fairness and equal opportunity", 
          emoji: "⚖️", 
          isCorrect: true
        },
        { 
          id: 3, 
          text: "Cost reduction", 
          emoji: "💰", 
          isCorrect: false
        }
      ],
      explanation: "Algorithmic fairness and equal opportunity! When AI systems show bias based on demographics or location, they violate fundamental principles of fairness and equal access to educational opportunities. This can perpetuate existing inequalities and limit students' futures."
    },
    {
      id: 2,
      text: "A social media AI algorithm promotes posts that generate the most engagement, even if they spread misinformation. What ethical concern does this raise?",
      emoji: "📱",
      options: [
        { 
          id: 1, 
          text: "Truth and information integrity", 
          emoji: "🔍",
          isCorrect: true
        },
        { 
          id: 2, 
          text: "User engagement metrics", 
          emoji: "📈", 
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Content diversity", 
          emoji: "🎨", 
          isCorrect: false
        }
      ],
      explanation: "Truth and information integrity! AI systems should prioritize accuracy and truth over engagement metrics. When algorithms promote misinformation, they can mislead users, contribute to societal polarization, and undermine trust in information sources."
    },
    {
      id: 3,
      text: "An AI hiring system screens out resumes with certain names or addresses. What ethical issue does this represent?",
      emoji: "💼",
      options: [
        
        { 
          id: 2, 
          text: "Efficiency in screening", 
          emoji: "⚡",
          isCorrect: false
        },
        { 
          id: 1, 
          text: "Algorithmic bias and discrimination", 
          emoji: "🚫", 
          isCorrect: true
        },
        { 
          id: 3, 
          text: "Data processing speed", 
          emoji: "⏱️", 
          isCorrect: false
        }
      ],
      explanation: "Algorithmic bias and discrimination! AI systems must not discriminate based on protected characteristics like name, address, or other demographic indicators. Such bias can perpetuate systemic inequalities and deny opportunities based on irrelevant factors."
    },
    {
      id: 4,
      text: "A healthcare AI system has different accuracy rates for different racial groups. What ethical principle is compromised?",
      emoji: "🏥",
      options: [
        
        { 
          id: 2, 
          text: "Technological advancement", 
          emoji: "🚀", 
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Cost effectiveness", 
          emoji: "💸", 
          isCorrect: false
        },
        { 
          id: 1, 
          text: "Healthcare equity and justice", 
          emoji: "⚕️", 
          isCorrect: true
        },
      ],
      explanation: "Healthcare equity and justice! AI systems in healthcare must provide equal quality of care to all patients regardless of race, gender, or other characteristics. Unequal accuracy rates can lead to misdiagnosis and health disparities."
    },
    {
      id: 5,
      text: "An AI system makes important decisions about a person's credit score but cannot explain how it reached its conclusion. What ethical AI principle is lacking?",
      emoji: "💳",
      options: [
       
        { 
          id: 2, 
          text: "Processing speed", 
          emoji: "⚡", 
          isCorrect: false
        },
        { 
          id: 3, 
          text: "Data storage efficiency", 
          emoji: "💾", 
          isCorrect: false
        },
         { 
          id: 1, 
          text: "Explainability and transparency", 
          emoji: "🔍", 
          isCorrect: true
        },
      ],
      explanation: "Explainability and transparency! People have the right to understand how AI systems make decisions that affect their lives. Explainable AI is crucial for accountability, trust, and the ability to challenge or correct unfair decisions."
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
      title="Ethics in AI Quiz"
      subtitle={levelCompleted ? "Quiz Complete!" : `Question ${currentQuestion + 1} of ${questions.length}`}
      score={finalScore}
      currentLevel={currentQuestion + 1}
      totalLevels={questions.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      gameId={gameId}
      nextGamePathProp="/student/ai-for-all/teen/human-plus-ai-story"
      nextGameIdProp="ai-teen-83"
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

export default EthicsInAIQuiz;