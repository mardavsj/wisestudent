import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You are assigned a task you have never done before. How do you proceed?",
    options: [
      { id: "opt2", text: "Research how to do it, ask clarifying questions, and give it your best attempt.", outcome: "Correct! Initiative and a learning mindset are key to early-career growth.", isCorrect: true },
      { id: "opt1", text: "Refuse it because it's not in your job description.", outcome: "This limits your growth and makes you appear inflexible.", isCorrect: false },
      { id: "opt3", text: "Do it poorly so they don't ask you again.", outcome: "This damages your professional reputation and trustworthiness.", isCorrect: false },
      { id: "opt4", text: "Complain to your coworkers about the extra work.", outcome: "Creates a toxic environment and hurts your professional image.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "You made a significant mistake on a project. What is the most professional way to handle it?",
    options: [
      { id: "opt1", text: "Hide it and hope nobody notices.", outcome: "Cover-ups usually cause bigger problems later.", isCorrect: false },
      { id: "opt2", text: "Blame a colleague or external factors.", outcome: "Shifting blame shows a lack of leadership and accountability.", isCorrect: false },
      { id: "opt4", text: "Wait until your performance review to bring it up.", outcome: "Mistakes need immediate attention to minimize damage.", isCorrect: false },
      { id: "opt3", text: "Acknowledge the mistake immediately, propose a solution, and learn from it.", outcome: "Correct! Taking accountability builds trust and shows maturity.", isCorrect: true },
    ],
  },
  {
    id: 3,
    prompt: "During a meeting, you disagree with your manager's approach. What is the best action?",
    options: [
      { id: "opt2", text: "Interrupt them to tell them they are wrong in front of everyone.", outcome: "This is disrespectful and damages the working relationship.", isCorrect: false },
      { id: "opt3", text: "Stay quiet and complain about it later to your peers.", outcome: "This is unproductive and creates a negative team culture.", isCorrect: false },
      { id: "opt1", text: "Ask thoughtful questions to understand their perspective, and respectfully share your alternative idea.", outcome: "Correct! Constructive dialogue leads to better outcomes without undermining authority.", isCorrect: true },
      { id: "opt4", text: "Agree verbally but completely ignore their instructions.", outcome: "Insubordination will quickly ruin your career prospects.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "How should you approach networking within your company?",
    options: [
      { id: "opt1", text: "Focus only on talking to the executives to get promoted faster.", outcome: "This appears self-serving and ignores the value of peer collaboration.", isCorrect: false },
      { id: "opt4", text: "Build genuine relationships across different teams and levels to understand the whole business.", outcome: "Correct! Broad networking helps you understand the organization and creates cross-functional opportunities.", isCorrect: true },
      { id: "opt2", text: "Avoid everyone and just do your work in isolation.", outcome: "Isolation limits your visibility, learning, and future opportunities.", isCorrect: false },
      { id: "opt3", text: "Only talk to people when you need a favor from them.", outcome: "Networking should be mutually beneficial, not purely transactional.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "You want to ask for a raise. How should you prepare?",
    options: [
      { id: "opt3", text: "Document your recent achievements, the extra value you've brought, and research market rates.", outcome: "Correct! Compensation growth is tied to the proven value and impact you deliver.", isCorrect: true },
      { id: "opt1", text: "Threaten to quit if you don't get it.", outcome: "Ultimatums often backfire and damage your relationship with your employer.", isCorrect: false },
      { id: "opt2", text: "Complain that your colleagues make more money than you.", outcome: "Compensation should be based on your value, not comparisons.", isCorrect: false },
      { id: "opt4", text: "Just ask for it because you've been there for a year.", outcome: "Tenure alone does not usually justify a raise; value does.", isCorrect: false },
    ],
  },
];

const BadgeCareerStarter = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  const gameId = "ehe-young-adult-10";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
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
      title="Badge: Young Career Starter"
      subtitle={
        showResult
          ? "Achievement unlocked! You understand structured career foundations."
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
            <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-violet-500/30 shadow-[0_0_40px_rgba(139,92,246,0.15)] overflow-hidden relative">
              
              {/* Premium aesthetic background */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-violet-500/5 to-indigo-900/20 pointer-events-none"></div>
              
              {/* Animated scanning line effect */}
              <div className="absolute left-0 top-0 w-full h-[2px] bg-violet-500/50 blur-sm animate-[scan_4s_ease-in-out_infinite]"></div>

              <div className="flex items-center justify-between text-sm font-bold uppercase tracking-[0.2em] text-violet-400 mb-6 border-b border-violet-500/30 pb-4 relative z-10">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
                  Decision {progressLabel}
                </span>
                <span className="bg-violet-500/10 px-3 py-1 rounded border border-violet-500/30">
                  Correct: {score}/{totalStages}
                </span>
              </div>
              
              <div className="bg-black/40 rounded-2xl p-6 mb-8 border border-violet-500/20 shadow-inner relative z-10">
                <p className="text-white text-xl md:text-2xl font-serif leading-relaxed">
                  {stage.prompt}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "bg-slate-800 border-slate-700 hover:border-violet-400 hover:bg-slate-700 text-slate-200";
                  
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
                             {option.isCorrect ? 'Outcome: Excellent' : 'Outcome: Needs Improvement'}
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

export default BadgeCareerStarter;
