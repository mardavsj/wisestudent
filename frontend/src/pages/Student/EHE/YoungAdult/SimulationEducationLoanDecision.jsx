import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "You are considering a massive loan for higher studies. How should you base your final decision?",
    options: [
      {
        id: "opt1",
        text: "Make the decision based entirely on the university's marketing materials.",
        outcome: "Incorrect. Marketing materials highlight the best-case scenarios and rarely explain the financial burden.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Make the decision based on what your peers are doing.",
        outcome: "Incorrect. Your peers' financial situations and career goals are different from yours.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Calculate repayment capacity and the realistic career return on investment (ROI).",
        outcome: "Correct! You must quantify the expected entry-level salary against the monthly loan payment.",
        isCorrect: true,
      },
      {
        id: "opt4",
        text: "Assume you will figure out the repayment after you graduate.",
        outcome: "Incorrect. Delaying financial planning leads to post-graduation debt traps and stress.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "The loan officer offers you a choice between a 5-year repayment plan and a 15-year repayment plan. Which is better?",
    options: [
      {
        id: "opt3",
        text: "Evaluate your expected post-graduation budget to find the shortest term you can comfortably afford.",
        outcome: "Correct! The goal is to minimize total interest paid while ensuring the monthly payment is sustainable.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Always take the 15-year plan to keep monthly payments as low as possible.",
        outcome: "Incorrect. While payments are lower, you will pay drastically more in compounded interest over 15 years.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Always take the 5-year plan regardless of your salary.",
        outcome: "Incorrect. If the 5-year monthly payment exceeds your starting salary, you will default.",
        isCorrect: false,
      },
      
      {
        id: "opt4",
        text: "Let the bank choose what is best for you.",
        outcome: "Incorrect. Banks profit from longer terms; their incentives do not align with yours.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "You find a similar degree program at a state university that costs 60% less than the prestigious private college. What do you do?",
    options: [
      {
        id: "opt1",
        text: "Ignore the state university. Only expensive private colleges guarantee success.",
        outcome: "Incorrect. Success depends heavily on your skills, networking, and experience, not just the brand name.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Research the employment outcomes for both programs to compare their true ROI.",
        outcome: "Correct! If both programs lead to similar starting salaries, the cheaper option offers a vastly superior ROI.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Choose the private college because taking on more debt will motivate you to work harder.",
        outcome: "Incorrect. Crushing debt causes stress and limits your early-career choices, it is not a positive motivator.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Drop out entirely; education is a scam.",
        outcome: "Incorrect. Strategic education is valuable, but it must be priced correctly.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "You graduate and get your first job. Your monthly take-home pay is ₹40,000, and your loan EMI is ₹25,000. How do you manage this?",
    options: [
      {
        id: "opt1",
        text: "Ignore the loan payments for a few months until you get a raise.",
        outcome: "Incorrect. Defaulting destroys your credit score and incurs heavy penalties.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Take out a new personal loan to pay the education loan EMI.",
        outcome: "Incorrect. Using debt to pay debt creates a catastrophic spiral.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Ask your employer to pay your loan directly.",
        outcome: "Incorrect. Unless negotiated as a specific benefit during hiring, employers are not responsible for your personal debts.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Live on ₹15,000 while desperately seeking extra income streams or a higher paying job.",
        outcome: "Correct! This is a painful debt-to-income ratio (62%), requiring extreme frugality and urgent income growth.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 5,
    prompt: "Before signing the final loan documents, what is the most important technical detail to verify?",
    options: [
      {
        id: "opt1",
        text: "Whether the interest rate is fixed or floating, and the exact penalty for early repayment.",
        outcome: "Correct! Floating rates can increase your payments unexpectedly, and prepayment penalties prevent you from saving money if you get a bonus.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "The color of the folder the bank puts the documents in.",
        outcome: "Incorrect. That is irrelevant to the financial reality.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Assuming the bank manager verbally promised a low rate, you don't need to read the contract.",
        outcome: "Incorrect. Verbal promises mean absolutely nothing if they are not in the legally binding contract.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Making sure the loan requires you to buy the bank's expensive insurance product.",
        outcome: "Incorrect. Bundled insurance products are often unnecessary and overpriced.",
        isCorrect: false,
      },
    ],
  },
];

const SimulationEducationLoanDecision = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-63";
  const gameData = getGameDataById(gameId);
  const totalStages = SIMULATION_STAGES.length;

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 15;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 30;
  
  const stage = SIMULATION_STAGES[currentStageIndex];

  const handleChoice = (option) => {
    if (selectedChoice || !stage) return;
    setSelectedChoice(option);

    if (option.isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentStageIndex === totalStages - 1) {
      setTimeout(() => {
        setShowResult(true);
      }, 1200);
    }
  };

  const handleNextStage = () => {
    if (!selectedChoice) return;
    if (currentStageIndex === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrentStageIndex((prev) => prev + 1);
    }
    setSelectedChoice(null);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Simulation: Education Loan Decision"
      subtitle={
        showResult
          ? "Simulation complete! You successfully navigated complex loan decisions."
          : `Scenario Step ${currentStageIndex + 1} of ${totalStages}`
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
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border-2 border-teal-500/30 shadow-2xl relative overflow-hidden">
               
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-teal-300 mb-6 relative z-10 border-b border-teal-500/20 pb-4">
                <span>Task {progressLabel}</span>
                <span className="bg-teal-950/80 px-4 py-1.5 rounded shadow-sm border border-teal-500/30">
                  Score: {score}/{totalStages}
                </span>
              </div>

              <div className="bg-gradient-to-br from-teal-950/80 to-slate-900/80 p-6 rounded-2xl border-l-4 border-teal-500 mb-8 shadow-inner relative z-10">
                 <p className="text-white text-xl md:text-2xl font-serif leading-relaxed italic">
                   {stage.prompt}
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  let baseStyle = "from-slate-800 to-teal-950 border-teal-500/30 hover:border-teal-400 hover:from-slate-700 hover:to-teal-900 text-slate-200";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "from-emerald-900 to-emerald-800 border-emerald-400 ring-4 ring-emerald-500/30 scale-[1.03] text-emerald-50 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                      : "from-rose-900 to-rose-800 border-rose-400 ring-4 ring-rose-500/30 scale-[1.03] text-rose-50 shadow-[0_0_20px_rgba(244,63,94,0.3)]";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "from-emerald-950 to-emerald-900 border-emerald-500/50 text-emerald-200/70";
                  } else if (selectedChoice && !isSelected) {
                    baseStyle = "from-slate-900 to-slate-900 border-slate-700 opacity-40 text-slate-500";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative rounded-2xl bg-gradient-to-r ${baseStyle} border-2 p-5 text-left font-medium transition-all min-h-[110px] flex items-center disabled:cursor-not-allowed text-lg`}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {selectedChoice && (
          <div className="animate-fade-in-up max-w-3xl mx-auto mt-6">
            <div className={`rounded-xl border-l-[6px] p-6 text-lg shadow-xl bg-slate-900/95 ${selectedChoice.isCorrect ? 'border-emerald-500 text-emerald-100' : 'border-rose-500 text-rose-100'}`}>
              <span className={`block font-bold text-sm uppercase tracking-widest mb-2 ${selectedChoice.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                {selectedChoice.isCorrect ? 'Financially Sound' : 'Costly Mistake'}
              </span> 
              <span className="font-serif italic leading-relaxed">{selectedChoice.outcome}</span>
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 text-white font-bold tracking-wide shadow-[0_5px_20px_rgba(20,184,166,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all text-lg"
                >
                  <span className="flex items-center gap-2">
                    Next Step <span>→</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default SimulationEducationLoanDecision;
