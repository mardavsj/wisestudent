import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const COURSE_VS_CAREER_DEMAND_STAGES = [
  {
    id: 1,
    prompt: "You are about to choose a course without checking job demand. What should be reviewed to make a smart choice?",
    options: [
      {
        id: "opt1",
        text: "Campus size and amenities",
        outcome: "While a nice campus is pleasant, it won't help you find a job after graduation.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "How many of your friends are taking it",
        outcome: "Following friends into a saturated or shrinking job market is a risky career strategy.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Market demand for skills",
        outcome: "Correct! Studying a field where employers are actively hiring guarantees a smoother career start.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "You find a degree program that is incredibly popular, but it prepares you for a shrinking industry. What is the main risk?",
    options: [
      {
        id: "opt1",
        text: "You will struggle to find a job or command a strong salary after graduation",
        outcome: "Correct! A shrinking industry means fewer jobs and lower pay due to an oversupply of candidates.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Shrinking industries secretly pay the highest starting salaries",
        outcome: "False. High salaries come from high demand and low supply, not shrinking demand.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "You will be automatically recruited by top companies",
        outcome: "Top companies recruit from growing, high-demand fields, not shrinking ones.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "What does it actually mean when a specific skill has 'high market demand'?",
    options: [
      {
        id: "opt1",
        text: "It is taught as a mandatory class at every university",
        outcome: "University curricula often lag years behind actual current market demand.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Employers are actively searching for and are willing to pay a premium for people with that skill",
        outcome: "Exactly! High market demand means companies have problems they need those skills to solve right now.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "It requires you to buy expensive software to learn it",
        outcome: "Demand is about employer need, not the price of learning materials.",
        isCorrect: false,
      },
      
    ],
  },
  {
    id: 4,
    prompt: "If you realize halfway through your degree that your chosen field has very low job prospects, what is a proactive step?",
    options: [
      {
        id: "opt1",
        text: "Drop out immediately without any backup plan",
        outcome: "Quitting without a plan leaves you with no degree and no new skills.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Complain to the university administration and demand a refund",
        outcome: "Universities sell education, not guaranteed job placement. It is your responsibility to research the market.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Start learning complementary, high-demand skills (like data analysis or basic coding) alongside your degree",
        outcome: "Correct! Combining a traditional degree with hard, in-demand skills makes you highly employable.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 5,
    prompt: "Why is looking at active job postings before choosing a course a smart strategy?",
    options: [
      {
        id: "opt1",
        text: "To see exactly what real employers are currently requiring and willing to pay for",
        outcome: "Spot on! Job boards are real-time indicators of what the market actually values right now.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "To memorize the names of different companies",
        outcome: "Knowing names is less important than knowing the skills those companies are buying.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Because universities require you to submit printed job postings to graduate",
        outcome: "Universities do not require this, but doing it proactively protects your future career.",
        isCorrect: false,
      },
    ],
  },
];

const QuizCourseVsCareerDemand = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-62";
  const gameData = getGameDataById(gameId);
  const totalStages = COURSE_VS_CAREER_DEMAND_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 15;
  const totalXp = gameData?.xp || location.state?.totalXp || 30;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = COURSE_VS_CAREER_DEMAND_STAGES[currentStageIndex];

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
      title="Quiz: Course vs Career Demand"
      subtitle={
        showResult
          ? "Well done! You understand how to align education with real market needs."
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
                  Market Check
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

export default QuizCourseVsCareerDemand;
