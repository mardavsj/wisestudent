import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Your team discovers a 'shortcut' that boosts quarterly profits by 15%, but it bypasses several standard compliance checks. What is the most ethical first reaction?",
    options: [
      { id: "opt1", text: "Implement it immediately to impress the board with fast results.", outcome: "Incorrect. Prioritizing short-term profit over rules is a classic ethical failure.", isCorrect: false },
      { id: "opt2", text: "Pause the implementation and review the compliance risks thoroughly.", outcome: "Correct! Ethical leadership requires understanding the full impact before acting.", isCorrect: true },
      { id: "opt3", text: "Let the team use it quietly so you have plausible deniability if caught.", outcome: "Incorrect. Ignoring the issue and feigning ignorance destroys trust and accountability.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "A senior executive pressures you to approve the shortcut, arguing that 'everyone else in the industry does it.' How should you respond?",
    options: [
      { id: "opt1", text: "Agree, since standard industry practices dictate what is acceptable.", outcome: "Incorrect. Just because others do it doesn't make it legal or ethical.", isCorrect: false },
      { id: "opt3", text: "Approve it this one time but promise to follow the rules next quarter.", outcome: "Incorrect. Compromising once sets a dangerous precedent for future decisions.", isCorrect: false },
      { id: "opt2", text: "Firmly state that maintaining your company's compliance integrity is non-negotiable.", outcome: "Correct! Strong leaders hold the line on ethics even under pressure.", isCorrect: true },
    ],
  },
  {
    id: 3,
    prompt: "If avoiding the shortcut means the company will miss its quarterly profit target, what is the best approach?",
    options: [
      { id: "opt2", text: "Communicate clearly to stakeholders that you prioritized long-term compliance over short-term gains.", outcome: "Correct! Honesty and commitment to rules build lasting investor trust.", isCorrect: true },
      { id: "opt1", text: "Hide the projected loss from investors until you can find another loophole.", outcome: "Incorrect. Lack of transparency compounds the problem and damages reputation.", isCorrect: false },
      { id: "opt3", text: "Fire the team members who failed to meet the target legally to save face.", outcome: "Incorrect. Blaming your team for ethical limitations is toxic leadership.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "What is the long-term risk of consistently prioritizing fast results over compliance transparency?",
    options: [
      { id: "opt2", text: "There is no significant risk if you have a good PR team to spin the narrative.", outcome: "Incorrect. PR cannot fix fundamental legal and ethical breaches.", isCorrect: false },
      { id: "opt1", text: "Severe legal penalties, loss of reputation, and eventual collapse of the business.", outcome: "Correct! Systemic ethical failures almost always end in disaster.", isCorrect: true },
      { id: "opt3", text: "Employees might get a slightly smaller bonus at the end of the year.", outcome: "Incorrect. The risks extend far beyond minor financial bonuses.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "How does maintaining compliance integrity actively benefit the company over time?",
    options: [
      { id: "opt1", text: "It guarantees that the company will make the highest possible profit every quarter.", outcome: "Incorrect. Ethical choices might sometimes result in lower short-term profits.", isCorrect: false },
      { id: "opt3", text: "It makes the legal department's job easier, which is the only real benefit.", outcome: "Incorrect. While true, it drastically undersells the enterprise-wide value of ethics.", isCorrect: false },
      { id: "opt2", text: "It creates a culture of trust, attracts high-quality talent, and ensures sustainable growth.", outcome: "Correct! A strong ethical foundation is the bedrock of a resilient organization.", isCorrect: true },
    ],
  },
];

const DebateEthicalLeadership = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  const gameId = "ehe-adults-36";
  const gameData = getGameDataById(gameId);
  // Default to 10 coins / 20 XP
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
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
      title="Debate: Ethical Leadership"
      subtitle={
        showResult
          ? "Debate concluded! Maintaining compliance integrity is true leadership."
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

export default DebateEthicalLeadership;
