import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You've just invested $50,000 in specialized machinery for your new business. The insurance premium is $2,000 a year. What is the smartest move?",
    options: [
      { id: "opt1", text: "Skip the insurance; $2,000 is too much money for a new business to spend.", outcome: "Incorrect. Skipping insurance leaves your entire $50,000 investment unprotected.", isCorrect: false },
      { id: "opt3", text: "Put $2,000 in a savings account instead to 'self-insure'.", outcome: "Incorrect. $2,000 in savings won't replace a $50,000 machine if it breaks tomorrow.", isCorrect: false },
      { id: "opt2", text: "Pay the premium; it's a necessary cost to protect against catastrophic loss.", outcome: "Correct! Insurance transfers the risk of a major loss away from your business.", isCorrect: true },
    ],
  },
  {
    id: 2,
    prompt: "Your business partner argues that 'insurance is a scam because we probably won't use it.' How do you respond?",
    options: [
      { id: "opt2", text: "Explain that we are paying for financial certainty and disaster prevention, not an investment return.", outcome: "Correct! The true value of insurance is knowing the worst-case scenario won't destroy the company.", isCorrect: true },
      { id: "opt1", text: "Agree and cancel the policy; probability is on our side.", outcome: "Incorrect. You don't buy insurance expecting to use it; you buy it so a single disaster doesn't bankrupt you.", isCorrect: false },
      { id: "opt3", text: "Tell them to shut up because you are the boss.", outcome: "Incorrect. Dismissing a partner's concern without explanation creates toxic leadership.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Six months later, a pipe bursts in the ceiling and completely ruins the machinery. What is your situation without insurance?",
    options: [
      { id: "opt1", text: "The manufacturer will replace it for free under the standard warranty.", outcome: "Incorrect. Standard warranties cover defects, not environmental damage like floods or fires.", isCorrect: false },
      { id: "opt2", text: "You must find $50,000 in cash immediately to replace it, or the business stops.", outcome: "Correct! Without insurance, you bear 100% of the financial burden for unexpected accidents.", isCorrect: true },
      { id: "opt3", text: "You can just get a quick bank loan to cover it since business is good.", outcome: "Incorrect. Banks rarely lend money to replace destroyed assets when the business has stopped operating.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "With the insurance policy in place, what happens after the pipe bursts?",
    options: [
      { id: "opt2", text: "The insurance company immediately sends you $100,000 as an apology.", outcome: "Incorrect. Insurance is strictly for indemnification (making you whole), not for profit.", isCorrect: false },
      { id: "opt3", text: "Your premium will instantly go up to $50,000 next year.", outcome: "Incorrect. Premiums may rise slightly after a claim, but not to the full value of the asset.", isCorrect: false },
      { id: "opt1", text: "You submit a claim, pay your deductible, and the insurance company covers the replacement cost.", outcome: "Correct! The policy protects your cash flow and allows the business to survive the disaster.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "What is the key takeaway regarding business insurance on critical assets?",
    options: [
      { id: "opt1", text: "It is an annoying tax that should be avoided if you are careful.", outcome: "Incorrect. It is impossible to be careful enough to prevent all natural disasters or accidents.", isCorrect: false },
      { id: "opt2", text: "It is a vital foundation of risk management that ensures long-term business survival.", outcome: "Correct! Responsible businesses always hedge against catastrophic risks they cannot absorb.", isCorrect: true },
      { id: "opt3", text: "It is only necessary for businesses that operate dangerous equipment.", outcome: "Incorrect. Even offices face risks like fire, theft, and liability lawsuits.", isCorrect: false },
    ],
  },
];

const DebateInsuranceCost = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  const gameId = "ehe-adults-66";
  const gameData = getGameDataById(gameId);
  // Default to 15 coins / 30 XP
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 15;
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 30;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages)); // 3 coins per question
  
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
      title="Debate: Insurance Cost"
      subtitle={
        showResult
          ? "Debate concluded! Paying the premium is the smart way to prevent major financial loss."
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

export default DebateInsuranceCost;
