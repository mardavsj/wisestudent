import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GameShell from "../../Finance/GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const REFLEX_INTERNSHIP_STAGES = [
  {
    id: 1,
    prompt: "An unpaid internship at a startup offers hands-on product development experience. Why should you consider it?",
    options: [
      { id: "opt1", text: "Skill development opportunity", outcome: "Correct! Practical exposure builds real-world skills that classrooms can't teach.", isCorrect: true },
      { id: "opt2", text: "It will look fancy on social media", outcome: "Wrong! Social status is a short-term illusion — skills last longer than likes.", isCorrect: false },
      { id: "opt3", text: "Only if they promise a salary later", outcome: "Wrong! Salary-only thinking can blind you to genuine learning experiences.", isCorrect: false },
      { id: "opt4", text: "To impress friends and family", outcome: "Wrong! Career decisions based on appearances rarely lead to real growth.", isCorrect: false },
    ],
  },
  {
    id: 2,
    prompt: "During your internship, your mentor asks you to lead a small project. What's your best response?",
    options: [
      { id: "opt1", text: "Decline — it's unpaid, not worth extra effort", outcome: "Wrong! Avoiding challenges in an internship defeats its purpose.", isCorrect: false },
      { id: "opt2", text: "Accept — it's a chance to build leadership skills", outcome: "Correct! Stepping up during internships accelerates professional growth.", isCorrect: true },
      { id: "opt3", text: "Only if you get a certificate for it", outcome: "Wrong! Certificates without real skills are just paper.", isCorrect: false },
      { id: "opt4", text: "Post about it on LinkedIn first", outcome: "Wrong! Focus on doing the work before broadcasting it.", isCorrect: false },
    ],
  },
  {
    id: 3,
    prompt: "Your internship offers no stipend but gives access to industry mentors and real clients. What matters most?",
    options: [
      { id: "opt1", text: "The salary they should be paying you", outcome: "Wrong! While fair pay matters, networking and mentorship can be even more valuable early on.", isCorrect: false },
      { id: "opt2", text: "The social prestige of the company name", outcome: "Wrong! A big name without real learning is a missed opportunity.", isCorrect: false },
      { id: "opt3", text: "Networking and mentorship access", outcome: "Correct! Connections and guidance from experienced professionals are career-defining assets.", isCorrect: true },
      { id: "opt4", text: "A comfortable office environment", outcome: "Wrong! Comfort zones don't build careers — growth zones do.", isCorrect: false },
    ],
  },
  {
    id: 4,
    prompt: "After 3 months of interning, you haven't received a job offer. How should you evaluate the experience?",
    options: [
      { id: "opt1", text: "It was a waste since there's no salary or job offer", outcome: "Wrong! Salary-only thinking ignores the skills and network you've built.", isCorrect: false },
      { id: "opt2", text: "By the portfolio, skills, and references you gained", outcome: "Correct! Tangible skill growth and professional references are powerful career assets.", isCorrect: true },
      { id: "opt3", text: "Only by whether your friends are impressed", outcome: "Wrong! Peer approval doesn't pay bills or build careers.", isCorrect: false },
      { id: "opt4", text: "By the company's brand reputation alone", outcome: "Wrong! Status without substance doesn't translate to career advancement.", isCorrect: false },
    ],
  },
  {
    id: 5,
    prompt: "A friend says unpaid internships are exploitation. How do you respond wisely?",
    options: [
      { id: "opt1", text: "Agree — only paid work has value", outcome: "Wrong! While fair compensation matters, learning opportunities have their own value.", isCorrect: false },
      { id: "opt3", text: "Disagree — all internships are great regardless", outcome: "Wrong! Not all internships are equal — evaluate what you're actually learning.", isCorrect: false },
      { id: "opt4", text: "Ignore the conversation and post a selfie", outcome: "Wrong! Avoiding important career conversations doesn't help anyone grow.", isCorrect: false },
      { id: "opt2", text: "It depends — if you're gaining real skills and exposure, it can be worthwhile", outcome: "Correct! The value of an internship lies in genuine skill development, not just the pay stub.", isCorrect: true },
    ],
  },
];

const ReflexInternship = () => {
  const location = useLocation();
  const gameId = "ehe-young-adult-3";
  const gameData = getGameDataById(gameId);
  const totalStages = REFLEX_INTERNSHIP_STAGES.length;
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback } = useGameFeedback();

  const totalCoins = gameData?.coins ?? location.state?.totalCoins ?? 5;
  const coinsPerLevel = Math.max(1, Math.floor(totalCoins / totalStages));
  const totalXp = gameData?.xp ?? location.state?.totalXp ?? 10;
  const stage = REFLEX_INTERNSHIP_STAGES[currentStageIndex];

  useEffect(() => {
    if (showResult || selectedChoice || !stage) return;

    if (timeLeft === 0) {
      setSelectedChoice({ id: "timeout", text: "Time's up!", outcome: "Too slow! Quick thinking is key in career decisions.", isCorrect: false });
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
      showCorrectAnswerFeedback(coinsPerLevel, true);
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
      title="Reflex: Internship"
      subtitle={
        showResult
          ? "Great job! You've navigated the internship mindset."
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
      <div className="space-y-8">
        {!showResult && stage && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-slate-700 shadow-2xl relative overflow-hidden">
              {/* Timer Bar */}
              <div 
                className={`absolute bottom-0 left-0 h-1.5 transition-all duration-1000 ease-linear ${timeLeft <= 3 ? "bg-red-500" : "bg-violet-400"}`}
                style={{ width: `${(timeLeft / 10) * 100}%` }}
              />
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                <span>Question {progressLabel}</span>
                <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-violet-400'}`}>00:{timeLeft.toString().padStart(2, '0')}</span>
                <span>Score: {score}/{totalStages}</span>
              </div>

              {/* Question Display */}
              <div className="bg-black/50 border-2 border-violet-900 shadow-[0_0_15px_rgba(139,92,246,0.2)] p-6 rounded-xl mt-6">
                 <div className="text-center font-mono text-violet-300 text-lg tracking-widest uppercase mb-4 opacity-50">
                    ⚡ REFLEX CHALLENGE ⚡
                 </div>
                 <p className="text-white text-xl md:text-2xl font-bold leading-snug text-center">
                   {stage.prompt}
                 </p>
                 <div className="text-center font-mono text-violet-300 text-xs tracking-widest uppercase mt-4 opacity-50">
                    Tap the right answer before time runs out!
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {stage.options.map((option) => {
                  const isSelected = selectedChoice?.id === option.id;
                  
                  let baseStyle = "border-violet-700 bg-slate-800 text-violet-100 hover:bg-slate-700 hover:border-violet-500 border-[3px]";
                  
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
              <span className="block text-xs uppercase opacity-70 mb-1">{selectedChoice.isCorrect ? '✅ Correct' : '❌ Wrong'}</span>
              {selectedChoice.outcome}
            </div>
            {currentStageIndex < totalStages - 1 && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleNextStage}
                  className="px-8 py-3 rounded-full bg-violet-600 text-white font-black tracking-widest uppercase shadow-[0_5px_15px_rgba(139,92,246,0.4)] hover:scale-105 transform transition-all border border-violet-400 hover:bg-violet-500"
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

export default ReflexInternship;
