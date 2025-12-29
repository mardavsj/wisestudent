import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, BookOpen, Users, Upload, Plus, Trash2, ArrowLeft, CheckCircle } from "lucide-react";
import api from "../utils/api";
import { toast } from "react-hot-toast";
import AssignmentTypeSelector from "./AssignmentTypeSelector";
import QuestionBuilder from "./QuestionBuilder";
import ProjectAssignmentBuilder from "./ProjectAssignmentBuilder";

const NewAssignmentModal = ({ isOpen, onClose, onSuccess, defaultClassId, defaultClassName, editMode = false, assignmentToEdit = null }) => {
  const [showTypeSelector, setShowTypeSelector] = useState(true);
  const [showQuestionBuilder, setShowQuestionBuilder] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [projectData, setProjectData] = useState({
    mode: 'instructions', // 'instructions' or 'virtual'
    title: '',
    description: '',
    subject: '',
    instructions: '',
    deliverables: '',
    resources: '',
    deadline: '',
    duration: 0,
    groupSize: 'individual',
    submissionRequirements: ''
  });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    dueDate: "",
    assignedTo: [],
    points: 100,
    attachments: [],
    type: "homework"
  });

  useEffect(() => {
    if (isOpen) {
      fetchClasses();
      if (editMode && assignmentToEdit) {
        // Populate form with existing assignment data
        setFormData({
          title: assignmentToEdit.title || "",
          description: assignmentToEdit.description || "",
          subject: assignmentToEdit.subject || "",
          dueDate: assignmentToEdit.dueDate ? new Date(assignmentToEdit.dueDate).toISOString().slice(0, 16) : "",
          assignedTo: assignmentToEdit.assignedToClasses || [],
          points: assignmentToEdit.totalMarks || 100,
          attachments: assignmentToEdit.attachments || [],
          type: assignmentToEdit.type || "homework"
        });
        
        if (assignmentToEdit.questions && assignmentToEdit.questions.length > 0) {
          setQuestions(assignmentToEdit.questions);
          setShowTypeSelector(false);
          setShowQuestionBuilder(true);
        }
        
        if (assignmentToEdit.type === 'project') {
          setProjectData({
            mode: assignmentToEdit.projectMode || 'instructions',
            title: assignmentToEdit.title || '',
            description: assignmentToEdit.description || '',
            subject: assignmentToEdit.subject || '',
            instructions: assignmentToEdit.projectData?.instructions || '',
            deliverables: assignmentToEdit.projectData?.deliverables || '',
            resources: assignmentToEdit.projectData?.resources || '',
            deadline: assignmentToEdit.projectData?.deadline || '',
            duration: assignmentToEdit.projectData?.duration || 0,
            groupSize: assignmentToEdit.projectData?.groupSize || 'individual',
            submissionRequirements: assignmentToEdit.projectData?.submissionRequirements || ''
          });
        }
      }
    }
  }, [isOpen, editMode, assignmentToEdit]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const fetchClasses = async () => {
    try {
      const response = await api.get("/api/school/teacher/classes");
      console.log("Classes response:", response.data);
      
      // Handle both old format (array) and new format (object with classes property)
      const classesData = response.data.classes || response.data || [];
      setClasses(classesData);
      
      if (response.data.message) {
        console.log("API Message:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to load classes. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.subject || !formData.dueDate) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      if (formData.assignedTo.length === 0) {
        toast.error("Please select at least one class");
        setLoading(false);
        return;
      }

      // Validation based on assignment type
      if (formData.type === 'quiz' && questions.length === 0) {
        toast.error('Please add questions for the quiz');
        setLoading(false);
        return;
      }
      
      if (formData.type === 'test' && questions.length === 0) {
        toast.error('Please add questions for the test');
        setLoading(false);
        return;
      }
      
      if (formData.type === 'project' && projectData.mode === 'virtual' && questions.length === 0) {
        toast.error('Please add project tasks for virtual mode');
        setLoading(false);
        return;
      }

      // For project assignments, validate that questions have proper content
      if (formData.type === 'project' && projectData.mode === 'virtual') {
        const invalidQuestions = questions.filter(q => !q.question || q.question.trim() === '');
        if (invalidQuestions.length > 0) {
          toast.error('Please provide task descriptions for all project tasks');
          setLoading(false);
          return;
        }
      }

      // Prepare the data for the API
            const assignmentData = {
              title: formData.title,
              description: formData.description,
              subject: formData.subject,
              type: formData.type,
              dueDate: formData.dueDate,
              points: parseInt(formData.points) || 100,
              assignedTo: formData.assignedTo,
              attachments: formData.attachments || [],
              questions: questions,
              totalPoints: questions.reduce((total, q) => total + (q.points || 0), 0),
              questionCount: questions.length,
              instructions: "Complete all questions carefully.",
              gradingType: "auto",
              allowRetake: true,
              maxAttempts: 3,
              // Project-specific data
              ...(formData.type === 'project' && {
                projectMode: projectData.mode,
                projectData: projectData
              })
            };

      console.log("Sending assignment data:", assignmentData);

      let response;
      if (editMode && assignmentToEdit) {
        response = await api.put(`/api/school/teacher/assignments/${assignmentToEdit._id}`, assignmentData);
      } else {
        response = await api.post("/api/school/teacher/assignments", assignmentData);
      }
      
      if (response.data.success) {
        toast.success(editMode ? "Assignment updated successfully!" : "Assignment created successfully!");
        onSuccess?.();
        handleClose();
      } else {
        toast.error(response.data.message || (editMode ? "Failed to update assignment" : "Failed to create assignment"));
      }
    } catch (error) {
      console.error("Error creating assignment:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Failed to create assignment";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      subject: "",
      dueDate: "",
      assignedTo: [],
      points: 100,
      attachments: [],
      type: "homework"
    });
    setProjectData({
      mode: 'instructions',
      title: '',
      description: '',
      subject: '',
      instructions: '',
      deliverables: '',
      resources: '',
      deadline: '',
      duration: 0,
      groupSize: 'individual',
      submissionRequirements: ''
    });
    setShowTypeSelector(true);
    setShowQuestionBuilder(false);
    setSelectedTemplate(null);
    setQuestions([]);
    onClose();
  };

  const handleClassToggle = (classId) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(classId)
        ? prev.assignedTo.filter(id => id !== classId)
        : [...prev.assignedTo, classId]
    }));
  };

  const handleTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, type }));
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    // Always create blank assignment (template is always null now)
    setQuestions([]);
    if (formData.type === 'project') {
      setProjectData(prev => ({
        ...prev,
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        mode: 'instructions'
      }));
    }
    setShowTypeSelector(false);
    setShowQuestionBuilder(true);
  };

  const handleBackToTypeSelector = () => {
    setShowTypeSelector(true);
    setShowQuestionBuilder(false);
    setSelectedTemplate(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl lg:max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                       <div>
                         <h2 className="text-2xl font-bold text-white">{editMode ? "Edit Assignment" : "Create New Assignment"}</h2>
                         <p className="text-purple-100 text-sm">{editMode ? "Update assignment details" : "Create new assignment"}</p>
                       </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {showTypeSelector && (
              <AssignmentTypeSelector
                onTypeSelect={handleTypeSelect}
                onTemplateSelect={handleTemplateSelect}
                selectedType={formData.type}
                selectedTemplate={selectedTemplate}
              />
            )}

            {showQuestionBuilder && (
              <div className="space-y-6">
                {/* Back Button - Enhanced */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, x: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBackToTypeSelector}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all font-semibold"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Type Selection</span>
                  </motion.button>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </motion.div>

                {/* Assignment Details - Professional Design */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Assignment Details</h3>
                      <p className="text-sm text-gray-500">Configure the basic information for your assignment</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Title */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span>Title</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Math Homework - Chapter 5: Algebraic Expressions"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all bg-white"
                      />
                      {formData.title && formData.title.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">{formData.title.length} characters</p>
                      )}
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span>Subject</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g., Mathematics"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all bg-white"
                      />
                    </div>

                    {/* Due Date */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Due Date</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        min={new Date().toISOString().slice(0, 16)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all bg-white"
                      />
                      {formData.dueDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(formData.dueDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>

                    {/* Total Points - Enhanced */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span>Total Points</span>
                        <span className="text-xs text-gray-400 font-normal">(Auto-calculated)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          value={questions.reduce((total, q) => total + (q.points || 0), 0)}
                          readOnly
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 font-bold text-lg"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <span className="text-blue-600 font-semibold">pts</span>
                        </div>
                      </div>
                      {questions.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {questions.length} question{questions.length !== 1 ? 's' : ''} configured
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description - Enhanced */}
                  <div className="mt-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                      <span className="text-xs text-gray-400 font-normal ml-2">(Optional but recommended)</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Provide detailed instructions, learning objectives, and any additional context for students..."
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all resize-none bg-white"
                    />
                    {formData.description && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.description.length} characters
                      </p>
                    )}
                  </div>
                </motion.div>

            {/* Question Builder or Project Builder */}
            {formData.type === 'project' ? (
              <ProjectAssignmentBuilder
                projectData={projectData}
                onProjectDataChange={setProjectData}
                questions={questions}
                onQuestionsChange={setQuestions}
              />
            ) : (
              <QuestionBuilder
                questions={questions}
                onQuestionsChange={setQuestions}
                template={selectedTemplate}
                assignmentType={formData.type}
              />
            )}

                {/* Assign to Classes - Professional Design */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Assign to Classes</h3>
                      <p className="text-sm text-gray-500">
                        Select one or more classes to assign this assignment
                        {formData.assignedTo.length > 0 && (
                          <span className="text-blue-600 font-semibold ml-1">
                            ({formData.assignedTo.length} selected)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {classes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="font-semibold">No classes available</p>
                      <p className="text-sm">Please create a class first before assigning assignments.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {classes.map((cls, index) => {
                        const isSelected = formData.assignedTo.includes(cls._id || cls.name);
                        return (
                          <motion.button
                            key={cls._id || cls.name || `class-${index}`}
                            type="button"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleClassToggle(cls._id || cls.name)}
                            className={`relative px-5 py-4 rounded-xl border-2 font-semibold transition-all text-left overflow-hidden ${
                              isSelected
                                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-500 shadow-lg"
                                : "bg-white text-gray-700 border-slate-200 hover:border-blue-300 hover:shadow-md"
                            }`}
                          >
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 right-2"
                              >
                                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                  <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                              </motion.div>
                            )}
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-blue-50'}`}>
                                <Users className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
                              </div>
                              <div className="flex-1">
                                <div className={`font-bold text-lg mb-1 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                                  {cls.name}
                                </div>
                                {cls.academicYear && (
                                  <div className={`text-sm ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                                    Academic Year: {cls.academicYear}
                                  </div>
                                )}
                                {cls.sections && cls.sections.length > 0 && (
                                  <div className={`text-sm ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                                    Sections: {cls.sections.map(s => s.name).join(', ')}
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>

                {/* Action Buttons - Professional Design */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex gap-4 pt-6 border-t border-slate-200"
                >
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    className="flex-1 px-6 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all border border-slate-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={loading || formData.assignedTo.length === 0 || 
                      (formData.type === 'quiz' && questions.length === 0) ||
                      (formData.type === 'test' && questions.length === 0) ||
                      (formData.type === 'project' && projectData.mode === 'virtual' && questions.length === 0)}
                    className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Creating Assignment...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        <span>Create Assignment</span>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </div>
            )}
          </div>

          {/* Original Form (Hidden when using new flow) */}
          {!showTypeSelector && !showQuestionBuilder && (
          <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Assignment Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Math Homework - Chapter 5"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide details about the assignment..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Subject and Type */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., Mathematics"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                >
                  <option value="homework">Homework</option>
                  <option value="classwork">Classwork</option>
                  <option value="quiz">Quiz</option>
                  <option value="test">Test</option>
                  <option value="project">Project</option>
                </select>
              </div>
            </div>

            {/* Due Date and Points */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Due Date *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Points
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Assign to Classes */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Assign to Classes *
              </label>
              <div className="grid grid-cols-1 gap-2">
                {classes.map((cls, index) => (
                  <motion.button
                    key={cls._id || cls.name || `class-${index}`}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleClassToggle(cls._id || cls.name)}
                    className={`px-4 py-3 rounded-xl border-2 font-semibold transition-all ${
                      formData.assignedTo.includes(cls._id || cls.name)
                        ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white border-purple-500"
                        : "bg-white text-gray-700 border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-bold">{cls.name}</div>
                      {cls.academicYear && (
                        <div className="text-sm opacity-75">Academic Year: {cls.academicYear}</div>
                      )}
                      {cls.sections && cls.sections.length > 0 && (
                        <div className="text-sm opacity-75">
                          Sections: {cls.sections.map(s => s.name).join(', ')}
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
              {classes.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">No classes available</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t-2 border-gray-100">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={loading || formData.assignedTo.length === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Assignment"}
              </motion.button>
            </div>
          </form>
          )}
        </motion.div>
        </div>

      </>
    </AnimatePresence>
  );
};

export default NewAssignmentModal;

