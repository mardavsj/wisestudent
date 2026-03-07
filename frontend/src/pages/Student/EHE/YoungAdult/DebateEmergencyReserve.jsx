import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Your startup's sales drop suddenly by 50% for a whole month. You need cash to pay rent and salaries. What is the smartest way to survive?",
    options: [
      { id: "opt1", text: "Take out a high-interest payday loan instantly to cover the gap.", outcome: "Incorrect. Panic borrowing at high interest rates traps your business in a debt cycle.", isCorrect: false },
      { id: "opt2", text: "Draw from your pre-planned business emergency reserve fund.", outcome: "Correct! A reserve fund acts as a shock absorber for unpredictable business cycles.", isCorrect: true },
      { id: "opt3", text: "Ask all your employees to work for free this month.", outcome: "Incorrect. Not paying your staff will destroy morale, trust, and likely lead to mass resignations.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Why is an emergency reserve fund superior to borrowing money during a sudden crisis?",
    options: [
      { id: "opt2", text: "It allows you to make calm, strategic decisions without the crushing burden of immediate interest payments.", outcome: "Correct! Working from a position of financial safety prevents panic-driven choices.", isCorrect: true },
      { id: "opt1", text: "It isn't. Borrowing is always better because it forces you to work harder.", outcome: "Incorrect. Desperation doesn't improve decision-making; it leads to fatal mistakes.", isCorrect: false },
      { id: "opt3", text: "It makes you look more attractive to venture capitalists during the down month.", outcome: "Incorrect. While VCs appreciate prudence, the primary benefit is operational survival, not just optics.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "A fellow founder advises you: 'Never leave cash sitting in a reserve fund; invest every single penny into marketing to grow faster.' How should you respond?",
    options: [
      { id: "opt1", text: "Agree completely. Unspent cash is a sign of a lazy entrepreneur.", outcome: "Incorrect. Running a business with zero safety margin guarantees failure during the first economic hiccup.", isCorrect: false },
      { id: "opt3", text: "Invest everything into marketing, but keep a personal credit card empty just in case.", outcome: "Incorrect. Relying on personal credit cards for business emergencies is a dangerous mixing of liabilities.", isCorrect: false },
      { id: "opt2", text: "Disagree. While growth is vital, a reserve fund ensures the business actually lives long enough to see that growth.", outcome: "Correct! Sustainable growth requires a solid foundation of risk management.", isCorrect: true },
    ],
  },
  {
    id: 4,
    prompt: "You are setting up your emergency reserve. How much cash should you ideally lock away?",
    options: [
      { id: "opt1", text: "Enough to cover exactly one week of business expenses.", outcome: "Incorrect. One week is nowhere near enough time to pivot or recover from a real crisis.", isCorrect: false },
      { id: "opt2", text: "Enough to cover 3 to 6 months of absolute essential operating expenses.", outcome: "Correct! This provides a realistic runway to navigate severe downturns or market shifts.", isCorrect: true },
      { id: "opt3", text: "Whatever is left over after you pay yourself a massive year-end bonus.", outcome: "Incorrect. The reserve fund must be prioritized before luxury distributions.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "If you successfully navigate the bad month using your reserve fund, what is your FIRST financial priority when sales recover?",
    options: [
      { id: "opt1", text: "Throw a massive company party to celebrate surviving.", outcome: "Incorrect. While morale is important, your financial safety net is currently empty.", isCorrect: false },
      { id: "opt3", text: "Start expanding the business aggressively immediately.", outcome: "Incorrect. Expanding without rebuilding your safety net leaves you vulnerable to the next crisis.", isCorrect: false },
      { id: "opt2", text: "Aggressively replenish the reserve fund back to its optimal level.", outcome: "Correct! Always rebuild your shield before charging back into full offensive mode.", isCorrect: true },
    ],
  },
];

const DebateEmergencyReserve = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  const gameId = "ehe-young-adult-56";
  const gameData = getGameDataById(gameId);
  // Default to 15 coins / 30 XP as requested
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 15;
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 30;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  
  const stage = STAGES[currentStageIndex];

  const handleChoice = (option) => {
    if (selectedChoice || !stage) return;
    setSelectedChoice(option);
    if (option.isCorrect) {
      setScore((s) => s + 1);
      showCorrectAnswerFeedback(1, true);
    }
    setTimeout(() => {
      if (currentStageIndex === totalStages - 1) {
        setShowResult(true);
      } else {
        setCurrentStageIndex((i) => i + 1);
      }
      setSelectedChoice(null);
    }, 3500);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Debate: Emergency Reserve"
      subtitle={
        showResult
          ? "Debate concluded! A strong reserve fund is the ultimate business shield."
          : `Point ${currentStageIndex + 1} of ${totalStages}`
      }
      currentLevel={currentStageIndex + 1}
      totalLevels={totalStages}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      showGameOver={showResult}
      score={score}
      showConfetti={showResult && score === totalStages}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
      gameId={gameId}
      gameType="ehe"
      nextGamePath={location.state?.nextGamePath}
      nextGameId={location.state?.nextGameId}
      backPath={location.state?.returnPath}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult && stage && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-slate-700 shadow-2xl relative overflow-hidden">
              
              {/* Podium aesthetic */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 to-indigo-600"></div>

              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8 border-b border-slate-700 pb-4">
                <span>Phase {progressLabel}</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Score: {score}/{totalStages}
                </span>
              </div>
              
              <div className="text-center mb-10">
                <span className="inline-block py-1 px-3 rounded-full bg-violet-900/50 text-violet-300 text-xs font-bold uppercase tracking-wider mb-4 border border-violet-500/30">
                  Topic of Debate
                </span>
                <p className="text-white text-xl md:text-2xl font-bold leading-relaxed">
                  "{stage.prompt}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "from-slate-800 to-slate-900 border-slate-700 hover:border-violet-500 hover:from-slate-800 hover:to-violet-900/40 text-slate-200";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "from-emerald-900/80 to-emerald-800 border-emerald-500 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-[1.02]"
                      : "from-rose-900/80 to-rose-800 border-rose-500 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.3)] scale-[1.02]";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "from-emerald-900/30 to-slate-900 border-emerald-500/50 text-emerald-400/80 ring-1 ring-emerald-500/30 opacity-80";
                  } else if (selectedChoice) {
                    baseStyle = "from-slate-900 to-slate-900 border-slate-800 text-slate-600 opacity-40";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative rounded-xl bg-gradient-to-r ${baseStyle} border-2 p-5 text-left font-medium transition-all duration-300 disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? (option.isCorrect ? 'border-emerald-400 bg-emerald-500/20' : 'border-rose-400 bg-rose-500/20') : 'border-slate-600'}`}>
                           {isSelected && <div className={`w-2.5 h-2.5 rounded-full ${option.isCorrect ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>}
                        </div>
                        <div className="flex-1">
                          <span className="block text-lg">{option.text}</span>
                          
                          <div className={`overflow-hidden transition-all duration-500 ${isSelected ? 'max-h-24 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className={`text-sm font-semibold p-3 rounded-lg ${option.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                              <span className="uppercase text-xs tracking-wider opacity-70 block mb-1">
                                {option.isCorrect ? 'Strong Argument' : 'Weak Argument'}
                              </span>
                              {option.outcome}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateEmergencyReserve;
