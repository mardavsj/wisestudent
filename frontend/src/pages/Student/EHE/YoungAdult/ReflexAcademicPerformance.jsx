import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_ACADEMIC_STAGES = [
  {
    id: 1,
    prompt: "You heard a rumor that companies only care about your portfolio.",
    options: [
      { id: "opt1", text: "Maintain Academic Performance because strong foundations matter", outcome: "Correct! Good grades prove discipline and core understanding.", isCorrect: true },
      { id: "opt2", text: "Neglect Grades entirely to build side projects", outcome: "Wrong! Without passing grades, you can't even get past the HR filter.", isCorrect: false },
      { id: "opt3", text: "Drop out immediately to work on your startup", outcome: "Wrong! You risk Reduced Eligibility for most structured graduate roles.", isCorrect: false },
      { id: "opt4", text: "Argue with your professors that their class is useless", outcome: "Wrong! Burning bridges in academia removes valuable references.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "A top-tier company visits your campus, but they have a strict 75% cutoff.",
    options: [
      { id: "opt1", text: "Complain that the system is unfair", outcome: "Wrong! Complaining does not change their hiring policies.", isCorrect: false },
      { id: "opt2", text: "You face Reduced Eligibility because you ignored your studies", outcome: "Wrong! Neglecting your GPA just locked you out of a great opportunity.", isCorrect: false },
      { id: "opt3", text: "Maintain Academic Performance so you meet the criteria naturally", outcome: "Correct! Academic consistency keeps all your doors open.", isCorrect: true },
      { id: "opt4", text: "Try to bribe the recruiter to ignore your GPA", outcome: "Wrong! That's unethical and will get you blacklisted.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "You are balancing a part-time job and a heavy course load.",
    options: [
      { id: "opt1", text: "Neglect Grades by skipping all your lectures to work more hours", outcome: "Wrong! You are sacrificing your long-term career for minor short-term gain.", isCorrect: false },
      { id: "opt2", text: "Create a schedule to Maintain Academic Performance while working", outcome: "Correct! Time management is the key to balancing both successfully.", isCorrect: true },
      { id: "opt3", text: "Quit your job and rely entirely on high-interest loans", outcome: "Wrong! Don't overleverged yourself if a balance is possible.", isCorrect: false },
      { id: "opt4", text: "Sleep in class and pretend you're absorbing the material", outcome: "Wrong! Delusion won't pass your final exams.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "Your friends invite you out every night during finals week.",
    options: [
      { id: "opt1", text: "Go out every night and Neglect Grades", outcome: "Wrong! Peer pressure shouldn't derail your academic goals.", isCorrect: false },
      { id: "opt2", text: "Tell them you need to Maintain Academic Performance and study", outcome: "Correct! Prioritizing your responsibilities shows maturity.", isCorrect: true },
      { id: "opt3", text: "Go out, but try to study while at the club", outcome: "Wrong! Multi-tasking like that guarantees you fail both activities.", isCorrect: false },
      { id: "opt4", text: "Lie and say you're sick to avoid them", outcome: "Wrong! Be honest about your priorities instead of inventing excuses.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "You are applying for a highly competitive master's program.",
    options: [
      { id: "opt1", text: "Assume your charm alone will get you accepted", outcome: "Wrong! Elite programs rely heavily on academic history.", isCorrect: false },
      { id: "opt2", text: "You realize you have Reduced Eligibility due to your past GPA", outcome: "Wrong! You didn't take your academics seriously when it mattered.", isCorrect: false },
      { id: "opt3", text: "You confidently apply because you resolved to Maintain Academic Performance", outcome: "Correct! Your strong transcript makes you a competitive candidate.", isCorrect: true },
      { id: "opt4", text: "Falsify your transcript to look better", outcome: "Wrong! Academic fraud is a criminal offense.", isCorrect: false },
    ],
  },
];

const ReflexAcademicPerformance = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-89";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_ACADEMIC_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 20;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 40;
  const stage = REFLEX_ACADEMIC_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Hesitation caused your academic standing to slip!", isCorrect: false });
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
      title="Reflex: Academic Performance"
      subtitle={
        showResult
          ? "Excellent! You understand the long-term value of maintaining your grades."
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
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-indigo-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Scenario {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-indigo-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              {/* Question Display */}
              <div className="bg-black/50 border-2 border-indigo-900 shadow-[0_0_15px_rgba(99,102,241,0.2)] p-6 rounded-xl mt-6">
                 <div className="text-center font-mono text-indigo-300 text-lg tracking-widest uppercase mb-4 opacity-50">
                    ⚡ ACADEMIC FOCUS ⚡
                 </div>
                 <p className="text-white text-xl md:text-2xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
                 <div className="text-center font-mono text-indigo-300 text-xs tracking-widest uppercase mt-4 opacity-50">
                    Make your decision before time runs out!
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "border-indigo-700 bg-slate-800 text-indigo-100 hover:bg-slate-700 hover:border-indigo-500 border-[3px]";
                  
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Strong Foundation' : '❌ Academic Risk'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-indigo-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(99,102,241,0.4)] hover:scale-105 transform transition-all border border-indigo-400 hover:bg-indigo-500"
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

export default ReflexAcademicPerformance;
