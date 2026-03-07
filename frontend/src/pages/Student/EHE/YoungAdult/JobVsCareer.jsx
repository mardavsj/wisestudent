import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const JOB_VS_CAREER_STAGES = [
  {
    id: 1,
    prompt: "What is the core difference between a job and a career?",
    options: [
      {
        id: "opt1",
        text: "A job is always temporary while a career is permanent",
        outcome: "Not quite. Both can be temporary or permanent. The real difference lies in intent and approach to growth, not duration.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "A job is work for income; a career is work for growth and long-term impact",
        outcome: "Exactly! A job earns money, while a career is an intentional journey of skill-building and meaningful progression.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "A job requires less education than a career",
        outcome: "Not necessarily. You can have a career-mindset at any job level. Education level doesn't define the difference.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "When you receive your first job offer, what mindset matters most for building a career?",
    options: [
      {
        id: "opt2",
        text: "Ask 'What can I learn here that will make me more valuable over time?'",
        outcome: "Perfect! This career-mindset reframes your first job from just income to an investment in yourself.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Focus only on the salary and benefits package",
        outcome: "While salary matters, ignoring the bigger picture limits growth. Skills, connections, and experience are more valuable long-term.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Take any job that pays immediately without thinking ahead",
        outcome: "This job-mindset prioritizes immediate needs over long-term positioning, limiting your career trajectory.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "How does a career mindset show itself in daily work?",
    options: [
      {
        id: "opt1",
        text: "You do only what's required in your job description",
        outcome: "This is a job-focused approach. Career-builders often go beyond to develop new skills and demonstrate impact.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "You focus on being liked by your manager rather than building skills",
        outcome: "This prioritizes short-term approval over long-term value. Genuine career growth builds respect based on competence.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "You seek feedback, volunteer for challenges, and document your growth",
        outcome: "Exactly! Career-minded people actively pursue learning opportunities and build a visible record of their development.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "When facing a setback or failure at work, what's the career-building response?",
    options: [
      {
        id: "opt1",
        text: "View it as proof you're not good enough and quit",
        outcome: "Setbacks happen at every career stage. Career-builders see failures as learning opportunities, not evidence of inadequacy.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Analyze what went wrong, extract the lesson, and apply it next time",
        outcome: "Perfect! Each setback becomes data that makes you more skilled and resilient for future challenges.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Pretend it didn't happen and move on to the next task",
        outcome: "Ignoring failures means missing the learning opportunity. Career growth requires reflection and intentional improvement.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "How does the job vs. career mindset affect your long-term opportunities?",
    options: [
      {
        id: "opt1",
        text: "Job mindset keeps you employable; career mindset positions you for leadership",
        outcome: "Great insight! Job-focused work keeps you afloat, but career-focused development opens doors to influence and new opportunities.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "They're the same thing — it doesn't matter which mindset you adopt",
        outcome: "They're very different. Over 5–10 years, a career mindset accumulates more skills, connections, and opportunities.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Career mindset makes you overqualified and harder to work with",
        outcome: "False. Career-builders develop both expertise AND collaboration skills. They become more valuable, not more difficult.",
        isCorrect: false,
      },
    ],
  },
];

const JobVsCareer = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-1";
  const gameData = getGameDataById(gameId);
  const totalStages = JOB_VS_CAREER_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = JOB_VS_CAREER_STAGES[currentStageIndex];

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
      title="Job vs Career"
      subtitle={
        showResult
          ? "Well done! You've explored the career mindset."
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

              {/* Top accent bar */}
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

export default JobVsCareer;
