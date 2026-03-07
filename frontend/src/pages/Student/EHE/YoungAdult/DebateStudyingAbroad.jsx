import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "All your friends are planning to study overseas. You feel pressured to join them just for the lifestyle and social status. Is this a good enough reason to take on massive student debt?",
    options: [
      { id: "opt1", text: "Yes, preserving social status among peers is the most important part of early adulthood.", outcome: "Incorrect. Taking on huge financial liabilities just to look cool is a path to long-term regret.", isCorrect: false },
      { id: "opt3", text: "Yes, you can always just borrow more money later to fix any financial mistakes.", outcome: "Incorrect. Unplanned borrowing compounds financial problems instead of solving them.", isCorrect: false },
      { id: "opt2", text: "No, education investments must be evaluated on cost versus measurable career benefits, not peer pressure.", outcome: "Correct! Social status is temporary; massive debt and career misalignment are permanent.", isCorrect: true },
    ],
  },
  {
    id: 2,
    prompt: "You are comparing a local top-tier university with a mid-tier overseas university. The overseas option costs five times as much. What should be your primary consideration?",
    options: [
      { id: "opt1", text: "How impressive the overseas university sounds to your extended family.", outcome: "Incorrect. Family prestige won't pay off your massive student loans.", isCorrect: false },
      { id: "opt2", text: "The Return on Investment (ROI): comparing the post-graduation salary prospects against the total cost of attendance.", outcome: "Correct! ROI is the ultimate metric for monumental financial decisions like education.", isCorrect: true },
      { id: "opt3", text: "Which country has the best weather and tourist attractions.", outcome: "Incorrect. You are choosing an academic and professional foundation, not a vacation.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "An overseas education consultant promises 'guaranteed' high-paying jobs abroad if you take their expensive package. How should you react?",
    options: [
      { id: "opt1", text: "Sign the contract immediately. Consultants always have insider knowledge.", outcome: "Incorrect. No one can 'guarantee' jobs, especially in changing global job markets.", isCorrect: false },
      { id: "opt3", text: "Take a huge loan to pay their premium fees, assuming it's an investment.", outcome: "Incorrect. Paying premium fees for empty promises is a trap.", isCorrect: false },
      { id: "opt2", text: "Be highly skeptical. Conduct independent research on actual visa policies, historical placement rates, and alumni success.", outcome: "Correct! Always verify aggressive marketing claims with hard, independent data.", isCorrect: true },
    ],
  },
  {
    id: 4,
    prompt: "You decide that the international exposure is crucial for your specific career path, but the costs are daunting. What is the most financially responsible approach?",
    options: [
      { id: "opt2", text: "Aggressively hunt for scholarships, grants, and consider high-quality universities in countries with lower tuition fees.", outcome: "Correct! Minimizing the debt burden while achieving the goal is the hallmark of financial maturity.", isCorrect: true },
      { id: "opt1", text: "Take the maximum possible private loan so you don't have to worry about a budget while studying.", outcome: "Incorrect. Maximizing debt for lifestyle comfort creates a crippling repayment burden later.", isCorrect: false },
      { id: "opt3", text: "Expect your parents to liquidate their retirement savings to fund the experience fully.", outcome: "Incorrect. Jeopardizing your parents' financial security is irresponsible.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "If you prioritize long-term career benefits over short-term social status when choosing your education, what is the most likely outcome 10 years down the line?",
    options: [
      { id: "opt1", text: "You will be miserable because you didn't party in the same country as your high school friends.", outcome: "Incorrect. True friends stay in touch, and professional success brings its own far greater satisfaction.", isCorrect: false },
      { id: "opt2", text: "You will likely have higher financial stability, lower crushing debt, and a career aligned with actual market demands.", outcome: "Correct! Strategic, objective choices in education lead to powerful, stable career trajectories.", isCorrect: true },
      { id: "opt3", text: "You will regret not spending more money when you had the chance to borrow it.", outcome: "Incorrect. Almost no one regrets graduating with lower debt.", isCorrect: false },
    ],
  },
];

const DebateStudyingAbroad = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  const gameId = "ehe-young-adult-66";
  const gameData = getGameDataById(gameId);
  // Default to 15 coins / 30 XP as requested
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 15;
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 30;
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
      title="Debate: Studying Abroad Decision"
      subtitle={
        showResult
          ? "Debate concluded! Base huge investments on ROI, not social status."
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

export default DebateStudyingAbroad;
