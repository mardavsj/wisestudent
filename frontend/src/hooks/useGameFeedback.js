import { useState } from 'react';

/**
 * Custom hook for managing game feedback animations (score flash and confetti)
 * @returns {Object} - Object containing state and helper functions
 */
export const useGameFeedback = () => {
  const [flashPoints, setFlashPoints] = useState(null);
  const [showAnswerConfetti, setShowAnswerConfetti] = useState(false);

  /**
   * Show score flash and confetti for correct answers
  * @param {number} points - Number of points to display
  * @param {boolean} withConfetti - Whether to show confetti
  */
  const showCorrectAnswerFeedback = (points = 1, withConfetti = true) => {
    const totalCoins =
      typeof window !== "undefined" && window.__flashTotalCoins
        ? window.__flashTotalCoins
        : null;
    const questionCount =
      typeof window !== "undefined" && window.__flashQuestionCount
        ? window.__flashQuestionCount
        : null;
    const multiplier =
      typeof window !== "undefined" && window.__flashPointsMultiplier
        ? window.__flashPointsMultiplier
        : totalCoins && questionCount
        ? Math.max(1, Math.round(totalCoins / questionCount))
        : 1;

    // Normalize points: many puzzles send totalCoins; we want per-question coins
    let displayPoints;
    if (totalCoins && points >= totalCoins) {
      // Treat as single-correct worth multiplier
      displayPoints = multiplier;
    } else if (questionCount && points <= questionCount) {
      // Points are likely correct answers count
      displayPoints = points * multiplier;
    } else {
      // Fallback: scale by multiplier
      displayPoints = Math.round(points * multiplier);
    }

    // Cap to totalCoins if provided
    if (totalCoins) {
      displayPoints = Math.min(displayPoints, totalCoins);
    }

    setFlashPoints(displayPoints);
    if (withConfetti) {
      setShowAnswerConfetti(true);
    }

    // Auto-hide after animation
    setTimeout(() => {
      setFlashPoints(null);
      if (withConfetti) {
        setShowAnswerConfetti(false);
      }
    }, 1000);
  };

  /**
   * Reset all feedback states
   */
  const resetFeedback = () => {
    setFlashPoints(null);
    setShowAnswerConfetti(false);
  };

  return {
    // State values
    flashPoints,
    showAnswerConfetti,
    
    // Helper functions
    showCorrectAnswerFeedback,
    resetFeedback
  };
};

export default useGameFeedback;
