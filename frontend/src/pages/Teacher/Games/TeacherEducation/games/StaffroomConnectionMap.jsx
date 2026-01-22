import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Map, Users, Target, TrendingUp, BookOpen, Heart, CheckCircle } from "lucide-react";

const StaffroomConnectionMap = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-78";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [colleagues, setColleagues] = useState([
    { id: 1, name: "Sarah", role: "Math Teacher", emoji: "👩‍🏫", x: null, y: null, zone: null },
    { id: 2, name: "Michael", role: "Science Teacher", emoji: "👨‍🔬", x: null, y: null, zone: null },
    { id: 3, name: "Emily", role: "English Teacher", emoji: "👩‍💼", x: null, y: null, zone: null },
    { id: 4, name: "David", role: "History Teacher", emoji: "👨‍🏫", x: null, y: null, zone: null },
    { id: 5, name: "Lisa", role: "Art Teacher", emoji: "👩‍🎨", x: null, y: null, zone: null },
    { id: 6, name: "James", role: "PE Teacher", emoji: "👨‍💪", x: null, y: null, zone: null },
    { id: 7, name: "Maria", role: "Music Teacher", emoji: "👩‍🎵", x: null, y: null, zone: null },
    { id: 8, name: "Tom", role: "Principal", emoji: "👔", x: null, y: null, zone: null }
  ]);

  const [draggedColleague, setDraggedColleague] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mapSize, setMapSize] = useState({ width: 600, height: 600 });
  const mapRef = useRef(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Initialize map size
  useEffect(() => {
    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      setMapSize({ width: rect.width, height: rect.height });
    }
  }, []);

  // Calculate distance from center and determine zone
  const calculateZone = (x, y, centerX, centerY) => {
    const distance = Math.sqrt(
      Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
    );
    const maxRadius = Math.min(mapSize.width, mapSize.height) / 2;

    if (distance < maxRadius * 0.33) {
      return 'trusted'; // Close - trusted
    } else if (distance < maxRadius * 0.67) {
      return 'acquaintance'; // Medium - acquaintance
    } else {
      return 'neutral'; // Far - neutral
    }
  };

  const handleMouseDown = (colleague, e) => {
    setIsDragging(true);
    setDraggedColleague(colleague);
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !draggedColleague || !mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Constrain to map bounds
    const constrainedX = Math.max(30, Math.min(mapSize.width - 30, x));
    const constrainedY = Math.max(30, Math.min(mapSize.height - 30, y));

    const centerX = mapSize.width / 2;
    const centerY = mapSize.height / 2;
    const zone = calculateZone(constrainedX, constrainedY, centerX, centerY);

    setColleagues(prev => prev.map(c =>
      c.id === draggedColleague.id
        ? { ...c, x: constrainedX, y: constrainedY, zone }
        : c
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedColleague(null);
  };

  // Add global mouse event listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      handleMouseMove(e);
    };

    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, draggedColleague, mapSize]);

  const handleAnalyze = () => {
    const placedCount = colleagues.filter(c => c.x !== null && c.y !== null).length;
    if (placedCount < 5) {
      alert("Please place at least 5 colleagues on the map to analyze connections.");
      return;
    }

    // Calculate connection strength index
    const centerX = mapSize.width / 2;
    const centerY = mapSize.height / 2;
    const maxRadius = Math.min(mapSize.width, mapSize.height) / 2;

    let trustedCount = 0;
    let acquaintanceCount = 0;
    let neutralCount = 0;
    let isolatedCount = 0;

    colleagues.forEach(colleague => {
      if (colleague.x !== null && colleague.y !== null) {
        const distance = Math.sqrt(
          Math.pow(colleague.x - centerX, 2) + Math.pow(colleague.y - centerY, 2)
        );

        if (distance < maxRadius * 0.33) {
          trustedCount++;
        } else if (distance < maxRadius * 0.67) {
          acquaintanceCount++;
        } else {
          neutralCount++;
          // Check if very far (isolated)
          if (distance > maxRadius * 0.85) {
            isolatedCount++;
          }
        }
      } else {
        isolatedCount++; // Not placed = isolated
      }
    });

    const totalPlaced = trustedCount + acquaintanceCount + neutralCount;
    const connectionStrength = totalPlaced > 0
      ? Math.round(
        ((trustedCount * 3 + acquaintanceCount * 2 + neutralCount * 1) / (totalPlaced * 3)) * 100
      )
      : 0;

    // Award 1 point per placed colleague (max 5 points)
    const pointsScored = Math.min(placedCount, 5);
    setScore(pointsScored);
    setShowAnalysis(true);
    setTimeout(() => {
      setShowGameOver(true);
    }, 2000);
  };

  const placedCount = colleagues.filter(c => c.x !== null && c.y !== null).length;
  const canPlaceMore = placedCount < 5;
  const centerX = mapSize.width / 2;
  const centerY = mapSize.height / 2;
  const maxRadius = Math.min(mapSize.width, mapSize.height) / 2;

  return (
    <TeacherGameShell
      title={gameData?.title || "Staffroom Connection Map"}
      subtitle={gameData?.description || "Visualize support relationships in the workplace"}
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
                Staffroom Connection Map
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Visualize your support relationships by placing colleagues on the map. Drag them closer (trusted), medium (acquaintance), or far (neutral).
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                How to Use the Map:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                  <div className="text-2xl mb-2">💚 Close</div>
                  <p className="text-sm font-semibold text-green-800 mb-1">Trusted</p>
                  <p className="text-xs text-green-700">Place in inner circle for close, trusted relationships</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
                  <div className="text-2xl mb-2">💛 Medium</div>
                  <p className="text-sm font-semibold text-yellow-800 mb-1">Acquaintance</p>
                  <p className="text-xs text-yellow-700">Place in middle circle for acquaintances</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                  <div className="text-2xl mb-2">⚪ Far</div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Neutral</p>
                  <p className="text-xs text-gray-700">Place in outer circle for neutral relationships</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mt-4">
                <strong>Instructions:</strong> Drag colleague icons from the list below onto the map. Position them based on your relationship strength with each person.
              </p>
            </div>

            {/* Connection Map */}
            <div className="relative mb-8">
              <div
                ref={mapRef}
                className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl border-4 border-blue-300 mx-auto"
                style={{ width: '100%', maxWidth: '600px', height: '600px', position: 'relative' }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                {/* Zone Circles */}
                <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                  {/* Outer circle - Neutral */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r={`${maxRadius}px`}
                    fill="none"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.5"
                  />
                  {/* Middle circle - Acquaintance */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r={`${maxRadius * 0.67}px`}
                    fill="none"
                    stroke="#FCD34D"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.5"
                  />
                  {/* Inner circle - Trusted */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r={`${maxRadius * 0.33}px`}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    opacity="0.5"
                  />
                  {/* Center dot */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r="8"
                    fill="#3B82F6"
                    opacity="0.7"
                  />
                </svg>

                {/* Zone Labels */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-4 left-4 bg-green-100 px-2 py-1 rounded text-xs font-semibold text-green-800 border border-green-300">
                    💚 Trusted
                  </div>
                  <div className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-yellow-100 px-2 py-1 rounded text-xs font-semibold text-yellow-800 border border-yellow-300">
                    💛 Acquaintance
                  </div>
                  <div className="absolute bottom-4 left-4 bg-gray-100 px-2 py-1 rounded text-xs font-semibold text-gray-800 border border-gray-300">
                    ⚪ Neutral
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-100 px-3 py-1 rounded text-xs font-semibold text-blue-800 border border-blue-300">
                    You (Center)
                  </div>
                </div>

                {/* Placed Colleagues */}
                {colleagues.map((colleague) => {
                  if (colleague.x === null || colleague.y === null) return null;

                  const zoneColor =
                    colleague.zone === 'trusted' ? 'green' :
                      colleague.zone === 'acquaintance' ? 'yellow' :
                        'gray';

                  return (
                    <motion.div
                      key={colleague.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, x: colleague.x - 30, y: colleague.y - 30 }}
                      className={`absolute w-16 h-16 rounded-full bg-white border-4 shadow-lg cursor-move flex items-center justify-center ${colleague.zone === 'trusted' ? 'border-green-400' :
                          colleague.zone === 'acquaintance' ? 'border-yellow-400' :
                            'border-gray-400'
                        }`}
                      style={{ left: 0, top: 0 }}
                      onMouseDown={(e) => handleMouseDown(colleague, e)}
                    >
                      <div className="text-2xl">{colleague.emoji}</div>
                      {colleague.zone && (
                        <div className={`absolute -top-2 -right-2 w-5 h-5 rounded-full border-2 border-white ${colleague.zone === 'trusted' ? 'bg-green-500' :
                            colleague.zone === 'acquaintance' ? 'bg-yellow-500' :
                              'bg-gray-400'
                          }`} />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Unplaced Colleagues */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" />
                Drag Colleagues to Map ({canPlaceMore ? colleagues.length - placedCount : 0} remaining):
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {colleagues
                  .filter(c => c.x === null || c.y === null)
                  .map((colleague) => (
                    <motion.div
                      key={colleague.id}
                      whileHover={{ scale: canPlaceMore ? 1.05 : 1 }}
                      whileTap={{ scale: canPlaceMore ? 0.95 : 1 }}
                      onMouseDown={(e) => {
                        if (!canPlaceMore) return; // Prevent placing more than 5
                        e.preventDefault();
                        e.stopPropagation();
                        // Calculate initial position (center of map)
                        if (mapRef.current) {
                          const rect = mapRef.current.getBoundingClientRect();
                          const centerX = rect.width / 2;
                          const centerY = rect.height / 2;
                          const zone = calculateZone(centerX, centerY, centerX, centerY);
                          const newColleague = { ...colleague, x: centerX, y: centerY, zone };
                          setColleagues(prev => prev.map(c =>
                            c.id === colleague.id ? newColleague : c
                          ));
                          // Start dragging the newly placed colleague
                          setTimeout(() => {
                            setDraggedColleague(newColleague);
                            setIsDragging(true);
                          }, 10);
                        }
                      }}
                      className={`p-4 rounded-xl border-2 text-center ${canPlaceMore
                          ? 'border-gray-300 bg-white hover:border-blue-400 hover:shadow-lg cursor-move transition-all'
                          : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60'
                        }`}
                    >
                      <div className="text-3xl mb-2">{colleague.emoji}</div>
                      <p className="font-semibold text-gray-800 text-sm">{colleague.name}</p>
                      <p className="text-xs text-gray-600">{colleague.role}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        {canPlaceMore ? 'Click to place on map' : 'Max 5 placed'}
                      </p>
                    </motion.div>
                  ))}
              </div>
              {!canPlaceMore && (
                <p className="text-sm text-gray-600 mt-3 text-center">
                  Maximum of 5 colleagues placed. Click "Analyze Connection Strength" to continue.
                </p>
              )}
            </div>

            {/* Placed Colleagues Summary */}
            {placedCount > 0 && (
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-8">
                <h3 className="text-lg font-bold text-blue-900 mb-4">
                  Colleagues Placed: {placedCount} / {colleagues.length}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-100 rounded-lg p-3 border-2 border-green-200">
                    <p className="font-semibold text-green-800 mb-1">💚 Trusted</p>
                    <p className="text-2xl font-bold text-green-600">
                      {colleagues.filter(c => c.zone === 'trusted').length}
                    </p>
                  </div>
                  <div className="bg-yellow-100 rounded-lg p-3 border-2 border-yellow-200">
                    <p className="font-semibold text-yellow-800 mb-1">💛 Acquaintance</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {colleagues.filter(c => c.zone === 'acquaintance').length}
                    </p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 border-2 border-gray-200">
                    <p className="font-semibold text-gray-800 mb-1">⚪ Neutral</p>
                    <p className="text-2xl font-bold text-gray-600">
                      {colleagues.filter(c => c.zone === 'neutral').length}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Analyze Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAnalyze}
                disabled={placedCount < 5}
                className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all flex items-center gap-3 mx-auto ${placedCount >= 5
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                <Map className="w-5 h-5" />
                Analyze Connection Strength
              </motion.button>
              {placedCount < 5 && (
                <p className="text-sm text-gray-600 mt-3">
                  Place {5 - placedCount} more colleague(s) on the map to analyze connections.
                </p>
              )}
            </div>

            {/* Analysis Preview */}
            {showAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mt-6"
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">📊</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Connection Strength Index</h3>
                  <div className="text-6xl font-bold text-green-600 mb-2">{score}%</div>
                  <p className="text-gray-700">
                    Based on your relationship placements
                  </p>
                </div>
              </motion.div>
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
                Connection Map Analysis Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You've mapped {placedCount} support relationships and earned {score} points
              </p>
            </div>

            {/* Connection Strength Index */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Connection Strength Index</h3>
                <div className="text-6xl font-bold mb-2 text-indigo-600">
                  {Math.round((score / 5) * 100)}%
                </div>
                <p className="text-gray-700 mb-4">
                  {score >= 4 ? 'Strong connections! You have many trusted relationships.' :
                    score >= 3 ? 'Good connections with room to grow closer relationships.' :
                      'Consider building deeper connections with colleagues.'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-green-100 rounded-lg p-4 border-2 border-green-200">
                    <p className="font-semibold text-green-800 mb-2">💚 Trusted</p>
                    <p className="text-3xl font-bold text-green-600">
                      {colleagues.filter(c => c.zone === 'trusted').length}
                    </p>
                    <p className="text-sm text-green-700 mt-1">Close relationships</p>
                  </div>
                  <div className="bg-yellow-100 rounded-lg p-4 border-2 border-yellow-200">
                    <p className="font-semibold text-yellow-800 mb-2">💛 Acquaintance</p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {colleagues.filter(c => c.zone === 'acquaintance').length}
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">Familiar relationships</p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 border-2 border-gray-200">
                    <p className="font-semibold text-gray-800 mb-2">⚪ Neutral</p>
                    <p className="text-3xl font-bold text-gray-600">
                      {colleagues.filter(c => c.zone === 'neutral').length}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">Neutral relationships</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Isolated Colleagues */}
            {colleagues.filter(c => c.x === null || c.y === null ||
              (c.x !== null && c.y !== null && c.zone === 'neutral' &&
                Math.sqrt(Math.pow(c.x - centerX, 2) + Math.pow(c.y - centerY, 2)) > maxRadius * 0.85)
            ).length > 0 && (
                <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200 mb-6">
                  <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Potential Isolation Points
                  </h3>
                  <p className="text-amber-800 leading-relaxed mb-4">
                    Consider reaching out to colleagues who are placed far from the center or not yet placed. They may benefit from connection and support:
                  </p>
                  <div className="space-y-2">
                    {colleagues
                      .filter(c => c.x === null || c.y === null ||
                        (c.x !== null && c.y !== null && c.zone === 'neutral' &&
                          Math.sqrt(Math.pow(c.x - centerX, 2) + Math.pow(c.y - centerY, 2)) > maxRadius * 0.85)
                      )
                      .map((colleague) => (
                        <div key={colleague.id} className="bg-white rounded-lg p-3 border-2 border-amber-200 flex items-center gap-3">
                          <div className="text-2xl">{colleague.emoji}</div>
                          <div>
                            <p className="font-semibold text-gray-800">{colleague.name}</p>
                            <p className="text-sm text-gray-600">{colleague.role}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

            {/* Insights */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Connection Insights
              </h3>
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Visual awareness:</strong> Seeing your relationships mapped out helps you understand your support network</li>
                <li>• <strong>Relationship strength:</strong> The map shows which relationships are strong, developing, or need attention</li>
                <li>• <strong>Support resources:</strong> Trusted relationships (close to center) are your primary support resources</li>
                <li>• <strong>Growth opportunities:</strong> Acquaintances (medium distance) have potential to become trusted relationships</li>
                <li>• <strong>Connection gaps:</strong> Colleagues placed far from center or not placed may need more connection</li>
                <li>• <strong>Balance:</strong> Having a mix of trusted, acquaintance, and neutral relationships is healthy and normal</li>
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
                    <strong>Use map to identify isolated colleagues and support them.</strong> The connection map helps you see who might need more connection:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Notice patterns:</strong> Look for colleagues placed far from the center or not placed at all. These may indicate weaker connections or potential isolation.</li>
                    <li><strong>Reach out intentionally:</strong> Make an effort to connect with colleagues who appear isolated on your map. Invite them to lunch, start a conversation, or offer support.</li>
                    <li><strong>Build gradually:</strong> Move isolated colleagues closer by spending time together, collaborating, or checking in regularly. Relationships build over time.</li>
                    <li><strong>Create inclusion:</strong> Include isolated colleagues in group activities, planning sessions, or casual conversations. Small gestures of inclusion make a big difference.</li>
                    <li><strong>Offer support:</strong> Ask isolated colleagues how they're doing, offer help, or share resources. Showing care builds connection.</li>
                    <li><strong>Invite collaboration:</strong> Work together on projects, share ideas, or collaborate on lessons. Collaboration builds relationships naturally.</li>
                    <li><strong>Create opportunities:</strong> Organize team activities, lunch gatherings, or informal meetups that bring people together. Structured opportunities create connections.</li>
                    <li><strong>Be patient:</strong> Building connections takes time. Be patient and consistent in reaching out, even if initial responses are reserved.</li>
                    <li><strong>Notice progress:</strong> Over time, you may notice colleagues moving closer on your mental map as relationships strengthen. Celebrate this growth.</li>
                    <li><strong>Lead by example:</strong> When you reach out to isolated colleagues, you model inclusive behavior for others. This creates a more connected culture.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you use the map to identify isolated colleagues and support them, you're creating a more inclusive and connected school community. Reaching out to isolated colleagues reduces their isolation, strengthens your relationships, and builds a culture where everyone feels valued and connected. Small, intentional acts of inclusion create significant positive change in workplace culture.
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

export default StaffroomConnectionMap;