import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SINGLE_REVENUE_SOURCE_STAGES = [
  {
    id: 1,
    prompt: "Your business depends completely on one major customer. What is the biggest risk here?",
    options: [
      {
        id: "opt2",
        text: "Revenue vulnerability",
        outcome: "Correct! If that single customer leaves or goes bankrupt, your business drops to zero revenue immediately.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Guaranteed growth",
        outcome: "Relying on one customer limits growth because all your resources are tied to their specific needs.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Easier tax filing",
        outcome: "While having only one invoice might be easy, the existential risk to the business is massive.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "You notice 80% of your sales come from a single product feature. How should you react?",
    options: [
      {
        id: "opt1",
        text: "Stop selling the other features immediately",
        outcome: "Cutting off other revenue streams entirely increases your dependency and risk.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Acknowledge the strength, but actively develop cross-sells and new offerings",
        outcome: "Exactly! Capitalize on your winner while diversifying to protect against market shifts.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Ignore it and keep doing exactly what you are doing",
        outcome: "Ignoring concentration risk leaves you vulnerable if that single feature becomes obsolete.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "A massive enterprise client offers you a contract that requires 100% of your current company capacity. Should you take it?",
    options: [
      {
        id: "opt1",
        text: "Yes, immediately drop all other clients for this big name",
        outcome: "This puts immense power in the hands of one client who can now dictate your pricing and terms.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "No, never work with enterprise clients",
        outcome: "Enterprise clients are valuable, but they shouldn't constitute your entire business.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Carefully weigh the risk and negotiate terms that allow you to scale and maintain other clients",
        outcome: "Correct! You must protect your independence and diversify your client base.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "What is the business concept of 'Customer Concentration Risk'?",
    options: [
      {
        id: "opt1",
        text: "When customers cannot concentrate on your marketing",
        outcome: "This refers to marketing attention, not structural business risk.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "The financial danger of relying heavily on a very small number of clients",
        outcome: "Correct! High concentration means high fragility. Diverse revenue streams equal resilience.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Assembling all your customers in one geographic location",
        outcome: "While geographic concentration is a risk, the general term applies to revenue dependency.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "How can a young business effectively diversify its revenue?",
    options: [
       {
        id: "opt2",
        text: "By offering complementary services/products to existing clients or expanding to an adjacent market",
        outcome: "Spot on! This leverages your existing strengths while opening new, related income channels.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "By pivoting to a completely different industry every month",
        outcome: "Constant pivoting prevents you from building expertise or a loyal customer base.",
        isCorrect: false,
      },
     
      {
        id: "opt3",
        text: "By asking the current main client to pay double",
        outcome: "This usually damages the relationship and doesn't actually solve the structural dependency.",
        isCorrect: false,
      },
    ],
  },
];

const QuizSingleRevenueSource = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-53";
  const gameData = getGameDataById(gameId);
  const totalStages = SINGLE_REVENUE_SOURCE_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 15;
  const totalXp = gameData?.xp || location.state?.totalXp || 30;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = SINGLE_REVENUE_SOURCE_STAGES[currentStageIndex];

  const handleChoice = (option) => {
    if (selectedChoice) return;
    setSelectedChoice(option);
    if (option.isCorrect) {
      setScore((s) => s + 1);
     showCorrectAnswerFeedback(1, true);
    }
  };

  const handleNext = () => {
    if (currentStageIndex === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrentStageIndex((i) => i + 1);
    }
    setSelectedChoice(null);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Quiz: Single Revenue Source"
      subtitle={
        showResult
          ? "Well done! You understand the dangers of revenue concentration."
          : `Question ${currentStageIndex + 1} of ${totalStages}`
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

              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 to-indigo-600"></div>

              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 mb-8 border-b border-slate-700 pb-4">
                <span>Question {progressLabel}</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Score: {score}/{totalStages}
                </span>
              </div>

              <div className="text-center mb-10">
                <span className="inline-block py-1 px-3 rounded-full bg-violet-900/50 text-violet-300 text-xs font-bold uppercase tracking-wider mb-4 border border-violet-500/30">
                  Risk Check
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
                                {option.isCorrect ? '✅ Correct' : '❌ Incorrect'}
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

              {selectedChoice && (
                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg shadow-violet-500/25 transition-all duration-300 hover:scale-105 hover:shadow-violet-500/40"
                  >
                    {currentStageIndex === totalStages - 1 ? "See Results" : "Next →"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default QuizSingleRevenueSource;
