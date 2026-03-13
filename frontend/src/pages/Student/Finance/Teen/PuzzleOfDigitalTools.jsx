import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getFinanceTeenGames } from "../../../../pages/Games/GameCategories/Finance/teenGamesData";

const PuzzleOfDigitalTools = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("gamecontent");

  const gameId = "finance-teens-44";
  const gameContent = t("financial-literacy.teens.puzzle-of-digital-tools", { returnObjects: true });
  
  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getFinanceTeenGames({});
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
  }, [location.state]);

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  // Digital tools (left side) - 5 items from translation
  const tools = Array.isArray(gameContent?.tools) ? gameContent.tools : [];

  // Digital functions (right side) - 5 items from translation
  const functions = Array.isArray(gameContent?.functions) ? gameContent.functions : [];

  // Manually rearrange positions to prevent positional matching
  const rearrangedFunctions = useMemo(() => {
    if (functions.length < 5) return functions;
    return [
      functions[2], // Security Code (id: 8)
      functions[4], // Card Protection (id: 10)
      functions[1], // Bank Spending (id: 7)
      functions[0], // Instant Transfer (id: 6)
      functions[3]  // Scan & Pay (id: 9)
    ];
  }, [functions]);

  // Correct matches using proper IDs, not positional order
  const correctMatches = [
    { toolId: 1, functionId: 6 }, // UPI → Instant Transfer
    { toolId: 2, functionId: 7 }, // Debit Card → Bank Spending
    { toolId: 3, functionId: 8 }, // OTP → Security Code
    { toolId: 4, functionId: 9 }, // QR Code → Scan & Pay
    { toolId: 5, functionId: 10 } // CVV → Card Protection
  ];

  const handleToolSelect = (tool) => {
    if (gameFinished) return;
    setSelectedTool(tool);
  };

  const handleFunctionSelect = (func) => {
    if (gameFinished) return;
    setSelectedFunction(func);
  };

  const handleMatch = () => {
    if (!selectedTool || !selectedFunction || gameFinished) return;

    resetFeedback();

    const newMatch = {
      toolId: selectedTool.id,
      functionId: selectedFunction.id,
      isCorrect: correctMatches.some(
        match => match.toolId === selectedTool.id && match.functionId === selectedFunction.id
      )
    };

    const newMatches = [...matches, newMatch];
    setMatches(newMatches);

    // If the match is correct, add score and show flash/confetti
    if (newMatch.isCorrect) {
      setScore(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }

    // Check if all items are matched
    if (newMatches.length === tools.length) {
      setTimeout(() => {
        setGameFinished(true);
      }, 1500);
    }

    // Reset selections
    setSelectedTool(null);
    setSelectedFunction(null);
  };

  // Check if a tool is already matched
  const isToolMatched = (toolId) => {
    return matches.some(match => match.toolId === toolId);
  };

  // Check if a function is already matched
  const isFunctionMatched = (functionId) => {
    return matches.some(match => match.functionId === functionId);
  };

  // Get match result for a tool
  const getMatchResult = (toolId) => {
    const match = matches.find(m => m.toolId === toolId);
    return match ? match.isCorrect : null;
  };

  return (
    <GameShell
      title={gameContent?.title || "Puzzle: Digital Tools"}
      subtitle={
        gameFinished 
          ? gameContent?.subtitleComplete || "Puzzle Complete!" 
          : t("financial-literacy.teens.puzzle-of-digital-tools.subtitleProgress", { 
                  current: matches.length, 
                  total: tools.length,
                  defaultValue: `Match Digital Tools with Functions (${matches.length}/${tools.length} matched)`
                })
      }
      nextEnabled={gameFinished}
      showGameOver={gameFinished}
      score={score}
      gameId={gameId}
      gameType="finance"
      totalLevels={tools.length}
      currentLevel={matches.length + 1}
      showConfetti={gameFinished && score === tools.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      backPath="/games/financial-literacy/teens"
      maxScore={tools.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!gameFinished ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Digital Tools */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                {gameContent?.toolsTitle || "Digital Tools"}
              </h3>
              <div className="space-y-4">
                {tools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => handleToolSelect(tool)}
                    disabled={isToolMatched(tool.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isToolMatched(tool.id)
                        ? getMatchResult(tool.id)
                          ? "bg-green-500/30 border-2 border-green-500"
                          : "bg-red-500/30 border-2 border-red-500"
                        : selectedTool?.id === tool.id
                        ? "bg-blue-500/50 border-2 border-blue-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{tool.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{tool.name}</h4>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Middle column - Match button */}
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
                <p className="text-white/80 mb-4 h-12 flex items-center justify-center">
                  {selectedTool 
                    ? t("financial-literacy.teens.puzzle-of-digital-tools.selectedToolLabel", { 
                        name: selectedTool.name,
                        defaultValue: `Selected: ${selectedTool.name}`
                      }) 
                    : gameContent?.selectToolLabel || "Select a Digital Tool"}
                </p>
                <button
                  onClick={handleMatch}
                  disabled={!selectedTool || !selectedFunction}
                  className={`py-3 px-6 rounded-full font-bold transition-all ${
                    selectedTool && selectedFunction
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105"
                      : "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {gameContent?.matchButton || "Match"}
                </button>
                <div className="mt-4 text-white/80">
                  <p>
                    {t("financial-literacy.teens.puzzle-of-digital-tools.scoreLabel", { 
                      score, 
                      total: tools.length,
                      defaultValue: `Score: ${score}/${tools.length}`
                    })}
                  </p>
                  <p>
                    {t("financial-literacy.teens.puzzle-of-digital-tools.matchedLabel", { 
                      current: matches.length, 
                      total: tools.length,
                      defaultValue: `Matched: ${matches.length}/${tools.length}`
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Right column - Digital Functions */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                {gameContent?.functionsTitle || "Digital Functions"}
              </h3>
              <div className="space-y-4">
                {rearrangedFunctions.map(func => (
                  <button
                    key={func.id}
                    onClick={() => handleFunctionSelect(func)}
                    disabled={isFunctionMatched(func.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isFunctionMatched(func.id)
                        ? "bg-green-500/30 border-2 border-green-500 opacity-50"
                        : selectedFunction?.id === func.id
                        ? "bg-purple-500/50 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{func.emoji}</div>
                      <div>
                        <h4 className="font-bold text-white">{func.name}</h4>
                        <p className="text-white/80 text-sm">{func.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            {score >= 3 ? (
              <div>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {gameContent?.resultSuccessHeader || "Great Job!"}
                </h3>
                <p className="text-white/90 text-lg mb-4">
                  {t("financial-literacy.teens.puzzle-of-digital-tools.resultSuccessSubheader", { 
                    score, 
                    total: tools.length,
                    defaultValue: `You correctly matched ${score} out of ${tools.length} digital tools with their functions!`
                  })}
                </p>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-full inline-flex items-center gap-2 mb-4">
                  <span>
                    {t("financial-literacy.teens.puzzle-of-digital-tools.coinsEarned", { 
                      coins: score,
                      defaultValue: `+${score} Coins`
                    })}
                  </span>
                </div>
                <p className="text-white/80">
                  {gameContent?.resultSuccessLesson || "Lesson: Understanding digital tools helps you make secure online transactions!"}
                </p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-4">💪</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {gameContent?.resultTryAgainHeader || "Keep Practicing!"}
                </h3>
                <p className="text-white/90 text-lg mb-4">
                  {t("financial-literacy.teens.puzzle-of-digital-tools.resultTryAgainSubheader", { 
                    score, 
                    total: tools.length,
                    defaultValue: `You matched ${score} out of ${tools.length} digital tools correctly.`
                  })}
                </p>
                <p className="text-white/80 text-sm">
                  {gameContent?.resultTryAgainTip || "Tip: Think about what each digital tool actually does!"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PuzzleOfDigitalTools;