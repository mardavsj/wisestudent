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
  const totalLevels = gameData?.totalQuestions || 10;
  
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
      }
    },
    {
      id: 6,
      question: "Do I listen to understand or to respond?",
      category: "Listening Habits",
      emoji: "👂",
      yesInsight: {
        title: "Listening to Respond",
        insight: "You tend to listen with the goal of responding rather than understanding. When we listen to respond, we're often formulating our reply while others are speaking, which means we miss important information and nuances. This can lead to misunderstandings and missed connections.",
        suggestion: "Practice listening to understand first. Put aside your response and focus fully on what the other person is saying. After they finish, take a moment to reflect before responding. This deepens understanding and strengthens relationships."
      },
      noInsight: {
        title: "Listening to Understand",
        insight: "You listen with the goal of understanding rather than immediately responding. This is active listening—you're fully present, absorbing what others are sharing, and considering their perspective. This approach builds trust and deeper connections.",
        suggestion: "Your listening-to-understand approach is a strength. This active listening skill helps you build stronger relationships with students, colleagues, and parents."
      }
    },
    {
      id: 7,
      question: "Do I use 'I' statements or 'you' statements when addressing concerns?",
      category: "Expressing Concerns",
      emoji: "💭",
      yesInsight: {
        title: "Tendency Toward 'You' Statements",
        insight: "You tend to use 'you' statements when addressing concerns. 'You' statements can sound accusatory and put others on the defensive (e.g., 'You always...' or 'You never...'). This often escalates conflict rather than resolving it.",
        suggestion: "Practice using 'I' statements instead. For example, instead of 'You never listen,' try 'I feel unheard when I share my concerns.' 'I' statements express your experience without blaming others, making it easier for them to hear and respond constructively."
      },
      noInsight: {
        title: "Use of 'I' Statements",
        insight: "You use 'I' statements when expressing concerns. This approach communicates your experience and feelings without blaming others (e.g., 'I feel...' or 'I noticed...'). This reduces defensiveness and creates space for constructive dialogue.",
        suggestion: "Your use of 'I' statements is effective. This approach helps others hear your concerns without feeling attacked, leading to better problem-solving and relationship maintenance."
      }
    },
    {
      id: 8,
      question: "Do I check my phone/device during conversations?",
      category: "Presence Habits",
      emoji: "📱",
      yesInsight: {
        title: "Device Distraction During Conversations",
        insight: "You tend to check devices during conversations. Even quick glances at phones signal that the conversation isn't fully important. This reduces presence, makes others feel dismissed, and weakens connection and understanding.",
        suggestion: "Put devices away during conversations. Give your full attention—this shows respect and allows for deeper understanding. If you must check something, acknowledge it: 'I need to quickly check something important' and then put it away."
      },
      noInsight: {
        title: "Full Presence in Conversations",
        insight: "You maintain full presence during conversations, keeping devices away. This shows respect, creates stronger connections, and allows for better understanding. Your undivided attention signals that the conversation and person matter to you.",
        suggestion: "Your ability to be fully present during conversations is valuable. This practice builds trust and stronger relationships with students, colleagues, and parents."
      }
    },
    {
      id: 9,
      question: "Do I give unsolicited advice when others share problems?",
      category: "Support Communication",
      emoji: "💡",
      yesInsight: {
        title: "Tendency to Give Advice",
        insight: "You tend to offer advice when others share problems. While well-intentioned, jumping to solutions before fully understanding can make people feel dismissed. Sometimes people need to be heard and understood before they're ready for advice.",
        suggestion: "Practice listening first, then asking if they want advice before offering solutions. Try: 'I hear what you're dealing with. Would you like to hear some suggestions, or would it help to talk it through more first?' This respects their process."
      },
      noInsight: {
        title: "Listening Before Advising",
        insight: "You tend to listen and understand before offering advice. You recognize that sometimes people need to process and be heard before they're ready for solutions. This approach builds trust and allows for more effective support when advice is requested.",
        suggestion: "Your approach of listening before advising is effective. This allows others to feel heard and understood, and your advice becomes more valuable when they're ready for it."
      }
    },
    {
      id: 10,
      question: "Do I maintain eye contact during conversations?",
      category: "Presence Habits",
      emoji: "👁️",
      yesInsight: {
        title: "Good Eye Contact",
        insight: "You maintain eye contact during conversations. This shows presence, respect, and engagement. Eye contact signals that you're listening and that the conversation matters to you. It builds connection and trust.",
        suggestion: "Continue this practice! Good eye contact (without staring) strengthens relationships and helps you read non-verbal cues better, leading to deeper understanding."
      },
      noInsight: {
        title: "Limited Eye Contact",
        insight: "You tend to avoid or limit eye contact during conversations. This can signal discomfort, distraction, or lack of engagement. While cultural differences exist, appropriate eye contact generally shows respect and presence in most professional settings.",
        suggestion: "Practice maintaining gentle eye contact during conversations. Aim for about 60-70% eye contact—enough to show engagement without making others uncomfortable. Look at their eyes, then briefly away, then back."
      }
    }
  ];

  const handleAnswer = (answer) => {
    if (answers[currentQuestion]) return; // Already answered

    const question = questions[currentQuestion];
    const insight = answer ? question.yesInsight : question.noInsight;

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(true)}
                  className="p-8 rounded-xl border-2 border-gray-300 bg-white hover:border-green-400 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-xl font-bold text-gray-800">Yes</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(false)}
                  className="p-8 rounded-xl border-2 border-gray-300 bg-white hover:border-red-400 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-400 to-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <XCircle className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-xl font-bold text-gray-800">No</p>
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
                            Your answer: <strong>{answer.answer ? 'Yes' : 'No'}</strong> — {answer.insight.title}
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

