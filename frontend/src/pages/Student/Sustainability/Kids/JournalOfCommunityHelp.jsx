import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PenSquare } from 'lucide-react';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const JournalOfCommunityHelp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "sustainability-kids-92";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [coins, setCoins] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const { nextGamePath, nextGameId } = useMemo(() => {
    if (location.state?.nextGamePath) {
      return {
        nextGamePath: location.state.nextGamePath,
        nextGameId: location.state.nextGameId || null
      };
    }
    
    try {
      const games = getSustainabilityKidsGames({});
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

  useEffect(() => {
    if (gameFinished) {
      console.log(`🎮 Journal of Community Help game completed! gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [gameFinished, gameId, nextGamePath, nextGameId]);

  // Journal prompts
  const prompts = [
    "One way I helped my community is ___",
    "How I can help my neighbors is ___", 
    "A community project I would like to join is ___",
    "The best way to work together in my community is ___",
    "One thing I learned about helping others is ___"
  ];

  const currentPrompt = prompts[currentPromptIndex];

  const handleSaveEntry = () => {
    const entryText = journalEntry.trim();
    
    if (entryText.length < 10) {
      alert("Please write at least 10 characters in your journal!");
      return;
    }

    // Award coin for completing the entry
    showCorrectAnswerFeedback(1, true);
    setCoins(prev => prev + 1);
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      setJournalEntry("");
      
      if (currentPromptIndex < prompts.length - 1) {
        setCurrentPromptIndex(prev => prev + 1);
      } else {
        setGameFinished(true);
      }
    }, 1500);
  };

  return (
    <GameShell
      title="Journal of Community Help"
      subtitle={gameFinished ? "Journal Complete!" : `Prompt ${currentPromptIndex + 1} of ${prompts.length}`}
      currentLevel={currentPromptIndex + 1}
      totalLevels={prompts.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      score={coins}
      showGameOver={gameFinished}
      gameId={gameId}
      gameType="sustainability"
      maxScore={prompts.length}
      showConfetti={gameFinished && coins === prompts.length}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    
      nextGamePathProp="/student/sustainability/kids/event-story"
      nextGameIdProp="sustainability-kids-93">
      {flashPoints}
      {!gameFinished ? (
        <div className="space-y-8 max-w-4xl mx-auto px-4 min-h-[calc(100vh-200px)] flex flex-col justify-center">
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Prompt {currentPromptIndex + 1}/{prompts.length}</span>
                <span className="text-yellow-400 font-bold">Score: {coins}/{prompts.length}</span>
              </div>
              
              <div className="text-6xl mb-4 text-center">📝</div>
              
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                {currentPrompt}
              </h3>
              
              <div className="mb-4">
                <textarea
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder="Write your thoughts here..."
                  className="w-full p-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
                />
              </div>
              
              <div className="text-white/60 text-sm mb-2 text-center">
                Write at least 10 characters
              </div>
              
              <div className="text-white/50 text-xs mb-4 text-center">
                {journalEntry.trim().length}/10 characters
              </div>
              
              <div className="text-center">
                <button
                  onClick={handleSaveEntry}
                  className={`px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 ${
                    journalEntry.trim().length >= 10
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white'
                      : 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50'
                  }`}
                  disabled={journalEntry.trim().length < 10}
                >
                  Save Entry
                </button>
              </div>
              
              {showFeedback && (
                <div className="rounded-lg p-5 mt-6 bg-green-500/20">
                  <p className="text-white text-center">
                    Great job! Your thoughts help build a better community! 🎉
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-2xl font-bold text-white">Great job!</h3>
          <p className="text-gray-300">
            You completed {coins} journal prompts!
          </p>
          <p className="text-green-400 font-semibold">
            You earned {coins} coins! Keep reflecting on how to help your community! 🌍
          </p>
        </div>
      )}
    </GameShell>
  );
};

export default JournalOfCommunityHelp;