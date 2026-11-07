import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import healthRouter from './routes/health.js';
import analyzeRouter from './routes/analyze.js';
import analyzeImageRouter from './routes/analyzeImage.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// 1. Security Headers with Helmet
app.use(helmet());

// 2. CORS configuration
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. Postman, curl, health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: Not allowed by Access-Control-Allow-Origin'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 3. Body Parsing
app.use(express.json({ limit: '100kb' }));

// 4. Rate Limiting
const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000;
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100;

const limiter = rateLimit({
  windowMs,
  max: maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests from this IP address. Please wait a moment before trying again.'
      }
    });
  }
});

// Apply rate limiter to /api routes
app.use('/api', limiter);

// 5. Mount API Routes
app.use('/api/health', healthRouter);
app.use('/api/analyze', analyzeRouter);
app.use('/api/analyze-image', analyzeImageRouter);

// Root route basic ping
app.get('/', (req, res) => {
  res.json({
    service: 'CyberShield AI API',
    status: 'online',
    docs: 'Endpoints available at /api/health, POST /api/analyze, and POST /api/analyze-image'
  });
});

// 6. 404 Route Not Found
app.use(notFoundHandler);

// 7. Global Error Handler
app.use(errorHandler);

export default app;
