// server.js - Servidor principal del blog
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');

// 1. IMPORTAR TODAS LAS RUTAS (incluyendo las nuevas)
const authRoutes = require('./src/routes/auth');
const postsRoutes = require('./src/routes/posts');
const commentsRoutes = require('./src/routes/comments');
const adminRoutes = require('./src/routes/admin');     
const categoryRoutes = require('./src/routes/categories');

const { v4: uuidv4 } = require('uuid');

// Crear aplicación
const app = express();

// ... (El resto de tu Middleware de seguridad y Rate Limiting se mantiene igual) ...
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

const limiter = rateLimit({ /* ... */ });
app.use('/api/', limiter);

const authLimiter = rateLimit({ /* ... */ });
app.use('/api/auth/login', authLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url} - IP: ${req.ip}`);
  next();
});
// ------------------------------------------------------------------------


// 2. MONTAR TODAS LAS RUTAS DE LA API (Punto clave)

// Rutas base:
app.use('/api/auth', authRoutes); // /api/auth/login

// Rutas de Posts y Comentarios:
// Nota: postsRoutes y commentsRoutes contienen rutas que ya empiezan
// con /posts, /search, /comments, etc., por eso se montan en '/api'
app.use('/api', postsRoutes);      
app.use('/api', commentsRoutes);

// Rutas NUEVAS:
app.use('/api/admin', adminRoutes);   // Monta las rutas de admin en /api/admin/
app.use('/api', categoryRoutes);      // Monta las rutas de categoría en /api/categories

// ------------------------------------------------------------------------

// ... (El resto de tu código de Documentación, Página de inicio y Manejo de errores se mantiene igual) ...

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API de Blog ejecutándose en http://localhost:${PORT}`);
  console.log(`📖 Documentación: http://localhost:${PORT}/api/docs`);
  console.log(`🔧 Interfaz web: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Cerrando servidor...');
  process.exit(0);
});