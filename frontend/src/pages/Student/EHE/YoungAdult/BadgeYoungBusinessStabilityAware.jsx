import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Your business is making good revenue, but you mix personal and business funds in one bank account. What is the biggest risk?",
    options: [
      { id: "opt1", text: "It's fine as long as you keep mental track of it.", outcome: "Mental accounting leads to inevitable financial confusion and legal issues.", isCorrect: false },
      { id: "opt2", text: "There is no risk because you own the business 100%.", outcome: "Mixing funds breaks the legal separation of risk, known as 'piercing the corporate veil'.", isCorrect: false },
      { id: "opt3", text: "You can easily withdraw cash for personal vacations anytime.", outcome: "Treating business revenue as a personal piggy bank starves the company of operating capital.", isCorrect: false },
      { id: "opt4", text: "It completely destroys financial tracking, ruins tax preparation, and creates severe legal liability.", outcome: "Correct! Strict separation of personal and business accounts is the foundation of financial health.", isCorrect: true },
    ],
  },
  {
    id: 2,
    prompt: "You experience an unexpected drop in sales for two months. How should your business survive?",
    options: [
      { id: "opt1", text: "Immediately take out high-interest personal loans to cover business rent.", outcome: "Covering operational losses with personal debt can destroy your personal financial future.", isCorrect: false },
      { id: "opt2", text: "Rely on the 3-6 months of business cash reserves you aggressively built during profitable months.", outcome: "Correct! Cash reserves are the only defense against inevitable business cycles.", isCorrect: true },
      { id: "opt3", text: "Ignore it and hope sales randomly improve next month.", outcome: "Hope is not a financial strategy; running out of cash kills businesses.", isCorrect: false },
      { id: "opt4", text: "Stop answering the phone when suppliers call for payment.", outcome: "Ignoring debts destroys your business credit and vendor relationships.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Tax season is approaching, and you haven't saved any of your profits for taxes. What is the likely result?",
    options: [
      { id: "opt1", text: "You face massive penalties, cash flow crisis, and potential legal action.", outcome: "Correct! Failing to allocate for taxes systematically destroys businesses during audit season.", isCorrect: true },
      { id: "opt2", text: "The government will understand and let you pay whenever you have money.", outcome: "Tax authorities do not offer casual leniency; they issue heavy fines for non-payment.", isCorrect: false },
      { id: "opt3", text: "You can simply declare that you didn't know the rules to avoid paying.", outcome: "Ignorance of tax law is never a valid defense.", isCorrect: false },
      { id: "opt4", text: "You won't have to pay taxes because your business is still small.", outcome: "Taxes are owed on profit regardless of how small the business is.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "A bank offers you a large business expansion loan. When should you accept it?",
    options: [
      { id: "opt1", text: "Accept it immediately because extra cash is always a good thing.", outcome: "Unnecessary debt creates fixed monthly payments that choke your cash flow.", isCorrect: false },
      { id: "opt2", text: "Only when you have a clear, data-backed ROI model that proves the loan generates more profit than its interest cost.", outcome: "Correct! Debt should only be used as leverage for guaranteed growth, not for survival.", isCorrect: true },
      { id: "opt3", text: "Accept it to buy expensive luxury office furniture to impress clients.", outcome: "Financing non-revenue generating assets with debt is a fatal mistake.", isCorrect: false },
      { id: "opt4", text: "Use it to cover your monthly personal living expenses.", outcome: "Using business loans for personal lifestyle inflation is illegal and dangerous.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "You do not have a written agreement with your co-founder or main supplier. What risk are you ignoring?",
    options: [
      { id: "opt1", text: "None, because verbal agreements and handshakes are legally bulletproof.", outcome: "Verbal agreements are notoriously difficult to enforce and often lead to 'he said, she said' disputes.", isCorrect: false },
      { id: "opt2", text: "A minor misunderstanding that can easily be resolved over coffee.", outcome: "Without a contract, misunderstandings often escalate into hostile legal battles.", isCorrect: false },
      { id: "opt3", text: "A massive vulnerability where disputes over equity, payments, or responsibilities can instantly shut down operations.", outcome: "Correct! Clear legal contracts protect the business from human unpredictability.", isCorrect: true },
      { id: "opt4", text: "Written agreements show a lack of trust, which ruins relationships.", outcome: "In business, written agreements actually build trust through complete transparency.", isCorrect: false },
    ],
  },
];

const BadgeYoungBusinessStabilityAware = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  
  const gameId = "ehe-young-adult-60";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 15;
  // User requested 3 coins per question
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
      title="Badge: Young Business Stability Aware"
      subtitle={
        showResult
          ? "Achievement unlocked! You understand business stability."
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
            <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)] overflow-hidden relative">
              
              {/* Premium aesthetic background */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-emerald-500/5 to-teal-900/20 pointer-events-none"></div>
              
              {/* Animated scanning line effect */}
              <div className="absolute left-0 top-0 w-full h-[2px] bg-emerald-500/50 blur-sm animate-[scan_4s_ease-in-out_infinite]"></div>

              <div className="flex items-center justify-between text-sm font-bold uppercase tracking-[0.2em] text-emerald-400 mb-6 border-b border-emerald-500/30 pb-4 relative z-10">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Decision {progressLabel}
                </span>
                <span className="bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/30">
                  Risk Assessment: {score}/{totalStages}
                </span>
              </div>
              
              <div className="bg-black/40 rounded-2xl p-6 mb-8 border border-emerald-500/20 shadow-inner relative z-10">
                <p className="text-white text-xl md:text-2xl font-serif leading-relaxed">
                  {stage.prompt}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "bg-slate-800 border-slate-700 hover:border-emerald-400 hover:bg-slate-700 text-slate-200";
                  
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

export default BadgeYoungBusinessStabilityAware;
