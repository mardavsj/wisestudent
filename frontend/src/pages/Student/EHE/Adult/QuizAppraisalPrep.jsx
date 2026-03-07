import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const APPRAISAL_PREP_STAGES = [
  {
    id: 1,
    prompt: "Appraisal is tomorrow, and you haven't prepared an achievements list. What is the risk?",
    options: [
      {
        id: "opt1",
        text: "No risk, your manager remembers everything.",
        outcome: "Managers handle many employees and projects; they rarely remember all of your specific contributions.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Immediate promotion.",
        outcome: "Promotions require justification and proof of impact, not a lack of preparation.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Reduced visibility of your hard work.",
        outcome: "Correct! If you don't document and present your achievements, your value may be underestimated.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "What is the main purpose of an annual appraisal for you as an employee?",
    options: [
      {
        id: "opt1",
        text: "To find out if you are getting fired.",
        outcome: "Appraisals are primarily about performance review and growth, not usually sudden terminations.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "To document your growth, justify rewards, and plan future goals.",
        outcome: "Exactly! It's a structured conversation to align your career progression with business objectives.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "To complain about your coworkers to management.",
        outcome: "Appraisals should focus on your own performance and constructive team dynamics, not gossip.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "How long should you wait before gathering data for your appraisal?",
    options: [
      {
        id: "opt1",
        text: "Track your achievements continuously throughout the year.",
        outcome: "Correct! Keeping an ongoing 'brag document' makes appraisal prep easy and accurate.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Start thinking about it the night before the meeting.",
        outcome: "Rushing leads to forgetting key contributions and producing a weak self-evaluation.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Wait for your manager to ask for it.",
        outcome: "Being proactive shows initiative; waiting makes you look unprepared.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "If your manager asks for your self-evaluation, what should you focus on?",
    options: [
      {
        id: "opt1",
        text: "How much you need a salary increase for personal expenses.",
        outcome: "Salary increases are tied to business value, not personal financial needs.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Excuses for the projects that didn't go well.",
        outcome: "Focus on lessons learned and improvements, not just making excuses.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Objective results, specific metrics, and aligned company goals you achieved.",
        outcome: "Spot on! Data-driven accomplishments provide undeniable proof of your value.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 5,
    prompt: "What should you do if your appraisal rating is lower than you expected?",
    options: [
      {
        id: "opt1",
        text: "Get visibly angry and threaten to quit.",
        outcome: "Emotional reactions destroy professionalism and confirm that you might not be ready for a higher role.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Ask for specific examples and set clear, measurable milestones to improve for next time.",
        outcome: "Correct! Treating feedback constructively shows maturity and a commitment to growth.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Ignore it, since appraisals don't really matter.",
        outcome: "Appraisals often dictate bonuses, raises, and promotion paths.",
        isCorrect: false,
      },
      
    ],
  },
];

const QuizAppraisalPrep = () => {
  const location = useLocation();
  const gameId = "ehe-adults-12";
  const gameData = getGameDataById(gameId);
  const totalStages = APPRAISAL_PREP_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = APPRAISAL_PREP_STAGES[currentStageIndex];

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
      title="Quiz: Appraisal Prep"
      subtitle={
        showResult
          ? "Well done! You understand the importance of preparing for appraisals."
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
                  Preparation Check
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

export default QuizAppraisalPrep;
