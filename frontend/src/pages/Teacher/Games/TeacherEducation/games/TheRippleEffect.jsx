import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { BookOpen, Heart, Award, Users, CheckCircle, TrendingUp, Sparkles, Target, Play, Pause } from "lucide-react";

const TheRippleEffect = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-82";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reflection, setReflection] = useState("");
  const [showGameOver, setShowGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Story animation steps (5 steps for scoring)
  const storySteps = [
    {
      id: 1,
      title: "The Struggling Student",
      emoji: "😟",
      text: "Sarah was a quiet student in middle school who struggled with math. She felt invisible, overwhelmed, and ready to give up. Her confidence was shattered, and she couldn't see a way forward.",
      color: "from-gray-400 to-slate-500",
      bgColor: "from-gray-50 to-slate-50",
      borderColor: "border-gray-300"
    },
    {
      id: 2,
      title: "The Teacher's Intervention",
      emoji: "👁️",
      text: "Ms. Johnson noticed Sarah's struggle and took action. She saw beyond the test scores to recognize a student who needed support, encouragement, and belief in her potential.",
      color: "from-blue-400 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-300"
    },
    {
      id: 3,
      title: "Building Confidence",
      emoji: "💙",
      text: "Through consistent support, personalized attention, and celebrating small victories, Ms. Johnson helped Sarah rebuild her confidence and develop a growth mindset about learning.",
      color: "from-indigo-400 to-purple-500",
      bgColor: "from-indigo-50 to-purple-50",
      borderColor: "border-indigo-300"
    },
    {
      id: 4,
      title: "Creating Positive Change",
      emoji: "✨",
      text: "Sarah's transformation inspired others. She began helping fellow students, demonstrating that with the right support, anyone can overcome academic challenges and discover their potential.",
      color: "from-yellow-400 to-amber-500",
      bgColor: "from-yellow-50 to-amber-50",
      borderColor: "border-yellow-300"
    },
    {
      id: 5,
      title: "The Lasting Impact",
      emoji: "🌊",
      text: "Years later, Sarah became an educator herself, carrying forward the lessons learned. Her journey demonstrates how one teacher's investment creates ripples that touch countless lives across generations.",
      color: "from-cyan-400 to-blue-500",
      bgColor: "from-cyan-50 to-blue-50",
      borderColor: "border-cyan-300"
    }
  ];

  const handlePlayStory = () => {
    setIsPlaying(true);
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    if (currentStep < storySteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Completed all 5 steps - show completion
      setIsPlaying(false);
      setCurrentStep(storySteps.length - 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (!reflection.trim()) {
      alert("Please write your reflection about the ripple you're creating first.");
      return;
    }

    // Score based on steps completed (1 point per step)
    const stepsCompleted = currentStep + 1;
    setScore(stepsCompleted);
    setShowGameOver(true);
  };

  const reflectionLength = reflection.trim().length;
  const currentStoryStep = storySteps[currentStep];

  return (
    <TeacherGameShell
      title={gameData?.title || "The Ripple Effect"}
      subtitle={gameData?.description || "Realize the long-term impact teachers have on students' lives"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={0}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🌊</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                The Ripple Effect
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Realize the long-term impact teachers have on students' lives through a story of transformation
              </p>
            </div>

            {/* Story Animation */}
            {!isPlaying && currentStep === 0 && (
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-8 border-2 border-blue-200 mb-8 text-center">
                <div className="text-6xl mb-4">📖</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Watch the Story
                </h3>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">
                  Discover how a teacher's simple act of noticing and believing in a struggling student created ripples that transformed not just one life, but countless others across generations. Complete all 5 steps to earn healcoins!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlayStory}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                >
                  <Play className="w-5 h-5" />
                  Watch the Story
                </motion.button>
              </div>
            )}

            {/* Story Steps */}
            {isPlaying && (
              <div className="mb-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className={`bg-gradient-to-br ${currentStoryStep.bgColor} rounded-xl p-8 border-2 ${currentStoryStep.borderColor}`}
                  >
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-4">{currentStoryStep.emoji}</div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">
                        {currentStoryStep.title}
                      </h3>
                      <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
                        {currentStoryStep.text}
                      </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Step {currentStep + 1} of {storySteps.length}</span>
                        <span>{Math.round(((currentStep + 1) / storySteps.length) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${((currentStep + 1) / storySteps.length) * 100}%` }}
                          className={`bg-gradient-to-r ${currentStoryStep.color} h-2 rounded-full`}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1 text-center">
                        Score: {currentStep + 1} point{currentStep > 0 ? 's' : ''} earned
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePreviousStep}
                        disabled={currentStep === 0}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${currentStep === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-500 text-white hover:bg-gray-600'
                          }`}
                      >
                        ← Previous
                      </motion.button>

                      {currentStep < storySteps.length - 1 ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleNextStep}
                          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                          Next →
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setIsPlaying(false);
                            setCurrentStep(storySteps.length - 1);
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                        >
                          <Award className="w-5 h-5" />
                          Earn Healcoins!
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {/* Reflection Section */}
            {(!isPlaying || currentStep === storySteps.length - 1) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border-2 border-indigo-200 mb-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Reflection Prompt</h3>
                    <p className="text-sm text-gray-600">Think about your impact</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border-2 border-indigo-200 mb-4">
                  <p className="text-2xl font-semibold text-gray-800 text-center italic leading-relaxed mb-4">
                    "What ripple am I creating today?"
                  </p>
                  <p className="text-gray-600 text-center text-sm">
                    Reflect on how your actions, words, and support are creating ripples that will impact students' lives long after they leave your classroom.
                  </p>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-200 mb-4">
                  <p className="text-sm text-amber-800 mb-2">
                    <strong>Write your reflection:</strong> Consider what ripples you're creating through your teaching. How are you noticing students, believing in them, supporting them? What impact might your actions have on their future?
                  </p>
                  <p className="text-xs text-amber-700 italic">
                    Examples: "I'm creating ripples by...", "When I believe in a struggling student...", "My support today might..."
                  </p>
                </div>

                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Write your reflection about the ripple you're creating today... Think about how your actions, words, and support impact students' lives..."
                  rows={8}
                  className="w-full p-4 rounded-lg border-2 border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-gray-800"
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

                {reflection.trim() && (
                  <div className="text-center mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleComplete}
                      className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Complete Reflection
                    </motion.button>
                  </div>
                )}
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
                🌊✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Reflection Complete!
              </h2>
              <p className="text-xl text-gray-600 mb-2">
                You've reflected on the ripple you're creating
              </p>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full border-2 border-green-300">
                <Award className="w-5 h-5 text-green-600" />
                <span className="font-bold text-green-800">Earned {score} Healcoin{score !== 1 ? 's' : ''}!</span>
              </div>
            </div>

            {/* Reflection Display */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-8 border-2 border-indigo-200 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-8 h-8 text-indigo-600" />
                <h3 className="text-2xl font-bold text-gray-800">Your Reflection</h3>
              </div>

              <div className="bg-white rounded-lg p-6 border-2 border-indigo-200 mb-6">
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Prompt:</p>
                  <p className="text-lg text-gray-800 italic">"What ripple am I creating today?"</p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Your Reflection:</p>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {reflection}
                  </p>
                </div>
              </div>
            </div>

            {/* The Power of Ripples */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                The Power of the Ripple Effect
              </h3>
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Long-term impact:</strong> Your actions today create ripples that extend far into students' futures, often beyond what you can see</li>
                <li>• <strong>Simple acts matter:</strong> Small gestures—noticing, believing, encouraging—can transform lives</li>
                <li>• <strong>Ripples multiply:</strong> When you support one student, they may go on to support others, multiplying your impact</li>
                <li>• <strong>Beyond the classroom:</strong> Your influence reaches beyond academics—it shapes character, confidence, and life paths</li>
                <li>• <strong>Generational impact:</strong> Your support may influence how students raise their own children, creating multi-generational ripples</li>
                <li>• <strong>Invisible influence:</strong> You may never know the full impact of your support, but that doesn't mean it doesn't exist</li>
                <li>• <strong>Daily opportunities:</strong> Every day offers new chances to create positive ripples through your teaching</li>
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
                    <strong>Share real success stories during monthly staff circles.</strong> Creating regular opportunities to share the ripples teachers create strengthens community and celebrates impact:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Dedicate time:</strong> Set aside 10-15 minutes during monthly staff meetings for teachers to share success stories. Regular sharing normalizes celebration and recognition.</li>
                    <li><strong>Rotate speakers:</strong> Different teachers share each month, ensuring everyone has opportunities to celebrate and be celebrated. This creates shared experience.</li>
                    <li><strong>Encourage variety:</strong> Share different types of success stories—academic breakthroughs, confidence building, character development, future paths. All successes matter.</li>
                    <li><strong>Create safety:</strong> Make it clear this is about celebrating impact, not competition. Create a positive, supportive environment for sharing.</li>
                    <li><strong>Include long-term stories:</strong> Welcome stories about former students who've returned to share their success. These stories show the lasting impact of teaching.</li>
                    <li><strong>Honor the small:</strong> Celebrate both major breakthroughs and small moments—noticing a struggling student, a word of encouragement, a simple act of support. Small acts create big ripples.</li>
                    <li><strong>Build culture:</strong> Regular sharing of success stories creates a culture where impact is recognized and celebrated. This strengthens the entire teaching community.</li>
                    <li><strong>Inspire others:</strong> When teachers hear success stories, they're inspired to create their own ripples. Stories motivate and encourage continued impact.</li>
                    <li><strong>Document stories:</strong> Consider documenting success stories (with permission) to create a collection that can inspire future teachers and remind everyone of the profession's impact.</li>
                    <li><strong>Make it voluntary:</strong> While encouraged, sharing should be voluntary. This ensures authenticity and comfort for everyone.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you share real success stories during monthly staff circles, you're creating regular opportunities to celebrate the ripples teachers create, strengthen community spirit, inspire continued impact, and remind everyone of the profound and lasting difference they make in students' lives. Regular sharing transforms individual successes into collective celebration and motivation.
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

export default TheRippleEffect;