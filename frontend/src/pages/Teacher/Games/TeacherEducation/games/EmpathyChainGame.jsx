import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Link, Heart, CheckCircle, MessageCircle, TrendingUp, BookOpen, Users } from "lucide-react";

const EmpathyChainGame = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-72";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentChain, setCurrentChain] = useState(0);
  const [selectedResponses, setSelectedResponses] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [chainHistory, setChainHistory] = useState([]);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Empathy chain cards - each statement leads to responses, which lead to next statements
  const empathyChains = [
    {
      id: 1,
      statement: "I'm exhausted. I've been working late every night this week, and I don't know how to keep up.",
      person: "Your Colleague",
      responses: [
        {
          id: 'dismissive',
          text: "Everyone's busy. That's just how teaching is.",
          feedback: "This response dismisses their feelings. It doesn't offer support or empathy.",
          chainResult: {
            statement: "I guess you're right. I'll just keep pushing through.",
            person: "Your Colleague",
            emotion: "discouraged",
            continuation: "The chain stops here. Support wasn't passed forward."
          },
          isSupportive: false
        },
        {
          id: 'supportive',
          text: "That sounds really tough. You're working so hard. How can I help?",
          feedback: "Perfect! This response validates feelings, acknowledges effort, and offers practical support. The empathy chain continues!",
          chainResult: {
            statement: "Thank you, that means a lot. Actually, if you could cover my lunch duty tomorrow, that would help. And maybe we could plan together next week?",
            person: "Your Colleague",
            emotion: "grateful and hopeful",
            continuation: "The empathy chain continues! Now they're offering to collaborate, passing support forward."
          },
          isSupportive: true
        },
        {
          id: 'minimizing',
          text: "It'll get easier. Just try to manage your time better.",
          feedback: "This minimizes their experience and offers unsolicited advice. It doesn't show empathy.",
          chainResult: {
            statement: "Yeah, maybe. I'll try.",
            person: "Your Colleague",
            emotion: "dismissed",
            continuation: "The chain weakens. Support wasn't effectively passed forward."
          },
          isSupportive: false
        }
      ]
    },
    {
      id: 2,
      statement: "I'm really struggling with this parent. They're questioning everything I do, and I feel like I'm being attacked.",
      person: "Your Colleague",
      responses: [
        {
          id: 'supportive',
          text: "I understand how stressful that can feel. You're doing great work.",
          feedback: "Excellent! You validated their feelings, offered support, and gave them options. This continues the empathy chain beautifully!",
          chainResult: {
            statement: "Thank you for understanding. Actually, talking through it would help, and having you there would make me feel supported. I really appreciate this.",
            person: "Your Colleague",
            emotion: "supported and relieved",
            continuation: "The empathy chain strengthens! They feel supported and are now more likely to support others."
          },
          isSupportive: true
        },
        {
          id: 'dismissive',
          text: "Some parents are just difficult. Ignore them.",
          feedback: "This dismisses their struggle and doesn't offer support or understanding.",
          chainResult: {
            statement: "I guess you're right. I'll just deal with it alone.",
            person: "Your Colleague",
            emotion: "isolated",
            continuation: "The chain stops. No support was passed forward."
          },
          isSupportive: false
        },

        {
          id: 'defensive',
          text: "That parent is wrong. You need to stand up for yourself more.",
          feedback: "This takes a defensive stance and doesn't offer emotional support or understanding.",
          chainResult: {
            statement: "Maybe. I don't know. I just feel overwhelmed.",
            person: "Your Colleague",
            emotion: "still struggling",
            continuation: "The chain doesn't continue effectively. Support wasn't passed forward."
          },
          isSupportive: false
        }
      ]
    },
    {
      id: 3,
      statement: "I made a mistake in front of my students today, and I'm so embarrassed. I feel like I lost their respect.",
      person: "Your Colleague",
      responses: [
        {
          id: 'minimizing',
          text: "Don't worry about it. Students don't really pay attention anyway.",
          feedback: "This minimizes their feelings and doesn't address their concern about respect.",
          chainResult: {
            statement: "I guess. But I still feel embarrassed.",
            person: "Your Colleague",
            emotion: "still embarrassed",
            continuation: "The chain weakens. Their feelings weren't fully addressed."
          },
          isSupportive: false
        },

        {
          id: 'avoidant',
          text: "It's not a big deal. Just forget about it.",
          feedback: "This avoids addressing their feelings and doesn't offer support.",
          chainResult: {
            statement: "Okay. I'll try to forget about it.",
            person: "Your Colleague",
            emotion: "still struggling",
            continuation: "The chain stops. Support wasn't passed forward."
          },
          isSupportive: false
        },
        {
          id: 'supportive',
          text: "I understand that feeling. Making mistakes in front of students can feel vulnerable. But modeling how to handle mistakes actually builds respect. How are you feeling about it now?",
          feedback: "Perfect! You validated their feelings, reframed the situation positively, and checked in. This is how empathy chains continue!",
          chainResult: {
            statement: "You're right - I didn't think of it that way. Actually, a student came up to me after class and said they appreciated how I handled it. That helped. Thank you for reminding me of this perspective.",
            person: "Your Colleague",
            emotion: "relieved and grateful",
            continuation: "The empathy chain continues! They received support and are now thinking about how to support others too."
          },
          isSupportive: true
        },
      ]
    },
    {
      id: 4,
      statement: "I'm feeling really discouraged. My students aren't engaged, and I feel like I'm failing them.",
      person: "Your Colleague",
      responses: [
        {
          id: 'judgmental',
          text: "Maybe you need to try harder or change your approach completely.",
          feedback: "This is judgmental and doesn't offer emotional support or understanding.",
          chainResult: {
            statement: "I guess. I don't know what else to try.",
            person: "Your Colleague",
            emotion: "more discouraged",
            continuation: "The chain breaks. No support was passed forward."
          },
          isSupportive: false
        },
        {
          id: 'supportive',
          text: "I hear how discouraging that feels. You care so much about your students, and that matters. ",
          feedback: "Beautiful response! You validated their feelings, acknowledged their care, and gently redirected toward positive perspective. This continues the empathy chain!",
          chainResult: {
            statement: "Thank you for asking. Actually, one student did ask a good question today. And another one thanked me after class. I guess there were some bright spots. Thank you for helping me see that.",
            person: "Your Colleague",
            emotion: "hopeful and grateful",
            continuation: "The empathy chain continues! They feel supported and are now thinking more positively, which they can share with others."
          },
          isSupportive: true
        },
        {
          id: 'comparison',
          text: "At least your class isn't as difficult as mine. Mine is way worse.",
          feedback: "This compares struggles instead of offering support. It dismisses their feelings.",
          chainResult: {
            statement: "I guess you're right. Thanks.",
            person: "Your Colleague",
            emotion: "still discouraged",
            continuation: "The chain doesn't continue. Their feelings weren't addressed."
          },
          isSupportive: false
        }
      ]
    },
    {
      id: 5,
      statement: "I'm worried I'm not cut out for teaching. I see other teachers doing so well, and I feel like I'm falling behind.",
      person: "Your Colleague",
      responses: [
        {
          id: 'supportive',
          text: "I understand that worry. Comparison can be really hard. But I see how much you care about your students and how hard you're working. What specific areas would you like to grow in? Maybe we can work on them together?",
          feedback: "Perfect empathetic response! You acknowledged their worry, validated their care and effort, and offered collaborative support. This is how empathy chains strengthen!",
          chainResult: {
            statement: "That means a lot. Actually, I'd love to work on classroom management strategies together. And maybe observe your class if that's okay? I really appreciate your support.",
            person: "Your Colleague",
            emotion: "hopeful and connected",
            continuation: "The empathy chain continues beautifully! They feel supported and are now more likely to support others, creating a ripple effect."
          },
          isSupportive: true
        },
        {
          id: 'false-reassurance',
          text: "You're fine. Everyone feels that way sometimes.",
          feedback: "This offers false reassurance without truly addressing their concern or offering specific support.",
          chainResult: {
            statement: "Maybe. I just don't know anymore.",
            person: "Your Colleague",
            emotion: "still uncertain",
            continuation: "The chain weakens. Their specific concerns weren't addressed."
          },
          isSupportive: false
        },

        {
          id: 'dismissive',
          text: "You'll figure it out. Teaching takes time.",
          feedback: "This is dismissive and doesn't offer specific support or understanding.",
          chainResult: {
            statement: "I guess. I'll just keep trying.",
            person: "Your Colleague",
            emotion: "still worried",
            continuation: "The chain doesn't effectively continue. Support wasn't passed forward."
          },
          isSupportive: false
        }
      ]
    }
  ];

  const handleResponseSelect = (chainIndex, responseId) => {
    if (selectedResponses[chainIndex]) return; // Already answered

    const chain = empathyChains[chainIndex];
    const response = chain.responses.find(r => r.id === responseId);

    setSelectedResponses(prev => ({
      ...prev,
      [chainIndex]: response
    }));

    // Add to chain history
    setChainHistory(prev => [
      ...prev,
      {
        chainIndex,
        statement: chain.statement,
        response: response.text,
        chainResult: response.chainResult,
        isSupportive: response.isSupportive
      }
    ]);

    setShowFeedback(true);
    setScore(prev => response.isSupportive ? prev + 1 : prev);
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentChain < totalLevels - 1) {
      setCurrentChain(prev => prev + 1);
    } else {
      setShowGameOver(true);
    }
  };

  const currentChainData = empathyChains[currentChain];
  const selectedResponse = selectedResponses[currentChain];
  const progress = ((currentChain + 1) / totalLevels) * 100;
  const supportiveCount = Object.values(selectedResponses).filter(r => r?.isSupportive).length;

  return (
    <TeacherGameShell
      title={gameData?.title || "Empathy Chain Game"}
      subtitle={gameData?.description || "Learn to pass supportive words forward among peers"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentChain}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        <motion.div
          key={currentChain}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Chain {currentChain + 1} of {totalLevels}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
              />
            </div>
          </div>

          {!selectedResponse ? (
            <>
              {/* Statement Card */}
              <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-pink-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">{currentChainData.person} says:</p>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Empathy Chain {currentChain + 1}
                    </h2>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 mb-2">{currentChainData.person}:</p>
                      <p className="text-gray-700 leading-relaxed text-lg italic">
                        "{currentChainData.statement}"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-200">
                  <p className="text-sm text-amber-800">
                    <strong>Your turn:</strong> Choose a supportive response to continue the empathy chain. Think about how your words can pass support forward.
                  </p>
                </div>
              </div>

              {/* Response Options */}
              <div className="space-y-4 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Link className="w-6 h-6 text-pink-600" />
                  Choose Your Response:
                </h3>
                {currentChainData.responses.map((response, index) => (
                  <motion.button
                    key={response.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleResponseSelect(currentChain, response.id)}
                    className={`w-full p-6 rounded-xl border-2 text-left transition-all ${response.id === 'supportive'
                        ? 'border-gray-300 bg-white hover:border-pink-300 hover:shadow-lg'
                        : 'border-gray-300 bg-white hover:border-pink-300 hover:shadow-lg'
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${response.id === 'supportive'
                          ? 'bg-gradient-to-r from-gray-300 to-gray-400'
                          : 'bg-gradient-to-r from-gray-300 to-gray-400'
                        }`}>
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 leading-relaxed">
                          {response.text}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Response Feedback */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8 mb-6"
              >
                <div className={`bg-gradient-to-br rounded-xl p-6 border-2 mb-6 ${selectedResponse.isSupportive
                    ? 'from-green-50 to-emerald-50 border-green-200'
                    : 'from-gray-50 to-slate-50 border-gray-200'
                  }`}>
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-2">{selectedResponse.isSupportive ? '💚' : '💭'}</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {selectedResponse.isSupportive ? 'Supportive Response!' : 'Response Feedback'}
                    </h3>
                  </div>
                  <div className="bg-white/60 rounded-lg p-5">
                    <p className="text-gray-800 leading-relaxed text-lg mb-4">
                      <strong>Your response:</strong> "{selectedResponse.text}"
                    </p>
                    <div className="bg-blue-100 rounded-lg p-4 border border-blue-200">
                      <p className="text-blue-800 leading-relaxed">
                        {selectedResponse.feedback}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chain Result */}
                {selectedResponse.chainResult && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border-2 border-indigo-200 mb-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Link className="w-6 h-6 text-indigo-600" />
                      <h4 className="text-lg font-bold text-gray-800">The Chain Continues...</h4>
                    </div>

                    <div className="bg-white rounded-lg p-5 mb-4">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 mb-2">{selectedResponse.chainResult.person}:</p>
                          <p className="text-gray-700 leading-relaxed italic text-lg mb-2">
                            "{selectedResponse.chainResult.statement}"
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Emotion:</strong> {selectedResponse.chainResult.emotion}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className={`rounded-lg p-4 border-2 ${selectedResponse.isSupportive
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                      }`}>
                      <p className={`text-sm leading-relaxed ${selectedResponse.isSupportive ? 'text-green-800' : 'text-gray-700'
                        }`}>
                        <strong>{selectedResponse.isSupportive ? '✓' : '○'}</strong> {selectedResponse.chainResult.continuation}
                      </p>
                    </div>
                  </motion.div>
                )}

                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    {currentChain < totalLevels - 1 ? 'Next Chain Link' : 'View Summary'}
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>

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
                💚✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Empathy Chain Game Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You passed support forward through {totalLevels} empathy chains
              </p>
            </div>

            {/* Score Summary */}
            <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-pink-200 mb-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Supportive Responses</h3>
                <div className="text-5xl font-bold mb-2 text-pink-600">
                  {supportiveCount} / {totalLevels}
                </div>
                <p className="text-gray-700">
                  {Math.round((supportiveCount / totalLevels) * 100)}% of responses passed support forward
                </p>
              </div>
            </div>

            {/* Chain History */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Link className="w-5 h-5" />
                Your Empathy Chain History
              </h3>
              <div className="space-y-4">
                {chainHistory.map((link, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border-2 border-gray-200">
                    <div className="flex items-start gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${link.isSupportive
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                          : 'bg-gradient-to-r from-gray-300 to-gray-400'
                        }`}>
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">Statement {index + 1}:</p>
                        <p className="text-gray-800 italic mb-2">"{link.statement}"</p>
                        <p className="text-sm text-gray-600 mb-1">Your response:</p>
                        <p className={`font-semibold mb-2 ${link.isSupportive ? 'text-green-700' : 'text-gray-700'
                          }`}>
                          "{link.response}"
                        </p>
                        <p className="text-sm text-gray-600 mb-1">Chain result:</p>
                        <p className="text-gray-700 text-sm">{link.chainResult.continuation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Learnings */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                How to Pass Support Forward
              </h3>
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Validate feelings:</strong> Acknowledge and validate what the person is experiencing. This shows understanding and creates connection.</li>
                <li>• <strong>Offer specific help:</strong> Instead of vague offers, suggest concrete ways you can help. This makes support actionable.</li>
                <li>• <strong>Listen actively:</strong> Truly listen to what they're saying and respond to their actual concerns, not just your assumptions.</li>
                <li>• <strong>Avoid minimizing:</strong> Don't dismiss or minimize their struggles. Everyone's experience is valid.</li>
                <li>• <strong>Create connection:</strong> Offer to work together, collaborate, or check in regularly. This builds ongoing support.</li>
                <li>• <strong>Pass it forward:</strong> When you receive support, acknowledge it and consider how you can support others. This creates a chain effect.</li>
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
                    <strong>Create a real "Empathy Chain" board in the staffroom.</strong> This physical representation of support creates visible reminders and encourages ongoing empathy:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Design the board:</strong> Create a bulletin board or wall space dedicated to the Empathy Chain. Use colorful paper chains, cards, or a visual representation where teachers can see support being passed forward.</li>
                    <li><strong>Start the chain:</strong> When a teacher shares a struggle or receives support, add a link to the chain with their name (or anonymously if preferred) and a brief note about the support received or given.</li>
                    <li><strong>Visual impact:</strong> Seeing the chain grow physically reinforces that support is happening in your school. It's a visible reminder that teachers are supporting each other.</li>
                    <li><strong>Celebrate connections:</strong> Each time support is passed forward, add another link. Celebrate when the chain reaches milestones (10 links, 25 links, etc.).</li>
                    <li><strong>Make it interactive:</strong> Teachers can add their own links when they give or receive support. Include post-it notes or cards where they can write brief notes about supportive moments.</li>
                    <li><strong>Keep it positive:</strong> Focus on support, gratitude, and connection. This board should uplift, not highlight problems.</li>
                    <li><strong>Regular updates:</strong> Encourage teachers to add to the board regularly. Maybe start staff meetings by acknowledging new links added to the chain.</li>
                    <li><strong>Create culture:</strong> The physical board creates a culture of support. It's a constant reminder that empathy matters and that teachers are there for each other.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you create a real "Empathy Chain" board in the staffroom, you're making support visible and tangible. This physical representation reminds teachers that they're part of a caring community, encourages them to give and receive support, and creates a culture where empathy is valued and practiced. The board becomes a symbol of your school's commitment to supporting each other.
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

export default EmpathyChainGame;