import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STORY_STAGES = [
  {
    id: 1,
    prompt: "You get accepted into your dream out-of-state university, but the tuition is double what an in-state school would cost. You haven't checked the living expenses yet.",
    options: [
      {
        id: "opt1",
        text: "Just enroll immediately. The 'branding' of the university is worth any amount of debt.",
        outcome: "Not doing a full cost analysis before entering massive debt is an extremely risky approach.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Delay accepting the offer until you calculate the total cost, including rent, food, and travel, and compare it to your budget.",
        outcome: "Correct! A full financial picture is required before committing to a multi-year expense.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Assume that you will easily get a scholarship or find a high-paying part-time job to cover the extra costs.",
        outcome: "Relying on hypothetical income to pay guaranteed expenses is a fast track to financial crisis.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "After doing the math, you realize the out-of-state degree will leave you with $100,000 in student loans by graduation.",
    options: [
      {
        id: "opt1",
        text: "Ignore the number. Everyone has student debt; it's just a normal part of life.",
        outcome: "Normalizing massive debt blinds you to the severe restrictions it will place on your future options.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Panic and decide never to go to college at all.",
        outcome: "College is still valuable; you just need to find a more affordable route to your goals.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Research entry-level salaries in your chosen field to see if that amount of debt is actually repayable.",
        outcome: "Correct! Your acceptable debt level should always be evaluated in the context of your expected future income.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 3,
    prompt: "You find a similar degree program at a local, in-state university. The facilities aren't as glamorous, but you would graduate completely debt-free.",
    options: [
      {
        id: "opt1",
        text: "Choose the in-state school. Graduating without debt provides massive freedom and lowers stress in your early career.",
        outcome: "Spot on! Financial freedom often outweighs the slight prestige bump of a more expensive school.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Take the expensive out-of-state option just so you can post better pictures of the campus on social media.",
        outcome: "Making massive financial decisions based on social media perception often leads to long-term poverty.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Ask your parents to take out a second mortgage on their house to pay for the out-of-state school.",
        outcome: "Jeopardizing your family's retirement for campus aesthetics is highly irresponsible.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "You start at the local university, but to save even more money, you need to decide where to live.",
    options: [
      {
        id: "opt1",
        text: "Rent a luxury apartment near campus; you 'deserve' a nice place since you saved money on tuition.",
        outcome: "This lifestyle inflation defeats the entire purpose of choosing the affordable school in the first place.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Live in your car to save 100% on rent.",
        outcome: "Extreme frugality that endangers your health, safety, and academic performance is counterproductive.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Commute from home for the first two years, drastically cutting down on rent and food costs.",
        outcome: "Perfect! Minimizing living expenses is just as important as minimizing tuition when trying to avoid debt.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 5,
    prompt: "Looking back on your decision, why is it critical to review both tuition AND hidden living costs before enrolling?",
    options: [
      {
        id: "opt1",
        text: "Realizing the true total cost prevents severe financial stress and allows you to make realistic career choices upon graduation.",
        outcome: "Exactly! Accurate planning prevents you from being trapped by loans you can't afford.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Because universities often hide tuition costs until you actually start attending classes.",
        outcome: "Tuition is public information, but students often forget to calculate the rest of their lifestyle costs.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Because living costs are always more expensive than the tuition itself.",
        outcome: "This depends entirely on the school and location; the point is that both must be calculated together.",
        isCorrect: false,
      },
    ],
  },
];

const StoryIgnoringTuitionCost = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-81";
  const gameData = getGameDataById(gameId);
  const totalStages = STORY_STAGES.length;

  // 20 coins / 40 XP, with 4 coins per question
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
      title="Story: Ignoring Tuition Cost"
      subtitle={
        showResult
          ? "Excellent! You understand how to analyze total educational costs."
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
                  Financial Planning
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

export default StoryIgnoringTuitionCost;
