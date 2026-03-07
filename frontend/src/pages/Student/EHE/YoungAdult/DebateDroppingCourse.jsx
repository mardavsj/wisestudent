import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You receive a very low grade on your first mid-term exam and immediately want to drop out of the course in frustration. Is an emotional withdrawal the best first step?",
    options: [
      { id: "opt2", text: "No, you should calm down and objectively evaluate what went wrong before making a permanent decision.", outcome: "Correct! Emotional decisions in the face of temporary setbacks usually lead to regret.", isCorrect: true },
      { id: "opt1", text: "Yes, if you fail once, you are clearly not built for the subject and should quit immediately.", outcome: "Incorrect. Early failure is often just a signal that you need to change your study methods, not quit.", isCorrect: false },
      { id: "opt3", text: "Yes, quitting early saves you from the embarrassment of failing the final exam.", outcome: "Incorrect. Quitting out of fear of embarrassment guarantees failure by default.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Before officially dropping a difficult course, what is the most important academic and financial impact to evaluate?",
    options: [
      { id: "opt1", text: "How much more free time you will have to sleep in on Tuesdays.", outcome: "Incorrect. While true, this ignores the serious consequences of dropping.", isCorrect: false },
      { id: "opt2", text: "Whether dropping will delay your graduation, waste the tuition already paid, or affect your scholarship status.", outcome: "Correct! Dropping a course often has severe cascading effects on your timeline and finances.", isCorrect: true },
      { id: "opt3", text: "Whether your friends will judge you for giving up.", outcome: "Incorrect. Other people's opinions matter far less than your actual academic standing.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "You are struggling to understand the core concepts of the class. Instead of dropping out, what proactive step could you take?",
    options: [
      { id: "opt2", text: "Attend the professor's office hours, form a study group, or seek out a tutor immediately.", outcome: "Correct! Taking ownership of your learning and seeking help is how professionals overcome obstacles.", isCorrect: true },
      { id: "opt1", text: "Wait until the week before the final exam and hope the professor gives an easy test.", outcome: "Incorrect. Hoping for an easy test is a passive strategy that almost always fails.", isCorrect: false },
      { id: "opt3", text: "Complain loudly on social media about how unfair the professor is.", outcome: "Incorrect. Deflecting blame does nothing to improve your actual understanding.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "After evaluating everything, you objectively conclude that you are hopelessly behind and the course is deeply misaligned with your career goals. If you MUST drop, how should you do it?",
    options: [
      { id: "opt1", text: "Just stop going to class and assume the university will figure it out.", outcome: "Incorrect. This usually results in a permanent 'F' on your transcript.", isCorrect: false },
      { id: "opt2", text: "Follow the formal withdrawal process before the deadline to protect your GPA and potentially secure a partial refund.", outcome: "Correct! If you must retreat, do it strategically to minimize the damage.", isCorrect: true },
      { id: "opt3", text: "Burn your textbook in front of the lecture hall on your way out.", outcome: "Incorrect. Burning bridges and acting unprofessionally helps no one.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Ultimately, what is the most mature way to handle hitting a massive difficulty wall in your education or early career?",
    options: [
      { id: "opt1", text: "Panic, run away, and look for the absolute easiest path available.", outcome: "Incorrect. Avoiding all difficulty means you will never develop valuable skills.", isCorrect: false },
      { id: "opt3", text: "Stubbornly keep doing the exact same thing while expecting the results to change.", outcome: "Incorrect. Blind perseverance without strategy is just wasting energy.", isCorrect: false },
      { id: "opt2", text: "Pause, analyze the root cause of the difficulty, and make a logical, data-driven adjustment to your plan.", outcome: "Correct! Strategy and resilience will carry you through challenges that raw intelligence alone cannot.", isCorrect: true },
    ],
  },
];

const DebateDroppingCourse = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  const gameId = "ehe-young-adult-85";
  const gameData = getGameDataById(gameId);
  // Default to 20 coins / 40 XP as requested
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 20;
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 40;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  
  const stage = STAGES[currentStageIndex];

  const handleChoice = (option) => {
    if (selectedChoice || !stage) return;
    setSelectedChoice(option);
    if (option.isCorrect) {
      setScore((s) => s + 1);
      showCorrectAnswerFeedback(1, true);
    }
    setTimeout(() => {
      if (currentStageIndex === totalStages - 1) {
        setShowResult(true);
      } else {
        setCurrentStageIndex((i) => i + 1);
      }
      setSelectedChoice(null);
    }, 3500);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Debate: Dropping Course Without Plan"
      subtitle={
        showResult
          ? "Debate concluded! Always evaluate academic impact before emotional withdrawal."
          : `Point ${currentStageIndex + 1} of ${totalStages}`
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
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult && stage && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-slate-700 shadow-2xl relative overflow-hidden">
              
              {/* Podium aesthetic */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 to-indigo-600"></div>

              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8 border-b border-slate-700 pb-4">
                <span>Phase {progressLabel}</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Score: {score}/{totalStages}
                </span>
              </div>
              
              <div className="text-center mb-10">
                <span className="inline-block py-1 px-3 rounded-full bg-violet-900/50 text-violet-300 text-xs font-bold uppercase tracking-wider mb-4 border border-violet-500/30">
                  Topic of Debate
                </span>
                <p className="text-white text-xl md:text-2xl font-bold leading-relaxed">
                  "{stage.prompt}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "from-slate-800 to-slate-900 border-slate-700 hover:border-violet-500 hover:from-slate-800 hover:to-violet-900/40 text-slate-200";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "from-emerald-900/80 to-emerald-800 border-emerald-500 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-[1.02]"
                      : "from-rose-900/80 to-rose-800 border-rose-500 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.3)] scale-[1.02]";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "from-emerald-900/30 to-slate-900 border-emerald-500/50 text-emerald-400/80 ring-1 ring-emerald-500/30 opacity-80";
                  } else if (selectedChoice) {
                    baseStyle = "from-slate-900 to-slate-900 border-slate-800 text-slate-600 opacity-40";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative rounded-xl bg-gradient-to-r ${baseStyle} border-2 p-5 text-left font-medium transition-all duration-300 disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? (option.isCorrect ? 'border-emerald-400 bg-emerald-500/20' : 'border-rose-400 bg-rose-500/20') : 'border-slate-600'}`}>
                           {isSelected && <div className={`w-2.5 h-2.5 rounded-full ${option.isCorrect ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>}
                        </div>
                        <div className="flex-1">
                          <span className="block text-lg">{option.text}</span>
                          
                          <div className={`overflow-hidden transition-all duration-500 ${isSelected ? 'max-h-24 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className={`text-sm font-semibold p-3 rounded-lg ${option.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                              <span className="uppercase text-xs tracking-wider opacity-70 block mb-1">
                                {option.isCorrect ? 'Strong Argument' : 'Weak Argument'}
                              </span>
                              {option.outcome}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateDroppingCourse;
