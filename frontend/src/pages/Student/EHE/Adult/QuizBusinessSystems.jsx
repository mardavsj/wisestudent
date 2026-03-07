import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const BUSINESS_SYSTEMS_STAGES = [
  {
    id: 1,
    prompt: "Operations depend entirely on your personal presence. What limits your growth?",
    options: [
      {
        id: "opt2",
        text: "Lack of system automation",
        outcome: "Correct! Without systems, you become the bottleneck, limiting scalability and growth.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Office size",
        outcome: "Physical space is secondary to operational efficiency and delegation.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Employee salaries",
        outcome: "Investing in employees is a means to growth, not the primary bottleneck here.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why are documented standard operating procedures (SOPs) essential for a business?",
    options: [
      
      {
        id: "opt2",
        text: "They guarantee immediate and massive profit margins",
        outcome: "SOPs improve efficiency, but profits depend on various other market factors.",
        isCorrect: false,
      },
      {
        id: "opt1",
        text: "They empower employees to work independently and consistently",
        outcome: "Exactly! SOPs ensure quality control even when you are not around.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "They make the business look more formal to investors",
        outcome: "While true, the operational benefit of consistency is their primary purpose.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "You notice routine tasks like invoicing and emails consume most of your team's time. What should you do?",
    options: [
      {
        id: "opt1",
        text: "Hire three more people to handle the manual workload",
        outcome: "Hiring for repetitive tasks increases costs unnecessarily when better options exist.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Work longer hours to complete the tasks yourself",
        outcome: "Taking on more manual work pulls you away from strategic business growth.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Implement software automation tools to handle repetitive tasks",
        outcome: "Correct! Automation saves time, reduces errors, and frees up human capital.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "Your business requires specialized knowledge that only one key employee possesses. What is the risk?",
    options: [
      {
        id: "opt2",
        text: "A single point of failure that halts operations if they leave or fall ill",
        outcome: "Spot on! Cross-training and knowledge documentation are vital to mitigate this risk.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "The employee might ask for a raise",
        outcome: "While possible, the larger risk is operational paralysis if they leave.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Competitors will immediately try to recruit them",
        outcome: "They might, but the core issue is your business's over-reliance on one person.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the ultimate goal of building robust business systems?",
    options: [
      
      {
        id: "opt2",
        text: "To eliminate the need for human employees entirely",
        outcome: "Human creativity and strategy are still essential; systems just handle the operations.",
        isCorrect: false,
      },
      {
        id: "opt1",
        text: "To create an entity that operates and grows independently of the founder",
        outcome: "Correct! True business scalability happens when systems run the business, and people run the systems.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "To make the business highly complex and difficult to copy",
        outcome: "Complexity is not the goal; efficiency and replicability are.",
        isCorrect: false,
      },
    ],
  },
];

const QuizBusinessSystems = () => {
  const location = useLocation();
  const gameId = "ehe-adults-56";
  const gameData = getGameDataById(gameId);
  const totalStages = BUSINESS_SYSTEMS_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 15;
  const totalXp = gameData?.xp || location.state?.totalXp || 30;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = BUSINESS_SYSTEMS_STAGES[currentStageIndex];

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
      title="Quiz: Business Systems"
      subtitle={
        showResult
          ? "Well done! You understand the power of scalable business systems."
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
                  Systems Scenario
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

export default QuizBusinessSystems;
