import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CRISIS_STAGES = [
  {
    id: 1,
    prompt: "An unexpected economic slowdown impacts revenue. What ensures survival?",
    options: [
      {
        id: "opt1",
        text: "Panic reaction and massive instant lay-offs",
        outcome: "Panic creates more instability and damages your brand.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Blaming the market while keeping operations the same",
        outcome: "Inaction during a crisis guarantees business failure.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Reserve planning and cost control",
        outcome: "Correct! Structured cost reduction and using reserves ensures safe survival.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "A key supplier suddenly goes bankrupt, cutting off your primary materials. What is your best response?",
    options: [
      {
        id: "opt3",
        text: "Immediately source from backup suppliers and communicate possible delays to customers",
        outcome: "Spot on! Having contingency plans in place keeps operations moving.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Wait it out and hope they recover soon",
        outcome: "Waiting burns time and halts your own production permanently.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Shut down the business completely",
        outcome: "A single supplier issue shouldn't end the entire business.",
        isCorrect: false,
      },
      
    ],
  },
  {
    id: 3,
    prompt: "Your product receives overwhelming negative PR online due to an honest mistake in production. How do you handle it?",
    options: [
      {
        id: "opt1",
        text: "Deny everything to protect the brand",
        outcome: "Denying factual errors destroys customer trust.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Address the issue directly, apologize, and show how you are fixing it",
        outcome: "Exactly! Honest communication turns a PR crisis into an opportunity to build trust.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Ignore the comments and wait for the news cycle to pass",
        outcome: "Ignoring a crisis allows it to escalate uncontrollably.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "A severe cash flow crunch occurs, meaning you can only cover payroll or a major vendor invoice this month. What is the priority?",
    options: [
      {
        id: "opt1",
        text: "Pay the vendor and delay employee salaries",
        outcome: "Delaying salaries without notice ruins morale and forces key staff to leave.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Ignore both and hope new sales come in",
        outcome: "Hoping for a miracle is not a financial strategy.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Cover payroll, and proactively renegotiate terms with the vendor",
        outcome: "Correct! Protecting your team is priority, and vendors usually prefer honest communication and a new plan over silence.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 5,
    prompt: "When the immediate crisis passes and the business stabilizes, what is the most important next step?",
    options: [
      {
        id: "opt1",
        text: "Conduct a post-mortem to build better contingency plans",
        outcome: "Exactly! Learning from a crisis prevents the same mistakes from hurting you again.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Act as if nothing happened",
        outcome: "Ignoring the crisis means you will be vulnerable the next time it happens.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Fire anyone remotely involved in solving the crisis",
        outcome: "Punishing the people who helped resolve the crisis is toxic leadership.",
        isCorrect: false,
      },
    ],
  },
];

const QuizCrisis = () => {
  const location = useLocation();
  const gameId = "ehe-adults-79";
  const gameData = getGameDataById(gameId);
  const totalStages = CRISIS_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 20;
  const totalXp = gameData?.xp || location.state?.totalXp || 40;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = CRISIS_STAGES[currentStageIndex];

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
      title="Quiz: Crisis Experience"
      subtitle={
        showResult
          ? "Well done! You understand how to navigate business crises."
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
                  Crisis Management
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

export default QuizCrisis;
