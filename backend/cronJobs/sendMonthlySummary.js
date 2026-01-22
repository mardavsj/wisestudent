import cron from 'node-cron';
import CSRImpactReport from '../models/CSRImpactReport.js';
import CSRSponsor from '../models/CSRSponsor.js';
import FundTransaction from '../models/FundTransaction.js';
import Sponsorship from '../models/Sponsorship.js';
import { dispatchCsrNotification } from './csrNotificationUtils.js';

const CRON_SCHEDULE = '0 10 1 * *';

const formatCurrency = (value) => {
  if (typeof value !== 'number') {
    return '₹0';
  }
  return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const getPreviousMonthRange = (referenceDate) => {
  const end = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 0, 23, 59, 59, 999);
  const start = new Date(end.getFullYear(), end.getMonth(), 1);
  return { start, end };
};

const aggregateTransactions = async (sponsorId, range, typeFilter) => {
  const match = {
    sponsorId,
    createdAt: { $gte: range.start, $lte: range.end },
  };
  if (Array.isArray(typeFilter)) {
    match.type = { $in: typeFilter };
  } else if (typeFilter) {
    match.type = typeFilter;
  }

  const result = await FundTransaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
      },
    },
  ]);

  return result.reduce((acc, curr) => acc + (curr.total || 0), 0);
};

const runMonthlySummary = async () => {
  try {
    const now = new Date();
    const range = getPreviousMonthRange(now);
    const monthName = range.start.toLocaleString('default', { month: 'long', year: 'numeric' });
    const sponsors = await CSRSponsor.find({ status: 'approved', isActive: true }).lean();

    for (const sponsor of sponsors) {
      const depositTotal = await aggregateTransactions(sponsor._id, range, 'deposit');
      const allocationTotal = await aggregateTransactions(sponsor._id, range, 'allocation');
      const activeSponsorships = await Sponsorship.countDocuments({
        sponsorId: sponsor._id,
        status: { $in: ['active', 'paused'] },
      });
      const reportCount = await CSRImpactReport.countDocuments({
        sponsorId: sponsor._id,
        'period.startDate': { $gte: range.start },
        'period.endDate': { $lte: range.end },
      });

      const title = `Monthly CSR Impact Summary • ${monthName}`;
      const message = `Here's a summary for ${monthName}:\n\n` +
        `• Deposits received: ${formatCurrency(depositTotal)}\n` +
        `• Funds allocated: ${formatCurrency(allocationTotal)}\n` +
        `• Active sponsorships: ${activeSponsorships}\n` +
        `• Impact reports generated: ${reportCount}\n\n` +
        `Balance available: ${formatCurrency(sponsor.availableBalance)}. Keep the momentum going by visiting the funds dashboard.`;

      await dispatchCsrNotification(sponsor, {
        type: 'info',
        severity: 'medium',
        title,
        message,
        category: 'reports',
        link: '/csr/dashboard',
        metadata: {
          periodStart: range.start,
          periodEnd: range.end,
          deposits: depositTotal,
          allocations: allocationTotal,
          activeSponsorships,
          reports: reportCount,
        },
      });
    }
  } catch (error) {
    console.error('ƒ?O Monthly summary job failed:', error);
  }
};

export const scheduleMonthlySummary = () => {
  cron.schedule(CRON_SCHEDULE, async () => {
    await runMonthlySummary();
  });

  setTimeout(() => {
    runMonthlySummary();
  }, 5000);
};

export default scheduleMonthlySummary;
