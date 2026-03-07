import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You are considering pursuing an advanced degree to boost your career. What is the most strategic first step?",
    options: [
      { id: "opt1", text: "Enroll in the most expensive program to ensure immense prestige.", outcome: "Prestige without assessing ROI can lead to crushing debt with little career benefit.", isCorrect: false },
      { id: "opt3", text: "Wait until your current employer mandates you to get one.", outcome: "Waiting simply stalls your career growth and leaves you unprepared.", isCorrect: false },
      { id: "opt2", text: "Research the Return on Investment (ROI) and alignment with your specific career goals.", outcome: "Correct! Evaluating ROI and career alignment ensures your education is a strategic investment.", isCorrect: true },
      { id: "opt4", text: "Take any available general course just to have an extra degree on your resume.", outcome: "A random degree adds little value and wastes your time and money.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "You want to transition to a high-demand tech role but lack a formal background. What is the best strategy?",
    options: [
      { id: "opt1", text: "Quit your current job immediately to apply for senior tech roles.", outcome: "Quitting without a backup or matching skills creates high financial risk and stress.", isCorrect: false },
      { id: "opt3", text: "Start completing specialized, industry-recognized certifications while staying employed.", outcome: "Correct! Building skills concurrently minimizes risk while making you a viable candidate.", isCorrect: true },
      { id: "opt2", text: "Exaggerate your current resume capabilities to secure a quick tech interview.", outcome: "Dishonesty damages your professional reputation and usually leads to swift termination.", isCorrect: false },
      { id: "opt4", text: "Give up on the transition entirely because you lack a computer science degree.", outcome: "Self-limitation ignores alternative, valid pathways like certifications and bootcamps.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "A costly online bootcamp promises a guaranteed 6-figure job upon completion. How do you evaluate this claim?",
    options: [
        { id: "opt4", text: "Reach out to past alumni on LinkedIn to verify their actual job placement outcomes.", outcome: "Correct! Independent verification protects your investment and reveals true program value.", isCorrect: true },
      { id: "opt1", text: "Pay the high fee immediately to secure your spot for the guaranteed job.", outcome: "Blind trust in marketing can lead to significant financial loss and disappointment.", isCorrect: false },
      { id: "opt2", text: "Take a large personal loan to cover the costs without checking actual student reviews.", outcome: "Taking unverified financial risks for education is a poor long-term strategy.", isCorrect: false },
      { id: "opt3", text: "Ignore it entirely because all fast-track educational programs are scams.", outcome: "Dismissing all options prevents you from finding genuinely helpful programs.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "You are offered a management promotion, but it strictly requires a leadership certification you don't have. What should you do?",
    options: [
        { id: "opt2", text: "Decline the promotion because you do not have the time or energy to study.", outcome: "Declining due to an easily solvable barrier stalls your upward mobility permanently.", isCorrect: false },
        { id: "opt3", text: "Accept it and actively avoid meetings hoping they forget the requirement.", outcome: "Avoiding requirements demonstrates unreliability and can cost you the promotion later.", isCorrect: false },
        { id: "opt4", text: "Resign out of frustration because they should promote you based on experience alone.", outcome: "Quitting over standard corporate requirements is an emotional and detrimental reaction.", isCorrect: false },
        { id: "opt1", text: "Negotiate for company sponsorship to complete the certification while transitioning into the role.", outcome: "Correct! Leveraging company resources for upskilling shows initiative and problem-solving.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "Your industry is rapidly shifting towards new regulatory compliance standards. How should you adapt your learning plan?",
    options: [
      { id: "opt1", text: "Wait passively for your company HR to mandate and provide the training.", outcome: "Being passive means you lag behind peers who are actively adapting to industry shifts.", isCorrect: false },
      { id: "opt3", text: "Complain vocally about the new changes and refuse to learn the updated systems.", outcome: "Refusal to adapt to regulations makes you obsolete and a liability to your employer.", isCorrect: false },
      { id: "opt2", text: "Proactively source and complete training to become the team expert on the new standards.", outcome: "Correct! Proactive learning turns an industry shift into an opportunity for you to stand out.", isCorrect: true },
      { id: "opt4", text: "Assume your past experience is sufficient to naturally bypass the new compliance rules.", outcome: "Experience does not override new legal or regulatory standards; assuming so is dangerous.", isCorrect: false },
    ],
  },
];

const BadgeEducationStrategyPlanner = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  
  const gameId = "ehe-adults-90";
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
      title="Badge: Education Strategy Planner"
      subtitle={
        showResult
          ? "Achievement unlocked! You have mastered education planning strategies."
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
                  Planning: {score}/{totalStages}
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
                             {option.isCorrect ? 'Strategic Advantage' : 'Strategic Misstep'}
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

export default BadgeEducationStrategyPlanner;
