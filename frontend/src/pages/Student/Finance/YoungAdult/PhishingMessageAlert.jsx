import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const PHISHING_MESSAGE_STAGES = [
  {
    id: 1,
    prompt: "You receive a message saying “Your bank account will be blocked. Click here.” What should you do?",
    options: [
      {
        id: "a",
        label: "Click immediately",
        reflection: "Clicking immediately on urgent messages is exactly what scammers want you to do. They create panic to prevent you from thinking clearly and verifying the message.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Ignore and verify through official channels",
        reflection: "Exactly! Urgency is a common scam tactic. Always verify through official channels like calling your bank directly or visiting their official website.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Forward to friends for advice",
        reflection: "While getting advice from trusted friends can be helpful, forwarding suspicious messages might spread the scam to others who might not be as cautious.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Check the sender's email address",
        reflection: "Checking the sender's email address is a good first step, but scammers often fake email addresses to look legitimate. Official verification is still necessary.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 2,
    prompt: "What's a red flag in phishing messages?",
    options: [
      {
        id: "a",
        label: "Professional email formatting",
        reflection: "Professional formatting can actually be used by scammers to appear legitimate. Don't rely on appearance alone to determine if a message is safe.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Use of your full name",
        reflection: "Using your full name doesn't make a message legitimate. Scammers can easily obtain personal information to make their messages appear more convincing.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Urgent action required immediately",
        reflection: "Perfect! Creating a sense of urgency is one of the most common phishing tactics. Legitimate organizations rarely demand immediate action through email.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Official-looking logos",
        reflection: "Official logos can be easily copied and used by scammers. The presence of a logo doesn't guarantee the legitimacy of a message.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 3,
    prompt: "How should you verify a suspicious financial message?",
    options: [
      {
        id: "a",
        label: "Call the number in the email",
        reflection: "Calling the number provided in a suspicious email is risky because it might connect you to the scammer. Always use contact information from official sources.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Reply to the email asking for confirmation",
        reflection: "Replying to suspicious emails confirms to scammers that your email address is active and might lead to more targeted attacks or requests for personal information.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Search the message content online",
        reflection: "Searching the message content online might provide some information, but it's not a reliable verification method. Official channels are the safest way to verify.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Use official contact information",
        reflection: "Exactly! Always verify through official contact information found on the organization's official website or statements, not from the suspicious message itself.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
  {
    id: 4,
    prompt: "What should you do if you accidentally clicked a phishing link?",
    options: [
      {
        id: "a",
        label: "Change passwords and monitor accounts",
        reflection: "Perfect! Immediately change passwords for affected accounts and monitor your financial accounts for unauthorized activity. Report the incident to relevant authorities.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "Ignore it and hope nothing happens",
        reflection: "Ignoring a potential security breach can lead to serious consequences. Immediate action is necessary to protect your accounts and personal information.",
        isCorrect: false,
      },
      
      {
        id: "c",
        label: "Click the link again to undo the action",
        reflection: "Clicking the link again will likely make the situation worse by providing scammers with more information or access to your accounts.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Tell everyone about it on social media",
        reflection: "Publicly sharing information about a security incident might expose you to further risks or provide scammers with information about your response.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 5,
    prompt: "What's the best long-term protection against phishing?",
    options: [
      {
        id: "a",
        label: "Never open any emails",
        reflection: "Never opening emails would prevent you from receiving important information and is not a practical approach to email security.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Security awareness and verification habits",
        reflection: "Perfect! Building strong security awareness and consistently verifying suspicious messages through official channels is the most effective long-term protection against phishing.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Rely on email spam filters alone",
        reflection: "While spam filters are helpful, they're not foolproof. Scammers constantly develop new techniques to bypass filters, so personal vigilance is still essential.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Trust your instincts only",
        reflection: "While instincts can be helpful, they're not always reliable. Following established verification procedures is more dependable than relying solely on gut feelings.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
];

const PhishingMessageAlert = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-81";
  const gameContent = t(
    "financial-literacy.young-adult.phishing-message-alert",
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
      title={gameContent?.title || "Phishing Message Alert"}
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={totalStages || 0}
      currentLevel={Math.min(currentStage + 1, totalStages || 1)}
      totalLevels={totalStages || 1}
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
            <span>{gameContent?.scenarioLabel || "Scenario"}</span>
            <span>{gameContent?.scenarioValue || "Phishing Alert"}</span>
          </div>
          <p className="text-lg text-white/90 mb-6">{stage?.prompt}</p>
          <div className="grid grid-cols-2 gap-4">
            {(stage?.options || []).map((option) => {
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
                    <span>
                      {(gameContent?.choiceLabel || "Choice {{id}}").replace(
                        "{{id}}",
                        option.id.toUpperCase()
                      )}
                    </span>
                  </div>
                  <p className="text-white font-semibold">{option.label}</p>
                </button>
              );
            })}
          </div>
          {(showResult || showFeedback) && (
            <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
              <h4 className="text-lg font-semibold text-white">
                {gameContent?.reflectionTitle || "Reflection"}
              </h4>
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
                      {gameContent?.continueButton || "Continue"}
                    </button>
                  ) : (
                    <div className="py-2 px-6 text-white font-semibold">
                      {gameContent?.readingLabel || "Reading..."}
                    </div>
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
                    {gameContent?.skillUnlockedLabel || "Skill unlocked:"}{" "}
                    <strong>{gameContent?.skillName || "Phishing detection"}</strong>
                  </p>
                  {!hasPassed && (
                    <p className="text-xs text-amber-300">
                      {gameContent?.fullRewardHint
                        ? gameContent.fullRewardHint.replace(
                            "{{total}}",
                            totalStages
                          )
                        : `Answer all ${totalStages} choices correctly to earn the full reward.`}
                    </p>
                  )}
                  {!hasPassed && (
                    <button
                      onClick={handleRetry}
                      className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 font-semibold shadow-lg hover:opacity-90"
                    >
                      {gameContent?.tryAgainButton || "Try Again"}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
          
        </div>
        {showResult && (
          <div className="bg-white/5 border border-white/20 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-3">
            <h4 className="text-lg font-semibold text-white">
              {gameContent?.reflectionPromptsTitle || "Reflection Prompts"}
            </h4>
            <ul className="text-sm list-disc list-inside space-y-1">
              {reflectionPrompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
            <p className="text-sm text-white/70">
              {gameContent?.skillUnlockedLabel || "Skill unlocked:"}{" "}
              <strong>{gameContent?.skillName || "Phishing detection"}</strong>
            </p>
            {!hasPassed && (
              <p className="text-xs text-amber-300">
                {gameContent?.fullRewardHint
                  ? gameContent.fullRewardHint.replace("{{total}}", totalStages)
                  : `Answer all ${totalStages} choices correctly to earn the full reward.`}
              </p>
            )}
            {!hasPassed && (
              <button
                onClick={handleRetry}
                className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 font-semibold shadow-lg hover:opacity-90"
              >
                {gameContent?.tryAgainButton || "Try Again"}
              </button>
            )}
          </div>
        )}
      </div>
    </GameShell>
  );
};

export default PhishingMessageAlert;