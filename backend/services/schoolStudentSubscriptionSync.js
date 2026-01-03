import UserSubscription from '../models/UserSubscription.js';
import User from '../models/User.js';
import Subscription from '../models/Subscription.js';
import SchoolStudent from '../models/School/SchoolStudent.js';
import mongoose from 'mongoose';

// Plan features configuration
const PLAN_FEATURES = {
  free: {
    fullAccess: false,
    parentDashboard: false,
    advancedAnalytics: false,
    certificates: false,
    wiseClubAccess: false,
    inavoraAccess: false,
    gamesPerPillar: 5,
    totalGames: 50,
  },
  educational_institutions_premium: {
    fullAccess: true,
    parentDashboard: true,
    advancedAnalytics: true,
    certificates: true,
    wiseClubAccess: true,
    inavoraAccess: true,
    gamesPerPillar: -1, // Unlimited
    totalGames: 2200,
  },
};

/**
 * Sync all teachers' access for a given school based on the school's subscription status
 * @param {string} orgId - Organization ID
 * @param {string} tenantId - Tenant ID
 * @param {boolean} isActive - Whether the school subscription is active
 * @param {Date} endDate - School subscription end date
 * @param {Object} io - Socket.IO instance (optional)
 * @returns {Promise<Object>} - Sync results
 */
export const syncSchoolTeacherAccess = async (orgId, tenantId, isActive, endDate = null, io = null) => {
  try {
    if (!orgId || !tenantId) {
      throw new Error('orgId and tenantId are required');
    }

    const orgObjectId = new mongoose.Types.ObjectId(orgId);
    const now = new Date();
    
    // Determine if subscription is actually active (check endDate)
    let subscriptionActive = isActive;
    if (endDate) {
      const expiryDate = new Date(endDate);
      subscriptionActive = isActive && expiryDate > now;
    }

    // Find all teachers linked to this school
    const teachers = await User.find({
      $or: [
        { orgId: orgObjectId, tenantId: tenantId },
        { orgId: orgObjectId },
        { tenantId: tenantId }
      ],
      role: { $in: ['school_teacher', 'teacher'] }
    }).select('_id email name orgId tenantId');

    if (!teachers || teachers.length === 0) {
      console.log(`No teachers found for orgId: ${orgId}, tenantId: ${tenantId}`);
      return {
        success: true,
        teachersProcessed: 0,
        teachersNotified: 0,
      };
    }

    let teachersNotified = 0;
    const notifiedTeacherIds = [];

    // Notify each teacher about subscription status change
    for (const teacher of teachers) {
      try {
        notifiedTeacherIds.push(teacher._id.toString());

        // Emit real-time update to teacher
        if (io) {
          io.to(teacher._id.toString()).emit('teacher:access:updated', {
            hasAccess: subscriptionActive,
            subscriptionActive: subscriptionActive,
            endDate: endDate,
            reason: subscriptionActive ? 'school_subscription_renewed' : 'school_subscription_expired',
            timestamp: now,
            message: subscriptionActive 
              ? 'Your school has renewed its subscription. Access restored.' 
              : 'Your school\'s subscription has expired. Please contact your school administrator.',
          });
        }

        teachersNotified++;
      } catch (error) {
        console.error(`Error notifying teacher ${teacher._id}:`, error);
        // Continue with other teachers
      }
    }

    console.log(`Notified ${teachersNotified} teachers for orgId: ${orgId}, tenantId: ${tenantId}, active: ${subscriptionActive}`);

    return {
      success: true,
      teachersProcessed: teachers.length,
      teachersNotified: teachersNotified,
      subscriptionActive: subscriptionActive,
    };
  } catch (error) {
    console.error('Error syncing school teacher access:', error);
    throw error;
  }
};

/**
 * Sync all students' subscriptions for a given school based on the school's subscription status
 * @param {string} orgId - Organization ID
 * @param {string} tenantId - Tenant ID
 * @param {boolean} isActive - Whether the school subscription is active
 * @param {Date} endDate - School subscription end date
 * @param {Object} io - Socket.IO instance (optional)
 * @returns {Promise<Object>} - Sync results
 */
