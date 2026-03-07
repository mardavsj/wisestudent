import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const FREELANCE_VS_BUSINESS_STAGES = [
  {
    id: 1,
    prompt: "You earn money occasionally through small freelance work. What is the fundamental difference between this and running a true business?",
    options: [
      {
        id: "opt1",
        text: "A business requires a physical office space and full-time employees",
        outcome: "Many successful modern businesses operate fully remotely without physical offices.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Freelancing is trading time for money; a business builds a system that generates consistent value",
        outcome: "Correct! A true business relies on systems and scalability, not just your personal time.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "A business simply means you charge much higher hourly rates",
        outcome: "Higher rates alone don't change the model from freelance to business.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Your goal is to transition from occasional freelance income to a stable business. What should be your primary focus?",
    options: [
      {
        id: "opt1",
        text: "Waiting for your current occasional clients to give you more work",
        outcome: "Relying on hope and existing clients is not a predictable growth strategy.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Working 80 hours a week to manually take on every possible project",
        outcome: "This leads to severe burnout and still limits your income to your personal capacity.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Building consistent systems, processes, and a predictable lead generation pipeline",
        outcome: "Exactly! Systems and predictability are the foundation of a real business.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 3,
    prompt: "Currently, you do everything: marketing, delivering the work, and billing. To scale into a business, how must your role evolve?",
    options: [
      {
        id: "opt1",
        text: "You must continue doing everything yourself to ensure the quality remains perfect",
        outcome: "If you must do everything, you are the bottleneck preventing growth.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "You must transition from doing all the work to managing the systems and delegating tasks",
        outcome: "Perfect! You move from working IN the business to working ON the business.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "You should immediately stop doing any work and only tell others what to do",
        outcome: "You need a gradual transition, not an abrupt halt where you abandon operations.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "A client wants to refer you to three huge projects, which is way beyond your personal capacity. How does a business owner handle this?",
    options: [
      {
        id: "opt3",
        text: "See it as the catalyst to hire subcontractors or build a team to handle the volume",
        outcome: "Spot on! A business scales capacity to meet demand rather than capping out.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Decline the extra work because you don't have the personal time for it",
        outcome: "A freelancer turns away work; a business owner leverages capacity.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Accept it all and sacrifice your health to deliver it personally",
        outcome: "Accepting work without capacity leads to poor quality and burnout.",
        isCorrect: false,
      },
      
    ],
  },
  {
    id: 5,
    prompt: "What is the ultimate advantage of building a structured business system rather than relying on occasional freelance income?",
    options: [
      
      {
        id: "opt2",
        text: "It guarantees that you will never have to work hard again",
        outcome: "Building a business requires immense hard work, even if the nature of the work changes.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "It allows you to avoid paying taxes on your income legally",
        outcome: "Businesses still pay taxes. The advantage is structural and growth-oriented, not tax evasion.",
        isCorrect: false,
      },
      {
        id: "opt1",
        text: "It creates an asset that can eventually operate, grow, and generate consistent income independently of your direct daily involvement",
        outcome: "Exactly! A true business is an independent asset, providing both freedom and consistency.",
        isCorrect: true,
      },
    ],
  },
];

const FreelanceVsBusinessStory = () => {
  const location = useLocation();
  const gameId = "ehe-adults-41";
  const gameData = getGameDataById(gameId);
  const totalStages = FREELANCE_VS_BUSINESS_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 10;
  const totalXp = gameData?.xp || location.state?.totalXp || 20;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = FREELANCE_VS_BUSINESS_STAGES[currentStageIndex];

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
      title="Freelance vs Business Story"
      subtitle={
        showResult
          ? "Well done! You have explored the transition to a sustainable business."
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
                  Business Choice
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

export default FreelanceVsBusinessStory;
