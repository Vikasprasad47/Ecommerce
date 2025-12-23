import { renderDashboard } from '../views/dashboard.view.js';
import { runtimeStats } from '../utils/runtimeStats.js';

export const dashboardController = (req, res) => {
  const mem = process.memoryUsage();
  const now = Date.now();

  const uptime = Math.floor(process.uptime());
  const heapMB = Math.round(mem.heapUsed / 1024 / 1024);
  const rssMB = Math.round(mem.rss / 1024 / 1024);
  const heapLimitMB = Math.round(mem.heapTotal / 1024 / 1024);

  res.send(
    renderDashboard({
      uptime,
      memory: {
        heapMB,
        rssMB,
        heapLimitMB,
        heapPercent: Math.round((heapMB / heapLimitMB) * 100),
      },
      stats: {
        requests: runtimeStats.totalRequests,
        rps: runtimeStats.rps || 0,
        lastRequest: runtimeStats.lastRequestAt,
        startedAt: runtimeStats.startedAt,
        eventLoopLag: runtimeStats.eventLoopLag || 0,
        dbStatus: 'connected', // hook later
      },
      ui: {
        refreshSeconds: 5,
        heapWarn: 60,
        heapDanger: 80,
        showAdvanced: true,
      },
    })
  );
};
