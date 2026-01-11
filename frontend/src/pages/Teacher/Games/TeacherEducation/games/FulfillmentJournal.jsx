import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { BookOpen, Heart, Award, CheckCircle, TrendingUp, Sparkles, Target, Calendar, Save } from "lucide-react";

const FulfillmentJournal = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-86";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [reflection, setReflection] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [savedEntries, setSavedEntries] = useState([]);
  const [showDiary, setShowDiary] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Guided prompts
  const prompts = [
    "When did I feel most alive this week while teaching?",
    "What moment this week reminded me why I teach?",
    "When did I feel most fulfilled in my teaching this week?",
    "What experience this week made me feel energized about teaching?",
    "When did I feel most connected to my students this week?"
  ];

  const [currentPrompt, setCurrentPrompt] = useState(prompts[0]);

  // Emotion tags
  const emotionTags = [
    {
      id: 'joy',
      label: 'Joy',
      emoji: '😊',
      description: 'Pure happiness and delight',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-300'
    },
    {
      id: 'pride',
      label: 'Pride',
      emoji: '✨',
      description: 'Feeling proud of student growth or my impact',
      color: 'from-purple-400 to-indigo-500',
      bgColor: 'from-purple-50 to-indigo-50',
      borderColor: 'border-purple-300'
    },
    {
      id: 'gratitude',
      label: 'Gratitude',
      emoji: '🙏',
      description: 'Grateful for the opportunity to teach',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-300'
    },
    {
      id: 'fulfillment',
      label: 'Fulfillment',
      emoji: '💙',
      description: 'Deep satisfaction and sense of purpose',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300'
    },
    {
      id: 'excitement',
      label: 'Excitement',
      emoji: '🎉',
      description: 'Enthusiasm and energy about teaching',
      color: 'from-pink-400 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      borderColor: 'border-pink-300'
    },
    {
      id: 'love',
      label: 'Love',
      emoji: '❤️',
      description: 'Deep care and connection with students',
      color: 'from-red-400 to-pink-500',
      bgColor: 'from-red-50 to-pink-50',
      borderColor: 'border-red-300'
    }
  ];

  const handleReflectionChange = (value) => {
    setReflection(value);
  };

  const handleEmotionSelect = (emotionId) => {
    setSelectedEmotion(emotionId);
  };

  const handleSaveEntry = () => {
    if (!reflection.trim()) {
      alert("Please write your reflection first.");
      return;
    }

    if (!selectedEmotion) {
      alert("Please select an emotion tag first.");
      return;
    }

    const entry = {
      id: savedEntries.length + 1,
      prompt: currentPrompt,
      reflection: reflection.trim(),
      emotion: emotionTags.find(t => t.id === selectedEmotion),
      date: new Date().toISOString(),
      week: getCurrentWeek()
    };

    setSavedEntries([...savedEntries, entry]);
    setScore(1);
    setShowDiary(true);
    setTimeout(() => {
      setShowGameOver(true);
    }, 2000);
  };

  const getCurrentWeek = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now - startOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const reflectionLength = reflection.trim().length;
  const selectedEmotionData = selectedEmotion ? emotionTags.find(t => t.id === selectedEmotion) : null;
  const canSave = reflection.trim().length > 0 && selectedEmotion !== null;

  return (
    <TeacherGameShell
      title={gameData?.title || "Fulfillment Journal"}
      subtitle={gameData?.description || "Reflect on the week's most meaningful teaching experience"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={1}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">📔</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Fulfillment Journal
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Reflect on the week's most meaningful teaching experience. Write about when you felt most alive while teaching and tag the emotion you felt.
              </p>
            </div>

            {/* Guided Prompt */}
            <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Journal Prompt</h3>
                  <p className="text-sm text-gray-600">Reflect on this question</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 border-2 border-purple-200">
                <p className="text-2xl font-semibold text-gray-800 text-center italic leading-relaxed">
                  "{currentPrompt}"
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {prompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPrompt(prompt)}
                    className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                      currentPrompt === prompt
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-purple-100 border-2 border-purple-200'
                    }`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Reflection Writing Area */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Your Reflection</h3>
                {reflection.trim() && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
              
              <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-200 mb-4">
                <p className="text-sm text-amber-800 mb-2">
                  <strong>Write a paragraph:</strong> Reflect on a specific moment this week when you felt most alive, fulfilled, or energized while teaching. Describe what happened, how you felt, and why it mattered.
                </p>
                <p className="text-xs text-amber-700 italic">
                  Examples: "When a student finally understood a concept after struggling...", "When I saw students collaborate beautifully...", "When a student thanked me for believing in them..."
                </p>
              </div>

              <textarea
                value={reflection}
                onChange={(e) => handleReflectionChange(e.target.value)}
                placeholder="Write your reflection about the week's most meaningful teaching experience... Describe the moment when you felt most alive, fulfilled, or energized while teaching..."
                rows={8}
                className="w-full p-4 rounded-lg border-2 border-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-gray-800"
              />

              {reflectionLength > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm text-gray-600 flex items-center gap-1"
                >
                  <TrendingUp className="w-4 h-4" />
                  {reflectionLength} characters
                </motion.div>
              )}
            </div>

            {/* Emotion Tag Selection */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6 text-pink-600" />
                Tag the Emotion
              </h3>
              <p className="text-gray-600 mb-6">
                Which emotion best captures how you felt during this meaningful moment?
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {emotionTags.map((tag) => (
                  <motion.button
                    key={tag.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleEmotionSelect(tag.id)}
                    className={`p-5 rounded-xl border-2 text-center transition-all ${
                      selectedEmotion === tag.id
                        ? `${tag.borderColor} bg-gradient-to-br ${tag.bgColor} shadow-lg`
                        : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-md'
                    }`}
                  >
                    <div className="text-4xl mb-2">{tag.emoji}</div>
                    <h4 className={`font-bold text-lg mb-1 ${
                      selectedEmotion === tag.id ? 'text-gray-800' : 'text-gray-700'
                    }`}>
                      {tag.label}
                    </h4>
                    <p className={`text-sm leading-relaxed ${
                      selectedEmotion === tag.id ? 'text-gray-800' : 'text-gray-600'
                    }`}>
                      {tag.description}
                    </p>
                    {selectedEmotion === tag.id && (
                      <CheckCircle className="w-6 h-6 text-green-500 mx-auto mt-2" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            {canSave && (
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveEntry}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                >
                  <Save className="w-5 h-5" />
                  Save to Digital Diary
                </motion.button>
              </div>
            )}
          </div>
        )}

        {/* Digital Diary Display */}
        {showDiary && savedEntries.length > 0 && (
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
                📔✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Entry Saved to Digital Diary!
              </h2>
              <p className="text-xl text-gray-600">
                Your reflection has been saved to your fulfillment journal
              </p>
            </div>

            {/* Latest Entry Display */}
            {savedEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${entry.emotion.bgColor} rounded-xl p-8 border-2 ${entry.emotion.borderColor} mb-6 shadow-lg`}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-5xl">{entry.emotion.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <p className="text-sm text-gray-600">{formatDate(entry.date)}</p>
                      <span className="text-xs bg-white/60 px-2 py-1 rounded-full text-gray-700">
                        Week {entry.week}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {entry.emotion.label}
                    </h3>
                    <p className="text-gray-700 text-sm mb-4">{entry.emotion.description}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                </div>

                <div className="bg-white rounded-lg p-6 border-2 border-gray-200 mb-4">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Prompt:</p>
                  <p className="text-lg text-gray-800 italic mb-4">"{entry.prompt}"</p>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Your Reflection:</p>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {entry.reflection}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
                📔✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Fulfillment Journal Entry Saved!
              </h2>
              <p className="text-xl text-gray-600">
                Your reflection has been added to your digital diary
              </p>
            </div>

            {/* Latest Entry Summary */}
            {savedEntries.length > 0 && (
              <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-8 border-2 border-purple-200 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                  Your Latest Entry
                </h3>

                {savedEntries.map((entry) => (
                  <div key={entry.id} className={`bg-gradient-to-br ${entry.emotion.bgColor} rounded-xl p-6 border-2 ${entry.emotion.borderColor} mb-4`}>
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{entry.emotion.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-gray-600" />
                          <p className="text-sm text-gray-600">{formatDate(entry.date)}</p>
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">
                          {entry.emotion.label}
                        </h4>
                        <p className="text-sm text-gray-700 mb-3">{entry.emotion.description}</p>
                        <div className="bg-white/60 rounded-lg p-4 border border-gray-200">
                          <p className="text-sm font-semibold text-gray-600 mb-1">Prompt:</p>
                          <p className="text-sm text-gray-800 italic mb-3">"{entry.prompt}"</p>
                          <p className="text-sm font-semibold text-gray-600 mb-1">Reflection:</p>
                          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                            {entry.reflection}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Benefits */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                The Power of Fulfillment Journaling
              </h3>
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Recognizes fulfillment:</strong> Regular reflection helps you notice and appreciate moments of fulfillment in your teaching</li>
                <li>• <strong>Builds gratitude:</strong> Documenting meaningful experiences creates a collection of positive moments to revisit</li>
                <li>• <strong>Sustains motivation:</strong> Reflecting on fulfilling moments helps maintain motivation during challenging times</li>
                <li>• <strong>Creates perspective:</strong> A journal of fulfillment provides perspective when work feels overwhelming</li>
                <li>• <strong>Strengthens purpose:</strong> Regular reflection on meaningful moments reinforces your sense of purpose and impact</li>
                <li>• <strong>Reduces burnout:</strong> Focusing on fulfillment helps protect against burnout and exhaustion</li>
                <li>• <strong>Builds resilience:</strong> Remembering fulfilling moments builds resilience and helps you navigate difficulties</li>
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
                    <strong>Use journal reflections for end-of-year gratitude portfolios.</strong> Compiling your fulfillment journal entries creates a powerful collection of purpose and impact:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Collect entries:</strong> Save all your fulfillment journal entries throughout the year. Regular entries create a comprehensive collection of meaningful moments.</li>
                    <li><strong>Organize by theme:</strong> At year's end, organize entries by theme—moments of joy, pride, gratitude, fulfillment, excitement, love. This reveals patterns in what matters most.</li>
                    <li><strong>Create visual portfolio:</strong> Design a visual portfolio with quotes, themes, and highlights from your journal entries. A visual representation makes your fulfillment tangible.</li>
                    <li><strong>Include photos:</strong> If possible, include photos or artwork that connect to your journal entries. Visual elements enhance the portfolio's impact.</li>
                    <li><strong>Share with others:</strong> Share your gratitude portfolio with colleagues, administrators, or mentors. Sharing your fulfillment can inspire others and celebrate your impact.</li>
                    <li><strong>Use for reflection:</strong> Review your portfolio to see your growth, recognize patterns, and understand what brings you the most fulfillment in teaching.</li>
                    <li><strong>Celebrate milestones:</strong> Use your portfolio to celebrate teaching milestones, anniversaries, or transitions. It serves as a reminder of your purpose and impact.</li>
                    <li><strong>Share with students:</strong> Consider sharing parts of your portfolio with students (when appropriate) to show them the impact they have on you. This builds connection.</li>
                    <li><strong>Update regularly:</strong> Keep adding to your portfolio throughout the year. Regular updates ensure you capture fulfillment moments as they happen.</li>
                    <li><strong>Preserve your journey:</strong> Your portfolio becomes a record of your teaching journey—documenting fulfillment, growth, and the meaningful moments that make teaching worthwhile.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you use journal reflections for end-of-year gratitude portfolios, you're creating a tangible collection of fulfillment, purpose, and impact. This portfolio becomes a source of motivation, a record of your journey, a celebration of meaningful moments, and a powerful reminder of why you teach. Regular compilation of fulfillment moments transforms individual reflections into a comprehensive testament to the meaning and value of your work.
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

export default FulfillmentJournal;

