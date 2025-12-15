// Task 2: Autenticación con JWT (8 minutos)
// Implementar sistema de autenticación usando JSON Web Tokens.

// Instalación y Configuración
// npm install jsonwebtoken bcryptjs express-rate-limit
// middleware/auth.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Clave secreta (en producción usar variable de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_muy_segura';

// Usuarios simulados (en producción vendrían de BD)
const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@blog.com',
    password: '$2a$10$hashedPasswordHere', // password: 'admin123'
    role: 'admin'
  },
  {
    id: 2,
    username: 'autor',
    email: 'autor@blog.com',
    password: '$2a$10$anotherHashedPassword', // password: 'autor123'
    role: 'author'
  }
];

// Generar token JWT
function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// Verificar token JWT
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Middleware de autenticación
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Token de autenticación requerido',
      code: 'AUTH_TOKEN_MISSING'
    });
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      error: 'Token inválido o expirado',
      code: 'AUTH_TOKEN_INVALID'
    });
  }

  req.user = decoded;
  next();
}

// Middleware de autorización por roles
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Autenticación requerida',
        code: 'AUTH_REQUIRED'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Permisos insuficientes',
        code: 'AUTH_FORBIDDEN'
      });
    }

    next();
  };
}

// Función para hashear contraseña
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Función para verificar contraseña
async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Buscar usuario por credenciales
function findUserByCredentials(username, password) {
  const user = users.find(u => u.username === username);

  if (!user) {
    return null;
  }

  // En producción verificar con bcrypt.compare()
  // Aquí simulamos verificación
  const isValidPassword = password === 'admin123' || password === 'autor123';

  return isValidPassword ? user : null;
}

module.exports = {
  authenticate,
  authorize,
  generateToken,
  findUserByCredentials,
  hashPassword,
  verifyPassword
};
// Implementación de Autenticación
// routes/auth.js
const express = require('express');
const { findUserByCredentials, generateToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// POST /auth/login
router.post('/login',
  [
    body('username').trim().notEmpty().withMessage('Username requerido'),
    body('password').notEmpty().withMessage('Password requerido')
  ],
  async (req, res) => {
    try {
      // Validar entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Datos de entrada inválidos',
          details: errors.array()
        });
      }

      const { username, password } = req.body;

      // Verificar credenciales
      const user = findUserByCredentials(username, password);

      if (!user) {
        return res.status(401).json({
          error: 'Credenciales inválidas',
          code: 'AUTH_INVALID_CREDENTIALS'
        });
      }

      // Generar token
      const token = generateToken(user);

      // Responder sin contraseña
      const userResponse = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      };

      res.json({
        message: 'Login exitoso',
        user: userResponse,
        token,
        expiresIn: '24h'
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

// POST /auth/verify - Verificar token
router.post('/verify', (req, res) => {
  // El middleware authenticate ya verifica el token
  // Si llega aquí, el token es válido
  res.json({
    valid: true,
    user: req.user
  });
});

module.exports = router;