// src/controllers/commentsController.js
// Lógica simulada de base de datos
const comments = []; 
let commentIdCounter = 1;

exports.getCommentsByPost = (req, res) => {
    const postId = parseInt(req.params.postId);
    const postComments = comments.filter(c => c.postId === postId);
    res.status(200).json(postComments);
};

exports.createComment = (req, res) => {
    const postId = parseInt(req.params.postId);
    const newComment = {
        id: commentIdCounter++,
        postId: postId,
        contenido: req.body.contenido,
        autor: req.body.autor || 'Anónimo', 
        fecha: new Date().toISOString()
    };
    comments.push(newComment);
    res.status(201).json(newComment);
};


// src/controllers/commentsController.js (Extensión)
const emailService = require('../utils/emailService');

exports.approveComment = async (req, res) => {
    // 1. Simulación: Encontrar y marcar el comentario como aprobado en la DB
    const commentId = parseInt(req.params.id);
    const postTitle = 'Título del Post Afectado'; // Obtener de la DB
    const commentAuthorEmail = 'usuario@ejemplo.com'; // Obtener de la DB
    
    // 2. Notificación
    emailService.sendCommentApprovedNotification(postTitle, commentAuthorEmail);

    res.status(200).json({ 
        message: `Comentario ${commentId} aprobado y notificación enviada.`
    });
};