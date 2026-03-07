import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EMPLOYEE_RETENTION_STAGES = [
  {
    id: 1,
    prompt: "Skilled employees leave your company frequently. What should you review?",
    options: [
      {
        id: "opt1",
        text: "Employee replaceability",
        outcome: "Replacing employees is costly and loses institutional knowledge.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Work culture and growth opportunities",
        outcome: "Correct! A positive culture and clear growth paths are key to retention.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Hiring people who ask for less money",
        outcome: "This will only lead to lower quality work and potentially faster turnover.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "High employee turnover is affecting team morale. What is a proactive approach to address this?",
    options: [
      {
        id: "opt2",
        text: "Conduct regular one-on-ones to understand their challenges and career goals",
        outcome: "Exactly! Regular communication helps address concerns before they lead to resignation.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Ignore it, turnover is natural in business",
        outcome: "While some turnover happens, high turnover is a sign of deeper issues.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Offer free snacks to instantly boost morale",
        outcome: "Perks are nice, but they don't fix fundamental organizational problems.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "An experienced employee is considering leaving because they feel stagnant in their role. What can you do?",
    options: [
      {
        id: "opt1",
        text: "Let them leave, someone else will do the job",
        outcome: "Losing an experienced employee hurts productivity and team stability.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Tell them they should be grateful to have a job",
        outcome: "This dismissive attitude will guarantee they leave.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Create a clear progression path and offer upskilling opportunities",
        outcome: "Spot on! Employees stay when they see a future with the company.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "Your company wants to implement a retention strategy. Which of the following is most effective long-term?",
    options: [
      
      {
        id: "opt2",
        text: "Occasional pizza parties",
        outcome: "These are temporary morale boosters, not long-term retention strategies.",
        isCorrect: false,
      },
      {
        id: "opt1",
        text: "Building a supportive culture that values work-life balance and rewards achievements",
        outcome: "Correct! A holistic approach focused on well-being and recognition works best.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Forcing employees to sign a bond",
        outcome: "This creates resentment and traps unhappy employees, harming productivity.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "When an employee does decide to leave, what is the best practice for the company?",
    options: [
      {
        id: "opt1",
        text: "Conduct a constructive exit interview to learn how the company can improve",
        outcome: "Exactly! Honest feedback from departing employees highlights areas for improvement.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Cut all communication immediately",
        outcome: "This burns bridges and ignores a valuable learning opportunity.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Threaten to give them a bad reference",
        outcome: "Highly unprofessional and damages the company's reputation.",
        isCorrect: false,
      },
    ],
  },
];

const QuizEmployeeRetention = () => {
  const location = useLocation();
  const gameId = "ehe-adults-73";
  const gameData = getGameDataById(gameId);
  const totalStages = EMPLOYEE_RETENTION_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 15;
  const totalXp = gameData?.xp || location.state?.totalXp || 30;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = EMPLOYEE_RETENTION_STAGES[currentStageIndex];

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
      title="Quiz: Employee Retention"
      subtitle={
        showResult
          ? "Well done! You understand the strategies for employee retention."
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
                  Retention Strategy Check
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

export default QuizEmployeeRetention;
