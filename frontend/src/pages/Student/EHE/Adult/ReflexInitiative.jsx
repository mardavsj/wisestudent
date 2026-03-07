import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_INITIATIVE_STAGES = [
  {
    id: 1,
    prompt: "You notice a recurring error in a weekly report that takes everyone 30 minutes to fix manually.",
    options: [
      { id: "opt1", text: "Fix it yourself every week without telling anyone", outcome: "Wrong! This doesn't solve the root problem or help the team.", isCorrect: false },
      { id: "opt2", text: "Complain to your manager that the system is broken", outcome: "Wrong! Complaining without proposing a solution is not initiative.", isCorrect: false },
      { id: "opt4", text: "Ignore it since it's not technically your job", outcome: "Wrong! Waiting for Assignment when you see a problem guarantees stagnation.", isCorrect: false },
      { id: "opt3", text: "Research a permanent fix and present it to your manager", outcome: "Correct! Taking Calculated Initiative creates systemic improvements.", isCorrect: true },
    ],
  },
  {
    id: 2,
    prompt: "A high-priority project is announced, but roles haven't been assigned yet.",
    options: [
      { id: "opt1", text: "Wait quietly until your manager assigns you a specific task", outcome: "Wrong! Waiting for Assignment means you'll likely get the leftover work.", isCorrect: false },
      { id: "opt3", text: "Tell everyone you are the project lead without asking management", outcome: "Wrong! This is overstepping and will cause conflict, not demonstrate leadership.", isCorrect: false },
      { id: "opt2", text: "Draft a proposal on how you can lead a specific piece of the project", outcome: "Correct! Taking Calculated Initiative positions you as a leader before roles are even decided.", isCorrect: true },
      { id: "opt4", text: "Hide so you don't get assigned extra work", outcome: "Wrong! Avoiding responsibility is the opposite of career growth.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Your team is migrating to a new software tool that no one knows how to use.",
    options: [
      { id: "opt1", text: "Demand the company pay for expensive formal training", outcome: "Wrong! While training is good, demanding it immediately shows a lack of resourcefulness.", isCorrect: false },
      { id: "opt3", text: "Spend an hour reading the documentation and share a quick 'how-to' guide with the team", outcome: "Correct! Being the first to learn and teach builds massive credibility.", isCorrect: true },
      { id: "opt2", text: "Refuse to use it until someone teaches you", outcome: "Wrong! Refusing to adapt makes you a bottleneck.", isCorrect: false },
      { id: "opt4", text: "Secretly keep using the old tool", outcome: "Wrong! Resisting necessary change damages your professional standing.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "A client asks a complex question in an email thread where your boss is CC'd. You know the answer.",
    options: [
      { id: "opt3", text: "Double-check your facts, reply professionally, and keep the boss CC'd", outcome: "Correct! This shows competence and takes work off your boss's plate.", isCorrect: true },
      { id: "opt1", text: "Reply all immediately without reviewing the facts", outcome: "Wrong! Rushing leads to mistakes. Initiative must be calculated.", isCorrect: false },
      { id: "opt2", text: "Wait for your boss to reply so you don't step on their toes", outcome: "Wrong! Waiting for Assignment when you have the answer slows down business.", isCorrect: false },
      { id: "opt4", text: "Message the boss privately and ask them to reply", outcome: "Wrong! You are creating an extra step instead of solving the problem.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "You've finished all your tasks for the week by Thursday afternoon.",
    options: [
      { id: "opt1", text: "Pretend to be busy for the rest of Friday", outcome: "Wrong! Time theft limits your potential to grow.", isCorrect: false },
      { id: "opt3", text: "Leave early without telling anyone", outcome: "Wrong! This damages your reliability and trust.", isCorrect: false },
      { id: "opt2", text: "Identify a backlog project that adds value and ask for approval to start it", outcome: "Correct! Calculated Initiative turns downtime into career advancement.", isCorrect: true },
      { id: "opt4", text: "Ask your boss what to do next without offering any ideas", outcome: "Wrong! While better than doing nothing, it forces your boss to do the thinking for you.", isCorrect: false },
    ],
  },
];

const ReflexInitiative = () => {
  const location = useLocation();
  const gameId = "ehe-adults-13";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_INITIATIVE_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = REFLEX_INITIATIVE_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Hesitation is the enemy of initiative!", isCorrect: false });
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
      title="Reflex: Initiative"
      subtitle={
        showResult
          ? "Great! You understand how to proactively create value without overstepping."
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
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-orange-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Scenario {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-orange-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              {/* Question Display */}
              <div className="bg-black/50 border-2 border-orange-900 shadow-[0_0_15px_rgba(249,115,22,0.2)] p-6 rounded-xl mt-6">
                 <div className="text-center font-mono text-orange-300 text-lg tracking-widest uppercase mb-4 opacity-50">
                    ⚡ PROACTIVE ACTION ⚡
                 </div>
                 <p className="text-white text-xl md:text-2xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
                 <div className="text-center font-mono text-orange-300 text-xs tracking-widest uppercase mt-4 opacity-50">
                    Choose your action before time runs out!
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "border-orange-700 bg-slate-800 text-orange-100 hover:bg-slate-700 hover:border-orange-500 border-[3px]";
                  
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Leader Move' : '❌ Passive'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-orange-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(249,115,22,0.4)] hover:scale-105 transform transition-all border border-orange-400 hover:bg-orange-500"
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

export default ReflexInitiative;
