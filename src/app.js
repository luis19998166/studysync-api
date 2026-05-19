// src/app.js
// Este archivo configura Express: middlewares, rutas y manejo de errores
require('dotenv').config();
const express = require('express');
const app = express();
// ── MIDDLEWARES GLOBALES

// express.json() permite leer el body de las peticiones POST/PUT en formato JSON
// Sin este middleware, req.body siempre sería undefined
app.use(express.json());
// Middleware de logs: muestra en consola cada petición que llega
app.use((req, res, next) => {
const timestamp = new Date().toISOString().substring(11, 19);
console.log(`[${timestamp}] ${req.method} ${req.path}`);
next(); // Pasar al siguiente middleware o ruta
});
// ── RUTAS

// Ruta raíz: verifica que el servidor funciona
app.get('/', (req, res) => {
res.json({
mensaje: 'StudySync API funcionando',
version: '1.0.0',
endpoints: ['/api/sesiones', '/auth/register', '/auth/login', '/api-docs']
});
});
// Las rutas principales se importan aquí (se agregan en el Paso 4)
const sesionesRouter = require('./routes/sesiones');
app.use('/api/sesiones', sesionesRouter);

// ── MANEJO DE ERRORES GLOBAL

// Este middleware de 4 parámetros SIEMPRE va AL FINAL de todo
// Captura cualquier error que haya ocurrido en las rutas anteriores
app.use((err, req, res, next) => {
console.error('[ERROR]', err.message);
res.status(err.status || 500).json({
error: err.message || 'Error interno del servidor',
timestamp: new Date().toISOString(),
ruta: req.path
});
});
module.exports = app;