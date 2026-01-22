import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const ReframeGame = () => {
  const location = useLocation();

  // Get game data
  const gameId = "parent-education-16";
  const gameData = getParentEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedReframes, setSelectedReframes] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Stressful thoughts with reframe options
  const scenarios = [
    {
      id: 1,
      stressPhrase: "Nothing works",
      context: "You've tried multiple strategies to help your child, but challenges keep coming. You feel like nothing you do makes a difference.",
      reframes: [

        {
          text: "I need to try harder",
          isCorrect: false,
          explanation: "This still focuses on inadequacy. The issue isn't effort—it's finding the right approach for your unique child and situation.",
          emoji: "💪"
        },
        {
          text: "Maybe I'm not cut out for this",
          isCorrect: false,
          explanation: "This reinforces negative self-belief. You ARE capable. Challenges don't mean you're not meant to parent—they mean you're human and learning.",
          emoji: "😰"
        },
        {
          text: "This is just how it is",
          isCorrect: false,
          explanation: "This feels like giving up. While acceptance is important, reframing to growth keeps you open to new possibilities and solutions.",
          emoji: "😔"
        },
        {
          text: "I'm learning what works and what doesn't",
          isCorrect: true,
          explanation: "This reframe shifts from defeat to growth. Parenting is a learning process, and every attempt teaches you something valuable. You're not failing—you're discovering.",
          emoji: "🌱"
        },
      ],
      learning: "When you think 'nothing works,' you're seeing through a lens of defeat. Reframing to 'I'm learning what works' opens you to growth and new possibilities. Each challenge is data, not failure."
    },
    {
      id: 2,
      stressPhrase: "I'm failing",
      context: "You've made mistakes with your child, lost your temper, or missed important moments. You feel like you're failing as a parent.",
      reframes: [

        {
          text: "I should be perfect",
          isCorrect: false,
          explanation: "This sets an impossible standard. Perfection isn't parenting—love, effort, and growth are. This thought only increases pressure and self-criticism.",
          emoji: "⭐"
        },
        {
          text: "I'm human and I'm learning",
          isCorrect: true,
          explanation: "This reframe normalizes mistakes and emphasizes growth. Everyone makes mistakes—what matters is that you're trying and learning from them.",
          emoji: "👤"
        },
        {
          text: "Everyone else is doing better",
          isCorrect: false,
          explanation: "Comparison steals your peace. You only see others' highlights, not their struggles. Your journey is unique and valid.",
          emoji: "👥"
        },
        {
          text: "I need to do more",
          isCorrect: false,
          explanation: "This adds more pressure. The solution isn't doing more—it's being present, learning, and showing yourself compassion when you struggle.",
          emoji: "⚡"
        }
      ],
      learning: "The thought 'I'm failing' is often based on unrealistic expectations. Reframing to 'I'm human and I'm learning' shifts you from judgment to self-compassion, which actually makes you a better parent."
    },
    {
      id: 3,
      stressPhrase: "I can't handle this",
      context: "Everything feels overwhelming—work, parenting, household tasks. You feel like you're drowning in responsibilities and don't know how to manage.",
      reframes: [
        {
          text: "I can handle this one step at a time",
          isCorrect: true,
          explanation: "Breaking challenges into smaller steps makes them manageable. You've handled difficult things before—this reframe reminds you of your capacity and helps you focus on just the next step.",
          emoji: "🚶‍♀️"
        },
        {
          text: "I'm completely overwhelmed",
          isCorrect: false,
          explanation: "This amplifies the feeling without offering a way forward. While it's important to acknowledge overwhelm, the reframe needs to include a path forward.",
          emoji: "😵"
        },
        {
          text: "I need someone else to help",
          isCorrect: false,
          explanation: "While help is valuable, this thought can make you feel helpless. A better reframe acknowledges you CAN handle it while also being open to support.",
          emoji: "🤝"
        },
        {
          text: "This is too much for me",
          isCorrect: false,
          explanation: "This reinforces helplessness. You ARE capable—you just need to break it down. This reframe keeps you stuck instead of moving forward.",
          emoji: "😰"
        }
      ],
      learning: "When you think 'I can't handle this,' you're seeing the whole mountain at once. Reframing to 'one step at a time' breaks it into manageable pieces. You've handled challenges before—this helps you remember that."
    },
    {
      id: 4,
      stressPhrase: "My child is difficult",
      context: "Your child's behavior is challenging—tantrums, defiance, or constant demands. You find yourself thinking your child is the problem.",
      reframes: [

        {
          text: "My child needs to change",
          isCorrect: false,
          explanation: "This puts all responsibility on the child. While growth is important, focusing only on what they need to change misses what you can control—your response and understanding.",
          emoji: "🔄"
        },
        {
          text: "I'm doing something wrong",
          isCorrect: false,
          explanation: "This flips to self-blame, which isn't helpful. The reframe should focus on understanding and connection, not assigning blame to anyone.",
          emoji: "❌"
        },
        {
          text: "My child is having a hard time, not giving me a hard time",
          isCorrect: true,
          explanation: "This reframe shifts perspective from 'they're doing this TO me' to 'they're struggling WITH something.' Children's difficult behavior is usually communication of an unmet need, not manipulation.",
          emoji: "🤗"
        },
        {
          text: "This is just their personality",
          isCorrect: false,
          explanation: "While some traits are consistent, this can feel like giving up. It's better to see behavior as communication that can be understood and supported.",
          emoji: "🎭"
        }
      ],
      learning: "The thought 'my child is difficult' focuses on the child as the problem. Reframing to 'my child is having a hard time' shifts you to empathy and problem-solving. Behavior is communication—what is your child trying to tell you?"
    },
    {
      id: 5,
      stressPhrase: "I'm ruining my kids",
      context: "After making a mistake, losing your temper, or feeling like you're not doing enough, you worry about the long-term impact on your children.",
      reframes: [

        {
          text: "I need to be perfect from now on",
          isCorrect: false,
          explanation: "This creates more pressure and isn't realistic. Perfection isn't possible or helpful. What matters is showing up, learning, and repairing when you make mistakes.",
          emoji: "⭐"
        },
        {
          text: "The damage is already done",
          isCorrect: false,
          explanation: "This feels final and hopeless. Relationships are ongoing—every moment of repair, connection, and love matters. This reframe keeps you stuck in guilt.",
          emoji: "💔"
        },
        {
          text: "I should have known better",
          isCorrect: false,
          explanation: "This is self-critical and unhelpful. You're learning in real-time. This thought focuses on the past instead of what you can do now—repair, learn, and grow.",
          emoji: "🤔"
        },
        {
          text: "One moment doesn't define our relationship. I can repair and learn.",
          isCorrect: true,
          explanation: "This reframe acknowledges mistakes while emphasizing repair. Children are resilient, and repair is powerful. What matters most is your consistent love, effort, and willingness to grow—not perfection.",
          emoji: "❤️"
        },
      ],
      learning: "The fear 'I'm ruining my kids' often comes from a place of deep love and concern. But one moment doesn't define a relationship. What matters most is your consistent presence, love, effort, and willingness to repair. Children learn from seeing you make mistakes and grow—that's powerful modeling."
    }
  ];

  const handleReframeSelect = (reframeIndex) => {
    if (selectedReframes[currentQuestion]) return; // Already answered

    const selected = scenarios[currentQuestion].reframes[reframeIndex];
    const isCorrect = selected.isCorrect;

    setSelectedReframes(prev => ({
      ...prev,
      [currentQuestion]: {
        reframeIndex,
        isCorrect,
        explanation: selected.explanation
      }
    }));

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentQuestion < totalLevels - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedReframes({});
    setShowExplanation(false);
    setScore(0);
    setShowGameOver(false);
  };

  const progress = ((currentQuestion + 1) / totalLevels) * 100;
  const current = scenarios[currentQuestion];
  const selected = selectedReframes[currentQuestion];

  // Game content
  const gameContent = (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {totalLevels}</span>
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

        {/* Stressful thought */}
        <div className="bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-red-200">
          <div className="text-center mb-6">
            <div className="inline-block bg-white px-4 py-2 rounded-full shadow-md mb-4">
              <span className="text-2xl">💭</span>
            </div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">
              "{current.stressPhrase}"
            </h2>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-lg text-gray-700 leading-relaxed">
                {current.context}
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xl font-semibold text-gray-800">
              Tap the healthier reframe:
            </p>
          </div>
        </div>

        {!showExplanation ? (
          /* Reframe options */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {current.reframes.map((reframe, index) => {
              const isSelected = selected && selected.reframeIndex === index;

              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleReframeSelect(index)}
                  disabled={!!selected}
                  className={`
                    relative p-6 rounded-xl border-2 transition-all text-left
                    ${selected
                      ? isSelected && reframe.isCorrect
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg'
                        : isSelected && !reframe.isCorrect
                          ? 'bg-gradient-to-br from-red-50 to-rose-50 border-red-400 shadow-lg'
                          : reframe.isCorrect
                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                            : 'bg-gray-50 border-gray-300 opacity-50'
                      : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-300 hover:shadow-xl cursor-pointer'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">
                      {reframe.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="text-lg text-gray-900 leading-relaxed font-medium">
                        {reframe.text}
                      </p>
                    </div>
                  </div>

                  {selected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`absolute top-4 right-4 text-2xl ${isSelected && reframe.isCorrect
                          ? 'text-green-600'
                          : isSelected && !reframe.isCorrect
                            ? 'text-red-600'
                            : reframe.isCorrect
                              ? 'text-green-600'
                              : ''
                        }`}
                    >
                      {isSelected && reframe.isCorrect ? '✓' :
                        isSelected && !reframe.isCorrect ? '×' :
                          reframe.isCorrect ? '✓' : ''}
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        ) : (
          /* Explanation */
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Explanation card */}
              <div className={`bg-gradient-to-br ${selected.isCorrect ? 'from-green-50 to-emerald-50 border-green-200' : 'from-orange-50 to-amber-50 border-orange-200'
                } rounded-2xl p-8 shadow-xl border-2`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl">
                    {scenarios[currentQuestion].reframes[selected.reframeIndex]?.emoji || (selected.isCorrect ? '✨' : '💡')}
                  </div>
                  <h3 className={`text-2xl font-bold ${selected.isCorrect ? 'text-green-700' : 'text-orange-700'
                    }`}>
                    {selected.isCorrect ? 'Great Reframe!' : 'Learning Moment'}
                  </h3>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {selected.explanation}
                  </p>
                </div>
              </div>

              {/* Learning insight */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <p className="text-sm text-blue-800 leading-relaxed">
                  <strong>💡 Learning:</strong> {current.learning}
                </p>
              </div>

              {/* Parent tip */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <p className="text-sm text-amber-800 leading-relaxed text-center">
                  <strong>💡 Parent Tip:</strong> Reframing thoughts rewires how you experience stress.
                  When you catch a stressful thought like "{current.stressPhrase}", pause and ask: "What's a kinder, more constructive way to see this?"
                  The reframe doesn't change the situation, but it changes how you feel and respond.
                </p>
              </div>

              {/* Next button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {currentQuestion < totalLevels - 1 ? 'Next Thought' : 'View Results'}
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
      currentLevel={currentQuestion + 1}
      score={score}
      showGameOver={showGameOver}
      onRestart={handleRestart}
      progress={progress}
    >
      {gameContent}
    </ParentGameShell>
  );
};

export default ReframeGame;