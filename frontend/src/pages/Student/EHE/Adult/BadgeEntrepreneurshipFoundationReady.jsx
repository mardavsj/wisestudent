import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You are setting up the foundational legal structure for your new business. What is the most critical first step?",
    options: [
      { id: "opt1", text: "Skip registration to save money until the business is profitable.", outcome: "Operating illegally exposes you to massive personal and financial liability.", isCorrect: false },
      { id: "opt2", text: "Register the business entity properly and open a dedicated business bank account.", outcome: "Correct! Separating personal and business finances is the first rule of entrepreneurship.", isCorrect: true },
      { id: "opt3", text: "Mix personal and business funds in your checking account for easier tracking.", outcome: "Commingling funds creates tax nightmares and pierces the corporate veil.", isCorrect: false },
      { id: "opt4", text: "Spend your entire initial budget designing a perfect logo.", outcome: "A logo is meaningless if the foundational legal and financial structure is missing.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "You have your first viable product prototype. How should you approach the market?",
    options: [
      { id: "opt1", text: "Keep it a secret until it is 100% perfect to avoid someone stealing the idea.", outcome: "Waiting for perfection delays market feedback and drains your initial capital.", isCorrect: false },
      { id: "opt2", text: "Spend all your money on a massive advertising campaign before testing it.", outcome: "Scaling before validating the product leads to rapid financial burn.", isCorrect: false },
      { id: "opt3", text: "Launch a Minimum Viable Product (MVP) to a small group to gather real user feedback.", outcome: "Correct! Validating the idea with real users minimizes risk and guides development.", isCorrect: true },
      { id: "opt4", text: "Assume you know exactly what the customer wants without asking.", outcome: "Building without customer feedback is the fastest way to build something nobody wants.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Your startup needs funding to grow after the initial launch. What is the smartest approach?",
    options: [
      { id: "opt1", text: "Evaluate your actual capital needs and seek funding that aligns with your growth stage.", outcome: "Correct! Smart founders take only the capital they need to reach the next milestone.", isCorrect: true },
      { id: "opt2", text: "Sell 80% of your company immediately to the first investor who offers money.", outcome: "Giving up too much equity early leaves you with no control over your own business.", isCorrect: false },
      { id: "opt3", text: "Max out all your personal credit cards regardless of the interest rates.", outcome: "High-interest personal debt can ruin your personal life if the business fails.", isCorrect: false },
      { id: "opt4", text: "Borrow money from dangerous lenders just to scale quickly.", outcome: "Reckless borrowing destroys financial stability and foundational security.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "You are ready to hire your first team member. How do you make the decision?",
    options: [
      { id: "opt1", text: "Hire your best friend because you trust them, even if they lack the skills.", outcome: "Hiring based solely on friendship rather than competence damages early growth.", isCorrect: false },
      { id: "opt2", text: "Hire the cheapest person available to save money.", outcome: "Cheap labor often results in poor quality work that costs more to fix later.", isCorrect: false },
      { id: "opt3", text: "Hire someone whose skills complement your weaknesses and who fits the company culture.", outcome: "Correct! A strong foundational team covers blind spots and drives the vision forward.", isCorrect: true },
      { id: "opt4", text: "Do everything yourself forever to maintain total control.", outcome: "Failing to delegate leads to severe burnout and limits the business's potential.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Your first major competitor emerges in the market with a similar product. What is your reaction?",
    options: [
      { id: "opt1", text: "Panic and immediately slash your prices by 50%.", outcome: "Starting a price war destroys your profit margins and devalues your brand.", isCorrect: false },
      { id: "opt2", text: "Ignore them entirely and assume your customers will stay out of loyalty.", outcome: "Ignoring competition leads to complacency and loss of market share.", isCorrect: false },
      { id: "opt4", text: "Copy their exact marketing strategy word-for-word.", outcome: "Copying makes you appear unoriginal and fails to highlight your unique strengths.", isCorrect: false },
      { id: "opt3", text: "Analyze their offering, listen to your customers, and double down on your unique value proposition.", outcome: "Correct! Competition validates the market; focus on making your specific solution better.", isCorrect: true },
    ],
  },
];

const BadgeEntrepreneurshipFoundationReady = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  
  const gameId = "ehe-adults-50";
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
      title="Badge: Entrepreneurship Foundation Ready"
      subtitle={
        showResult
          ? "Achievement unlocked! You have mastered the foundational stages of entrepreneurship."
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

export default BadgeEntrepreneurshipFoundationReady;
