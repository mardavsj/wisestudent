import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_EARLY_LEADERSHIP_STAGES = [
  {
    id: 1,
    prompt: "Your manager asks you to lead a small project with three other team members. You've never led a project before. What do you do?",
    options: [
      { id: "opt2", text: "Accept and prepare a project plan", outcome: "Correct! Stepping into the unknown with preparation shows strong leadership potential.", isCorrect: true },
      { id: "opt1", text: "Decline due to fear of making mistakes", outcome: "Wrong! Refusing opportunities out of fear guarantees you won't grow.", isCorrect: false },
      { id: "opt3", text: "Accept but delegate everything to your team immediately", outcome: "Wrong! Dumping work on others is abdicating responsibility, not leading.", isCorrect: false },
      { id: "opt4", text: "Wait to see if someone else volunteers first", outcome: "Wrong! Passive behavior means missed opportunities.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "During the project kickoff meeting, a team member asks a technical question you don't know the answer to.",
    options: [
      { id: "opt1", text: "Pretend you know and guess the answer", outcome: "Wrong! Bluffs get exposed quickly and damage your credibility as a leader.", isCorrect: false },
      { id: "opt2", text: "Panic and cancel the meeting", outcome: "Wrong! Leaders must handle uncertainty smoothly without panicking.", isCorrect: false },
      { id: "opt3", text: "Say you aren't the right person to lead this project", outcome: "Wrong! You don't need to know everything to lead a project.", isCorrect: false },
      { id: "opt4", text: "Acknowledge you don't know, but commit to finding out", outcome: "Correct! Good leaders are honest about their limits but take ownership of finding solutions.", isCorrect: true },
    ],
  },
  {
    id: 3,
    prompt: "One of your team members consistently misses their deadlines. How do you handle it as the project lead?",
    options: [
      { id: "opt1", text: "Complain to your manager that the person is lazy", outcome: "Wrong! Bypassing the person immediately damages trust. Talk to them first.", isCorrect: false },
      { id: "opt2", text: "Have a private, constructive conversation to find the roadblock", outcome: "Correct! Addressing performance issues with curiosity rather than accusation builds trust.", isCorrect: true },
      { id: "opt3", text: "Just do their work for them to avoid conflict", outcome: "Wrong! Doing others' work leads to burnout and sets a bad precedent.", isCorrect: false },
      { id: "opt4", text: "Publicly call them out in the next team meeting", outcome: "Wrong! Public shaming destroys morale and makes you look unprofessional.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "The project hits a major roadblock that delays the timeline by a week.",
    options: [
      { id: "opt1", text: "Hide the delay from your manager until the very end", outcome: "Wrong! Surprising leadership with bad news at the last minute breaks trust.", isCorrect: false },
      { id: "opt2", text: "Blame the delay on your team members", outcome: "Wrong! A good leader takes the blame for failures and gives credit for successes.", isCorrect: false },
      { id: "opt3", text: "Communicate the delay early with a proposed recovery plan", outcome: "Correct! Proactive communication with solutions shows maturity and accountability.", isCorrect: true },
      { id: "opt4", text: "Abandon the project since it's going poorly", outcome: "Wrong! Quitting when things get tough proves you aren't ready for leadership.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "The project ends successfully. During the final review with upper management, they praise your leadership.",
    options: [
      { id: "opt1", text: "Claim all the credit since you were in charge", outcome: "Wrong! Taking all the credit demoralizes the team that did the work.", isCorrect: false },
      { id: "opt2", text: "Highlight specific contributions made by your team members", outcome: "Correct! Great leaders shine the spotlight on their team's efforts.", isCorrect: true },
      { id: "opt3", text: "Downplay the success and say it was nothing", outcome: "Wrong! False modesty undermines your team's hard work.", isCorrect: false },
      { id: "opt4", text: "Demand an immediate promotion based on this one project", outcome: "Wrong! While it's a good win, demanding a promotion comes off as arrogant.", isCorrect: false },
    ],
  },
];

const ReflexEarlyLeadership = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-19";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_EARLY_LEADERSHIP_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = REFLEX_EARLY_LEADERSHIP_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Leaders must make timely decisions. Don't freeze!", isCorrect: false });
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
      title="Reflex: Early Leadership"
      subtitle={
        showResult
          ? "Excellent! You've demonstrated strong early leadership instincts."
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
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-amber-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Scenario {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              {/* Question Display */}
              <div className="bg-black/50 border-2 border-amber-900 shadow-[0_0_15px_rgba(251,191,36,0.2)] p-6 rounded-xl mt-6">
                 <div className="text-center font-mono text-amber-300 text-lg tracking-widest uppercase mb-4 opacity-50">
                    ⚡ LEADERSHIP REFLEX ⚡
                 </div>
                 <p className="text-white text-xl md:text-2xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
                 <div className="text-center font-mono text-amber-300 text-xs tracking-widest uppercase mt-4 opacity-50">
                    Make your leadership decision before time runs out!
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "border-amber-700 bg-slate-800 text-amber-100 hover:bg-slate-700 hover:border-amber-500 border-[3px]";
                  
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Correct Decision' : '❌ Poor Leadership Call'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-amber-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(251,191,36,0.4)] hover:scale-105 transform transition-all border border-amber-400 hover:bg-amber-500"
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

export default ReflexEarlyLeadership;
