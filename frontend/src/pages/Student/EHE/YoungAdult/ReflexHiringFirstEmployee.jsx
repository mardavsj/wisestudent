import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_HIRING_STAGES = [
  {
    id: 1,
    prompt: "You are overwhelmed with customer orders and need help. Who do you hire?",
    options: [
      { id: "opt1", text: "Hire a close friend only, without interviewing", outcome: "Wrong! Mixing friendship and business without assessing skills is risky.", isCorrect: false },
      { id: "opt2", text: "Look for role clarity & skill match", outcome: "Correct! Hiring someone with the actual skills needed ensures orders get fulfilled.", isCorrect: true },
      { id: "opt3", text: "Hire someone who asks for the lowest salary choice", outcome: "Wrong! Cheap labor often means poor quality and more mistakes.", isCorrect: false },
      { id: "opt4", text: "Hire nobody and try to do it all yourself until you burn out", outcome: "Wrong! Refusing to delegate prevents your business from growing.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "You are writing the job description for your first employee.",
    options: [
      { id: "opt1", text: "Write vague duties so they can do whatever you need", outcome: "Wrong! Vague expectations lead to frustration and high turnover.", isCorrect: false },
      { id: "opt2", text: "Copy and paste a description for a completely different job", outcome: "Wrong! You will attract candidates who are mismatched for your needs.", isCorrect: false },
      { id: "opt3", text: "Define role clarity & skill match requirements precisely", outcome: "Correct! Clear expectations attract the right people and set them up for success.", isCorrect: true },
      { id: "opt4", text: "Don't write one; just explain it to them on their first day", outcome: "Wrong! Without a written agreement, performance tracking is impossible.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "During an interview, a candidate admits they lack experience but are eager to learn.",
    options: [
      { id: "opt1", text: "Reject them instantly. You only want experts", outcome: "Wrong! A good attitude and eagerness to learn can often make up for slight skill gaps.", isCorrect: false },
      { id: "opt2", text: "Ensure there is still fundamental role clarity & skill match for basic tasks", outcome: "Correct! Eagerness is great, but they must still meet the baseline requirements.", isCorrect: true },
      { id: "opt3", text: "Hire them immediately because they accepted the lowest salary choice", outcome: "Wrong! Excitement doesn't replace the need for competence.", isCorrect: false },
      { id: "opt4", text: "Hire them only because they are a close friend", outcome: "Wrong! Favoritism over qualifications hurts your business.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "You need someone to handle your accounting, which is highly specialized.",
    options: [
      { id: "opt1", text: "Hire your teenage cousin to save money", outcome: "Wrong! Trusting finances to an unqualified relative is dangerous.", isCorrect: false },
      { id: "opt2", text: "Seek professional role clarity & skill match", outcome: "Correct! Specialized roles require qualified professionals to avoid costly errors.", isCorrect: true },
      { id: "opt3", text: "Hire the first applicant regardless of their background", outcome: "Wrong! Desperation hiring leads to long-term operational problems.", isCorrect: false },
      { id: "opt4", text: "Just ignore the accounting until tax season", outcome: "Wrong! This guarantees fines and regulatory trouble.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "It's time to extend a job offer to your top candidate.",
    options: [
      { id: "opt1", text: "Offer the lowest salary choice possible to save cash", outcome: "Wrong! Lowballing great talent means they will leave for a better offer soon.", isCorrect: false },
      { id: "opt3", text: "Offer them equity in the company instead of any pay", outcome: "Wrong! Unless agreed upon, employees need stable compensation to live.", isCorrect: false },
      { id: "opt4", text: "Don't establish an official offer; just pay them in cash under the table", outcome: "Wrong! This is illegal and exposes you to massive liabilities.", isCorrect: false },
      { id: "opt2", text: "Offer a fair market rate based on role clarity & skill match", outcome: "Correct! Compensating fairly builds loyalty and shows you respect their value.", isCorrect: true },
    ],
  },
];

const ReflexHiringFirstEmployee = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-42";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_HIRING_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = REFLEX_HIRING_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Hesitation costs you good candidates!", isCorrect: false });
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
      title="Reflex: Hiring First Employee"
      subtitle={
        showResult
          ? "Excellent! You know how to hire the right talent."
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
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-violet-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Scenario {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-violet-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              {/* Question Display */}
              <div className="bg-black/50 border-2 border-violet-900 shadow-[0_0_15px_rgba(139,92,246,0.2)] p-6 rounded-xl mt-6">
                 <div className="text-center font-mono text-violet-300 text-lg tracking-widest uppercase mb-4 opacity-50">
                    ⚡ HIRING REFLEX ⚡
                 </div>
                 <p className="text-white text-xl md:text-2xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
                 <div className="text-center font-mono text-violet-300 text-xs tracking-widest uppercase mt-4 opacity-50">
                    Make your hiring decision before time runs out!
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "border-violet-700 bg-slate-800 text-violet-100 hover:bg-slate-700 hover:border-violet-500 border-[3px]";
                  
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Great Hire' : '❌ Bad Decision'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-violet-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(139,92,246,0.4)] hover:scale-105 transform transition-all border border-violet-400 hover:bg-violet-500"
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

export default ReflexHiringFirstEmployee;
