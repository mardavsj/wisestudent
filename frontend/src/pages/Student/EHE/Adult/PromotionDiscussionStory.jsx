import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STORY_STAGES = [
  {
    id: 1,
    prompt: "You've been consistently exceeding targets at work for the past two years, but your manager hasn't mentioned a promotion. What do you do?",
    options: [
      {
        id: "opt1",
        text: "Keep working hard and wait patiently. Good work always speaks for itself eventually.",
        outcome: "Waiting silently often results in being overlooked. Managers are busy and may assume you are content in your current role.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Start complaining to coworkers about how underappreciated you are to put pressure on management.",
        outcome: "Gossip destroys professional reputation. It marks you as a negative influence rather than a leader.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Schedule a dedicated meeting to proactively communicate your career goals and discuss a path to promotion.",
        outcome: "Correct! Proactive communication ensures your ambitions are known and initiates a structured plan for growth.",
        isCorrect: true,
      },
    ]
  },
  {
    id: 2,
    prompt: "You schedule the meeting. How should you prepare to justify your promotion request?",
    options: [
      {
        id: "opt1",
        text: "Compile a data-driven list of specific projects you delivered, the measurable impact, and how you've operated above your current level.",
        outcome: "Exactly! Data and documented impact are the strongest arguments for career advancement.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Prepare to explain that you need the money because your rent recently increased.",
        outcome: "Personal financial needs, while real to you, do not justify to a business why you deserve more responsibility or pay.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Just print out your original job description and show that you've done everything on it.",
        outcome: "Doing your baseline job description is why you receive your current salary, not why you should get a promotion.",
        isCorrect: false,
      }
    ]
  },
  {
    id: 3,
    prompt: "During the meeting, your manager says they agree you do great work, but there isn't budget for a promotion right now. How do you respond?",
    options: [
      {
        id: "opt1",
        text: "Get angry, accuse them of lying, and threaten to quit immediately.",
        outcome: "Emotional outbursts burn bridges instantly and validate their decision not to promote you to a leadership role.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Accept it immediately, drop the subject permanently, and go back to work.",
        outcome: "Giving up entirely signals that you lack resilience and aren't actually that committed to advancing.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Acknowledge the budget constraint, but ask to define specific milestones that will guarantee promotion when the next budget cycle opens.",
        outcome: "Brilliant! You turned a 'No' into a 'Not right now, but here is the exact roadmap'.",
        isCorrect: true,
      }
    ]
  },
  {
    id: 4,
    prompt: "Your manager agrees to the milestones. Over the next six months, you.",
    options: [
      {
        id: "opt1",
        text: "Work completely alone to hit the milestones so you don't have to share credit.",
        outcome: "Leadership requires collaboration. Isolating yourself proves you aren't ready for a higher-level role.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Actively check in every 4-6 weeks to report progress and ensure you and your manager stay aligned.",
        outcome: "Perfect! Regular alignment prevents surprises and keeps your promotion top-of-mind for management.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Forget about the milestones and just hope the manager remembers the conversation in six months.",
        outcome: "Managers forget. If you don't track your own progress and drive the conversation, no one else will.",
        isCorrect: false,
      }
    ]
  },
  {
    id: 5,
    prompt: "Six months later, you've hit the goals and receive the formal promotion. What is the key lesson about career growth?",
    options: [
      {
        id: "opt1",
        text: "Career advancement must be aggressively fought for using threats and leverage.",
        outcome: "Aggression creates enemies. Promotion requires structured, cooperative advocacy.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "If you just work hard enough, people will always notice and reward you automatically.",
        outcome: "This is a common myth. Hard work is the baseline; visibility and advocacy are the catalysts.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "You must be your own strongest advocate, backing ambition with measurable data and continuous communication.",
        outcome: "Spot on! No one cares about your career as much as you do. Own it.",
        isCorrect: true,
      }
    ]
  }
];

const PromotionDiscussionStory = () => {
  const location = useLocation();
  const gameId = "ehe-adults-11";
  const gameData = getGameDataById(gameId);
  const totalStages = STORY_STAGES.length;

  // Assuming standard coin mapping: 10 total coins across 5 stages = 2 coins/stage
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
      title="Story: Promotion Discussion"
      subtitle={
        showResult
          ? "Great job! You know how to advocate for your career."
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
                  Career Progression
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

export default PromotionDiscussionStory;
