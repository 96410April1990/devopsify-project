const express = require('express');
const client = require('prom-client');

const app = express();
const PORT = 4000;

/* =========================
   Prometheus Setup
========================= */

// Collect default Node.js metrics
client.collectDefaultMetrics();

// Custom HTTP request counter
const httpRequestCounter = new client.Counter({
  name: 'app_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

// Request duration histogram
const httpRequestDuration = new client.Histogram({
  name: 'app_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5]
});

/* =========================
   Middleware
========================= */

app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;

    httpRequestCounter.inc({
      method: req.method,
      route: req.path,
      status: res.statusCode
    });

    httpRequestDuration.observe(
      {
        method: req.method,
        route: req.path,
        status: res.statusCode
      },
      duration
    );
  });

  next();
});

/* =========================
   Routes
========================= */

app.get('/api', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

// Metrics endpoint (VERY IMPORTANT)
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

/* =========================
   Start Server
========================= */

app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`));