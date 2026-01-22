import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Map, Heart, Target, CheckCircle, TrendingUp, BookOpen, Sparkles, Award } from "lucide-react";

const LifeMapPuzzle = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-84";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [availableValues, setAvailableValues] = useState([
    { id: 1, name: "Integrity", emoji: "💎", description: "Honesty, ethics, moral principles", color: "from-blue-400 to-cyan-500" },
    { id: 2, name: "Growth", emoji: "🌱", description: "Continuous learning and development", color: "from-green-400 to-emerald-500" },
    { id: 3, name: "Kindness", emoji: "💙", description: "Compassion, empathy, caring for others", color: "from-pink-400 to-rose-500" },
    { id: 4, name: "Stability", emoji: "🏛️", description: "Consistency, reliability, security", color: "from-gray-400 to-slate-500" },
    { id: 5, name: "Creativity", emoji: "🎨", description: "Innovation, imagination, artistic expression", color: "from-purple-400 to-indigo-500" },
    { id: 6, name: "Service", emoji: "🤝", description: "Helping others, making a difference", color: "from-orange-400 to-red-500" },
    { id: 7, name: "Excellence", emoji: "⭐", description: "High standards, quality, mastery", color: "from-yellow-400 to-amber-500" },
    { id: 8, name: "Freedom", emoji: "🕊️", description: "Independence, autonomy, choice", color: "from-sky-400 to-blue-500" },
    { id: 9, name: "Connection", emoji: "💚", description: "Relationships, community, belonging", color: "from-teal-400 to-cyan-500" },
    { id: 10, name: "Adventure", emoji: "🗺️", description: "Exploration, new experiences, excitement", color: "from-red-400 to-orange-500" },
    { id: 11, name: "Wisdom", emoji: "🧠", description: "Knowledge, insight, understanding", color: "from-indigo-400 to-purple-500" },
    { id: 12, name: "Balance", emoji: "⚖️", description: "Harmony, moderation, work-life integration", color: "from-violet-400 to-fuchsia-500" }
  ]);

  const [selectedValues, setSelectedValues] = useState([]);
  const [draggedValue, setDraggedValue] = useState(null);
  const [reflection, setReflection] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  const handleDragStart = (value) => {
    setDraggedValue(value);
  };

  const handleDragEnd = () => {
    setDraggedValue(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedValue && selectedValues.length < 5) {
      // Check if value is already selected
      if (!selectedValues.some(v => v.id === draggedValue.id)) {
        setSelectedValues([...selectedValues, draggedValue]);
        setAvailableValues(availableValues.filter(v => v.id !== draggedValue.id));
      }
    }
    setDraggedValue(null);
  };

  const handleRemoveFromMap = (value) => {
    setSelectedValues(selectedValues.filter(v => v.id !== value.id));
    setAvailableValues([...availableValues, value]);
  };

  const handleReflectionChange = (value) => {
    setReflection(value);
  };

  const handleComplete = () => {
    if (selectedValues.length < 5) {
      alert("Please select your top 5 values first.");
      return;
    }

    if (!reflection.trim()) {
      alert("Please write your reflection on how your values align with your teaching work.");
      return;
    }

    // Score based on number of values selected (1 point per value)
    const valuesSelected = selectedValues.length;
    setScore(valuesSelected);
    setShowAnalysis(true);
    setTimeout(() => {
      setShowGameOver(true);
    }, 2000);
  };

  const reflectionLength = reflection.trim().length;
  const canComplete = selectedValues.length === 5 && reflection.trim().length > 0;

  return (
    <TeacherGameShell
      title={gameData?.title || "Life Map Puzzle"}
      subtitle={gameData?.description || "Identify personal values aligning with the teaching journey"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={1}
    >
      <div className="w-full max-w-6xl mx-auto px-4">
        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🗺️</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Life Map Puzzle
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Identify your personal values and see how they align with your teaching journey. Select your top 5 values and reflect on their alignment with your work.
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                How to Use the Life Map:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <span><strong>Drag 5 top values</strong> from the available tiles into your Life Map</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <span><strong>Select values</strong> that are most important to you in your teaching journey</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <span><strong>Reflect on alignment:</strong> Write about how these values align with your current work</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <span><strong>Complete all steps</strong> to see your Life Map analysis</span>
                </li>
              </ul>
            </div>

            {/* Life Map Area */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-8 border-4 border-indigo-300 mb-8 min-h-[300px]">
              <div className="text-center mb-6">
                <Map className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Your Life Map
                </h3>
                <p className="text-gray-600">
                  Drag your top 5 values here ({selectedValues.length} / 5)
                </p>
              </div>

              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className={`min-h-[200px] rounded-lg border-2 border-dashed p-6 ${selectedValues.length === 5
                    ? 'border-green-400 bg-green-50'
                    : selectedValues.length > 0
                      ? 'border-indigo-400 bg-indigo-50'
                      : 'border-gray-300 bg-gray-50'
                  } transition-all`}
              >
                {selectedValues.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <div className="text-4xl mb-2">📍</div>
                    <p className="text-lg font-semibold">Drag your top 5 values here</p>
                    <p className="text-sm">Values will appear as you drag them</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {selectedValues.map((value, index) => (
                      <motion.div
                        key={value.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-gradient-to-br ${value.color} rounded-xl p-4 border-2 border-white shadow-lg cursor-pointer hover:scale-105 transition-all relative`}
                        onClick={() => handleRemoveFromMap(value)}
                        title="Click to remove"
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-2">{value.emoji}</div>
                          <h4 className="font-bold text-white text-sm mb-1">{value.name}</h4>
                          <p className="text-white/90 text-xs">{value.description}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromMap(value);
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-all"
                        >
                          ×
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {selectedValues.length === 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-center"
                  >
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg border-2 border-green-300">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold">All 5 values selected!</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Available Values */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-pink-600" />
                Available Values ({availableValues.length} remaining):
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {availableValues.map((value) => (
                  <motion.div
                    key={value.id}
                    draggable
                    onDragStart={() => handleDragStart(value)}
                    onDragEnd={handleDragEnd}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`bg-gradient-to-br ${value.color} rounded-xl p-4 border-2 border-white shadow-md cursor-move hover:shadow-lg transition-all ${draggedValue?.id === value.id ? 'opacity-50' : ''
                      }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{value.emoji}</div>
                      <h4 className="font-bold text-white text-sm mb-1">{value.name}</h4>
                      <p className="text-white/90 text-xs">{value.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Reflection Section */}
            {selectedValues.length === 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-800">Reflection on Alignment</h3>
                </div>

                <div className="bg-white rounded-lg p-4 border-2 border-purple-200 mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Reflection Prompt:</p>
                  <p className="text-lg text-gray-800 italic leading-relaxed mb-4">
                    "How do these values align with your current teaching work?"
                  </p>
                  <p className="text-sm text-gray-600">
                    Reflect on how your selected values (Integrity, Growth, Kindness, etc.) connect with your daily teaching practice. How do you live these values through your work?
                  </p>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-200 mb-4">
                  <p className="text-sm text-amber-800 mb-2">
                    <strong>Your Selected Values:</strong>
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedValues.map((value) => (
                      <span
                        key={value.id}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${value.color}`}
                      >
                        <span>{value.emoji}</span>
                        <span>{value.name}</span>
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-amber-700 italic">
                    Consider: How do these values show up in your teaching? Where do they align well? Where might there be opportunities to live them more fully?
                  </p>
                </div>

                <textarea
                  value={reflection}
                  onChange={(e) => handleReflectionChange(e.target.value)}
                  placeholder="Write your reflection on how your selected values align with your teaching work... Consider how you live these values through your teaching, where they align well, and opportunities to live them more fully..."
                  rows={8}
                  className="w-full p-4 rounded-lg border-2 border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none text-gray-800"
                />

                {reflectionLength > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-gray-600 flex items-center gap-1"
                  >
                    <TrendingUp className="w-4 h-4" />
                    {reflectionLength} characters
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Analysis Preview */}
            {showAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mt-6"
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">✨</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Life Map Analysis</h3>
                  <p className="text-gray-700">
                    Your values alignment reflection is complete!
                  </p>
                </div>
              </motion.div>
            )}

            {/* Complete Button */}
            {selectedValues.length === 5 && !showAnalysis && (
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleComplete}
                  disabled={!canComplete}
                  className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all flex items-center gap-3 mx-auto ${canComplete
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  <Target className="w-5 h-5" />
                  Complete Life Map
                </motion.button>

                {!canComplete && (
                  <p className="text-sm text-gray-600 mt-3">
                    Please write your reflection on how your values align with your teaching work.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Game Over Summary */}
        {showGameOver && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-6xl mb-4"
              >
                🗺️✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Life Map Complete!
              </h2>
              <p className="text-xl text-gray-600 mb-2">
                You've identified your top 5 values and reflected on their alignment
              </p>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full border-2 border-green-300">
                <Award className="w-5 h-5 text-green-600" />
                <span className="font-bold text-green-800">Earned {score} Healcoin{score !== 1 ? 's' : ''}!</span>
              </div>
            </div>

            {/* Selected Values Display */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-8 border-2 border-indigo-200 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-8 h-8 text-indigo-600" />
                <h3 className="text-2xl font-bold text-gray-800">Your Top 5 Values</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {selectedValues.map((value, index) => (
                  <motion.div
                    key={value.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${value.color} rounded-xl p-6 border-2 border-white shadow-lg text-center`}
                  >
                    <div className="text-5xl mb-3">{value.emoji}</div>
                    <h4 className="font-bold text-white text-lg mb-2">{value.name}</h4>
                    <p className="text-white/90 text-sm mb-3">{value.description}</p>
                    <div className="inline-flex items-center gap-1 bg-white/30 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      #{index + 1} Priority
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Reflection Display */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-800">Your Reflection on Alignment</h3>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200 mb-4">
                <p className="text-sm font-semibold text-gray-600 mb-2">Prompt:</p>
                <p className="text-lg text-gray-800 italic">"How do these values align with your current teaching work?"</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                <p className="text-sm font-semibold text-gray-600 mb-2">Your Reflection:</p>
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {reflection}
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                The Power of Value Alignment
              </h3>
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Clarity:</strong> Identifying your values provides clarity about what matters most in your teaching</li>
                <li>• <strong>Alignment:</strong> Understanding how your values align with your work creates satisfaction and meaning</li>
                <li>• <strong>Decision-making:</strong> Your values become a compass that guides your teaching decisions and priorities</li>
                <li>• <strong>Authenticity:</strong> Living your values makes your teaching more authentic and personally fulfilling</li>
                <li>• <strong>Purpose:</strong> Connecting your values to your work gives purpose and meaning to daily tasks</li>
                <li>• <strong>Resilience:</strong> When your work aligns with your values, you build resilience and motivation</li>
                <li>• <strong>Growth:</strong> Recognizing value gaps creates opportunities for intentional growth and development</li>
              </ul>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <BookOpen className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed mb-3">
                    <strong>Ask staff to share 1 core value in morning assembly.</strong> Creating regular opportunities to share values builds connection and strengthens school culture:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Start the day right:</strong> Sharing values at morning assembly sets a positive, intentional tone for the day. It reminds everyone what matters.</li>
                    <li><strong>Regular practice:</strong> Make it a weekly or monthly ritual where different staff members share their core value. Consistency builds culture.</li>
                    <li><strong>Keep it brief:</strong> One core value and a 1-2 minute explanation is enough. Brief sharing makes it sustainable and engaging.</li>
                    <li><strong>Rotate speakers:</strong> Different staff members share each time, ensuring everyone has opportunities to share. This creates shared experience.</li>
                    <li><strong>Create safety:</strong> Make it clear this is about sharing, not judgment. Create a supportive environment where all values are honored.</li>
                    <li><strong>Include all staff:</strong> Invite teachers, administrators, support staff, maintenance—everyone contributes to school culture.</li>
                    <li><strong>Connect to work:</strong> Encourage speakers to briefly explain how their value shows up in their work. This connects values to daily practice.</li>
                    <li><strong>Build culture:</strong> Regular sharing of values creates a culture where what matters is visible and celebrated. This strengthens the entire school community.</li>
                    <li><strong>Model for students:</strong> When staff share values, they model reflection and authenticity for students. This teaches important life skills.</li>
                    <li><strong>Make it voluntary:</strong> While encouraged, sharing should be voluntary. This ensures authenticity and comfort for everyone.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you ask staff to share 1 core value in morning assembly, you're creating regular opportunities to celebrate what matters, build connection, strengthen culture, model reflection, and remind everyone of their shared purpose. Regular value sharing transforms school culture, creates alignment, and builds a community where values are visible and honored.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default LifeMapPuzzle;