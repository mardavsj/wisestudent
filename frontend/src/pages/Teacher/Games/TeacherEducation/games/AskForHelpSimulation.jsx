import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { HelpCircle, CheckCircle, MessageCircle, TrendingUp, BookOpen, Users, Clock } from "lucide-react";

const AskForHelpSimulation = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-73";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;

  const totalLevels = gameData?.totalQuestions || 5;

  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState({});
  const [showResponse, setShowResponse] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Simulated contexts for asking for help
  const scenarios = [
    {
      id: 1,
      title: "Grading Overload",
      context: "You have 120 essays to grade this week, but you're also preparing for a major presentation, parent meetings, and catching up on lesson plans. You're feeling overwhelmed and behind schedule. A colleague mentioned they have some free time this week.",
      person: "Your Colleague",
      timing: "Mid-week, during a brief break",
      requests: [
        {
          id: 'apologetic',
          label: 'Apologetic Request',
          phrasing: "I'm so sorry to bother you, but could you maybe help me grade some papers? I know you're busy, and I hate asking, but I'm just so behind...",
          tone: 40,
          timing: 50,
          response: {
            text: "Oh, um, I guess I could help with a few. But I'm pretty busy too. How many are we talking about?",
            emotion: "hesitant",
            outcome: "The colleague agrees but seems hesitant. You feel guilty for asking, and the support feels conditional. The conversation is awkward."
          },
          feedback: {
            tone: "Apologetic language ('I'm sorry', 'I hate asking') communicates that asking for help is a burden. This creates guilt and makes others feel obligated rather than willing.",
            timing: "The timing was okay, but the apologetic tone makes the request feel like an imposition even when the timing is right.",
            overall: "While it's natural to feel hesitant about asking for help, excessive apologizing suggests that needing help is wrong. This weakens your request and creates guilt."
          }
        },

        {
          id: 'vague',
          label: 'Vague Request',
          phrasing: "Um, I'm kind of behind on some stuff. Could you maybe help me out sometime?",
          tone: 45,
          timing: 30,
          response: {
            text: "Sure, I guess? What kind of help do you need? When? I'm not really sure what you're asking for.",
            emotion: "confused",
            outcome: "The colleague agrees but is confused about what you need and when. The vague request creates uncertainty, and follow-up is awkward."
          },
          feedback: {
            tone: "Vague requests ('some stuff', 'sometime') don't communicate your needs clearly. This puts the burden on the other person to figure out what you need, which isn't helpful.",
            timing: "The timing isn't clear - 'sometime' doesn't give them information to plan. Being specific about timing helps others help you effectively.",
            overall: "Vague requests don't get effective help. Being specific about what you need, when you need it, and how they can help makes it easier for others to say yes and provide meaningful support."
          }
        },
        {
          id: 'demanding',
          label: 'Demanding Request',
          phrasing: "I need you to help me grade these essays. I have 120 to do, and I can't handle it all. You have free time, so you should help me.",
          tone: 20,
          timing: 25,
          response: {
            text: "I, um, okay. I guess I can help. Let me check my schedule...",
            emotion: "uncomfortable and defensive",
            outcome: "The colleague agrees reluctantly but feels pressured and defensive. The relationship is strained, and you may feel guilty for being demanding. Future requests may be met with resistance."
          },
          feedback: {
            tone: "Demanding language ('you should', 'I need you to') creates pressure and obligation rather than willingness. This damages relationships and makes people resistant to helping.",
            timing: "The timing seems urgent, which can make others feel cornered. Giving people space to decide makes help more likely and relationships stronger.",
            overall: "Demanding requests may get short-term help but damage relationships long-term. People help more willingly when they feel respected and have choice, not obligation."
          }
        },
        {
          id: 'direct-polite',
          label: 'Direct & Polite Request',
          phrasing: "I'm dealing with a lot of grading this week and would appreciate some help if you have time. Would you be able to help grade about 20 essays? I can return the favor next time you need support.",
          tone: 90,
          timing: 85,
          response: {
            text: "Of course! I'd be happy to help. I have some free time tomorrow afternoon - does that work for you? And thanks for offering to help me next time, that's really thoughtful.",
            emotion: "willing and positive",
            outcome: "The colleague is happy to help, appreciates your reciprocity, and the conversation feels collaborative. You feel supported without guilt."
          },
          feedback: {
            tone: "Perfect! Direct and polite without apology. You stated your need clearly, acknowledged their time, and offered reciprocity. This communicates confidence and respect.",
            timing: "Good timing - mid-week gives them notice and flexibility. Asking before you're completely desperate also shows planning rather than crisis management.",
            overall: "This approach builds professional respect. You're clear about your needs, respectful of others' time, and offer mutual support. This creates positive relationships and makes help more likely."
          }
        },
      ],
      correctRequest: 'direct-polite'
    },
    {
      id: 2,
      title: "Classroom Tech Failure",
      context: "Your smartboard stopped working right before your most important lesson of the week. The IT department is busy, and you need to teach in 15 minutes. You see a colleague who's tech-savvy and currently free.",
      person: "Tech-Savvy Colleague",
      timing: "Urgent - 15 minutes before class",
      requests: [
        {
          id: 'panicked',
          label: 'Panicked Request',
          phrasing: "Oh my god, my smartboard is broken and I don't know what to do! Can you come fix it right now? I'm about to teach and everything is ruined!",
          tone: 35,
          timing: 40,
          response: {
            text: "Okay, okay, let me see what I can do. Take a breath. I'll try to help, but I'm not sure I can fix it in 15 minutes.",
            emotion: "stressed",
            outcome: "The colleague helps but feels stressed by your panic. The situation feels chaotic, and if they can't fix it, you may blame them."
          },
          feedback: {
            tone: "Panic ('oh my god', 'everything is ruined') creates stress for both of you. This makes problem-solving harder and puts pressure on the helper.",
            timing: "The urgent timing requires immediate help, but panicked requests make others feel stressed rather than helpful. Calm requests in urgent situations are more effective.",
            overall: "Even in urgent situations, calm and clear requests get better results. Panic spreads stress, while calm communicates confidence and makes help more effective."
          }
        },

        {
          id: 'guilty',
          label: 'Guilt-Laden Request',
          phrasing: "I'm so sorry to ask, I know it's last minute, and I feel terrible, but my smartboard broke. I hate bothering you, but I'm desperate. Could you possibly help? I'm so sorry...",
          tone: 50,
          timing: 45,
          response: {
            text: "It's okay, it's okay. I'll help you. But try not to worry so much - asking for help is fine. Let me take a look.",
            emotion: "slightly uncomfortable",
            outcome: "The colleague helps but spends energy reassuring you that it's okay to ask. You feel guilty, and they may feel drained by managing your guilt."
          },
          feedback: {
            tone: "Excessive apology ('I'm so sorry', 'I hate bothering you', 'I feel terrible') communicates that asking is wrong. This creates guilt and makes helpers feel responsible for your emotions.",
            timing: "The timing requires urgency, but guilt makes the request feel heavier. Clear, direct requests work better even in urgent situations.",
            overall: "Guilt-laden requests get help but at the cost of relationship quality. Asking confidently communicates that needing help is normal, which builds respect."
          }
        },
        {
          id: 'calm-direct',
          label: 'Calm & Direct Request',
          phrasing: "My smartboard stopped working and I teach in 15 minutes. I know this is last-minute, but could you take a quick look and see if there's an easy fix? If not, I'll adapt my lesson, but any help would be great.",
          tone: 90,
          timing: 80,
          response: {
            text: " Let me take a look right away. I'll do my best to get it working, and if not, I can help you adapt your lesson quickly.",
            emotion: "helpful and calm",
            outcome: "The colleague is willing to help immediately, appreciates your flexibility, and feels good about assisting. Even if they can't fix it, you both feel supported."
          },
          feedback: {
            tone: "Excellent! Calm and direct even in urgency. You acknowledged the last-minute nature, stated your need clearly, and showed flexibility. This makes help more likely.",
            timing: "While urgent, you acknowledged the timing challenge and showed flexibility. This makes others more willing to help, even with short notice.",
            overall: "Perfect approach for urgent requests! Calm communication, clear need, and flexibility make others willing to help. This builds respect and relationships."
          }
        },
        {
          id: 'demanding-urgent',
          label: 'Demanding Urgent Request',
          phrasing: "My smartboard is broken. I need you to fix it now. I teach in 15 minutes, so hurry up.",
          tone: 15,
          timing: 20,
          response: {
            text: "I'll try, but I can't guarantee anything. You really should have checked it earlier. Let me see what I can do.",
            emotion: "resentful",
            outcome: "The colleague helps but feels resentful and defensive. They may not help as effectively, and future requests may be met with resistance."
          },
          feedback: {
            tone: "Demanding language ('I need you to', 'hurry up') creates resentment and defensiveness. This makes help less effective and damages relationships.",
            timing: "Urgent timing requires patience and appreciation, not demands. Demanding urgent requests make others feel used rather than helpful.",
            overall: "Demanding urgent requests may get technical help but damage relationships. Respectful requests, even in urgency, maintain professional relationships."
          }
        }
      ],
      correctRequest: 'calm-direct'
    },
    {
      id: 3,
      title: "Burnout Week",
      context: "This has been an incredibly stressful week - parent complaints, difficult students, and personal issues at home. You're feeling burned out and exhausted. You know you need support, but you're hesitant to ask. Your administrator mentioned checking in if you need anything.",
      person: "Your Administrator",
      timing: "End of the week, after regular hours",
      requests: [
        {
          id: 'minimizing',
          label: 'Minimizing Request',
          phrasing: "I'm fine, really. I just had a tough week, but it's nothing. I don't want to bother you, but maybe could you help with something small?",
          tone: 50,
          timing: 40,
          response: {
            text: "It sounds like you've had a challenging week. What kind of help are you thinking about? I'm here to support you.",
            emotion: "concerned",
            outcome: "The administrator is willing to help but has to work to understand what you actually need. Your minimizing makes it harder to get effective support."
          },
          feedback: {
            tone: "Minimizing your needs ('I'm fine', 'it's nothing') makes it harder for others to help effectively. They have to work harder to understand what you actually need.",
            timing: "End of week is reasonable, but minimizing your request makes the timing feel uncertain. Clear communication about needs helps others help you.",
            overall: "Minimizing requests makes help less effective. Being honest about your needs allows others to provide meaningful support and builds trust."
          }
        },
        {
          id: 'honest-polite',
          label: 'Honest & Polite Request',
          phrasing: "I've had a really challenging week with multiple stressors, and I'm feeling burned out. I would appreciate some support. Could we discuss how to manage my workload or get some additional resources?",
          tone: 95,
          timing: 90,
          response: {
            text: " Thank you for being honest about needing support - that takes strength. Let's talk about what would help. I'm here to support you, and we can work on solutions together.",
            emotion: "appreciative and supportive",
            outcome: "The administrator appreciates your honesty and professionalism. You feel heard and supported, and practical solutions are discussed. Your professional respect increases."
          },
          feedback: {
            tone: "Perfect! Honest and professional. You communicated your needs clearly without apology, which shows self-awareness and builds respect. This is how professionals handle challenges.",
            timing: "End of week timing allows for planning and discussion without crisis. This shows professionalism and planning rather than desperation.",
            overall: "Excellent approach! Honest requests for support build professional respect. Admitting you need help shows self-awareness, not weakness. This creates supportive relationships and effective solutions."
          }
        },
        {
          id: 'overwhelmed',
          label: 'Overwhelmed Request',
          phrasing: "I can't do this anymore. Everything is falling apart, and I'm completely overwhelmed. I need help, and I don't know what to do. Can you fix this?",
          tone: 60,
          timing: 55,
          response: {
            text: "I understand this has been difficult. Let's talk through what's happening and figure out how to support you. What specific challenges are you facing?",
            emotion: "caring but needing clarity",
            outcome: "The administrator wants to help but needs more information. The emotional overwhelm makes it harder to identify specific solutions. Support is offered but less targeted."
          },
          feedback: {
            tone: "While expressing overwhelm is valid, being too emotional without specifics makes it harder to get targeted help. Clear communication about needs leads to better solutions.",
            timing: "The timing is okay, but emotional overwhelm makes the conversation less focused. Taking time to identify specific needs before asking can help.",
            overall: "Expressing overwhelm is okay, but combining it with specific requests for help makes support more effective. Clear communication, even when stressed, builds professional respect."
          }
        },
        {
          id: 'avoidant',
          label: 'Avoidant / No Request',
          phrasing: "I'm managing, thanks. I'll figure it out. Don't worry about me.",
          tone: 30,
          timing: 20,
          response: {
            text: "Okay, but please reach out if you need anything. I'm here to help if you change your mind.",
            emotion: "concerned but respecting boundaries",
            outcome: "The administrator respects your answer but remains concerned. You don't get support, and burnout continues. The opportunity for help passes."
          },
          feedback: {
            tone: "Avoiding asking for help doesn't solve problems. While it may feel easier in the moment, it prevents getting support when you need it most.",
            timing: "By not asking, you miss the opportunity for support. When administrators offer help, it's an appropriate time to communicate needs.",
            overall: "Avoiding requests for help prolongs suffering. Asking for help, even when it's uncomfortable, is professional and builds supportive relationships. Support is available when you ask."
          }
        }
      ],
      correctRequest: 'honest-polite'
    },
    {
      id: 4,
      title: "Lesson Planning Support",
      context: "You're teaching a new curriculum this semester and struggling to adapt your lesson plans. A colleague who taught this curriculum last year has offered to help. You want to ask for their support but don't want to seem unprepared or incompetent.",
      person: "Experienced Colleague",
      timing: "Beginning of semester, during prep time",
      requests: [
        {
          id: 'confident-collaborative',
          label: 'Confident & Collaborative Request',
          phrasing: "I'm adapting to the new curriculum and would value your expertise. Could we collaborate on lesson planning? I'd love to learn from your experience and work together on creating effective lessons.",
          tone: 95,
          timing: 90,
          response: {
            text: "I'd love to collaborate. I learned a lot last year, and I'm happy to share. Working together will make both our lessons better. When would be a good time?",
            emotion: "enthusiastic and collaborative",
            outcome: "The colleague is excited to collaborate, sees it as mutual learning, and a professional partnership forms. You both benefit, and your professional respect grows."
          },
          feedback: {
            tone: "Perfect! Framing it as collaboration and valuing their expertise shows confidence and respect. This approach builds professional relationships and mutual learning.",
            timing: "Beginning of semester is ideal - early support prevents struggles later. Good timing shows planning and professionalism.",
            overall: "Excellent! Framing help requests as collaboration shows professional confidence. Recognizing that learning from colleagues is normal and valuable builds respect and creates partnerships."
          }
        },
        {
          id: 'insecure',
          label: 'Insecure Request',
          phrasing: "I know I should know this, but I'm really struggling. I feel like I should be able to figure it out myself, but I just can't. Could you help me even though I probably should know this already?",
          tone: 45,
          timing: 60,
          response: {
            text: "Of course I can help. Don't worry - everyone struggles with new curriculum. It's completely normal to need support. Let's work through it together.",
            emotion: "reassuring",
            outcome: "The colleague helps but spends energy reassuring you that needing help is normal. You feel slightly better but still insecure about asking."
          },
          feedback: {
            tone: "Insecure language ('I should know this', 'I probably should be able to') suggests that needing help is a weakness. This creates guilt and makes asking harder.",
            timing: "Beginning of semester is perfect timing for support. But insecurity makes the request feel heavier than it needs to be.",
            overall: "Insecurity about asking for help makes the request uncomfortable for everyone. Recognizing that needing help is normal and professional makes requests easier."
          }
        },

        {
          id: 'deferential',
          label: 'Overly Deferential Request',
          phrasing: "I'm so sorry to bother you. I know you're busy, and I hate to ask, but I'm completely lost with this curriculum. Could you maybe spare a few minutes? I feel terrible asking...",
          tone: 50,
          timing: 50,
          response: {
            text: "It's really okay - I'm happy to help. Please don't feel bad about asking. That's what colleagues are for. Let's work on it together.",
            emotion: "caring but having to reassure",
            outcome: "The colleague helps but spends energy managing your guilt. You get support but feel guilty, and the relationship dynamic is unbalanced."
          },
          feedback: {
            tone: "Overly deferential language creates guilt and makes others manage your emotions rather than just helping. This drains relationships and makes asking harder.",
            timing: "The timing is fine, but guilt makes the request feel heavier. Confident requests work better even when you feel uncertain.",
            overall: "Excessive deference may get help but damages professional confidence. Asking confidently, even when uncertain, shows professional maturity and builds respect."
          }
        },
        {
          id: 'entitled',
          label: 'Entitled Request',
          phrasing: "You taught this curriculum last year, so you should help me. I need your lesson plans and materials. Can you send them to me today?",
          tone: 25,
          timing: 30,
          response: {
            text: "I can help, but I'd prefer to collaborate rather than just hand over materials. Let's work together on adapting them. Does that work for you?",
            emotion: "slightly defensive",
            outcome: "The colleague offers conditional help but feels defensive about demands. The relationship is strained, and future collaboration is less likely."
          },
          feedback: {
            tone: "Entitled language ('you should', demanding tone) creates defensiveness and damages relationships. This makes help less likely and collaboration difficult.",
            timing: "Even good timing doesn't help when the tone is demanding. Respectful requests work better regardless of timing.",
            overall: "Entitled requests damage professional relationships. Even if you get materials, you lose the opportunity for collaboration and mutual learning that builds respect."
          }
        }
      ],
      correctRequest: 'confident-collaborative'
    }
  ];

  // Adding a fifth scenario
  scenarios.push({
    id: 5,
    title: "Professional Development Opportunity",
    context: "Your district announced a prestigious professional development workshop that could advance your career, but it requires release time from your principal. You need to ask for their support and approval.",
    person: "Your Principal",
    timing: "During scheduled office hours, with advance notice",
    requests: [
      {
        id: 'undervaluing',
        label: 'Undervaluing Request',
        phrasing: "I know this isn't a big deal, but there's this workshop thing that might be useful. If you have time and it's not too much trouble, maybe I could attend?",
        tone: 35,
        timing: 40,
        response: {
          text: "Well, if it's really not a big deal to you, then it might not be worth the substitute cost. Maybe next time when it's more important.",
          emotion: "dismissive",
          outcome: "The principal questions the value of the opportunity based on your own dismissal of it. You miss the chance because you didn't advocate for yourself properly."
        },
        feedback: {
          tone: "Undervaluing language ('not a big deal', 'thing') suggests the opportunity isn't worthwhile. This gives the principal permission to dismiss your request.",
          timing: "While the timing is appropriate, undervaluing the opportunity makes it seem less important than it is.",
          overall: "Undervaluing requests makes others question the importance of what you're asking for. This undermines your own case and makes support less likely."
        }
      },
      {
        id: 'confident-professional',
        label: 'Confident & Professional Request',
        phrasing: "I'd like to apply for the Advanced Pedagogy Workshop. It aligns with our school's goals and could significantly benefit my teaching practice. The release time would be Friday morning, and I'd need to arrange coverage. Would you consider supporting my application?",
        tone: 95,
        timing: 90,
        response: {
          text: "That sounds excellent! Professional development aligned with our goals is exactly what we want to support. Yes, I'd be happy to approve your application."
        },
        outcome: "The principal appreciates your initiative and alignment with school goals. You receive enthusiastic support and the opportunity to grow professionally.",
        feedback: {
          tone: "Perfect! Confident and professional. You clearly stated the value, aligned with school goals, and made a clear request. This demonstrates initiative and professional growth mindset.",
          timing: "Great timing with advance notice. This shows planning and consideration for the administrative process. It allows time for decision-making.",
          overall: "Excellent approach! You demonstrated the value, showed alignment with institutional goals, and made a clear request. This approach builds respect and gets support."
        }
      },
      {
        id: 'desperate-demand',
        label: 'Desperate Demand',
        phrasing: "I absolutely need to go to this workshop. It's make or break for my career, and I have to go. I don't care about coverage or anything - just approve it. I'll figure out the rest myself.",
        tone: 25,
        timing: 30,
        response: {
          text: "I understand you're passionate, but I can't approve something without considering the logistics. We need to discuss coverage and alignment with our goals first.",
          emotion: "cautious",
          outcome: "The principal is hesitant to approve your request because of the demanding tone and lack of consideration for school logistics. Your desperation creates concern."
        },
        feedback: {
          tone: "Demanding language ('absolutely need', 'make or break') creates pressure and ignores the collaborative nature of the decision. This makes others feel pushed rather than asked.",
          timing: "Even with good timing, demanding requests feel heavy-handed. Respectful requests work better than demands, regardless of timing.",
          overall: "Demanding requests, even for important opportunities, create resistance. Professional requests with clear value statements work better than demands."
        }
      },
      {
        id: 'overly-formal',
        label: 'Overly Formal Request',
        phrasing: "Most esteemed principal, I humbly submit this request for your gracious consideration regarding a professional development opportunity that may prove beneficial. If it pleases you to grant me the privilege of attendance...",
        tone: 50,
        timing: 45,
        response: {
          text: "I appreciate the formality, but I need to understand the practical details and benefits. Can you tell me more about the workshop and how it connects to our goals?",
          emotion: "confused",
          outcome: "The principal is unsure how to respond to the overly formal tone and misses the practical information needed to make a decision."
        },
        feedback: {
          tone: "Overly formal language creates distance and makes it hard to connect. Professional doesn't mean flowery - clear, direct language works better.",
          timing: "The timing is fine, but the formal tone makes the request feel artificial. Natural professional language works better.",
          overall: "While professional respect is important, overly formal language obscures your message. Clear, confident language is more effective than elaborate formality."
        }
      }
    ],
    correctRequest: 'confident-professional'
  });

  const handleRequestSelect = (scenarioIndex, requestId) => {
    if (selectedRequest[scenarioIndex]) return; // Already answered

    const scenario = scenarios[scenarioIndex];
    const request = scenario.requests.find(r => r.id === requestId);

    setSelectedRequest(prev => ({
      ...prev,
      [scenarioIndex]: request
    }));

    setShowResponse(true);
  };

  const handleNext = () => {
    if (showResponse && !showFeedback) {
      setShowFeedback(true);
    } else {
      setShowResponse(false);
      setShowFeedback(false);

      if (currentScenario < totalLevels - 1) {
        setCurrentScenario(prev => prev + 1);
      } else {
        // Calculate final score
        const supportiveCount = Object.values(selectedRequest).filter(
          (request, idx) => scenarios[idx].correctRequest === request?.id
        ).length;
        setScore(supportiveCount);
        setShowGameOver(true);
      }
    }
  };

  const current = scenarios[currentScenario];
  const selected = selectedRequest[currentScenario];
  const progress = ((currentScenario + 1) / totalLevels) * 100;

  return (
    <TeacherGameShell
      title={gameData?.title || "Ask for Help Simulation"}
      subtitle={gameData?.description || "Practice requesting help without guilt or hesitation"}
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

          {!showResponse && (
            <>
              {/* Scenario Card */}
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <HelpCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">{current.context}</p>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {current.title}
                    </h2>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 mb-2">Context:</p>
                      <p className="text-gray-700 leading-relaxed text-lg mb-4">
                        {current.context}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span><strong>Timing:</strong> {current.timing}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-200">
                  <p className="text-sm text-amber-800">
                    <strong>Your task:</strong> Choose a request phrasing that is polite, clear, and confident. Think about tone and timing when making your choice.
                  </p>
                </div>
              </div>

              {/* Request Options */}
              <div className="space-y-4 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                  Choose Your Request Phrasing:
                </h3>
                {current.requests.map((request, index) => (
                  <motion.button
                    key={request.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleRequestSelect(currentScenario, request.id)}
                    className={`w-full p-6 rounded-xl border-2 text-left transition-all ${request.id === current.correctRequest
                        ? 'border-gray-300 bg-white hover:border-blue-300 hover:shadow-lg'
                        : 'border-gray-300 bg-white hover:border-blue-300 hover:shadow-lg'
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-green-400 to-emerald-500">
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 mb-2">{request.label}</h4>
                        <p className="text-gray-700 leading-relaxed italic">
                          "{request.phrasing}"
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </>
          )}

          {/* Simulated Response */}
          {showResponse && selected && !showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-6"
            >
              <div className={`bg-gradient-to-br rounded-xl p-6 border-2 mb-6 ${selected.tone >= 80
                  ? 'from-green-50 to-emerald-50 border-green-200'
                  : selected.tone >= 50
                    ? 'from-yellow-50 to-orange-50 border-yellow-200'
                    : 'from-red-50 to-rose-50 border-red-200'
                }`}>
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">{selected.tone >= 80 ? '💚' : selected.tone >= 50 ? '💛' : '💔'}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {current.person} Responds:
                  </h3>
                </div>
                <div className="bg-white/60 rounded-lg p-5 mb-4">
                  <p className="text-gray-800 leading-relaxed text-lg italic mb-4">
                    "{selected.response.text}"
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Emotion:</strong> {selected.response.emotion}
                  </p>
                </div>
                <div className="bg-blue-100 rounded-lg p-4 border border-blue-200">
                  <p className="text-blue-800 leading-relaxed">
                    <strong>Outcome:</strong> {selected.response.outcome}
                  </p>
                </div>
              </div>

              {/* Tone & Timing Meters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-800">Tone</span>
                    <span className="text-lg font-bold text-blue-600">{selected.tone}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selected.tone}%` }}
                      className={`h-3 rounded-full ${selected.tone >= 80
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                          : selected.tone >= 50
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                            : 'bg-gradient-to-r from-red-400 to-rose-500'
                        }`}
                    />
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-purple-800">Timing</span>
                    <span className="text-lg font-bold text-purple-600">{selected.timing}%</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selected.timing}%` }}
                      className={`h-3 rounded-full ${selected.timing >= 80
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                          : selected.timing >= 50
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
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  View Feedback
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Feedback */}
          {showFeedback && selected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-6"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Feedback Analysis
              </h3>

              <div className="space-y-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-5 border-2 border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Tone Feedback
                  </h4>
                  <p className="text-blue-800 leading-relaxed">{selected.feedback.tone}</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-5 border-2 border-purple-200">
                  <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Timing Feedback
                  </h4>
                  <p className="text-purple-800 leading-relaxed">{selected.feedback.timing}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border-2 border-green-200">
                  <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Overall Feedback
                  </h4>
                  <p className="text-green-800 leading-relaxed font-semibold">{selected.feedback.overall}</p>
                </div>
              </div>

              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
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
                🤝✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Ask for Help Simulation Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You practiced requesting help in {totalLevels} scenarios
              </p>
            </div>

            {/* Score Summary */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Confident Requests</h3>
                <div className="text-5xl font-bold mb-2 text-indigo-600">
                  {score} / {totalLevels}
                </div>
                <p className="text-gray-700">
                  {Math.round((score / totalLevels) * 100)}% of requests were confident and professional
                </p>
              </div>
            </div>

            {/* Key Principles */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Principles of Asking for Help
              </h3>
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Be direct and clear:</strong> State what you need specifically. Vague requests don't get effective help.</li>
                <li>• <strong>Avoid excessive apology:</strong> Needing help is normal. Apologizing excessively suggests it's wrong.</li>
                <li>• <strong>Show confidence:</strong> Asking confidently communicates professionalism and builds respect.</li>
                <li>• <strong>Offer reciprocity:</strong> When possible, offer to help in return. This creates mutual support.</li>
                <li>• <strong>Respect timing:</strong> Consider when you ask. Early requests are better than urgent demands.</li>
                <li>• <strong>Frame as collaboration:</strong> When appropriate, frame help as collaboration and mutual learning.</li>
                <li>• <strong>Be honest about needs:</strong> Don't minimize or exaggerate. Clear communication leads to better support.</li>
                <li>• <strong>Remain calm:</strong> Even in urgent situations, calm requests get better results than panicked ones.</li>
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
                    <strong>Reinforce that asking for help builds—not weakens—professional respect.</strong> Many teachers hesitate to ask for help because they fear it makes them look weak or incompetent. However, the opposite is true:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Asking for help shows self-awareness:</strong> Recognizing when you need support demonstrates professional maturity and self-awareness. This builds respect, not weakness.</li>
                    <li><strong>It shows you care about quality:</strong> When you ask for help to improve your teaching or manage workload, it shows you're committed to quality. This builds professional respect.</li>
                    <li><strong>It creates collaboration:</strong> Asking for help invites collaboration and builds relationships. Colleagues who help you develop positive connections that strengthen professional networks.</li>
                    <li><strong>It models healthy behavior:</strong> When you ask for help confidently, you model that needing support is normal. This creates a culture where others feel safe to ask too.</li>
                    <li><strong>It prevents burnout:</strong> Teachers who ask for help avoid burnout and stay in the profession longer. This builds respect for your long-term commitment.</li>
                    <li><strong>It shows problem-solving skills:</strong> Recognizing needs and reaching out for support is a problem-solving skill. This demonstrates professional competence.</li>
                    <li><strong>It builds trust:</strong> When you ask for help, you show vulnerability and trust. This builds deeper professional relationships and mutual respect.</li>
                    <li><strong>It's a sign of strength:</strong> It takes strength to acknowledge needs and ask for help. Weakness is struggling alone; strength is recognizing when support is needed.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you reinforce that asking for help builds—not weakens—professional respect, you're creating a culture where support is valued. This reduces teacher isolation, prevents burnout, builds collaboration, and creates a more sustainable teaching profession. Confident requests for help are a sign of professional maturity and strength, not weakness.
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

export default AskForHelpSimulation;