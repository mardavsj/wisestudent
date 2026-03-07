import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "You receive an offer for a massive education loan for higher studies. How do you decide whether to take it?",
    options: [
      {
        id: "opt1",
        text: "Accept immediately for the social prestige.",
        outcome: "Incorrect. Prestige doesn't pay the bills; high debt without a plan is dangerous.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Ignore the cost because education is always worth it.",
        outcome: "Incorrect. Not all education guarantees a high-paying job. You must consider the cost.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Calculate Return on Investment (ROI) & repayment capacity.",
        outcome: "Correct! Evaluating the ROI and your future ability to repay is a smart financial decision.",
        isCorrect: true,
      },
      {
        id: "opt4",
        text: "Take the loan and plan to figure out repayment later.",
        outcome: "Incorrect. Ignoring the future financial burden leads to severe stress and possible default.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Before signing the loan agreement, the bank presents the interest rates. What should your primary focus be?",
    options: [
      {
        id: "opt1",
        text: "Only look at the monthly payment amount.",
        outcome: "Incorrect. A low monthly payment might mean a longer term and much higher total interest.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Compare fixed vs. variable interest rates and understand the total cost over the life of the loan.",
        outcome: "Correct! Knowing the total cost helps you choose the most economical option long-term.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Just sign it; the bank knows what's best.",
        outcome: "Incorrect. The bank's goal is to make money, not to save you money.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Ask for the maximum possible amount just in case.",
        outcome: "Incorrect. Borrowing more than necessary unnecessarily increases your interest burden.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "You are now studying and have received your loan disbursement. How do you manage your living expenses?",
    options: [
      {
        id: "opt1",
        text: "Use the loan money for a luxury lifestyle.",
        outcome: "Incorrect. Using borrowed money for luxuries is a direct path to financial ruin.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Spend freely, assuming your future high-paying job will cover it.",
        outcome: "Incorrect. Future income is not guaranteed, but your debt certainly is.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Borrow more money from friends to maintain a high status.",
        outcome: "Incorrect. Accumulating more debt from peers will destroy your personal relationships.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Stick to a strict budget, use the loan only for necessities, and minimize extra debt.",
        outcome: "Correct! Living frugally while studying keeps your principal debt as low as possible.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "Graduation is six months away. It's time to think about loan repayment. What is the best strategy?",
    options: [
      {
        id: "opt1",
        text: "Wait until the bank contacts you asking for payment.",
        outcome: "Incorrect. Being proactive is crucial to avoid missing payments and damaging your credit.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Start researching grace periods and set up a budget for future payments.",
        outcome: "Correct! Preparing early ensures a smooth transition into the repayment phase.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Ignore it; finding a job is the only thing that matters right now.",
        outcome: "Incorrect. Job hunting is important, but ignoring your debt obligations is risky.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Plan to take out another loan to pay off the first one.",
        outcome: "Incorrect. This leads to a debt trap with even higher interest rates.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "You've secured your first job post-graduation. How do you handle your first salary concerning your loan?",
    options: [
        {
        id: "opt3",
        text: "Set up automatic payments and commit to paying extra when possible to reduce the principal.",
        outcome: "Correct! Paying extra cuts down the principal faster, saving you significant interest.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Buy a new car to celebrate and pay the absolute minimum.",
        outcome: "Incorrect. Celebrating excessively while carrying heavy debt extends your financial burden.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Skip the first few payments since you need to enjoy your income.",
        outcome: "Incorrect. Skipping payments ruins your credit score and incurs hefty penalties.",
        isCorrect: false,
      },
      
      {
        id: "opt4",
        text: "Pay off the entire loan immediately using high-interest credit cards.",
        outcome: "Incorrect. Trading a lower-interest student loan for high-interest credit card debt is a huge mistake.",
        isCorrect: false,
      },
    ],
  },
];

const SimulationEducationLoan = () => {
  const location = useLocation();
  const gameId = "ehe-adults-83";
  const gameData = getGameDataById(gameId);
  const totalStages = SIMULATION_STAGES.length;

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 20;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 40;
  
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
      title="Simulation: Education Loan"
      subtitle={
        showResult
          ? "Simulation complete! You successfully managed an education loan."
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
                {selectedChoice.isCorrect ? 'Smart Choice' : 'Financial Misstep'}
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

export default SimulationEducationLoan;
