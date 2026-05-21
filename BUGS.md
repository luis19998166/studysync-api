# BUGS.md — Registro de Defectos StudySync API

> Formato basado en el estándar IEEE 829 simplificado para gestión ágil de defectos.
> Un buen reporte de bug responde: ¿QUÉ falló? ¿CÓMO reproducirlo? ¿QUÉ se esperaba? ¿QUÉ pasó realmente?

---

## Plantilla de reporte

```
### BUG-XXX: <Título descriptivo en una línea>

| Campo         | Valor                                      |
|---------------|--------------------------------------------|
| ID            | BUG-XXX                                    |
| Fecha         | YYYY-MM-DD                                 |
| Reportado por | Nombre                                     |
| Severidad     | Crítico / Alto / Medio / Bajo              |
| Estado        | Abierto / En progreso / Resuelto / Cerrado |
| Componente    | Módulo o archivo afectado                  |
| Versión       | Commit o tag donde se detectó              |

**Descripción:**
Qué falló en términos de comportamiento observable.

**Pasos para reproducir:**
1. Paso exacto 1
2. Paso exacto 2

**Resultado esperado:**
Lo que debería ocurrir.

**Resultado obtenido:**
Lo que realmente ocurre (incluir mensajes de error exactos).

**Evidencia:**
Screenshot, log, respuesta HTTP, etc.

**Causa raíz (si se identificó):**
Explicación técnica de por qué ocurrió.

**Corrección aplicada:**
Qué cambio de código resolvió el problema.
```

---

## Bugs registrados

---

### BUG-001: POST /api/sesiones devuelve 500 cuando el body no tiene Content-Type

| Campo         | Valor                                              |
|---------------|----------------------------------------------------|
| ID            | BUG-001                                            |
| Fecha         | 2026-05-15                                         |
| Reportado por | Jimmy Requena                                      |
| Severidad     | Medio                                              |
| Estado        | Resuelto                                           |
| Componente    | `src/app.js` — middleware `express.json()`         |
| Versión       | commit `01413ee`                                   |

**Descripción:**
Al enviar un POST con body JSON desde Thunder Client sin configurar el tipo de contenido, el servidor responde con `500 Internal Server Error`.

**Pasos para reproducir:**
1. Abrir Thunder Client
2. POST a `http://localhost:3000/api/sesiones`
3. En Body, escribir `{"titulo": "Test"}` pero dejar el tipo como "Text" (no JSON)
4. Enviar

**Resultado esperado:**
`201 Created` con la sesión creada.

**Resultado obtenido:**
```json
{ "error": "Cannot read properties of undefined (reading 'trim')" }
```

**Causa raíz:**
`express.json()` no parsea el body si el header `Content-Type: application/json` no está presente. El body llega como `undefined` al controlador.

**Corrección aplicada:**
En Thunder Client, cambiar el tipo de Body a **JSON** (no Text). El middleware ya estaba correctamente configurado. El bug es de uso, no de código.

---

### BUG-002: Servidor no levanta en Render — "Port scan timeout"

| Campo         | Valor                                              |
|---------------|----------------------------------------------------|
| ID            | BUG-002                                            |
| Fecha         | 2026-05-18                                         |
| Reportado por | Jimmy Requena                                      |
| Severidad     | Crítico                                            |
| Estado        | Resuelto                                           |
| Componente    | `src/server.js` — configuración de puerto          |
| Versión       | commit `945da3a`                                   |

**Descripción:**
Al desplegar en Render, el proceso arranca pero Render no detecta que el servidor está escuchando y termina con "Port scan timeout" después de 2 minutos.

**Pasos para reproducir:**
1. Agregar `PORT=3000` en las variables de entorno de Render
2. Hacer push al repositorio
3. Observar los logs del deploy

**Resultado esperado:**
El servidor levanta y Render detecta el puerto automáticamente.

**Resultado obtenido:**
```
==> Port scan timeout reached, failed to detect open HTTP port.
```

**Causa raíz:**
Render asigna dinámicamente un puerto mediante `process.env.PORT`. Al forzar `PORT=3000` en las variables de entorno, el servidor escucha en 3000 pero Render intenta detectar el puerto asignado dinámicamente (ej. 10000), no encontrándolo.

**Corrección aplicada:**
Eliminar la variable `PORT` de las Environment Variables de Render. El código ya usa `process.env.PORT || 3000`, por lo que toma el puerto asignado por Render automáticamente.

---

### BUG-003: Anuncios comerciales de dotenv aparecen en los logs del servidor

| Campo         | Valor                                              |
|---------------|----------------------------------------------------|
| ID            | BUG-003                                            |
| Fecha         | 2026-05-21                                         |
| Reportado por | Jimmy Requena                                      |
| Severidad     | Bajo                                               |
| Estado        | Resuelto                                           |
| Componente    | `node_modules/dotenv` v17 — comportamiento de carga|
| Versión       | commit actual                                      |

**Descripción:**
Al iniciar el servidor aparece en consola un mensaje como `◇ injected env (6) from .env // tip: ❌ auth for agents [www.vestauth.com]` que no proviene del código de la aplicación.

**Pasos para reproducir:**
1. Tener dotenv v17 instalado
2. Llamar a `require('dotenv').config()` sin opciones
3. Observar la salida en consola

**Resultado esperado:**
Ninguna salida de dotenv. Las variables se cargan silenciosamente.

**Resultado obtenido:**
Mensajes publicitarios aleatorios de terceros (dotenvx.com, vestauth.com) en los logs.

**Causa raíz:**
dotenv v17 introdujo un array de "tips" aleatorios que se imprimen al cargar el `.env`. Incluye anuncios de productos de terceros que pagan al mantenedor del paquete.

**Corrección aplicada:**
Agregar `{ quiet: true }` a todas las llamadas de `dotenv.config()`:
```js
require('dotenv').config({ quiet: true });
```

---

## Historial de cambios

| Fecha      | Acción                          | Por            |
|------------|---------------------------------|----------------|
| 2026-05-15 | BUG-001 detectado y cerrado     | Jimmy Requena  |
| 2026-05-18 | BUG-002 detectado y cerrado     | Jimmy Requena  |
| 2026-05-21 | BUG-003 detectado y cerrado     | Jimmy Requena  |
