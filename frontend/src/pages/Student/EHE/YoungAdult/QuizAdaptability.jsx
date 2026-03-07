import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ADAPTABILITY_STAGES = [
  {
    id: 1,
    prompt: "Your company adopts new software systems. What protects your relevance?",
    options: [
      {
        id: "opt1",
        text: "Waiting for others to learn it first",
        outcome: "Waiting puts you behind. Early adopters often become more valuable.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Complaining about the change",
        outcome: "Complaining doesn't change reality and can harm your professional reputation.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Proactively learning new tools",
        outcome: "Correct! Learning new tools quickly protects your relevance and makes you an asset.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "When faced with a sudden change in project requirements, what is the best approach?",
    options: [
      {
        id: "opt1",
        text: "Resist the change and stick to the original plan",
        outcome: "Resisting change usually leads to project failure and frustration.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Adapt quickly and identify how to meet the new requirements",
        outcome: "Exactly! Adapting your strategy to meet new realities is a vital professional skill.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Wait for someone else to figure it out",
        outcome: "Passivity in the face of change limits your leadership potential.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "Parts of your current role are being automated. How can you stay valuable?",
    options: [
      {
        id: "opt3",
        text: "Learn to manage, maintain, or work alongside the new systems",
        outcome: "Great choice! Adapting to work with automation increases your value.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Fight against the automation",
        outcome: "Technology rarely goes backward. Fighting it is usually a losing battle.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Ignore it and hope it goes away",
        outcome: "Ignoring industry shifts can lead to sudden obsolescence.",
        isCorrect: false,
      },
      
    ],
  },
  {
    id: 4,
    prompt: "What is a key trait of a highly adaptable professional?",
    options: [
      
      {
        id: "opt2",
        text: "Rigid adherence to past methods that worked",
        outcome: "Past success does not guarantee future success when conditions change.",
        isCorrect: false,
      },
      {
        id: "opt1",
        text: "Willingness to unlearn old habits and learn new ones",
        outcome: "Correct! Unlearning obsolete methods is as important as learning new ones.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Avoiding projects that require new skills",
        outcome: "Avoiding challenges stagnates your growth and adaptability.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "How does adaptability impact your long-term career growth?",
    options: [
      {
        id: "opt1",
        text: "It is irrelevant if you are an expert in one specific thing",
        outcome: "Even deep technical expertise becomes obsolete if the industry shifts.",
        isCorrect: false,
      },
     
      {
        id: "opt3",
        text: "It makes you look inconsistent to employers",
        outcome: "Employers value people who can navigate change, not just maintain the status quo.",
        isCorrect: false,
      },
       {
        id: "opt2",
        text: "It ensures you remain employable regardless of industry shifts",
        outcome: "Spot on! Adaptability is the ultimate career safety net in a changing world.",
        isCorrect: true,
      },
    ],
  },
];

const QuizAdaptability = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-13";
  const gameData = getGameDataById(gameId);
  const totalStages = ADAPTABILITY_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = ADAPTABILITY_STAGES[currentStageIndex];

  const handleChoice = (option) => {
    if (selectedChoice) return;
    setSelectedChoice(option);
    if (option.isCorrect) {
      setScore((s) => s + 1);
      showCorrectAnswerFeedback(coinsPerLevel, true);
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
      title="Quiz: Adaptability"
      subtitle={
        showResult
          ? "Well done! You understand the power of adaptability."
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
                  Adaptability Check
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

export default QuizAdaptability;
