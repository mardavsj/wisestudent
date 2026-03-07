import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_SKILL_CHECK_STAGES = [
  {
    id: 1,
    prompt: "You notice the industry standard software for your field is shifting to a new platform.",
    options: [
      { id: "opt3", text: "Spend an hour a week learning the basics of the new platform.", outcome: "Correct! Continuous Learning ensures you stay relevant through industry shifts.", isCorrect: true },
      { id: "opt1", text: "Ignore the shift. The old software still works fine.", outcome: "Wrong! Relying on Experience Alone while the industry evolves leads to obsolescence.", isCorrect: false },
      { id: "opt2", text: "Complain that the industry is moving too fast.", outcome: "Wrong! Resistance to change accelerates skill decay.", isCorrect: false },
      { id: "opt4", text: "Wait for your company to force you to learn it.", outcome: "Wrong! Passive learning leaves you vulnerable if the company suddenly downsizes.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "A junior colleague asks you how to solve a problem using a modern technique you aren't familiar with.",
    options: [
      { id: "opt1", text: "Dismiss the modern technique and tell them to do it the 'old way'.", outcome: "Wrong! Relying on Experience Alone prevents you from optimizing workflows.", isCorrect: false },
      { id: "opt3", text: "Admit you don't know it, research it together, and learn the new approach.", outcome: "Correct! Continuous Learning models growth and builds trust with younger talent.", isCorrect: true },
      { id: "opt2", text: "Tell them you don't know and it's not your job to learn.", outcome: "Wrong! A rigid mindset destroys your reputation as a senior resource.", isCorrect: false },
      { id: "opt4", text: "Pretend you know it and give them bad advice.", outcome: "Wrong! Ego over education destroys professional credibility.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Your manager offers to pay for an optional, advanced certification in your field.",
    options: [
      { id: "opt1", text: "Decline. You've been doing this job for 10 years; you don't need a test.", outcome: "Wrong! Relying on Experience Alone leaves your resume vulnerable to external validation.", isCorrect: false },
      { id: "opt3", text: "Take the money but never take the test.", outcome: "Wrong! This is unethical and breaks trust with your leadership.", isCorrect: false },
      { id: "opt2", text: "Accept it, study, and secure the certification.", outcome: "Correct! Free Continuous Learning through employer sponsorship is immediate career capital.", isCorrect: true },
      { id: "opt4", text: "Accept it but complain constantly about the study time.", outcome: "Wrong! A negative attitude negates the leadership value of the certification.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "A new AI tool is released that automates 30% of your current daily tasks.",
    options: [
      { id: "opt1", text: "Ban the tool from your workflow because it feels like 'cheating'.", outcome: "Wrong! Refusing leverage puts you at a severe competitive disadvantage.", isCorrect: false },
      { id: "opt3", text: "Let the AI do the work and spend the 30% time scrolling social media.", outcome: "Wrong! Wasting gained efficiency leads to stagnation.", isCorrect: false },
      { id: "opt4", text: "Panic and assume you will be fired immediately.", outcome: "Wrong! Fear paralyzes you instead of prompting adaptation.", isCorrect: false },
      { id: "opt2", text: "Learn to use the tool, then use the saved time to focus on higher-level strategy.", outcome: "Correct! Continuous Learning turns automation from a threat into leverage.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "You are updating your resume for a potential internal promotion.",
    options: [
      { id: "opt1", text: "Only list your job titles and years of tenure.", outcome: "Wrong! Relying on Experience Alone doesn't prove *what* you achieved or learned.", isCorrect: false },
      { id: "opt2", text: "Highlight specific new skills acquired and the direct impact of recent projects.", outcome: "Correct! Proving Continuous Learning makes you the obvious choice for promotion.", isCorrect: true },
      { id: "opt3", text: "Copy a generic job description from the internet.", outcome: "Wrong! Generic resumes reflect a generic, uninvested employee.", isCorrect: false },
      { id: "opt4", text: "Focus entirely on a college degree you got 15 years ago.", outcome: "Wrong! Past credentials matter less than current capability and adaptation.", isCorrect: false },
    ],
  },
];

const ReflexSkillCheck = () => {
  const location = useLocation();
  const gameId = "ehe-adults-29";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_SKILL_CHECK_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  // NOTE: User explicitly requested 10 total coin / 20 xp / 2 coin for each question.
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = REFLEX_SKILL_CHECK_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Hesitation leads to skill decay!", isCorrect: false });
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
      title="Reflex: Skill Check"
      subtitle={
        showResult
          ? "Excellent! You recognize that continuous learning outpaces stagnant experience."
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
                    ⚡ SKILL ADAPTATION ⚡
                 </div>
                 <p className="text-white text-xl md:text-2xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
                 <div className="text-center font-mono text-cyan-300 text-xs tracking-widest uppercase mt-4 opacity-50">
                    React before time runs out!
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Continuous Growth' : '❌ Stagnation Risk'}</span>
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

export default ReflexSkillCheck;
