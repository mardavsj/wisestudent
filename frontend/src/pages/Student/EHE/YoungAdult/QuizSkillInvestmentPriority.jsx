import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SKILL_INVESTMENT_PRIORITY_STAGES = [
  {
    id: 1,
    prompt: "You have limited funds to either set up a business or take a skill course. What should guide your choice?",
    options: [
      {
        id: "opt2",
        text: "Long-term return potential",
        outcome: "Correct! Evaluate which option gives you the highest sustainable return over the next 5-10 years.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Current trends and social approval",
        outcome: "Following trends without understanding the foundational skills often leads to quick failure.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Which option seems to require the least amount of effort",
        outcome: "High rewards rarely come from low-effort investments.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "You want to start a freelance design business, but you barely know how to use the software. Where should your $500 go?",
    options: [
      {
        id: "opt1",
        text: "Buying ads to find clients immediately",
        outcome: "If you find clients but can't deliver quality work, you will ruin your reputation and lose money.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Buying a fancy desk and office chair",
        outcome: "Office furniture doesn't produce income. Skills do.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "An intensive course to master the design software",
        outcome: "Exactly! Skills are the engine of your income. You must build the engine before you try to drive.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 3,
    prompt: "When does it make sense to invest capital into a business BEFORE investing more into your personal skills?",
    options: [
      
      {
        id: "opt2",
        text: "When you want to look like a successful CEO on social media",
        outcome: "Looking successful costs money; actually being successful makes money.",
        isCorrect: false,
      },
      {
        id: "opt1",
        text: "When you already have the required skills and are turning down work because you lack equipment/software",
        outcome: "Correct! If your skills are maxed out and equipment is the bottleneck, invest in the business.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "When you don't know what you're doing and hope hiring someone else solves it",
        outcome: "Hiring without understanding the core business usually leads to being overcharged and under-delivered.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "Why is a skill course often a safer first investment than a physical business?",
    options: [
      {
        id: "opt1",
        text: "Skills can't be stolen, they move with you, and have near zero overhead to maintain",
        outcome: "Spot on! Human capital is arguably the most secure and scalable asset you can own early in your career.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Because skill courses are always cheaper than starting a business",
        outcome: "Not always true. Some degrees are much more expensive than starting a service business.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Because a skill course guarantees you will become a millionaire",
        outcome: "No single course guarantees wealth. It's how you apply the skill that generates returns.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "You take a skill course and realize you hate the work. Was the investment a waste?",
    options: [
      {
        id: "opt1",
        text: "Yes, you should have just guessed and started the business anyway",
        outcome: "Starting a business in a field you hate is much more expensive and painful than failing a course.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Yes, because you can never learn another skill again",
        outcome: "You can and should continuously refine your skills and shift paths when necessary.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "No, discovering what you don't want to do early is a valuable, relatively cheap lesson",
        outcome: "Correct! Finding out you dislike a field for $500 is much better than finding out after investing $50,000 in a business.",
        isCorrect: true,
      },
    ],
  },
];

const QuizSkillInvestmentPriority = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-92";
  const gameData = getGameDataById(gameId);
  const totalStages = SKILL_INVESTMENT_PRIORITY_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 20;
  const totalXp = gameData?.xp || location.state?.totalXp || 40;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = SKILL_INVESTMENT_PRIORITY_STAGES[currentStageIndex];

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
      title="Quiz: Skill Investment Priority"
      subtitle={
        showResult
          ? "Well done! You understand how to prioritize capital for maximum return."
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
                  Resource Allocation
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

export default QuizSkillInvestmentPriority;
