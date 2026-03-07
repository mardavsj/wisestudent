import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You've just launched your small business but haven't registered it yet to save money. A potential corporate client asks for your registration details to sign a contract. What do you do?",
    options: [
      { id: "opt1", text: "Tell them it's unnecessary for small businesses and they should just trust you.", outcome: "Incorrect. Large clients require legal compliance and documentation.", isCorrect: false },
      { id: "opt3", text: "Admit you aren't registered yet and quickly begin the formal registration process.", outcome: "Correct! Honesty and compliance build the foundation for long-term professional trust.", isCorrect: true },
      { id: "opt2", text: "Pretend you lost the paperwork and stall for time.", outcome: "Incorrect. Lying ruins trust immediately, which is fatal for a business.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Why is operating an unregistered business a significant long-term legal risk?",
    options: [
      { id: "opt1", text: "It leaves you personally liable for any business debts or lawsuits.", outcome: "Correct! Registration typically separates personal and business liability, protecting your assets.", isCorrect: true },
      { id: "opt2", text: "It guarantees that competitors will easily steal your customers.", outcome: "Incorrect. Registration doesn't stop competition, but it provides legal standing to protect your brand.", isCorrect: false },
      { id: "opt3", text: "It means you are required to pay double taxes later.", outcome: "Incorrect. While tax issues arise, unprotected personal liability is the most severe immediate risk.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "A friend advises you that 'staying under the radar' without legal registration is a smart early-stage hack to save money. How should you view this advice?",
    options: [
      { id: "opt1", text: "Great advice; you avoid paperwork and save some money upfront.", outcome: "Incorrect. These short-term savings create massive long-term vulnerability.", isCorrect: false },
      { id: "opt3", text: "Good advice, but only if you strictly take cash payments.", outcome: "Incorrect. Operating a shadow cash-business is illegal and destroys professional reputation.", isCorrect: false },
      { id: "opt2", text: "It's dangerous advice. Operating informally limits growth, funding, and exposes you to legal fines.", outcome: "Correct! True expansion requires a solid legal foundation from the start.", isCorrect: true },
    ],
  },
  {
    id: 4,
    prompt: "You need to open a dedicated business bank account to separate personal and company finances. What will the bank demand?",
    options: [
      { id: "opt2", text: "Official business registration documents and a tax identification number.", outcome: "Correct! Financial institutions strictly require proof of your business's legal entity status.", isCorrect: true },
      { id: "opt1", text: "Just a good pitch about your projected revenues.", outcome: "Incorrect. Banks are highly regulated and require legal documentation, not just pitches.", isCorrect: false },
      { id: "opt3", text: "A massive cash deposit upfront to bypass background checks.", outcome: "Incorrect. Legal paperwork is an absolute prerequisite, regardless of deposit size.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "How does legal registration impact the trust of potential investors and business partners?",
    options: [
      { id: "opt1", text: "It doesn't matter much; they only evaluate how innovative your product is.", outcome: "Incorrect. Investors invest capital into formal legal entities, not just innovative ideas.", isCorrect: false },
      { id: "opt3", text: "It demonstrates commitment, professionalism, and reduces their risk of association.", outcome: "Correct! Registration proves you are running a legitimate, trustworthy operation ready to scale.", isCorrect: true },
      { id: "opt2", text: "They usually prefer informal businesses so they can dictate all the terms.", outcome: "Incorrect. Legitimate investors demand strict legal compliance and transparent structure.", isCorrect: false },
    ],
  },
];

const DebateLegalRegistration = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  const gameId = "ehe-young-adult-36";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  
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
      title="Debate: Legal Registration"
      subtitle={
        showResult
          ? "Debate concluded! Legal registration builds the trust necessary to scale."
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
      gameType="ehe"
      nextGamePath={location.state?.nextGamePath}
      nextGameId={location.state?.nextGameId}
      backPath={location.state?.returnPath}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult && stage && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-slate-700 shadow-2xl relative overflow-hidden">
              
              {/* Podium aesthetic */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 to-indigo-600"></div>

              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8 border-b border-slate-700 pb-4">
                <span>Phase {progressLabel}</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Score: {score}/{totalStages}
                </span>
              </div>
              
              <div className="text-center mb-10">
                <span className="inline-block py-1 px-3 rounded-full bg-violet-900/50 text-violet-300 text-xs font-bold uppercase tracking-wider mb-4 border border-violet-500/30">
                  Topic of Debate
                </span>
                <p className="text-white text-xl md:text-2xl font-bold leading-relaxed">
                  "{stage.prompt}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "from-slate-800 to-slate-900 border-slate-700 hover:border-violet-500 hover:from-slate-800 hover:to-violet-900/40 text-slate-200";
                  
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

export default DebateLegalRegistration;
