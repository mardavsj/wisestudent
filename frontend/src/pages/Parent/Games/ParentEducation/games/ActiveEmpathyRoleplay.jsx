import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const ActiveEmpathyRoleplay = () => {
  const location = useLocation();

  // Get game data
  const gameId = "parent-education-26";
  const gameData = getParentEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState({});
  const [empathyLevel, setEmpathyLevel] = useState(50); // Start at neutral 50%
  const [showOutcome, setShowOutcome] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Interactive story scenarios with multiple decision points
  const scenarios = [
    {
      id: 1,
      title: "Tired Evening Argument",
      context: "It's 8 PM on a Thursday. You've had a long, stressful day at work. Dinner is late, and you're exhausted. Your child is tired too, and tensions are high.",
      story: "You've just finished a draining work call. Your 8-year-old comes into the kitchen crying because they can't find their favorite toy. They're whining and being clingy.",
      question: "How do you respond?",
      options: [

        {
          id: 'neutral',
          text: "Okay, we'll look for it after dinner. Right now I need to make dinner. Can you help me set the table?",
          empathyChange: 0,
          outcome: "Your child is still upset but slightly distracted. The situation remains tense but manageable.",
          explanation: "This response is practical but doesn't address the emotional need, which can leave tension unresolved."
        },
        {
          id: 'dismissive',
          text: "Stop crying! It's just a toy. You can't find something every five minutes. Go look for it yourself, I'm busy making dinner!",
          empathyChange: -20,
          outcome: "Your child becomes more upset and cries harder. The emotional distance increases, making everything harder.",
          explanation: "Dismissing their feelings increases their stress and your own. The situation escalates instead of resolving."
        }, {
          id: 'empathetic',
          text: "I can see you're really upset about your toy. It's frustrating when something important goes missing. Let's take a breath together and I'll help you look for it.",
          empathyChange: +15,
          outcome: "Your child feels heard and calms down slightly. The empathy you showed helps de-escalate the situation.",
          explanation: "Acknowledging their emotion and offering help creates connection and reduces stress for both of you."
        },

      ],
      correctChoice: 'empathetic',
      whyItMatters: "Practicing empathy when you're exhausted is one of the hardest but most important parenting skills. It teaches your child that emotions are manageable, that connection matters even when life is hard, and that they are worth your effort even when you're tired."
    },
    {
      id: 2,
      title: "Bedtime Battle",
      context: "It's been a long day and you're ready for some quiet time. Your child, however, is wired and refusing to go to bed. You need to get work done, but they keep coming out of their room.",
      story: "It's 9 PM, an hour past bedtime. You've asked your child to go to bed three times, but they keep coming out saying they're not tired and want to stay up.",
      question: "How do you respond?",
      options: [

        {
          id: 'neutral',
          text: "It's bedtime now. You need to go to sleep because you have school tomorrow. Let's get ready for bed.",
          empathyChange: -5,
          outcome: "Your child reluctantly complies but the tension remains. Bedtime becomes a power struggle rather than a peaceful transition.",
          explanation: "This response focuses on rules and logic but doesn't address the emotional or physical need to wind down."
        },
        {
          id: 'empathetic',
          text: "I can see you're having trouble winding down tonight. Sometimes our bodies need help relaxing even when our minds feel awake. Let's do our bedtime routine together—it helps both of us calm down.",
          empathyChange: +15,
          outcome: "Your child feels understood and becomes more cooperative. The bedtime routine becomes a calming ritual rather than a battle.",
          explanation: "Acknowledging that they're struggling to wind down and offering to help creates connection and makes the transition easier."
        },
        {
          id: 'dismissive',
          text: "I don't care if you're tired or not! Go to bed NOW! I've asked you three times already and I'm done asking!",
          empathyChange: -20,
          outcome: "Your child becomes more resistant and anxious. The bedtime battle escalates, and everyone becomes more stressed.",
          explanation: "Reacting with frustration increases everyone's stress. The child learns that their needs don't matter when you're tired."
        }
      ],
      correctChoice: 'empathetic',
      whyItMatters: "Bedtime battles are exhausting, especially when you need time for yourself. But practicing empathy during these challenging moments teaches your child that their needs matter even when it's inconvenient. It also models how to handle frustration with grace."
    },
    {
      id: 3,
      title: "Homework Meltdown",
      context: "You're trying to help your child with homework after a long day. They're frustrated, you're tired, and the homework is taking way longer than it should. Tensions are rising.",
      story: "Your child is struggling with math homework and getting increasingly frustrated. They're starting to cry and saying 'I can't do this! I'm stupid!' They throw their pencil down.",
      question: "How do you respond?",
      options: [
        {
          id: 'empathetic',
          text: "I can see this is really frustrating for you. Math can feel really hard sometimes, and that's okay. Let's take a break together. When we're this frustrated, our brains don't work as well.",
          empathyChange: +15,
          outcome: "Your child feels understood and their frustration decreases. After a break, they're more able to approach the problem with a clearer mind.",
          explanation: "Acknowledging their frustration and offering a break shows you understand their emotional state. This often helps them regulate and return to the task more successfully."
        },
        {
          id: 'neutral',
          text: "It's okay, you're not stupid. Math is just hard. Let's try again. Take a deep breath and we'll work through this together.",
          empathyChange: +3,
          outcome: "Your child calms down slightly, but the underlying frustration remains. The homework may still be a struggle.",
          explanation: "This response is supportive but doesn't fully address the emotional overwhelm. A break might be more helpful than pushing through."
        },
        {
          id: 'dismissive',
          text: "Stop saying you're stupid! You're not! Just focus and try harder! Throwing your pencil isn't helping! Let's just get this done!",
          empathyChange: -20,
          outcome: "Your child becomes more frustrated and feels misunderstood. The homework battle escalates, and learning becomes even harder.",
          explanation: "Trying to push through frustration often makes it worse. The child needs emotional support before they can learn effectively."
        }
      ],
      correctChoice: 'empathetic',
      whyItMatters: "Homework battles are common and exhausting, especially after a long day. But maintaining empathy during these struggles teaches your child that learning challenges are normal and that they're supported regardless of how easy or hard things are for them."
    },
    {
      id: 4,
      title: "Sibling Conflict Escalation",
      context: "Your two children are fighting again, and you're trying to get dinner ready. The noise is overwhelming, and you just want five minutes of peace. The conflict keeps escalating.",
      story: "Your children are arguing loudly over a toy. Both are claiming the other took it first. The argument is getting louder and more heated. You're trying to focus on cooking.",
      question: "How do you respond?",
      options: [

        {
          id: 'neutral',
          text: "I need you both to stop fighting. Share the toy or take turns. I can't deal with this right now, I'm making dinner.",
          empathyChange: -5,
          outcome: "The children may stop temporarily, but the underlying conflict isn't resolved. They may fight again once you're not watching.",
          explanation: "This response stops the immediate conflict but doesn't address the emotions driving it, so it may resurface."
        },
        {
          id: 'dismissive',
          text: "I'm done with this! Both of you, go to your rooms RIGHT NOW! I can't listen to this fighting anymore!",
          empathyChange: -20,
          outcome: "Both children feel punished and misunderstood. The conflict may pause, but resentment builds, and they may fight more later.",
          explanation: "Reacting with frustration and punishment when overwhelmed is understandable but doesn't teach conflict resolution or address the root cause."
        },
        {
          id: 'empathetic',
          text: "I can see you're both really upset and both want this toy. Let me pause what I'm doing so we can figure this out together. What's happening?",
          empathyChange: +12,
          outcome: "Both children feel heard. They calm down slightly because they know you're listening. The conflict becomes more manageable.",
          explanation: "Taking a moment to pause and listen shows both children that their feelings matter, even when you're busy."
        },
      ],
      correctChoice: 'empathetic',
      whyItMatters: "Sibling conflicts are exhausting, especially when they happen repeatedly. But maintaining empathy helps you understand what's really driving the conflicts and teaches your children how to resolve disagreements with understanding rather than power."
    },
    {
      id: 5,
      title: "Morning Rush Chaos",
      context: "It's Monday morning, everyone is running late, and you're trying to get everyone out the door. Your child is moving slowly and seems to be in their own world. You're stressed about being late for work.",
      story: "Your child is taking forever to get dressed and seems distracted. You've asked them three times to hurry up, but they're still not ready. You're going to be late.",
      question: "How do you respond?",
      options: [
        {
          id: 'empathetic',
          text: "I can see you're having trouble focusing this morning. Mornings can be hard, especially on Mondays. Let me help you finish getting ready so we're not late. What do you need help with?",
          empathyChange: +12,
          outcome: "Your child feels supported and actually moves faster with your help. The morning becomes more cooperative and less stressful.",
          explanation: "Offering help instead of just pressure addresses their actual need and creates cooperation rather than resistance."
        },
        {
          id: 'neutral',
          text: "You need to hurry up. We're running late. Please focus and get ready. We need to leave in 5 minutes.",
          empathyChange: -3,
          outcome: "Your child may speed up slightly, but the stress increases for everyone. The morning remains rushed and tense.",
          explanation: "This response communicates urgency but doesn't address why they're having trouble focusing or offer support."
        },
        {
          id: 'dismissive',
          text: "I'm so sick of this every morning! You're always slow! Just get dressed NOW or we're leaving without you! I don't have time for this!",
          empathyChange: -20,
          outcome: "Your child feels shamed and rushed. They may become anxious or move even slower due to stress. The morning becomes more difficult.",
          explanation: "Reacting with frustration and threats increases stress, which often makes children move slower, not faster."
        }
      ],
      correctChoice: 'empathetic',
      whyItMatters: "Morning rushes are inherently stressful, and it's easy to react from that stress. But maintaining empathy teaches your child that stress is manageable and that they're loved even when life is chaotic. It also models how to handle pressure with grace."
    }
  ];

  const handleChoice = (choiceId, empathyChange) => {
    if (selectedChoices[currentScenario]) return; // Already answered

    const isCorrect = choiceId === scenarios[currentScenario].correctChoice;
    const selected = {
      scenario: currentScenario,
      choice: choiceId,
      isCorrect: isCorrect,
      empathyChange: empathyChange
    };

    setSelectedChoices(prev => ({
      ...prev,
      [currentScenario]: selected
    }));

    // Update empathy level (clamp between 0 and 100)
    setEmpathyLevel(prev => Math.max(0, Math.min(100, prev + empathyChange)));

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Show outcome for a moment, then move to next scenario
    setShowOutcome(true);

    setTimeout(() => {
      setShowOutcome(false);

      // Move to next scenario
      if (currentScenario < totalLevels - 1) {
        setCurrentScenario(prev => prev + 1);
        // Reset empathy to neutral for new scenario
        setEmpathyLevel(50);
      } else {
        // Game complete
        setShowGameOver(true);
      }
    }, 3000);
  };

  const handleRestart = () => {
    setCurrentScenario(0);
    setSelectedChoices({});
    setEmpathyLevel(50);
    setShowOutcome(false);
    setScore(0);
    setShowGameOver(false);
  };

  const currentScenarioData = scenarios[currentScenario];
  const selected = selectedChoices[currentScenario];
  const progress = ((currentScenario + 1) / totalLevels) * 100;

  // Empathy bar component
  const EmpathyBar = () => {
    const getColor = () => {
      if (empathyLevel >= 70) return 'from-green-500 to-emerald-600';
      if (empathyLevel >= 40) return 'from-yellow-500 to-orange-500';
      return 'from-red-500 to-rose-600';
    };

    const getLabel = () => {
      if (empathyLevel >= 70) return 'High Empathy';
      if (empathyLevel >= 40) return 'Moderate Empathy';
      return 'Low Empathy';
    };

    return (
      <div className="w-full bg-white rounded-xl p-4 shadow-lg border-2 border-indigo-200 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Empathy Level</span>
          <span className={`text-sm font-bold ${empathyLevel >= 70 ? 'text-green-600' :
              empathyLevel >= 40 ? 'text-yellow-600' :
                'text-red-600'
            }`}>
            {empathyLevel}% - {getLabel()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
          <motion.div
            initial={{ width: `${empathyLevel}%` }}
            animate={{ width: `${empathyLevel}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${getColor()} rounded-full`}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Low</span>
          <span>Moderate</span>
          <span>High</span>
        </div>
      </div>
    );
  };

  // Game content
  const gameContent = (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <motion.div
        key={`${currentScenario}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
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

        {/* Empathy bar */}
        <EmpathyBar />

        {!showOutcome ? (
          <>
            {/* Story context */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-indigo-200">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {currentScenarioData.title}
                </h2>
                <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
                  <p className="text-lg text-gray-700 leading-relaxed mb-3">
                    {currentScenarioData.context}
                  </p>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-base text-indigo-700 font-medium italic">
                      {currentScenarioData.story}
                    </p>
                  </div>
                </div>
              </div>

              {/* Question */}
              <div className="text-center">
                <p className="text-xl font-semibold text-gray-800 mb-2">
                  {currentScenarioData.question}
                </p>
                <p className="text-sm text-gray-600">
                  Your choice will affect your empathy level
                </p>
              </div>
            </div>

            {/* Response options */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {currentScenarioData.options.map((option, index) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleChoice(option.id, option.empathyChange)}
                  disabled={!!selected}
                  className={`
                    relative p-6 rounded-2xl border-2 transition-all text-left
                    ${selected
                      ? selected.choice === option.id
                        ? option.id === 'empathetic'
                          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg'
                          : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-400 shadow-lg'
                        : 'bg-gray-50 border-gray-300 opacity-50'
                      : option.id === 'empathetic'
                        ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300 hover:shadow-xl cursor-pointer'
                        : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300 hover:shadow-xl cursor-pointer'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">
                      {option.id === 'empathetic' ? '💙' : option.id === 'neutral' ? '💙' : '💙'}
                    </div>
                    <div className="flex-1">
                      <p className="text-base text-gray-700 leading-relaxed italic">
                        "{option.text}"
                      </p>
                      {!selected && (
                        <div className="text-xs text-gray-500 mt-2 font-medium">

                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
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
              {selected && (() => {
                const selectedOption = currentScenarioData.options.find(opt => opt.id === selected.choice);
                return (
                  <div className={`bg-gradient-to-br ${selected.isCorrect
                      ? 'from-green-50 to-emerald-50 border-green-300'
                      : 'from-orange-50 to-red-50 border-orange-300'
                    } rounded-2xl p-8 shadow-xl border-2`}>
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-4">
                        {selected.isCorrect ? '💙' : '💡'}
                      </div>
                      <h3 className={`text-2xl font-bold mb-2 ${selected.isCorrect ? 'text-green-700' : 'text-orange-700'
                        }`}>
                        {selected.isCorrect
                          ? 'Empathetic Response!'
                          : selectedOption.id === 'neutral'
                            ? 'Neutral Response'
                            : 'Stressful Response'}
                      </h3>
                    </div>

                    <div className="bg-white/80 rounded-xl p-6 shadow-lg mb-4">
                      <h4 className="font-bold text-gray-900 mb-3 text-lg">Outcome:</h4>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {selectedOption.outcome}
                      </p>
                      <div className={`rounded-lg p-4 ${selected.isCorrect ? 'bg-green-50' : 'bg-orange-50'
                        }`}>
                        <p className={`text-sm font-medium ${selected.isCorrect ? 'text-green-800' : 'text-orange-800'
                          }`}>
                          {selectedOption.explanation}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/80 rounded-xl p-4 shadow-lg text-center">
                      <p className="text-sm text-gray-600 mb-1">Empathy Level Changed</p>
                      <p className={`text-2xl font-bold ${selectedOption.empathyChange > 0 ? 'text-green-600' :
                          selectedOption.empathyChange < 0 ? 'text-red-600' :
                            'text-gray-600'
                        }`}>
                        {selectedOption.empathyChange > 0 ? '+' : ''}{selectedOption.empathyChange}%
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Show parent tip for each scenario */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                delay={0.3}
                className="bg-amber-50 border border-amber-200 rounded-xl p-6"
              >
                <p className="text-sm text-amber-800 leading-relaxed">
                  <strong>💡 Parent Tip:</strong> {currentScenarioData.whyItMatters}
                </p>
              </motion.div>

              <div className="text-center">
                <p className="text-gray-600 animate-pulse">Moving to next scenario...</p>
              </div>
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

export default ActiveEmpathyRoleplay;