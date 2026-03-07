import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STORY_STAGES = [
  {
    id: 1,
    prompt: "You are in your second year of college. Your friends are actively researching internships and career paths, but you feel overwhelmed by the choices.",
    options: [
      {
        id: "opt1",
        text: "Tell yourself you have plenty of time and keep ignoring the topic to avoid stress.",
        outcome: "Avoidance feels good now but creates massive panic later when graduation approaches and you have no plan.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Just pick the first major you see so you don't have to think about it anymore.",
        outcome: "A rushed decision to avoid temporary discomfort usually leads to long-term career misery.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Acknowledge the overwhelm, but commit to researching just one potential career path this month.",
        outcome: "Correct! Breaking a massive goal into small, manageable steps is the best way to overcome planning paralysis.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "By your third year, you still haven't chosen a direction, resulting in a random assortment of classes that don't satisfy any specific degree requirements.",
    options: [
      {
        id: "opt1",
        text: "Blame the university for making the degree requirements too complicated.",
        outcome: "Deflecting responsibility won't solve the fact that you are wasting time and tuition money.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Immediately meet with an academic or career counselor to audit your credits and find a viable path to graduation.",
        outcome: "Exactly! When you realize you are lost, immediately asking a professional for directions is the smartest move.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Drop out of college because it's 'too confusing'.",
        outcome: "Quitting due to a lack of planning just trades an academic problem for a lifelong financial problem.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "A counselor helps you consolidate your credits into a General Studies degree. However, you lack any specialized skills for the job market.",
    options: [
      {
        id: "opt1",
        text: "Assume employers will be impressed just because you have a bachelor's degree.",
        outcome: "A generic degree alone is rarely enough to stand out in today's competitive job market.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Identify a target industry and urgently enroll in a short-term, specialized certification to pair with your degree.",
        outcome: "Correct! You recognized your vulnerability and took immediate, targeted action to become employable.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Lie on your resume about having specialized technical skills.",
        outcome: "Lying will instantly get you fired when you are asked to actually perform those skills on the job.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "You graduate and start applying for jobs. Because you delayed networking and internships, your resume is entirely blank regarding work experience.",
    options: [
      {
        id: "opt1",
        text: "Apply only for senior-level management roles because you 'deserve' it after graduating.",
        outcome: "Extreme entitlement mixed with zero experience guarantees you will receive zero interview requests.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Give up and complain constantly on social media that 'the system is broken'.",
        outcome: "Complaining does not pay rent. You must adapt to the reality of the situation you created.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Swallow your pride, take an entry-level or paid internship role, and aggressively out-work everyone to catch up.",
        outcome: "Perfect! Acceptance and massive action are the only ways to recover from a delayed start.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the ultimate consequence of postponing your career planning out of fear or feeling overwhelmed?",
    options: [
      {
        id: "opt1",
        text: "It organically leads to finding your true passion through random exploration.",
        outcome: "While exploration is good, entirely random progression usually leads to low-paying, dead-end jobs.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "It results in a random, unpredictable progression that removes your ability to control your own earning potential.",
        outcome: "Spot on! Failing to plan means you are simply reacting to whatever happens, rather than building the life you want.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "It saves you a lot of time because career planning is mostly just guesswork anyway.",
        outcome: "Planning is making an educated strategy, not a guess. Omitting it guarantees inefficiency and wasted money.",
        isCorrect: false,
      },
    ],
  },
];

const StoryDelayedCareerPlanning = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-93";
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
      title="Story: Delayed Career Planning"
      subtitle={
        showResult
          ? "Excellent! You understand why intentional planning is necessary."
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
                  Career Readiness
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

export default StoryDelayedCareerPlanning;
