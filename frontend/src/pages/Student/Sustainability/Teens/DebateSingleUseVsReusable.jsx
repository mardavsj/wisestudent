import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const DebateSingleUseVsReusable = () => {
  const location = useLocation();
  const gameData = getGameDataById("sustainability-teens-16");
  const gameId = gameData?.id || "sustainability-teens-16";
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
      console.log(`🎮 Debate: Single-Use vs Reusable game completed! Score: ${score}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
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
    text: "Should we ban single-use plastics?",
    options: [
      {
        id: "a",
        text: "Yes, completely",
        emoji: "👍"
      },
      {
        id: "b",
        text: "Gradually phase out",
        emoji: "⏳"
      },
      {
        id: "c",
        text: "No, keep them",
        emoji: "👎"
      }
    ],
    correctAnswer: "b",
    explanation: "Gradually phasing out reduces plastic waste while allowing time to adapt. Single-use plastics harm the environment."
  },
  {
    id: 2,
    text: "What's better: single-use or reusable?",
    options: [
      {
        id: "b",
        text: "Reusable items",
        emoji: "🔄"
      },
      {
        id: "a",
        text: "Single-use items",
        emoji: "🥤"
      },
      
      {
        id: "c",
        text: "Same impact",
        emoji: "⚖️"
      }
    ],
    correctAnswer: "b",
    explanation: "Reusable items reduce waste and pollution, making them better for the environment."
  },
  {
    id: 3,
    text: "How can we reduce single-use plastic?",
    options: [
      
      {
        id: "a",
        text: "Use more plastic",
        emoji: "🥤"
      },
      {
        id: "b",
        text: "Do nothing",
        emoji: "🤷"
      },
      {
        id: "c",
        text: "Use alternatives",
        emoji: "🌱"
      },
    ],
    correctAnswer: "c",
    explanation: "Using alternatives helps reduce plastic waste and encourages sustainable habits."
  },
  {
    id: 4,
    text: "What's the environmental impact of single-use plastics?",
    options: [
      {
        id: "a",
        text: "Minimal impact",
        emoji: "🍃"
      },
      {
        id: "c",
        text: "Severe impact",
        emoji: "🔥"
      },
      {
        id: "b",
        text: "Moderate impact",
        emoji: "⚠️"
      },
      
    ],
    correctAnswer: "c",
    explanation: "Single-use plastics cause severe environmental damage and are a major pollution threat."
  },
  {
    id: 5,
    text: "What's the best approach to reduce plastic waste?",
    options: [
      {
        id: "a",
        text: "Individual action",
        emoji: "👤"
      },
      {
        id: "b",
        text: "Government regulation",
        emoji: "🏛️"
      },
      {
        id: "c",
        text: "Corporate responsibility",
        emoji: "🏢"
      }
    ],
    correctAnswer: "a",
    explanation: "Individual actions matter most. When people change their habits, larger systems and governments are influenced to change too."
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
      title="Debate: Single-Use vs Reusable"
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
    
      nextGamePathProp="/student/sustainability/teens/journal-of-waste-audit"
      nextGameIdProp="sustainability-teens-17">
      <div className="space-y-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Debate: Single-Use vs Reusable</h3>
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

export default DebateSingleUseVsReusable;

