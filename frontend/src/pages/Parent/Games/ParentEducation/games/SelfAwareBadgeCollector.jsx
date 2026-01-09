import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";
import parentGameCompletionService from "../../../../../services/parentGameCompletionService";
import parentBadgeService from "../../../../../services/parentBadgeService";
import api from "../../../../../utils/api";
import { Award, CheckCircle, Lock, Sparkles } from "lucide-react";
import { toast } from "react-toastify";

const SelfAwareBadgeCollector = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get game data
  const gameId = "parent-education-10";
  const gameData = getParentEducationGameById(gameId);
  
  const [loading, setLoading] = useState(true);
  const [gamesStatus, setGamesStatus] = useState([]);
  const [allCompleted, setAllCompleted] = useState(false);
  const [badgeCollected, setBadgeCollected] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);

  // Required game IDs (1-9)
  const requiredGameIds = [
    'parent-education-1',
    'parent-education-2',
    'parent-education-3',
    'parent-education-4',
    'parent-education-5',
    'parent-education-6',
    'parent-education-7',
    'parent-education-8',
    'parent-education-9'
  ];

  const gameNames = {
    'parent-education-1': 'Name Your Feeling',
    'parent-education-2': 'Emotion Mirror',
    'parent-education-3': 'Feelings Flashcards',
    'parent-education-4': 'Inner Weather Check',
    'parent-education-5': 'Trigger Tracker',
    'parent-education-6': 'Thought Catcher',
    'parent-education-7': 'Mood Journal',
    'parent-education-8': 'Mirror Moment',
    'parent-education-9': 'Emotional Reflex'
  };

  useEffect(() => {
    checkGamesCompletion();
    checkBadgeStatus();
  }, []);

  const checkGamesCompletion = async () => {
    try {
      setLoading(true);
      const statusPromises = requiredGameIds.map(async (id) => {
        try {
          const progress = await parentGameCompletionService.getGameProgress(id);
          return {
            gameId: id,
            name: gameNames[id] || id,
            completed: progress?.fullyCompleted === true
          };
        } catch (error) {
          console.error(`Error checking game ${id}:`, error);
          return {
            gameId: id,
            name: gameNames[id] || id,
            completed: false
          };
        }
      });

      const statuses = await Promise.all(statusPromises);
      setGamesStatus(statuses);

      const allCompletedCheck = statuses.every(status => status.completed);
      setAllCompleted(allCompletedCheck);

      // If not all completed, redirect after showing message
      if (!allCompletedCheck) {
        setTimeout(() => {
          toast.error('Complete all 9 awareness games first to unlock this badge!');
          navigate('/parent/games/parent-education');
        }, 3000);
      }
    } catch (error) {
      console.error('Error checking games completion:', error);
      toast.error('Failed to check game completion status');
    } finally {
      setLoading(false);
    }
  };

  const checkBadgeStatus = async () => {
    try {
      const result = await parentBadgeService.getSelfAwareBadgeStatus();
      if (result.hasBadge) {
        setBadgeCollected(true);
      }
    } catch (error) {
      console.error('Error checking badge status:', error);
    }
  };

  const handleCollectBadge = async () => {
    try {
      setIsCollecting(true);
      const response = await api.post('/api/parent/badge/self-aware-parent/collect');

      const result = response.data;

      if (result.success && result.badgeEarned) {
        setBadgeCollected(true);
        setShowCollectionModal(false);
        toast.success('🎉 Badge collected successfully!');
        
        // Dispatch badge earned event
        window.dispatchEvent(new CustomEvent('parentBadgeEarned', {
          detail: {
            badgeId: 'self-aware-parent',
            badgeName: 'Self-Aware Parent',
            message: 'Understanding yourself brings peace.',
            badge: result.badge
          }
        }));
        try {
          await parentGameCompletionService.completeGame({
            gameId,
            gameType: 'parent-education',
            gameIndex: gameData?.gameIndex || null,
            score: 5,
            totalLevels: 5,
            totalCoins: 0,
            isReplay: false
          });
        } catch (error) {
          console.error('Failed to mark badge game completed:', error);
        }

      } else {
        toast.error(result.error || 'Failed to collect badge');
      }
    } catch (error) {
      console.error('Error collecting badge:', error);
      const errorMessage = error.response?.data?.error || 'Failed to collect badge. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsCollecting(false);
    }
  };

  if (loading) {
    return (
      <ParentGameShell
        title={gameData?.title || "Self-Aware Parent Badge"}
        subtitle="Checking your progress..."
        showGameOver={false}
        score={0}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={0}
        totalCoins={0}
        currentQuestion={0}
      >
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading badge information...</p>
          </div>
        </div>
      </ParentGameShell>
    );
  }

  if (!allCompleted) {
    return (
      <ParentGameShell
        title={gameData?.title || "Self-Aware Parent Badge"}
        subtitle="Locked - Complete all awareness games to unlock"
        showGameOver={false}
        score={0}
        gameId={gameId}
        gameType="parent-education"
        totalLevels={0}
        totalCoins={0}
        currentQuestion={0}
      >
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-200 mb-4">
                <Lock className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Badge Locked
              </h2>
              <p className="text-lg text-gray-600">
                Complete all 9 awareness games to unlock this badge
              </p>
            </div>

            {/* Games Status List */}
            <div className="space-y-3 mb-6">
              {gamesStatus.map((game, index) => (
                <div
                  key={game.gameId}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                    game.completed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {game.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>
                    )}
                    <span className={`font-medium ${
                      game.completed ? 'text-green-800' : 'text-gray-600'
                    }`}>
                      {index + 1}. {game.name}
                    </span>
                  </div>
                  <span className={`text-sm font-semibold ${
                    game.completed ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {game.completed ? 'Completed' : 'Not Completed'}
                  </span>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{gamesStatus.filter(g => g.completed).length} / 9 games completed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                  style={{
                    width: `${(gamesStatus.filter(g => g.completed).length / 9) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 text-center">
              <p className="text-sm text-blue-700">
                Complete all awareness games to earn the Self-Aware Parent Badge!
              </p>
            </div>
          </div>
        </div>
      </ParentGameShell>
    );
  }

  return (
    <ParentGameShell
      title={gameData?.title || "Self-Aware Parent Badge"}
      subtitle="Celebrate consistent self-awareness practices"
      showGameOver={false}
      score={0}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={0}
      totalCoins={0}
      currentQuestion={0}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        {badgeCollected ? (
          // Badge Already Collected
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-400 mb-6 animate-bounce">
              <Award className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Self-Aware Parent Badge
            </h2>
            <p className="text-2xl text-purple-600 font-medium italic mb-6">
              "Understanding yourself brings peace."
            </p>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
              <p className="text-gray-700 text-lg">
                Congratulations! You have successfully completed all awareness games and earned the Self-Aware Parent Badge.
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="text-sm font-semibold text-green-800 mb-2">Parent Tip:</p>
              <p className="text-sm text-green-700">
                Display your badge proudly—your calm benefits everyone. Your commitment to self-awareness creates a more peaceful home environment for your family.
              </p>
            </div>
          </div>
        ) : (
          // Badge Collection Screen
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-400 mb-6">
              <Sparkles className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Congratulations!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              You have successfully completed all awareness games
            </p>

            {/* Completed Games List */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-8">
              <h3 className="text-lg font-bold text-green-800 mb-4">Completed Games:</h3>
              <div className="grid grid-cols-3 gap-2 text-sm">
                {gamesStatus.map((game, index) => (
                  <div
                    key={game.gameId}
                    className="flex items-center gap-2 text-green-700"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{index + 1}. {game.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Badge Preview */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border-2 border-purple-200 mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-400 mb-4">
                <span className="text-5xl">🧘</span>
              </div>
              <h3 className="text-2xl font-bold text-purple-800 mb-2">
                Self-Aware Parent Badge
              </h3>
              <p className="text-xl text-purple-600 font-medium italic">
                "Understanding yourself brings peace."
              </p>
            </div>

            {/* Collect Badge Button */}
            <button
              onClick={() => setShowCollectionModal(true)}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white px-12 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Collect Badge
            </button>
          </div>
        )}

        {/* Collection Confirmation Modal */}
        {showCollectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-400 mb-4">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Collect Your Badge
              </h3>
              <p className="text-gray-600 mb-6">
                Are you ready to collect your Self-Aware Parent Badge?
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowCollectionModal(false)}
                  disabled={isCollecting}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-full font-semibold transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCollectBadge}
                  disabled={isCollecting}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                >
                  {isCollecting ? 'Collecting...' : 'Yes, Collect Badge!'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ParentGameShell>
  );
};

export default SelfAwareBadgeCollector;

