import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { BookOpen, Heart, Award, Users, CheckCircle, TrendingUp, Sparkles, MessageCircle } from "lucide-react";

const MentorMemoryJournal = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-77";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  // State for multiple journal entries
  const [stories, setStories] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
    5: ""
  });
  const [selectedTakeaways, setSelectedTakeaways] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null
  });
  const [currentEntry, setCurrentEntry] = useState(1);
  const [completedEntries, setCompletedEntries] = useState([]);
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Guided prompts for 5 different entries
  const entryPrompts = {
    1: "Who supported me when I felt lost?",
    2: "When did a mentor help me grow?",
    3: "Who believed in me when I doubted myself?",
    4: "When did I feel guided and supported?",
    5: "Who shared wisdom that changed my perspective?"
  };

  const currentPrompt = entryPrompts[currentEntry];

  // Takeaway options
  const takeaways = {
    1: [
      {
        id: 'gratitude-1',
        label: 'Gratitude',
        emoji: '🙏',
        description: 'I am grateful for the support and guidance I received',
        color: 'from-blue-400 to-cyan-500',
        bgColor: 'from-blue-50 to-cyan-50',
        borderColor: 'border-blue-300',
        insight: 'Gratitude for mentorship strengthens relationships and creates appreciation for those who helped you grow.'
      },
      {
        id: 'support-1',
        label: 'Support',
        emoji: '🤝',
        description: 'I realized the importance of having a support system',
        color: 'from-purple-400 to-indigo-500',
        bgColor: 'from-purple-50 to-indigo-50',
        borderColor: 'border-purple-300',
        insight: 'Having a support system during difficult times is crucial for growth and resilience.'
      },
      {
        id: 'perspective-1',
        label: 'Perspective',
        emoji: '👁️',
        description: 'I gained a new perspective from this experience',
        color: 'from-green-400 to-emerald-500',
        bgColor: 'from-green-50 to-emerald-50',
        borderColor: 'border-green-300',
        insight: 'Different perspectives help us understand situations more deeply and grow as individuals.'
      }
    ],
    2: [
      {
        id: 'growth-2',
        label: 'Growth',
        emoji: '🌱',
        description: 'This mentorship experience led to significant personal growth',
        color: 'from-green-400 to-emerald-500',
        bgColor: 'from-green-50 to-emerald-50',
        borderColor: 'border-green-300',
        insight: 'Mentorship catalyzes personal and professional growth by providing guidance and challenges.'
      },
      {
        id: 'skills-2',
        label: 'Skills',
        emoji: '🛠️',
        description: 'I developed important skills through mentorship',
        color: 'from-blue-400 to-cyan-500',
        bgColor: 'from-blue-50 to-cyan-50',
        borderColor: 'border-blue-300',
        insight: 'Mentors help us develop skills we might not acquire on our own through experience and guidance.'
      },
      {
        id: 'confidence-2',
        label: 'Confidence',
        emoji: '💪',
        description: 'Mentorship boosted my confidence in my abilities',
        color: 'from-purple-400 to-indigo-500',
        bgColor: 'from-purple-50 to-indigo-50',
        borderColor: 'border-purple-300',
        insight: 'A good mentor believes in us and helps us believe in ourselves.'
      }
    ],
    3: [
      {
        id: 'belief-3',
        label: 'Belief',
        emoji: '✨',
        description: 'Someone believing in me made all the difference',
        color: 'from-yellow-400 to-amber-500',
        bgColor: 'from-yellow-50 to-amber-50',
        borderColor: 'border-yellow-300',
        insight: 'When someone believes in us, it gives us the strength to overcome self-doubt and achieve more.'
      },
      {
        id: 'trust-3',
        label: 'Trust',
        emoji: '🤝',
        description: 'Building trust with my mentor was key to growth',
        color: 'from-blue-400 to-cyan-500',
        bgColor: 'from-blue-50 to-cyan-50',
        borderColor: 'border-blue-300',
        insight: 'Trust is the foundation of effective mentorship and personal development.'
      },
      {
        id: 'resilience-3',
        label: 'Resilience',
        emoji: '🛡️',
        description: 'My mentor helped me develop resilience',
        color: 'from-green-400 to-emerald-500',
        bgColor: 'from-green-50 to-emerald-50',
        borderColor: 'border-green-300',
        insight: 'Mentors teach us how to bounce back from setbacks and challenges.'
      }
    ],
    4: [
      {
        id: 'guidance-4',
        label: 'Guidance',
        emoji: '🧭',
        description: 'I received valuable guidance during a confusing time',
        color: 'from-indigo-400 to-purple-500',
        bgColor: 'from-indigo-50 to-purple-50',
        borderColor: 'border-indigo-300',
        insight: 'Good guidance helps us navigate complex situations and make better decisions.'
      },
      {
        id: 'clarity-4',
        label: 'Clarity',
        emoji: '👁️',
        description: 'My mentor helped me gain clarity about my path',
        color: 'from-blue-400 to-cyan-500',
        bgColor: 'from-blue-50 to-cyan-50',
        borderColor: 'border-blue-300',
        insight: 'Mentors often help us see our path more clearly when we are confused.'
      },
      {
        id: 'connection-4',
        label: 'Connection',
        emoji: '❤️',
        description: 'The connection with my mentor was meaningful',
        color: 'from-pink-400 to-rose-500',
        bgColor: 'from-pink-50 to-rose-50',
        borderColor: 'border-pink-300',
        insight: 'Meaningful connections with mentors provide emotional support and guidance.'
      }
    ],
    5: [
      {
        id: 'wisdom-5',
        label: 'Wisdom',
        emoji: '🦉',
        description: 'I received wisdom that transformed my approach',
        color: 'from-amber-400 to-yellow-500',
        bgColor: 'from-amber-50 to-yellow-50',
        borderColor: 'border-amber-300',
        insight: 'Wisdom from experienced mentors can shift our perspective and approach fundamentally.'
      },
      {
        id: 'inspiration-5',
        label: 'Inspiration',
        emoji: '🌟',
        description: 'My mentor inspired me to reach higher',
        color: 'from-purple-400 to-indigo-500',
        bgColor: 'from-purple-50 to-indigo-50',
        borderColor: 'border-purple-300',
        insight: 'Inspiring mentors motivate us to exceed our own expectations.'
      },
      {
        id: 'legacy-5',
        label: 'Legacy',
        emoji: '🌱',
        description: 'I want to pass on this wisdom to others',
        color: 'from-green-400 to-emerald-500',
        bgColor: 'from-green-50 to-emerald-50',
        borderColor: 'border-green-300',
        insight: 'The best mentorship creates a legacy of wisdom passed from one person to another.'
      }
    ]
  };

  const handleStoryChange = (value) => {
    setStories(prev => ({
      ...prev,
      [currentEntry]: value
    }));
  };

  const handleTakeawaySelect = (takeawayId) => {
    setSelectedTakeaways(prev => ({
      ...prev,
      [currentEntry]: takeawayId
    }));
  };

  const handleComplete = () => {
    const currentStory = stories[currentEntry]?.trim();
    const currentTakeaway = selectedTakeaways[currentEntry];

    if (!currentStory) {
      alert("Please write your mentor memory story first.");
      return;
    }

    if (!currentTakeaway) {
      alert("Please choose a takeaway from your story.");
      return;
    }

    // Mark current entry as completed
    if (!completedEntries.includes(currentEntry)) {
      setCompletedEntries(prev => [...prev, currentEntry]);
    }

    // Check if all entries are completed
    if (completedEntries.length + 1 >= totalLevels) {
      setScore(totalLevels);
      setShowGameOver(true);
    } else {
      // Move to next entry
      setCurrentEntry(prev => Math.min(prev + 1, totalLevels));
    }
  };

  const currentTakeaway = selectedTakeaways[currentEntry];
  const currentTakeawayData = currentTakeaway ? takeaways[currentEntry]?.find(t => t.id === currentTakeaway) : null;
  const currentStory = stories[currentEntry] || "";
  const storyLength = currentStory.trim().length;

  return (
    <TeacherGameShell
      title={gameData?.title || "Mentor Memory Journal"}
      subtitle={gameData?.description || "Recall moments of being mentored or mentoring others"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentEntry}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">📖</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Mentor Memory Journal
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Recall moments of being mentored or mentoring others. Reflect on the support, guidance, and wisdom shared.
              </p>
            </div>

            {/* Entry Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Entry {currentEntry} of {totalLevels}</span>
                <span>{completedEntries.length} / {totalLevels} completed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedEntries.length / totalLevels) * 100}%` }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                />
              </div>
            </div>

            {/* Guided Prompt */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border-2 border-indigo-200 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Entry {currentEntry} Prompt</h3>
                  <p className="text-sm text-gray-600">Reflect on this question</p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 border-2 border-indigo-200">
                <p className="text-2xl font-semibold text-gray-800 text-center italic leading-relaxed">
                  "{currentPrompt}"
                </p>
              </div>
            </div>

            {/* Story Writing Area */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Your Mentor Memory Story</h3>
                {currentStory.trim() && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>

              <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-200 mb-4">
                <p className="text-sm text-amber-800 mb-2">
                  <strong>Write your story:</strong> Recall a specific moment when someone mentored you, or when you mentored someone else. Include details about what happened, how you felt, and what you learned.
                </p>
                <p className="text-xs text-amber-700 italic">
                  Examples: "When I first started teaching, my mentor teacher supported me...", "A colleague guided me through a difficult situation...", "I mentored a new teacher and we both grew..."
                </p>
              </div>

              <textarea
                value={currentStory}
                onChange={(e) => handleStoryChange(e.target.value)}
                placeholder="Write your mentor memory story here... Think about who supported you, what they did, how it helped, and what you learned..."
                rows={10}
                className="w-full p-4 rounded-lg border-2 border-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-gray-800"
              />

              {storyLength > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm text-gray-600 flex items-center gap-1"
                >
                  <TrendingUp className="w-4 h-4" />
                  {storyLength} characters
                </motion.div>
              )}
            </div>

            {/* Takeaway Selection */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-purple-600" />
                What is your takeaway from this story?
              </h3>
              <p className="text-gray-600 mb-6">
                Choose the main lesson or insight from your mentor memory:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(takeaways[currentEntry] || []).map((takeaway) => (
                  <motion.button
                    key={takeaway.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTakeawaySelect(takeaway.id)}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${currentTakeaway === takeaway.id
                        ? `${takeaway.borderColor} bg-gradient-to-br ${takeaway.bgColor} shadow-lg`
                        : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-md'
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-4xl">{takeaway.emoji}</div>
                      <div className="flex-1">
                        <h4 className={`font-bold text-lg mb-1 ${currentTakeaway === takeaway.id ? 'text-gray-800' : 'text-gray-700'
                          }`}>
                          {takeaway.label}
                        </h4>
                      </div>
                      {currentTakeaway === takeaway.id && (
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className={`text-sm leading-relaxed ${currentTakeaway === takeaway.id ? 'text-gray-800' : 'text-gray-600'
                      }`}>
                      {takeaway.description}
                    </p>
                  </motion.button>
                ))}
              </div>

              {currentTakeaway && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 bg-gradient-to-br ${currentTakeawayData.bgColor} rounded-lg p-5 border-2 ${currentTakeawayData.borderColor}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{currentTakeawayData.emoji}</div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Your Takeaway:</h4>
                      <p className="text-gray-800 leading-relaxed">
                        {currentTakeawayData.insight}
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
                disabled={!currentStory.trim() || !currentTakeaway}
                className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all flex items-center gap-3 mx-auto ${currentStory.trim() && currentTakeaway
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                <BookOpen className="w-5 h-5" />
                {currentEntry < totalLevels ? `Complete Entry ${currentEntry} & Continue` : 'Complete Journal'}
              </motion.button>

              {(!currentStory.trim() || !currentTakeaway) && (
                <p className="text-sm text-gray-600 mt-3">
                  Please write your story and choose a takeaway to complete.
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
                📖✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Mentor Memory Journal Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You've reflected on a meaningful mentoring moment
              </p>
            </div>

            {/* Stories Display */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-8 border-2 border-indigo-200 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-8 h-8 text-indigo-600" />
                <h3 className="text-2xl font-bold text-gray-800">Your Mentor Memory Stories</h3>
              </div>

              {Array.from({ length: totalLevels }, (_, i) => i + 1).map(entryNum => (
                <div key={entryNum} className="mb-8 last:mb-0">
                  <div className="bg-white rounded-lg p-6 border-2 border-indigo-200 mb-6">
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Entry {entryNum} Prompt:</p>
                      <p className="text-lg text-gray-800 italic">"{entryPrompts[entryNum]}"</p>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Your Story:</p>
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {stories[entryNum]}
                      </p>
                    </div>
                  </div>

                  {selectedTakeaways[entryNum] && (
                    (() => {
                      const takeaway = selectedTakeaways[entryNum];
                      const takeawayData = takeaways[entryNum]?.find(t => t.id === takeaway);
                      return (
                        <div className={`bg-gradient-to-br ${takeawayData.bgColor} rounded-lg p-6 border-2 ${takeawayData.borderColor}`}>
                          <div className="flex items-start gap-4">
                            <div className="text-4xl">{takeawayData.emoji}</div>
                            <div className="flex-1">
                              <h4 className="text-xl font-bold text-gray-800 mb-2">Your Takeaway: {takeawayData.label}</h4>
                              <p className="text-gray-800 leading-relaxed mb-3">
                                {takeawayData.description}
                              </p>
                              <div className="bg-white/60 rounded-lg p-4 border border-gray-200">
                                <p className="text-gray-800 leading-relaxed">
                                  {takeawayData.insight}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  )}
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                The Power of Mentor Memories
              </h3>
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Strengthens gratitude:</strong> Recalling mentor memories creates appreciation for those who supported you</li>
                <li>• <strong>Builds connections:</strong> Remembering mentorship strengthens relationships with mentors and mentees</li>
                <li>• <strong>Inspires leadership:</strong> Reflecting on mentorship shows you how to guide and support others</li>
                <li>• <strong>Creates culture:</strong> Sharing mentor memories creates a culture of support and guidance</li>
                <li>• <strong>Reduces isolation:</strong> Remembering support reminds you that you're not alone and have resources</li>
                <li>• <strong>Encourages mentoring:</strong> Reflecting on mentorship inspires you to mentor others</li>
                <li>• <strong>Builds resilience:</strong> Remembering past support builds confidence for future challenges</li>
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
                    <strong>Encourage sharing one mentor story per staff meeting.</strong> Creating space for mentor memories builds connections and strengthens culture:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Dedicate time:</strong> Set aside 5-10 minutes at the start or end of staff meetings for one teacher to share a mentor memory. This makes it a regular practice.</li>
                    <li><strong>Rotate speakers:</strong> Different teachers share each week, ensuring everyone has the opportunity to reflect and share. This creates shared experience.</li>
                    <li><strong>Keep it brief:</strong> Stories should be 2-3 minutes - enough to share meaningfully without taking too much time. Brief sharing makes it sustainable.</li>
                    <li><strong>Create safety:</strong> Make it clear this is about celebrating support and learning, not competition. This creates psychological safety for sharing.</li>
                    <li><strong>Include both:</strong> Encourage sharing stories of being mentored OR mentoring others. Both perspectives are valuable and inspiring.</li>
                    <li><strong>Connect to values:</strong> Link mentor stories to school values - collaboration, support, growth. This reinforces what matters.</li>
                    <li><strong>Celebrate mentors:</strong> Acknowledge current and past mentors in the stories. This honors those who guide and support others.</li>
                    <li><strong>Inspire mentoring:</strong> Use stories to inspire more teachers to become mentors. When people hear about positive mentorship, they want to participate.</li>
                    <li><strong>Build culture:</strong> Regular sharing of mentor memories creates a culture where mentorship is valued and celebrated. This strengthens the school community.</li>
                    <li><strong>Make it voluntary:</strong> While encouraged, sharing should be voluntary. This ensures authenticity and comfort for everyone.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you encourage sharing one mentor story per staff meeting, you're creating regular opportunities to celebrate support, build connections, honor mentors, and inspire more mentoring. This practice strengthens school culture, reduces isolation, builds relationships, and creates a community where everyone feels supported and valued. Regular sharing of mentor memories transforms occasional moments into sustained culture.
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

export default MentorMemoryJournal;