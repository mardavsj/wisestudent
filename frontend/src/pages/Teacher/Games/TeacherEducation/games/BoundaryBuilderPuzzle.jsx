import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Shield, Clock, Lock, MessageCircle, Zap, CheckCircle, AlertCircle, GripVertical, BookOpen } from "lucide-react";

const BoundaryBuilderPuzzle = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-63";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [boundaries, setBoundaries] = useState([
    {
      id: 1,
      name: 'Time',
      category: null,
      icon: Clock,
      description: 'When you are available and when you are not',
      firmAnalysis: 'Firm time boundaries protect your personal time and prevent burnout. Examples: "I don\'t check emails after 6 PM" or "I\'m not available on weekends."',
      flexibleAnalysis: 'Flexible time boundaries allow for occasional exceptions when needed. Example: "I generally leave by 5 PM, but I can stay late for parent conferences when scheduled."',
      unclearAnalysis: 'Unclear time boundaries lead to overwork and resentment. Without clear time limits, work can expand to fill all available hours.',
      recommendedCategory: 'firm',
      emoji: '⏰'
    },
    {
      id: 2,
      name: 'Privacy',
      category: null,
      icon: Lock,
      description: 'What personal information you share and what remains private',
      firmAnalysis: 'Firm privacy boundaries protect your personal life and prevent oversharing. Example: "I don\'t discuss my personal life with students" or "My home address is private."',
      flexibleAnalysis: 'Flexible privacy boundaries allow selective sharing when appropriate. Example: "I might share that I enjoy reading, but I keep family details private."',
      unclearAnalysis: 'Unclear privacy boundaries can lead to uncomfortable situations and blurred professional lines. It\'s unclear what information is appropriate to share.',
      recommendedCategory: 'firm',
      emoji: '🔒'
    },
    {
      id: 3,
      name: 'Availability',
      category: null,
      icon: MessageCircle,
      description: 'How accessible you are for requests and communications',
      firmAnalysis: 'Firm availability boundaries protect your focus and reduce interruptions. Example: "I respond to emails during designated hours only" or "I don\'t take calls during class time."',
      flexibleAnalysis: 'Flexible availability boundaries allow for emergencies and important situations. Example: "I generally respond within 24 hours, but urgent matters can reach me sooner."',
      unclearAnalysis: 'Unclear availability boundaries can lead to constant interruptions and inability to focus on important work.',
      recommendedCategory: 'flexible',
      emoji: '📞'
    },
    {
      id: 4,
      name: 'Tone',
      category: null,
      icon: MessageCircle,
      description: 'How others speak to you and how you respond',
      firmAnalysis: 'Firm tone boundaries protect your dignity and professional respect. Example: "I won\'t accept being spoken to disrespectfully" or "I maintain calm, professional communication."',
      flexibleAnalysis: 'Flexible tone boundaries allow for occasional frustration while maintaining standards. Example: "I understand frustration, but I expect respectful communication overall."',
      unclearAnalysis: 'Unclear tone boundaries can allow disrespectful communication to continue, damaging relationships and self-respect.',
      recommendedCategory: 'firm',
      emoji: '💬'
    },
    {
      id: 5,
      name: 'Energy',
      category: null,
      icon: Zap,
      description: 'How you manage and protect your emotional and physical energy',
      firmAnalysis: 'Firm energy boundaries protect your capacity and prevent exhaustion. Example: "I don\'t take on additional tasks when I\'m at capacity" or "I protect my lunch break for rest."',
      flexibleAnalysis: 'Flexible energy boundaries allow for occasional extra effort when necessary. Example: "I generally protect my energy, but I can give extra support during particularly busy periods."',
      unclearAnalysis: 'Unclear energy boundaries can lead to depletion and inability to perform well. Without limits, you may overcommit and burn out.',
      recommendedCategory: 'flexible',
      emoji: '⚡'
    }
  ]);

  const [draggedItem, setDraggedItem] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const categories = [
    {
      id: 'firm',
      label: 'Firm',
      icon: Shield,
      color: 'from-red-500 to-rose-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      description: 'Non-negotiable boundaries that protect your emotional health'
    },
    {
      id: 'flexible',
      label: 'Flexible',
      icon: Shield,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      description: 'Boundaries with room for exceptions when appropriate'
    },
    {
      id: 'unclear',
      label: 'Unclear',
      icon: AlertCircle,
      color: 'from-gray-500 to-slate-500',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-300',
      description: 'Boundaries that need clarification - can lead to confusion'
    }
  ];

  const handleDragStart = (e, boundaryId) => {
    setDraggedItem(boundaryId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", boundaryId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, category) => {
    e.preventDefault();
    if (!draggedItem) return;

    setBoundaries(prev => prev.map(boundary =>
      boundary.id === draggedItem
        ? { ...boundary, category }
        : boundary
    ));
    setDraggedItem(null);
  };

  const handleRemoveFromCategory = (boundaryId) => {
    setBoundaries(prev => prev.map(boundary =>
      boundary.id === boundaryId
        ? { ...boundary, category: null }
        : boundary
    ));
  };

  const handleShowAnalysis = () => {
    const allSorted = boundaries.every(b => b.category !== null);
    if (allSorted) {
      // Calculate score based on correct categorization - 1 point per correct boundary
      let correctCount = 0;
      boundaries.forEach(boundary => {
        // Award 1 point for each correctly categorized boundary
        if (boundary.category === boundary.recommendedCategory) {
          correctCount += 1;
        }
      });

      setScore(correctCount);
      setShowAnalysis(true);
    }
  };

  const handleComplete = () => {
    setShowGameOver(true);
  };

  const firmBoundaries = boundaries.filter(b => b.category === 'firm');
  const flexibleBoundaries = boundaries.filter(b => b.category === 'flexible');
  const unclearBoundaries = boundaries.filter(b => b.category === 'unclear');
  const unsortedBoundaries = boundaries.filter(b => b.category === null);
  const allSorted = boundaries.every(b => b.category !== null);

  return (
    <TeacherGameShell
      title={gameData?.title || "Boundary Builder Puzzle"}
      subtitle={gameData?.description || "Learn which boundaries protect emotional health"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={score}
    >
      <div className="w-full max-w-6xl mx-auto px-4">
        {!showAnalysis ? (
          <div>
            {/* Instructions */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 mb-8 shadow-lg border-2 border-indigo-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Shield className="w-6 h-6 text-indigo-600" />
                Build Your Boundaries
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Drag each boundary card into one of three columns: <strong>Firm</strong>, <strong>Flexible</strong>, or <strong>Unclear</strong>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                <div className="bg-red-100 rounded-lg p-3 border border-red-300">
                  <p className="text-sm font-semibold text-red-900">🔴 Firm</p>
                  <p className="text-xs text-red-800">Non-negotiable, protects emotional health</p>
                </div>
                <div className="bg-blue-100 rounded-lg p-3 border border-blue-300">
                  <p className="text-sm font-semibold text-blue-900">🔵 Flexible</p>
                  <p className="text-xs text-blue-800">Room for exceptions when appropriate</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 border border-gray-300">
                  <p className="text-sm font-semibold text-gray-900">⚪ Unclear</p>
                  <p className="text-xs text-gray-800">Needs clarification, can cause confusion</p>
                </div>
              </div>
            </div>

            {/* Category Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {categories.map((category) => {
                const CategoryIcon = category.icon;
                const categoryBoundaries = boundaries.filter(b => b.category === category.id);
                const CategoryIconComponent = category.icon;

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${category.bgColor} rounded-xl p-6 border-2 ${category.borderColor} shadow-lg min-h-[400px]`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, category.id)}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                        <CategoryIconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{category.label}</h3>
                        <p className="text-xs text-gray-600">{category.description}</p>
                      </div>
                    </div>

                    <div className="space-y-3 min-h-[300px]">
                      {categoryBoundaries.map((boundary) => {
                        const BoundaryIcon = boundary.icon;
                        return (
                          <motion.div
                            key={boundary.id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-lg p-4 shadow-md border-2 border-gray-200 relative"
                          >
                            <button
                              onClick={() => handleRemoveFromCategory(boundary.id)}
                              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <AlertCircle className="w-4 h-4" />
                            </button>
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{boundary.emoji}</div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-800">{boundary.name}</h4>
                                <p className="text-xs text-gray-600">{boundary.description}</p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                      {categoryBoundaries.length === 0 && (
                        <div className="text-center text-gray-400 py-8 border-2 border-dashed border-gray-300 rounded-lg">
                          <p className="text-sm">Drop boundaries here</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Unsorted Boundaries */}
            {unsortedBoundaries.length > 0 && (
              <div className="bg-gray-100 rounded-xl p-6 border-2 border-gray-300 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Boundaries to Sort:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  {unsortedBoundaries.map((boundary) => {
                    const BoundaryIcon = boundary.icon;
                    return (
                      <motion.div
                        key={boundary.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, boundary.id)}
                        whileHover={{ scale: 1.02 }}
                        whileDrag={{ scale: 1.1, rotate: 5 }}
                        className="flex flex-col items-center gap-2 bg-white rounded-lg p-4 border-2 border-gray-300 shadow-sm cursor-move hover:shadow-md transition-all"
                      >
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <div className="text-3xl">{boundary.emoji}</div>
                        <h4 className="font-bold text-gray-800 text-center">{boundary.name}</h4>
                        <p className="text-xs text-gray-600 text-center">{boundary.description}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Analysis Button */}
            {allSorted && (
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShowAnalysis}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Review Analysis
                </motion.button>
              </div>
            )}
          </div>
        ) : (
          /* Analysis Screen */
          <div>
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-green-200">
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-5xl mb-4"
                >
                  📊
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Boundary Analysis
                </h2>
                <p className="text-gray-600">
                  Review how your boundary choices protect your emotional health
                </p>
              </div>
            </div>

            {/* Analysis for Each Boundary */}
            <div className="space-y-6 mb-8">
              {boundaries.map((boundary) => {
                const categoryInfo = categories.find(c => c.id === boundary.category);
                const CategoryIcon = categoryInfo?.icon || Shield;
                const isRecommended = boundary.recommendedCategory === boundary.category;
                const isUnclear = boundary.category === 'unclear';

                return (
                  <motion.div
                    key={boundary.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`bg-white rounded-xl p-6 shadow-lg border-2 ${isUnclear
                        ? 'border-gray-300 bg-gray-50'
                        : isRecommended
                          ? 'border-green-300 bg-green-50'
                          : boundary.category === 'firm' || boundary.category === 'flexible'
                            ? `border-${categoryInfo?.borderColor.split('-')[1]}-300 bg-${categoryInfo?.bgColor.split('-')[1]}-50`
                            : 'border-gray-300'
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{boundary.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-800">{boundary.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${boundary.category === 'firm'
                              ? 'bg-red-100 text-red-800'
                              : boundary.category === 'flexible'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                            {categoryInfo?.label}
                          </span>
                          {isRecommended && !isUnclear && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                          {isUnclear && (
                            <AlertCircle className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-3">
                          <strong>Your choice:</strong> {boundary[`${boundary.category}Analysis`]}
                        </p>
                        {!isRecommended && !isUnclear && (
                          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                            <p className="text-sm text-blue-800">
                              <strong>💡 Alternative:</strong> {boundary.recommendedCategory === 'firm'
                                ? 'Consider making this boundary firmer for stronger emotional health protection.'
                                : 'This boundary can be flexible, but consider when firmness is needed.'}
                            </p>
                          </div>
                        )}
                        {isUnclear && (
                          <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                            <p className="text-sm text-red-800">
                              <strong>⚠️ Important:</strong> Unclear boundaries can lead to confusion and emotional stress. Consider clarifying this boundary as either firm or flexible.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Boundary Insights */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-8">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Boundary Insights
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Firm boundaries protect emotional health:</strong> Non-negotiable boundaries (like time, privacy, and tone) create essential protection against burnout and emotional depletion.</li>
                <li>• <strong>Flexible boundaries allow balance:</strong> Some boundaries (like availability and energy) can have flexibility for emergencies while maintaining overall limits.</li>
                <li>• <strong>Unclear boundaries cause stress:</strong> Boundaries that are neither firm nor flexible lead to confusion, resentment, and emotional exhaustion.</li>
                <li>• <strong>Balance is key:</strong> Having a mix of firm and flexible boundaries allows you to protect your health while maintaining relationships.</li>
                <li>• <strong>Boundaries need communication:</strong> Clear boundaries must be communicated to others for them to be effective and respected.</li>
              </ul>
            </div>

            {/* Score Summary */}
            <div className={`bg-gradient-to-br rounded-xl p-6 border-2 mb-8 ${score === 5
                ? 'from-green-50 to-emerald-50 border-green-200'
                : score >= 3
                  ? 'from-blue-50 to-indigo-50 border-blue-200'
                  : 'from-yellow-50 to-orange-50 border-yellow-200'
              }`}>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Your Boundary Builder Score</h3>
                <div className={`text-5xl font-bold mb-2 ${score === 5 ? 'text-green-600' :
                    score >= 3 ? 'text-blue-600' :
                      'text-yellow-600'
                  }`}>
                  {score}/5
                </div>
                <p className="text-gray-700">
                  {score === 5
                    ? "Excellent! You've built strong boundaries that protect your emotional health."
                    : score >= 3
                      ? "Good progress! You're learning to balance firm and flexible boundaries."
                      : "Keep practicing! Understanding boundaries is key to protecting your emotional health."}
                </p>
              </div>
            </div>

            {/* Teacher Tip */}
            <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200 mb-8">
              <div className="flex items-start gap-3">
                <BookOpen className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    💡 Teacher Tip:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed mb-3">
                    Keep one "firm" and one "flexible" boundary as your anchor points. This balanced approach protects your emotional health while maintaining relationships:
                  </p>
                  <ul className="text-sm text-amber-800 space-y-2 list-disc ml-4">
                    <li><strong>Choose one firm anchor:</strong> Select one boundary (like Time or Privacy) that you'll keep firm as a non-negotiable. This creates essential protection for your emotional health.</li>
                    <li><strong>Choose one flexible anchor:</strong> Select one boundary (like Availability or Energy) that you'll keep flexible but clear. This allows for balance while maintaining limits.</li>
                    <li><strong>Communicate clearly:</strong> Clearly communicate your anchor boundaries to colleagues, administrators, and parents so they understand your limits.</li>
                    <li><strong>Stay consistent:</strong> Consistency with your anchor boundaries builds respect and makes them easier to maintain.</li>
                    <li><strong>Adjust as needed:</strong> Your anchor boundaries can evolve as your circumstances change, but having them as anchors provides stability.</li>
                    <li><strong>Start small:</strong> If you're new to boundaries, start with just two anchor boundaries (one firm, one flexible) and expand from there.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you keep one firm and one flexible boundary as your anchor points, you're creating a balanced foundation for emotional health. The firm boundary protects your essential needs (like personal time or privacy), while the flexible boundary allows for relationship-building and collaboration (like availability during important moments). These anchors help you navigate complex situations while maintaining your emotional well-being. Having clear anchor boundaries makes it easier to make decisions and reduces the mental energy spent on boundary-setting, allowing you to focus on teaching and relationships.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleComplete}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Complete
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default BoundaryBuilderPuzzle;