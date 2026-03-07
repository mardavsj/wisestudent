import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const ALIGNMENT_STAGES = [
  {
    id: 1,
    prompt: "You are considering enrolling in an expensive master's degree program because everyone says 'more education is always better.' What is your first step?",
    options: [
      {
        id: "opt1",
        text: "Enroll immediately before prices go up",
        outcome: "Rushing into a huge financial commitment without aim often leads to crippling student debt.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Analyze the specific career paths and salary bumps this specific degree actually unlocks",
        outcome: "Correct! Education is an investment; you must calculate its realistic return.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Assume any degree automatically guarantees a promotion at your current job",
        outcome: "Employers reward the ability to solve more complex problems, not just the possession of a degree.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "You graduate and present your new expensive degree to your boss, expecting an immediate promotion. Your boss asks, 'How does this help our current projects?' What is the reality?",
    options: [
      {
        id: "opt2",
        text: "The degree is only valuable to the company if it translates into measurable value in your work",
        outcome: "Exactly! Misalignment happens when you acquire skills the market (or your boss) isn't willing to buy.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "They are obligated by law to pay you more now",
        outcome: "There are no laws requiring private companies to pay you more simply for holding a degree.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "You can just threaten to quit if they don't promote you instantly",
        outcome: "Threats without market leverage or alternative offers usually result in being let go.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "You realize the degree you got is actually for a completely different industry than the one you work in. What is this called?",
    options: [
      {
        id: "opt1",
        text: "A highly strategic cross-disciplinary advantage",
        outcome: "While cross-skills are nice, completely disconnected degrees rarely provide an immediate career jump.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "A guaranteed golden ticket to a tech job",
        outcome: "No degree guarantees any job without applicable experience and alignment.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Career misalignment, resulting in wasted time and capital if you intend to stay in your current field",
        outcome: "Spot on! Spending money on the wrong tool for the job is a classic example of misalignment.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "Instead of just getting 'any' degree, what would have been a better approach before spending the money?",
    options: [
      
      {
        id: "opt2",
        text: "Just pick the degree with the easiest classes to pass",
        outcome: "An easy degree that provides no competitive skills is a waste of time and money.",
        isCorrect: false,
      },
      {
        id: "opt1",
        text: "Ask your boss directly what specific skills, certifications, or degrees would make you eligible for the next level",
        outcome: "Perfect! Working backwards from the desired outcome ensures career alignment and prevents wasted effort.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Look at what degree the richest person you know has and copy them",
        outcome: "Survivorship bias ignores timing, connections, and entirely different career contexts.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the core lesson about continuous education in the modern workforce?",
    options: [
      {
        id: "opt1",
        text: "Education should be highly targeted, aligned with market demand, and treated as a strategic investment",
        outcome: "Exactly! Strategic upskilling prevents career misalignment and maximizes your return on investment.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "You should never stop going to school, no matter the cost",
        outcome: "Perpetual schooling without execution often leads to massive debt and missed real-world experience.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Degrees are completely useless now",
        outcome: "False. Degrees are still highly valuable in many fields, but they must be aligned with career goals.",
        isCorrect: false,
      },
    ],
  },
];

const DegreeAlignmentStory = () => {
  const location = useLocation();
  const gameId = "ehe-adults-81";
  const gameData = getGameDataById(gameId);
  const totalStages = ALIGNMENT_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 20;
  const totalXp = gameData?.xp || location.state?.totalXp || 40;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = ALIGNMENT_STAGES[currentStageIndex];

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
      title="Degree Alignment Story"
      subtitle={
        showResult
          ? "Well done! You learned how to align education with career goals."
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
                  Career Choice
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

export default DegreeAlignmentStory;
