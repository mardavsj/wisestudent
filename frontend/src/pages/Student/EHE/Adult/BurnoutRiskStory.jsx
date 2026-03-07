import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STORY_STAGES = [
  {
    id: 1,
    prompt: "You have been working 60-hour weeks for a month to meet deadlines. You are constantly exhausted and missing family time. What is your first step?",
    options: [
      {
        id: "opt1",
        text: "Keep pushing. This is what it takes to be successful in the modern workplace.",
        outcome: "Ignoring burnout leads to severe health consequences and eventual performance collapse.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Secretly disconnect and stop answering emails without telling anyone.",
        outcome: "Quiet quitting without communication damages trust, reliability, and professionalism.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Analyze your tasks and schedule a meeting with your manager to discuss workload prioritization.",
        outcome: "Correct! Structured communication is the first step to sustainable work habits.",
        isCorrect: true,
      }
    ]
  },
  {
    id: 2,
    prompt: "During the meeting, your manager asks which tasks can be delayed while you recover your bandwidth.",
    options: [
      {
        id: "opt1",
        text: "Tell them you don't know and want them to figure it out for you.",
        outcome: "Managers expect you to bring solutions. Abdicating responsibility looks unprofessional.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Present a tiered list of your projects, separating critical deadlines from those that can wait or be delegated.",
        outcome: "Exactly! Categorizing work allows management to redistribute resources effectively.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Say you can actually do everything and will just sleep less to catch up.",
        outcome: "Sacrificing more health does not solve a systemic workload issue.",
        isCorrect: false,
      }
    ]
  },
  {
    id: 3,
    prompt: "The workload is balanced, but you still feel pressure to answer work emails at 10 PM. How do you establish boundaries?",
    options: [
      {
        id: "opt1",
        text: "Turn off work notifications after hours and only respond to true, predefined emergencies.",
        outcome: "Brilliant! Protection of downtime prevents burnout. Boundaries must be actively enforced.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Reply immediately so no one thinks you are slacking off.",
        outcome: "Rewarding late-night emails trains people to expect you to work 24/7.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Write a multi-paragraph complaint to the team about their late emails.",
        outcome: "Overreacting creates hostility. Simple boundary enforcement works much better.",
        isCorrect: false,
      }
    ]
  },
  {
    id: 4,
    prompt: "A colleague praises you for 'hustling' and suggests that working weekends is a badge of honor.",
    options: [
      {
        id: "opt1",
        text: "Agree and start working weekends again to maintain their respect.",
        outcome: "Validation from others shouldn't dictate your personal boundaries or health.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Insult them and say they are foolish for working so much.",
        outcome: "Defensiveness is unnecessary. Set your own standard quietly.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Politely disagree, emphasizing that productivity is about impact and sustainable pacing, not just hours worked.",
        outcome: "Spot on! You are reframing the definition of high performance away from toxic burnout.",
        isCorrect: true,
      }
    ]
  },
  {
    id: 5,
    prompt: "Six months later, your health is back, your family is happier, and your work output is actually higher than when you were burning out. What's the takeaway?",
    options: [
      {
        id: "opt1",
        text: "Structured workload management protects your well-being while optimizing your overall career longevity and impact.",
        outcome: "Perfect! Sustainable practices yield the highest long-term returns in both life and career.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Boundaries are only for people who are lazy or not ambitious.",
        outcome: "False. Boundaries are what keep genuinely ambitious people in the game long-term.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "You should tell your boss you want to go back to 60-hour weeks now that you're rested.",
        outcome: "Reverting to toxic habits will just trigger the burnout cycle all over again.",
        isCorrect: false,
      }
    ]
  }
];

const BurnoutRiskStory = () => {
  const location = useLocation();
  const gameId = "ehe-adults-25";
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
      title="Story: Burnout Risk"
      subtitle={
        showResult
          ? "Excellent! You grasp structured workload management."
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
                  Work-Life Balance
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

export default BurnoutRiskStory;
