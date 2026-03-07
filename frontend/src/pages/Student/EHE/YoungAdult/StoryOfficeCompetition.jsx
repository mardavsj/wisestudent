import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STORY_STAGES = [
  {
    id: 1,
    prompt: "You naturally want to get promoted, but there is only one open spot and two of your peers are also applying. How do you approach this competition?",
    options: [
      {
        id: "opt1",
        text: "Try to find mistakes in their work to point out to the manager",
        outcome: "Undermining others makes you look petty and untrustworthy. It's a toxic way to compete.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Focus entirely on elevating your own performance and highlighting your unique value",
        outcome: "Correct! True professionals compete by raising their own bar, not by pushing others down.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Withdraw your application so you don't ruin your relationships with your peers",
        outcome: "Avoiding conflict altogether sabotages your own career growth.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "A peer asks for your help on a project that the manager will see before deciding on the promotion. What do you do?",
    options: [
      {
        id: "opt1",
        text: "Give them bad advice so their project fails",
        outcome: "Sabotage is highly unethical and will eventually destroy your reputation completely.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Refuse to help them, claiming you are too busy",
        outcome: "While better than sabotage, refusing to collaborate shows poor teamwork skills.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Help them genuinely to ensure the team succeeds",
        outcome: "Exactly! Leaders lift others up. Managers notice who acts as a team player.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 3,
    prompt: "During a team meeting, your manager asks for updates. One of your competitors takes credit for an idea that was actually yours. How do you respond?",
    options: [
      {
        id: "opt1",
        text: "Yell at them in the meeting and call them a liar",
        outcome: "Losing your temper makes you look unprofessional and creates awkwardness for everyone.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Calmly say, 'I'm glad you liked the idea I shared with you on Tuesday. As a next step...'",
        outcome: "Perfect! You assert ownership professionally without creating a dramatic confrontation.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Say nothing and just hope the manager somehow knows it was your idea",
        outcome: "If you don't advocate for yourself, others will continue to take advantage of you.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "You discover that one of the competitors is spreading false rumors about you to ruin your chances. How do you handle it?",
    options: [
      {
        id: "opt1",
        text: "Start spreading worse rumors about them in retaliation",
        outcome: "Retaliation lowers you to their level and proves to the manager that neither of you is mature enough for leadership.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Keep a record of the behavior, address it directly with HR or the manager if it escalates, and let your work speak for itself",
        outcome: "Correct. Documenting facts and using proper channels is the professional way to handle workplace harassment.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Confront them aggressively in the break room",
        outcome: "Aggressive confrontations can lead to disciplinary action against you, even if you were in the right initially.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "The promotion is announced, and unfortunately, you did not get it. A peer did. How do you react?",
    options: [
      {
        id: "opt1",
        text: "Congratulate them sincerely and ask the manager for feedback on how you can improve for next time",
        outcome: "Spot on! Handling defeat with grace shows immense character and sets you up for the next big opportunity.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Complain loudly to everyone that the system is rigged",
        outcome: "Being a sore loser ruins your credibility and ensures you won't be considered for future promotions.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Do the bare minimum at work from now on as protest",
        outcome: "Quiet quitting only hurts your own skill development and long-term career prospects.",
        isCorrect: false,
      },
    ],
  },
];

const StoryOfficeCompetition = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-18";
  const gameData = getGameDataById(gameId);
  const totalStages = STORY_STAGES.length;

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
      title="Story: Office Competition"
      subtitle={
        showResult
          ? "Well done! You have learned how to compete professionally."
          : `Scenario ${currentStageIndex + 1} of ${totalStages}`
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

              {/* Top accent bar */}
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
                  Office Competition
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

                          {/* Reveal outcome with animation */}
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

              {/* Next Button — appears after selecting an option */}
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

export default StoryOfficeCompetition;
