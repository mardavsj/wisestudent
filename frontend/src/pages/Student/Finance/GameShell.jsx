import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import gameCompletionService from "../../../services/gameCompletionService";
import { getGameDataById } from "../../../utils/getGameData";
import { toast } from "react-toastify";
import { RefreshCw, X, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; //eslint-disable-line
import { useWallet } from "../../../context/WalletContext";
import api from "../../../utils/api";

/* --------------------- Floating Background Particles --------------------- */
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 30 }).map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20"
        style={{
          width: `${Math.random() * 6 + 2}px`,
          height: `${Math.random() * 6 + 2}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${Math.random() * 6 + 4}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 2}s`,
        }}
      />
    ))}
  </div>
);

export const ScoreFlash = ({ points }) => (
  <div
    className="fixed inset-0 flex items-center justify-center pointer-events-none"
    style={{ zIndex: 1000 }}
  >
    <div
      className="text-6xl md:text-[12rem] font-extrabold text-yellow-400"
      style={{
        animation: "score-flash 1s ease-out forwards",
      }}
    >
      +{points}
    </div>

    {/* Global keyframes for score flash */}
    <style>{`
      @keyframes score-flash {
        0% { opacity: 0; transform: scale(0.5); }
        30% { opacity: 1; transform: scale(1.2); }
        60% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(1.5); }
      }
    `}</style>
  </div>
);

/* --------------------- Confetti --------------------- */
export const Confetti = ({ duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            backgroundColor: `hsl(${Math.random() * 360},100%,70%)`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random(),
            animation: `confetti-fall ${Math.random() * 2 + 3}s linear infinite`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
};

/* --------------------- Level Complete Component with Instant Coins --------------------- */
export const LevelCompleteHandler = ({
  gameId,
  levelNumber,
  levelScore,
  maxLevelScore = 20,
  onComplete,
  children
}) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleLevelComplete = useCallback(async () => {
    if (hasSubmitted || !gameId) return;

    setHasSubmitted(true);

    try {
      const result = await gameCompletionService.completeLevel(gameId, {
        levelNumber,
        levelScore,
        maxLevelScore,
        coinsForLevel: 5 // Default coins per level
      });

      if (result.success && result.coinsEarned > 0) {
        toast.success(`🎯 Level ${levelNumber} complete! +${result.coinsEarned} HealCoins`);
      }

      if (onComplete) {
        onComplete(result);
      }
    } catch (error) {
      console.error('Failed to submit level completion:', error);
    }
  }, [hasSubmitted, gameId, levelNumber, levelScore, maxLevelScore, onComplete]);

  useEffect(() => {
    if (levelScore > 0 && !hasSubmitted) {
      handleLevelComplete();
    }
  }, [levelScore, hasSubmitted, handleLevelComplete]);

  return children;
};

/* --------------------- Game Card --------------------- */
export const GameCard = ({ children }) => (
  <div
    className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6 border border-white/20 shadow-2xl z-10 max-w-3xl mx-auto w-full"
    style={{ textAlign: "center" }}
  >
    {children}
  </div>
);

