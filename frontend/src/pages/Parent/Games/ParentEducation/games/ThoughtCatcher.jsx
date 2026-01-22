import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const ThoughtCatcher = () => {
  const location = useLocation();

  // Get game data
  const gameId = "parent-education-6";
  const gameData = getParentEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Negative thoughts that parents might have
  const negativeThoughts = [
    { id: 'bad-parent', text: "I'm a bad parent", category: 'self-judgment' },
    { id: 'cant-handle', text: "I can't handle this", category: 'helplessness' },
    { id: 'failing', text: "I'm failing at everything", category: 'failure' },
    { id: 'everyone-better', text: "Everyone else is better than me", category: 'comparison' },
    { id: 'ruining-kids', text: "I'm ruining my kids", category: 'self-blame' },
    { id: 'not-enough', text: "I'm not enough", category: 'inadequacy' },
    { id: 'always-wrong', text: "I always do everything wrong", category: 'self-criticism' },
    { id: 'should-know', text: "I should know how to handle this", category: 'expectations' },
    { id: 'alone', text: "I'm all alone in this", category: 'isolation' },
    { id: 'broken', text: "Something is wrong with me", category: 'self-worth' }
  ];

  // Scenarios with negative thoughts to reframe
  const scenarios = [
    {
      id: 1,
      title: "After a Child's Meltdown",
      description: "Your child just had a major tantrum in public. You tried everything to calm them, but nothing worked. Other parents are looking, and you feel embarrassed and defeated.",
      negativeThought: "I'm a bad parent",
      thoughtBubble: "💭",
      reframeOptions: [

        { id: 'reframe2', text: "All parents face challenging moments", isCorrect: false },
        { id: 'reframe3', text: "This is temporary and doesn't define me", isCorrect: false },
        { id: 'reframe1', text: "I'm doing my best, and that's enough", isCorrect: true },
        { id: 'reframe4', text: "I'm learning and growing as a parent", isCorrect: false }
      ],
      affirmation: "I am a capable parent learning and growing every day. Challenges don't define my worth.",
      reflection: "Reframing 'I'm a bad parent' to 'I'm doing my best' shifts from judgment to compassion. When you catch negative self-talk, pause and replace it with a kinder thought. This gentle self-talk reduces shame and helps you respond to challenges with clarity rather than self-criticism.",
      parentTip: "Use the same gentle words with yourself that you'd use with your child. If your child made a mistake, you'd say: 'It's okay, we all make mistakes.' Say the same to yourself. Practice: 'I'm learning. It's okay. I'm doing my best.'"
    },
    {
      id: 2,
      title: "Feeling Overwhelmed",
      description: "You have too much to do - work deadlines, children's needs, household tasks. Everything feels urgent, and you don't know where to start. You feel like you're drowning in responsibilities.",
      negativeThought: "I can't handle this",
      thoughtBubble: "💭",
      reframeOptions: [
        { id: 'reframe1', text: "I'm feeling overwhelmed, and that's okay", isCorrect: false },
        { id: 'reframe2', text: "I can handle this one step at a time", isCorrect: true },
        { id: 'reframe3', text: "I've handled challenges before", isCorrect: false },
        { id: 'reframe4', text: "I can ask for help when needed", isCorrect: false }
      ],
      affirmation: "I am capable and resilient. I can break challenges into small steps and handle them one at a time.",
      reflection: "Changing 'I can't handle this' to 'I can handle this one step at a time' transforms helplessness into agency. When overwhelmed, break tasks into smaller pieces and focus on just the next step. This reduces anxiety and builds confidence.",
      parentTip: "When you feel overwhelmed, pause and ask: 'What's one small thing I can do right now?' This breaks the cycle of 'I can't handle this' thinking. Model this for your child: 'This feels big, but let's do one thing at a time.'"
    },
    {
      id: 3,
      title: "Comparing to Other Parents",
      description: "You see other parents who seem to have it all together - organized schedules, calm children, perfect meals. You feel like you're constantly falling short compared to everyone else.",
      negativeThought: "Everyone else is better than me",
      thoughtBubble: "💭",
      reframeOptions: [
        { id: 'reframe2', text: "Social media shows highlights, not reality", isCorrect: false },
        { id: 'reframe3', text: "I have my own strengths as a parent", isCorrect: false },
        { id: 'reframe4', text: "Comparison steals my joy", isCorrect: false },
        { id: 'reframe1', text: "I'm on my own unique parenting journey", isCorrect: true },
      ],
      affirmation: "I am enough. My parenting journey is unique, and I bring my own strengths and love to my family.",
      reflection: "Reframing comparison thoughts helps you focus on your own journey rather than others'. Everyone's situation is different, and social media only shows highlights. Your worth as a parent isn't measured against others - it's measured by your love, effort, and presence.",
      parentTip: "When you catch yourself comparing, pause and list three things you're doing well as a parent. Remind yourself: 'I'm doing the best I can with what I have.' Teach your child the same: 'We all have different strengths. Let's focus on ours.'"
    },
    {
      id: 4,
      title: "After Making a Mistake",
      description: "You lost your temper with your child earlier today and said something you regret. You've been replaying the moment in your mind, feeling guilty and worried about the impact on your child.",
      negativeThought: "I'm ruining my kids",
      thoughtBubble: "💭",
      reframeOptions: [
        { id: 'reframe1', text: "One moment doesn't define our relationship", isCorrect: true },
        { id: 'reframe2', text: "I can repair and apologize", isCorrect: false },
        { id: 'reframe3', text: "I'm human and make mistakes", isCorrect: false },
        { id: 'reframe4', text: "My love and care matter more than mistakes", isCorrect: false }
      ],
      affirmation: "I am a loving parent who makes mistakes and learns from them. My children know they are loved.",
      reflection: "Replacing 'I'm ruining my kids' with 'one moment doesn't define our relationship' helps you see the bigger picture. Children are resilient, and repair is powerful. Apologizing to your child models accountability and shows that everyone makes mistakes.",
      parentTip: "When you make a mistake, repair with your child: 'I'm sorry I lost my temper. That wasn't okay. I love you.' This teaches them that relationships can be repaired. Say the same to yourself: 'I made a mistake. I can repair. I'm still a good parent.'"
    },
    {
      id: 5,
      title: "Feeling Inadequate",
      description: "You're struggling with parenting challenges and feeling like you don't have what it takes. You doubt your abilities and wonder if you're cut out for this parenting role.",
      negativeThought: "I'm not enough",
      thoughtBubble: "💭",
      reframeOptions: [
        { id: 'reframe2', text: "Parenting is challenging for everyone", isCorrect: false },
        { id: 'reframe1', text: "I am enough, exactly as I am", isCorrect: true },
        { id: 'reframe3', text: "I'm learning and growing", isCorrect: false },
        { id: 'reframe4', text: "My love and presence matter", isCorrect: false }
      ],
      affirmation: "I am enough. I bring love, effort, and care to my parenting. That is enough.",
      reflection: "Transforming 'I'm not enough' to 'I am enough' is a fundamental shift toward self-compassion. You don't need to be perfect to be a good parent - you need to be present, loving, and willing to learn. Your children don't need a perfect parent; they need you, with all your humanity.",
      parentTip: "Create a daily affirmation: 'I am enough. I am doing my best. My children are loved.' Write it down and read it when self-doubt creeps in. Teach your child the same: 'You are enough, exactly as you are.' This builds resilience in both of you."
    }
  ];

  const handleReframeSelect = (questionIndex, reframeId) => {
    const newSelectedAnswers = { ...selectedAnswers, [questionIndex]: reframeId };
    setSelectedAnswers(newSelectedAnswers);

    // Check if answer is correct
    const scenario = scenarios[questionIndex];
    const selectedReframe = scenario.reframeOptions.find(opt => opt.id === reframeId);
    if (selectedReframe && selectedReframe.isCorrect) {
      setScore(prev => prev + 1);
    }

    // Move to next question after a short delay
    setTimeout(() => {
      if (questionIndex < scenarios.length - 1) {
        setCurrentQuestion(questionIndex + 1);
      } else {
        // All questions answered
        setShowGameOver(true);
      }
    }, 6500); // 2.5 second delay to show affirmation
  };

  const getReframeStyle = (questionIndex, reframeId) => {
    const selected = selectedAnswers[questionIndex] === reframeId;
    const scenario = scenarios[questionIndex];
    const selectedReframe = scenario.reframeOptions.find(opt => opt.id === reframeId);
    const isCorrect = selectedReframe && selectedReframe.isCorrect;
    const showFeedback = selected;

    let backgroundColor = "bg-white";
    let borderColor = "border-gray-300";
    let textColor = "text-gray-700";

    if (showFeedback) {
      if (isCorrect) {
        backgroundColor = "bg-green-50";
        borderColor = "border-green-500";
        textColor = "text-green-700";
      } else {
        backgroundColor = "bg-red-50";
        borderColor = "border-red-500";
        textColor = "text-red-700";
      }
    } else if (selected) {
      backgroundColor = "bg-blue-50";
      borderColor = "border-blue-500";
      textColor = "text-blue-700";
    }

    return `${backgroundColor} ${borderColor} ${textColor}`;
  };

  const currentScenario = scenarios[currentQuestion];
  const selectedReframeId = selectedAnswers[currentQuestion];
  const selectedReframe = selectedReframeId ?
    currentScenario.reframeOptions.find(opt => opt.id === selectedReframeId) : null;

  return (
    <ParentGameShell
      title={gameData?.title || "Thought Catcher"}
      subtitle={gameData?.description || "Spot negative self-talk and reframe it with compassion"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="parent-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentQuestion}
    >
      {currentQuestion < scenarios.length ? (
        <div className="w-full max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">
                  Thought {currentQuestion + 1} of {scenarios.length}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  Score: {score}/{scenarios.length}
                </span>
              </div>
            </div>

            {/* Scenario Description */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {currentScenario.title}
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  {currentScenario.description}
                </p>

                {/* Negative Thought Bubble */}
                <div className="bg-white rounded-xl p-4 border-2 border-orange-300 shadow-md relative">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{currentScenario.thoughtBubble}</span>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Negative Thought:</p>
                      <p className="text-lg font-semibold text-red-700">
                        "{currentScenario.negativeThought}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">
              Choose the best reframe for this thought:
            </h2>

            {/* Reframe Options */}
            <div className="space-y-4 mb-6">
              {currentScenario.reframeOptions.map((reframe) => {
                const isSelected = selectedAnswers[currentQuestion] === reframe.id;
                const showFeedback = isSelected;

                return (
                  <button
                    key={reframe.id}
                    onClick={() => !selectedAnswers[currentQuestion] && handleReframeSelect(currentQuestion, reframe.id)}
                    disabled={!!selectedAnswers[currentQuestion]}
                    className={`w-full p-5 rounded-xl border-2 text-left transition-all ${getReframeStyle(currentQuestion, reframe.id)
                      } ${selectedAnswers[currentQuestion] ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-lg hover:scale-[1.02]'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💭</span>
                        <span className="font-medium text-base">{reframe.text}</span>
                      </div>
                      {showFeedback && (
                        <span className="text-xl font-bold">
                          {reframe.isCorrect ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Affirmation Display */}
            {selectedReframe && selectedReframe.isCorrect && (
              <div className="mb-6 animate-fade-in">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 shadow-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">✨</span>
                    <div>
                      <h4 className="font-bold text-green-800 mb-2">Affirmation Replacement</h4>
                      <p className="text-lg text-green-700 font-medium italic leading-relaxed">
                        "{currentScenario.affirmation}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reflection Message */}
            {selectedAnswers[currentQuestion] !== undefined && (
              <div className={`mt-6 p-4 rounded-xl border-2 ${selectedReframe && selectedReframe.isCorrect
                  ? 'bg-green-50 border-green-200'
                  : 'bg-orange-50 border-orange-200'
                }`}>
                <div className="flex items-start gap-3">
                  <div className={`text-2xl flex-shrink-0 ${selectedReframe && selectedReframe.isCorrect
                      ? 'text-green-600'
                      : 'text-orange-600'
                    }`}>
                    {selectedReframe && selectedReframe.isCorrect ? '💡' : '📝'}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold mb-2 ${selectedReframe && selectedReframe.isCorrect
                        ? 'text-green-800'
                        : 'text-orange-800'
                      }`}>
                      {selectedReframe && selectedReframe.isCorrect
                        ? 'Reflection'
                        : 'Learning Moment'}
                    </h4>
                    <p className={`text-sm leading-relaxed mb-2 ${selectedReframe && selectedReframe.isCorrect
                        ? 'text-green-700'
                        : 'text-orange-700'
                      }`}>
                      {currentScenario.reflection}
                    </p>
                    <div className="bg-white/60 rounded-lg p-3 mt-3 border border-blue-200">
                      <p className="text-xs font-semibold text-blue-800 mb-1">Parent Tip:</p>
                      <p className="text-xs text-blue-700">
                        {currentScenario.parentTip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </ParentGameShell>
  );
};

export default ThoughtCatcher;