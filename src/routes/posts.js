// src/routes/posts.js
const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController'); 
const authMiddleware = require('../middleware/auth'); // Middleware de autenticación

// GET /api/posts - Listar posts (Público)
router.get('/posts', postsController.getAllPosts);

// GET /api/posts/:id - Obtener post (Público)
router.get('/posts/:id', postsController.getPostById);

// POST /api/posts - Crear post (Requiere Auth)
// Usar authMiddleware.verifyToken y, posiblemente, un middleware de rol.
router.post('/posts', authMiddleware.verifyToken, postsController.createPost);

// PUT /api/posts/:id - Actualizar post (Requiere Auth)
router.put('/posts/:id', authMiddleware.verifyToken, postsController.updatePost);

// DELETE /api/posts/:id - Eliminar post (Requiere Auth)
router.delete('/posts/:id', authMiddleware.verifyToken, postsController.deletePost);

// Nueva ruta para búsqueda avanzada
router.get('/search', async (req, res, next) => {
    try {
        const searchService = require('../utils/searchService');
        const results = await searchService.search(req.query);
        res.json({ results });
    } catch (error) {
        next(error);
    }
});

module.exports = router;