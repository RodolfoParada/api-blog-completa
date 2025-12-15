// src/routes/categories.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Ejemplo de un nuevo controlador para categorías
router.post('/categories', authMiddleware.verifyToken, (req, res) => {
    // Lógica para crear categoría (solo admin)
    res.status(201).json({ message: 'Categoría creada' });
}); 

router.get('/categories', (req, res) => {
    // Lógica para listar categorías
  res.status(201).json({ message: "Categoría creada (Requiere Auth)" });
});

module.exports = router;