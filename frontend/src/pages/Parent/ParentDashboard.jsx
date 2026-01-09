import { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Coins, Award, Calendar,
  BarChart3, Clock, Star, Zap, Heart,
  BookOpen, Gamepad2, Trophy, AlertTriangle,
  ArrowUp, ArrowDown, Minus, Users,
  Activity, DollarSign, Target, Share2,
  RefreshCw, Mail, Phone, School, MessageSquare,
  CheckCircle, XCircle, Lightbulb, ListTodo,
  Shield, Eye, EyeOff, Lock, Settings, Search, Filter, X, Send
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ParentDashboard = () => {
  const navigate = useNavigate();
  const { childId } = useParams();
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(childId || null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [childEmail, setChildEmail] = useState('');
  const [addingChild, setAddingChild] = useState(false);

  const fetchChildren = useCallback(async () => {
    try {
      setLoading(true);
      // Only log in development (never expose user data in production)
      if (import.meta.env.DEV) {
        console.log('Fetching children from API...');
      }
      const response = await api.get('/api/parent/children');
      const childrenData = response.data.children || [];
      if (import.meta.env.DEV) {
        console.log('Children data fetched successfully');
      }
      setChildren(childrenData);
      
      // Auto-select first child if none selected
      if (childrenData.length > 0 && !selectedChildId) {
        setSelectedChildId(childId || childrenData[0]._id);
        }
      } catch (error) {
      console.error('Error fetching children:', error);
      toast.error('Failed to load children data');
      } finally {
      setLoading(false);
    }
  }, [selectedChildId, childId]);


  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);


  const handleAddChild = async () => {
    if (!childEmail.trim()) {
      toast.error('Please enter child\'s email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(childEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setAddingChild(true);
      // Only log in development (never expose email in production)
      if (import.meta.env.DEV) {
        console.log('Linking child with email');
      }
      const response = await api.post('/api/parent/link-child', { childEmail: childEmail.trim() });
      // Only log in development (never expose response data in production)
      if (import.meta.env.DEV) {
        console.log('Link child response received');
      }
      toast.success(response.data.message || 'Child linked successfully!');
      setShowAddChildModal(false);
      setChildEmail('');
      console.log('Refreshing children list...');
      fetchChildren(); // Refresh the children list
    } catch (error) {
      console.error('Error linking child:', error);
      toast.error(error.response?.data?.message || 'Failed to link child');
    } finally {
      setAddingChild(false);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const selectedChild = children.find(c => c._id === selectedChildId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white rounded-3xl p-12 shadow-2xl max-w-md"
        >
          <Users className="w-20 h-20 text-purple-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">No Children Linked</h2>
          <p className="text-gray-600 mb-6">Link your child's account to start tracking their progress</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/parent/children')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold shadow-lg"
          >
            View Children
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const getActivityStatus = (lastActive) => {
    if (!lastActive) return 'inactive';
    const daysSinceActive = Math.floor((Date.now() - new Date(lastActive)) / (1000 * 60 * 60 * 24));
    if (daysSinceActive === 0) return 'active';
    if (daysSinceActive <= 7) return 'recent';
    return 'inactive';
  };

  const filteredChildren = children.filter(child => {
    const matchesSearch = child.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         child.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const status = getActivityStatus(child.lastActive);
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && status === 'active') ||
                         (filterStatus === 'inactive' && status === 'inactive');
    return matchesSearch && matchesFilter;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Users className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-black text-gray-900">My Children</h1>
                <p className="text-gray-600 text-lg font-medium mt-1">
                  Track and support your children's learning journey
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddChildModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Users className="w-5 h-5 inline mr-2" />
                Add Child
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fetchChildren()}
                className="px-4 py-2 bg-white text-purple-600 border-2 border-purple-200 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Activity className="w-5 h-5 inline mr-2" />
                Refresh
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-wrap gap-4"
        >
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search children..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all bg-white shadow-md"
            />
          </div>

          <div className="flex gap-2">
            {['all', 'active', 'inactive'].map((status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  filterStatus === status
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 border-2 border-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Children Grid */}
        {filteredChildren.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No children found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? 'Try a different search term' : 'Link your children to get started'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredChildren.map((child) => (
              <ChildCard key={child._id} child={child} navigate={navigate} />
            ))}
          </motion.div>
        )}

        {/* Add Child Modal */}
        <AnimatePresence>
          {showAddChildModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowAddChildModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Add Child
                  </h2>
                  <button
                    onClick={() => setShowAddChildModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="space-y-6">
                  <p className="text-gray-600">
                    Enter your child's email address to link their account and track their progress.
                  </p>

                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Child's Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        placeholder="child@example.com"
                        value={childEmail}
                        onChange={(e) => setChildEmail(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddChild();
                          }
                        }}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                        disabled={addingChild}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowAddChildModal(false);
                        setChildEmail('');
                      }}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                      disabled={addingChild}
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddChild}
                      disabled={addingChild}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {addingChild ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Linking...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Add Child
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ChildCard = ({ child, navigate }) => {
  const activityStatus = child.lastActive 
    ? Math.floor((Date.now() - new Date(child.lastActive)) / (1000 * 60 * 60 * 24))
    : null;

  const statusColor = activityStatus === null ? 'gray' :
                     activityStatus === 0 ? 'green' :
                     activityStatus <= 7 ? 'yellow' : 'red';

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(child.dob);

    return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden hover:shadow-2xl transition-all cursor-pointer group"
      onClick={() => navigate(`/parent/child/${child._id}`)}
    >
      {/* Header with Avatar */}
      <div className="relative h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 p-6">
        <div className="absolute top-4 right-4">
          <div className={`w-3 h-3 rounded-full bg-${statusColor}-500 animate-pulse shadow-lg`} />
        </div>
        <div className="absolute -bottom-12 left-6">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-200"
          >
            <img
              src={child.avatar || '/avatars/avatar1.png'}
              alt={child.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
      </div>
      </div>

      {/* Content */}
      <div className="pt-16 px-6 pb-6 space-y-4">
        {/* Name and Info */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{child.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Mail className="w-4 h-4" />
            <span className="truncate">{child.email}</span>
          </div>
          {child.institution && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <School className="w-4 h-4" />
              <span>{child.institution}</span>
            </div>
          )}
          {age && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Calendar className="w-4 h-4" />
              <span>{age} years old</span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-600">Level</span>
            </div>
            <p className="text-2xl font-black text-blue-900">{child.level || 1}</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-100">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold text-amber-600">XP</span>
            </div>
            <p className="text-2xl font-black text-amber-900">{child.xp || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
            <div className="flex items-center gap-2 mb-1">
              <Coins className="w-4 h-4 text-green-600" />
              <span className="text-xs font-semibold text-green-600">Coins</span>
            </div>
            <p className="text-2xl font-black text-green-900">{child.totalCoins || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-3 border border-orange-100">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-semibold text-orange-600">Streak</span>
            </div>
            <p className="text-2xl font-black text-orange-900">{child.streak || 0}</p>
          </div>
        </div>

        {/* Activity Status */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Last active
            </span>
            <span className="font-semibold text-gray-700">
              {activityStatus === null
                ? 'Never'
                : activityStatus === 0
                ? 'Today'
                : activityStatus === 1
                ? 'Yesterday'
                : `${activityStatus} days ago`}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/parent/child/${child._id}`);
          }}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <Eye className="w-5 h-5" />
          View Progress
        </motion.button>
      </div>
    </motion.div>
  );
};

const AnalyticsView = ({ analytics }) => {
  const {
    childCard,
    snapshotKPIs,
    detailedProgressReport,
    walletRewards,
    subscriptionAndNotifications,
    weeklyEngagement,
    moodSummary,
    recentAchievements,
    healCoins,
    activityTimeline,
    homeSupportPlan,
    messages,
    level,
    xp,
    streak,
    digitalTwinData,
    skillsDistribution
  } = analytics;

  const [permissions, setPermissions] = useState(null);
  const [loadingPermissions, setLoadingPermissions] = useState(false);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoadingPermissions(true);
      const response = await api.get('/api/parent/permissions');
      setPermissions(response.data.permissions);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoadingPermissions(false);
    }
  };

  const updatePermissions = async (newPermissions) => {
    try {
      await api.put('/api/parent/permissions', { permissions: newPermissions });
      setPermissions(newPermissions);
      toast.success('Permissions updated successfully');
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error('Failed to update permissions');
    }
  };

  return (
    <div className="space-y-6">
      {/* Child Card */}
      <ChildInfoCard childCard={childCard} />

      {/* Snapshot KPIs Strip */}
      <SnapshotKPIsStrip kpis={snapshotKPIs} level={level} xp={xp} streak={streak} healCoins={healCoins.currentBalance} />

      {/* Detailed Progress Report & Wallet & Rewards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DetailedProgressReportCard progressReport={detailedProgressReport} />
        <WalletRewardsCard walletRewards={walletRewards} />
      </div>

      {/* Digital Twin Growth & Skills Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DigitalTwinGrowthCard digitalTwinData={digitalTwinData} skillsDistribution={skillsDistribution} />
        <SkillsDistributionCard skillsDistribution={skillsDistribution} />
      </div>

      {/* Mood Summary with Conversation Prompts */}
      <MoodWithPromptsCard moodSummary={moodSummary} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Timeline */}
        <ActivityTimelineCard activityTimeline={activityTimeline} />

        {/* Weekly Engagement */}
        <EngagementCard weeklyEngagement={weeklyEngagement} />
      </div>

      {/* Home Support Plan */}
      <HomeSupportPlanCard supportPlan={homeSupportPlan} />

      {/* Messages & Notifications */}
      <MessagesCard messages={messages} />

      {/* Recent Achievements */}
      <AchievementsCard achievements={recentAchievements} />

      {/* HealCoins Activity */}
      <HealCoinsCard healCoins={healCoins} />

      {/* Subscription & Upgrades and Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubscriptionUpgradesCard subscriptionData={subscriptionAndNotifications} />
        <RecentNotificationsCard notificationsData={subscriptionAndNotifications} />
      </div>

      {/* Settings: Permission Management */}
      <PermissionsCard 
        permissions={permissions} 
        loading={loadingPermissions}
        onUpdate={updatePermissions}
      />
    </div>
  );
};

// eslint-disable-next-line no-unused-vars
const QuickStatCard = ({ icon: Icon, label, value, suffix = '', gradient }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03, y: -5 }}
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-xl text-white relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
      <Icon className="w-8 h-8 mb-3 relative z-10" />
      <p className="text-sm font-semibold opacity-90 mb-1 relative z-10">{label}</p>
      <p className="text-3xl font-black relative z-10">{value}{suffix}</p>
    </motion.div>
  );
};

// Digital Twin Growth Card Component
export const DigitalTwinGrowthCard = ({ digitalTwinData, skillsDistribution }) => {
    const pillarColors = {
      'Financial Literacy': '#22c55e',
      'Brain Health': '#3b82f6',
      'UVLS': '#a855f7',
      'Digital Citizenship & Online Safety': '#f97316',
      'Moral Values': '#6366f1',
      'AI for All': '#ec4899',
      'Health - Male': '#14b8a6',
      'Health - Female': '#f43f5e',
      'Entrepreneurship & Higher Education': '#f59e0b',
      'Civic Responsibility & Global Citizenship': '#8b5cf6',
      'Sustainability': '#10b981'
    };
    const pillarOrder = [
      'Financial Literacy',
      'Brain Health',
      'UVLS',
      'Digital Citizenship & Online Safety',
      'Moral Values',
      'AI for All',
      'Health - Male',
      'Health - Female',
      'Entrepreneurship & Higher Education',
      'Civic Responsibility & Global Citizenship',
      'Sustainability'
    ];
    const childGender = (skillsDistribution?.childGender || '').toLowerCase();
    const filteredOrder = pillarOrder.filter((pillar) => {
      if (childGender === 'male') return pillar !== 'Health - Female';
      if (childGender === 'female') return pillar !== 'Health - Male';
      return true;
    });
    const byPillar = skillsDistribution?.byPillar || null;
    const entries = byPillar
      ? filteredOrder.map((pillar) => ({
          label: pillar,
          value: Number(byPillar[pillar]) || 0,
          color: pillarColors[pillar] || '#94a3b8'
        }))
      : [
          {
            label: 'Finance',
            data: digitalTwinData?.finance || [65, 68, 72, 75],
            color: '#22c55e'
          },
          {
            label: 'Mental Wellness',
            data: digitalTwinData?.mentalWellness || [70, 75, 80, 85],
            color: '#8b5cf6'
          },
          {
            label: 'Values',
            data: digitalTwinData?.values || [50, 52, 55, 60],
            color: '#f97316'
          },
          {
            label: 'AI Skills',
            data: digitalTwinData?.aiSkills || [30, 35, 40, 45],
            color: '#ef4444'
          }
        ];
    const chartData = {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: entries.map((entry) => {
        const data = byPillar ? [entry.value, entry.value, entry.value, entry.value] : entry.data;
        return {
          label: entry.label,
          data,
          borderColor: entry.color,
          backgroundColor: `${entry.color}1A`,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 3
        };
      })
    };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12, weight: 'bold' }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { 
          callback: (value) => value % 20 === 0 ? value : '',
          stepSize: 20
        },
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-purple-600" />
          Child Growth Mastery
        </h3>
        </div>

      {/* Growth Chart */}
      <div className="h-80">
        <Line data={chartData} options={chartOptions} />
      </div>
    </motion.div>
  );
};

// Skills Distribution Card Component
export const SkillsDistributionCard = ({ skillsDistribution }) => {
    const pillarColors = {
      'Financial Literacy': '#22c55e',
      'Brain Health': '#3b82f6',
      'UVLS': '#a855f7',
      'Digital Citizenship & Online Safety': '#f97316',
      'Moral Values': '#6366f1',
      'AI for All': '#ec4899',
      'Health - Male': '#14b8a6',
      'Health - Female': '#f43f5e',
      'Entrepreneurship & Higher Education': '#f59e0b',
      'Civic Responsibility & Global Citizenship': '#8b5cf6',
      'Sustainability': '#10b981',
      'General Education': '#94a3b8'
    };
    const pillarOrder = [
      'Financial Literacy',
      'Brain Health',
      'UVLS',
      'Digital Citizenship & Online Safety',
      'Moral Values',
      'AI for All',
      'Health - Male',
      'Health - Female',
      'Entrepreneurship & Higher Education',
      'Civic Responsibility & Global Citizenship',
      'Sustainability'
    ];
    const byPillar = skillsDistribution?.byPillar || null;
    const legacyMap = {
      'Financial Literacy': skillsDistribution?.finance,
      'Brain Health': skillsDistribution?.mentalWellness,
      'UVLS': skillsDistribution?.values,
      'AI for All': skillsDistribution?.aiSkills
    };
    const rawPillars = byPillar || legacyMap;
    const childGender = (skillsDistribution?.childGender || '').toLowerCase();
    const filteredOrder = pillarOrder.filter((pillar) => {
      if (childGender === 'male') return pillar !== 'Health - Female';
      if (childGender === 'female') return pillar !== 'Health - Male';
      return true;
    });
    const entries = filteredOrder.map((pillar) => ({
      label: pillar,
      value: Number(rawPillars?.[pillar]) || 0,
      color: pillarColors[pillar] || '#94a3b8'
    }));
    const chartData = {
      labels: entries.map((entry) => entry.label),
      datasets: [
        {
          data: entries.map((entry) => entry.value),
          backgroundColor: entries.map((entry) => entry.color),
          borderWidth: 0,
          cutout: '60%'
        }
      ]
    };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12, weight: 'bold' }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed}%`
        }
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Clock className="w-6 h-6 text-purple-600" />
          Skills Distribution
        </h3>
      </div>

      {/* Donut Chart */}
      <div className="h-80 flex items-center justify-center">
        <Doughnut data={chartData} options={chartOptions} />
      </div>
    </motion.div>
  );
};

export const EngagementCard = ({ weeklyEngagement }) => {
  const chartData = {
    labels: ['Games', 'Lessons'],
    datasets: [{
      data: [weeklyEngagement?.gamesMinutes || 0, weeklyEngagement?.lessonsMinutes || 0],
      backgroundColor: [
        'rgba(147, 51, 234, 0.8)',
        'rgba(236, 72, 153, 0.8)'
      ],
      borderWidth: 0
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { font: { size: 12, weight: 'bold' } }
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Clock className="w-6 h-6 text-purple-600" />
        Weekly Engagement
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
          <Activity className="w-6 h-6 text-purple-600 mb-2" />
          <p className="text-3xl font-black text-purple-900">{weeklyEngagement?.totalMinutes || 0}</p>
          <p className="text-sm font-semibold text-gray-600">Total Minutes</p>
        </div>
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-100">
          <Target className="w-6 h-6 text-pink-600 mb-2" />
          <p className="text-3xl font-black text-pink-900">{weeklyEngagement?.totalSessions || 0}</p>
          <p className="text-sm font-semibold text-gray-600">Sessions</p>
        </div>
      </div>

      <div className="h-48">
        <Doughnut data={chartData} options={chartOptions} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-gray-700">Games</span>
          </div>
          <span className="font-bold text-purple-900">{weeklyEngagement?.gameSessions || 0}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-pink-50 rounded-xl">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-pink-600" />
            <span className="text-sm font-semibold text-gray-700">Lessons</span>
          </div>
          <span className="font-bold text-pink-900">{weeklyEngagement?.lessonSessions || 0}</span>
        </div>
      </div>
    </motion.div>
  );
};

const MoodSummaryCard = ({ moodSummary }) => {
  const getMoodEmoji = (score) => {
    if (score >= 4) return '😄';
    if (score === 3) return '😊';
    if (score === 2) return '😐';
    return '😔';
  };

  const getMoodColor = (score) => {
    if (score >= 4) return 'from-green-400 to-emerald-500';
    if (score === 3) return 'from-blue-400 to-cyan-500';
    if (score === 2) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  return (
        <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Heart className="w-6 h-6 text-pink-600" />
        Mood Tracker (Last 7 Days)
      </h3>

      {/* Average Score */}
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-4 mb-4 border border-pink-100">
        <div className="flex items-center justify-between">
            <div>
            <p className="text-sm font-semibold text-gray-600 mb-1">Average Mood</p>
            <p className="text-4xl font-black text-pink-900">{moodSummary?.averageScore || '3.0'}</p>
          </div>
          <div className="text-6xl">{getMoodEmoji(parseFloat(moodSummary?.averageScore || 3))}</div>
        </div>
      </div>

      {/* Alerts */}
      {moodSummary?.alerts && moodSummary.alerts.length > 0 && (
        <div className="space-y-2 mb-4">
          {moodSummary.alerts.map((alert, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 rounded-xl border-l-4 ${
                alert.severity === 'high'
                  ? 'bg-red-50 border-red-500'
                  : 'bg-yellow-50 border-yellow-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 ${
                  alert.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                } flex-shrink-0 mt-0.5`} />
                <div>
                  <p className={`font-bold ${
                    alert.severity === 'high' ? 'text-red-900' : 'text-yellow-900'
                  }`}>
                    {alert.type === 'alert' ? '⚠️ Attention Needed' : '⚡ Notice'}
                  </p>
                  <p className="text-sm text-gray-700">{alert.message}</p>
            </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Mood Entries Timeline */}
      <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
        {moodSummary?.entries && moodSummary.entries.length > 0 ? (
          moodSummary.entries.map((entry, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-gradient-to-r ${getMoodColor(entry.score)} bg-opacity-10 rounded-xl p-3 border border-gray-200`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl">{entry.emoji || getMoodEmoji(entry.score)}</span>
                <span className="text-xs font-semibold text-gray-500">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
              </div>
              {entry.note && (
                <p className="text-sm text-gray-700 italic">&quot;{entry.note}&quot;</p>
              )}
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">No mood entries this week</p>
        )}
      </div>
    </motion.div>
  );
};

export const AchievementsCard = ({ achievements }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50"
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-600" />
        Recent Achievements
      </h3>

      {achievements && achievements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`p-4 rounded-2xl border-2 shadow-lg ${
                achievement.type === 'certificate'
                  ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200'
                  : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {achievement.type === 'certificate' ? (
                  <Award className="w-8 h-8 text-amber-600 flex-shrink-0" />
                ) : (
                  <Trophy className="w-8 h-8 text-purple-600 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 mb-1 truncate">{achievement.achievement}</p>
                  <p className="text-sm text-gray-600 mb-1 truncate">{achievement.game}</p>
                  <p className="text-xs text-gray-500">{achievement.category}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
            </div>
          </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No achievements yet. Keep learning!</p>
        </div>
      )}
    </motion.div>
  );
};

export const HealCoinsCard = ({ healCoins }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
    >
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Coins className="w-5 h-5 text-emerald-600" />
        HealCoins Activity
      </h3>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
          <DollarSign className="w-5 h-5 text-emerald-600 mb-2" />
          <p className="text-2xl font-bold text-emerald-700">{healCoins?.currentBalance || 0}</p>
          <p className="text-xs font-medium text-slate-600">Current Balance</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <ArrowUp className="w-5 h-5 text-blue-600 mb-2" />
          <p className="text-2xl font-bold text-blue-700">{healCoins?.weeklyEarned || 0}</p>
          <p className="text-xs font-medium text-slate-600">Weekly Earned</p>
        </div>
        <div className="bg-rose-50 rounded-lg p-4 border border-rose-200">
          <ArrowDown className="w-5 h-5 text-rose-600 mb-2" />
          <p className="text-2xl font-bold text-rose-700">{healCoins?.weeklySpent || 0}</p>
          <p className="text-xs font-medium text-slate-600">Weekly Spent</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h4 className="text-sm font-bold text-slate-800 mb-3">Recent Transactions</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {healCoins?.recentTransactions && healCoins.recentTransactions.length > 0 ? (
            healCoins.recentTransactions.map((transaction, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                className={`flex items-center justify-between p-2.5 rounded-lg border ${
                  transaction.type === 'credit'
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-rose-50 border-rose-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {transaction.type === 'credit' ? (
                    <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center">
                      <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 bg-rose-100 rounded-full flex items-center justify-center">
                      <ArrowDown className="w-3.5 h-3.5 text-rose-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{transaction.description}</p>
                    <p className="text-xs text-slate-600">
                      {new Date(transaction.date).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className={`font-bold text-sm ${
                  transaction.type === 'credit' ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}{Math.abs(transaction.amount)}
                </span>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-slate-500 py-6 text-sm">No transactions this week</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Child Info Card Component
export const ChildInfoCard = ({ childCard, studentId: propStudentId }) => {
  console.log('ChildInfoCard received childCard:', childCard);
  console.log('ChildInfoCard received studentId prop:', propStudentId);
  if (!childCard) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
      <div className="relative z-10">
        <div className="flex items-start justify-between flex-wrap gap-4">
          {/* Avatar and Basic Info */}
              <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-20 h-20 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white"
            >
              <img
                src={childCard.avatar || '/avatars/avatar1.png'}
                alt={childCard.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
                <div>
              <h2 className="text-3xl font-black mb-1">{childCard.name}</h2>
              <div className="flex flex-col gap-2 text-sm font-semibold opacity-90">
                {childCard.grade && childCard.grade !== 'Not specified' && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Grade {childCard.grade}</span>
                  </div>
                )}
                {childCard.institution && childCard.institution !== 'Not specified' && (
                  <div className="flex items-center gap-1">
                    <School className="w-4 h-4" />
                    <span>{childCard.institution}</span>
                  </div>
                )}
                {childCard.age && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{childCard.age} years old</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Parent Contact */}
          {childCard.parentContact && (
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-20 h-20 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white"
              >
                <img
                  src={childCard.parentContact.avatar || '/avatars/avatar1.png'}
                  alt={childCard.parentContact.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div>
                <h2 className="text-3xl font-black mb-1">{childCard.parentContact.name}</h2>
                <div className="flex items-center gap-4 text-sm font-semibold opacity-90">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{childCard.parentContact.email}</span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // Navigate to parent chat page - use propStudentId first, then try childCard fields
                  const studentId = propStudentId || childCard.studentId || childCard._id || childCard.id;
                  if (!studentId) {
                    console.error('No student ID found. childCard:', childCard, 'propStudentId:', propStudentId);
                    return;
                  }
                  // Validate studentId is a valid MongoDB ObjectId (24 hex characters)
                  if (!studentId.match(/^[0-9a-fA-F]{24}$/)) {
                    console.error('Invalid student ID format:', studentId);
                    return;
                  }
                  window.location.href = `/school-teacher/student/${studentId}/parent-chat`;
                }}
                className="flex items-center justify-center w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-sm transition-all backdrop-blur-md border border-white/30"
              >
                <MessageSquare className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
        </motion.div>
  );
};

// Snapshot KPIs Strip Component
export const SnapshotKPIsStrip = ({ kpis, level, xp, streak, healCoins }) => {
  const kpiItems = [
    { label: 'Level', value: level, icon: Star, color: 'from-blue-500 to-indigo-600' },
    { label: 'Total XP', value: xp, icon: Zap, color: 'from-amber-500 to-orange-600' },
    { label: 'Streak', value: `${streak} days`, icon: Target, color: 'from-orange-500 to-red-600' },
    { label: 'Coins', value: healCoins, icon: Coins, color: 'from-green-500 to-emerald-600' },
    { label: 'Games Done', value: kpis?.totalGamesCompleted || 0, icon: Gamepad2, color: 'from-purple-500 to-pink-600' },
    { label: 'This Week', value: `${kpis?.totalTimeSpent || 0}m`, icon: Clock, color: 'from-cyan-500 to-blue-600' },
  ];

  return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/50"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiItems.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="text-center"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg`}>
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-black text-gray-900">{item.value}</p>
            <p className="text-xs font-semibold text-gray-600">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Mood Summary with Conversation Prompts Component
export const MoodWithPromptsCard = ({ moodSummary }) => {
  const getMoodEmoji = (score) => {
    if (score >= 4) return '😄';
    if (score === 3) return '😊';
    if (score === 2) return '😐';
    return '😔';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50"
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Heart className="w-6 h-6 text-pink-600" />
        Mood & Conversation Starters
              </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Summary */}
        <div>
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-4 mb-4 border border-pink-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Average Mood (7 days)</p>
                <p className="text-4xl font-black text-pink-900">{moodSummary?.averageScore || '3.0'}</p>
              </div>
              <div className="text-6xl">{getMoodEmoji(parseFloat(moodSummary?.averageScore || 3))}</div>
            </div>
          </div>

          {/* Alerts */}
          {moodSummary?.alerts && moodSummary.alerts.length > 0 && (
            <div className="space-y-2">
              {moodSummary.alerts.map((alert, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-xl border-l-4 ${
                    alert.severity === 'high'
                      ? 'bg-red-50 border-red-500'
                      : 'bg-yellow-50 border-yellow-500'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle className={`w-4 h-4 ${
                      alert.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                    } flex-shrink-0 mt-0.5`} />
                    <p className="text-sm font-semibold text-gray-700">{alert.message}</p>
            </div>
                </motion.div>
              ))}
            </div>
          )}
          </div>

        {/* Conversation Prompts */}
        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            Suggested Conversation Starters
          </h4>
          <div className="space-y-3">
            {moodSummary?.conversationPrompts?.map((prompt, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{prompt.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">{prompt.prompt}</p>
                    <p className="text-xs text-gray-500">{prompt.context}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Activity Timeline Component
export const ActivityTimelineCard = ({ activityTimeline }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'game': return <Gamepad2 className="w-4 h-4" />;
      case 'lesson': return <BookOpen className="w-4 h-4" />;
      case 'quiz': return <Trophy className="w-4 h-4" />;
      case 'mood': return <Heart className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

 const getActivityColor = (type) => {
    switch (type) {
      case 'game': return 'from-purple-500 to-pink-600';
      case 'lesson': return 'from-blue-500 to-cyan-600';
      case 'quiz': return 'from-amber-500 to-orange-600';
      case 'mood': return 'from-pink-500 to-rose-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Activity className="w-6 h-6 text-purple-600" />
        Activity Timeline (7 Days)
            </h3>

      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {activityTimeline && activityTimeline.length > 0 ? (
          activityTimeline.map((activity, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-purple-50 border border-gray-100"
            >
              <div className={`w-10 h-10 bg-gradient-to-br ${getActivityColor(activity.type)} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{activity.action}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span>{new Date(activity.timestamp).toLocaleString()}</span>
                  <span>•</span>
                  <span>{activity.duration}m</span>
                  {activity.category && (
                    <>
                      <span>•</span>
                      <span className="text-purple-600 font-semibold">{activity.category}</span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">No activities this week</p>
        )}
      </div>
    </motion.div>
  );
};

// Home Support Plan Component
export const HomeSupportPlanCard = ({ supportPlan }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-pink-600';
      case 'medium': return 'from-amber-500 to-orange-600';
      default: return 'from-blue-500 to-cyan-600';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50"
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Lightbulb className="w-6 h-6 text-yellow-600" />
        Home Support Plan
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {supportPlan?.map((task, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.03, y: -5 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-100 shadow-lg"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${getPriorityColor(task.priority)} rounded-xl flex items-center justify-center text-white shadow-md`}>
                <ListTodo className="w-5 h-5" />
            </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${getPriorityBadge(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">{task.title}</h4>
            <p className="text-sm text-gray-600 mb-3">{task.description}</p>
            <div className="pt-3 border-t border-purple-200">
              <p className="text-xs font-semibold text-purple-700 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Action: {task.actionable}
              </p>
          </div>
        </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Messages & Notifications Component
export const MessagesCard = ({ messages }) => {
  return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50"
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-blue-600" />
        Messages & Notifications
      </h3>

      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {messages && messages.length > 0 ? (
          messages.map((message, idx) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-4 rounded-xl border-2 ${
                message.requiresAction
                  ? 'bg-amber-50 border-amber-300'
                  : message.read
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-blue-50 border-blue-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Mail className={`w-4 h-4 ${message.read ? 'text-gray-400' : 'text-blue-600'}`} />
                  <span className="text-sm font-semibold text-gray-600">{message.sender}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleDateString()}
                </span>
                </div>
              <h4 className="font-bold text-gray-900 mb-1">{message.title}</h4>
              <p className="text-sm text-gray-700">{message.message}</p>
              {message.requiresAction && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-3 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg text-sm font-bold shadow-md"
                >
                  Take Action
                </motion.button>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No new messages</p>
              </div>
        )}
                </div>
    </motion.div>
  );
};

// Permission Management Component
export const PermissionsCard = ({ permissions, loading, onUpdate }) => {
  const [localPermissions, setLocalPermissions] = useState(permissions);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalPermissions(permissions);
  }, [permissions]);

  const handleToggle = (category, key) => {
    const newPermissions = {
      ...localPermissions,
      [category]: {
        ...localPermissions[category],
        [key]: !localPermissions[category][key]
      }
    };
    setLocalPermissions(newPermissions);
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdate(localPermissions);
    setHasChanges(false);
  };

  if (loading || !localPermissions) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
      </div>
    );
  }

  return (
                  <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-6 h-6 text-indigo-600" />
          Privacy & Permissions
        </h3>
        {hasChanges && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg"
          >
            Save Changes
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Sharing */}
        <div className="space-y-3">
          <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-600" />
            Data Sharing Consent
          </h4>
          <PermissionToggle
            label="Share with Teachers"
            checked={localPermissions?.dataSharing?.withTeachers}
            onChange={() => handleToggle('dataSharing', 'withTeachers')}
            description="Allow teachers to view progress and activities"
          />
          <PermissionToggle
            label="Share with School"
            checked={localPermissions?.dataSharing?.withSchool}
            onChange={() => handleToggle('dataSharing', 'withSchool')}
            description="Allow school administrators to access reports"
          />
          <PermissionToggle
            label="Research & Improvement"
            checked={localPermissions?.dataSharing?.forResearch}
            onChange={() => handleToggle('dataSharing', 'forResearch')}
            description="Help us improve by sharing anonymized data"
          />
          <PermissionToggle
            label="Third-Party Services"
            checked={localPermissions?.dataSharing?.thirdParty}
            onChange={() => handleToggle('dataSharing', 'thirdParty')}
            description="Share data with trusted educational partners"
                  />
                </div>

        {/* Child Activity Permissions */}
        <div className="space-y-3">
          <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-purple-600" />
            Child Activity Controls
          </h4>
          <PermissionToggle
            label="Allow Games"
            checked={localPermissions?.childActivity?.allowGames}
            onChange={() => handleToggle('childActivity', 'allowGames')}
            description="Enable access to learning games"
          />
          <PermissionToggle
            label="Social Features"
            checked={localPermissions?.childActivity?.allowSocialFeatures}
            onChange={() => handleToggle('childActivity', 'allowSocialFeatures')}
            description="Allow leaderboards and friend interactions"
          />
          <PermissionToggle
            label="In-App Purchases"
            checked={localPermissions?.childActivity?.allowPurchases}
            onChange={() => handleToggle('childActivity', 'allowPurchases')}
            description="Permit coin redemptions and purchases"
          />
              </div>
                </div>
    </motion.div>
  );
};

// Permission Toggle Component
const PermissionToggle = ({ label, checked, onChange, description }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
      <div className="flex-1">
        <p className="font-semibold text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                </div>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div
          onClick={onChange}
          className={`w-14 h-7 rounded-full cursor-pointer transition-all ${
            checked ? 'bg-gradient-to-r from-purple-500 to-pink-600' : 'bg-gray-300'
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 mt-1 ${
              checked ? 'translate-x-8 ml-1' : 'translate-x-1'
            }`}
          />
              </div>
            </div>
    </div>
  );
};

// Detailed Progress Report Component
export const DetailedProgressReportCard = ({ progressReport }) => {
  if (!progressReport) return null;

    const { 
      weeklyCoins = 0, 
      monthlyCoins = 0, 
      totalTimeMinutes = 0, 
      dayStreak = 0, 
      gamesPerPillar = {}, 
      strengths = [], 
      needsSupport = [],
      childGender = ''
    } = progressReport;

    const pillarColors = {
      'Financial Literacy': 'from-green-500 to-emerald-600',
      'Brain Health': 'from-blue-500 to-cyan-600',
      'UVLS': 'from-purple-500 to-pink-600',
      'Digital Citizenship & Online Safety': 'from-orange-500 to-red-600',
      'Moral Values': 'from-indigo-500 to-blue-600',
      'AI for All': 'from-pink-500 to-rose-600',
      'Health - Male': 'from-teal-500 to-cyan-600',
      'Health - Female': 'from-rose-500 to-pink-600',
      'Entrepreneurship & Higher Education': 'from-amber-500 to-orange-600',
      'Civic Responsibility & Global Citizenship': 'from-violet-500 to-purple-600',
      'General Education': 'from-slate-500 to-gray-600'
    };

      const pillarLabels = {
        'Financial Literacy': 'Financial Literacy',
        'Brain Health': 'Brain Health',
        'UVLS': 'UVLS',
        'Digital Citizenship & Online Safety': 'Digital Citizenship & Online Safety',
        'Moral Values': 'Moral Values',
        'AI for All': 'AI for All',
        'Health - Male': 'Health - Male',
        'Health - Female': 'Health - Female',
        'Entrepreneurship & Higher Education': 'Entrepreneurship & Higher Education',
        'Civic Responsibility & Global Citizenship': 'Civic Responsibility & Global Citizenship',
        'General Education': 'General Education'
      };
    const pillarList = (() => {
      const list = Object.keys(pillarColors);
      if (childGender === 'male') {
        return list.filter((pillar) => pillar !== 'Health - Female');
      }
      if (childGender === 'female') {
        return list.filter((pillar) => pillar !== 'Health - Male');
      }
      return list;
    })();

  return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50"
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-blue-600" />
              Detailed Progress Report
            </h3>
            
        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100"
          >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Coins className="w-4 h-4 text-white" />
              </div>
            <span className="text-sm font-semibold text-gray-600">Weekly Coins</span>
            </div>
            <p className="text-3xl font-black text-green-600">{weeklyCoins}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100"
          >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
              </div>
            <span className="text-sm font-semibold text-gray-600">Total Time</span>
            </div>
          <p className="text-3xl font-black text-purple-600">{totalTimeMinutes}m</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-4 border border-orange-100"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
                  </div>
            <span className="text-sm font-semibold text-gray-600">Day Streak</span>
          </div>
          <p className="text-3xl font-black text-orange-600">{dayStreak}</p>
        </motion.div>
      </div>

      {/* Games Completed per Pillar */}
      <div className="mb-6">
        <h4 className="text-lg font-bold text-gray-800 mb-3">Games Completed per Pillar</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {pillarList.map((pillar, idx) => (
              <motion.div
                key={pillar}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`bg-gradient-to-br ${pillarColors[pillar] || 'from-gray-500 to-slate-600'} rounded-xl p-4 text-white shadow-lg`}
              >
                <p className="text-2xl font-black">{gamesPerPillar[pillar] || 0}</p>
                <p className="text-sm font-semibold opacity-90">{pillarLabels[pillar] || pillar}</p>
              </motion.div>
            ))}
          </div>
            </div>
            
      {/* Strengths and Needs Support */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
              <div>
          <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-green-600" />
                  Strengths
                </h4>
                <div className="space-y-2">
            {strengths.map((strength, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100"
              >
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="font-semibold text-gray-800">{strength}</span>
              </motion.div>
                  ))}
                </div>
              </div>

        {/* Needs Support */}
              <div>
          <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-600" />
                  Needs Support
                </h4>
                <div className="space-y-2">
            {needsSupport.map((support, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-100"
              >
                <Target className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <span className="font-semibold text-gray-800">{support}</span>
              </motion.div>
                  ))}
                </div>
              </div>
            </div>
    </motion.div>
  );
};

// Wallet & Rewards Component
export const WalletRewardsCard = ({ walletRewards }) => {
  if (!walletRewards) return null;

  const { currentHealCoins, recentRedemptions, totalValueSaved } = walletRewards;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
    >
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-indigo-600" />
        Wallet & Rewards
      </h3>

      {/* Current HealCoins */}
      <div className="mb-4">
        <p className="flex justify-center text-3xl font-bold text-indigo-600 mb-1">{currentHealCoins}</p>
        <p className="flex justify-center text-sm font-medium text-slate-600">Current HealCoins</p>
      </div>
            
      {/* Recent Redemptions */}
      <div className="mb-4">
        <h4 className="text-sm font-bold text-slate-800 mb-3">Recent Redemptions</h4>
        <div className="space-y-2">
          {recentRedemptions && recentRedemptions.length > 0 ? (
            recentRedemptions.map((redemption, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-200"
              >
                <div className="flex-1">
                  <p className="font-semibold text-sm text-slate-900">{redemption.item}</p>
                  <p className="text-xs text-slate-600">
                    {new Date(redemption.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-indigo-600">-{redemption.coins} coins</p>
                  <p className="text-xs font-medium text-emerald-600">₹{redemption.value} value</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-6">
              <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No recent redemptions</p>
            </div>
          )}
        </div>
      </div>

      {/* Total Value Saved */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-emerald-50 rounded-lg p-4 border border-emerald-200"
      >
        <p className="flex justify-center text-2xl font-bold text-emerald-600 mb-1">₹{totalValueSaved}</p>
        <p className="flex justify-center text-xs font-medium text-emerald-700">Total Value Saved This Month</p>
      </motion.div>
    </motion.div>
  );
};

// Subscription & Upgrades Component
export const SubscriptionUpgradesCard = ({ subscriptionData }) => {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      await api.post('/api/parent/upgrade-subscription', { 
        planType: 'premium_plus' 
      });
      toast.success('Subscription upgraded successfully!');
      // Refresh the page to show updated subscription
      window.location.reload();
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      toast.error('Failed to upgrade subscription');
    } finally {
      setLoading(false);
    }
  };

  if (!subscriptionData) return null;

  const { subscription } = subscriptionData;

  return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50"
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Award className="w-6 h-6 text-yellow-600" />
              Subscription & Upgrades
            </h3>

      {/* Current Plan */}
      <div className="mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-4 border border-yellow-200 relative"
        >
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-xl font-bold text-gray-900">{subscription.currentPlan.name}</h4>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
              {subscription.currentPlan.status}
                </span>
              </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Next billing: {subscription.currentPlan.nextBilling} • {subscription.currentPlan.currency}{subscription.currentPlan.price}/{subscription.currentPlan.billingCycle}
          </p>

          {/* Features List */}
          <div className="space-y-2">
            {subscription.currentPlan.features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </motion.div>
                ))}
              </div>
        </motion.div>
            </div>
            
            {/* Upgrade Option */}
      <div className="mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-dashed border-purple-300"
        >
          <h4 className="text-lg font-bold text-purple-700 mb-2">
            Upgrade to {subscription.upgradeOption.name}
          </h4>
          <p className="text-2xl font-black text-purple-600 mb-3">
            {subscription.upgradeOption.currency}{subscription.upgradeOption.price}/{subscription.upgradeOption.billingCycle}
          </p>
          
          <div className="space-y-1 mb-4">
            {subscription.upgradeOption.features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span className="text-sm text-purple-700">{feature}</span>
              </motion.div>
            ))}
                </div>
        </motion.div>
            </div>
            
      {/* Upgrade Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpgrade}
        disabled={loading}
        className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Upgrading...
          </div>
        ) : (
          'One-Click Upgrade'
        )}
      </motion.button>
    </motion.div>
  );
};

// Recent Notifications Component
export const RecentNotificationsCard = ({ notificationsData }) => {
  const [emailNotifications, setEmailNotifications] = useState(
    notificationsData?.emailNotificationsEnabled || true
  );

  const handleToggleEmailNotifications = async () => {
    try {
      const newValue = !emailNotifications;
      await api.put('/api/parent/email-notifications', { enabled: newValue });
      setEmailNotifications(newValue);
      toast.success(`Email notifications ${newValue ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating email notifications:', error);
      toast.error('Failed to update email notifications');
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  };

  const getCardColors = (cardColor) => {
    switch (cardColor) {
      case 'yellow':
        return 'from-yellow-50 to-amber-50 border-yellow-200';
      case 'green':
        return 'from-green-50 to-emerald-50 border-green-200';
      case 'purple':
        return 'from-purple-50 to-pink-50 border-purple-200';
      case 'blue':
        return 'from-blue-50 to-cyan-50 border-blue-200';
      default:
        return 'from-gray-50 to-slate-50 border-gray-200';
    }
  };

  if (!notificationsData) return null;

  const { notifications } = notificationsData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50"
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-blue-600" />
              Recent Notifications
            </h3>

      {/* Notifications List */}
      <div className="space-y-3 mb-6">
        {notifications && notifications.length > 0 ? (
          notifications.map((notification, idx) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`bg-gradient-to-r ${getCardColors(notification.cardColor)} rounded-xl p-4 border-2 shadow-sm`}
            >
                  <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">{notification.icon}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 mb-1">{notification.title}</h4>
                  <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                  <p className="text-xs text-gray-500">{getTimeAgo(notification.timestamp)}</p>
                      </div>
                    </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No recent notifications</p>
                  </div>
        )}
            </div>
            
      {/* Email Notifications Toggle */}
      <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Email Notifications</span>
          <div className="relative">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={handleToggleEmailNotifications}
              className="sr-only peer"
            />
            <div
              onClick={handleToggleEmailNotifications}
              className={`w-12 h-6 rounded-full cursor-pointer transition-all ${
                emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 mt-0.5 ${
                  emailNotifications ? 'translate-x-7 ml-1' : 'translate-x-1'
                }`}
              />
              </div>
            </div>
          </div>
      </div>
    </motion.div>
  );
};

export default ParentDashboard;


