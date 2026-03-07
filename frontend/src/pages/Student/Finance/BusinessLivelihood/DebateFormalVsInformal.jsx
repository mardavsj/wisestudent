import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "A small tea-stall owner says: 'I earn ₹500 a day. Why should I register my business?'",
    options: [
      { id: "opt1", text: "He's right — registration is only for big companies", outcome: "Incorrect. Even micro-businesses benefit from registration through government schemes and bank access.", isCorrect: false },
      { id: "opt2", text: "Registration gives access to MSME loans, subsidies, and legal protection", outcome: "Correct! Registered businesses unlock financial tools that informal ones never can.", isCorrect: true },
      { id: "opt3", text: "Registration means higher taxes, so it's better to stay informal", outcome: "Incorrect. Micro-businesses often pay very low or zero taxes, while gaining huge benefits.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "A registered chai-wala applies for a ₹50,000 Mudra Loan. An unregistered one is rejected. Why?",
    options: [
      { id: "opt1", text: "Banks just like registered businesses more", outcome: "It's not about preference; banks need legal proof of business existence to lend.", isCorrect: false },
      { id: "opt3", text: "The unregistered vendor probably didn't dress well enough", outcome: "Incorrect. Banks assess documents and financial data, not appearance.", isCorrect: false },
      { id: "opt2", text: "Registration provides a legal identity the bank can verify and trust", outcome: "Correct! A registration certificate is proof the business exists and operates legally.", isCorrect: true },
    ],
  },
  {
    id: 3,
    prompt: "An informal vendor's cart is seized by municipal authorities. He has no paperwork. What happens?",
    options: [
      { id: "opt1", text: "He can fight it in court easily since everyone knows his stall", outcome: "Incorrect. Courts need registered documentation; community knowledge isn't legal evidence.", isCorrect: false },
      { id: "opt2", text: "He loses everything because he has no legal proof of his business", outcome: "Correct! Without registration, there is no legal claim to the business location or assets.", isCorrect: true },
      { id: "opt3", text: "The police will return his cart after a week automatically", outcome: "Incorrect. There is no automatic process; legal recourse requires legal standing.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "A registered tea-stall owner gets a 'Food License' (FSSAI). How does this help his brand?",
    options: [
      { id: "opt2", text: "Customers see the license and trust the hygiene and quality standards", outcome: "Correct! An FSSAI license builds consumer confidence and differentiates the stall.", isCorrect: true },
      { id: "opt1", text: "It makes the tea taste better", outcome: "Incorrect. Licenses don't change recipes, but they signal safety and quality.", isCorrect: false },
      { id: "opt3", text: "It has no real impact on a small stall", outcome: "Incorrect. Even for small stalls, visible compliance signals professionalism.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Final Verdict: Should a small tea-stall register its business?",
    options: [
      { id: "opt1", text: "Yes — registration unlocks loans, legal protection, and customer trust", outcome: "Correct! The benefits of formalisation far outweigh the small effort to register.", isCorrect: true },
      { id: "opt2", text: "No — it's too much paperwork for a small stall", outcome: "Incorrect. MSME registration is simple, often free, and can be done online in minutes.", isCorrect: false },
      { id: "opt3", text: "Only if the stall earns more than ₹10 lakh per year", outcome: "Incorrect. There is no minimum income requirement for basic registration benefits.", isCorrect: false },
    ],
  },
];

const DebateFormalVsInformal = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  // Registering at index 28
  const gameId = "finance-business-livelihood-finance-28";
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
      title="Debate: Formal vs Informal"
      subtitle={
        showResult
          ? "Debate concluded! Formalisation empowers even the smallest businesses."
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
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 to-orange-600"></div>

              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8 border-b border-slate-700 pb-4">
                <span>Phase {progressLabel}</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Score: {score}/{totalStages}
                </span>
              </div>
              
              <div className="text-center mb-10">
                <span className="inline-block py-1 px-3 rounded-full bg-amber-900/50 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/30">
                  Topic of Debate
                </span>
                <p className="text-white text-xl md:text-2xl font-bold leading-relaxed">
                  "{stage.prompt}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "from-slate-800 to-slate-900 border-slate-700 hover:border-amber-500 hover:from-slate-800 hover:to-amber-900/40 text-slate-200";
                  
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

export default DebateFormalVsInformal;
