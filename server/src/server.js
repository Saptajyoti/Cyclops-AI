import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 5000;
const HF_TOKEN = process.env.HF_TOKEN;
const HF_MODEL = process.env.HF_MODEL || 'unitary/toxic-bert';

// Startup configuration validation
console.log('----------------------------------------------------');
console.log('  CYCLOPS AI — Backend Service');
console.log('  "See the Threat. Stop the Harm."');
console.log('----------------------------------------------------');
console.log(`[Config] Target Model:  ${HF_MODEL}`);
if (HF_TOKEN && HF_TOKEN.trim()) {
  console.log('[Config] HF_TOKEN:      Configured (Protected)');
} else {
  console.warn('[Warning] HF_TOKEN is not set in server/.env. Calls to /api/analyze will return HF_AUTH_ERROR until provided.');
}

const server = app.listen(PORT, () => {
  console.log(`[Server] Cyclops AI backend listening on port ${PORT}`);
  console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
  console.log(`[Server] Analyze API:  POST http://localhost:${PORT}/api/analyze`);
  console.log('----------------------------------------------------');
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

