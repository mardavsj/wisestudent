import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "A new competitor enters your market and immediately drops their prices by 30%. Your customers notice. What should be your first reaction?",
    options: [
      { id: "opt1", text: "Instantly drop your prices by 35% to show them who is the boss.", outcome: "Incorrect. Reacting purely on emotion starts a race to the bottom that destroys your margins.", isCorrect: false },
      { id: "opt3", text: "Ignore them completely; your customers will never leave you.", outcome: "Incorrect. Ignoring a massive price drop invites churn; you must address the market shift.", isCorrect: false },
      { id: "opt2", text: "Analyze why they can offer such low prices and assess your own unique value proposition.", outcome: "Correct! Understanding the threat before reacting ensures a strategic response.", isCorrect: true },
    ],
  },
  {
    id: 2,
    prompt: "You realize their product is lower quality, which explains the price. How should you frame this to your customers?",
    options: [
      { id: "opt1", text: "Publicly insult the competitor's product on social media to defend your brand.", outcome: "Incorrect. Bashing competitors looks unprofessional and damages your own credibility.", isCorrect: false },
      { id: "opt2", text: "Double down on marketing that highlights your superior quality, reliability, and service.", outcome: "Correct! Educate the customer on *why* they pay more for your superior offering.", isCorrect: true },
      { id: "opt3", text: "Apologize for your high prices but refuse to change them.", outcome: "Incorrect. Never apologize for charging what your premium product is actually worth.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "A key client asks you to match the competitor's price or they will leave. Matching it means you lose money on the deal. What do you do?",
    options: [
      { id: "opt2", text: "Hold your price, clearly explain your value, and be prepared to let them walk if necessary.", outcome: "Correct! Sometimes letting a price-sensitive customer go is the most profitable business decision.", isCorrect: true },
      { id: "opt1", text: "Take the loss to keep the client; revenue is revenue.", outcome: "Incorrect. Taking a loss to keep a client is unsustainable and hurts your cash flow.", isCorrect: false },
      { id: "opt3", text: "Match the price, but secretly deliver a lower-quality service to make up the difference.", outcome: "Incorrect. Secretly reducing quality is unethical and will destroy your reputation.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "What is the primary danger of permanently engaging in a 'price war' with competitors?",
    options: [
      { id: "opt2", text: "You will eventually make so much money that taxes become unmanageable.", outcome: "Incorrect. Price wars destroy profit margins; excess revenue is rarely the issue.", isCorrect: false },
      { id: "opt3", text: "Your competitors might complain to the authorities about your pricing.", outcome: "Incorrect. Unless you are engaging in illegal dumping, the real danger is self-inflicted bankruptcy.", isCorrect: false },
      { id: "opt1", text: "You train your customers to only care about price, destroying all brand loyalty.", outcome: "Correct! When price is the only factor, customers will leave the second someone else is cheaper.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "If you want to survive without dropping prices, what is the best strategy?",
    options: [
      { id: "opt1", text: "Change your business name frequently so customers get confused.", outcome: "Incorrect. This is deceptive, destroys SEO, and ruins brand equity.", isCorrect: false },
      { id: "opt2", text: "Enhance the customer experience, improve service differentiation, and bundle added value.", outcome: "Correct! Compete on value, experience, and service rather than fighting over pennies.", isCorrect: true },
      { id: "opt3", text: "Stop answering the phone so customers can't complain about prices.", outcome: "Incorrect. Ignoring customers is the fastest way to accelerate their departure.", isCorrect: false },
    ],
  },
];

const DebatePriceWar = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  const gameId = "ehe-adults-55";
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
      title="Debate: Price War"
      subtitle={
        showResult
          ? "Debate concluded! Competing on value is superior to engaging in a race to the bottom."
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

export default DebatePriceWar;
