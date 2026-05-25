const express = require('express');

const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number(process.env.PORT) || 3000;

const SENSITIVE_PATTERNS = [/SECRET/i, /KEY/i, /TOKEN/i, /PASSWORD/i, /PASS$/i];

const isSensitive = (key) => SENSITIVE_PATTERNS.some((re) => re.test(key));

const maskValue = (key, value) => {
  if (!isSensitive(key) || !value) return value;
  if (value.length <= 4) return '***';
  return `${value.slice(0, 2)}***${value.slice(-2)}`;
};

const collectEnv = () => {
  const out = {};
  for (const [k, v] of Object.entries(process.env)) {
    out[k] = maskValue(k, v);
  }
  return out;
};

const renderHtml = (envMap) => {
  const rows = Object.keys(envMap)
    .sort()
    .map((k) => `<tr><td>${k}</td><td>${String(envMap[k] ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))}</td></tr>`)
    .join('');
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Node.js env test</title>
<style>body{font-family:monospace;padding:24px;background:#0f1115;color:#e5e7eb}
h1{color:#10b981}table{border-collapse:collapse;width:100%}
td{padding:6px 12px;border-bottom:1px solid #1f2937;vertical-align:top}
td:first-child{color:#60a5fa;white-space:nowrap}
.banner{background:#064e3b;padding:12px;border-radius:6px;margin-bottom:16px}</style>
</head><body>
<h1>Node.js Env Test</h1>
<div class="banner">HOST=<b>${HOST}</b> PORT=<b>${PORT}</b> &mdash; total ${Object.keys(envMap).length} env vars</div>
<table>${rows}</table>
</body></html>`;
};

const app = express();

app.get('/', (req, res) => {
  res.type('html').send(renderHtml(collectEnv()));
});

app.get('/env', (req, res) => {
  res.json(collectEnv());
});

app.get('/env/:key', (req, res) => {
  const { key } = req.params;
  if (!(key in process.env)) {
    return res.status(404).json({ key, found: false });
  }
  res.json({ key, value: maskValue(key, process.env[key]), found: true });
});

app.listen(PORT, HOST, () => {
  console.log(`[nodejs-env-test] listening on ${HOST}:${PORT}`);
  console.log(`[nodejs-env-test] env var count: ${Object.keys(process.env).length}`);
  console.log(`[nodejs-env-test] HOST=${HOST} PORT=${PORT}`);
});
