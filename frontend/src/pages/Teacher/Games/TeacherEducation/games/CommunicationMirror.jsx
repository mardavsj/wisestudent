import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { CheckCircle, XCircle, Eye, MessageCircle, TrendingUp, BookOpen, Users } from "lucide-react";

const CommunicationMirror = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-66";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showInsight, setShowInsight] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Communication habit questions
  const questions = [
    {
      id: 1,
      question: "Do I interrupt others when they're speaking?",
      category: "Listening Habits",
      emoji: "💬",
      yesInsight: {
        title: "Tendency to Interrupt",
        insight: "You may have a tendency to interrupt others. This could signal excitement, eagerness to contribute, or difficulty waiting your turn. Consider practicing active listening—let others finish their thoughts before responding. This shows respect and often leads to better understanding.",
        suggestion: "Practice pausing for 2-3 seconds after someone finishes speaking before you respond. This gives space for their complete thought and prevents interruptions."
      },
      noInsight: {
        title: "Good Listening Skills",
        insight: "You tend to let others finish speaking before you respond. This shows strong listening skills and respect for others' perspectives. You create space for complete thoughts and better understanding.",
        suggestion: "Continue this practice! Your ability to listen fully before responding builds trust and deeper connections with students, colleagues, and parents."
      },
      sometimesInsight: {
        title: "Occasional Interruption",
        insight: "You sometimes interrupt others when speaking. This may happen when you're excited about the topic or feel the urge to contribute. Being aware of this pattern helps you choose when to hold back and when to jump in appropriately.",
        suggestion: "Notice the situations when you're more likely to interrupt. Practice patience in those moments, but also recognize when timely interjections can enhance the conversation."
      }
    },
    {
      id: 2,
      question: "Do I apologize too much?",
      category: "Boundary Habits",
      emoji: "🙏",
      yesInsight: {
        title: "Over-Apologizing Tendency",
        insight: "You may over-apologize for things that aren't your fault or responsibility. Excessive apologies can signal low confidence or unclear boundaries. While apologies are important when appropriate, over-apologizing can undermine your authority and self-respect.",
        suggestion: "Notice when you apologize. Ask yourself: 'Is this actually my responsibility?' If not, skip the apology. Save apologies for genuine mistakes or when you've actually caused harm."
      },
      noInsight: {
        title: "Appropriate Apology Use",
        insight: "You use apologies appropriately—when you've actually made a mistake or caused harm. This shows healthy boundaries and self-awareness. You understand the difference between taking responsibility and unnecessary self-blame.",
        suggestion: "Great balance! Your appropriate use of apologies maintains accountability without undermining your confidence or authority."
      },
      sometimesInsight: {
        title: "Balanced Apology Use",
        insight: "You occasionally apologize when it might not be necessary, but generally maintain appropriate boundaries. This shows self-awareness about your communication patterns and an ongoing effort to find the right balance.",
        suggestion: "Continue monitoring your apology patterns. Notice the difference between acknowledging impact and taking responsibility for unintended outcomes."
      }
    },
    {
      id: 3,
      question: "Do I use filler words frequently (um, like, you know)?",
      category: "Speaking Habits",
      emoji: "🗣️",
      yesInsight: {
        title: "Filler Word Usage",
        insight: "You use filler words frequently while speaking. This often happens when you're thinking on your feet or feeling uncertain. While filler words are natural, reducing them can increase clarity and perceived confidence.",
        suggestion: "Practice pausing instead of using filler words. A brief silence feels more confident than 'um' or 'like.' Try slowing down your speech slightly to give your brain time to form thoughts clearly."
      },
      noInsight: {
        title: "Clear Communication",
        insight: "You communicate with minimal filler words, which suggests clarity of thought and confidence in your communication. This makes your messages more effective and easier to follow.",
        suggestion: "Your clear communication style helps others understand you better. Continue this practice—it's a valuable skill in teaching and relationships."
      },
      sometimesInsight: {
        title: "Moderate Filler Word Usage",
        insight: "You sometimes use filler words, particularly in stressful situations or when discussing complex topics. This is quite normal and often goes unnoticed in casual conversation.",
        suggestion: "Focus on using pauses instead of filler words during high-stakes conversations. Practice your key talking points in advance to reduce uncertainty that leads to fillers."
      }
    },
    {
      id: 4,
      question: "Do I avoid difficult conversations?",
      category: "Conflict Communication",
      emoji: "😰",
      yesInsight: {
        title: "Conversation Avoidance",
        insight: "You tend to avoid difficult conversations. This is common and often stems from fear of conflict, hurting others, or being uncomfortable. However, avoiding difficult conversations can lead to bigger problems and unaddressed issues.",
        suggestion: "Start with small, low-stakes difficult conversations to build confidence. Prepare your thoughts beforehand, and remember that addressing issues early prevents bigger problems later."
      },
      noInsight: {
        title: "Willingness to Address Difficulties",
        insight: "You're willing to engage in difficult conversations when needed. This shows courage and commitment to addressing issues directly. You understand that avoiding problems doesn't solve them, and you're willing to navigate discomfort for resolution.",
        suggestion: "Your willingness to address difficult topics is a strength. Continue approaching challenging conversations with preparation and empathy."
      },
      sometimesInsight: {
        title: "Selective Conversation Engagement",
        insight: "You sometimes avoid difficult conversations, particularly when you're unsure of the outcome or feel emotionally unprepared. This selective approach can be strategic, but make sure important issues don't get overlooked.",
        suggestion: "Evaluate which conversations are worth having despite discomfort. Set a timeline for addressing important issues rather than indefinitely postponing them."
      }
    },
    {
      id: 5,
      question: "Do I raise my voice when frustrated or stressed?",
      category: "Emotional Communication",
      emoji: "📢",
      yesInsight: {
        title: "Volume Escalation Under Stress",
        insight: "You tend to raise your voice when frustrated or stressed. This is a common stress response, but raised voices can escalate conflicts, damage relationships, and reduce effectiveness. It signals loss of control rather than authority.",
        suggestion: "Practice 'low and slow' voice modulation when stressed. Consciously lower your pitch and slow your rate. Take a breath before responding. This signals confidence and control even when under pressure."
      },
      noInsight: {
        title: "Emotional Regulation in Communication",
        insight: "You maintain appropriate volume even when frustrated or stressed. This shows strong emotional regulation and communication control. You understand that raised voices don't solve problems and can damage relationships.",
        suggestion: "Your ability to regulate volume under stress is valuable. This skill maintains relationships and authority even in challenging situations."
      },
      sometimesInsight: {
        title: "Occasional Volume Fluctuation",
        insight: "You sometimes raise your voice when particularly stressed or frustrated, but generally maintain emotional regulation. This suggests you're mostly in control but may need additional strategies for your most challenging moments.",
        suggestion: "Identify the specific triggers that cause you to raise your voice. Develop a personal signal (like a mental note or physical gesture) to remind yourself to pause and breathe deeply."
      }
    }
  ];

  const handleAnswer = (answer) => {
    if (answers[currentQuestion]) return; // Already answered

    const question = questions[currentQuestion];
    let insight;
    if (answer === 'yes') {
      insight = question.yesInsight;
    } else if (answer === 'no') {
      insight = question.noInsight;
    } else { // 'sometimes'
      insight = question.sometimesInsight;
    }

    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: {
        answer,
        insight
      }
    }));

    setShowInsight(true);
  };

  const handleNext = () => {
    setShowInsight(false);
    if (currentQuestion < totalLevels - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate score based on insights (give points for self-awareness)
      const awarenessScore = Object.keys(answers).length;
      setScore(awarenessScore);
      setShowGameOver(true);
    }
  };

  const current = questions[currentQuestion];
  const answerData = answers[currentQuestion];
  const progress = ((currentQuestion + 1) / totalLevels) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <TeacherGameShell
      title={gameData?.title || "Communication Mirror"}
      subtitle={gameData?.description || "Reflect on personal communication habits"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentQuestion + 1}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {totalLevels}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
              />
            </div>
          </div>

          {!showInsight && (
            <>
              {/* Question Card */}
              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-indigo-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">{current.category}</p>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Question {currentQuestion + 1}
                    </h2>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                  <div className="text-5xl mb-4">{current.emoji}</div>
                  <p className="text-2xl font-semibold text-gray-800 leading-relaxed">
                    {current.question}
                  </p>
                </div>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer('yes')}
                  className="p-6 rounded-xl border-2 border-gray-300 bg-white hover:border-green-400 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-lg font-bold text-gray-800">Yes</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer('sometimes')}
                  className="p-6 rounded-xl border-2 border-gray-300 bg-white hover:border-yellow-400 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-lg font-bold text-gray-800">Sometimes</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer('no')}
                  className="p-6 rounded-xl border-2 border-gray-300 bg-white hover:border-red-400 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-red-400 to-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <XCircle className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-lg font-bold text-gray-800">No</p>
                  </div>
                </motion.button>
              </div>
            </>
          )}

          {/* Insight */}
          {showInsight && answerData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-6"
            >
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">{current.emoji}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {answerData.insight.title}
                  </h3>
                </div>
                <div className="bg-white/60 rounded-lg p-5">
                  <p className="text-gray-800 leading-relaxed text-lg mb-4">
                    {answerData.insight.insight}
                  </p>
                  <div className="bg-blue-100 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm font-semibold text-blue-900 mb-2">
                      💡 Suggestion:
                    </p>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      {answerData.insight.suggestion}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  {currentQuestion < totalLevels - 1 ? 'Next Question' : 'View Summary'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Game Over Summary */}
        {showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-6xl mb-4"
              >
                🪞✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Communication Mirror Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You've reflected on {answeredCount} communication habits
              </p>
            </div>

            {/* Reflection Summary */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Self-Awareness Score</h3>
                <div className="text-5xl font-bold mb-2 text-indigo-600">
                  {Math.round((answeredCount / totalLevels) * 100)}%
                </div>
                <p className="text-gray-700">
                  Completing this reflection shows self-awareness and willingness to grow. Each insight is an opportunity to strengthen your communication skills.
                </p>
              </div>
            </div>

            {/* Communication Insights */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Communication Reflection Insights
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Self-awareness is the first step:</strong> Recognizing your communication habits is essential for growth. You can't change what you don't notice.</li>
                <li>• <strong>No judgment, just observation:</strong> This reflection isn't about good or bad—it's about awareness. Every habit has a context and purpose.</li>
                <li>• <strong>Small changes create big impact:</strong> Improving one communication habit can transform relationships and professional effectiveness.</li>
                <li>• <strong>Practice makes progress:</strong> Communication skills improve with intentional practice. Each conversation is an opportunity to strengthen habits.</li>
                <li>• <strong>External feedback is valuable:</strong> Pairing with a colleague for feedback helps you see blind spots and accelerate growth.</li>
              </ul>
            </div>

            {/* Answer Summary */}
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Your Communication Habits Summary</h3>
              <div className="space-y-3">
                {questions.slice(0, totalLevels).map((q, index) => {
                  const answer = answers[index];
                  if (!answer) return null;

                  return (
                    <div key={q.id} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{q.emoji}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 mb-1">{q.question}</p>
                          <p className="text-sm text-gray-600">
                            Your answer: <strong>{answer.answer === 'yes' ? 'Yes' : answer.answer === 'no' ? 'No' : 'Sometimes'}</strong> — {answer.insight.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
                    Pair teachers to exchange communication feedback weekly. This creates accountability, accelerates growth, and builds supportive professional relationships:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Find a communication partner:</strong> Pair with a colleague you trust and who is committed to growth. Choose someone who will be honest yet supportive.</li>
                    <li><strong>Set regular check-ins:</strong> Schedule weekly or bi-weekly meetings to exchange feedback. Consistency is key to creating lasting change.</li>
                    <li><strong>Focus on specific behaviors:</strong> Instead of general feedback, observe and share specific communication habits (e.g., "I noticed you interrupted twice in that meeting" or "Your eye contact during that conversation really showed presence").</li>
                    <li><strong>Create a safe space:</strong> Agree on ground rules: feedback is for growth, not criticism. Use "I noticed" language and focus on observations, not judgments.</li>
                    <li><strong>Celebrate progress:</strong> Acknowledge improvements and positive changes. Growth should be celebrated, not just critiqued.</li>
                    <li><strong>Practice together:</strong> Use your check-ins as opportunities to practice new communication skills together. Role-play difficult conversations or practice specific habits.</li>
                    <li><strong>Be reciprocal:</strong> Both partners should give and receive feedback. This creates mutual accountability and shared growth.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you pair teachers to exchange communication feedback weekly, you're creating a culture of continuous growth and support. This practice helps you see blind spots, celebrate progress, and accelerate communication skill development. Having a trusted partner for feedback creates accountability and makes improvement more enjoyable and effective. Regular feedback exchange builds stronger professional relationships and creates a supportive community of growth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default CommunicationMirror;