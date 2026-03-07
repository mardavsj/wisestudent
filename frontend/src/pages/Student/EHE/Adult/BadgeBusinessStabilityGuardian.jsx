import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You receive an unexpectedly large tax bill because your accountant miscalculated last year's revenue. How do you handle this to stabilize your business?",
    options: [
      { id: "opt1", text: "Ignore the bill until they threaten legal action to keep cash flowing right now.", outcome: "Ignoring legal tax obligations results in massive penalties and asset seizures.", isCorrect: false },
      { id: "opt2", text: "Empty your operational accounts immediately to pay it off, even if you can't make payroll.", outcome: "Crippling your daily operations to pay a lump sum creates a secondary, equally fatal crisis.", isCorrect: false },
      { id: "opt3", text: "Contact the tax authority immediately to negotiate a structured payment plan while auditing your accountant's processes.", outcome: "Correct! Proactive communication and compliance audits manage the crisis without destroying operations.", isCorrect: true },
      { id: "opt4", text: "Take out high-interest personal loans to hide the mistake from your business records.", outcome: "Using toxic personal debt to mask business errors destroys both personal and corporate stability.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "A new, strict data privacy regulation is passed in your industry. Compliance requires a $10,000 system upgrade. What is your choice?",
    options: [
      { id: "opt3", text: "View compliance as a competitive advantage, budget for the upgrade, and advertise your new security standards to clients.", outcome: "Correct! Stability guardians turn mandatory compliance into marketing trust factors.", isCorrect: true },
      { id: "opt1", text: "Secretly delay the upgrade and hope inspectors don't target your small business.", outcome: "Regulatory bodies increasingly target small businesses; fines often exceed the cost of compliance.", isCorrect: false },
      { id: "opt2", text: "Complain publicly about the regulation but refuse to comply out of principle.", outcome: "Public refusal to comply attracts regulatory scrutiny and alienates compliance-focused enterprise clients.", isCorrect: false },
      { id: "opt4", text: "Shut down the business because regulations are too hard to manage.", outcome: "Quitting at the first sign of regulatory difficulty shows a lack of resilience required for business.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "You discover your sales team is making unrealistic promises to clients to hit their monthly quotas. How do you intervene?",
    options: [
      { id: "opt2", text: "Celebrate the high sales numbers; operations can figure out how to deliver it later.", outcome: "Selling undeliverable promises results in chargebacks, lawsuits, and brand destruction.", isCorrect: false },
      { id: "opt1", text: "Redefine the quotas, enforce strict contract reviews, and penalize over-promising.", outcome: "Correct! Aligning incentives with sustainable, truthful delivery protects the company's reputation.", isCorrect: true },
      { id: "opt3", text: "Fire the entire operations team for complaining that the sales promises are too hard to fulfill.", outcome: "Punishing the victims of bad sales practices ensures you will eventually fail to deliver entirely.", isCorrect: false },
      { id: "opt4", text: "Write vague contracts so the clients can't legally prove what was promised.", outcome: "Creating intentionally deceptive contracts is unethical and invites endless litigation.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "Your supplier offers a massive 40% discount if you pay in cash under the table and skip the official invoice. What do you do?",
    options: [
      { id: "opt1", text: "Accept it immediately; higher profit margins are the only thing that matters.", outcome: "Evading taxes through unrecorded transactions is a criminal offense that can end your business and freedom.", isCorrect: false },
      { id: "opt3", text: "Accept the deal but try to fake an invoice yourself later to make it look legitimate.", outcome: "Forging financial documents escalates a minor compliance issue into severe corporate fraud.", isCorrect: false },
      { id: "opt4", text: "Blackmail the supplier into giving you the discount legally or you'll report them.", outcome: "Engaging in extortion is illegal and destroys necessary supply chain relationships.", isCorrect: false },
      { id: "opt2", text: "Decline the illegal offer and insist on proper documentation, even if it costs more.", outcome: "Correct! Short-term illegal gains are never worth the long-term catastrophic risk to the business.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "A key executive leaves and you realize they had sole access and knowledge of all financial passwords and accounts. How do you prevent this vulnerability?",
    options: [
      { id: "opt2", text: "Implement dual-control systems, mandatory password managers, and regular access audits.", outcome: "Correct! Stability relies on systemic controls that remove single points of catastrophic failure.", isCorrect: true },
      { id: "opt1", text: "Just trust the next executive completely so they feel empowered.", outcome: "Blind trust without verification is negligence, not empowerment.", isCorrect: false },
      { id: "opt3", text: "Take all passwords back and do everything related to finance yourself forever.", outcome: "Refusing to delegate creates an operational bottleneck and limits business growth.", isCorrect: false },
      { id: "opt4", text: "Write all passwords on a whiteboard in the office so everyone can access them.", outcome: "Eliminating all security just to prevent lockouts creates massive internal theft vulnerabilities.", isCorrect: false },
    ],
  },
];

const BadgeBusinessStabilityGuardian = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  
  const gameId = "ehe-adults-70";
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
      title='Badge: Business Stability Guardian'
      subtitle={
        showResult
          ? "Achievement unlocked! You are a master of business stability and compliance."
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

export default BadgeBusinessStabilityGuardian;
