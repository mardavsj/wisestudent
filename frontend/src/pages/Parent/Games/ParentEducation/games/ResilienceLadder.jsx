import React, { useState } from "react";
import { useLocation } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import { ArrowUp, Heart, Sparkles, CheckCircle } from "lucide-react";

const ResilienceLadder = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "parent-education-57";
  const gameData = getParentEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [step, setStep] = useState(1); // 1: Writing, 2: Animation, 3: Complete
  const [rungEntries, setRungEntries] = useState({
    hurt: "",
    hope: "",
    healing: "",
    growth: "",
    gratitude: ""
  });
  const [currentClimbingRung, setCurrentClimbingRung] = useState(0);
  const [showClimbAnimation, setShowClimbAnimation] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Ladder rungs definition
  const rungs = [
    {
      id: 'hurt',
      label: 'Hurt',
      description: 'What challenge or pain did you experience?',
      emoji: '💔',
      color: 'from-red-400 to-rose-500',
      bgColor: 'from-red-50 to-rose-50',
      borderColor: 'border-red-300',
      prompt: 'Describe a challenge or hurt you faced. (e.g., "I lost my job and felt lost", "I felt overwhelmed by parenting")'
    },
    {
      id: 'hope',
      label: 'Hope',
      description: 'What gave you hope or a glimmer of possibility?',
      emoji: '🌟',
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-300',
      prompt: 'What gave you hope or a glimpse of possibility? (e.g., "A friend reached out", "I remembered I\'ve overcome challenges before")'
    },
    {
      id: 'healing',
      label: 'Healing',
      description: 'How did you begin to heal or recover?',
      emoji: '💙',
      color: 'from-purple-400 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-300',
      prompt: 'How did you start to heal or recover? (e.g., "I started talking to someone", "I took small steps each day")'
    },
    {
      id: 'growth',
      label: 'Growth',
      description: 'What did you learn or how did you grow?',
      emoji: '🌱',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      prompt: 'What did you learn or how did you grow? (e.g., "I learned to ask for help", "I discovered my own strength")'
    },
    {
      id: 'gratitude',
      label: 'Gratitude',
      description: 'What are you grateful for from this journey?',
      emoji: '🙏',
      color: 'from-amber-400 to-orange-500',
      bgColor: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-300',
      prompt: 'What are you grateful for from this journey? (e.g., "I\'m grateful for the support I received", "I\'m grateful for what I learned about myself")'
    }
  ];

  const allRungsFilled = Object.values(rungEntries).every(entry => entry.trim().length >= 10);

  const handleRungChange = (rungId, value) => {
    setRungEntries(prev => ({
      ...prev,
      [rungId]: value
    }));
  };

  const handleStartClimb = () => {
    if (allRungsFilled) {
      setScore(1); // Award score for completing all entries
      setStep(2);
      setShowClimbAnimation(true);
      animateClimb();
    }
  };

  const animateClimb = () => {
    // Animate climbing each rung one by one
    let currentRung = 0;
    const climbInterval = setInterval(() => {
      setCurrentClimbingRung(currentRung);
      currentRung++;
      
      if (currentRung > rungs.length) {
        clearInterval(climbInterval);
        setTimeout(() => {
          setShowClimbAnimation(false);
          setStep(3);
          setShowGameOver(true);
          setScore(prev => prev + 1); // Award score for completing climb
        }, 2000);
      }
    }, 1500); // 1.5 seconds per rung
  };

  if (showGameOver && step === 3) {
    return (
      <ParentGameShell
        title={gameData?.title || "Resilience Ladder"}
        subtitle="Journey Complete!"
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentLevel={1}
        allAnswersCorrect={score >= 2}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto px-4 py-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-7xl mb-4"
              >
                🎯
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">You've Climbed the Resilience Ladder!</h2>
              <p className="text-lg text-gray-600 mb-6">
                You've reflected on your journey from hurt to gratitude. Your resilience story is powerful.
              </p>
            </div>

            {/* Complete Ladder Display */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Your Resilience Journey</h3>
              <div className="space-y-4">
                {rungs.map((rung, index) => (
                  <motion.div
                    key={rung.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${rung.bgColor} rounded-lg p-4 border-2 ${rung.borderColor}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">{rung.emoji}</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 mb-1">{rung.label}</h4>
                        <p className="text-gray-700 text-sm">{rungEntries[rung.id]}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Parent Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
              <p className="text-gray-700 font-medium text-center">
                <strong>💡 Parent Tip:</strong> Every rung climbed inspires your children's own resilience story. When you reflect on your journey from hurt to gratitude, you're showing your children that challenges can be overcome, that growth is possible, and that resilience is built one step at a time. Your story of climbing this ladder—from pain to hope, healing, growth, and gratitude—becomes a map for them. They learn that life has storms, but they also learn that strength and wisdom come from navigating them. Your resilience is their inheritance.
              </p>
            </div>
          </div>
        </motion.div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Resilience Ladder"}
      subtitle={step === 1 ? "Climb Your Resilience Ladder" : step === 2 ? "Climbing..." : "Complete"}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentLevel={1}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          {step === 1 && (
            /* Writing Phase */
            <>
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🪜</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Climb Your Resilience Ladder</h2>
                <p className="text-gray-600 text-lg">
                  Reflect on your journey through life's challenges. Write one line for each rung of your resilience ladder.
                </p>
              </div>

              {/* Ladder Visualization */}
              <div className="relative mb-8" style={{ height: '600px' }}>
                {/* Ladder Structure */}
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 400 600"
                  className="absolute inset-0"
                >
                  {/* Ladder sides */}
                  <line
                    x1="100"
                    y1="50"
                    x2="100"
                    y2="550"
                    stroke="#6366f1"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <line
                    x1="300"
                    y1="50"
                    x2="300"
                    y2="550"
                    stroke="#6366f1"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  
                  {/* Rungs */}
                  {rungs.map((rung, index) => {
                    const yPos = 100 + (index * 90);
                    const isReached = Object.values(rungEntries).slice(0, index + 1).every(entry => entry.trim().length >= 10);
                    
                    return (
                      <g key={rung.id}>
                        <line
                          x1="100"
                          y1={yPos}
                          x2="300"
                          y2={yPos}
                          stroke={isReached ? "#10b981" : "#9ca3af"}
                          strokeWidth="6"
                          strokeLinecap="round"
                        />
                        {/* Rung label background */}
                        <rect
                          x="110"
                          y={yPos - 12}
                          width="180"
                          height="24"
                          fill="white"
                          rx="4"
                        />
                        <text
                          x="200"
                          y={yPos + 4}
                          textAnchor="middle"
                          className="text-sm font-bold"
                          fill={isReached ? "#059669" : "#6b7280"}
                        >
                          {rung.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Rung Content Overlay */}
                <div className="relative h-full">
                  {rungs.map((rung, index) => {
                    const yPos = 100 + (index * 90);
                    const isReached = Object.values(rungEntries).slice(0, index + 1).every(entry => entry.trim().length >= 10);
                    
                    return (
                      <div
                        key={rung.id}
                        className="absolute"
                        style={{ top: `${(yPos / 600) * 100}%`, left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '350px' }}
                      >
                        <div className={`bg-white rounded-lg p-3 border-2 ${
                          isReached ? rung.borderColor : 'border-gray-200'
                        } shadow-md`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{rung.emoji}</span>
                            <span className={`text-xs font-semibold ${
                              isReached ? 'text-gray-800' : 'text-gray-400'
                            }`}>
                              {rung.label}
                            </span>
                            {isReached && (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Writing Form */}
              <div className="space-y-6 mb-6">
                {rungs.map((rung, index) => {
                  const entry = rungEntries[rung.id];
                  const isValid = entry.trim().length >= 10;
                  const previousRungsFilled = index === 0 || Object.values(rungEntries).slice(0, index).every(e => e.trim().length >= 10);
                  
                  return (
                    <motion.div
                      key={rung.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-gradient-to-br ${rung.bgColor} rounded-xl p-6 border-2 ${rung.borderColor} ${
                        !previousRungsFilled ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-3xl flex-shrink-0">{rung.emoji}</span>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800 mb-1">{rung.label}</h3>
                          <p className="text-sm text-gray-600 mb-3">{rung.description}</p>
                        </div>
                        {isValid && (
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                      <textarea
                        value={entry}
                        onChange={(e) => handleRungChange(rung.id, e.target.value)}
                        placeholder={rung.prompt}
                        disabled={!previousRungsFilled}
                        className={`w-full h-20 p-4 border-2 rounded-lg focus:outline-none focus:ring-2 resize-none text-gray-700 ${
                          isValid
                            ? `${rung.borderColor} border-opacity-60`
                            : 'border-gray-300'
                        } ${!previousRungsFilled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-600">
                          {entry.length} characters {isValid && <span className="text-green-600 font-semibold">✓</span>}
                        </p>
                        {!previousRungsFilled && index > 0 && (
                          <p className="text-xs text-red-600">Complete previous rung first</p>
                        )}
                        {previousRungsFilled && entry.length > 0 && entry.length < 10 && (
                          <p className="text-xs text-red-600">Please write at least 10 characters</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Parent Tip */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>💡 Parent Tip:</strong> Every rung climbed inspires your children's own resilience story. When you reflect on your journey, you're showing them that challenges can be overcome and growth is possible.
                </p>
              </div>

              {/* Start Climb Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartClimb}
                disabled={!allRungsFilled}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ArrowUp className="w-5 h-5" />
                Climb the Ladder
              </motion.button>
            </>
          )}

          {step === 2 && showClimbAnimation && (
            /* Climbing Animation */
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 border-2 border-purple-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Climbing Your Resilience Ladder</h2>
                
                {/* Animated Ladder */}
                <div className="relative mb-8" style={{ height: '500px', margin: '0 auto', maxWidth: '300px' }}>
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 300 500"
                    className="absolute inset-0"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Ladder sides */}
                    <line
                      x1="50"
                      y1="50"
                      x2="50"
                      y2="450"
                      stroke="#6366f1"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <line
                      x1="250"
                      y1="50"
                      x2="250"
                      y2="450"
                      stroke="#6366f1"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    
                    {/* Rungs */}
                    {rungs.map((rung, index) => {
                      const yPos = 80 + (index * 80);
                      const isReached = index < currentClimbingRung;
                      const isCurrent = index === currentClimbingRung - 1;
                      
                      return (
                        <g key={rung.id}>
                          <line
                            x1="50"
                            y1={yPos}
                            x2="250"
                            y2={yPos}
                            stroke={isReached || isCurrent ? "#10b981" : "#9ca3af"}
                            strokeWidth="5"
                            strokeLinecap="round"
                          />
                          {/* Glow for current rung */}
                          {isCurrent && (
                            <line
                              x1="50"
                              y1={yPos}
                              x2="250"
                              y2={yPos}
                              stroke="#10b981"
                              strokeWidth="8"
                              strokeLinecap="round"
                              opacity="0.5"
                            >
                              <animate
                                attributeName="opacity"
                                values="0.5;1;0.5"
                                dur="1s"
                                repeatCount="indefinite"
                              />
                            </line>
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  {/* Climbing figure */}
                  {currentClimbingRung > 0 && currentClimbingRung <= rungs.length && (
                    <motion.div
                      key={`climber-${currentClimbingRung}`}
                      initial={{ y: currentClimbingRung === 1 ? 0 : -80, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute left-1/2"
                      style={{
                        top: `${((80 + ((currentClimbingRung - 1) * 80)) / 500) * 100}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10
                      }}
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-lg border-2 border-indigo-400">
                        👤
                      </div>
                    </motion.div>
                  )}

                  {/* Current Rung Highlight */}
                  {currentClimbingRung > 0 && currentClimbingRung <= rungs.length && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      key={`highlight-${currentClimbingRung}`}
                      className={`absolute left-1/2 bg-gradient-to-br ${rungs[currentClimbingRung - 1].bgColor} rounded-xl p-4 border-2 ${rungs[currentClimbingRung - 1].borderColor} shadow-lg`}
                      style={{ 
                        top: `${((80 + ((currentClimbingRung - 1) * 80)) / 500) * 100 + 15}%`,
                        transform: 'translateX(-50%)',
                        width: '90%',
                        maxWidth: '280px',
                        zIndex: 5
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{rungs[currentClimbingRung - 1].emoji}</span>
                        <h3 className="font-bold text-gray-800">{rungs[currentClimbingRung - 1].label}</h3>
                      </div>
                      <p className="text-sm text-gray-700">{rungEntries[rungs[currentClimbingRung - 1].id]}</p>
                    </motion.div>
                  )}
                </div>

                {currentClimbingRung <= rungs.length ? (
                  <p className="text-lg text-gray-700 font-medium">
                    {currentClimbingRung === 0 
                      ? "Starting your climb..." 
                      : currentClimbingRung <= rungs.length
                      ? `Reached: ${rungs[currentClimbingRung - 1].label}`
                      : "Journey complete!"}
                  </p>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-6xl mb-4"
                  >
                    🎉
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </ParentGameShell>
  );
};

export default ResilienceLadder;

