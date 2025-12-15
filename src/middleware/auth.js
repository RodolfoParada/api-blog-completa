// src/middleware/auth.js
const jwt = require('jsonwebtoken');

// Clave secreta (DEBE estar en variables de entorno, p.ej. process.env.JWT_SECRET)
const JWT_SECRET = 'mi_clave_secreta_super_segura'; 

exports.verifyToken = (req, res, next) => {
    // 1. Obtener el token del header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Verificar y decodificar el token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 3. Adjuntar la información del usuario a la petición
        req.user = decoded; 
        
        // 4. Continuar al siguiente middleware/controlador
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }
        // Token inválido (formato incorrecto, firma no válida, etc.)
        res.status(401).json({ error: 'Token inválido' });
    }
};

// Opcional: Middleware para verificar roles
exports.checkRole = (allowedRoles) => (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Permiso denegado' });
    }
    next();
};