import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_CERTIFICATION_STAGES = [
  {
    id: 1,
    prompt: "You see a massive discount on a bundle of 10 random online courses.",
    options: [
      { id: "opt1", text: "Buy them all for Quantity Collection", outcome: "Wrong! Stacking random certificates doesn't make you employable.", isCorrect: false },
      { id: "opt2", text: "Evaluate them for actual Skill Application", outcome: "Correct! Only take courses that build relevant, usable skills for your career.", isCorrect: true },
      { id: "opt3", text: "Buy them just because the Certificate Design looks nice", outcome: "Wrong! Recruiters care about skills, not graphic design on a PDF.", isCorrect: false },
      { id: "opt4", text: "Add them to your resume before even starting", outcome: "Wrong! Lying on your resume will get you blacklisted instantly.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "An employer asks about a specific certification listed prominently on your resume.",
    options: [
      { id: "opt1", text: "You can't remember the content due to Quantity Collection", outcome: "Wrong! If you list it, you must be prepared to be tested on it.", isCorrect: false },
      { id: "opt2", text: "You proudly describe the beautiful Certificate Design", outcome: "Wrong! The paper is worthless without the knowledge.", isCorrect: false },
      { id: "opt3", text: "You give a concrete example of Skill Application", outcome: "Correct! Being able to discuss how you apply the knowledge proves its value.", isCorrect: true },
      { id: "opt4", text: "You admit you skipped through the videos just to get the PDF", outcome: "Wrong! You just destroyed your credibility.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "You have limited free time this month for professional development.",
    options: [
      { id: "opt1", text: "Focus entirely on one tool for deep Skill Application", outcome: "Correct! Mastery of one high-demand skill beats surface-level knowledge of ten.", isCorrect: true },
      { id: "opt2", text: "Speedrun 5 easy beginner courses for Quantity Collection", outcome: "Wrong! Having five 'Introduction to X' certificates adds zero deep value.", isCorrect: false },
      { id: "opt3", text: "Spend hours finding a course with the best Certificate Design", outcome: "Wrong! You are optimizing for the wrong outcome entirely.", isCorrect: false },
      { id: "opt4", text: "Pay someone else to take the tests for you", outcome: "Wrong! Fraud will catch up with you during the technical interview.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "Your professional profile has 50 certificates but zero portfolio projects.",
    options: [
      { id: "opt1", text: "Keep doing Quantity Collection to reach 100", outcome: "Wrong! More paper won't fix the lack of proof.", isCorrect: false },
      { id: "opt2", text: "Start building a project to demonstrate Skill Application", outcome: "Correct! Employers want to see what you can build, not just what you've watched.", isCorrect: true },
      { id: "opt3", text: "Re-upload them because the Certificate Design looks impressive", outcome: "Wrong! Visual clutter won't distract a hiring manager from a lack of experience.", isCorrect: false },
      { id: "opt4", text: "Demand jobs based purely on the number of PDFs", outcome: "Wrong! Entitlement without proven capability is useless.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "You are deciding between a rigorous 3-month course and a 1-hour basic tutorial.",
    options: [
      { id: "opt1", text: "Take the 1-hour one purely for Quantity Collection", outcome: "Wrong! You are choosing illusion over education.", isCorrect: false },
      { id: "opt2", text: "Choose the hard course if it provides deep Skill Application", outcome: "Correct! True capability is forged through challenging, applied work.", isCorrect: true },
      { id: "opt3", text: "Take the 1-hour one if it gives a fancy Certificate Design", outcome: "Wrong! Pretty borders don't write code or solve business problems.", isCorrect: false },
      { id: "opt4", text: "Skip both and just fake the certificate for the hard one", outcome: "Wrong! Ethics matter; fakes get discovered quickly in the real world.", isCorrect: false },
    ],
  },
];

const ReflexCertificationCollection = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-69";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_CERTIFICATION_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 15;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 30;
  const stage = REFLEX_CERTIFICATION_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "You missed the chance to develop real skills!", isCorrect: false });
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
      title="Reflex: Certification Collection"
      subtitle={
        showResult
          ? "Great job! You focus on true capability."
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
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-fuchsia-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Scenario {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-fuchsia-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              {/* Question Display */}
              <div className="bg-black/50 border-2 border-fuchsia-900 shadow-[0_0_15px_rgba(232,121,249,0.2)] p-6 rounded-xl mt-6">
                 <div className="text-center font-mono text-fuchsia-300 text-lg tracking-widest uppercase mb-4 opacity-50">
                    ⚡ SKILL FOCUS ⚡
                 </div>
                 <p className="text-white text-xl md:text-2xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
                 <div className="text-center font-mono text-fuchsia-300 text-xs tracking-widest uppercase mt-4 opacity-50">
                    Make your decision before time runs out!
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "border-fuchsia-700 bg-slate-800 text-fuchsia-100 hover:bg-slate-700 hover:border-fuchsia-500 border-[3px]";
                  
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ True Capability' : '❌ Wasted Effort'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-fuchsia-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(232,121,249,0.4)] hover:scale-105 transform transition-all border border-fuchsia-400 hover:bg-fuchsia-500"
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

export default ReflexCertificationCollection;
