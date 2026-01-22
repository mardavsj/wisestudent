import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Users, Heart, CheckCircle, MessageCircle, TrendingUp, BookOpen, Sparkles } from "lucide-react";

const TheSupportCircle = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-71";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentStep, setCurrentStep] = useState(0); // 0: intro, 1: story part 1, 2: story part 2, 3: reflection, 4: summary
  const [selectedReflections, setSelectedReflections] = useState({});
  const [showReflectionFeedback, setShowReflectionFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Story steps
  const storySteps = [
    {
      id: 'intro',
      title: 'The Support Circle',
      content: 'Meet Sarah, a dedicated teacher who is feeling overwhelmed...',
      character: '👩‍🏫',
      scene: 'classroom'
    },
    {
      id: 'overwhelmed',
      title: 'Feeling Overwhelmed',
      content: 'Sarah sits at her desk after a long day. Her lesson didn\'t go as planned, a parent emailed with concerns, and she\'s behind on grading. She feels isolated and exhausted, questioning if she can keep up with everything.',
      character: '😔',
      scene: 'classroom-after-hours',
      emotions: ['exhausted', 'isolated', 'doubtful']
    },
    {
      id: 'colleague-notices',
      title: 'A Colleague Notices',
      content: 'Her colleague, Maria, notices Sarah\'s stress. Instead of walking by, Maria stops and asks: "You look like you\'ve had a tough day. Want to talk about it?" Maria creates space for Sarah to share her struggles.',
      character: '💙',
      scene: 'colleague-approach',
      emotions: ['noticed', 'cared-for']
    },
    {
      id: 'support-offered',
      title: 'Support Offered',
      content: 'Maria listens actively, validates Sarah\'s feelings, and offers practical help: "I can help you grade those papers, and I\'ve had similar experiences. Let\'s work through this together." Sarah feels heard, supported, and less alone.',
      character: '🤝',
      scene: 'support-conversation',
      emotions: ['supported', 'relieved', 'connected']
    }
  ];

  // Reflection questions
  const reflections = [
    {
      id: 1,
      question: 'What made Maria\'s approach effective?',
      options: [
        {
          id: 'noticed-and-asked',
          text: 'She noticed Sarah\'s stress and took initiative to reach out',
          feedback: 'Exactly! Taking initiative shows care and creates opportunities for connection. When colleagues notice and reach out, it breaks isolation and opens space for support.'
        },
        {
          id: 'listened-validated',
          text: 'She listened actively and validated Sarah\'s feelings without judgment',
          feedback: 'Perfect! Active listening and validation make people feel heard and understood. This creates psychological safety and reduces feelings of isolation.'
        },
        {
          id: 'offered-practical-help',
          text: 'She offered both emotional support and practical help',
          feedback: 'Excellent! Balancing emotional support with practical help addresses both feelings and needs. This comprehensive approach is what makes support truly effective.'
        },
        {
          id: 'all-of-above',
          text: 'All of the above - a combination of noticing, listening, validating, and offering help',
          feedback: 'Perfect! The most effective support combines noticing, listening, validating, and offering practical help. This holistic approach addresses emotional needs while providing tangible solutions.'
        }
      ],
      correctOption: 'all-of-above'
    },
    {
      id: 2,
      question: 'Why is peer support important in teaching?',
      options: [
        {
          id: 'reduces-isolation',
          text: 'It reduces feelings of isolation and reminds teachers they\'re not alone',
          feedback: 'Absolutely! Teaching can feel isolating, especially when facing challenges. Peer support reminds us that others understand and care.'
        },
        {
          id: 'provides-perspective',
          text: 'It provides perspective and helps teachers see challenges differently',
          feedback: 'True! When we\'re overwhelmed, our perspective narrows. Supportive colleagues can help us see situations more clearly and find solutions.'
        },
        {
          id: 'all-reasons',
          text: 'All of the above - it addresses isolation, perspective, and builds community',
          feedback: 'Perfect! Peer support does all of these things - it reduces isolation, provides perspective, and builds a caring community. This comprehensive impact makes it invaluable.'
        },
        {
          id: 'builds-community',
          text: 'It builds a culture of care and collaboration rather than competition',
          feedback: 'Exactly! When teachers support each other, it creates a collaborative culture where everyone benefits. This transforms workplace relationships.'
        },

      ],
      correctOption: 'all-reasons'
    },
    {
      id: 3,
      question: 'What can you do to create supportive connections with colleagues?',
      options: [
        {
          id: 'combine-all',
          text: 'All of the above - combine noticing, listening, and forming support circles',
          feedback: 'Perfect approach! Combining individual acts of care (noticing, listening) with structured support (circles) creates both immediate and sustainable support systems.'
        },
        {
          id: 'notice-and-reach-out',
          text: 'Notice when colleagues seem stressed and reach out with care',
          feedback: 'Great start! Noticing and reaching out is the first step in creating support. Small gestures of care can make a big difference.'
        },
        {
          id: 'listen-without-judgment',
          text: 'Listen actively without judgment and validate their experiences',
          feedback: 'Important! Creating space for others to share without judgment builds trust and opens doors for deeper support.'
        },
        {
          id: 'form-support-circles',
          text: 'Form small support circles or find colleagues you can regularly check in with',
          feedback: 'Excellent! Structured support circles create consistent opportunities for connection and mutual support. This builds sustainable support networks.'
        },

      ],
      correctOption: 'combine-all'
    },
    {
      id: 4,
      question: 'What is the most effective way to respond when a colleague shares they\'re struggling?',
      options: [
        {
          id: 'immediate-solution',
          text: 'Immediately jump in with solutions and advice on how to fix the problem',
          feedback: 'While helpful intentions, jumping straight to solutions can make colleagues feel like their feelings aren\'t being heard first. They may need validation before practical help.'
        },
        {
          id: 'validate-first',
          text: 'First acknowledge their feelings and validate their experience before offering help',
          feedback: 'Perfect! Validating feelings first creates psychological safety and shows you understand their experience. This builds trust and makes colleagues more receptive to support.'
        },
        {
          id: 'share-similar',
          text: 'Share your own similar experiences to show you understand what they\'re going through',
          feedback: 'Sharing experiences can be helpful, but timing matters. It\'s more effective after validating their feelings, not as the primary response.'
        },
        {
          id: 'suggest-break',
          text: 'Tell them to take a break and come back refreshed tomorrow',
          feedback: 'While self-care is important, suggesting a break without acknowledging their struggle first can feel dismissive of their current reality and needs.'
        }
      ],
      correctOption: 'validate-first'
    },
    {
      id: 5,
      question: 'How often should micro support circles meet to be most effective?',
      options: [
        {
          id: 'monthly',
          text: 'Monthly - gives everyone time to accumulate enough issues to discuss',
          feedback: 'Monthly meetings may be too infrequent. By then, issues may have escalated or colleagues may have moved on, missing opportunities for timely support.'
        },

        {
          id: 'as-needed',
          text: 'Only when someone specifically requests a meeting',
          feedback: 'While responsive, this approach misses the preventive benefits of regular check-ins. Scheduled meetings ensure consistent support regardless of who initiates.'
        },
        {
          id: 'daily',
          text: 'Daily quick check-ins during lunch or passing periods',
          feedback: 'Daily might be too frequent and could become burdensome. Weekly or bi-weekly strikes the right balance between consistency and sustainability.'
        },
        {
          id: 'weekly-or-biweekly',
          text: 'Weekly or bi-weekly - creates consistent connection and addresses issues before they escalate',
          feedback: 'Exactly! Weekly or bi-weekly meetings create regular touchpoints that prevent isolation and address challenges while they\'re still manageable. Consistency builds trust and makes support a routine practice.'
        },
      ],
      correctOption: 'weekly-or-biweekly'
    }
  ];

  const handleNext = () => {
    if (currentStep < storySteps.length) {
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === storySteps.length && Object.keys(selectedReflections).length < reflections.length) {
      // Still answering reflections
      return;
    } else {
      // All reflections answered, show summary
      const correctCount = reflections.filter(
        (ref, idx) => selectedReflections[idx] === ref.correctOption
      ).length;
      setScore(correctCount);
      setShowGameOver(true);
    }
  };

  const handleReflectionSelect = (reflectionIndex, optionId) => {
    setSelectedReflections(prev => ({
      ...prev,
      [reflectionIndex]: optionId
    }));
    setShowReflectionFeedback(true);

    setTimeout(() => {
      setShowReflectionFeedback(false);
      if (reflectionIndex < reflections.length - 1) {
        // Move to next reflection
        // We'll handle this in the render
      }
    }, 3000);
  };

  const currentStoryStep = storySteps[currentStep];
  const currentReflectionIndex = currentStep - storySteps.length;
  const currentReflection = currentReflectionIndex >= 0 ? reflections[currentReflectionIndex] : null;
  const allReflectionsAnswered = Object.keys(selectedReflections).length === reflections.length;

  return (
    <TeacherGameShell
      title={gameData?.title || "The Support Circle"}
      subtitle={gameData?.description || "Recognize the value of peer emotional support in teaching environments"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentStep}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {/* Story Vignette */}
        {currentStep < storySteps.length && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-6"
          >
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-7xl mb-4"
              >
                {currentStoryStep.character}
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {currentStoryStep.title}
              </h2>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-8 border-2 border-blue-200 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-line">
                    {currentStoryStep.content}
                  </p>
                </div>
              </div>
            </div>

            {currentStoryStep.emotions && (
              <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-200 mb-6">
                <p className="text-sm text-amber-800">
                  <strong>Emotions in this moment:</strong> {currentStoryStep.emotions.join(', ')}
                </p>
              </div>
            )}

            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                {currentStep < storySteps.length - 1 ? 'Continue Story' : 'Start Reflection'}
              </motion.button>
            </div>

            {/* Progress Indicator */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Story Step {currentStep + 1} of {storySteps.length}</span>
                <span>{Math.round(((currentStep + 1) / storySteps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / storySteps.length) * 100}%` }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Reflection Questions */}
        {currentStep >= storySteps.length && !showGameOver && currentReflection && (
          <motion.div
            key={currentReflectionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-6"
          >
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Reflection Question {currentReflectionIndex + 1}</h3>
                  <p className="text-sm text-gray-600">of {reflections.length}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 rounded-xl p-6 border-2 border-pink-200 mb-6">
                <p className="text-xl font-semibold text-gray-800 leading-relaxed">
                  {currentReflection.question}
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {currentReflection.options.map((option, optionIndex) => {
                const isSelected = selectedReflections[currentReflectionIndex] === option.id;
                const showFeedback = showReflectionFeedback && isSelected;

                return (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: isSelected ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleReflectionSelect(currentReflectionIndex, option.id)}
                    disabled={!!selectedReflections[currentReflectionIndex]}
                    className={`w-full p-6 rounded-xl border-2 text-left transition-all ${isSelected
                        ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50'
                        : selectedReflections[currentReflectionIndex]
                          ? 'border-gray-300 bg-gray-50 opacity-60'
                          : 'border-gray-300 bg-white hover:border-blue-400 hover:shadow-lg'
                      } ${selectedReflections[currentReflectionIndex] ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isSelected
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                          : 'bg-gray-200'
                        }`}>
                        {isSelected ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <span className="text-gray-600 font-semibold">{String.fromCharCode(65 + optionIndex)}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 leading-relaxed">
                          {option.text}
                        </p>
                        {showFeedback && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 bg-green-100 rounded-lg p-4 border-2 border-green-300"
                          >
                            <p className="text-sm text-green-800 leading-relaxed">
                              {option.feedback}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {selectedReflections[currentReflectionIndex] && (
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (currentReflectionIndex < reflections.length - 1) {
                      setCurrentStep(prev => prev + 1);
                    } else {
                      // All reflections answered
                      const correctCount = reflections.filter(
                        (ref, idx) => selectedReflections[idx] === ref.correctOption
                      ).length;
                      setScore(correctCount);
                      setShowGameOver(true);
                    }
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  {currentReflectionIndex < reflections.length - 1 ? 'Next Reflection' : 'View Summary'}
                </motion.button>
              </div>
            )}
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
                💙✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                The Support Circle Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You reflected on {reflections.length} questions about peer support
              </p>
            </div>

            {/* Score Summary */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Reflection Score</h3>
                <div className="text-5xl font-bold mb-2 text-indigo-600">
                  {score} / {reflections.length}
                </div>
                <p className="text-gray-700">
                  {Math.round((score / reflections.length) * 100)}% of reflections completed
                </p>
              </div>
            </div>

            {/* Community Importance Summary */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                The Importance of Community Support
              </h3>
              <div className="space-y-4 text-green-800">
                <div>
                  <p className="font-semibold mb-2">💙 Reduces Isolation</p>
                  <p className="text-sm leading-relaxed">
                    Teaching can feel isolating, especially when facing challenges alone. Peer support reminds us that we\'re not alone and that others understand our experiences. When colleagues reach out and listen, it breaks down walls of isolation and creates connection.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-2">🤝 Builds Trust</p>
                  <p className="text-sm leading-relaxed">
                    Consistent support builds trust among colleagues. When teachers know they can share struggles without judgment, they\'re more likely to ask for help, collaborate, and support others. This creates a positive cycle of mutual care.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-2">💡 Provides Perspective</p>
                  <p className="text-sm leading-relaxed">
                    When we\'re overwhelmed, our perspective narrows. Supportive colleagues can help us see situations differently, find solutions we hadn\'t considered, and remind us of our strengths. External perspective is invaluable during difficult times.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-2">🌟 Creates Culture</p>
                  <p className="text-sm leading-relaxed">
                    When support becomes a regular practice, it transforms workplace culture. Instead of competition or isolation, schools become communities of care where teachers lift each other up. This benefits everyone - teachers, students, and the entire school community.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-2">💪 Enhances Resilience</p>
                  <p className="text-sm leading-relaxed">
                    Teachers who have supportive colleagues are more resilient. They bounce back faster from setbacks because they know they\'re not alone and have resources for support. This makes the teaching profession more sustainable.
                  </p>
                </div>
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
                    <strong>Encourage teachers to form 3-member micro support circles per department.</strong> These small, structured support groups create consistent opportunities for connection and mutual support:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Form groups of three:</strong> Three-member circles are small enough for intimacy and trust, yet large enough for diverse perspectives. Groups of three prevent one person from feeling overwhelmed and ensure everyone has space to share.</li>
                    <li><strong>Organize by department:</strong> Department-based circles create natural connections with colleagues who understand similar challenges. This shared context makes support more relevant and practical.</li>
                    <li><strong>Set regular check-ins:</strong> Establish weekly or bi-weekly meetings where circle members can share challenges, celebrate wins, and offer support. Consistency builds trust and makes support a regular practice.</li>
                    <li><strong>Create safe space:</strong> Agree on ground rules: confidentiality, non-judgment, active listening, and mutual respect. These rules create psychological safety for sharing struggles.</li>
                    <li><strong>Balance listening and sharing:</strong> Each member should have time to share, and others should listen actively and offer support. Balance ensures everyone feels heard and supported.</li>
                    <li><strong>Focus on emotional support:</strong> While practical help is valuable, micro support circles primarily focus on emotional support - listening, validating, and creating connection. This addresses the isolation that many teachers experience.</li>
                    <li><strong>Celebrate together:</strong> Support circles aren\'t just for challenges. Celebrate successes, share wins, and acknowledge growth. Positive reinforcement strengthens connections.</li>
                    <li><strong>Make it optional but encouraged:</strong> Support circles work best when participation is voluntary. Encourage teachers to join, but don\'t mandate it. Authentic support requires willing participants.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you encourage teachers to form 3-member micro support circles per department, you\'re creating structured opportunities for peer emotional support. These circles reduce isolation, build trust, provide perspective, and transform school culture into one of care and collaboration. Regular support circles make emotional support a consistent practice rather than something that only happens in crisis moments.
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

export default TheSupportCircle;