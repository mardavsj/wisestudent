import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import TeacherGameShell from "../../TeacherGameShell";
import { getTeacherEducationGameById } from "../data/gameData";
import { Heart, Mic, MicOff, Send, BookOpen, CheckCircle, Users, MessageSquare, Sparkles, Award, Volume2, Type } from "lucide-react";

const MentorGratitudeChallenge = () => {
  const location = useLocation();

  // Get game data
  const gameId = "teacher-education-88";
  const gameData = getTeacherEducationGameById(gameId);

  // Get game props from location.state or gameData
  const totalCoins = gameData?.calmCoins || location.state?.totalCoins || 5;
  const totalLevels = gameData?.totalQuestions || 5;

  const [selectedPersons, setSelectedPersons] = useState([]);
  const [messageType, setMessageType] = useState('text'); // 'text' or 'voice'
  const [messageText, setMessageText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [messageSent, setMessageSent] = useState(false);
  const [score, setScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // Track which person we're currently messaging (0 = person selection step)

  const mediaRecorderRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const chunksRef = useRef([]);

  // Person selection options
  const personOptions = [
    {
      id: 'mentor-1',
      name: 'My Teaching Mentor',
      role: 'Mentor',
      description: 'A teacher or administrator who guided me',
      emoji: '👨‍🏫',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      id: 'mentor-2',
      name: 'A Former Teacher',
      role: 'Mentor',
      description: 'A teacher who inspired me to become an educator',
      emoji: '📚',
      color: 'from-purple-400 to-indigo-500'
    },
    {
      id: 'mentor-3',
      name: 'A Colleague Mentor',
      role: 'Mentor',
      description: 'A colleague who supported my growth',
      emoji: '🤝',
      color: 'from-green-400 to-emerald-500'
    },
    {
      id: 'mentor-4',
      name: 'An Administrator',
      role: 'Mentor',
      description: 'An administrator who believed in me',
      emoji: '👔',
      color: 'from-orange-400 to-amber-500'
    },
    {
      id: 'student-1',
      name: 'A Current Student',
      role: 'Student',
      description: 'A student who taught me something valuable',
      emoji: '🎓',
      color: 'from-pink-400 to-rose-500'
    },
    {
      id: 'student-2',
      name: 'A Former Student',
      role: 'Student',
      description: 'A former student who inspired my growth',
      emoji: '🌟',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'student-3',
      name: 'A Student Leader',
      role: 'Student',
      description: 'A student who showed exceptional growth',
      emoji: '⭐',
      color: 'from-indigo-400 to-purple-500'
    },
    {
      id: 'other',
      name: 'Someone Else',
      role: 'Other',
      description: 'Another person who inspired my growth',
      emoji: '💫',
      color: 'from-teal-400 to-cyan-500'
    }
  ];

  const handlePersonSelect = (personId) => {
    const person = personOptions.find(p => p.id === personId);
    if (selectedPersons.length < 5 && !selectedPersons.some(p => p.id === personId)) {
      const newSelectedPersons = [...selectedPersons, person];
      setSelectedPersons(newSelectedPersons);

      // If we've reached 5 persons, move to the first person's message creation
      if (newSelectedPersons.length === 5) {
        setCurrentStep(1);
      }
    }
  };

  const handleRemovePerson = (indexToRemove) => {
    const newSelectedPersons = selectedPersons.filter((_, index) => index !== indexToRemove);
    setSelectedPersons(newSelectedPersons);
    if (indexToRemove < currentStep - 1) {
      setCurrentStep(prev => Math.max(1, prev - 1));
    }
  };

  const handleNextPerson = () => {
    if (currentStep < selectedPersons.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevPerson = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleMessageTypeChange = (type) => {
    setMessageType(type);
    // Reset recording state when switching
    if (type === 'text' && isRecording) {
      stopRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const audioUrl = URL.createObjectURL(blob);
        setRecordedAudio(audioUrl);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check your permissions and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDeleteRecording = () => {
    setRecordedAudio(null);
    setAudioBlob(null);
    setRecordingTime(0);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
  };

  const handleSendMessage = () => {
    const currentIndex = currentStep - 1; // Convert to 0-indexed
    if (currentIndex < 0 || currentIndex >= selectedPersons.length) {
      alert("No person selected.");
      return;
    }

    if (messageType === 'text' && !messageText.trim()) {
      alert("Please write your gratitude message first.");
      return;
    }

    if (messageType === 'voice' && !recordedAudio) {
      alert("Please record your gratitude message first.");
      return;
    }

    // Simulate sending
    setMessageSent(true);
    // Increase score by 1 for each completed person
    setScore(prev => Math.min(prev + 1, 5)); // Cap at 5

    // Clear message fields for next person
    setMessageText("");
    setRecordedAudio(null);
    setAudioBlob(null);
    setIsRecording(false);
    setRecordingTime(0);

    // If we've reached 5 people, show game over
    if (score + 1 >= 5) { // If the new score will be 5
      setTimeout(() => {
        setShowGameOver(true);
      }, 3000);
    } else {
      // Move to next person after a short delay
      setTimeout(() => {
        setMessageSent(false);
        setCurrentStep(prev => prev + 1); // Move to next person
      }, 2000);
    }
  };

  const selectedPerson = selectedPersons[currentStep - 1];
  const canSend = selectedPerson && (
    (messageType === 'text' && messageText.trim()) ||
    (messageType === 'voice' && recordedAudio)
  );

  return (
    <TeacherGameShell
      title={gameData?.title || "Mentor Gratitude Challenge"}
      subtitle={gameData?.description || "Express gratitude toward a mentor or student who inspired growth"}
      showGameOver={showGameOver}
      score={score}
      gameId={gameId}
      gameType="teacher-education"
      totalLevels={totalLevels}
      totalCoins={totalCoins}
      currentQuestion={currentStep > 0 ? currentStep : 1}
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        {!showGameOver && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">💌</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Mentor Gratitude Challenge
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Express gratitude toward a mentor or student who inspired your growth. Create a thank-you message to celebrate their impact.
              </p>
            </div>

            {/* Step 1: Select Persons (up to 5) */}
            {currentStep === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-600" />
                  Step 1: Select 5 People
                </h3>
                <p className="text-gray-600 mb-6">
                  Choose 5 mentors or students who inspired your growth and deserve your gratitude (you have selected {selectedPersons.length}/5):
                </p>

                {/* Selected Persons List */}
                {selectedPersons.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-700 mb-3">Selected People:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPersons.map((person, index) => (
                        <div key={`${person.id}-${index}`} className="flex items-center gap-2 bg-purple-100 px-3 py-2 rounded-lg">
                          <span>{person.emoji}</span>
                          <span className="text-sm">{person.name}</span>
                          <button
                            onClick={() => handleRemovePerson(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {personOptions
                    .filter(person => !selectedPersons.some(sp => sp.id === person.id))
                    .map((person) => (
                      <motion.button
                        key={person.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePersonSelect(person.id)}
                        className={`p-6 rounded-xl border-2 border-gray-300 bg-white hover:border-purple-400 hover:shadow-lg transition-all text-left ${selectedPersons.length >= 5 ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-4xl">{person.emoji}</div>
                          <div className="flex-1">
                            <h4 className="font-bold text-lg text-gray-800 mb-1">
                              {person.name}
                            </h4>
                            <p className="text-sm text-purple-600 font-semibold mb-1">
                              {person.role}
                            </p>
                            <p className="text-sm text-gray-600">
                              {person.description}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                </div>

                {selectedPersons.length === 5 && (
                  <div className="mt-6 text-center">
                    <p className="text-green-600 font-semibold">✓ You have selected 5 people. Starting message creation...</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <>
                {/* Selected Person Display */}
                {selectedPersons[currentStep - 1] && (
                  <div className={`bg-gradient-to-br ${selectedPersons[currentStep - 1].color} rounded-xl p-6 border-2 border-purple-200 mb-8`}>
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{selectedPersons[currentStep - 1].emoji}</div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-1">
                          Thanking: {selectedPersons[currentStep - 1].name}
                        </h3>
                        <p className="text-white/90">{selectedPersons[currentStep - 1].description}</p>
                      </div>
                      <div className="text-white text-sm font-semibold">
                        Person {currentStep} of 5
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Choose Message Type */}
                {!messageSent && (
                  <>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <MessageSquare className="w-6 h-6 text-purple-600" />
                      Create Your Message for Person {currentStep} of 5
                    </h3>

                    {/* Message Type Selector */}
                    <div className="flex gap-4 mb-6">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleMessageTypeChange('text')}
                        className={`flex-1 p-4 rounded-xl border-2 font-semibold transition-all flex items-center justify-center gap-2 ${messageType === 'text'
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-400 shadow-lg'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                          }`}
                      >
                        <Type className="w-5 h-5" />
                        Write Message
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleMessageTypeChange('voice')}
                        className={`flex-1 p-4 rounded-xl border-2 font-semibold transition-all flex items-center justify-center gap-2 ${messageType === 'voice'
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-purple-400 shadow-lg'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                          }`}
                      >
                        <Mic className="w-5 h-5" />
                        Record Voice
                      </motion.button>
                    </div>

                    {/* Text Message Editor */}
                    {messageType === 'text' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-6"
                      >
                        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Type className="w-5 h-5 text-purple-600" />
                          Write Your Gratitude Message
                        </h4>

                        <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200 mb-4">
                          <p className="text-sm text-blue-800 mb-2">
                            <strong>Gratitude prompts:</strong>
                          </p>
                          <ul className="text-sm text-blue-700 space-y-1 ml-4 list-disc">
                            <li>What did this person do that inspired your growth?</li>
                            <li>How did their support impact your teaching journey?</li>
                            <li>What specific qualities or actions are you grateful for?</li>
                            <li>How do you want to thank them?</li>
                          </ul>
                        </div>

                        <textarea
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder={`Dear ${selectedPersons[currentStep - 1]?.name.split(' ').slice(-1)[0]},

I wanted to take a moment to express my gratitude for...

[Write your gratitude message here]`}
                          rows={10}
                          className="w-full p-4 rounded-lg border-2 border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none text-gray-800"
                        />

                        {messageText.trim() && (
                          <p className="text-sm text-gray-600 mt-2">
                            {messageText.trim().length} characters
                          </p>
                        )}
                      </motion.div>
                    )}

                    {/* Voice Message Recorder */}
                    {messageType === 'voice' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 mb-6"
                      >
                        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <Mic className="w-5 h-5 text-purple-600" />
                          Record Your Gratitude Message
                        </h4>

                        <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200 mb-4">
                          <p className="text-sm text-blue-800 mb-2">
                            <strong>Recording tips:</strong>
                          </p>
                          <ul className="text-sm text-blue-700 space-y-1 ml-4 list-disc">
                            <li>Find a quiet space before recording</li>
                            <li>Speak clearly and from the heart</li>
                            <li>You can record for up to 5 minutes</li>
                            <li>Listen back before sending</li>
                          </ul>
                        </div>

                        {!recordedAudio ? (
                          <div className="text-center py-8">
                            {!isRecording ? (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={startRecording}
                                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                              >
                                <Mic className="w-5 h-5" />
                                Start Recording
                              </motion.button>
                            ) : (
                              <div className="space-y-4">
                                <div className="flex items-center justify-center gap-4">
                                  <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                    className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center"
                                  >
                                    <MicOff className="w-8 h-8 text-white" />
                                  </motion.div>
                                  <div className="text-center">
                                    <p className="text-2xl font-bold text-red-600 mb-1">
                                      {formatRecordingTime(recordingTime)}
                                    </p>
                                    <p className="text-sm text-gray-600">Recording...</p>
                                  </div>
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={stopRecording}
                                  className="px-8 py-4 bg-red-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                                >
                                  Stop Recording
                                </motion.button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="bg-white rounded-lg p-6 border-2 border-purple-200">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <Volume2 className="w-6 h-6 text-purple-600" />
                                  <span className="font-semibold text-gray-800">
                                    Your Recording ({formatRecordingTime(recordingTime)})
                                  </span>
                                </div>
                                <button
                                  onClick={handleDeleteRecording}
                                  className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all text-sm"
                                >
                                  Delete & Re-record
                                </button>
                              </div>
                              <audio controls src={recordedAudio} className="w-full">
                                Your browser does not support audio playback.
                              </audio>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Send Button */}
                    {canSend && (
                      <div className="text-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSendMessage}
                          className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
                        >
                          <Send className="w-5 h-5" />
                          Send Gratitude Message
                        </motion.button>
                      </div>
                    )}
                  </>
                )}

                {/* Message Sent Confirmation */}
                {messageSent && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      className="text-6xl mb-4"
                    >
                      💌✨
                    </motion.div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">
                      Message Sent!
                    </h3>
                    <p className="text-xl text-gray-600 mb-6">
                      Your gratitude message has been sent to {selectedPersons[currentStep - 1]?.name}.
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                      {score} of 5 messages completed
                    </p>
                    <p className="text-lg text-purple-600 font-semibold">
                      Thank you for expressing your gratitude!
                    </p>
                  </motion.div>
                )}
              </>
            )}
          </div>
        )}

        {/* Game Over Summary */}
        {showGameOver && (
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
                💌✨
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Gratitude Message Sent!
              </h2>
              <p className="text-xl text-gray-600">
                You've expressed gratitude toward someone who inspired your growth
              </p>
            </div>

            {/* Messages Summary for All 5 Persons */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Summary of Your Gratitude Messages</h3>
              {selectedPersons.map((person, index) => (
                <div key={person.id} className={`bg-gradient-to-br ${person.color} rounded-xl p-6 border-2 border-purple-200 mb-4`}>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-4xl">{person.emoji}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        Message {index + 1}: {person.name}
                      </h3>
                      <p className="text-white/90 text-sm">{person.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                The Power of Expressing Gratitude
              </h3>
              <ul className="space-y-2 text-green-800">
                <li>• <strong>Strengthens relationships:</strong> Expressing gratitude builds stronger connections with mentors, colleagues, and students</li>
                <li>• <strong>Celebrates impact:</strong> Gratitude messages help people recognize their influence and feel valued</li>
                <li>• <strong>Builds culture:</strong> Regular gratitude expression creates a culture of appreciation and support</li>
                <li>• <strong>Increases happiness:</strong> Expressing gratitude increases your own happiness and well-being</li>
                <li>• <strong>Encourages growth:</strong> Thanking mentors and students encourages continued growth and support</li>
                <li>• <strong>Creates reciprocity:</strong> Gratitude often inspires others to express appreciation as well</li>
                <li>• <strong>Reinforces learning:</strong> Reflecting on who inspired you reinforces what you've learned and how you've grown</li>
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
                    <strong>Encourage every teacher to complete one gratitude message per term.</strong> Making gratitude expression a regular practice transforms school culture and strengthens relationships:
                  </p>
                  <ul className="text-sm text-amber-800 mt-2 ml-4 space-y-1 list-disc">
                    <li><strong>Set term goals:</strong> Encourage teachers to complete at least one gratitude message per term—to a mentor, student, colleague, or anyone who inspired growth.</li>
                    <li><strong>Create reminders:</strong> Set reminders at the start, middle, and end of each term to prompt gratitude expression. Regular reminders help build the habit.</li>
                    <li><strong>Share in meetings:</strong> Dedicate time in staff meetings to share gratitude (if people want to). Sharing creates inspiration and normalizes expression.</li>
                    <li><strong>Track participation:</strong> Consider tracking participation (anonymously) to celebrate engagement. Tracking helps maintain commitment to the practice.</li>
                    <li><strong>Celebrate senders:</strong> Acknowledge teachers who complete gratitude messages. Celebration reinforces the practice and encourages others.</li>
                    <li><strong>Variety of recipients:</strong> Encourage variety—some messages to mentors, some to students, some to colleagues. Variety helps recognize all sources of support.</li>
                    <li><strong>Flexible timing:</strong> Allow flexibility in when messages are sent during the term. Some prefer beginning, middle, or end—flexibility increases participation.</li>
                    <li><strong>Multiple methods:</strong> Support both written and voice messages. Different methods suit different people and situations.</li>
                    <li><strong>Create templates:</strong> Provide optional templates or prompts to help teachers get started. Templates reduce barriers to expression.</li>
                    <li><strong>Reflect on impact:</strong> Encourage teachers to reflect on the impact of expressing gratitude. Reflection helps teachers see the value of the practice.</li>
                  </ul>
                  <p className="text-sm text-amber-800 leading-relaxed mt-3">
                    When you encourage every teacher to complete one gratitude message per term, you're creating a practice that builds culture, strengthens relationships, celebrates impact, increases happiness, and creates a school environment where gratitude is valued and expressed regularly. This practice transforms individual moments of appreciation into a sustained culture of gratitude that benefits everyone.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </TeacherGameShell>
  );
};

export default MentorGratitudeChallenge;