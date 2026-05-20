// src/swagger/config.js
// Define la especificación OpenAPI 3.0 completa de la API StudySync
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'StudySync API',
      version: '1.0.0',
      description:
        'API REST para coordinar grupos de estudio universitarios. ' +
        'Permite crear, consultar, actualizar y eliminar sesiones de estudio ' +
        'con notificaciones en tiempo real via Redis Pub/Sub + Socket.io.',
      contact: { name: 'UPDS Programación IV — 2026' },
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Desarrollo local' },
    ],
    tags: [{ name: 'Sesiones', description: 'CRUD de sesiones de estudio' }],
    components: {
      schemas: {
        Sesion: {
          type: 'object',
          properties: {
            id:          { type: 'integer', example: 1 },
            titulo:      { type: 'string',  example: 'Redis Pub/Sub' },
            descripcion: { type: 'string',  example: 'Mensajería en tiempo real' },
            materia:     { type: 'string',  example: 'Prog IV' },
            fechaHora:   { type: 'string',  format: 'date-time' },
            completada:  { type: 'boolean', example: false },
            creadaEn:    { type: 'string',  format: 'date-time' },
          },
        },
        NuevaSesion: {
          type: 'object',
          required: ['titulo'],
          properties: {
            titulo:      { type: 'string', example: 'Redis Pub/Sub' },
            descripcion: { type: 'string', example: 'Mensajería en tiempo real' },
            materia:     { type: 'string', example: 'Prog IV' },
            fechaHora:   { type: 'string', format: 'date-time', example: '2026-05-20T10:00:00.000Z' },
          },
        },
        ActualizarSesion: {
          type: 'object',
          properties: {
            titulo:      { type: 'string', example: 'Tema actualizado' },
            descripcion: { type: 'string', example: 'Nueva descripción' },
            materia:     { type: 'string', example: 'Prog IV' },
            fechaHora:   { type: 'string', format: 'date-time' },
            completada:  { type: 'boolean', example: true },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error:     { type: 'string', example: 'Mensaje de error' },
            timestamp: { type: 'string', format: 'date-time' },
            ruta:      { type: 'string', example: '/api/sesiones/99' },
          },
        },
      },
    },
    paths: {
      '/api/sesiones': {
        get: {
          summary: 'Listar todas las sesiones',
          description: 'Devuelve el listado completo de sesiones de estudio disponibles.',
          tags: ['Sesiones'],
          responses: {
            200: {
              description: 'Lista de sesiones obtenida correctamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      ok:    { type: 'boolean', example: true },
                      total: { type: 'integer', example: 2 },
                      datos: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Sesion' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Crear una nueva sesión',
          description: 'Crea una sesión y publica un evento en Redis Pub/Sub. El campo `titulo` es obligatorio.',
          tags: ['Sesiones'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NuevaSesion' },
              },
            },
          },
          responses: {
            201: {
              description: 'Sesión creada exitosamente',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Sesion' } },
              },
            },
            400: {
              description: 'El campo titulo es obligatorio',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
      },
      '/api/sesiones/{id}': {
        get: {
          summary: 'Obtener una sesión por ID',
          tags: ['Sesiones'],
          parameters: [
            {
              in: 'path', name: 'id', required: true,
              description: 'ID numérico de la sesión',
              schema: { type: 'integer', example: 1 },
            },
          ],
          responses: {
            200: {
              description: 'Sesión encontrada',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Sesion' } },
              },
            },
            404: {
              description: 'Sesión no encontrada',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
        put: {
          summary: 'Actualizar una sesión',
          description: 'Reemplaza los campos enviados. El ID y la fecha de creación nunca cambian.',
          tags: ['Sesiones'],
          parameters: [
            {
              in: 'path', name: 'id', required: true,
              schema: { type: 'integer', example: 1 },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ActualizarSesion' },
              },
            },
          },
          responses: {
            200: {
              description: 'Sesión actualizada',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Sesion' } },
              },
            },
            404: {
              description: 'Sesión no encontrada',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
        delete: {
          summary: 'Eliminar una sesión',
          tags: ['Sesiones'],
          parameters: [
            {
              in: 'path', name: 'id', required: true,
              schema: { type: 'integer', example: 1 },
            },
          ],
          responses: {
            200: {
              description: 'Sesión eliminada correctamente',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      ok:      { type: 'boolean', example: true },
                      mensaje: { type: 'string',  example: 'Sesión 1 eliminada correctamente' },
                    },
                  },
                },
              },
            },
            404: {
              description: 'Sesión no encontrada',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/Error' } },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

module.exports = swaggerJsdoc(options);
