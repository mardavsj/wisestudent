import crypto from 'crypto';
import UserSubscription from '../models/UserSubscription.js';

const buildInitiator = (initiator = {}) => {
  const fallbackName = initiator.name || initiator.fullName || initiator.email || 'System';
  return {
    userId: initiator.userId || initiator._id || null,
    role: initiator.role || 'system',
    name: fallbackName,
    email: initiator.email || null,
    context: initiator.context || initiator.role || 'system',
  };
};

export const assignUserSubscription = async ({
  userId,
  planType,
  planName,
  features,
  amount = 0,
  startDate = new Date(),
  endDate = null,
  metadata = {},
  initiator = {},
  upsert = true,
}) => {
  if (!userId || !planType || !planName) {
    return null;
  }

  const normalizedInitiator = buildInitiator(initiator);
  const targetEndDate = endDate || new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000);

  let subscription = await UserSubscription.getActiveSubscription(userId);

  const transactionPayload = {
    transactionId: `assign_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    amount: amount || 0,
    currency: 'INR',
    status: 'completed',
    mode: 'system',
    initiatedBy: normalizedInitiator,
    paymentDate: new Date(),
    metadata: {
      ...metadata,
      assignment: true,
      planType,
    },
  };

  if (subscription) {
    subscription.planType = planType;
    subscription.planName = planName;
    subscription.amount = amount || subscription.amount || 0;
    subscription.status = 'active';
    subscription.startDate = subscription.startDate || startDate;
    subscription.endDate = targetEndDate;
    subscription.features = {
      ...(subscription.features || {}),
      ...(features || {}),
    };
    subscription.metadata = {
      ...(subscription.metadata || {}),
      ...metadata,
    };

    subscription.transactions = subscription.transactions || [];
    const hasSystemAssignment = subscription.transactions.some(
      (entry) =>
        entry?.mode === 'system' &&
        entry?.metadata?.assignment &&
        entry?.metadata?.planType === planType
    );
    if (!hasSystemAssignment) {
      subscription.transactions.push(transactionPayload);
    }

    await subscription.save();
    return subscription;
  }

  if (!upsert) {
    return null;
  }

  subscription = await UserSubscription.create({
    userId,
    planType,
    planName,
    amount: amount || 0,
    status: 'active',
    startDate,
    endDate: targetEndDate,
    features: features || {},
    transactions: [transactionPayload],
    metadata,
    purchasedBy: {
      ...normalizedInitiator,
      purchasedAt: startDate,
    },
  });

  return subscription;
};

export default assignUserSubscription;

