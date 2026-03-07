import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const RESTRUCTURING_STAGES = [
  {
    id: 1,
    prompt: "Rumors are circulating about an upcoming company restructuring. Your team is highly anxious. What is your first step?",
    options: [
      {
        id: "opt1",
        text: "Ignore the rumors until you have all the facts",
        outcome: "Silence breeds more anxiety and speculation. Acknowledge the situation early.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Tell them you know exactly what will happen to calm them down, even if you don't",
        outcome: "False promises destroy trust when the truth comes out.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Acknowledge the rumors and promise transparent updates as you get them",
        outcome: "Correct! Honesty and communication build trust during uncertainty.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "Management officially announces the restructuring, but many details are still unclear. How do you communicate this to your team?",
    options: [
      {
        id: "opt1",
        text: "Share the official announcement and explicitly state what is known and unknown",
        outcome: "Exactly! Transparency about what you don't know shows integrity.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Share only the positive parts of the announcement",
        outcome: "Hiding difficult news erodes credibility and makes the eventual impact worse.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Wait weeks until every single detail is finalized before saying anything",
        outcome: "Waiting too long leaves the team in a state of paralyzing anxiety.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "A team member asks a difficult question about potential layoffs that you cannot answer yet. What do you do?",
    options: [
      {
        id: "opt1",
        text: "Guarantee their job is safe to keep them motivated",
        outcome: "Never make guarantees you cannot personally keep during a restructuring.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Admit you don't know yet, but commit to finding out and sharing the answer soon",
        outcome: "Perfect. Honesty about uncertainty, paired with action, is the best leadership approach.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Change the subject to a project deadline",
        outcome: "Avoiding the question makes you seem evasive or untrustworthy.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "During the restructuring phase, team productivity naturally drops due to stress. How should you manage expectations?",
    options: [
      {
        id: "opt1",
        text: "Demand even higher productivity to show value to new management",
        outcome: "Adding pressure during high stress usually leads to burnout and resentment.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Adjust short-term goals, prioritize critical tasks, and show empathy",
        outcome: "Spot on! Leadership requires adapting expectations to the team's reality.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Stop all current projects until the restructuring is totally finished",
        outcome: "Halting everything puts the team's value and future at greater risk.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "The restructuring concludes, and your team structure has changed. What is your priority now?",
    options: [
      {
        id: "opt1",
        text: "Hold a meeting to clarify new roles, celebrate the team's resilience, and set a vision forward",
        outcome: "Exactly! Clear closure and a new direction are essential for moving past the uncertainty.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Immediately assign a massive workload to make up for lost time",
        outcome: "The team needs a moment to stabilize in their new roles before a massive sprint.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Complain about the process with your team to build camaraderie",
        outcome: "Bonding over negativity undermines the new structure and your role as a leader.",
        isCorrect: false,
      },
    ],
  },
];

const RestructuringStory = () => {
  const location = useLocation();
  const gameId = "ehe-adults-38";
  const gameData = getGameDataById(gameId);
  const totalStages = RESTRUCTURING_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 10;
  const totalXp = gameData?.xp || location.state?.totalXp || 20;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = RESTRUCTURING_STAGES[currentStageIndex];

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
      title="Restructuring Story"
      subtitle={
        showResult
          ? "Well done! You navigated the restructuring with transparency."
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
                  Leadership Choice
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

export default RestructuringStory;
