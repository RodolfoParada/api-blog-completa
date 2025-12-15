// src/routes/comments.js
const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController'); 
// No se necesita authMiddleware para crear/listar comentarios en el ejemplo original

// GET /api/posts/:postId/comments - Obtener comentarios de un post (Público)
// Nota: La ruta es /posts/:postId/comments, pero se monta en /api/
router.get('/posts/:postId/comments', commentsController.getCommentsByPost);

// POST /api/posts/:postId/comments - Crear comentario (Público)
router.post('/posts/:postId/comments', commentsController.createComment);

// Opcional: Eliminar comentario (Requeriría Auth y verificación de autor/admin)
// router.delete('/comments/:id', authMiddleware.verifyToken, commentsController.deleteComment);

module.exports = router;