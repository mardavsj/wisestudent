import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_ADAPTABILITY_STAGES = [
  {
    id: 1,
    prompt: "Your company just rolled out a new software system that completely changes how you work.",
    options: [
        { id: "opt2", text: "Sign up for the training sessions and start practicing daily", outcome: "Correct! 'Gradual Adaptation & Persistence' helps you conquer the learning curve.", isCorrect: true },
      { id: "opt1", text: "Refuse to use it and stick to the old manual ways", outcome: "Wrong! 'Avoiding Change' makes you slower and less relevant.", isCorrect: false },
      { id: "opt3", text: "Complain loudly that the old system was better", outcome: "Wrong! 'Complaining' wastes energy and creates a negative environment.", isCorrect: false },
      { id: "opt4", text: "Try it once, get frustrated, and give up", outcome: "Wrong! Giving up quickly ensures you will fall behind.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "You are assigned to a project using a programming language or tool you've never used.",
    options: [
      { id: "opt1", text: "Tell your manager you can't do it because you weren't trained", outcome: "Wrong! 'Avoiding Change' shows a lack of initiative.", isCorrect: false },
      { id: "opt2", text: "Spend an hour a day learning the basics while working on the tasks", outcome: "Correct! 'Gradual Adaptation & Persistence' makes big challenges manageable.", isCorrect: true },
      { id: "opt3", text: "Complain to coworkers that management sets unfair expectations", outcome: "Wrong! 'Complaining' damages your professional reputation.", isCorrect: false },
      { id: "opt4", text: "Ignore the assignment until someone else does it", outcome: "Wrong! Dodging responsibility destroys team trust.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "The new technology keeps crashing and producing confusing errors.",
    options: [
        { id: "opt2", text: "Scream at your computer and go home early", outcome: "Wrong! Emotional outbursts are unprofessional.", isCorrect: false },
        { id: "opt3", text: "Tell the client the new system is garbage", outcome: "Wrong! 'Complaining' to clients ruins company credibility.", isCorrect: false },
        { id: "opt1", text: "Document the errors and systematically search for solutions or ask peers", outcome: "Correct! 'Gradual Adaptation & Persistence' turns obstacles into learning opportunities.", isCorrect: true },
      { id: "opt4", text: "Just stop working and say the system is broken", outcome: "Wrong! 'Avoiding Change' by using excuses halts all progress.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "A younger colleague masters the new tool much faster than you do.",
    options: [
        { id: "opt2", text: "Ask them for 15 minutes of their time to show you their workflow", outcome: "Correct! 'Gradual Adaptation & Persistence' means being humble enough to learn from anyone.", isCorrect: true },
      { id: "opt1", text: "Act threatened and dismiss their achievements", outcome: "Wrong! Ego prevents learning and adaptation.", isCorrect: false },
      { id: "opt3", text: "Complain that younger generations have it easier", outcome: "Wrong! 'Complaining' is a useless distraction from your own growth.", isCorrect: false },
      { id: "opt4", text: "Avoid the colleague completely out of embarrassment", outcome: "Wrong! 'Avoiding Change' by isolating yourself only makes it worse.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "After a month, you are finally getting the hang of the new technology, but another update is announced.",
    options: [
      { id: "opt1", text: "Threaten to quit because you are tired of learning", outcome: "Wrong! 'Complaining' about inevitable progress hurts only you.", isCorrect: false },
      { id: "opt2", text: "Ignore the update and hope it goes away", outcome: "Wrong! 'Avoiding Change' builds up technical debt.", isCorrect: false },
      { id: "opt4", text: "Write an angry email to the software company", outcome: "Wrong! Wasting time on anger prevents productive adaptation.", isCorrect: false },
      { id: "opt3", text: "Review the release notes and focus on the small incremental changes", outcome: "Correct! 'Gradual Adaptation & Persistence' is a lifelong continuous process.", isCorrect: true },
    ],
  },
];

const ReflexAdaptability = () => {
  const location = useLocation();
  const gameId = "ehe-adults-98";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_ADAPTABILITY_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 20;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 40;
  const stage = REFLEX_ADAPTABILITY_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Missing the moment can look like avoiding change!", isCorrect: false });
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
      title="Reflex: Adaptability"
      subtitle={
        showResult
          ? "Excellent! You consistently adapt gradually instead of complaining or avoiding change."
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Adapted' : '❌ Stagnant'}</span>
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

export default ReflexAdaptability;
