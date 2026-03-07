import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STORY_STAGES = [
  {
    id: 1,
    prompt: "Your startup is growing, but you are working 16-hour days handling sales, customer service, and product development alone. What do you do?",
    options: [
      {
        id: "opt1",
        text: "Keep doing everything yourself to save money. Nobody else can do it as well as you.",
        outcome: "This mindset creates a bottleneck. If you do everything, the business can only grow as much as your personal energy allows.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Identify the most repetitive, time-consuming tasks and hire a freelancer or assistant to handle them.",
        outcome: "Correct! Delegating low-leverage tasks frees up your time for high-level strategy and growth.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Just stop answering customer emails so you have more time for product development.",
        outcome: "Ignoring customers to save time will quickly destroy your brand's reputation and revenue.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "You hired your first assistant, but they keep making mistakes because they don't know how you want things done.",
    options: [
      {
        id: "opt1",
        text: "Fire them immediately. It's faster to just do it yourself.",
        outcome: "Firing instead of training ensures you will be stuck doing everything yourself forever.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Yell at them so they understand how important accuracy is.",
        outcome: "Toxic management leads to high turnover and a terrible company culture.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Create Standard Operating Procedures (SOPs) so they have a clear guide to follow.",
        outcome: "Exactly! Documented processes ensure quality remains high even when you aren't the one doing the work.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 3,
    prompt: "Your business is now making enough to hire a specialist (like an accountant or a senior developer).",
    options: [
      {
        id: "opt1",
        text: "Don't hire them. You can learn to be an expert accountant via YouTube.",
        outcome: "Amateur work on complex tasks like taxes can lead to massive legal and financial penalties.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Hire the specialist so you can completely ignore that part of the business.",
        outcome: "Delegation is not abdication. You still need to understand the metrics and manage the specialist.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Hire the specialist to oversee that department while you focus on core growth.",
        outcome: "Correct! Hiring people smarter than you in specific areas is the key to scaling a company.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "You feel extremely exhausted and haven't taken a day off in six months.",
    options: [
      {
        id: "opt1",
        text: "Push through the pain. Sleep is for the weak; real founders hustle 24/7.",
        outcome: "Hustle culture leads directly to severe founder burnout, depression, and often business failure.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Schedule a mandatory weekend off, trusting your team and processes to run things.",
        outcome: "Correct! Rest is a business strategy. A well-rested founder makes significantly better decisions.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Sell the business immediately for whatever you can get so you can finally sleep.",
        outcome: "Making massive, irreversible decisions while exhausted usually leads to deep regret.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "Looking at your growing, successful company, what is the ultimate goal of delegation?",
    options: [
      {
        id: "opt1",
        text: "To build a business that can generate revenue and grow even if you take a month-long vacation.",
        outcome: "Spot on! A true business operates independently of the founder. If it requires your constant presence, you own a job, not a business.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "To be able to sit in a big office and boss people around all day.",
        outcome: "Ego-driven leadership creates a toxic environment, not a sustainable business.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "To eventually fire everyone once the AI is good enough.",
        outcome: "While automation is great, healthy businesses are built by strong, motivated human teams.",
        isCorrect: false,
      },
    ],
  },
];

const StoryFounderBurnout = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-49";
  const gameData = getGameDataById(gameId);
  const totalStages = STORY_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 10;
  const totalXp = gameData?.xp || location.state?.totalXp || 20;
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
      title="Story: Founder Burnout"
      subtitle={
        showResult
          ? "Great job! You learned to scale through delegation."
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
                  Leadership & Delegation
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

export default StoryFounderBurnout;
