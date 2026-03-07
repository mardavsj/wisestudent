import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_CONFLICT_RESOLUTION_STAGES = [
  {
    id: 1,
    prompt: "During a team meeting, Manager A and Manager B start arguing loudly over a project deadline.",
    options: [
      { id: "opt1", text: "Pick the side of the manager you like more", outcome: "Wrong! Taking sides escalates the conflict and shows bias.", isCorrect: false },
      { id: "opt2", text: "Suggest taking a 5-minute break to cool down", outcome: "Correct! Structured & Neutral Resolution helps de-escalate tension.", isCorrect: true },
      { id: "opt3", text: "Yell at them to stop unprofessional behavior", outcome: "Wrong! Escalating the conflict makes the situation worse.", isCorrect: false },
      { id: "opt4", text: "Start packing up and leave the meeting silently", outcome: "Wrong! Avoiding the situation entirely doesn't help resolve the core issue.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "After the meeting, Manager A emails you asking for your support against Manager B.",
    options: [
      { id: "opt2", text: "Politely state you prefer to remain neutral", outcome: "Correct! Maintaining neutral boundaries is key to professional conflict resolution.", isCorrect: true },
      { id: "opt1", text: "Forward the email to Manager B to expose them", outcome: "Wrong! This escalates the conflict and breeds toxicity.", isCorrect: false },
      { id: "opt3", text: "Agree with Manager A just to keep them happy", outcome: "Wrong! Taking sides compromises your integrity.", isCorrect: false },
      { id: "opt4", text: "Report Manager A to HR immediately without talking", outcome: "Wrong! While HR is an option later, immediate escalation without setting boundaries is premature.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "The disagreement is causing delays in your dependent tasks.",
    options: [
      { id: "opt1", text: "Complain to your coworkers about both managers", outcome: "Wrong! Venting spreads negativity and doesn't solve the delay.", isCorrect: false },
      { id: "opt2", text: "Do nothing and wait for them to figure it out", outcome: "Wrong! Passive avoidance impacts your own deliverables.", isCorrect: false },
      { id: "opt4", text: "Do the work yourself, ignoring their instructions", outcome: "Wrong! Going rogue can create more confusion and alignment issues.", isCorrect: false },
      { id: "opt3", text: "Schedule a joint meeting focusing purely on task blockers", outcome: "Correct! Structured & Neutral Resolution drives progress despite personal conflicts.", isCorrect: true },
    ],
  },
  {
    id: 4,
    prompt: "Manager B tries to vent to you about Manager A's personality during a coffee break.",
    options: [
      { id: "opt1", text: "Join in and share your own criticisms", outcome: "Wrong! Participating in gossip fuels workplace conflict.", isCorrect: false },
      { id: "opt2", text: "Tell them you don't care about their drama", outcome: "Wrong! Being dismissive is unnecessarily aggressive and escalate tension.", isCorrect: false },
      { id: "opt3", text: "Gently steer the conversation back to work topics", outcome: "Correct! Neutral redirection maintains professionalism without escalating.", isCorrect: true },
      { id: "opt4", text: "Record the conversation secretly to use as evidence", outcome: "Wrong! This is a breach of trust and highly unprofessional.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "A final decision needs to be made, but both managers are at a stalemate.",
    options: [
      { id: "opt2", text: "Flip a coin openly in front of them to decide", outcome: "Wrong! This trivializes an important business decision.", isCorrect: false },
      { id: "opt1", text: "Evaluate both options against original project criteria", outcome: "Correct! Structured & Neutral Resolution relies on objective metrics, not personal opinions.", isCorrect: true },
      { id: "opt3", text: "Threaten to resign if they don't make a choice", outcome: "Wrong! Escalating with ultimatums is counterproductive.", isCorrect: false },
      { id: "opt4", text: "Choose the option that requires less work for you", outcome: "Wrong! Making decisions based on personal avoidance is poor practice.", isCorrect: false },
    ],
  },
];

const ReflexConflictResolution = () => {
  const location = useLocation();
  const gameId = "ehe-adults-33";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_CONFLICT_RESOLUTION_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = REFLEX_CONFLICT_RESOLUTION_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Missing the moment can lead to escalating conflicts!", isCorrect: false });
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
      title="Reflex: Conflict Resolution"
      subtitle={
        showResult
          ? "Excellent! You maintain professionalism and neutrality during conflicts."
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Neutral & Structured' : '❌ Taking Sides / Escalating'}</span>
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

export default ReflexConflictResolution;
