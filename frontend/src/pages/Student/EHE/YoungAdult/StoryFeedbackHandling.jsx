import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STORY_STAGES = [
  {
    id: 1,
    prompt: "During your quarterly review, your manager points out that you often miss minor details in your reports. What is your immediate reaction?",
    options: [
      {
        id: "opt1",
        text: "Get defensive and argue that the details aren't that important",
        outcome: "Defensiveness prevents learning. Dismissing feedback makes you look uncoachable.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Thank them for the observation and ask for specific examples to understand better",
        outcome: "Correct! Approaching feedback with curiosity and gratitude shows high emotional intelligence.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Agree silently but secretly feel insulted and lose motivation",
        outcome: "Internalizing negative feelings without addressing them leads to burnout and stagnation.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "After receiving the feedback, what is the best next step to take?",
    options: [
      {
        id: "opt1",
        text: "Create a checklist or improvement plan to review your work before submitting",
        outcome: "Exactly! Taking actionable steps to solve the problem proves you take feedback seriously.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Wait for your manager to give you a step-by-step guide on how to fix it",
        outcome: "Waiting for instructions shows a lack of initiative. You should drive your own improvement.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Avoid doing reports altogether and ask to switch projects",
        outcome: "Running away from weak areas ensures you never improve them.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "You've been using your new checklist for a month. How do you know if it's working?",
    options: [
      {
        id: "opt1",
        text: "Assume it's working since your manager hasn't yelled at you",
        outcome: "Lack of negative feedback doesn't necessarily equal positive progress. Don't assume.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Wait until the next quarterly review to find out",
        outcome: "Three months is too long to wait to course-correct if things still aren't right.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Proactively ask your manager for a quick 5-minute check-in on your recent reports",
        outcome: "Perfect! Proactive follow-ups show dedication to continuous improvement.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "Your manager reviews your recent work and says, 'This is much better, but I'd still like to see faster turnaround times.' How do you process this new feedback?",
    options: [
      {
        id: "opt1",
        text: "Feel defeated that nothing you do is ever good enough",
        outcome: "Growth is a continuous process. New feedback isn't a failure; it's the next goal.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Accept the new challenge and ask for advice on balancing speed with accuracy",
        outcome: "Great mindset! Feedback is often layered. Asking for strategy helps you navigate tradeoffs.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Tell them they have to choose: either it's fast or it's accurate, not both",
        outcome: "Ultimatums are unprofessional. There is usually a middle ground through better processes.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "Ultimately, how should you view critical feedback from leadership?",
    options: [
      {
        id: "opt1",
        text: "As a personal attack on your character and abilities",
        outcome: "Taking feedback personally clouds your judgment and stalls your career.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "As a mandatory, annoying part of the corporate machine",
        outcome: "This cynical view will keep you doing the bare minimum instead of excelling.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "As a valuable, free resource designed to help you level up your career",
        outcome: "Spot on! The most successful professionals actively seek out constructive criticism.",
        isCorrect: true,
      },
    ],
  },
];

const StoryFeedbackHandling = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-12";
  const gameData = getGameDataById(gameId);
  const totalStages = STORY_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
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
      showCorrectAnswerFeedback(coinsPerLevel, true);
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
      title="Story: Feedback Handling"
      subtitle={
        showResult
          ? "Well done! Constructive feedback is a tool for growth."
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
                  Feedback Handling
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

export default StoryFeedbackHandling;
