# 📚 GUÍA DE ESTUDIO - BACKEND NODE.JS CON EXPRESS Y MYSQL

## 🎯 PROYECTO: SISTEMA DE GESTIÓN DE APRENDICES

### 📋 ÍNDICE
1. [Arquitectura del Proyecto](#arquitectura)
2. [Tecnologías Utilizadas](#tecnologias)
3. [Estructura de Carpetas](#estructura)
4. [Paso a Paso - Crear desde Cero](#paso-a-paso)
5. [Conceptos Clave](#conceptos)
6. [Seguridad Implementada](#seguridad)
7. [API Endpoints](#endpoints)
8. [Deployment](#deployment)

---

## 🏗️ ARQUITECTURA DEL PROYECTO {#arquitectura}

### **Patrón MVC (Model-View-Controller)**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     ROUTES      │    │   CONTROLLERS   │    │     MODELS      │
│                 │    │                 │    │                 │
│ Define rutas    │───▶│ Lógica de       │───▶│ Interacción     │
│ HTTP            │    │ negocio         │    │ con BD          │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Flujo de una Petición**
```
Cliente (Postman) 
    ↓
Express Server (index.js)
    ↓
Middleware (CORS, JSON, Auth)
    ↓
Routes (aprendiz.routes.js)
    ↓
Controller (aprendiz.controller.js)
    ↓
Model (aprendiz.model.js)
    ↓
Database (MySQL en Clever Cloud)
    ↓
Respuesta JSON
```

---

## 🛠️ TECNOLOGÍAS UTILIZADAS {#tecnologias}

### **Backend**
- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web minimalista
- **MySQL2**: Driver para base de datos MySQL
- **bcryptjs**: Encriptación de contraseñas
- **jsonwebtoken**: Autenticación con JWT
- **validator.js**: Validación de datos de entrada
- **cors**: Manejo de CORS para APIs
- **morgan**: Logger de peticiones HTTP

### **Infraestructura**
- **Clever Cloud**: Base de datos MySQL en la nube
- **Render**: Deployment del backend
- **GitHub**: Control de versiones y auto-deploy

---

## 📁 ESTRUCTURA DE CARPETAS {#estructura}

```
sgaprendiz/
├── index.js                 # 🚀 Punto de entrada del servidor
├── package.json             # 📦 Dependencias y scripts
├── .env                     # 🔐 Variables de entorno
├── readme.md                # 📖 Documentación
└── src/
    ├── config/
    │   └── dbconexion.js    # 🗄️ Configuración de BD
    ├── libs/
    │   └── paginador.js     # 📄 Utilidad de paginación
    └── modules/
        ├── aprendices/      # 👨‍🎓 Módulo de estudiantes
        │   ├── aprendiz.controller.js
        │   ├── aprendiz.model.js
        │   └── aprendiz.routes.js
        ├── auth/            # 🔐 Módulo de autenticación
        │   ├── auth.controller.js
        │   ├── auth.model.js
        │   └── auth.routes.js
        ├── ficha/           # 📋 Módulo de fichas
        │   ├── ficha.controller.js
        │   ├── ficha.model.js
        │   └── ficha.routes.js
        └── helpers/         # 🔧 Utilidades globales
            └── administrarToken.js
```

---

## 🚀 PASO A PASO - CREAR DESDE CERO {#paso-a-paso}

### **FASE 1: INICIALIZACIÓN DEL PROYECTO**

#### 1. Crear directorio y inicializar npm
```bash
mkdir mi-backend-nodejs
cd mi-backend-nodejs
npm init -y
```

#### 2. Instalar dependencias principales
```bash
# Dependencias de producción
npm install express mysql2 bcryptjs jsonwebtoken validator cors morgan

# Dependencias de desarrollo
npm install --save-dev nodemon
```

#### 3. Configurar package.json
```json
{
  "name": "mi-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

### **FASE 2: CONFIGURACIÓN BÁSICA**

#### 4. Crear archivo principal (index.js)
```javascript
import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

// MIDDLEWARES GLOBALES
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

// RUTAS PRINCIPALES
app.get("/", (req, res) => {
    res.status(200).send({
        status: "ok",
        message: "Servidor funcionando correctamente"
    });
});

// IMPORTAR Y USAR RUTAS
// import authRoutes from "./src/modules/auth/auth.routes.js";
// app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
```

#### 5. Crear variables de entorno (.env)
```env
# BASE DE DATOS
DB_HOST=tu_host_de_bd
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=nombre_base_datos
DB_PORT=3306

# SEGURIDAD JWT
SALT=9d73e5bdcf8f3cfc0c35eb2c27e934601a9a44a2ed812e3901380022c740779b
TOKEN_LIFE=4h

# SERVIDOR
PORT=3000
```

### **FASE 3: CONFIGURACIÓN DE BASE DE DATOS**

#### 6. Crear conexión a BD (src/config/dbconexion.js)
```javascript
import mysql from "mysql2/promise";

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

export const conexion = mysql.createPool(config);

// Probar conexión
conexion.getConnection()
    .then(() => console.log("✅ Conexión a BD exitosa"))
    .catch(err => console.error("❌ Error en BD:", err));
```

### **FASE 4: CREAR MÓDULO COMPLETO (EJEMPLO: USUARIOS)**

#### 7. Modelo (auth.model.js)
```javascript
import { conexion } from "../../config/dbconexion.js";
import bcrypt from "bcryptjs";

// OBTENER TODOS LOS USUARIOS
export async function getUsersDB() {
    try {
        const [rows] = await conexion.execute(
            "SELECT user_id, user_email, user_nombre, user_apellido FROM users"
        );
        return rows;
    } catch (error) {
        throw error;
    }
}

// CREAR USUARIO
export async function createUserDB(data) {
    try {
        // Encriptar contraseña
        const saltRounds = 11;
        const hashedPassword = await bcrypt.hash(data.user_password, saltRounds);
        
        const [result] = await conexion.execute(
            "INSERT INTO users (user_email, user_nombre, user_apellido, user_password) VALUES (?, ?, ?, ?)",
            [data.user_email, data.user_nombre, data.user_apellido, hashedPassword]
        );
        
        return result;
    } catch (error) {
        throw error;
    }
}

// VALIDAR LOGIN
export async function authUserDB(email, password) {
    try {
        const [rows] = await conexion.execute(
            "SELECT * FROM users WHERE user_email = ?",
            [email]
        );
        
        if (rows.length === 0) {
            return null; // Usuario no existe
        }
        
        const user = rows[0];
        const isValidPassword = await bcrypt.compare(password, user.user_password);
        
        if (!isValidPassword) {
            return null; // Contraseña incorrecta
        }
        
        return user; // Login exitoso
    } catch (error) {
        throw error;
    }
}
```

#### 8. Controlador (auth.controller.js)
```javascript
import { getUsersDB, createUserDB, authUserDB } from "./auth.model.js";
import { generarToken } from "../helpers/administrarToken.js";
import validator from "validator";

// LISTAR USUARIOS
export async function getAllUsers(req, res) {
    try {
        const users = await getUsersDB();
        res.status(200).send({
            status: "ok",
            data: users
        });
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: error.message
        });
    }
}

// CREAR USUARIO CON VALIDACIONES
export async function createUser(req, res) {
    try {
        const data = req.body;
        const errores = [];
        
        // VALIDACIONES
        if (!data.user_email || !validator.isEmail(data.user_email)) {
            errores.push("Email inválido");
        }
        
        if (!data.user_nombre || validator.isEmpty(data.user_nombre.trim())) {
            errores.push("Nombre requerido");
        }
        
        if (!data.user_password || !validator.isStrongPassword(data.user_password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1
        })) {
            errores.push("Contraseña debe tener mínimo 8 caracteres, 1 mayúscula, 1 minúscula y 1 número");
        }
        
        if (errores.length > 0) {
            return res.status(400).send({
                status: "error",
                message: "Errores de validación",
                errores: errores
            });
        }
        
        const result = await createUserDB(data);
        res.status(201).send({
            status: "ok",
            message: "Usuario creado exitosamente",
            data: result
        });
        
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: error.message
        });
    }
}

// LOGIN CON JWT
export async function authUser(req, res) {
    try {
        const { user_email, user_password } = req.body;
        
        // Validar que lleguen los datos
        if (!user_email || !user_password) {
            return res.status(400).send({
                status: "error",
                message: "Email y contraseña son requeridos"
            });
        }
        
        // Validar credenciales
        const user = await authUserDB(user_email, user_password);
        
        if (!user) {
            return res.status(401).send({
                status: "error",
                message: "Credenciales inválidas"
            });
        }
        
        // Generar token JWT
        const payload = {
            id: user.user_id,
            email: user.user_email,
            nombre: user.user_nombre
        };
        
        const token = generarToken(payload, process.env.TOKEN_LIFE);
        
        res.status(200).send({
            status: "ok",
            message: "Login exitoso",
            token: token,
            user: {
                id: user.user_id,
                email: user.user_email,
                nombre: user.user_nombre
            }
        });
        
    } catch (error) {
        res.status(500).send({
            status: "error",
            message: error.message
        });
    }
}
```

#### 9. Rutas (auth.routes.js)
```javascript
import express from "express";
import { getAllUsers, createUser, authUser } from "./auth.controller.js";
import { authMiddleware } from "../helpers/administrarToken.js";

const router = express.Router();

// RUTAS PÚBLICAS
router.post("/login", authUser);
router.post("/register", createUser);

// RUTAS PROTEGIDAS (requieren token)
router.get("/users", authMiddleware, getAllUsers);

export default router;
```

#### 10. Middleware de Autenticación (helpers/administrarToken.js)
```javascript
import jwt from "jsonwebtoken";

// GENERAR TOKEN JWT
export const generarToken = (payload, vida) => {
    const options = {
        expiresIn: vida
    };
    
    return jwt.sign(payload, process.env.SALT, options);
};

// MIDDLEWARE DE AUTENTICACIÓN
export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).send({
                status: "error",
                message: "Token no proporcionado"
            });
        }
        
        // Extraer token (con o sin "Bearer")
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7) 
            : authHeader;
            
        // Verificar token
        const decoded = jwt.verify(token, process.env.SALT);
        
        // Guardar datos del usuario en req
        req.user = decoded;
        
        next();
        
    } catch (error) {
        res.status(401).send({
            status: "error",
            message: "Token inválido o expirado"
        });
    }
};
```

### **FASE 5: INTEGRACIÓN FINAL**

#### 11. Actualizar index.js con las rutas
```javascript
import express from "express";
import cors from "cors";
import morgan from "morgan";

