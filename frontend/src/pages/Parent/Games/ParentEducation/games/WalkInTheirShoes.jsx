import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const WalkInTheirShoes = () => {
  const location = useLocation();

  // Get game data
  const gameId = "parent-education-21";
  const gameData = getParentEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState({});
  const [showOutcome, setShowOutcome] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Scenarios from a child's perspective with 3 different response options
  const scenarios = [
    {
      id: 1,
      title: "Missed Homework",
      childPerspective: "You forgot to do your math homework last night. Your teacher asked for it this morning, and you don't have it. You feel your stomach drop and your face get hot. Everyone is looking at you.",
      childFeeling: "Fear, shame, anxiety",
      options: [
        {
          id: "empathetic",
          title: "Empathetic Response",
          subtitle: "Understand their perspective and connect",
          emoji: "🤝",
          colorClass: "from-blue-50 to-indigo-50 border-blue-300",
          selectedColorClass: "from-blue-50 to-indigo-50 border-blue-400",
          outcome: {
            title: "Empathetic Response",
            description: "You take a deep breath and say: 'I see you're worried about this. Forgetting happens. Let's talk about what we can do to make sure this doesn't happen again. Would it help if we set a reminder together?'",
            result: "Your child feels understood and supported. They open up about feeling overwhelmed. Together, you create a system that works. Your child learns responsibility through connection, not fear.",
            emoji: "🤝",
            color: "from-blue-400 to-indigo-500",
            bgColor: "from-blue-50 to-indigo-50",
            borderColor: "border-blue-300",
            emotionalOutcome: "Child feels: Supported, understood, capable"
          }
        },
        {
          id: "judgmental",
          title: "Judgmental Response",
          subtitle: "Focus on the behavior with criticism",
          emoji: "😠",
          colorClass: "from-orange-50 to-red-50 border-orange-300",
          selectedColorClass: "from-red-50 to-rose-50 border-red-400",
          outcome: {
            title: "Judgmental Response",
            description: "You say with frustration: 'Again? You always forget your homework! When are you going to learn to be responsible? You're going to fail if you keep this up.'",
            result: "Your child feels ashamed and defensive. They shut down and avoid talking to you. The homework problem continues, but now your child also feels like they're a failure. Trust is damaged.",
            emoji: "😢",
            color: "from-red-500 to-rose-600",
            bgColor: "from-red-50 to-rose-50",
            borderColor: "border-red-400",
            emotionalOutcome: "Child feels: Ashamed, defensive, like a failure"
          }
        },
        {
          id: "problemSolving",
          title: "Problem-Solving Approach",
          subtitle: "Focus on solutions and practical steps",
          emoji: "🔧",
          colorClass: "from-green-50 to-emerald-50 border-green-300",
          selectedColorClass: "from-green-50 to-emerald-50 border-green-400",
          outcome: {
            title: "Problem-Solving Approach",
            description: "You calmly say: 'I know forgetting homework is tough. Let's figure out a practical system to prevent this. Should we try a homework checklist or a timer for study time?'",
            result: "Your child feels supported in developing practical skills. They participate in creating a solution that works for them. The focus on tools and systems reduces anxiety and builds organizational skills.",
            emoji: "✅",
            color: "from-green-400 to-emerald-500",
            bgColor: "from-green-50 to-emerald-50",
            borderColor: "border-green-300",
            emotionalOutcome: "Child feels: Supported, capable, equipped with tools"
          }
        }
      ],
      correctChoice: "problemSolving",
      explanation: "While empathy is important, focusing on practical problem-solving gives your child concrete tools to handle the situation. This approach builds their sense of competence and independence."
    },
    {
      id: 2,
      title: "Social Rejection",
      childPerspective: "At school, your friends didn't save you a seat at lunch. They laughed at something and you didn't get the joke. You felt left out and awkward. You pretended to be busy on your phone, but you were really just trying not to cry.",
      childFeeling: "Loneliness, embarrassment, hurt",
      options: [
        {
          id: "empathetic",
          title: "Empathetic Response",
          subtitle: "Validate their feelings and listen",
          emoji: "💙",
          colorClass: "from-blue-50 to-indigo-50 border-blue-300",
          selectedColorClass: "from-blue-50 to-indigo-50 border-blue-400",
          outcome: {
            title: "Empathetic Response",
            description: "You notice their mood and sit with them quietly. You say: 'You seem sad today. Want to talk about what happened? Sometimes friendships can feel complicated, and that's really hard.'",
            result: "Your child feels seen and safe. They share what happened and you listen. Together, you discuss how friendships can be complicated. Your child feels less alone and more confident to handle social situations.",
            emoji: "💙",
            color: "from-blue-400 to-indigo-500",
            bgColor: "from-blue-50 to-indigo-50",
            borderColor: "border-blue-300",
            emotionalOutcome: "Child feels: Seen, safe, less alone"
          }
        },
        {
          id: "judgmental",
          title: "Judgmental Response",
          subtitle: "Dismiss their feelings",
          emoji: "😠",
          colorClass: "from-orange-50 to-red-50 border-orange-300",
          selectedColorClass: "from-red-50 to-rose-50 border-red-400",
          outcome: {
            title: "Judgmental Response",
            description: "You dismiss their feelings: 'Stop being so sensitive. Friendships aren't that big of a deal. You're making a mountain out of a molehill. Just find other friends if these ones don't want you.'",
            result: "Your child feels dismissed and even more alone. They learn that their feelings aren't valid. They stop sharing difficult experiences with you. The social pain continues, but now they're navigating it completely alone.",
            emoji: "😞",
            color: "from-red-500 to-rose-600",
            bgColor: "from-red-50 to-rose-50",
            borderColor: "border-red-400",
            emotionalOutcome: "Child feels: Dismissed, invalidated, alone"
          }
        },
        {
          id: "adviceGiving",
          title: "Give Advice",
          subtitle: "Offer solutions and guidance",
          emoji: "💡",
          colorClass: "from-yellow-50 to-amber-50 border-yellow-300",
          selectedColorClass: "from-yellow-50 to-amber-50 border-yellow-400",
          outcome: {
            title: "You Gave Helpful Advice",
            description: "You say: 'That sounds really painful. Here are some things that might help: try joining a club to meet like-minded friends, or ask someone if they'd like to eat together tomorrow. Social connections take time to build.'",
            result: "Your child appreciates the practical suggestions. They feel more confident about making new connections. While they still feel hurt, they have concrete steps to improve their social situation.",
            emoji: "🌟",
            color: "from-yellow-400 to-amber-500",
            bgColor: "from-yellow-50 to-amber-50",
            borderColor: "border-yellow-300",
            emotionalOutcome: "Child feels: Guided, hopeful, with actionable steps"
          }
        }
      ],
      correctChoice: "empathetic",
      explanation: "A child's social world is their whole world. When you validate their feelings first, you give them emotional tools to navigate relationships. They need to feel heard before they can hear advice."
    },
    {
      id: 3,
      title: "Fear of Scolding",
      childPerspective: "You accidentally broke mom's favorite coffee mug. It was an accident—you were reaching for a snack and it fell. You hid the pieces because you're scared she'll be really angry. You're worried she'll be disappointed in you.",
      childFeeling: "Fear, guilt, anxiety about disappointing parent",
      options: [
        {
          id: "empathetic",
          title: "Empathetic Response",
          subtitle: "Create safety and connection",
          emoji: "🛡️",
          colorClass: "from-blue-50 to-indigo-50 border-blue-300",
          selectedColorClass: "from-blue-50 to-indigo-50 border-blue-400",
          outcome: {
            title: "Empathetic Response",
            description: "You notice something's wrong and approach gently: 'I see you seem worried. Is everything okay? I'm here to listen, not judge. Even if something broke, we can work it out together.'",
            result: "Your child feels safe enough to tell the truth. You validate that accidents happen. Together, you clean up and maybe even pick out a new mug together. Your child learns that mistakes are manageable and that your relationship is stronger than any object.",
            emoji: "🛡️",
            color: "from-blue-400 to-indigo-500",
            bgColor: "from-blue-50 to-indigo-50",
            borderColor: "border-blue-300",
            emotionalOutcome: "Child feels: Safe, understood, loved unconditionally"
          }
        },
        {
          id: "judgmental",
          title: "Judgmental Response",
          subtitle: "React with anger and blame",
          emoji: "😠",
          colorClass: "from-orange-50 to-red-50 border-orange-300",
          selectedColorClass: "from-red-50 to-rose-50 border-red-400",
          outcome: {
            title: "Judgmental Response",
            description: "You discover the broken mug and react angrily: 'Why can't you be more careful? That was my favorite! You're so clumsy. You break everything. Now I can't have my coffee the way I like it because of you.'",
            result: "Your child feels like they're a burden and that things matter more than they do. They learn to hide mistakes and avoid telling you when things go wrong. Trust is broken, and your child feels like they're constantly walking on eggshells.",
            emoji: "😰",
            color: "from-red-500 to-rose-600",
            bgColor: "from-red-50 to-rose-50",
            borderColor: "border-red-400",
            emotionalOutcome: "Child feels: Like a burden, afraid, untrustworthy"
          }
        },
        {
          id: "consequence",
          title: "Set Consequences",
          subtitle: "Address the behavior with logical consequences",
          emoji: "⚖️",
          colorClass: "from-purple-50 to-violet-50 border-purple-300",
          selectedColorClass: "from-purple-50 to-violet-50 border-purple-400",
          outcome: {
            title: "You Set Logical Consequences",
            description: "You say: 'I see the mug broke. Accidents happen, but there are consequences. You'll need to save money for a replacement, and we'll make sure this doesn't happen again by keeping fragile items out of reach.'",
            result: "Your child understands that actions have consequences but that you still love them. They learn accountability without shame. The focus is on repair and prevention rather than punishment.",
            emoji: "⚖️",
            color: "from-purple-400 to-violet-500",
            bgColor: "from-purple-50 to-violet-50",
            borderColor: "border-purple-300",
            emotionalOutcome: "Child feels: Accountable, but still loved and respected"
          }
        }
      ],
      correctChoice: "consequence",
      explanation: "Setting logical consequences teaches accountability without shame. Children need to understand that actions have outcomes, but they also need to feel loved regardless. This approach balances responsibility with emotional security."
    },
    {
      id: 4,
      title: "Overwhelmed by Schoolwork",
      childPerspective: "You have three tests this week, a science project due, and you're supposed to practice piano. Every time you try to start one thing, you remember something else you have to do. Your brain feels fuzzy and you just want to hide under the covers.",
      childFeeling: "Overwhelmed, anxious, exhausted",
      options: [
        {
          id: "empathetic",
          title: "Empathetic Response",
          subtitle: "Validate feelings and offer support",
          emoji: "✨",
          colorClass: "from-blue-50 to-indigo-50 border-blue-300",
          selectedColorClass: "from-blue-50 to-indigo-50 border-blue-400",
          outcome: {
            title: "Empathetic Response",
            description: "You notice their stress and sit down with them: 'I can see you're feeling overwhelmed. That's a lot to handle at once. Let's break this down together. What feels most important right now? I'm here to help you figure this out.'",
            result: "Your child feels supported and less alone. You help them prioritize and create a plan. They learn organizational skills through collaboration. The workload feels manageable because they don't have to carry it alone. Your child feels capable again.",
            emoji: "✨",
            color: "from-blue-400 to-indigo-500",
            bgColor: "from-blue-50 to-indigo-50",
            borderColor: "border-blue-300",
            emotionalOutcome: "Child feels: Supported, capable, less overwhelmed"
          }
        },
        {
          id: "teaching",
          title: "Teach Coping Strategies",
          subtitle: "Show practical stress management techniques",
          emoji: "🧘",
          colorClass: "from-teal-50 to-cyan-50 border-teal-300",
          selectedColorClass: "from-teal-50 to-cyan-50 border-teal-400",
          outcome: {
            title: "You Taught Coping Strategies",
            description: "You say: 'Let's try a breathing exercise first to calm your mind. Then we'll make a schedule with breaks. I'll show you how to break big tasks into small steps. This is a skill that takes practice.'",
            result: "Your child learns practical stress management tools they can use throughout life. They feel empowered with strategies to handle overwhelm. The focus on skill-building reduces anxiety and builds confidence.",
            emoji: "🧘",
            color: "from-teal-400 to-cyan-500",
            bgColor: "from-teal-50 to-cyan-50",
            borderColor: "border-teal-300",
            emotionalOutcome: "Child feels: Empowered, skilled, confident in handling stress"
          }
        },
        {
          id: "judgmental",
          title: "Judgmental Response",
          subtitle: "Pressure them to perform",
          emoji: "😠",
          colorClass: "from-orange-50 to-red-50 border-orange-300",
          selectedColorClass: "from-red-50 to-rose-50 border-red-400",
          outcome: {
            title: "Judgmental Response",
            description: "You respond with pressure: 'Stop complaining and just get it done. Everyone has responsibilities. You should have planned better. Procrastination is a choice. Stop making excuses and start working.'",
            result: "Your child feels more overwhelmed and incompetent. They shut down or work frantically without a plan. The anxiety increases. They learn that asking for help is weakness, and that struggling means they're failing. Mental health suffers.",
            emoji: "😓",
            color: "from-red-500 to-rose-600",
            bgColor: "from-red-50 to-rose-50",
            borderColor: "border-red-400",
            emotionalOutcome: "Child feels: More overwhelmed, incompetent, alone"
          }
        },

      ],
      correctChoice: "teaching",
      explanation: "Teaching coping strategies gives your child lifelong tools for managing stress. While empathy is crucial for connection, showing them practical techniques empowers them to handle overwhelm independently. This builds resilience and self-efficacy."
    },
    {
      id: 5,
      title: "Feeling Invisible",
      childPerspective: "You tried to tell your parent about your day, but they were on their phone. You started talking about your art project, but they said 'uh-huh' without looking up. You stopped talking and just sat there. They didn't even notice you stopped.",
      childFeeling: "Invisible, unimportant, rejected",
      options: [
        {
          id: "scheduledTime",
          title: "Schedule Dedicated Time",
          subtitle: "Create regular connection rituals",
          emoji: "⏰",
          colorClass: "from-green-50 to-emerald-50 border-green-300",
          selectedColorClass: "from-green-50 to-emerald-50 border-green-400",
          outcome: {
            title: "You Scheduled Dedicated Time",
            description: "You say: 'I realize I've been distracted lately. How about we have dinner together without phones twice a week? And I'll check in with you every evening about your day before bedtime.'",
            result: "Your child feels that you recognize the problem and are taking action. They have something to look forward to. Regular connection time builds trust and strengthens your bond. Your child learns that relationships require intentional effort.",
            emoji: "📅",
            color: "from-green-400 to-emerald-500",
            bgColor: "from-green-50 to-emerald-50",
            borderColor: "border-green-300",
            emotionalOutcome: "Child feels: Anticipated, valued, secure in your commitment"
          }
        },
        {
          id: "empathetic",
          title: "Empathetic Response",
          subtitle: "Stop what you're doing and give full attention",
          emoji: "💝",
          colorClass: "from-blue-50 to-indigo-50 border-blue-300",
          selectedColorClass: "from-blue-50 to-indigo-50 border-blue-400",
          outcome: {
            title: "Empathetic Response",
            description: "You notice they stopped talking and put your phone down: 'I'm sorry, I wasn't fully listening. You're important to me, and I want to hear about your art project. Can you tell me again? I'm all ears.'",
            result: "Your child feels valued and important. They share their story with enthusiasm. Your attention tells them they matter. Your relationship deepens. Your child learns that their voice matters and that you care about their world.",
            emoji: "💝",
            color: "from-blue-400 to-indigo-500",
            bgColor: "from-blue-50 to-indigo-50",
            borderColor: "border-blue-300",
            emotionalOutcome: "Child feels: Valued, important, heard"
          }
        },
        {
          id: "judgmental",
          title: "Judgmental Response",
          subtitle: "Dismiss their attempt to connect",
          emoji: "😠",
          colorClass: "from-orange-50 to-red-50 border-orange-300",
          selectedColorClass: "from-red-50 to-rose-50 border-red-400",
          outcome: {
            title: "Judgmental Response",
            description: "You stay on your phone and say: 'I'm busy right now. Can't this wait? You know I have a lot to do. You're always interrupting me when I'm trying to get things done.'",
            result: "Your child learns that they're less important than a phone or work. They stop trying to connect with you. They find connection elsewhere or withdraw. Your relationship becomes distant. Years later, you wonder why they don't tell you anything.",
            emoji: "👻",
            color: "from-red-500 to-rose-600",
            bgColor: "from-red-50 to-rose-50",
            borderColor: "border-red-400",
            emotionalOutcome: "Child feels: Unimportant, rejected, disconnected"
          }
        },

      ],
      correctChoice: "scheduledTime",
      explanation: "Creating scheduled connection time shows your child that relationships require intentional effort. While immediate attention is wonderful, establishing regular rituals builds long-term security and trust. Consistency matters as much as presence."
    }
  ];

  const handleChoice = (choiceId) => {
    if (selectedChoices[currentScenario]) return; // Already answered

    const isCorrect = choiceId === scenarios[currentScenario].correctChoice;
    const selectedOption = scenarios[currentScenario].options.find(option => option.id === choiceId);

    const selected = {
      scenario: currentScenario,
      choiceId: choiceId,
      choiceTitle: selectedOption?.title,
      isCorrect: isCorrect
    };

    setSelectedChoices(prev => ({
      ...prev,
      [currentScenario]: selected
    }));

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setShowOutcome(true);
  };

  const handleNext = () => {
    setShowOutcome(false);
    if (currentScenario < totalLevels - 1) {
      setCurrentScenario(prev => prev + 1);
    } else {
      setShowGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentScenario(0);
    setSelectedChoices({});
    setShowOutcome(false);
    setScore(0);
    setShowGameOver(false);
  };

  const current = scenarios[currentScenario];
  const selected = selectedChoices[currentScenario];
  const progress = ((currentScenario + 1) / totalLevels) * 100;
  const selectedOption = selected ? current.options.find(option => option.id === selected.choiceId) : null;
  const outcome = selectedOption ? selectedOption.outcome : null;

  // Game content
  const gameContent = (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <motion.div
        key={currentScenario}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
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
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
            />
          </div>
        </div>

        {!showOutcome ? (
          <>
            {/* Child's perspective card */}
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-purple-200">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {current.title}
                </h2>
                <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
                  <p className="text-lg text-purple-700 font-semibold mb-3">
                    From Your Child's Perspective:
                  </p>
                  <p className="text-xl text-gray-700 leading-relaxed italic">
                    "{current.childPerspective}"
                  </p>
                </div>
                <div className="bg-purple-100 rounded-lg p-4 inline-block">
                  <p className="text-sm text-purple-800 font-medium">
                    💭 What they might be feeling: <span className="font-semibold">{current.childFeeling}</span>
                  </p>
                </div>
              </div>

              {/* Question */}
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-800 mb-2">
                  What might they be feeling right now?
                </p>
                <p className="text-sm text-gray-600">
                  Choose your response to this situation
                </p>
              </div>
            </div>

            {/* Choice buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {current.options.map((option, index) => {
                const isSelected = selected && selected.choiceId === option.id;
                const isChosen = !!selected;

                return (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChoice(option.id)}
                    disabled={isChosen}
                    className={`
                      relative p-6 rounded-2xl border-2 transition-all text-left
                      ${isSelected
                        ? `bg-gradient-to-br ${option.selectedColorClass} shadow-lg`
                        : `bg-gradient-to-br ${option.colorClass} hover:shadow-xl cursor-pointer`
                      }
                      ${isChosen && !isSelected ? 'opacity-50' : ''}
                    `}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{option.emoji}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {option.title}
                        </h3>
                        <p className="text-gray-700 text-sm">
                          {option.subtitle}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3 text-2xl"
                      >
                        {selected.isCorrect ? '✓' : '×'}
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </>
        ) : (
          /* Outcome display */
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Outcome card */}
              <div className={`bg-gradient-to-br ${outcome.bgColor} rounded-2xl p-8 shadow-xl border-2 ${outcome.borderColor}`}>
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{outcome.emoji}</div>
                  <h3 className={`text-3xl font-bold mb-2 bg-gradient-to-r ${outcome.color} bg-clip-text text-transparent`}>
                    {outcome.title}
                  </h3>
                  <p className="text-lg text-gray-700 italic mb-4">
                    "{outcome.description}"
                  </p>
                </div>

                <div className="bg-white/80 rounded-xl p-6 shadow-lg mb-4">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">
                    Emotional Outcome:
                  </h4>
                  <p className="text-gray-700 leading-relaxed font-semibold mb-4">
                    {outcome.emotionalOutcome}
                  </p>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">
                    What Happened:
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {outcome.result}
                  </p>
                </div>
              </div>

              {/* Explanation */}
              {selected && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  delay={0.3}
                  className={`p-6 rounded-xl border-2 ${selected.isCorrect
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-orange-50 border-orange-200'
                    }`}
                >
                  <p className={`font-semibold ${selected.isCorrect ? 'text-blue-800' : 'text-orange-800'
                    }`}>
                    {selected.isCorrect ? '✓ Great understanding! ' : '💡 Learning moment: '}
                    {current.explanation}
                  </p>
                </motion.div>
              )}

              {/* Parent tip */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                delay={0.5}
                className="bg-amber-50 border border-amber-200 rounded-xl p-6"
              >
                <p className="text-sm text-amber-800 leading-relaxed">
                  <strong>💡 Parent Tip:</strong> Pause and ask, "What might they be feeling right now?" before reacting.
                  When you step into your child's shoes, you respond to their emotional need, not just the behavior. This builds connection and teaches them that their feelings matter.
                </p>
              </motion.div>

              {/* Next button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {currentScenario < totalLevels - 1 ? 'Next Scenario' : 'View Results'}
              </motion.button>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );

  return (
    <ParentGameShell
      gameId={gameId}
      gameData={gameData}
      totalCoins={totalCoins}
      totalLevels={totalLevels}
      currentLevel={currentScenario + 1}
      score={score}
      showGameOver={showGameOver}
      onRestart={handleRestart}
      progress={progress}
    >
      {gameContent}
    </ParentGameShell>
  );
};

export default WalkInTheirShoes;