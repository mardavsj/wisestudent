import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Save, Send, CheckCircle, AlertCircle,
  School, Users, Target, DollarSign, Shield, Rocket, BarChart3,
  Plus, X, Upload, Download, Eye, Edit, Trash2, Clock, Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import campaignWizardService from '../../services/campaignWizardService';

const CampaignWizardEnhanced = ({ onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Add scrollbar hide styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const [campaignData, setCampaignData] = useState({
    // Step 1: Scope
    title: '',
    description: '',
    scopeType: 'single_school',
    targetSchools: [],
    targetDistricts: [],
    gradeLevels: [],
    maxParticipants: 1000,
    minParticipants: 10,
    objectives: [],
    priority: 'medium',
    
    // Step 2: Templates
    selectedTemplates: [],
    customTemplateRequest: null,
    
    // Step 3: Pilot
    pilotRequired: false,
    pilotSchools: [],
    pilotDuration: 14,
    pilotStartDate: '',
    pilotEndDate: '',
    pilotObjectives: [],
    
    // Step 4: Budget
    budgetType: 'healcoins_pool',
    totalBudget: 0,
    healCoinsPool: 0,
    perStudentRewardCap: 50,
    budgetBreakdown: [],
    fundingSource: 'organization',
    
    // Step 5: Approvals
    approvalType: 'school_admin',
    requiredApprovals: [],
    approvalDeadline: '',
    
    // Step 6: Launch
    launchDate: '',
    
    // Step 7: Reporting
    reportSettings: {
      frequency: 'weekly',
      recipients: [],
      includeNEPMapping: true,
      includeCertificates: true
    }
  });

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [campaignId, setCampaignId] = useState(null);

  const steps = [
    { id: 1, title: 'Scope', icon: Target, description: 'Define campaign scope and target audience' },
    { id: 2, title: 'Templates', icon: Users, description: 'Select learning templates and content' },
    { id: 3, title: 'Pilot', icon: School, description: 'Configure pilot testing if required' },
    { id: 4, title: 'Budget', icon: DollarSign, description: 'Set budget and HealCoins allocation' },
    { id: 5, title: 'Approvals', icon: Shield, description: 'Request necessary approvals' },
    { id: 6, title: 'Launch', icon: Rocket, description: 'Launch and monitor campaign' },
    { id: 7, title: 'Reporting', icon: BarChart3, description: 'Configure reporting and analytics' }
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await campaignWizardService.getTemplates();
      setTemplates(response.data);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await campaignWizardService.saveCampaign(campaignData);
      setCampaignId(response.data.campaignId);
      toast.success('Campaign saved successfully!');
    } catch (error) {
      toast.error('Failed to save campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await campaignWizardService.createCampaign(campaignData);
      toast.success('Campaign created successfully!');
      onSuccess();
    } catch (error) {
      toast.error('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const updateCampaignData = (updates) => {
    setCampaignData(prev => ({ ...prev, ...updates }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ScopeStep data={campaignData} updateData={updateCampaignData} />;
      case 2:
        return <TemplatesStep data={campaignData} updateData={updateCampaignData} templates={templates} />;
      case 3:
        return <PilotStep data={campaignData} updateData={updateCampaignData} />;
      case 4:
        return <BudgetStep data={campaignData} updateData={updateCampaignData} />;
      case 5:
        return <ApprovalsStep data={campaignData} updateData={updateCampaignData} />;
      case 6:
        return <LaunchStep data={campaignData} updateData={updateCampaignData} />;
      case 7:
        return <ReportingStep data={campaignData} updateData={updateCampaignData} />;
      default:
        return null;
    }
  };

  const progressPercentage = ((currentStep - 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[92vh] flex flex-col overflow-hidden border border-gray-100"
      >
        {/* Header */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b border-gray-200/80 bg-gradient-to-r from-indigo-50/98 via-purple-50/98 to-pink-50/98 backdrop-blur-sm">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-sm">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Create New Campaign
              </h2>
            </div>
            <div className="flex items-center gap-3 ml-12">
              <p className="text-gray-600 text-sm font-medium">
                Step {currentStep} of {steps.length}: <span className="text-indigo-600 font-semibold">{steps[currentStep - 1].title}</span>
              </p>
              <div className="h-1 w-24 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                />
              </div>
              <span className="text-xs text-gray-500 font-medium">{Math.round(progressPercentage)}%</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105 flex-shrink-0 ml-4 group"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-gray-200/80 bg-white/50 backdrop-blur-sm">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex items-center justify-between min-w-max space-x-3">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = index < currentStep - 1;
                const isCurrent = index === currentStep - 1;
                const stepColors = [
                  'from-blue-500 to-cyan-500',
                  'from-purple-500 to-pink-500',
                  'from-green-500 to-emerald-500',
                  'from-amber-500 to-orange-500',
                  'from-indigo-500 to-purple-500',
                  'from-rose-500 to-pink-500',
                  'from-violet-500 to-purple-500'
                ];
                const stepColor = stepColors[index] || 'from-gray-500 to-gray-600';
                
                return (
                  <div key={step.id} className="flex items-center flex-shrink-0 group">
                    <div className="flex flex-col items-center">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`relative flex items-center justify-center w-11 h-11 rounded-full border-2 transition-all duration-300 ${
                          isCompleted ? `bg-gradient-to-br ${stepColor} border-transparent text-white shadow-lg` :
                          isCurrent ? `bg-gradient-to-br ${stepColor} border-transparent text-white shadow-lg shadow-purple-200 ring-4 ring-purple-100` :
                          'border-gray-300 bg-white text-gray-400 group-hover:border-indigo-300 group-hover:bg-indigo-50'
                        }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <StepIcon className="w-5 h-5" />
                        )}
                        {isCurrent && (
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-purple-300"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </motion.div>
                      <div className="mt-2 text-center min-w-[80px]">
                        <p className={`text-xs font-bold transition-colors duration-300 ${
                          isCurrent ? `bg-gradient-to-r ${stepColor} bg-clip-text text-transparent` : 
                          isCompleted ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 mx-3 transition-all duration-500 rounded-full ${
                        isCompleted ? `bg-gradient-to-r ${stepColor}` : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50/30">
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="max-w-5xl mx-auto"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-gray-200/80 bg-white/80 backdrop-blur-sm">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-5 py-2.5 text-gray-700 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium text-sm border border-gray-200 bg-white"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 border border-gray-300 shadow-sm text-sm font-semibold hover:shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Save Draft</span>
            </button>

            {currentStep === steps.length ? (
              <motion.button
                onClick={handleSubmit}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 text-sm font-semibold shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Create Campaign</span>
              </motion.button>
            ) : (
              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold shadow-md"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Step 1: Scope
const ScopeStep = ({ data, updateData }) => {
  const [newObjective, setNewObjective] = useState('');

  const addObjective = () => {
    if (newObjective.trim()) {
      updateData({ objectives: [...data.objectives, newObjective.trim()] });
      setNewObjective('');
    }
  };

  const removeObjective = (index) => {
    updateData({ objectives: data.objectives.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div className="text-center pb-2">
        <div className="inline-flex items-center justify-center p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/30 mb-3">
          <Target className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
          Define Campaign Scope
        </h3>
        <p className="text-gray-600 text-sm max-w-2xl mx-auto">
          Set the scope and target audience for your campaign. This information will help us tailor the campaign to your specific needs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-5">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Campaign Title
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => updateData({ title: e.target.value })}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50"
              placeholder="Enter a descriptive campaign title"
              required
            />
            <p className="text-xs text-gray-500 mt-1.5">Choose a clear, descriptive name for your campaign</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
              Description
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              value={data.description}
              onChange={(e) => updateData({ description: e.target.value })}
              rows={5}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 resize-none bg-gray-50/50"
              placeholder="Describe the campaign objectives, goals, and expected outcomes..."
              required
            />
            <p className="text-xs text-gray-500 mt-1.5">{data.description.length}/500 characters</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Scope Type
            </label>
            <select
              value={data.scopeType}
              onChange={(e) => updateData({ scopeType: e.target.value })}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 bg-gray-50/50"
            >
              <option value="single_school">Single School</option>
              <option value="multi_school">Multiple Schools</option>
              <option value="district">District-wide</option>
            </select>
            <p className="text-xs text-gray-500 mt-1.5">Select the geographic scope of your campaign</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Grade Levels
            </label>
            <div className="flex flex-wrap gap-2.5">
              {['6', '7', '8', '9', '10', '11', '12'].map(grade => (
                <motion.button
                  key={grade}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const updated = data.gradeLevels.includes(grade)
                      ? data.gradeLevels.filter(g => g !== grade)
                      : [...data.gradeLevels, grade];
                    updateData({ gradeLevels: updated });
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    data.gradeLevels.includes(grade)
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-amber-50 border border-gray-300 hover:border-amber-300'
                  }`}
                >
                  Grade {grade}
                </motion.button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {data.gradeLevels.length > 0 ? `${data.gradeLevels.length} grade level(s) selected` : 'Select target grade levels'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <label className="block text-xs font-semibold text-gray-700 mb-2">Min Participants</label>
              <input
                type="number"
                value={data.minParticipants}
                onChange={(e) => updateData({ minParticipants: parseInt(e.target.value) || 0 })}
                min="1"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50"
              />
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <label className="block text-xs font-semibold text-gray-700 mb-2">Max Participants</label>
              <input
                type="number"
                value={data.maxParticipants}
                onChange={(e) => updateData({ maxParticipants: parseInt(e.target.value) || 0 })}
                min={data.minParticipants}
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-200 bg-gray-50/50"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
              Priority Level
            </label>
            <select
              value={data.priority}
              onChange={(e) => updateData({ priority: e.target.value })}
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all duration-200 bg-gray-50/50"
            >
              <option value="low">Low - Standard processing</option>
              <option value="medium">Medium - Normal priority</option>
              <option value="high">High - Expedited processing</option>
              <option value="urgent">Urgent - Immediate attention</option>
            </select>
            <p className="text-xs text-gray-500 mt-1.5">Priority affects resource allocation and processing time</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <label className="block text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg shadow-sm">
            <Target className="w-4 h-4 text-white" />
          </div>
          Campaign Objectives
          <span className="text-xs font-normal text-gray-500 ml-2">({data.objectives.length} added)</span>
        </label>
        <div className="space-y-2.5">
          {data.objectives.length > 0 ? (
            data.objectives.map((objective, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg border border-violet-200"
              >
                <div className="flex-1 text-sm font-medium text-gray-800">{objective}</div>
                <button
                  onClick={() => removeObjective(index)}
                  className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors duration-200"
                  aria-label="Remove objective"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          ) : (
            <p className="text-xs text-gray-500 italic py-2">No objectives added yet. Add your first objective below.</p>
          )}
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addObjective()}
              className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 bg-gray-50/50"
              placeholder="Enter a campaign objective..."
            />
            <motion.button
              onClick={addObjective}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg hover:shadow-md transition-all duration-200 flex items-center gap-2 font-semibold text-sm shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 2: Templates
const TemplatesStep = ({ data, updateData, templates }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customRequest, setCustomRequest] = useState({
    description: '',
    requirements: '',
    assets: []
  });

  const categories = ['all', 'finance', 'mental_health', 'values', 'ai_literacy', 'environmental', 'health', 'safety'];
  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const toggleTemplate = (template) => {
    const isSelected = data.selectedTemplates.some(t => t.templateId === template._id);
    if (isSelected) {
      updateData({
        selectedTemplates: data.selectedTemplates.filter(t => t.templateId !== template._id)
      });
    } else {
      updateData({
        selectedTemplates: [...data.selectedTemplates, {
          templateId: template._id,
          templateName: template.name,
          category: template.category
        }]
      });
    }
  };

  const requestCustomTemplate = () => {
    updateData({ customTemplateRequest: customRequest });
    toast.success('Custom template request submitted!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Learning Templates</h3>
        <p className="text-gray-600 mb-6">Choose from available templates or request custom content creation.</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'All Categories' : category.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Selected Templates */}
      {data.selectedTemplates.length > 0 && (
        <div className="bg-purple-50 rounded-lg p-4">
          <h4 className="font-medium text-purple-800 mb-2">Selected Templates ({data.selectedTemplates.length})</h4>
          <div className="flex flex-wrap gap-2">
            {data.selectedTemplates.map((template, index) => (
              <span key={index} className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm">
                {template.templateName}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => {
          const isSelected = data.selectedTemplates.some(t => t.templateId === template._id);
          return (
            <div
              key={template._id}
              onClick={() => toggleTemplate(template)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-800">{template.name}</h4>
                {isSelected && <CheckCircle className="w-5 h-5 text-purple-500" />}
              </div>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  {template.category}
                </span>
                <span className="text-xs text-gray-500">
                  Grade {template.gradeLevel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Template Request */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="font-medium text-gray-800 mb-4">Request Custom Template</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={customRequest.description}
              onChange={(e) => setCustomRequest({ ...customRequest, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Describe the custom template requirements"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specific Requirements</label>
            <textarea
              value={customRequest.requirements}
              onChange={(e) => setCustomRequest({ ...customRequest, requirements: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="List specific requirements or learning objectives"
            />
          </div>
          <button
            onClick={requestCustomTemplate}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Request Custom Template
          </button>
        </div>
      </div>
    </div>
  );
};

// Step 3: Pilot
const PilotStep = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Configure Pilot Testing</h3>
        <p className="text-gray-600 mb-6">Set up pilot testing for large-scale campaigns.</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.pilotRequired}
              onChange={(e) => updateData({ pilotRequired: e.target.checked })}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-sm font-medium text-gray-700">Require pilot testing</span>
          </label>
        </div>

        {data.pilotRequired && (
          <div className="space-y-4 pl-6 border-l-2 border-purple-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilot Duration (days)</label>
                <input
                  type="number"
                  value={data.pilotDuration}
                  onChange={(e) => updateData({ pilotDuration: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilot Schools</label>
                <input
                  type="text"
                  value={data.pilotSchools.join(', ')}
                  onChange={(e) => updateData({ pilotSchools: e.target.value.split(', ').filter(s => s.trim()) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter school names or IDs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilot Start Date</label>
                <input
                  type="date"
                  value={data.pilotStartDate}
                  onChange={(e) => updateData({ pilotStartDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilot End Date</label>
                <input
                  type="date"
                  value={data.pilotEndDate}
                  onChange={(e) => updateData({ pilotEndDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilot Objectives</label>
              <textarea
                value={data.pilotObjectives.join('\n')}
                onChange={(e) => updateData({ pilotObjectives: e.target.value.split('\n').filter(o => o.trim()) })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="List pilot testing objectives (one per line)"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Step 4: Budget
const BudgetStep = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Set Budget & HealCoins</h3>
        <p className="text-gray-600 mb-6">Configure budget allocation and HealCoins distribution.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Budget Type</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="budgetType"
                value="healcoins_pool"
                checked={data.budgetType === 'healcoins_pool'}
                onChange={(e) => updateData({ budgetType: e.target.value })}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">HealCoins Pool (Fixed amount)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="budgetType"
                value="per_student_cap"
                checked={data.budgetType === 'per_student_cap'}
                onChange={(e) => updateData({ budgetType: e.target.value })}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Per-Student Reward Cap</span>
            </label>
          </div>
        </div>

        {data.budgetType === 'healcoins_pool' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">HealCoins Pool</label>
              <input
                type="number"
                value={data.healCoinsPool}
                onChange={(e) => updateData({ healCoinsPool: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter HealCoins amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Budget (₹)</label>
              <input
                type="number"
                value={data.totalBudget}
                onChange={(e) => updateData({ totalBudget: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter budget amount"
              />
            </div>
          </div>
        )}

        {data.budgetType === 'per_student_cap' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Per-Student Reward Cap</label>
              <input
                type="number"
                value={data.perStudentRewardCap}
                onChange={(e) => updateData({ perStudentRewardCap: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="HealCoins per student"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Total</label>
              <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-600">
                {data.perStudentRewardCap * data.maxParticipants} HealCoins
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Funding Source</label>
          <select
            value={data.fundingSource}
            onChange={(e) => updateData({ fundingSource: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="organization">Organization</option>
            <option value="external_sponsor">External Sponsor</option>
            <option value="government_grant">Government Grant</option>
            <option value="corporate_partnership">Corporate Partnership</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Step 5: Approvals
const ApprovalsStep = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Request Approvals</h3>
        <p className="text-gray-600 mb-6">Configure approval workflow for campaign launch.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Approval Type</label>
          <select
            value={data.approvalType}
            onChange={(e) => updateData({ approvalType: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="school_admin">School Admin Approval</option>
            <option value="district_admin">District Admin Approval</option>
            <option value="central_admin">Central Admin Approval</option>
            <option value="teacher">Teacher Approval</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Approval Deadline</label>
          <input
            type="date"
            value={data.approvalDeadline}
            onChange={(e) => updateData({ approvalDeadline: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Approval Requirements</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• School admin consent required for each participating school</li>
            <li>• Central admin approval required for multi-district campaigns</li>
            <li>• Parent consent forms may be required for certain activities</li>
            <li>• Budget approval from finance department</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Step 6: Launch
const LaunchStep = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Launch Campaign</h3>
        <p className="text-gray-600 mb-6">Set launch date and configure monitoring settings.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Launch Date</label>
          <input
            type="date"
            value={data.launchDate}
            onChange={(e) => updateData({ launchDate: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">Live Monitoring Dashboard</h4>
          <p className="text-sm text-green-700 mb-3">
            Once launched, you'll have access to real-time monitoring including:
          </p>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Attempts and completion rates by school & grade</li>
            <li>• Engagement metrics and time spent</li>
            <li>• Real-time participant activity</li>
            <li>• Performance alerts and notifications</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Step 7: Reporting
const ReportingStep = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Configure Reporting</h3>
        <p className="text-gray-600 mb-6">Set up automated reporting and analytics.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Report Frequency</label>
          <select
            value={data.reportSettings.frequency}
            onChange={(e) => updateData({ 
              reportSettings: { ...data.reportSettings, frequency: e.target.value }
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Report Content</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.reportSettings.includeNEPMapping}
                onChange={(e) => updateData({ 
                  reportSettings: { ...data.reportSettings, includeNEPMapping: e.target.checked }
                })}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Include NEP competency mapping</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.reportSettings.includeCertificates}
                onChange={(e) => updateData({ 
                  reportSettings: { ...data.reportSettings, includeCertificates: e.target.checked }
                })}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Include certificates issued</span>
            </label>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <h4 className="font-medium text-purple-800 mb-2">CSR Impact Report Features</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Downloadable PDF reports with comprehensive metrics</li>
            <li>• NEP competency mapping and alignment analysis</li>
            <li>• Certificate issuance tracking and verification</li>
            <li>• School-wise and grade-wise performance breakdown</li>
            <li>• Budget utilization and ROI analysis</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CampaignWizardEnhanced;
