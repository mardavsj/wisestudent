import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Target, CheckCircle, TrendingUp, BookOpen, Sparkles, AlertCircle, Heart, Award, Star } from "lucide-react";

const InnerAlignmentQuiz = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-89";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [ratings, setRatings] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Reflective statements about alignment
  const statements = [
    {
      id: 1,
      statement: "I teach with joy even when tired or stressed.",
      category: "Joy & Energy",
      description: "Your ability to maintain joy and enthusiasm despite challenges"
    },
    {
      id: 2,
      statement: "My teaching methods reflect my core values.",
      category: "Values Alignment",
      description: "How well your teaching practices align with what you believe"
    },
    {
      id: 3,
      statement: "I set boundaries that protect my well-being.",
      category: "Self-Care",
      description: "Your commitment to protecting your physical and emotional health"
    },
    {
      id: 4,
      statement: "I make decisions based on my teaching purpose, not just pressure.",
      category: "Purpose-Driven",
      description: "Your ability to stay true to your purpose despite external pressures"
    },
    {
      id: 5,
      statement: "I invest time in activities that align with my long-term goals.",
      category: "Goal Alignment",
      description: "How well your daily actions support your long-term aspirations"
    }
  ];

  const handleRatingSelect = (questionId, rating) => {
    setRatings(prev => ({
      ...prev,
      [questionId]: rating
    }));
  };

  const handleNext = () => {
    if (currentQuestion < statements.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions answered, calculate results
      calculateResults();
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    // Calculate alignment score (award 1 point per question if rating is 3 or higher)
    const totalPoints = Object.values(ratings).reduce((sum, rating) => {
      return sum + (rating >= 3 ? 1 : 0); // 1 point if rating is 3-5, 0 points if 1-2
    }, 0);

    setScore(totalPoints);

    // Set results after a brief delay
    setTimeout(() => {
      setShowGameOver(true);
    }, 3000);
  };

  const currentStatement = statements[currentQuestion];
  const currentRating = ratings[currentStatement.id] || null;
  const progress = ((currentQuestion + 1) / statements.length) * 100;
  const answeredCount = Object.keys(ratings).length;

  // Get insights based on score
  const getInsights = (score) => {
    if (score >= 4) {  // 4-5 out of 5
      return {
        level: "Highly Aligned",
        emoji: "✨",
        color: "from-green-500 to-emerald-500",
        bgColor: "from-green-50 to-emerald-50",
        borderColor: "border-green-300",
        message: "Excellent alignment! Your daily actions strongly reflect your core values and goals.",
        strengths: [
          "Strong connection between values and actions",
          "Clear sense of purpose guiding decisions",
          "Effective boundary-setting and self-care",
          "Authentic expression of your teaching identity"
        ],
        recommendations: [
          "Continue maintaining this alignment as you grow",
          "Share your approach with colleagues who might benefit",
          "Use your alignment as a source of resilience during challenges",
          "Regularly review and adjust as your goals evolve"
        ]
      };
    } else if (score >= 3) {  // 3 out of 5
      return {
        level: "Moderately Aligned",
        emoji: "💙",
        color: "from-blue-500 to-cyan-500",
        bgColor: "from-blue-50 to-cyan-50",
        borderColor: "border-blue-300",
        message: "Good alignment overall. You're on track with some areas for growth.",
        strengths: [
          "Basic alignment between values and actions",
          "Awareness of what matters most",
          "Some effective practices in place"
        ],
        recommendations: [
          "Identify specific areas where alignment could strengthen",
          "Set small goals to close gaps between values and actions",
          "Practice regular reflection to maintain awareness",
          "Consider discussing alignment goals with a mentor or colleague"
        ]
      };
    } else {  // 0-2 out of 5
      return {
        level: "Needs Attention",
        emoji: "💡",
        color: "from-orange-500 to-amber-500",
        bgColor: "from-orange-50 to-amber-50",
        borderColor: "border-orange-300",
        message: "There's a gap between your values and daily actions. This is an opportunity for realignment.",
        strengths: [
          "Awareness of the misalignment is the first step",
          "Opportunity to create meaningful change",
          "Potential for significant growth"
        ],
        recommendations: [
          "Reflect on which values are most important to you",
          "Identify specific actions that don't align with your values",
          "Create a plan to adjust your daily practices",
          "Seek support from mentors or colleagues",
          "Start with small changes to build momentum"
        ]
      };
    }
  };

  const insights = showResults ? getInsights(score) : null;

  // Calculate category scores
  const getCategoryScores = () => {
    const categoryRatings = {};

    statements.forEach(stmt => {
      if (!categoryRatings[stmt.category]) {
        categoryRatings[stmt.category] = [];
      }
      if (ratings[stmt.id]) {
        categoryRatings[stmt.category].push(ratings[stmt.id]);
      }
    });

    const categoryScores = {};
    Object.keys(categoryRatings).forEach(category => {
      // Calculate how many questions in this category received a 3 or higher (1 point each)
      const points = categoryRatings[category].reduce((sum, rating) => {
        return sum + (rating >= 3 ? 1 : 0);
      }, 0);
      // Calculate average points per question in this category, scaled to 1-5 range
      const numQuestionsInCategory = categoryRatings[category].length;
      categoryScores[category] = numQuestionsInCategory > 0 ? Math.round((points / numQuestionsInCategory) * 5) : 0;
    });

    return categoryScores;
  };

  const categoryScores = showResults ? getCategoryScores() : {};

  return (
    <TeacherGameShell
      title={gameData?.title || "Inner Alignment Quiz"}
      subtitle={gameData?.description || "Check whether daily actions align with core values and goals"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentQuestion + 1}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {!showResults ? (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">🎯</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Inner Alignment Quiz
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Rate how well each statement reflects your daily actions. Be honest—this helps identify alignment between your values and your practices.
                  </p>
                </div>

                {/* Progress */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Question {currentQuestion + 1} of {statements.length}</span>
                    <span>{Math.round(progress)}% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full"
                    />
                  </div>
                </div>

                {/* Current Statement */}
                <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-8 border-2 border-purple-200 mb-8">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
                        {currentStatement.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 leading-relaxed">
                      {currentStatement.statement}
                    </h3>
                    <p className="text-gray-600 italic">
                      {currentStatement.description}
                    </p>
                  </div>

                  {/* Rating Scale */}
                  <div className="bg-white rounded-lg p-6 border-2 border-purple-200">
                    <p className="text-sm font-semibold text-gray-700 mb-4 text-center">
                      How well does this statement describe your daily actions?
                    </p>
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-sm text-gray-600 font-medium">Rarely True</span>
                      <div className="flex gap-2 flex-1 justify-center">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <motion.button
                            key={rating}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRatingSelect(currentStatement.id, rating)}
                            className={`w-14 h-14 rounded-full font-bold text-lg transition-all flex items-center justify-center ${currentRating === rating
                                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg scale-110'
                                : 'bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600 border-2 border-gray-300'
                              }`}
                          >
                            {rating}
                          </motion.button>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">Always True</span>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${currentQuestion === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-500 text-white hover:bg-gray-600'
                      }`}
                  >
                    Previous
                  </motion.button>

                  <span className="text-sm text-gray-600">
                    {answeredCount} of {statements.length} answered
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    disabled={!currentRating}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${!currentRating
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg'
                      }`}
                  >
                    {currentQuestion < statements.length - 1 ? 'Next' : 'View Results'}
                    <TrendingUp className="w-4 h-4" />
                  </motion.button>
                </div>
              </>
            ) : (
              /* Results Screen */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="mb-8">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="text-6xl mb-4"
                  >
                    {insights?.emoji}
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Your Alignment Results
                  </h2>
                </div>

                {/* Alignment Score */}
                <div className={`bg-gradient-to-br ${insights?.bgColor} rounded-xl p-8 border-2 ${insights?.borderColor} mb-8`}>
                  <div className="mb-6">
                    <p className="text-lg font-semibold text-gray-700 mb-2">Your Alignment Score</p>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="text-7xl font-bold text-gray-800 mb-2"
                    >
                      {score} out of {statements.length}
                    </motion.div>
                    <h3 className={`text-2xl font-bold mb-2 ${insights?.level === "Highly Aligned" ? "text-green-700" :
                        insights?.level === "Moderately Aligned" ? "text-blue-700" :
                          "text-orange-700"
                      }`}>
                      {insights?.level}
                    </h3>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {insights?.message}
                    </p>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Star className="w-5 h-5 text-purple-600" />
                    Category Breakdown
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(categoryScores).map(([category, catScore]) => {
                      const statement = statements.find(s => s.category === category);
                      return (
                        <div key={category} className="border-2 border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-gray-800">{category}</span>
                            <span className="font-bold text-purple-600">{catScore}/5</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(catScore / 5) * 100}%` }}
                              transition={{ delay: 0.3 + Object.keys(categoryScores).indexOf(category) * 0.1 }}
                              className={`h-2 rounded-full ${catScore >= 4 ? "bg-green-500" :
                                  catScore >= 3 ? "bg-blue-500" :
                                    "bg-orange-500"
                                }`}
                            />
                          </div>
                          <p className="text-sm text-gray-600 mt-2 italic">{statement?.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Strengths */}
                {insights?.strengths && insights.strengths.length > 0 && (
                  <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
                    <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Your Strengths
                    </h3>
                    <ul className="text-left space-y-2 text-green-800">
                      {insights.strengths.map((strength, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {insights?.recommendations && insights.recommendations.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
                    <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Recommendations for Growth
                    </h3>
                    <ul className="text-left space-y-2 text-blue-800">
                      {insights.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key Insight */}
                <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
                  <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Key Insight
                  </h3>
                  <p className="text-purple-800 leading-relaxed">
                    Alignment between your values and daily actions is not about perfection—it's about awareness and intentionality. When you notice gaps, you create opportunities to realign your practices with what matters most to you. Regular check-ins like this quiz help you stay connected to your purpose and make conscious choices that reflect your values.
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
                🎯✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Inner Alignment Quiz Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You've assessed how well your daily actions align with your values and goals
              </p>
            </div>

            {/* Final Score Display */}
            {insights && (
              <div className={`bg-gradient-to-br ${insights.bgColor} rounded-xl p-8 border-2 ${insights.borderColor} mb-6`}>
                <div className="text-center">
                  <div className="text-6xl font-bold text-gray-800 mb-2">{score} out of {statements.length}</div>
                  <h3 className={`text-2xl font-bold mb-2 ${insights.level === "Highly Aligned" ? "text-green-700" :
                      insights.level === "Moderately Aligned" ? "text-blue-700" :
                        "text-orange-700"
                    }`}>
                    {insights.level}
                  </h3>
                  <p className="text-gray-700 text-lg">{insights.message}</p>
                </div>
              </div>
            )}

            {/* Benefits */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                The Power of Inner Alignment
              </h3>
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Reduces stress:</strong> Alignment between values and actions reduces internal conflict and stress</li>
                <li>• <strong>Increases satisfaction:</strong> Living in alignment with your values increases job satisfaction and fulfillment</li>
                <li>• <strong>Builds authenticity:</strong> Acting in alignment with values creates a sense of authenticity and integrity</li>
                <li>• <strong>Strengthens purpose:</strong> Regular alignment checks help you stay connected to your purpose</li>
                <li>• <strong>Guides decisions:</strong> Clear alignment helps you make decisions that reflect what matters most</li>
                <li>• <strong>Enhances resilience:</strong> Acting in alignment with values provides strength during challenges</li>
                <li>• <strong>Creates clarity:</strong> Understanding alignment gaps provides clarity on areas for growth</li>
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
                    <strong>Discuss results with mentors during review sessions.</strong> Sharing your alignment assessment with mentors creates opportunities for growth and support:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Schedule review sessions:</strong> Set aside time during mentor meetings to discuss alignment quiz results. Regular reviews create accountability and growth.</li>
                    <li><strong>Share specific scores:</strong> Share your overall alignment score and category breakdowns. Specific scores provide concrete areas for discussion.</li>
                    <li><strong>Discuss gaps:</strong> Talk about areas where alignment is lower. Identifying gaps helps create actionable plans for improvement.</li>
                    <li><strong>Celebrate strengths:</strong> Discuss areas where alignment is strong. Celebrating strengths reinforces positive practices.</li>
                    <li><strong>Set alignment goals:</strong> Work with your mentor to set specific goals for improving alignment in targeted areas.</li>
                    <li><strong>Create action plans:</strong> Develop concrete action plans for closing alignment gaps. Action plans turn insights into practices.</li>
                    <li><strong>Track progress:</strong> Retake the quiz periodically and compare results. Tracking progress shows growth over time.</li>
                    <li><strong>Explore values:</strong> Discuss your core values and how they connect to teaching. Deepening value understanding strengthens alignment.</li>
                    <li><strong>Address challenges:</strong> Talk about specific challenges that create misalignment. Addressing challenges helps remove barriers.</li>
                    <li><strong>Share insights:</strong> Reflect together on insights from the quiz. Collaborative reflection deepens understanding and creates support.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you discuss results with mentors during review sessions, you're creating a practice that supports growth, provides accountability, deepens self-awareness, creates actionable plans, and strengthens your alignment between values and actions. Regular mentor discussions transform individual assessment into collaborative growth that benefits your teaching practice and well-being.
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

export default InnerAlignmentQuiz;