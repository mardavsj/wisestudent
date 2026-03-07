import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const DELEGATION_STAGES = [
  {
    id: 1,
    prompt: "You attempt to handle all the work personally instead of delegating to your team. What is the risk?",
    options: [
      {
        id: "opt1",
        text: "Faster results",
        outcome: "Doing everything yourself may seem faster initially, but it limits scalability.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Team inefficiency and burnout",
        outcome: "Correct! Failing to delegate leads to your burnout and leaves the team underutilized.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Higher trust",
        outcome: "Not delegating actually signals a lack of trust in your team's abilities.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "What is the primary benefit of effectively delegating tasks to your team members?",
    options: [
      {
        id: "opt1",
        text: "You can leave work early every day",
        outcome: "Delegation frees up your time for strategic planning, not just leaving early.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "It empowers the team and builds their skills",
        outcome: "Exactly! Effective delegation fosters professional growth within your team.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "It allows you to avoid difficult tasks",
        outcome: "Delegation isn't about avoiding hard work; it's about optimizing resources.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "One of your team members makes a minor mistake on a delegated task. How should you handle it?",
    options: [
      {
        id: "opt1",
        text: "Take the task back and do it yourself",
        outcome: "Taking it back prevents them from learning and damages their confidence.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Reprimand them publicly so they don't repeat it",
        outcome: "Public reprimands destroy morale and trust within the team.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Provide constructive feedback and help them learn",
        outcome: "Correct! Mistakes are learning opportunities that build future competence.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "When assigning a task to a team member, what is crucial for success?",
    options: [
      {
        id: "opt1",
        text: "Providing clear instructions and expectations",
        outcome: "Spot on! Clarity ensures alignment and successful task completion.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Hovering over them to ensure they do it right",
        outcome: "Micromanaging undermines trust and reduces the efficiency gained by delegating.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Giving them the task with no context to test them",
        outcome: "Without context, team members cannot make informed decisions regarding the task.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "You are overwhelmed with multiple projects. Which of the following is the best delegation strategy?",
    options: [
      
      {
        id: "opt2",
        text: "Randomly assign tasks to whoever is available",
        outcome: "Random assignment can lead to poor results and frustrated employees.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Keep all critical tasks and delegate only administrative work",
        outcome: "Delegating only minor tasks prevents your team from developing higher-level skills.",
        isCorrect: false,
      },
      {
        id: "opt1",
        text: "Delegate tasks that align with your team's strengths and growth areas",
        outcome: "Correct! Strategic delegation maximizes efficiency and develops your team.",
        isCorrect: true,
      },
    ],
  },
];

const QuizDelegation = () => {
  const location = useLocation();
  const gameId = "ehe-adults-32";
  const gameData = getGameDataById(gameId);
  const totalStages = DELEGATION_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 10;
  const totalXp = gameData?.xp || location.state?.totalXp || 20;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = DELEGATION_STAGES[currentStageIndex];

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
      title="Quiz: Delegation"
      subtitle={
        showResult
          ? "Well done! You understand the importance of effective delegation."
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
                  Leadership Scenario
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

export default QuizDelegation;
