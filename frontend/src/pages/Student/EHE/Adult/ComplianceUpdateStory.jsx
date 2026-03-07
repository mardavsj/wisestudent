import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const COMPLIANCE_STAGES = [
  {
    id: 1,
    prompt: "You receive an official notice that regulatory rules in your industry have just changed. What is your immediate reaction?",
    options: [
      {
        id: "opt1",
        text: "Ignore it because your old processes have always worked fine in the past",
        outcome: "Past success does not protect you from new legal requirements. Ignoring changes leads to penalties.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Panic and completely shut down operations until you understand everything",
        outcome: "Shutting down abruptly can harm your business more than necessary. You need a measured review.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Review the new rules carefully to understand how they impact your current operations",
        outcome: "Correct! Assessing the impact is the first critical step to adapting to new regulations.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "You realize the new rules require significant, costly changes to how you manufacture your product. What should you do?",
    options: [
      {
        id: "opt1",
        text: "Hide your manufacturing process and hope inspectors never visit",
        outcome: "Willful non-compliance leads to massive fines, lawsuits, or permanent closure.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Begin planning and budgeting to update your processes to meet the new legal standards",
        outcome: "Exactly! Proactive adaptation is the only sustainable business strategy.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Complain publicly and refuse to comply out of principle",
        outcome: "While advocacy is fine, refusing to comply as a business puts your entire operation at legal risk.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "Updating your processes will take three months. The compliance deadline is in one month. What is the most professional legal approach?",
    options: [
      {
        id: "opt1",
        text: "Consult with legal counsel to apply for an extension or temporary waiver while showing good faith progress",
        outcome: "Spot on! Communicating transparently with regulators often provides pathways for transition.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Lie on the compliance forms and say you are already finished",
        outcome: "Fraud or falsifying records carries severe criminal and civil penalties.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Just miss the deadline and apologize if you get caught later",
        outcome: "Asking for forgiveness rather than permission is a terrible strategy when dealing with regulatory bodies.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "Your team is frustrated by the new, slower compliance processes. How do you lead them through this change?",
    options: [
      {
        id: "opt1",
        text: "Tell them to ignore the steps when no one is watching to save time",
        outcome: "Encouraging employees to break rules creates a toxic, legally unstable culture.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Agree with them and complain about the regulators constantly",
        outcome: "A leader's negativity breeds resentment. You need to align the team with the necessary reality.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Explain why the changes are necessary for the company’s survival and provide training to adapt",
        outcome: "Perfect! Clear communication and training turn a frustrating mandate into a manageable routine.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 5,
    prompt: "Looking back, how should a business owner view regulatory compliance?",
    options: [
      {
        id: "opt1",
        text: "As an unfair attack on their personal freedom to operate their business however they want",
        outcome: "This mindset creates constant friction and blinding resentment.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "As a foundational cost of doing business and an ongoing process of risk management",
        outcome: "Exactly! Mature business owners view compliance as a standard operational requirement, not a surprise.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "As something only massive corporations need to worry about",
        outcome: "Small businesses are also subject to regulations and often lack the legal muscle to survive non-compliance penalties.",
        isCorrect: false,
      },
    ],
  },
];

const ComplianceUpdateStory = () => {
  const location = useLocation();
  const gameId = "ehe-adults-69";
  const gameData = getGameDataById(gameId);
  const totalStages = COMPLIANCE_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 15;
  const totalXp = gameData?.xp || location.state?.totalXp || 30;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = COMPLIANCE_STAGES[currentStageIndex];

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
      title="Compliance Update Story"
      subtitle={
        showResult
          ? "Well done! You navigated regulatory changes responsibly."
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
                  Compliance Choice
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

export default ComplianceUpdateStory;
