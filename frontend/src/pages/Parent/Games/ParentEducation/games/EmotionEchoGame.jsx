import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const EmotionEchoGame = () => {
  const location = useLocation();

  // Get game data
  const gameId = "parent-education-24";
  const gameData = getParentEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState({});
  const [showOutcome, setShowOutcome] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Scenarios with child expressing emotions - player chooses matching reflective phrase
  const scenarios = [
    {
      id: 1,
      title: "Broken Toy",
      childExpression: "Your child comes to you with tears streaming down their face. They're holding a broken toy car in their hands. They say in a shaky voice: 'My car broke! I can't fix it! It was my favorite one!'",
      childEmotion: "Sad, disappointed, helpless",
      childFeeling: "sad",
      phraseOptions: [

        {
          id: 'dismissive',
          text: "Don't cry about it. It's just a toy. We can buy you a new one. There's no need to be upset.",
          type: "dismissive",
          explanation: "This phrase dismisses the child's emotion and tries to minimize their feelings. It doesn't acknowledge the sadness or the significance the toy held.",
          outcome: "Your child feels invalidated. They may stop sharing their feelings with you because they learn their emotions don't matter. The sadness may persist or turn inward.",
          emoji: "🤐"
        },
        {
          id: 'advice-giving',
          text: "Well, next time you should be more careful with your toys. Maybe we can glue it back together. Let's try to fix it right now!",
          type: "advice-giving",
          explanation: "This phrase jumps straight to solutions and advice without first acknowledging the child's emotional experience. It skips the important step of validation.",
          outcome: "Your child may feel like you're not really understanding their sadness. The advice comes too early, before they've processed the emotion. They may not be ready for solutions yet.",
          emoji: "🔧"
        },
        {
          id: 'reflective',
          text: "You're really sad because your favorite toy car broke. That must feel so disappointing, especially when it was something special to you.",
          type: "reflective",
          explanation: "This phrase mirrors the child's emotion (sadness) and acknowledges the reason (toy broke). It validates their feeling without trying to fix it immediately.",
          outcome: "Your child feels heard and understood. The emotional intensity decreases because they feel validated. They may open up more or process the feeling more easily.",
          emoji: "🪞"
        },
      ],
      correctChoice: "reflective",
      whyItMatters: "When you mirror a child's emotion, you show them that their feelings are valid and understandable. This creates emotional safety and helps them feel truly heard, which is the foundation of trust and connection."
    },
    {
      id: 2,
      title: "Friend Exclusion",
      childExpression: "Your child comes home from school looking dejected. They slump into a chair and say quietly: 'Nobody wanted to play with me at recess today. I tried to join their game, but they said they already had enough players.'",
      childEmotion: "Lonely, rejected, hurt",
      childFeeling: "lonely and rejected",
      phraseOptions: [

        {
          id: 'dismissive',
          text: "Oh, don't worry about it. Friends come and go. You'll find other kids to play with. It's not that big of a deal.",
          type: "dismissive",
          explanation: "This phrase minimizes the child's experience and dismisses their feelings. It doesn't acknowledge how much this rejection hurt them.",
          outcome: "Your child feels like their pain isn't important. They may stop sharing social struggles with you. The hurt remains unprocessed and may affect their confidence.",
          emoji: "😶"
        },
        {
          id: 'reflective',
          text: "You're feeling really hurt and lonely because your friends didn't include you today. That rejection must have stung, especially when you were trying to join in.",
          type: "reflective",
          explanation: "This phrase accurately mirrors the child's emotions (hurt, lonely) and reflects the situation (rejection). It validates their experience without minimizing it.",
          outcome: "Your child feels deeply understood. They may share more details or process the hurt more fully. The validation helps them feel less alone with their pain.",
          emoji: "🤗"
        },
        {
          id: 'advice-giving',
          text: "Well, you should just go find other friends. Or maybe you need to be more assertive. Why don't you try starting your own game next time?",
          type: "advice-giving",
          explanation: "This phrase immediately offers solutions without first acknowledging and validating the child's emotional pain. It tries to fix before understanding.",
          outcome: "Your child may feel like you're not really hearing their hurt. The advice feels premature. They need emotional support first, then solutions later.",
          emoji: "🎯"
        }
      ],
      correctChoice: "reflective",
      whyItMatters: "Mirroring emotions helps children process difficult feelings. When you reflect their hurt and loneliness, they feel less alone and more capable of working through the experience. Solutions come easier after validation."
    },
    {
      id: 3,
      title: "Test Anxiety",
      childExpression: "Your child is pacing back and forth before a big test. Their voice trembles as they say: 'I'm going to fail this test. I didn't study enough. Everyone else knows all the answers, but I don't. I'm so nervous!'",
      childEmotion: "Anxious, overwhelmed, fearful",
      childFeeling: "anxious and fearful",
      phraseOptions: [
        {
          id: 'reflective',
          text: "You're feeling really anxious and worried about this test. The fear of failing and comparing yourself to others is making you feel overwhelmed right now.",
          type: "reflective",
          explanation: "This phrase mirrors the child's anxiety and acknowledges the specific worries (failing, comparison). It validates the intensity of their fear without trying to talk them out of it.",
          outcome: "Your child feels understood and less alone with their anxiety. Having their emotions mirrored often reduces the intensity. They may feel more capable of managing the anxiety once it's been acknowledged.",
          emoji: "🧠"
        },
        {
          id: 'dismissive',
          text: "Stop worrying! You'll be fine. Just calm down. You're making yourself nervous for no reason. You've studied enough.",
          type: "dismissive",
          explanation: "This phrase tells the child not to feel what they're feeling. It dismisses their anxiety and tries to minimize it, which can make them feel invalidated.",
          outcome: "Your child feels misunderstood and may feel worse. Being told not to worry when you're worried is invalidating. The anxiety may increase because they now feel anxious AND wrong for feeling anxious.",
          emoji: "🤫"
        },
        {
          id: 'advice-giving',
          text: "You should take deep breaths. Let's review your notes one more time. Maybe you need better study habits. Here's what you should do...",
          type: "advice-giving",
          explanation: "This phrase jumps to solutions and advice without first acknowledging and validating the child's anxiety. It tries to fix before understanding.",
          outcome: "Your child may not be able to absorb the advice because they're still in an anxious state. They need their anxiety validated first before they can effectively use strategies.",
          emoji: "📝"
        }
      ],
      correctChoice: "reflective",
      whyItMatters: "Anxiety feels less overwhelming when it's acknowledged and mirrored. When you reflect a child's anxious feelings, they feel understood, which actually helps reduce the anxiety. Then they can better access coping strategies."
    },
    {
      id: 4,
      title: "Sibling Comparison",
      childExpression: "Your child looks upset and says with frustration: 'You always help my sister with her homework, but you never help me! You like her more than me. You always have time for her, but never for me!'",
      childEmotion: "Jealous, hurt, feeling unloved",
      childFeeling: "jealous and hurt",
      phraseOptions: [

        {
          id: 'dismissive',
          text: "That's ridiculous! I love you both equally. You're being silly. Don't be jealous. You're just imagining things.",
          type: "dismissive",
          explanation: "This phrase dismisses the child's feelings and gets defensive. It tells them they're wrong to feel what they feel, which invalidates their experience.",
          outcome: "Your child feels dismissed and may feel worse. They learn that their feelings are 'wrong' or 'silly.' They may stop sharing concerns with you because they feel invalidated.",
          emoji: "🚫"
        },
        {
          id: 'advice-giving',
          text: "You need to understand that your sister is younger and needs more help. You should be more independent. Let me explain why this happens...",
          type: "advice-giving",
          explanation: "This phrase immediately explains and justifies without first acknowledging the child's emotional experience. It tries to solve with logic before addressing feelings.",
          outcome: "Your child may feel like their feelings aren't important. Logic doesn't help when emotions are intense. They need their hurt validated first before explanations can be heard.",
          emoji: "🗣️"
        },
        {
          id: 'reflective',
          text: "You're feeling really hurt and jealous because it seems like I give your sister more attention. You're worried that I love her more, and that must feel really painful.",
          type: "reflective",
          explanation: "This phrase mirrors the child's emotions (hurt, jealousy) and reflects their underlying fear (not being loved equally). It validates their experience without getting defensive.",
          outcome: "Your child feels heard and understood. Their hurt is acknowledged, which allows for a meaningful conversation. They may open up more once they feel validated.",
          emoji: "💖"
        },
      ],
      correctChoice: "reflective",
      whyItMatters: "When children express hurt about feeling unloved, they need their feelings mirrored before any explanations. Validation opens the door for meaningful conversation and reassurance that actually gets through."
    },
    {
      id: 5,
      title: "Bedtime Fears",
      childExpression: "At bedtime, your child comes to your room looking scared. Their voice is small and worried: 'I'm scared of the dark. I keep hearing noises and I think there might be monsters. I can't sleep because I'm too afraid.'",
      childEmotion: "Afraid, scared, anxious",
      childFeeling: "afraid and scared",
      phraseOptions: [
        {
          id: 'reflective',
          text: "You're feeling really scared and afraid of the dark right now. The noises you're hearing and the thought of monsters is making you feel unsafe and anxious.",
          type: "reflective",
          explanation: "This phrase mirrors the child's fear and acknowledges what's making them scared. It validates their experience without dismissing it as silly or irrational.",
          outcome: "Your child feels understood and validated. Having their fear mirrored often helps them feel less alone with it. They may feel safer knowing you understand their fear.",
          emoji: "🌙"
        },
        {
          id: 'dismissive',
          text: "There's nothing to be afraid of. Monsters aren't real. You're being silly. Just go back to bed and stop worrying. You're too old for this.",
          type: "dismissive",
          explanation: "This phrase dismisses the child's fear and tells them it's not valid. It minimizes their experience and doesn't acknowledge how real the fear feels to them.",
          outcome: "Your child feels invalidated and may feel worse. Their fear is real to them, and dismissing it doesn't help. They may feel more alone with their fear and less likely to come to you.",
          emoji: "👻"
        },
        {
          id: 'advice-giving',
          text: "You need a night light. Or maybe we should check under your bed together. Here's a strategy to help you sleep better...",
          type: "advice-giving",
          explanation: "This phrase immediately jumps to solutions without first acknowledging and validating the child's fear. It tries to fix before understanding.",
          outcome: "Your child may not feel fully heard. While solutions can help, they're more effective when the child feels their fear has been understood and validated first.",
          emoji: "💡"
        }
      ],
      correctChoice: "reflective",
      whyItMatters: "Fear feels less overwhelming when it's acknowledged. Mirroring a child's fear shows them you understand and validates that their feelings are real. This creates safety, which is what they need most when afraid."
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
  const selectedPhrase = selected ? current.phraseOptions.find(opt => opt.id === selected.choice) : null;

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
            {/* Child's expression */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 mb-8 shadow-xl border-2 border-indigo-200">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {current.title}
                </h2>
                <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="text-5xl">👶</div>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4 italic">
                    {current.childExpression}
                  </p>
                  <div className="bg-indigo-100 rounded-lg p-4">
                    <p className="text-sm text-indigo-800 font-medium">
                      💭 Child's emotion: <span className="font-semibold">{current.childEmotion}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Question */}
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-800 mb-2">
                  Choose the phrase that mirrors their emotion:
                </p>
                <p className="text-sm text-gray-600">
                  Look for the response that reflects and validates how they're feeling
                </p>
              </div>
            </div>

            {/* Phrase options */}
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
                        ? option.type === 'reflective'
                          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg'
                          : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-400 shadow-lg'
                        : 'bg-gray-50 border-gray-300 opacity-50'
                      : option.type === 'reflective'
                        ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300 hover:shadow-xl cursor-pointer'
                        : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-300 hover:shadow-xl cursor-pointer'
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">
                      {option.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="text-base text-gray-700 leading-relaxed italic">
                        "{option.text}"
                      </p>
                    </div>
                  </div>
                  {selected && selected.choice === option.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`absolute top-4 right-4 text-3xl ${option.type === 'reflective' ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                      {option.type === 'reflective' ? '✓' : '×'}
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Hint */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
              <p className="text-sm text-amber-800">
                <strong>💡 Hint:</strong> Look for the phrase that echoes back the child's emotion and validates their experience.
              </p>
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
                  : 'from-orange-50 to-red-50 border-orange-300'
                } rounded-2xl p-8 shadow-xl border-2`}>
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">
                    {selectedPhrase.emoji}
                  </div>
                  <h3 className={`text-3xl font-bold mb-2 ${selected && selected.isCorrect
                      ? 'text-green-700'
                      : 'text-orange-700'
                    }`}>
                    {selected && selected.isCorrect
                      ? 'Correct! This phrase mirrors their emotion.'
                      : selectedPhrase.type === 'dismissive'
                        ? 'This phrase dismisses their emotion.'
                        : 'This phrase gives advice instead of mirroring.'}
                  </h3>
                </div>

                {/* Selected phrase */}
                <div className="bg-white/80 rounded-xl p-6 shadow-lg mb-4">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">
                    {selected && selected.isCorrect ? 'Your choice:' : 'The phrase you chose:'}
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
                    Impact:
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedPhrase.outcome}
                  </p>
                </div>
              </div>

              {/* Show correct reflective phrase if wrong */}
              {selected && !selected.isCorrect && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  delay={0.3}
                  className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6"
                >
                  <h4 className="font-bold text-blue-800 mb-3 text-lg flex items-center gap-2">
                    <span>{current.phraseOptions.find(opt => opt.type === 'reflective').emoji}</span>
                    <span>The Reflective/Mirroring Phrase:</span>
                  </h4>
                  <p className="text-lg text-blue-700 leading-relaxed italic mb-4">
                    "{current.phraseOptions.find(opt => opt.type === 'reflective').text}"
                  </p>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-blue-800 font-medium mb-3">
                      {current.phraseOptions.find(opt => opt.type === 'reflective').explanation}
                    </p>
                    <p className="text-sm text-blue-700">
                      {current.phraseOptions.find(opt => opt.type === 'reflective').outcome}
                    </p>
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
                  <strong>💡 Parent Tip:</strong> Mirroring feelings builds trust faster than giving orders.
                  When you reflect back what your child is feeling, you show them that their emotions are valid and understandable.
                  This emotional validation creates safety, making them feel truly heard and strengthening your connection.
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

export default EmotionEchoGame;