/* --------------------- Option Button --------------------- */
export const OptionButton = ({ option, onClick, selected, disabled, feedback }) => {
  const isCorrect = feedback?.type === "correct" && selected === option;
  const isWrong = feedback?.type === "wrong" && selected === option;

  return (
    <button
      onClick={() => !disabled && onClick(option)}
      disabled={disabled}
      style={{
        minWidth: "120px",
        padding: "12px 20px",
        borderRadius: "16px",
        backgroundColor: "rgba(255,255,255,0.2)",
        backdropFilter: "blur(8px)",
        border: `3px solid ${isCorrect ? "#4CAF50" : isWrong ? "#F44336" : "rgba(255,255,255,0.3)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.25s ease",
        boxShadow: selected ? "0 0 12px rgba(255,255,255,0.4)" : "0 4px 10px rgba(0,0,0,0.15)",
        transform: selected ? "scale(1.05)" : "scale(1)",
        opacity: disabled && !selected ? 0.6 : 1,
        fontSize: "clamp(14px, 2.5vw, 18px)",
        fontWeight: "bold",
        color: "white",
        textTransform: "capitalize",
      }}
    >
      {option.charAt(0).toUpperCase() + option.slice(1)}
    </button>
  );
};

/* --------------------- Feedback Bubble --------------------- */
export const FeedbackBubble = ({ message, type }) => (
  <div
    style={{
      backgroundColor: type === "correct" ? "#4CAF50" : "#F44336",
      color: "white",
      padding: "10px 18px",
      borderRadius: "25px",
      fontSize: "clamp(16px, 4vw, 24px)",
      fontWeight: "bold",
      marginTop: "18px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      animation: "pop-in 0.3s ease-out forwards",
      textAlign: "center",
    }}
  >
    {message}
  </div>
);

/* --------------------- Game Over Modal --------------------- */
export const GameOverModal = ({ score, gameId, gameType = 'ai', totalLevels = 1, maxScore = null, coinsPerLevel = null, totalCoins = null, totalXp = null, badgeName = null, badgeImage = null, isBadgeGame = false, isReplay = false, onClose, nextGamePath = null, nextGameId = null }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [badgeEarned, setBadgeEarned] = useState(false);
  const [badgeAlreadyEarned, setBadgeAlreadyEarned] = useState(false);
  const [resolvedBadgeName, setResolvedBadgeName] = useState(badgeName);
  const [resolvedBadgeImage, setResolvedBadgeImage] = useState(badgeImage);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [wasReplay, setWasReplay] = useState(false);
  const [allAnswersCorrect, setAllAnswersCorrect] = useState(false);
  const [showReplayUnlockModal, setShowReplayUnlockModal] = useState(false);
  const [replayUnlockTarget, setReplayUnlockTarget] = useState(null);
  const [isUnlockingReplay, setIsUnlockingReplay] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { wallet, refreshWallet, setWallet } = useWallet();
  const questionCount = totalLevels || location.state?.totalLevels || 5; // default to 5 questions if not provided
  const displayTotal = questionCount;
  const isFullCompletion = true; // Game over modal always represents a full completion attempt
  const isBadgeGameResolved = isBadgeGame === true || !!badgeName || !!badgeImage;
  const resolvedPointsPerCorrect =
    totalCoins && questionCount
      ? Math.max(1, Math.round(totalCoins / questionCount))
      : 1;
  const scoreAsCoins =
    totalCoins && questionCount
      ? score <= questionCount
        ? score * resolvedPointsPerCorrect
        : score
      : score;
  const normalizedCorrectCount =
    resolvedPointsPerCorrect > 0 && questionCount
      ? Math.min(
          questionCount,
          Math.max(0, Math.round((scoreAsCoins || 0) / resolvedPointsPerCorrect))
        )
      : score || 0;

  useEffect(() => {
    const submitGameCompletion = async () => {
      if (submissionComplete || !gameId) return;

      setIsSubmitting(true);
      try {
        const progress = await gameCompletionService.getGameProgress(gameId);

        // Check if this is a replay attempt
        // Only treat as replay if explicitly marked as replay OR if game is fully completed AND replay is unlocked
        const isReplayAttempt = isReplay === true || (progress?.fullyCompleted === true && progress?.replayUnlocked === true);

        // Always call the backend to save progress and let it determine coins
        // The backend will handle the logic for first completion vs replay
        // score represents coins performance (number of correct answers/coins earned)
        // maxScore is kept for backward compatibility but backend now uses totalCoins for comparison
        const resolvedMaxScore = maxScore || totalCoins || questionCount;
        // Scale performance to coin target so limited-question games still satisfy higher coin rewards
        const performanceTarget = totalCoins || questionCount || resolvedMaxScore || 0;
        const performanceScore =
          performanceTarget > 0 && questionCount > 0
            ? Math.min(performanceTarget, normalizedCorrectCount * resolvedPointsPerCorrect)
            : scoreAsCoins;
        const result = await gameCompletionService.completeGame({
          gameId,
          gameType,
          score: performanceScore, // scaled performance so all-correct meets the coin target
          maxScore: resolvedMaxScore, // Kept for backward compatibility
          levelsCompleted: totalLevels,
          totalLevels,
          timePlayed: 0,
          isFullCompletion: true,
          coinsPerLevel: coinsPerLevel, // Pass coins per question/level (for backward compatibility)
          totalCoins: totalCoins, // Total coins from game card
          totalXp: totalXp, // Total XP from game card
          badgeName: resolvedBadgeName,
          badgeImage: resolvedBadgeImage,
          isBadgeGame: isBadgeGameResolved,
          isReplay: isReplayAttempt // Pass replay flag - this is important!
        });

        if (result.success) {
          setCoinsEarned(result.coinsEarned || 0);
          setXpEarned(result.xpEarned || 0);
          setBadgeEarned(result.badgeEarned === true);
          setBadgeAlreadyEarned(result.badgeAlreadyEarned === true);
          setResolvedBadgeName(result.badgeName || resolvedBadgeName);
          setResolvedBadgeImage(result.badgeImage || resolvedBadgeImage);
          setWasReplay(result.isReplay === true);
          // Check allAnswersCorrect from result, or calculate from coins performance vs totalCoins
          // score represents coins performance (number of correct answers/coins earned)
          const calculatedAllCorrect = questionCount ? normalizedCorrectCount >= questionCount : (totalCoins ? performanceScore >= performanceTarget : false);
          setAllAnswersCorrect(result.allAnswersCorrect === true || calculatedAllCorrect);
          setSubmissionComplete(true);

          // Use fullyCompleted from result, default to true if not provided
          // IMPORTANT: If all answers are correct and it's a full completion, mark as fully completed
          // Also check if the game was already fully completed (from database)
          const fullyCompleted = result.fullyCompleted !== undefined
            ? result.fullyCompleted
            : (isFullCompletion && (result.allAnswersCorrect === true || calculatedAllCorrect));

          console.log('✅ Game completion result:', {
            gameId,
            isReplay: result.isReplay,
            replayUnlocked: result.replayUnlocked,
            coinsEarned: result.coinsEarned,
            allAnswersCorrect: result.allAnswersCorrect,
            fullyCompleted: fullyCompleted,
            resultFullyCompleted: result.fullyCompleted,
            isFullCompletion,
            score: scoreAsCoins,
            totalCoins,
          });

          // ALWAYS dispatch event if:
          // 1. Game is fully completed (from result), OR
          // 2. All answers are correct and it's a full completion
          // This ensures the games page updates correctly even if coins weren't awarded
          // CRITICAL: Dispatch even if game was already completed to ensure UI sync
          const shouldDispatchEvent = fullyCompleted || (isFullCompletion && (result.allAnswersCorrect === true || calculatedAllCorrect));

          if (shouldDispatchEvent) {
            console.log('📢 Dispatching gameCompleted event:', {
              gameId,
              fullyCompleted: true, // Always send true to ensure UI updates
              isReplay: result.isReplay === true,
              replayUnlocked: result.replayUnlocked === true,
              coinsEarned: result.coinsEarned,
              wasAlreadyCompleted: result.fullyCompleted === true && result.coinsEarned === 0
            });
            window.dispatchEvent(new CustomEvent('gameCompleted', {
              detail: {
                gameId,
                fullyCompleted: true, // Always send true if game should be marked as completed
                isReplay: result.isReplay === true,
                replayUnlocked: result.replayUnlocked === true
              }
            }));
            console.log('✅ gameCompleted event dispatched successfully');
          } else {
            console.log('⚠️ Game not fully completed, not dispatching event:', {
              gameId,
              fullyCompleted,
              allAnswersCorrect: result.allAnswersCorrect,
              calculatedAllCorrect,
              isFullCompletion
            });
          }

          // If it was a replay, also dispatch a specific replay event
          if (result.isReplay === true) {
            console.log('🎮 Dispatching gameReplayed event:', {
              gameId,
              replayUnlocked: result.replayUnlocked === true
            });
            window.dispatchEvent(new CustomEvent('gameReplayed', {
              detail: {
                gameId,
                replayUnlocked: result.replayUnlocked === true // Explicitly check for true
              }
            }));
          }
        }
      } catch (error) {
        console.error('Failed to submit game completion:', error);
        toast.error('Failed to save progress, but you can still replay!');
      } finally {
        setIsSubmitting(false);
      }
    };

    submitGameCompletion();
  }, [gameId, gameType, scoreAsCoins, normalizedCorrectCount, totalLevels, maxScore, coinsPerLevel, totalCoins, totalXp, isReplay, submissionComplete, isBadgeGameResolved, resolvedBadgeName, resolvedBadgeImage]);

  const showBadgeReward = isBadgeGameResolved && (badgeEarned || badgeAlreadyEarned);
  const getGameIndexFromId = (id) => {
    if (!id) return null;
    const parts = id.split("-");
    const parsed = parseInt(parts[parts.length - 1], 10);
    return Number.isNaN(parsed) ? null : parsed;
  };
  const getReplayCostForGameId = (id) => {
    const index = getGameIndexFromId(id);
    if (!index) return 2;
    if (index <= 25) return 2;
    if (index <= 50) return 4;
    if (index <= 75) return 6;
    return 8;
  };
  const openReplayUnlockModal = (id, path) => {
    const gameData = id ? getGameDataById(id) : null;
    setReplayUnlockTarget({
      id,
      path,
      title: gameData?.title || "this game",
    });
    setShowReplayUnlockModal(true);
  };
  const handleCancelReplayUnlock = () => {
    if (isUnlockingReplay) return;
    setShowReplayUnlockModal(false);
    setReplayUnlockTarget(null);
  };
  const handleUnlockReplay = async () => {
    if (!replayUnlockTarget?.id || isUnlockingReplay) return;
    const replayCost = getReplayCostForGameId(replayUnlockTarget.id);

    if (!wallet || wallet.balance < replayCost) {
      toast.error(
        `Insufficient balance! You need ${replayCost} HealCoins to unlock replay.`,
        {
          duration: 4000,
          position: "bottom-center",
        }
      );
      return;
    }

    setIsUnlockingReplay(true);
    try {
      const response = await api.post(`/api/game/unlock-replay/${replayUnlockTarget.id}`);
      if (response.data?.replayUnlocked) {
        const nextBalance = response.data.balance ?? response.data.newBalance;
        if (nextBalance !== undefined && setWallet) {
          setWallet((prev) => (prev ? { ...prev, balance: nextBalance } : { balance: nextBalance }));
        }
        if (refreshWallet) {
          refreshWallet();
        }
        toast.success(response.data.message || "Replay unlocked! Opening game...", {
          duration: 2000,
          position: "bottom-center",
        });
        const returnPath = location.state?.returnPath || "/games";
        navigate(replayUnlockTarget.path, {
          state: {
            returnPath: returnPath,
            coinsPerLevel: location.state?.coinsPerLevel || null,
            totalCoins: location.state?.totalCoins || null,
            totalXp: location.state?.totalXp || null,
            maxScore: location.state?.maxScore || null,
            isReplay: true,
          }
        });
      } else {
        toast.error("Failed to unlock replay. Please try again.", {
          duration: 4000,
          position: "bottom-center",
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || "Failed to unlock replay. Please try again.";
      toast.error(errorMessage, {
        duration: 5000,
        position: "bottom-center",
      });
    } finally {
      setIsUnlockingReplay(false);
      setShowReplayUnlockModal(false);
      setReplayUnlockTarget(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative bg-white rounded-3xl shadow-2xl p-8 z-10 text-center max-w-md w-full mx-4 animate-pop">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {allAnswersCorrect && submissionComplete ? '🎉 Congratulations!' : '👍 Great Try!'}
        </h2>
        <p className="text-gray-600 text-lg mb-4">
          You finished the game with{" "}
          <span className="font-bold text-gray-900">{normalizedCorrectCount}</span> out of{" "}
          <span className="font-bold text-gray-900">{displayTotal}</span> correct answers! ⭐
        </p>
        {allAnswersCorrect && submissionComplete && (
          <p className="text-green-600 font-semibold mb-4">
            Perfect! All answers correct! 🎊
          </p>
        )}
        {!allAnswersCorrect && submissionComplete && (
          <p className="text-orange-600 font-semibold mb-4">
            Try again to get all answers correct and earn rewards! 💪
          </p>
        )}

        {isSubmitting ? (
          <div className="mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600">Saving your progress...</p>
          </div>
        ) : (
          <div className="mb-6">
            {coinsEarned > 0 && (
              <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-4 mb-4">
                <h3 className="text-xl font-bold text-green-700 mb-2">💰 HealCoins Earned!</h3>
                <p className="text-3xl font-black text-green-600">+{coinsEarned}</p>
                {xpEarned > 0 && (
                  <p className="text-lg font-bold text-blue-600 mt-2">+{xpEarned} XP</p>
                )}
              </div>
            )}
            {coinsEarned === 0 && wasReplay && (
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-4 mb-4">
                <h3 className="text-xl font-bold text-gray-700 mb-2">💰 HealCoins Earned!</h3>
                <p className="text-3xl font-black text-gray-600">+{coinsEarned}</p>
                <p className="text-sm text-gray-600 mt-2">
                  You've already earned all coins for this game. This game is now locked.
                </p>
              </div>
            )}
            {coinsEarned === 0 && !wasReplay && submissionComplete && !allAnswersCorrect && (
              <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-4 mb-4">
                <h3 className="text-xl font-bold text-orange-700 mb-2">💰 HealCoins Earned!</h3>
                <p className="text-3xl font-black text-orange-600">+{coinsEarned}</p>
                <p className="text-sm text-orange-700 mt-2 font-semibold">
                  Answer all questions correctly to earn HealCoins and XP!
                </p>
              </div>
            )}
            {coinsEarned === 0 && !wasReplay && submissionComplete && allAnswersCorrect && (
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-4 mb-4">
                <h3 className="text-xl font-bold text-gray-700 mb-2">💰 HealCoins Earned!</h3>
                <p className="text-3xl font-black text-gray-600">+{coinsEarned}</p>
                <p className="text-sm text-yellow-600 mt-2">
                  No coins earned. Please try again or contact support if this persists.
                </p>
              </div>
            )}
            {showBadgeReward && (
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 mb-4">
                <h3 className="text-xl font-bold text-purple-700 mb-2">
                  {badgeEarned ? "Badge Earned!" : "Badge Already Received"}
                </h3>
                {resolvedBadgeImage ? (
                  <img
                    src={resolvedBadgeImage}
                    alt={resolvedBadgeName || "Badge"}
                    className="w-20 h-20 mx-auto mb-2 object-contain"
                  />
                ) : (
                  <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold">
                    Badge
                  </div>
                )}
                <p className="text-lg font-bold text-purple-600">
                  {resolvedBadgeName || "Badge"}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:opacity-90 transition cursor-pointer disabled:opacity-50"
          >
            Back
          </button>
          {/* Show Replay button if not all answers correct, Continue button if all correct */}
          {!allAnswersCorrect && submissionComplete ? (
            <button
              onClick={() => {
                // Reload the page to restart the game
                window.location.reload();
              }}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:opacity-90 transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Replay'}
            </button>
          ) : (
            <button
              onClick={async () => {
                // Get nextGamePath from prop or location.state
                const resolvedNextGamePath = nextGamePath || location.state?.nextGamePath;

                if (!resolvedNextGamePath) {
                  // No next game, just close (go back to game cards)
                  // Wait a moment to ensure game completion event has been dispatched and state updated
                  await new Promise(resolve => setTimeout(resolve, 300));
                  onClose();
                  return;
                }

                try {
                  // Get next game ID from prop or location.state (passed from GameCategoryPage)
                  const resolvedNextGameId = nextGameId || location.state?.nextGameId || null;

                  console.log('🎮 Continue button - Next game info:', {
                    resolvedNextGamePath,
                    resolvedNextGameId,
                    nextGamePath,
                    nextGameId,
                    locationState: location.state
                  });

                  // Wait a moment to ensure current game completion is saved
                  await new Promise(resolve => setTimeout(resolve, 500));

                  let nextGameProgress = null;
                  let isReplay = false;

                  // If we have the next game ID, check its status before navigating
                  if (resolvedNextGameId) {
                    // Check next game status
                    nextGameProgress = await gameCompletionService.getGameProgress(resolvedNextGameId);
                    console.log('🎮 Next game progress:', nextGameProgress);

                    // Check if next game is fully completed
                    if (nextGameProgress?.fullyCompleted) {
                      // Check if replay is unlocked
                      if (!nextGameProgress?.replayUnlocked) {
                        // Game is completed but replay not unlocked
                        openReplayUnlockModal(resolvedNextGameId, resolvedNextGamePath);
                        return;
                      }
                      // Replay is unlocked - allow navigation (will be treated as replay)
                      isReplay = true;
                    }
                    // Game is not completed or replay is unlocked - allow navigation
                  }

                  // Navigate to next game
                  const returnPath = location.state?.returnPath || '/games';
                  console.log('🎮 Navigating to next game:', resolvedNextGamePath);

                  navigate(resolvedNextGamePath, {
                    state: {
                      returnPath: returnPath,
                      coinsPerLevel: location.state?.coinsPerLevel || null,
                      totalCoins: location.state?.totalCoins || null,
                      totalXp: location.state?.totalXp || null,
                      maxScore: location.state?.maxScore || null,
                      isReplay: isReplay,
                    }
                  });
                } catch (error) {
                  console.error('Failed to check game status:', error);
                  // On error, allow navigation (fallback behavior)
                  const returnPath = location.state?.returnPath || '/games';
                  navigate(resolvedNextGamePath, {
                    state: {
                      returnPath: returnPath,
                      coinsPerLevel: location.state?.coinsPerLevel || null,
                      totalCoins: location.state?.totalCoins || null,
                      totalXp: location.state?.totalXp || null,
                      maxScore: location.state?.maxScore || null,
                    }
                  });
                }
              }}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:opacity-90 transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Continue'}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showReplayUnlockModal && replayUnlockTarget && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleCancelReplayUnlock}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Unlock Replay</h2>
                </div>
                <button
                  onClick={handleCancelReplayUnlock}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Unlock replay for <span className="font-semibold text-gray-900">"{replayUnlockTarget.title}"</span>?
                </p>

                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 mb-4 border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 font-medium">Cost:</span>
                    <span className="text-2xl font-bold text-amber-600">{getReplayCostForGameId(replayUnlockTarget.id)} HealCoins</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Your Balance:</span>
                    <span className="text-lg font-semibold text-gray-900">{wallet?.balance || 0} HealCoins</span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">Note:</span> You won't earn coins when replaying this game. The game will be locked again after you complete the replay.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancelReplayUnlock}
                  disabled={isUnlockingReplay}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUnlockReplay}
                  disabled={isUnlockingReplay}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUnlockingReplay ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>Unlock Replay</span>
                    </>
                  )}
                </button>
              </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Animations */}
      <style>{`
        .animate-pop {
          animation: pop-in 0.4s ease-out forwards;
        }
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

/* --------------------- Main GameShell --------------------- */
const GameShell = ({
  title,
  subtitle,
  rightSlot,
  children,
  showGameOver = false,
  score,
  gameId,
  gameType = 'ai',
  totalLevels = 1,
  coinsPerLevel = null, // Coins per question/level (from game card) - for backward compatibility
  totalCoins = null, // Total coins from game card for full completion
  totalXp = null, // Total XP from game card for full completion
  maxScore = null, // Maximum score for the game
  badgeName = null,
  badgeImage = null,
  isBadgeGame = false,
  // currentLevel = 1,
  showConfetti = false,
  flashPoints = null,
  showAnswerConfetti = false,
  backPath: backPathProp,
  nextGamePath: nextGamePathFromProp = null, // Optional next game path prop to override location.state
  nextGameId: nextGameIdFromProp = null, // Optional next game ID prop to override location.state
  nextGamePathProp = null, // Backward-compatible prop name
  nextGameIdProp = null, // Backward-compatible prop name
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [confettiKey, setConfettiKey] = useState(0);
  const prevShowConfettiRef = useRef(false);

  // Fallback to game data if navigation state is missing (e.g., deep link)
  const fallbackGameData = gameId ? getGameDataById(gameId) : null;
  const questionCount =
    totalLevels ||
    location.state?.totalLevels ||
    fallbackGameData?.totalLevels ||
    5; // default to 5 questions if not provided

  // Get totalCoins and totalXp from location.state if not provided as props
  const resolvedTotalCoins = (() => {
    const candidates = [
      totalCoins,
      location.state?.totalCoins,
      fallbackGameData?.coins,
    ].filter(v => v !== null && v !== undefined);
    if (candidates.length === 0) return null;
    return Math.max(...candidates);
  })();
  const resolvedTotalXp = (() => {
    const candidates = [
      totalXp,
      location.state?.totalXp,
      fallbackGameData?.xp,
    ].filter(v => v !== null && v !== undefined);
    if (candidates.length === 0) return null;
    return Math.max(...candidates);
  })();
  const resolvedBadgeName = (() => {
    const candidates = [
      badgeName,
      location.state?.badgeName,
      fallbackGameData?.badgeName,
    ].filter(v => v !== null && v !== undefined);
    return candidates.length > 0 ? candidates[0] : null;
  })();
  const resolvedBadgeImage = (() => {
    const candidates = [
      badgeImage,
      location.state?.badgeImage,
      fallbackGameData?.badgeImage,
    ].filter(v => v !== null && v !== undefined);
    return candidates.length > 0 ? candidates[0] : null;
  })();
  const resolvedIsBadgeGame = Boolean(
    isBadgeGame === true ||
    location.state?.isBadgeGame === true ||
    fallbackGameData?.isBadgeGame === true ||
    resolvedBadgeName ||
    resolvedBadgeImage
  );
  // Note: maxScore is kept for backward compatibility, but performance is now measured by coins
  // The score prop represents coins performance (number of correct answers/coins earned)
  const resolvedMaxScore = maxScore || location.state?.maxScore || resolvedTotalCoins || questionCount;
  const pointsPerCorrect =
    resolvedTotalCoins && questionCount
      ? Math.max(1, Math.round(resolvedTotalCoins / questionCount))
      : 1;

  // Normalize raw score into coin-equivalent (treat small scores as correct-counts)
  const rawScore = score || 0;
  const scoreAsCoins =
    resolvedTotalCoins && questionCount
      ? rawScore <= questionCount
        ? rawScore * pointsPerCorrect
        : rawScore
      : rawScore;

  // Normalize raw score into correct-answer count and coin display
  const displayCoins = Math.min(
    resolvedTotalCoins ?? Number.MAX_SAFE_INTEGER,
    scoreAsCoins
  );

  // Share points-per-correct globally for flash animations
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__flashPointsMultiplier = pointsPerCorrect;
      window.__flashTotalCoins = resolvedTotalCoins || null;
      window.__flashQuestionCount = questionCount;
      return () => {
        window.__flashPointsMultiplier = 1;
        window.__flashTotalCoins = null;
        window.__flashQuestionCount = null;
      };
    }
  }, [pointsPerCorrect]);

  // Track confetti trigger to remount component
  useEffect(() => {
    if (showConfetti && !prevShowConfettiRef.current) {
      setConfettiKey(prev => prev + 1);
    }
    prevShowConfettiRef.current = showConfetti;
  }, [showConfetti]);

  const resolvedBackPath = useMemo(() => {
    if (backPathProp) {
      return backPathProp;
    }

    if (location.state?.returnPath) {
      return location.state.returnPath;
    }

    const pathSegments = location.pathname.split("/").filter(Boolean);

    if (pathSegments[0] === "student" && pathSegments.length >= 3) {
      const categoryKey = pathSegments[1];
      const ageKey = pathSegments[2];

      const categorySlugMap = {
        finance: "financial-literacy",
        "financial-literacy": "financial-literacy",
        brain: "brain-health",
        "brain-health": "brain-health",
        uvls: "uvls",
        dcos: "digital-citizenship",
        "digital-citizenship": "digital-citizenship",
        "moral-values": "moral-values",
        "ai-for-all": "ai-for-all",
        entrepreneurship: "entrepreneurship",
        "entrepreneurship-higher-education": "entrepreneurship",
        civic: "civic-responsibility",
        "civic-responsibility": "civic-responsibility",
        sustainability: "sustainability",
      };

      const ageSlugMap = {
        kid: "kids",
        kids: "kids",
        teen: "teens",
        teens: "teens",
        adult: "adults",
        adults: "adults",
        "solar-and-city": "solar-and-city",
        "waste-and-recycle": "waste-and-recycle",
        "carbon-and-climate": "carbon-and-climate",
        "water-and-energy": "water-and-energy",
      };

      const mappedCategory = categorySlugMap[categoryKey] || categoryKey;
      const mappedAge = ageSlugMap[ageKey] || ageKey;

      return `/games/${mappedCategory}/${mappedAge}`;
    }

    return "/games";
  }, [backPathProp, location.pathname, location.state]);

  const handleGameOverClose = async () => {
    // Wait a moment to ensure game completion event has been dispatched and state updated
    // This ensures the game card shows as "played" instead of "active" when navigating back
    await new Promise(resolve => setTimeout(resolve, 300));
    navigate(resolvedBackPath);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <FloatingParticles />
      {flashPoints !== null && <ScoreFlash points={flashPoints} />}
      {showAnswerConfetti && <Confetti key={`answer-confetti-${showAnswerConfetti}`} duration={1000} />}
      {showConfetti && <Confetti key={`confetti-${confettiKey}`} />}

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 relative z-30">
        <button
          onClick={() => navigate(resolvedBackPath)}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full border border-white/20 backdrop-blur-md transition-all cursor-pointer"
        >
          ← Back
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">
            <span className="text-white font-medium">
              Coins: {displayCoins}
            </span>
          </div>

        </div>
        {rightSlot || <div />}
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-4 z-10 pt-8">
        {(title || subtitle) && (
          <div className="mb-8 relative z-20">
            {title && (
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent animate-title-glow mb-4 pb-2 leading-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-white/80 text-base md:text-lg mt-4 font-medium">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>

      {/* Next Level Button
      {onNext && (
        <div className="flex justify-center py-6 z-10">
          <button
            onClick={onNext}
            disabled={!nextEnabled}
            className={`rounded-full flex flex-col items-center justify-center font-bold text-white shadow-lg transition-all bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 animate-title-glow
              ${nextEnabled ? "cursor-pointer opacity-100" : "cursor-not-allowed opacity-50"}`}
            style={{
              width: "clamp(84px, 12vw, 120px)",
              height: "clamp(84px, 12vw, 120px)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
            }}
          >
            <span>{nextLabel.split(" ")[0]}</span>
            {nextLabel.split(" ")[1] && <span>{nextLabel.split(" ")[1]}</span>}
          </button>
        </div>
      )} */}

      {showGameOver && (
        <GameOverModal
          score={scoreAsCoins}
          gameId={gameId}
          gameType={gameType}
          totalLevels={totalLevels}
          maxScore={resolvedMaxScore}
          coinsPerLevel={coinsPerLevel}
          totalCoins={resolvedTotalCoins}
          totalXp={resolvedTotalXp}
          badgeName={resolvedBadgeName}
          badgeImage={resolvedBadgeImage}
          isBadgeGame={resolvedIsBadgeGame}
          isReplay={location?.state?.isReplay || false}
          onClose={handleGameOverClose}
          nextGamePath={
            nextGamePathFromProp ||
            nextGamePathProp ||
            location?.state?.nextGamePath ||
            null
          }
          nextGameId={
            nextGameIdFromProp ||
            nextGameIdProp ||
            location?.state?.nextGameId ||
            null
          }
        />
      )}

      {/* Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-title-glow {
          animation: title-glow 2s ease-in-out infinite;
        }
        @keyframes title-glow {
          0%,100% { filter: drop-shadow(0 0 10px rgba(255,255,255,0.3)); }
          50% { filter: drop-shadow(0 0 20px rgba(255,255,255,0.6)); }
        }
        @keyframes confetti-fall {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default GameShell;
