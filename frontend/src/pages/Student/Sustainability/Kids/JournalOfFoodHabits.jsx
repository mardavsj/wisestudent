import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PenSquare } from 'lucide-react';
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";
import { getSustainabilityKidsGames } from "../../../../pages/Games/GameCategories/Sustainability/kidGamesData";

const JournalOfFoodHabits = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const gameId = "sustainability-kids-42";
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 5;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [coins, setCoins] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  // Find next game path and ID if not provided in location.state
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

  // Log when game completes and update location state with nextGameId
  useEffect(() => {
    if (gameFinished) {
      console.log(`🎮 Journal of Food Habits game completed! Score: ${coins}, gameId: ${gameId}, nextGamePath: ${nextGamePath}, nextGameId: ${nextGameId}`);
      if (nextGameId && window.history && window.history.replaceState) {
        const currentState = window.history.state || {};
        window.history.replaceState({
          ...currentState,
          nextGameId: nextGameId
        }, '');
      }
    }
  }, [gameFinished, coins, gameId, nextGamePath, nextGameId]);

  const stages = [
    { question: 'Write: "One way I reduce food waste is ___."', minLength: 10 },
    { question: 'Write: "I can save food by ___."', minLength: 10 },
    { question: 'Write: "Planning meals helps because ___."', minLength: 10 },
    { question: 'Write: "My favorite way to use leftovers is ___."', minLength: 10 },
    { question: 'Write: "I feel proud when I reduce food waste because ___."', minLength: 10 }
  ];

  const handleJournalSubmit = () => {
    if (gameFinished) return; // Prevent multiple submissions
    
    resetFeedback();
    const entryText = journalEntry.trim();
    
    if (entryText.length >= 10) {
      setCoins(prev => prev + 1);
      showCorrectAnswerFeedback(1, true);
      
      const isLastQuestion = currentPromptIndex === stages.length - 1;
      
      setTimeout(() => {
        if (isLastQuestion) {
          setGameFinished(true);
        } else {
          setJournalEntry("");
          setCurrentPromptIndex(prev => prev + 1);
        }
      }, 1500);
    }
  };

  // Log when game completes
  useEffect(() => {
    if (gameFinished) {
      console.log(`🎮 Journal of Food Habits game completed! Score: ${coins}/${stages.length}, gameId: ${gameId}`);
    }
  }, [gameFinished, coins, gameId, stages.length]);


  const characterCount = journalEntry.trim().length;
  const isLongEnough = characterCount >= 10;
  const currentPrompt = stages[currentPromptIndex]?.question;

  return (
    <GameShell
      title="Journal of Food Habits"
      subtitle={!gameFinished ? `Entry ${currentPromptIndex + 1} of ${stages.length}` : "Journal Complete!"}

      showGameOver={gameFinished}
      score={coins}
      gameId={gameId}
      gameType="sustainability"
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      maxScore={stages.length}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      currentLevel={currentPromptIndex + 1}
      totalLevels={stages.length}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
    
      nextGamePathProp="/student/sustainability/kids/compost-story"
      nextGameIdProp="sustainability-kids-43">
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center text-center text-white space-y-6 md:space-y-8 max-w-4xl mx-auto px-4 py-4">
        {!gameFinished && currentPrompt && (
          <div className="bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-xl md:rounded-2xl border border-white/20">
            <PenSquare className="mx-auto mb-4 w-8 h-8 md:w-10 md:h-10 text-yellow-300" />
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-white">{currentPrompt}</h3>
            <p className="text-white/70 mb-4 text-sm md:text-base">Score: {coins}/{stages.length}</p>
            <p className="text-white/60 text-xs md:text-sm mb-4">
              Write at least 10 characters
            </p>
            <textarea
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              placeholder="Write your journal entry here..."
              className="w-full max-w-xl p-4 rounded-xl text-black text-base md:text-lg bg-white/90 min-h-[120px] md:min-h-[150px]"
              disabled={gameFinished}
            />
            <div className="mt-2 text-white/50 text-xs md:text-sm">
              {characterCount}/10 characters
            </div>
            <button
              onClick={handleJournalSubmit}
              className={`mt-4 px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold transition-transform ${
                isLongEnough && !gameFinished
                  ? 'bg-green-500 hover:bg-green-600 hover:scale-105 text-white cursor-pointer'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50'
              }`}
              disabled={!isLongEnough || gameFinished}
            >
              {currentPromptIndex === stages.length - 1 ? 'Submit Final Entry' : 'Submit & Continue'}
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalOfFoodHabits;