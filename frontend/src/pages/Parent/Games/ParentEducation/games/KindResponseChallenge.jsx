import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const KindResponseChallenge = () => {
  const location = useLocation();

  // Get game data
  const gameId = "parent-education-23";
  const gameData = getParentEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState({});
  const [showOutcome, setShowOutcome] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Conflict scenarios with 3 tone options and mood meter impact
  const scenarios = [
    {
      id: 1,
      title: "Room Not Cleaned",
      conflict: "You asked your child to clean their room this morning. It's now 4 PM and the room is still messy. Clothes are on the floor, toys are scattered, and the bed is unmade.",
      childContext: "Your child has been playing with friends all afternoon and forgot about the task.",
      toneOptions: [

        {
          id: 'irritated',
          label: 'Irritated & Harsh',
          response: "I told you to clean your room hours ago! You never listen! How many times do I have to ask? Just get in there and clean it NOW, and you're grounded for the rest of the week!",
          moodImpact: 20,
          moodLabel: "Defensive & Resentful",
          emoji: "😠",
          color: "from-green-400 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300",
          explanation: "This response comes from irritation and uses harsh consequences. It creates fear and resentment, damaging the relationship.",
          outcome: "Your child feels attacked and defensive. They may clean the room, but with resentment. Trust is damaged, and future cooperation becomes harder. The relationship feels strained."
        },
        {
          id: 'permissive',
          label: 'Overly Permissive',
          response: "Oh well, it's okay. You were having fun. We can just clean it later, or maybe I'll just do it myself. No big deal.",
          moodImpact: 40,
          moodLabel: "Unclear & Disrespectful",
          emoji: "😕",
          color: "from-green-400 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300",
          explanation: "This response avoids the conflict but doesn't hold the boundary. It teaches the child that agreements don't matter, which weakens trust and respect.",
          outcome: "Your child learns that your words don't have meaning. Boundaries become unclear, and they may lose respect for you. The room doesn't get cleaned, and future requests are ignored."
        },
        {
          id: 'kind-firm',
          label: 'Kind & Firm',
          response: "I notice your room isn't cleaned yet. I understand you've been having fun, and I also need you to keep your word. Let's clean it together now, and we can find a way to help you remember next time.",
          moodImpact: 75,
          moodLabel: "Cooperative & Connected",
          emoji: "😊",
          color: "from-green-400 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300",
          explanation: "This response is both kind (acknowledging their fun) and firm (holding the boundary). It maintains connection while enforcing the agreement.",
          outcome: "Your child feels respected and understood. They cooperate because they feel safe, not because they're afraid. The room gets cleaned, and your relationship stays strong."
        },
      ],
      correctChoice: "kind-firm",
      whyItMatters: "Kindness and firmness together create respectful boundaries. When you're kind, your child feels safe. When you're firm, they learn responsibility. Together, they build trust and cooperation."
    },
    {
      id: 2,
      title: "Homework Not Done",
      conflict: "Your child was supposed to finish their homework before dinner. It's now 8 PM and you discover they haven't started it. They say they forgot.",
      childContext: "Your child got distracted playing with a new toy they received earlier.",
      toneOptions: [

        {
          id: 'irritated',
          label: 'Irritated & Harsh',
          response: "You forgot AGAIN? You always do this! Stop making excuses. Go do your homework RIGHT NOW, no TV for a week, and I'm taking that toy away until you learn responsibility!",
          moodImpact: 25,
          moodLabel: "Shamed & Resistant",
          emoji: "😢",
          color: "from-green-400 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300",
          explanation: "This response shames the child and uses excessive punishment. It creates fear and resentment, making future cooperation less likely.",
          outcome: "Your child feels ashamed and resentful. They may do the homework, but the relationship suffers. Future conversations become defensive, and trust erodes."
        },
        {
          id: 'kind-firm',
          label: 'Kind & Firm',
          response: "I see the homework isn't done yet. I understand it's easy to get distracted when you have a new toy. Homework is still important though. Let's set it up so you can finish it now, and tomorrow we can create a better routine.",
          moodImpact: 70,
          moodLabel: "Accountable & Supported",
          emoji: "🙂",
          color: "from-green-400 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300",
          explanation: "This response validates their experience while maintaining the expectation. It offers support and a plan for improvement.",
          outcome: "Your child feels understood and supported. They take responsibility because they want to meet your expectations, not because they're afraid. Homework gets done, and you work together on prevention."
        },
        {
          id: 'permissive',
          label: 'Overly Permissive',
          response: "That's okay, sweetie. You can just do it tomorrow or I'll help you with it. It's not that important anyway. Just go play.",
          moodImpact: 35,
          moodLabel: "Confused & Disengaged",
          emoji: "🤷",
          color: "from-green-400 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300",
          explanation: "This response avoids responsibility and doesn't hold the boundary. It teaches the child that commitments don't matter.",
          outcome: "Your child learns that homework isn't important and that you'll always bail them out. They become less responsible, and academic performance may suffer."
        }
      ],
      correctChoice: "kind-firm",
      whyItMatters: "Being kind doesn't mean being permissive. You can acknowledge your child's experience while still holding them accountable. This builds both connection and responsibility."
    },
    {
      id: 3,
      title: "Breaking a Promise",
      conflict: "Your child promised to help set the table for dinner. When it's time, they're still watching TV and ignore your reminder. They say 'Just a minute' but don't move.",
      childContext: "Your child is watching their favorite show and doesn't want to miss it.",
      toneOptions: [
        {
          id: 'kind-firm',
          label: 'Kind & Firm',
          response: "I hear you want to keep watching, and I also need your help with dinner as we agreed. Let's pause the show now, and you can finish it after we eat. I'd appreciate your help.",
          moodImpact: 80,
          moodLabel: "Respected & Willing",
          emoji: "😌",
          color: "from-green-400 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300",
          explanation: "This response acknowledges their desire while honoring the agreement. It offers a solution that respects both needs.",
          outcome: "Your child feels respected and understood. They cooperate willingly because they see fairness in your approach. The table gets set, and they learn that agreements matter while still feeling valued."
        },
        {
          id: 'irritated',
          label: 'Irritated & Harsh',
          response: "I told you to set the table! Stop being lazy! Turn that TV off RIGHT NOW! I'm so tired of you not helping! No TV for the rest of the week!",
          moodImpact: 15,
          moodLabel: "Angry & Defiant",
          emoji: "😡",
          color: "from-green-400 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300",
          explanation: "This response comes from frustration and creates a power struggle. It escalates the conflict instead of solving it.",
          outcome: "Your child feels attacked and may become defiant. A power struggle ensues, making cooperation less likely. Dinner becomes tense, and your relationship feels strained."
        },
        {
          id: 'permissive',
          label: 'Overly Permissive',
          response: "That's fine, just finish your show. I'll set the table myself. No worries, sweetie. Just come when you're ready.",
          moodImpact: 30,
          moodLabel: "Entitled & Disconnected",
          emoji: "😐",
          color: "from-green-400 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300",
          explanation: "This response avoids the conflict entirely. It teaches the child that their promises don't matter and that you'll always do the work.",
          outcome: "Your child learns that they don't need to keep their word. They may take advantage of your kindness, and future promises become meaningless. You end up doing more work alone."
        }
      ],
      correctChoice: "kind-firm",
      whyItMatters: "When you're kind and firm, you honor both the child's needs and the family's needs. This teaches respect, cooperation, and the value of keeping promises while maintaining connection."
    },
    {
      id: 4,
      title: "Interrupting Conversation",
      conflict: "You're having an important phone call. Your child keeps interrupting, pulling on your arm, and saying 'Mom! Mom! Mom!' loudly. They want to show you something right now.",
      childContext: "Your child just drew a picture they're very excited about and wants to share it immediately.",
      toneOptions: [
        {
          id: 'kind-firm',
          label: 'Kind & Firm',
          response: "I can see you're excited and want to show me something! I'm on an important call right now, so I need you to wait quietly. I'll be done in 5 minutes, and then I'd love to see what you made.",
          moodImpact: 85,
          moodLabel: "Patient & Valued",
          emoji: "😊",
          color: "from-green-400 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300",
          explanation: "This response validates their excitement while setting a clear boundary. It gives them something to look forward to.",
          outcome: "Your child feels understood and valued. They learn to wait because they know their needs matter. The boundary is respected, and they eagerly wait to share with you."
        },
        {
          id: 'irritated',
          label: 'Irritated & Harsh',
          response: "STOP IT! Can't you see I'm on the phone? You're being so rude! Go to your room RIGHT NOW! I can't stand when you interrupt me!",
          moodImpact: 20,
          moodLabel: "Hurt & Rejected",
          emoji: "😢",
          color: "from-green-400 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300",
          explanation: "This response shames the child and rejects their excitement. It makes them feel like their interests don't matter.",
          outcome: "Your child feels hurt and rejected. Their excitement turns to shame. They may learn to stop sharing with you, and the connection weakens."
        },
        {
          id: 'permissive',
          label: 'Overly Permissive',
          response: "Oh okay, let me just hang up. I'll talk to them later. Come show me what you made! Your picture is more important than my call anyway.",
          moodImpact: 40,
          moodLabel: "Confused & Self-Centered",
          emoji: "😕",
          color: "from-green-400 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300",
          explanation: "This response prioritizes the child's immediate wants over important boundaries. It teaches them that their needs always come first, no matter what.",
          outcome: "Your child learns that they are the center of the universe and that other people's needs don't matter. They may become demanding and struggle with patience or respect for others."
        }
      ],
      correctChoice: "kind-firm",
      whyItMatters: "Being kind means validating your child's feelings. Being firm means maintaining important boundaries. Together, they teach respect for both your child's needs and the needs of others."
    },
    {
      id: 5,
      title: "Sibling Conflict",
      conflict: "You walk into the room to find your children fighting over a toy. One is crying, the other is shouting. Toys are being thrown, and the argument is escalating.",
      childContext: "Both children want to play with the same new toy at the same time.",
      toneOptions: [

        {
          id: 'irritated',
          label: 'Irritated & Harsh',
          response: "STOP FIGHTING! I'm so tired of this! Both of you, go to your rooms RIGHT NOW! No toys for either of you! You're both being ridiculous!",
          moodImpact: 25,
          moodLabel: "Resentful & Blaming",
          emoji: "😠",
          color: "from-green-400 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300",
          explanation: "This response escalates the conflict with anger and punishment. It doesn't address the underlying feelings or teach problem-solving.",
          outcome: "Both children feel blamed and resentful. The conflict doesn't get resolved—it just gets paused. They learn that conflict is bad and should be avoided, not worked through. Sibling relationships suffer."
        },
        {
          id: 'permissive',
          label: 'Overly Permissive',
          response: "Oh, I'll just go buy another one of those toys so you each have one. Or maybe you can both play together? Actually, just take turns for 5 minutes each, okay?",
          moodImpact: 35,
          moodLabel: "Entitled & Manipulative",
          emoji: "🙄",
          color: "from-green-400 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300",
          explanation: "This response avoids the conflict by giving in or making hasty solutions. It doesn't teach children to work through problems or respect boundaries.",
          outcome: "Children learn that conflicts can be solved by getting whatever they want. They may become more demanding and struggle to compromise or problem-solve. Conflicts increase rather than decrease."
        },
        {
          id: 'kind-firm',
          label: 'Kind & Firm',
          response: "I can see you're both upset and really want this toy. I understand it's frustrating when you both want the same thing. Let's take a breath together, and then we'll find a fair solution. What ideas do you have?",
          moodImpact: 75,
          moodLabel: "Calm & Collaborative",
          emoji: "🤝",
          color: "from-green-400 to-emerald-500",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-300",
          explanation: "This response acknowledges both children's feelings and invites them into problem-solving. It's kind to their emotions and firm about finding a solution together.",
          outcome: "Both children feel heard and validated. They calm down and become open to solutions. They learn conflict resolution skills and that their feelings matter. The conflict resolves peacefully."
        },
      ],
      correctChoice: "kind-firm",
      whyItMatters: "In conflict, children need their feelings acknowledged (kindness) and guidance in finding solutions (firmness). This approach teaches emotional regulation, problem-solving, and respect for others while maintaining family harmony."
    }
  ];

  const handleChoice = (choiceId) => {
    if (selectedChoices[currentScenario]) return; // Already answered

    const isCorrect = choiceId === scenarios[currentScenario].correctChoice;
    const selected = {
      scenario: currentScenario,
      choice: choiceId,
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
  const selectedTone = selected ? current.toneOptions.find(opt => opt.id === selected.choice) : null;

  // Mood meter component
  const MoodMeter = ({ impact, label, emoji, color }) => {
    const barColor = impact >= 70 ? 'from-green-400 to-emerald-500'
      : impact >= 40 ? 'from-yellow-400 to-orange-500'
        : 'from-red-500 to-rose-600';

    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">{label}</span>
          <span className="text-2xl">{emoji}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${impact}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${barColor} rounded-full`}
          />
        </div>
        <div className="text-right mt-1">
          <span className="text-xs font-medium text-gray-600">{impact}%</span>
        </div>
      </div>
    );
  };

  // Game content
  const gameContent = (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <motion.div
        key={currentScenario}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Challenge {currentScenario + 1} of {totalLevels}</span>
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
            {/* Conflict description */}
            <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-rose-200">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {current.title}
                </h2>
                <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
                  <p className="text-xl text-gray-700 leading-relaxed mb-4">
                    {current.conflict}
                  </p>
                  <div className="bg-rose-100 rounded-lg p-4">
                    <p className="text-sm text-rose-800 font-medium">
                      💡 Context: {current.childContext}
                    </p>
                  </div>
                </div>
              </div>

              {/* Question */}
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-800 mb-2">
                  Choose your response tone:
                </p>
                <p className="text-sm text-gray-600">
                  See how your tone affects your child's mood and cooperation
                </p>
              </div>
            </div>

            {/* Tone options */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {current.toneOptions.map((option, index) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleChoice(option.id)}
                  disabled={!!selected}
                  className={`
                    relative p-6 rounded-2xl border-2 transition-all text-left
                    ${selected
                      ? selected.choice === option.id
                        ? option.id === current.correctChoice
                          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg'
                          : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-400 shadow-lg'
                        : 'bg-gray-50 border-gray-300 opacity-50'
                      : option.id === current.correctChoice
                        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 hover:shadow-xl cursor-pointer'
                        : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300 hover:shadow-xl cursor-pointer'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{option.emoji}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {option.label}
                      </h3>
                      <p className="text-base text-gray-700 leading-relaxed italic mb-3">
                        "{option.response}"
                      </p>
                      {!selected && (
                        <div className="text-xs text-gray-500 font-medium">
                          Click to see mood impact →
                        </div>
                      )}
                    </div>
                  </div>
                  {selected && selected.choice === option.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`absolute top-4 right-4 text-3xl ${option.id === current.correctChoice ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                      {option.id === current.correctChoice ? '✓' : '×'}
                    </motion.div>
                  )}
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
              {/* Selected response card */}
              <div className={`bg-gradient-to-br ${selectedTone.bgColor} rounded-2xl p-8 shadow-xl border-2 ${selectedTone.borderColor}`}>
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{selectedTone.emoji}</div>
                  <h3 className={`text-3xl font-bold mb-2 bg-gradient-to-r ${selectedTone.color} bg-clip-text text-transparent`}>
                    {selectedTone.label}
                  </h3>
                  <p className="text-lg text-gray-700 italic mb-4">
                    "{selectedTone.response}"
                  </p>
                </div>

                {/* Mood meter */}
                <div className="bg-white/80 rounded-xl p-6 shadow-lg mb-4">
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">
                    Child's Mood Impact:
                  </h4>
                  <MoodMeter
                    impact={selectedTone.moodImpact}
                    label={selectedTone.moodLabel}
                    emoji={selectedTone.emoji}
                    color={selectedTone.color}
                  />
                </div>

                {/* Outcome */}
                <div className="bg-white/80 rounded-xl p-6 shadow-lg mb-4">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">
                    What Happened:
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedTone.outcome}
                  </p>
                </div>

                {/* Explanation */}
                <div className="bg-white/80 rounded-xl p-6 shadow-lg">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">
                    Why This Matters:
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedTone.explanation}
                  </p>
                </div>
              </div>

              {/* Learning moment for incorrect choice */}
              {selected && !selected.isCorrect && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  delay={0.3}
                  className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6"
                >
                  <h4 className="font-bold text-blue-800 mb-3 text-lg">
                    💡 The Kind & Firm Approach:
                  </h4>
                  <p className="text-blue-700 leading-relaxed mb-4">
                    "{current.toneOptions.find(opt => opt.id === current.correctChoice).response}"
                  </p>
                  <MoodMeter
                    impact={current.toneOptions.find(opt => opt.id === current.correctChoice).moodImpact}
                    label={current.toneOptions.find(opt => opt.id === current.correctChoice).moodLabel}
                    emoji={current.toneOptions.find(opt => opt.id === current.correctChoice).emoji}
                    color={current.toneOptions.find(opt => opt.id === current.correctChoice).color}
                  />
                </motion.div>
              )}

              {/* Why it matters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                delay={0.5}
                className={`p-6 rounded-xl border-2 ${selected && selected.isCorrect
                    ? 'bg-green-50 border-green-200'
                    : 'bg-orange-50 border-orange-200'
                  }`}
              >
                <p className={`font-semibold ${selected && selected.isCorrect ? 'text-green-800' : 'text-orange-800'
                  }`}>
                  {current.whyItMatters}
                </p>
              </motion.div>

              {/* Parent tip */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                delay={0.7}
                className="bg-amber-50 border border-amber-200 rounded-xl p-6"
              >
                <p className="text-sm text-amber-800 leading-relaxed">
                  <strong>💡 Parent Tip:</strong> Compassion never weakens discipline—it strengthens connection.
                  When you're kind, your child feels safe and respected. When you're firm, they learn boundaries and responsibility.
                  Together, kindness and firmness create cooperation from respect, not fear.
                </p>
              </motion.div>

              {/* Next button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {currentScenario < totalLevels - 1 ? 'Next Challenge' : 'View Results'}
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

export default KindResponseChallenge;