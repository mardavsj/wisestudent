import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_CAPITAL_MANAGEMENT_STAGES = [
  {
    id: 1,
    prompt: "You have $10,000 saved and want to start a side business.",
    options: [
      { id: "opt1", text: "Invest the full $10,000 immediately to launch big", outcome: "Wrong! Investing all savings at once without testing the market is a massive risk.", isCorrect: false },
      { id: "opt3", text: "Borrow another $10,000 to double your launch budget", outcome: "Wrong! Taking on debt before proving the business model is dangerous.", isCorrect: false },
      { id: "opt4", text: "Keep all $10,000 in a checking account and never start", outcome: "Wrong! Complete avoidance means zero growth potential.", isCorrect: false },
      { id: "opt2", text: "Spend $1,000 on a small initial test and keep the rest in savings", outcome: "Correct! Calculated investment protects your core capital while allowing you to test the waters.", isCorrect: true },
    ],
  },
  {
    id: 2,
    prompt: "Your initial product test is successful, generating $500 in profit.",
    options: [
      { id: "opt1", text: "Spend the $500 on a personal celebration dinner", outcome: "Wrong! Depleting early profits starves the business of growth capital.", isCorrect: false },
      { id: "opt3", text: "Quit your main job immediately because you made a profit", outcome: "Wrong! One successful test does not equal a sustainable, full-time income.", isCorrect: false },
      { id: "opt2", text: "Reinvest $400 into inventory and save $100 as a buffer", outcome: "Correct! Calculated reinvestment fuels growth while building a safety net.", isCorrect: true },
      { id: "opt4", text: "Throw your remaining $9,000 savings into inventory all at once", outcome: "Wrong! Scaling too fast based on one small win is extremely risky.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "A supplier offers a 20% discount if you buy 10 times your usual inventory.",
    options: [
      { id: "opt1", text: "Accept immediately to maximize your profit margin", outcome: "Wrong! Tying up all your capital in inventory creates severe cash flow issues.", isCorrect: false },
      { id: "opt2", text: "Decline, as you don't have the sales volume yet to move that much stock", outcome: "Correct! Calculated investment means aligning purchases with actual sales demand.", isCorrect: true },
      { id: "opt3", text: "Take out a high-interest loan to buy the discounted inventory", outcome: "Wrong! The interest will likely wipe out the 20% discount benefit.", isCorrect: false },
      { id: "opt4", text: "Stop buying from them entirely because they are pressuring you", outcome: "Wrong! Ignoring a supplier over a standard bulk offer is an overreaction.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "You see a competitor running expensive ads and getting lots of attention.",
    options: [
      { id: "opt2", text: "Run a small, $50 targeted ad campaign to test your own audience", outcome: "Correct! Calculated investment in marketing requires testing and measuring ROI first.", isCorrect: true },
      { id: "opt1", text: "Empty your business account to match their ad spend", outcome: "Wrong! Copying competitors without a strategy drains your capital fast.", isCorrect: false },
      { id: "opt3", text: "Give up because you can't compete with their budget", outcome: "Wrong! Assuming money is the only way to win ignores creativity and niche marketing.", isCorrect: false },
      { id: "opt4", text: "Spam their social media pages with your links", outcome: "Wrong! This damages your brand reputation permanently.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Your business has steady revenue, but an unexpected $2,000 equipment repair comes up.",
    options: [
      { id: "opt1", text: "Panic and shut the business down", outcome: "Wrong! Business involves unexpected costs; shutting down is an emotional reaction.", isCorrect: false },
      { id: "opt2", text: "Put it on a personal credit card and hope for the best", outcome: "Wrong! Mixing personal debt with business expenses without a plan is dangerous.", isCorrect: false },
      { id: "opt3", text: "Pay for it using the business emergency fund you've been building", outcome: "Correct! Calculated capital management includes anticipating and preparing for maintenance.", isCorrect: true },
      { id: "opt4", text: "Ignore the repair and let the equipment break completely", outcome: "Wrong! Ignoring maintenance leads to catastrophic failure and higher costs later.", isCorrect: false },
    ],
  },
];

const ReflexCapitalManagement = () => {
  const location = useLocation();
  const gameId = "ehe-adults-43";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_CAPITAL_MANAGEMENT_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = REFLEX_CAPITAL_MANAGEMENT_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Missing the moment can lead to poor financial decisions!", isCorrect: false });
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
      title="Reflex: Capital Management"
      subtitle={
        showResult
          ? "Excellent! You make calculated investments and protect your capital."
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
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-cyan-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Scenario {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              {/* Question Display */}
              <div className="bg-black/50 border-2 border-cyan-900 shadow-[0_0_15px_rgba(34,211,238,0.2)] p-6 rounded-xl mt-6">
                 <div className="text-center font-mono text-cyan-300 text-lg tracking-widest uppercase mb-4 opacity-50">
                    ⚡ RAPID DECISION ⚡
                 </div>
                 <p className="text-white text-xl md:text-2xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
                 <div className="text-center font-mono text-cyan-300 text-xs tracking-widest uppercase mt-4 opacity-50">
                    Tap the right behavior before time runs out!
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "border-cyan-700 bg-slate-800 text-cyan-100 hover:bg-slate-700 hover:border-cyan-500 border-[3px]";
                  
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Calculated Investment' : '❌ Irresponsible Capital Use'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-cyan-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(34,211,238,0.4)] hover:scale-105 transform transition-all border border-cyan-400 hover:bg-cyan-500"
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

export default ReflexCapitalManagement;
