import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STORY_STAGES = [
  {
    id: 1,
    prompt: "You just graduated. A recruiter offers you a high-paying job in a field completely unrelated to what you want to do long-term. What do you do?",
    options: [
      {
        id: "opt1",
        text: "Take it just for the money and assume you'll figure out your career later.",
        outcome: "While tempting, getting stuck in an unrelated field can derail your long-term goals.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Take it and plan to quit without notice as soon as you find something better.",
        outcome: "This burns bridges and creates a spotty, unprofessional resume.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Politely decline and keep searching for a role aligned with your target career path.",
        outcome: "Correct! Early discipline is key. You are prioritizing long-term career trajectory over short-term cash.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "Two years later, you are ready for a new role. How do you decide what to apply for?",
    options: [
      {
        id: "opt3",
        text: "Target roles that build on your existing strengths and step toward your end goals.",
        outcome: "Exactly! Strategic job hopping means each role adds a purposeful layer to your expertise.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Apply to whatever jobs are available to get hired as fast as possible.",
        outcome: "Random applications lead to random jobs, making your career story confusing to future employers.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Apply only to jobs with the quickest and easiest interview processes.",
        outcome: "Easy interviews rarely correlate with high-quality career opportunities.",
        isCorrect: false,
      },
      
    ],
  },
  {
    id: 3,
    prompt: "You receive two offers: A startup with a flashy 'Vice President' title but unclear duties, or an established company with a standard 'Specialist' title but an incredible learning structure.",
    options: [
      {
        id: "opt1",
        text: "The flashy title, because it will look amazing on LinkedIn immediately.",
        outcome: "Titles without verifiable skills are hollow and often recognized as title inflation by top recruiters.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "The structured role where you can clearly define your impact and learn established processes.",
        outcome: "Perfect choice! Skill acquisition and verifiable results are far more valuable than a hollow title.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Neither, you decide to wait indefinitely for a job with both a better title and perfect structure.",
        outcome: "Perfectionism can cause massive gaps in your resume and stall your progress.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "You've been in your current role for 3 years. It's very comfortable, but you aren't learning anything new or advancing.",
    options: [
      {
        id: "opt1",
        text: "Stay forever. A comfortable paycheck is the ultimate goal of working.",
        outcome: "Stagnation makes you vulnerable to layoffs and drastically reduces your market value over time.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Complain about being bored to your coworkers but do nothing about it.",
        outcome: "Complaining without action creates a negative reputation and solves nothing.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Look for new challenges, internal promotions, or specific lateral moves to continue progression.",
        outcome: "Yes! A career is dynamic; staying proactive keeps your skills sharp and market value high.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 5,
    prompt: "Looking back over a 10-year period, what ultimately separates an intentional 'career' from a series of 'random jobs'?",
    options: [
       {
        id: "opt3",
        text: "Deliberately choosing roles that build a cohesive skill set and tell a logical, upward story.",
        outcome: "Spot on! That is the exact definition of building a career rather than just having a job.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Pure luck and knowing the right people.",
        outcome: "While networking helps, a true career requires intentionality and personal strategy.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Accepting absolutely any job offer that comes your way and hoping it somehow makes sense later.",
        outcome: "Hope is not a strategy. This approach is what creates the 'random job' trap.",
        isCorrect: false,
      },
     
    ],
  },
];

const StoryCareerDirection = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-28";
  const gameData = getGameDataById(gameId);
  const totalStages = STORY_STAGES.length;

  // Uses 10 coins / 20 XP total for this specific game
  const totalCoins = gameData?.coins || location.state?.totalCoins || 10;
  const totalXp = gameData?.xp || location.state?.totalXp || 20;
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
      title="Story: Career Direction"
      subtitle={
        showResult
          ? "Well done! You have built a strategic career."
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
                  Career Trajectory
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

export default StoryCareerDirection;
