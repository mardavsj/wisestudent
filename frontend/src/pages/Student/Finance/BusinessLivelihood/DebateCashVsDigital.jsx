import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Should a small vendor completely avoid digital payments like UPI?",
    options: [
      { id: "opt1", text: "Yes, cash only avoids bank fees", outcome: "Cash only limits your customer base.", isCorrect: false },
      { id: "opt2", text: "No, a digital trail proves consistent income", outcome: "Correct. A digital trail is vital for loans and growth.", isCorrect: true },
      { id: "opt3", text: "It doesn't matter either way", outcome: "It matters a lot for business expansion.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Which method is better for tracking daily sales accurately?",
    options: [
      { id: "opt1", text: "Counting cash at the end of the day", outcome: "Easy to lose track of small expenses.", isCorrect: false },
      { id: "opt2", text: "Estimating based on remaining inventory", outcome: "Highly inaccurate way to measure cash flow.", isCorrect: false },
      { id: "opt3", text: "Checking the digital transaction history", outcome: "Correct. Digital apps auto-record every payment.", isCorrect: true },
    ],
  },
  {
    id: 3,
    prompt: "How does a digital trail impact getting a business loan?",
    options: [
      { id: "opt1", text: "Banks prefer businesses that deal in cash only", outcome: "Banks cannot verify cash-only income easily.", isCorrect: false },
      { id: "opt2", text: "A digital trail provides strong proof of cash flow", outcome: "Correct. Banks trust verified digital records.", isCorrect: true },
      { id: "opt3", text: "Digital payments make loans more expensive", outcome: "False. They often make getting loans easier and cheaper.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "What is a major risk of running a 100% cash-only business?",
    options: [
      { id: "opt2", text: "High risk of theft and counterfeit notes", outcome: "Correct. Cash is physically vulnerable.", isCorrect: true },
      { id: "opt1", text: "You have to pay higher taxes", outcome: "Taxes depend on profit, not just the payment method.", isCorrect: false },
      { id: "opt3", text: "Customers will buy more from you", outcome: "Actually, you lose customers who only carry phones.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Key Debate Conclusion: Cash vs Digital for Vendors",
    options: [
      { id: "opt2", text: "Cash is king and will always be the only safe way", outcome: "A risky approach in a modernizing economy.", isCorrect: false },
      { id: "opt3", text: "Refuse digital payments to avoid taxes completely", outcome: "Illegal and stops your business from scaling.", isCorrect: false },
      { id: "opt1", text: "Digital should be an option to build a verifiable financial trail", outcome: "Correct! Balance cash with digital to build proof for growth.", isCorrect: true },
    ],
  },
];

const DebateCashVsDigital = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  const gameId = "finance-business-livelihood-finance-12";
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
    }, 3500); // slightly longer delay for debate game to read outcome
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Debate: Cash vs Digital"
      subtitle={
        showResult
          ? "Debate concluded! Digital trails pave the way for growth."
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
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8 border-b border-slate-700 pb-4">
                <span>Phase {progressLabel}</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Score: {score}/{totalStages}
                </span>
              </div>
              
              <div className="text-center mb-10">
                <span className="inline-block py-1 px-3 rounded-full bg-indigo-900/50 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-500/30">
                  Topic of Debate
                </span>
                <p className="text-white text-xl md:text-2xl font-bold leading-relaxed">
                  "{stage.prompt}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  // Debate card styling
                  let baseStyle = "from-slate-800 to-slate-900 border-slate-700 hover:border-indigo-500 hover:from-slate-800 hover:to-indigo-900/40 text-slate-200";
                  
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
                          
                          {/* Reveal outcome with animation */}
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

export default DebateCashVsDigital;
