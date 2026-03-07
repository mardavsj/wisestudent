import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SIMULATION_STAGES = [
  {
    id: 1,
    prompt: "You are offered a role in a new, much larger city with a 30% salary increase. What is your very first reaction?",
    options: [
      {
        id: "opt1",
        text: "Accept it immediately and start packing.",
        outcome: "Incorrect. Accepting blindly without understanding the financial impact of the new environment is reckless.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Reject it. Moving is too much of a hassle.",
        outcome: "Incorrect. Rejecting a 30% raise out of laziness could critically stunt your career.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Look at the salary increase only and celebrate.",
        outcome: "Incorrect. A bigger gross number doesn't always equal more money in your bank account.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Calculate the cost of living differences to determine your actual net savings.",
        outcome: "Correct! The true value of a salary is determined by the local cost of living.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "You research the new city and realize rent is 50% higher than your current city. How do you evaluate the offer now?",
    options: [
      {
        id: "opt1",
        text: "Ignore the rent. The higher salary figure still sounds better mentally.",
        outcome: "Incorrect. Mental accounting won't pay the rent.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Calculate if your net income (after tax and new total living expenses) actually increases.",
        outcome: "Correct! You must compare discretionary income and savings potential, not just gross pay.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Ask your parents to pay your rent so you can enjoy the higher salary.",
        outcome: "Incorrect. Outsourcing your financial responsibilities is not career progression.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Demand the company cover your rent indefinitely.",
        outcome: "Incorrect. Companies rarely cover indefinite living expenses for standard roles.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "Besides housing, what other financial factors must be included in your relocation analysis?",
    options: [
      {
        id: "opt1",
        text: "Only how much a coffee costs in the new office.",
        outcome: "Incorrect. Coffee is a tiny percentage of your overall budget.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "The price of luxury designer clothes in the new city.",
        outcome: "Incorrect. Discretionary luxury items don't dictate baseline cost of living.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Changes in state/local taxes, transportation costs, and daily necessities.",
        outcome: "Correct! Taxes and commuting costs can wildly shift the actual value of a salary.",
        isCorrect: true,
      },
      {
        id: "opt4",
        text: "Nothing else matters if the base salary is bigger.",
        outcome: "Incorrect. This naive approach guarantees financial stress.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "The company offers a one-time relocation bonus of $5,000. How should you treat this money?",
    options: [
      {
        id: "opt2",
        text: "Use it strictly to cover actual moving expenses and buffer immediate transition costs.",
        outcome: "Correct! Relocation bonuses are meant to neutralize the friction of moving, not act as a reward.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Treat it as free vacation money and spend it immediately.",
        outcome: "Incorrect. You will need that money to break your lease, hire movers, and pay deposits.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Add it to your calculated base salary to artificially inflate the offer's value.",
        outcome: "Incorrect. It is a one-time payment and does not affect your recurring monthly math.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Reject it to show you are independent.",
        outcome: "Incorrect. Refusing free capital to facilitate a business move is just poor financial management.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "You conclude your net savings remain flat despite the higher salary, but the role offers unprecedented career growth and networking. What is the best strategy?",
    options: [
      {
        id: "opt1",
        text: "Turn it down. You should exclusively maximize immediate savings at all times.",
        outcome: "Incorrect. Sometimes a lateral financial move is necessary to unlock massive future gains.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Take the job, viewing the flat savings as a temporary investment in long-term career stability and future earning power.",
        outcome: "Correct! Strategic career planning often requires accepting flat short-term gains for massive long-term leverage.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Take the job but complain constantly to your new coworkers about the high cost of living.",
        outcome: "Incorrect. Bringing toxicity to a new role immediately destroys the networking benefits you moved for.",
        isCorrect: false,
      },
      {
        id: "opt4",
        text: "Demand a 100% pay raise so you can have both growth and immediate cash.",
        outcome: "Incorrect. Extorting the company right after receiving an offer will likely get the offer rescinded.",
        isCorrect: false,
      },
    ],
  },
];

const SimulationRelocationDecision = () => {
  const location = useLocation();
  const gameId = "ehe-adults-28";
  const gameData = getGameDataById(gameId);
  const totalStages = SIMULATION_STAGES.length;

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;

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
      title="Simulation: Relocation Decision"
      subtitle={
        showResult
          ? "Simulation complete! You learned to analyze a complex career move."
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
                {selectedChoice.isCorrect ? 'Analytical Strategy' : 'Short-Sighted Bias'}
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

export default SimulationRelocationDecision;
