import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STORY_STAGES = [
  {
    id: 1,
    prompt: "A customer leaves a 1-star review on your page claiming the product they received was broken.",
    options: [
      {
        id: "opt1",
        text: "Delete the comment or hide it to protect your brand's reputation.",
        outcome: "Deleting legitimate complaints usually makes customers much angrier and they will post about you on other platforms where you have no control.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Respond publicly apologizing, and ask them to DM you so you can replace the item.",
        outcome: "Correct! You show the unhappy customer (and everyone else reading) that you are accountable and willing to fix mistakes.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Reply publicly accusing them of breaking it themselves.",
        outcome: "Starting public arguments with customers makes your company look highly unprofessional to all potential buyers.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Several customers email you saying your website's checkout process is confusing and keeps crashing.",
    options: [
      {
        id: "opt1",
        text: "Ignore them. If they really want to buy, they will figure it out.",
        outcome: "Failing to fix usability issues directly results in massive amounts of lost sales. Customers will just go to a competitor.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Tell them the website is fine and it must be an issue with their computer.",
        outcome: "Dismissing user feedback blinds you to critical technical problems that could be destroying your conversion rate.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Thank them for the feedback, investigate the checkout flow immediately, and fix the bug.",
        outcome: "Exactly! Treat bug reports from customers as free QA testing. Fixing it helps everyone.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 3,
    prompt: "A long-time, loyal customer complains that your newest product version is missing a feature they loved.",
    options: [
      {
        id: "opt1",
        text: "Acknowledge their frustration and explain why the change was made, offering a workaround if possible.",
        outcome: "Correct! Transparent communication maintains trust even when you can't give them exactly what they want.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Tell them to adapt to the new version or find another company.",
        outcome: "Alienating your most loyal users is a terrible long-term strategy.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Immediately pause all other work to add the feature back just for them.",
        outcome: "You can't let a single customer dictate your entire product roadmap at the expense of overall progress.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "You notice a trend: 20% of all customer support tickets are asking the exact same question.",
    options: [
      {
        id: "opt1",
        text: "Keep answering the emails one by one. It's just part of running a business.",
        outcome: "This is a massive waste of time and indicates a deeper communication problem.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Update your website, product description, or FAQ to answer the question proactively.",
        outcome: "Perfect! Addressing the root cause of frequent complaints saves you time and improves the customer experience.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Setup an auto-reply that tells people to stop asking that question.",
        outcome: "Aggressive auto-replies frustrate users and damage your brand image.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the ultimate mindset a business owner should have towards negative customer feedback?",
    options: [
      {
        id: "opt1",
        text: "Feedback is a personal attack on your hard work and should be defended against.",
        outcome: "Taking feedback personally prevents you from seeing objective flaws in your business.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Feedback is an annoying distraction from building what you want to build.",
        outcome: "Building what *you* want instead of what the *market* wants is a fast track to failure.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Feedback is a valuable data source showing exactly how to improve the business and increase sales.",
        outcome: "Spot on! The most successful companies actively solicit and obsess over customer feedback.",
        isCorrect: true,
      },
    ],
  },
];

const StoryIgnoringCustomerComplaints = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-58";
  const gameData = getGameDataById(gameId);
  const totalStages = STORY_STAGES.length;

  // Configuration for 15 coins / 30 XP, with 3 coins per question
  const totalCoins = gameData?.coins || location.state?.totalCoins || 15;
  const totalXp = gameData?.xp || location.state?.totalXp || 30;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = STORY_STAGES[currentStageIndex];

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
      title="Story: Ignoring Customer Complaints"
      subtitle={
        showResult
          ? "Excellent! You understand the value of customer feedback."
          : `Phase ${currentStageIndex + 1} of ${totalStages}`
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
                <span>Phase {progressLabel}</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Score: {score}/{totalStages}
                </span>
              </div>

              <div className="text-center mb-10">
                <span className="inline-block py-1 px-3 rounded-full bg-violet-900/50 text-violet-300 text-xs font-bold uppercase tracking-wider mb-4 border border-violet-500/30">
                  Customer Relations
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

export default StoryIgnoringCustomerComplaints;
