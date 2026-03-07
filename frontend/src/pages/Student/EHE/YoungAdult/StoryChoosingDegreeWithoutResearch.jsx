import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STORY_STAGES = [
  {
    id: 1,
    prompt: "It's time to declare your college major. Several of your close friends are choosing Computer Science simply because they heard it pays a lot of money.",
    options: [
      {
        id: "opt1",
        text: "Just follow them. If everyone is doing it, the university must guarantee you a high-paying job at the end.",
        outcome: "A degree alone does not guarantee placement. Without genuine interest, you will struggle to compete with passionate students.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Blindly pick the most obscure major possible just to be different from your friend group.",
        outcome: "Rebellion is not a career strategy. Picking a major without researching its job market prospects is highly risky.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Take a career aptitude test and research the day-to-day realities of different fields before deciding.",
        outcome: "Correct! Aligning your strengths and interests with job market realities is the best way to choose a path.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "You decided to major in Marketing because your friends said it was 'fun and easy'. By your second year, you realize you absolutely hate data analysis and copywriting.",
    options: [
      {
        id: "opt1",
        text: "Realize the career misalignment early and visit the academic advisor to explore changing your major.",
        outcome: "Spot on! Admitting a mistake early saves you years of studying a subject you dislike and working a career you hate.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Just suffer through it. A degree is just a piece of paper anyway.",
        outcome: "While many people work outside their major, forcing yourself through years of misery leads to academic burnout.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Drop out of college immediately without any backup plan.",
        outcome: "A drastic emotional reaction without a plan B leaves you in a much worse position.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "You continue with the popular major anyway. You notice that the job market is heavily saturated with graduates, making entry-level roles extremely competitive.",
    options: [
      {
        id: "opt1",
        text: "Get angry at the university for failing to secure you a job interview.",
        outcome: "Universities provide education, but securing a job is entirely your responsibility in a competitive market.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Start actively looking for internships and unique projects to build a portfolio that stands out from the crowd.",
        outcome: "Exactly! When you lack innate passion for the subject, you must compensate by actively building a strong resume early.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Assume you are naturally talented enough that companies will just hire you over everyone else.",
        outcome: "Overconfidence without a portfolio or experience will result in endless rejection emails.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 4,
    prompt: "As graduation approaches, you realize you have no idea what specific jobs to actually apply for because you never researched the industry.",
    options: [
      {
        id: "opt1",
        text: "Reach out to alumni on LinkedIn to do informational interviews and understand their daily work.",
        outcome: "Correct! Networking and informational interviews are the fastest way to understand real-world job titles and expectations.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Panic and use a bot to mass-apply to thousands of random jobs on job boards.",
        outcome: "Failing to tailor your resume to specific jobs guarantees an extremely low interview success rate.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Wait on your couch for recruiters to magically find your generic LinkedIn profile.",
        outcome: "Passive job hunting rarely works, especially for entry-level candidates in a saturated field.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "Looking back, what is the biggest danger of choosing an educational path based on peer popularity instead of deep research?",
    options: [
      {
        id: "opt1",
        text: "It's actually the safest route because studying with friends guarantees better grades.",
        outcome: "Your friends won't be taking your exams or doing your job for you in the real world.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "It doesn't matter what you study because almost everyone ends up working in sales anyway.",
        outcome: "While sales is common, specific degrees open specific doors that are closed to generic applicants.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "It often leads to severe career misalignment, where you spend thousands of dollars training for a life you don't enjoy.",
        outcome: "Spot on! Deep research prevents you from making expensive, time-consuming mistakes based on others' opinions.",
        isCorrect: true,
      },
    ],
  },
];

const StoryChoosingDegreeWithoutResearch = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-61";
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
      title="Story: Choosing Degree Without Research"
      subtitle={
        showResult
          ? "Great job! You learned the importance of career research."
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
                  Career Planning
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

export default StoryChoosingDegreeWithoutResearch;
