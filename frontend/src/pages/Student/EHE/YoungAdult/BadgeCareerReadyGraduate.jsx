import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You are applying for jobs. A recruiter looks at your resume for 6 seconds. What must stand out immediately?",
    options: [
      { id: "opt3", text: "A clear summary of your core skills and measurable achievements (e.g., 'Increased sales by 20%').", outcome: "Correct! Quantified achievements instantly prove your value and grab attention.", isCorrect: true },
      { id: "opt1", text: "A detailed list of your hobbies and favorite movies.", outcome: "Irrelevant personal details waste precious recruiter attention.", isCorrect: false },
      { id: "opt2", text: "A massive block of text describing every task you've ever done.", outcome: "Dense text is unreadable in a quick scan and gets skipped.", isCorrect: false },
      { id: "opt4", text: "A complex, highly stylized graphic design layout.", outcome: "Over-designed resumes often fail Applicant Tracking Systems (ATS) and confuse human readers.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "You receive an invitation for an interview in two days. How do you prepare?",
    options: [
      { id: "opt1", text: "Just show up and wing it; authenticity is all that matters.", outcome: "Lack of preparation is immediately obvious and shows disrespect for the opportunity.", isCorrect: false },
      { id: "opt3", text: "Deeply research the company, align your past experiences with their specific needs, and prepare thoughtful questions to ask them.", outcome: "Correct! Strategic preparation demonstrates strong interest and professional competence.", isCorrect: true },
      { id: "opt2", text: "Memorize scripted answers from the internet word-for-word.", outcome: "Robotic answers prevent genuine connection and fail when unexpected questions arise.", isCorrect: false },
      { id: "opt4", text: "Only focus on picking out the perfect interview outfit.", outcome: "Appearance matters, but substance lands the job.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "During an interview, you are asked about a time you failed. How do you respond?",
    options: [
      { id: "opt1", text: "Claim you have never failed at anything professional.", outcome: "Claiming perfection destroys credibility and shows a dangerous lack of self-awareness.", isCorrect: false },
      { id: "opt2", text: "Blame a failure entirely on your previous boss or coworkers.", outcome: "Deflecting blame is a massive red flag indicating toxicity and lack of accountability.", isCorrect: false },
      { id: "opt3", text: "Describe a genuine mistake, take full responsibility, and explain exactly what you learned and how you improved.", outcome: "Correct! Employers want resilient learners who own their growth, not perfect robots.", isCorrect: true },
      { id: "opt4", text: "Give a fake 'weakness' disguised as a strength, like 'I work too hard'.", outcome: "This cliché answer is universally disliked by recruiters for being evasive.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "You secure the job offer. They offer a starting salary slightly below market average. What is your move?",
    options: [
      { id: "opt1", text: "Accept it immediately out of fear they might revoke the offer.", outcome: "Accepting immediately leaves money on the table and establishes a lower baseline for future raises.", isCorrect: false },
      { id: "opt2", text: "Reject it aggressively and demand 50% more.", outcome: "Aggression ruins the relationship and will likely lead to a withdrawn offer.", isCorrect: false },
      { id: "opt4", text: "Accept it but complain to your new coworkers on the first day.", outcome: "Starting a job with resentment creates instant toxicity.", isCorrect: false },
      { id: "opt3", text: "Professionally negotiate using data on market rates and clearly re-stating the unique value you bring.", outcome: "Correct! Professional, data-driven negotiation is expected and respected.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "It's your first 30 days on the new job. What is your primary objective?",
    options: [
      { id: "opt3", text: "Actively listen, build relationships, understand the company culture, and secure a small, quick win.", outcome: "Correct! The first 30 days are about learning the ecosystem and building trust.", isCorrect: true },
      { id: "opt1", text: "Try to completely change how their systems work to prove you are smart.", outcome: "Changing systems before understanding why they exist creates unnecessary friction.", isCorrect: false },
      { id: "opt2", text: "Keep your head down, speak to no one, and only do exactly what you are told.", outcome: "Extreme passivity makes you invisible and slows your integration into the team.", isCorrect: false },
      { id: "opt4", text: "Start asking for a promotion and a raise immediately.", outcome: "Demanding advancement before delivering sustained value shows poor judgment.", isCorrect: false },
    ],
  },
];

const BadgeCareerReadyGraduate = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();
  
  const gameId = "ehe-young-adult-80";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 20;
  // User requested 4 coins per level.
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
      title="Badge: Career Ready Graduate"
      subtitle={
        showResult
          ? "Achievement unlocked! You are career ready."
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
            <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.15)] overflow-hidden relative">
              
              {/* Premium aesthetic background */}
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-500/5 to-slate-900/20 pointer-events-none"></div>
              
              {/* Animated scanning line effect */}
              <div className="absolute left-0 top-0 w-full h-[2px] bg-blue-500/50 blur-sm animate-[scan_4s_ease-in-out_infinite]"></div>

              <div className="flex items-center justify-between text-sm font-bold uppercase tracking-[0.2em] text-blue-400 mb-6 border-b border-blue-500/30 pb-4 relative z-10">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                  Decision {progressLabel}
                </span>
                <span className="bg-blue-500/10 px-3 py-1 rounded border border-blue-500/30">
                  Career Readiness: {score}/{totalStages}
                </span>
              </div>
              
              <div className="bg-black/40 rounded-2xl p-6 mb-8 border border-blue-500/20 shadow-inner relative z-10">
                <p className="text-white text-xl md:text-2xl font-serif leading-relaxed">
                  {stage.prompt}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "bg-slate-800 border-slate-700 hover:border-blue-400 hover:bg-slate-700 text-slate-200";
                  
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
                             {option.isCorrect ? 'Professional Move' : 'Critical Misstep'}
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

export default BadgeCareerReadyGraduate;
