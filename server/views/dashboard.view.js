export function renderDashboard({ uptime, memory, stats, ui }) {
  const heapState =
    memory.heapPercent > ui.heapDanger ? 'danger' :
    memory.heapPercent > ui.heapWarn ? 'warning' : 'success';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Backend Operations Console</title>
<meta http-equiv="refresh" content="${ui.refreshSeconds}" />

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">

<style>
:root {
  --bg:#020617;
  --panel:#020617;
  --border:#1e293b;
  --text:#e5e7eb;
  --muted:#94a3b8;
  --blue:#38bdf8;
  --green:#22c55e;
  --yellow:#facc15;
  --red:#ef4444;
}

body {
  margin:0;
  background:#0f172a;
  color:var(--text);
  font-family:Inter, system-ui, sans-serif;
}

header {
  padding:16px 32px;
  border-bottom:1px solid var(--border);
  display:flex;
  justify-content:space-between;
  align-items:center;
}

header h1 {
  font-size:16px;
  font-weight:600;
  margin:0;
}

main {
  padding:32px;
  max-width:1400px;
  margin:auto;
}

.grid {
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
  gap:20px;
}

.card {
  background:var(--panel);
  border:1px solid var(--border);
  border-radius:12px;
  padding:18px;
}

.card h3 {
  font-size:12px;
  color:var(--muted);
  text-transform:uppercase;
  letter-spacing:.08em;
  margin-bottom:10px;
}

.metric {
  font-family:'JetBrains Mono', monospace;
  font-size:28px;
  font-weight:600;
}

.success { color:var(--green); }
.warning { color:var(--yellow); }
.danger  { color:var(--red); }

small {
  color:var(--muted);
  font-size:12px;
}

table {
  width:100%;
  border-collapse:collapse;
  font-family:'JetBrains Mono', monospace;
}

td {
  padding:6px 0;
  border-bottom:1px solid var(--border);
  font-size:13px;
}

td.label { color:var(--muted); }

a {
  color:var(--blue);
  text-decoration:none;
  font-size:13px;
}

footer {
  margin-top:48px;
  text-align:center;
  font-size:12px;
  color:var(--muted);
}
</style>
</head>

<body>

<header>
  <h1>🧠 Backend Operations Console</h1>
  <div class="success">RUNNING</div>
</header>

<main>
<div class="grid">

  <div class="card">
    <h3>Uptime</h3>
    <div class="metric">${uptime}s</div>
    <small>Started at ${stats.startedAt}</small>
  </div>

  <div class="card">
    <h3>Traffic</h3>
    <div class="metric">${stats.rps} req/s</div>
    <small>Total ${stats.requests} requests</small>
  </div>

  <div class="card">
    <h3>Heap Usage</h3>
    <div class="metric ${heapState}">${memory.heapPercent}%</div>
    <small>${memory.heapMB} / ${memory.heapLimitMB} MB</small>
  </div>

  <div class="card">
    <h3>Event Loop Lag</h3>
    <div class="metric ${stats.eventLoopLag > 100 ? 'warning' : 'success'}">
      ${stats.eventLoopLag} ms
    </div>
  </div>

  <div class="card">
    <h3>Process</h3>
    <table>
      <tr><td class="label">PID</td><td>${process.pid}</td></tr>
      <tr><td class="label">Node</td><td>${process.version}</td></tr>
      <tr><td class="label">Platform</td><td>${process.platform}</td></tr>
    </table>
  </div>

  <div class="card">
    <h3>Dependencies</h3>
    <table>
      <tr><td class="label">Database</td><td>${stats.dbStatus}</td></tr>
      <tr><td class="label">API Docs</td><td><a href="/docs">Swagger</a></td></tr>
    </table>
  </div>

</div>

<footer>
  Internal backend console · refresh ${ui.refreshSeconds}s · no frontend stack
</footer>
</main>

</body>
</html>
`;
}
