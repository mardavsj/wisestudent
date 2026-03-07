import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "A shop sells goods at the lowest price in the neighbourhood but never gives a bill. A customer buys a mixer that breaks in 2 days. What happens?",
    options: [
      { id: "opt1", text: "The customer goes back and gets a free replacement easily", outcome: "Incorrect. Without a bill, the shop can deny the sale ever happened.", isCorrect: false },
      { id: "opt2", text: "Without a bill, the customer has no proof of purchase and loses money", outcome: "Correct! A bill is the customer's only legal proof of purchase and warranty.", isCorrect: true },
      { id: "opt3", text: "Low price means low quality is expected, so it's fine", outcome: "Incorrect. Customers deserve quality AND documentation regardless of price.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Two shops sell the same phone case for ₹200. Shop A gives a printed bill; Shop B doesn't. Which shop will the customer return to?",
    options: [
      { id: "opt2", text: "Shop A — the bill proves the sale, enables returns, and builds confidence", outcome: "Correct! Bills create a trust loop: proof → returns → confidence → loyalty.", isCorrect: true },
      { id: "opt1", text: "Shop B — no bill means the owner is saving paper and passing savings to me", outcome: "Incorrect. No bill usually means the shop avoids accountability, not saves costs.", isCorrect: false },
      { id: "opt3", text: "Neither — customers don't care about bills at all", outcome: "Incorrect. Studies show customers increasingly value transparency and receipts.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "A regular customer asks: 'Can I get a bill? I need it for my company reimbursement.' The shop doesn't give bills. What's the business impact?",
    options: [
      { id: "opt1", text: "The customer will just buy anyway since the price is lowest", outcome: "Incorrect. Corporate buyers MUST have bills for reimbursement — they'll go elsewhere.", isCorrect: false },
      { id: "opt3", text: "The customer can make their own bill at home", outcome: "Incorrect. Self-made bills are not legal documents and can constitute fraud.", isCorrect: false },
      { id: "opt2", text: "The shop loses corporate and bulk buyers who need formal documentation", outcome: "Correct! No bills = no access to the entire corporate and institutional market.", isCorrect: true },
    ],
  },
  {
    id: 4,
    prompt: "A customer posts a review online: 'Great prices but no bill — can't trust warranty claims.' How does this affect the business?",
    options: [
      { id: "opt1", text: "Online reviews don't matter for small shops", outcome: "Incorrect. Google and social media reviews heavily influence local purchasing decisions.", isCorrect: false },
      { id: "opt2", text: "Negative trust reviews drive away new customers even if prices are the lowest", outcome: "Correct! In the digital age, one trust-related review can cost dozens of customers.", isCorrect: true },
      { id: "opt3", text: "The shop should sue the customer for defamation", outcome: "Incorrect. Honest customer feedback is protected, and suing would destroy reputation further.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Final Verdict: Does a bill matter if the price is the lowest in town?",
    options: [
      { id: "opt1", text: "Yes — bills build trust, enable returns, unlock corporate sales, and create lasting loyalty", outcome: "Correct! Low price attracts the first sale; bills and trust earn the next hundred.", isCorrect: true },
      { id: "opt2", text: "No — price is king; customers will always choose the cheapest option", outcome: "Incorrect. Customers balance price with trust, warranty, and accountability.", isCorrect: false },
      { id: "opt3", text: "Bills only matter for expensive items, not cheap ones", outcome: "Incorrect. Every transaction deserves documentation for both legal and trust reasons.", isCorrect: false },
    ],
  },
];

const DebateCustomerLoyalty = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  // Registering at index 58
  const gameId = "finance-business-livelihood-finance-58";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(2, Math.floor(totalCoins / totalStages));
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
      title="Debate: Customer Loyalty"
      subtitle={
        showResult
          ? "Debate concluded! Bills build lasting customer loyalty beyond low prices."
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
      gameType="finance"
      nextGamePath={location.state?.nextGamePath}
      nextGameId={location.state?.nextGameId}
      backPath={location.state?.returnPath}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult && stage && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-slate-700 shadow-2xl relative overflow-hidden">
              
              {/* Podium aesthetic */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 to-fuchsia-600"></div>

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

export default DebateCustomerLoyalty;
