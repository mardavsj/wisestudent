import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_SOCIAL_MEDIA_STAGES = [
  {
    id: 1,
    prompt: "You are launching a new product on social media and need a promotional strategy.",
    options: [
      { id: "opt1", text: "Post irrelevant memes just for viral content", outcome: "Wrong! Going viral for irrelevant reasons doesn't convert to sales.", isCorrect: false },
      { id: "opt2", text: "Highlight product quality and service", outcome: "Correct! Showcasing real value builds trust with potential buyers.", isCorrect: true },
      { id: "opt3", text: "Buy thousands of fake followers", outcome: "Wrong! Fake metrics only give the illusion of success, not real sales.", isCorrect: false },
      { id: "opt4", text: "Focus entirely on getting only likes", outcome: "Wrong! Likes don't pay the bills; paying customers do.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "A recent post gets massive engagement, but a customer comments about a shipping delay.",
    options: [
      { id: "opt1", text: "Ignore it and celebrate the high like count", outcome: "Wrong! Focusing only on likes while ignoring customers ruins your reputation.", isCorrect: false },
      { id: "opt2", text: "Delete the comment to keep the post looking perfect", outcome: "Wrong! Hiding problems makes your business look untrustworthy.", isCorrect: false },
      { id: "opt3", text: "Address the issue publicly and provide excellent service", outcome: "Correct! Handling complaints well publicly shows strong customer service.", isCorrect: true },
      { id: "opt4", text: "Argue with the customer to create drama and viral content", outcome: "Wrong! Negative drama destroys brand trust.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "You want to increase conversions (actual sales) from your Instagram page.",
    options: [
      { id: "opt1", text: "Post clear testimonials showing product quality", outcome: "Correct! Social proof of quality directly drives conversions.", isCorrect: true },
      { id: "opt2", text: "Only post trending dance videos", outcome: "Wrong! If it doesn't relate to your product, it's just viral content filling up space.", isCorrect: false },
      { id: "opt3", text: "Beg your followers for likes", outcome: "Wrong! Desperation is a poor sales strategy.", isCorrect: false },
      { id: "opt4", text: "Spam irrelevant hashtags on every post", outcome: "Wrong! This attracts bots, not paying customers.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "A competitor is getting more followers than you by posting outrageous clickbait.",
    options: [
      { id: "opt1", text: "Copy their strategy to chase only likes", outcome: "Wrong! You will attract a low-quality audience that won't buy your product.", isCorrect: false },
      { id: "opt2", text: "Give up because you can't beat their numbers", outcome: "Wrong! Quality of audience matters much more than quantity.", isCorrect: false },
      { id: "opt4", text: "Post fake drama about them to go viral", outcome: "Wrong! This is unprofessional and risky behavior.", isCorrect: false },
      { id: "opt3", text: "Double down on highlighting your superior product quality and service", outcome: "Correct! Sustainable businesses compete on value, not cheap attention.", isCorrect: true },
    ],
  },
  {
    id: 5,
    prompt: "You need to measure the success of your social media marketing this month.",
    options: [
      { id: "opt1", text: "Track the number of new sales and returning customers", outcome: "Correct! Revenue and retention are the true indicators of business success.", isCorrect: true },
      { id: "opt2", text: "Count the total number of followers you gained", outcome: "Wrong! Followers are a vanity metric if they aren't buying anything.", isCorrect: false },
      { id: "opt3", text: "Only look at which post got the most likes", outcome: "Wrong! High likes without sales means your content isn't converting.", isCorrect: false },
      { id: "opt4", text: "See if any post went globally viral", outcome: "Wrong! Consistent, targeted reach is better than one random viral spike.", isCorrect: false },
    ],
  },
];

const ReflexSocialMediaBusiness = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-38";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_SOCIAL_MEDIA_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 20;
  const stage = REFLEX_SOCIAL_MEDIA_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Social media moves fast. Don't freeze up!", isCorrect: false });
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
      title="Reflex: Social Media Business"
      subtitle={
        showResult
          ? "Excellent! You know how to build real value online."
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
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-pink-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Scenario {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-pink-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              {/* Question Display */}
              <div className="bg-black/50 border-2 border-pink-900 shadow-[0_0_15px_rgba(236,72,153,0.2)] p-6 rounded-xl mt-6">
                 <div className="text-center font-mono text-pink-300 text-lg tracking-widest uppercase mb-4 opacity-50">
                    ⚡ MARKETING REFLEX ⚡
                 </div>
                 <p className="text-white text-xl md:text-2xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
                 <div className="text-center font-mono text-pink-300 text-xs tracking-widest uppercase mt-4 opacity-50">
                    Make your decision before time runs out!
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "border-pink-700 bg-slate-800 text-pink-100 hover:bg-slate-700 hover:border-pink-500 border-[3px]";
                  
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Real Value' : '❌ Vanity Metrics'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-pink-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(236,72,153,0.4)] hover:scale-105 transform transition-all border border-pink-400 hover:bg-pink-500"
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

export default ReflexSocialMediaBusiness;
