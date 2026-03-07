import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Your local business is thriving and you want to expand. What is your first step before opening a new location?",
    options: [
      { id: "opt1", text: "Sign a lease in the most expensive part of town to look prestigious.", outcome: "High fixed costs without proven local demand can bankrupt a profitable business.", isCorrect: false },
      { id: "opt3", text: "Assume your current success will automatically duplicate anywhere.", outcome: "Different locations have different demographics and competition; success rarely duplicates automatically.", isCorrect: false },
      { id: "opt4", text: "Borrow maximum capital immediately to open five locations at once.", outcome: "Over-expanding too quickly is a common cause of business collapse.", isCorrect: false },
      { id: "opt2", text: "Conduct a thorough market analysis of the new area to ensure there is demand.", outcome: "Correct! Strategic expansion requires data-driven market validation.", isCorrect: true },
    ],
  },
  {
    id: 2,
    prompt: "You are considering adding a completely new product line outside your core expertise. How do you proceed?",
    options: [
      { id: "opt1", text: "Pivot the entire company to focus on the new product line.", outcome: "Abandoning your core profitable business for an unproven venture is extremely risky.", isCorrect: false },
      { id: "opt2", text: "Launch it secretly without telling your current customers to avoid confusion.", outcome: "Failing to leverage your existing customer base wastes a major expansion advantage.", isCorrect: false },
      { id: "opt3", text: "Test the new product line with a small segment of your existing loyal customers first.", outcome: "Correct! Testing with existing customers minimizes risk and provides immediate feedback.", isCorrect: true },
      { id: "opt4", text: "Spend your entire marketing budget promoting the unproven product.", outcome: "Allocating all resources to an unproven product starves your profitable core business.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "To scale your operations, you need specialized expertise your team lacks. What is the most strategic approach?",
    options: [
      { id: "opt2", text: "Force your current team to learn the specialized skills overnight.", outcome: "Forcing unqualified staff into highly specialized roles leads to costly mistakes and burnout.", isCorrect: false },
      { id: "opt1", text: "Form a strategic partnership or hire experienced talent to fill the gap.", outcome: "Correct! Scaling effectively requires recognizing and filling internal knowledge gaps.", isCorrect: true },
      { id: "opt3", text: "Ignore the need and try to scale using only your current methods.", outcome: "Scaling without upgrading capabilities inevitably leads to operational breakdown.", isCorrect: false },
      { id: "opt4", text: "Give up on scaling because you don't know how to do it yourself.", outcome: "A strategic builder finds solutions to limitations rather than surrender to them.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "You are exploring international expansion. What is the primary risk you must evaluate?",
    options: [
      { id: "opt3", text: "Thoroughly evaluating legal, regulatory, logistical, and cultural differences.", outcome: "Correct! International expansion requires deep diligence beyond just translating a website.", isCorrect: true },
      { id: "opt1", text: "Picking a cool-sounding country to put on your website.", outcome: "Expansion based on vanity metrics ignores crucial operational realities.", isCorrect: false },
      { id: "opt2", text: "Just translating your website and hoping for the best.", outcome: "Linguistic translation without cultural adaptation and logistical planning will fail.", isCorrect: false },
      { id: "opt4", text: "Assuming international laws are basically the same as domestic laws.", outcome: "Legal assumptions across borders can lead to severe penalties and immediate shutdown.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Your business has grown rapidly, but profit margins are shrinking. What is your strategic response?",
    options: [
      { id: "opt1", text: "Lower prices further to try and increase sales volume.", outcome: "Lowering prices when margins are already shrinking usually accelerates failure.", isCorrect: false },
      { id: "opt2", text: "Fire half your staff to immediately cut costs.", outcome: "Indiscriminate firing destroys operational capacity and cripples future growth.", isCorrect: false },
      { id: "opt3", text: "Audit operations to identify inefficiencies, optimize supply chains, and focus on high-margin products.", outcome: "Correct! Strategic builders pause to optimize internal systems when growth outpaces profitability.", isCorrect: true },
      { id: "opt4", text: "Ignore the shrinking margins; revenue is what matters most.", outcome: "Revenue without profit is just subsidized activity. Margins dictate long-term survival.", isCorrect: false },
    ],
  },
];

const BadgeStrategicBusinessBuilder = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  
  const gameId = "ehe-adults-60";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 15;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 30;
  
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
      title='Badge: Strategic Business Builder'
      subtitle={
        showResult
          ? "Achievement unlocked! You are a master of strategic business expansion."
          : `Scenario ${currentStageIndex + 1} of ${totalStages}`
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
            <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.15)] overflow-hidden relative">
              
              {/* Premium aesthetic background */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-amber-500/5 to-orange-900/20 pointer-events-none"></div>
              
              {/* Animated scanning line effect */}
              <div className="absolute left-0 top-0 w-full h-[2px] bg-amber-500/50 blur-sm animate-[scan_4s_ease-in-out_infinite]"></div>

              <div className="flex items-center justify-between text-sm font-bold uppercase tracking-[0.2em] text-amber-400 mb-6 border-b border-amber-500/30 pb-4 relative z-10">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  Scenario {progressLabel}
                </span>
                <span className="bg-amber-500/10 px-3 py-1 rounded border border-amber-500/30">
                  Resilience: {score}/{totalStages}
                </span>
              </div>
              
              <div className="bg-black/40 rounded-2xl p-6 mb-8 border border-amber-500/20 shadow-inner relative z-10">
                <p className="text-white text-xl md:text-2xl font-serif leading-relaxed">
                  {stage.prompt}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "bg-slate-800 border-slate-700 hover:border-amber-400 hover:bg-slate-700 text-slate-200";
                  
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
                             {option.isCorrect ? 'Strategic Choice' : 'Risky Choice'}
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

export default BadgeStrategicBusinessBuilder;
