import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "A junior colleague consistently makes errors that slow down your department. How do you address this?",
    options: [
      { id: "opt1", text: "Publicly shame them in the team chat so they feel pressured to improve.", outcome: "Public shaming destroys trust and creates a toxic, fear-based environment.", isCorrect: false },
      { id: "opt2", text: "Quietly fix their mistakes yourself so the work gets done faster.", outcome: "Fixing it yourself prevents their learning and leads to your own burnout.", isCorrect: false },
      { id: "opt3", text: "Pull them aside privately, point out the errors constructively, and offer to walk them through the correct process.", outcome: "Correct! Private, constructive feedback coupled with support builds strong, capable teams.", isCorrect: true },
      { id: "opt4", text: "Immediately report them to HR without speaking to them first.", outcome: "Escalating minor issues without attempting peer resolution damages work relationships.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "You notice a significant security vulnerability in the company's software, but it's not your department. What do you do?",
    options: [
      { id: "opt1", text: "Ignore it. It's an IT problem, not yours.", outcome: "Ignoring critical risks demonstrates a lack of overall company stewardship.", isCorrect: false },
      { id: "opt2", text: "Document the vulnerability clearly and flag it to the IT or security team immediately.", outcome: "Correct! Professional discipline means protecting the organization, regardless of your specific role.", isCorrect: true },
      { id: "opt3", text: "Try to hack it yourself to see what happens.", outcome: "Unauthorized testing can trigger alarms, cause damage, and violate company policy.", isCorrect: false },
      { id: "opt4", text: "Post about the vulnerability on social media to warn others.", outcome: "Publicly exposing company vulnerabilities is a severe breach of confidentiality.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "A project deadline is approaching rapidly, and you realize you cannot complete your section on time. What is the disciplined approach?",
    options: [
      { id: "opt1", text: "Communicate the delay to your manager immediately, explain why, and propose a revised timeline or ask for resource help.", outcome: "Correct! Proactive communication allows the team to adjust before the deadline is missed in silence.", isCorrect: true },
      { id: "opt2", text: "Work in silence, miss the deadline, and apologize afterward.", outcome: "Surprising your team with a failure at the last minute is highly unprofessional.", isCorrect: false },
      { id: "opt3", text: "Rush the work and deliver a terrible quality product just to meet the clock.", outcome: "Delivering poor quality damages your reputation more than a negotiated delay.", isCorrect: false },
      { id: "opt4", text: "Call in sick on the day the project is due.", outcome: "Avoiding responsibility is the opposite of professional discipline.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "You disagree strongly with the strategic direction your manager has chosen for a new initiative. How do you handle it?",
    options: [
      { id: "opt1", text: "Refuse to work on the project until they change their mind.", outcome: "Insubordination is a quick way to derail your career.", isCorrect: false },
      { id: "opt2", text: "Complain to your peers about how incompetent the manager is.", outcome: "Undermining leadership breeds toxicity and reflects poorly on your character.", isCorrect: false },
      { id: "opt3", text: "Present your concerns privately to the manager with data backing your alternative. If they still proceed, commit fully to their decision.", outcome: "Correct! 'Disagree and commit' is a hallmark of mature professional discipline.", isCorrect: true },
      { id: "opt4", text: "Sabotage the project subtly so that your manager looks bad.", outcome: "Sabotage is unethical, destructive, and usually backfires spectacularly.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "You are representing your company at an industry conference. A competitor offers to buy you drinks to 'talk shop'.",
    options: [
      { id: "opt1", text: "Accept and brag about upcoming unreleased products to sound important.", outcome: "Leaking confidential information destroys your career and legal standing.", isCorrect: false },
      { id: "opt2", text: "Get heavily intoxicated because it's a 'networking event'.", outcome: "Losing professional composure in public harms both your and your company's reputation.", isCorrect: false },
      { id: "opt3", text: "Politely accept or decline, but maintain strict boundaries regarding proprietary information and company strategy while networking gracefully.", outcome: "Correct! You can network while maintaining absolute loyalty and discretion.", isCorrect: true },
      { id: "opt4", text: "Refuse to speak to anyone from a competing company entirely.", outcome: "Being overly defensive wastes valid networking and industry-learning opportunities.", isCorrect: false },
    ],
  },
];

const BadgeCareerFoundationReady = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  
  const gameId = "ehe-adults-10";
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
      title="Badge: Career Foundation Ready"
      subtitle={
        showResult
          ? "Achievement unlocked! You demonstrate professional discipline."
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
                  Discipline: {score}/{totalStages}
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
                             {option.isCorrect ? 'Correct Decision' : 'Poor Decision'}
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

export default BadgeCareerFoundationReady;
