import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You are offered a job at a highly unstable startup with great pay, or a stable company with average pay. What is the most career-stable choice for a beginner?",
    options: [
      { id: "opt1", text: "Take the startup job and hope for the best.", outcome: "Startups are risky and can close abruptly, leaving you unemployed without a safety net.", isCorrect: false },
      { id: "opt3", text: "Take the startup job, spend the extra money immediately, and let the future sort itself out.", outcome: "High pay without financial planning guarantees disaster if the startup fails.", isCorrect: false },
      { id: "opt2", text: "Choose the stable company to build foundational skills and a strong resume first.", outcome: "Correct! Early career stability provides a foundation for taking calculated risks later.", isCorrect: true },
      { id: "opt4", text: "Reject both and wait for a perfect opportunity.", outcome: "Waiting indefinitely creates a resume gap and halts your career progression.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "A recruiter reaches out to you about an exciting opportunity, but you are currently satisfied with your job. How do you handle it?",
    options: [
      { id: "opt1", text: "Ignore the recruiter. You are loyal to your current company.", outcome: "Ignoring recruiters limits your network and future safety options.", isCorrect: false },
      { id: "opt2", text: "Politely connect, hear them out, and build a relationship for the future.", outcome: "Correct! Building a strong network is the ultimate career safety net.", isCorrect: true },
      { id: "opt3", text: "Demand an interview immediately and threaten to quit your current job.", outcome: "Aggressive behavior ruins your professional reputation instantly.", isCorrect: false },
      { id: "opt4", text: "Tell your manager about the recruiter to force a raise.", outcome: "This tactic often backfires and destroys trust with your current employer.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Your industry is introducing new AI tools that automate parts of your job. What is your strategy?",
    options: [
      { id: "opt1", text: "Complain that AI is ruining the industry and refuse to use it.", outcome: "Resisting technological shifts ensures you will be replaced by them.", isCorrect: false },
      { id: "opt2", text: "Pretend the tools don't exist and keep doing things manually.", outcome: "You will quickly become inefficient and obsolete compared to peers.", isCorrect: false },
      { id: "opt4", text: "Quit your job and change industries completely.", outcome: "Running from change is unsustainable; every industry evolves.", isCorrect: false },
      { id: "opt3", text: "Actively learn the new tools and become the team expert in using them.", outcome: "Correct! Adaptability and upskilling are the best ways to protect your value.", isCorrect: true },
    ],
  },
  {
    id: 4,
    prompt: "Rumors are circulating about upcoming layoffs at your company. What should you do?",
    options: [
      { id: "opt1", text: "Panic, spread rumors, and stop working hard.", outcome: "Panic reduces your performance, making you a prime candidate for layoffs.", isCorrect: false },
      { id: "opt2", text: "Quietly update your resume, activate your network, and ensure your emergency fund is intact.", outcome: "Correct! Preparation and financial stability remove panic and give you options.", isCorrect: true },
      { id: "opt3", text: "Confront the CEO and demand to know if you are safe.", outcome: "Highly unprofessional and paints a target on your back.", isCorrect: false },
      { id: "opt4", text: "Assume you are indispensable and do nothing.", outcome: "No one is purely indispensable; failing to prepare is reckless.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "You receive a negative performance review that you feel is slightly unfair. How does a stability-focused professional react?",
    options: [
      { id: "opt2", text: "Listen objectively, ask how you can improve, and document your subsequent progress.", outcome: "Correct! Turning feedback into documented improvement solidifies your position.", isCorrect: true },
      { id: "opt1", text: "Argue aggressively with your manager during the review.", outcome: "Aggression validates the negative review and damages the relationship further.", isCorrect: false },
      { id: "opt3", text: "Quit on the spot out of pride.", outcome: "Quitting without a backup plan creates immediate financial and career instability.", isCorrect: false },
      { id: "opt4", text: "Internalize it, lose confidence, and detach from your work.", outcome: "Detachment lowers your performance, creating a self-fulfilling prophecy of failure.", isCorrect: false },
    ],
  },
];

const BadgeCareerStabilityAware = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  const gameId = "ehe-young-adult-30";
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
      title="Badge: Career Stability Aware"
      subtitle={
        showResult
          ? "Achievement unlocked! You understand early-career protection."
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
                  Stability: {score}/{totalStages}
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
                             {option.isCorrect ? 'Stability Maintained' : 'Risk Increased'}
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

export default BadgeCareerStabilityAware;
