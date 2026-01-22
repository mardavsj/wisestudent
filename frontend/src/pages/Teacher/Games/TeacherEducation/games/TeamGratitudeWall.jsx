import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Heart, MessageCircle, Users, CheckCircle, BookOpen, Sparkles, Send } from "lucide-react";

const TeamGratitudeWall = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-74";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [gratitudeNotes, setGratitudeNotes] = useState({
    note1: {
      to: "",
      message: ""
    },
    note2: {
      to: "",
      message: ""
    },
    note3: {
      to: "",
      message: ""
    },
    note4: {
      to: "",
      message: ""
    },
    note5: {
      to: "",
      message: ""
    }
  });
  const [postedNotes, setPostedNotes] = useState([]);
  const [showWall, setShowWall] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  const handleNoteChange = (noteIndex, field, value) => {
    setGratitudeNotes(prev => ({
      ...prev,
      [noteIndex]: {
        ...prev[noteIndex],
        [field]: value
      }
    }));
  };

  const handlePostNotes = () => {
    const notes = [];
    let completedCount = 0;

    // Process note 1
    if (gratitudeNotes.note1.to.trim() && gratitudeNotes.note1.message.trim()) {
      notes.push({
        id: 1,
        to: gratitudeNotes.note1.to.trim(),
        message: gratitudeNotes.note1.message.trim(),
        postedAt: new Date().toISOString(),
        emoji: '💙'
      });
      completedCount++;
    }

    // Process note 2
    if (gratitudeNotes.note2.to.trim() && gratitudeNotes.note2.message.trim()) {
      notes.push({
        id: 2,
        to: gratitudeNotes.note2.to.trim(),
        message: gratitudeNotes.note2.message.trim(),
        postedAt: new Date().toISOString(),
        emoji: '💚'
      });
      completedCount++;
    }

    // Process note 3
    if (gratitudeNotes.note3.to.trim() && gratitudeNotes.note3.message.trim()) {
      notes.push({
        id: 3,
        to: gratitudeNotes.note3.to.trim(),
        message: gratitudeNotes.note3.message.trim(),
        postedAt: new Date().toISOString(),
        emoji: '💛'
      });
      completedCount++;
    }

    // Process note 4
    if (gratitudeNotes.note4.to.trim() && gratitudeNotes.note4.message.trim()) {
      notes.push({
        id: 4,
        to: gratitudeNotes.note4.to.trim(),
        message: gratitudeNotes.note4.message.trim(),
        postedAt: new Date().toISOString(),
        emoji: '💜'
      });
      completedCount++;
    }

    // Process note 5
    if (gratitudeNotes.note5.to.trim() && gratitudeNotes.note5.message.trim()) {
      notes.push({
        id: 5,
        to: gratitudeNotes.note5.to.trim(),
        message: gratitudeNotes.note5.message.trim(),
        postedAt: new Date().toISOString(),
        emoji: '🧡'
      });
      completedCount++;
    }

    if (notes.length === 0) {
      alert("Please write at least one gratitude note before posting.");
      return;
    }

    setPostedNotes(notes);
    setScore(completedCount);
    setShowWall(true);

    // Show game over after a short delay
    setTimeout(() => {
      setShowGameOver(true);
    }, 2000);
  };

  const completedNotesCount =
    (gratitudeNotes.note1.to.trim() && gratitudeNotes.note1.message.trim() ? 1 : 0) +
    (gratitudeNotes.note2.to.trim() && gratitudeNotes.note2.message.trim() ? 1 : 0) +
    (gratitudeNotes.note3.to.trim() && gratitudeNotes.note3.message.trim() ? 1 : 0) +
    (gratitudeNotes.note4.to.trim() && gratitudeNotes.note4.message.trim() ? 1 : 0) +
    (gratitudeNotes.note5.to.trim() && gratitudeNotes.note5.message.trim() ? 1 : 0);

  return (
    <TeacherGameShell
      title={gameData?.title || "Team Gratitude Wall"}
      subtitle={gameData?.description || "Strengthen group morale through appreciation messages"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={0}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showWall && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">💙</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Team Gratitude Wall
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Write gratitude notes to your colleagues to strengthen group morale and build appreciation.
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-pink-200 mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-600" />
                How it Works:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <span><strong>Write 5 gratitude notes</strong> to colleagues who have supported you, helped you, or inspired you</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <span><strong>Notes are posted anonymously</strong> on the digital gratitude wall</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <span><strong>Appreciation messages</strong> strengthen group morale and build a culture of gratitude</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                  <span><strong>Complete all 5 notes</strong> or post with what you have - every appreciation matters!</span>
                </li>
              </ul>
            </div>

            {/* Progress Indicator */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Notes Progress</h3>
                  <p className="text-gray-600">{completedNotesCount} of 5 notes completed</p>
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {completedNotesCount} / 5
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedNotesCount / 5) * 100}%` }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full"
                />
              </div>
            </div>

            {/* Gratitude Note 1 */}
            <div className="mb-6">
              <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 rounded-xl p-6 border-2 border-pink-200 mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Gratitude Note 1</h3>
                  {gratitudeNotes.note1.to.trim() && gratitudeNotes.note1.message.trim() && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      To: (Colleague's name or role - e.g., "My teaching partner", "The math department", "Sarah")
                    </label>
                    <input
                      type="text"
                      value={gratitudeNotes.note1.to}
                      onChange={(e) => handleNoteChange('note1', 'to', e.target.value)}
                      placeholder="e.g., My teaching partner, Sarah, The math department..."
                      className="w-full p-4 rounded-lg border-2 border-pink-300 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message: (What you appreciate about them)
                    </label>
                    <textarea
                      value={gratitudeNotes.note1.message}
                      onChange={(e) => handleNoteChange('note1', 'message', e.target.value)}
                      placeholder="e.g., Thank you for always being willing to help with lesson planning. Your creativity inspires me, and I'm grateful for your support..."
                      rows={5}
                      className="w-full p-4 rounded-lg border-2 border-pink-300 focus:ring-2 focus:ring-pink-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Gratitude Note 2 */}
            <div className="mb-6">
              <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200 mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Gratitude Note 2</h3>
                  {gratitudeNotes.note2.to.trim() && gratitudeNotes.note2.message.trim() && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      To: (Colleague's name or role)
                    </label>
                    <input
                      type="text"
                      value={gratitudeNotes.note2.to}
                      onChange={(e) => handleNoteChange('note2', 'to', e.target.value)}
                      placeholder="e.g., The admin team, John, My mentor..."
                      className="w-full p-4 rounded-lg border-2 border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message: (What you appreciate about them)
                    </label>
                    <textarea
                      value={gratitudeNotes.note2.message}
                      onChange={(e) => handleNoteChange('note2', 'message', e.target.value)}
                      placeholder="e.g., I'm grateful for your patience when I had questions about the new curriculum. You always make time to help, and it means so much..."
                      rows={5}
                      className="w-full p-4 rounded-lg border-2 border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Gratitude Note 3 */}
            <div className="mb-6">
              <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200 mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Gratitude Note 3</h3>
                  {gratitudeNotes.note3.to.trim() && gratitudeNotes.note3.message.trim() && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      To: (Colleague's name or role)
                    </label>
                    <input
                      type="text"
                      value={gratitudeNotes.note3.to}
                      onChange={(e) => handleNoteChange('note3', 'to', e.target.value)}
                      placeholder="e.g., The science department, Maria, My principal..."
                      className="w-full p-4 rounded-lg border-2 border-yellow-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message: (What you appreciate about them)
                    </label>
                    <textarea
                      value={gratitudeNotes.note3.message}
                      onChange={(e) => handleNoteChange('note3', 'message', e.target.value)}
                      placeholder="e.g., Your leadership and guidance have made a real difference. Thank you for always supporting our professional growth and creating a positive learning environment..."
                      rows={5}
                      className="w-full p-4 rounded-lg border-2 border-yellow-300 focus:ring-2 focus:ring-yellow-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Gratitude Note 4 */}
            <div className="mb-6">
              <div className="bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200 mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">4</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Gratitude Note 4</h3>
                  {gratitudeNotes.note4.to.trim() && gratitudeNotes.note4.message.trim() && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      To: (Colleague's name or role)
                    </label>
                    <input
                      type="text"
                      value={gratitudeNotes.note4.to}
                      onChange={(e) => handleNoteChange('note4', 'to', e.target.value)}
                      placeholder="e.g., The counseling team, James, My grade-level partner..."
                      className="w-full p-4 rounded-lg border-2 border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message: (What you appreciate about them)
                    </label>
                    <textarea
                      value={gratitudeNotes.note4.message}
                      onChange={(e) => handleNoteChange('note4', 'message', e.target.value)}
                      placeholder="e.g., I appreciate how you've been there for students during difficult times. Your dedication to their wellbeing and success doesn't go unnoticed. Thank you for your compassion and hard work..."
                      rows={5}
                      className="w-full p-4 rounded-lg border-2 border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Gratitude Note 5 */}
            <div className="mb-6">
              <div className="bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 rounded-xl p-6 border-2 border-red-200 mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">5</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Gratitude Note 5</h3>
                  {gratitudeNotes.note5.to.trim() && gratitudeNotes.note5.message.trim() && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      To: (Colleague's name or role)
                    </label>
                    <input
                      type="text"
                      value={gratitudeNotes.note5.to}
                      onChange={(e) => handleNoteChange('note5', 'to', e.target.value)}
                      placeholder="e.g., The custodial staff, Lisa, Our school nurse..."
                      className="w-full p-4 rounded-lg border-2 border-red-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message: (What you appreciate about them)
                    </label>
                    <textarea
                      value={gratitudeNotes.note5.message}
                      onChange={(e) => handleNoteChange('note5', 'message', e.target.value)}
                      placeholder="e.g., Your behind-the-scenes work keeps our school running smoothly. Thank you for everything you do to support our teaching and learning environment. Your contributions are truly valued and make a difference in our students' lives..."
                      rows={5}
                      className="w-full p-4 rounded-lg border-2 border-red-300 focus:ring-2 focus:ring-red-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Post Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePostNotes}
                disabled={completedNotesCount === 0}
                className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all flex items-center gap-3 mx-auto ${completedNotesCount > 0
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                <Send className="w-5 h-5" />
                Post to Gratitude Wall ({completedNotesCount}/5)
              </motion.button>

              {completedNotesCount > 0 && completedNotesCount < 5 && (
                <p className="text-sm text-gray-600 mt-3">
                  You can post now with {completedNotesCount} note(s) or complete all 5 first.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Gratitude Wall Display */}
        {showWall && postedNotes.length > 0 && (
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
                💙✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Team Gratitude Wall
              </h2>
              <p className="text-xl text-gray-600">
                Your gratitude notes have been posted anonymously
              </p>
            </div>

            {/* Wall Display */}
            <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-xl p-8 border-2 border-pink-200 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {postedNotes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white rounded-xl p-6 shadow-lg border-2 border-pink-200 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{note.emoji}</div>
                      <div className="flex-1">
                        <div className="mb-2">
                          <span className="text-sm font-semibold text-gray-600">To:</span>
                          <span className="ml-2 text-lg font-bold text-gray-800">{note.to}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-3">
                          {note.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Heart className="w-3 h-3" />
                          <span>Posted anonymously</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Impact Message */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-green-900 mb-3 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Your Gratitude Makes a Difference
                </h3>
                <p className="text-green-800 leading-relaxed">
                  Your appreciation messages strengthen group morale, build connections, and create a culture of gratitude.
                  When colleagues receive appreciation, they feel valued and supported, which strengthens the entire team.
                  Every note of gratitude contributes to a positive work environment where everyone feels appreciated.
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                How Gratitude Strengthens Teams
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Boosts morale:</strong> Regular appreciation messages create a positive work environment where people feel valued</li>
                <li>• <strong>Builds connections:</strong> Gratitude creates bonds between colleagues and strengthens professional relationships</li>
                <li>• <strong>Reduces isolation:</strong> When people feel appreciated, they feel more connected to the team</li>
                <li>• <strong>Increases motivation:</strong> Feeling valued and appreciated increases motivation and job satisfaction</li>
                <li>• <strong>Creates culture:</strong> Regular gratitude practices create a culture of appreciation and mutual support</li>
                <li>• <strong>Improves collaboration:</strong> When people feel appreciated, they're more likely to collaborate and support each other</li>
                <li>• <strong>Reduces burnout:</strong> Feeling valued and connected reduces feelings of burnout and increases resilience</li>
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
                    <strong>Set a real gratitude wall for end-of-month morale boosts.</strong> Creating a physical gratitude wall in your school transforms appreciation from a digital exercise into a visible, shared practice:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Choose a visible location:</strong> Place the gratitude wall in a high-traffic area like the staffroom, near the main office, or in a common hallway where teachers will see it daily.</li>
                    <li><strong>Design for interaction:</strong> Use colorful paper, sticky notes, or cards that teachers can easily write on and post. Make it inviting and easy to use.</li>
                    <li><strong>Make it anonymous or named:</strong> Decide whether notes should be anonymous (encourages more participation) or signed (creates personal connection). Some schools do both - anonymous notes in one area, signed in another.</li>
                    <li><strong>Set regular times:</strong> End-of-month is perfect for a gratitude boost, but consider weekly or bi-weekly practices too. Regular appreciation is more effective than occasional bursts.</li>
                    <li><strong>Encourage participation:</strong> Start meetings by acknowledging gratitude notes posted, or have a ritual where teachers read notes at the end of the month. This normalizes the practice.</li>
                    <li><strong>Celebrate milestones:</strong> When the wall fills up, celebrate it! Take photos, share highlights, and acknowledge the collective appreciation. This reinforces the practice.</li>
                    <li><strong>Keep it positive:</strong> Focus exclusively on appreciation and gratitude. This is not a place for complaints or critiques - keep it uplifting.</li>
                    <li><strong>Make it inclusive:</strong> Encourage gratitude for all staff - teachers, administrators, support staff, maintenance, etc. Everyone contributes to the school community.</li>
                    <li><strong>Update regularly:</strong> Clear or archive old notes periodically to keep the wall fresh and encourage new participation. Maybe save some favorite notes or take photos.</li>
                    <li><strong>Combine with digital:</strong> Consider also having a digital version (like email or a shared document) for teachers who prefer that, or to complement the physical wall.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you set a real gratitude wall for end-of-month morale boosts, you're creating a tangible practice of appreciation that everyone can see and participate in. This physical representation of gratitude strengthens group morale, builds connections, creates positive culture, and reminds everyone that they're valued. The wall becomes a symbol of your school's commitment to appreciating each other, and regular gratitude practices significantly improve workplace morale and satisfaction.
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

export default TeamGratitudeWall;