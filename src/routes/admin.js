// src/routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

// Middleware para verificar rol de administrador (simulado)
const onlyAdmin = (req, res, next) => {
    // Si la autenticación es real, aquí se verifica el campo 'role' en req.user
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.status(403).json({ error: 'Acceso solo para administradores.' });
};

// GET /api/admin/stats (Requiere Auth y Rol Admin)
// router.get('/admin/stats', authMiddleware.verifyToken, onlyAdmin, adminController.getStats);
// Ruta de estadísticas simulada
router.get('/stats', (req, res) => {
    // Aquí iría el authMiddleware.verifyToken y checkRole
    res.json({ message: "Dashboard Stats (Requiere Auth)", totalPosts: 50 });
});



module.exports = router;