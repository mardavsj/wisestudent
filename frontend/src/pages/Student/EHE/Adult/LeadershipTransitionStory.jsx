import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const LEADERSHIP_STAGES = [
  {
    id: 1,
    prompt: "You've just been promoted to team manager. What is the biggest shift in your primary responsibility?",
    options: [
      {
        id: "opt1",
        text: "Doing the same tasks as before but with a higher salary",
        outcome: "You are no longer just an individual contributor; your role has fundamentally changed.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Taking responsibility for the team's outcomes and success",
        outcome: "Correct! Leadership is about enabling and being accountable for your team.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Controlling every action your team members take",
        outcome: "Micromanaging builds resentment, not success. True leaders empower their teams.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Your team misses a critical project deadline. How should you address this with upper management?",
    options: [
      {
        id: "opt2",
        text: "Take accountability for the delay and present a recovery plan",
        outcome: "Exactly! Accountability builds trust and shows true leadership maturity.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Blame the specific team members who were slow",
        outcome: "As a leader, you own the team's failures. Blaming individuals destroys trust.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Make excuses about the project being too difficult",
        outcome: "Excuses don't solve the problem or demonstrate the capability expected of a manager.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "Two team members have a disagreement about how to approach a task. What is your role as their manager?",
    options: [
      {
        id: "opt1",
        text: "Tell them exactly what to do to end the argument quickly",
        outcome: "Dictating solutions prevents them from learning how to resolve conflicts independently.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Guide them through a discussion to help them reach a productive consensus",
        outcome: "Perfect! Facilitating resolution helps build a stronger, more collaborative team.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Ignore the disagreement so they can figure it out themselves",
        outcome: "Completely ignoring it can allow the conflict to escalate and create toxic team dynamics.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "You receive a larger salary increase with your promotion. What does this represent?",
    options: [
      {
        id: "opt1",
        text: "A reward for past hard work, allowing you to relax now",
        outcome: "The increase reflects new, heavier responsibilities, not a chance to coast.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "An expectation to focus solely on accumulating more personal wealth",
        outcome: "While compensation is nice, your success is now intrinsically tied to your team's performance.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "The increased scope of responsibility and expectations for team success",
        outcome: "Spot on! Higher pay comes with the expectation of driving far greater collective impact.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 5,
    prompt: "When evaluating your own success at the end of the year, what should be the main metric?",
    options: [
      {
        id: "opt1",
        text: "The collective achievements, delivery, and growth of your team",
        outcome: "Exactly! A successful manager is evaluated by the success and capability of their team.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "The amount of your annual bonus and salary bumps",
        outcome: "Financial reward is an outcome, not the core metric of your leadership effectiveness.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "How many hours you personally spent working on technical tasks",
        outcome: "Being a manager is about leverage and team impact, not just your personal hours logged.",
        isCorrect: false,
      },
    ],
  },
];

const LeadershipTransitionStory = () => {
  const location = useLocation();
  const gameId = "ehe-adults-31";
  const gameData = getGameDataById(gameId);
  const totalStages = LEADERSHIP_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 10;
  const totalXp = gameData?.xp || location.state?.totalXp || 20;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = LEADERSHIP_STAGES[currentStageIndex];

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
      title="Leadership Transition Story"
      subtitle={
        showResult
          ? "Well done! You have explored the transition to leadership."
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

export default LeadershipTransitionStory;
