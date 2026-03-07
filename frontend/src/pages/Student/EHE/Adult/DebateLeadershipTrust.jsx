import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "A major project your team is working on falls severely behind schedule. As the manager, how do you communicate this to senior leadership?",
    options: [
      { id: "opt2", text: "Take ownership of the collective failure, explain the root causes objectively, and present a revised recovery plan.", outcome: "Correct! Ultimate responsibility rests with the leader. Owning the problem builds immense respect.", isCorrect: true },
      { id: "opt1", text: "Publicly blame your team members to ensure your own reputation isn't damaged.", outcome: "Incorrect. Throwing your team under the bus instantly destroys their trust in you and proves you lack true leadership.", isCorrect: false },
      { id: "opt3", text: "Hide the delay as long as possible and hope the team somehow catches up.", outcome: "Incorrect. Covering up delays only makes the eventual fallout catastrophically worse.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "After addressing senior leadership, how do you handle the underperforming team?",
    options: [
      { id: "opt1", text: "Yell at them in a group meeting so everyone understands how serious it is.", outcome: "Incorrect. Public humiliation creates an environment of fear, not high performance.", isCorrect: false },
      { id: "opt3", text: "Do nothing and assume the missed deadline was a sufficient wake-up call.", outcome: "Incorrect. Without intervention, whatever caused the delay will simply happen again.", isCorrect: false },
      { id: "opt2", text: "Hold private, structured 1-on-1s to identify blockers, clarify expectations, and provide necessary guidance.", outcome: "Correct! Effective managers diagnose the system failure and coach the individuals privately.", isCorrect: true },
    ],
  },
  {
    id: 3,
    prompt: "An individual contributor on the team continues to miss deadlines even after the reset. What is the appropriate leadership action?",
    options: [
      { id: "opt1", text: "Give all their remaining work to the highest performer on the team.", outcome: "Incorrect. This burns out your best people while enabling the underperformer.", isCorrect: false },
      { id: "opt2", text: "Establish a formal Performance Improvement Plan (PIP) with clear, measurable accountability.", outcome: "Correct! When coaching fails, you must enforce documented, structured accountability.", isCorrect: true },
      { id: "opt3", text: "Fire them immediately without any further discussion.", outcome: "Incorrect. Unless there was gross negligence, immediate firing without progressive discipline hurts team morale and invites legal risk.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "The team starts catching up, but morale is extremely low due to the recent pressure. How do you rebuild trust?",
    options: [
      { id: "opt2", text: "Celebrate the small, daily wins, publicly recognize individual effort, and explicitly thank them for pushing through the difficulty.", outcome: "Correct! Consistent, authentic recognition rebuilds psychological safety faster than anything else.", isCorrect: true },
      { id: "opt1", text: "Mandate a mandatory 'fun' team-building exercise on a Saturday.", outcome: "Incorrect. Forced fun on personal time usually breeds more resentment.", isCorrect: false },
      { id: "opt3", text: "Tell them to toughen up because stress is just part of the job.", outcome: "Incorrect. While true that jobs are stressful, dismissing their burnout is toxic management.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Ultimately, what is the core function of a leader during a crisis or failure?",
    options: [
      { id: "opt1", text: "To find out exactly whose fault it is and punish them accordingly.", outcome: "Incorrect. A culture of blame creates employees who hide mistakes rather than fix them.", isCorrect: false },
      { id: "opt3", text: "To do all the critical work themselves so it gets done right.", outcome: "Incorrect. This is micromanagement, making the team obsolete and the leader a bottleneck.", isCorrect: false },
      { id: "opt2", text: "To absorb the pressure from above, provide extreme clarity to the team below, and clear obstacles out of their way.", outcome: "Correct! The best leaders act as a shield and a snowplow, enabling the team to execute.", isCorrect: true },
    ],
  },
];

const DebateLeadershipTrust = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  const gameId = "ehe-adults-16";
  const gameData = getGameDataById(gameId);
  // Default to 5 coins / 10 XP as per usual adult game mapping
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  
  const stage = STAGES[currentStageIndex];

  const handleChoice = (option) => {
    if (selectedChoice || !stage) return;
    setSelectedChoice(option);
    if (option.isCorrect) {
      setScore((s) => s + 1);
      sshowCorrectAnswerFeedback(1, true);
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
      title="Debate: Leadership Trust"
      subtitle={
        showResult
          ? "Debate concluded! True leadership means providing guidance, not assigning blame."
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

export default DebateLeadershipTrust;
