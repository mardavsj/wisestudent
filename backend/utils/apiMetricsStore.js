/**
 * In-memory store for API metrics (response times, error counts).
 * Used by incident monitor to detect latency and error rate breaches.
 */
const MAX_SAMPLES = 500;
const responseTimes = [];
const errorCountsByMinute = new Map();
const requestCountsByMinute = new Map();
const MAX_MINUTES = 60;

export const recordResponseTime = (ms) => {
  responseTimes.push(ms);
  if (responseTimes.length > MAX_SAMPLES) {
    responseTimes.shift();
  }
};

export const recordApiRequest = () => {
  const minuteKey = Math.floor(Date.now() / 60000);
  requestCountsByMinute.set(minuteKey, (requestCountsByMinute.get(minuteKey) || 0) + 1);
  pruneOldEntries(minuteKey, requestCountsByMinute);
};

export const recordApiError = () => {
  const minuteKey = Math.floor(Date.now() / 60000);
  errorCountsByMinute.set(minuteKey, (errorCountsByMinute.get(minuteKey) || 0) + 1);
  pruneOldEntries(minuteKey, errorCountsByMinute);
};

const pruneOldEntries = (currentKey, map) => {
  const cutoff = currentKey - MAX_MINUTES;
  for (const key of map.keys()) {
    if (key < cutoff) map.delete(key);
  }
};

export const getAverageLatency = () => {
  if (responseTimes.length === 0) return 0;
  const sum = responseTimes.reduce((a, b) => a + b, 0);
  return sum / responseTimes.length;
};

export const getRecentLatency = (sampleCount = 100) => {
  const samples = responseTimes.slice(-sampleCount);
  if (samples.length === 0) return 0;
  return samples.reduce((a, b) => a + b, 0) / samples.length;
};

export const getRecentErrorCount = (minutes = 60) => {
  const cutoff = Math.floor(Date.now() / 60000) - minutes;
  let total = 0;
  for (const [key, count] of errorCountsByMinute) {
    if (key >= cutoff) total += count;
  }
  return total;
};

export const getRecentRequestCount = (minutes = 60) => {
  const cutoff = Math.floor(Date.now() / 60000) - minutes;
  let total = 0;
  for (const [key, count] of requestCountsByMinute) {
    if (key >= cutoff) total += count;
  }
  return total;
};

export const clearMetrics = () => {
  responseTimes.length = 0;
  errorCountsByMinute.clear();
  requestCountsByMinute.clear();
};
