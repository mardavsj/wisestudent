import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const DebateIndividualVsSystemicChange = () => {
  const location = useLocation();
  const gameData = getGameDataById("sustainability-teens-71");
  const gameId = gameData?.id || "sustainability-teens-71";
  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;
  const [coins, setCoins] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

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
    if (gameFinished) {
      console.log(`🎮 Debate: Individual vs Systemic Change game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [gameFinished, score, gameId, nextGamePath, nextGameId]);

  const questions = [
    {
      id: 1,
      text: "Who has the most power to address climate change?",
      options: [
        {
          id: "a",
          text: "Individuals only",
          emoji: "👤"
        },
        {
          id: "b",
          text: "Governments and corporations",
          emoji: "🏛️"
        },
        {
          id: "c",
          text: "Both equally",
          emoji: "🤝"
        }
      ],
      correctAnswer: "b",
      explanation: "Governments and corporations have the most power. They can implement large-scale changes, regulations, and policies. Individual actions matter but systemic change is more impactful."
    },
    {
      id: 2,
      text: "What's the most effective climate action?",
      options: [
        {
          id: "b",
          text: "Voting for climate policies",
          emoji: "🗳️"
        },
        {
          id: "a",
          text: "Buying eco products",
          emoji: "🛍️"
        },
        
        {
          id: "c",
          text: "Changing personal habits",
          emoji: "🔄"
        }
      ],
      correctAnswer: "b",
      explanation: "Voting for climate policies. Political engagement can create large-scale systemic change that affects millions of people and industries."
    },
    {
      id: 3,
      text: "Why is systemic change important?",
      options: [
        {
          id: "a",
          text: "It's trendy",
          emoji: "✨"
        },
        {
          id: "b",
          text: "It creates lasting impact",
          emoji: "⏰"
        },
        {
          id: "c",
          text: "It's easier",
          emoji: "😊"
        }
      ],
      correctAnswer: "b",
      explanation: "It creates lasting impact. Systemic changes like laws, regulations, and infrastructure improvements have long-term effects that benefit everyone."
    },
    {
      id: 4,
      text: "What's the role of individual action?",
      options: [
        {
          id: "a",
          text: "Most important",
          emoji: "👑"
        },
        {
          id: "b",
          text: "Not important",
          emoji: "❌"
        },
        {
          id: "c",
          text: "Supports systemic change",
          emoji: "💪"
        }
      ],
      correctAnswer: "c",
      explanation: "Supports systemic change. Individual actions raise awareness and create demand for larger changes, but they're not enough alone."
    },
    {
      id: 5,
      text: "How should we balance individual and systemic action?",
      options: [
        {
          id: "a",
          text: "Focus only on individuals",
          emoji: "👤"
        },
        {
          id: "b",
          text: "Focus on both together",
          emoji: "🤝"
        },
        {
          id: "c",
          text: "Focus on systemic change",
          emoji: "🏛️"
        }
      ],
      correctAnswer: "b",
      explanation: "Focus on both together. Individual actions are important but must be combined with systemic changes for maximum impact."
    }
  ];

  const handleOptionSelect = (optionId) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = optionId === currentQuestion.correctAnswer;
    
    setSelectedOption(optionId);
    setShowFeedback(true);
    
    if (isCorrect) {
      setCoins(prev => prev + 1);
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
    
    // Move to next question after delay
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOption(null);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  const currentQuestionData = questions[currentQuestionIndex];

  return (
    <GameShell
      title="Debate: Individual vs Systemic Change"
      score={score}
      subtitle={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={gameFinished}
      gameId={gameId}
      gameType="sustainability"
      totalLevels={questions.length}
      currentLevel={currentQuestionIndex + 1}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      maxScore={questions.length}
      showConfetti={gameFinished && score >= 3}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/sustainability/teens"
    
      nextGamePathProp="/student/sustainability/teens/journal-of-climate-action"
      nextGameIdProp="sustainability-teens-72">
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Debate: Individual vs Systemic Change</h3>
              <p className="text-white/90 text-lg">{currentQuestionData.text}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentQuestionData.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => !showFeedback && handleOptionSelect(option.id)}
                  disabled={showFeedback}
                  className={`bg-white/10 p-4 rounded-xl border-2 transition-all transform hover:scale-105 flex flex-col items-center gap-3 group ${selectedOption === option.id ? (showFeedback ? (option.id === currentQuestionData.correctAnswer ? 'border-green-400 bg-green-400/20' : 'border-red-400 bg-red-400/20') : 'border-yellow-400 bg-yellow-400/20') : 'border-white/20 hover:bg-white/20'} ${showFeedback && option.id === currentQuestionData.correctAnswer ? 'border-green-400 bg-green-400/20' : ''}`}
                >
                  <div className="text-5xl transition-transform">
                    {option.emoji}
                  </div>
                  <div className="text-white font-bold text-lg text-center">
                    {option.text}
                  </div>
                  {showFeedback && selectedOption === option.id && option.id !== currentQuestionData.correctAnswer && (
                    <div className="text-red-400 font-bold">Incorrect</div>
                  )}
                  {showFeedback && option.id === currentQuestionData.correctAnswer && (
                    <div className="text-green-400 font-bold">Correct!</div>
                  )}
                </button>
              ))}
            </div>
            
            {showFeedback && (
              <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
                <p className="text-white/90 text-center">{currentQuestionData.explanation}</p>
              </div>
            )}
          </div>
        </div>
    </GameShell>
  );
};

export default DebateIndividualVsSystemicChange;