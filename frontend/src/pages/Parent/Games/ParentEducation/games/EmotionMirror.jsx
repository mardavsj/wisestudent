import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const EmotionMirror = () => {
  const location = useLocation();

  // Get game data
  const gameId = "parent-education-2";
  const gameData = getParentEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedBodyParts, setSelectedBodyParts] = useState({});
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Body parts that can be selected
  const bodyParts = [
    { id: 'head', label: 'Head', emoji: '🧠', position: { top: '5%', left: '50%' } },
    { id: 'neck', label: 'Neck', emoji: '👤', position: { top: '15%', left: '50%' } },
    { id: 'shoulders', label: 'Shoulders', emoji: '💪', position: { top: '20%', left: '50%' } },
    { id: 'chest', label: 'Chest', emoji: '❤️', position: { top: '30%', left: '50%' } },
    { id: 'stomach', label: 'Stomach', emoji: '🛑', position: { top: '45%', left: '50%' } },
    { id: 'hands', label: 'Hands', emoji: '✋', position: { top: '25%', left: '22%' } },
    { id: 'hands-right', label: 'Hands', emoji: '✋', position: { top: '25%', left: '75%' } },
    { id: 'back', label: 'Back', emoji: '🦴', position: { top: '35%', left: '50%' } },
    { id: 'legs', label: 'Legs', emoji: '🦵', position: { top: '60%', left: '50%' } },
  ];

  const scenarios = [
    {
      id: 1,
      title: "Work Deadline Stress",
      description: "You have a major work deadline tomorrow morning. You've been working late, and your child keeps interrupting asking for help with homework. You feel the pressure building.",
      question: "Where in your body do you feel tension or stress right now?",
      correctParts: ['shoulders', 'neck', 'head'], // Common stress areas
      reflection: "Noticing tension in your shoulders, neck, or head is a signal that stress is building. When you identify where tension lives in your body, you can take action: take 3 slow deep breaths, roll your shoulders, or gently stretch your neck. This physical awareness helps you respond to stress before it escalates.",
      parentTip: "Notice tension early and release it with slow breathing. When you feel stress in your body, pause and take 3 deep breaths. This simple act can prevent overreaction and help you respond calmly to your child's needs."
    },
    {
      id: 2,
      title: "Family Conflict",
      description: "You and your partner just had a disagreement about parenting decisions. The conversation ended abruptly, and there's tension in the air. You're sitting alone, replaying the conversation in your mind.",
      question: "Where do you feel the emotional weight in your body?",
      correctParts: ['chest', 'stomach', 'shoulders'],
      reflection: "Emotional stress often manifests in the chest (tightness), stomach (butterflies or knots), or shoulders (carrying the weight). Recognizing these physical signals helps you understand that your body is responding to emotional stress. You can say to yourself: 'I'm feeling this in my chest. Let me take a moment to breathe and process.'",
      parentTip: "Body awareness helps you separate emotional reactions from physical sensations. When you notice tension in your chest or stomach, take slow, deep breaths. This calms your nervous system and gives you space to think clearly."
    },
    {
      id: 3,
      title: "Child's Tantrum",
      description: "Your child is having a meltdown in a public place. People are staring, and you feel judged. You're trying to stay calm, but your body is reacting.",
      question: "What physical sensations do you notice in your body?",
      correctParts: ['hands', 'chest', 'neck'],
      reflection: "Public stress often shows up as clenched hands, a racing heart (chest), or a tight neck. These are your body's signals that you're feeling overwhelmed or judged. Acknowledging these sensations helps you stay grounded. You can practice: 'I notice my hands are clenched. Let me release them and breathe.'",
      parentTip: "Physical awareness in stressful moments helps you stay present. When you notice your body reacting (clenched hands, tight chest), take a moment to release the tension. This prevents you from reacting impulsively to your child's behavior."
    },
    {
      id: 4,
      title: "Peaceful Morning",
      description: "It's a quiet Saturday morning. You've had your coffee, the house is calm, and you're enjoying a moment of peace before the day begins. Everything feels right.",
      question: "Where in your body do you feel lightness or calm?",
      correctParts: ['chest', 'shoulders', 'stomach'],
      reflection: "Calm and peace often feel like openness in the chest, relaxed shoulders, or a settled stomach. Noticing these positive sensations helps you recognize when you're in a good state. You can practice: 'I feel calm in my chest and shoulders. This is what peace feels like in my body.' This awareness helps you return to this state when stress arises.",
      parentTip: "Recognizing calm in your body helps you recreate it. When you notice lightness in your chest or relaxed shoulders, remember this feeling. You can return to this state with slow breathing and gentle movement."
    },
    {
      id: 5,
      title: "Overwhelming Day",
      description: "You've been juggling work calls, household chores, and your child's needs all day. You haven't had a moment to yourself, and you feel completely drained. Your body feels heavy.",
      question: "Where do you feel the exhaustion or heaviness?",
      correctParts: ['legs', 'back', 'shoulders'],
      reflection: "Exhaustion often shows up as heaviness in the legs, tension in the back, or weight in the shoulders. These physical signals tell you that your body needs rest and recovery. Acknowledging this helps you prioritize self-care. You can say: 'I feel heavy in my legs and back. I need to rest or ask for help.'",
      parentTip: "Body awareness helps you recognize when you need support. When you notice heaviness or exhaustion in your body, it's a signal to rest, delegate, or ask for help. Taking care of yourself allows you to be present for your child."
    }
  ];

  const handleBodyPartClick = (partId) => {
    const currentScenario = scenarios[currentQuestion];

    // Track selected parts for this question
    const questionKey = `q${currentQuestion}`;
    const currentSelections = selectedBodyParts[questionKey] || [];

    if (!currentSelections.includes(partId)) {
      const newSelections = [...currentSelections, partId];
      setSelectedBodyParts({
        ...selectedBodyParts,
        [questionKey]: newSelections
      });

      // Check if at least one correct part was selected
      const hasCorrectPart = newSelections.some(sel => currentScenario.correctParts.includes(sel));
      if (hasCorrectPart && !selectedBodyParts[questionKey]?.some(sel => currentScenario.correctParts.includes(sel))) {
        setScore(prev => prev + 1);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < scenarios.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowGameOver(true);
    }
  };

  const currentScenario = scenarios[currentQuestion];
  const questionKey = `q${currentQuestion}`;
  const selectedParts = selectedBodyParts[questionKey] || [];
  const hasSelectedCorrect = selectedParts.some(part => currentScenario.correctParts.includes(part));

  return (
    <ParentGameShell
      title={gameData?.title || "Emotion Mirror"}
      subtitle={gameData?.description || "Observe how your body signals stress or calm"}
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
                  Scenario {currentQuestion + 1} of {scenarios.length}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  Score: {score}/{scenarios.length}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-700 mb-3">
                {currentScenario.title}
              </h3>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4">
                <p className="text-gray-700 leading-relaxed">
                  {currentScenario.description}
                </p>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
              {currentScenario.question}
            </h2>

            {/* Body Outline */}
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 mb-6 min-h-[500px] flex items-center justify-center border-2 border-blue-200">
              <div className="relative w-full max-w-md">
                {/* Body outline SVG-style using divs */}
                <div className="relative mx-auto" style={{ width: '180px', height: '480px' }}>
                  {/* Head */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white rounded-full border-3 border-blue-400 shadow-md"></div>
                  {/* Neck */}
                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-2 border-blue-400"></div>
                  {/* Torso */}
                  <div className="absolute top-22 left-1/2 transform -translate-x-1/2 w-28 h-44 bg-white rounded-lg border-3 border-blue-400 shadow-md"></div>
                  {/* Left Arm */}
                  <div className="absolute top-26 left-1/2 transform -translate-x-18 w-12 h-28 bg-white rounded-lg border-3 border-blue-400 shadow-md"></div>
                  {/* Right Arm */}
                  <div className="absolute top-26 left-1/2 transform translate-x-18 w-12 h-28 bg-white rounded-lg border-3 border-blue-400 shadow-md"></div>
                  {/* Left Leg */}
                  <div className="absolute top-66 left-1/2 transform -translate-x-6 w-10 h-36 bg-white rounded-lg border-3 border-blue-400 shadow-md"></div>
                  {/* Right Leg */}
                  <div className="absolute top-66 left-1/2 transform translate-x-6 w-10 h-36 bg-white rounded-lg border-3 border-blue-400 shadow-md"></div>
                </div>

                {/* Clickable body part markers with better positioning */}
                <button
                  onClick={() => handleBodyPartClick('head')}
                  className={`absolute top-8 left-1/2 transform -translate-x-1/2 transition-all ${selectedParts.includes('head')
                      ? currentScenario.correctParts.includes('head')
                        ? 'bg-green-500 text-white scale-125'
                        : 'bg-red-500 text-white scale-125'
                      : 'bg-white hover:bg-blue-200 text-gray-700'
                    } rounded-full w-14 h-14 flex items-center justify-center border-2 ${selectedParts.includes('head')
                      ? currentScenario.correctParts.includes('head')
                        ? 'border-green-700'
                        : 'border-red-700'
                      : 'border-gray-400'
                    } shadow-lg cursor-pointer z-10`}
                  title="Head"
                >
                  <span className="text-2xl">🧠</span>
                </button>

                <button
                  onClick={() => handleBodyPartClick('neck')}
                  className={`absolute top-20 left-1/2 transform -translate-x-1/2 transition-all ${selectedParts.includes('neck')
                      ? currentScenario.correctParts.includes('neck')
                        ? 'bg-green-500 text-white scale-125'
                        : 'bg-red-500 text-white scale-125'
                      : 'bg-white hover:bg-blue-200 text-gray-700'
                    } rounded-full w-14 h-14 flex items-center justify-center border-2 ${selectedParts.includes('neck')
                      ? currentScenario.correctParts.includes('neck')
                        ? 'border-green-700'
                        : 'border-red-700'
                      : 'border-gray-400'
                    } shadow-lg cursor-pointer z-10`}
                  title="Neck"
                >
                  <span className="text-2xl">👤</span>
                </button>

                <button
                  onClick={() => handleBodyPartClick('shoulders')}
                  className={`absolute top-28 left-1/2 transform -translate-x-1/2 transition-all ${selectedParts.includes('shoulders')
                      ? currentScenario.correctParts.includes('shoulders')
                        ? 'bg-green-500 text-white scale-125'
                        : 'bg-red-500 text-white scale-125'
                      : 'bg-white hover:bg-blue-200 text-gray-700'
                    } rounded-full w-14 h-14 flex items-center justify-center border-2 ${selectedParts.includes('shoulders')
                      ? currentScenario.correctParts.includes('shoulders')
                        ? 'border-green-700'
                        : 'border-red-700'
                      : 'border-gray-400'
                    } shadow-lg cursor-pointer z-10`}
                  title="Shoulders"
                >
                  <span className="text-2xl">💪</span>
                </button>

                <button
                  onClick={() => handleBodyPartClick('chest')}
                  className={`absolute top-40 left-1/2 transform -translate-x-1/2 transition-all ${selectedParts.includes('chest')
                      ? currentScenario.correctParts.includes('chest')
                        ? 'bg-green-500 text-white scale-125'
                        : 'bg-red-500 text-white scale-125'
                      : 'bg-white hover:bg-blue-200 text-gray-700'
                    } rounded-full w-14 h-14 flex items-center justify-center border-2 ${selectedParts.includes('chest')
                      ? currentScenario.correctParts.includes('chest')
                        ? 'border-green-700'
                        : 'border-red-700'
                      : 'border-gray-400'
                    } shadow-lg cursor-pointer z-10`}
                  title="Chest"
                >
                  <span className="text-2xl">❤️</span>
                </button>

                <button
                  onClick={() => handleBodyPartClick('stomach')}
                  className={`absolute top-56 left-1/2 transform -translate-x-1/2 transition-all ${selectedParts.includes('stomach')
                      ? currentScenario.correctParts.includes('stomach')
                        ? 'bg-green-500 text-white scale-125'
                        : 'bg-red-500 text-white scale-125'
                      : 'bg-white hover:bg-blue-200 text-gray-700'
                    } rounded-full w-14 h-14 flex items-center justify-center border-2 ${selectedParts.includes('stomach')
                      ? currentScenario.correctParts.includes('stomach')
                        ? 'border-green-700'
                        : 'border-red-700'
                      : 'border-gray-400'
                    } shadow-lg cursor-pointer z-10`}
                  title="Stomach"
                >
                  <span className="text-2xl">🫀</span>
                </button>

                <button
                  onClick={() => handleBodyPartClick('hands')}
                  className={`absolute top-36 left-1/4 transform -translate-x-1/2 transition-all ${selectedParts.includes('hands')
                      ? currentScenario.correctParts.includes('hands')
                        ? 'bg-green-500 text-white scale-125'
                        : 'bg-red-500 text-white scale-125'
                      : 'bg-white hover:bg-blue-200 text-gray-700'
                    } rounded-full w-14 h-14 flex items-center justify-center border-2 ${selectedParts.includes('hands')
                      ? currentScenario.correctParts.includes('hands')
                        ? 'border-green-700'
                        : 'border-red-700'
                      : 'border-gray-400'
                    } shadow-lg cursor-pointer z-10`}
                  title="Hands"
                >
                  <span className="text-2xl">✋</span>
                </button>

                <button
                  onClick={() => handleBodyPartClick('back')}
                  className={`absolute top-48 left-1/2 transform -translate-x-1/2 transition-all ${selectedParts.includes('back')
                      ? currentScenario.correctParts.includes('back')
                        ? 'bg-green-500 text-white scale-125'
                        : 'bg-red-500 text-white scale-125'
                      : 'bg-white hover:bg-blue-200 text-gray-700'
                    } rounded-full w-14 h-14 flex items-center justify-center border-2 ${selectedParts.includes('back')
                      ? currentScenario.correctParts.includes('back')
                        ? 'border-green-700'
                        : 'border-red-700'
                      : 'border-gray-400'
                    } shadow-lg cursor-pointer z-10`}
                  title="Back"
                >
                  <span className="text-2xl">🦴</span>
                </button>

                <button
                  onClick={() => handleBodyPartClick('legs')}
                  className={`absolute top-80 left-1/2 transform -translate-x-1/2 transition-all ${selectedParts.includes('legs')
                      ? currentScenario.correctParts.includes('legs')
                        ? 'bg-green-500 text-white scale-125'
                        : 'bg-red-500 text-white scale-125'
                      : 'bg-white hover:bg-blue-200 text-gray-700'
                    } rounded-full w-14 h-14 flex items-center justify-center border-2 ${selectedParts.includes('legs')
                      ? currentScenario.correctParts.includes('legs')
                        ? 'border-green-700'
                        : 'border-red-700'
                      : 'border-gray-400'
                    } shadow-lg cursor-pointer z-10`}
                  title="Legs"
                >
                  <span className="text-2xl">🦵</span>
                </button>
              </div>
            </div>

            {/* Selected parts display */}
            {selectedParts.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600 mb-2">You selected:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedParts.map(partId => {
                    const part = bodyParts.find(p => p.id === partId);
                    const isCorrect = currentScenario.correctParts.includes(partId);
                    return (
                      <span
                        key={partId}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${isCorrect
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                          }`}
                      >
                        {part?.emoji} {part?.label} {isCorrect ? '✓' : '✗'}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reflection Message */}
            {selectedParts.length > 0 && (
              <div className={`mt-6 p-4 rounded-xl border-2 ${hasSelectedCorrect
                  ? 'bg-green-50 border-green-200'
                  : 'bg-orange-50 border-orange-200'
                }`}>
                <div className="flex items-start gap-3">
                  <div className={`text-2xl flex-shrink-0 ${hasSelectedCorrect
                      ? 'text-green-600'
                      : 'text-orange-600'
                    }`}>
                    {hasSelectedCorrect ? '💡' : '📝'}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold mb-2 ${hasSelectedCorrect
                        ? 'text-green-800'
                        : 'text-orange-800'
                      }`}>
                      {hasSelectedCorrect
                        ? 'Reflection'
                        : 'Learning Moment'}
                    </h4>
                    <p className={`text-sm leading-relaxed mb-2 ${hasSelectedCorrect
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
                <button
                  onClick={handleNext}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {currentQuestion < scenarios.length - 1 ? 'Next Scenario' : 'Finish Game'}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </ParentGameShell>
  );
};

export default EmotionMirror;