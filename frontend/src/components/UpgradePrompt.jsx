import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';

const UpgradePrompt = ({ 
  feature, 
  message, 
  gamesPlayed, 
  gamesAllowed,
  onClose,
  className = '' 
}) => {
  const navigate = useNavigate();
  const { subscription } = useSubscription();

  const handleUpgrade = () => {
    if (onClose) onClose();
    navigate('/student/payment');
  };

  const getFeatureMessage = () => {
    if (message) return message;
    
    if (feature === 'game') {
      return `You've played ${gamesPlayed || 0} of ${gamesAllowed || 5} free games in this pillar. Upgrade to unlock unlimited games!`;
    }
    
    if (feature === 'inavora') {
      return 'Inavora Presentation Tool is available in premium plans. Upgrade to create and share presentations!';
    }
    
    if (feature === 'wiseClub') {
      return 'WiseClub Community Access is coming soon in premium plans. Upgrade now to be among the first to access it when it launches!';
    }
    
    if (feature === 'certificates') {
      return 'Certificates, Badges & Achievements are available in premium plans. Upgrade to earn certificates!';
    }
    
    if (feature === 'analytics') {
      return 'Advanced Analytics is available in premium plans. Upgrade to see detailed insights!';
    }
    
    return 'This feature is available in premium plans. Upgrade to unlock it!';
  };

  return (
    <div className={`bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Premium Feature
          </h3>
          <p className="text-gray-700 mb-4">
            {getFeatureMessage()}
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleUpgrade}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              Upgrade Now
              <ArrowRight className="w-4 h-4" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-gray-600 hover:text-gray-800 font-medium"
              >
                Maybe Later
              </button>
            )}
          </div>
          {subscription?.planType === 'free' && (
            <p className="text-sm text-gray-600 mt-3">
              💡 Start with 5 free games per pillar, then upgrade anytime for full access!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpgradePrompt;

