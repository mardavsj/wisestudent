import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STORY_STAGES = [
  {
    id: 1,
    prompt: "You had a very frustrating day at work due to a disagreement with your manager. What is the most professional way to handle your frustration?",
    options: [
      {
        id: "opt1",
        text: "Post a vague but angry status on social media so friends can comfort you",
        outcome: "Vague posts can easily be traced back to your workplace and damage your reputation.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Message your coworkers to gossip and complain about the manager",
        outcome: "Gossiping creates a toxic environment and might get back to management.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Take a break to cool down, then discuss the issue constructively with your manager later",
        outcome: "Correct! Handling disagreements privately and constructively shows maturity and protects your professional image.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "You see a trend on social media where people share funny but embarrassing stories about their current employers. Do you join in?",
    options: [
      {
        id: "opt1",
        text: "No, participating could violate company policies and harm your digital reputation",
        outcome: "Exactly! Temporary social media popularity is not worth risking your job or future career prospects.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Yes, but make sure not to mention the company's name directly",
        outcome: "Even without names, details can be recognizable, posing a huge risk to your employment.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Yes, only share stories that seem harmless and funny",
        outcome: "What seems harmless to you might be viewed as unprofessional or damaging by your employer.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "A customer was extremely rude to you, and you want to vent online. How should you proceed?",
    options: [
      {
        id: "opt1",
        text: "Post the customer's behavior online to warn others, omitting their name",
        outcome: "Publicly complaining about customers reflects poorly on your customer service mindset and professionalism.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Rant about it on a private social media account where only 'close friends' can see",
        outcome: "Private posts can be screenshotted and leaked. Never assume online vents remain completely private.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Vent privately to a trusted friend offline or a family member instead of posting online",
        outcome: "Perfect. Offline venting helps you process frustration safely without leaving a permanent digital footprint.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 4,
    prompt: "You're leaving your current job for a much better opportunity. How do you announce it on social media?",
    options: [
      {
        id: "opt1",
        text: "Share a positive post thanking your previous employer for the experience",
        outcome: "Great choice! Leaving on good terms and showing gratitude builds a strong, positive professional network.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "Finally reveal all the things you hated about the previous job since you're leaving anyway",
        outcome: "Burning bridges hurts your reputation. Future employers might see this and think you'll do the same to them.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "Brag about how your new job is so much better than the terrible place you're leaving",
        outcome: "This comes across as arrogant and deeply unprofessional to both your old and new networks.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "Why is it crucial to protect your digital reputation when it comes to your employer?",
    options: [
      {
        id: "opt1",
        text: "It only matters if your social media accounts are set to public",
        outcome: "Even private accounts can be exposed. Your digital footprint is more persistent than you think.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Future employers, colleagues, and clients often search for you online before trusting you",
        outcome: "Spot on! Your online presence is a living resume. Protecting it ensures you don't lose out on future opportunities.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "It's not really crucial; employers rarely care about what you do outside of work",
        outcome: "False. Many companies actively review social media to assess character and cultural fit.",
        isCorrect: false,
      },
    ],
  },
];

const StoryProfessionalBehaviour = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-9";
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
      title="Story: Professional Behaviour"
      subtitle={
        showResult
          ? "Well done! You've successfully managed your digital reputation."
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
                  Professional Behaviour
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

export default StoryProfessionalBehaviour;
