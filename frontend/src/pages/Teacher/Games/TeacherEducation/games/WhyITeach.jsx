import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { BookOpen, Heart, Award, Users, CheckCircle, TrendingUp, Sparkles, Target } from "lucide-react";

const WhyITeach = () => {
  const location = useLocation();
  
  // Get game data
  const gameId = "teacher-education-81";
  const gameData = getTeacherEducationGameById(gameId);
  
  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 1;
  
  const [reflection, setReflection] = useState("");
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Guided prompts
  const prompts = [
    "What moment made me choose teaching?",
    "When did I first realize teaching was my calling?",
    "What experience inspired me to become a teacher?",
    "Who or what influenced my decision to teach?",
    "What memory connects me to why I teach?"
  ];

  const [currentPrompt, setCurrentPrompt] = useState(prompts[0]);

  // Emotion tags
  const emotionTags = [
    {
      id: 'joy',
      label: 'Joy',
      emoji: '😊',
      description: 'I teach because it brings me joy and happiness',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-300',
      insight: 'Joy in teaching comes from seeing students learn, grow, and succeed. When you teach with joy, you create positive energy that inspires students and reminds you of why you chose this profession.'
    },
    {
      id: 'gratitude',
      label: 'Gratitude',
      emoji: '🙏',
      description: 'I teach because I am grateful for the opportunity to make a difference',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-300',
      insight: 'Gratitude in teaching comes from recognizing the privilege of impacting lives. When you teach with gratitude, you appreciate the opportunity to shape the future and honor those who taught you.'
    },
    {
      id: 'passion',
      label: 'Passion',
      emoji: '🔥',
      description: 'I teach because I am passionate about education and learning',
      color: 'from-red-400 to-pink-500',
      bgColor: 'from-red-50 to-pink-50',
      borderColor: 'border-red-300',
      insight: 'Passion in teaching comes from deep love for learning and sharing knowledge. When you teach with passion, you ignite curiosity, inspire others, and remind yourself of the fire that drives you.'
    }
  ];

  const handleReflectionChange = (value) => {
    setReflection(value);
  };

  const handleEmotionSelect = (emotionId) => {
    setSelectedEmotion(emotionId);
  };

  const handleComplete = () => {
    if (!reflection.trim()) {
      alert("Please write your reflection about why you teach first.");
      return;
    }

    if (!selectedEmotion) {
      alert("Please choose an emotion tag that captures your reflection.");
      return;
    }

    setScore(1);
    setShowGameOver(true);
  };

  const selectedEmotionData = selectedEmotion ? emotionTags.find(t => t.id === selectedEmotion) : null;
  const reflectionLength = reflection.trim().length;

  return (
    <TeacherGameShell
      title={gameData?.title || "Why I Teach"}
      subtitle={gameData?.description || "Reconnect with the original reason for becoming a teacher"}
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
              <div className="text-6xl mb-4">💡</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Why I Teach
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Reconnect with the original reason for becoming a teacher. Reflect on the moment that made you choose teaching.
              </p>
            </div>

            {/* Guided Prompt */}
            <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Guided Reflection Prompt</h3>
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
                  <strong>Write a short paragraph:</strong> Recall the moment, experience, person, or realization that made you choose teaching. Describe what happened, how you felt, and why it mattered.
                </p>
                <p className="text-xs text-amber-700 italic">
                  Examples: "I had a teacher who believed in me when no one else did...", "I saw a student's face light up when they finally understood...", "I realized that education could change lives..."
                </p>
              </div>

              <textarea
                value={reflection}
                onChange={(e) => handleReflectionChange(e.target.value)}
                placeholder="Write your reflection about why you teach... Think about the moment that made you choose teaching, what it meant to you, and how it connects to who you are as a teacher today..."
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
                Choose an Emotion Tag
              </h3>
              <p className="text-gray-600 mb-6">
                Which emotion best captures the essence of your reflection?
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {emotionTags.map((tag) => (
                  <motion.button
                    key={tag.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleEmotionSelect(tag.id)}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${
                      selectedEmotion === tag.id
                        ? `${tag.borderColor} bg-gradient-to-br ${tag.bgColor} shadow-lg`
                        : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-4xl">{tag.emoji}</div>
                      <div className="flex-1">
                        <h4 className={`font-bold text-lg mb-1 ${
                          selectedEmotion === tag.id ? 'text-gray-800' : 'text-gray-700'
                        }`}>
                          {tag.label}
                        </h4>
                      </div>
                      {selectedEmotion === tag.id && (
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className={`text-sm leading-relaxed ${
                      selectedEmotion === tag.id ? 'text-gray-800' : 'text-gray-600'
                    }`}>
                      {tag.description}
                    </p>
                  </motion.button>
                ))}
              </div>

              {selectedEmotion && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 bg-gradient-to-br ${selectedEmotionData.bgColor} rounded-lg p-5 border-2 ${selectedEmotionData.borderColor}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{selectedEmotionData.emoji}</div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Your Emotion: {selectedEmotionData.label}</h4>
                      <p className="text-gray-800 leading-relaxed">
                        {selectedEmotionData.insight}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Complete Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleComplete}
                disabled={!reflection.trim() || !selectedEmotion}
                className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all flex items-center gap-3 mx-auto ${
                  reflection.trim() && selectedEmotion
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                Complete Reflection
              </motion.button>
              
              {(!reflection.trim() || !selectedEmotion) && (
                <p className="text-sm text-gray-600 mt-3">
                  Please write your reflection and choose an emotion tag to complete.
                </p>
              )}
            </div>
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
                💡✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Reflection Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You've reconnected with why you teach
              </p>
            </div>

            {/* Reflection Display */}
            <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-8 border-2 border-purple-200 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-purple-600" />
                <h3 className="text-2xl font-bold text-gray-800">Your "Why I Teach" Reflection</h3>
              </div>

              <div className="bg-white rounded-lg p-6 border-2 border-purple-200 mb-6">
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Prompt:</p>
                  <p className="text-lg text-gray-800 italic">"{currentPrompt}"</p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Your Reflection:</p>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {reflection}
                  </p>
                </div>
              </div>

              {selectedEmotionData && (
                <div className={`bg-gradient-to-br ${selectedEmotionData.bgColor} rounded-lg p-6 border-2 ${selectedEmotionData.borderColor}`}>
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{selectedEmotionData.emoji}</div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-800 mb-2">Emotion Tag: {selectedEmotionData.label}</h4>
                      <p className="text-gray-800 leading-relaxed mb-3">
                        {selectedEmotionData.description}
                      </p>
                      <div className="bg-white/60 rounded-lg p-4 border border-gray-200">
                        <p className="text-gray-800 leading-relaxed">
                          {selectedEmotionData.insight}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Benefits */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                The Power of Reconnecting with Your "Why"
              </h3>
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Renews purpose:</strong> Reflecting on why you teach reminds you of your core purpose and passion</li>
                <li>• <strong>Reignites motivation:</strong> Connecting with your original inspiration re-energizes you during challenging times</li>
                <li>• <strong>Reduces burnout:</strong> Remembering your "why" helps you navigate difficulties with resilience and perspective</li>
                <li>• <strong>Strengthens identity:</strong> Reconnecting with your calling reinforces your identity as an educator</li>
                <li>• <strong>Improves satisfaction:</strong> Teachers who regularly reflect on their "why" report higher job satisfaction</li>
                <li>• <strong>Inspires others:</strong> Sharing your "why" with others can inspire colleagues and students</li>
                <li>• <strong>Guides decisions:</strong> Your "why" becomes a compass that guides your teaching decisions and priorities</li>
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
                    <strong>Print and place "Why I Teach" notes on a shared wall to inspire others.</strong> Creating a visible collection of teachers' reasons for teaching builds connection and motivation:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Create a physical space:</strong> Designate a wall, bulletin board, or display area in the staffroom or common area for "Why I Teach" notes. A visible space invites participation and creates a sense of community.</li>
                    <li><strong>Make it beautiful:</strong> Use colorful paper, decorative borders, or templates that make the notes visually appealing. A beautiful display shows that teachers' stories are valued.</li>
                    <li><strong>Print notes regularly:</strong> As teachers complete their reflections, print their notes (with permission) and add them to the wall. Regular additions keep the wall fresh and engaging.</li>
                    <li><strong>Include emotion tags:</strong> Display the emotion tags (Joy, Gratitude, Passion) with color coding or icons to show the variety of emotions that drive teachers.</li>
                    <li><strong>Make it anonymous or named:</strong> Decide whether notes should be anonymous (encourages participation) or signed (creates personal connection). Some schools do both - anonymous on one section, signed on another.</li>
                    <li><strong>Encourage participation:</strong> Invite all teachers to add their "Why I Teach" notes. Make it a welcoming, inclusive practice where everyone's story matters.</li>
                    <li><strong>Celebrate diversity:</strong> The wall will show diverse reasons for teaching - honor all of them. Different motivations are all valid and valuable.</li>
                    <li><strong>Update regularly:</strong> Refresh the wall periodically with new notes. Consider organizing them by theme, emotion, or department.</li>
                    <li><strong>Share at events:</strong> Display the wall during open houses, parent meetings, or school celebrations. It shows the passion behind your teaching community.</li>
                    <li><strong>Create digital version:</strong> Consider also having a digital version (website, newsletter, social media) to share with a wider audience and preserve the stories.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you print and place "Why I Teach" notes on a shared wall to inspire others, you're creating a visible reminder of teachers' passion and purpose. This wall becomes a source of inspiration during challenging times, a celebration of the diverse reasons people teach, and a powerful statement about the value of education. It builds community, strengthens morale, and reminds everyone why they chose this profession. The shared wall transforms individual reflections into collective inspiration.
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

export default WhyITeach;

