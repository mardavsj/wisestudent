import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You want to start a new business. What is the most crucial first step?",
    options: [
      { id: "opt1", text: "Write a 50-page business plan without talking to anyone.", outcome: "Plans based on assumptions often fail. You need real-world data first.", isCorrect: false },
      { id: "opt2", text: "Register a corporation immediately before having a product.", outcome: "Legal registration is premature before validating the concept.", isCorrect: false },
      { id: "opt3", text: "Validate the problem and market demand before spending significant money.", outcome: "Correct! Ensuring people actually want your solution is the true foundation of a startup.", isCorrect: true },
      { id: "opt4", text: "Borrow heavily from family to build a 'perfect' first version.", outcome: "Over-investing before validation is a massive and unnecessary risk.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "You and a friend decide to co-found the company. How should you handle ownership and responsibilities?",
    options: [
      { id: "opt1", text: "Shake hands and split everything 50/50 verbally to prove you trust each other.", outcome: "Verbal agreements lead to severe disputes and legal trouble later.", isCorrect: false },
      { id: "opt2", text: "Wait until the company makes a million dollars to discuss ownership.", outcome: "Delaying equity discussions breeds resentment and misalignment.", isCorrect: false },
      { id: "opt3", text: "Assume you will own 100% because it was originally your idea.", outcome: "Ideas are cheap; execution matters. Co-founders who execute deserve equity.", isCorrect: false },
      { id: "opt4", text: "Draft a clear founders' agreement outlining roles, equity vesting, and exit scenarios.", outcome: "Correct! Clear legal boundaries protect both the friendship and the business.", isCorrect: true },
    ],
  },
  {
    id: 3,
    prompt: "You need funding to build your initial prototype (MVP). What is the safest early-stage approach?",
    options: [
      { id: "opt1", text: "Bootstrap using savings or secure small grants that don't require personal debt.", outcome: "Correct! Keeping personal debt low in the early stages preserves your financial safety.", isCorrect: true },
      { id: "opt2", text: "Max out multiple personal credit cards.", outcome: "High-interest personal debt can destroy your financial future if the startup fails.", isCorrect: false },
      { id: "opt3", text: "Take out a massive, high-interest personal loan against your home.", outcome: "Risking your primary shelter for an unproven startup is highly dangerous.", isCorrect: false },
      { id: "opt4", text: "Try to get a hundred million dollars from a massive private equity firm immediately.", outcome: "Firms will not invest massive sums without immense traction and data.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "Your first version of the product is usable but has some minor visual flaws. What is the best move?",
    options: [
      { id: "opt1", text: "Delay the launch for 6 months until it is absolutely perfect.", outcome: "Perfectionism delays valuable customer feedback and drains your cash.", isCorrect: false },
      { id: "opt2", text: "Launch it to a small group of early adopters to gather feedback and iterate quickly.", outcome: "Correct! Reid Hoffman said, 'If you are not embarrassed by the first version of your product, you’ve launched too late.'", isCorrect: true },
      { id: "opt3", text: "Scrap the project entirely because it doesn't look like an Apple product.", outcome: "Giving up over minor flaws shows a lack of resilience.", isCorrect: false },
      { id: "opt4", text: "Spend your entire budget on a massive global marketing launch.", outcome: "Marketing a flawed, untested product wastes money and burns your brand reputation.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "After launching, a customer complains loudly about a missing feature. How do you react?",
    options: [
      { id: "opt1", text: "Ignore them; they are just one complaining customer.", outcome: "Ignoring feedback early on blinds you to potential product-market fit issues.", isCorrect: false },
      { id: "opt2", text: "Argue with them and explain why they don't understand your brilliant product.", outcome: "Arguing destroys customer goodwill and prevents you from learning.", isCorrect: false },
      { id: "opt4", text: "Immediately drop everything and spend 3 months building that exact feature.", outcome: "Building every single requested feature without validation causes product bloat.", isCorrect: false },
      { id: "opt3", text: "Thank them for the feedback, log the request, and see if other customers want the same thing.", outcome: "Correct! Founders must treat feedback as data, not personal attacks.", isCorrect: true },
    ],
  },
];

const BadgeStartupBeginnerReady = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  const gameId = "ehe-young-adult-40";
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
      title="Badge: Startup Beginner Ready"
      subtitle={
        showResult
          ? "Achievement unlocked! You understand startup basics."
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
            <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.15)] overflow-hidden relative">
              
              {/* Premium aesthetic background */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-purple-500/5 to-fuchsia-900/20 pointer-events-none"></div>
              
              {/* Animated scanning line effect */}
              <div className="absolute left-0 top-0 w-full h-[2px] bg-purple-500/50 blur-sm animate-[scan_4s_ease-in-out_infinite]"></div>

              <div className="flex items-center justify-between text-sm font-bold uppercase tracking-[0.2em] text-purple-400 mb-6 border-b border-purple-500/30 pb-4 relative z-10">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                  Decision {progressLabel}
                </span>
                <span className="bg-purple-500/10 px-3 py-1 rounded border border-purple-500/30">
                  Foundation: {score}/{totalStages}
                </span>
              </div>
              
              <div className="bg-black/40 rounded-2xl p-6 mb-8 border border-purple-500/20 shadow-inner relative z-10">
                <p className="text-white text-xl md:text-2xl font-serif leading-relaxed">
                  {stage.prompt}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "bg-slate-800 border-slate-700 hover:border-purple-400 hover:bg-slate-700 text-slate-200";
                  
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
                             {option.isCorrect ? 'Sound Decision' : 'Critical Misstep'}
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

export default BadgeStartupBeginnerReady;