// IMPORTAR RUTAS
import authRoutes from "./src/modules/auth/auth.routes.js";
// import aprendizRoutes from "./src/modules/aprendices/aprendiz.routes.js";

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

// RUTA PRINCIPAL
app.get("/", (req, res) => {
    res.status(200).send({
        status: "ok",
        message: "API funcionando correctamente"
    });
});

// RUTAS DE LA API
app.use("/api/auth", authRoutes);
// app.use("/api/aprendices", aprendizRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
```

---

## 🔑 CONCEPTOS CLAVE {#conceptos}

### **1. Express.js**
- **Framework web**: Simplifica la creación de APIs
- **Middlewares**: Funciones que se ejecutan en cada petición
- **Routing**: Sistema de rutas para organizar endpoints

### **2. Arquitectura MVC**
- **Model**: Interactúa con la base de datos
- **View**: En APIs REST no hay vista (solo JSON)
- **Controller**: Lógica de negocio y validaciones

### **3. Middleware**
```javascript
// Middleware personalizado
function miMiddleware(req, res, next) {
    console.log("Petición recibida");
    next(); // Continúa al siguiente middleware
}

app.use(miMiddleware);
```

### **4. Async/Await**
```javascript
// Manejo de operaciones asíncronas
async function obtenerDatos() {
    try {
        const resultado = await conexion.execute("SELECT * FROM users");
        return resultado;
    } catch (error) {
        throw error;
    }
}
```

### **5. Destructuring**
```javascript
// Extraer propiedades de objetos
const { user_email, user_password } = req.body;

