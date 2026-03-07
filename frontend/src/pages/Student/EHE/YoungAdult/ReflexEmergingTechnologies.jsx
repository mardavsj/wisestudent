import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_EMERGING_TECH_STAGES = [
  {
    id: 1,
    prompt: "A new AI tool is released that automates part of your job.",
    options: [
      { id: "opt1", text: "Ignoring change and hoping it goes away", outcome: "Wrong! Technology rarely moves backward. Ignoring it makes you obsolete.", isCorrect: false },
      { id: "opt2", text: "Complaining about trends to your coworkers", outcome: "Wrong! Complaining doesn't protect your job.", isCorrect: false },
      { id: "opt3", text: "Quitting your job because technology is moving too fast", outcome: "Wrong! Giving up is not a strategy.", isCorrect: false },
      { id: "opt4", text: "Gradual skill adaptation to learn how to use it", outcome: "Correct! Mastering new tools makes you more valuable, not replaceable.", isCorrect: true },
    ],
  },
  {
    id: 2,
    prompt: "Your company announces mandatory training on a new software system.",
    options: [
      { id: "opt1", text: "Gradual skill adaptation by actively participating", outcome: "Correct! Adapting early saves you pain and frustration later.", isCorrect: true },
      { id: "opt2", text: "Complaining about trends and how the old system was better", outcome: "Wrong! Resistance to administrative change marks you as inflexible.", isCorrect: false },
      { id: "opt3", text: "Ignoring change and continuing to use the old system secretly", outcome: "Wrong! You will eventually cause a critical failure or data loss.", isCorrect: false },
      { id: "opt4", text: "Paying a colleague to do the training for you", outcome: "Wrong! This is unethical and leaves you without necessary skills.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "A new framework starts dominating industry job postings.",
    options: [
      { id: "opt1", text: "Ignoring change because you already know enough", outcome: "Wrong! Coasting on old knowledge limits your future opportunities.", isCorrect: false },
      { id: "opt2", text: "Complaining about trends and calling it a fad", outcome: "Wrong! Dismissing the market doesn't change what companies are hiring for.", isCorrect: false },
      { id: "opt4", text: "Gradual skill adaptation by building a small project with it", outcome: "Correct! A practical approach helps you learn efficiently without getting overwhelmed.", isCorrect: true },
      { id: "opt3", text: "Spending all your time arguing online about why the old way is better", outcome: "Wrong! Arguing online doesn't pay the bills.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "Your manager asks if you've heard about an emerging technology impacting your sector.",
    options: [
      { id: "opt1", text: "Gradual skill adaptation by researching it and discussing its potential", outcome: "Correct! Showing proactive interest marks you as a forward-thinking professional.", isCorrect: true },
      { id: "opt2", text: "Ignoring change and saying you don't follow tech news", outcome: "Wrong! This makes you look disinterested in the future of your industry.", isCorrect: false },
      { id: "opt3", text: "Complaining about trends and dismissing it as useless", outcome: "Wrong! You look resistant and closed-minded.", isCorrect: false },
      { id: "opt4", text: "Pretending you are an expert and making things up", outcome: "Wrong! Faking knowledge always backfires.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "You are feeling overwhelmed by how fast technology is advancing.",
    options: [
      { id: "opt1", text: "Complaining about trends and refusing to learn anymore", outcome: "Wrong! Surrendering guarantees professional stagnation.", isCorrect: false },
      { id: "opt3", text: "Gradual skill adaptation by setting aside 30 minutes a week to read news", outcome: "Correct! Small, consistent efforts keep you updated without burning you out.", isCorrect: true },
      { id: "opt2", text: "Panic-buying 20 courses you will never finish", outcome: "Wrong! Unfocused panic is just as bad as ignoring the change.", isCorrect: false },
      { id: "opt4", text: "Ignoring change and sticking to outdated methods", outcome: "Wrong! You will eventually be unable to compete.", isCorrect: false },
    ],
  },
];

const ReflexEmergingTechnologies = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-77";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_EMERGING_TECH_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 20;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 40;
  const stage = REFLEX_EMERGING_TECH_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Hesitation leaves you behind the curve!", isCorrect: false });
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
      title="Reflex: Emerging Technologies"
      subtitle={
        showResult
          ? "Excellent! You embrace the future with adaptability."
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
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-sky-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Scenario {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-sky-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              {/* Question Display */}
              <div className="bg-black/50 border-2 border-sky-900 shadow-[0_0_15px_rgba(56,189,248,0.2)] p-6 rounded-xl mt-6">
                 <div className="text-center font-mono text-sky-300 text-lg tracking-widest uppercase mb-4 opacity-50">
                    ⚡ TECH ADAPTATION ⚡
                 </div>
                 <p className="text-white text-xl md:text-2xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
                 <div className="text-center font-mono text-sky-300 text-xs tracking-widest uppercase mt-4 opacity-50">
                    Make your decision before time runs out!
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "border-sky-700 bg-slate-800 text-sky-100 hover:bg-slate-700 hover:border-sky-500 border-[3px]";
                  
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Future Proof' : '❌ Obsolete Approach'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-sky-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(56,189,248,0.4)] hover:scale-105 transform transition-all border border-sky-400 hover:bg-sky-500"
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

export default ReflexEmergingTechnologies;
