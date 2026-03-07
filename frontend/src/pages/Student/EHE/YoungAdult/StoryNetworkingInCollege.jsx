import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STORY_STAGES = [
  {
    id: 1,
    prompt: "Your college is hosting an industry seminar featuring professionals from your desired field. Most of your friends are staying in their dorms to play video games.",
    options: [
      {
        id: "opt1",
        text: "Stay in your room with your friends. Seminars are boring and you can just Google everything anyway.",
        outcome: "You miss a valuable opportunity to make real-world connections. You cannot Google a personal recommendation or mentorship.",
        isCorrect: false,
      },
      
      {
        id: "opt3",
        text: "Go to the seminar but sit in the back corner scrolling social media the entire time.",
        outcome: "Physical presence without mental presence is useless. You gain nothing if you aren't paying attention.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Step out of your comfort zone, attend the seminar, and take notes.",
        outcome: "Correct! Showing up is the necessary first step to building a professional network before you even graduate.",
        isCorrect: true,
      },
    ],
  },
  {
    id: 2,
    prompt: "After the seminar, there is an open networking session with the speakers.",
    options: [
      {
        id: "opt1",
        text: "Leave immediately. It's too awkward to talk to successful strangers.",
        outcome: "Letting social anxiety dictate your actions ensures you remain invisible to the people who can hire you.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Walk up, introduce yourself confidently, and ask a thoughtful question about their presentation.",
        outcome: "Exactly! Professionals love answering good questions from eager students. This is how you stand out.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Interrupt their conversation with someone else and demand they give you an internship.",
        outcome: "Aggression and lack of social awareness will get you remembered, but for all the wrong reasons.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 3,
    prompt: "A speaker gives you their business card and says to keep in touch.",
    options: [
      {
        id: "opt3",
        text: "Connect with them on LinkedIn within 24 hours and send a brief, polite message thanking them for their time.",
        outcome: "Correct! Prompt, polite follow-ups solidify the connection and make you look highly professional.",
        isCorrect: true,
      },
      {
        id: "opt1",
        text: "Throw the card in your drawer and forget about it. They were probably just being polite.",
        outcome: "You just threw away a warm lead. Assume people mean what they say when networking.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Email them immediately and ask them to write your resume for you.",
        outcome: "Asking for massive favors from a new connection burns the bridge before it's even built.",
        isCorrect: false,
      },
      
    ],
  },
  {
    id: 4,
    prompt: "Months later, you are looking for a summer internship. You see a posting at the company where your new connection works.",
    options: [
      {
        id: "opt1",
        text: "Apply through the general website portal and cross your fingers.",
        outcome: "Your application is now at the bottom of a pile of 500 other resumes.",
        isCorrect: false,
      },
      {
        id: "opt2",
        text: "Message your connection, remind them of your interaction, and ask if they have any advice for applying to that specific role.",
        outcome: "Perfect! You are leveraging your network properly. They might even refer you internally, bypassing the general pile.",
        isCorrect: true,
      },
      {
        id: "opt3",
        text: "Message them and complain that the job portal is too complicated.",
        outcome: "Complaining shows a lack of resourcefulness and maturity, making them regret giving you their contact info.",
        isCorrect: false,
      },
    ],
  },
  {
    id: 5,
    prompt: "What is the ultimate purpose of starting your professional networking while still in college?",
    options: [
      {
        id: "opt1",
        text: "To build relationships and industry exposure so you have warm leads and mentorship before you actually need a job.",
        outcome: "Spot on! Networking is about digging your well before you're thirsty.",
        isCorrect: true,
      },
      {
        id: "opt2",
        text: "To collect as many LinkedIn connections as possible to look popular.",
        outcome: "Quality of connections matters far more than quantity. A thousand silent connections won't help you.",
        isCorrect: false,
      },
      {
        id: "opt3",
        text: "So you can eventually use them to do your college assignments for you.",
        outcome: "Networking is about mutual professional value, not exploiting people to do your homework.",
        isCorrect: false,
      },
    ],
  },
];

const StoryNetworkingInCollege = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-75";
  const gameData = getGameDataById(gameId);
  const totalStages = STORY_STAGES.length;

  // 15 coins / 30 XP, with 3 coins per question
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
      title="Story: Networking in College"
      subtitle={
        showResult
          ? "Excellent! You understand the power of networking."
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
                  Career Readiness
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

export default StoryNetworkingInCollege;
