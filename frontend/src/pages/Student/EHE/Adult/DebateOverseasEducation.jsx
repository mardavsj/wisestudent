import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You are shortlisting universities abroad. Which factor should be your primary consideration?",
    options: [
        { id: "opt2", text: "The long-term financial impact, potential career value, and the specific program's return on investment.", outcome: "Correct! Evaluating the financial impact and career value ensures a sustainable and rational decision.", isCorrect: true },
      { id: "opt1", text: "The university's ranking in generic global lists and its social prestige.", outcome: "Incorrect. Generic rankings don't guarantee ROI or alignment with your specific career goals or budget.", isCorrect: false },
      { id: "opt3", text: "How exciting the location is for a student lifestyle.", outcome: "Incorrect. While lifestyle matters, basing a significant financial decision mostly on excitement is reckless.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "When considering how to fund your overseas education, what is the best approach?",
    options: [
      { id: "opt1", text: "Take out the maximum student loan available without calculating the future monthly repayments.", outcome: "Incorrect. Ignoring the realities of future debt can lead to severe financial distress after graduation.", isCorrect: false },
      { id: "opt2", text: "Carefully calculate the total cost, explore scholarships, and understand exactly how much debt you can realistically manage.", outcome: "Correct! Comprehensive financial planning is essential before taking on debt for education.", isCorrect: true },
      { id: "opt3", text: "Rely completely on family wealth, ignoring personal financial responsibility.", outcome: "Incorrect. Not taking ownership of your financial planning hinders your development of financial independence.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "You receive an offer from a highly prestigious but expensive university, and a less famous one with a full scholarship. What should drive your choice?",
    options: [
      { id: "opt1", text: "Always choose the prestigious university to impress potential employers.", outcome: "Incorrect. Prestige doesn't automatically translate to success, and the overwhelming debt might limit your choices later.", isCorrect: false },
      { id: "opt3", text: "Go where your friends are going so you have a comfortable social circle.", outcome: "Incorrect. While a support system is nice, your education is a personal investment that requires objective evaluation.", isCorrect: false },
      { id: "opt2", text: "Choose the university that offers the best career outcomes and skills relative to the financial burden it imposes.", outcome: "Correct! Assessing the value relative to cost leads to a sound financial and professional decision.", isCorrect: true },
    ],
  },
  {
    id: 4,
    prompt: "While studying abroad, how should you evaluate part-time work opportunities?",
    options: [
        { id: "opt2", text: "Prioritize finding work that provides relevant industry experience and helps manage living expenses without hurting your studies.", outcome: "Correct! Balancing financial practicality with skill-building activities maximizes the value of your time abroad.", isCorrect: true },
      { id: "opt1", text: "Avoid working to fully enjoy the cultural and social experiences.", outcome: "Incorrect. Completely avoiding work misses out on practical experience and financial self-sufficiency.", isCorrect: false },
      { id: "opt3", text: "Work as many hours as possible in any job, even if your academic performance drops.", outcome: "Incorrect. Earning money at the expense of your primary goal (education) defeats the purpose of studying abroad.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "As graduation approaches, how do you decide where to start your career?",
    options: [
      { id: "opt1", text: "Stay abroad at any cost for the status, even if the job offers poor career prospects or financial returns matching your debt.", outcome: "Incorrect. Prioritizing status over financial reality can trap you in a disadvantageous situation.", isCorrect: false },
      { id: "opt2", text: "Evaluate job offers globally based on financial viability, career growth path, and your ability to comfortably repay your loans.", outcome: "Correct! Making an objective decision based on financial and career realities ensures long-term stability and success.", isCorrect: true },
      { id: "opt3", text: "Return home immediately without exploring international options, just to be in your comfort zone.", outcome: "Incorrect. Giving up before exploring options objectively limits the potential return on your massive investment.", isCorrect: false },
    ],
  },
];

const DebateOverseasEducation = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  const gameId = "ehe-adults-85";
  const gameData = getGameDataById(gameId);
  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 20;
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 40;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  
  const stage = STAGES[currentStageIndex];

  const handleChoice = (option) => {
    if (selectedChoice || !stage) return;
    setSelectedChoice(option);
    if (option.isCorrect) {
      setScore((s) => s + 1);
      showCorrectAnswerFeedback(1, true);
    }
    setTimeout(() => {
      if (currentStageIndex === totalStages - 1) {
        setShowResult(true);
      } else {
        setCurrentStageIndex((i) => i + 1);
      }
      setSelectedChoice(null);
    }, 3500);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Debate: Overseas Education"
      subtitle={
        showResult
          ? "Debate concluded! Evaluating financial impact ensures a sustainable path."
          : `Point ${currentStageIndex + 1} of ${totalStages}`
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
              
              {/* Podium aesthetic */}
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
                  Topic of Debate
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
                                {option.isCorrect ? 'Strong Argument' : 'Weak Argument'}
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
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default DebateOverseasEducation;
