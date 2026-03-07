import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STORY_STAGES = [
  {
    id: 1,
    prompt: "You are moving to a new city for college. You tour a luxury apartment complex with a pool, gym, and barista, but the rent is twice your housing budget.",
    options: [
      {
        id: "opt1",
        text: "Sign the lease immediately. You 'need' a premium environment to study effectively.",
        outcome: "A premium environment does not guarantee academic success, but it does guarantee severe financial pressure.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Sign the lease and assume you will just win the lottery or find a high-paying job next month.",
        outcome: "Basing concrete legal contracts like a lease on completely unfounded financial hopes is disastrous.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Politely decline and look for modest, affordable housing within walking distance of campus.",
        outcome: "Correct! Prioritizing affordability and convenience over luxury is the smartest move for a student.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "You signed the luxury lease anyway. Two months into the semester, you realize that after paying rent, you only have $20 a week left for food.",
    options: [
      {
        id: "opt1",
        text: "Take out high-interest personal loans just to buy groceries.",
        outcome: "Using high-interest loans for basic survival needs because your rent is too high creates a debt death spiral.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Admit your mistake, talk to the leasing office about subletting or breaking the lease, and find cheaper housing.",
        outcome: "Correct! Swallowing your pride and exiting a bad financial situation early prevents long-term disaster.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Starve yourself to maintain the appearance of living a luxury lifestyle.",
        outcome: "Sacrificing your health and academic energy to impress strangers with an apartment is a terrible trade-off.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "Your friends invite you on a weekend trip, but you literally cannot afford it because your rent is consuming 80% of your income.",
    options: [
      {
        id: "opt2",
        text: "Realize that being 'house poor' is severely restricting your social life and networking opportunities.",
        outcome: "Exactly! When housing eats your entire budget, you lose the flexibility to enjoy college experiences.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Put the entire trip on a credit card and ignore the balance.",
        outcome: "Compounding bad rent decisions with bad credit card decisions will ruin your credit score.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Lie to your friends and say you are too busy studying, then feel miserable alone in your expensive apartment.",
        outcome: "While better than debt, this highlights how financial stress forces you to isolate yourself.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "A recruiter asks about your grades. Because you have been forced to work 30 hours a week just to afford your luxury rent, your GPA has plummeted.",
    options: [
      {
        id: "opt1",
        text: "Blame the professors for making the classes too hard.",
        outcome: "Deflecting blame shows a profound lack of accountability. The root cause was your housing choice.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Reflect on how your choice to secure 'premium housing' actually destroyed your primary goal: academic success.",
        outcome: "Correct! The financial pressure of the apartment forced you to sacrifice the very degree you came to get.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Tell the recruiter they don't understand how nice your apartment's gym is.",
        outcome: "Recruiters care about your skills and grades, not the amenities of your overpriced college apartment.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the ultimate lesson of choosing student accommodation?",
    options: [
      {
        id: "opt1",
        text: "Always prioritize the aesthetic of the apartment so you can impress people on social media.",
        outcome: "Social media aesthetics should never dictate your personal financial survival.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Expensive apartments automatically make you a better, more focused student.",
        outcome: "False. The financial stress of an expensive apartment usually distracts heavily from studying.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Living expenses should be kept as low as safely possible so you have the freedom to focus on studying and networking.",
        outcome: "Spot on! Lower overhead means lower stress, fewer required work hours, and better grades.",
        isCorrect: true,
      },
    ],
  },
];

const StoryExpensiveAccommodation = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-86";
  const gameData = getGameDataById(gameId);
  const totalStages = STORY_STAGES.length;

  // Configuration: 20 coins / 40 XP, with 4 coins per question
  const totalCoins = gameData?.coins || location.state?.totalCoins || 20;
  const totalXp = gameData?.xp || location.state?.totalXp || 40;
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
      title="Story: Expensive Accommodation"
      subtitle={
        showResult
          ? "Great job! You learned the risks of extreme lifestyle inflation."
          : `Phase ${currentStageIndex + 1} of ${totalStages}`
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
                <span>Phase {progressLabel}</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Score: {score}/{totalStages}
                </span>
              </div>

              <div className="text-center mb-10">
                <span className="inline-block py-1 px-3 rounded-full bg-violet-900/50 text-violet-300 text-xs font-bold uppercase tracking-wider mb-4 border border-violet-500/30">
                  Financial Planning
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

export default StoryExpensiveAccommodation;
