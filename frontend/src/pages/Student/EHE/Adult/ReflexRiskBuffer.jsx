import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_RISK_BUFFER_STAGES = [
  {
    id: 1,
    prompt: "A slow month hits your business and sales drop significantly.",
    options: [
      { id: "opt1", text: "Drastically slash product prices below cost to force sales", outcome: "Wrong! A panic reaction like price slashing destroys profitability.", isCorrect: false },
      { id: "opt3", text: "Take out a high-interest payday loan to cover rent", outcome: "Wrong! No preparation leads to desperate borrowing and high debt.", isCorrect: false },
      { id: "opt4", text: "Fire half your staff immediately with no warning", outcome: "Wrong! Panic reactions destroy team morale and long-term capacity.", isCorrect: false },
      { id: "opt2", text: "Cover the revenue shortfall using your pre-funded emergency reserve", outcome: "Correct! Using an Emergency Reserve Fund stabilizes operations during temporary downturns.", isCorrect: true },
    ],
  },
  {
    id: 2,
    prompt: "Your main supplier abruptly goes out of business.",
    options: [
      { id: "opt1", text: "Close your shop until you find another supplier someday", outcome: "Wrong! Complete paralysis shows no preparation.", isCorrect: false },
      { id: "opt2", text: "Activate your backup supplier agreement you organized in advance", outcome: "Correct! Having a risk buffer means diversifying critical dependencies.", isCorrect: true },
      { id: "opt3", text: "Yell at your employees because you are stressed", outcome: "Wrong! A panic reaction creates a hostile work environment.", isCorrect: false },
      { id: "opt4", text: "Change your entire business model overnight", outcome: "Wrong! Drastic, unplanned pivots are highly risky.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "A key piece of expensive equipment breaks down unexpectedly.",
    options: [
      { id: "opt1", text: "Dip into the dedicated equipment maintenance fund you built", outcome: "Correct! Financial preparation ensures smooth operations despite setbacks.", isCorrect: true },
      { id: "opt2", text: "Ignore the breakdown and try to work without it", outcome: "Wrong! Refusing to address the issue hurts productivity.", isCorrect: false },
      { id: "opt3", text: "Empty your personal savings account to buy a new one", outcome: "Wrong! Mixing personal and business finances shows poor risk buffering.", isCorrect: false },
      { id: "opt4", text: "Blame the equipment manufacturer and refuse to pay", outcome: "Wrong! Avoidance doesn't solve the immediate operational problem.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "A new competitor opens nearby, and your foot traffic decreases slightly.",
    options: [
      { id: "opt1", text: "Give up and list your business for sale immediately", outcome: "Wrong! A severe panic reaction to normal competition is fatal.", isCorrect: false },
      { id: "opt3", text: "Start a public fight with them on social media", outcome: "Wrong! Unprofessional behavior damages your reputation.", isCorrect: false },
      { id: "opt2", text: "Engage your loyal customer base using your established retention marketing program", outcome: "Correct! A strong customer community acts as a buffer against new competitors.", isCorrect: true },
      { id: "opt4", text: "Pretend they don't exist and make no adjustments", outcome: "Wrong! Having no preparation or awareness leaves you vulnerable.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "An unexpected economic downturn causes a general drop in consumer spending.",
    options: [
      { id: "opt1", text: "Wait and see without looking at your finances", outcome: "Wrong! Complacency is the opposite of risk buffering.", isCorrect: false },
      { id: "opt2", text: "Review your financial buffer and implement pre-planned cost trimmings", outcome: "Correct! Proactive adjustments based on a solid buffer ensure survival.", isCorrect: true },
      { id: "opt3", text: "Stop paying all your vendors instantly", outcome: "Wrong! Burning bridges in a panic destroys crucial relationships.", isCorrect: false },
      { id: "opt4", text: "Accuse your target market of being cheap", outcome: "Wrong! Blaming the market is defensive and unproductive.", isCorrect: false },
    ],
  },
];

const ReflexRiskBuffer = () => {
  const location = useLocation();
  const gameId = "ehe-adults-48";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_RISK_BUFFER_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = REFLEX_RISK_BUFFER_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Missing the moment can leave you vulnerable to risks!", isCorrect: false });
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
      title="Reflex: Risk Buffer"
      subtitle={
        showResult
          ? "Excellent! You build strong buffers to protect against unexpected risks."
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Emergency Reserve Fund' : '❌ Panic / No Preparation'}</span>
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

export default ReflexRiskBuffer;
