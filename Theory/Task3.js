// Task 3: API de Posts (9 minutos)
// Implementar el CRUD completo para posts del blog.

// Controlador de Posts
// controllers/postsController.js
const { v4: uuidv4 } = require('uuid');

// Base de datos simulada
let posts = [
  {
    id: uuidv4(),
    titulo: 'Bienvenido al Blog',
    contenido: 'Este es el primer post de nuestro blog...',
    autor: 'admin',
    etiquetas: ['bienvenida', 'blog'],
    estado: 'publicado',
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
    visitas: 0
  }
];

// Obtener todos los posts
async function getPosts(req, res) {
  try {
    let resultados = [...posts];
    const {
      autor,
      estado,
      etiqueta,
      busqueda,
      ordenar = 'fechaCreacion',
      pagina = 1,
      limite = 10
    } = req.query;

    // Filtros
    if (autor) {
      resultados = resultados.filter(p => p.autor === autor);
    }

    if (estado) {
      resultados = resultados.filter(p => p.estado === estado);
    }

    if (etiqueta) {
      resultados = resultados.filter(p =>
        p.etiquetas.includes(etiqueta)
      );
    }

    // Búsqueda
    if (busqueda) {
      const termino = busqueda.toLowerCase();
      resultados = resultados.filter(p =>
        p.titulo.toLowerCase().includes(termino) ||
        p.contenido.toLowerCase().includes(termino)
      );
    }

    // Ordenamiento
    resultados.sort((a, b) => {
      switch (ordenar) {
        case 'titulo':
          return a.titulo.localeCompare(b.titulo);
        case 'visitas':
          return b.visitas - a.visitas;
        case 'fechaCreacion':
        default:
          return new Date(b.fechaCreacion) - new Date(a.fechaCreacion);
      }
    });

    // Paginación
    const paginaNum = parseInt(pagina);
    const limiteNum = parseInt(limite);
    const inicio = (paginaNum - 1) * limiteNum;
    const paginados = resultados.slice(inicio, inicio + limiteNum);

    res.json({
      posts: paginados,
      meta: {
        total: resultados.length,
        pagina: paginaNum,
        limite: limiteNum,
        paginasTotal: Math.ceil(resultados.length / limiteNum)
      },
      filtros: req.query
    });

  } catch (error) {
    console.error('Error obteniendo posts:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
}

// Obtener post por ID
async function getPostById(req, res) {
  try {
    const { id } = req.params;
    const post = posts.find(p => p.id === id);

    if (!post) {
      return res.status(404).json({
        error: 'Post no encontrado'
      });
    }

    // Incrementar visitas
    post.visitas += 1;

    res.json(post);

  } catch (error) {
    console.error('Error obteniendo post:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
}

// Crear nuevo post
async function createPost(req, res) {
  try {
    const { titulo, contenido, etiquetas, estado } = req.body;
    const autor = req.user.username;

    const nuevoPost = {
      id: uuidv4(),
      titulo: titulo.trim(),
      contenido: contenido.trim(),
      autor,
      etiquetas: etiquetas || [],
      estado: estado || 'borrador',
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
      visitas: 0
    };

    posts.push(nuevoPost);

    res.status(201).json({
      message: 'Post creado exitosamente',
      post: nuevoPost
    });

  } catch (error) {
    console.error('Error creando post:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
}

// Actualizar post
async function updatePost(req, res) {
  try {
    const { id } = req.params;
    const post = posts.find(p => p.id === id);

    if (!post) {
      return res.status(404).json({
        error: 'Post no encontrado'
      });
    }

    // Verificar permisos (solo autor o admin pueden editar)
    if (post.autor !== req.user.username && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'No tienes permisos para editar este post'
      });
    }

    const { titulo, contenido, etiquetas, estado } = req.body;

    // Actualizar campos
    if (titulo) post.titulo = titulo.trim();
    if (contenido) post.contenido = contenido.trim();
    if (etiquetas) post.etiquetas = etiquetas;
    if (estado) post.estado = estado;

    post.fechaActualizacion = new Date().toISOString();

    res.json({
      message: 'Post actualizado exitosamente',
      post
    });

  } catch (error) {
    console.error('Error actualizando post:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
}

// Eliminar post
async function deletePost(req, res) {
  try {
    const { id } = req.params;
    const indice = posts.findIndex(p => p.id === id);

    if (indice === -1) {
      return res.status(404).json({
        error: 'Post no encontrado'
      });
    }

    const post = posts[indice];

    // Verificar permisos
    if (post.autor !== req.user.username && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'No tienes permisos para eliminar este post'
      });
    }

    posts.splice(indice, 1);

    res.json({
      message: 'Post eliminado exitosamente',
      post
    });

  } catch (error) {
    console.error('Error eliminando post:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
}

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};
// Rutas de Posts
// routes/posts.js
const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postsController');

const router = express.Router();

// Middleware de validación para errores
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

// GET /posts - Listar posts (público)
router.get('/',
  [
    query('pagina').optional().isInt({ min: 1 }).withMessage('Página debe ser un número positivo'),
    query('limite').optional().isInt({ min: 1, max: 100 }).withMessage('Límite debe estar entre 1 y 100'),
    query('ordenar').optional().isIn(['titulo', 'visitas', 'fechaCreacion']).withMessage('Ordenamiento inválido')
  ],
  validarErrores,
  getPosts
);

// GET /posts/:id - Obtener post específico (público)
router.get('/:id',
  param('id').isUUID().withMessage('ID debe ser un UUID válido'),
  validarErrores,
  getPostById
);

// POST /posts - Crear post (requiere autenticación)
router.post('/',
  authenticate,
  authorize('author', 'admin'),
  [
    body('titulo').trim().isLength({ min: 3, max: 200 }).withMessage('Título debe tener entre 3 y 200 caracteres'),
    body('contenido').trim().isLength({ min: 10 }).withMessage('Contenido debe tener al menos 10 caracteres'),
    body('etiquetas').optional().isArray({ max: 10 }).withMessage('Máximo 10 etiquetas'),
    body('estado').optional().isIn(['borrador', 'publicado', 'archivado']).withMessage('Estado inválido')
  ],
  validarErrores,
  createPost
);

// PUT /posts/:id - Actualizar post (requiere autenticación y permisos)
router.put('/:id',
  authenticate,
  authorize('author', 'admin'),
  [
    param('id').isUUID().withMessage('ID debe ser un UUID válido'),
    body('titulo').optional().trim().isLength({ min: 3, max: 200 }).withMessage('Título debe tener entre 3 y 200 caracteres'),
    body('contenido').optional().trim().isLength({ min: 10 }).withMessage('Contenido debe tener al menos 10 caracteres'),
    body('etiquetas').optional().isArray({ max: 10 }).withMessage('Máximo 10 etiquetas'),
    body('estado').optional().isIn(['borrador', 'publicado', 'archivado']).withMessage('Estado inválido')
  ],
  validarErrores,
  updatePost
);

// DELETE /posts/:id - Eliminar post (requiere autenticación y permisos)
router.delete('/:id',
  authenticate,
  authorize('author', 'admin'),
  param('id').isUUID().withMessage('ID debe ser un UUID válido'),
  validarErrores,
  deletePost
);

module.exports = router;