import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Heart, Activity, Users, Sparkles, BarChart3, TrendingDown, AlertCircle, CheckCircle, BookOpen, Target } from "lucide-react";

const SelfCareInventory = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-97";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // 20 questions across 4 categories (5 questions each)
  const questions = [
    // Physical Care (5 questions)
    {
      id: 1,
      category: 'physical',
      categoryLabel: 'Physical Care',
      question: 'I get 7-9 hours of sleep most nights',
      icon: Activity,
      emoji: '😴'
    },
    {
      id: 2,
      category: 'physical',
      categoryLabel: 'Physical Care',
      question: 'I eat regular, balanced meals throughout the day',
      icon: Activity,
      emoji: '🍎'
    },
    {
      id: 3,
      category: 'physical',
      categoryLabel: 'Physical Care',
      question: 'I engage in physical activity or exercise at least 3 times per week',
      icon: Activity,
      emoji: '🏃'
    },
    {
      id: 4,
      category: 'physical',
      categoryLabel: 'Physical Care',
      question: 'I take breaks during the day to rest and recharge',
      icon: Activity,
      emoji: '🧘'
    },
    {
      id: 5,
      category: 'physical',
      categoryLabel: 'Physical Care',
      question: 'I drink enough water and stay hydrated',
      icon: Activity,
      emoji: '💧'
    },
    // Emotional Care (5 questions)
    {
      id: 6,
      category: 'emotional',
      categoryLabel: 'Emotional Care',
      question: 'I regularly check in with my emotions and acknowledge how I feel',
      icon: Heart,
      emoji: '❤️'
    },
    {
      id: 7,
      category: 'emotional',
      categoryLabel: 'Emotional Care',
      question: 'I practice stress management techniques (breathing, meditation, journaling)',
      icon: Heart,
      emoji: '🧘‍♀️'
    },
    {
      id: 8,
      category: 'emotional',
      categoryLabel: 'Emotional Care',
      question: 'I allow myself to feel and express emotions without judgment',
      icon: Heart,
      emoji: '😌'
    },
    {
      id: 9,
      category: 'emotional',
      categoryLabel: 'Emotional Care',
      question: 'I engage in activities that bring me joy and pleasure',
      icon: Heart,
      emoji: '😊'
    },
    {
      id: 10,
      category: 'emotional',
      categoryLabel: 'Emotional Care',
      question: 'I set boundaries to protect my emotional well-being',
      icon: Heart,
      emoji: '🛡️'
    },
    // Social Care (5 questions)
    {
      id: 11,
      category: 'social',
      categoryLabel: 'Social Care',
      question: 'I maintain meaningful connections with friends and family',
      icon: Users,
      emoji: '👥'
    },
    {
      id: 12,
      category: 'social',
      categoryLabel: 'Social Care',
      question: 'I feel comfortable asking for help when I need it',
      icon: Users,
      emoji: '🤝'
    },
    {
      id: 13,
      category: 'social',
      categoryLabel: 'Social Care',
      question: 'I spend quality time with loved ones regularly',
      icon: Users,
      emoji: '💕'
    },
    {
      id: 14,
      category: 'social',
      categoryLabel: 'Social Care',
      question: 'I have a support network of people I can rely on',
      icon: Users,
      emoji: '🌟'
    },
    {
      id: 15,
      category: 'social',
      categoryLabel: 'Social Care',
      question: 'I participate in social activities or groups that I enjoy',
      icon: Users,
      emoji: '🎉'
    },
    // Spiritual Care (5 questions)
    {
      id: 16,
      category: 'spiritual',
      categoryLabel: 'Spiritual Care',
      question: 'I engage in practices that give my life meaning and purpose',
      icon: Sparkles,
      emoji: '✨'
    },
    {
      id: 17,
      category: 'spiritual',
      categoryLabel: 'Spiritual Care',
      question: 'I take time for reflection, meditation, or prayer',
      icon: Sparkles,
      emoji: '🧘'
    },
    {
      id: 18,
      category: 'spiritual',
      categoryLabel: 'Spiritual Care',
      question: 'I feel connected to something larger than myself',
      icon: Sparkles,
      emoji: '🌌'
    },
    {
      id: 19,
      category: 'spiritual',
      categoryLabel: 'Spiritual Care',
      question: 'I practice gratitude regularly',
      icon: Sparkles,
      emoji: '🙏'
    },
    {
      id: 20,
      category: 'spiritual',
      categoryLabel: 'Spiritual Care',
      question: 'I engage in creative or artistic activities that inspire me',
      icon: Sparkles,
      emoji: '🎨'
    }
  ];

  const categories = {
    physical: {
      label: 'Physical Care',
      icon: Activity,
      emoji: '🏃',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      description: 'Caring for your body through sleep, nutrition, exercise, and rest'
    },
    emotional: {
      label: 'Emotional Care',
      icon: Heart,
      emoji: '❤️',
      color: 'from-pink-400 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-300',
      description: 'Managing emotions, stress, and maintaining mental health'
    },
    social: {
      label: 'Social Care',
      icon: Users,
      emoji: '👥',
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-300',
      description: 'Nurturing relationships and maintaining social connections'
    },
    spiritual: {
      label: 'Spiritual Care',
      icon: Sparkles,
      emoji: '✨',
      color: 'from-purple-400 to-indigo-500',
      bgColor: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-300',
      description: 'Finding meaning, purpose, and connection to something larger'
    }
  };

  const handleAnswer = (answer) => {
    const newAnswers = {
      ...answers,
      [questions[currentQuestion].id]: answer
    };
    setAnswers(newAnswers);
    
    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, 300);
    } else {
      // Calculate results
      setTimeout(() => {
        calculateResults(newAnswers);
        setShowResults(true);
      }, 300);
    }
  };

  const calculateResults = (allAnswers) => {
    const categoryScores = {
      physical: 0,
      emotional: 0,
      social: 0,
      spiritual: 0
    };

    questions.forEach(q => {
      if (allAnswers[q.id] === true) {
        categoryScores[q.category] += 1;
      }
    });

    // Calculate percentages (out of 5 questions per category)
    const categoryPercentages = {
      physical: (categoryScores.physical / 5) * 100,
      emotional: (categoryScores.emotional / 5) * 100,
      social: (categoryScores.social / 5) * 100,
      spiritual: (categoryScores.spiritual / 5) * 100
    };

    // Find weakest category
    const weakestCategory = Object.keys(categoryPercentages).reduce((a, b) =>
      categoryPercentages[a] < categoryPercentages[b] ? a : b
    );

    // Calculate total score
    const totalScore = Object.values(categoryScores).reduce((a, b) => a + b, 0);
    setScore(totalScore);

    return { categoryScores, categoryPercentages, weakestCategory };
  };

  const getResults = () => {
    if (!showResults) return null;
    
    const categoryScores = {
      physical: 0,
      emotional: 0,
      social: 0,
      spiritual: 0
    };

    questions.forEach(q => {
      if (answers[q.id] === true) {
        categoryScores[q.category] += 1;
      }
    });

    const categoryPercentages = {
      physical: (categoryScores.physical / 5) * 100,
      emotional: (categoryScores.emotional / 5) * 100,
      social: (categoryScores.social / 5) * 100,
      spiritual: (categoryScores.spiritual / 5) * 100
    };

    const weakestCategory = Object.keys(categoryPercentages).reduce((a, b) =>
      categoryPercentages[a] < categoryPercentages[b] ? a : b
    );

    return { categoryScores, categoryPercentages, weakestCategory };
  };

  const results = getResults();
  const currentQuestionData = questions[currentQuestion];
  const CurrentIcon = currentQuestionData.icon;

  if (showGameOver) {
    const { categoryScores, categoryPercentages, weakestCategory } = results || {};
    const weakestCategoryInfo = weakestCategory ? categories[weakestCategory] : null;
    const totalScore = Object.values(categoryScores || {}).reduce((a, b) => a + b, 0);
    
    return (
      <TeacherGameShell
        title={gameData?.title || "Self-Care Inventory"}
        subtitle={gameData?.description || "Assess and balance physical, emotional, social, and spiritual care"}
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="teacher-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentQuestion={1}
      >
        <div className="w-full max-w-5xl mx-auto px-4">
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
                📊✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Inventory Complete!
              </h2>
              <p className="text-xl text-gray-600">
                Your self-care assessment results
              </p>
            </div>

            {/* Overall Score */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {totalScore} / 20
                </div>
                <p className="text-lg text-gray-700 mb-2">
                  Overall Self-Care Score
                </p>
                <div className="w-full bg-gray-200 rounded-full h-4 max-w-md mx-auto overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(totalScore / 20) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {Math.round((totalScore / 20) * 100)}% Complete
                </p>
              </div>
            </div>

            {/* Weakest Category Alert */}
            {weakestCategoryInfo && categoryPercentages && (
              <div className={`bg-gradient-to-br ${weakestCategoryInfo.bgColor} rounded-xl p-6 border-2 ${weakestCategoryInfo.borderColor} mb-6`}>
                <div className="flex items-start gap-4">
                  <AlertCircle className={`w-8 h-8 text-${weakestCategoryInfo.color.split('-')[1]}-600 flex-shrink-0 mt-1`} />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <Target className="w-6 h-6" />
                      Focus Area This Week
                    </h3>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl">{weakestCategoryInfo.emoji}</span>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">{weakestCategoryInfo.label}</h4>
                        <p className="text-sm text-gray-600">{Math.round(categoryPercentages[weakestCategory])}%</p>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      {weakestCategoryInfo.label} needs the most attention. Consider focusing on this area for the next week to improve your overall self-care balance.
                    </p>
                    <p className="text-sm text-gray-600">
                      {weakestCategoryInfo.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Category Bar Graph */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
                Self-Care Category Scores
              </h3>
              
              <div className="space-y-6">
                {Object.entries(categories).map(([key, category]) => {
                  const CategoryIcon = category.icon;
                  const score = categoryScores?.[key] || 0;
                  const percentage = categoryPercentages?.[key] || 0;
                  const isWeakest = weakestCategory === key;
                  
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className={`p-4 rounded-xl border-2 ${
                        isWeakest
                          ? `${category.bgColor} ${category.borderColor} border-2 shadow-lg`
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{category.emoji}</span>
                          <div>
                            <h4 className={`font-bold ${isWeakest ? 'text-gray-800' : 'text-gray-700'}`}>
                              {category.label}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {score} / 5 questions
                            </p>
                          </div>
                        </div>
                        <div className={`text-2xl font-bold ${
                          isWeakest ? 'text-gray-800' : 'text-gray-600'
                        }`}>
                          {Math.round(percentage)}%
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Self-Care Balance Insights
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Balance is key:</strong> All four areas (physical, emotional, social, spiritual) contribute to your overall well-being</li>
                <li>• <strong>Focus on gaps:</strong> Prioritize the area with the lowest score to improve overall balance</li>
                <li>• <strong>Small steps:</strong> You don't need to do everything at once—small, consistent actions create meaningful change</li>
                <li>• <strong>Regular assessment:</strong> Revisit this inventory monthly to track your progress and adjust your focus</li>
                <li>• <strong>Integration:</strong> Many self-care activities benefit multiple areas—find practices that serve you holistically</li>
                <li>• <strong>Progress, not perfection:</strong> Self-care is an ongoing practice, not a destination</li>
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
                    <strong>Focus on weakest category for the next week.</strong> Targeted attention creates meaningful progress:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-2 list-disc">
                    <li><strong>Identify the gap:</strong> Look at your results and identify which category (physical, emotional, social, or spiritual) scored lowest. This is your focus area.</li>
                    <li><strong>Choose 2-3 actions:</strong> Pick 2-3 specific, achievable actions for that category. For example, if Physical Care is lowest: "Get 8 hours of sleep 4 nights this week" and "Take a 10-minute walk 3 times this week."</li>
                    <li><strong>Set weekly intentions:</strong> Each Sunday, set your weekly focus for your weakest category. Be specific about what you'll do, when you'll do it, and how you'll track it.</li>
                    <li><strong>Start small:</strong> Don't overwhelm yourself. Choose actions that feel achievable, not idealistic. Small, consistent steps create lasting change.</li>
                    <li><strong>Track progress:</strong> Check in daily or weekly on your focus area. Notice improvements, even small ones. Progress creates motivation.</li>
                    <li><strong>Celebrate wins:</strong> When you complete actions in your focus area, celebrate! Acknowledge your effort and progress. Celebration reinforces positive habits.</li>
                    <li><strong>Reassess weekly:</strong> After a week of focused attention, reassess that category. Has it improved? Is it still your weakest? Adjust as needed.</li>
                    <li><strong>Shift focus when ready:</strong> Once a category improves, shift focus to the new weakest area. This rotating focus creates balanced self-care over time.</li>
                    <li><strong>Maintain other areas:</strong> While focusing on the weakest category, maintain your stronger areas. Don't let them slide while you improve gaps.</li>
                    <li><strong>Be patient:</strong> Building self-care habits takes time. Don't expect dramatic changes overnight. Consistency over time creates transformation.</li>
                    <li><strong>Ask for support:</strong> If a category is consistently low, consider asking for support—whether from colleagues, friends, family, or professionals. Support accelerates growth.</li>
                    <li><strong>Make it sustainable:</strong> Choose actions that you can maintain long-term, not just for a week. Sustainability creates lasting well-being.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you focus on the weakest category for the next week, you're creating targeted improvement that balances your overall self-care. This rotating focus approach ensures all areas of your well-being receive attention over time, creating sustainable, holistic self-care.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </TeacherGameShell>
    );
  }

  if (showResults) {
    const { categoryScores, categoryPercentages, weakestCategory } = results || {};
    const weakestCategoryInfo = weakestCategory ? categories[weakestCategory] : null;

    return (
      <TeacherGameShell
        title={gameData?.title || "Self-Care Inventory"}
        subtitle={gameData?.description || "Assess and balance physical, emotional, social, and spiritual care"}
        showGameOver={false}
        score={score}
        gameId={gameId}
        gameType="teacher-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentQuestion={currentQuestion + 1}
      >
        <div className="w-full max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Results Preview */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Your Self-Care Results
              </h2>
              <p className="text-xl text-gray-600">
                See which care areas need attention
              </p>
            </div>

            {/* Weakest Category Alert */}
            {weakestCategoryInfo && categoryPercentages && (
              <div className={`bg-gradient-to-br ${weakestCategoryInfo.bgColor} rounded-xl p-6 border-2 ${weakestCategoryInfo.borderColor} mb-6`}>
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <Target className="w-6 h-6" />
                      Area Needing Attention
                    </h3>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl">{weakestCategoryInfo.emoji}</span>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">{weakestCategoryInfo.label}</h4>
                        <p className="text-sm text-gray-600">{Math.round(categoryPercentages[weakestCategory])}% Score</p>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      This area needs the most attention. Consider focusing on {weakestCategoryInfo.label.toLowerCase()} for the next week.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Category Bar Graph */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
                Self-Care Categories
              </h3>
              
              <div className="space-y-6">
                {Object.entries(categories).map(([key, category]) => {
                  const score = categoryScores?.[key] || 0;
                  const percentage = categoryPercentages?.[key] || 0;
                  const isWeakest = weakestCategory === key;
                  
                  return (
                    <div
                      key={key}
                      className={`p-4 rounded-xl border-2 ${
                        isWeakest
                          ? `${category.bgColor} ${category.borderColor} border-2 shadow-lg`
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{category.emoji}</span>
                          <div>
                            <h4 className={`font-bold ${isWeakest ? 'text-gray-800' : 'text-gray-700'}`}>
                              {category.label}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {score} / 5
                            </p>
                          </div>
                        </div>
                        <div className={`text-2xl font-bold ${
                          isWeakest ? 'text-gray-800' : 'text-gray-600'
                        }`}>
                          {Math.round(percentage)}%
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5 }}
                          className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Complete Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowGameOver(true)}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
              >
                <CheckCircle className="w-5 h-5" />
                View Complete Results
              </motion.button>
            </div>
          </div>
        </div>
      </TeacherGameShell>
    );
  }

  return (
    <TeacherGameShell
      title={gameData?.title || "Self-Care Inventory"}
      subtitle={gameData?.description || "Assess and balance physical, emotional, social, and spiritual care"}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentQuestion + 1}
    >
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-semibold text-gray-700">
                {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <CurrentIcon className="w-8 h-8 text-indigo-600" />
              <div className={`px-4 py-2 rounded-lg border-2 ${
                currentQuestionData.category === 'physical' ? 'bg-green-50 border-green-200' :
                currentQuestionData.category === 'emotional' ? 'bg-pink-50 border-pink-200' :
                currentQuestionData.category === 'social' ? 'bg-blue-50 border-blue-200' :
                'bg-purple-50 border-purple-200'
              }`}>
                <p className="text-sm font-semibold text-gray-700">
                  {currentQuestionData.categoryLabel}
                </p>
              </div>
            </div>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{currentQuestionData.emoji}</div>
              <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
                {currentQuestionData.question}
              </h2>
            </div>
          </div>

          {/* Answer Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(true)}
              className="p-6 rounded-xl border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-all"
            >
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <p className="font-semibold text-gray-800 text-lg">Yes</p>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(false)}
              className="p-6 rounded-xl border-2 border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50 hover:shadow-lg transition-all"
            >
              <Circle className="w-8 h-8 text-gray-600 mx-auto mb-3" />
              <p className="font-semibold text-gray-800 text-lg">No</p>
            </motion.button>
          </div>
        </div>
      </div>
    </TeacherGameShell>
  );
};

export default SelfCareInventory;

