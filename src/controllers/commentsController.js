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