export const syncSchoolStudentSubscriptions = async (orgId, tenantId, isActive, endDate = null, io = null) => {
  try {
    if (!orgId || !tenantId) {
      throw new Error('orgId and tenantId are required');
    }

    const orgObjectId = new mongoose.Types.ObjectId(orgId);
    const now = new Date();
    
    // Determine if subscription is actually active (check endDate)
    let subscriptionActive = isActive;
    if (endDate) {
      const expiryDate = new Date(endDate);
      subscriptionActive = isActive && expiryDate > now;
    }

    // Find all students linked to this school
    // First, try to find students through SchoolStudent model (if they're linked that way)
    const schoolStudents = await SchoolStudent.find({
      orgId: orgObjectId,
      tenantId: tenantId
    }).select('userId').lean();
    
    const studentIdsFromSchoolStudent = schoolStudents.map(ss => ss.userId).filter(Boolean);
    
    // Find students by:
    // 1. Direct User.orgId/tenantId match
    // 2. Through SchoolStudent model
    const studentQuery = {
      $or: [
        { orgId: orgObjectId, tenantId: tenantId },
        { orgId: orgObjectId },
        { tenantId: tenantId }
      ],
      role: { $in: ['student', 'school_student'] }
    };
    
    // If we found students through SchoolStudent, also include them
    if (studentIdsFromSchoolStudent.length > 0) {
      studentQuery.$or.push({ _id: { $in: studentIdsFromSchoolStudent } });
    }
    
    const students = await User.find(studentQuery).select('_id email name orgId tenantId role');
    
    console.log(`Found ${students.length} students for orgId: ${orgId}, tenantId: ${tenantId} (${studentIdsFromSchoolStudent.length} via SchoolStudent model)`);

    if (!students || students.length === 0) {
      console.log(`No students found for orgId: ${orgId}, tenantId: ${tenantId}`);
      return {
        success: true,
        studentsProcessed: 0,
        studentsUpdated: 0,
        studentsNotified: 0,
      };
    }

    const targetPlanType = subscriptionActive ? 'educational_institutions_premium' : 'free';
    const targetPlanName = subscriptionActive 
      ? 'Educational Institutions Premium Plan' 
      : 'Free Plan';
    const targetFeatures = PLAN_FEATURES[targetPlanType];
    const targetStatus = subscriptionActive ? 'active' : 'expired';

    let studentsUpdated = 0;
    const updatedStudentIds = [];

    // Update each student's subscription
    for (const student of students) {
      try {
        // Find the student's subscription - check for school-linked subscriptions first
        // This ensures we update the correct subscription even if there are multiple
        // Try to find subscription with school metadata first
        let userSubscription = await UserSubscription.findOne({
          userId: student._id,
          $or: [
            { 'metadata.orgId': orgObjectId },
            { 'metadata.tenantId': tenantId }
          ]
        }).sort({ createdAt: -1 });

        // If not found, try to find any active/expired subscription for this student
        if (!userSubscription) {
          userSubscription = await UserSubscription.findOne({
            userId: student._id,
            status: { $in: ['active', 'expired'] }
          }).sort({ createdAt: -1 });
        }

        // If still not found, get the latest subscription regardless of status
        if (!userSubscription) {
          userSubscription = await UserSubscription.findOne({
            userId: student._id
          }).sort({ createdAt: -1 });
        }

        // CRITICAL: When school plan expires, we MUST deactivate ALL active premium subscriptions
        // The getActiveSubscription() method returns active subscriptions, so if there's an active
        // premium subscription, it will be returned instead of the expired free one
        if (!subscriptionActive) {
          // Find ALL active premium subscriptions for this student and deactivate them
          const activePremiumSubscriptions = await UserSubscription.find({
            userId: student._id,
            status: 'active',
            planType: { $ne: 'free' },
            $or: [
              { endDate: { $exists: false } },
              { endDate: { $gt: now } }
            ]
          });

          // Deactivate all active premium subscriptions
          for (const activeSub of activePremiumSubscriptions) {
            if (activeSub._id.toString() !== userSubscription?._id.toString()) {
              console.log(`  ⚠️  Deactivating active premium subscription ${activeSub._id} for student ${student.email}`);
              activeSub.status = 'expired';
              activeSub.endDate = now;
              await activeSub.save();
            }
          }

          // If we found an active premium subscription that's different from the school-linked one, update it
          if (activePremiumSubscriptions.length > 0) {
            const activeSub = activePremiumSubscriptions[0];
            if (!userSubscription || activeSub._id.toString() !== userSubscription._id.toString()) {
              console.log(`  ⚠️  Student ${student.email} has an active premium subscription that needs to be expired. Updating that instead.`);
              userSubscription = activeSub;
            }
          }
        }

        console.log(`  📋 Student ${student.email}: Found subscription? ${!!userSubscription}, Plan: ${userSubscription?.planType}, Status: ${userSubscription?.status}, FullAccess: ${userSubscription?.features?.fullAccess}`);

        // Check if subscription needs update
        // Also check if features.fullAccess matches the target (critical for game access)
        const currentFullAccess = userSubscription?.features?.fullAccess === true;
        const targetFullAccess = targetFeatures.fullAccess === true;
        const featuresMismatch = currentFullAccess !== targetFullAccess;
        
        // Always update if:
        // 1. No subscription exists
        // 2. Plan type doesn't match
        // 3. Status doesn't match (active vs expired)
        // 4. Features don't match (especially fullAccess)
        // 5. Subscription is not linked to this school (missing metadata)
        const isNotLinkedToSchool = !userSubscription?.metadata?.orgId || 
                                     userSubscription.metadata.orgId.toString() !== orgId ||
                                     !userSubscription?.metadata?.tenantId ||
                                     userSubscription.metadata.tenantId !== tenantId;
        
        // Always update if subscription is not properly linked to school
        // Also check if the subscription is the "active" one that would be returned by getActiveSubscription
        const isActiveSubscription = userSubscription?.status === 'active' && 
                                     (!userSubscription?.endDate || new Date(userSubscription.endDate) > now);
        
        // If there's an active premium subscription but school is expired, we need to update it
        const hasActivePremiumButSchoolExpired = isActiveSubscription && 
                                                 userSubscription.planType !== 'free' && 
                                                 !subscriptionActive;
        
        const needsUpdate = !userSubscription || 
          userSubscription.planType !== targetPlanType ||
          userSubscription.status !== targetStatus ||
          featuresMismatch ||
          isNotLinkedToSchool || // Always update if not properly linked to school
          hasActivePremiumButSchoolExpired; // Force update if active premium but school expired

        console.log(`  🔍 Needs update? ${needsUpdate} (planType: ${userSubscription?.planType} !== ${targetPlanType}, status: ${userSubscription?.status} !== ${targetStatus}, fullAccess: ${currentFullAccess} !== ${targetFullAccess}, linked: ${!isNotLinkedToSchool}, hasActivePremiumButSchoolExpired: ${hasActivePremiumButSchoolExpired})`);

        if (needsUpdate) {
          if (!userSubscription) {
            // Create new subscription
            userSubscription = await UserSubscription.create({
              userId: student._id,
              planType: targetPlanType,
              planName: targetPlanName,
              amount: 0,
              status: targetStatus,
              startDate: now,
              endDate: subscriptionActive ? endDate : null,
              features: targetFeatures,
              metadata: {
                registrationType: 'school',
                orgId: orgObjectId,
                tenantId: tenantId,
                syncedAt: now,
                syncedBy: 'system',
                reason: subscriptionActive ? 'school_subscription_renewed' : 'school_subscription_expired',
              },
              transactions: [{
                transactionId: `school_sync_${Date.now()}_${student._id}`,
                amount: 0,
                currency: 'INR',
                status: 'completed',
                mode: 'system',
                paymentDate: now,
                initiatedBy: {
                  context: 'system',
                },
                metadata: {
                  syncReason: subscriptionActive ? 'school_renewed' : 'school_expired',
                  orgId: orgId,
                  tenantId: tenantId,
                },
              }],
            });
          } else {
            // Update existing subscription
            const previousPlanType = userSubscription.planType;
            userSubscription.planType = targetPlanType;
            userSubscription.planName = targetPlanName;
            userSubscription.status = targetStatus;
            userSubscription.features = targetFeatures;
            
            // Update dates
            if (subscriptionActive) {
              userSubscription.startDate = userSubscription.startDate || now;
              userSubscription.endDate = endDate;
            } else {
              // Keep existing endDate but mark as expired
              userSubscription.endDate = userSubscription.endDate || now;
            }

            // Update metadata
            userSubscription.metadata = {
              ...(userSubscription.metadata || {}),
              orgId: orgObjectId,
              tenantId: tenantId,
              syncedAt: now,
              syncedBy: 'system',
              reason: subscriptionActive ? 'school_subscription_renewed' : 'school_subscription_expired',
              previousPlanType: previousPlanType,
            };

            // Add transaction record
            if (!userSubscription.transactions) {
              userSubscription.transactions = [];
            }
            userSubscription.transactions.push({
              transactionId: `school_sync_${Date.now()}_${student._id}`,
              amount: 0,
              currency: 'INR',
              status: 'completed',
              mode: 'system',
              paymentDate: now,
              initiatedBy: {
                context: 'system',
              },
              metadata: {
                syncReason: subscriptionActive ? 'school_renewed' : 'school_expired',
                orgId: orgId,
                tenantId: tenantId,
                previousPlanType: previousPlanType,
              },
            });

            await userSubscription.save();
            console.log(`  ✅ Updated subscription for student ${student.email}: planType=${targetPlanType}, status=${targetStatus}, fullAccess=${targetFeatures.fullAccess}`);
          }

          if (needsUpdate) {
            studentsUpdated++;
            updatedStudentIds.push(student._id.toString());
          }
        }

        // Always emit socket event to ensure frontend refreshes, even if subscription didn't change
        // This is critical to ensure students get real-time updates when school plan expires
        if (io) {
          io.to(student._id.toString()).emit('student:subscription:updated', {
            subscription: {
              planType: targetPlanType,
              planName: targetPlanName,
              status: targetStatus,
              features: targetFeatures,
              endDate: subscriptionActive ? endDate : null,
            },
            reason: subscriptionActive ? 'school_subscription_renewed' : 'school_subscription_expired',
            timestamp: now,
          });
          console.log(`  📡 Emitted subscription update event to student ${student.email} (planType: ${targetPlanType}, fullAccess: ${targetFeatures.fullAccess})`);
        }
      } catch (error) {
        console.error(`Error updating subscription for student ${student._id}:`, error);
        // Continue with other students
      }
    }

    console.log(`Synced ${studentsUpdated} student subscriptions for orgId: ${orgId}, tenantId: ${tenantId}, active: ${subscriptionActive}`);

    return {
      success: true,
      studentsProcessed: students.length,
      studentsUpdated: studentsUpdated,
      studentsNotified: updatedStudentIds.length,
      subscriptionActive: subscriptionActive,
      targetPlanType: targetPlanType,
    };
  } catch (error) {
    console.error('Error syncing school student subscriptions:', error);
    throw error;
  }
};

