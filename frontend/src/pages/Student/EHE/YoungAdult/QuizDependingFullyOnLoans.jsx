import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DEPENDING_FULLY_ON_LOANS_STAGES = [
  {
    id: 1,
    prompt: "You plan to fund 100% of your education through borrowing. What is the most important thing to assess?",
    options: [
      {
        id: "opt1",
        text: "Campus ranking",
        outcome: "Rankings are nice, but they don't pay the bills if the field doesn't compensate well.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Future earning capacity",
        outcome: "Correct! You must ensure your post-graduation salary can realistically cover the massive loan payments.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "How fast the loan is approved",
        outcome: "Speed of approval doesn't change the burden of repayment.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Taking a massive loan for a low-paying career field is often described as what?",
    options: [
      {
        id: "opt1",
        text: "A smart long-term investment",
        outcome: "If the math doesn't work out, it's not a smart investment.",
        isCorrect: false,
      },
     
      {
        id: "opt3",
        text: "The normal college experience",
        outcome: "Normalized debt doesn't make it financially safe.",
        isCorrect: false,
      },
       {
        id: "opt2",
        text: "A debt trap",
        outcome: "Exactly! If your salary barely covers living expenses plus the loan payment, you will be trapped in debt for decades.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 3,
    prompt: "Which of the following describes 'Return on Investment (ROI)' in the context of an education loan?",
    options: [
      {
        id: "opt1",
        text: "The difference between your expected post-grad salary and the cost of the loan and tuition",
        outcome: "Correct! If the tuition is $100k but the added salary bump is only $5k/year, the ROI is terrible.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "How much fun you had during the degree programs",
        outcome: "ROI is a financial metric, not an emotional one.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "The amount of money the bank makes off your interest",
        outcome: "That is the bank's ROI, not yours.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "To reduce the risk of funding 100% through loans, what should you proactively do before enrolling?",
    options: [
      {
        id: "opt1",
        text: "Only apply for private loans with variable interest rates",
        outcome: "Variable rates increase risk because your payments can suddenly skyrocket.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Exhaust all options for scholarships, grants, and part-time work first",
        outcome: "Spot on! Free money and earned money should always be maxed out before borrowed money.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Take out extra loan money to use for a nice car to celebrate",
        outcome: "Taking out more debt for depreciating personal assets is a terrible financial mistake.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is a major consequence of graduating with an overwhelming amount of debt?",
    options: [
      
      {
        id: "opt2",
        text: "It makes you perfectly immune to economic recessions",
        outcome: "Debt actually makes you much more vulnerable during a recession.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Employers will view you as highly responsible and increase your starting pay",
        outcome: "Employers do not base salary on your personal debt load; they base it on your market value.",
        isCorrect: false,
      },
      {
        id: "opt1",
        text: "It delays major life milestones like buying a house, starting a family, or taking entrepreneurial risks",
        outcome: "Correct! High fixed monthly payments limit your freedom to take necessary risks or save.",
        isCorrect: true,
      },
    ],
  },
];

const QuizDependingFullyOnLoans = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-82";
  const gameData = getGameDataById(gameId);
  const totalStages = DEPENDING_FULLY_ON_LOANS_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 20;
  const totalXp = gameData?.xp || location.state?.totalXp || 40;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = DEPENDING_FULLY_ON_LOANS_STAGES[currentStageIndex];

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
      title="Quiz: Depending Fully on Loans"
      subtitle={
        showResult
          ? "Well done! You understand the severe risks of over-borrowing."
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
                  Loan Assessment
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

export default QuizDependingFullyOnLoans;
