import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You are balancing a full-time job and a side business. Both start demanding more time. What is the strategic approach?",
    options: [
      { id: "opt1", text: "Work 100 hours a week until you burn out completely and fail at both.", outcome: "Unsustainable effort leads to physical and professional collapse.", isCorrect: false },
      { id: "opt3", text: "Automate/outsource parts of the business or negotiate flexible hours at work until the business can replace your salary securely.", outcome: "Correct! Strategic scaling involves mitigating risk while preserving baseline financial stability.", isCorrect: true },
      { id: "opt2", text: "Quit your secure full-time job immediately to focus on the side business before it's profitable.", outcome: "Prematurely cutting off your primary income source introduces massive, unnecessary risk.", isCorrect: false },
      { id: "opt4", text: "Abandon the side business because it is too stressful.", outcome: "Quitting at the first sign of friction prevents long-term wealth building.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "You want to pursue a costly Master's degree but are also trying to save for your first home. How do you decide?",
    options: [
      { id: "opt1", text: "Take out massive loans for the degree and assume you'll figure out the house later.", outcome: "Ignoring total debt load will likely permanently delay your homeownership goals.", isCorrect: false },
      { id: "opt2", text: "Give up on the degree entirely and focus only on saving cash.", outcome: "Sacrificing long-term earning potential for short-term savings can stunt your career growth.", isCorrect: false },
      { id: "opt3", text: "Calculate the exact ROI of the degree. Explore employer-sponsored tuition models or part-time schooling to protect your savings rate.", outcome: "Correct! Integrating education and financial goals requires rigorous ROI calculations and finding creative leverage.", isCorrect: true },
      { id: "opt4", text: "Buy a house you can barely afford and then take out personal loans for the degree.", outcome: "This guarantees a debt spiral and severe financial fragility.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Your startup is failing, and your industry skills are becoming quickly outdated. What is your pivot strategy?",
    options: [
      { id: "opt1", text: "Keep pouring personal money into the failing startup out of stubbornness.", outcome: "Sunk cost fallacy destroys wealth rapidly.", isCorrect: false },
      { id: "opt3", text: "Hide the failure on your resume and pretend you have just been 'traveling'.", outcome: "Gaps are fine, but lying or hiding entrepreneurial experience wastes a valuable narrative of resilience.", isCorrect: false },
      { id: "opt4", text: "Blame your co-founders and decide to never work hard again.", outcome: "Bitterness and passivity guarantee long-term stagnation.", isCorrect: false },
      { id: "opt2", text: "Close the startup, objectively assess the market, aggressively reskill for high-demand roles, and re-enter the corporate workforce stronger.", outcome: "Correct! Recognizing failure early and pivoting via targeted education is a master-level career move.", isCorrect: true },
    ],
  },
  {
    id: 4,
    prompt: "You are offered a high-paying corporate job you hate, or a lower-paying role at an early-stage startup with equity. How do you assess?",
    options: [
      { id: "opt3", text: "Evaluate your current risk tolerance, financial runway, the realistic value of the equity, and the learning potential of both roles.", outcome: "Correct! Career decisions require a holistic analysis of risk, reward, and life stage.", isCorrect: true },
      { id: "opt1", text: "Always take the highest immediate cash offer regardless of the work environment.", outcome: "High pay cannot compensate for complete misery and burnout.", isCorrect: false },
      { id: "opt2", text: "Always take the startup role because they said it will be a 'unicorn'.", outcome: "Blindly trusting startup equity without analyzing their financials or market traction is gambling.", isCorrect: false },
      { id: "opt4", text: "Take neither and wait for the 'perfect' opportunity.", outcome: "Perfect opportunities don't exist; you must step into the arena and adapt.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "What is the ultimate marker of young adult strategic thinking?",
    options: [
      { id: "opt1", text: "Becoming a millionaire by age 25.", outcome: "Arbitrary age-based financial goals often encourage reckless risk-taking rather than sustainable strategy.", isCorrect: false },
      { id: "opt2", text: "Never failing at any business or career endeavor.", outcome: "Zero failure means you are taking zero meaningful risks.", isCorrect: false },
      { id: "opt3", text: "The ability to align education, career progression, and personal finance into a single, cohesive, adaptable life strategy.", outcome: "Correct! Mastery is systems-level thinking, where every domain supports the others resiliently.", isCorrect: true },
      { id: "opt4", text: "Having the most impressive-sounding job title in your social circle.", outcome: "Optimizing for ego and titles rather than fulfillment and leverage is a common trap.", isCorrect: false },
    ],
  },
];

const BadgeYoungAdultStrategicThinker = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  
  const gameId = "ehe-young-adult-100";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 20;
  // User requested 4 coins per question
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
      title="Badge: Young Adult Strategic Thinker"
      subtitle={
        showResult
          ? "Mastery Checkpoint complete! You think in systems."
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
            <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-fuchsia-500/30 shadow-[0_0_40px_rgba(217,70,239,0.15)] overflow-hidden relative">
              
              {/* Premium aesthetic background */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-fuchsia-500/5 to-purple-900/20 pointer-events-none"></div>
              
              {/* Animated scanning line effect */}
              <div className="absolute left-0 top-0 w-full h-[2px] bg-fuchsia-500/50 blur-sm animate-[scan_4s_ease-in-out_infinite]"></div>

              <div className="flex items-center justify-between text-sm font-bold uppercase tracking-[0.2em] text-fuchsia-400 mb-6 border-b border-fuchsia-500/30 pb-4 relative z-10">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse"></span>
                  Decision {progressLabel}
                </span>
                <span className="bg-fuchsia-500/10 px-3 py-1 rounded border border-fuchsia-500/30">
                  Strategic Thinking: {score}/{totalStages}
                </span>
              </div>
              
              <div className="bg-black/40 rounded-2xl p-6 mb-8 border border-fuchsia-500/20 shadow-inner relative z-10">
                <p className="text-white text-xl md:text-2xl font-serif leading-relaxed">
                  {stage.prompt}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "bg-slate-800 border-slate-700 hover:border-fuchsia-400 hover:bg-slate-700 text-slate-200";
                  
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
                             {option.isCorrect ? 'Master Strategy' : 'Critical Misstep'}
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

export default BadgeYoungAdultStrategicThinker;
