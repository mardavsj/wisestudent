import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_VISIBILITY_STAGES = [
  {
    id: 1,
    prompt: "You independently completed a high-impact data analysis that saved the company $10,000.",
    options: [
      { id: "opt1", text: "Wait silently for your manager to eventually notice the numbers", outcome: "Wrong! If you Stay Invisible, someone else might get the credit or it might go unnoticed.", isCorrect: false },
      { id: "opt2", text: "Demand an immediate promotion from the CEO", outcome: "Wrong! Overstating your achievement makes you look arrogant and lacking in self-awareness.", isCorrect: false },
      { id: "opt3", text: "Draft a brief, data-backed summary email to your manager holding the results", outcome: "Correct! This allows you to Share Contributions Professionally without bragging.", isCorrect: true },
      { id: "opt4", text: "Tell everyone in the breakroom how you saved the company single-handedly", outcome: "Wrong! Unprofessional boasting damages your reputation.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "During a large team meeting, the VP asks who developed the new successful workflow strategy. It was your idea.",
    options: [
      { id: "opt1", text: "Stay quiet because you don't like speaking in front of people", outcome: "Wrong! To Stay Invisible here means you are literally throwing away your career capital.", isCorrect: false },
      { id: "opt2", text: "Say 'I did!' and then talk for 15 minutes about how smart you are", outcome: "Wrong! Overstating Achievements monopolizes time and annoys the team.", isCorrect: false },
      { id: "opt4", text: "Point to your manager and let them take the credit", outcome: "Wrong! You must advocate for your own work.", isCorrect: false },
      { id: "opt3", text: "Say 'Our team implemented it, but I was proud to develop the initial concept.'", outcome: "Correct! You Share Contributions Professionally while still acknowledging the team's effort.", isCorrect: true },
    ],
  },
  {
    id: 3,
    prompt: "It's performance review season. Your manager asks you to list your accomplishments for the year.",
    options: [
      { id: "opt1", text: "Write 'Just did my job as requested'—they should already know what you did", outcome: "Wrong! Managers have many direct reports. If you Stay Invisible, they will forget your wins.", isCorrect: false },
      { id: "opt2", text: "Provide a detailed, bulleted list of 5 major projects with defined metrics", outcome: "Correct! Providing undeniable data is the best way to Share Contributions Professionally.", isCorrect: true },
      { id: "opt3", text: "Take credit for a major project where you only did 5% of the work", outcome: "Wrong! Overstating Achievements ruins trust when the truth comes out.", isCorrect: false },
      { id: "opt4", text: "Copy and paste your original job description", outcome: "Wrong! A job description is your baseline, not a list of your specific impactful accomplishments.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "A colleague you helped on a critical task is publicly praised by the director, but your name isn't mentioned.",
    options: [
      { id: "opt3", text: "Later, privately ask your colleague to clarify your role to the director", outcome: "Correct! This allows you to Share Contributions Professionally without causing a public scene.", isCorrect: true },
      { id: "opt1", text: "Interrupt the director to yell that it was actually your work", outcome: "Wrong! This is incredibly unprofessional and burns bridges instantly.", isCorrect: false },
      { id: "opt2", text: "Say nothing and resent your colleague forever", outcome: "Wrong! To Stay Invisible and harbor resentment is toxic for your own mental health.", isCorrect: false },
      { id: "opt4", text: "Email the entire department clarifying exactly what you did", outcome: "Wrong! This looks petty and desperate for attention.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "Your team launches a new product. You managed the testing phase flawlessly.",
    options: [
      { id: "opt1", text: "Post on LinkedIn: 'I single-handedly guaranteed the success of this launch!'", outcome: "Wrong! Overstating Achievements on public platforms destroys your credibility with your peers.", isCorrect: false },
      { id: "opt2", text: "Post on LinkedIn: 'Proud to have led the testing phase for this incredible team launch.'", outcome: "Correct! You Share Contributions Professionally, building your personal brand correctly.", isCorrect: true },
      { id: "opt3", text: "Don't mention your involvement to anyone outside your immediate team", outcome: "Wrong! If you Stay Invisible, you miss out on networking and future opportunities.", isCorrect: false },
      { id: "opt4", text: "Complain that marketing got more budget than testing", outcome: "Wrong! Negativity detracts from your actual accomplishments.", isCorrect: false },
    ],
  },
];

const ReflexVisibility = () => {
  const location = useLocation();
  const gameId = "ehe-adults-19";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_VISIBILITY_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = REFLEX_VISIBILITY_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Hesitation keeps you invisible!", isCorrect: false });
      if (currentStageIndex === totalStages - 1) {
        setTimeout(() => {
          setShowResult(true);
        }, 800);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResult, selectedChoice, stage]);

  const handleChoice = (option) => {
    if (selectedChoice || !stage) return;
    setSelectedChoice(option);

    if (option.isCorrect) {
      setScore((prev) => prev + 1);
      showCorrectAnswerFeedback(1, true);
    }

    if (currentStageIndex === totalStages - 1) {
      setTimeout(() => {
        setShowResult(true);
      }, 800);
    }
  };

  const handleNextStage = () => {
    if (!selectedChoice) return;
    if (currentStageIndex === totalStages - 1) {
      setShowResult(true);
    } else {
      setCurrentStageIndex((prev) => prev + 1);
      setTimeLeft(10);
    }
    setSelectedChoice(null);
  };

  const progressLabel = `${currentStageIndex + 1}/${totalStages}`;

  return (
    <GameShell
      title="Reflex: Visibility"
      subtitle={
        showResult
          ? "Great job! You know how to make your work visible without being arrogant."
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
      <div className="space-y-8">
        {!showResult && stage && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-700 shadow-2xl relative overflow-hidden">
              {/* Timer Bar */}
              <div 
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-blue-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Scenario {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              {/* Question Display */}
              <div className="bg-black/50 border-2 border-blue-900 shadow-[0_0_15px_rgba(59,130,246,0.2)] p-6 rounded-xl mt-6">
                 <div className="text-center font-mono text-blue-300 text-lg tracking-widest uppercase mb-4 opacity-50">
                    ⚡ SHARE IMPACT ⚡
                 </div>
                 <p className="text-white text-xl md:text-2xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
                 <div className="text-center font-mono text-blue-300 text-xs tracking-widest uppercase mt-4 opacity-50">
                    Choose your action before time runs out!
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "border-blue-700 bg-slate-800 text-blue-100 hover:bg-slate-700 hover:border-blue-500 border-[3px]";
                  
                  if (isSelected) {
                    baseStyle = option.isCorrect
                      ? "bg-emerald-900/80 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.5)] scale-105"
                      : "bg-rose-900/80 border-rose-400 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.5)] scale-105";
                  } else if (selectedChoice && option.isCorrect && !isSelected) {
                    baseStyle = "bg-emerald-900/40 border-emerald-500/50 text-emerald-300/80 ring-2 ring-emerald-500/30";
                  } else if (selectedChoice) {
                    baseStyle = "bg-slate-900/50 border-slate-700/50 text-slate-500 opacity-50 scale-95";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option)}
                      disabled={Boolean(selectedChoice)}
                      className={`relative flex items-center justify-center rounded-xl ${baseStyle} p-4 text-center font-bold transition-all disabled:cursor-not-allowed text-sm md:text-base leading-tight min-h-[90px]`}
                    >
                      <span className="z-10">{option.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {selectedChoice && (
          <div className="animate-fade-in-up">
            <div className={`rounded-xl border-2 p-5 text-center font-bold text-lg shadow-lg ${selectedChoice.isCorrect ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200' : 'bg-rose-900/60 border-rose-500 text-rose-200'}`}>
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Visibility' : '❌ Missed Opportunity'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-blue-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(59,130,246,0.4)] hover:scale-105 transform transition-all border border-blue-400 hover:bg-blue-500"
                >
                  NEXT →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default ReflexVisibility;
