import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const GratitudeForEffort = () => {
  const location = useLocation();

  // Get game data
  const gameId = "parent-education-28";
  const gameData = getParentEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState({});
  const [showOutcome, setShowOutcome] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [heartGrowth, setHeartGrowth] = useState(0); // Track cumulative heart growth
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Scenarios focusing on effort rather than results
  const scenarios = [
    {
      id: 1,
      title: "Messy Drawing",
      situation: "Your child comes to you excitedly with a drawing. It's messy—lines are outside the boundaries, colors are mixed, and it's hard to tell what it is. They say 'Look what I made! Do you like it?'",
      childEffort: "They spent 20 minutes on this drawing, trying different colors and shapes.",
      phraseOptions: [

        {
          id: 'result-focused',
          text: "It's nice, sweetie! Maybe next time we can make it neater and stay in the lines. I'll help you make it look better.",
          type: "result",
          explanation: "This response focuses on the result (neatness, staying in lines) rather than the effort. It suggests the drawing needs to be 'better,' which diminishes their work.",
          outcome: "Your child may feel like their effort wasn't good enough. They learn that the result matters more than trying, which can make them less likely to try new things.",
          heartGrowth: 0
        },
        {
          id: 'dismissive',
          text: "That's great, honey. Can you clean up your art supplies now? We need to get ready for dinner.",
          type: "dismissive",
          explanation: "This response dismisses their work entirely and moves on to the next task. It doesn't acknowledge their effort at all.",
          outcome: "Your child feels ignored and unimportant. They learn that their efforts don't matter, which can decrease motivation and self-worth.",
          heartGrowth: -1
        },
        {
          id: 'effort-focused',
          text: "I can see you worked really hard on this! You tried so many different colors and shapes. I love how creative and persistent you were. Tell me about what you drew!",
          type: "effort",
          explanation: "This response focuses on the effort, creativity, and persistence rather than the result. It values the process and invites them to share their story.",
          outcome: "Your child feels proud of their effort and creativity. They learn that trying hard is what matters. Their confidence grows, and they become more willing to take risks.",
          heartGrowth: 3
        },
      ],
      correctChoice: "effort-focused",
      whyItMatters: "When children put effort into something, they need that effort to be seen and valued, regardless of the result. Praising effort builds resilience and willingness to try."
    },
    {
      id: 2,
      title: "Unfinished Chore",
      situation: "You asked your child to put away their toys before dinner. When you check, they've put away about half the toys, but the room is still messy. Some toys are on the floor, and they're playing with one of them.",
      childEffort: "They actually put away most of their toys and were trying hard, but got distracted by a favorite toy.",
      phraseOptions: [

        {
          id: 'result-focused',
          text: "You're not done yet. I asked you to put ALL the toys away, and the room is still messy. Finish it now, please.",
          type: "result",
          explanation: "This response focuses only on what's not done and the imperfect result. It doesn't acknowledge the effort that was put in.",
          outcome: "Your child feels like their effort didn't count because the result wasn't perfect. They may become discouraged or resistant to helping.",
          heartGrowth: 0
        },
        {
          id: 'effort-focused',
          text: "I can see you put away a lot of your toys! You worked really hard on that. I appreciate your effort. Let's finish up together so we can have dinner.",
          type: "effort",
          explanation: "This response acknowledges what they did accomplish and appreciates their effort. It offers to help finish rather than criticizing what's not done.",
          outcome: "Your child feels recognized for their effort and is more willing to complete the task. They learn that partial effort is still valued and that you're there to help.",
          heartGrowth: 3
        },
        {
          id: 'dismissive',
          text: "Never mind, I'll just do it myself. You never finish anything anyway.",
          type: "dismissive",
          explanation: "This response dismisses their effort entirely and communicates that you don't expect them to be capable.",
          outcome: "Your child learns that their efforts are worthless. They may stop trying because they believe they can't succeed anyway.",
          heartGrowth: -2
        }
      ],
      correctChoice: "effort-focused",
      whyItMatters: "Acknowledging partial effort and progress teaches children that trying matters even when tasks aren't completed perfectly. This builds persistence and self-efficacy."
    },
    {
      id: 3,
      title: "Brave Try",
      situation: "Your child tried to ride their bike without training wheels for the first time. They fell twice, got some scrapes, and is now crying. They say 'I can't do it! I'm never going to learn!'",
      childEffort: "They tried multiple times, pushed through fear, and kept getting back up even after falling.",
      phraseOptions: [
        {
          id: 'effort-focused',
          text: "I'm so proud of how brave you were! You tried something really hard, and you kept getting back up even when you fell. That takes so much courage. Falling is part of learning. Want to try again tomorrow when you're ready?",
          type: "effort",
          explanation: "This response praises the bravery, persistence, and effort rather than focusing on the result (not yet riding successfully). It validates their courage and offers hope.",
          outcome: "Your child feels proud of their bravery and effort. They learn that trying and getting back up is what matters. Their confidence in their ability to persist grows.",
          heartGrowth: 4
        },
        {
          id: 'result-focused',
          text: "You'll get it if you keep practicing. Lots of kids can do it—you just need to try harder and not give up.",
          type: "result",
          explanation: "This response focuses on the result (eventually riding successfully) and compares them to others. It doesn't acknowledge their current effort and bravery.",
          outcome: "Your child may feel pressured and compared. They might focus on the gap between their effort and success rather than valuing what they already did.",
          heartGrowth: 1
        },
        {
          id: 'dismissive',
          text: "It's okay, maybe you're just not ready for it yet. We can try again when you're older.",
          type: "dismissive",
          explanation: "This response dismisses their effort and suggests they're not capable yet, which can make them feel inadequate.",
          outcome: "Your child may feel like they're not good enough or that their effort was wasted. They may develop self-doubt about their abilities.",
          heartGrowth: -2
        }
      ],
      correctChoice: "effort-focused",
      whyItMatters: "When children face challenges and setbacks, praising their courage and persistence helps them develop resilience. They learn that effort and bravery matter more than immediate success."
    },
    {
      id: 4,
      title: "Homework Struggle",
      situation: "Your child has been working on a difficult math problem for 30 minutes. They've tried different approaches, erased and started over several times. They're frustrated and say 'I don't get it! I've tried everything!'",
      childEffort: "They've been persistent, tried multiple strategies, and haven't given up despite frustration.",
      phraseOptions: [

        {
          id: 'result-focused',
          text: "You just need to keep trying. Once you figure it out, you'll see it wasn't that hard. Let's work through it together until you get the right answer.",
          type: "result",
          explanation: "This response focuses on getting the right answer rather than valuing the effort and strategies they've already tried.",
          outcome: "Your child may feel like their effort doesn't matter unless they get the right answer. They may become more focused on results than learning.",
          heartGrowth: 1
        },
        {
          id: 'dismissive',
          text: "Well, if you'd paid attention in class, this wouldn't be so hard. Let me just show you how to do it.",
          type: "dismissive",
          explanation: "This response dismisses their effort and blames them, then takes over instead of valuing their persistence.",
          outcome: "Your child feels blamed and inadequate. They learn that their effort doesn't matter and may become dependent on others to solve problems.",
          heartGrowth: -2
        },
        {
          id: 'effort-focused',
          text: "I can see you've been working on this for a long time and trying really hard. You've tried different ways to solve it, and that shows great problem-solving thinking. That persistence is impressive. Let's take a break and come back to it fresh, or would you like help?",
          type: "effort",
          explanation: "This response acknowledges the time, effort, and strategies they've tried. It praises their persistence and problem-solving process, not just the result.",
          outcome: "Your child feels that their effort is seen and valued. They learn that persistence and trying different approaches are valuable skills, regardless of whether they solve it immediately.",
          heartGrowth: 3
        },
      ],
      correctChoice: "effort-focused",
      whyItMatters: "Praising the process—the strategies tried, the persistence shown, the time invested—teaches children that learning is valuable even when it's difficult. This builds growth mindset."
    },
    {
      id: 5,
      title: "Art Project Attempt",
      situation: "Your child tried to make a birthday card for a friend. They worked on it for a while, but the card is messy—the writing is uneven, some parts are smudged, and it doesn't look like a 'perfect' card. They're worried it's not good enough.",
      childEffort: "They spent time thinking about what to write, tried to make it nice, and showed care and thoughtfulness for their friend.",
      phraseOptions: [
        {
          id: 'effort-focused',
          text: "I can see how much thought and care you put into this! You spent time thinking about what to write to your friend, and that shows how much you care about them. The time and effort you put in is what makes it special, not how it looks.",
          type: "effort",
          explanation: "This response focuses on the thought, care, and effort put into the card rather than its appearance. It values the intent and process.",
          outcome: "Your child feels that their thoughtfulness and effort are what matter. They learn that showing care through effort is valuable, regardless of how things look.",
          heartGrowth: 4
        },
        {
          id: 'result-focused',
          text: "It's nice, but we could make it neater. Let me help you make another one that looks better. Your friend will like it more if it's cleaner.",
          type: "result",
          explanation: "This response focuses on the appearance and suggests making it 'better,' which implies their effort wasn't good enough.",
          outcome: "Your child may feel like their effort wasn't good enough. They learn that the result (appearance) matters more than the thought and care they put in.",
          heartGrowth: 0
        },
        {
          id: 'dismissive',
          text: "It's fine, I'm sure your friend will like it. Just make sure you give it to them, okay?",
          type: "dismissive",
          explanation: "This response is dismissive and doesn't acknowledge the effort, thought, or care they put into making the card.",
          outcome: "Your child feels like their effort isn't worth noticing. They may stop putting effort into things because it doesn't seem to matter.",
          heartGrowth: -1
        }
      ],
      correctChoice: "effort-focused",
      whyItMatters: "When children put effort, thought, and care into something, acknowledging those qualities teaches them that intent and effort are valuable. This builds self-worth based on character, not appearance."
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
      const selectedOption = scenarios[currentScenario].phraseOptions.find(opt => opt.id === choiceId);
      setHeartGrowth(prev => prev + selectedOption.heartGrowth);
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 2000);
    } else {
      const selectedOption = scenarios[currentScenario].phraseOptions.find(opt => opt.id === choiceId);
      if (selectedOption.heartGrowth > 0) {
        setHeartGrowth(prev => prev + selectedOption.heartGrowth);
        setShowHeartAnimation(true);
        setTimeout(() => setShowHeartAnimation(false), 2000);
      }
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
    setShowHeartAnimation(false);
    setHeartGrowth(0);
    setScore(0);
    setShowGameOver(false);
  };

  const current = scenarios[currentScenario];
  const selected = selectedChoices[currentScenario];
  const progress = ((currentScenario + 1) / totalLevels) * 100;
  const selectedPhrase = selected ? current.phraseOptions.find(opt => opt.id === selected.choice) : null;

  // Heart Growth Animation Component
  const HeartGrowthAnimation = () => {
    if (!showHeartAnimation) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1.2 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 1,
                repeat: 2,
                ease: "easeInOut"
              }}
              className="text-9xl"
            >
              ❤️
            </motion.div>
            <motion.div
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: -50, opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="text-3xl font-bold text-red-500">+{selectedPhrase?.heartGrowth || 0}</span>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // Game content
  const gameContent = (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <HeartGrowthAnimation />

      <motion.div
        key={currentScenario}
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

        {/* Heart Growth Meter */}
        <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-xl p-4 shadow-lg border-2 border-pink-200 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">❤️</span>
              <div>
                <p className="text-sm font-medium text-gray-700">Heart Growth</p>
                <p className="text-xs text-gray-600">Confidence blooms through empathy</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-red-500">
              +{heartGrowth}
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (heartGrowth / 15) * 100)}%` }}
              className="h-full bg-gradient-to-r from-pink-400 to-red-500 rounded-full"
            />
          </div>
        </div>

        {!showOutcome ? (
          <>
            {/* Scenario description */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-indigo-200">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {current.title}
                </h2>
                <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
                  <p className="text-xl text-gray-700 leading-relaxed mb-4">
                    {current.situation}
                  </p>
                  <div className="bg-indigo-100 rounded-lg p-4">
                    <p className="text-sm text-indigo-800 font-medium">
                      💡 Their effort: <span className="font-semibold">{current.childEffort}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Question */}
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-800 mb-2">
                  Choose your gratitude phrase:
                </p>
                <p className="text-sm text-gray-600">
                  Focus on their effort, intent, and process—not just the result
                </p>
              </div>
            </div>

            {/* Gratitude phrase options */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {current.phraseOptions.map((option, index) => (
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
                        ? option.type === 'effort'
                          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg'
                          : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-400 shadow-lg'
                        : 'bg-gray-50 border-gray-300 opacity-50'
                      : option.type === 'effort'
                        ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300 hover:shadow-xl cursor-pointer'
                        : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300 hover:shadow-xl cursor-pointer'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">
                      {option.type === 'effort' ? '🎯' : option.type === 'result' ? '🎯' : '🎯'}
                    </div>
                    <div className="flex-1">
                      <p className="text-base text-gray-700 leading-relaxed italic">
                        "{option.text}"
                      </p>
                      {!selected && option.type === 'effort' && (
                        <div className="text-xs text-green-600 font-medium mt-2">

                        </div>
                      )}
                    </div>
                  </div>
                  {selected && selected.choice === option.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`absolute top-4 right-4 text-3xl ${option.type === 'effort' ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                      {option.type === 'effort' ? '✓' : '×'}
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
              {/* Selected phrase card */}
              <div className={`bg-gradient-to-br ${selected && selected.isCorrect
                  ? 'from-green-50 to-emerald-50 border-green-300'
                  : selectedPhrase?.type === 'result'
                    ? 'from-orange-50 to-yellow-50 border-orange-300'
                    : 'from-red-50 to-rose-50 border-red-300'
                } rounded-2xl p-8 shadow-xl border-2`}>
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">
                    {selected && selected.isCorrect ? '💙' : selectedPhrase?.type === 'result' ? '🎯' : '💡'}
                  </div>
                  <h3 className={`text-3xl font-bold mb-2 ${selected && selected.isCorrect
                      ? 'text-green-700'
                      : 'text-orange-700'
                    }`}>
                    {selected && selected.isCorrect
                      ? 'Effort-Focused Gratitude!'
                      : selectedPhrase?.type === 'result'
                        ? 'Result-Focused Response'
                        : 'Missed Opportunity'}
                  </h3>
                </div>

                {/* Selected phrase */}
                <div className="bg-white/80 rounded-xl p-6 shadow-lg mb-4">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">
                    Your response:
                  </h4>
                  <p className="text-lg text-gray-700 leading-relaxed italic mb-4">
                    "{selectedPhrase.text}"
                  </p>
                  <div className={`rounded-lg p-4 ${selected && selected.isCorrect ? 'bg-green-50' : 'bg-orange-50'
                    }`}>
                    <p className={`text-sm font-medium ${selected && selected.isCorrect ? 'text-green-800' : 'text-orange-800'
                      }`}>
                      {selectedPhrase.explanation}
                    </p>
                  </div>
                </div>

                {/* Outcome */}
                <div className="bg-white/80 rounded-xl p-6 shadow-lg">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">
                    Impact on your child:
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedPhrase.outcome}
                  </p>
                  {selectedPhrase.heartGrowth > 0 && (
                    <div className="mt-4 bg-pink-50 rounded-lg p-4 border border-pink-200">
                      <p className="text-sm text-pink-800 font-medium">
                        ❤️ Heart Growth: +{selectedPhrase.heartGrowth} (Confidence and self-worth increased)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Show effort-focused phrase if wrong */}
              {selected && !selected.isCorrect && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  delay={0.3}
                  className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6"
                >
                  <h4 className="font-bold text-blue-800 mb-3 text-lg flex items-center gap-2">
                    <span>💙</span>
                    <span>The Effort-Focused Approach:</span>
                  </h4>
                  <p className="text-lg text-blue-700 leading-relaxed italic mb-4">
                    "{current.phraseOptions.find(opt => opt.type === 'effort').text}"
                  </p>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-blue-800 font-medium mb-3">
                      {current.phraseOptions.find(opt => opt.type === 'effort').explanation}
                    </p>
                    <p className="text-sm text-blue-700">
                      {current.phraseOptions.find(opt => opt.type === 'effort').outcome}
                    </p>
                    <div className="mt-3 bg-pink-50 rounded-lg p-3 border border-pink-200">
                      <p className="text-sm text-pink-800 font-medium">
                        ❤️ Heart Growth: +{current.phraseOptions.find(opt => opt.type === 'effort').heartGrowth}
                      </p>
                    </div>
                  </div>
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
                  💡 {current.whyItMatters}
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
                  <strong>💡 Parent Tip:</strong> Praise effort, not just achievement—confidence blooms through empathy.
                  When you focus on what children tried, how hard they worked, and the courage they showed, you build their self-worth on character rather than results.
                  This creates resilient children who are willing to try, learn, and grow even when things are difficult.
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

export default GratitudeForEffort;