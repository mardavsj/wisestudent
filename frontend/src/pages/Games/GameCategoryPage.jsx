import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import {
  ArrowLeft, Trophy, Timer, Coins, Lock, Play, Puzzle, Users, Calendar, Lightbulb, Star, TrendingUp, Zap, Gamepad2, Brain, Wallet, Heart, Shield, Globe, Target, BookOpen, GraduationCap, HandHeart, ShoppingCart, BarChart4, Cpu, Camera, Smartphone, UserX, Eye, Smile, MessageSquare, Flag, RefreshCw, Award, Palette, Home, Leaf, Sun, Droplets, Cloud, Book, Candy, ClipboardList, Gift, Paintbrush, PenSquare, PartyPopper, HelpCircle, PiggyBank, CreditCard, Brush, HeartHandshake, ShoppingBag, Image, Clipboard, School, FileText, Calculator, Video, Mic, PenTool, AlertTriangle, AlertCircle, BookOpenCheck, ToyBrick, MessageCircle, CloudRain, Moon, Tablet, Key, Activity, PlayCircle, HandHelping, Layers, Notebook, Drama, Monitor, ShieldCheck, Wind, Feather, Settings, Coffee, Ear, Volume, Map, Scale, Eraser, ListChecks, CheckSquare, Clock, MonitorPlay, Megaphone, PenLine, Theater, ShieldAlert, ClipboardCheck, CheckCircle, Briefcase, ThumbsUp, Edit3, Handshake, LogOut, DollarSign, Speech, BarChart3, Bell, Siren, Mail, Link, MapPin, X, Loader2
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { useSubscription } from "../../context/SubscriptionContext";
import { useWallet } from "../../context/WalletContext";
import { useSocket } from "../../context/SocketContext";
import { toast } from "react-hot-toast";
import gameCompletionService from "../../services/gameCompletionService";
import { financegGameIdsKids, getFinanceKidsGames } from "./GameCategories/Finance/kidGamesData";
import { financegGameIdsTeen, getFinanceTeenGames } from "./GameCategories/Finance/teenGamesData";
import { brainGamesKidsIds, getBrainKidsGames } from "./GameCategories/Brain/kidGamesData";
import { brainGamesTeenIds, getBrainTeenGames } from "./GameCategories/Brain/teenGamesData";
import { getUvlsKidsGames, uvlsGamesKidsIds } from "./GameCategories/UVLS/kidGamesData";
import { getUvlsTeenGames, uvlsGamesTeenIds } from "./GameCategories/UVLS/teenGamesData";
import {  dcosGamesKidsIds, getDcosKidsGames } from "./GameCategories/DCOS/kidGamesData";
import { dcosGamesTeenIds, getDcosTeenGames } from "./GameCategories/DCOS/teenGamesData";
import { getMoralKidsGames, moralGamesKidsIds } from "./GameCategories/MoralValues/kidGamesData";
import { getMoralTeenGames, moralGamesTeenIds } from "./GameCategories/MoralValues/teenGamesData";
import { aiGamesKidsIds, getAiKidsGames } from "./GameCategories/AiForAll/kidGamesData";
import { aiGamesTeenIds, getAiTeenGames } from "./GameCategories/AiForAll/teenGamesData";
import { eheGameIdsKids, getEheKidsGames } from "./GameCategories/EHE/kidGamesData";
import { eheGameIdsTeen, getEheTeenGames } from "./GameCategories/EHE/teenGamesData";
import { crgcGameIdsKids, getCrgcKidsGames } from "./GameCategories/CRGC/kidGamesData";
import { crgcGameIdsTeens, getCrgcTeensGames } from "./GameCategories/CRGC/teenGamesData";
import { getHealthMaleKidsGames, healthMaleGameIdsKids } from "./GameCategories/HealthMale/kidGamesData";
import { getHealthMaleTeenGames, healthMaleGameIdsTeen } from "./GameCategories/HealthMale/teenGamesData";
import { getHealthFemaleKidsGames, healthFemaleGameIdsKids } from "./GameCategories/HealthFemale/kidGamesData";
import getHealthFemaleTeenGames, { healthFemaleGameIdsTeen } from "./GameCategories/HealthFemale/teenGamesData";
import { getSustainabilityKidsGames, sustainabilityGameIdsKids } from "./GameCategories/Sustainability/kidGamesData";
import { getSustainabilityTeenGames, sustainabilityGameIdsTeen } from "./GameCategories/Sustainability/teenGamesData";
import UpgradePrompt from "../../components/UpgradePrompt";
import api from "../../utils/api";

const GameCategoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { canAccessPillar, canAccessGame: canAccessGameBySubscription, getGamesPerPillar } = useSubscription();
  const { wallet, refreshWallet, setWallet } = useWallet();
  const socketContext = useSocket();
  const socket = socketContext?.socket || null;
  const { category, ageGroup } = useParams();
  const [userAge, setUserAge] = useState(null);
  const [completedGames, setCompletedGames] = useState(new Set());
  const [gameCompletionStatus, setGameCompletionStatus] = useState({});
  const [gameProgressData, setGameProgressData] = useState({}); // Store full progress data with coins and XP
  //eslint-disable-next-line
  const [replayableGames, setReplayableGames] = useState(new Set()); // Games that have been unlocked for replay
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [processingReplay, setProcessingReplay] = useState(false);
  const [showReplayConfirmModal, setShowReplayConfirmModal] = useState(false);
  const [selectedGameForReplay, setSelectedGameForReplay] = useState(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true); // Track loading state
  const gameCardRefs = useRef({}); // Refs for game cards to enable auto-scroll
  const hasScrolledToCurrentGame = useRef(false); // Track if we've already scrolled

  // Map game category URL to dashboard category slug
  const getDashboardCategorySlug = (gameCategory) => {
    const categorySlugMap = {
      'financial-literacy': 'financial-literacy',
      'brain-health': 'brain-health',
      'uvls': 'uvls-life-skills-values',
      'digital-citizenship': 'digital-citizenship-online-safety',
      'moral-values': 'moral-values',
      'ai-for-all': 'ai-for-all',
      'ehe': 'entrepreneurship-higher-education',
      'civic-responsibility': 'civic-responsibility-global-citizenship',
      'sustainability': 'sustainability'
    };
    return categorySlugMap[gameCategory] || gameCategory;
  };

  // Calculate user's age from date of birth
  const calculateUserAge = (dob) => {
    if (!dob) return null;

    const dobDate = typeof dob === "string" ? new Date(dob) : new Date(dob);
    if (isNaN(dobDate.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dobDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Check if user can access a specific game based on age
  const canAccessGame = (gameAgeGroup, userAge) => {
    if (userAge === null) return false;

    // For sustainability category, no age restrictions
    if (category === "sustainability") {
      return true;
    }

    switch (gameAgeGroup) {
      case "kids":
        // Kids games: accessible to users under 18, locked for 18+
        return userAge < 18;
      case "teens":
        // Teens games: accessible to users under 18, locked for 18+
        return userAge < 18;
      case "adults":
        // Adult games: only accessible to users 18 and above
        return userAge >= 18;
      case "solar-and-city":
      case "waste-and-recycle":
      case "carbon-and-climate":
      case "water-and-energy":
        // Sustainability subcategories: accessible to all users
        return true;
      default:
        return true;
    }
  };

  // Check if a specific game is unlocked based on completion sequence and subscription
  const isGameUnlocked = (gameIndex) => {
    // Check subscription-based access first - pass gameIndex to check if this specific game is within limit
    const gamesCompleted = categoryStats.completedGames || 0;
    const subscriptionAccess = canAccessGameBySubscription(categoryTitle, gamesCompleted, gameIndex);
    if (!subscriptionAccess.allowed) {
      return false; // Game is locked due to subscription limits
    }

    // First game is always unlocked (if subscription allows)
    if (gameIndex === 0) return true;

    // For finance, brain health, UVLS, DCOS, Moral Values, AI For All, EHE, CRGC, Health Male, Health Female, and Sustainability kids and teens games, check if previous game is completed
    if (
      (category === "financial-literacy" ||
        category === "brain-health" ||
        category === "uvls" ||
        category === "digital-citizenship" ||
        category === "moral-values" ||
        category === "ai-for-all" ||
        category === "ehe" ||
        category === "civic-responsibility" ||
        category === "health-male" ||
        category === "health-female" ||
        category === "sustainability") &&
      (ageGroup === "kids" ||
        ageGroup === "teens" ||
        ageGroup === "teen" ||
        ageGroup === "solar-and-city" ||
        ageGroup === "waste-and-recycle" ||
        ageGroup === "carbon-and-climate" ||
        ageGroup === "water-and-energy")
    ) {
      const previousGameId = getGameIdByIndex(gameIndex - 1);
      // Only unlock if previous game is explicitly completed (strict check)
      return gameCompletionStatus[previousGameId] === true;
    }

    // For other categories, unlock all games (existing behavior)
    return true;
  };
  // Check if a game is fully completed and should be locked
  const isGameFullyCompleted = (gameId) => {
    return gameCompletionStatus[gameId] === true;
  };

  // Get category icon based on category name
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      "financial-literacy": <Wallet className="w-6 h-6" />,
      "brain-health": <Brain className="w-6 h-6" />,
      uvls: <HandHeart className="w-6 h-6" />,
      "digital-citizenship": <Globe className="w-6 h-6" />,
      "moral-values": <Heart className="w-6 h-6" />,
      "ai-for-all": <Cpu className="w-6 h-6" />,
      "health-male": <Shield className="w-6 h-6" />,
      "health-female": <Shield className="w-6 h-6" />,
      ehe: <Target className="w-6 h-6" />,
      "civic-responsibility": <Globe className="w-6 h-6" />,
      sustainability: <Leaf className="w-6 h-6" />,
    };

    return iconMap[categoryName] || <Gamepad2 className="w-6 h-6" />;
  };

  // Get category title based on category name
  const getCategoryTitle = (categoryName) => {
    const titleMap = {
      "financial-literacy": "Financial Literacy",
      "brain-health": "Brain Health",
      uvls: "UVLS (Life Skills & Values)",

      "digital-citizenship": "Digital Citizenship & Online Safety",
      "moral-values": "Moral Values",
      "ai-for-all": "AI for All",
      "health-male": "Health - Male",
      "health-female": "Health - Female",
      ehe: "Entrepreneurship & Higher Education",
      "civic-responsibility": "Civic Responsibility & Global Citizenship",
      sustainability: "Sustainability",
    };

    return titleMap[categoryName] || categoryName;
  };

  // Get age group title
  const getAgeGroupTitle = (ageGroup) => {
    const titleMap = {
      kids: "Kids Module",
      teens: "Teen Module",
      adults: "Adult Module",
      "solar-and-city": "Solar & City Games",
      "waste-and-recycle": "Waste & Recycle Games",
      "carbon-and-climate": "Carbon & Climate Games",
      "water-and-energy": "Water & Energy Games",
    };

    return titleMap[ageGroup] || ageGroup;
  };

  // Map URL category/ageGroup to gameId prefix for batch API calls
  const getCategoryPrefix = (category, ageGroup) => {
    // Normalize ageGroup: "teen" -> "teens"
    const normalizedAge = ageGroup === "teen" ? "teens" : ageGroup;
    
    // Map URL categories to gameId prefix categories
    const categoryMap = {
      "financial-literacy": "finance",
      "brain-health": "brain",
      "uvls": "uvls",
      "digital-citizenship": "dcos",
      "moral-values": "moral",
      "ai-for-all": "ai",
      "ehe": "ehe",
      "civic-responsibility": "civic-responsibility",
      "health-male": "health-male",
      "health-female": "health-female",
      "sustainability": "sustainability"
    };
    
    const prefixCategory = categoryMap[category] || category;
    
    // Handle sustainability subcategories
    if (category === "sustainability") {
      if (ageGroup === "solar-and-city") {
        return "sustainability-solar";
        } else if (ageGroup === "waste-and-recycle") {
        return "sustainability-waste";
      } else if (ageGroup === "carbon-and-climate") {
        return "sustainability-carbon";
      } else if (ageGroup === "water-and-energy") {
        return "sustainability-water-energy";
      }
    }
    
    // Return prefix in format: "{category}-{age}"
    return `${prefixCategory}-${normalizedAge}`;
  };

  // Load game completion status and progress data using batch API
  const loadGameCompletionStatus = useCallback(async () => {
    setIsLoadingProgress(true); // Start loading
    
    // Clear existing status when category/ageGroup changes to prevent stale data
    setGameCompletionStatus({});
    setGameProgressData({});
    
    try {
      // For finance, brain health, UVLS, DCOS, Moral Values, AI For All, EHE, CRGC, Health Male, Health Female, and Sustainability kids games, load completion status
      if (
        (category === "financial-literacy" ||
          category === "brain-health" ||
          category === "uvls" ||
          category === "digital-citizenship" ||
          category === "moral-values" ||
          category === "ai-for-all" ||
          category === "ehe" ||
          category === "health-male" ||
          category === "health-female" ||
          category === "civic-responsibility" ||
          category === "sustainability") &&
        (ageGroup === "kids" ||
          ageGroup === "teens" ||
          ageGroup === "teen" ||
          ageGroup === "solar-and-city" ||
          ageGroup === "waste-and-recycle" ||
          ageGroup === "carbon-and-climate" ||
          ageGroup === "water-and-energy")
      ) {
        // Get category prefix for batch API call (e.g., "finance-kids")
        const categoryPrefix = getCategoryPrefix(category, ageGroup);
        
        console.log(`📦 Loading batch game progress for: ${categoryPrefix}`);
        
        // Make single batch API call to get all progress for this category
        const progressMap = await gameCompletionService.getBatchGameProgress(categoryPrefix);
        
        console.log(`✅ Loaded progress for ${Object.keys(progressMap).length} games`);
        
        // Process the batch response into status and progressData
        const status = {};
        const progressData = {};
        
        // Iterate through all returned progress entries
        Object.keys(progressMap).forEach(gameId => {
          const progress = progressMap[gameId];
          
          if (progress) {
            const isCompleted = progress.fullyCompleted || false;
            status[gameId] = isCompleted;
            
            // Store full progress data including coins, XP, and replay status
            if (isCompleted) {
              progressData[gameId] = {
                totalCoinsEarned: progress.totalCoinsEarned || 0,
                fullyCompleted: progress.fullyCompleted || false,
                totalLevels: progress.totalLevels || 1,
                replayUnlocked: progress.replayUnlocked === true // Explicitly check for true, not just truthy
              };
            }
          } else {
            status[gameId] = false;
          }
        });
        
        // Initialize status for all expected games (even if not in progress map)
        // This ensures cards that haven't been started yet show as incomplete
        const maxGames = 100;
        for (let i = 0; i < maxGames; i++) {
          const gameId = getGameIdByIndex(i);
          if (gameId && !(gameId in status)) {
            status[gameId] = false;
          }
        }
        
        // Update replayable games set
        const replayableSet = new Set();
        Object.keys(progressData).forEach(gameId => {
          if (progressData[gameId].replayUnlocked === true) {
            replayableSet.add(gameId);
          }
        });
        
        // Set all state at once for instant rendering
        setReplayableGames(replayableSet);
        setGameCompletionStatus(status);
        setGameProgressData(progressData);
        
        console.log(`✅ Game completion status updated for ${Object.keys(status).length} games`);
        // Log specific game status for debugging
        if (status['dcos-teen-1'] !== undefined) {
          console.log(`🔍 dcos-teen-1 completion status:`, {
            completed: status['dcos-teen-1'],
            progressData: progressData['dcos-teen-1'],
            allDcosTeen1Keys: Object.keys(status).filter(k => k.includes('dcos-teen-1')),
            statusValue: status['dcos-teen-1'],
            statusType: typeof status['dcos-teen-1']
          });
        } else {
          console.log(`⚠️ dcos-teen-1 NOT FOUND in status object. Available keys:`, Object.keys(status).filter(k => k.includes('dcos-teen')).slice(0, 10));
        }
      } else {
        // For categories that don't use batch API, clear status
        setGameCompletionStatus({});
        setGameProgressData({});
      }
    } catch (error) {
      console.error("Failed to load game completion status:", error);
      // On error, clear status to prevent stale data
      setGameCompletionStatus({});
      setGameProgressData({});
    } finally {
      setIsLoadingProgress(false); // Stop loading
    }
    // eslint-disable-next-line
  }, [category, ageGroup]);

  useEffect(() => {
    loadGameCompletionStatus();

    // Listen for game completion events from GameShell (custom window event)
    const handleGameCompleted = (event) => {
      const { gameId, fullyCompleted } = event?.detail || {};
      console.log('🎮 Game completed window event received:', { gameId, fullyCompleted, detail: event?.detail, category, ageGroup });
      
      if (
        (category === "financial-literacy" ||
          category === "brain-health" ||
          category === "uvls" ||
          category === "digital-citizenship" ||
          category === "moral-values" ||
          category === "ai-for-all" ||
          category === "ehe" ||
          category === "health-male" ||
          category === "health-female" ||
          category === "civic-responsibility" ||
          category === "sustainability") &&
        (ageGroup === "kids" ||
          ageGroup === "teens" ||
          ageGroup === "teen" ||
          ageGroup === "solar-and-city" ||
          ageGroup === "waste-and-recycle" ||
          ageGroup === "carbon-and-climate" ||
          ageGroup === "water-and-energy")
      ) {
        console.log('✅ Category and ageGroup match, processing completion');
        // Immediately update the game completion status for instant UI feedback
        if (gameId && fullyCompleted !== false) {
          console.log(`✅ Immediately marking game ${gameId} as completed`);
          setGameCompletionStatus(prev => {
            const updated = {
              ...prev,
              [gameId]: true
            };
            console.log('📝 Updated gameCompletionStatus:', updated);
            return updated;
          });
        } else {
          console.warn('⚠️ Game completion event received but gameId missing or fullyCompleted is false:', { gameId, fullyCompleted });
        }
        
        // Reload game completion status and progress when a game is completed
        // This will update stats automatically since stats depend on gameProgressData
        // Add a small delay to ensure backend has saved the changes
        setTimeout(() => {
          console.log('🔄 Reloading game completion status after delay');
          loadGameCompletionStatus();
        }, 500);
        
        // Also refresh wallet to show updated balance
        if (refreshWallet) {
          refreshWallet();
        }
      } else {
        console.log('⚠️ Game completion event received but category/ageGroup mismatch:', { category, ageGroup, gameId });
      }
    };

    window.addEventListener("gameCompleted", handleGameCompleted);
    
    // Listen for game replayed event from GameShell
    const handleGameReplayedEvent = async (event) => {
      const { gameId, replayUnlocked } = event.detail;
      console.log('🎮 Game replayed event received:', { gameId, replayUnlocked });
      
      // Immediately update the state to reflect locked status
      if (gameId && replayUnlocked === false) {
        // Remove from replayable games set
        setReplayableGames(prev => {
          const newSet = new Set(prev);
          newSet.delete(gameId);
          console.log('🔒 Removed game from replayable set:', gameId, 'New set:', Array.from(newSet));
          return newSet;
        });
        
        // Update progress data to reflect locked status
        setGameProgressData(prev => {
          if (!prev[gameId]) {
            return prev;
          }
          const updated = {
            ...prev,
            [gameId]: {
              ...prev[gameId],
              replayUnlocked: false
            }
          };
          console.log('🔒 Updated progress data for game:', gameId, updated[gameId]);
          return updated;
        });
      }
      
      // Reload game completion status from backend to ensure consistency
      // Add a delay to ensure backend has saved the changes
      setTimeout(async () => {
        console.log('🔄 Reloading game completion status after replay...');
        await loadGameCompletionStatus();
        console.log('✅ Game completion status reloaded');
        
        // Double-check the game is locked by fetching its progress directly
        if (gameId) {
          try {
            const progressResponse = await gameCompletionService.getGameProgress(gameId);
            console.log('🔍 Direct progress check after reload:', {
              gameId,
              replayUnlocked: progressResponse?.replayUnlocked,
              fullyCompleted: progressResponse?.fullyCompleted
            });
            
            // Force update if still showing as unlocked
            if (progressResponse && progressResponse.replayUnlocked === false) {
              setGameProgressData(prev => ({
                ...prev,
                [gameId]: {
                  ...prev[gameId],
                  replayUnlocked: false
                }
              }));
              setReplayableGames(prev => {
                const newSet = new Set(prev);
                newSet.delete(gameId);
                return newSet;
              });
            }
          } catch (err) {
            console.error('Error checking progress:', err);
          }
        }
      }, 1000);
    };
    
    window.addEventListener("gameReplayed", handleGameReplayedEvent);

    // Listen for wallet updates and replay events from socket
    const handleWalletUpdate = (data) => {
      console.log('💰 Wallet updated via socket in GameCategoryPage:', data);
      
      // Update wallet balance directly from socket data for immediate UI update
      if (data?.balance !== undefined || data?.newBalance !== undefined) {
        const newBalance = data.balance || data.newBalance;
        console.log('💰 Updating wallet balance to:', newBalance);
        if (setWallet) {
          setWallet(prev => {
            const updatedWallet = prev ? {
              ...prev,
              balance: newBalance
            } : {
              balance: newBalance,
              userId: user?._id || user?.id
            };
            console.log('💰 Wallet state updated:', updatedWallet);
            return updatedWallet;
          });
        }
      }
      
      // Also refresh from API to ensure consistency (with a small delay to let socket update first)
      if (refreshWallet) {
        setTimeout(() => {
          refreshWallet();
        }, 200);
      }
    };

    const handleGameReplayedSocket = (data) => {
      // Reload game completion status when a game is replayed via socket
      console.log('🎮 Game replayed via socket, reloading status:', data);
      loadGameCompletionStatus();
      
      // Update replayable games set - remove the game since it's locked again
      if (data?.gameId && !data?.replayUnlocked) {
        setReplayableGames(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.gameId);
          return newSet;
        });
      }
    };

    // Listen for game completion events from socket for real-time updates
    const handleGameCompletedSocket = (data) => {
      console.log('🎮 Game completed via socket, updating stats in real-time:', data);
      
      const { gameId, coinsEarned } = data || {};
      
      if (!gameId) return;
      
      // Check if this game belongs to the current category
      const isCurrentCategory = 
        (category === "financial-literacy" ||
         category === "brain-health" ||
         category === "uvls" ||
         category === "digital-citizenship" ||
         category === "moral-values" ||
         category === "ai-for-all" ||
         category === "ehe" ||
         category === "health-male" ||
         category === "health-female" ||
         category === "civic-responsibility" ||
         category === "sustainability") &&
        (ageGroup === "kids" ||
         ageGroup === "teens" ||
         ageGroup === "teen" ||
         ageGroup === "solar-and-city" ||
         ageGroup === "waste-and-recycle" ||
         ageGroup === "carbon-and-climate" ||
         ageGroup === "water-and-energy");
      
      if (!isCurrentCategory) {
        // Not for current category, ignore
        return;
      }
      
      // Update game progress data immediately for real-time stats
      setGameProgressData(prev => {
        const currentProgress = prev[gameId];
        if (!currentProgress) {
          // Game was just completed - add it to progress data
          return {
            ...prev,
            [gameId]: {
              totalCoinsEarned: coinsEarned || 0,
              fullyCompleted: true,
              replayUnlocked: false,
              totalLevels: 1
            }
          };
        } else {
          // Update existing progress - only add coins if it's a new completion
          // Don't double-count if game was already completed
          if (!currentProgress.fullyCompleted && coinsEarned) {
            return {
              ...prev,
              [gameId]: {
                ...currentProgress,
                totalCoinsEarned: (currentProgress.totalCoinsEarned || 0) + (coinsEarned || 0),
                fullyCompleted: true
              }
            };
          }
          return prev;
        }
      });
      
      // Update game completion status immediately
      setGameCompletionStatus(prev => ({
        ...prev,
        [gameId]: true
      }));
      
      // Update wallet balance directly from socket data for immediate UI update
      if (data?.newBalance !== undefined && setWallet) {
        setWallet(prev => {
          if (prev) {
            return {
              ...prev,
              balance: data.newBalance
            };
          } else {
            return {
              balance: data.newBalance,
              userId: user?._id || user?.id
            };
          }
        });
      }
      
      // Also refresh wallet from API to ensure consistency
      if (refreshWallet) {
        refreshWallet();
        // Refresh again after a delay to ensure backend has saved
        setTimeout(() => {
          refreshWallet();
        }, 500);
      }
      
      // Reload from backend after a short delay to ensure consistency
      // This ensures we have the latest data from the database
      setTimeout(() => {
        loadGameCompletionStatus();
      }, 1000);
    };

    // Set up socket listeners
    if (socket) {
      socket.on('wallet:updated', handleWalletUpdate);
      socket.on('game-replayed', handleGameReplayedSocket);
      socket.on('game-completed', handleGameCompletedSocket);
    }

    // Removed visibilitychange event listener to prevent auto-refresh
    // Status will be updated via game completion events and socket events instead

    return () => {
      window.removeEventListener("gameCompleted", handleGameCompleted);
      window.removeEventListener("gameReplayed", handleGameReplayedEvent);
      if (socket) {
        socket.off('wallet:updated', handleWalletUpdate);
        socket.off('game-replayed', handleGameReplayedSocket);
        socket.off('game-completed', handleGameCompletedSocket);
      }
    };
  }, [category, ageGroup, loadGameCompletionStatus, socket, refreshWallet, setWallet, user]);
  // Generate mock games data
  const generateGamesData = () => {
    const games = [];

    const difficulties = ["Easy", "Medium", "Hard"];
    const icons = [
      <Gamepad2 />,
      <Trophy />,
      <Star />,
      <Zap />,
      <Target />,
      <BookOpen />,
      <GraduationCap />,
    ];

    // Special case for financial literacy kids games - replace first 20 with real games
    if (category === 'financial-literacy' && ageGroup === 'kids') {
      // Add our 20 real finance games instead of mock games
      const realGames = getFinanceKidsGames(gameCompletionStatus)
      
      // Add our real games first
      games.push(...realGames);
      
      // No need for additional mock games since we have 20 real games
  } else if (category === 'financial-literacy' && (ageGroup === 'teens' || ageGroup === 'teen')) {
      // Add our 20 real teen finance games
      const realTeenGames = getFinanceTeenGames(gameCompletionStatus)
      
      // Add our real teen games
      games.push(...realTeenGames);
  } else if (category === 'brain-health' && ageGroup === 'kids') {
      // Add our 20 real brain health games for kids
      const realBrainGames = getBrainKidsGames(gameCompletionStatus)
      
      // Add our real brain games
      games.push(...realBrainGames);
  } else if (category === 'brain-health' && (ageGroup === 'teens' || ageGroup === 'teen')) {
      // Add our 20 real brain health games for teens
      const realTeenBrainGames = getBrainTeenGames(gameCompletionStatus);
      
      // Add our real teen brain games
      games.push(...realTeenBrainGames);
  } else if (category === 'uvls' && ageGroup === 'kids') {
      // Add our 10 real UVLS Kids games
      const realUVLSGames = getUvlsKidsGames(gameCompletionStatus);
      
      // Add our real UVLS games
      games.push(...realUVLSGames);
  } else if (category === 'uvls' && (ageGroup === 'teens' || ageGroup === 'teen')) {
      // Add our 20 real UVLS Teen games
      const realUVLSTeenGames = getUvlsTeenGames(gameCompletionStatus);
      
      // Add our real UVLS Teen games
      games.push(...realUVLSTeenGames);
  } else if (category === 'digital-citizenship' && ageGroup === 'kids') {
      // Add our 20 real DCOS Kids games
      const realDCOSKidsGames = getDcosKidsGames(gameCompletionStatus)
      
      // Add our real DCOS Kids games
      games.push(...realDCOSKidsGames);
  } else if (category === 'digital-citizenship' && (ageGroup === 'teens' || ageGroup === 'teen')) {
      // Add our 20 real DCOS Teen games
      const realDCOSTeenGames = getDcosTeenGames(gameCompletionStatus);
      
      // Add our real DCOS Teen games
      games.push(...realDCOSTeenGames);
  } else if (category === 'moral-values' && ageGroup === 'kids') {
     
      const realMoralKidsGames = getMoralKidsGames(gameCompletionStatus);

      // Add our real Moral Values Kids games
      games.push(...realMoralKidsGames);
  } else if (category === 'moral-values' && (ageGroup === 'teens' || ageGroup === 'teen')) {
      // Add our 20 real Moral Values Teen games
      const realMoralTeenGames = getMoralTeenGames(gameCompletionStatus);
      
      // Add our real Moral Values Teen games
      games.push(...realMoralTeenGames);
  } else if (category === 'ai-for-all' && ageGroup === 'kids') {
      // Add our 20 real AI For All Kids games
      const realAIKidsGames = getAiKidsGames(gameCompletionStatus);
      
      // Add our real AI For All Kids games
      games.push(...realAIKidsGames);
  } else if (category === 'ai-for-all' && (ageGroup === 'teens' || ageGroup === 'teen')) {
      // Add our 20 real AI For All Teen games
      const realAITeenGames = getAiTeenGames(gameCompletionStatus);
      
      // Add our real AI For All Teen games
      games.push(...realAITeenGames);
  } else if (category === 'ehe' && ageGroup === 'kids') {
      // Add our 20 real EHE Kids games
      const realEHEKidsGames = getEheKidsGames(gameCompletionStatus);
      
      // Add our real EHE Kids games
      games.push(...realEHEKidsGames);
  } else if (category === 'ehe' && (ageGroup === 'teens' || ageGroup === 'teen')) {
      // Add our 20 real EHE Teen games
      const realEHETeenGames = getEheTeenGames(gameCompletionStatus);
      
      // Add our real EHE Teen games
      games.push(...realEHETeenGames);
  } else if (category === 'civic-responsibility' && ageGroup === 'kids') {
      // Add our 20 real CRGC Kids games
      const realCRGCKidsGames = getCrgcKidsGames(gameCompletionStatus);
      
      // Add our real CRGC Kids games
      games.push(...realCRGCKidsGames);
  } else if (category === 'civic-responsibility' && (ageGroup === 'teens' || ageGroup === 'teen')) {
      // Add our 20 real CRGC Teen games
      const realCRGCTeenGames = getCrgcTeensGames(gameCompletionStatus);

      // Add our real CRGC Teen games
      games.push(...realCRGCTeenGames);
  } else if (category === 'health-male' && ageGroup === 'kids') {
      // Add our 40 real HealthMale Kids games
      const realHealthMaleKidsGames = getHealthMaleKidsGames(gameCompletionStatus);

      // Add our real HealthMale Kids games
      games.push(...realHealthMaleKidsGames);
  } else if (category === 'health-male' && (ageGroup === 'teens' || ageGroup === 'teen')) {
      // Add our 40 real HealthMale Teen games
      const realHealthMaleTeenGames = getHealthMaleTeenGames(gameCompletionStatus);

      // Add our real HealthMale Teen games
      games.push(...realHealthMaleTeenGames);
  } else if (category === 'health-female' && ageGroup === 'kids') {
      // Add our real HealthFemale Kids games
      const realHealthFemaleKidsGames = getHealthFemaleKidsGames(gameCompletionStatus);
      games.push(...realHealthFemaleKidsGames); 
  } else if (category === 'health-female' && (ageGroup === 'teens' || ageGroup === 'teen')) {
      // Add our real HealthFemale Kids games
      const realHealthFemaleTeenGames = getHealthFemaleTeenGames(gameCompletionStatus);
      games.push(...realHealthFemaleTeenGames);
      
  }  else if (category === "sustainability") {
      // For sustainability, we need to check the ageGroup to determine which subcategory we're in
      if (ageGroup === "kids") {
        // Add real Sustainability Kids games
        const realSustainabilityKidsGames = getSustainabilityKidsGames(gameCompletionStatus);
        games.push(...realSustainabilityKidsGames);
      } else if (ageGroup === "teens" || ageGroup === "teen") {
        // Add real Sustainability Teen games
        const realSustainabilityTeenGames = getSustainabilityTeenGames(gameCompletionStatus);
        games.push(...realSustainabilityTeenGames);
      } else if (ageGroup === "adults") {
        // Generate 20 mock games for Adult Module
        for (let i = 1; i <= 20; i++) {
          const difficulty = i <= 7 ? "Medium" : i <= 14 ? "Hard" : "Expert";
          const gameIcons = [<Leaf className="w-6 h-6" />, <Sun className="w-6 h-6" />, <Cloud className="w-6 h-6" />, <Zap className="w-6 h-6" />, <Droplets className="w-6 h-6" />];
          const icon = gameIcons[i % gameIcons.length];
          const gameId = `sustainability-adults-${i}`;
          
          games.push({
            id: gameId,
            title: `Sustainability Adult Game ${i}`,
            description: `Challenging sustainability game for adults - Game ${i}`,
            icon: icon,
            difficulty: difficulty,
            duration: `${Math.floor(Math.random() * 5) + 8}-${Math.floor(Math.random() * 5) + 15} min`,
            coins: 5,
            xp: 10,
            completed: gameCompletionStatus[gameId] || false,
            path: `/student/sustainability/adults/game-${i}`,
            index: i - 1,
          });
        }
      } else if (ageGroup === "solar-and-city") {
        const solarAndCityGames = [
          {
            id: "sustainability-1",
            title: "Solar & City Challenge",
            description: "Learn about solar energy and sustainable cities",
            icon: <Sun className="w-6 h-6" />,
            difficulty: "Easy",
            duration: "5 min",
            coins: 5,
            xp: 10,
            completed: gameCompletionStatus["sustainability-1"] || false,
            isSpecial: true,
            path: "/student/sustainability/solar-and-city/test-solar-game",
            index: 0,
          },
          // Add more games here as they are created
        ];
        games.push(...solarAndCityGames);
      } else if (ageGroup === "waste-and-recycle") {
        const wasteAndRecycleGames = [
          {
            id: "sustainability-2",
            title: "Waste & Recycle Challenge",
            description: "Learn about waste conservation and recycling",
            icon: <Droplets className="w-6 h-6" />,
            difficulty: "Easy",
            duration: "5 min",
            coins: 5,
            xp: 10,
            completed: gameCompletionStatus["sustainability-2"] || false,
            isSpecial: true,
            path: "/student/sustainability/waste-and-recycle/test-waste-recycle-game",
            index: 0,
          },
          // Add more games here as they are created
        ];
        games.push(...wasteAndRecycleGames);
      } else if (ageGroup === "carbon-and-climate") {
        const carbonAndClimateGames = [
          {
            id: "sustainability-3",
            title: "Carbon & Climate Challenge",
            description: "Learn about carbon footprints and climate change",
            icon: <Cloud className="w-6 h-6" />,
            difficulty: "Medium",
            duration: "6 min",
            coins: 5,
            xp: 10,
            completed: gameCompletionStatus["sustainability-3"] || false,
            isSpecial: true,
            path: "/student/sustainability/carbon-and-climate/test-carbon-game",
            index: 0,
          },
          // Add more games here as they are created
        ];
        games.push(...carbonAndClimateGames);
      } else if (ageGroup === "water-and-energy") {
        const waterAndEnergyGames = [
          {
            id: "sustainability-4",
            title: "Water & Energy Challenge",
            description: "Learn about the connection between water and energy",
            icon: <Zap className="w-6 h-6" />,
            difficulty: "Medium",
            duration: "6 min",
            coins: 5,
            xp: 10,
            completed: gameCompletionStatus["sustainability-4"] || false,
            isSpecial: true,
            path: "/student/sustainability/water-and-energy/test-water-energy-game",
            index: 0,
          },
          // Add more games here as they are created
        ];
        games.push(...waterAndEnergyGames);
      } else {
        // Default case if no specific ageGroup is matched
        const defaultSustainabilityGames = [
          {
            id: "sustainability-1",
            title: "Solar & City Challenge",
            description: "Learn about solar energy and sustainable cities",
            icon: <Leaf className="w-6 h-6" />,
            difficulty: "Easy",
            duration: "5 min",
            coins: 5,
            xp: 10,
            completed: gameCompletionStatus["sustainability-1"] || false,
            isSpecial: true,
            path: "/student/sustainability/solar-and-city/test-solar-game",
            index: 0,
          },
        ];
        games.push(...defaultSustainabilityGames);
      }
    } else {
      // For all other categories, generate 20 mock games instead of 200
      for (let i = 1; i <= 20; i++) {
        const difficulty =
          difficulties[Math.floor(Math.random() * difficulties.length)];
        const icon = icons[Math.floor(Math.random() * icons.length)];

        games.push({
          id: `${ageGroup}-${i}`,
          title: `${getAgeGroupTitle(ageGroup)} Game ${i}`,
          description: `An engaging ${difficulty.toLowerCase()} game that helps improve your skills in ${getCategoryTitle(
            category
          )}.`,
          icon: icon,
          difficulty: difficulty,
          duration: `${Math.floor(Math.random() * 10) + 1}-${
            Math.floor(Math.random() * 10) + 1
          } min`,
          coins: Math.floor(Math.random() * 10) + 1,
          xp: Math.floor(Math.random() * 10) + 1,
          completed: gameCompletionStatus[`${ageGroup}-${i}`] || false,
          isSpecial: false,
          path: `/student/${category}/${ageGroup}/game-${i}`,
          index: i - 1,
        });
      }
    }

    return games;
  };

  const [games, setGames] = useState([]);
  const [categoryStats, setCategoryStats] = useState({
    totalGames: 0,
    completedGames: 0,
    coinsEarned: 0,
    xpGained: 0
  });

  useEffect(() => {
    setGames(generateGamesData());
    // eslint-disable-next-line
  }, [gameCompletionStatus]);

  // Calculate category stats from games and completion data
  useEffect(() => {
    const calculateStats = () => {
      if (games.length === 0) {
        // Reset stats when no games
        setCategoryStats({
          totalGames: 0,
          completedGames: 0,
          coinsEarned: 0,
          xpGained: 0
        });
        return;
      }

      const totalGames = games.length;
      let completedGames = 0;
      let totalCoinsEarned = 0;
      let totalXPGained = 0;
      
      // Track unique game IDs to prevent double counting
      const processedGameIds = new Set();
      
      // Create a Set of valid game IDs from the games array for faster lookup
      const validGameIds = new Set(games.map(game => game.id));

      // Calculate stats for each game using stored progress data
      games.forEach((game) => {
        // Skip if we've already processed this game ID (prevent duplicates)
        if (processedGameIds.has(game.id)) {
          console.warn(`Duplicate game ID found: ${game.id}, skipping duplicate`);
          return;
        }
        
        // Skip if game ID is not valid (shouldn't happen, but safety check)
        if (!game.id) {
          console.warn(`Game without ID found, skipping`);
          return;
        }
        
        processedGameIds.add(game.id);
        
        // Only check completion status for games that exist in the current games array
        // This prevents counting games from other categories
        const isCompleted = validGameIds.has(game.id) && (gameCompletionStatus[game.id] === true || game.completed === true);
        
        if (!isCompleted) return;
        
        completedGames++;
        
        // Use progress data if available (from loadGameCompletionStatus)
        const progress = gameProgressData[game.id];
        
        if (progress) {
          // Use actual coins earned from backend (should be 5 per game from game card)
          // If totalCoinsEarned is available, use it; otherwise use game card coins
          if (progress.totalCoinsEarned > 0) {
            totalCoinsEarned += progress.totalCoinsEarned;
          } else {
            // Fallback to game card coins if progress doesn't have coins yet
            totalCoinsEarned += game.coins || 5;
          }
          
          // XP should match the XP on the game card (10 XP per game)
          // Use game.xp from the game card, which is the correct XP value
          totalXPGained += game.xp || 10;
        } else {
          // Fallback: if progress data not loaded yet, use game card values
          // This ensures stats are shown even during initial load
          totalCoinsEarned += game.coins || 5;
          totalXPGained += game.xp || 10;
        }
      });

      // Ensure completedGames never exceeds totalGames (safety check)
      const finalCompletedGames = Math.min(completedGames, totalGames);
      
      // Additional validation: log if there's a mismatch
      if (completedGames > totalGames) {
        console.warn(`⚠️ Completed games (${completedGames}) exceeds total games (${totalGames}). This should not happen.`);
      }

      setCategoryStats({
        totalGames,
        completedGames: finalCompletedGames,
        coinsEarned: totalCoinsEarned,
        xpGained: totalXPGained
      });
    };

    calculateStats();
  }, [games, gameCompletionStatus, gameProgressData]);

  // Get game ID by index for sequential unlocking
  const getGameIdByIndex = useCallback((index) => {
    if (category === 'financial-literacy' && ageGroup === 'kids') {
        const gameIds = financegGameIdsKids;
        return gameIds[index];
    } else if (category === 'financial-literacy' && (ageGroup === 'teens' || ageGroup === 'teen')) {
        const gameIds = financegGameIdsTeen;
        return gameIds[index];
    } else if (category === 'brain-health' && ageGroup === 'kids') {
        const gameIds = brainGamesKidsIds;
        return gameIds[index];
    } else if (category === 'brain-health' && (ageGroup === 'teens' || ageGroup === 'teen')) {
        const gameIds = brainGamesTeenIds;
        return gameIds[index];
    } else if (category === 'uvls' && ageGroup === 'kids') {
        const gameIds = uvlsGamesKidsIds;
        return gameIds[index];
    } else if (category === 'uvls' && (ageGroup === 'teens' || ageGroup === 'teen')) {
        const gameIds = uvlsGamesTeenIds;
        return gameIds[index];
    } else if (category === 'digital-citizenship' && ageGroup === 'kids') {
        const gameIds = dcosGamesKidsIds;
        return gameIds[index];
    } else if (category === 'digital-citizenship' && (ageGroup === 'teens' || ageGroup === 'teen')) {
        const gameIds = dcosGamesTeenIds;
        return gameIds[index];
    } else if (category === 'moral-values' && ageGroup === 'kids') {
        const gameIds = moralGamesKidsIds;
        return gameIds[index];
    } else if (category === 'moral-values' && (ageGroup === 'teens' || ageGroup === 'teen')) {
        const gameIds = moralGamesTeenIds;
        return gameIds[index];
    } else if (category === 'ai-for-all' && ageGroup === 'kids') {
        const gameIds = aiGamesKidsIds;
        return gameIds[index];
    } else if (category === 'ai-for-all' && (ageGroup === 'teens' || ageGroup === 'teen')) {
        const gameIds = aiGamesTeenIds;
        return gameIds[index];
    } else if (category === 'ehe' && ageGroup === 'kids') {
        const gameIds = eheGameIdsKids;
        return gameIds[index];
    } else if (category === 'ehe' && (ageGroup === 'teens' || ageGroup === 'teen')) {
        const gameIds = eheGameIdsTeen;
        return gameIds[index];
    } else if (category === 'civic-responsibility' && ageGroup === 'kids') {
        const gameIds = crgcGameIdsKids;
        return gameIds[index];
    } else if (category === 'civic-responsibility' && (ageGroup === 'teens' || ageGroup === 'teen')) {
        const gameIds = crgcGameIdsTeens;
        return gameIds[index];
    } else if (category === 'health-male' && ageGroup === 'kids') {
        const gameIds = healthMaleGameIdsKids;
        return gameIds[index];
    } else if (category === 'health-male' && (ageGroup === 'teens' || ageGroup === 'teen')) {
        const gameIds = healthMaleGameIdsTeen;
        return gameIds[index];
    } else if (category === 'health-female' && ageGroup === 'kids') {
        const gameIds = healthFemaleGameIdsKids;
        return gameIds[index];
    } else if (category === 'health-female' && (ageGroup === 'teens' || ageGroup === 'teen')) {
        const gameIds = healthFemaleGameIdsTeen;
        return gameIds[index];

    } else if (category === 'sustainability') {
        // For sustainability kids and teens games
        if (ageGroup === 'kids') {
            const gameIds = sustainabilityGameIdsKids;
            return gameIds[index];
        } else if (ageGroup === 'teens' || ageGroup === 'teen') {
            const gameIds = sustainabilityGameIdsTeen;
            return gameIds[index];
        } else if (ageGroup === 'solar-and-city') {
            const gameIds = [
                'sustainability-solar-1', 'sustainability-solar-2', 'sustainability-solar-3', 'sustainability-solar-4',
                'sustainability-solar-5', 'sustainability-solar-6', 'sustainability-solar-7', 'sustainability-solar-8',
                'sustainability-solar-9', 'sustainability-solar-10', 'sustainability-solar-11', 'sustainability-solar-12',
                'sustainability-solar-13', 'sustainability-solar-14', 'sustainability-solar-15', 'sustainability-solar-16',
                'sustainability-solar-17', 'sustainability-solar-18', 'sustainability-solar-19', 'sustainability-solar-20'
            ];
            return gameIds[index];
        } else if (ageGroup === 'waste-and-recycle') {
            const gameIds = [
            'sustainability-waste-1', 'sustainability-waste-2', 'sustainability-waste-3', 'sustainability-waste-4',
                'sustainability-waste-5', 'sustainability-waste-6', 'sustainability-waste-7', 'sustainability-waste-8',
                'sustainability-waste-9', 'sustainability-waste-10', 'sustainability-waste-11', 'sustainability-waste-12',
                'sustainability-waste-13', 'sustainability-waste-14', 'sustainability-waste-15', 'sustainability-waste-16',
                'sustainability-waste-17', 'sustainability-waste-18', 'sustainability-waste-19', 'sustainability-waste-20'
            ];
            return gameIds[index];
        } else if (ageGroup === 'carbon-and-climate') {
            const gameIds = [
                'sustainability-carbon-1', 'sustainability-carbon-2', 'sustainability-carbon-3', 'sustainability-carbon-4',
                'sustainability-carbon-5', 'sustainability-carbon-6', 'sustainability-carbon-7', 'sustainability-carbon-8',
                'sustainability-carbon-9', 'sustainability-carbon-10', 'sustainability-carbon-11', 'sustainability-carbon-12',
                'sustainability-carbon-13', 'sustainability-carbon-14', 'sustainability-carbon-15', 'sustainability-carbon-16',
                'sustainability-carbon-17', 'sustainability-carbon-18', 'sustainability-carbon-19', 'sustainability-carbon-20'
            ];
            return gameIds[index];
        } else if (ageGroup === 'water-and-energy') {
            const gameIds = [
                'sustainability-energy-1', 'sustainability-energy-2', 'sustainability-energy-3', 'sustainability-energy-4',
                'sustainability-energy-5', 'sustainability-energy-6', 'sustainability-energy-7', 'sustainability-energy-8',
                'sustainability-energy-9', 'sustainability-energy-10', 'sustainability-energy-11', 'sustainability-energy-12',
                'sustainability-energy-13', 'sustainability-energy-14', 'sustainability-energy-15', 'sustainability-energy-16',
                'sustainability-energy-17', 'sustainability-energy-18', 'sustainability-energy-19', 'sustainability-energy-20'
            ];
            return gameIds[index];
        } else {
            // Default case
            const gameIds = [
                'sustainability-1', 'sustainability-2', 'sustainability-3', 'sustainability-4'
            ];
            return gameIds[index];
        }
    }
  }, [category, ageGroup]);

  // Get 1-based game index from game object or ID
  const getGameIndex = (game) => {
    if (game?.index !== undefined) return game.index;
    if (game?.id) {
      const parts = game.id.split("-");
      const parsed = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(parsed)) return parsed;
    }
    return null;
  };

  // Tiered replay cost based on game index
  const getReplayCost = (game) => {
    const index = getGameIndex(game);
    if (!index) return 2;
    if (index <= 25) return 2;
    if (index <= 50) return 4;
    if (index <= 75) return 6;
    return 8;
  };

  // Find the currently open/active game (first unlocked, not completed game)
  const getCurrentlyOpenGameIndex = useCallback(() => {
    if (games.length === 0) return -1;
    
    return games.findIndex((g, idx) => {
      // Check if game is unlocked
      let unlocked = true;
      if ((category === 'financial-literacy' ||
           category === 'brain-health' ||
           category === 'uvls' ||
           category === 'digital-citizenship' ||
           category === 'moral-values' ||
           category === 'ai-for-all' ||
           category === 'ehe' ||
           category === 'civic-responsibility' ||
           category === 'health-male' ||
           category === 'health-female' ||
           category === 'sustainability') && 
           (ageGroup === 'kids' || ageGroup === 'teens' || ageGroup === 'teen')) {
        // First game is always unlocked
        if (idx === 0) {
          unlocked = true;
        } else {
          // Check if previous game is completed
          const prevGameId = getGameIdByIndex(idx - 1);
          // Strict check: previous game must exist and be explicitly marked as completed (true)
          // Also check if previous game exists in the games array
          const prevGame = games[idx - 1];
          const prevGameCompleted = prevGameId && gameCompletionStatus[prevGameId] === true;
          
          // Only unlock if previous game exists and is completed
          unlocked = prevGame && prevGameId && prevGameCompleted;
          
          // Debug logging for unlocking issues
          if (idx === 1) {
            console.log('🔍 Checking unlock for game at index 1:', {
              gameId: g.id,
              gameTitle: g.title,
              prevGameId,
              prevGameTitle: prevGame?.title,
              prevGameCompleted,
              prevGameStatus: gameCompletionStatus[prevGameId],
              unlocked,
              gameCompletionStatusKeys: Object.keys(gameCompletionStatus).filter(k => k.includes('dcos-teen')),
              allDcosTeenStatuses: Object.keys(gameCompletionStatus).filter(k => k.includes('dcos-teen')).map(k => ({ key: k, value: gameCompletionStatus[k] }))
            });
          }
          if (idx === 44 && !unlocked) {
            console.log('🔒 Game not unlocked:', {
              gameId: g.id,
              gameTitle: g.title,
              prevGameId,
              prevGameTitle: prevGame?.title,
              prevGameCompleted,
              prevGameStatus: gameCompletionStatus[prevGameId],
              allStatuses: Object.keys(gameCompletionStatus).filter(k => k.includes('finance-kids-4'))
            });
          }
        }
      }
      
      // Check if game is completed
      const completed = gameCompletionStatus[g.id] === true;
      return unlocked && !completed;
    });
  }, [games, gameCompletionStatus, category, ageGroup, getGameIdByIndex]);

  // Reset scroll flag when category or ageGroup changes
  useEffect(() => {
    hasScrolledToCurrentGame.current = false;
  }, [category, ageGroup]);

  // Auto-scroll to current game card when page loads
  useEffect(() => {
    // Only scroll once when page first loads
    if (hasScrolledToCurrentGame.current) return;
    
    // Wait for games and completion status to be loaded
    if (games.length === 0 || Object.keys(gameCompletionStatus).length === 0) return;
    
    // Get the current game index
    const currentGameIndex = getCurrentlyOpenGameIndex();
    if (currentGameIndex === -1) return; // No current game found
    
    const currentGame = games[currentGameIndex];
    if (!currentGame) return;
    
    // Wait a bit for DOM to render cards (increase delay to account for batched loading)
    const scrollTimer = setTimeout(() => {
      const gameCardElement = gameCardRefs.current[currentGame.id];
      
      if (gameCardElement) {
        hasScrolledToCurrentGame.current = true;
        
        // Smooth scroll to the game card with offset for better visibility
        gameCardElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });

        console.log('✅ Scrolled to current game:', currentGame.title, 'at index', currentGameIndex);
      } else {
        // Retry once if element not found (cards might still be rendering)
        setTimeout(() => {
          const retryElement = gameCardRefs.current[currentGame.id];
          if (retryElement) {
            hasScrolledToCurrentGame.current = true;
            retryElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'nearest'
            });
            console.log('✅ Scrolled to current game (retry):', currentGame.title);
          }
        }, 500);
      }
    }, 1200); // Delay to ensure cards are rendered (accounting for batched API loading)
    
    return () => clearTimeout(scrollTimer);
  }, [games, gameCompletionStatus, category, ageGroup, getCurrentlyOpenGameIndex]);

  useEffect(() => {
    const replayTargetId = location.state?.openReplayUnlockGameId;
    if (!replayTargetId) return;
    if (games.length === 0) return;

    const targetGame = games.find((game) => game.id === replayTargetId);
    if (!targetGame) return;

    const progress = gameProgressData[replayTargetId];
    if (progress?.replayUnlocked === true) {
      navigate(location.pathname, { replace: true, state: {} });
      return;
    }

    hasScrolledToCurrentGame.current = true;

    const scrollTimer = setTimeout(() => {
      const gameCardElement = gameCardRefs.current[replayTargetId];
      if (gameCardElement) {
        gameCardElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
    }, 300);

    setSelectedGameForReplay(targetGame);
    setShowReplayConfirmModal(true);
    navigate(location.pathname, { replace: true, state: {} });

    return () => clearTimeout(scrollTimer);
  }, [games, gameProgressData, location.state, location.pathname, navigate]);

  useEffect(() => {
    if (user?.dateOfBirth) {
      const age = calculateUserAge(user.dateOfBirth);
      setUserAge(age);
    }
  }, [user]);

  // Check pillar access based on subscription
  const categoryTitle = getCategoryTitle(category);
  const pillarAccess = canAccessPillar(categoryTitle);
  const isPillarLocked = !pillarAccess.allowed;
  const gamesPerPillar = getGamesPerPillar();

  // Check if this age group is accessible
  const isAccessible = canAccessGame(ageGroup, userAge);
  const isLocked = !isAccessible || isPillarLocked;

  // Check if unlock requirements are met
  const unlockRequirements = () => {
    if (isPillarLocked) {
      return pillarAccess.message || "Upgrade to premium to access this pillar.";
    }

    if (userAge === null) {
      return "We couldn't verify your age. Update your profile with your date of birth to unlock this section.";
    }

    if (!isAccessible) {
      if (ageGroup === "kids" && userAge >= 18) {
        return `Available for learners under 18. You are ${userAge} years old.`;
      }

      if (ageGroup === "adults" && userAge < 18) {
        return `Available at age 18. You are ${userAge} years old.`;
      }

      if (ageGroup === "teens" && userAge >= 18) {
        return `Available for learners under 18. You are ${userAge} years old.`;
      }
    }

    // Additional adult unlocking requirements can be added here
    return "";
  };

  const requirements = unlockRequirements();

  // Handle game play
  const handlePlayGame = (game) => {
    // Check subscription-based access first - pass game index to check if this specific game is within limit
    const gamesCompleted = categoryStats.completedGames || 0;
    const subscriptionAccess = canAccessGameBySubscription(categoryTitle, gamesCompleted, game.index);
    if (!subscriptionAccess.allowed) {
      toast.error(
        subscriptionAccess.reason || `Upgrade to premium to access more than ${gamesPerPillar} games per pillar.`,
        {
          duration: 4000,
          position: "bottom-center",
          icon: "🔒",
        }
      );
      return;
    }

    if (isLocked) {
      toast.error(requirements || "This section is locked.", {
        duration: 4000,
        position: "bottom-center",
        icon: "🔒",
      });
      return;
    }

    // Check if game is unlocked for sequential play (for finance, brain health, UVLS, DCOS, Moral Values, AI For All, EHE, CRGC, Health Male, Health Female, Sustainability, and kids and teens games)
    if (
      (category === "financial-literacy" ||
        category === "brain-health" ||
        category === "uvls" ||
        category === "digital-citizenship" ||
        category === "moral-values" ||
        category === "ai-for-all" ||
        category === "ehe" ||
        category === "civic-responsibility" ||
        category === "health-male" ||
        category === "health-female" ||
        category === "sustainability") &&
      (ageGroup === "kids" || ageGroup === "teens" || ageGroup === "teen")
    ) {
      if (!isGameUnlocked(game.index)) {
        toast.error("Complete the previous game first to unlock this game!", {
          duration: 4000,
          position: "bottom-center",
          icon: "🔒",
        });
        return;
      }

      // Check if game is already fully completed
      if (isGameFullyCompleted(game.id)) {
        // Check if replay is unlocked
        const progress = gameProgressData[game.id];
        if (progress && progress.replayUnlocked === true) {
          // Game is replayable, allow playing
          if (game.isSpecial && game.path) {
            // Find next game in the sequence
            const nextGame = games.find(g => g.index === game.index + 1 && g.isSpecial && g.path);
            const nextGamePath = nextGame ? nextGame.path : null;
            const nextGameId = nextGame ? nextGame.id : null;
            
            navigate(game.path, { 
              state: { 
                coinsPerLevel: game.coins || null,
                totalCoins: game.coins || 5,
                totalXp: game.xp || 10,
                badgeName: game.badgeName || null,
                badgeImage: game.badgeImage || null,
                isBadgeGame: game.isBadgeGame || false,
                isReplay: true,
                returnPath: location.pathname,
                nextGamePath: nextGamePath, // Path to next game for Continue button
                nextGameId: nextGameId, // Next game ID for status checking
              } 
            });
            return;
          }
        } else {
          // Game is completed but replay not unlocked
        toast.error(
            "You've already collected all HealCoins for this game. Unlock replay to play again!",
          {
            duration: 4000,
            position: "bottom-center",
            icon: "🔒",
          }
        );
        return;
        }
      }
    }

    // Special handling for all special games (finance, brain-health, UVLS, DCOS, etc.) with isSpecial=true
    // Also handle civic responsibility games which should always navigate to their paths
    if ((game.isSpecial && game.path) || 
        (category === "civic-responsibility" && (ageGroup === "kids" || ageGroup === "teens" || ageGroup === "teen") && game.path)) {
      // Check if this is a replay
      const progress = gameProgressData[game.id];
      const isReplay = progress && progress.replayUnlocked === true && progress.fullyCompleted;
      
      // Find next game in the sequence
      const nextGame = games.find(g => g.index === game.index + 1 && g.isSpecial && g.path);
      const nextGamePath = nextGame ? nextGame.path : null;
      const nextGameId = nextGame ? nextGame.id : null;
      
      // Pass coinsPerLevel, totalCoins, totalXp, replay status, and next game path via navigation state
      navigate(game.path, { 
        state: { 
          gameId: game.id, // Pass gameId to help components identify which game to render
          coinsPerLevel: game.coins || null, // For backward compatibility
          totalCoins: game.coins || 5, // Total coins for full completion
          totalXp: game.xp || 10, // Total XP for full completion
          badgeName: game.badgeName || null,
          badgeImage: game.badgeImage || null,
          isBadgeGame: game.isBadgeGame || false,
          isReplay: isReplay || false,
          returnPath: location.pathname,
          nextGamePath: nextGamePath, // Path to next game for Continue button
          nextGameId: nextGameId, // Next game ID for status checking
        } 
      });
      return;
    }

    // In a real app, this would navigate to the actual game
    toast.success(`Starting ${game.title}...`, {
      duration: 2000,
      position: "bottom-center",
      icon: "🎮",
    });

    // Simulate game completion for demo
    setTimeout(() => {
      setCompletedGames((prev) => new Set([...prev, game.id]));
      toast.success(
        `Completed ${game.title}! +${game.coins} coins, +${game.xp} XP`,
        {
          duration: 3000,
          position: "bottom-center",
          icon: "🏆",
        }
      );
    }, 1000);
  };

  // Handle replay unlock button click - show confirmation modal
  const handleUnlockReplayClick = (game, e) => {
    e?.stopPropagation(); // Prevent card click
    
    if (processingReplay) return;
    
    const replayCost = getReplayCost(game);
    
    // Check if game is subscription-locked (freemium users beyond first 5 games)
    const gamesCompleted = categoryStats.completedGames || 0;
    const subscriptionAccess = canAccessGameBySubscription(categoryTitle, gamesCompleted, game.index);
    if (!subscriptionAccess.allowed) {
      toast.error(
        subscriptionAccess.reason || "This game is not available in your current plan. Upgrade to premium to access more games.",
        {
          duration: 5000,
          position: "bottom-center",
          icon: "🔒",
        }
      );
      return;
    }
    
    // Check wallet balance
    if (!wallet || wallet.balance < replayCost) {
      toast.error(
        `Insufficient balance! You need ${replayCost} HealCoins to unlock replay.`,
        {
          duration: 4000,
          position: "bottom-center",
          icon: "💰",
        }
      );
      return;
    }

    // Show confirmation modal
    setSelectedGameForReplay(game);
    setShowReplayConfirmModal(true);
  };

  // Handle replay unlock confirmation
  const handleUnlockReplay = async () => {
    if (!selectedGameForReplay) return;
    
    const game = selectedGameForReplay;
    const replayCost = getReplayCost(game);
    
    setProcessingReplay(true);
    setShowReplayConfirmModal(false);

    try {
      console.log('🔓 Attempting to unlock replay for game:', {
        gameId: game.id,
        gameTitle: game.title,
        walletBalance: wallet?.balance,
        required: replayCost
      });
      
      const response = await api.post(`/api/game/unlock-replay/${game.id}`);
      console.log('✅ Unlock replay response:', response.data);
      
      if (response.data.replayUnlocked) {
        // Update replayable games
        setReplayableGames(prev => new Set([...prev, game.id]));
        
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

        // Reload game completion status to update UI
        loadGameCompletionStatus();

        toast.success(response.data.message || 'Replay unlocked! Opening game...', {
          duration: 2000,
          position: "bottom-center",
          icon: "🎮",
        });

        // Navigate to the game after a short delay
        if (game.path) {
          // Find next game in the sequence (if applicable)
          let nextGamePath = null;
          let nextGameId = null;
          
          if (game.isSpecial) {
            const nextGame = games.find(g => g.index === game.index + 1 && g.isSpecial && g.path);
            nextGamePath = nextGame ? nextGame.path : null;
            nextGameId = nextGame ? nextGame.id : null;
          }
          
          setTimeout(() => {
            navigate(game.path, { 
              state: { 
                coinsPerLevel: game.coins || null,
                totalCoins: game.coins || 5,
                totalXp: game.xp || 10,
                badgeName: game.badgeName || null,
                badgeImage: game.badgeImage || null,
                isBadgeGame: game.isBadgeGame || false,
                isReplay: true, // Mark as replay since we just unlocked it
                returnPath: location.pathname,
                nextGamePath: nextGamePath,
                nextGameId: nextGameId,
              } 
            });
          }, 500); // Small delay to let toast show
        }
      } else {
        console.warn('⚠️ Response did not indicate replay was unlocked:', response.data);
        toast.error('Failed to unlock replay. Please try again.', {
          duration: 4000,
          position: "bottom-center",
          icon: "❌",
        });
      }
    } catch (error) {
      console.error('Failed to unlock replay:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        gameId: game.id,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.error || error.message || 'Failed to unlock replay. Please try again.';
      toast.error(errorMessage, {
        duration: 5000,
        position: "bottom-center",
        icon: "❌",
      });
    } finally {
      setProcessingReplay(false);
      setSelectedGameForReplay(null);
    }
  };

  // Handle cancel replay unlock
  const handleCancelReplayUnlock = () => {
    setShowReplayConfirmModal(false);
    setSelectedGameForReplay(null);
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "from-green-400 to-emerald-500";
      case "Medium":
        return "from-yellow-400 to-orange-500";
      case "Hard":
        return "from-red-400 to-pink-500";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  // Get card color based on game state and index
  const getCardColor = (index, isUnlocked, isCompleted, isFullyCompleted, needsReplayUnlock, isLocked, currentlyOpenIndex) => {
    const isCurrentlyOpen = index === currentlyOpenIndex && isUnlocked && !isCompleted && !isFullyCompleted;

    if (isLocked && !needsReplayUnlock) {
      // Locked games
      return {
        bg: "bg-white",
        border: "border-gray-200",
        shadow: "shadow-sm",
        animated: false
      };
    } else if (isCompleted || isFullyCompleted || needsReplayUnlock) {
      // Completed games - keep green gradient
      return {
        bg: "bg-gradient-to-br from-green-50 to-emerald-50",
        border: "border-green-200",
        shadow: "shadow-md",
        animated: false
      };
    } else if (isCurrentlyOpen) {
      // Currently open/active game - vibrant color with animation
      const colors = [
        { bg: "bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500", border: "border-blue-300" },
        { bg: "bg-gradient-to-br from-indigo-400 via-blue-500 to-cyan-500", border: "border-indigo-300" },
        { bg: "bg-gradient-to-br from-purple-400 via-pink-500 to-red-500", border: "border-purple-300" },
        { bg: "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500", border: "border-cyan-300" },
        { bg: "bg-gradient-to-br from-pink-400 via-rose-500 to-orange-500", border: "border-pink-300" },
      ];
      const colorIndex = index % colors.length;
      return {
        bg: colors[colorIndex].bg,
        border: colors[colorIndex].border,
        shadow: "shadow-xl",
        animated: true,
        textColor: "text-white"
      };
    } else if (isUnlocked) {
      // Not played yet - minimalistic colorful
      const colors = [
        { bg: "bg-gradient-to-br from-blue-50 to-indigo-50", border: "border-blue-200", accent: "from-blue-400 to-indigo-500" },
        { bg: "bg-gradient-to-br from-purple-50 to-pink-50", border: "border-purple-200", accent: "from-purple-400 to-pink-500" },
        { bg: "bg-gradient-to-br from-cyan-50 to-blue-50", border: "border-cyan-200", accent: "from-cyan-400 to-blue-500" },
        { bg: "bg-gradient-to-br from-pink-50 to-rose-50", border: "border-pink-200", accent: "from-pink-400 to-rose-500" },
        { bg: "bg-gradient-to-br from-indigo-50 to-purple-50", border: "border-indigo-200", accent: "from-indigo-400 to-purple-500" },
        { bg: "bg-gradient-to-br from-orange-50 to-amber-50", border: "border-orange-200", accent: "from-orange-400 to-amber-500" },
        { bg: "bg-gradient-to-br from-emerald-50 to-teal-50", border: "border-emerald-200", accent: "from-emerald-400 to-teal-500" },
        { bg: "bg-gradient-to-br from-violet-50 to-purple-50", border: "border-violet-200", accent: "from-violet-400 to-purple-500" },
      ];
      const colorIndex = index % colors.length;
      return {
        bg: colors[colorIndex].bg,
        border: colors[colorIndex].border,
        shadow: "shadow-md",
        animated: false,
        accent: colors[colorIndex].accent
      };
    } else {
      // Default
      return {
        bg: "bg-white",
        border: "border-gray-200",
        shadow: "shadow-sm",
        animated: false
      };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <UpgradePrompt
            feature="pillar"
            onClose={() => setShowUpgradeModal(false)}
          />
        )}

        {/* Replay Unlock Confirmation Modal */}
        <AnimatePresence>
          {showReplayConfirmModal && selectedGameForReplay && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
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
                  {/* Header */}
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

                  {/* Content */}
                  <div className="mb-6">
                    <p className="text-gray-700 mb-4">
                      Unlock replay for <span className="font-semibold text-gray-900">"{selectedGameForReplay.title}"</span>?
                    </p>
                    
                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 mb-4 border border-yellow-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700 font-medium">Cost:</span>
                        <span className="text-2xl font-bold text-amber-600">{getReplayCost(selectedGameForReplay)} HealCoins</span>
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

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancelReplayUnlock}
                      disabled={processingReplay}
                      className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUnlockReplay}
                      disabled={processingReplay}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {processingReplay ? (
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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(`/student/dashboard/${getDashboardCategorySlug(category)}`)}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                {getCategoryIcon(category)}
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {getCategoryTitle(category)}
                </h1>
                <p className="text-lg text-gray-600">
                  {getAgeGroupTitle(ageGroup)} - {games.length || categoryStats.totalGames || 0} Games
                </p>
              </div>
            </div>
            {/* HealCoins Button */}
            {(user?.role === "student" || user?.role === "school_student") && (
              <motion.button
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 border-2 border-yellow-500 cursor-pointer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/student/wallet")}
              >
                <Wallet className="w-4 h-4" />
                <span className="font-black">{wallet?.balance || 0}</span>
                <span className="hidden sm:inline text-xs">Coins</span>
              </motion.button>
            )}
          </div>

          {isLocked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg mb-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <Lock className="w-6 h-6" />
                <h3 className="text-xl font-bold">Locked</h3>
              </div>
              <p className="text-lg">{requirements}</p>
              {isPillarLocked && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="mt-4 bg-white text-red-600 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors"
                >
                  Upgrade to Premium
                </button>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Gamepad2 className="w-5 h-5 text-indigo-500" />
              <span className="text-gray-600 font-medium">Total Games</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{categoryStats.totalGames}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-600 font-medium">Completed</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {(category === 'financial-literacy' ||
                category === 'brain-health' ||
                category === 'uvls' ||
                category === 'digital-citizenship' ||
                category === 'moral-values' ||
                category === 'ai-for-all' ||
                category === 'civic-responsibility' ||
                category === 'health-male' ||
                category === 'health-female' ||
                category === 'ehe' ||
                category === 'sustainability') && 
                (ageGroup === 'kids' || ageGroup === 'teens' || ageGroup === 'teen')

                ? Object.values(gameCompletionStatus).filter((status) => status)
                    .length
                : completedGames.size}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Coins className="w-5 h-5 text-green-500" />
              <span className="text-gray-600 font-medium">Coins Earned</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {categoryStats.coinsEarned}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-purple-500" />
              <span className="text-gray-600 font-medium">XP Gained</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {categoryStats.xpGained}
            </p>
          </div>
        </motion.div>

        {/* Games Grid */}
        {isLoadingProgress ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading games...</p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {games.map((game, index) => {
            // Check subscription-based access for freemium users - pass game index to check if this specific game is within limit
            const gamesCompleted = categoryStats.completedGames || 0;
            const subscriptionAccess = canAccessGameBySubscription(categoryTitle, gamesCompleted, index);
            const isSubscriptionLocked = !subscriptionAccess.allowed;
            
            const isUnlocked =
              (category === 'financial-literacy' ||
                category === 'brain-health' ||
                category === 'uvls' ||
                category === 'digital-citizenship' ||
                category === 'moral-values' ||
                category === 'ai-for-all' ||
                category === 'civic-responsibility' ||
                category === 'health-male' ||
                category === 'health-female' ||
                category === 'ehe' ||
                category === 'sustainability') && 
                (ageGroup === 'kids' || ageGroup === 'teens' || ageGroup === 'teen')

                ? isGameUnlocked(index) && !isSubscriptionLocked
                : !isSubscriptionLocked; // For other categories, check subscription only
            const isFullyCompleted =
              (category === 'financial-literacy' ||
               category === 'uvls' ||
               category === 'brain-health' ||
               category === 'digital-citizenship' ||
               category === 'moral-values' ||
               category === 'ai-for-all' ||
               category === 'civic-responsibility' ||
               category === 'health-male' ||
               category === 'health-female' ||
               category === 'ehe' ||
               category === 'sustainability') &&
              (ageGroup === "kids" || ageGroup === "teens" || ageGroup=== 'teen')
                ? isGameFullyCompleted(game.id)
                : false;
            const progress = gameProgressData[game.id];
            // Explicitly check for replayUnlocked === true (not just truthy)
            const canReplay = isFullyCompleted && progress && progress.replayUnlocked === true;
            // Only show replay unlock button if game is fully completed, replay is not unlocked, AND game is not subscription-locked
            // Freemium users cannot unlock replay for games beyond the first 5 per pillar
            const needsReplayUnlock = isFullyCompleted && (!progress || progress.replayUnlocked !== true) && !isSubscriptionLocked;
            const replayCost = getReplayCost(game);
            // Game is locked if:
            // 1. Fully completed AND replay is not unlocked, OR
            // 2. Not unlocked (sequential or subscription lock), OR
            // 3. Subscription locked (freemium users beyond first 5 games)
            const isLocked = (isFullyCompleted && !canReplay) || !isUnlocked || isSubscriptionLocked;
            const isCompleted = isFullyCompleted || game.completed || gameCompletionStatus[game.id];

            // Get currently open game index
            const currentlyOpenIndex = getCurrentlyOpenGameIndex();
            
            // Get card styling based on state
            const cardStyle = getCardColor(index, isUnlocked, isCompleted, isFullyCompleted, needsReplayUnlock, isLocked, currentlyOpenIndex);
            const isCurrentlyOpen = cardStyle.animated;

            return (
              <motion.div
                key={game.id}
                ref={(el) => {
                  if (el) {
                    gameCardRefs.current[game.id] = el;
                  }
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: isCurrentlyOpen ? [1, 1.02, 1] : 1,
                }}
                transition={{ 
                  delay: 0.05 * index,
                  scale: isCurrentlyOpen ? {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  } : {}
                }}
                whileHover={{ 
                  y: isUnlocked && !isLocked ? -8 : 0,
                  scale: isUnlocked && !isLocked ? 1.02 : 1,
                }}
                className={`group rounded-2xl p-6 border-2 transition-all duration-300 relative overflow-hidden ${
                  cardStyle.bg
                } ${cardStyle.border} ${cardStyle.shadow} ${
                  isLocked && !needsReplayUnlock
                    ? "cursor-not-allowed"
                    : "cursor-pointer hover:shadow-xl"
                } ${
                  isCurrentlyOpen ? "ring-4 ring-blue-400 ring-opacity-75 shadow-2xl shadow-blue-400/50" : ""
                } ${
                  !isCompleted && !isFullyCompleted && isUnlocked && !isCurrentlyOpen 
                    ? "hover:border-opacity-80" 
                    : ""
                }`}
                onClick={(e) => {
                  // Don't trigger card click if clicking on unlock button
                  if (e.target.closest('button')) {
                    return;
                  }
                  if (!isLocked || needsReplayUnlock) {
                    handlePlayGame(game);
                  }
                }}
              >
                {/* Locked overlay for additional visual indication - only show for truly locked games (not completed games needing replay unlock) */}
                {isLocked && !isFullyCompleted && (
                  <div className="absolute inset-0 bg-transparent flex items-center justify-center rounded-2xl pointer-events-none">
                    <Lock className="w-8 h-8 text-gray-500" />
                  </div>
                )}

                <div className="flex items-start justify-between mb-4 relative z-10">
                  <motion.div
                    animate={isCurrentlyOpen ? {
                      scale: [1, 1.1, 1],
                      rotate: [0, 10, -10, 0]
                    } : {}}
                    transition={isCurrentlyOpen ? {
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    } : {}}
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getDifficultyColor(
                      game.difficulty
                    )} flex items-center justify-center text-white shadow-lg ${
                      isCurrentlyOpen ? "ring-2 ring-white/50" : ""
                    }`}
                  >
                    {game.icon}
                  </motion.div>
                  <div className="flex items-center gap-2">
                  {game.completed && !isFullyCompleted && (
                      <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-md">
                        <Trophy className="w-4 h-4 text-yellow-900" />
                    </div>
                  )}
                  {isFullyCompleted && (
                      <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center relative z-10 shadow-md">
                        <Trophy className="w-4 h-4 text-yellow-900" />
                      </div>
                    )}
                    {isFullyCompleted && !canReplay && (
                      <div className="flex items-center gap-1">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center relative z-10">
                          <Lock className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center relative z-10">
                          <Play className="w-4 h-4 text-indigo-600" />
                        </div>
                    </div>
                  )}
                  {isLocked && !isFullyCompleted && (
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center relative z-10">
                      <Lock className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                  </div>
                </div>

                {/* Enhanced animated background for currently open game with blue glow */}
                {isCurrentlyOpen && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-blue-400/25 to-blue-600/30 rounded-2xl animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/40 via-purple-400/30 to-blue-500/40 rounded-2xl blur-sm" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 rounded-2xl opacity-20 blur-lg animate-pulse" />
                  </>
                )}

                {/* Colorful accent bar for unplayed games */}
                {!isCompleted && !isFullyCompleted && isUnlocked && !isCurrentlyOpen && (
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cardStyle.accent || 'from-blue-400 to-indigo-500'} rounded-t-2xl`} />
                )}

                <h3
                  className={`text-lg font-bold mb-2 relative z-10 ${
                    isLocked 
                      ? "text-gray-500" 
                      : isCurrentlyOpen 
                        ? "text-white drop-shadow-md" 
                        : isCompleted || isFullyCompleted
                          ? "text-gray-900"
                          : "text-gray-900"
                  }`}
                >
                  {game.title}
                  {isCurrentlyOpen && (
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="ml-2 text-sm font-normal"
                    >
                      ✨ Active
                    </motion.span>
                  )}
                </h3>

                <p
                  className={`text-sm mb-4 line-clamp-2 relative z-10 ${
                    isLocked 
                      ? "text-gray-400" 
                      : isCurrentlyOpen 
                        ? "text-white/90 drop-shadow-sm" 
                        : isCompleted || isFullyCompleted
                          ? "text-gray-600"
                          : "text-gray-600"
                  }`}
                >
                  {game.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      isLocked
                        ? "bg-gray-200 text-gray-500"
                        : isCurrentlyOpen
                          ? "bg-white/30 backdrop-blur-sm text-white border border-white/50"
                          : `bg-gradient-to-r ${getDifficultyColor(
                              game.difficulty
                            )} text-white`
                    }`}
                  >
                    <Target className="w-3 h-3" />
                    {game.difficulty}
                  </div>
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      isLocked
                        ? "bg-gray-200 text-gray-500"
                        : isCurrentlyOpen
                          ? "bg-white/30 backdrop-blur-sm text-white border border-white/50"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    <Timer className="w-3 h-3" />
                    {game.duration}
                  </div>
                </div>

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center gap-1 text-sm font-semibold ${
                        isLocked 
                          ? "text-gray-400" 
                          : isCurrentlyOpen 
                            ? "text-white drop-shadow-sm" 
                            : isCompleted || isFullyCompleted
                              ? "text-green-600"
                              : "text-green-600"
                      }`}
                    >
                      <Coins className="w-4 h-4" />
                      <span>{game.coins}</span>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm font-semibold ${
                        isLocked 
                          ? "text-gray-400" 
                          : isCurrentlyOpen 
                            ? "text-white drop-shadow-sm" 
                            : isCompleted || isFullyCompleted
                              ? "text-purple-600"
                              : "text-purple-600"
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      <span>{game.xp}</span>
                    </div>
                  </div>
                  <motion.div
                    animate={isCurrentlyOpen ? {
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    } : {}}
                    transition={isCurrentlyOpen ? {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    } : {}}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isLocked 
                        ? "bg-gray-200" 
                        : isCurrentlyOpen
                          ? "bg-white/30 backdrop-blur-sm"
                          : canReplay 
                            ? "bg-green-100" 
                            : isCompleted || isFullyCompleted
                              ? "bg-green-100"
                              : "bg-white/80 backdrop-blur-sm shadow-md"
                    }`}
                  >
                    {isLocked ? (
                      <Lock className="w-4 h-4 text-gray-500" />
                    ) : canReplay ? (
                      <RefreshCw className="w-4 h-4 text-green-600" />
                    ) : isCurrentlyOpen ? (
                      <Play className="w-4 h-4 text-white" />
                    ) : (
                      <Play className="w-4 h-4 text-indigo-600" />
                    )}
                  </motion.div>
                </div>

                {/* Replay unlock button for completed games */}
                {/* Only show if game is not subscription-locked (freemium users cannot unlock replay for games beyond first 5) */}
                {needsReplayUnlock && !isSubscriptionLocked && (
                  <div className="mt-4 pt-4 border-t border-gray-200 relative z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnlockReplayClick(game, e);
                      }}
                      disabled={processingReplay || !wallet || wallet.balance < replayCost}
                      className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 relative z-20 ${
                        processingReplay || !wallet || wallet.balance < replayCost
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white shadow-md hover:shadow-lg"
                      }`}
                      style={{ pointerEvents: 'auto' }}
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Unlock Replay ({replayCost} HealCoins)</span>
                    </button>
                    {wallet && wallet.balance < replayCost && (
                      <p className="text-xs text-red-500 mt-1 text-center">
                        Insufficient balance
                      </p>
                    )}
                  </div>
                )}
                {/* Show message if game is subscription-locked and completed */}
                {isFullyCompleted && isSubscriptionLocked && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-amber-600 text-center font-medium">
                      🔒 Replay not available. Upgrade to premium to access this game.
                    </p>
                  </div>
                )}

                {/* Replay indicator for unlocked games */}
                {canReplay && (
                  <div className="mt-2 pt-2 border-t border-green-200">
                    <div className="flex items-center justify-center gap-2 text-xs text-green-600 font-semibold">
                      <RefreshCw className="w-3 h-3" />
                      <span>Replay Unlocked (No coins on replay)</span>
                    </div>
                  </div>
                )}

                {/* Hover tooltip for locked games */}
                {isLocked && !canReplay && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-90 text-white text-xs py-2 px-3 text-center rounded-b-2xl transform translate-y-full transition-transform duration-200 group-hover:translate-y-0">
                    {isSubscriptionLocked
                      ? subscriptionAccess.reason || `Upgrade to premium to access more than ${gamesPerPillar} games per pillar.`
                      : isFullyCompleted
                        ? "Game completed! Unlock replay to play again."
                        : "Complete the previous game to unlock"}
                  </div>
                )}
              </motion.div>
            );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GameCategoryPage;
