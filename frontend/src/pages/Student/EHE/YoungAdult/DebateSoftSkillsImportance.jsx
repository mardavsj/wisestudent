import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const STAGES = [
  {
    id: 1,
    prompt: "You are the top coder in your class, but you refuse to speak during team meetings. How will this affect your future job prospects?",
    options: [
      { id: "opt2", text: "It will heavily limit your growth, as teamwork and communication are mandatory in professional environments.", outcome: "Correct! Technical brilliance must be communicated effectively to be useful to a company.", isCorrect: true },
      { id: "opt1", text: "It won't. Companies only care about technical perfection and ignore personality.", outcome: "Incorrect. Modern products are built by teams, not isolated individuals.", isCorrect: false },
      { id: "opt3", text: "It will make you look mysteriously smart and get you promoted faster.", outcome: "Incorrect. Being silent is usually interpreted as disinterest or lack of understanding.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "During an interview for an engineering role, the interviewer asks a non-technical question about a time you handled a conflict. Why?",
    options: [
      { id: "opt1", text: "They are trying to waste time because they ran out of technical questions.", outcome: "Incorrect. Behavioral questions are specifically designed to test soft skills.", isCorrect: false },
      { id: "opt2", text: "They are evaluating your emotional intelligence, problem-solving, and ability to work under stress with others.", outcome: "Correct! Soft skills determine how you handle the reality of a chaotic work environment.", isCorrect: true },
      { id: "opt3", text: "They want to know if you are a fun person to hang out with after work.", outcome: "Incorrect. While cultural fit matters, they are primarily assessing professional collaboration.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "You and a colleague disagree on a project's direction. Your technical solution is objectively better. How should you handle it?",
    options: [
      { id: "opt1", text: "Yell at them until they understand why your solution is superior.", outcome: "Incorrect. Aggression destroys team cohesion and will get you fired, regardless of how 'right' you are.", isCorrect: false },
      { id: "opt3", text: "Ignore them entirely, wait for them to fail, and then implement your solution.", outcome: "Incorrect. Sabotaging the team project to prove a point shows disastrously poor soft skills.", isCorrect: false },
      { id: "opt2", text: "Calmly present your evidence, listen to their concerns, and persuade them with logic and respect.", outcome: "Correct! Strong communication transforms a conflict into a productive collaboration.", isCorrect: true },
    ],
  },
  {
    id: 4,
    prompt: "A recruiter has two candidates with identical, excellent technical skills. Candidate A is arrogant and dismissive; Candidate B is humble, eager to learn, and friendly. Who gets the job?",
    options: [
      { id: "opt1", text: "Candidate A, because arrogance shows supreme confidence.", outcome: "Incorrect. Arrogance predicts future management headaches and toxic team dynamics.", isCorrect: false },
      { id: "opt2", text: "Candidate B, because soft skills serve as the critical tie-breaker and indicate long-term potential.", outcome: "Correct! When technical skills are equal, soft skills are the absolute deciding factor.", isCorrect: true },
      { id: "opt3", text: "The recruiter will just flip a coin since they are technically identical.", outcome: "Incorrect. Recruiters desperately want candidates who will positively impact the company culture.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Ultimately, what is the relationship between 'Hard Skills' (technical knowledge) and 'Soft Skills' (communication, empathy, teamwork) in a successful career?",
    options: [
      { id: "opt1", text: "Hard skills get you the interview, but soft skills get you the job and the promotions.", outcome: "Correct! Technical knowledge is the baseline requirement; soft skills drive the upward trajectory.", isCorrect: true },
      { id: "opt2", text: "Soft skills are just a bonus that only managers really need to worry about.", outcome: "Incorrect. Every single employee needs soft skills to navigate workplace dynamics successfully.", isCorrect: false },
      { id: "opt3", text: "If you have enough hard skills, soft skills become completely irrelevant.", outcome: "Incorrect. The history of business is littered with brilliant failures who couldn't work with others.", isCorrect: false },
    ],
  },
];

const DebateSoftSkillsImportance = () => {
  const location = useLocation();
  const totalStages = STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const { showAnswerConfetti, showCorrectAnswerFeedback, flashPoints } = useGameFeedback();

  const gameId = "ehe-young-adult-76";
  const gameData = getGameDataById(gameId);
  // Default to 20 coins / 40 XP as requested
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
      title="Debate: Soft Skills Importance"
      subtitle={
        showResult
          ? "Debate concluded! Technical genius requires communication to thrive."
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

export default DebateSoftSkillsImportance;
