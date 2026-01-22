import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ParentGameShell from "../../ParentGameShell";
import { getParentEducationGameById } from "../data/gameData";

const InnerWeatherCheck = () => {
  const location = useLocation();

  // Get game data
  const gameId = "parent-education-4";
  const gameData = getParentEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Weather options for emotional states
  const weatherOptions = [
    {
      id: 'sunny',
      label: 'Sunny',
      emoji: '☀️',
      description: 'Bright, clear, and positive',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-300'
    },
    {
      id: 'partly-cloudy',
      label: 'Partly Cloudy',
      emoji: '⛅',
      description: 'Mixed feelings, some clarity',
      color: 'from-blue-400 to-gray-400',
      bgColor: 'from-blue-50 to-gray-50',
      borderColor: 'border-blue-300'
    },
    {
      id: 'cloudy',
      label: 'Cloudy',
      emoji: '☁️',
      description: 'Heavy, uncertain, or low',
      color: 'from-gray-400 to-slate-500',
      bgColor: 'from-gray-50 to-slate-50',
      borderColor: 'border-gray-300'
    },
    {
      id: 'stormy',
      label: 'Stormy',
      emoji: '⛈️',
      description: 'Intense, turbulent emotions',
      color: 'from-gray-600 to-purple-700',
      bgColor: 'from-gray-100 to-purple-100',
      borderColor: 'border-gray-400'
    },
    {
      id: 'rainy',
      label: 'Rainy',
      emoji: '🌧️',
      description: 'Sad, melancholic, or teary',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-300'
    },
    {
      id: 'windy',
      label: 'Windy',
      emoji: '💨',
      description: 'Restless, anxious, or scattered',
      color: 'from-teal-400 to-cyan-500',
      bgColor: 'from-teal-50 to-cyan-50',
      borderColor: 'border-teal-300'
    },
    {
      id: 'foggy',
      label: 'Foggy',
      emoji: '🌫️',
      description: 'Unclear, confused, or uncertain',
      color: 'from-slate-300 to-gray-400',
      bgColor: 'from-slate-50 to-gray-50',
      borderColor: 'border-slate-300'
    },
    {
      id: 'rainbow',
      label: 'Rainbow',
      emoji: '🌈',
      description: 'Grateful, hopeful, mixed positive',
      color: 'from-pink-400 via-purple-400 to-indigo-400',
      bgColor: 'from-pink-50 via-purple-50 to-indigo-50',
      borderColor: 'border-purple-300'
    }
  ];

  // Scenarios: Choose today's emotional weather
  const scenarios = [
    {
      id: 1,
      title: "Morning After Restful Sleep",
      description: "You woke up well-rested after a good night's sleep. The house is quiet, and you have a moment to enjoy your coffee. Everything feels manageable.",
      correctWeather: 'sunny',
      options: ['partly-cloudy', 'cloudy', 'rainbow', 'sunny'],
      reflection: "Recognizing 'sunny' weather helps you appreciate positive moments. When you notice this feeling, you can say: 'My inner weather is sunny today.' This awareness helps you recognize what contributes to your wellbeing and return to this state when needed.",
      parentTip: "Ask your child: 'What's your weather today?' This simple question opens conversations about emotions without pressure. When they say 'sunny,' celebrate it together and discuss what makes them feel good."
    },
    {
      id: 2,
      title: "Balancing Work and Family",
      description: "You're managing multiple responsibilities - work deadlines, children's needs, household tasks. Some things are going well, but you feel pulled in different directions.",
      correctWeather: 'partly-cloudy',
      options: ['cloudy', 'partly-cloudy', 'windy', 'foggy'],
      reflection: "Acknowledging 'partly cloudy' weather helps you recognize mixed feelings without judgment. You can say: 'My inner weather is partly cloudy - some things feel good, others feel heavy.' This honest assessment helps you prioritize and ask for support when needed.",
      parentTip: "When your child says their weather is 'partly cloudy,' validate both sides. Say: 'I hear that some things feel good and some feel hard. That's normal. What's making you feel cloudy right now?' This teaches emotional nuance."
    },
    {
      id: 3,
      title: "Overwhelming Day",
      description: "Everything seems to be going wrong. You're behind on tasks, the kids are arguing, and you feel exhausted. Nothing feels right, and you're struggling to stay positive.",
      correctWeather: 'cloudy',
      options: ['stormy', 'rainy', 'cloudy', 'foggy'],
      reflection: "Naming 'cloudy' weather helps you acknowledge difficulty without shame. You can say: 'My inner weather is cloudy today - and that's okay. Clouds pass.' This self-compassion prevents you from adding judgment to an already difficult day.",
      parentTip: "When your child's weather is 'cloudy,' offer comfort without trying to fix it. Say: 'I see your weather is cloudy. That must feel heavy. I'm here with you.' Sometimes children just need to be heard, not cheered up immediately."
    },
    {
      id: 4,
      title: "Conflict with Partner",
      description: "You and your partner just had a heated disagreement. Emotions are running high, and you're feeling intense anger, frustration, and hurt all at once.",
      correctWeather: 'stormy',
      options: ['stormy', 'cloudy', 'windy', 'rainy'],
      reflection: "Identifying 'stormy' weather helps you recognize intense emotions. You can say: 'My inner weather is stormy right now. I need to let this pass before I respond.' This awareness helps you pause and choose your response rather than react impulsively.",
      parentTip: "Teach your child that 'stormy' weather is temporary. Say: 'Sometimes our inner weather gets stormy. Storms pass. While we wait, we can take deep breaths and stay safe.' This normalizes intense emotions while teaching regulation."
    },
    {
      id: 5,
      title: "Feeling Grateful Despite Challenges",
      description: "You've had a challenging week, but you're reflecting on the good moments - a child's laughter, a moment of connection, small victories. You feel grateful even though things aren't perfect.",
      correctWeather: 'rainbow',
      options: ['sunny', 'partly-cloudy', 'windy', 'rainbow'],
      reflection: "Recognizing 'rainbow' weather helps you hold both challenge and gratitude. You can say: 'My inner weather is a rainbow - there's been rain, but I can also see the beauty.' This perspective builds resilience and emotional flexibility.",
      parentTip: "The 'rainbow' weather teaches children that emotions can coexist. Say: 'Your weather can be both challenging and beautiful at the same time. What are you grateful for, even when things are hard?' This builds emotional complexity and resilience."
    }
  ];

  const handleWeatherSelect = (questionIndex, weatherId) => {
    const newSelectedAnswers = { ...selectedAnswers, [questionIndex]: weatherId };
    setSelectedAnswers(newSelectedAnswers);

    // Check if answer is correct
    const scenario = scenarios[questionIndex];
    if (weatherId === scenario.correctWeather) {
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
    }, 2500); // 2.5 second delay to show reflection
  };

  const getWeatherCardStyle = (questionIndex, weatherId) => {
    const selected = selectedAnswers[questionIndex] === weatherId;
    const scenario = scenarios[questionIndex];
    const isCorrect = weatherId === scenario.correctWeather;
    const showFeedback = selected;
    const weather = weatherOptions.find(w => w.id === weatherId);

    let backgroundColor = "bg-white";
    let borderColor = "border-gray-300";
    let textColor = "text-gray-700";
    let scale = "";

    if (showFeedback) {
      if (isCorrect) {
        backgroundColor = `bg-gradient-to-br ${weather.bgColor}`;
        borderColor = "border-green-500";
        textColor = "text-green-700";
        scale = "scale-105 ring-2 ring-green-300";
      } else {
        backgroundColor = "bg-red-50";
        borderColor = "border-red-500";
        textColor = "text-red-700";
      }
    } else if (selected) {
      backgroundColor = `bg-gradient-to-br ${weather.bgColor}`;
      borderColor = weather.borderColor;
      textColor = "text-gray-700";
    }

    return `${backgroundColor} ${borderColor} ${textColor} ${scale}`;
  };

  const currentScenario = scenarios[currentQuestion];
  const availableOptions = currentScenario.options.map(opt =>
    weatherOptions.find(weather => weather.id === opt)
  ).filter(Boolean);

  return (
    <ParentGameShell
      title={gameData?.title || "Inner Weather Check"}
      subtitle={gameData?.description || "Recognize emotional 'weather' and build emotional vocabulary"}
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
                  Check {currentQuestion + 1} of {scenarios.length}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  Score: {score}/{scenarios.length}
                </span>
              </div>
            </div>

            {/* Scenario Description */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {currentScenario.title}
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {currentScenario.description}
                </p>
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">
              What's your inner weather in this moment?
            </h2>

            {/* Weather Options */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {availableOptions.map((weather) => {
                const isSelected = selectedAnswers[currentQuestion] === weather.id;
                const isCorrect = weather.id === currentScenario.correctWeather;
                const showFeedback = isSelected;

                return (
                  <button
                    key={weather.id}
                    onClick={() => !selectedAnswers[currentQuestion] && handleWeatherSelect(currentQuestion, weather.id)}
                    disabled={!!selectedAnswers[currentQuestion]}
                    className={`p-6 rounded-xl border-2 transition-all text-center relative overflow-hidden ${getWeatherCardStyle(currentQuestion, weather.id)
                      } ${selectedAnswers[currentQuestion] ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-xl hover:scale-105'
                      }`}
                  >
                    {/* Animated sky background for selected correct answer */}
                    {showFeedback && isCorrect && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${weather.color} opacity-20 animate-pulse`}></div>
                    )}
                    <div className="relative z-10">
                      <div className="text-6xl mb-3 animate-bounce-slow">{weather.emoji}</div>
                      <div className="font-bold text-base mb-2">{weather.label}</div>
                      <div className="text-xs opacity-75">{weather.description}</div>
                      {showFeedback && (
                        <div className="mt-3 text-2xl font-bold">
                          {isCorrect ? '✓' : '✗'}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Reflection Message */}
            {selectedAnswers[currentQuestion] !== undefined && (
              <div className={`mt-6 p-4 rounded-xl border-2 ${selectedAnswers[currentQuestion] === currentScenario.correctWeather
                  ? 'bg-green-50 border-green-200'
                  : 'bg-orange-50 border-orange-200'
                }`}>
                <div className="flex items-start gap-3">
                  <div className={`text-2xl flex-shrink-0 ${selectedAnswers[currentQuestion] === currentScenario.correctWeather
                      ? 'text-green-600'
                      : 'text-orange-600'
                    }`}>
                    {selectedAnswers[currentQuestion] === currentScenario.correctWeather ? '💡' : '📝'}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold mb-2 ${selectedAnswers[currentQuestion] === currentScenario.correctWeather
                        ? 'text-green-800'
                        : 'text-orange-800'
                      }`}>
                      {selectedAnswers[currentQuestion] === currentScenario.correctWeather
                        ? 'Reflection'
                        : 'Learning Moment'}
                    </h4>
                    <p className={`text-sm leading-relaxed mb-2 ${selectedAnswers[currentQuestion] === currentScenario.correctWeather
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
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </ParentGameShell>
  );
};

export default InnerWeatherCheck;