/**
 * Check and sync all expired school subscriptions
 * This can be called by a cron job or on-demand
 */
export const syncExpiredSchoolSubscriptions = async (io = null) => {
  try {
    const now = new Date();
    
    // Find all subscriptions that should be expired (both newly expired and already expired)
    // We check both: subscriptions marked as active/pending with expired endDate, 
    // and subscriptions already marked as expired (in case they weren't synced before)
    const expiredSubscriptions = await Subscription.find({
      $or: [
        // Newly expired: status is active/pending but endDate has passed
        {
          status: { $in: ['active', 'pending'] },
          endDate: { $lte: now }
        },
        // Already expired: status is expired but we should verify and sync
        {
          status: 'expired',
          endDate: { $lte: now }
        }
      ]
    }).select('orgId tenantId endDate status plan');

    let totalSynced = 0;
    const results = [];

    for (const subscription of expiredSubscriptions) {
      try {
        // Verify the subscription is actually expired (double-check endDate)
        const expiryDate = new Date(subscription.endDate);
        const isActuallyExpired = expiryDate <= now;
        
        if (!isActuallyExpired) {
          console.log(`⏭️  Skipping subscription ${subscription._id} - endDate is in the future`);
          continue;
        }

        // Only update status if it's not already expired
        if (subscription.status !== 'expired') {
          subscription.status = 'expired';
          await subscription.save();
          console.log(`📝 Updated subscription ${subscription._id} status to expired`);
        }

        console.log(`🔄 Syncing students for expired subscription: orgId=${subscription.orgId}, tenantId=${subscription.tenantId}`);

        // Sync student subscriptions (downgrade to freemium)
        const syncResult = await syncSchoolStudentSubscriptions(
          subscription.orgId.toString(),
          subscription.tenantId,
          false, // isActive = false (expired)
          subscription.endDate,
          io
        );
        
        console.log(`✅ Synced ${syncResult.studentsUpdated} students for expired subscription ${subscription._id}`);

        // Sync teacher access
        const teacherSyncResult = await syncSchoolTeacherAccess(
          subscription.orgId.toString(),
          subscription.tenantId,
          false, // isActive = false
          subscription.endDate,
          io
        );

        totalSynced += syncResult.studentsUpdated;
        results.push({
          orgId: subscription.orgId.toString(),
          tenantId: subscription.tenantId,
          ...syncResult,
          teachersNotified: teacherSyncResult.teachersNotified,
        });
      } catch (error) {
        console.error(`Error syncing expired subscription for orgId ${subscription.orgId}:`, error);
      }
    }

    return {
      success: true,
      expiredSubscriptionsFound: expiredSubscriptions.length,
      totalStudentsSynced: totalSynced,
      results: results,
    };
  } catch (error) {
    console.error('Error syncing expired school subscriptions:', error);
    throw error;
  }
};

export default {
  syncSchoolStudentSubscriptions,
  syncSchoolTeacherAccess,
  syncExpiredSchoolSubscriptions,
};

