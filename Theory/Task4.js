// Task 4: API de Comentarios (6 minutos)
// Implementar gestión de comentarios para posts.

// Controlador de Comentarios
// controllers/commentsController.js
const { v4: uuidv4 } = require('uuid');

// Base de datos simulada
let comments = [
  {
    id: uuidv4(),
    postId: posts[0].id, // Referencia al primer post
    autor: 'Usuario Anónimo',
    email: 'usuario@example.com',
    contenido: 'Excelente primer post!',
    estado: 'aprobado',
    fechaCreacion: new Date().toISOString()
  }
];

// Obtener comentarios de un post
async function getCommentsByPost(req, res) {
  try {
    const { postId } = req.params;
    const { estado, pagina = 1, limite = 10 } = req.query;

    // Verificar que el post existe
    const postExists = posts.some(p => p.id === postId);
    if (!postExists) {
      return res.status(404).json({
        error: 'Post no encontrado'
      });
    }

    let resultados = comments.filter(c => c.postId === postId);

    // Filtrar por estado
    if (estado) {
      resultados = resultados.filter(c => c.estado === estado);
    }

    // Ordenar por fecha (más recientes primero)
    resultados.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));

    // Paginación
    const paginaNum = parseInt(pagina);
    const limiteNum = parseInt(limite);
    const inicio = (paginaNum - 1) * limiteNum;
    const paginados = resultados.slice(inicio, inicio + limiteNum);

    res.json({
      comments: paginados,
      meta: {
        total: resultados.length,
        pagina: paginaNum,
        limite: limiteNum,
        paginasTotal: Math.ceil(resultados.length / limiteNum)
      }
    });

  } catch (error) {
    console.error('Error obteniendo comentarios:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
}

// Crear comentario
async function createComment(req, res) {
  try {
    const { postId } = req.params;
    const { autor, email, contenido } = req.body;

    // Verificar que el post existe
    const postExists = posts.some(p => p.id === postId);
    if (!postExists) {
      return res.status(404).json({
        error: 'Post no encontrado'
      });
    }

    const nuevoComment = {
      id: uuidv4(),
      postId,
      autor: autor.trim(),
      email: email ? email.trim() : null,
      contenido: contenido.trim(),
      estado: 'pendiente', // Comentarios nuevos necesitan aprobación
      fechaCreacion: new Date().toISOString()
    };

    comments.push(nuevoComment);

    res.status(201).json({
      message: 'Comentario enviado exitosamente',
      comment: nuevoComment
    });

  } catch (error) {
    console.error('Error creando comentario:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
}

// Actualizar estado de comentario (solo admin)
async function updateCommentStatus(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const comment = comments.find(c => c.id === id);

    if (!comment) {
      return res.status(404).json({
        error: 'Comentario no encontrado'
      });
    }

    // Validar estado
    const estadosValidos = ['pendiente', 'aprobado', 'rechazado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        error: 'Estado inválido',
        estadosValidos
      });
    }

    comment.estado = estado;

    res.json({
      message: 'Estado del comentario actualizado',
      comment
    });

  } catch (error) {
    console.error('Error actualizando comentario:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
}

// Eliminar comentario (solo admin)
async function deleteComment(req, res) {
  try {
    const { id } = req.params;
    const indice = comments.findIndex(c => c.id === id);

    if (indice === -1) {
      return res.status(404).json({
        error: 'Comentario no encontrado'
      });
    }

    const commentEliminado = comments.splice(indice, 1)[0];

    res.json({
      message: 'Comentario eliminado exitosamente',
      comment: commentEliminado
    });

  } catch (error) {
    console.error('Error eliminando comentario:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
}

module.exports = {
  getCommentsByPost,
  createComment,
  updateCommentStatus,
  deleteComment
};
// Rutas de Comentarios
// routes/comments.js
const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getCommentsByPost,
  createComment,
  updateCommentStatus,
  deleteComment
} = require('../controllers/commentsController');

const router = express.Router();

// Middleware de validación
const validarErrores = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Datos de entrada inválidos',
      details: errors.array()
    });
  }
  next();
};

// GET /posts/:postId/comments - Obtener comentarios de un post (público)
router.get('/posts/:postId/comments',
  [
    param('postId').isUUID().withMessage('ID de post debe ser un UUID válido'),
    query('estado').optional().isIn(['pendiente', 'aprobado', 'rechazado']).withMessage('Estado inválido'),
    query('pagina').optional().isInt({ min: 1 }).withMessage('Página debe ser un número positivo'),
    query('limite').optional().isInt({ min: 1, max: 50 }).withMessage('Límite debe estar entre 1 y 50')
  ],
  validarErrores,
  getCommentsByPost
);

// POST /posts/:postId/comments - Crear comentario (público, pero con rate limiting)
router.post('/posts/:postId/comments',
  [
    param('postId').isUUID().withMessage('ID de post debe ser un UUID válido'),
    body('autor').trim().isLength({ min: 2, max: 50 }).withMessage('Autor debe tener entre 2 y 50 caracteres'),
    body('email').optional().isEmail().normalizeEmail().withMessage('Email inválido'),
    body('contenido').trim().isLength({ min: 10, max: 1000 }).withMessage('Contenido debe tener entre 10 y 1000 caracteres')
  ],
  validarErrores,
  createComment
);

// PUT /comments/:id/status - Actualizar estado de comentario (solo admin)
router.put('/comments/:id/status',
  authenticate,
  authorize('admin'),
  [
    param('id').isUUID().withMessage('ID de comentario debe ser un UUID válido'),
    body('estado').isIn(['pendiente', 'aprobado', 'rechazado']).withMessage('Estado inválido')
  ],
  validarErrores,
  updateCommentStatus
);

// DELETE /comments/:id - Eliminar comentario (solo admin)
router.delete('/comments/:id',
  authenticate,
  authorize('admin'),
  param('id').isUUID().withMessage('ID de comentario debe ser un UUID válido'),
  validarErrores,
  deleteComment
);

module.exports = router;