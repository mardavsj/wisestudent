import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  FileText,
  CheckCircle,
  X,
  Hash,
  Type,
  Edit3,
  Lightbulb
} from 'lucide-react';

const QuestionBuilder = ({ questions = [], onQuestionsChange, template = null, assignmentType = null }) => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    type: 'multiple_choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 1,
    explanation: '',
    required: true,
    timeLimit: 0 // in minutes
  });

  // Get available question types based on assignment type
  const getQuestionTypes = () => {
    const allTypes = [
      {
        id: 'multiple_choice',
        name: 'Multiple Choice',
        icon: CheckCircle,
        description: 'Choose one correct answer from multiple options'
      },
      {
        id: 'true_false',
        name: 'True/False',
        icon: CheckCircle,
        description: 'Simple true or false questions'
      },
      {
        id: 'short_answer',
        name: 'Short Answer',
        icon: Type,
        description: 'Brief text responses'
      },
      {
        id: 'essay',
        name: 'Essay',
        icon: Edit3,
        description: 'Long-form written responses'
      },
      {
        id: 'fill_in_blank',
        name: 'Fill in the Blank',
        icon: Hash,
        description: 'Complete missing words or phrases'
      },
      {
        id: 'matching',
        name: 'Matching',
        icon: CheckCircle,
        description: 'Match items from two columns'
      },
      {
        id: 'problem_solving',
        name: 'Problem Solving',
        icon: Lightbulb,
        description: 'Mathematical or logical problems'
      },
      {
        id: 'word_problem',
        name: 'Word Problem',
        icon: Lightbulb,
        description: 'Real-world problem solving'
      },
      {
        id: 'research_question',
        name: 'Research Question',
        icon: Edit3,
        description: 'Research-based questions'
      },
      {
        id: 'presentation',
        name: 'Presentation',
        icon: Edit3,
        description: 'Presentation tasks'
      },
      {
        id: 'reflection',
        name: 'Reflection',
        icon: Edit3,
        description: 'Reflective writing tasks'
      }
    ];

    // Filter based on assignment type
    switch (assignmentType) {
      case 'quiz':
        return allTypes.filter(type => ['multiple_choice', 'true_false'].includes(type.id));
      case 'test':
        return allTypes; // All types allowed for tests
      case 'homework':
        return allTypes; // All types allowed for homework
      case 'classwork':
        return allTypes; // All types allowed for classwork
      case 'project':
        return allTypes.filter(type => ['research_question', 'presentation', 'reflection'].includes(type.id));
      default:
        return allTypes;
    }
  };

  const questionTypes = getQuestionTypes();

  const addQuestion = () => {
    if (!newQuestion.question.trim()) {
      alert('Please enter a question');
      return;
    }

    const question = {
      ...newQuestion,
      id: Date.now().toString(),
      options: newQuestion.type === 'multiple_choice' ? newQuestion.options.filter(opt => opt.trim()) : undefined
    };

    onQuestionsChange([...questions, question]);
    setNewQuestion({
      type: 'multiple_choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1,
      explanation: '',
      required: true
    });
  };

  const updateQuestion = (index, updatedQuestion) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], ...updatedQuestion };
    onQuestionsChange(updated);
  };

  const deleteQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    onQuestionsChange(updated);
  };

  const addOption = (questionIndex) => {
    const question = questions[questionIndex];
    const updatedOptions = [...question.options, ''];
    updateQuestion(questionIndex, { options: updatedOptions });
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const question = questions[questionIndex];
    const updatedOptions = [...question.options];
    updatedOptions[optionIndex] = value;
    updateQuestion(questionIndex, { options: updatedOptions });
  };

  const removeOption = (questionIndex, optionIndex) => {
    const question = questions[questionIndex];
    const updatedOptions = question.options.filter((_, i) => i !== optionIndex);
    updateQuestion(questionIndex, { 
      options: updatedOptions,
      correctAnswer: Math.min(question.correctAnswer, updatedOptions.length - 1)
    });
  };

  const renderQuestionForm = (question, index) => {
    const isExpanded = expandedQuestion === index;
    const questionType = questionTypes.find(t => t.id === question.type);
    const IconComponent = questionType?.icon || FileText;

    return (
      <motion.div
        key={question.id || index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden"
      >
        {/* Question Header */}
        <div 
          className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setExpandedQuestion(isExpanded ? null : index)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <IconComponent className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Question {index + 1} - {questionType?.name}
                </h4>
                <p className="text-sm text-gray-600 truncate max-w-md">
                  {question.question || 'No question text'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{question.points} pts</span>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {/* Question Form */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-200"
            >
              <div className="p-4 space-y-4">
                {/* Question Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Question Type
                  </label>
                  <select
                    value={question.type || 'multiple_choice'}
                    onChange={(e) => updateQuestion(index, { type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    {questionTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                {/* Question Text */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Question Text *
                  </label>
                  <textarea
                    value={question.question || ''}
                    onChange={(e) => updateQuestion(index, { question: e.target.value })}
                    placeholder="Enter your question here..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Multiple Choice Options */}
                {question.type === 'multiple_choice' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Answer Options
                    </label>
                    <div className="space-y-2">
                      {question.options?.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${index}`}
                            checked={question.correctAnswer === optionIndex}
                            onChange={() => updateQuestion(index, { correctAnswer: optionIndex })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                            placeholder={`Option ${optionIndex + 1}`}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                          />
                          {question.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(index, optionIndex)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOption(index)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Add Option
                      </button>
                    </div>
                  </div>
                )}

                {/* True/False Options */}
                {question.type === 'true_false' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Correct Answer
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`tf-${index}`}
                          checked={question.correctAnswer === true}
                          onChange={() => updateQuestion(index, { correctAnswer: true })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span>True</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`tf-${index}`}
                          checked={question.correctAnswer === false}
                          onChange={() => updateQuestion(index, { correctAnswer: false })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span>False</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Short Answer / Fill in Blank */}
                {(question.type === 'short_answer' || question.type === 'fill_in_blank') && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Correct Answer
                    </label>
                    <input
                      type="text"
                      value={question.correctAnswer || ''}
                      onChange={(e) => updateQuestion(index, { correctAnswer: e.target.value })}
                      placeholder="Enter the correct answer..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                )}

                {/* Points, Time Limit, and Required */}
                <div className={`grid gap-4 ${assignmentType === 'test' ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Points
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={question.points || 0}
                      onChange={(e) => updateQuestion(index, { points: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  {assignmentType === 'test' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Time Limit (min)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={question.timeLimit || 0}
                        onChange={(e) => updateQuestion(index, { timeLimit: parseInt(e.target.value) || 0 })}
                        placeholder="0 = no limit"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Required
                    </label>
                    <select
                      value={question.required || 'true'}
                      onChange={(e) => updateQuestion(index, { required: e.target.value === 'true' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>

                {/* Explanation */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Explanation (Optional)
                  </label>
                  <textarea
                    value={question.explanation || ''}
                    onChange={(e) => updateQuestion(index, { explanation: e.target.value })}
                    placeholder="Explain why this is the correct answer..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => deleteQuestion(index)}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Question
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Questions</h3>
            <p className="text-sm text-gray-600">Add and configure questions for your assignment</p>
          </div>
        </div>
        {questions.length > 0 && (
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg font-semibold">
              {questions.length} Question{questions.length !== 1 ? 's' : ''}
            </div>
            <div className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg font-semibold">
              {questions.reduce((total, q) => total + (q.points || 0), 0)} Total Points
            </div>
          </div>
        )}
      </div>

      {/* Existing Questions */}
      {questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((question, index) => renderQuestionForm(question, index))}
        </div>
      )}

      {/* Add New Question - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border-2 border-dashed border-blue-300"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900">Add New Question</h4>
            <p className="text-sm text-gray-600">Create a new question for your assignment</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Question Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Question Type
            </label>
            <select
              value={newQuestion.type || 'multiple_choice'}
              onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              {questionTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Question Text *
            </label>
            <textarea
              value={newQuestion.question || ''}
              onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
              placeholder="Enter your question here..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          {/* Multiple Choice Options for New Question */}
          {newQuestion.type === 'multiple_choice' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Answer Options
              </label>
              <div className="space-y-2">
                {newQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="new-correct"
                      checked={newQuestion.correctAnswer === index}
                      onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: index })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newQuestion.options];
                        newOptions[index] = e.target.value;
                        setNewQuestion({ ...newQuestion, options: newOptions });
                      }}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* True/False for New Question */}
          {newQuestion.type === 'true_false' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correct Answer
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="new-tf"
                    checked={newQuestion.correctAnswer === true}
                    onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: true })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>True</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="new-tf"
                    checked={newQuestion.correctAnswer === false}
                    onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: false })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>False</span>
                </label>
              </div>
            </div>
          )}

          {/* Short Answer / Fill in Blank for New Question */}
          {(newQuestion.type === 'short_answer' || newQuestion.type === 'fill_in_blank') && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correct Answer
              </label>
              <input
                type="text"
                value={newQuestion.correctAnswer || ''}
                onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                placeholder="Enter the correct answer..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          {/* Points and Time Limit */}
          <div className={`grid gap-4 ${assignmentType === 'test' ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Points
              </label>
              <input
                type="number"
                min="0"
                value={newQuestion.points || 0}
                onChange={(e) => setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            {assignmentType === 'test' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Time Limit (min)
                </label>
                <input
                  type="number"
                  min="0"
                  value={newQuestion.timeLimit || 0}
                  onChange={(e) => setNewQuestion({ ...newQuestion, timeLimit: parseInt(e.target.value) || 0 })}
                  placeholder="0 = no limit"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Add Button - Enhanced */}
          <div className="flex justify-end pt-4 border-t border-blue-200">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(37, 99, 235, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={addQuestion}
              disabled={!newQuestion.question.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Plus className="w-5 h-5" />
              <span>Add Question</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuestionBuilder;
