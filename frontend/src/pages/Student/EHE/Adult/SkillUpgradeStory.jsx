import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STORY_STAGES = [
  {
    id: 1,
    prompt: "A senior role opens up that you want, but the job description explicitly requires a new technical certification that you don't have.",
    options: [
      {
        id: "opt1",
        text: "Apply anyway and hope they don't notice you are missing a core requirement.",
        outcome: "Ignoring requirements makes you look unobservant or disrespectful of the hiring criteria.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Complain that the requirement is unfair because you already know how to do the job.",
        outcome: "Complaining shows a lack of adaptability. Certifications often validate skills to clients, not just internal teams.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Acknowledge the gap, research the certification, and commit to investing the time to earn it.",
        outcome: "Correct! Proactively addressing your skill gaps is the hallmark of a growth-oriented professional.",
        isCorrect: true,
      }
    ]
  },
  {
    id: 2,
    prompt: "You start studying for the certification, but it's much harder than expected and consumes your weekends.",
    options: [
      {
        id: "opt1",
        text: "Quit. Your current job is 'good enough' and you don't really want to sacrifice your free time.",
        outcome: "Quitting at the first sign of friction guarantees you will stagnate in your current role.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Create a structured study schedule, breaking the hard material into manageable daily chunks.",
        outcome: "Exactly! Discipline and structure turn overwhelming tasks into achievable goals.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Try to find the answer key online so you can pass without actually learning the material.",
        outcome: "Cheating invalidates the point of the certification: actually acquiring the necessary high-level skills.",
        isCorrect: false,
      }
    ]
  },
  {
    id: 3,
    prompt: "You tell your manager you are pursuing the certification. They offer to have the company pay for the exam, but only if you pass.",
    options: [
      {
        id: "opt1",
        text: "Accept the deal. Use this financial incentive as extra motivation to study harder and pass on the first try.",
        outcome: "Brilliant! You leverage company resources to upgrade your own personal capital.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Refuse. Tell them they should pay upfront regardless of whether you pass or fail.",
        outcome: "Demanding upfront payment without shared risk shows entitlement, not investment.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Decide the pressure is too high now and drop out of the study program entirely.",
        outcome: "Avoiding pressure means avoiding the very environment where growth happens.",
        isCorrect: false,
      }
    ]
  },
  {
    id: 4,
    prompt: "You take the exam and miss the passing score by a few points. How do you handle this setback?",
    options: [
      {
        id: "opt1",
        text: "Hide the result from everyone and secretly give up on the senior role.",
        outcome: "Hiding failure prevents you from getting the support or mentorship you might need to pass next time.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Blame the test creators, claiming the questions were tricky and irrelevant to the real job.",
        outcome: "Blaming external factors prevents you from analyzing your own weak areas to improve.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Review the score report, identify the specific areas you failed, and begin targeted restudying.",
        outcome: "Perfect! Resilience and targeted learning are exactly what senior leadership requires.",
        isCorrect: true,
      }
    ]
  },
  {
    id: 5,
    prompt: "You retake the test, pass, and finally earn the certification. The senior role is still open. What's your next move?",
    options: [
      {
        id: "opt1",
        text: "Wait for management to notice your new certification and approach you with an offer.",
        outcome: "Management cannot read your mind. If you don't advocate for yourself, you won't advance.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Apply for the role immediately, highlighting both your new certification and the resilience you showed in earning it.",
        outcome: "Spot on! You closed the skill gap, proved your dedication, and are now perfectly positioned for the promotion.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Demand they double the salary of the senior role now that you are 'certified'.",
        outcome: "Unrealistic arrogance will sour the promotion conversation before it even begins.",
        isCorrect: false,
      }
    ]
  }
];

const SkillUpgradeStory = () => {
  const location = useLocation();
  const gameId = "ehe-adults-15";
  const gameData = getGameDataById(gameId);
  const totalStages = STORY_STAGES.length;

  // Assuming standard coin mapping from the prompt and typical pattern
  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
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
      title="Story: Skill Upgrade"
      subtitle={
        showResult
          ? "Excellent! You understand the value of closing skill gaps."
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
                  Skill Investment
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

export default SkillUpgradeStory;
