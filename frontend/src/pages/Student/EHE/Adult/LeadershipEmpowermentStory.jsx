import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EMPOWERMENT_STAGES = [
  {
    id: 1,
    prompt: "As your company grows, you notice every single decision, even minor ones like approving office supplies, still lands on your desk. What is your reaction?",
    options: [
      {
        id: "opt1",
        text: "Accept it because nobody else can make the right decisions",
        outcome: "This bottleneck mindset limits your company's growth to how many hours you can stay awake.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Realize that your managers need the authority to make these decisions so you can focus on bigger strategies",
        outcome: "Correct! Scaling requires shifting from being the chief doer to the chief architect.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Hire more personal assistants just to process your approvals faster",
        outcome: "Adding bureaucracy to a bottleneck doesn't solve the core issue of centralized control.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "You decide to delegate. How do you begin giving your managers real decision-making authority?",
    options: [
      {
        id: "opt1",
        text: "Throw them into the deep end by instantly giving them full control over the company budget without guidance",
        outcome: "Delegation without preparation is just abdication, leading to disastrous, expensive mistakes.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Tell them they can make decisions, but secretly overturn any decision you personally disagree with",
        outcome: "This destroys trust. If you override them constantly, they will just stop making decisions.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Invest in leadership training and establish clear boundaries, budgets, and expectations for their new roles",
        outcome: "Exactly! Empowerment requires a framework of clarity and competence.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 3,
    prompt: "One of your newly empowered managers makes a decision that results in a minor financial loss. How do you handle it?",
    options: [
      {
        id: "opt1",
        text: "Use it as a coaching opportunity to discuss what went wrong and how to improve their judgement next time",
        outcome: "Spot on! Mistakes are tuition paid for their leadership development.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Publicly berate them and immediately revoke all their decision-making power",
        outcome: "A culture of fear ensures no one will ever take a risk or step up to lead again.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Ignore it completely so their feelings aren't hurt",
        outcome: "Ignoring mistakes robs them of learning and sets a low standard of accountability.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "With managers now handling daily operations confidently, you suddenly find yourself with much more free time. Where should you redirect your energy?",
    options: [
      {
        id: "opt1",
        text: "Micro-manage exactly how the managers are doing their jobs from a distance",
        outcome: "This defeats the entire purpose of empowering them in the first place.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Focus on long-term strategy, building key partnerships, and finding new avenues to scale the business",
        outcome: "Perfect! You have successfully bought back your time to do the high-level work a CEO should do.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Take all the credit for the daily work your managers are now doing",
        outcome: "Great leaders take the blame and pass the credit. Taking their credit breeds deep resentment.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the ultimate business benefit of investing in leadership training and empowering your team?",
    options: [
      
      {
        id: "opt2",
        text: "It allows you to fire more people because you trained fewer people to do everything",
        outcome: "Empowerment is about multiplying capabilities, not just cutting headcount recklessly.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "It guarantees that the company will never face a crisis again",
        outcome: "Crises will always happen, but an empowered team is much better equipped to handle them.",
        isCorrect: false,
      },
      {
        id: "opt1",
        text: "It creates a scalable, resilient organization that operates successfully even when you aren't in the room",
        outcome: "Exactly! True empowerment shifts a business from relying on one hero to relying on a great system.",
        isCorrect: true,
      },
    ],
  },
];

const LeadershipEmpowermentStory = () => {
  const location = useLocation();
  const gameId = "ehe-adults-77";
  const gameData = getGameDataById(gameId);
  const totalStages = EMPOWERMENT_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 20;
  const totalXp = gameData?.xp || location.state?.totalXp || 40;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = EMPOWERMENT_STAGES[currentStageIndex];

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
      title="Leadership Empowerment Story"
      subtitle={
        showResult
          ? "Well done! You learned how to empower a strong leadership team."
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

export default LeadershipEmpowermentStory;
