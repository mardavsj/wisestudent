import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const ReflexEthicalBuyer = () => {
  const location = useLocation();
  
  const gameData = getGameDataById("sustainability-teens-34");
  const gameId = gameData?.id || "sustainability-teens-34";
  
  if (!gameData || !gameData.id) {
    console.warn("Game data not found for ReflexEthicalBuyer, using fallback ID");
  }
  
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 1;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  
  const [currentRound, setCurrentRound] = useState(1);
  const [gameState, setGameState] = useState('ready'); // ready, playing, finished
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);
  const currentRoundRef = useRef(1);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const { nextGamePath, nextGameId } = (() => {
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
  })();

  useEffect(() => {
    if (gameState === "finished") {
      console.log(`🎮 Reflex Ethical Buyer game completed! Score: ${score}/5, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [gameState, score, gameId, nextGamePath, nextGameId]);

  const questions = [
    {
      id: 1,
      text: "Which buying choice is most ethical?",
      options: [
        { id: 'b', text: " Products made in sweatshops", emoji: "⚠️", isCorrect: false },
        { id: 'a', text: " Fair Trade Certified products", emoji: "⚖️", isCorrect: true },
        { id: 'c', text: " Items with no ethical certifications", emoji: "❓", isCorrect: false },
        { id: 'd', text: " Products from unknown sources", emoji: "🔒", isCorrect: false }
      ]
    },
    {
      id: 2,
      text: "What's the best ethical shopping practice?",
      options: [
        { id: 'b', text: " Purchasing from brands with poor labor practices", emoji: "⚠️", isCorrect: false },
        { id: 'c', text: " Choosing products with misleading labels", emoji: "❌", isCorrect: false },
        { id: 'd', text: " Supporting companies with no sustainability reports", emoji: "📊", isCorrect: false },
        { id: 'a', text: " Buying from companies with transparent supply chains", emoji: "🔍", isCorrect: true },
      ]
    },
    {
      id: 3,
      text: "Which consumer decision supports ethical values?",
      options: [
        { id: 'b', text: " Items with unclear labor practices", emoji: "❓", isCorrect: false },
        { id: 'a', text: " Locally made products", emoji: "🏪", isCorrect: true },
        { id: 'c', text: " Products from exploitative factories", emoji: "🏭", isCorrect: false },
        { id: 'd', text: " Goods with hidden environmental costs", emoji: "🌍", isCorrect: false }
      ]
    },
    {
      id: 4,
      text: "What's the most responsible purchasing choice?",
      options: [
        { id: 'a', text: " Organic and ethically sourced items", emoji: "🌱", isCorrect: true },
        { id: 'b', text: " Products with unverified claims", emoji: "⚠️", isCorrect: false },
        { id: 'c', text: " Items from unethical sources", emoji: "❌", isCorrect: false },
        { id: 'd', text: " Goods with hidden environmental damage", emoji: "🔥", isCorrect: false }
      ]
    },
    {
      id: 5,
      text: "Which buying behavior reflects ethical values?",
      options: [
        { id: 'b', text: " Purchasing from exploitative brands", emoji: "💸", isCorrect: false },
        { id: 'c', text: " Choosing unverified sustainable products", emoji: "🔍", isCorrect: false },
        { id: 'a', text: " Supporting certified B-Corp companies", emoji: "🏢", isCorrect: true },
        { id: 'd', text: " Buying from companies with poor track records", emoji: "⚠️", isCorrect: false }
      ]
    }
  ];

  // Update ref when currentRound changes
  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  // Reset timer when round changes
  useEffect(() => {
    if (gameState === "playing" && currentRound > 0 && currentRound <= 5) {
      setTimeLeft(10);
      setAnswered(false);
    }
  }, [currentRound, gameState]);

  // Handle time up - move to next question or show results
  const handleTimeUp = useCallback(() => {
    setAnswered(true);
    resetFeedback();

    const isLastQuestion = currentRoundRef.current >= 5;

    setTimeout(() => {
      if (isLastQuestion) {
        setGameState("finished");
      } else {
        setCurrentRound((prev) => prev + 1);
      }
    }, 1000);
  }, []);

  // Timer effect - countdown from 10 seconds for each question
  useEffect(() => {
    if (gameState !== "playing") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Check if game should be finished
    if (currentRoundRef.current > 5) {
      setGameState("finished");
      return;
    }

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Start countdown timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          // Time's up for this round
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          handleTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState, handleTimeUp, currentRound]);

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(10);
    setScore(0);
    setCurrentRound(1);
    resetFeedback();
  };

  const handleAnswer = (option) => {
    if (gameState !== "playing" || answered || currentRound > 5) return;

    // Clear the timer immediately when user answers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setAnswered(true);
    resetFeedback();

    if (option.isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    // Move to next round or show results after a short delay
    setTimeout(() => {
      if (currentRound >= 5) {
        setGameState("finished");
      } else {
        setCurrentRound((prev) => prev + 1);
        setAnswered(false); // Reset answered state for next round
      }
    }, 500);
  };

  const currentQuestion = questions[currentRound - 1];

  return (
    <GameShell
      title="Reflex Ethical Buyer"
      subtitle={gameState === "playing" ? `Round ${currentRound} of 5` : gameState === "finished" ? "Game Complete!" : "Act fast!"}
      currentLevel={currentRound}
      coinsPerLevel={coinsPerLevel}
      showGameOver={gameState === "finished"}
      score={score}
      gameId={gameId}
      gameType="sustainability"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      totalLevels={5}
      maxScore={5}
      showConfetti={gameState === "finished" && score >= 3}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    
      nextGamePathProp="/student/sustainability/teens/badge-conscious-consumer"
      nextGameIdProp="sustainability-teens-35">
      <div className="space-y-8">
        {gameState === "ready" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Get Ready!</h3>
            <p className="text-white/80 mb-6 text-lg">Choose the ethical buying action quickly! You have 10 seconds per round</p>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
            <p className="text-white/60 mt-4">You'll have 10 seconds per round</p>
          </div>
        )}

        {gameState === "playing" && currentQuestion && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-white">
                <span className="font-bold">Round:</span> {currentRound}/5
              </div>
              <div className={`font-bold ${timeLeft <= 2 ? 'text-red-500' : timeLeft <= 3 ? 'text-yellow-500' : 'text-green-400'}`}>
                <span className="text-white">Time:</span> {timeLeft}s
              </div>
              <div className="text-white">
                <span className="font-bold">Score:</span> {score}/5
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
                {currentQuestion.text}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={answered}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="text-4xl mb-3">{option.emoji}</div>
                    <h3 className="font-bold text-xl">{option.text}</h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexEthicalBuyer;