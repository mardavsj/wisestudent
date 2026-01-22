import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Heart, MessageCircle, Users, CheckCircle, AlertCircle, TrendingUp, BookOpen, Scale } from "lucide-react";

const EmpatheticDialogueRoleplay = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-68";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState({});
  const [showReaction, setShowReaction] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Interactive dialogue scenarios
  const scenarios = [
    {
      id: 1,
      title: "Colleague Complaint",
      type: "colleague",
      situation: "A colleague approaches you frustrated about a shared responsibility. They say: 'I'm overwhelmed with the curriculum planning, and I feel like you're not pulling your weight. This is unfair, and I'm tired of carrying the workload alone.'",
      personName: "Your Colleague",
      responses: [
        {
          id: 'dismissive',
          label: 'Dismissive Response',
          description: "That's not true. I've been doing my part. Maybe you should manage your time better.",
          statement: "That's not true. I've been doing my part. Maybe you should manage your time better.",
          reaction: {
            title: "Dismissive Response",
            outcome: "Your colleague becomes more frustrated and defensive. They respond: 'You're not listening to me! This is exactly what I'm talking about.' The conversation escalates, trust erodes, and collaboration becomes difficult. The relationship suffers.",
            emoji: "😠",
            color: "from-red-500 to-rose-600",
            bgColor: "from-red-50 to-rose-50",
            borderColor: "border-red-400",
            tone: 30,
            clarity: 40,
            empathy: 20
          },
          feedback: {
            tone: "Dismissive responses invalidate feelings and escalate conflict. The tone lacks warmth and creates defensiveness.",
            clarity: "While the message is clear, it doesn't address the actual concern or create a path forward.",
            overall: "This response prioritizes defending yourself over understanding the situation. It lacks empathy and doesn't invite collaboration."
          }
        },

        {
          id: 'passive',
          label: 'Passive Response',
          description: "I'm so sorry. I'll take on more responsibility. You're right, I haven't been helping enough.",
          statement: "I'm so sorry. You're absolutely right—I haven't been helping enough. I'll take on more responsibility right away. I'll handle most of it from now on.",
          reaction: {
            title: "Passive Response",
            outcome: "Your colleague seems satisfied initially, but you feel resentful and overburdened. The workload becomes unbalanced, you burn out, and the underlying issues aren't addressed. The relationship feels strained by unspoken resentment.",
            emoji: "😔",
            color: "from-red-500 to-rose-600",
            bgColor: "from-red-50 to-rose-50",
            borderColor: "border-red-400",
            tone: 50,
            clarity: 60,
            empathy: 70
          },
          feedback: {
            tone: "The tone is warm and empathetic, which is good, but it lacks firmness and boundary-setting.",
            clarity: "The message is clear but problematic: it accepts full blame without understanding the situation, which can create unfair dynamics.",
            overall: "This response shows empathy but lacks boundaries. While it may resolve immediate conflict, it doesn't address root causes and can lead to resentment and burnout."
          }
        },
        {
          id: 'empathetic-firm',
          label: 'Empathetic & Firm Response',
          description: "I hear you, and here's what we can do. Let me understand your perspective, and then we'll create a fair plan together.",
          statement: "I hear you, and I understand this feels overwhelming. Your concerns are valid. Let's sit down together and review the workload distribution. We can create a plan that feels fair to both of us and ensures we're both supported.",
          reaction: {
            title: "Empathetic & Firm Response",
            outcome: "Your colleague's energy softens. They respond: 'Thank you for hearing me out. I appreciate that you want to work together on this.' You have a productive conversation, create a fair plan, and rebuild trust. The collaboration improves, and both of you feel supported.",
            emoji: "✨",
            color: "from-red-500 to-rose-600",
            bgColor: "from-red-50 to-rose-50",
            borderColor: "border-red-400",
            tone: 95,
            clarity: 95,
            empathy: 100
          },
          feedback: {
            tone: "Excellent! 'I hear you, and here's what we can do' blends warmth with direction. The tone is respectful, acknowledging feelings while maintaining boundaries.",
            clarity: "The message is clear: you acknowledge their concern, commit to understanding, and outline a path forward. This creates structure and direction.",
            overall: "Perfect balance of empathy and firmness! You validated their feelings while maintaining your position and inviting collaboration. This approach builds trust and resolves conflicts."
          }
        },
      ],
      correctResponse: 'empathetic-firm'
    },
    {
      id: 2,
      title: "Student Conflict",
      type: "student",
      situation: "A student approaches you upset after class. They say: 'You gave me a bad grade on my project, and it's not fair. I worked really hard on it, and you didn't even look at it properly. This is unfair, and I'm really upset.'",
      personName: "Your Student",
      responses: [
        {
          id: 'dismissive',
          label: 'Dismissive Response',
          description: "The grade is what it is. I looked at it, and you didn't meet the rubric. That's final.",
          statement: "The grade is what it is. I reviewed it according to the rubric, and you didn't meet the requirements. I can't change it just because you're upset.",
          reaction: {
            title: "Dismissive Response",
            outcome: "The student becomes more upset and defensive. They respond: 'You're not listening to me! This is unfair!' The relationship is damaged, the student loses trust in you, and they're less likely to engage in future learning. They feel dismissed and unsupported.",
            emoji: "😤",
            color: "from-red-500 to-rose-600",
            bgColor: "from-red-50 to-rose-50",
            borderColor: "border-red-400",
            tone: 35,
            clarity: 70,
            empathy: 25
          },
          feedback: {
            tone: "The tone is firm but lacks warmth. While boundaries are maintained, the student feels dismissed rather than heard.",
            clarity: "The message is clear about the grade being final, but it doesn't acknowledge their feelings or invite understanding.",
            overall: "This response maintains boundaries but lacks empathy. Students need to feel heard even when grades can't be changed. Balancing empathy with firmness creates better outcomes."
          }
        },
        {
          id: 'empathetic-firm',
          label: 'Empathetic & Firm Response',
          description: "I hear you, and here's what we can do. I understand you worked hard, and let's review the rubric together so you can improve.",
          statement: "I hear you, and I understand this is upsetting—especially when you put effort into your work. I want to acknowledge that. Let's sit down together and review the rubric and your project. I'll explain my feedback, and we can discuss how you can improve on future assignments. While I can't change this grade, I can help you understand how to succeed next time.",
          reaction: {
            title: "Empathetic & Firm Response",
            outcome: "The student's energy calms. They respond: 'Okay, thank you. I'd like to understand what I missed.' You have a productive conversation, review the rubric together, and the student leaves feeling heard and supported. They understand the grading criteria better and are motivated to improve.",
            emoji: "🤝",
            color: "from-red-500 to-rose-600",
            bgColor: "from-red-50 to-rose-50",
            borderColor: "border-red-400",
            tone: 95,
            clarity: 100,
            empathy: 100
          },
          feedback: {
            tone: "Perfect! 'I hear you, and here's what we can do' validates feelings while maintaining boundaries. The tone is warm and respectful, creating connection while being clear.",
            clarity: "The message clearly acknowledges their feelings, maintains grading boundaries, and outlines a path forward. This creates structure and direction.",
            overall: "Excellent balance! You validated their effort and feelings while maintaining your professional standards. This approach builds trust, supports learning, and maintains boundaries."
          }
        },
        {
          id: 'passive',
          label: 'Passive Response',
          description: "I'm so sorry you're upset. Let me change your grade. I didn't realize you worked so hard.",
          statement: "I'm so sorry you're upset. You're right—I should have looked more carefully. Let me change your grade for you. I didn't realize how much work you put into this.",
          reaction: {
            title: "Passive Response",
            outcome: "The student seems happy initially, but other students learn about the grade change and question fairness. You feel uncertain about your grading decisions, and the situation creates inconsistency. Your authority is undermined, and students learn that complaints lead to grade changes rather than understanding criteria.",
            emoji: "😓",
            color: "from-red-500 to-rose-600",
            bgColor: "from-red-50 to-rose-50",
            borderColor: "border-red-400",
            tone: 60,
            clarity: 50,
            empathy: 80
          },
          feedback: {
            tone: "The tone is warm and empathetic, which shows care, but it lacks the firmness needed to maintain professional standards.",
            clarity: "The message is unclear about grading criteria and boundaries. Changing grades without review undermines fairness and learning.",
            overall: "This response shows empathy but compromises professional boundaries. While it may resolve immediate conflict, it doesn't support learning or maintain fairness for all students."
          }
        }
      ],
      correctResponse: 'empathetic-firm'
    },
    {
      id: 3,
      title: "Parent Concern",
      type: "parent",
      situation: "A parent calls you upset about their child's recent behavior report. They say: 'My child never acts like this at home. I think you're being too harsh, and this is unfair. You're picking on my child, and I don't understand why you're targeting them.'",
      personName: "The Parent",
      responses: [
        {
          id: 'empathetic-firm',
          label: 'Empathetic & Firm Response',
          description: "I hear you, and here's what we can do. I understand your concern, and let's work together to support your child.",
          statement: "I hear you, and I understand your concern—it's difficult when you feel your child is being treated unfairly. I want to acknowledge that. I'm committed to documenting behavior accurately and consistently for all students. Let's work together: I'll share specific examples of the incidents I observed, and we can discuss how we can both support your child in developing positive classroom behavior. My goal is to help your child succeed.",
          reaction: {
            title: "Empathetic & Firm Response",
            outcome: "The parent's energy softens. They respond: 'Thank you for hearing me out. I appreciate that you want to work together on this.' You have a productive conversation, share observations, and create a collaborative plan. The parent feels heard and supported, and you maintain your professional standards. The relationship improves, and you work together to support the child.",
            emoji: "💬",
            color: "from-red-500 to-rose-600",
            bgColor: "from-red-50 to-rose-50",
            borderColor: "border-red-400",
            tone: 95,
            clarity: 95,
            empathy: 100
          },
          feedback: {
            tone: "Excellent! 'I hear you, and here's what we can do' blends warmth with professionalism. The tone acknowledges their concern while maintaining boundaries.",
            clarity: "The message clearly acknowledges their feelings, maintains reporting standards, and outlines a collaborative path forward. This creates structure and direction.",
            overall: "Perfect balance! You validated their concern while maintaining your professional standards and inviting collaboration. This approach builds trust and supports the child."
          }
        },
        {
          id: 'dismissive',
          label: 'Dismissive Response',
          description: "I'm just reporting what I observe. The behavior happened, and that's what I documented. I'm not targeting anyone.",
          statement: "I'm just reporting what I observe in the classroom. The behavior incidents I documented happened, and that's the reality. I'm not targeting anyone—I report all incidents consistently.",
          reaction: {
            title: "Dismissive Response",
            outcome: "The parent becomes more defensive and upset. They respond: 'You're not listening to what I'm saying! My child wouldn't do that.' The conversation escalates, trust is damaged, and the parent becomes adversarial. The relationship suffers, and future collaboration becomes difficult.",
            emoji: "📞",
            color: "from-red-500 to-rose-600",
            bgColor: "from-red-50 to-rose-50",
            borderColor: "border-red-400",
            tone: 40,
            clarity: 65,
            empathy: 30
          },
          feedback: {
            tone: "The tone is factual but lacks warmth and understanding. While boundaries are maintained, the parent feels dismissed rather than heard.",
            clarity: "The message is clear about reporting standards, but it doesn't acknowledge their concern or create space for dialogue.",
            overall: "This response maintains professional boundaries but lacks empathy. Parents need to feel heard even when reports can't be changed. Balancing empathy with firmness creates better outcomes."
          }
        },

        {
          id: 'passive',
          label: 'Passive Response',
          description: "I'm so sorry for the confusion. Let me remove those reports. I must have misunderstood the situation.",
          statement: "I'm so sorry for the confusion and if my reports were unclear. You're right—I must have misunderstood the situation. Let me remove those behavior reports, and we can start fresh.",
          reaction: {
            title: "Passive Response",
            outcome: "The parent seems satisfied initially, but the behavior issues continue unaddressed. Other parents learn about removed reports and question consistency. You feel uncertain about your professional judgment, and the situation creates inconsistency. The child doesn't receive needed support, and classroom behavior management becomes unclear.",
            emoji: "😓",
            color: "from-red-500 to-rose-600",
            bgColor: "from-red-50 to-rose-50",
            borderColor: "border-red-400",
            tone: 55,
            clarity: 45,
            empathy: 75
          },
          feedback: {
            tone: "The tone is warm and apologetic, which shows care, but it lacks the firmness needed to maintain professional standards.",
            clarity: "The message is unclear about behavior documentation and boundaries. Removing reports without review undermines consistency and doesn't support the child.",
            overall: "This response shows empathy but compromises professional boundaries. While it may resolve immediate conflict, it doesn't address behavior issues or maintain fairness for all students and parents."
          }
        }
      ],
      correctResponse: 'empathetic-firm'
    },
    {
      id: 4,
      title: "Administrator Request",
      type: "administrator",
      situation: "Your administrator asks you to take on an additional responsibility during your prep time. They say: 'I know you're busy, but we really need someone to cover this, and you're the best person for it. Can you do this for us? It would really help.'",
      personName: "Your Administrator",
      responses: [
        {
          id: 'dismissive',
          label: 'Dismissive Response',
          description: "No, I can't. I need my prep time, and you can't just add responsibilities whenever you want.",
          statement: "No, I can't do that. I need my prep time for lesson planning, and you can't just keep adding responsibilities. This isn't fair to me or my students.",
          reaction: {
            title: "Dismissive Response",
            outcome: "Your administrator seems frustrated and defensive. They respond: 'I'm just trying to solve a problem here. Can't you help out?' The relationship becomes strained, and while you protect your time, the interaction feels adversarial. Future collaboration becomes more difficult.",
            emoji: "😠",
            color: "from-red-500 to-rose-600",
            bgColor: "from-red-50 to-rose-50",
            borderColor: "border-red-400",
            tone: 45,
            clarity: 75,
            empathy: 25
          },
          feedback: {
            tone: "The tone is firm but lacks warmth and understanding. While boundaries are maintained, the administrator feels dismissed rather than heard.",
            clarity: "The message is clear about your limits, but it doesn't acknowledge their need or create space for dialogue about solutions.",
            overall: "This response maintains boundaries but lacks empathy. Administrators need to feel heard even when you can't accommodate requests. Balancing empathy with firmness creates better outcomes."
          }
        },
        {
          id: 'empathetic-firm',
          label: 'Empathetic & Firm Response',
          description: "I hear you, and here's what we can do. I understand the need, and let's find a solution that works for both of us.",
          statement: "I hear you, and I understand you need coverage—that's a real challenge. I appreciate that you thought of me. My prep time is essential for preparing quality lessons for my students, and I need to protect that. Let's explore alternatives: could we find someone else, or could this be scheduled at a different time? I'm willing to help find a solution that works for everyone.",
          reaction: {
            title: "Empathetic & Firm Response",
            outcome: "Your administrator appreciates your response. They say: 'Thank you for understanding. Let's explore those alternatives together.' You have a productive conversation, find a solution that works for both of you, and maintain your boundaries. The relationship remains respectful, and you're seen as collaborative while protecting your needs.",
            emoji: "🤝",
            color: "from-red-500 to-rose-600",
            bgColor: "from-red-50 to-rose-50",
            borderColor: "border-red-400",
            tone: 95,
            clarity: 100,
            empathy: 100
          },
          feedback: {
            tone: "Perfect! 'I hear you, and here's what we can do' acknowledges their need while maintaining your boundaries. The tone is respectful and collaborative.",
            clarity: "The message clearly acknowledges their need, explains your limits, and offers alternatives. This creates structure and invites collaborative problem-solving.",
            overall: "Excellent balance! You validated their need while maintaining your boundaries and offering solutions. This approach builds respect and preserves relationships while protecting your time and well-being."
          }
        },
        {
          id: 'passive',
          label: 'Passive Response',
          description: "Okay, I'll do it. I'll figure out a way to manage.",
          statement: "Okay, I'll figure out a way to manage. I can do it, even though it's challenging. I'll just work harder to get everything done.",
          reaction: {
            title: "Passive Response",
            outcome: "Your administrator seems satisfied, but you feel resentful and overburdened. You work during lunch, after school, and at home to keep up. The additional responsibility becomes a pattern, and you burn out. Your boundaries erode, and you struggle to maintain quality in your primary responsibilities.",
            emoji: "😔",
            color: "from-red-500 to-rose-600",
            bgColor: "from-red-50 to-rose-50",
            borderColor: "border-red-400",
            tone: 50,
            clarity: 55,
            empathy: 70
          },
          feedback: {
            tone: "The tone is agreeable and accommodating, which shows collaboration, but it lacks the firmness needed to maintain healthy boundaries.",
            clarity: "The message is clear about agreeing, but it doesn't communicate your limits or need for prep time. This can lead to burnout.",
            overall: "This response shows empathy and willingness to help, but it lacks boundaries. While it may please the administrator immediately, it doesn't protect your time or well-being long-term."
          }
        }
      ],
      correctResponse: 'empathetic-firm'
    },
    {
      id: 5,
      title: "Student Emotional Outburst",
      type: "student",
      situation: "A student has an emotional outburst in class after receiving feedback. They say: 'This is so unfair! I tried my best, and you're always criticizing me. You don't like me, and you're being mean!' They're crying and clearly distressed.",
      personName: "Your Student",
      responses: [
        {
          id: 'dismissive',
          label: 'Dismissive Response',
          description: "This isn't about fairness. The feedback is accurate, and you need to accept it and move on.",
          statement: "This isn't about fairness or whether I like you. The feedback is based on your work, and you need to accept it and use it to improve. Let's focus on moving forward.",
          reaction: {
            title: "Dismissive Response",
            outcome: "The student becomes more upset and shuts down. They respond: 'You don't understand! You're not listening!' The student feels dismissed and unsupported, trust is damaged, and they're less likely to engage in learning. The relationship suffers, and the student's emotional needs aren't addressed.",
            emoji: "😤",
            color: "from-red-500 to-rose-600",
            bgColor: "from-red-50 to-rose-50",
            borderColor: "border-red-400",
            tone: 40,
            clarity: 70,
            empathy: 30
          },
          feedback: {
            tone: "The tone is matter-of-fact but lacks warmth and emotional understanding. While the message may be accurate, the student feels dismissed rather than supported.",
            clarity: "The message is clear about feedback, but it doesn't acknowledge their emotional distress or create space for processing feelings.",
            overall: "This response maintains professional standards but lacks emotional empathy. Students need to feel heard and supported emotionally, even when feedback needs to be maintained. Balancing empathy with firmness creates better outcomes."
          }
        },

        {
          id: 'passive',
          label: 'Passive Response',
          description: "I'm so sorry. Let me change your grade. I didn't mean to upset you.",
          statement: "I'm so sorry you're upset. You're right—I shouldn't have been so critical. Let me change your grade and make this better for you. I don't want you to feel bad.",
          reaction: {
            title: "Passive Response",
            outcome: "The student seems relieved initially, but they don't learn from the feedback or develop resilience. Other students notice the grade change and question fairness. You feel uncertain about providing honest feedback, and the situation creates inconsistency. The student doesn't develop skills to handle feedback, and learning is compromised.",
            emoji: "😓",
            color: "from-red-500 to-rose-600",
            bgColor: "from-red-50 to-rose-50",
            borderColor: "border-red-400",
            tone: 60,
            clarity: 45,
            empathy: 85
          },
          feedback: {
            tone: "The tone is warm and caring, which shows empathy, but it lacks the firmness needed to support learning and growth.",
            clarity: "The message is unclear about feedback purposes and boundaries. Changing grades without addressing feedback undermines learning and fairness.",
            overall: "This response shows emotional empathy but compromises educational standards. While it may resolve immediate distress, it doesn't support long-term learning or emotional resilience."
          }
        },
        {
          id: 'empathetic-firm',
          label: 'Empathetic & Firm Response',
          description: "I hear you, and here's what we can do. I see you're upset, and let's talk about how we can move forward together.",
          statement: "I hear you, and I can see you're really upset—that's hard. I want you to know that my feedback comes from caring about your growth, not from being mean. Your feelings are valid, and I understand this is difficult. Let's take a moment to breathe, and then we can talk about the feedback and how we can work together to help you succeed. I'm here to support you.",
          reaction: {
            title: "Empathetic & Firm Response",
            outcome: "The student's energy begins to calm. They respond: 'Okay... I just feel like I can't do anything right.' You have a supportive conversation, validate their feelings, and explain the feedback in a way that feels constructive rather than critical. The student feels heard and supported, and you maintain your professional standards. The relationship improves, and the student is more open to feedback in the future.",
            emoji: "💙",
            color: "from-red-500 to-rose-600",
            bgColor: "from-red-50 to-rose-50",
            borderColor: "border-red-400",
            tone: 95,
            clarity: 95,
            empathy: 100
          },
          feedback: {
            tone: "Perfect! 'I hear you, and here's what we can do' validates emotional distress while maintaining boundaries. The tone is warm, supportive, and clear.",
            clarity: "The message acknowledges their feelings, explains the purpose of feedback, and outlines a path forward. This creates structure and emotional support.",
            overall: "Excellent balance! You validated their emotional experience while maintaining professional standards and inviting collaboration. This approach builds trust, supports emotional regulation, and maintains learning goals."
          }
        },
      ],
      correctResponse: 'empathetic-firm'
    }
  ];

  const handleResponseSelect = (responseId) => {
    if (selectedResponse[currentScenario]) return; // Already answered

    setSelectedResponse(prev => ({
      ...prev,
      [currentScenario]: responseId
    }));

    setShowReaction(true);
  };

  const handleNext = () => {
    if (showReaction && !showFeedback) {
      setShowFeedback(true);
    } else {
      setShowReaction(false);
      setShowFeedback(false);

      if (currentScenario < totalLevels - 1) {
        setCurrentScenario(prev => prev + 1);
      } else {
        // Calculate final score
        const empatheticCount = Object.values(selectedResponse).filter(
          (response, idx) => scenarios[idx].correctResponse === response
        ).length;
        setScore(empatheticCount);
        setShowGameOver(true);
      }
    }
  };

  const current = scenarios[currentScenario];
  const selected = selectedResponse[currentScenario];
  const selectedResponseData = selected ? current.responses.find(r => r.id === selected) : null;
  const progress = ((currentScenario + 1) / totalLevels) * 100;

  return (
    <TeacherGameShell
      title={gameData?.title || "Empathetic Dialogue Roleplay"}
      subtitle={gameData?.description || "Balance empathy with firmness in communication"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentScenario}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        <motion.div
          key={currentScenario}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Scenario {currentScenario + 1} of {totalLevels}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
              />
            </div>
          </div>

          {!showReaction && (
            <>
              {/* Scenario Card */}
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">{current.type}</p>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {current.title}
                    </h2>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 mb-2">{current.personName} says:</p>
                      <p className="text-gray-700 leading-relaxed italic text-lg">
                        "{current.situation}"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-200">
                  <p className="text-sm text-amber-800">
                    <strong>Your task:</strong> Choose a response that balances empathy with firmness. Think about how "I hear you, and here's what we can do" blends warmth with direction.
                  </p>
                </div>
              </div>

              {/* Response Options */}
              <div className="space-y-4 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Scale className="w-6 h-6 text-indigo-600" />
                  Choose Your Response:
                </h3>
                {current.responses.map((response, index) => (
                  <motion.button
                    key={response.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleResponseSelect(response.id)}
                    className={`w-full p-6 rounded-xl border-2 ${response.id === 'empathetic-firm'
                        ? 'border-red-300 bg-gradient-to-br from-red-50 to-rose-50'
                        : response.id === 'dismissive'
                          ? 'border-red-300 bg-gradient-to-br from-red-50 to-rose-50'
                          : 'border-red-300 bg-gradient-to-br from-red-50 to-rose-50'
                      } hover:shadow-lg transition-all text-left`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${response.id === 'empathetic-firm'
                          ? 'bg-gradient-to-r from-red-400 to-rose-500'
                          : response.id === 'dismissive'
                            ? 'bg-gradient-to-r from-red-400 to-rose-500'
                            : 'bg-gradient-to-r from-red-400 to-rose-500'
                        }`}>
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 mb-2">{response.label}</h4>
                        <p className="text-gray-700 leading-relaxed italic mb-2">
                          "{response.statement}"
                        </p>
                        <p className="text-sm text-gray-600">{response.description}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </>
          )}

          {/* Reaction/Outcome */}
          {showReaction && selectedResponseData && !showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-6"
            >
              <div className={`bg-gradient-to-br ${selectedResponseData.reaction.bgColor} rounded-xl p-6 border-2 ${selectedResponseData.reaction.borderColor} mb-6`}>
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">{selectedResponseData.reaction.emoji}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedResponseData.reaction.title}
                  </h3>
                </div>
                <div className="bg-white/60 rounded-lg p-5">
                  <p className="text-gray-800 leading-relaxed text-lg mb-4">
                    <strong>{current.personName} responds:</strong> {selectedResponseData.reaction.outcome}
                  </p>
                </div>
              </div>

              {/* Tone & Clarity Meters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-800">Tone</span>
                    <span className="text-lg font-bold text-blue-600">{selectedResponseData.reaction.tone}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedResponseData.reaction.tone}%` }}
                      className={`h-3 rounded-full ${selectedResponseData.reaction.tone >= 80
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                          : selectedResponseData.reaction.tone >= 50
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                            : 'bg-gradient-to-r from-red-400 to-rose-500'
                        }`}
                    />
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-purple-800">Clarity</span>
                    <span className="text-lg font-bold text-purple-600">{selectedResponseData.reaction.clarity}%</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedResponseData.reaction.clarity}%` }}
                      className={`h-3 rounded-full ${selectedResponseData.reaction.clarity >= 80
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                          : selectedResponseData.reaction.clarity >= 50
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                            : 'bg-gradient-to-r from-red-400 to-rose-500'
                        }`}
                    />
                  </div>
                </div>
                <div className="bg-pink-50 rounded-lg p-4 border-2 border-pink-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-pink-800">Empathy</span>
                    <span className="text-lg font-bold text-pink-600">{selectedResponseData.reaction.empathy}%</span>
                  </div>
                  <div className="w-full bg-pink-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedResponseData.reaction.empathy}%` }}
                      className={`h-3 rounded-full ${selectedResponseData.reaction.empathy >= 80
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                          : selectedResponseData.reaction.empathy >= 50
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                            : 'bg-gradient-to-r from-red-400 to-rose-500'
                        }`}
                    />
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
                  View Feedback
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Feedback */}
          {showFeedback && selectedResponseData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-6"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                Feedback Analysis
              </h3>

              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-5 border-2 border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Tone Feedback
                  </h4>
                  <p className="text-blue-800 leading-relaxed">{selectedResponseData.feedback.tone}</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-5 border-2 border-purple-200">
                  <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Clarity Feedback
                  </h4>
                  <p className="text-purple-800 leading-relaxed">{selectedResponseData.feedback.clarity}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border-2 border-green-200">
                  <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Overall Feedback
                  </h4>
                  <p className="text-green-800 leading-relaxed font-semibold">{selectedResponseData.feedback.overall}</p>
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
                💬✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Empathetic Dialogue Roleplay Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You practiced balancing empathy with firmness in {totalLevels} scenarios
              </p>
            </div>

            {/* Score Summary */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Empathetic & Firm Responses</h3>
                <div className="text-5xl font-bold mb-2 text-indigo-600">
                  {score} / {totalLevels}
                </div>
                <p className="text-gray-700">
                  {Math.round((score / totalLevels) * 100)}% of scenarios balanced empathy with firmness
                </p>
              </div>
            </div>

            {/* Key Learnings */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Key Principles of Empathetic Dialogue
              </h3>
              <ul className="space-y-2 text-green-800">
                <li>• <strong>"I hear you, and here's what we can do":</strong> This phrase blends warmth with direction, acknowledging feelings while maintaining boundaries.</li>
                <li>• <strong>Validate feelings first:</strong> Acknowledge emotions before addressing content. This creates connection and reduces defensiveness.</li>
                <li>• <strong>Maintain boundaries:</strong> Empathy doesn't mean compromising standards or boundaries. You can understand while staying firm.</li>
                <li>• <strong>Offer direction:</strong> After acknowledging feelings, provide clear next steps or alternatives. This creates structure and solutions.</li>
                <li>• <strong>Invite collaboration:</strong> Empathetic dialogue invites partnership rather than creating adversarial dynamics.</li>
                <li>• <strong>Balance warmth and clarity:</strong> Tone matters. Warmth builds connection, clarity maintains boundaries and direction.</li>
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
                    <strong>Use "I hear you, and here's what we can do" phrasing to blend warmth with direction.</strong> This approach balances empathy with firmness:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>"I hear you":</strong> Validates feelings and shows understanding. This creates connection and reduces defensiveness. People need to feel heard before they can engage in problem-solving.</li>
                    <li><strong>"And here's what we can do":</strong> Provides direction and maintains boundaries. After acknowledging feelings, offer clear next steps or alternatives. This creates structure and solutions.</li>
                    <li><strong>Practice the phrase:</strong> Use this phrasing in daily conversations with colleagues, students, and parents. It becomes natural with practice.</li>
                    <li><strong>Tailor to context:</strong> Adapt the phrase to different situations: "I hear your concern, and here's how we can address it" or "I understand this is difficult, and here's what we can do together."</li>
                    <li><strong>Balance is key:</strong> Don't skip the empathy (it builds connection), and don't skip the direction (it maintains boundaries). Both are essential.</li>
                    <li><strong>Maintain tone:</strong> Say this with warmth and respect, not dismissal or condescension. The tone communicates as much as the words.</li>
                    <li><strong>Follow through:</strong> When you say "here's what we can do," actually offer solutions or alternatives. Empty promises damage trust.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you use "I hear you, and here's what we can do" phrasing, you're creating a communication style that balances empathy with firmness. This approach validates feelings while maintaining boundaries, builds trust while providing direction, and resolves conflicts while preserving relationships. Practice this phrasing to make empathetic dialogue a natural part of your communication style.
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

export default EmpatheticDialogueRoleplay;