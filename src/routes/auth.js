// src/routes/auth.js
const express = require('express');
const router = express.Router();
// Asumimos un controlador para la lógica de autenticación
// const authController = require('../controllers/authController'); 

// Ruta de Login
// Aquí se debería validar con express-validator, usar el controlador, etc.
router.post('/login', (req, res) => {
    // Lógica real de login (validación, búsqueda de usuario, generación de JWT)
    // El controlador se encargaría de esto.
    
    // Simulación de respuesta exitosa
    if (req.body.username === 'admin' && req.body.password === 'admin123') {
        const token = 'admin_jwt_token_simulado'; // Generar JWT real
        return res.status(200).json({ 
            token: token, 
            user: { username: 'admin', role: 'admin' }
        });
    }

    if (req.body.username === 'autor' && req.body.password === 'autor123') {
        const token = 'autor_jwt_token_simulado'; // Generar JWT real
        return res.status(200).json({ 
            token: token, 
            user: { username: 'autor', role: 'author' }
        });
    }

    res.status(401).json({ error: 'Credenciales inválidas' });
});

// Ruta de Registro (opcional)
// router.post('/register', authController.register);

module.exports = router;