import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Lock, Play, RefreshCw, Trophy, Clock, Gamepad2, Sparkles, Brain, Heart, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../../hooks/useAuth";
import { useWallet } from "../../../context/WalletContext";
import { toast } from "react-hot-toast";
import { getAllTeacherEducationGames } from "./TeacherEducation/data/gameData";
import { getReplayCostForGame, getGameIndexFromId } from "../../../utils/teacherGameUtils";
import teacherGameCompletionService from "../../../services/teacherGameCompletionService";

const TeacherGameCategoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { wallet, refreshWallet } = useWallet();
  const { category } = useParams();
  
  const [games, setGames] = useState([]);
  const [gameCompletionStatus, setGameCompletionStatus] = useState({});
  const [gameProgressData, setGameProgressData] = useState({});
  const [processingReplay, setProcessingReplay] = useState(false);
  const [showReplayConfirmModal, setShowReplayConfirmModal] = useState(false);
  const [selectedGameForReplay, setSelectedGameForReplay] = useState(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  // Load game completion status
  const loadGameCompletionStatus = useCallback(async () => {
    if (!user?._id) return;

    try {
      setIsLoadingProgress(true);
      
      // Get all teacher education games
      const allGames = getAllTeacherEducationGames();
      const gameIds = allGames.map(game => game.id);

      // Fetch progress for all games
      const progressPromises = gameIds.map(gameId =>
        teacherGameCompletionService.getGameProgress(gameId).catch(() => null)
      );

      const progressResults = await Promise.all(progressPromises);
      
      const status = {};
      const progress = {};

      progressResults.forEach((result, index) => {
        if (result) {
          const gameId = gameIds[index];
          status[gameId] = result.fullyCompleted === true;
          progress[gameId] = result;
        }
      });

      setGameCompletionStatus(status);
      setGameProgressData(progress);
    } catch (error) {
      console.error('Failed to load game completion status:', error);
    } finally {
      setIsLoadingProgress(false);
    }
  }, [user]);

  useEffect(() => {
    // Support both old 'teacher-education' and new 'mental-health-emotional-regulation' slugs
    if (category === 'teacher-education' || category === 'mental-health-emotional-regulation') {
      const allGames = getAllTeacherEducationGames();
      setGames(allGames);
      loadGameCompletionStatus();
    }
  }, [category, loadGameCompletionStatus]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showReplayConfirmModal) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scroll position when modal closes
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [showReplayConfirmModal]);

  // Listen for game completion events
  useEffect(() => {
    const handleGameCompleted = (event) => {
      const { gameId, fullyCompleted } = event?.detail || {};
      // Only update status if fullyCompleted is true (all answers correct)
      if (gameId && fullyCompleted === true) {
        setGameCompletionStatus(prev => ({
          ...prev,
          [gameId]: true
        }));
        loadGameCompletionStatus();
        if (refreshWallet) {
          refreshWallet();
        }
      } else if (gameId) {
        // If game was played but not fully completed, ensure it's marked as not completed
        // This allows the game to remain playable without unlock button
        setGameCompletionStatus(prev => ({
          ...prev,
          [gameId]: false
        }));
        loadGameCompletionStatus();
      }
    };

    window.addEventListener('teacherGameCompleted', handleGameCompleted);
    return () => {
      window.removeEventListener('teacherGameCompleted', handleGameCompleted);
    };
  }, [loadGameCompletionStatus, refreshWallet]);

  const handleGameClick = async (game) => {
    // Special handling for badge games
    const isSelfAwareBadge = game.id === 'teacher-education-10';
    const isCalmBadge = game.id === 'teacher-education-20';
    const isCompassionBalanceBadge = game.id === 'teacher-education-30';
    const isBalancedLifeBadge = game.id === 'teacher-education-40';
    const isMindfulMasteryBadge = game.id === 'teacher-education-50';
    const isResilientEducatorBadge = game.id === 'teacher-education-60';
    const isClearCommunicatorBadge = game.id === 'teacher-education-70';
    const isConnectedTeacherBadge = game.id === 'teacher-education-80';
    const isPurposefulTeacherBadge = game.id === 'teacher-education-90';
    const isSelfCareChampionBadge = game.id === 'teacher-education-100';
    const isBadgeGame = isSelfAwareBadge || isCalmBadge || isCompassionBalanceBadge || isBalancedLifeBadge || isMindfulMasteryBadge || isResilientEducatorBadge || isClearCommunicatorBadge || isConnectedTeacherBadge || isPurposefulTeacherBadge || isSelfCareChampionBadge;
    
    if (isSelfAwareBadge) {
      // Check if all 5 required games are completed for Self-Aware Badge
      const requiredGameIds = [
        'teacher-education-1',  // Name Your Feeling
        'teacher-education-6',  // Inner Voice Check
        'teacher-education-7',  // Emotion Journal
        'teacher-education-8',  // Mirror Moment Simulation
        'teacher-education-9'   // Emotion Reflex
      ];
      
      const allCompleted = requiredGameIds.every(id => gameCompletionStatus[id] === true);
      
      if (!allCompleted) {
        toast.error('Complete all 5 self-awareness tasks first to unlock this badge!');
        return;
      }
    } else if (isCalmBadge) {
      // Check if all 5 required games are completed for Calm Badge
      const requiredGameIds = [
        'teacher-education-13',  // Quick Calm Reflex
        'teacher-education-14',  // Breathe with Rhythm
        'teacher-education-17',  // Workload Journal
        'teacher-education-18',  // Pause Practice Simulation
        'teacher-education-19'   // Stress Release Body Scan
      ];
      
      const allCompleted = requiredGameIds.every(id => gameCompletionStatus[id] === true);
      
      if (!allCompleted) {
        toast.error('Complete all 5 calming activities first to unlock this badge!');
        return;
      }
    } else if (isCompassionBalanceBadge) {
      // Check if all 5 required games are completed for Compassion Balance Badge
      const requiredGameIds = [
        'teacher-education-21',  // Understanding Compassion Fatigue
        'teacher-education-22',  // Empathy vs Overload Quiz
        'teacher-education-23',  // Emotional Boundary Builder
        'teacher-education-24',  // Energy Drain Tracker
        'teacher-education-25'   // Refill Rituals
      ];
      
      const allCompleted = requiredGameIds.every(id => gameCompletionStatus[id] === true);
      
      if (!allCompleted) {
        toast.error('Complete all 5 empathy balance tasks first to unlock this badge!');
        return;
      }
    } else if (isBalancedLifeBadge) {
      // Check if all 5 required games are completed for Balanced Life Badge
      const requiredGameIds = [
        'teacher-education-35',  // Weekend Recharge Plan
        'teacher-education-36',  // The "No" Practice
        'teacher-education-37',  // Work–Life Tracker Journal
        'teacher-education-38',  // Family Connection Challenge
        'teacher-education-39'   // Digital Shutdown Simulation
      ];
      
      const allCompleted = requiredGameIds.every(id => gameCompletionStatus[id] === true);
      
      if (!allCompleted) {
        toast.error('Complete all 5 balance activities first to unlock this badge!');
        return;
      }
    } else if (isMindfulMasteryBadge) {
      // Check if all 5 required games are completed for Mindful Mastery Badge
      const requiredGameIds = [
        'teacher-education-41',  // Present Moment Awareness
        'teacher-education-42',  // One-Minute Pause
        'teacher-education-43',  // Focus Anchor Exercise
        'teacher-education-45',  // Guided Meditation Audio
        'teacher-education-49'   // Gratitude in the Moment
      ];
      
      const allCompleted = requiredGameIds.every(id => gameCompletionStatus[id] === true);
      
      if (!allCompleted) {
        toast.error('Complete all 5 mindfulness activities first to unlock this badge!');
        return;
      }
    } else if (isResilientEducatorBadge) {
      // Check if all 5 required games are completed for Resilient Educator Badge
      const requiredGameIds = [
        'teacher-education-51',  // The Bounce-Back Quiz
        'teacher-education-52',  // Growth Mindset Puzzle
        'teacher-education-53',  // Tough Day Simulation
        'teacher-education-56',  // Challenge Journal
        'teacher-education-59'   // Gratitude Ladder
      ];
      
      const allCompleted = requiredGameIds.every(id => gameCompletionStatus[id] === true);
      
      if (!allCompleted) {
        toast.error('Complete all 5 resilience activities first to unlock this badge!');
        return;
      }
    } else if (isClearCommunicatorBadge) {
      // Check if all 5 required games are completed for Clear Communicator Badge
      const requiredGameIds = [
        'teacher-education-60',  // The Respectful "No"
        'teacher-education-61',  // Active Listening Quiz
        'teacher-education-68',  // Empathetic Dialogue Roleplay
        'teacher-education-66',  // Communication Mirror
        'teacher-education-69'   // Communication Reflex
      ];
      
      const allCompleted = requiredGameIds.every(id => gameCompletionStatus[id] === true);
      
      if (!allCompleted) {
        toast.error('Complete all 5 communication activities first to unlock this badge!');
        return;
      }
    } else if (isConnectedTeacherBadge) {
      // Check if all 5 required games are completed for Connected Teacher Badge
      const requiredGameIds = [
        'teacher-education-71',  // The Support Circle
        'teacher-education-74',  // Team Gratitude Wall
        'teacher-education-76',  // Encourage-a-Colleague Challenge
        'teacher-education-78',  // Staffroom Connection Map
        'teacher-education-79'   // Team Harmony Simulation
      ];
      
      const allCompleted = requiredGameIds.every(id => gameCompletionStatus[id] === true);
      
      if (!allCompleted) {
        toast.error('Complete all 5 support-oriented games first to unlock this badge!');
        return;
      }
    } else if (isPurposefulTeacherBadge) {
      // Check if all 5 required games are completed for Purposeful Teacher Badge
      const requiredGameIds = [
        'teacher-education-81',  // Why I Teach
        'teacher-education-85',  // Meaning in the Moment
        'teacher-education-86',  // Fulfillment Journal
        'teacher-education-87',  // Impact Visualization
        'teacher-education-82'   // The Ripple Effect
      ];
      
      const allCompleted = requiredGameIds.every(id => gameCompletionStatus[id] === true);
      
      if (!allCompleted) {
        toast.error('Complete all 5 purpose-related activities first to unlock this badge!');
        return;
      }
    } else if (isSelfCareChampionBadge) {
      // Check if all 5 required games are completed for Self-Care Champion Badge
      const requiredGameIds = [
        'teacher-education-93',  // Evening Log-Off Ritual
        'teacher-education-95',  // Morning Nourish Routine
        'teacher-education-96',  // Nature Reconnect Challenge
        'teacher-education-91',  // Screen-Time Mirror
        'teacher-education-99'   // Silence & Stillness Practice
      ];
      
      const allCompleted = requiredGameIds.every(id => gameCompletionStatus[id] === true);
      
      if (!allCompleted) {
        toast.error('Complete all 5 self-care activities first to unlock this badge!');
        return;
      }
    }
    
    // Check sequential unlocking for regular games (not badge games)
    if (!isBadgeGame && game.gameIndex > 1) {
      const previousGameId = `teacher-education-${game.gameIndex - 1}`;
      const previousGameCompleted = gameCompletionStatus[previousGameId] === true;
      
      if (!previousGameCompleted) {
        const previousGame = games.find(g => g.id === previousGameId);
        toast.error(`Complete "${previousGame?.title || 'the previous game'}" first to unlock this game!`);
        return;
      }
    }

    const gameIndex = getGameIndexFromId(game.id);
    const replayCost = getReplayCostForGame(gameIndex);
    const progress = gameProgressData[game.id];
    const isFullyCompleted = gameCompletionStatus[game.id] === true;
    const canReplay = isFullyCompleted && progress?.replayUnlocked === true;

    // Check if game needs replay unlock
    if (isFullyCompleted && !canReplay) {
      toast.error(
        `This game is locked. Unlock replay for ${replayCost} Healcoins to play again.`,
        {
          duration: 4000,
          position: "bottom-center",
          icon: "🔒",
        }
      );
      return;
    }

    // Navigate to game using slug for cleaner URL
    const gameSlug = game.slug || game.id; // Fallback to ID if slug not available
    navigate(`/school-teacher/games/${category}/${gameSlug}`, {
      state: {
        returnPath: `/school-teacher/games/${category}`,
        totalCoins: game.calmCoins,
        gameIndex: game.gameIndex,
        isReplay: canReplay
      }
    });
  };

  const handleUnlockReplayClick = (game, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (processingReplay) {
      return;
    }

    // Always open the modal - balance check will be done in the modal
    setSelectedGameForReplay(game);
    setShowReplayConfirmModal(true);
  };

  const handleUnlockReplay = async () => {
    if (!selectedGameForReplay) return;

    const game = selectedGameForReplay;
    const gameIndex = getGameIndexFromId(game.id);
    const replayCost = getReplayCostForGame(gameIndex);

    // Check wallet balance before proceeding
    if (!wallet || wallet.balance < replayCost) {
      toast.error(
        `Insufficient balance! You need ${replayCost} Healcoins to unlock replay.`,
        {
          duration: 4000,
          position: "bottom-center",
          icon: "💰",
        }
      );
      return;
    }

    setProcessingReplay(true);

    try {
      const result = await teacherGameCompletionService.unlockReplay(game.id, gameIndex);

      if (result.success) {
        // Update progress data
        setGameProgressData(prev => ({
          ...prev,
          [game.id]: {
            ...prev[game.id],
            replayUnlocked: true
          }
        }));

        // Refresh wallet
        if (refreshWallet) {
          refreshWallet();
        }

        // Close modal
        setShowReplayConfirmModal(false);
        setSelectedGameForReplay(null);

        // Navigate directly to the game using slug for cleaner URL
        const gameSlug = game.slug || game.id; // Fallback to ID if slug not available
        navigate(`/school-teacher/games/${category}/${gameSlug}`, {
          state: {
            returnPath: `/school-teacher/games/${category}`,
            totalCoins: game.calmCoins,
            gameIndex: game.gameIndex,
            isReplay: true
          }
        });
      }
    } catch (error) {
      console.error('Failed to unlock replay:', error);
      const errorMessage = error.response?.data?.error || 'Failed to unlock replay. Please try again.';
      toast.error(errorMessage, {
        duration: 4000,
        position: "bottom-center",
        icon: "❌",
      });
      // Keep modal open on error so user can try again
    } finally {
      setProcessingReplay(false);
    }
  };

  const getGameStatus = (game) => {
    // Special handling for badge games
    const isSelfAwareBadge = game.id === 'teacher-education-10';
    const isCalmBadge = game.id === 'teacher-education-20';
    const isCompassionBalanceBadge = game.id === 'teacher-education-30';
    const isBalancedLifeBadge = game.id === 'teacher-education-40';
    const isMindfulMasteryBadge = game.id === 'teacher-education-50';
    const isResilientEducatorBadge = game.id === 'teacher-education-60';
    const isClearCommunicatorBadge = game.id === 'teacher-education-70';
    const isConnectedTeacherBadge = game.id === 'teacher-education-80';
    const isPurposefulTeacherBadge = game.id === 'teacher-education-90';
    const isSelfCareChampionBadge = game.id === 'teacher-education-100';
    const isBadgeGame = isSelfAwareBadge || isCalmBadge || isCompassionBalanceBadge || isBalancedLifeBadge || isMindfulMasteryBadge || isResilientEducatorBadge || isClearCommunicatorBadge || isConnectedTeacherBadge || isPurposefulTeacherBadge || isSelfCareChampionBadge;
    
    if (isSelfAwareBadge) {
      // Check if all required games are completed for Self-Aware Badge
      const requiredGameIds = [
        'teacher-education-1',  // Name Your Feeling
        'teacher-education-6',  // Inner Voice Check
        'teacher-education-7',  // Emotion Journal
        'teacher-education-8',  // Mirror Moment Simulation
        'teacher-education-9'   // Emotion Reflex
      ];
      
      const allRequiredCompleted = requiredGameIds.every(id => gameCompletionStatus[id] === true);
      const badgeCollected = gameCompletionStatus[game.id] === true;
      
      return {
        isCompleted: badgeCollected,
        hasProgress: badgeCollected,
        canReplay: false, // Badge games don't have replay
        needsReplayUnlock: false,
        isLocked: !allRequiredCompleted,
        isSequentiallyLocked: false, // Badge games are not sequentially locked
        isBadgeGame: true
      };
    } else if (isCalmBadge) {
      // Check if all required games are completed for Calm Badge
      const requiredGameIds = [
        'teacher-education-13',  // Quick Calm Reflex
        'teacher-education-14',  // Breathe with Rhythm
        'teacher-education-17',  // Workload Journal
        'teacher-education-18',  // Pause Practice Simulation
        'teacher-education-19'   // Stress Release Body Scan
      ];
      
      const allRequiredCompleted = requiredGameIds.every(id => gameCompletionStatus[id] === true);
      const badgeCollected = gameCompletionStatus[game.id] === true;
      
      return {
        isCompleted: badgeCollected,
        hasProgress: badgeCollected,
        canReplay: false, // Badge games don't have replay
        needsReplayUnlock: false,
        isLocked: !allRequiredCompleted,
        isSequentiallyLocked: false, // Badge games are not sequentially locked
        isBadgeGame: true
      };
    } else if (isCompassionBalanceBadge) {
      // Check if all required games are completed for Compassion Balance Badge
      const requiredGameIds = [
        'teacher-education-21',  // Understanding Compassion Fatigue
        'teacher-education-22',  // Empathy vs Overload Quiz
        'teacher-education-23',  // Emotional Boundary Builder
        'teacher-education-24',  // Energy Drain Tracker
        'teacher-education-25'   // Refill Rituals
      ];
      
      const allRequiredCompleted = requiredGameIds.every(id => gameCompletionStatus[id] === true);
      const badgeCollected = gameCompletionStatus[game.id] === true;
      
      return {
        isCompleted: badgeCollected,
        hasProgress: badgeCollected,
        canReplay: false, // Badge games don't have replay
        needsReplayUnlock: false,
        isLocked: !allRequiredCompleted,
        isSequentiallyLocked: false, // Badge games are not sequentially locked
        isBadgeGame: true
      };
    } else if (isBalancedLifeBadge) {
      // Check if all required games are completed for Balanced Life Badge
      const requiredGameIds = [
        'teacher-education-35',  // Weekend Recharge Plan
        'teacher-education-36',  // The "No" Practice
        'teacher-education-37',  // Work–Life Tracker Journal
        'teacher-education-38',  // Family Connection Challenge
        'teacher-education-39'   // Digital Shutdown Simulation
      ];
      
      const allRequiredCompleted = requiredGameIds.every(id => gameCompletionStatus[id] === true);
      const badgeCollected = gameCompletionStatus[game.id] === true;
      
      return {
        isCompleted: badgeCollected,
        hasProgress: badgeCollected,
        canReplay: false, // Badge games don't have replay
        needsReplayUnlock: false,
        isLocked: !allRequiredCompleted,
        isSequentiallyLocked: false, // Badge games are not sequentially locked
        isBadgeGame: true
      };
    } else if (isMindfulMasteryBadge) {
      // Check if all required games are completed for Mindful Mastery Badge
      const requiredGameIds = [
        'teacher-education-41',  // Present Moment Awareness
        'teacher-education-42',  // One-Minute Pause
        'teacher-education-43',  // Focus Anchor Exercise
        'teacher-education-45',  // Guided Meditation Audio
        'teacher-education-49'   // Gratitude in the Moment
      ];
      
      const allRequiredCompleted = requiredGameIds.every(id => gameCompletionStatus[id] === true);
      const badgeCollected = gameCompletionStatus[game.id] === true;
      
      return {
        isCompleted: badgeCollected,
        hasProgress: badgeCollected,
        canReplay: false, // Badge games don't have replay
        needsReplayUnlock: false,
        isLocked: !allRequiredCompleted,
        isSequentiallyLocked: false, // Badge games are not sequentially locked
        isBadgeGame: true
      };
    } else if (isResilientEducatorBadge) {
      // Check if all required games are completed for Resilient Educator Badge
      const requiredGameIds = [
        'teacher-education-51',  // The Bounce-Back Quiz
        'teacher-education-52',  // Growth Mindset Puzzle
        'teacher-education-53',  // Tough Day Simulation
        'teacher-education-56',  // Challenge Journal
        'teacher-education-59'   // Gratitude Ladder
      ];
      
      const allRequiredCompleted = requiredGameIds.every(id => gameCompletionStatus[id] === true);
      const badgeCollected = gameCompletionStatus[game.id] === true;
      
      return {
        isCompleted: badgeCollected,
        hasProgress: badgeCollected,
        canReplay: false, // Badge games don't have replay
        needsReplayUnlock: false,
        isLocked: !allRequiredCompleted,
        isSequentiallyLocked: false, // Badge games are not sequentially locked
        isBadgeGame: true
      };
    } else if (isClearCommunicatorBadge) {
      // Check if all required games are completed for Clear Communicator Badge
      const requiredGameIds = [
        'teacher-education-60',  // The Respectful "No"
        'teacher-education-61',  // Active Listening Quiz
        'teacher-education-68',  // Empathetic Dialogue Roleplay
        'teacher-education-66',  // Communication Mirror
        'teacher-education-69'   // Communication Reflex
      ];
      
      const allRequiredCompleted = requiredGameIds.every(id => gameCompletionStatus[id] === true);
      const badgeCollected = gameCompletionStatus[game.id] === true;
      
      return {
        isCompleted: badgeCollected,
        hasProgress: badgeCollected,
        canReplay: false, // Badge games don't have replay
        needsReplayUnlock: false,
        isLocked: !allRequiredCompleted,
        isSequentiallyLocked: false, // Badge games are not sequentially locked
        isBadgeGame: true
      };
    } else if (isConnectedTeacherBadge) {
      // Check if all required games are completed for Connected Teacher Badge
      const requiredGameIds = [
        'teacher-education-71',  // The Support Circle
        'teacher-education-74',  // Team Gratitude Wall
        'teacher-education-76',  // Encourage-a-Colleague Challenge
        'teacher-education-78',  // Staffroom Connection Map
        'teacher-education-79'   // Team Harmony Simulation
      ];
      
      const allRequiredCompleted = requiredGameIds.every(id => gameCompletionStatus[id] === true);
      const badgeCollected = gameCompletionStatus[game.id] === true;
      
      return {
        isCompleted: badgeCollected,
        hasProgress: badgeCollected,
        canReplay: false, // Badge games don't have replay
        needsReplayUnlock: false,
        isLocked: !allRequiredCompleted,
        isSequentiallyLocked: false, // Badge games are not sequentially locked
        isBadgeGame: true
      };
    } else if (isPurposefulTeacherBadge) {
      // Check if all required games are completed for Purposeful Teacher Badge
      const requiredGameIds = [
        'teacher-education-81',  // Why I Teach
        'teacher-education-85',  // Meaning in the Moment
        'teacher-education-86',  // Fulfillment Journal
        'teacher-education-87',  // Impact Visualization
        'teacher-education-82'   // The Ripple Effect
      ];
      
      const allRequiredCompleted = requiredGameIds.every(id => gameCompletionStatus[id] === true);
      const badgeCollected = gameCompletionStatus[game.id] === true;
      
      return {
        isCompleted: badgeCollected,
        hasProgress: badgeCollected,
        canReplay: false, // Badge games don't have replay
        needsReplayUnlock: false,
        isLocked: !allRequiredCompleted,
        isSequentiallyLocked: false, // Badge games are not sequentially locked
        isBadgeGame: true
      };
    } else if (isSelfCareChampionBadge) {
      // Check if all required games are completed for Self-Care Champion Badge
      const requiredGameIds = [
        'teacher-education-93',  // Evening Log-Off Ritual
        'teacher-education-95',  // Morning Nourish Routine
        'teacher-education-96',  // Nature Reconnect Challenge
        'teacher-education-91',  // Screen-Time Mirror
        'teacher-education-99'   // Silence & Stillness Practice
      ];
      
      const allRequiredCompleted = requiredGameIds.every(id => gameCompletionStatus[id] === true);
      const badgeCollected = gameCompletionStatus[game.id] === true;
      
      return {
        isCompleted: badgeCollected,
        hasProgress: badgeCollected,
        canReplay: false, // Badge games don't have replay
        needsReplayUnlock: false,
        isLocked: !allRequiredCompleted,
        isSequentiallyLocked: false, // Badge games are not sequentially locked
        isBadgeGame: true
      };
    }
    
    // Regular game handling with sequential unlocking
    const isCompleted = gameCompletionStatus[game.id] === true; // Only true if fullyCompleted (all 5 correct)
    const progress = gameProgressData[game.id];
    const hasProgress = !!progress; // Game has been played at least once
    
    // Only allow replay if game is fully completed (all answers correct) AND replay is unlocked
    const canReplay = isCompleted && progress?.replayUnlocked === true;
    
    // Needs replay unlock only if fully completed but replay not unlocked
    const needsReplayUnlock = isCompleted && (!progress || progress.replayUnlocked !== true);

    // Sequential unlocking: Game 1 is always unlocked, others require previous game to be fully completed
    let isSequentiallyLocked = false;
    if (game.gameIndex > 1) {
      const previousGameId = `teacher-education-${game.gameIndex - 1}`;
      const previousGameCompleted = gameCompletionStatus[previousGameId] === true; // Only true if previous game fully completed
      isSequentiallyLocked = !previousGameCompleted;
    }

    return {
      isCompleted,
      hasProgress, // Track if game has been played (even if not fully completed)
      canReplay,
      needsReplayUnlock,
      isLocked: isSequentiallyLocked, // Only lock if previous game not completed (all answers correct)
      isSequentiallyLocked, // Track if locked due to sequential requirement
      isBadgeGame: false
    };
  };

  // Support both old 'teacher-education' and new 'mental-health-emotional-regulation' slugs
  if (category !== 'teacher-education' && category !== 'mental-health-emotional-regulation') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Category not found</h1>
          <button
            onClick={() => navigate('/school-teacher/games')}
            className="text-purple-600 hover:underline"
          >
            Back to Teacher Games
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Glowing animation styles */}
      <style>{`
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.4),
                        0 0 40px rgba(168, 85, 247, 0.2),
                        0 0 60px rgba(168, 85, 247, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(168, 85, 247, 0.6),
                        0 0 60px rgba(168, 85, 247, 0.3),
                        0 0 90px rgba(168, 85, 247, 0.2);
          }
        }
        
        .glow-active {
          animation: glowPulse 2s ease-in-out infinite;
        }
        
        .gradient-animate {
          background-size: 200% 200%;
          animation: gradientMove 3s ease infinite;
        }
      `}</style>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ x: -5 }}
                    onClick={() => navigate('/school-teacher/games')}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg border border-white/30 transition-all"
                  >
                    <ArrowLeft className="w-5 h-5 text-white" />
                  </motion.button>
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"
                      whileHover={{ rotate: 5, scale: 1.1 }}
                    >
                      <Brain className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h1 className="text-2xl font-bold text-white mb-1">
                        Mental Health & Emotional Regulation
                      </h1>
                      <p className="text-sm text-white/90">
                        Core self-awareness and stress balance for teachers
                      </p>
                    </div>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl border border-white/30 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-white" />
                    <span className="text-white font-bold text-lg">
                      {wallet?.balance || 0} Healcoins
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {isLoadingProgress ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : games.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Games Available</h3>
              <p className="text-gray-600">Teacher education games will be added here soon.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => {
              const status = getGameStatus(game);
              const replayCost = getReplayCostForGame(game.gameIndex);
              
              // Different gradient colors for each game
              const gradients = [
                { bg: 'from-purple-50 via-pink-50 to-rose-50', icon: 'from-purple-500 to-pink-600', border: 'border-purple-200' },
                { bg: 'from-blue-50 via-indigo-50 to-purple-50', icon: 'from-blue-500 to-indigo-600', border: 'border-blue-200' },
                { bg: 'from-pink-50 via-rose-50 to-orange-50', icon: 'from-pink-500 to-rose-600', border: 'border-pink-200' },
                { bg: 'from-indigo-50 via-purple-50 to-violet-50', icon: 'from-indigo-500 to-purple-600', border: 'border-indigo-200' },
                { bg: 'from-rose-50 via-pink-50 to-fuchsia-50', icon: 'from-rose-500 to-fuchsia-600', border: 'border-rose-200' },
              ];
              
              // Determine card background based on status
              let cardGradient;
              let isActive = false; // Active = available to play (not locked, not completed)
              
              if (status.isBadgeGame) {
                // Light golden background for badge games (always)
                cardGradient = { bg: 'from-amber-50 via-yellow-50 to-orange-50', border: 'border-amber-200' };
                isActive = !status.isLocked; // Active if unlocked
              } else if (status.isCompleted) {
                // Light green for completed games
                cardGradient = { bg: 'from-green-50 via-emerald-50 to-teal-50', border: 'border-green-200' };
                isActive = false;
              } else if (status.isSequentiallyLocked) {
                // White for unplayed/locked games (waiting for previous game)
                cardGradient = { bg: 'from-white to-gray-50', border: 'border-gray-200' };
                isActive = false;
              } else {
                // Default colorful gradients for available games (ACTIVE GAMES)
                cardGradient = gradients[index % gradients.length];
                isActive = true; // Available to play
              }
              
              const gradient = gradients[index % gradients.length];

              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={!status.isLocked ? { y: -8, scale: 1.02 } : {}}
                  onClick={(e) => {
                    // Don't trigger card click if clicking on a button or button's child elements
                    const target = e.target;
                    const isButton = target.tagName === 'BUTTON' || target.closest('button') || target.closest('[role="button"]');
                    
                    if (isButton) {
                      console.log('Card click prevented - clicked on button');
                      return;
                    }
                    
                    if (!status.isLocked && !(status.isCompleted && status.needsReplayUnlock)) {
                      handleGameClick(game);
                    }
                  }}
                  className={`group relative overflow-hidden rounded-3xl border-2 ${isActive ? 'border-gray-800' : cardGradient.border} bg-gradient-to-br ${cardGradient.bg} shadow-xl cursor-pointer transition-all hover:shadow-2xl ${
                    status.isLocked ? 'opacity-75 cursor-not-allowed' : ''
                  } ${
                    isActive ? 'glow-active' : ''
                  }`}
                >
                  {/* Animated glowing gradient overlay for active games */}
                  {isActive && (
                    <div
                      className="absolute inset-0 opacity-30 pointer-events-none gradient-animate"
                      style={{
                        background: `linear-gradient(45deg, ${gradients[index % gradients.length].icon.includes('purple') ? 'rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.2)' : gradients[index % gradients.length].icon.includes('blue') ? 'rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.2)' : 'rgba(236, 72, 153, 0.3), rgba(249, 115, 22, 0.2)'}, transparent)`,
                      }}
                    />
                  )}
                  
                  {/* Additional animated border glow for active games */}
                  {isActive && (
                    <div
                      className="absolute -inset-0.5 rounded-3xl opacity-75 blur"
                      style={{
                        background: `linear-gradient(45deg, ${gradients[index % gradients.length].icon.includes('purple') ? '#a855f7, #ec4899' : gradients[index % gradients.length].icon.includes('blue') ? '#3b82f6, #8b5cf6' : '#ec4899, #f97316'})`,
                        animation: 'gradientMove 3s ease infinite',
                      }}
                    />
                  )}
                  
                  {/* Decorative background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white to-transparent rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white to-transparent rounded-full blur-xl"></div>
                  </div>

                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{game.title}</h3>
                          {status.isCompleted && (
                            <motion.div
                              animate={{ rotate: [0, 10, -10, 10, 0] }}
                              transition={{ duration: 0.5, delay: 1 }}
                            >
                              <Trophy className="w-5 h-5 text-yellow-500" />
                            </motion.div>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-4 leading-relaxed">{game.description}</p>
                      </div>
                      <motion.div
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${status.isBadgeGame ? 'from-amber-400 via-yellow-400 to-orange-400' : gradient.icon} flex items-center justify-center text-white shadow-lg flex-shrink-0`}
                      >
                        {status.isBadgeGame ? (
                          <Award className="w-6 h-6" />
                        ) : (
                          <Gamepad2 className="w-6 h-6" />
                        )}
                      </motion.div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      {status.isBadgeGame ? (
                        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <Trophy className="w-4 h-4 text-white" />
                          <span className="text-xs font-bold text-white">Badge Game</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <Clock className="w-4 h-4 text-gray-600" />
                            <span className="text-xs font-semibold text-gray-700">{game.estimatedTime}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <Trophy className="w-4 h-4 text-amber-600" />
                            <span className="text-xs font-semibold text-gray-700">{game.calmCoins} Coins</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/50">
                      {status.isBadgeGame && status.isLocked ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled
                          className="flex items-center gap-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-gray-900 px-4 py-2 rounded-lg shadow-md w-full justify-center font-semibold cursor-not-allowed opacity-75"
                        >
                          <Lock className="w-4 h-4" />
                          <span>
                            {game.id === 'teacher-education-10' ? 'Complete All Self-Awareness Tasks to Unlock' :
                             game.id === 'teacher-education-20' ? 'Complete All Calming Activities to Unlock' :
                             game.id === 'teacher-education-30' ? 'Complete All Empathy Balance Tasks to Unlock' :
                             game.id === 'teacher-education-40' ? 'Complete All Balance Activities to Unlock' :
                             game.id === 'teacher-education-50' ? 'Complete All Mindfulness Activities to Unlock' :
                             game.id === 'teacher-education-60' ? 'Complete All Resilience Activities to Unlock' :
                             game.id === 'teacher-education-70' ? 'Complete All Communication Activities to Unlock' :
                             game.id === 'teacher-education-80' ? 'Complete All Support-Oriented Games to Unlock' :
                             game.id === 'teacher-education-90' ? 'Complete All Purpose-Related Activities to Unlock' :
                             game.id === 'teacher-education-100' ? 'Complete All Self-Care Activities to Unlock' :
                             'Complete Required Tasks to Unlock'}
                          </span>
                        </motion.button>
                      ) : status.isBadgeGame && !status.isLocked ? (
                        // Badge game unlocked - golden gradient button
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleGameClick(game)}
                          className="flex items-center gap-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-gray-900 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all w-full justify-center font-semibold"
                        >
                          <Award className="w-4 h-4" />
                          {status.isCompleted ? 'View Badge' : 'Collect Badge'}
                        </motion.button>
                      ) : status.isSequentiallyLocked ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled
                          className="flex items-center gap-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 py-2 rounded-lg shadow-md w-full justify-center font-semibold cursor-not-allowed opacity-75"
                        >
                          <Lock className="w-4 h-4" />
                          <span>Complete Previous Game to Unlock</span>
                        </motion.button>
                      ) : status.isCompleted && status.needsReplayUnlock ? (
                        // Game fully completed but needs replay unlock - yellow button
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="w-full"
                        >
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (e.nativeEvent) {
                                e.nativeEvent.stopImmediatePropagation();
                              }
                              handleUnlockReplayClick(game, e);
                            }}
                            disabled={processingReplay}
                            className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 w-full justify-center font-semibold relative z-10"
                            style={{ pointerEvents: 'auto' }}
                          >
                            <Lock className="w-4 h-4" />
                            <span>Unlock ({replayCost} Coins)</span>
                          </motion.button>
                        </div>
                      ) : status.canReplay ? (
                        // Game fully completed and replay unlocked
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleGameClick(game)}
                          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all w-full justify-center font-semibold"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Play Again
                        </motion.button>
                      ) : status.hasProgress && !status.isCompleted ? (
                        // Game played but not fully completed - allow retry without unlock
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleGameClick(game)}
                          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all w-full justify-center font-semibold"
                        >
                          <Play className="w-4 h-4" />
                          Start Game
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleGameClick(game)}
                          className={`flex items-center gap-2 bg-gradient-to-r ${gradient.icon} text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all w-full justify-center font-semibold`}
                        >
                          <Play className="w-4 h-4" />
                          {status.isCompleted ? 'Review' : 'Start Game'}
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Hover effect overlay */}
                  {!status.isLocked && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient.icon} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Replay Confirmation Modal */}
      {showReplayConfirmModal && selectedGameForReplay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => {
            if (!processingReplay) {
              setShowReplayConfirmModal(false);
              setSelectedGameForReplay(null);
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Unlock Replay</h3>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Unlock replay for <strong className="text-gray-900">"{selectedGameForReplay.title}"</strong>?
            </p>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Cost:</span>
                <span className="text-purple-600 font-bold">{getReplayCostForGame(getGameIndexFromId(selectedGameForReplay.id))} Healcoins</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Your Balance:</span>
                <span className="text-gray-900 font-bold">{wallet?.balance || 0} Healcoins</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-amber-800 leading-relaxed">
                <strong>Note:</strong> You won't earn coins when replaying this game. The game will be locked again after you complete the replay.
              </p>
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (!processingReplay) {
                    setShowReplayConfirmModal(false);
                    setSelectedGameForReplay(null);
                  }
                }}
                disabled={processingReplay}
                className="flex-1 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUnlockReplay}
                disabled={processingReplay}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-semibold"
              >
                {processingReplay ? 'Processing...' : 'Unlock Replay'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default TeacherGameCategoryPage;

