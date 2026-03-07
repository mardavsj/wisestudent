import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You notice an executive presenting a strategy that has a clear flaw, but no one is speaking up. What is the strategic response?",
    options: [
      { id: "opt3", text: "Request a private follow-up. Frame your insight as a question rather than an attack: 'Have we considered how X impacts Y?'", outcome: "Correct! This protects their ego while constructively steering the company away from risk. True strategists influence without demanding credit.", isCorrect: true },
      { id: "opt1", text: "Speak up immediately in the large meeting to prove you are smarter than everyone.", outcome: "Publicly embarrassing an executive damages relationships and rarely results in the strategy changing.", isCorrect: false },
      { id: "opt2", text: "Say nothing. It's not your strategy, so it's not your problem if it fails.", outcome: "Allowing the company to fail when you see the flaw shows a lack of ownership and leadership.", isCorrect: false },
      { id: "opt4", text: "Complain to your peers after the meeting about how incompetent the leadership is.", outcome: "Complaining breeds a toxic culture and provides zero value to your career growth.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "You want to step into a management role, but currently have no direct reports. How do you prove you are ready?",
    options: [
      { id: "opt1", text: "Demand the title first, stating you can't be expected to lead without the authority.", outcome: "Titles formalize leadership; they don't create it. You must show the capability first.", isCorrect: false },
      { id: "opt2", text: "Wait for your boss to assign you a leadership task.", outcome: "Passive waiting is the opposite of strategic career growth.", isCorrect: false },
      { id: "opt3", text: "Take ownership of cross-functional projects, mentor junior staff informally, and solve team-wide bottlenecks.", outcome: "Correct! Leading through influence and taking initiative proves you are already functioning at a management level.", isCorrect: true },
      { id: "opt4", text: "Start bossing your peers around so they know you are in charge.", outcome: "Bossing peers without authority breeds resentment, not respect.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Your industry is undergoing massive technological shifts (e.g., AI automation). What is your strategic learning plan?",
    options: [
      { id: "opt1", text: "Ignore the trend. Your current skills have worked for 10 years, they will keep working.", outcome: "Refusing to adapt is the quickest path to obsolescence.", isCorrect: false },
      { id: "opt3", text: "Identify how to integrate the new technology into your existing expertise to become an amplified, modern specialist.", outcome: "Correct! The most valuable professionals combine deep domain knowledge with cutting-edge tools.", isCorrect: true },
      { id: "opt2", text: "Panic and completely switch careers immediately to follow the hype.", outcome: "Abandoning your foundational expertise for every new trend creates a scattered, unstable career.", isCorrect: false },
      { id: "opt4", text: "Wait for your company to organize a training seminar on the topic.", outcome: "Relying solely on your employer for your professional evolution is too slow and risky.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "You receive a job offer from a competitor that pays 15% more, but the culture seems slightly chaotic. What is your career strategy?",
    options: [
      { id: "opt1", text: "Always take the money immediately, regardless of the environment.", outcome: "A 15% raise is not worth burnout, stress, or a toxic environment that stunts long-term growth.", isCorrect: false },
      { id: "opt2", text: "Use the offer to threaten your current boss into matching the salary.", outcome: "Using an offer as a threat damages trust. Even if they match, they may start looking to replace you.", isCorrect: false },
      { id: "opt4", text: "Decline it immediately because change is scary.", outcome: "Fear is not a career strategy.", isCorrect: false },
      { id: "opt3", text: "Evaluate the long-term ROI: does the chaotic environment offer unparalleled learning, or is it just poorly managed? Decline if the growth potential is low.", outcome: "Correct! Strategic career moves prioritize long-term leverage, high-quality networks, and skill acquisition over short-term cash grabs.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "What is the core difference between a passive worker and a Career Growth Strategist?",
    options: [
      { id: "opt1", text: "The strategist works 80-hour weeks permanently to show dedication.", outcome: "Working excessively long hours usually indicates poor time management or a toxic workplace, not strategic thinking.", isCorrect: false },
      { id: "opt2", text: "The strategist focuses purely on networking and avoids actual hard work.", outcome: "Networking without underlying competence makes you a fraud, not a strategist.", isCorrect: false },
      { id: "opt3", text: "The strategist treats their career as a business: auditing skills, researching market demands, managing risks, and actively driving their progression.", outcome: "Correct! A strategist is the CEO of their own professional journey.", isCorrect: true },
      { id: "opt4", text: "The passive worker is happier, while the strategist is always miserable.", outcome: "Taking control of your career trajectory usually leads to greater fulfillment and autonomy.", isCorrect: false },
    ],
  },
];

const BadgeCareerGrowthStrategist = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  
  const gameId = "ehe-adults-20";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  
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
      title="Badge: Career Growth Strategist"
      subtitle={
        showResult
          ? "Achievement unlocked! You are a master career strategist."
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
                  Strategy: {score}/{totalStages}
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
                             {option.isCorrect ? 'Strategic Move' : 'Tactical Error'}
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

export default BadgeCareerGrowthStrategist;
