import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LOAN_FOR_EXPANSION_STAGES = [
  {
    id: 1,
    prompt: "A bank offers you an easy loan for rapid expansion. What MUST be calculated before accepting?",
    options: [
      {
        id: "opt1",
        text: "How fast the loan arrives",
        outcome: "Speed is convenient, but not the most critical factor for a business's financial health.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "How much office space you can rent with it",
        outcome: "Focusing on spending rather than the ability to repay is a dangerous trap.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Your repayment capacity",
        outcome: "Correct! If your cash flow cannot cover the monthly payments, the business could fail.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why should you avoid using a short-term, high-interest loan for long-term expansion?",
    options: [
      {
        id: "opt1",
        text: "Because it looks bad to investors",
        outcome: "While true, the primary issue is the immediate financial strain it causes.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "It will drain your daily cash flow before the expansion generates any new revenue",
        outcome: "Exactly! Short-term debts require fast repayment, which strangles operational cash flow.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Because the bank won't let you pay it off early",
        outcome: "Early payment penalties depend on the contract, but cash flow drain is the universal problem.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "You want to borrow money to buy more inventory because sales are booming. Is this a good idea?",
    options: [
      {
        id: "opt1",
        text: "Yes, borrowing to fulfill proven, existing demand is usually a smart use of debt",
        outcome: "Correct! Using a loan to amplify an already profitable cycle makes financial sense.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "No, you should never borrow money for any reason",
        outcome: "Debt is a tool. When used correctly for growth, it can be highly beneficial.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Yes, and you should borrow twice as much just in case",
        outcome: "Over-borrowing leads to excess interest costs and unnecessary risk.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "How does taking a business loan affect your personal finances as a young entrepreneur?",
    options: [
      {
        id: "opt1",
        text: "It doesn't; the business is completely separate",
        outcome: "Actually, most early-stage business loans require a personal guarantee, putting your personal assets at risk.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "You can use the loan for personal expenses if the business doesn't need it all",
        outcome: "This is illegal (commingling funds) and violates loan agreements.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "You will likely have to sign a personal guarantee, risking your own assets",
        outcome: "Correct! Lenders usually require founders to be personally liable if the business fails.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 5,
    prompt: "Before signing loan documents, what is the best practice?",
    options: [
      {
        id: "opt1",
        text: "Read the interest rate and ignore the rest",
        outcome: "Hidden fees, covenants, and personal guarantees are often buried in the fine print.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Review the terms carefully, ideally with a financial advisor or lawyer",
        outcome: "Spot on! Professional review ensures you understand exactly what you are agreeing to.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Sign it quickly so you can get the money and start working",
        outcome: "Rushing financial contracts is a recipe for disaster.",
        isCorrect: false,
      },
      
    ],
  },
];

const QuizLoanForExpansion = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-45";
  const gameData = getGameDataById(gameId);
  const totalStages = LOAN_FOR_EXPANSION_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 10;
  const totalXp = gameData?.xp || location.state?.totalXp || 20;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = LOAN_FOR_EXPANSION_STAGES[currentStageIndex];

  const handleChoice = (option) => {
    if (selectedChoice) return;
    setSelectedChoice(option);
    if (option.isCorrect) {
      setScore((s) => s + 1);
      showCorrectAnswerFeedback(1, true);
    }
  };

  const handleNext = () => {
    if (currentStageIndex === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrentStageIndex((i) => i + 1);
    }
    setSelectedChoice(null);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Quiz: Loan for Expansion"
      subtitle={
        showResult
          ? "Well done! Debt is a tool that requires careful calculation."
          : `Question ${currentStageIndex + 1} of ${totalStages}`
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

              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 to-indigo-600"></div>

              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8 border-b border-slate-700 pb-4">
                <span>Question {progressLabel}</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Score: {score}/{totalStages}
                </span>
              </div>

              <div className="text-center mb-10">
                <span className="inline-block py-1 px-3 rounded-full bg-violet-900/50 text-violet-300 text-xs font-bold uppercase tracking-wider mb-4 border border-violet-500/30">
                  Financial Check
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
                                {option.isCorrect ? '✅ Correct' : '❌ Incorrect'}
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

              {selectedChoice && (
                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg shadow-violet-500/25 transition-all duration-300 hover:scale-105 hover:shadow-violet-500/40"
                  >
                    {currentStageIndex === totalStages - 1 ? "See Results" : "Next →"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizLoanForExpansion;
