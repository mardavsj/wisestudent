import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Trophy } from "lucide-react";
import GameShell from "../GameShell";
import useGameFeedback from "../../../../hooks/useGameFeedback";
import { getGameDataById } from "../../../../utils/getGameData";

const OTP_SHARING_TRAP_STAGES = [
  {
    id: 1,
    prompt: "Someone posing as support asks for your OTP. What should you do?",
    options: [
      {
        id: "a",
        label: "Share to resolve quickly",
        reflection: "Sharing your OTP immediately, even with someone claiming to be support, gives them complete access to your account. This is exactly what scammers want to steal your money or personal information.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Never share OTPs",
        reflection: "Exactly! OTPs are one-time passwords designed to protect your accounts. Legitimate support will never ask for your OTP. Sharing it compromises your account security immediately.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Share only if they verify their identity first",
        reflection: "Even if someone appears to verify their identity, scammers can easily fake credentials and verification processes. The safest approach is to never share OTPs under any circumstances.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Ask for their OTP instead",
        reflection: "Asking for their OTP doesn't solve the security issue and might expose you to further manipulation. The fundamental rule is that you should never share your OTP with anyone, regardless of their request.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 2,
    prompt: "What's the primary purpose of an OTP?",
    options: [
      {
        id: "a",
        label: "To protect accounts from misuse",
        reflection: "Perfect! OTPs are one-time passwords designed specifically to protect your accounts from unauthorized access and misuse. They add an extra layer of security that only you should have access to.",
        isCorrect: true,
      },
      {
        id: "b",
        label: "To verify your identity for support",
        reflection: "While OTPs do verify identity, their primary purpose is to protect your account from unauthorized access. They're a security measure, not a tool for customer support verification.",
        isCorrect: false,
      },
      
      {
        id: "c",
        label: "To speed up login processes",
        reflection: "While OTPs can make login processes more secure, speed is not their primary purpose. Security is the main goal, even if it sometimes adds an extra step to the login process.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "To track user activity",
        reflection: "OTP systems are designed for security, not tracking user activity. While they do create a log of authentication attempts, this is for security purposes, not general user tracking.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 3,
    prompt: "How should you handle OTP requests from unexpected sources?",
    options: [
      {
        id: "a",
        label: "Provide it if they seem legitimate",
        reflection: "Scammers can appear very legitimate and professional. Don't rely on appearances alone. The rule is simple: never share your OTP, regardless of who is asking or how legitimate they seem.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Share it but change passwords afterward",
        reflection: "Changing passwords after sharing your OTP is too late - the damage is already done. Once someone has your OTP, they can access your account and potentially change passwords themselves, locking you out.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Ignore all OTP requests completely",
        reflection: "While you should be cautious, legitimate services do send OTPs for valid transactions. The key is to verify the source and purpose through official channels, not ignore all requests entirely.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Verify through official channels first",
        reflection: "Exactly! If you receive an unexpected OTP request, always verify through official channels like calling the bank's official customer service number or visiting their official website to confirm the request.",
        isCorrect: true,
      },
    ],
    reward: 20,
  },
  {
    id: 4,
    prompt: "What should you do if you suspect OTP fraud?",
    options: [
      {
        id: "a",
        label: "Wait and see if anything happens",
        reflection: "Waiting to see if fraud occurs is risky. If you suspect OTP fraud, immediate action is necessary to protect your accounts and minimize potential damage from unauthorized access.",
        isCorrect: false,
      },
      
      {
        id: "b",
        label: "Share the OTP with your family for advice",
        reflection: "Sharing the OTP with family members, while well-intentioned, doesn't address the security breach and might expose them to the same risks if the OTP is still active or if accounts are compromised.",
        isCorrect: false,
      },
      {
        id: "c",
        label: "Change passwords and contact support immediately",
        reflection: "Perfect! If you suspect OTP fraud, immediately change your passwords for affected accounts and contact official support through verified channels to report the incident and secure your accounts.",
        isCorrect: true,
      },
      {
        id: "d",
        label: "Block the sender's number only",
        reflection: "Blocking a number is helpful but insufficient. If fraud is suspected, you need to secure your accounts through password changes and official support channels, as the damage may already be done.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
  {
    id: 5,
    prompt: "Which is a common OTP scam tactic?",
    options: [
      {
        id: "a",
        label: "Sending OTPs at convenient times",
        reflection: "Sending OTPs at convenient times would actually improve user experience. Scammers typically create urgency or send OTPs at unexpected times to catch users off-guard.",
        isCorrect: false,
      },
      {
        id: "b",
        label: "Pretending to be from trusted institutions",
        reflection: "Exactly! Scammers commonly pretend to be from banks, government agencies, or well-known companies to gain trust and convince you to share your OTP. Always verify through official channels independently.",
        isCorrect: true,
      },
      {
        id: "c",
        label: "Using complex password requirements",
        reflection: "Complex password requirements are actually a security feature, not a scam tactic. Scammers typically simplify processes or create fake urgency rather than implement stronger security measures.",
        isCorrect: false,
      },
      {
        id: "d",
        label: "Providing detailed transaction information",
        reflection: "Providing detailed transaction information can actually help users verify legitimacy. Scammers usually provide minimal or fake information to avoid scrutiny and create confusion.",
        isCorrect: false,
      },
    ],
    reward: 20,
  },
];

const OTPSharingTrap = () => {
  const location = useLocation();
  const { t } = useTranslation("gamecontent");
  const gameId = "finance-young-adult-83";
  const gameContent = t(
    "financial-literacy.young-adult.otp-sharing-trap",
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
      title="OTP Sharing Trap"
      subtitle={subtitle}
      score={showResult ? finalScore : coins}
      coins={coins}
      coinsPerLevel={coinsPerLevel}
      totalCoins={totalCoins}
      totalXp={totalXp}
      maxScore={OTP_SHARING_TRAP_STAGES.length}
      currentLevel={Math.min(currentStage + 1, OTP_SHARING_TRAP_STAGES.length)}
      totalLevels={OTP_SHARING_TRAP_STAGES.length}
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
            <span>OTP Sharing Trap</span>
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
                    Skill unlocked: <strong>OTP protection</strong>
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
              Skill unlocked: <strong>OTP protection</strong>
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

export default OTPSharingTrap;