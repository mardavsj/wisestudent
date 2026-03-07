import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You notice an inefficient process that affects your entire team. What is the best action?",
    options: [
      { id: "opt1", text: "Complain about it to your colleagues but do nothing.", outcome: "Complaining without proposing solutions creates negativity.", isCorrect: false },
      { id: "opt3", text: "Research a solution, outline the benefits, and present it to your manager.", outcome: "Correct! Solving problems proactively is a strong indicator of leadership potential.", isCorrect: true },
      { id: "opt2", text: "Ignore it since it's not explicitly your job to fix it.", outcome: "This shows a lack of initiative and ownership.", isCorrect: false },
      { id: "opt4", text: "Wait for a senior colleague to notice and fix it.", outcome: "You miss a prime opportunity to demonstrate your value.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Your manager asks for a volunteer to lead a new, unfamiliar project. How do you respond?",
    options: [
      { id: "opt2", text: "Volunteer enthusiastically, asking for guidance if you hit roadblocks.", outcome: "Correct! Stepping out of your comfort zone is essential for rapid career growth.", isCorrect: true },
      { id: "opt1", text: "Avoid eye contact and hope someone else takes it.", outcome: "Avoiding challenges keeps you stagnant in your current role.", isCorrect: false },
      { id: "opt3", text: "Say you will do it only if you get a raise immediately.", outcome: "Demanding rewards before proving capability usually backfires.", isCorrect: false },
      { id: "opt4", text: "Decline, stating you only want to do tasks you have mastered.", outcome: "This limits your skill development and promotion potential.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "You want to accelerate your growth. What relationship should you actively cultivate?",
    options: [
      { id: "opt2", text: "Only befriend people who share your exact hobbies.", outcome: "While friendly, this doesn't specifically accelerate professional growth.", isCorrect: false },
      { id: "opt3", text: "Compete aggressively with all your peers so you look best.", outcome: "Toxic competition destroys teamwork and reputation.", isCorrect: false },
      { id: "opt4", text: "Avoid building relationships to focus purely on your computer screen.", outcome: "Career growth requires both technical skill and strong relationships.", isCorrect: false },
      { id: "opt1", text: "Find a mentor horizontally or vertically who can guide your development.", outcome: "Correct! Mentors provide invaluable guidance, feedback, and sometimes sponsorship.", isCorrect: true },
    ],
  },
  {
    id: 4,
    prompt: "You receive constructive feedback that stings. How do you handle it to promote growth?",
    options: [
      { id: "opt1", text: "Defend yourself immediately and explain why they are wrong.", outcome: "Defensiveness shuts down future feedback and learning.", isCorrect: false },
      { id: "opt4", text: "Thank them, reflect objectively, and create an action plan to improve.", outcome: "Correct! Highly successful professionals use feedback as fuel for growth.", isCorrect: true },
      { id: "opt2", text: "Take it personally and hold a grudge against the person.", outcome: "This damages professional relationships and hinders your progress.", isCorrect: false },
      { id: "opt3", text: "Agree verbally but secretly ignore the advice.", outcome: "You miss the opportunity to actually improve your crucial skills.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "It's performance review time. How do you ensure a productive conversation about promotion?",
    options: [
      { id: "opt1", text: "Assume your manager automatically knows everything you've accomplished.", outcome: "Managers are busy; you must advocate for your own achievements.", isCorrect: false },
      { id: "opt3", text: "Focus the conversation on how much you dislike your current tasks.", outcome: "Focusing on negatives rather than value creation hinders promotion.", isCorrect: false },
      { id: "opt2", text: "Bring a detailed document of your wins, extra responsibilities taken, and future goals.", outcome: "Correct! Preparation and clear documentation make the case for your advancement.", isCorrect: true },
      { id: "opt4", text: "Threaten to leave if you aren't promoted today.", outcome: "Ultimatums create adversarial relationships rather than collaborative growth.", isCorrect: false },
    ],
  },
];

const BadgeEmergingProfessional = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  const gameId = "ehe-young-adult-20";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = STAGES[currentStageIndex];

  const handleChoice = (option) => {
    if (selectedChoice || !stage) return;
    setSelectedChoice(option);
    if (option.isCorrect) {
      setScore((s) => s + 1);
      showCorrectAnswerFeedback(coinsPerLevel, true);
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
      title="Badge: Emerging Professional"
      subtitle={
        showResult
          ? "Achievement unlocked! You understand early-career advancement."
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
      isBadgeGame={gameData?.isBadgeGame}
      badgeName={gameData?.badgeName}
      badgeImage={gameData?.badgeImage}
      gameId={gameId}
      gameType="ehe"
      nextGamePath={location.state?.nextGamePath}
      nextGameId={location.state?.nextGameId}
      backPath={location.state?.returnPath}
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {!showResult && stage && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.15)] overflow-hidden relative">
              
              {/* Premium aesthetic background */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-amber-500/5 to-orange-900/20 pointer-events-none"></div>
              
              {/* Animated scanning line effect */}
              <div className="absolute left-0 top-0 w-full h-[2px] bg-amber-500/50 blur-sm animate-[scan_4s_ease-in-out_infinite]"></div>

              <div className="flex items-center justify-between text-sm font-bold uppercase tracking-[0.2em] text-amber-400 mb-6 border-b border-amber-500/30 pb-4 relative z-10">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  Scenario {progressLabel}
                </span>
                <span className="bg-amber-500/10 px-3 py-1 rounded border border-amber-500/30">
                  Growth: {score}/{totalStages}
                </span>
              </div>
              
              <div className="bg-black/40 rounded-2xl p-6 mb-8 border border-amber-500/20 shadow-inner relative z-10">
                <p className="text-white text-xl md:text-2xl font-serif leading-relaxed">
                  {stage.prompt}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "bg-slate-800 border-slate-700 hover:border-amber-400 hover:bg-slate-700 text-slate-200";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "bg-emerald-900 border-emerald-400 text-emerald-50 shadow-[0_0_20px_rgba(52,211,153,0.4)] scale-[1.02]"
                      : "bg-rose-900 border-rose-500 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.4)] scale-[1.02]";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "bg-emerald-900/30 border-emerald-500/50 text-emerald-300 opacity-90 ring-1 ring-emerald-500/50";
                  } else if (selectedChoice) {
                    baseStyle = "bg-slate-900/60 border-slate-800 text-slate-500 opacity-50";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative rounded-xl ${baseStyle} border-2 p-5 text-left font-medium transition-all duration-300 disabled:cursor-not-allowed`}
                    >
                      <span className="block text-lg leading-snug">{option.text}</span>
                      
                      {isSelected && (
                         <div className={`mt-4 text-sm font-semibold p-3 rounded-lg bg-black/50 border ${option.isCorrect ? 'text-emerald-300 border-emerald-500/40' : 'text-rose-300 border-rose-500/40'} animate-fade-in-up`}>
                           <span className="uppercase text-[10px] tracking-widest opacity-70 block mb-1">
                             {option.isCorrect ? 'Growth Achieved' : 'Opportunity Missed'}
                           </span>
                           {option.outcome}
                         </div>
                      )}
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

export default BadgeEmergingProfessional;
