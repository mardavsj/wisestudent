import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Rumors of an economic downturn begin, and your company announces a hiring freeze. What is your immediate risk-management response?",
    options: [
      { id: "opt1", text: "Panic and start interviewing everywhere immediately, spreading the rumors.", outcome: "Creating panic and spreading rumors marks you as a liability during stressful times.", isCorrect: false },
      { id: "opt2", text: "Do nothing and assume your job is perfectly safe because you are well-liked.", outcome: "Assuming safety during a downturn is reckless; being well-liked doesn't beat numbers in a layoff.", isCorrect: false },
      { id: "opt4", text: "Complain to HR about the anxiety the announcement is causing you.", outcome: "HR cannot fix macro-economic issues, and complaining diverts your focus from actual preparation.", isCorrect: false },
      { id: "opt3", text: "Discreetly update your resume, audit your recent impact for visibility, and build a 6-month financial emergency fund.", outcome: "Correct! Proactive preparation protects you without causing unnecessary instability.", isCorrect: true },
    ],
  },
  {
    id: 2,
    prompt: "A recruiter offers you a 6-month contract role with a 30% higher hourly rate than your current permanent salaried position. What is the stable choice?",
    options: [
      { id: "opt1", text: "Take it immediately for the quick cash boost.", outcome: "Ignoring the loss of benefits, taxes, and job security leads to long-term financial risk.", isCorrect: false },
      { id: "opt3", text: "Quit your job before signing the contract so you can take a week off.", outcome: "Quitting before a signed contract is a massive, unnecessary professional risk.", isCorrect: false },
      { id: "opt2", text: "Calculate the total compensation (insurance, PTO, security) and reject it if the risk outstrips the short-term cash.", outcome: "Correct! Permanent roles offer invisible value (benefits, stability) that contracts often lack.", isCorrect: true },
      { id: "opt4", text: "Use the recruiter's message to aggressively demand a 30% raise from your current boss.", outcome: "Aggressive ultimatums break trust, especially when leveraging an unstable contract role.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Your team is adopting a new software platform that will automate parts of your job. How do you protect your career stability?",
    options: [
      { id: "opt2", text: "Refuse to use it and explain why the old way was better.", outcome: "Refusing to adapt guarantees you will be replaced by someone who will.", isCorrect: false },
      { id: "opt1", text: "Become the first to master the new platform, making yourself the go-to expert.", outcome: "Correct! Adapting and leading the change makes you indispensable.", isCorrect: true },
      { id: "opt3", text: "Secretly sabotage the software rollout so they keep the old system.", outcome: "Sabotage is unethical and will result in termination.", isCorrect: false },
      { id: "opt4", text: "Just wait for someone else to figure it out and teach you.", outcome: "Passive learning leaves you behind the curve and vulnerable during transitions.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "You are asked to sign an unusually broad non-compete agreement to receive your standard annual bonus. What should you do?",
    options: [
      { id: "opt3", text: "Politely ask for time to review it, consult a professional if needed, and negotiate terms that protect your future employment.", outcome: "Correct! Managing legal risk is a critical component of career stability.", isCorrect: true },
      { id: "opt1", text: "Sign it immediately without reading. A bonus is a bonus.", outcome: "Signing broad legal documents blindly can lock you out of your industry if you leave.", isCorrect: false },
      { id: "opt2", text: "Refuse it and yell at management for trapping you.", outcome: "Emotional reactions to legal documents are unprofessional and unproductive.", isCorrect: false },
      { id: "opt4", text: "Sign it but plan to just break the contract later.", outcome: "Intentionally breaching a legal contract opens you up to severe financial and legal penalties.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Which of the following describes the core philosophy of a 'Career Stability Guardian'?",
    options: [
      { id: "opt1", text: "Never taking any risks or changing jobs, staying in one place forever.", outcome: "Complete stagnation is actually very risky as skills erode over time.", isCorrect: false },
      { id: "opt2", text: "Taking massive financial gambles frequently to jump up the ladder fast.", outcome: "Gambling your career leads to volatile highs and catastrophic lows.", isCorrect: false },
      { id: "opt4", text: "Relying entirely on a mentor to tell them what to do next.", outcome: "Outsourcing your career decisions leaves you helpless if that mentor leaves.", isCorrect: false },
      { id: "opt3", text: "Continuously auditing skills, maintaining a strong emergency fund, and evaluating opportunities based on long-term systemic risk.", outcome: "Correct! Stability comes from constant, measured risk management and preparation.", isCorrect: true },
    ],
  },
];

const BadgeCareerStabilityGuardian = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  
  const gameId = "ehe-adults-30";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
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
      title="Badge: Career Stability Guardian"
      subtitle={
        showResult
          ? "Achievement unlocked! You are a master of risk management."
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
                             {option.isCorrect ? 'Stable Choice' : 'Risky Choice'}
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

export default BadgeCareerStabilityGuardian;
