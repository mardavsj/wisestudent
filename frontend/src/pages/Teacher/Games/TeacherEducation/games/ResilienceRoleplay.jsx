import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Shield, MessageCircle, Users, CheckCircle, AlertCircle, TrendingUp, BookOpen } from "lucide-react";

const ResilienceRoleplay = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-55";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState({});
  const [showConsequence, setShowConsequence] = useState(false);
  const [showCoachFeedback, setShowCoachFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Roleplay vignettes with criticism/correction scenarios
  const scenarios = [
    {
      id: 1,
      title: "Principal Feedback",
      type: "principal",
      situation: "Your principal calls you into their office after a classroom observation. They provide feedback that your lesson pacing was too fast, and students seemed confused. They suggest you slow down and check for understanding more frequently. The feedback feels critical, and you worked hard on that lesson.",
      responses: [
        {
          id: 'defensive',
          label: 'Defend Your Approach',
          description: "Explain why your pacing was appropriate and why the students should have kept up",
          consequence: {
            title: "Defensive Response",
            outcome: "You immediately defend your lesson: 'I've been teaching this way for years, and it works. The students just need to pay better attention.' The principal seems frustrated, and the conversation becomes tense. You leave feeling defensive and unsupported, and the relationship becomes strained.",
            emoji: "😤",
            color: "from-gray-500 to-slate-600",
            bgColor: "from-gray-50 to-slate-50",
            borderColor: "border-gray-400"
          },
          coachFeedback: "Defensive responses close off learning opportunities. When we defend immediately, we miss valuable feedback and damage professional relationships. Assertive calm allows us to receive feedback while maintaining our dignity."
        },

        {
          id: 'passive',
          label: 'Accept Without Question',
          description: "Nod along, apologize, and agree with everything without engaging or asking questions",
          consequence: {
            title: "Passive Response",
            outcome: "You nod along, say 'I understand' and 'I'll do better,' but don't ask questions or engage with the feedback. The principal seems satisfied, but you leave feeling dismissed and unsure how to actually improve. You don't feel heard, and the feedback isn't actionable.",
            emoji: "😔",
            color: "from-gray-500 to-slate-600",
            bgColor: "from-gray-50 to-slate-50",
            borderColor: "border-gray-400"
          },
          coachFeedback: "Passive acceptance doesn't serve you or your students. When we just agree without engaging, we miss opportunities to understand feedback deeply and improve effectively. Assertive calm means actively participating in the conversation while remaining open."
        },
        {
          id: 'assertive-calm',
          label: 'Assertive Calm Response',
          description: "Listen actively, acknowledge the feedback, ask clarifying questions, and express openness to improvement",
          consequence: {
            title: "Assertive Calm Response",
            outcome: "You take a breath, listen carefully, and respond: 'Thank you for the feedback. I can see how the pacing might have been challenging. Can you help me understand which specific moments you noticed students struggling? I'd like to improve this.' The principal appreciates your openness, and you have a productive conversation about teaching strategies. You leave feeling supported and with actionable steps.",
            emoji: "✨",
            color: "from-gray-500 to-slate-600",
            bgColor: "from-gray-50 to-slate-50",
            borderColor: "border-gray-400"
          },
          coachFeedback: "Excellent! Assertive calm means you maintain your dignity while being open to feedback. You listened actively, asked clarifying questions, and showed willingness to improve. This approach builds trust, preserves relationships, and creates opportunities for growth. You're neither defensive nor passive—you're assertively calm."
        },
      ],
      correctResponse: 'assertive-calm'
    },
    {
      id: 2,
      title: "Peer Disagreement",
      type: "peer",
      situation: "During a team meeting, a colleague disagrees with your approach to a shared project. They say your ideas won't work and suggest a completely different direction. Their tone is dismissive, and other team members are watching. You feel your expertise is being questioned.",
      responses: [
        {
          id: 'assertive-calm',
          label: 'Assertive Calm Response',
          description: "Acknowledge their perspective, share your reasoning, and suggest exploring both approaches together",
          consequence: {
            title: "Assertive Calm Response",
            outcome: "You take a moment, then respond: 'I appreciate your perspective. I see value in both approaches. Can we explore how we might combine elements of both, or test them in different contexts?' The conversation becomes collaborative, other team members contribute ideas, and you find a solution that incorporates both perspectives. You leave feeling respected and part of a team.",
            emoji: "🤝",
            color: "from-gray-500 to-slate-600",
            bgColor: "from-gray-50 to-slate-50",
            borderColor: "border-gray-400"
          },
          coachFeedback: "Perfect! Assertive calm in disagreements means you maintain your position while respecting others. You acknowledged their perspective, shared your reasoning, and invited collaboration. This approach builds trust, preserves relationships, and leads to better solutions. You're neither defensive nor passive—you're assertively calm."
        },
        {
          id: 'defensive',
          label: 'Challenge Their Approach',
          description: "Point out flaws in their suggestion and insist your approach is better",
          consequence: {
            title: "Defensive Response",
            outcome: "You immediately counter: 'That won't work because...' and list reasons their approach is flawed. The conversation becomes a debate, other team members feel uncomfortable, and the meeting becomes tense. Collaboration breaks down, and you leave feeling frustrated and isolated.",
            emoji: "⚔️",
            color: "from-gray-500 to-slate-600",
            bgColor: "from-gray-50 to-slate-50",
            borderColor: "border-gray-400"
          },
          coachFeedback: "Defensive responses in team settings damage collaboration. When we immediately challenge others, we create conflict instead of finding solutions. Assertive calm allows us to engage with different perspectives while maintaining respect."
        },

        {
          id: 'passive',
          label: 'Give In Immediately',
          description: "Agree to their approach without discussion, even though you have concerns",
          consequence: {
            title: "Passive Response",
            outcome: "You say 'Okay, let's do it your way' and don't voice your concerns. The project moves forward with their approach, but you feel your expertise was dismissed. You carry resentment, and when challenges arise, you feel unheard and unsupported.",
            emoji: "😞",
            color: "from-gray-500 to-slate-600",
            bgColor: "from-gray-50 to-slate-50",
            borderColor: "border-gray-400"
          },
          coachFeedback: "Passive responses in disagreements mean we don't advocate for ourselves or our students. When we give in without discussion, we miss opportunities to contribute valuable perspectives. Assertive calm means expressing your views while remaining open to collaboration."
        }
      ],
      correctResponse: 'assertive-calm'
    },
    {
      id: 3,
      title: "Parent Criticism",
      type: "parent",
      situation: "A parent emails you expressing strong concerns about your grading policy. They say it's unfair and that their child is being penalized. They've copied the principal and are questioning your professional judgment. The email feels accusatory.",
      responses: [
        {
          id: 'defensive',
          label: 'Defend Your Policy',
          description: "Explain why your policy is correct and why the parent is wrong",
          consequence: {
            title: "Defensive Response",
            outcome: "You respond immediately, defending your policy point by point and explaining why the parent's concerns are unfounded. The parent becomes more upset, escalates to the principal, and the situation becomes a conflict. You spend significant time managing the situation and feel stressed.",
            emoji: "📧",
            color: "from-gray-500 to-slate-600",
            bgColor: "from-gray-50 to-slate-50",
            borderColor: "border-gray-400"
          },
          coachFeedback: "Defensive responses to parent concerns often escalate situations. When we immediately defend without listening, parents feel dismissed. Assertive calm means acknowledging concerns while maintaining professional boundaries and policies."
        },
        {
          id: 'assertive-calm',
          label: 'Assertive Calm Response',
          description: "Acknowledge their concern, explain your policy clearly, and invite a conversation to understand their perspective",
          consequence: {
            title: "Assertive Calm Response",
            outcome: "You take time to craft a thoughtful response: 'Thank you for sharing your concerns. I understand this is important to you and your child. Let me explain my grading policy and the reasoning behind it. I'd welcome a conversation to discuss how we can best support your child's learning.' The parent feels heard, you maintain your professional standards, and you schedule a productive meeting. The situation is resolved collaboratively.",
            emoji: "💬",
            color: "from-gray-500 to-slate-600",
            bgColor: "from-gray-50 to-slate-50",
            borderColor: "border-gray-400"
          },
          coachFeedback: "Excellent! Assertive calm with parents means you listen to concerns while maintaining professional boundaries. You acknowledged their feelings, explained your position clearly, and invited dialogue. This approach builds trust, resolves conflicts, and maintains your professional integrity. You're neither defensive nor passive—you're assertively calm."
        },
        {
          id: 'passive',
          label: 'Apologize and Change',
          description: "Apologize for the confusion and immediately change your policy to accommodate them",
          consequence: {
            title: "Passive Response",
            outcome: "You apologize and say you'll adjust the grading policy to address their concerns. Other parents hear about the change and question consistency. You feel like you've compromised your professional judgment, and you're unsure how to handle similar situations in the future.",
            emoji: "😓",
            color: "from-gray-500 to-slate-600",
            bgColor: "from-gray-50 to-slate-50",
            borderColor: "border-gray-400"
          },
          coachFeedback: "Passive responses to parent concerns can compromise your professional judgment and create inconsistency. When we immediately change policies without discussion, we don't serve students well. Assertive calm means maintaining your professional standards while being open to understanding concerns."
        }
      ],
      correctResponse: 'assertive-calm'
    },
    {
      id: 4,
      title: "Student Correction",
      type: "student",
      situation: "A student publicly corrects you during class, pointing out that you made an error in your explanation. They're right—you did make a mistake. Other students are watching, and you feel embarrassed. The student seems to enjoy pointing out your error.",
      responses: [
        {
          id: 'defensive',
          label: 'Dismiss the Correction',
          description: "Minimize the error or redirect attention away from it",
          consequence: {
            title: "Defensive Response",
            outcome: "You say 'That's not important' or 'Let's move on' and try to redirect. Students notice your defensiveness, and the student who corrected you feels dismissed. Your credibility is questioned, and the classroom atmosphere becomes tense. Students are less likely to engage or ask questions.",
            emoji: "😳",
            color: "from-gray-500 to-slate-600",
            bgColor: "from-gray-50 to-slate-50",
            borderColor: "border-gray-400"
          },
          coachFeedback: "Defensive responses to student corrections damage your credibility and classroom culture. When we dismiss corrections, students learn that mistakes aren't acceptable, which creates fear. Assertive calm means modeling how to handle mistakes gracefully."
        },

        {
          id: 'passive',
          label: 'Over-Apologize',
          description: "Apologize excessively and make the mistake seem bigger than it is",
          consequence: {
            title: "Passive Response",
            outcome: "You say 'I'm so sorry, I'm terrible at this, I should have known better' and make the mistake seem significant. Students feel uncomfortable, you lose confidence, and the classroom atmosphere becomes awkward. You spend the rest of the lesson feeling self-conscious.",
            emoji: "😰",
            color: "from-gray-500 to-slate-600",
            bgColor: "from-gray-50 to-slate-50",
            borderColor: "border-gray-400"
          },
          coachFeedback: "Over-apologizing makes small mistakes seem significant and damages your confidence. When we over-apologize, we model that mistakes are shameful. Assertive calm means acknowledging errors without making them bigger than they are—this models healthy resilience."
        },
        {
          id: 'assertive-calm',
          label: 'Assertive Calm Response',
          description: "Acknowledge the error gracefully, thank the student, and model how to handle mistakes",
          consequence: {
            title: "Assertive Calm Response",
            outcome: "You pause, smile, and say: 'You're absolutely right—thank you for catching that! I appreciate your attention. Let me correct that.' You fix the error, thank the student again, and continue. Students see you model grace under correction, the classroom atmosphere remains positive, and students feel safe to ask questions and engage.",
            emoji: "🙏",
            color: "from-gray-500 to-slate-600",
            bgColor: "from-gray-50 to-slate-50",
            borderColor: "border-gray-400"
          },
          coachFeedback: "Perfect! Assertive calm when corrected by students models resilience and grace. You acknowledged the error, thanked the student, and corrected it without defensiveness. This builds trust, creates a safe learning environment, and shows students that mistakes are learning opportunities. You're neither defensive nor passive—you're assertively calm."
        },
      ],
      correctResponse: 'assertive-calm'
    },
    {
      id: 5,
      title: "Administrator Request",
      type: "administrator",
      situation: "Your administrator asks you to take on an additional responsibility that wasn't in your original job description. They frame it as a 'great opportunity' for your career, but you're already overwhelmed with your current responsibilities. Other teachers seem surprised by this request.",
      responses: [
        {
          id: 'defensive',
          label: 'Refuse Pointedly',
          description: "Explain why this is unreasonable and point out how much you're already doing",
          consequence: {
            title: "Defensive Response",
            outcome: "You respond: 'I already have too much on my plate and this isn't fair. I have no idea why you think I have time for this.' The administrator becomes guarded, the relationship becomes strained, and you worry about future interactions. You feel stressed and unsupported, and other teachers seem uncomfortable around you.",
            emoji: "😠",
            color: "from-gray-500 to-slate-600",
            bgColor: "from-gray-50 to-slate-50",
            borderColor: "border-gray-400"
          },
          coachFeedback: "Defensive responses to administrative requests can damage professional relationships. When we respond with anger, we close off possibilities for negotiation. Assertive calm means expressing your concerns while remaining open to dialogue."
        },
        {
          id: 'assertive-calm',
          label: 'Assertive Calm Response',
          description: "Acknowledge the opportunity, express your concerns about workload, and negotiate realistic expectations",
          consequence: {
            title: "Assertive Calm Response",
            outcome: "You respond: 'Thank you for considering me for this opportunity. I appreciate the vote of confidence. I'm currently at capacity with my existing responsibilities. Could we discuss the timeline and whether some of my current duties could be adjusted to accommodate this new role?' The administrator respects your transparency, and you have a productive conversation about workload and priorities. You feel heard and supported.",
            emoji: "🤝",
            color: "from-gray-500 to-slate-600",
            bgColor: "from-gray-50 to-slate-50",
            borderColor: "border-gray-400"
          },
          coachFeedback: "Perfect! Assertive calm with administrators means you acknowledge the opportunity while expressing your concerns professionally. You maintained respect while advocating for yourself. This approach builds trust, preserves relationships, and leads to better outcomes. You're neither defensive nor passive—you're assertively calm."
        },
        {
          id: 'passive',
          label: 'Accept Without Conditions',
          description: "Say yes immediately without discussing your current workload",
          consequence: {
            title: "Passive Response",
            outcome: "You immediately say 'Yes, of course' without mentioning your current workload. You take on the additional responsibility and become severely overwhelmed. Your teaching quality suffers, you feel resentful, and you realize you've set a precedent for accepting whatever is asked of you.",
            emoji: "😰",
            color: "from-gray-500 to-slate-600",
            bgColor: "from-gray-50 to-slate-50",
            borderColor: "border-gray-400"
          },
          coachFeedback: "Passive acceptance of additional responsibilities can lead to burnout and resentment. When we don't advocate for reasonable boundaries, we don't serve ourselves or our students well. Assertive calm means expressing your capacity while remaining open to opportunities."
        }
      ],
      correctResponse: 'assertive-calm'
    }
  ];

  const handleResponseSelect = (responseId) => {
    if (selectedResponse[currentScenario]) return; // Already answered

    const isCorrect = responseId === scenarios[currentScenario].correctResponse;
    const response = scenarios[currentScenario].responses.find(r => r.id === responseId);

    setSelectedResponse(prev => ({
      ...prev,
      [currentScenario]: {
        responseId,
        isCorrect,
        response
      }
    }));

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setShowConsequence(true);
  };

  const handleViewCoachFeedback = () => {
    setShowCoachFeedback(true);
  };

  const handleNext = () => {
    setShowConsequence(false);
    setShowCoachFeedback(false);
    if (currentScenario < totalLevels - 1) {
      setCurrentScenario(prev => prev + 1);
    } else {
      setShowGameOver(true);
    }
  };

  const current = scenarios[currentScenario];
  const selected = selectedResponse[currentScenario];
  const progress = ((currentScenario + 1) / totalLevels) * 100;
  const consequence = selected ? selected.response.consequence : null;
  const coachFeedback = selected ? selected.response.coachFeedback : null;

  // Get icon based on scenario type
  const getScenarioIcon = (type) => {
    switch (type) {
      case 'principal': return Shield;
      case 'peer': return Users;
      case 'parent': return MessageCircle;
      case 'student': return Users;
      case 'administrator': return Shield;
      default: return AlertCircle;
    }
  };

  const ScenarioIcon = getScenarioIcon(current.type);

  return (
    <TeacherGameShell
      title={gameData?.title || "Resilience Roleplay"}
      subtitle={gameData?.description || "Choose adaptive reactions when criticized or corrected"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentScenario + 0}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        <motion.div
          key={currentScenario}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Scenario {currentScenario + 1} of {totalLevels}</span>
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

          {!showConsequence && !showCoachFeedback && (
            <>
              {/* Scenario description */}
              <div className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-orange-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                    <ScenarioIcon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {current.title}
                  </h2>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {current.situation}
                  </p>
                </div>
              </div>

              {/* Question */}
              <div className="text-center mb-6">
                <p className="text-2xl font-semibold text-gray-800 mb-2">
                  How do you respond?
                </p>
                <p className="text-sm text-gray-600">
                  Choose your reaction in this moment
                </p>
              </div>

              {/* Response options */}
              <div className="space-y-4 mb-6">
                {current.responses.map((response, index) => {
                  const isSelected = selected && selected.responseId === response.id;

                  return (
                    <motion.button
                      key={response.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleResponseSelect(response.id)}
                      disabled={!!selected}
                      className={`w-full p-6 rounded-xl border-2 text-left transition-all ${isSelected
                          ? response.id === 'assertive-calm'
                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg'
                            : 'bg-gray-50 border-gray-300 opacity-60'
                          : 'bg-white border-gray-300 hover:border-indigo-400 hover:shadow-md cursor-pointer'
                        }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${response.id === 'assertive-calm'
                            ? 'bg-gradient-to-r from-gray-400 to-slate-500'
                            : response.id === 'defensive'
                              ? 'bg-gradient-to-r from-gray-400 to-slate-500'
                              : 'bg-gradient-to-r from-gray-400 to-slate-500'
                          }`}>
                          <span className="text-white font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {response.label}
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            {response.description}
                          </p>
                        </div>
                        {isSelected && response.id === 'assertive-calm' && (
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </>
          )}

          {/* Consequence */}
          {showConsequence && !showCoachFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-6"
            >
              <div className={`bg-gradient-to-br ${consequence.bgColor} rounded-xl p-6 border-2 ${consequence.borderColor} mb-6`}>
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">{consequence.emoji}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {consequence.title}
                  </h3>
                </div>
                <div className="bg-white/60 rounded-lg p-4">
                  <p className="text-gray-800 leading-relaxed">
                    {consequence.outcome}
                  </p>
                </div>
              </div>

              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleViewCoachFeedback}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  View Coach Feedback on Assertive Calm
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Coach Feedback */}
          {showCoachFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-6"
            >
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-300 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                  <h3 className="text-2xl font-bold text-gray-800">
                    Coach Feedback: Assertive Calm
                  </h3>
                </div>
                <div className="bg-white/60 rounded-lg p-5">
                  <p className="text-gray-800 leading-relaxed text-lg">
                    {coachFeedback}
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-5 border-2 border-amber-200 mb-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-amber-900 mb-2">
                      💡 Key Insight: Assertive Calm
                    </p>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      <strong>Assertive calm</strong> means maintaining your dignity and boundaries while being open to feedback and different perspectives. It's the middle ground between defensiveness (protecting yourself by attacking) and passivity (protecting yourself by giving in). When you're assertively calm, you:
                    </p>
                    <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                      <li>Listen actively and acknowledge others' perspectives</li>
                      <li>Express your own views and reasoning clearly</li>
                      <li>Remain open to learning and improvement</li>
                      <li>Maintain professional boundaries and standards</li>
                      <li>Build trust and preserve relationships</li>
                    </ul>
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
                  {currentScenario < totalLevels - 1 ? 'Next Scenario' : 'View Summary'}
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
                {score === totalLevels ? '🎯✨' : score >= totalLevels / 2 ? '📈💪' : '🌱📚'}
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Roleplay Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You chose assertive calm in {score} out of {totalLevels} scenarios
              </p>
            </div>

            {/* Score Summary */}
            <div className={`bg-gradient-to-br rounded-xl p-6 border-2 mb-6 ${score === totalLevels
                ? 'from-green-50 to-emerald-50 border-green-200'
                : score >= totalLevels / 2
                  ? 'from-blue-50 to-indigo-50 border-blue-200'
                  : 'from-yellow-50 to-orange-50 border-yellow-200'
              }`}>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Your Resilience Score</h3>
                <div className={`text-5xl font-bold mb-2 ${score === totalLevels ? 'text-green-600' :
                    score >= totalLevels / 2 ? 'text-blue-600' :
                      'text-yellow-600'
                  }`}>
                  {Math.round((score / totalLevels) * 100)}%
                </div>
                <p className="text-gray-700">
                  {score === totalLevels
                    ? "Excellent! You consistently chose assertive calm responses. You're building strong resilience skills."
                    : score >= totalLevels / 2
                      ? "Good progress! You're learning to choose assertive calm. Keep practicing to build resilience."
                      : "Keep learning! Each scenario helps you understand assertive calm better. Practice makes progress."}
                </p>
              </div>
            </div>

            {/* Resilience Insights */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Resilience Building Insights
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Assertive calm is learnable:</strong> Choosing assertive calm responses becomes easier with practice. Each scenario helps you build this skill.</li>
                <li>• <strong>It's not about being perfect:</strong> Resilience isn't about never feeling defensive or passive—it's about recognizing these responses and choosing assertive calm more often.</li>
                <li>• <strong>Relationships matter:</strong> Assertive calm preserves and builds professional relationships, which are essential for sustainable teaching.</li>
                <li>• <strong>Boundaries are important:</strong> Assertive calm means maintaining your professional boundaries while being open to feedback and collaboration.</li>
                <li>• <strong>Practice in safe spaces:</strong> Roleplaying in safe environments helps you build skills before facing real criticism or correction.</li>
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
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Practice feedback acceptance in safe environments. Before facing real criticism or correction, practice assertive calm responses in low-stakes situations:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Roleplay with colleagues:</strong> Practice responding to feedback scenarios with trusted colleagues. Give each other feedback and practice assertive calm responses.</li>
                    <li><strong>Reflect on past situations:</strong> Think about times you received criticism. How did you respond? What would assertive calm have looked like in those moments?</li>
                    <li><strong>Prepare scripts:</strong> Develop phrases you can use when receiving feedback: "Thank you for the feedback. Can you help me understand...?" or "I appreciate your perspective. Let me share my reasoning..."</li>
                    <li><strong>Practice with mentors:</strong> Ask mentors or coaches to provide constructive feedback and practice your assertive calm responses.</li>
                    <li><strong>Start small:</strong> Practice assertive calm in low-stakes situations (like receiving feedback on a minor task) before using it in high-stakes situations.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    Practicing in safe environments builds your confidence and skill in choosing assertive calm responses. When you've practiced these responses, they become more natural and accessible when you face real criticism or correction. This preparation helps you maintain your dignity, preserve relationships, and learn from feedback effectively.
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

export default ResilienceRoleplay;