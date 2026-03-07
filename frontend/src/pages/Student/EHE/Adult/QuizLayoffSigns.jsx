import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LAYOFF_SIGNS_STAGES = [
  {
    id: 1,
    prompt: "Company revenue declines and hiring freezes begin. What should you prepare?",
    options: [
      {
        id: "opt2",
        text: "Updated resume and skill upgrade.",
        outcome: "Correct! Proactively preparing ensures you are ready for any outcome without panicking.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Nothing, it's just a temporary phase.",
        outcome: "Ignoring financial warning signs leaves you vulnerable if sudden cuts happen.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Office complaints.",
        outcome: "Complaining lowers morale and marks you as negative during a period when management is highly critical.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Key executives and high-performers suddenly start leaving the company. What does this often indicate?",
    options: [
      {
        id: "opt1",
        text: "A great opportunity for immediate promotion for everyone left.",
        outcome: "While roles open up, mass exits of top talent usually indicate deeper structural or financial issues.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "It is a sign of underlying instability that warrants assessing your own options.",
        outcome: "Exactly! People with inside knowledge often leave before a crisis becomes public.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "It means the company is about to give out large bonuses.",
        outcome: "Exiting executives rarely correlates with sudden wealth distribution for remaining staff.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "Your manager stops involving you in long-term planning and starts asking for detailed documentation of your daily tasks. What might be happening?",
    options: [
      {
        id: "opt1",
        text: "They are planning a surprise award for you.",
        outcome: "Highly unlikely. Documentation requests usually precede role transitions or eliminations.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "They are trying to understand your workload to give you an assistant.",
        outcome: "While possible in growth phases, in a stagnant environment, it is rarely for additional help.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "They are preparing a transition plan in case your role is eliminated or consolidated.",
        outcome: "Correct! Gathering knowledge to ensure operations continue without you is a major red flag.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "A layoff is announced but you are safe for now. How should you react to the surviving team dynamic?",
    options: [
      {
        id: "opt1",
        text: "Brag about how essential you are to the company.",
        outcome: "Arrogance alienates grieving coworkers and makes managers question your emotional intelligence.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Stay focused, support colleagues, and secretly continue strengthening your external network.",
        outcome: "Spot on! Maintain professionalism while protecting your own long-term career security.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Immediately quit in protest without another job lined up.",
        outcome: "Quitting without a plan hurts you financially more than it hurts the struggling company.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the best way to make yourself 'layoff-resistant' during uncertain times?",
    options: [
      {
        id: "opt1",
        text: "Align yourself with revenue-generating projects or critical operational functions.",
        outcome: "Correct! Companies rarely cut the people directly responsible for bringing in money or keeping the lights on.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Hide in your cubicle and hope management forgets about you.",
        outcome: "Invisibility makes you an easy target when lists are being drawn up for cost-cutting.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Refuse to teach your skills to anyone else so they can't fire you.",
        outcome: "Hoarding knowledge is toxic behavior that gets you fired for being a difficult bottleneck.",
        isCorrect: false,
      },
    ],
  },
];

const QuizLayoffSigns = () => {
  const location = useLocation();
  const gameId = "ehe-adults-22";
  const gameData = getGameDataById(gameId);
  const totalStages = LAYOFF_SIGNS_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = LAYOFF_SIGNS_STAGES[currentStageIndex];

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
      title="Quiz: Layoff Signs"
      subtitle={
        showResult
          ? "Well done! You are aware of key career survival signals."
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
                  Career Awareness
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

export default QuizLayoffSigns;
