import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_DIGITAL_PRESENCE_STAGES = [
  {
    id: 1,
    prompt: "Most of your target customers use smartphones to find local services, but your business isn't online.",
    options: [
      { id: "opt1", text: "Refuse to get online because technology is too confusing", outcome: "Wrong! Refusing to adapt to customer habits guarantees losing market share.", isCorrect: false },
      { id: "opt2", text: "Claim that an online presence is just a passing trend", outcome: "Wrong! Staying completely offline ignores the reality of modern commerce.", isCorrect: false },
      { id: "opt3", text: "Create a basic, professional website and claim your local business listing", outcome: "Correct! Building digital reach starts with establishing a solid, searchable foundation.", isCorrect: true },
      { id: "opt4", text: "Only put up paper flyers around the neighborhood", outcome: "Wrong! Relying solely on outdated methods limits your reach severely.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "A customer wants to see reviews of your work before hiring you, but you have nowhere for people to leave them.",
    options: [
      { id: "opt1", text: "Tell them to just trust you and take your word for it", outcome: "Wrong! In the digital age, consumers expect verifiable social proof.", isCorrect: false },
      { id: "opt2", text: "Set up a profile on major review platforms and ask past clients for honest feedback", outcome: "Correct! Digital reach involves actively managing and displaying customer trust.", isCorrect: true },
      { id: "opt3", text: "Get angry that they didn't trust you immediately", outcome: "Wrong! Acting defensive pushes potential clients to your competitors.", isCorrect: false },
      { id: "opt4", text: "Ignore the request and hope they hire you anyway", outcome: "Wrong! Ignoring valid requests for credibility costs you sales.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "You notice competitors answering customer questions on social media and getting new leads.",
    options: [
      { id: "opt1", text: "Say social media is a waste of time and ignore it", outcome: "Wrong! Staying completely offline means missing out on active customer engagement.", isCorrect: false },
      { id: "opt3", text: "Make an account but never post anything", outcome: "Wrong! An abandoned profile looks worse than having no profile at all.", isCorrect: false },
      { id: "opt4", text: "Create fake accounts to give your competitors bad reviews", outcome: "Wrong! This is unethical, illegal, and destructive to your own reputation.", isCorrect: false },
      { id: "opt2", text: "Create profiles on relevant platforms and actively engage with your community", outcome: "Correct! Building digital reach requires active participation where your audience spends time.", isCorrect: true },
    ],
  },
  {
    id: 4,
    prompt: "You want to run a marketing campaign to reach a very specific demographic in your city.",
    options: [
      { id: "opt2", text: "Run targeted online ads directed precisely at your ideal customer profile", outcome: "Correct! Digital reach allows for highly cost-effective and precise marketing.", isCorrect: true },
      { id: "opt1", text: "Buy an expensive billboard and hope the right people drive by", outcome: "Wrong! Traditional mass media is expensive and poorly targeted for specific niches.", isCorrect: false },
      { id: "opt3", text: "Refuse to spend any money on marketing", outcome: "Wrong! Refusing to market is refusing to grow.", isCorrect: false },
      { id: "opt4", text: "Stop trying to find new customers and just focus on current ones", outcome: "Wrong! While retention is good, staying completely offline stunts new acquisition.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "A potential client tries to find your contact info online at 11 PM but can't find anything.",
    options: [
      { id: "opt2", text: "Assume they will call you the next day if they really want to", outcome: "Wrong! Modern consumers expect immediate answers and will move to the next option.", isCorrect: false },
      { id: "opt1", text: "Ensure your website has clear contact info, hours, and a contact form available 24/7", outcome: "Correct! A digital presence acts as an always-open storefront for your business.", isCorrect: true },
      { id: "opt3", text: "Tell people to just come to your physical store during business hours", outcome: "Wrong! Staying completely offline creates unnecessary friction for potential buyers.", isCorrect: false },
      { id: "opt4", text: "Hide your contact info so people don't bother you", outcome: "Wrong! Making it hard to contact you ensures you won't get any business.", isCorrect: false },
    ],
  },
];

const ReflexDigitalPresence = () => {
  const location = useLocation();
  const gameId = "ehe-adults-57";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_DIGITAL_PRESENCE_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 15;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 30;
  const stage = REFLEX_DIGITAL_PRESENCE_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Hesitating means losing digital visibility to your competitors!", isCorrect: false });
      if (currentStageIndex === totalStages - 1) {
        setTimeout(() => {
          setShowResult(true);
        }, 800);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResult, selectedChoice, stage]);

  const handleChoice = (option) => {
    if (selectedChoice || !stage) return;
    setSelectedChoice(option);

    if (option.isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentStageIndex === totalStages - 1) {
      setTimeout(() => {
        setShowResult(true);
      }, 800);
    }
  };

  const handleNextStage = () => {
    if (!selectedChoice) return;
    if (currentStageIndex === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrentStageIndex((prev) => prev + 1);
      setTimeLeft(10);
    }
    setSelectedChoice(null);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Reflex: Digital Presence"
      subtitle={
        showResult
          ? "Excellent! You understand the power of building digital reach."
          : `Scenario ${currentStageIndex + 1} of ${totalStages}`
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
      <div className="space-y-8">
        {!showResult && stage && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-700 shadow-2xl relative overflow-hidden">
              {/* Timer Bar */}
              <div 
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-cyan-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Scenario {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              {/* Question Display */}
              <div className="bg-black/50 border-2 border-cyan-900 shadow-[0_0_15px_rgba(34,211,238,0.2)] p-6 rounded-xl mt-6">
                 <div className="text-center font-mono text-cyan-300 text-lg tracking-widest uppercase mb-4 opacity-50">
                    ⚡ RAPID DECISION ⚡
                 </div>
                 <p className="text-white text-xl md:text-2xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
                 <div className="text-center font-mono text-cyan-300 text-xs tracking-widest uppercase mt-4 opacity-50">
                    Tap the right behavior before time runs out!
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "border-cyan-700 bg-slate-800 text-cyan-100 hover:bg-slate-700 hover:border-cyan-500 border-[3px]";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "bg-emerald-900/80 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.5)] scale-105"
                      : "bg-rose-900/80 border-rose-400 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.5)] scale-105";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "bg-emerald-900/40 border-emerald-500/50 text-emerald-300/80 ring-2 ring-emerald-500/30";
                  } else if (selectedChoice) {
                    baseStyle = "bg-slate-900/50 border-slate-700/50 text-slate-500 opacity-50 scale-95";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative flex items-center justify-center rounded-xl ${baseStyle} p-4 text-center font-bold transition-all disabled:cursor-not-allowed text-sm md:text-base leading-tight min-h-[90px]`}
                    >
                      <span className="z-10">{option.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {selectedChoice && (
          <div className="animate-fade-in-up">
            <div className={`rounded-xl border-2 p-5 text-center font-bold text-lg shadow-lg ${selectedChoice.isCorrect ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200' : 'bg-rose-900/60 border-rose-500 text-rose-200'}`}>
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Build Digital Reach' : '❌ Stay Completely Offline'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-cyan-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(34,211,238,0.4)] hover:scale-105 transform transition-all border border-cyan-400 hover:bg-cyan-500"
                >
                  NEXT →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexDigitalPresence;
