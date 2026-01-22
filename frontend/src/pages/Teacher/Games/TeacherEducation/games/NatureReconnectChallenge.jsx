import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { TreePine, Sun, Flower, Wind, CheckCircle, Circle, Camera, FileText, Sparkles, BookOpen, Upload, Image } from "lucide-react";

const NatureReconnectChallenge = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-96";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [completedActivities, setCompletedActivities] = useState(new Set());
  const [currentStep, setCurrentStep] = useState('activities'); // 'activities', 'reflection', 'complete'
  const [reflectionType, setReflectionType] = useState(null); // 'photo' or 'note'
  const [reflectionPhoto, setReflectionPhoto] = useState(null);
  const [reflectionNote, setReflectionNote] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);

  // Nature activities checklist
  const activities = [
    {
      id: 'garden',
      title: 'Visit a Garden',
      emoji: '🌺',
      icon: Flower,
      description: 'Spend time in a garden or park with flowers and plants',
      location: 'Garden or Park',
      benefit: 'Flowers and plants reduce stress, improve mood, and create a sense of calm',
      tip: 'Even a small community garden or school garden counts. Take time to notice the colors, textures, and scents.'
    },
    {
      id: 'sunlight',
      title: 'Soak in Sunlight',
      emoji: '☀️',
      icon: Sun,
      description: 'Spend 10-15 minutes in direct sunlight outdoors',
      location: 'Outdoor Space',
      benefit: 'Sunlight boosts vitamin D, regulates circadian rhythm, and naturally increases energy',
      tip: 'Find a sunny spot—could be your backyard, a park bench, or a school courtyard. Even cloudy days provide benefits.'
    },
    {
      id: 'tree',
      title: 'Sit Under a Tree',
      emoji: '🌳',
      icon: TreePine,
      description: 'Spend time near or under a tree',
      location: 'Near Trees',
      benefit: 'Trees reduce stress, improve air quality, and create a sense of connection with nature',
      tip: 'Find a favorite tree—could be in a park, your neighborhood, or school grounds. Notice the shade, texture, and presence.'
    },
    {
      id: 'open-air',
      title: 'Breathe Open Air',
      emoji: '🌬️',
      icon: Wind,
      description: 'Spend time in open air space (not indoors)',
      location: 'Open Air',
      benefit: 'Fresh air improves oxygen levels, reduces indoor pollution exposure, and clears the mind',
      tip: 'Step outside—balcony, porch, yard, or park. Take deep breaths and notice the quality of outdoor air.'
    },
    {
      id: 'ground',
      title: 'Touch the Ground',
      emoji: '🌱',
      icon: TreePine,
      description: 'Walk barefoot on grass or earth (grounding)',
      location: 'Natural Ground',
      benefit: 'Grounding reduces inflammation, improves sleep, and creates connection with the earth',
      tip: 'If safe, remove shoes and walk on grass, sand, or soil. Even sitting with bare feet on the ground helps.'
    },
    {
      id: 'water',
      title: 'Visit Water',
      emoji: '🌊',
      icon: Wind,
      description: 'Spend time near water (lake, river, ocean, fountain)',
      location: 'Water Source',
      benefit: 'Water sounds and views reduce stress, lower cortisol, and create meditative state',
      tip: 'Could be a lake, river, beach, pond, or even a fountain. Water has profound calming effects.'
    },
    {
      id: 'sky',
      title: 'Watch the Sky',
      emoji: '☁️',
      icon: Sun,
      description: 'Spend time observing the sky (clouds, stars, sunrise/sunset)',
      location: 'Outdoor Space',
      benefit: 'Sky gazing reduces eye strain from screens, improves mood, and creates perspective',
      tip: 'Look up! Notice clouds, colors at sunrise/sunset, or stars at night. This simple act is deeply restorative.'
    },
    {
      id: 'birds',
      title: 'Notice Birds',
      emoji: '🦅',
      icon: Flower,
      description: 'Observe birds or wildlife for 10 minutes',
      location: 'Natural Habitat',
      benefit: 'Observing wildlife shifts attention from screens, reduces stress, and creates wonder',
      tip: 'Listen for bird songs, watch their movements, notice their behavior. This mindfulness practice is very calming.'
    }
  ];

  const handleToggleActivity = (activityId) => {
    setCompletedActivities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        // Only allow adding if we haven't reached 5 yet
        if (newSet.size < 5) {
          newSet.add(activityId);
        } else {
          alert('You can only select up to 5 activities. Deselect an activity first if you want to change your selection.');
        }
      }
      return newSet;
    });
  };

  const handleContinueToReflection = () => {
    if (completedActivities.size < 5) {
      alert('Please complete at least 5 activities outdoors before continuing to reflection.');
      return;
    }
    setCurrentStep('reflection');
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setReflectionPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file.');
    }
  };

  const handleSubmitReflection = () => {
    if (!reflectionType) {
      alert('Please choose either a photo or note for your reflection.');
      return;
    }

    if (reflectionType === 'photo' && !reflectionPhoto) {
      alert('Please upload a photo for your reflection.');
      return;
    }

    if (reflectionType === 'note' && !reflectionNote.trim()) {
      alert('Please write a reflection note.');
      return;
    }

    if (reflectionType === 'note' && reflectionNote.trim().length < 10) {
      alert('Please write at least 10 characters for your reflection.');
      return;
    }

    // Set the score to the number of completed activities (up to 5)
    setScore(Math.min(completedActivities.size, 5));
    setShowGameOver(true);
  };

  const getActivityById = (id) => {
    return activities.find(a => a.id === id);
  };

  if (showGameOver) {
    const completedActivitiesList = Array.from(completedActivities).map(id => getActivityById(id)).filter(Boolean);

    return (
      <TeacherGameShell
        title={gameData?.title || "Nature Reconnect Challenge"}
        subtitle={gameData?.description || "Reduce digital fatigue by engaging with nature"}
        showGameOver={true}
        score={score}
        gameId={gameId}
        gameType="teacher-education"
        totalLevels={totalLevels}
        totalCoins={totalCoins}
        currentQuestion={Math.min(completedActivities.size, totalLevels)}
      >
        <div className="w-full max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-6xl mb-4"
              >
                🌿✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Challenge Complete!
              </h2>
              <p className="text-xl text-gray-600">
                You've reconnected with nature and reduced digital fatigue
              </p>
            </div>

            {/* Completion Summary */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TreePine className="w-6 h-6 text-green-600" />
                Activities Completed
              </h3>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {completedActivities.size} / {activities.length}
                </div>
                <p className="text-gray-700">
                  {completedActivities.size >= 5
                    ? 'Great job! You completed at least 5 activities outdoors.'
                    : 'You completed some activities. Try for 5 or more next time!'
                  }
                </p>
              </div>
            </div>

            {/* Completed Activities Grid */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Your Nature Activities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedActivitiesList.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{activity.emoji}</div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 mb-1">{activity.title}</h4>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Reflection Display */}
            {(reflectionPhoto || reflectionNote) && (
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                  Your Reflection
                </h3>
                {reflectionPhoto && photoPreview && (
                  <div className="mb-4">
                    <img
                      src={photoPreview}
                      alt="Nature reflection"
                      className="w-full max-w-md mx-auto rounded-xl border-2 border-gray-200"
                    />
                  </div>
                )}
                {reflectionNote && (
                  <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{reflectionNote}</p>
                  </div>
                )}
              </div>
            )}

            {/* Benefits */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <TreePine className="w-5 h-5" />
                Benefits of Nature Reconnection
              </h3>
              <ul className="space-y-2 text-blue-800">
                <li>• <strong>Reduces digital fatigue:</strong> Nature breaks give your eyes and brain rest from screens</li>
                <li>• <strong>Lowers stress:</strong> Being in nature reduces cortisol and stress hormones</li>
                <li>• <strong>Improves mood:</strong> Nature exposure increases serotonin and improves emotional well-being</li>
                <li>• <strong>Boosts creativity:</strong> Time in nature enhances creative thinking and problem-solving</li>
                <li>• <strong>Improves focus:</strong> Nature breaks restore attention and improve focus when you return to work</li>
                <li>• <strong>Supports physical health:</strong> Sunlight, fresh air, and movement benefit your body</li>
                <li>• <strong>Creates perspective:</strong> Nature reminds you of something bigger than daily tasks</li>
                <li>• <strong>Prevents burnout:</strong> Regular nature breaks prevent accumulation of stress and fatigue</li>
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
                    <strong>Plan monthly "Nature Walk & Talk" meet-ups.</strong> Creating community around nature connection strengthens the practice:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-2 list-disc">
                    <li><strong>Schedule monthly:</strong> Set a recurring monthly date for nature walk and talk (e.g., first Saturday of each month). Consistency builds habit.</li>
                    <li><strong>Choose accessible locations:</strong> Select locations that are easy to reach—local parks, nature trails, school grounds, or community gardens. Accessibility increases participation.</li>
                    <li><strong>Keep it informal:</strong> Make these meet-ups casual and flexible. People can come and go as needed, walk at their own pace. Formality reduces pressure.</li>
                    <li><strong>Combine with conversation:</strong> While walking, encourage conversation—both about teaching and about nature observations. Connection happens naturally while moving.</li>
                    <li><strong>Invite all staff:</strong> Extend invitations to all school staff—teachers, administrators, support staff. Inclusion creates a welcoming community.</li>
                    <li><strong>Share nature observations:</strong> Encourage everyone to share what they notice—birds, plants, weather, sensations. Sharing deepens appreciation.</li>
                    <li><strong>No agenda required:</strong> These walks don't need formal agendas. Simply being together in nature is enough. Simplicity reduces barriers.</li>
                    <li><strong>Respect different paces:</strong> Some people walk fast, some slow. Let people move at their own pace. Acceptance creates comfort.</li>
                    <li><strong>Weather flexibility:</strong> Adapt to weather—shorter walks on extreme days, longer walks on nice days. Flexibility ensures consistency.</li>
                    <li><strong>Document moments:</strong> Take photos or notes during walks to share later (with permission). Documentation creates memories.</li>
                    <li><strong>Create traditions:</strong> Build traditions around these walks—maybe a shared gratitude moment, or a favorite stopping point. Traditions create meaning.</li>
                    <li><strong>Benefits everyone:</strong> Regular nature walks benefit everyone's mental health, reduce isolation, and create connection. This supports the entire school community.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you plan monthly "Nature Walk & Talk" meet-ups, you're creating community around nature connection, reducing isolation, building relationships, and supporting everyone's well-being. Regular nature walks with colleagues create both personal restoration and professional connection.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </TeacherGameShell>
    );
  }

  return (
    <TeacherGameShell
      title={gameData?.title || "Nature Reconnect Challenge"}
      subtitle={gameData?.description || "Reduce digital fatigue by engaging with nature"}
      showGameOver={false}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={Math.min(completedActivities.size, totalLevels)}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {currentStep === 'activities' && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🌿</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Nature Reconnect Challenge
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Complete at least 5 outdoor activities to reconnect with nature and reduce digital fatigue
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-8">
                <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                  <TreePine className="w-5 h-5" />
                  How This Works
                </h3>
                <ul className="text-green-800 space-y-2 text-sm">
                  <li>• <strong>Choose activities:</strong> Select exactly 5 activities from the checklist</li>
                  <li>• <strong>Complete outdoors:</strong> Go outside and complete each activity you've selected</li>
                  <li>• <strong>Check off items:</strong> Mark each activity as complete after you've done it</li>
                  <li>• <strong>Add reflection:</strong> Upload a photo or write a note about your nature experience</li>
                  <li>• <strong>Reduce screen time:</strong> Use this challenge as a break from digital devices</li>
                </ul>
              </div>

              {/* Activities Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {activities.map((activity, index) => {
                  const Icon = activity.icon;
                  const isCompleted = completedActivities.has(activity.id);

                  return (
                    <motion.button
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleToggleActivity(activity.id)}
                      className={`relative overflow-hidden rounded-xl border-2 transition-all text-left ${isCompleted
                          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-lg'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isCompleted
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-400'
                            }`}>
                            {isCompleted ? (
                              <CheckCircle className="w-6 h-6" />
                            ) : (
                              <Circle className="w-6 h-6" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">{activity.emoji}</span>
                              <h3 className={`text-lg font-bold ${isCompleted ? 'text-gray-800' : 'text-gray-700'}`}>
                                {activity.title}
                              </h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {activity.description}
                            </p>
                            <div className="text-xs text-gray-500 mb-2">
                              📍 {activity.location}
                            </div>
                            {isCompleted && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-white rounded-lg p-3 border-2 border-green-200 mt-2"
                              >
                                <p className="text-xs font-semibold text-green-700 mb-1">💡 Benefit:</p>
                                <p className="text-xs text-gray-700 leading-relaxed">{activity.benefit}</p>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Progress Message */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-8">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Progress
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {completedActivities.size >= 5
                      ? '✅ You have completed at least 5 activities! You can continue to reflection or do more activities.'
                      : `Complete ${5 - completedActivities.size} more activity${5 - completedActivities.size === 1 ? '' : 'ies'} to continue`
                    }
                  </p>
                </div>
              </div>

              {/* Continue Button */}
              {completedActivities.size >= 5 && (
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleContinueToReflection}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                  >
                    <Sparkles className="w-5 h-5" />
                    Continue to Reflection
                  </motion.button>
                </div>
              )}
            </>
          )}

          {currentStep === 'reflection' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">📸</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Reflection
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Share your nature experience with a photo or written reflection
                </p>
              </div>

              {/* Reflection Type Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setReflectionType('photo')}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${reflectionType === 'photo'
                      ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-400 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <Camera className={`w-8 h-8 mb-3 ${reflectionType === 'photo' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <h3 className={`text-lg font-bold mb-2 ${reflectionType === 'photo' ? 'text-gray-800' : 'text-gray-700'}`}>
                    Upload Photo
                  </h3>
                  <p className="text-sm text-gray-600">
                    Share a photo from your nature experience
                  </p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setReflectionType('note')}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${reflectionType === 'note'
                      ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-400 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <FileText className={`w-8 h-8 mb-3 ${reflectionType === 'note' ? 'text-purple-600' : 'text-gray-400'}`} />
                  <h3 className={`text-lg font-bold mb-2 ${reflectionType === 'note' ? 'text-gray-800' : 'text-gray-700'}`}>
                    Write Note
                  </h3>
                  <p className="text-sm text-gray-600">
                    Write a reflection about your nature experience
                  </p>
                </motion.button>
              </div>

              {/* Photo Upload */}
              {reflectionType === 'photo' && (
                <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
                  <label className="block mb-4">
                    <span className="text-lg font-semibold text-gray-800 mb-2 block">
                      Upload Your Photo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="cursor-pointer"
                    >
                      <label
                        htmlFor="photo-upload"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-blue-300 rounded-xl bg-white hover:bg-blue-50 transition-all cursor-pointer"
                      >
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="max-w-full max-h-48 rounded-lg"
                          />
                        ) : (
                          <>
                            <Upload className="w-12 h-12 text-blue-400 mb-2" />
                            <p className="text-gray-600">Click to upload or drag and drop</p>
                            <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                          </>
                        )}
                      </label>
                    </motion.div>
                  </label>
                </div>
              )}

              {/* Note Writing */}
              {reflectionType === 'note' && (
                <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200 mb-6">
                  <label className="block mb-4">
                    <span className="text-lg font-semibold text-gray-800 mb-2 block">
                      Write Your Reflection
                    </span>
                    <textarea
                      value={reflectionNote}
                      onChange={(e) => setReflectionNote(e.target.value)}
                      placeholder="Share your thoughts about your nature experience... What did you notice? How did it make you feel? What did you appreciate?"
                      rows={8}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      {reflectionNote.length} characters (minimum 10 required)
                    </p>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmitReflection}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                >
                  <CheckCircle className="w-5 h-5" />
                  Submit Reflection
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </TeacherGameShell>
  );
};

export default NatureReconnectChallenge;