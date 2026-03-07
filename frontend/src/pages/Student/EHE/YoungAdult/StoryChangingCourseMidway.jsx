import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STORY_STAGES = [
  {
    id: 1,
    prompt: "You are halfway through your first year of an Engineering degree and realize you strongly dislike the coursework and cannot see yourself working in the field.",
    options: [
      {
        id: "opt1",
        text: "Drop out immediately the next day without telling anyone or making a new plan.",
        outcome: "An impulsive dropout leaves you with debt, no degree, and no backup plan, causing massive stress.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Evaluate your alternatives carefully, research other majors, and speak to an academic advisor.",
        outcome: "Correct! Gathering information before making a major life change prevents you from jumping from one bad situation to another.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Just ignore your feelings and force yourself to suffer through the next three years.",
        outcome: "Suppressing your genuine career misalignment usually leads to academic failure or deep career dissatisfaction later.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "You meet with your academic advisor to discuss changing your major to Business. What is the most important question to ask them?",
    options: [
      {
        id: "opt1",
        text: "How many of my current credits will transfer to the new degree program?",
        outcome: "Exactly! Understanding the financial and time cost of the switch is critical to making an informed decision.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Which business classes are the easiest so I can relax next semester?",
        outcome: "Looking for the easiest path rather than the most valuable path won't help your long-term career.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Can you guarantee I will get a high-paying job if I switch?",
        outcome: "No advisor can guarantee a job. Your success depends on your own networking, skills, and effort.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "Your parents are upset about your decision to switch majors, worrying that you are 'throwing away' your first year's tuition.",
    options: [
      {
        id: "opt1",
        text: "Agree with them and stay in Engineering just to make them happy.",
        outcome: "Living your life to appease others' fears often leads to personal regret and professional mediocrity.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Yell at them that it's your life and your money.",
        outcome: "Becoming hostile damages your support system during a time when you need guidance and stability.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Calmly present your research on the new career path and explain how the switch aligns better with your strengths.",
        outcome: "Correct! Demonstrating maturity and a well-researched plan is the best way to ease their anxieties.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "You successfully switch majors. However, you will now graduate one semester later than you originally planned.",
    options: [
      {
        id: "opt1",
        text: "Feel like a failure because all your friends are graduating before you.",
        outcome: "Comparing your unique timeline to others is a recipe for unnecessary anxiety. Careers are marathons, not sprints.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Use the extra semester to secure an internship in your new field to build your resume.",
        outcome: "Perfect! Turning a perceived delay into a strategic advantage makes you much more employable.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Try to take 25 credits a semester to catch up, sacrificing your sleep and grades.",
        outcome: "Overloading yourself will destroy your GPA and mental health, negating any benefit of finishing early.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "When reflecting on changing your course midway, what is the 'Sunk Cost Fallacy' you successfully avoided?",
    options: [
      {
        id: "opt1",
        text: "Thinking that dropping out is always the right choice when things get hard.",
        outcome: "Dropping out is not always the answer; sometimes perseverance is required. The fallacy is different.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Assuming that all degrees cost exactly the same amount of money in the long run.",
        outcome: "This is incorrect. Degrees vary wildly in cost and return on investment.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Believing that because you already invested time and money into a bad path, you must continue down it.",
        outcome: "Spot on! You realized that past costs shouldn't dictate your future if the path is genuinely wrong for you.",
        isCorrect: true,
      },
    ],
  },
];

const StoryChangingCourseMidway = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-68";
  const gameData = getGameDataById(gameId);
  const totalStages = STORY_STAGES.length;

  // Configuration for 15 coins / 30 XP, with 3 coins per question
  const totalCoins = gameData?.coins || location.state?.totalCoins || 15;
  const totalXp = gameData?.xp || location.state?.totalXp || 30;
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
      title="Story: Changing Course Midway"
      subtitle={
        showResult
          ? "Excellent! You learned how to pivot smartly."
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
                  Career Flexibility
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

export default StoryChangingCourseMidway;
