import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getSustainabilityTeenGames } from "../../../../pages/Games/GameCategories/Sustainability/teenGamesData";

const JournalOfInnovation = () => {
  const navigate = useNavigate();
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();
  
  const gameId = "sustainability-teens-92";
  const games = getSustainabilityTeenGames({});
  const currentGameIndex = games.findIndex(game => game.id === gameId);
  const nextGame = games[currentGameIndex + 1];
  const nextGamePath = nextGame ? nextGame.path : "/games/sustainability/teens";
  const nextGameId = nextGame ? nextGame.id : null;

  // Hardcode rewards to align with rule: 1 coin per question, 5 total coins, 10 total XP
  const coinsPerLevel = 1;
  const totalCoins = 5;
  const totalXp = 10;

  const [currentStage, setCurrentStage] = useState(0);
  const [entry, setEntry] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);

  const stages = [
    { id: 1, prompt: "One innovative idea I have for sustainability is ___.", minLength: 10 },
    { id: 2, prompt: "One challenge I anticipate with my idea is ___.", minLength: 10 },
    { id: 3, prompt: "One way I could start implementing my idea is ___.", minLength: 10 },
    { id: 4, prompt: "One benefit my innovation could bring to the environment is ___.", minLength: 10 },
    { id: 5, prompt: "One person or organization I could partner with for my innovation is ___.", minLength: 10 }
  ];

  const handleSubmit = () => {
    if (answered) return;
    
    const currentPrompt = stages[currentStage];
    if (entry.trim().length < currentPrompt.minLength) {
      showCorrectAnswerFeedback(0, false);
      return;
    }
    
    setAnswered(true);
    resetFeedback();
    setScore(prev => prev + 1);
    showCorrectAnswerFeedback(1, true);

    const isLastStage = currentStage === stages.length - 1;
    
    setTimeout(() => {
      if (isLastStage) {
        setShowResult(true);
      } else {
        setCurrentStage(prev => prev + 1);
        setEntry("");
        setAnswered(false);
      }
    }, 1500);
  };

  const currentPrompt = stages[currentStage];

  return (
    <GameShell
      title="Journal of Innovation"
      subtitle={!showResult ? `Entry ${currentStage + 1} of ${stages.length}` : "Journal Complete!"}
      score={score}
      currentLevel={currentStage + 1}
      totalLevels={stages.length}
      maxScore={stages.length}
      showConfetti={showResult}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      showGameOver={showResult}
      gameId={gameId}
      gameType="sustainability"
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      nextGamePath={nextGamePath}
      nextGameId={nextGameId}
      backPath="/games/sustainability/teens"
    
      nextGamePathProp="/student/sustainability/teens/simulation-green-startup-plan"
      nextGameIdProp="sustainability-teens-93">
      <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center max-w-4xl mx-auto px-4 py-4">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/80">Entry {currentStage + 1}/{stages.length}</span>
                <span className="text-yellow-400 font-bold">Coins: {score}</span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4">Innovation Journal</h3>
              
              <p className="text-white mb-4">{currentPrompt.prompt}</p>
              
              <textarea
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder="Write your thoughts here..."
                className="w-full h-32 p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                disabled={answered}
              />
              
              <div className="mt-4 flex justify-between items-center">
                <span className="text-white/70 text-sm">
                  Minimum {currentPrompt.minLength} characters
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={answered || entry.trim().length < currentPrompt.minLength}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-xl transition-all duration-200"
                >
                  {answered ? "Submitted" : "Submit"}
                </button>
              </div>
            </div>
            
            <div className="text-center text-white/70 text-sm">
              Document your ideas for sustainable innovations
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Journal Complete!</h2>
              <p className="text-white/90 mb-2">You completed {score}/{stages.length} entries</p>
              <p className="text-white/70 mb-6">Great job documenting your innovation ideas!</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => navigate(nextGamePath)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  Next Challenge
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default JournalOfInnovation;