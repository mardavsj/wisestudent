import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STORY_STAGES = [
  {
    id: 1,
    prompt: "You launch your first business idea, an app for college students. After 6 months of hard work, you have only 5 active users and zero revenue.",
    options: [
      {
        id: "opt1",
        text: "Delete everything, declare yourself a failure, and decide you are just not meant to be an entrepreneur.",
        outcome: "Quitting permanently after one failure ensures you will never succeed. Early failure is normal.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Accept that first attempts rarely work perfectly, study why users rejected the app, and prepare to adapt.",
        outcome: "Correct! The fastest path to success is analyzing early failures to extract valuable data.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Ignore the data and borrow $5,000 to spend on marketing, hoping users will magically appear.",
        outcome: "Throwing money at a product nobody wants is a fast track to severe debt, not scale.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "When analyzing your failed app, you discover a brutal truth: you built a solution for a problem that nobody actually cared about.",
    options: [
      {
        id: "opt1",
        text: "Blame the customers for being 'too slow' to understand your brilliant vision.",
        outcome: "Blaming the market for ignoring your product is arrogant and prevents you from learning.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Conclude that the economy is just bad right now and give up entirely.",
        outcome: "Using macro-economic excuses to justify a flawed product design is a defense mechanism.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Realize that deep market validation must always happen before writing a single line of code next time.",
        outcome: "Exactly! You just learned one of the most expensive and valuable lessons in business.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 3,
    prompt: "Your co-founder gets frustrated and quits. Because you never signed a written operating agreement, they legally take half of the remaining company funds.",
    options: [
      {
        id: "opt1",
        text: "Accept this as a tough lesson on why formal legal agreements are strictly required, even between friends.",
        outcome: "Correct! Hard lessons are painful, but they build the foundation for a professional future.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Spend the rest of your money hiring an expensive lawyer to sue them out of pure spite.",
        outcome: "Wasting your last funds on revenge litigation without a contract is an emotional, not logical, decision.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Decide that all business partners are evil and resolve to only work completely alone forever.",
        outcome: "Overreacting by isolating yourself robs you of the leverage that comes from good partnerships.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "You attend an industry networking event. An established founder asks how your startup is going.",
    options: [
      {
        id: "opt1",
        text: "Lie and say you recently sold the company for millions of dollars to protect your ego.",
        outcome: "Lying in professional circles destroys your reputation the moment the truth comes out.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Avoid eye contact, mumble that it failed, and quickly run out of the building in shame.",
        outcome: "Shame makes you look insecure. Failure is common; how you handle it defines you.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Confidently explain what you tried, why it failed, and the specific strategic lessons you learned.",
        outcome: "Perfect! Experienced founders respect people who can analyze failures objectively without ego.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 5,
    prompt: "A few months later, you spot a much better business opportunity based directly on the lessons from your failure. What do you do?",
    options: [
      {
        id: "opt1",
        text: "Apply your new knowledge about market validation, lean spending, and legal contracts to build it the right way.",
        outcome: "Spot on! This is the ultimate value of early failure: applying the refined strategy to the next attempt.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Keep the idea a complete secret and wait 10 years until you feel 'totally ready' to try again.",
        outcome: "Waiting for perfect conditions means you will never launch. Action must follow learning.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Rush into it immediately, convinced you are a genius now, and skip the validation phase again.",
        outcome: "Failing to change your behavior means you didn't actually learn anything from the first collapse.",
        isCorrect: false,
      },
    ],
  },
];

const StoryHandlingEarlyFailure = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-99";
  const gameData = getGameDataById(gameId);
  const totalStages = STORY_STAGES.length;

  // Configuration: 20 coins / 40 XP, with 4 coins per question
  const totalCoins = gameData?.coins || location.state?.totalCoins || 20;
  const totalXp = gameData?.xp || location.state?.totalXp || 40;
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
      title="Story: Handling Early Failure"
      subtitle={
        showResult
          ? "Excellent! You understand how to turn failure into strategic refinement."
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
                  Resilience & Strategy
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

export default StoryHandlingEarlyFailure;
