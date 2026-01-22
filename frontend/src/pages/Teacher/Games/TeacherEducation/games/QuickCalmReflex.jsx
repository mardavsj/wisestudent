import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, CheckCircle, XCircle, Clock } from "lucide-react";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";

const QuickCalmReflex = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-13";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = 5; // Updated to 5 questions

  const [gameState, setGameState] = useState("ready"); // ready, playing, finished
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5); // 5 seconds per round
  const [showGameOver, setShowGameOver] = useState(false);
  const [currentIcons, setCurrentIcons] = useState([]);
  const [tappedIcons, setTappedIcons] = useState(new Set());
  const timerRef = useRef(null);
  const iconTimerRef = useRef(null);
  const roundRef = useRef(0);

  const TOTAL_ROUNDS = 5; // Updated to match total levels
  const ICONS_PER_ROUND = 6; // Show 6 icons at once
  const ICON_FLASH_INTERVAL = 5000; // Change icons every 3 seconds (more time to react)

  // Calming actions (correct - should tap)
  const calmingActions = [
    { id: 'breathe', icon: '🧘', label: 'Breathe', color: 'from-green-400 to-emerald-500' },
  ];

  // Non-calming actions (incorrect - should NOT tap)
  const nonCalmingActions = [
    { id: 'rush', icon: '🏃', label: 'Rush', color: 'from-red-400 to-orange-500' },
    { id: 'worry', icon: '😰', label: 'Worry', color: 'from-gray-400 to-gray-600' },
    { id: 'panic', icon: '😱', label: 'Panic', color: 'from-red-500 to-red-700' },
    { id: 'stress', icon: '😤', label: 'Stress', color: 'from-orange-500 to-red-600' },
    { id: 'complain', icon: '😠', label: 'Complain', color: 'from-red-600 to-red-800' },
  ];

  // Generate random icons for display (ensuring exactly one calming action per round)
  const generateRandomIcons = () => {
    const icons = [];

    // Ensure exactly one calming action (Breathe) per round
    if (calmingActions.length > 0) {
      const calmingAction = calmingActions[0]; // Take the first (and only) calming action
      icons.push({
        ...calmingAction,
        isCalming: true,
        uniqueId: `${Date.now()}-calming-${Math.random()}` // Unique ID for each flash
      });
    }

    // Fill remaining slots with non-calming actions
    for (let i = 1; i < ICONS_PER_ROUND; i++) {
      const nonCalmingAction = nonCalmingActions[Math.floor(Math.random() * nonCalmingActions.length)];
      icons.push({
        ...nonCalmingAction,
        isCalming: false,
        uniqueId: `${Date.now()}-noncalming-${i}-${Math.random()}` // Unique ID for each flash
      });
    }

    // Shuffle the icons so the calming action isn't always in the same position
    return icons.sort(() => Math.random() - 0.5);
  };

  // Start a new round
  const startRound = () => {
    setTappedIcons(new Set());
    setTimeLeft(5);
    roundRef.current = roundRef.current + 1;
    setCurrentRound(roundRef.current);

    // Show initial set of icons
    setCurrentIcons(generateRandomIcons());

    // Flash new icons periodically
    iconTimerRef.current = setInterval(() => {
      setCurrentIcons(generateRandomIcons());
    }, ICON_FLASH_INTERVAL);
  };

  // Handle icon tap
  const handleIconTap = (icon) => {
    if (tappedIcons.has(icon.uniqueId) || gameState !== "playing") return;

    setTappedIcons(new Set([...tappedIcons, icon.uniqueId]));

    if (icon.isCalming) {
      // Correct - tapped a calming action
      setScore(prev => prev + 1);
    } else {
      // Incorrect - tapped a non-calming action
      setMissed(prev => prev + 1);
    }
  };

  // Timer effect
  useEffect(() => {
    if (gameState !== "playing") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (iconTimerRef.current) {
        clearInterval(iconTimerRef.current);
        iconTimerRef.current = null;
      }
      return;
    }

    if (roundRef.current > TOTAL_ROUNDS) {
      setGameState("finished");
      setShowGameOver(true);
      return;
    }

    // Start countdown timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 0.1;
        if (newTime <= 0) {
          // Round time's up
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          if (iconTimerRef.current) {
            clearInterval(iconTimerRef.current);
            iconTimerRef.current = null;
          }

          // Move to next round or finish
          setTimeout(() => {
            if (roundRef.current < TOTAL_ROUNDS) {
              startRound();
            } else {
              setGameState("finished");
              setShowGameOver(true);
            }
          }, 1000);
          return 0;
        }
        return Math.max(0, newTime);
      });
    }, 100);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (iconTimerRef.current) {
        clearInterval(iconTimerRef.current);
        iconTimerRef.current = null;
      }
    };
  }, [gameState, currentRound]);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setMissed(0);
    roundRef.current = 0;
    startRound();
  };

  const calculateAccuracy = () => {
    const total = score + missed;
    if (total === 0) return 0;
    return ((score / total) * 100).toFixed(1);
  };

  return (
    <TeacherGameShell
      title={gameData?.title || "Quick Calm Reflex"}
      subtitle={gameData?.description || "Practice instant de-stressing actions during busy class hours"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentRound + 0 - 1}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {gameState === "ready" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
            <div className="text-6xl mb-6">⚡</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Quick Calm Reflex
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              Icons will flash rapidly. Tap only the <strong>calming action</strong> (breathe).
            </p>
            <p className="text-gray-500 mb-8">
              You'll play {TOTAL_ROUNDS} rounds. Each round lasts 5 seconds. Icons will flash rapidly - tap only the calming ones!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl text-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Start Game
            </motion.button>
          </div>
        )}

        {gameState === "playing" && (
          <div className="space-y-6">
            {/* Game Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{score}</div>
                  <div className="text-sm text-gray-600">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{missed}</div>
                  <div className="text-sm text-gray-600">Missed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-1">
                    <Clock className="w-5 h-5" />
                    {Math.ceil(timeLeft)}
                  </div>
                  <div className="text-sm text-gray-600">Time Left</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Round {currentRound} of {TOTAL_ROUNDS}</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentRound / TOTAL_ROUNDS) * 100}%` }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 text-center">
              <p className="text-sm font-semibold text-green-800">
                💡 Tap only calming action: Breathe
              </p>
            </div>

            {/* Icon Display Area */}
            <div className="bg-white rounded-2xl shadow-lg p-8 min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIcons.map(i => i.uniqueId).join('-')}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                >
                  {currentIcons.map((icon) => {
                    const isTapped = tappedIcons.has(icon.uniqueId);
                    const isCorrect = icon.isCalming;

                    return (
                      <motion.button
                        key={icon.uniqueId}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                          scale: isTapped ? 0.7 : 1,
                          opacity: isTapped ? 0.4 : 1,
                        }}
                        whileHover={!isTapped ? { scale: 1.05 } : {}}
                        whileTap={!isTapped ? { scale: 0.95 } : {}}
                        transition={{ duration: 0.2 }}
                        onClick={() => handleIconTap(icon)}
                        disabled={isTapped}
                        className={`relative w-full aspect-square rounded-xl bg-gradient-to-br ${icon.color} shadow-lg flex flex-col items-center justify-center text-white transform transition-all ${isTapped
                            ? 'cursor-not-allowed'
                            : 'cursor-pointer hover:shadow-xl'
                          } ${isTapped && isCorrect ? 'ring-4 ring-green-500' :
                            isTapped && !isCorrect ? 'ring-4 ring-red-500' :
                              ''
                          }`}
                      >
                        <span className="text-5xl mb-2">{icon.icon}</span>
                        <span className="text-sm font-bold">{icon.label}</span>
                        {isTapped && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/20 rounded-xl">
                            {isCorrect ? (
                              <CheckCircle className="w-12 h-12 text-green-500 bg-white rounded-full" />
                            ) : (
                              <XCircle className="w-12 h-12 text-red-500 bg-white rounded-full" />
                            )}
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {gameState === "finished" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Game Complete!
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-8 max-w-md mx-auto">
              <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-1">{score}</div>
                <div className="text-sm text-gray-600">Correct Taps</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-1">{calculateAccuracy()}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Performance</h3>
              {score >= TOTAL_ROUNDS * 0.8 ? (
                <p className="text-gray-700">
                  Excellent! You have great reflexes for identifying calming actions. Keep practicing to build this into a natural habit.
                </p>
              ) : score >= TOTAL_ROUNDS * 0.5 ? (
                <p className="text-gray-700">
                  Good job! You're getting better at recognizing calming actions. Practice more to improve your reflexes.
                </p>
              ) : (
                <p className="text-gray-700">
                  Keep practicing! The more you play, the better you'll become at quickly identifying calming actions in stressful moments.
                </p>
              )}
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-900 mb-2">
                💡 Teacher Tip:
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                Use this game before class starts for micro-centering. These quick calming actions can help you enter the classroom with a calm, centered presence, which positively impacts your students and your own wellbeing throughout the day.
              </p>
            </div>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default QuickCalmReflex;