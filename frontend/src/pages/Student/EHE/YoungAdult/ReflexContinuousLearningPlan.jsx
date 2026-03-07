import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_CONTINUOUS_LEARNING_STAGES = [
  {
    id: 1,
    prompt: "You've been in your new role for 6 months and have finally mastered your daily tasks.",
    options: [
      { id: "opt1", text: "Settle into Static Learning since you know enough", outcome: "Wrong! Stagnation means you'll quickly become outdated.", isCorrect: false },
      { id: "opt2", text: "You are Waiting for Employer to assign you training", outcome: "Wrong! Relying entirely on others for your growth is a passive career strategy.", isCorrect: false },
      { id: "opt3", text: "Seek out new challenges for Continuous Improvement", outcome: "Correct! Proactive learning keeps your career momentum going.", isCorrect: true },
      { id: "opt4", text: "Take long breaks and do the bare minimum", outcome: "Wrong! Coasting leads to missed promotions and eventually termination.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Your industry suddenly introduces a highly efficient new methodology.",
    options: [
      { id: "opt1", text: "You are Waiting for Employer to pay for a certification", outcome: "Wrong! Take ownership of your own learning before it's mandated.", isCorrect: false },
      { id: "opt2", text: "Research the methodology independently for Continuous Improvement", outcome: "Correct! Self-education makes you more adaptable and valuable.", isCorrect: true },
      { id: "opt3", text: "Rely on Static Learning because the old way works fine", outcome: "Wrong! 'We've always done it this way' is a dangerous mindset in business.", isCorrect: false },
      { id: "opt4", text: "Only learn it if your manager specifically threatens to fire you", outcome: "Wrong! Fear-based learning is stressful and inefficient.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "You find yourself with a few hours of downtime between major assignments.",
    options: [
      { id: "opt1", text: "Spend the time scrolling social media", outcome: "Wrong! You just wasted a perfect opportunity to build capital.", isCorrect: false },
      { id: "opt2", text: "Use the time to read industry articles for Continuous Improvement", outcome: "Correct! Utilizing downtime for growth is a hallmark of high performers.", isCorrect: true },
      { id: "opt3", text: "Rely on Static Learning and refuse to look at anything outside your exact job", outcome: "Wrong! Heavy silos limit your understanding of the broader business.", isCorrect: false },
      { id: "opt4", text: "You are Waiting for Employer to tell you what to read", outcome: "Wrong! Micromanagement shouldn't be required for you to learn.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "A junior employee asks you a question about a technical tool you haven't used in years.",
    options: [
      { id: "opt1", text: "Make up an answer so you don't look bad", outcome: "Wrong! Falsifying information destroys trust and credibility.", isCorrect: false },
      { id: "opt3", text: "Rely on Static Learning and tell them to figure it out themselves", outcome: "Wrong! Refusing to mentor or collaborate isolates you.", isCorrect: false },
      { id: "opt4", text: "You are Waiting for Employer to send an expert instead", outcome: "Wrong! Passing the buck continuously shows a lack of leadership.", isCorrect: false },
      { id: "opt2", text: "Admit you don't know it well, then learn it together for Continuous Improvement", outcome: "Correct! Humility paired with a willingness to learn builds immense respect.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "It's time for your annual performance review and compensation discussion.",
    options: [
      { id: "opt1", text: "Showcase the independent skills you gained via Continuous Improvement", outcome: "Correct! Demonstrating self-driven value is the best way to secure a raise.", isCorrect: true },
      { id: "opt2", text: "Demand a raise based purely on Static Learning of your initial tasks", outcome: "Wrong! Doing exactly what you were hired for doesn't warrant a promotion.", isCorrect: false },
      { id: "opt3", text: "Blame your manager because you were Waiting for Employer to train you", outcome: "Wrong! Deflecting responsibility highlights your lack of initiative.", isCorrect: false },
      { id: "opt4", text: "Threaten to quit if they don't give you a senior title immediately", outcome: "Wrong! Ultimatums rarely work without incredible leverage.", isCorrect: false },
    ],
  },
];

const ReflexContinuousLearningPlan = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-96";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_CONTINUOUS_LEARNING_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 20;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 40;
  const stage = REFLEX_CONTINUOUS_LEARNING_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Hesitation caused your skills to stagnate!", isCorrect: false });
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
      title="Reflex: Continuous Learning Plan"
      subtitle={
        showResult
          ? "Excellent! You understand how to drive your own continuous improvement."
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
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-emerald-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Scenario {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              {/* Question Display */}
              <div className="bg-black/50 border-2 border-emerald-900 shadow-[0_0_15px_rgba(52,211,153,0.2)] p-6 rounded-xl mt-6">
                 <div className="text-center font-mono text-emerald-300 text-lg tracking-widest uppercase mb-4 opacity-50">
                    ⚡ LEARNING REFLEX ⚡
                 </div>
                 <p className="text-white text-xl md:text-2xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
                 <div className="text-center font-mono text-emerald-300 text-xs tracking-widest uppercase mt-4 opacity-50">
                    Make your decision before time runs out!
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "border-emerald-700 bg-slate-800 text-emerald-100 hover:bg-slate-700 hover:border-emerald-500 border-[3px]";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "bg-teal-900/80 border-teal-400 text-teal-200 shadow-[0_0_20px_rgba(45,212,191,0.5)] scale-105"
                      : "bg-rose-900/80 border-rose-400 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.5)] scale-105";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "bg-teal-900/40 border-teal-500/50 text-teal-300/80 ring-2 ring-teal-500/30";
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
            <div className={`rounded-xl border-2 p-5 text-center font-bold text-lg shadow-lg ${selectedChoice.isCorrect ? 'bg-teal-900/60 border-teal-500 text-teal-200' : 'bg-rose-900/60 border-rose-500 text-rose-200'}`}>
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Self-Starter' : '❌ Stagnation'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-emerald-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(52,211,153,0.4)] hover:scale-105 transform transition-all border border-emerald-400 hover:bg-emerald-500"
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

export default ReflexContinuousLearningPlan;
