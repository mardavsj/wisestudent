import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You have decided to switch industries and need a new qualification. How do you approach this?",
    options: [
      { id: "opt1", text: "Quit your job and enroll in a random course.", outcome: "Quitting without a plan creates high financial risk and stress.", isCorrect: false },
      { id: "opt2", text: "Evaluate the skill gap and plan a transition timeline while learning.", outcome: "Correct! Structured planning minimizes risk while you build new skills.", isCorrect: true },
      { id: "opt3", text: "Expect an immediate salary hike without relevant experience.", outcome: "Unrealistic expectations can lead to rapid disappointment in a new industry.", isCorrect: false },
      { id: "opt4", text: "Rely on social media trends to pick an industry.", outcome: "Trends change fast; basing a career on them lacks long-term stability.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Your employer offers to sponsor your advanced study, but there is a commitment attached. What should you consider?",
    options: [
        { id: "opt3", text: "Carefully review the service bond and long-term commitment required.", outcome: "Correct! Understanding the commitments ensures the sponsorship aligns with your timeline.", isCorrect: true },
      { id: "opt1", text: "Accept blindly for the social prestige of the degree.", outcome: "Prestige doesn't pay the bills if you are trapped in an unfair contract.", isCorrect: false },
      { id: "opt2", text: "Reject it immediately because studying takes too much time.", outcome: "Outright rejection without consideration means missing a massive growth opportunity.", isCorrect: false },
      { id: "opt4", text: "Take the sponsorship and plan to break the contract later.", outcome: "Breaking a contract leads to severe financial and professional consequences.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "You are halfway through a challenging certification course, and your motivation declines. What is your response?",
    options: [
      { id: "opt1", text: "Withdraw from the course and blame your workload.", outcome: "Blaming external factors prevents you from building resilience.", isCorrect: false },
      { id: "opt2", text: "Pause the course indefinitely.", outcome: "An indefinite pause is usually a disguised abandonment of the goal.", isCorrect: false },
      { id: "opt4", text: "Complain to the instructor that the course is too hard.", outcome: "Complaining does not solve the fundamental issue of your own time management.", isCorrect: false },
      { id: "opt3", text: "Create a consistent completion plan to push through.", outcome: "Correct! Discipline and a structured plan will carry you through low motivation.", isCorrect: true },
    ],
  },
  {
    id: 4,
    prompt: "You complete multiple new certifications but do not feel any career growth. What might be the issue?",
    options: [
      { id: "opt1", text: "Certifications are universally useless for career growth.", outcome: "Certifications hold value, but only if they are applied practically.", isCorrect: false },
      { id: "opt3", text: "You need to buy even more expensive certifications.", outcome: "Spending more money won't fix a lack of practical application.", isCorrect: false },
      { id: "opt2", text: "You are getting them just for display without practical implementation at work.", outcome: "Correct! Knowledge only holds value when it is applied to solve real problems.", isCorrect: true },
      { id: "opt4", text: "Your employer is actively trying to ignore your achievements.", outcome: "Assuming malice without proving your new value is an unhelpful defensive mindset.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "You want to pursue a short, hyped course. How should you compare it to a comprehensive, long-term course?",
    options: [
      { id: "opt1", text: "Always pick the short course because it is faster to complete.", outcome: "Speed does not guarantee depth or market value.", isCorrect: false },
      { id: "opt3", text: "Match the course choice to your specific career objective and the actual return on investment (ROI).", outcome: "Correct! Strategic alignment and ROI are the only metrics that matter for education.", isCorrect: true },
      { id: "opt2", text: "Always pick the long course because it is harder.", outcome: "Difficulty alone is not a valid metric for career relevance.", isCorrect: false },
      { id: "opt4", text: "Choose based exclusively on which course has cooler marketing.", outcome: "Marketing sells the course to you, but skills sell you to the employer.", isCorrect: false },
    ],
  },
];

const BadgeHigherEducationMaster = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  
  const gameId = "ehe-adults-100";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 20;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 40;
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
      title="Badge: Higher Education Master"
      subtitle={
        showResult
          ? "Achievement unlocked! You have mastered advanced education transitions."
          : `Decision ${currentStageIndex + 1} of ${totalStages}`
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
            <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-sky-500/30 shadow-[0_0_40px_rgba(14,165,233,0.15)] overflow-hidden relative">
              
              {/* Premium aesthetic background */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-sky-500/5 to-blue-900/20 pointer-events-none"></div>
              
              {/* Animated scanning line effect */}
              <div className="absolute left-0 top-0 w-full h-[2px] bg-sky-500/50 blur-sm animate-[scan_4s_ease-in-out_infinite]"></div>

              <div className="flex items-center justify-between text-sm font-bold uppercase tracking-[0.2em] text-sky-400 mb-6 border-b border-sky-500/30 pb-4 relative z-10">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
                  Decision {progressLabel}
                </span>
                <span className="bg-sky-500/10 px-3 py-1 rounded border border-sky-500/30">
                  Mastery: {score}/{totalStages}
                </span>
              </div>
              
              <div className="bg-black/40 rounded-2xl p-6 mb-8 border border-sky-500/20 shadow-inner relative z-10">
                <p className="text-white text-xl md:text-2xl font-serif leading-relaxed">
                  {stage.prompt}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "bg-slate-800 border-slate-700 hover:border-sky-400 hover:bg-slate-700 text-slate-200";
                  
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
                             {option.isCorrect ? 'Strategic Mastery' : 'Critical Misstep'}
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

export default BadgeHigherEducationMaster;
