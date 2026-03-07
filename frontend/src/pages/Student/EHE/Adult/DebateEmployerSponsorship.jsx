import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Your employer offers to fully sponsor an advanced degree at a top university. However, it comes with a 5-year service bond. What is your immediate reaction?",
    options: [
      { id: "opt1", text: "Accept immediately! A free degree from a top school is an opportunity you can't refuse.", outcome: "Incorrect. Accepting blindly without understanding the long-term commitment can trap you in a role.", isCorrect: false },
      { id: "opt2", text: "Carefully review the service bond terms to understand how it aligns with your long-term career goals and timeline.", outcome: "Correct! Evaluating the commitment ensures the sponsorship benefits both you and the company.", isCorrect: true },
      { id: "opt3", text: "Reject it immediately. Any service bond is a trap and never worth the free education.", outcome: "Incorrect. Refusing outright misses a potentially massive opportunity for career growth.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "You realize the service bond penalty requires you to repay 150% of the tuition if you leave early. How does this impact your decision?",
    options: [
      { id: "opt1", text: "Ignore it. It's highly unlikely I'd ever want to leave such a generous company anyway.", outcome: "Incorrect. circumstances change, and ignoring massive financial penalties is poor planning.", isCorrect: false },
      { id: "opt3", text: "It proves they are trying to trap me, so I should quit my job in protest.", outcome: "Incorrect. It's a standard business mechanism to guarantee ROI on their investment, not a personal attack.", isCorrect: false },
      { id: "opt2", text: "It adds significant financial risk, meaning I must be absolutely certain I want to stay in this company for 5 years.", outcome: "Correct! Understanding the penalty puts the gravity of the 5-year commitment into perspective.", isCorrect: true },
    ],
  },
  {
    id: 3,
    prompt: "During the bond period, a competitor offers you a dream role with a 50% salary increase. How do you handle this?",
    options: [
      { id: "opt1", text: "Take the new job secretly and hope the old company forgets about the bond.", outcome: "Incorrect. Breaching a legal agreement will result in lawsuits and severe reputation damage.", isCorrect: false },
      { id: "opt2", text: "Calculate if the new financial package offsets the massive penalty of breaking the bond before making any moves.", outcome: "Correct! Making an objective calculation based on the contract allows you to make an informed choice.", isCorrect: true },
      { id: "opt3", text: "Complain to HR that the bond is unfair now that you have a better offer elsewhere.", outcome: "Incorrect. You signed the agreement willingly; complaining about the terms later is unprofessional.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "You are heavily considering the sponsorship. What is the most important factor to verify internally before signing?",
    options: [
      { id: "opt1", text: "To make sure I get a prestigious title upgrade immediately upon graduation.", outcome: "Incorrect. Titles are nice, but they don't guarantee actual career development or better work.", isCorrect: false },
      { id: "opt3", text: "To see if my colleagues are jealous of the exclusive opportunity.", outcome: "Incorrect. Focusing on office politics distracts from your actual professional development.", isCorrect: false },
      { id: "opt2", text: "To confirm there is an actual, guaranteed career progression path within the company once the degree is completed.", outcome: "Correct! Ensuring the company has a plan for your enhanced skills guarantees mutual benefit.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "After careful evaluation, you decide the 5-year commitment does not align with your goal to change industries in 2 years. How should you proceed?",
    options: [
        { id: "opt2", text: "Politely decline the sponsorship, citing alternative immediate focus areas, preserving your relationship and your freedom.", outcome: "Correct! Transparently declining the offer maintains your integrity and flexibility.", isCorrect: true },
      { id: "opt1", text: "Accept it anyway, get the degree, and try to find a legal loophole to break the bond later.", outcome: "Incorrect. Operating in bad faith will destroy your professional reputation.", isCorrect: false },
      { id: "opt3", text: "Tell your boss their offer is terrible and you are planning to leave the industry soon regardless.", outcome: "Incorrect. Burning bridges and oversharing your departure plans prematurely is risky.", isCorrect: false },
    ],
  },
];

const DebateEmployerSponsorship = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  const gameId = "ehe-adults-95";
  const gameData = getGameDataById(gameId);
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
      title="Debate: Employer Sponsorship"
      subtitle={
        showResult
          ? "Debate concluded! Reviewing service bonds carefully protects your career flexibility."
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

export default DebateEmployerSponsorship;
