import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const SKILL_DEVELOPMENT_STAGES = [
  {
    id: 1,
    prompt: "You complete a degree but learn no additional practical skills. What may happen?",
    options: [
      {
        id: "opt2",
        text: "Limited job readiness",
        outcome: "Correct! Without additional practical skills, you may face limited readiness for many roles.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Automatic promotion",
        outcome: "Degrees don't guarantee promotions. Practical skills are usually needed to advance.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Guaranteed high salary",
        outcome: "A degree alone does not guarantee a high salary if practical skills are missing.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    prompt: "Why is continuous skill development important even after getting a job?",
    options: [
      {
        id: "opt1",
        text: "It guarantees you will never be fired",
        outcome: "Nothing completely guarantees job security, though skills definitely help.",
        isCorrect: false,
      },
       {
        id: "opt3",
        text: "It allows you to stay competitive and adapt to changes",
        outcome: "Exactly! Continuous learning keeps you relevant in a rapidly changing job market.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "It is not important once you are hired",
        outcome: "Skills quickly become outdated in modern careers. Continuous learning is essential.",
        isCorrect: false,
      },
     
    ],
  },
  {
    id: 3,
    prompt: "If your current position doesn't offer formal training, what is the best approach?",
    options: [
      {
        id: "opt1",
        text: "Wait until the company changes its policy",
        outcome: "Waiting passively can stall your career progression.",
        isCorrect: false,
      },
     
      {
        id: "opt3",
        text: "Complain to management and stop trying",
        outcome: "Complaining without taking personal action won't improve your skill set.",
        isCorrect: false,
      },
       {
        id: "opt2",
        text: "Seek out informal learning and independent courses",
        outcome: "Great approach! Taking ownership of your learning is key to skill development.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "Which of these is a 'soft skill' crucial for career growth?",
    options: [
      {
        id: "opt3",
        text: "Effective communication and teamwork",
        outcome: "Correct! Soft skills like communication are just as critical as technical abilities.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Advanced coding in Python",
        outcome: "This is a valuable hard skill, but not a soft skill.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Operating specialized machinery",
        outcome: "This is a technical or hard skill.",
        isCorrect: false,
      },
      
    ],
  },
  {
    id: 5,
    prompt: "How does ignoring networking affect your skill development and career?",
    options: [
      
      {
        id: "opt2",
        text: "It makes you learn faster on your own",
        outcome: "While independent learning is good, isolated learning can be slower without guidance.",
        isCorrect: false,
      },
      {
        id: "opt1",
        text: "You may miss opportunities for mentorship and collaborative learning",
        outcome: "Spot on! Networking provides crucial knowledge exchange and mentorship.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "It has no impact on career progression",
        outcome: "Networking is vital for discovering new skills to learn and finding career opportunities.",
        isCorrect: false,
      },
    ],
  },
];

const QuizSkillDevelopment = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-4";
  const gameData = getGameDataById(gameId);
  const totalStages = SKILL_DEVELOPMENT_STAGES.length;

  const totalCoins = gameData?.coins || location.state?.totalCoins || 5;
  const totalXp = gameData?.xp || location.state?.totalXp || 10;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));

  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const stage = SKILL_DEVELOPMENT_STAGES[currentStageIndex];

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
      title="Quiz on Skill Development"
      subtitle={
        showResult
          ? "Well done! You've learned the importance of skill development."
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
                  Skill Check
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

export default QuizSkillDevelopment;
