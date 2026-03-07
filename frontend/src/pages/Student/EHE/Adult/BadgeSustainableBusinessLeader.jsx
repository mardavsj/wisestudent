import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Your manufacturing plant relies heavily on cheap, non-renewable energy, but a new state subsidy allows transitioning to solar. The switch will dip your profit margins for two years. What is your choice?",
    options: [
      { id: "opt1", text: "Reject the switch; maximizing this year's margins is all that matters.", outcome: "Focusing solely on immediate margins leaves your business vulnerable to future energy regulation and cost spikes.", isCorrect: false },
      { id: "opt2", text: "Claim you are 'going green' without actually changing the energy supply.", outcome: "Greenwashing destroys consumer trust and opens you up to severe regulatory penalties.", isCorrect: false },
      { id: "opt4", text: "Shut down operations immediately until solar is completely free.", outcome: "Halting business entirely over an energy transition is impractical and kills the company.", isCorrect: false },
      { id: "opt3", text: "Adopt the solar transition, absorbing the temporary cost to build long-term operational resilience and secure stable energy prices.", outcome: "Correct! Sustainable leadership prioritizes long-term resilience and innovation over strictly short-term gains.", isCorrect: true },
    ],
  },
  {
    id: 2,
    prompt: "An audit reveals a key supplier uses unfair labor practices, yet they provide the lowest cost materials. How do you handle this supply chain risk?",
    options: [
      { id: "opt1", text: "Keep using them but hide the audit from the public.", outcome: "Covering up ethical violations is a massive reputational and legal liability.", isCorrect: false },
      { id: "opt3", text: "Demand the supplier change their practices, but do nothing if they refuse.", outcome: "Empty demands without actionable consequences do not resolve systemic supply chain issues.", isCorrect: false },
      { id: "opt2", text: "Begin systematically transitioning to certified ethical suppliers, even if it slightly increases unit costs.", outcome: "Correct! Sustainable businesses demand ethical supply chains to mitigate long-term risk and build brand equity.", isCorrect: true },
      { id: "opt4", text: "Publicly shame the supplier and sue them immediately.", outcome: "Aggressive, reactive legal action may disrupt your immediate supply without ensuring a stable, ethical replacement.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Your highly profitable flagship product generates a massive amount of single-use plastic waste. Customers are starting to complain. What is your strategy?",
    options: [
      { id: "opt2", text: "Ignore the complaints; they will still buy it because they need it.", outcome: "Ignoring shifting consumer sentiment practically guarantees you lose market share to sustainable competitors.", isCorrect: false },
      { id: "opt1", text: "Invest in R&D to redesign the packaging using biodegradable or reusable materials.", outcome: "Correct! Adapting your product to a circular economy model drives innovation and meets future consumer demands.", isCorrect: true },
      { id: "opt3", text: "Add a 'Recycle Me' sticker to the packaging but change nothing else.", outcome: "Superficial changes do not address the systemic waste issue your product is creating.", isCorrect: false },
      { id: "opt4", text: "Discontinue the product entirely today with no backup plan.", outcome: "Killing a core revenue stream immediately without a phased transition harms the business.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "Investors want to see your ESG (Environmental, Social, and Governance) report, but your initial numbers show you missed some diversity and emission goals. What should you do?",
    options: [
      { id: "opt3", text: "Publish an honest report, acknowledge the missed goals, and lay out a clear, actionable roadmap to fix them.", outcome: "Correct! Transparency, accountability, and a commitment to improvement define sustainable leadership.", isCorrect: true },
      { id: "opt1", text: "Falsify the data to make the report look better.", outcome: "Falsifying data is corporate fraud and destroys all investor confidence.", isCorrect: false },
      { id: "opt2", text: "Refuse to publish an ESG report this year.", outcome: "Refusing transparency signals to investors that the problems are worse than they actually are.", isCorrect: false },
      { id: "opt4", text: "Blame the missed goals entirely on your lower-level employees.", outcome: "Avoiding accountability and blaming others shows exceptionally poor governance and leadership.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "What is the primary indicator of a true 'Sustainable Business Leader'?",
    options: [
      { id: "opt1", text: "Routinely sacrificing long-term viability for immediate, massive quarterly profits.", outcome: "Maximizing short-term profit at the cost of long-term existence is the opposite of sustainability.", isCorrect: false },
      { id: "opt3", text: "Donating all corporate profits to charity and running at a loss.", outcome: "A business cannot be sustainable or create impact if it goes bankrupt.", isCorrect: false },
      { id: "opt4", text: "Ignoring all financial metrics as long as the company's carbon footprint is zero.", outcome: "Financial health is still a required pillar of a sustainable, functioning enterprise.", isCorrect: false },
      { id: "opt2", text: "Balancing economic prosperity with environmental stewardship and social responsibility for lasting endurance.", outcome: "Correct! True sustainability requires harmonizing people, planet, and profit for long-term endurance.", isCorrect: true },
    ],
  },
];

const BadgeSustainableBusinessLeader = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  
  const gameId = "ehe-adults-80";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 20;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 40;
  
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
      title="Badge: Sustainable Business Leader"
      subtitle={
        showResult
          ? "Achievement unlocked! You are a master of sustainable leadership."
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
                  Sustainability: {score}/{totalStages}
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
                             {option.isCorrect ? 'Sustainable Choice' : 'Short-sighted Choice'}
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

export default BadgeSustainableBusinessLeader;
