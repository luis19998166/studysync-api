// src/app.js
require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const rateLimit  = require('express-rate-limit');
const swaggerUi  = require('swagger-ui-express');
const swaggerSpec = require('./swagger/config');

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors());

// ── RATE LIMITING ─────────────────────────────────────────────────────────────
// Máximo 100 peticiones por IP cada 15 minutos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones, intenta de nuevo en 15 minutos.' },
});
app.use('/api/', limiter);

// ── MIDDLEWARES GLOBALES ──────────────────────────────────────────────────────
app.use(express.json());
app.use(express.static('public'));

// Middleware de logs
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().substring(11, 19);
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ── SWAGGER UI ────────────────────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'StudySync API Docs',
}));

// ── RUTAS ─────────────────────────────────────────────────────────────────────
app.use('/api/sesiones', require('./routes/sesiones'));

app.get('/', (req, res) => {
  res.json({
    mensaje: 'StudySync API funcionando',
    version: '1.0.0',
    docs: 'http://localhost:3000/api-docs',
    endpoints: ['/api/sesiones', '/auth/register', '/auth/login', '/api-docs'],
  });
});

// ── MANEJO DE ERRORES GLOBAL ──────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    timestamp: new Date().toISOString(),
    ruta: req.path,
  });
});

module.exports = app;
