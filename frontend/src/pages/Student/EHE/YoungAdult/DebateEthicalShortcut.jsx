import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You are offered a freelance opportunity that pays extremely well, but it involves intentionally misleading customers about a product's capabilities. What is the real cost of saying yes?",
    options: [
      { id: "opt2", text: "It compromises your professional integrity and risks permanent damage to your reputation.", outcome: "Correct! Reputation is your most valuable asset; trading it for quick cash is a mathematically terrible deal.", isCorrect: true },
      { id: "opt1", text: "Nothing, as long as you get paid in cash and don't sign your name anywhere.", outcome: "Incorrect. The lack of a signature doesn't absolve you of the ethical and legal consequences.", isCorrect: false },
      { id: "opt3", text: "It just means you are finally learning how 'real business' is done.", outcome: "Incorrect. Scamming people is not 'real business'; it's fraud.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "A friend shows you a 'grey area' tax loophole that isn't technically illegal yet, but clearly violates the spirit of the law and could trigger heavy audits. Do you use it?",
    options: [
      { id: "opt1", text: "Yes, take every single advantage until the government explicitly stops you.", outcome: "Incorrect. Operating on the bleeding edge of legality makes a disastrous audit inevitable.", isCorrect: false },
      { id: "opt2", text: "No, the minor short-term money saved is not worth the massive risk of legal penalties and extreme stress.", outcome: "Correct! True professionals value legal safety and peace of mind over sketchy optimization.", isCorrect: true },
      { id: "opt3", text: "Yes, but only if you use a fake name on the forms.", outcome: "Incorrect. Attempting to mask identity while committing tax fraud guarantees severe criminal charges.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "You discover your company is using unlicensed software to save money. You need this software to do your job. What is your ethical obligation?",
    options: [
      { id: "opt1", text: "Keep quiet. It's the company's problem, and you need to get your work done.", outcome: "Incorrect. Complicity in theft, even if directed by an employer, makes you part of the problem.", isCorrect: false },
      { id: "opt3", text: "Report the company to the police immediately without saying a word to your boss.", outcome: "Incorrect. While whistleblowing is sometimes necessary, escalating to authorities immediately without internal address is rarely the first step.", isCorrect: false },
      { id: "opt2", text: "Professionally raise the issue with management, refusing to use stolen tools, and be prepared to leave if they refuse to comply with the law.", outcome: "Correct! Your personal liability and ethical standards must override an employer's cheapness.", isCorrect: true },
    ],
  },
  {
    id: 4,
    prompt: "During a startup phase, an investor will only give you funding if you agree to dramatically exaggerate your current user numbers on your public website. What do you do?",
    options: [
      { id: "opt1", text: "Exaggerate the numbers. Everyone fakes it until they make it in startups.", outcome: "Incorrect. 'Fake it till you make it' applies to confidence, not committing investor or consumer fraud.", isCorrect: false },
      { id: "opt2", text: "Reject the funding. Entering a partnership based on a foundational lie guarantees a toxic, and likely illegal, future.", outcome: "Correct! If an investor demands fraud on day one, the relationship is doomed anyway.", isCorrect: true },
      { id: "opt3", text: "Exaggerate the numbers, but plan to quickly delete the claim as soon as the money clears.", outcome: "Incorrect. Digital fraud leaves a permanent trail; deleting it later does not undo the crime.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Ultimately, why is prioritizing strict ethical compliance actually a long-term competitive advantage in business and career?",
    options: [
      { id: "opt1", text: "It isn't. Ethical people always finish last and make less money.", outcome: "Incorrect. This cynical view ignores the massive cost of legal bills, fines, and destroyed careers.", isCorrect: false },
      { id: "opt3", text: "It makes you look good on social media, which gets you more likes.", outcome: "Incorrect. Ethics is about what you do when no one is watching, not performative PR.", isCorrect: false },
      { id: "opt2", text: "It builds unshakeable trust with high-value clients, partners, and employers, creating sustainable, low-risk opportunities.", outcome: "Correct! Trust is the ultimate currency. Those who cut corners eventually run out of people willing to work with them.", isCorrect: true },
    ],
  },
];

const DebateEthicalShortcut = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  const gameId = "ehe-young-adult-95";
  const gameData = getGameDataById(gameId);
  // Default to 20 coins / 40 XP as requested
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
      title="Debate: Ethical Shortcut"
      subtitle={
        showResult
          ? "Debate concluded! Prioritizing ethics protects your future credibility."
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

export default DebateEthicalShortcut;
