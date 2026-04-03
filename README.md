# 📋 Directorio Digital - Backend

Una API robusta y segura para un sistema de directorio digital de empresas construida con **Node.js**, **Express** y **MySQL**. Incluye autenticación con JWT, validación de datos, rate limiting y medidas de seguridad avanzadas.

---

## 📑 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
  - [Endpoints](#endpoints)
  - [Ejemplos de Requests](#ejemplos-de-requests)
- [Arquitectura](#arquitectura)
- [Seguridad](#seguridad)
- [Diagramas](#diagramas)
- [Contribución](#contribución)

---

## ✨ Características

✅ **Autenticación JWT** - Tokens seguros para proteger rutas  
✅ **Registro de Empresas** - Crear nuevas empresas con validación  
✅ **Edición de Perfil** - Actualizar información de empresa  
✅ **Rate Limiting** - Protección contra ataques de fuerza bruta  
✅ **Seguridad Avanzada** - Headers protegidos con Helmet  
✅ **Validación de Datos** - Esquemas Joi para entrada segura  
✅ **Encriptación de Contraseñas** - bcryptjs con salt  
✅ **CORS Configurado** - Control de acceso entre dominios  
✅ **Variables de Entorno** - Configuración segura con dotenv

---

## 🛠️ Tecnologías

| Categoría         | Tecnología         | Versión  |
| ----------------- | ------------------ | -------- |
| **Runtime**       | Node.js            | -        |
| **Framework**     | Express.js         | 5.2.1    |
| **Base de Datos** | MySQL 2            | 3.17.1   |
| **ORM**           | Mongoose           | 9.2.1    |
| **Autenticación** | JWT                | 9.0.3    |
| **Encriptación**  | bcryptjs           | 3.0.3    |
| **Validación**    | Joi                | 18.0.2   |
| **Seguridad**     | Helmet             | 8.1.0    |
| **Rate Limit**    | express-rate-limit | 7.4.0    |
| **CORS**          | cors               | 2.8.6    |
| **Sanitización**  | validator          | 13.15.26 |
| **Uploading**     | multer             | 2.0.2    |
| **Env Vars**      | dotenv             | 17.3.1   |
| **Dev Tool**      | nodemon            | 3.1.11   |

---

## 📁 Estructura del Proyecto

```
Backend/
├── index.js                          # Punto de entrada de la aplicación
├── package.json                      # Dependencias del proyecto
├── .env                             # Variables de entorno (no commitear)
├── config/
│   └── database.js                  # Configuración de MySQL Pool
├── controllers/
│   ├── auth.js                      # Lógica de autenticación (login)
│   ├── registro.js                  # Lógica de registro de empresas
│   └── editProfile.js               # Lógica de edición de perfil
├── middleware/
│   ├── authMiddleware.js            # Verificación de tokens JWT
│   └── validateSchema.js            # Validación de esquemas Joi
├── models/
│   ├── registros.js                 # Esquema/modelo de empresas
│   └── editProfile.js               # Esquema de edición de perfil
└── routes/
    ├── auth.js                      # Rutas de autenticación
    ├── registro.js                  # Rutas de registro
    └── editProfile.js               # Rutas de edición de perfil
```

---

## 🚀 Instalación

### Requisitos Previos

- **Node.js** v16 o superior
- **MySQL** 5.7 o superior
- **npm** o **yarn**

### Pasos

1. **Clona el repositorio**

```bash
git clone <repository-url>
cd Backend
```

2. **Instala las dependencias**

```bash
npm install
```

3. **Crea el archivo `.env`**

```bash
cp .env.example .env
```

4. **Configura las variables de entorno** (ver [Configuración](#configuración))

5. **Ejecuta el proyecto**

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

La aplicación estará disponible en `http://localhost:3000` (o el puerto que configures)

---

## ⚙️ Configuración

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Puerto del servidor
PORT=3000

# Base de datos MySQL
DB_HOST=localhost
DB_PORT=
DB_USER=
DB_PASSWORD=tu_password_aqui
DB_NAME=

# JWT
JWT_SECRET=tu_clave_secreta_super_segura_aqui
JWT_EXPIRATION=24h

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Node Environment
NODE_ENV=development
```

> ⚠️ **Importante**: Nunca commits el archivo `.env` a control de versiones. Usa `.env.example` como plantilla.

---

## 📡 Uso

### Endpoints

#### 🔐 Autenticación

| Método | Endpoint          | Descripción            | Autenticación |
| ------ | ----------------- | ---------------------- | ------------- |
| POST   | `/api/auth/login` | Login de usuario       | ❌ No         |
| GET    | `/api/auth/me`    | Obtener usuario actual | ✅ JWT        |

#### 📝 Registros

| Método | Endpoint                 | Descripción             | Autenticación |
| ------ | ------------------------ | ----------------------- | ------------- |
| POST   | `/api/empresas/registro` | Registrar nueva empresa | ❌ No         |

#### ✏️ Perfil

| Método | Endpoint             | Descripción              | Autenticación |
| ------ | -------------------- | ------------------------ | ------------- |
| PUT    | `/api/perfil/editar` | Editar perfil de empresa | ✅ JWT        |

---

### Ejemplos de Requests

#### 1. **Registro de Nueva Empresa**

```http
POST http://localhost:3000/api/empresas/registro
Content-Type: application/json

{
  "nombre": "Tech Solutions Inc",
  "email": "info@techsolutions.com",
  "password": "SecurePass123!",
  "industria": "Tecnología"
}
```

**Respuesta (201 Created):**

```json
{
  "message": "Empresa registrada exitosamente",
  "empresa": {
    "id": 1,
    "nombre": "Tech Solutions Inc",
    "email": "info@techsolutions.com",
    "industria": "Tecnología"
  }
}
```

#### 2. **Login**

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "info@techsolutions.com",
  "password": "SecurePass123!"
}
```

**Respuesta (200 OK):**

```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Tech Solutions Inc",
    "email": "info@techsolutions.com",
    "industria": "Tecnología"
  }
}
```

#### 3. **Obtener Usuario Actual**

```http
GET http://localhost:3000/api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta (200 OK):**

```json
{
  "user": {
    "id": 1,
    "nombre": "Tech Solutions Inc",
    "email": "info@techsolutions.com",
    "iat": 1234567890,
    "exp": 1234654290
  }
}
```

#### 4. **Editar Perfil**

```http
PUT http://localhost:3000/api/perfil/editar
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "nombre": "Tech Solutions Inc - Actualizado",
  "industria": "Tecnología y Consultoría",
  "descripcion": "Somos especialistas en soluciones digitales"
}
```

**Respuesta (200 OK):**

```json
{
  "message": "Perfil actualizado exitosamente",
  "empresa": {
    "id": 1,
    "nombre": "Tech Solutions Inc - Actualizado",
    "email": "info@techsolutions.com",
    "industria": "Tecnología y Consultoría",
    "descripcion": "Somos especialistas en soluciones digitales"
  }
}
```

---

## 🏗️ Arquitectura

### Flujo de Solicitud (Request Flow)

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │ HTTP Request
       ▼
┌──────────────────────────────────────────┐
│     Express Middleware Pipeline          │
├──────────────────────────────────────────┤
│ 1. Helmet (Headers de Seguridad)        │
│ 2. Rate Limiting (Control de Ataques)   │
│ 3. CORS (Validación de Origen)          │
│ 4. Body Parser (JSON)                   │
└──────────────────┬───────────────────────┘
                   │
       ┌───────────┴───────────┐
       │                       │
       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│ Validate Schema │    │  Auth Middleware │
│ (Joi)           │    │ (JWT Verify)     │
└────────┬────────┘    └────────┬─────────┘
         │                      │
         ▼                      ▼
    ┌─────────────────────────────┐
    │      Controller             │
    │  (Lógica de Negocio)        │
    └──────────┬──────────────────┘
               │
               ▼
    ┌─────────────────────────────┐
    │    Database Layer           │
    │  (MySQL Query Execution)    │
    └──────────┬──────────────────┘
               │
               ▼
    ┌─────────────────────────────┐
    │    MySQL Database           │
    │   (Data Persistence)        │
    └─────────────────────────────┘
               │
               │ Response Data
               ▼
    ┌─────────────────────────────┐
    │   Response JSON             │
    │   (HTTP Status Code)        │
    └──────────┬──────────────────┘
               │
               ▼
    ┌─────────────────────────────┐
    │   Cliente (Response)        │
    └─────────────────────────────┘
```

---

## 🔒 Seguridad

### Medidas de Seguridad Implementadas

#### 1. **Headers Seguros (Helmet)**

```javascript
app.use(helmet());
```

- Previene inyecciones XSS
- Protege contra clickjacking
- Disables powered-by header (no revela tecnología)
- Configura Content Security Policy

#### 2. **Rate Limiting**

- **General**: 100 solicitudes por IP cada 15 minutos
- **Autenticación**: 5 intentos por IP cada 15 minutos
- Previene ataques de fuerza bruta
- Evita DoS (Denial of Service)

```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Más estricto para auth
});
```

#### 3. **Autenticación JWT**

- Tokens con expiración configurable
- Secreto fuerte en variables de entorno
- Verificación en cada solicitud protegida

#### 4. **Encriptación de Contraseñas**

- bcryptjs con salt automático
- Hash de una sola dirección (no reversible)
- Comparación segura sin exponer el hash

```javascript
// Registro
const hashedPassword = await bcrypt.hash(password, 10);

// Login
const passwordMatch = await bcrypt.compare(password, user.password);
```

#### 5. **Validación de Datos**

- Esquemas Joi para validar estructura
- Sanitización con validator.js
- Email normalization
- Tipos de datos estrictos

```javascript
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  nombre: Joi.string().min(3).required(),
});
```

#### 6. **CORS Configurado**

- Solo orígenes autorizados
- Headers específicos permitidos
- Credenciales controladas

#### 7. **Variables de Entorno**

- Credenciales no hardcodeadas
- Archivo .env en .gitignore
- Secretos protegidos

---

## 📊 Diagramas

### Diagrama de Base de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                      BASE DE DATOS: DirectorioDB            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │               TABLA: empresas                          │  │
│  ├────────────────────────────────────────────────────────┤  │
│  │ id (INT, PK, AI)                                       │  │
│  │ nombre (VARCHAR(255), NOT NULL)                        │  │
│  │ email (VARCHAR(255), UNIQUE, NOT NULL)                 │  │
│  │ password (VARCHAR(255), NOT NULL)                      │  │
│  │ industria (VARCHAR(100))                               │  │
│  │ descripcion (TEXT)                                     │  │
│  │ telefono (VARCHAR(20))                                 │  │
│  │ sitio_web (VARCHAR(255))                               │  │
│  │ ubicacion (VARCHAR(255))                               │  │
│  │ foto_perfil (VARCHAR(255))                             │  │
│  │ creado_en (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)       │  │
│  │ actualizado_en (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Diagrama de Autenticación (Auth Flow)

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │
       │ 1. POST /api/auth/login
       │    {email, password}
       ▼
   ┌────────────────────────────────────────┐
   │    authController.login()              │
   │  • Sanitizar email                     │
   │  • Buscar usuario en BD                │
   └─────────┬──────────────────────────────┘
             │
             ▼
   ┌────────────────────────────────────────┐
   │   Usuario NO existe?                   │
   │   → Responder 401 "Credentials Invalid"│
   └────────────────────────────────────────┘
             │ Usuario encontrado
             ▼
   ┌────────────────────────────────────────┐
   │   bcrypt.compare()                     │
   │   • Comparar contraseña con hash       │
   └─────────┬──────────────────────────────┘
             │
             ▼
   ┌────────────────────────────────────────┐
   │   Contraseña NO coincide?              │
   │   → Responder 401 "Credentials Invalid"│
   └────────────────────────────────────────┘
             │ Contraseña válida
             ▼
   ┌────────────────────────────────────────┐
   │   jwt.sign()                           │
   │   Crear token JWT con:                 │
   │   {id, nombre, email, iat, exp}        │
   │   Secret: process.env.JWT_SECRET       │
   └─────────┬──────────────────────────────┘
             │
             ▼
   ┌────────────────────────────────────────┐
   │   Respuesta 200 OK                     │
   │   {                                    │
   │     message: "Login exitoso",          │
   │     token: "eyJhbGc...",               │
   │     user: {...}                        │
   │   }                                    │
   └────────────────────────────────────────┘
             │
             ▼
   ┌─────────────┐
   │   Cliente   │ (Guarda token en localStorage)
   └─────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  SOLICITUDES AUTENTICADAS                   │
├─────────────────────────────────────────────────────────────┤
│  Cliente envía:                                             │
│  Headers: {                                                 │
│    Authorization: "Bearer eyJhbGc..."                       │
│  }                                                          │
│                                                             │
│  → middleware authMiddleware.verifyToken()                  │
│    • Extrae token del header                               │
│    • jwt.verify() valida con JWT_SECRET                    │
│    • Si válido: adjunta req.user = {id, nombre, ...}      │
│    • Si no: responde 401 "Token inválido/expirado"        │
└─────────────────────────────────────────────────────────────┘
```

### Diagrama de Flujo de Registro

```
┌───────────────┐
│ Nueva Empresa │
└───────┬───────┘
        │ POST /api/empresas/registro
        │ {nombre, email, password, industria}
        ▼
┌─────────────────────────────────────┐
│  validateSchema Middleware          │
│  Joi.validate(body, schemaRegistro) │
└────────┬────────────────────────────┘
         │ Schema válido
         ▼
┌─────────────────────────────────────┐
│  registroController.registro()       │
│  • Email ya existe?                 │
│  • Validar datos                    │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Encriptar contraseña               │
│  salt = 10                          │
│  hashedPassword = bcrypt.hash()     │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  INSERT INTO empresas               │
│  (nombre, email, password_hash...)  │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Respuesta 201 Created              │
│  {                                  │
│    message: "Registrada",           │
│    empresa: {...}                   │
│  }                                  │
└─────────────────────────────────────┘
```

### Diagrama de Capas

```
┌──────────────────────────────────────────────────────────────┐
│                    PRESENTACIÓN / API                        │
│  (Express Routes - Define endpoints HTTP)                    │
├──────────────────────────────────────────────────────────────┤
│  GET /auth/me  │  POST /auth/login  │  PUT /perfil/editar   │
└───────┬────────┴──────┬────────────┴──────┬──────────────────┘
        │               │                   │
        └───────┬───────┴───────┬───────────┘
                │               │
                ▼               ▼
┌──────────────────────────────────────────────────────────────┐
│              CONTROLADORES / LÓGICA DE NEGOCIO              │
│  (Service Layer - Procesa requests y llama a datos)          │
├──────────────────────────────────────────────────────────────┤
│  auth.js       │  registro.js       │  editProfile.js        │
└───────┬────────┴──────┬────────────┴──────┬──────────────────┘
        │               │                   │
        └───────┬───────┴───────┬───────────┘
                │               │
                ▼               ▼
┌──────────────────────────────────────────────────────────────┐
│                   ACCESO A DATOS / DATABASE                  │
│  (Data Access Layer - Queries a MySQL)                       │
├──────────────────────────────────────────────────────────────┤
│  config/database.js (Pool de conexiones a MySQL)             │
└───────┬──────────────────────────────────┬───────────────────┘
        │                                  │
        └──────────────┬───────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │   MySQL Database (Data Store)    │
        │   Tables: empresas, ...          │
        └──────────────────────────────────┘
```

### Diagrama de Middlewares

```
REQUEST ENTRANTE
        │
        ▼
┌─────────────────────────────────┐
│   helmet()                      │
│   (Headers de Seguridad)        │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│   limiter (Rate Limiting)       │
│   (100 req / 15 min por IP)     │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│   authLimiter                   │
│   (5 login attempts / 15 min)   │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│   CORS Middleware               │
│   (Validar origen)              │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│   express.json()                │
│   (Parse JSON body)             │
└────────────┬────────────────────┘
             │
             ▼
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
 RUTAS         VALIDACIONES
PÚBLICAS      CONDICIONALES
    │                 │
    │         (Según ruta requerida)
    │                 │
    │         ┌───────┴────────────┐
    │         │                    │
    │         ▼                    ▼
    │    validateSchema()    authMiddleware()
    │    (Joi validation)    (JWT verification)
    │         │                    │
    └─────────┴────────┬───────────┘
                       │
                       ▼
                  CONTROLLER
                       │
                       ▼
                  RESPONSE
```

---

## 📝 Variables de Entorno (Detallado)

```env
# SERVIDOR
PORT                    # Puerto en el que corre la API (default: 3000)
NODE_ENV               # Entorno: development, staging, production

# BASE DE DATOS MYSQL
DB_HOST                # Host del servidor MySQL (localhost, IP, etc)
DB_PORT                # Puerto MySQL (default: 3306)
DB_USER                # Usuario con permisos en la BD
DB_PASSWORD            # Contraseña del usuario MySQL
DB_NAME                # Nombre de la base de datos (DirectorioDB)

# AUTENTICACIÓN JWT
JWT_SECRET             # Clave secreta para firmar tokens (DEBE SER FUERTE)
JWT_EXPIRATION         # Expiración del token (ej: 24h, 7d)

# CORS
CORS_ORIGIN            # Orígenes permitidos (separados por comas)
                       # ej: http://localhost:3000,http://localhost:5173

# OPCIONALES
LOG_LEVEL              # Nivel de logs (info, debug, error)
API_VERSION            # Versión de la API
```

---

## 🧪 Pruebas con cURL

### 1. Registrar Nueva Empresa

```bash
curl -X POST http://localhost:3000/api/empresas/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Mi Empresa",
    "email": "empresa@example.com",
    "password": "SeguraPass123!",
    "industria": "Tecnología"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "empresa@example.com",
    "password": "SeguraPass123!"
  }'
```

Copiar el token de la respuesta y usarlo en la siguiente petición.

### 3. Obtener Usuario Actual (Requiere Token)

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 4. Editar Perfil (Requiere Token)

```bash
curl -X PUT http://localhost:3000/api/perfil/editar \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Mi Empresa Actualizada",
    "industria": "Tech & Consultoría",
    "descripcion": "Líderes en soluciones digitales"
  }'
```

---

## 🐛 Solución de Problemas

### Error: "Cannot find module 'express'"

```bash
npm install
```

### Error: "Error conectando a MySQL"

- Verifica que MySQL esté corriendo
- Comprueba credenciales en `.env`
- Verifica que la base de datos existe

### Error: "EADDRINUSE: address already in use :::3000"

- El puerto 3000 está en uso, cambia en `.env`:

```bash
# O mata el proceso que ocupa el puerto
lsof -i :3000
kill -9 <PID>
```

### Error: "TokenExpiredError"

- El JWT ha expirado, realiza login nuevamente

---

## 📚 Recursos Útiles

- [Express Documentation](https://expressjs.com/es/)
- [JWT Introduction](https://jwt.io/introduction)
- [bcryptjs Security](https://github.com/dcodeIO/bcrypt.js)
- [Joi Validation](https://joi.dev/api/)
- [MySQL2 Documentation](https://github.com/sidorares/node-mysql2)
- [Helmet Security](https://helmetjs.github.io/)

---

## 🤝 Contribución

1. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
2. Commits tus cambios (`git commit -m 'Add AmazingFeature'`)
3. Push a la rama (`git push origin feature/AmazingFeature`)
4. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la licencia **ISC**. Ver archivo LICENSE para más detalles.

---

## 👤 Autor

**Jose Eduardo Trevizo Pizano**

---

## 📞 Contacto

Para preguntas o sugerencias, abre un issue en el repositorio o contacta directamente.

---

## ⚡ Quick Start

```bash
# 1. Instala dependencias
npm install

# 2. Configura .env
cp .env.example .env
# Edita .env con tus credenciales de MySQL

# 3. Inicia en desarrollo
npm run dev

# 4. Prueba el endpoint
curl http://localhost:3000/api/auth/me

# 5. ¡Listo! La API está corriendo 🚀
```

---

**Last Updated**: Marzo 2026  
**Version**: 1.0.0  
**Status**: ✅ Activo y en desarrollo
