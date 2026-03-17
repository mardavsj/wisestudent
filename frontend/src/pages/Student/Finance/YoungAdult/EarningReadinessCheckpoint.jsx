import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const EARNING_READINESS_STAGES = [
  {
    id: 1,
    prompt: "Which shows readiness to earn income responsibly?",
    options: [
      {
        id: "a",
        label: "Taking any job regardless of values",
        reflection: "Taking jobs regardless of values can lead to poor long-term satisfaction and potential ethical issues that harm your career and reputation.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Avoiding work until it's perfect",
        reflection: "Perfect work rarely exists. Delaying action prevents learning, building experience, and demonstrating work ethic and responsibility.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Only considering high-paying positions",
        reflection: "Focusing solely on pay can miss important opportunities to build foundational skills and networks. Entry-level work is crucial for future income growth.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Matching skills to genuine market demand",
        reflection: "Exactly! Earning readiness involves understanding both your capabilities and authentic market opportunities that align with your skills and interests.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
  {
    id: 2,
    prompt: "How should you develop income-generating skills?",
    options: [
      {
        id: "a",
        label: "Choose based on easiest popularity",
        reflection: "Popular skills might attract more learners but don't ensure unique advantage or better returns. Match choices with authentic needs.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Imitate only what big names are doing",
        reflection: "Repeating celebrity techniques prevents recognition of growing opportunities. Track the future as well, but with added purpose through knowledge growth.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Build both transferable and field-specific abilities",
        reflection: "Perfect! Balancing field-specialized and versatile abilities boosts confidence while maintaining diverse professional appeal for future jobs.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Acquire fast courses then quickly resell",
        reflection: "Real credibility often comes from building experience yourself over time. Quickly consuming information often ignores the applied refinement steps behind skilled behaviors.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 3,
    prompt: "What earns more reliable early compensation?",
    options: [
      {
        id: "a",
        label: "Unstable remote freelance volume",
        reflection: "Extremes in reliability even out success from additional work. The job setup—not raw movement per period—is necessary for expected outcomes at stage.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Stable mix: baseline hourly, plus high-effort topup",
        reflection: "Yes, stabilize consistency within your commitments and focus on clearly superior performance markers to achieve compounding upgrades in your success rate progressively over time.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Always stick only with simplest setups",
        reflection: "Strictly default tools hide missed optimizations that will stay outside views later. You allow scaling blind potential regardless of extra limits.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Wander between unrelated side projects",
        reflection: "Jumping between unrelated projects prevents building expertise and reputation. Focus on a few related areas to build credibility and attract better opportunities.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 4,
    prompt: "How do you handle early earning setbacks?",
    options: [
      {
        id: "a",
        label: "Analyze what went wrong and adjust approach",
        reflection: "Exactly! Analyzing setbacks helps identify areas for improvement and builds the resilience and adaptability needed for long-term earning success.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Blame external factors and give up",
        reflection: "Blaming external factors prevents learning from mistakes and building resilience. Setbacks are opportunities to improve skills and strategies.",
        isCorrect: false,
      },
      
      {
        id: "c",
        label: "Double down on the same failing strategy",
        reflection: "Repeating failed approaches without adjustment rarely leads to different results. Flexibility and willingness to change course are essential for growth.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Ignore the setback and hope for better luck",
        reflection: "Ignoring setbacks prevents learning valuable lessons. Acknowledging and learning from failures is crucial for developing better earning strategies.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 5,
    prompt: "What's the foundation for sustainable income growth?",
    options: [
      {
        id: "a",
        label: "Quick wins and shortcuts to success",
        reflection: "Quick wins and shortcuts rarely lead to sustainable growth. Lasting income growth requires consistent effort, skill development, and building genuine value.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Consistent effort, skill building, and value creation",
        reflection: "Perfect! Sustainable income growth comes from consistently delivering value, building skills over time, and maintaining professional standards that attract better opportunities.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Relying on luck and connections alone",
        reflection: "While connections can help, relying solely on luck and connections without developing skills and delivering value is not a sustainable strategy for long-term income growth.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Maximizing short-term gains at all costs",
        reflection: "Maximizing short-term gains without considering long-term consequences can damage reputation and limit future opportunities. Sustainable growth requires balance and integrity.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
];

const EarningReadinessCheckpoint = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-80";
  const gameContent = t(
    "financial-literacy.young-adult.earning-readiness-checkpoint",
    { returnObjects: true }
  );
  const stages = Array.isArray(gameContent?.stages) ? gameContent.stages : [];
  const totalStages = stages.length;
  const successThreshold = totalStages;
  const gameData = getGameDataById(gameId);
  const coinsPerLevel = gameData?.coins || location.state?.coinsPerLevel || 20;
  const totalCoins = gameData?.coins || location.state?.totalCoins || 20;
  const totalXp = gameData?.xp || location.state?.totalXp || 40;
  const { flashPoints, showAnswerConfetti, showCorrectAnswerFeedback, resetFeedback } = useGameFeedback();

  const [currentStage, setCurrentStage] = useState(0);
  const [coins, setCoins] = useState(0);
  const [history, setHistory] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState(null);
  const [canProceed, setCanProceed] = useState(false);

  const reflectionPrompts = Array.isArray(gameContent?.reflectionPrompts)
    ? gameContent.reflectionPrompts
    : [];

  const handleChoice = (option) => {
    if (selectedOption || showResult) return;

    resetFeedback();
    const currentStageData = stages[currentStage];
    const updatedHistory = [
      ...history,
      { stageId: currentStageData.id, isCorrect: option.isCorrect },
    ];
    setHistory(updatedHistory);
    setSelectedOption(option.id);
    setSelectedReflection(option.reflection);
    setShowFeedback(true);
    setCanProceed(false);
    
    // Update coins if the answer is correct
    if (option.isCorrect) {
      setCoins(prevCoins => prevCoins + 1);
    }
    
    // Wait for the reflection period before allowing to proceed
    setTimeout(() => {
      setCanProceed(true);
    }, 1500);
    
    // Handle the final stage separately
    if (currentStage === totalStages - 1) {
      setTimeout(() => {
        const correctCount = updatedHistory.filter((item) => item.isCorrect).length;
        const passed = correctCount === successThreshold;
        setFinalScore(correctCount);
        setCoins(passed ? totalCoins : 0);
        setShowResult(true);
      }, 5500);
    }
    
    if (option.isCorrect) {
      showCorrectAnswerFeedback(currentStageData.reward, true);
    } else {
      showCorrectAnswerFeedback(0, false);
    }
  };

  const handleRetry = () => {
    resetFeedback();
    setCurrentStage(0);
    setHistory([]);
    setSelectedOption(null);
    setCoins(0);
    setFinalScore(0);
    setShowResult(false);
  };

  const subtitle =
    gameContent?.subtitleProgress
      ?.replace("{{current}}", Math.min(currentStage + 1, totalStages || 1))
      ?.replace("{{total}}", totalStages || 1) ||
    `Stage ${Math.min(currentStage + 1, totalStages || 1)} of ${totalStages || 1}`;
  const stage =
    stages.length > 0
      ? stages[Math.min(currentStage, stages.length - 1)]
      : null;
  const hasPassed = finalScore === successThreshold;

  return (
    <GameShell
      title="Earning Readiness Checkpoint"
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={EARNING_READINESS_STAGES.length}
      currentLevel={Math.min(currentStage + 1, EARNING_READINESS_STAGES.length)}
      totalLevels={EARNING_READINESS_STAGES.length}
      gameId={gameId}
      gameType="finance"
      showGameOver={showResult}
      showConfetti={showResult && hasPassed}
      shouldSubmitGameCompletion={hasPassed}
      flashPoints={flashPoints}
      showAnswerConfetti={showAnswerConfetti}
    >
      <div className="space-y-5 text-white">
        <div className="bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4 text-sm uppercase tracking-[0.3em] text-white/60">
            <span>Scenario</span>
            <span>Earning Readiness</span>
          </div>
          <p className="text-lg text-white/90 mb-6">{stage.prompt}</p>
          <div className="grid grid-cols-2 gap-4">
            {stage.options.map((option) => {
              const isSelected = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option)}
                  disabled={!!selectedOption}
                  className={`rounded-2xl border-2 p-5 text-left transition ${isSelected
                      ? option.isCorrect
                        ? "border-emerald-400 bg-emerald-500/20"
                        : "border-rose-400 bg-rose-500/10"
                      : "border-white/30 bg-white/5 hover:border-white/60 hover:bg-white/10"
                    }`}
                >
                  <div className="flex justify-between items-center mb-2 text-sm text-white/70">
                    <span>Choice {option.id.toUpperCase()}</span>
                  </div>
                  <p className="text-white font-semibold">{option.label}</p>
                </button>
              );
            })}
          </div>
          {(showResult || showFeedback) && (
            <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
              <h4 className="text-lg font-semibold text-white">Reflection</h4>
              {selectedReflection && (
                <div className="max-h-24 overflow-y-auto pr-2">
                  <p className="text-sm text-white/90">{selectedReflection}</p>
                </div>
              )}
              {showFeedback && !showResult && (
                <div className="mt-4 flex justify-center">
                  {canProceed ? (
                    <button
                      onClick={() => {
                        if (currentStage < totalStages - 1) {
                          setCurrentStage((prev) => prev + 1);
                          setSelectedOption(null);
                          setSelectedReflection(null);
                          setShowFeedback(false);
                          setCanProceed(false);
                        }
                      }}
                      className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-6 font-semibold shadow-lg hover:opacity-90"
                    >
                      Continue
                    </button>
                  ) : (
                    <div className="py-2 px-6 text-white font-semibold">Reading...</div>
                  )}
                </div>
              )}
              {/* Automatically advance if we're in the last stage and the timeout has passed */}
              {!showResult && currentStage === totalStages - 1 && canProceed && (
                <div className="mt-4 flex justify-center">
                  
                </div>
              )}
              {showResult && (
                <>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    {reflectionPrompts.map((prompt) => (
                      <li key={prompt}>{prompt}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-white/70">
                    Skill unlocked: <strong>Earning readiness strategy</strong>
                  </p>
                  {!hasPassed && (
                    <p className="text-xs text-amber-300">
                      Answer all {totalStages} choices correctly to earn the full reward.
                    </p>
                  )}
                  {!hasPassed && (
                    <button
                      onClick={handleRetry}
                      className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 font-semibold shadow-lg hover:opacity-90"
                    >
                      Try Again
                    </button>
                  )}
                </>
              )}
            </div>
          )}
          
        </div>
        {showResult && (
          <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
            <h4 className="text-lg font-semibold text-white">Reflection Prompts</h4>
            <ul className="text-sm list-disc list-inside space-y-1">
              {reflectionPrompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
            <p className="text-sm text-white/70">
              Skill unlocked: <strong>Earning readiness strategy</strong>
            </p>
            {!hasPassed && (
              <p className="text-xs text-amber-300">
                Answer all {totalStages} choices correctly to earn the full reward.
              </p>
            )}
            {!hasPassed && (
              <button
                onClick={handleRetry}
                className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 font-semibold shadow-lg hover:opacity-90"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default EarningReadinessCheckpoint;