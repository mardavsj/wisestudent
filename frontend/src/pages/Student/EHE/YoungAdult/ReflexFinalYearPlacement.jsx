import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_PLACEMENT_STAGES = [
  {
    id: 1,
    prompt: "Campus placement season was just announced for next month. What is your strategy?",
    options: [
      { id: "opt1", text: "Rely completely on Last-minute preparation", outcome: "Wrong! Cramming the night before an interview rarely works.", isCorrect: false },
      { id: "opt2", text: "Commit to Structured resume & interview practice", outcome: "Correct! Consistent preparation is the key to passing technical rounds.", isCorrect: true },
      { id: "opt3", text: "Escape the stress by increasing Social media activity", outcome: "Wrong! Distractions won't get you a job offer.", isCorrect: false },
      { id: "opt4", text: "Ignore the announcements and hope you get hired based on your degree", outcome: "Wrong! Degrees don't interview well; people do.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "You need to submit your resume for a major tech company tomorrow.",
    options: [
      { id: "opt1", text: "Hastily type something up as Last-minute preparation", outcome: "Wrong! A poorly formatted resume will be instantly rejected.", isCorrect: false },
      { id: "opt2", text: "Post online complaining about the process via Social media activity", outcome: "Wrong! Complaining online won't improve your resume.", isCorrect: false },
      { id: "opt3", text: "Use the results of your Structured resume & interview practice to tailor it", outcome: "Correct! A well-reviewed, tailored resume stands out.", isCorrect: true },
      { id: "opt4", text: "Copy your friend's resume entirely", outcome: "Wrong! Plagiarism is unethical and easily caught during the interview.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "You have your first major technical interview tomorrow morning.",
    options: [
      { id: "opt1", text: "Stay up all night doing Last-minute preparation", outcome: "Wrong! Exhaustion will ruin your cognitive performance.", isCorrect: false },
      { id: "opt2", text: "Review your notes from your Structured resume & interview practice and sleep well", outcome: "Correct! Rest is crucial after consistent preparation.", isCorrect: true },
      { id: "opt3", text: "Binge-watch videos on Social media activity until 3 AM", outcome: "Wrong! Self-sabotage before an interview is foolish.", isCorrect: false },
      { id: "opt4", text: "Cancel the interview out of fear of failure", outcome: "Wrong! You miss 100% of the opportunities you avoid.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "During a group discussion round, another candidate is dominating the conversation.",
    options: [
      { id: "opt1", text: "Give up and wait to do Last-minute preparation for the next company", outcome: "Wrong! Passive candidates are rarely selected.", isCorrect: false },
      { id: "opt2", text: "Check your phone to do some Social media activity under the table", outcome: "Wrong! This is incredibly disrespectful and will disqualify you.", isCorrect: false },
      { id: "opt4", text: "Shout over them to prove dominance", outcome: "Wrong! Aggression shows terrible teamwork skills.", isCorrect: false },
      { id: "opt3", text: "Use your Structured resume & interview practice to interject politely and add value", outcome: "Correct! Professionalism and tact under pressure are highly rated.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "You receive a rejection email from your dream company.",
    options: [
      { id: "opt2", text: "Ask for feedback and continue Structured resume & interview practice", outcome: "Correct! Resilience and continuous improvement lead to ultimate success.", isCorrect: true },
      { id: "opt1", text: "Vent angrily about the company via Social media activity", outcome: "Wrong! Unprofessional behavior can ruin future chances.", isCorrect: false },
      { id: "opt3", text: "Scramble for any job using frantic Last-minute preparation", outcome: "Wrong! Desperation leads to poor decision making.", isCorrect: false },
      { id: "opt4", text: "Blame the mock interviewers for asking you the wrong questions", outcome: "Wrong! Refusing to take accountability prevents growth.", isCorrect: false },
    ],
  },
];

const ReflexFinalYearPlacement = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-72";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_PLACEMENT_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 15;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 30;
  const stage = REFLEX_PLACEMENT_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Hesitation led to a missed opportunity!", isCorrect: false });
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
      title="Reflex: Final Year Placement"
      subtitle={
        showResult
          ? "Great job! You are ready to ace those interviews."
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
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-pink-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Scenario {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-pink-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              {/* Question Display */}
              <div className="bg-black/50 border-2 border-pink-900 shadow-[0_0_15px_rgba(244,114,182,0.2)] p-6 rounded-xl mt-6">
                 <div className="text-center font-mono text-pink-300 text-lg tracking-widest uppercase mb-4 opacity-50">
                    ⚡ PLACEMENT REFLEX ⚡
                 </div>
                 <p className="text-white text-xl md:text-2xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
                 <div className="text-center font-mono text-pink-300 text-xs tracking-widest uppercase mt-4 opacity-50">
                    Make your decision before time runs out!
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "border-pink-700 bg-slate-800 text-pink-100 hover:bg-slate-700 hover:border-pink-500 border-[3px]";
                  
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Well Prepared' : '❌ Poor Strategy'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-pink-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(244,114,182,0.4)] hover:scale-105 transform transition-all border border-pink-400 hover:bg-pink-500"
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

export default ReflexFinalYearPlacement;
