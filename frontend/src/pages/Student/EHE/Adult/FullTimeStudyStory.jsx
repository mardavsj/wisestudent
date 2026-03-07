import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const CAREER_STAGES = [
  {
    id: 1,
    prompt: "You are considering leaving your stable job to study full-time. What is the smartest first step?",
    options: [
      {
        id: "opt1",
        text: "Resign immediately and figure it out later",
        outcome: "Resigning without a plan introduces high financial risk and unnecessary stress.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Take a massive loan to cover both living and education costs",
        outcome: "Relying purely on loans for living expenses adds heavy debt pressure prematurely.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Build a financial buffer before making the transition",
        outcome: "Correct! A financial buffer ensures stability while you transition to full-time study.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "Studying full-time means zero income for an extended period. How should you prepare?",
    options: [
      
      {
        id: "opt2",
        text: "Ignore the reality and rely entirely on credit cards",
        outcome: "Credit cards have high interest rates and will lead to overwhelming debt.",
        isCorrect: false,
      },
      {
        id: "opt1",
        text: "Reduce discretionary spending to save more aggressively right now",
        outcome: "Exactly! Creating a safety net will sustain you during your studies.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Hope that you will find a part-time job easily without planning",
        outcome: "Hope is not a strategy. It is risky to assume without a backup plan.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "Before committing to full-time study, what should you evaluate regarding your career?",
    options: [
        {
        id: "opt2",
        text: "The long-term career impact and ROI of the new qualification",
        outcome: "Correct! You must ensure the time and money spent aligns with clear career goals.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Only the prestige of the university you will attend",
        outcome: "Prestige doesn't guarantee an automatic return on your investment.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Whether your friends think it is an impressive idea",
        outcome: "Personal career decisions shouldn't rely on outside validation.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "If you build a financial buffer first, how does it affect your study experience?",
    options: [
      {
        id: "opt1",
        text: "It wastes time that could have been spent studying",
        outcome: "Financial preparation is never a waste of time; it secures your future.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "It makes you too comfortable and less motivated to study",
        outcome: "Having financial peace actually improves your ability to focus.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "It reduces stress, allowing you to focus completely on your studies",
        outcome: "Spot on! Financial security removes a major distraction from your academics.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 5,
    prompt: "If you find that the ROI for full-time study is too low, what is a strategic alternative?",
    options: [
      {
        id: "opt1",
        text: "Keep your job and pursue the qualification part-time or online",
        outcome: "Perfect! This balances your income needs while still advancing your education.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Quit your job anyway because you already made up your mind",
        outcome: "Ignoring financial realities can damage both your career and finances.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Give up completely on learning any new skills",
        outcome: "Continuous learning is necessary; you just need to find a better format.",
        isCorrect: false,
      },
    ],
  },
];

const FullTimeStudyStory = () => {
  const location = useLocation();
  const gameId = "ehe-adults-86";
  const gameData = getGameDataById(gameId);
  const totalStages = CAREER_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 20;
  const totalXp = gameData?.xp || location.state?.totalXp || 40;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages)); // 4

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = CAREER_STAGES[currentStageIndex];

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
      title="Full-Time Study Story"
      subtitle={
        showResult
          ? "Well done! You have explored the financial realities of full-time study."
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
                  Career Insight
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

export default FullTimeStudyStory;
