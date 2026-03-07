import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PARTNER_SELECTION_STAGES = [
  {
    id: 1,
    prompt: "You choose a business partner based only on friendship. What else MUST be evaluated?",
    options: [
       {
        id: "opt2",
        text: "Skills and commitment alignment",
        outcome: "Correct! A business needs complementary skills and a shared level of commitment, not just friendship.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Family approval",
        outcome: "While supportive families are nice, it is not the primary factor for a successful business partnership.",
        isCorrect: false,
      },
     
      {
        id: "opt3",
        text: "How much money they have right now",
        outcome: "Capital is important, but without aligned skills and commitment, the partnership will likely fail.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "If you and your partner have the exact same skill set, what is the likely outcome?",
    options: [
      {
        id: "opt1",
        text: "The business will operate twice as fast",
        outcome: "Usually, overlapping skills lead to inefficiencies because crucial areas of the business are neglected.",
        isCorrect: false,
      },
     
      {
        id: "opt3",
        text: "You will never argue",
        outcome: "You might actually argue more if you step on each other's toes handling the same responsibilities.",
        isCorrect: false,
      },
       {
        id: "opt2",
        text: "Major gaps will exist in other critical business areas",
        outcome: "Exactly! If you both build the product but neither can sell, the business will struggle. Complementary skills are better.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 3,
    prompt: "Before officially starting the business, what critical conversation must happen?",
    options: [
      
      {
        id: "opt2",
        text: "Planning the company holiday party",
        outcome: "This is a fun detail but not a critical foundational conversation.",
        isCorrect: false,
      },
      {
        id: "opt1",
        text: "Discussing what happens if the business fails or someone wants to leave",
        outcome: "Correct! Having an exit strategy and clear terms upfront prevents bitter disputes later.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Deciding what luxury car the company will buy first",
        outcome: "Focusing on premature rewards before generating revenue is a red flag.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "How should equity (ownership) be divided between partners?",
    options: [
      {
        id: "opt1",
        text: "Always 50/50 so nobody feels bad",
        outcome: "A 50/50 split often leads to deadlocks if there is a disagreement. It also might not reflect actual contributions.",
        isCorrect: false,
      },
     
      {
        id: "opt3",
        text: "The person whose idea it was gets 90%",
        outcome: "Ideas are cheap; execution is everything. Unfair splits demotivate the executing partners.",
        isCorrect: false,
      },
       {
        id: "opt2",
        text: "Based on capital invested, ongoing time commitment, and strategic value",
        outcome: "Correct! Equity should reflect the actual ongoing value and risk each partner provides.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 5,
    prompt: "Why is a written Partnership Agreement necessary?",
    options: [
      {
        id: "opt2",
        text: "It protects both parties by clarifying roles, responsibilities, and financial terms",
        outcome: "Spot on! Documentation prevents misunderstandings and provides a legal framework for resolving disputes.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Because verbal agreements are universally illegal",
        outcome: "Verbal agreements are often legal, but they are nearly impossible to prove or enforce accurately.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "It is only necessary if you don't trust your partner",
        outcome: "Agreements protect the relationship. Even the most trustworthy people can have genuine misunderstandings.",
        isCorrect: false,
      },
    ],
  },
];

const QuizPartnerSelection = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-35";
  const gameData = getGameDataById(gameId);
  const totalStages = PARTNER_SELECTION_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 10;
  const totalXp = gameData?.xp || location.state?.totalXp || 20;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = PARTNER_SELECTION_STAGES[currentStageIndex];

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
      title="Quiz: Partner Selection"
      subtitle={
        showResult
          ? "Well done! You understand the foundations of a strong partnership."
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
                  Partnership Check
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

export default QuizPartnerSelection;
