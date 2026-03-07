import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_FIRST_SALARY_STAGES = [
  {
    id: 1,
    prompt: "You've just received your very first paycheck! What is the smartest first move to make?",
    options: [
      { id: "opt1", text: "Allocate savings and expenses", outcome: "Correct! Setting aside savings first ensures financial stability starting from day one.", isCorrect: true },
      { id: "opt2", text: "Spend immediately on a luxury item", outcome: "Wrong! Spending before saving leaves you vulnerable to emergencies.", isCorrect: false },
      { id: "opt3", text: "Throw a massive party for everyone", outcome: "Wrong! While celebrating is fine, blowing your whole paycheck starts a bad habit.", isCorrect: false },
      { id: "opt4", text: "Borrow money to buy a new car", outcome: "Wrong! Taking on debt right when you start earning traps your future income.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Your friends invite you for an expensive weekend trip that exceeds your monthly entertainment budget. How do you respond?",
    options: [
      { id: "opt1", text: "Put it on a credit card to pay later", outcome: "Wrong! Financing lifestyle choices with debt quickly snowballs out of control.", isCorrect: false },
      { id: "opt2", text: "Borrow from your emergency savings", outcome: "Wrong! Emergency funds are for unexpected necessities, not vacations.", isCorrect: false },
      { id: "opt3", text: "Suggest a more affordable alternative", outcome: "Correct! True friends will understand if you prioritize your financial health.", isCorrect: true },
      { id: "opt4", text: "Take out a personal loan", outcome: "Wrong! Taking loans for experiences puts a heavy burden on your future self.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "You want to buy a new phone. It costs twice your monthly savings rate. What's the best approach?",
    options: [
      { id: "opt1", text: "Buy it on EMI (installments)", outcome: "Wrong! EMIs for depreciating lifestyle assets tie up your future cash flow.", isCorrect: false },
      { id: "opt2", text: "Save up for it over two months", outcome: "Correct! Delayed gratification teaches discipline and avoids unnecessary debt.", isCorrect: true },
      { id: "opt3", text: "Use your rent money and pay rent late", outcome: "Wrong! Never compromise essential living expenses for lifestyle upgrades.", isCorrect: false },
      { id: "opt4", text: "Borrow the money from a colleague", outcome: "Wrong! Mixing money with professional relationships is a recipe for disaster.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "It's the middle of the month and you've already spent most of your discretionary income. What do you do?",
    options: [
      { id: "opt1", text: "Dip into the money saved for taxes/bills", outcome: "Wrong! Touching earmarked funds will create a crisis later in the month.", isCorrect: false },
      { id: "opt2", text: "Apply for a new credit card", outcome: "Wrong! Using new credit lines to fix bad budgeting just digs a deeper hole.", isCorrect: false },
      { id: "opt3", text: "Take a cash advance from your employer", outcome: "Wrong! Advancements mean your next paycheck will be short.", isCorrect: false },
      { id: "opt4", text: "Cut back and stick to free activities", outcome: "Correct! Adjusting your lifestyle to fit your remaining budget is mature financial management.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "You receive a small bonus at work! Where should it go?",
    options: [
      { id: "opt1", text: "Boost your emergency fund or investments", outcome: "Correct! Using windfalls to accelerate financial goals sets you up for long-term wealth.", isCorrect: true },
      { id: "opt2", text: "Upgrade your lifestyle expenses permanently", outcome: "Wrong! Lifestyle creep eats up your bonus and makes you dependent on more income.", isCorrect: false },
      { id: "opt3", text: "Spend it all before the weekend", outcome: "Wrong! A bonus is an opportunity for progress, not just immediate consumption.", isCorrect: false },
      { id: "opt4", text: "Use it to make minimum payments on debt", outcome: "Wrong! Minimum payments don't help much; you should try to tackle the principal if you have debt.", isCorrect: false },
    ],
  },
];

const ReflexFirstSalary = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-8";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_FIRST_SALARY_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = REFLEX_FIRST_SALARY_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Too slow! Quick thinking is key in financial decisions.", isCorrect: false });
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
      showCorrectAnswerFeedback(coinsPerLevel, true);
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
      title="Reflex: First Salary"
      subtitle={
        showResult
          ? "Great job! You've mastered managing your first income."
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
      <div className="space-y-8">
        {!showResult && stage && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-700 shadow-2xl relative overflow-hidden">
              {/* Timer Bar */}
              <div 
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-emerald-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Question {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              {/* Question Display */}
              <div className="bg-black/50 border-2 border-emerald-900 shadow-[0_0_15px_rgba(16,185,129,0.2)] p-6 rounded-xl mt-6">
                 <div className="text-center font-mono text-emerald-300 text-lg tracking-widest uppercase mb-4 opacity-50">
                    ⚡ FINANCIAL REFLEX ⚡
                 </div>
                 <p className="text-white text-xl md:text-2xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
                 <div className="text-center font-mono text-emerald-300 text-xs tracking-widest uppercase mt-4 opacity-50">
                    Tap the right answer before time runs out!
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "border-emerald-700 bg-slate-800 text-emerald-100 hover:bg-slate-700 hover:border-emerald-500 border-[3px]";
                  
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Correct' : '❌ Wrong'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-emerald-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(16,185,129,0.4)] hover:scale-105 transform transition-all border border-emerald-400 hover:bg-emerald-500"
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

export default ReflexFirstSalary;
