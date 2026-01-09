import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import parentGameCompletionService from "../../../services/parentGameCompletionService";
import { getGameIndexFromId } from "../../../utils/parentGameUtils";
import { toast } from "react-toastify";
import { useWallet } from "../../../context/WalletContext";

/* --------------------- Parent Game Over Modal --------------------- */
export const ParentGameOverModal = ({
  score,
  gameId,
  gameType = 'parent-education',
  totalLevels = 5,
  totalCoins = null,
  isReplay = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calmCoinsEarned, setCalmCoinsEarned] = useState(0);
  const [allAnswersCorrect, setAllAnswersCorrect] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const gameIndex = useMemo(() => {
    return gameId ? getGameIndexFromId(gameId) : null;
  }, [gameId]);

  const resolvedTotalCoins = totalCoins || location.state?.totalCoins || 5;
  const normalizedScore = (() => {
    const rawScore = Number.isFinite(score) ? score : parseInt(score, 10) || 0;
    if (!totalLevels) return rawScore;
    if (rawScore <= totalLevels) return rawScore;
    const capped = Math.min(rawScore, 100);
    return Math.max(0, Math.min(totalLevels, Math.round((capped / 100) * totalLevels)));
  })();
  const allCorrect = normalizedScore === totalLevels;

  useEffect(() => {
    const submitGameCompletion = async () => {
      if (submissionComplete || !gameId) return;

      setIsSubmitting(true);
      try {
        // Only submit completion if ALL answers are correct
        const result = await parentGameCompletionService.completeGame({
          gameId,
          gameType,
          gameIndex,
          score: normalizedScore,
          totalLevels,
          totalCoins: resolvedTotalCoins,
          isReplay: isReplay || false,
          allAnswersCorrect: allCorrect // Pass flag indicating if all answers are correct
        });

        if (result.success) {
          setCalmCoinsEarned(result.calmCoinsEarned || 0);
          // Only mark as all correct if score equals totalLevels
          setAllAnswersCorrect(allCorrect);
          setSubmissionComplete(true);
        }
      } catch (error) {
        console.error('Failed to submit parent game completion:', error);
        toast.error('Failed to save progress, but you can still replay!');
      } finally {
        setIsSubmitting(false);
      }
    };

    submitGameCompletion();
  }, [gameId, gameType, gameIndex, normalizedScore, totalLevels, resolvedTotalCoins, isReplay, submissionComplete, allCorrect]);

  const resolvedBackPath = useMemo(() => {
    if (location.state?.returnPath) {
      return location.state.returnPath;
    }
    return "/parent/games/parent-education";
  }, [location.state]);

  const handleGameOverClose = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    navigate(resolvedBackPath);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative bg-white rounded-3xl shadow-2xl p-8 z-10 text-center max-w-md w-full mx-4 animate-pop">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {allAnswersCorrect && submissionComplete ? '🎉 Great Job!' : '👍 Good Try!'}
        </h2>
        <p className="text-gray-600 text-lg mb-4">
          You got <span className="font-bold text-gray-900">{normalizedScore}</span> out of{" "}
          <span className="font-bold text-gray-900">{totalLevels}</span> questions correct
        </p>
        {allAnswersCorrect && submissionComplete && (
          <p className="text-green-600 font-semibold mb-4">
            Perfect! All answers correct! 🎊
          </p>
        )}
        {!allAnswersCorrect && submissionComplete && (
          <p className="text-orange-600 font-semibold mb-4">
            Answer all {totalLevels} questions correctly to earn Healcoins! 💪
          </p>
        )}

        {isSubmitting ? (
          <div className="mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600">Saving your progress...</p>
          </div>
        ) : (
          <div className="mb-6">
            {calmCoinsEarned > 0 && (
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-4 mb-4">
                <h3 className="text-xl font-bold text-blue-700 mb-2">💰 Healcoins Earned!</h3>
                <p className="text-3xl font-black text-blue-600">+{calmCoinsEarned}</p>
              </div>
            )}
            {calmCoinsEarned === 0 && submissionComplete && !allAnswersCorrect && (
              <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-4 mb-4">
                <h3 className="text-xl font-bold text-orange-700 mb-2">💰 Healcoins Earned</h3>
                <p className="text-3xl font-black text-orange-600">+{calmCoinsEarned}</p>
                <p className="text-sm text-orange-700 mt-2 font-semibold">
                  Answer all questions correctly to earn Healcoins!
                </p>
              </div>
            )}
            {calmCoinsEarned === 0 && submissionComplete && allAnswersCorrect && (
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-4 mb-4">
                <h3 className="text-xl font-bold text-gray-700 mb-2">💰 Healcoins Earned</h3>
                <p className="text-3xl font-black text-gray-600">+{calmCoinsEarned}</p>
                <p className="text-sm text-gray-600 mt-2">
                  You've already earned all Healcoins for this game.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleGameOverClose}
            disabled={isSubmitting}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:opacity-90 transition cursor-pointer disabled:opacity-50"
          >
            Back
          </button>
          {!allAnswersCorrect && submissionComplete ? (
            <button
              onClick={() => {
                window.location.reload();
              }}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:opacity-90 transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Try Again'}
            </button>
          ) : null}
        </div>
      </div>

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

/* --------------------- Main ParentGameShell --------------------- */
const ParentGameShell = ({
  title,
  subtitle,
  children,
  showGameOver = false,
  score,
  gameId,
  gameType = 'parent-education',
  totalLevels = 5,
  totalCoins = null,
  backPath: backPathProp,
  currentQuestion = 0,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { wallet, refreshWallet } = useWallet();

  // Get totalCoins from location.state if not provided as props
  const resolvedTotalCoins = useMemo(() => {
    return totalCoins || location.state?.totalCoins || 5;
  }, [totalCoins, location.state]);

  // Listen for wallet updates
  useEffect(() => {
    const handleWalletUpdate = () => {
      if (refreshWallet) {
        refreshWallet();
      }
    };
    window.addEventListener('wallet:updated', handleWalletUpdate);
    return () => {
      window.removeEventListener('wallet:updated', handleWalletUpdate);
    };
  }, [refreshWallet]);

  const resolvedBackPath = useMemo(() => {
    if (backPathProp) {
      return backPathProp;
    }
    if (location.state?.returnPath) {
      return location.state.returnPath;
    }
    return "/parent/games/parent-education";
  }, [backPathProp, location.state]);

  const handleGameOverClose = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    navigate(resolvedBackPath);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col relative overflow-hidden">
      {/* Professional Background - Subtle patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 relative z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <button
          onClick={() => navigate(resolvedBackPath)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 transition-all cursor-pointer font-medium"
        >
          ← Back
        </button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-blue-50 backdrop-blur-md px-4 py-2 rounded-lg border border-blue-200">
            <span className="text-blue-700 font-semibold">
              Healcoins: {wallet?.balance || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      {totalLevels > 1 && (
        <div className="px-6 py-3 bg-white/60 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Question {currentQuestion + 1} of {totalLevels}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {Math.round(((currentQuestion + 1) / totalLevels) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / totalLevels) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-4 z-10 pt-8">
        {(title || subtitle) && (
          <div className="mb-8 relative z-20">
            {title && (
              <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 pb-2 leading-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-gray-600 text-base md:text-lg mt-4 font-medium">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>

      {showGameOver && (
        <ParentGameOverModal
          score={score}
          gameId={gameId}
          gameType={gameType}
          totalLevels={totalLevels}
          totalCoins={resolvedTotalCoins}
          isReplay={location?.state?.isReplay || false}
          onClose={handleGameOverClose}
        />
      )}
    </div>
  );
};

export default ParentGameShell;

