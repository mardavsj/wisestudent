import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Your team missed a major project deadline due to a miscommunication. How do you address it?",
    options: [
      { id: "opt2", text: "Take responsibility as the leader, analyze the root cause, and implement a new communication protocol.", outcome: "Correct! True leaders take accountability for team failures and focus on systemic improvements.", isCorrect: true },
      { id: "opt1", text: "Blame the team members involved to protect your reputation.", outcome: "Blaming your team destroys trust and marks you as an unaccountable leader.", isCorrect: false },
      { id: "opt3", text: "Ignore the issue and hope upper management doesn't notice.", outcome: "Ignoring failures prevents growth and guarantees the mistake will be repeated.", isCorrect: false },
      { id: "opt4", text: "Complain about unrealistic deadlines to anyone who will listen.", outcome: "Complaining without presenting solutions appears unprofessional and defensive.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "A client complains about a bug in a feature developed by a junior team member. What is your response?",
    options: [
      { id: "opt1", text: "Tell the client exactly which junior developer made the mistake.", outcome: "Throwing your team members under the bus is a major leadership failure.", isCorrect: false },
      { id: "opt3", text: "Fix it yourself secretly so no one finds out about the junior developer's mistake.", outcome: "Fixing it secretly prevents the junior developer from learning and improving.", isCorrect: false },
      { id: "opt4", text: "Argue with the client that it's a feature, not a bug.", outcome: "Being defensive against valid feedback ruins client relationships.", isCorrect: false },
      { id: "opt2", text: "Apologize to the client on behalf of the team and privately guide the junior developer to fix it.", outcome: "Correct! Shield your team externally while coaching them internally.", isCorrect: true },
    ],
  },
  {
    id: 3,
    prompt: "You discover a highly profitable strategy your team uses is slightly unethical but technically legal. What do you do?",
    options: [
      { id: "opt2", text: "Keep using it since it's technically legal and makes money.", outcome: "Unethical practices, even if legal, eventually destroy your company's reputation.", isCorrect: false },
      { id: "opt3", text: "Let the team continue but pretend you don't know about it to avoid liability.", outcome: "Plausible deniability is a cowardly leadership trait that enables corruption.", isCorrect: false },
      { id: "opt1", text: "Halt the strategy and pivot to a fully ethical approach, even if it temporarily reduces profit.", outcome: "Correct! Ethical leadership prioritizes long-term integrity over short-term gains.", isCorrect: true },
      { id: "opt4", text: "Use it to get promoted quickly before anyone else notices.", outcome: "Building your career on unethical foundations always backfires.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "A high-performing team member is constantly disrespecting other colleagues. How do you handle this?",
    options: [
      { id: "opt1", text: "Ignore it because their performance is too valuable to lose.", outcome: "Tolerating toxicity destroys overall team morale, leading to higher turnover.", isCorrect: false },
      { id: "opt3", text: "Address the behavior directly, making it clear that respect is non-negotiable despite their performance.", outcome: "Correct! A responsible leader enforces cultural standards as strictly as performance metrics.", isCorrect: true },
      { id: "opt2", text: "Fire them immediately without any warning.", outcome: "Firing without warning or coaching is poor management and legally risky.", isCorrect: false },
      { id: "opt4", text: "Join in on making fun of colleagues to bond with the high-performer.", outcome: "Participating in toxic behavior is the quickest way to lose all respect as a leader.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "You must choose between giving your team credit for a major success or taking the spotlight yourself. What is your choice?",
    options: [
      { id: "opt2", text: "Share the spotlight and explicitly highlight the specific contributions of your team members.", outcome: "Correct! Great leaders amplify their team's success, which naturally reflects well on their leadership.", isCorrect: true },
      { id: "opt1", text: "Take all the credit to secure your own promotion faster.", outcome: "Stealing credit alienates your team and makes them unwilling to work hard for you again.", isCorrect: false },
      { id: "opt3", text: "Downplay the success so expectations aren't too high next time.", outcome: "Downplaying wins demoralizes the team and hides their value from the organization.", isCorrect: false },
      { id: "opt4", text: "Give credit to only your favorite team member.", outcome: "Playing favorites creates resentment and destroys team cohesion.", isCorrect: false },
    ],
  },
];

const BadgeResponsibleLeader = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  
  const gameId = "ehe-adults-40";
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
      title="Badge: Responsible Leader"
      subtitle={
        showResult
          ? "Achievement unlocked! You are a master of responsible leadership."
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

export default BadgeResponsibleLeader;