// Es equivalente a:
const user_email = req.body.user_email;
const user_password = req.body.user_password;
```

---

## 🔐 SEGURIDAD IMPLEMENTADA {#seguridad}

### **1. Encriptación de Contraseñas**
```javascript
import bcrypt from "bcryptjs";

// Encriptar
const hashedPassword = await bcrypt.hash(password, 11);

// Comparar
const isValid = await bcrypt.compare(password, hashedPassword);
```

### **2. JWT (JSON Web Tokens)**
```javascript
// Estructura: header.payload.signature
// Ejemplo: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIn0.signature

// Generar
const token = jwt.sign(payload, secretKey, { expiresIn: "4h" });

// Verificar
const decoded = jwt.verify(token, secretKey);
```

### **3. Validación de Datos**
```javascript
import validator from "validator";

// Validar email
validator.isEmail("test@test.com"); // true

// Validar contraseña fuerte
validator.isStrongPassword("MiPassword123", {
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1
});
```

### **4. SALT Profesional**
```javascript
// Generado con 256 bits de entropía
const salt = "9d73e5bdcf8f3cfc0c35eb2c27e934601a9a44a2ed812e3901380022c740779b";

// Comando para generar:
// node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🌐 API ENDPOINTS {#endpoints}

### **Autenticación**
```http
POST /api/auth/login
Content-Type: application/json

{
  "user_email": "test@test.com",
  "user_password": "MiPassword123"
}

Response:
{
  "status": "ok",
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@test.com",
    "nombre": "Usuario"
  }
}
```

