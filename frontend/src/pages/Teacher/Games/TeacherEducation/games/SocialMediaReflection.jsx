import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Smartphone, TrendingUp, TrendingDown, Heart, Smile, Frown, Meh, AlertCircle, BookOpen, Wind, Sparkles, Eye, CheckCircle } from "lucide-react";

const SocialMediaReflection = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-94";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentStep, setCurrentStep] = useState('pre-scroll'); // 'pre-scroll', 'scrolling', 'post-scroll', 'reflection', 'complete'
  const [preScrollMood, setPreScrollMood] = useState(null);
  const [postScrollMood, setPostScrollMood] = useState(null);
  const [scrolledItems, setScrolledItems] = useState(new Set());
  const [scrollTime, setScrollTime] = useState(0);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [scrollTimer, setScrollTimer] = useState(null);

  // Emotion options with emojis
  const emotions = [
    { id: 'very-positive', label: 'Very Positive', emoji: '😊', value: 5, color: 'from-green-400 to-emerald-500', bgColor: 'from-green-50 to-emerald-50', borderColor: 'border-green-300' },
    { id: 'positive', label: 'Positive', emoji: '🙂', value: 4, color: 'from-blue-400 to-cyan-500', bgColor: 'from-blue-50 to-cyan-50', borderColor: 'border-blue-300' },
    { id: 'neutral', label: 'Neutral', emoji: '😐', value: 3, color: 'from-gray-400 to-slate-500', bgColor: 'from-gray-50 to-slate-50', borderColor: 'border-gray-300' },
    { id: 'negative', label: 'Negative', emoji: '😔', value: 2, color: 'from-orange-400 to-amber-500', bgColor: 'from-orange-50 to-amber-50', borderColor: 'border-orange-300' },
    { id: 'very-negative', label: 'Very Negative', emoji: '😢', value: 1, color: 'from-red-400 to-rose-500', bgColor: 'from-red-50 to-rose-50', borderColor: 'border-red-300' }
  ];

  // Simulated social media feed posts
  const socialMediaFeed = [
    {
      id: 1,
      type: 'post',
      author: 'Sarah Teacher',
      avatar: '👩‍🏫',
      content: 'Just finished an amazing lesson! Students were so engaged today. Feeling grateful for this profession! 🙏 #TeachingJoy',
      likes: 245,
      comments: 32,
      time: '2h ago',
      color: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 2,
      type: 'post',
      author: 'Education News',
      avatar: '📰',
      content: 'New study shows teacher workload has increased 30% in the past 5 years. Burnout rates at all-time high...',
      likes: 1.2,
      comments: 456,
      time: '5h ago',
      color: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    {
      id: 3,
      type: 'post',
      author: 'Perfect Classroom',
      avatar: '✨',
      content: 'Check out my perfectly organized classroom! Everything is color-coded and labeled. Wish my room looked like this...',
      image: '📸 Classroom Photo',
      likes: 3.5,
      comments: 189,
      time: '8h ago',
      color: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 4,
      type: 'post',
      author: 'Teacher Life',
      avatar: '💼',
      content: 'Up at 5 AM to grade papers, stayed until 7 PM for parent meetings. When do we get to rest? 😴',
      likes: 892,
      comments: 234,
      time: '12h ago',
      color: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      id: 5,
      type: 'ad',
      content: '🎓 Get Your Master\'s Degree Online - Special Discount for Teachers!',
      color: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    }
  ];

  const handleStartScrolling = () => {
    if (!preScrollMood) {
      alert('Please select your mood before scrolling first.');
      return;
    }

    setCurrentStep('scrolling');

    // Start timer
    const timer = setInterval(() => {
      setScrollTime(prev => prev + 1);
    }, 1000);
    setScrollTimer(timer);
  };

  const handleItemViewed = (itemId) => {
    setScrolledItems(prev => {
      const newSet = new Set([...prev, itemId]);
      // Award 1 point for each new item viewed
      setScore(newSet.size);
      return newSet;
    });
  };

  const handleFinishScrolling = () => {
    if (scrollTimer) {
      clearInterval(scrollTimer);
      setScrollTimer(null);
    }
    // If user hasn't viewed 5 posts yet, still allow them to finish scrolling
    setCurrentStep('post-scroll');
  };

  const handleSelectPreScrollMood = (emotion) => {
    setPreScrollMood(emotion);
  };

  const handleSelectPostScrollMood = (emotion) => {
    setPostScrollMood(emotion);
    setCurrentStep('reflection');
    // Automatically move to game complete after a brief reflection
    setTimeout(() => {
      setShowGameOver(true);
    }, 1000);
  };

  const getMoodChange = () => {
    if (!preScrollMood || !postScrollMood) return null;

    const change = postScrollMood.value - preScrollMood.value;
    return {
      value: change,
      direction: change > 0 ? 'improved' : change < 0 ? 'worsened' : 'unchanged',
      magnitude: Math.abs(change),
      description: change > 0
        ? `Your mood improved by ${change} point(s) after scrolling`
        : change < 0
          ? `Your mood worsened by ${Math.abs(change)} point(s) after scrolling`
          : 'Your mood remained unchanged after scrolling'
    };
  };

  const getReflectionInsights = () => {
    const moodChange = getMoodChange();
    const insights = [];

    if (moodChange?.direction === 'worsened') {
      insights.push({
        type: 'warning',
        icon: '⚠️',
        title: 'Mood Worsened',
        message: 'Scrolling may have negatively impacted your emotional state. Consider limiting social media time.',
        color: 'from-red-50 to-rose-50',
        borderColor: 'border-red-300'
      });
    } else if (moodChange?.direction === 'unchanged') {
      insights.push({
        type: 'neutral',
        icon: '📊',
        title: 'Mood Unchanged',
        message: 'Scrolling didn\'t significantly change your mood. Consider whether this time could be better spent.',
        color: 'from-gray-50 to-slate-50',
        borderColor: 'border-gray-300'
      });
    } else {
      insights.push({
        type: 'positive',
        icon: '✨',
        title: 'Mood Improved',
        message: 'You found positive content that lifted your mood. Be mindful of seeking validation from social media.',
        color: 'from-green-50 to-emerald-50',
        borderColor: 'border-green-300'
      });
    }

    // Time-based insights
    if (scrollTime > 600) { // 10 minutes
      insights.push({
        type: 'warning',
        icon: '⏰',
        title: 'Extended Scrolling',
        message: `You spent ${Math.round(scrollTime / 60)} minutes scrolling. This time could be used for rest or mindful activities.`,
        color: 'from-orange-50 to-amber-50',
        borderColor: 'border-orange-300'
      });
    }

    // Engagement insights
    if (scrolledItems.size > 8) {
      insights.push({
        type: 'info',
        icon: '👀',
        title: 'High Engagement',
        message: `You viewed ${scrolledItems.size} posts. Consider setting limits on how many posts you view per session.`,
        color: 'from-blue-50 to-cyan-50',
        borderColor: 'border-blue-300'
      });
    }

    return insights;
  };

  const handleComplete = () => {
    // Score is already calculated based on number of items scrolled
    setShowGameOver(true);
  };

  // Automatically move to reflection when all posts are viewed
  React.useEffect(() => {
    if (scrolledItems.size >= 5 && currentStep === 'scrolling') {
      // Wait a bit to show the last post being viewed, then move to post-scroll mood selection
      const timer = setTimeout(() => {
        setCurrentStep('post-scroll');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [scrolledItems.size, currentStep]);

  const moodChange = getMoodChange();

  if (showGameOver) {
    const insights = getReflectionInsights();

    return (
      <TeacherGameShell
        title={gameData?.title || "Social-Media Reflection"}
        subtitle={gameData?.description || "Observe emotional patterns after social-media scrolling"}
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="teacher-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentQuestion={Math.min(scrolledItems.size, totalLevels)}
      >
        <div className="w-full max-w-4xl mx-auto px-4">
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
                📱✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Reflection Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You've observed your emotional patterns after scrolling
              </p>
            </div>

            {/* Mood Comparison */}
            {preScrollMood && postScrollMood && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  Your Mood Journey
                </h3>
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600 mb-2">Before Scrolling</p>
                    <div className={`text-6xl mb-2`}>{preScrollMood.emoji}</div>
                    <p className="font-bold text-gray-800">{preScrollMood.label}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600 mb-2">After Scrolling</p>
                    <div className={`text-6xl mb-2`}>{postScrollMood.emoji}</div>
                    <p className="font-bold text-gray-800">{postScrollMood.label}</p>
                  </div>
                </div>
                {moodChange && (
                  <div className={`text-center p-4 rounded-lg border-2 ${moodChange.direction === 'improved' ? 'bg-green-50 border-green-300' :
                      moodChange.direction === 'worsened' ? 'bg-red-50 border-red-300' :
                        'bg-gray-50 border-gray-300'
                    }`}>
                    <p className="font-semibold text-gray-800 mb-1">
                      {moodChange.description}
                    </p>
                    {moodChange.direction === 'worsened' && (
                      <p className="text-sm text-gray-700 mt-2">
                        This suggests that scrolling may be negatively impacting your well-being.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Insights */}
            {insights.length > 0 && (
              <div className="space-y-4 mb-6">
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-gradient-to-br ${insight.color} rounded-xl p-5 border-2 ${insight.borderColor}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{insight.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 mb-2">{insight.title}</h4>
                        <p className="text-gray-700 leading-relaxed">{insight.message}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Statistics */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-indigo-600" />
                Scrolling Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                  <p className="text-sm font-semibold text-gray-600 mb-1">Time Spent</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {Math.round(scrollTime / 60)} min {scrollTime % 60}s
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                  <p className="text-sm font-semibold text-gray-600 mb-1">Posts Viewed</p>
                  <p className="text-2xl font-bold text-gray-800">{scrolledItems.size}</p>
                </div>
              </div>
            </div>

            {/* Key Takeaways */}
            <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
              <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Key Takeaways
              </h3>
              <ul className="space-y-2 text-purple-800">
                <li>• <strong>Notice patterns:</strong> Pay attention to how different content affects your mood</li>
                <li>• <strong>Set limits:</strong> Decide in advance how long you'll scroll (e.g., 10 minutes)</li>
                <li>• <strong>Choose consciously:</strong> Be intentional about what you consume, not passive</li>
                <li>• <strong>Protect your mood:</strong> If scrolling worsens your mood, reduce or eliminate it</li>
                <li>• <strong>Find alternatives:</strong> Replace scrolling time with activities that truly support your well-being</li>
                <li>• <strong>Curate your feed:</strong> Follow accounts that inspire and uplift, unfollow those that drain you</li>
                <li>• <strong>Use timers:</strong> Set phone timers to remind you when your scrolling time is up</li>
                <li>• <strong>Practice awareness:</strong> Regularly check in with your mood before and after scrolling</li>
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
                    <strong>Replace 10 min scrolling with mindful breathing break.</strong> This simple swap transforms wasted time into restoration:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-2 list-disc">
                    <li><strong>Notice the urge:</strong> When you feel the urge to scroll, pause. Notice the feeling. This awareness is the first step toward change.</li>
                    <li><strong>Choose the swap:</strong> Instead of reaching for your phone, commit to a 10-minute mindful breathing break. Make this your new default.</li>
                    <li><strong>4-7-8 breathing:</strong> Try the 4-7-8 technique: Inhale for 4 counts, hold for 7, exhale for 8. Repeat for 10 minutes. This deeply calms your nervous system.</li>
                    <li><strong>Use an app:</strong> Consider using a breathing app or timer that guides you through breathing exercises. Technology can support rest, not just distraction.</li>
                    <li><strong>Create a ritual:</strong> Do this at the same time every day—perhaps during your planning period, after school, or in the evening. Consistency builds habit.</li>
                    <li><strong>Notice the difference:</strong> After 10 minutes of breathing, notice how you feel compared to how you felt after 10 minutes of scrolling. The contrast is often striking.</li>
                    <li><strong>Reduce stress:</strong> Deep breathing activates your parasympathetic nervous system, reducing cortisol and stress. This directly supports your teaching effectiveness.</li>
                    <li><strong>Improve focus:</strong> Mindful breathing increases oxygen to your brain, improving focus and clarity. This benefits your teaching and your well-being.</li>
                    <li><strong>Build resilience:</strong> Regular breathing breaks build your capacity to handle stress and challenges. This supports long-term sustainability in teaching.</li>
                    <li><strong>Prevent burnout:</strong> Taking intentional breaks throughout the day prevents the accumulation of stress that leads to burnout. Small practices, big impact.</li>
                    <li><strong>Model self-care:</strong> When you prioritize breathing breaks, you model self-care for your students and colleagues. Your example matters.</li>
                    <li><strong>Feel the energy:</strong> Breathing breaks give you energy, while scrolling often drains it. Choose what actually supports you.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you replace 10 minutes of scrolling with a mindful breathing break, you're transforming wasted time into restoration. This simple swap reduces stress, improves focus, prevents burnout, and models self-care. One small change, profound impact.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </TeacherGameShell>
    );
  }

  return (
    <TeacherGameShell
      title={gameData?.title || "Social-Media Reflection"}
      subtitle={gameData?.description || "Observe emotional patterns after social-media scrolling"}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={1}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {currentStep === 'pre-scroll' && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">📱</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Social-Media Reflection
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Observe how scrolling affects your emotional state
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-indigo-50 rounded-xl p-6 border-2 border-indigo-200 mb-8">
                <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  How This Works
                </h3>
                <ul className="text-indigo-800 space-y-2 text-sm">
                  <li>• <strong>Check your mood:</strong> First, select how you're feeling right now</li>
                  <li>• <strong>Scroll the feed:</strong> Browse through the simulated social media feed</li>
                  <li>• <strong>Track your mood:</strong> After scrolling, select how you feel</li>
                  <li>• <strong>Reflect:</strong> Notice how your mood changed and what you learned</li>
                </ul>
              </div>

              {/* Pre-Scroll Mood Selection */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  How are you feeling right now?
                </h3>
                <p className="text-center text-gray-600 mb-6">
                  Select your current mood before scrolling
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {emotions.map((emotion) => (
                    <motion.button
                      key={emotion.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelectPreScrollMood(emotion)}
                      className={`p-6 rounded-xl border-2 transition-all ${preScrollMood?.id === emotion.id
                          ? `${emotion.bgColor} ${emotion.borderColor} shadow-lg`
                          : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="text-5xl mb-2">{emotion.emoji}</div>
                      <p className={`font-semibold text-sm ${preScrollMood?.id === emotion.id ? 'text-gray-800' : 'text-gray-600'
                        }`}>
                        {emotion.label}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              {preScrollMood && (
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartScrolling}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                  >
                    <Smartphone className="w-5 h-5" />
                    Start Scrolling Feed
                  </motion.button>
                </div>
              )}
            </>
          )}

          {currentStep === 'scrolling' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Scrolling Feed */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                    Social Media Feed
                  </h3>
                  <div className="text-sm font-semibold text-gray-600">
                    Time: {Math.floor(scrollTime / 60)}:{String(scrollTime % 60).padStart(2, '0')}
                  </div>
                </div>

                <div className="bg-gray-100 rounded-xl p-4 border-2 border-gray-300 max-h-96 overflow-y-auto">
                  <div className="space-y-4">
                    {socialMediaFeed.map((post, index) => {
                      const isViewed = scrolledItems.has(post.id);

                      return (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: isViewed ? 1 : 0.7, y: 0 }}
                          onViewportEnter={() => handleItemViewed(post.id)}
                          className={`${post.color} rounded-lg p-4 border-2 ${post.borderColor}`}
                        >
                          {post.type === 'ad' ? (
                            <div className="text-center py-4">
                              <p className="text-gray-700 font-semibold">{post.content}</p>
                              <p className="text-xs text-gray-500 mt-2">Sponsored</p>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                                  {post.avatar}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-800">{post.author}</p>
                                  <p className="text-xs text-gray-500">{post.time}</p>
                                </div>
                              </div>
                              <p className="text-gray-800 mb-2">{post.content}</p>
                              {post.image && (
                                <div className="bg-gray-200 rounded-lg p-8 text-center text-gray-500 mb-2">
                                  {post.image}
                                </div>
                              )}
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>👍 {typeof post.likes === 'number' ? post.likes.toLocaleString() : post.likes}K</span>
                                <span>💬 {post.comments}</span>
                              </div>
                            </>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Finish Scrolling Button */}
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFinishScrolling}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                >
                  <Heart className="w-5 h-5" />
                  Finish Scrolling
                </motion.button>
              </div>
            </motion.div>
          )}

          {currentStep === 'post-scroll' && (
            <>
              {/* Post-Scroll Mood Selection */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  How are you feeling now?
                </h3>
                <p className="text-center text-gray-600 mb-6">
                  Select your mood after scrolling
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {emotions.map((emotion) => (
                    <motion.button
                      key={emotion.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelectPostScrollMood(emotion)}
                      className={`p-6 rounded-xl border-2 transition-all ${postScrollMood?.id === emotion.id
                          ? `${emotion.bgColor} ${emotion.borderColor} shadow-lg`
                          : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="text-5xl mb-2">{emotion.emoji}</div>
                      <p className={`font-semibold text-sm ${postScrollMood?.id === emotion.id ? 'text-gray-800' : 'text-gray-600'
                        }`}>
                        {emotion.label}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </>
          )}

          {currentStep === 'reflection' && moodChange && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Reflection Display */}
              <div className={`bg-gradient-to-br ${moodChange.direction === 'improved' ? 'from-green-50 to-emerald-50 border-green-300' :
                  moodChange.direction === 'worsened' ? 'from-red-50 to-rose-50 border-red-300' :
                    'from-gray-50 to-slate-50 border-gray-300'
                } rounded-xl p-6 border-2 mb-6`}>
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  Your Mood Change
                </h3>
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-4xl mb-1">{preScrollMood.emoji}</div>
                      <p className="text-sm text-gray-600">Before</p>
                    </div>
                    {moodChange.direction === 'improved' ? (
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    ) : moodChange.direction === 'worsened' ? (
                      <TrendingDown className="w-8 h-8 text-red-600" />
                    ) : (
                      <Meh className="w-8 h-8 text-gray-600" />
                    )}
                    <div className="text-center">
                      <div className="text-4xl mb-1">{postScrollMood.emoji}</div>
                      <p className="text-sm text-gray-600">After</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-gray-800 mb-2">
                    {moodChange.description}
                  </p>
                </div>
              </div>

              {/* Reflection Prompts */}
              <div className="bg-indigo-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
                <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Reflection Questions
                </h3>
                <div className="space-y-4 text-indigo-800">
                  <div className="bg-white rounded-lg p-4 border-2 border-indigo-200">
                    <p className="font-semibold mb-2">1. What content affected your mood the most?</p>
                    <p className="text-sm text-gray-600">Notice which posts, ads, or comments influenced how you feel.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-2 border-indigo-200">
                    <p className="font-semibold mb-2">2. How does this pattern show up in your daily life?</p>
                    <p className="text-sm text-gray-600">Reflect on whether this mood change happens regularly when you scroll.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-2 border-indigo-200">
                    <p className="font-semibold mb-2">3. What could you do differently?</p>
                    <p className="text-sm text-gray-600">Consider setting time limits, curating your feed, or replacing scrolling with other activities.</p>
                  </div>
                </div>
              </div>

              {/* Complete Button */}
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleComplete}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                >
                  <CheckCircle className="w-5 h-5" />
                  Complete Reflection
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </TeacherGameShell>
  );
};

export default SocialMediaReflection;