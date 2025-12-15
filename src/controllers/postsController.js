// src/controllers/postsController.js
// Lógica simulada de base de datos
const posts = []; 
let postIdCounter = 1;

exports.getAllPosts = (req, res) => {
    // Lógica de paginación y filtrado (e.g., req.query.pagina, req.query.limite)
    res.status(200).json({
        posts: posts,
        meta: { total: posts.length }
    });
};

exports.getPostById = (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) {
        return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.status(200).json(post);
};

exports.createPost = (req, res) => {
    // req.user viene del middleware auth
    const newPost = {
        id: postIdCounter++,
        titulo: req.body.titulo,
        contenido: req.body.contenido,
        autor: req.user ? req.user.username : 'desconocido', // El autor se obtiene del token
        fecha: new Date().toISOString(),
        etiquetas: req.body.etiquetas || []
    };
    posts.push(newPost);
    res.status(201).json(newPost);
};

exports.updatePost = (req, res) => {
    // Lógica para verificar que el usuario es el autor o admin antes de actualizar
    const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (postIndex === -1) {
        return res.status(404).json({ error: 'Post no encontrado' });
    }
    posts[postIndex] = { ...posts[postIndex], ...req.body };
    res.status(200).json(posts[postIndex]);
};

exports.deletePost = (req, res) => {
    // Lógica para verificar que el usuario es el autor o admin antes de eliminar
    const initialLength = posts.length;
    posts = posts.filter(p => p.id !== parseInt(req.params.id));
    if (posts.length === initialLength) {
        return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.status(204).send(); // Sin contenido en la respuesta de éxito
};