### **Crear Usuario**
```http
POST /api/auth/register
Content-Type: application/json

{
  "user_email": "nuevo@test.com",
  "user_nombre": "Nuevo",
  "user_apellido": "Usuario",
  "user_password": "Password123"
}
```

### **Listar Usuarios (Protegido)**
```http
GET /api/auth/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🚀 DEPLOYMENT {#deployment}

### **1. Preparar para Producción**
```javascript
// Usar variables de entorno
const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST;
```

### **2. Render.com**
1. Conectar repositorio de GitHub
2. Configurar variables de entorno
3. Auto-deploy activado

### **3. Variables de Entorno en Render**
```
DB_HOST=tu_clever_cloud_host
DB_USER=usuario
DB_PASSWORD=password
DB_NAME=base_datos
SALT=tu_salt_de_256_bits
TOKEN_LIFE=4h
```

---

## 📝 COMANDOS ÚTILES

### **Desarrollo**
```bash
# Iniciar en modo desarrollo
npm run dev

# Instalar nueva dependencia
npm install nombre-paquete

# Generar SALT seguro
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **Git**
```bash
# Flujo básico
git add .
git commit -m "feat: descripción del cambio"
git push origin main
```

### **Testing con curl**
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"user_email":"test@test.com","user_password":"password"}'

# Endpoint protegido
curl -X GET http://localhost:3000/api/auth/users \
  -H "Authorization: Bearer tu_token_aqui"
```

---

## 🎯 CONCEPTOS PARA LA EVALUACIÓN

### **Preguntas Típicas:**

1. **¿Qué es Express.js?**
   - Framework web para Node.js que simplifica la creación de APIs REST

2. **¿Cómo funciona un middleware?**
   - Función que se ejecuta entre la petición y respuesta, puede modificar req/res

3. **¿Por qué usar bcrypt?**
   - Para encriptar contraseñas con salt automático y resistencia a ataques

4. **¿Qué es JWT?**
   - Token de autenticación que contiene información del usuario de forma segura

5. **¿Diferencia entre req.body y req.params?**
   - body: datos en POST/PUT, params: parámetros de la URL (/users/:id)

6. **¿Para qué sirve CORS?**
   - Permitir peticiones desde diferentes dominios (frontend-backend)

---

## 🏆 RESUMEN FINAL

Este proyecto implementa:
- ✅ **API REST** completa con Express.js
- ✅ **Base de datos MySQL** con conexión por pool
- ✅ **Autenticación JWT** con tokens seguros
- ✅ **Validación de datos** con validator.js
- ✅ **Encriptación** de contraseñas con bcrypt
- ✅ **Arquitectura MVC** bien estructurada
- ✅ **Middleware** de autenticación personalizado
- ✅ **Deployment** en Render con auto-deploy
- ✅ **Seguridad** con SALT de 256 bits

**¡Estudia cada sección y practica los conceptos! 🚀**
