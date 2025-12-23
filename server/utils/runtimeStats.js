export const runtimeStats = {
  totalRequests: 0,
  lastRequestAt: null,
  startedAt: new Date(),
  rps: 0,
  eventLoopLag: 0,
};

let lastTick = Date.now();
setInterval(() => {
  const now = Date.now();
  runtimeStats.eventLoopLag = Math.max(0, now - lastTick - 1000);
  lastTick = now;
}, 1000);

let lastCount = 0;
setInterval(() => {
  runtimeStats.rps = runtimeStats.totalRequests - lastCount;
  lastCount = runtimeStats.totalRequests;
}, 1000);
