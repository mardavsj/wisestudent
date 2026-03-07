import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You hear that colleagues describe you as 'inconsistent.' What is the most mature first reaction?",
    options: [
      { id: "opt1", text: "Get angry and confront them because they shouldn't talk behind your back.", outcome: "Incorrect. Confrontation without self-reflection only proves you lack professionalism.", isCorrect: false },
      { id: "opt3", text: "Ignore them; their opinions don't affect your paycheck.", outcome: "Incorrect. Your reputation heavily influences promotions, team trust, and long-term career growth.", isCorrect: false },
      { id: "opt2", text: "Reflect on your recent performance to identify why they might feel that way.", outcome: "Correct! Self-awareness is the first step to improving your professional reputation.", isCorrect: true },
    ],
  },
  {
    id: 2,
    prompt: "To fix an inconsistent reputation, you consider job hopping to start fresh. Is this a good idea?",
    options: [
      { id: "opt1", text: "Yes, a new environment won't have any preconceived notions about you.", outcome: "Incorrect. While it feels easier, you don't fix the root cause, and the cycle will repeat.", isCorrect: false },
      { id: "opt2", text: "No, you must demonstrate consistent performance where you are. Job hopping avoids the real issue.", outcome: "Correct! True reputation repair comes from proving you can be reliable over time.", isCorrect: true },
      { id: "opt3", text: "Yes, but only if you ask for a higher salary each time you switch.", outcome: "Incorrect. Frequent switching for pay without building reliable skills will catch up to you.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "What is the best way to demonstrate consistent performance?",
    options: [
      { id: "opt2", text: "Under-promise, over-deliver, and reliably meet every deadline.", outcome: "Correct! Setting clear expectations and consistently meeting them builds solid trust.", isCorrect: true },
      { id: "opt1", text: "Stay at work for 12 hours a day so leadership sees you working hard.", outcome: "Incorrect. Burnout leads to more inconsistency. Results matter more than sheer hours.", isCorrect: false },
      { id: "opt3", text: "Take on every possible project, even if you can't realistically finish them.", outcome: "Incorrect. Overcommitting leads to dropped balls, which fuels the 'inconsistent' label.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "If you make a mistake while actively trying to rebuild your reputation, how should you handle it?",
    options: [
      { id: "opt2", text: "Hide it, so it doesn't add to your inconsistent reputation.", outcome: "Incorrect. Cover-ups always cause more damage when they are eventually discovered.", isCorrect: false },
      { id: "opt3", text: "Blame it on the pressure of everyone watching your performance.", outcome: "Incorrect. Shifting blame shows a lack of accountability and maturity.", isCorrect: false },
      { id: "opt1", text: "Acknowledge it immediately and communicate a clear plan to fix it.", outcome: "Correct! Transparency during a mistake actually builds trust rather than destroying it.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "Does a strong, consistent reputation take long to build?",
    options: [
      { id: "opt2", text: "Yes, consistency is measured over months and years, not days.", outcome: "Correct! A reliable reputation is a marathon. It takes sustained, repeated effort to prove.", isCorrect: true },
      { id: "opt1", text: "No, one really good week of work will change everyone's mind.", outcome: "Incorrect. Trust is lost instantly but requires significant time to rebuild.", isCorrect: false },
      { id: "opt3", text: "It depends entirely on whether your manager likes you personally.", outcome: "Incorrect. While relationships matter, measurable performance results speak for themselves.", isCorrect: false },
    ],
  },
];

const DebateReputationMatters = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  const gameId = "ehe-adults-6";
  const gameData = getGameDataById(gameId);
  // Default to 5 coins / 10 XP like other initial Adult games
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
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
      title="Debate: Reputation Matters"
      subtitle={
        showResult
          ? "Debate concluded! Consistent performance forms the foundation of a real career."
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

export default DebateReputationMatters;
