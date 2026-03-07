import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You want to double your customer base this year. What is the most effective scaling strategy?",
    options: [
      { id: "opt2", text: "Identify your most profitable acquisition channel and incrementally increase spend there while monitoring returns.", outcome: "Correct! Data-driven scaling prevents you from burning cash blindly.", isCorrect: true },
      { id: "opt1", text: "Spend your entire marketing budget in one single week.", outcome: "Blowing your budget without testing channels leads to massive waste.", isCorrect: false },
      { id: "opt3", text: "Hire 50 new salespeople immediately.", outcome: "Hiring ahead of proven demand creates unsustainable fixed costs.", isCorrect: false },
      { id: "opt4", text: "Lower your prices by 90% to undercut everyone.", outcome: "Drastic price cuts destroy your profit margins and brand value.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Your startup's monthly expenses (burn rate) are high, and revenue is growing slowly. What is the priority?",
    options: [
      { id: "opt1", text: "Move to a far more expensive, luxury office to impress potential clients.", outcome: "Increasing fixed costs during slow growth accelerates failure.", isCorrect: false },
      { id: "opt2", text: "Ignore the expenses; startups are supposed to lose money.", outcome: "Ignoring cash flow is the number one reason startups die.", isCorrect: false },
      { id: "opt4", text: "Take out high-interest personal loans to cover payroll.", outcome: "Personal debt for a struggling startup risks personal financial ruin.", isCorrect: false },
      { id: "opt3", text: "Audit all expenses, cut non-essential costs aggressively, and focus on closing high-margin sales.", outcome: "Correct! Survival requires ruthless financial discipline and extending your runway.", isCorrect: true },
    ],
  },
  {
    id: 3,
    prompt: "You have found product-market fit in your home city. To scale nationally, you must:",
    options: [
      { id: "opt1", text: "Standardize your operations, document processes, and hire experienced leaders.", outcome: "Correct! Scaling requires repeatable processes, not just founder hustle.", isCorrect: true },
      { id: "opt2", text: "Try to manage every expansion city yourself simultaneously.", outcome: "A founder cannot be everywhere; micromanagement prevents scale.", isCorrect: false },
      { id: "opt3", text: "Change the product completely because a new city might want something else.", outcome: "Abandoning your core successful product is an unnecessary pivot.", isCorrect: false },
      { id: "opt4", text: "Assume growth will happen organically without any new strategy.", outcome: "National scaling requires deliberate strategy, capital, and execution.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "A massive competitor enters your market, offering huge discounts. How should you react?",
    options: [
      { id: "opt1", text: "Panic, drop your prices below cost, and try to out-spend them.", outcome: "Price wars against well-funded competitors usually end in your bankruptcy.", isCorrect: false },
      { id: "opt2", text: "Focus entirely on imitating their new features.", outcome: "Imitation makes you a reactionary follower, not a leader.", isCorrect: false },
      { id: "opt4", text: "Double down on your unique value proposition, customer service, and niche audience.", outcome: "Correct! Compete on value, relationships, and agility, not just price.", isCorrect: true },
      { id: "opt3", text: "Give up immediately and shut down the company.", outcome: "Quitting at the first sign of competition shows a lack of resilience.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "You are considering raising Venture Capital (VC) to grow faster. What must you understand?",
    options: [
      { id: "opt1", text: "That VC money is free and you never have to pay it back or show results.", outcome: "VCs expect massive returns and aggressive growth; the pressure is immense.", isCorrect: false },
      { id: "opt2", text: "That VCs will take equity, expect a massive exit (sale/IPO), and you may lose control if growth stalls.", outcome: "Correct! Taking VC money changes the trajectory and expectations of the company entirely.", isCorrect: true },
      { id: "opt3", text: "That taking VC money means you have 'made it' and can relax.", outcome: "Raising money is the starting line of a harder race, not the finish line.", isCorrect: false },
      { id: "opt4", text: "That you should raise money even if your business model is highly profitable and capital efficient.", outcome: "If you don't need the capital and can grow profitably, bootstrapping preserves equity.", isCorrect: false },
    ],
  },
];

const BadgeStartupGrowthStrategist = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  const gameId = "ehe-young-adult-50";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  // User requested 2 coins per question.
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
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
      title="Badge: Startup Growth Strategist"
      subtitle={
        showResult
          ? "Achievement unlocked! You understand startup growth."
          : `Decision ${currentStageIndex + 1} of ${totalStages}`
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
      isBadgeGame={gameData?.isBadgeGame}
      badgeName={gameData?.badgeName}
      badgeImage={gameData?.badgeImage}
      gameId={gameId}
      gameType="ehe"
      nextGamePath={location.state?.nextGamePath}
      nextGameId={location.state?.nextGameId}
      backPath={location.state?.returnPath}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult && stage && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-sky-500/30 shadow-[0_0_40px_rgba(14,165,233,0.15)] overflow-hidden relative">
              
              {/* Premium aesthetic background */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-sky-500/5 to-blue-900/20 pointer-events-none"></div>
              
              {/* Animated scanning line effect */}
              <div className="absolute left-0 top-0 w-full h-[2px] bg-sky-500/50 blur-sm animate-[scan_4s_ease-in-out_infinite]"></div>

              <div className="flex items-center justify-between text-sm font-bold uppercase tracking-[0.2em] text-sky-400 mb-6 border-b border-sky-500/30 pb-4 relative z-10">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                  Decision {progressLabel}
                </span>
                <span className="bg-sky-500/10 px-3 py-1 rounded border border-sky-500/30">
                  Growth Strategy: {score}/{totalStages}
                </span>
              </div>
              
              <div className="bg-black/40 rounded-2xl p-6 mb-8 border border-sky-500/20 shadow-inner relative z-10">
                <p className="text-white text-xl md:text-2xl font-serif leading-relaxed">
                  {stage.prompt}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "bg-slate-800 border-slate-700 hover:border-sky-400 hover:bg-slate-700 text-slate-200";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "bg-emerald-900 border-emerald-400 text-emerald-50 shadow-[0_0_20px_rgba(52,211,153,0.4)] scale-[1.02]"
                      : "bg-rose-900 border-rose-500 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.4)] scale-[1.02]";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "bg-emerald-900/30 border-emerald-500/50 text-emerald-300 opacity-90 ring-1 ring-emerald-500/50";
                  } else if (selectedChoice) {
                    baseStyle = "bg-slate-900/60 border-slate-800 text-slate-500 opacity-50";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative rounded-xl ${baseStyle} border-2 p-5 text-left font-medium transition-all duration-300 disabled:cursor-not-allowed`}
                    >
                      <span className="block text-lg leading-snug">{option.text}</span>
                      
                      {isSelected && (
                         <div className={`mt-4 text-sm font-semibold p-3 rounded-lg bg-black/50 border ${option.isCorrect ? 'text-emerald-300 border-emerald-500/40' : 'text-rose-300 border-rose-500/40'} animate-fade-in-up`}>
                           <span className="uppercase text-[10px] tracking-widest opacity-70 block mb-1">
                             {option.isCorrect ? 'Strategic Move' : 'Critical Misstep'}
                           </span>
                           {option.outcome}
                         </div>
                      )}
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

export default BadgeStartupGrowthStrategist;
