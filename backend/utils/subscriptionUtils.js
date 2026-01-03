import UserSubscription from '../models/UserSubscription.js';

// Plan configurations (matching userSubscriptionController)
const PLAN_CONFIGS = {
  free: {
    name: 'Free Plan',
    amount: 0,
    features: {
      fullAccess: false,
      parentDashboard: false,
      advancedAnalytics: false,
      certificates: false,
      wiseClubAccess: false,
      inavoraAccess: false,
      gamesPerPillar: 5,
      totalGames: 50,
    },
  },
  student_premium: {
    name: 'Students Premium Plan',
    amount: 4499,
    features: {
      fullAccess: true,
      parentDashboard: false,
      advancedAnalytics: true,
      certificates: true,
      wiseClubAccess: true,
      inavoraAccess: true,
      gamesPerPillar: -1, // Unlimited
      totalGames: 2200,
    },
  },
  student_parent_premium_pro: {
    name: 'Student + Parent Premium Pro Plan',
    amount: 4999,
    features: {
      fullAccess: true,
      parentDashboard: true,
      advancedAnalytics: true,
      certificates: true,
      wiseClubAccess: true,
      inavoraAccess: true,
      gamesPerPillar: -1, // Unlimited
      totalGames: 2200,
    },
  },
  educational_institutions_premium: {
    name: 'Educational Institutions Premium Plan',
    amount: 0,
    features: {
      fullAccess: true,
      parentDashboard: true,
      advancedAnalytics: true,
      certificates: true,
      wiseClubAccess: true,
      inavoraAccess: true,
      gamesPerPillar: -1,
      totalGames: 2200,
    },
  },
};

/**
 * Get user's active subscription or return free plan defaults
 * Treats pending subscriptions as cancelled (returns free plan)
 */
export const getUserSubscription = async (userId) => {
  try {
    const subscription = await UserSubscription.getActiveSubscription(userId);
    
    // If no active subscription, check for pending subscriptions
    if (!subscription) {
      const latestSubscription = await UserSubscription.getLatestSubscription(userId);
      
      // If latest subscription is pending, treat it as cancelled (return free plan)
      if (latestSubscription && latestSubscription.status === 'pending') {
        return {
          planType: 'free',
          planName: 'Free Plan',
          status: 'active',
          features: PLAN_CONFIGS.free.features,
          isFirstYear: true,
          amount: 0,
        };
      }
      
      // Return free plan defaults
      return {
        planType: 'free',
        planName: 'Free Plan',
        status: 'active',
        features: PLAN_CONFIGS.free.features,
        isFirstYear: true,
        amount: 0,
      };
    }

    // If subscription status is pending, treat as cancelled (return free plan)
    const subObj = subscription.toObject ? subscription.toObject() : subscription;
    if (subObj.status === 'pending') {
      return {
        planType: 'free',
        planName: 'Free Plan',
        status: 'active',
        features: PLAN_CONFIGS.free.features,
        isFirstYear: true,
        amount: 0,
      };
    }

    return subObj;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    // Return free plan on error
    return {
      planType: 'free',
      planName: 'Free Plan',
      status: 'active',
      features: PLAN_CONFIGS.free.features,
      isFirstYear: true,
      amount: 0,
    };
  }
};

/**
 * Check if user has access to a specific feature
 * Treats pending subscriptions as cancelled (denies premium features)
 */
export const hasFeatureAccess = async (userId, featureName) => {
  try {
    const subscription = await getUserSubscription(userId);
    
    // If subscription status is pending, deny all premium features
    if (subscription.status === 'pending') {
      return false;
    }
    
    const features = subscription.features || {};
    
    // Handle special cases
    if (featureName === 'fullAccess') {
      return features.fullAccess === true;
    }
    
    if (featureName === 'inavoraAccess' || featureName === 'inavora') {
      return features.inavoraAccess === true;
    }
    
    if (featureName === 'wiseClubAccess' || featureName === 'wiseClub') {
      return features.wiseClubAccess === true;
    }
    
    if (featureName === 'certificates') {
      return features.certificates === true;
    }
    
    if (featureName === 'advancedAnalytics') {
      return features.advancedAnalytics === true;
    }
    
    if (featureName === 'parentDashboard') {
      return features.parentDashboard === true;
    }
    
    // Default: check if feature exists and is true
    return features[featureName] === true;
  } catch (error) {
    console.error('Error checking feature access:', error);
    return false; // Deny access on error
  }
};

/**
 * Check if user can access a specific game in a pillar
 * Returns: { allowed: boolean, reason?: string, gamesPlayed?: number, gamesAllowed?: number }
 */
export const canAccessGame = async (userId, pillarName, gameIndex) => {
  try {
    const subscription = await getUserSubscription(userId);
    const features = subscription.features || {};
    
    // Premium users have unlimited access
    if (features.fullAccess === true) {
      return {
        allowed: true,
        gamesPlayed: 0,
        gamesAllowed: -1, // Unlimited
      };
    }
    
    // Free users: check games per pillar limit
    const gamesPerPillar = features.gamesPerPillar || 5;
    
    // TODO: Get actual games played count for this pillar
    // For now, we'll check based on game index (0-indexed)
    // In a real implementation, you'd query UserProgress or similar
    const gamesPlayed = gameIndex; // This should be replaced with actual count
    
    if (gamesPlayed >= gamesPerPillar) {
      return {
        allowed: false,
        reason: `You've reached the limit of ${gamesPerPillar} free games in this pillar. Upgrade to access all games.`,
        gamesPlayed,
        gamesAllowed: gamesPerPillar,
      };
    }
    
    return {
      allowed: true,
      gamesPlayed,
      gamesAllowed: gamesPerPillar,
    };
  } catch (error) {
    console.error('Error checking game access:', error);
    return {
      allowed: false,
      reason: 'Error checking access. Please try again.',
    };
  }
};

/**
 * Check if user can access a pillar in full mode (not preview)
 */
export const canAccessPillarFull = async (userId, pillarName) => {
  try {
    const subscription = await getUserSubscription(userId);
    const features = subscription.features || {};
    
    // Premium users have full access
    if (features.fullAccess === true) {
      return {
        allowed: true,
        mode: 'full',
      };
    }
    
    // Free users get preview mode only
    return {
      allowed: true,
      mode: 'preview',
      message: 'You are in preview mode. Upgrade to access all features.',
    };
  } catch (error) {
    console.error('Error checking pillar access:', error);
    return {
      allowed: false,
      mode: 'none',
      message: 'Error checking access. Please try again.',
    };
  }
};

/**
 * Get subscription features for a user
 */
export const getSubscriptionFeatures = async (userId) => {
  try {
    const subscription = await getUserSubscription(userId);
    return subscription.features || PLAN_CONFIGS.free.features;
  } catch (error) {
    console.error('Error getting subscription features:', error);
    return PLAN_CONFIGS.free.features;
  }
};

export default {
  getUserSubscription,
  hasFeatureAccess,
  canAccessGame,
  canAccessPillarFull,
  getSubscriptionFeatures,
  PLAN_CONFIGS,
};

