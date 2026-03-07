import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "Customers on social media begin questioning the environmental transparency of your product claims. What is your first move?",
    options: [
      { id: "opt2", text: "Acknowledge their concerns openly and provide clear, honest data about your processes.", outcome: "Correct! Transparency builds immediate trust and de-escalates tension.", isCorrect: true },
      { id: "opt1", text: "Delete the comments and block the users to protect your brand image.", outcome: "Incorrect. Silencing customers creates a PR disaster and screams guilt.", isCorrect: false },
      { id: "opt3", text: "Launch a new marketing campaign to distract them from the issue.", outcome: "Incorrect. Distraction tactics frustrate customers and ignore the core problem.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "Your PR agency suggests using marketing 'exaggeration' to make the product sound more eco-friendly than it is. Do you agree?",
    options: [
      { id: "opt1", text: "Yes, everyone exaggerates a little bit in marketing to get sales.", outcome: "Incorrect. Greenwashing is unethical and damages long-term credibility.", isCorrect: false },
      { id: "opt3", text: "Yes, but only in regions where advertising laws are less strict.", outcome: "Incorrect. Exploiting loopholes destroys global brand reputation.", isCorrect: false },
      { id: "opt2", text: "No, honest and clear communication about exactly what the product does is non-negotiable.", outcome: "Correct! Honesty prevents future backlashes and builds a loyal customer base.", isCorrect: true },
    ],
  },
  {
    id: 3,
    prompt: "You realize there actually *is* a flaw in how your product's eco-impact was calculated. What should you do?",
    options: [
      { id: "opt1", text: "Quietly fix it for the next batch and never mention it again.", outcome: "Incorrect. Hiding mistakes leaves you vulnerable if the truth comes out later.", isCorrect: false },
      { id: "opt2", text: "Proactively issue a public correction, explain the mistake, and detail how you are fixing it.", outcome: "Correct! Owning mistakes publicly demonstrates extreme integrity.", isCorrect: true },
      { id: "opt3", text: "Blame the third-party supplier who provided the raw materials.", outcome: "Incorrect. Passing the buck makes you look weak and unaccountable.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "A competitor uses your public correction to attack your brand. How do you handle this?",
    options: [
      { id: "opt2", text: "Stay focused on your own transparency and let your honest actions speak for themselves.", outcome: "Correct! Customers respect brands that stay above the fray and focus on improvement.", isCorrect: true },
      { id: "opt1", text: "Launch a counter-attack highlighting their past failures.", outcome: "Incorrect. Engaging in mud-slinging is unprofessional and distracts from your message.", isCorrect: false },
      { id: "opt3", text: "Panic and retract your correction to save face.", outcome: "Incorrect. Backtracking destroys the trust you just tried to build.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "What is the ultimate long-term benefit of choosing honest communication over marketing exaggeration?",
    options: [
      { id: "opt1", text: "You never have to spend money on PR or advertising again.", outcome: "Incorrect. You still need marketing to reach people, even if you are honest.", isCorrect: false },
      { id: "opt3", text: "It guarantees that your products will always be the cheapest on the market.", outcome: "Incorrect. Trust allows you to charge a premium; it has nothing to do with being cheap.", isCorrect: false },
      { id: "opt2", text: "You build unbreakable brand loyalty because customers know they can trust your word.", outcome: "Correct! Trust is the most valuable and defensible asset a brand can own.", isCorrect: true },
    ],
  },
];

const DebateBrandReputation = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  const gameId = "ehe-adults-74";
  const gameData = getGameDataById(gameId);
  // Default to 15 coins / 30 XP
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 15;
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 30;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages)); // 3 coins per question
  
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
      title="Debate: Brand Reputation"
      subtitle={
        showResult
          ? "Debate concluded! Honest and clear communication builds lasting brand trust."
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

export default DebateBrandReputation;
