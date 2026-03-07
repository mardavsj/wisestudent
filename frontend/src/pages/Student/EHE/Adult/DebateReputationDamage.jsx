import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You made a significant professional mistake that has directly impacted a major client's trust. What is your immediate first step?",
    options: [
      { id: "opt1", text: "Try to quietly fix it before anyone notices so you don't look bad.", outcome: "Incorrect. Attempting to hide a client-facing mistake usually leads to a much larger disaster when it is inevitably discovered.", isCorrect: false },
      { id: "opt2", text: "Immediately notify your manager and proactively prepare a transparent correction plan for the client.", outcome: "Correct! Transparency, even when painful, is the only way to retain long-term trust after a mistake.", isCorrect: true },
      { id: "opt3", text: "Blame a junior team member who helped on the project.", outcome: "Incorrect. Shifting blame destroys your reputation internally and makes you look weak externally.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "When you present the correction plan to the client, how should you frame the conversation?",
    options: [
      { id: "opt1", text: "Downplay the mistake, telling them it's actually not a big deal and happens to everyone.", outcome: "Incorrect. Invalidating the client's concern shows a lack of empathy and professionalism.", isCorrect: false },
      { id: "opt3", text: "Apologize profusely without offering any actual solutions, hoping they just forgive you.", outcome: "Incorrect. An apology without an action plan is just asking the client to manage your guilt.", isCorrect: false },
      { id: "opt2", text: "Acknowledge the error clearly, outline exactly how it happened, and present the immediate steps you are taking to fix it.", outcome: "Correct! Clients want assurance that you have the situation under control and a clear path forward.", isCorrect: true },
    ],
  },
  {
    id: 3,
    prompt: "The client asks 'How do we know this won't happen again?' What is the best response?",
    options: [
      { id: "opt2", text: "Show them the new internal review process or systemic change you implemented to prevent this specific failure point.", outcome: "Correct! Process improvements show that you learned from the mistake and are actively managing risk.", isCorrect: true },
      { id: "opt1", text: "Just say 'I promise' and hope they believe you.", outcome: "Incorrect. Empty promises don't restore broken trust; demonstrable changes do.", isCorrect: false },
      { id: "opt3", text: "Tell them you will personally work 14 hours a day to make sure everything is perfect.", outcome: "Incorrect. Unsustainable personal effort doesn't fix a broken process and usually leads to burnout.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "After the immediate crisis is resolved, how do you handle the internal fallout with your team?",
    options: [
      { id: "opt2", text: "Pretend it never happened and move on as quickly as possible to avoid embarrassment.", outcome: "Incorrect. Ignoring the event wastes the learning opportunity and leaves the vulnerability open.", isCorrect: false },
      { id: "opt1", text: "Conduct a blameless post-mortem to analyze the system failure and document the lessons learned for everyone.", outcome: "Correct! Turning a failure into a documented learning opportunity strengthens the whole team.", isCorrect: true },
      { id: "opt3", text: "Constantly remind everyone of the mistake so they stay afraid of repeating it.", outcome: "Incorrect. Leading by fear kills innovation and makes people hide future mistakes.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "A year later, how does handling this mistake transparently affect your long-term reputation?",
    options: [
      { id: "opt1", text: "It ruins it completely. People will always only remember that one time you failed.", outcome: "Incorrect. While severe negligence is hard to overcome, honest mistakes handled well often increase respect.", isCorrect: false },
      { id: "opt3", text: "It makes no difference. Reputation is only based on how much money you make the company.", outcome: "Incorrect. Revenue matters, but trust is the currency that allows you to generate that revenue.", isCorrect: false },
      { id: "opt2", text: "It actually strengthens it. The client knows you won't lie to them when things get hard, making you a trusted partner.", outcome: "Correct! The strongest business relationships are often forged in how you handle adversity and failure together.", isCorrect: true },
    ],
  },
];

const DebateReputationDamage = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  const gameId = "ehe-adults-26";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const coinsPerLevel = Math.max(2, Math.floor(totalCoins / totalStages));
  
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
      title="Debate: Reputation Damage"
      subtitle={
        showResult
          ? "Debate concluded! Transparent correction is the only way to rebuild trust."
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

export default DebateReputationDamage;
