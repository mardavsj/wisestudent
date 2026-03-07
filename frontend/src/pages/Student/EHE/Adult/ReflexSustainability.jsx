import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_SUSTAINABILITY_STAGES = [
  {
    id: 1,
    prompt: "Your manufacturing process produces a lot of excess scrap material.",
    options: [
      { id: "opt1", text: "Throw all the scrap material in the trash to save time", outcome: "Wrong! Ignoring avoidable waste harms the environment and costs you money.", isCorrect: false },
      { id: "opt2", text: "Find ways to recycle the scrap or sell it to another business", outcome: "Correct! Resource efficiency turns waste into potential revenue or savings.", isCorrect: true },
      { id: "opt3", text: "Dump the scrap illegally to avoid disposal fees", outcome: "Wrong! This is illegal, highly unethical, and destroys your reputation.", isCorrect: false },
      { id: "opt4", text: "Ignore the waste because you're currently making a profit", outcome: "Wrong! Focusing only on short-term profit ignores long-term sustainability risks.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "You notice your office uses a massive amount of printer paper every week.",
    options: [
      { id: "opt1", text: "Transition to a digital document management system to reduce paper use", outcome: "Correct! Improving resource efficiency modernizes your business and reduces cost.", isCorrect: true },
      { id: "opt2", text: "Keep buying paper because it's what you've always done", outcome: "Wrong! Refusing to evolve processes creates unnecessary waste.", isCorrect: false },
      { id: "opt3", text: "Tell employees to stop printing but offer no digital alternative", outcome: "Wrong! This halts productivity without solving the root problem.", isCorrect: false },
      { id: "opt4", text: "Buy cheaper, lower-quality paper so you can print more", outcome: "Wrong! This focuses purely on immediate cost while increasing actual waste.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Your delivery vehicles are consuming too much fuel due to inefficient routing.",
    options: [
      { id: "opt1", text: "Pass the increased fuel cost entirely onto your customers", outcome: "Wrong! This makes you uncompetitive and ignores the root inefficiency.", isCorrect: false },
      { id: "opt2", text: "Tell drivers to just drive faster to save time", outcome: "Wrong! Speeding increases fuel consumption and causes safety hazards.", isCorrect: false },
      { id: "opt3", text: "Invest in route optimization software to reduce mileage and emissions", outcome: "Correct! Optimizing logistics improves resource efficiency and lowers operating costs.", isCorrect: true },
      { id: "opt4", text: "Accept the high fuel costs as 'just the cost of doing business'", outcome: "Wrong! Ignoring operational impact drains profitability and harms the environment.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "You use non-recyclable plastic packaging because it is slightly cheaper upfront.",
    options: [
      { id: "opt1", text: "Continue using it because maximizing profit margin is the only goal", outcome: "Wrong! Ignoring environmental impact alienates modern consumers.", isCorrect: false },
      { id: "opt2", text: "Pretend your packaging is eco-friendly on your marketing materials", outcome: "Wrong! 'Greenwashing' is deceptive and destroys brand trust when discovered.", isCorrect: false },
      { id: "opt4", text: "Double the amount of plastic to make the product look larger", outcome: "Wrong! This actively worsens the waste problem for deceptive marketing.", isCorrect: false },
      { id: "opt3", text: "Research and transition to biodegradable or highly recyclable alternatives", outcome: "Correct! Improving sustainability often enhances brand value and consumer loyalty.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "A local environmental group asks what your business does to reduce its carbon footprint.",
    options: [
      { id: "opt1", text: "Ignore them because they aren't paying customers", outcome: "Wrong! Ignoring community impact damages your local reputation and standing.", isCorrect: false },
      { id: "opt3", text: "Transparently share your current efficiency practices and future improvement goals", outcome: "Correct! Honest communication about sustainability builds community trust and corporate responsibility.", isCorrect: true },
      { id: "opt2", text: "Tell them it's none of their business", outcome: "Wrong! Aggressive responses create unnecessary public relations crises.", isCorrect: false },
      { id: "opt4", text: "Write them a small check to make them go away", outcome: "Wrong! Money doesn't solve the underlying requirement for responsible business practices.", isCorrect: false },
    ],
  },
];

const ReflexSustainability = () => {
  const location = useLocation();
  const gameId = "ehe-adults-75";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_SUSTAINABILITY_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 15;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 30;
  const stage = REFLEX_SUSTAINABILITY_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Ignoring sustainability issues leads to long-term costs and reputation damage!", isCorrect: false });
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
      title="Reflex: Sustainability"
      subtitle={
        showResult
          ? "Excellent! You understand that improving resource efficiency is good for both the planet and your business."
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Improve Resource Efficiency' : '❌ Ignore Impact / Focus Only on Profit'}</span>
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

export default ReflexSustainability;
