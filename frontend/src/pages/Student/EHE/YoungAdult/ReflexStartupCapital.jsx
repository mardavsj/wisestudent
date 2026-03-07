import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_STARTUP_CAPITAL_STAGES = [
  {
    id: 1,
    prompt: "You need initial funds to buy inventory for your new business idea. Where should the money come from?",
    options: [
      { id: "opt1", text: "Using Education Loan Money", outcome: "Wrong! Misusing educational loans is illegal and creates severe Financial Instability.", isCorrect: false },
      { id: "opt2", text: "Separate & Planned Capital", outcome: "Correct! Dedicated startup funds protect your personal financial safety.", isCorrect: true },
      { id: "opt3", text: "Emptying your emergency fund", outcome: "Wrong! This leaves you entirely exposed to personal Financial Instability.", isCorrect: false },
      { id: "opt4", text: "Maxing out multiple credit cards", outcome: "Wrong! High-interest consumer debt is toxic for early-stage startups.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Your startup hasn't made a profit yet, but you need to pay for marketing.",
    options: [
      { id: "opt1", text: "Use your rent money", outcome: "Wrong! Compromising your basic living needs causes immediate Financial Instability.", isCorrect: false },
      { id: "opt2", text: "Borrow from loan sharks", outcome: "Wrong! Predatory lending will destroy both you and your business.", isCorrect: false },
      { id: "opt3", text: "Draw from your Separate & Planned Capital", outcome: "Correct! Using pre-allocated business funds keeps your personal finances safe.", isCorrect: true },
      { id: "opt4", text: "Steal from your student organization's budget", outcome: "Wrong! This is unethical, illegal, and ruins your reputation permanently.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "You receive the disbursement for your student loans. The business needs a new laptop.",
    options: [
      { id: "opt1", text: "Wait and save up Separate & Planned Capital", outcome: "Correct! Protecting your educational funding is critical for your future.", isCorrect: true },
      { id: "opt2", text: "Using Education Loan Money since it's just sitting there", outcome: "Wrong! That money is allocated for tuition and living expenses, not business risks.", isCorrect: false },
      { id: "opt3", text: "Buy the most expensive gaming laptop you can find", outcome: "Wrong! Wasteful spending accelerates Financial Instability.", isCorrect: false },
      { id: "opt4", text: "Drop out of school to use the tuition money", outcome: "Wrong! Sacrificing your education for unproven startup capital is extremely risky.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "How should you approach personal vs. business expenses when starting out?",
    options: [
      { id: "opt1", text: "Mix them all in one checking account", outcome: "Wrong! Commingling funds makes accounting impossible and pierces the corporate veil.", isCorrect: false },
      { id: "opt2", text: "Pay yourself a massive salary immediately", outcome: "Wrong! Draining early capital for personal luxury leads to business failure.", isCorrect: false },
      { id: "opt3", text: "Maintain strict separation using Separate & Planned Capital", outcome: "Correct! Clear accounting boundaries protect you and make tax season manageable.", isCorrect: true },
      { id: "opt4", text: "Pay for groceries out of the cash register", outcome: "Wrong! This is embezzlement from your own business and ruins financial tracking.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "An investor offers you $10,000 for your business but wants 50% equity.",
    options: [
      { id: "opt1", text: "Accept immediately to get the cash", outcome: "Wrong! Giving up half your company too early stunts future growth and motivation.", isCorrect: false },
      { id: "opt2", text: "Insult them for giving a lowball offer", outcome: "Wrong! Burning bridges in the investment community is a bad strategy.", isCorrect: false },
      { id: "opt4", text: "Tell them you'll just use your Education Loan Money instead", outcome: "Wrong! Admitting to misusing funds will terrify any legitimate investor.", isCorrect: false },
      { id: "opt3", text: "Decline respectfully and rely on your Separate & Planned Capital", outcome: "Correct! Bootstrapping with planned funds allows you to retain control until you have better leverage.", isCorrect: true },
    ],
  },
];

const ReflexStartupCapital = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-33";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_STARTUP_CAPITAL_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = REFLEX_STARTUP_CAPITAL_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Financial decisions require timely execution!", isCorrect: false });
      if (currentStageIndex === totalStages - 1) {
        setTimeout(() => {
          setShowResult(true);
        }, 800);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResult, selectedChoice, stage]);

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
      }, 800);
    }
  };

  const handleNextStage = () => {
    if (!selectedChoice) return;
    if (currentStageIndex === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrentStageIndex((prev) => prev + 1);
      setTimeLeft(10);
    }
    setSelectedChoice(null);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Reflex: Startup Capital"
      subtitle={
        showResult
          ? "Great job! You understand how to fund a startup safely."
          : `Scenario ${currentStageIndex + 1} of ${totalStages}`
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
      <div className="space-y-8">
        {!showResult && stage && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-700 shadow-2xl relative overflow-hidden">
              {/* Timer Bar */}
              <div 
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-fuchsia-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Scenario {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-fuchsia-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              {/* Question Display */}
              <div className="bg-black/50 border-2 border-fuchsia-900 shadow-[0_0_15px_rgba(217,70,239,0.2)] p-6 rounded-xl mt-6">
                 <div className="text-center font-mono text-fuchsia-300 text-lg tracking-widest uppercase mb-4 opacity-50">
                    ⚡ CAPITAL REFLEX ⚡
                 </div>
                 <p className="text-white text-xl md:text-2xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
                 <div className="text-center font-mono text-fuchsia-300 text-xs tracking-widest uppercase mt-4 opacity-50">
                    Choose your funding source before time runs out!
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "border-fuchsia-700 bg-slate-800 text-fuchsia-100 hover:bg-slate-700 hover:border-fuchsia-500 border-[3px]";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "bg-emerald-900/80 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.5)] scale-105"
                      : "bg-rose-900/80 border-rose-400 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.5)] scale-105";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "bg-emerald-900/40 border-emerald-500/50 text-emerald-300/80 ring-2 ring-emerald-500/30";
                  } else if (selectedChoice) {
                    baseStyle = "bg-slate-900/50 border-slate-700/50 text-slate-500 opacity-50 scale-95";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative flex items-center justify-center rounded-xl ${baseStyle} p-4 text-center font-bold transition-all disabled:cursor-not-allowed text-sm md:text-base leading-tight min-h-[90px]`}
                    >
                      <span className="z-10">{option.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {selectedChoice && (
          <div className="animate-fade-in-up">
            <div className={`rounded-xl border-2 p-5 text-center font-bold text-lg shadow-lg ${selectedChoice.isCorrect ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200' : 'bg-rose-900/60 border-rose-500 text-rose-200'}`}>
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Smart Capital' : '❌ Financial Risk!'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-fuchsia-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(217,70,239,0.4)] hover:scale-105 transform transition-all border border-fuchsia-400 hover:bg-fuchsia-500"
                >
                  NEXT →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexStartupCapital;
