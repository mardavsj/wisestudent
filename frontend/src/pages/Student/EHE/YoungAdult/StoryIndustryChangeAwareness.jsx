import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STORY_STAGES = [
  {
    id: 1,
    prompt: "You read several industry reports stating that automation and AI will take over 30% of the routine tasks in your current job within the next three years. How do you react?",
    options: [
      {
        id: "opt1",
        text: "Ignore the reports. People have been predicting the end of jobs for decades.",
        outcome: "Ignoring major technological shifts leaves you vulnerable to sudden unemployment.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Accept that your industry is changing and start investigating which skills AI cannot easily replace.",
        outcome: "Correct! Awareness and proactive research are the first steps to future-proofing your career.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Immediately quit your job and go back to school for an entirely different degree.",
        outcome: "A panicked, drastic reaction might waste time and money when upskilling in your current field was possible.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "You notice that a new software tool is slowly being introduced in your company that automates tasks you usually do manually. What is your strategy?",
    options: [
      {
        id: "opt1",
        text: "Complain to your manager that the tool is too complicated and you prefer the old way.",
        outcome: "Resisting standard company tools marks you as technologically inflexible and resistant to change.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Quietly hope they don't force you to use it anytime soon.",
        outcome: "Passive avoidance only delays the inevitable and puts you behind your peers who are adapting.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Volunteer to be part of the early testing group to master the tool before anyone else.",
        outcome: "Excellent! By mastering the tool, you become the resident expert rather than the one being replaced.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 3,
    prompt: "To stay relevant, you realize you need to learn 'future-ready skills'. Which of the following should you prioritize learning?",
    options: [
      {
        id: "opt1",
        text: "A highly specific, repetitive data entry process that only your current company uses.",
        outcome: "Niche, repetitive tasks are the most likely targets for future automation.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Complex problem solving, emotional intelligence, and how to manage the new automation tools.",
        outcome: "Perfect! Skills requiring deep human connection and strategic thinking are highly resilient to automation.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Memorizing all the company manuals and policies word-for-word.",
        outcome: "Information retrieval is something AI does perfectly; this isn't a competitive human skill.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "Your company offers an optional weekend workshop on leveraging AI in your daily workflow. It's not paid time. What do you do?",
    options: [
      {
        id: "opt1",
        text: "Attend the workshop, viewing the time spent as a direct investment in your long-term career value.",
        outcome: "Great choice! Taking ownership of your continuous learning sets you apart from the crowd.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Skip it. If the company wants you to learn it, they should pay you for the hours.",
        outcome: "While fair in theory, being rigid about small investments can cost you massive long-term opportunities.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Sign up but don't show up, so you look good on paper.",
        outcome: "Faking attendance destroys your credibility when you are later tested on those skills.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "Five years later, your industry has drastically transformed. Because you upskilled, you are now managing the AI systems instead of competing with them. What is the key lesson?",
    options: [
      {
        id: "opt1",
        text: "Technological change is an unstoppable threat that ultimately ruins careers.",
        outcome: "It's only a threat if you fail to adapt. For those who pivot, it's an opportunity.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Adaptability and continuous learning are the ultimate job security.",
        outcome: "Spot on! The ability to learn, unlearn, and relearn is the most critical survival skill in the modern workforce.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "You just got lucky that your specific job wasn't deleted entirely.",
        outcome: "It wasn't luck; it was your conscious decision to adapt and stay ahead of the curve.",
        isCorrect: false,
      },
    ],
  },
];

const StoryIndustryChangeAwareness = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-22";
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
      title="Story: Industry Change Awareness"
      subtitle={
        showResult
          ? "Well done! You have adapted to the changing industry."
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
                  Industry Change
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

export default StoryIndustryChangeAwareness;
