import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Heart, Activity, Users, Sparkles, BarChart3, TrendingDown, AlertCircle, CheckCircle, BookOpen, Target, Circle } from "lucide-react";

const SelfCareInventory = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-97";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({}); // Will store selected option values (1-4)
  const [selectedOption, setSelectedOption] = useState(null); // Track current selection
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // 5 quiz-style questions with one correct answer each
  const questions = [
    {
      id: 1,
      category: 'physical',
      categoryLabel: 'Physical Care',
      question: 'Which of these is most important for teacher wellness?',
      icon: Activity,
      emoji: '😴',
      options: [
        { value: 1, label: 'Getting 7-9 hours of quality sleep regularly', isCorrect: true, explanation: 'Adequate sleep is foundational for all other wellness areas' },
        { value: 2, label: 'Drinking coffee to stay alert during long meetings', isCorrect: false, explanation: 'While caffeine can help temporarily, it doesnt replace quality sleep' },
        { value: 3, label: 'Working through lunch to catch up on grading', isCorrect: false, explanation: 'Skipping meals creates stress and reduces energy levels' },
        { value: 4, label: 'Taking work home to finish lesson plans at night', isCorrect: false, explanation: 'Bringing work home often leads to burnout and poor work-life balance' }
      ]
    },
    {
      id: 2,
      category: 'emotional',
      categoryLabel: 'Emotional Care',
      question: 'What is the most effective way to manage teaching stress?',
      icon: Heart,
      emoji: '❤️',
      options: [
        { value: 1, label: 'Suppressing emotions to appear professional', isCorrect: false, explanation: 'Suppressing emotions often leads to bigger breakdowns later' },
        { value: 2, label: 'Taking 5 minutes daily for mindful breathing or reflection', isCorrect: true, explanation: 'Regular mindfulness builds emotional resilience and stress management skills' },
        { value: 3, label: 'Complaining to colleagues about difficult students', isCorrect: false, explanation: 'While venting can help, it often increases negative feelings without solving problems' },
        { value: 4, label: 'Ignoring stress and pushing through exhaustion', isCorrect: false, explanation: 'This approach leads to burnout and decreased effectiveness' }
      ]
    },
    {
      id: 3,
      category: 'social',
      categoryLabel: 'Social Care',
      question: 'How can teachers best maintain healthy professional relationships?',
      icon: Users,
      emoji: '👥',
      options: [
        { value: 1, label: 'Avoiding all workplace interactions to prevent drama', isCorrect: false, explanation: 'Isolation increases stress and reduces job satisfaction' },
        { value: 2, label: 'Befriending everyone regardless of professional appropriateness', isCorrect: false, explanation: 'Blurred boundaries can create complications and stress' },
        { value: 3, label: 'Keeping work completely separate from personal life', isCorrect: false, explanation: 'Some integration is healthy; complete separation isnt realistic or beneficial' },
        { value: 4, label: 'Setting clear boundaries while staying connected with supportive colleagues', isCorrect: true, explanation: 'Boundaries prevent burnout while connections provide essential support' },
      ]
    },
    {
      id: 4,
      category: 'spiritual',
      categoryLabel: 'Spiritual Care',
      question: 'What helps teachers maintain their sense of purpose in challenging times?',
      icon: Sparkles,
      emoji: '✨',
      options: [
        { value: 1, label: 'Focusing only on test scores and measurable outcomes', isCorrect: false, explanation: 'Numbers alone dont sustain long-term motivation or fulfillment' },
        { value: 2, label: 'Comparing yourself to other teachers who seem more successful', isCorrect: false, explanation: 'Comparison often decreases confidence and satisfaction' },
        { value: 3, label: 'Remembering why you became a teacher and connecting with your core values', isCorrect: true, explanation: 'Reconnecting with your mission provides motivation during difficult periods' },
        { value: 4, label: 'Accepting that teaching is just a job, not a calling', isCorrect: false, explanation: 'This mindset leads to disengagement and reduced effectiveness' }
      ]
    },
    {
      id: 5,
      category: 'physical',
      categoryLabel: 'Physical Care',
      question: 'What is the most sustainable approach to teacher physical wellness?',
      icon: Activity,
      emoji: '🍎',
      options: [
        { value: 1, label: 'Intense workout sessions when you have free time', isCorrect: false, explanation: 'Inconsistent intense exercise is hard to maintain and can lead to injury' },
        { value: 2, label: 'Building small, consistent healthy habits into your routine', isCorrect: true, explanation: 'Small sustainable changes create lasting wellness improvements' },
        { value: 3, label: 'Eating whatever is convenient during busy school days', isCorrect: false, explanation: 'Poor nutrition affects energy, mood, and cognitive function' },
        { value: 4, label: 'Saving all self-care for weekends and breaks', isCorrect: false, explanation: 'Waiting creates deprivation and makes sustainable habits impossible' }
      ]
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

  const [questionScores, setQuestionScores] = useState(Array(questions.length).fill(false)); // Track correct answers per question

  // Add a state to track if the question is answered
  const [questionAnswered, setQuestionAnswered] = useState(false);

  const handleSelectOption = (optionValue) => {
    // Only allow selection if question hasn't been answered yet
    if (!questionAnswered) {
      setSelectedOption(optionValue);
      setQuestionAnswered(true);
    }
  };

  const handleNextQuestion = () => {
    if (selectedOption === null || !questionAnswered) return; // Require selection and answered status

    // Check if selected option is correct
    const currentQuestionObj = questions[currentQuestion];
    const selectedOptionObj = currentQuestionObj.options.find(opt => opt.value === selectedOption);
    const isCorrect = selectedOptionObj?.isCorrect || false;

    // Update question scores array
    const newQuestionScores = [...questionScores];
    newQuestionScores[currentQuestion] = isCorrect;
    setQuestionScores(newQuestionScores);

    // Store the answer
    const newAnswers = {
      ...answers,
      [questions[currentQuestion].id]: {
        selected: selectedOption,
        correct: isCorrect,
        explanation: selectedOptionObj?.explanation || ''
      }
    };
    setAnswers(newAnswers);

    // Move to next question or show results
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setQuestionAnswered(false); // Reset for next question
        setSelectedOption(null); // Reset selection for next question
      }, 300);
    } else {
      // Calculate results
      setTimeout(() => {
        calculateResults(newAnswers, newQuestionScores);
        setShowResults(true);
      }, 300);
    }
  };

  const calculateResults = (allAnswers, questionScoresArray) => {
    // Count correct answers
    const correctCount = questionScoresArray.filter(isCorrect => isCorrect).length;

    // Set score as number of correct answers
    setScore(correctCount);

    // Calculate category-wise results
    const categoryResults = {
      physical: { correct: 0, total: 0 },
      emotional: { correct: 0, total: 0 },
      social: { correct: 0, total: 0 },
      spiritual: { correct: 0, total: 0 }
    };

    questions.forEach((q, index) => {
      categoryResults[q.category].total += 1;
      if (questionScoresArray[index]) {
        categoryResults[q.category].correct += 1;
      }
    });

    // Convert to percentages
    const categoryPercentages = {};
    Object.keys(categoryResults).forEach(category => {
      const { correct, total } = categoryResults[category];
      categoryPercentages[category] = total > 0 ? (correct / total) * 100 : 0;
    });

    // Find weakest category
    const weakestCategory = Object.keys(categoryPercentages).reduce((a, b) =>
      categoryPercentages[a] < categoryPercentages[b] ? a : b
    );

    return {
      correctCount,
      categoryResults,
      categoryPercentages,
      weakestCategory,
      questionScores: questionScoresArray
    };
  };

  const getResults = () => {
    if (!showResults) return null;

    const correctCount = questionScores.filter(isCorrect => isCorrect).length;

    const categoryResults = {
      physical: { correct: 0, total: 0 },
      emotional: { correct: 0, total: 0 },
      social: { correct: 0, total: 0 },
      spiritual: { correct: 0, total: 0 }
    };

    questions.forEach((q, index) => {
      categoryResults[q.category].total += 1;
      if (questionScores[index]) {
        categoryResults[q.category].correct += 1;
      }
    });

    const categoryPercentages = {};
    Object.keys(categoryResults).forEach(category => {
      const { correct, total } = categoryResults[category];
      categoryPercentages[category] = total > 0 ? (correct / total) * 100 : 0;
    });

    const weakestCategory = Object.keys(categoryPercentages).reduce((a, b) =>
      categoryPercentages[a] < categoryPercentages[b] ? a : b
    );

    return {
      correctCount,
      categoryResults,
      categoryPercentages,
      weakestCategory,
      questionScores
    };
  };

  const results = getResults();
  const currentQuestionData = questions[currentQuestion];
  const CurrentIcon = currentQuestionData.icon;

  if (showGameOver) {
    const { correctCount, categoryResults, categoryPercentages, weakestCategory, questionScores } = results || {};
    const weakestCategoryInfo = weakestCategory ? categories[weakestCategory] : null;
    const totalScore = correctCount;

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
        currentQuestion={0}
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
                Assessment Complete!
              </h2>
              <p className="text-xl text-gray-600">
                Your self-care assessment results
              </p>
            </div>

            {/* Overall Score */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {correctCount} / {questions.length}
                </div>
                <p className="text-lg text-gray-700 mb-2">
                  Questions Correct
                </p>
                <div className="w-full bg-gray-200 rounded-full h-4 max-w-md mx-auto overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(correctCount / questions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {Math.round((correctCount / questions.length) * 100)}% Success Rate
                </p>
              </div>
            </div>

            {/* Weakest Category Alert */}
            {weakestCategoryInfo && categoryPercentages && (
              <div className={`bg-gradient-to-br ${weakestCategoryInfo.bgColor} rounded-xl p-6 border-2 ${weakestCategoryInfo.borderColor} mb-6`}>
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <Target className="w-6 h-6" />
                      Focus Area This Week
                    </h3>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl">{weakestCategoryInfo.emoji}</span>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">{weakestCategoryInfo.label}</h4>
                        <p className="text-sm text-gray-600">
                          Correct: {categoryResults?.[weakestCategory]?.correct || 0}/{categoryResults?.[weakestCategory]?.total || 1}
                        </p>
                        <p className="text-xs text-gray-500">
                          {Math.round(categoryPercentages[weakestCategory])}% success rate
                        </p>
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
                  const categoryResult = categoryResults?.[key] || { correct: 0, total: 1 };
                  const percentage = categoryPercentages?.[key] || 0;
                  const isWeakest = weakestCategory === key;

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className={`p-4 rounded-xl border-2 ${isWeakest
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
                              Correct: {categoryResult.correct}/{categoryResult.total}
                            </p>
                            <p className="text-xs text-gray-500">
                              {Math.round((categoryResult.correct / categoryResult.total) * 100)}% success rate
                            </p>
                          </div>
                        </div>
                        <div className={`text-2xl font-bold ${isWeakest ? 'text-gray-800' : 'text-gray-600'
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
    const { correctCount, categoryResults, categoryPercentages, weakestCategory, questionScores } = results || {};
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
                Quiz Results
              </h2>
              <p className="text-xl text-gray-600">
                {correctCount} out of {questions.length} questions correct
              </p>
            </div>

            {/* Overall Score */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {correctCount} / {questions.length}
                </div>
                <p className="text-lg text-gray-700 mb-2">
                  Questions Correct
                </p>
                <div className="w-full bg-gray-200 rounded-full h-4 max-w-md mx-auto overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(correctCount / questions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {Math.round((correctCount / questions.length) * 100)}% Success Rate
                </p>
              </div>
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
                        <p className="text-sm text-gray-600">Correct: {categoryResults?.[weakestCategory]?.correct || 0}/{categoryResults?.[weakestCategory]?.total || 1}</p>
                        <p className="text-xs text-gray-500">{Math.round(categoryPercentages[weakestCategory])}% success rate</p>
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
                  const categoryResult = categoryResults?.[key] || { correct: 0, total: 1 };
                  const percentage = categoryPercentages?.[key] || 0;
                  const isWeakest = weakestCategory === key;

                  return (
                    <div
                      key={key}
                      className={`p-4 rounded-xl border-2 ${isWeakest
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
                              Correct: {categoryResult.correct}/{categoryResult.total}
                            </p>
                            <p className="text-xs text-gray-500">
                              {Math.round((categoryResult.correct / categoryResult.total) * 100)}% success rate
                            </p>
                          </div>
                        </div>
                        <div className={`text-2xl font-bold ${isWeakest ? 'text-gray-800' : 'text-gray-600'
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
              <div className={`px-4 py-2 rounded-lg border-2 ${currentQuestionData.category === 'physical' ? 'bg-green-50 border-green-200' :
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

          {/* Rating Options */}
          <div className="space-y-4 mb-8">
            <p className="text-center text-gray-600 font-medium mb-6">
              Choose the best answer for teacher wellness:
            </p>

            <div className="grid grid-cols-1 gap-3">
              {currentQuestionData.options.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={!questionAnswered ? { scale: 1.01 } : {}}
                  whileTap={!questionAnswered ? { scale: 0.99 } : {}}
                  onClick={() => !questionAnswered && handleSelectOption(option.value)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${selectedOption === option.value
                      ? option.isCorrect
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : 'border-red-500 bg-red-50 shadow-md'
                      : questionAnswered
                        ? 'border-gray-200 bg-gray-50 opacity-70 cursor-not-allowed'  // Disabled state
                        : 'border-gray-200 bg-white hover:border-indigo-300'
                    }`}
                  disabled={questionAnswered}  // Disable button after selection
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${selectedOption === option.value
                        ? option.isCorrect
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                      }`}>
                      {String.fromCharCode(65 + option.value - 1)} {/* A, B, C, D */}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${selectedOption === option.value
                          ? option.isCorrect ? 'text-green-700' : 'text-red-700'
                          : 'text-gray-800'
                        }`}>
                        {option.label}
                      </p>
                      {selectedOption === option.value && (
                        <p className={`text-sm mt-2 italic ${option.isCorrect ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {option.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <motion.button
              whileHover={{ scale: (selectedOption !== null && questionAnswered) ? 1.05 : 1 }}
              whileTap={{ scale: (selectedOption !== null && questionAnswered) ? 0.95 : 1 }}
              onClick={handleNextQuestion}
              disabled={selectedOption === null || !questionAnswered}
              className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all flex items-center gap-3 mx-auto ${(selectedOption !== null && questionAnswered)
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              <Activity className="w-6 h-6" />
              {currentQuestion < questions.length - 1
                ? questionAnswered
                  ? answers[questions[currentQuestion].id]?.correct
                    ? '✓ Correct! Continue'
                    : 'Continue to Next'
                  : 'Select an answer'
                : questionAnswered
                  ? 'See Final Results'
                  : 'Select an answer'
              }
            </motion.button>

            {selectedOption === null && (
              <p className="text-sm text-gray-500 mt-3">
                Please select an option above to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </TeacherGameShell>
  );
};

export default SelfCareInventory;